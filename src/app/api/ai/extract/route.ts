import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Rate limiting configuration & tiered hook
export const DAILY_EXTRACTION_LIMIT = 20;
export const RATE_LIMIT_WINDOW_HOURS = 24;

/**
 * Hook to retrieve extraction quota per user.
 * Can be extended in the future for tiered subscriptions (e.g. Free: 20, Pro: 100).
 */
export async function getUserDailyExtractionLimit(userId: string): Promise<number> {
  return DAILY_EXTRACTION_LIMIT;
}

// Single source of truth for Gemini model configuration
const GEMINI_MODEL_NAME = "gemini-3.5-flash";

function parsePriceNumber(val: any): number | null {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  return null;
}

function parseFormattedDate(val: any): string | null {
  if (typeof val !== "string" || !val.trim()) return null;
  const str = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl, base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json(
        { error: "base64Data and mimeType are required" },
        { status: 400 },
      );
    }

    // Step 0: Check rate limit BEFORE calling Gemini API
    const userLimit = await getUserDailyExtractionLimit(userId);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000);

    const [recentAttemptsCount, oldestAttemptInWindow] = await Promise.all([
      prisma.extractionAttempt.count({
        where: {
          userId,
          createdAt: { gte: windowStart },
        },
      }),
      prisma.extractionAttempt.findFirst({
        where: {
          userId,
          createdAt: { gte: windowStart },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      }),
    ]);

    if (recentAttemptsCount >= userLimit) {
      const retryAt = oldestAttemptInWindow
        ? new Date(oldestAttemptInWindow.createdAt.getTime() + RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

      return NextResponse.json(
        {
          error: "rate_limited",
          errorCode: "rate_limited",
          message: `You've reached today's upload limit (${userLimit}/day). Try again tomorrow.`,
          limit: userLimit,
          currentCount: recentAttemptsCount,
          retryAt,
        },
        { status: 429 },
      );
    }

    // Record the attempt against the user's rate limit quota
    await prisma.extractionAttempt.create({
      data: { userId },
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 },
      );
    }

    const dataSizeBytes = Math.round((base64Data.length * 3) / 4);
    const dataSizeKB = (dataSizeBytes / 1024).toFixed(2);

    console.log("\n=======================================================");
    console.log("LOG POINT 1: RAW IMAGE DATA");
    console.log("=======================================================");
    console.log(`Base64 String Length : ${base64Data.length} chars`);
    console.log(`Approx Image Data Size: ${dataSizeBytes} bytes (~${dataSizeKB} KB)`);
    console.log(`Image MimeType        : ${mimeType}`);
    console.log(`GEMINI_API_KEY Present: ${!!apiKey}`);
    console.log(`Base64 Prefix (50ch) : ${base64Data.substring(0, 50)}...`);
    console.log(`Base64 Suffix (50ch) : ...${base64Data.substring(base64Data.length - 50)}`);

    const modelName = GEMINI_MODEL_NAME;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are an expert OCR and receipt data extraction system.
Analyze this purchase receipt, order invoice, or proof-of-purchase document carefully.
Read ALL visible text, store logos, headers, line items, transaction dates, totals, serial numbers, and payment details.

Identify EVERY distinct line item or product listed on the receipt (e.g., if the receipt lists 4 separate items such as "AirPods Pro", "iPhone 15 Pro", "USB-C Cable", "AppleCare+", return all 4 items as separate entries in the products array).

Extract shared receipt metadata (store name, purchase date) and individual item metadata into a valid JSON object matching this EXACT schema:
{
  "store": string | null, // Shared store/retailer name (e.g. "Apple Store", "Amazon", "Best Buy").
  "purchaseDate": string | null, // Shared date of purchase in YYYY-MM-DD format (e.g. "2026-08-12"). Convert formatted dates like "Aug 12, 2026" or "12/08/2026".
  "products": [
    {
      "name": string | null, // Specific product or item name (e.g. "iPhone 15 Pro Max 256GB", "AirPods Pro (2nd generation)", "USB-C Woven Charge Cable 1m"). Do NOT use generic terms like "Purchased Product".
      "brand": string | null, // Brand or manufacturer (e.g. "Apple", "Samsung", "Sony", "Logitech"). Infer from product or store if obvious.
      "category": "Electronics" | "Appliances" | "Home & Kitchen" | "Vehicles" | "Fitness" | "Tools" | "Other", // Best fit category
      "purchaseDate": string | null, // Item purchase date in YYYY-MM-DD format.
      "store": string | null, // Store name.
      "purchasePrice": number | null, // Line item price as a clean number/float (e.g. 249.00, 1199.00, 29.00). Strip currency symbols like $, €, £.
      "warrantyMonths": number | null, // Suggested or explicit warranty duration in months (e.g. 12 for electronics, 24/36 for AppleCare/extended warranty).
      "notes": string | null // Serial numbers, order numbers, model numbers, or receipt item notes if visible.
    }
  ]
}

CRITICAL RULES:
1. Include ALL distinct products/line items found on the receipt in the "products" array.
2. If only 1 item is on the receipt, return a "products" array with 1 item.
3. Examine line items carefully for individual names and prices.
4. Output ONLY valid JSON adhering strictly to the schema above.`;

    const inlineData = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    console.log("\n=======================================================");
    console.log("LOG POINT 2: EXACT REQUEST SENT TO GEMINI");
    console.log("=======================================================");
    console.log("Model Target:", modelName);
    console.log("Payload Structure:");
    console.log(JSON.stringify({
      prompt: prompt,
      inlineData: {
        mimeType: mimeType,
        dataLength: base64Data.length,
        dataSample: base64Data.substring(0, 40) + "...",
      }
    }, null, 2));

    let result;
    try {
      result = await model.generateContent([prompt, inlineData]);
    } catch (geminiCallErr: any) {
      console.error("\n=== GEMINI SDK GENERATE_CONTENT FAILURE ===");
      console.error("Error Name    :", geminiCallErr?.name);
      console.error("Error Message :", geminiCallErr?.message);
      console.error("Status Code   :", geminiCallErr?.status);
      console.error("Status Text   :", geminiCallErr?.statusText);
      console.error("Error Details :", geminiCallErr?.errorDetails);
      console.error("Full Error    :", geminiCallErr);
      console.error("===========================================");
      throw geminiCallErr;
    }

    const responseText = result.response.text();

    console.log("\n=======================================================");
    console.log("LOG POINT 3: RAW GEMINI RESPONSE");
    console.log("=======================================================");
    console.log("Raw Candidates Count:", result.response.candidates?.length ?? 0);
    console.log("Raw Finish Reason   :", result.response.candidates?.[0]?.finishReason);
    console.log("--- RAW RESPONSE TEXT START ---");
    console.log(responseText);
    console.log("--- RAW RESPONSE TEXT END ---");

    let parsedPayload: any = {};
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPayload = JSON.parse(jsonMatch[0]);
      } else {
        parsedPayload = JSON.parse(cleanJson);
      }
      console.log("\nPARSED JSON OBJECT:");
      console.log(JSON.stringify(parsedPayload, null, 2));
    } catch (parseErr) {
      console.error("\nJSON parsing error on Gemini response:", parseErr);
      console.error("Raw response text was:", responseText);
      parsedPayload = {};
    }

    if (!parsedPayload || Object.keys(parsedPayload).length === 0) {
      console.warn("Gemini did not return valid JSON. Raw response:", responseText);
      return NextResponse.json(
        {
          error: "Could not identify receipt structure from the uploaded image.",
          errorCode: "not_a_receipt",
          rawResponse: responseText,
        },
        { status: 422 },
      );
    }

    const sharedStore = parsedPayload?.store?.trim() || "";
    const sharedDate = parseFormattedDate(parsedPayload?.purchaseDate);

    const rawProductsList: any[] = Array.isArray(parsedPayload?.products) && parsedPayload.products.length > 0
      ? parsedPayload.products
      : (parsedPayload?.name ? [parsedPayload] : []);

    if (rawProductsList.length === 0) {
      console.warn("No products found in parsed Gemini output. Raw response:", responseText);
      return NextResponse.json(
        {
          error: "No line items or products were detected on this document.",
          errorCode: "no_items_found",
          rawResponse: responseText,
        },
        { status: 422 },
      );
    }

    const extractedProducts: any[] = [];
    const fieldStatusList: any[] = [];

    for (const rawItem of rawProductsList) {
      const parsedPrice = parsePriceNumber(rawItem?.purchasePrice);
      const parsedItemDate = parseFormattedDate(rawItem?.purchaseDate) || sharedDate;
      const storeName = rawItem?.store?.trim() || sharedStore;

      const itemData = {
        name: rawItem?.name?.trim() || "Purchased Product",
        brand: rawItem?.brand?.trim() || (storeName.toLowerCase().includes("apple") ? "Apple" : ""),
        category: rawItem?.category || "Electronics",
        purchaseDate: parsedItemDate || new Date().toISOString().split("T")[0],
        store: storeName,
        purchasePrice: parsedPrice,
        warrantyMonths:
          typeof rawItem?.warrantyMonths === "number" && rawItem.warrantyMonths >= 0
            ? rawItem.warrantyMonths
            : 12,
        notes: rawItem?.notes?.trim() || "",
      };

      const hasName = Boolean(
        rawItem?.name &&
          rawItem.name.trim() !== "" &&
          rawItem.name !== "Purchased Product",
      );
      const hasBrand = Boolean(
        rawItem?.brand && rawItem.brand.trim() !== "",
      ) || (storeName.toLowerCase().includes("apple"));
      const hasCategory = Boolean(
        rawItem?.category && rawItem.category.trim() !== "",
      );
      const hasPurchaseDate = Boolean(parsedItemDate);
      const hasStore = Boolean(storeName && storeName.trim() !== "");
      const hasPurchasePrice = parsedPrice !== null;
      const hasWarrantyMonths =
        typeof rawItem?.warrantyMonths === "number" &&
        rawItem.warrantyMonths > 0;
      const hasNotes = Boolean(
        rawItem?.notes && rawItem.notes.trim() !== "",
      );

      const fieldStatus = {
        name: hasName ? "extracted" : "defaulted",
        brand: hasBrand ? "extracted" : "defaulted",
        category: hasCategory ? "extracted" : "defaulted",
        purchaseDate: hasPurchaseDate ? "extracted" : "defaulted",
        store: hasStore ? "extracted" : "defaulted",
        purchasePrice: hasPurchasePrice ? "extracted" : "defaulted",
        warrantyMonths: hasWarrantyMonths ? "extracted" : "defaulted",
        notes: hasNotes ? "extracted" : "defaulted",
      };

      extractedProducts.push(itemData);
      fieldStatusList.push(fieldStatus);
    }

    console.log("\nFINAL EXTRACTED PRODUCTS ARRAY SENT TO CLIENT:");
    console.log(JSON.stringify({ extractedProducts, fieldStatusList }, null, 2));
    console.log("=======================================================\n");

    return NextResponse.json({
      success: true,
      extractedProducts,
      fieldStatusList,
      // Backward-compatibility fields
      extractedData: extractedProducts[0] || {},
      fieldStatus: fieldStatusList[0] || {},
      receiptUrl: fileUrl,
    });
  } catch (error: any) {
    console.error("=== CATCH HANDLER: GEMINI AI EXTRACTION ERROR ===");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.status);
    console.error("Error statusText:", error?.statusText);
    console.error("Error response:", error?.response);
    console.error("Error errorDetails:", error?.errorDetails);
    try {
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } catch (_) {
      console.error("Full error object:", error);
    }
    console.error("==================================================");

    const errorMessage = error?.message || String(error);
    const status = error?.status || 500;

    // 1. Authentication failure
    if (
      status === 401 ||
      errorMessage.includes("401") ||
      errorMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
      errorMessage.includes("API_KEY_INVALID") ||
      errorMessage.includes("invalid authentication credentials")
    ) {
      return NextResponse.json(
        {
          error: "Gemini API authentication failed. Please verify your GEMINI_API_KEY.",
          errorCode: "auth_error",
          details: errorMessage,
        },
        { status: 401 },
      );
    }

    // 2. Rate limit / Quota exceeded
    const isRateLimit =
      status === 429 ||
      errorMessage.includes("429") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("Quota") ||
      errorMessage.includes("rate limit");

    if (isRateLimit) {
      return NextResponse.json(
        {
          error: "Gemini API rate limit reached. Please wait 1 minute and try again.",
          errorCode: "rate_limit",
          isRateLimit: true,
          details: errorMessage,
        },
        { status: 429 },
      );
    }

    // 3. Model not found or unsupported
    if (
      status === 404 ||
      errorMessage.includes("404") ||
      errorMessage.includes("models/") ||
      errorMessage.includes("not found")
    ) {
      return NextResponse.json(
        {
          error: `Gemini model (${GEMINI_MODEL_NAME}) not found or unsupported.`,
          errorCode: "model_not_found",
          details: errorMessage,
        },
        { status: 500 },
      );
    }

    // 4. Content Safety Filters
    if (
      errorMessage.includes("SAFETY") ||
      errorMessage.includes("blocked") ||
      errorMessage.includes("HARM_CATEGORY")
    ) {
      return NextResponse.json(
        {
          error: "The image was blocked by AI content safety guidelines.",
          errorCode: "content_blocked",
          details: errorMessage,
        },
        { status: 422 },
      );
    }

    // 5. Default 422 with exact error details surfaced
    return NextResponse.json(
      {
        error: errorMessage.includes("Could not")
          ? errorMessage
          : `Extraction error: ${errorMessage}`,
        errorCode: "extraction_failed",
        isUnclear: true,
        details: errorMessage,
      },
      { status: 422 },
    );
  }
}
