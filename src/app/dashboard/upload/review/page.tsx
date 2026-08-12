"use client";

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconPackage,
  IconReceipt,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createMultipleProductsAction } from "@/lib/actions/products";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Electronics",
  "Appliances",
  "Home & Kitchen",
  "Vehicles",
  "Fitness",
  "Tools",
  "Other",
];

interface ExtractedItemState {
  id: string;
  selected: boolean;
  isCollapsed: boolean;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
  store: string;
  purchasePrice: string;
  warrantyMonths: number;
  notes: string;
  fieldStatus: Record<string, "extracted" | "defaulted">;
  errors: Record<string, string>;
}

export default function DashboardUploadReviewPage() {
  const router = useRouter();
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [items, setItems] = useState<ExtractedItemState[]>([]);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("vaultly_extracted_receipt");
      if (!storedData) {
        toast.error("No extracted receipt data found. Please upload a receipt.");
        router.push("/dashboard/upload");
        return;
      }

      const parsed = JSON.parse(storedData);
      const url = parsed.receiptUrl || null;
      setReceiptUrl(url);

      const rawProducts: any[] = Array.isArray(parsed.extractedProducts) && parsed.extractedProducts.length > 0
        ? parsed.extractedProducts
        : (parsed.extractedData ? [parsed.extractedData] : []);

      const rawStatuses: any[] = Array.isArray(parsed.fieldStatusList) && parsed.fieldStatusList.length > 0
        ? parsed.fieldStatusList
        : (parsed.fieldStatus ? [parsed.fieldStatus] : []);

      const initializedItems: ExtractedItemState[] = rawProducts.map((p, index) => {
        const status = rawStatuses[index] || {};
        return {
          id: `item_${index}_${Date.now()}`,
          selected: true,
          isCollapsed: false,
          name: p.name || "",
          brand: p.brand || "",
          category: p.category || "Electronics",
          purchaseDate: p.purchaseDate || new Date().toISOString().split("T")[0],
          store: p.store || "",
          purchasePrice: p.purchasePrice !== null && p.purchasePrice !== undefined ? String(p.purchasePrice) : "",
          warrantyMonths: typeof p.warrantyMonths === "number" ? p.warrantyMonths : 12,
          notes: p.notes || "",
          fieldStatus: status,
          errors: {},
        };
      });

      if (initializedItems.length === 0) {
        toast.error("No valid products detected. Please upload again.");
        router.push("/dashboard/upload");
        return;
      }

      setItems(initializedItems);
    } catch (err) {
      console.error(err);
      toast.error("Error loading extracted receipt data.");
      router.push("/dashboard/upload");
    } finally {
      setIsLoadingStorage(false);
    }
  }, [router]);

  const updateItemField = (id: string, field: keyof ExtractedItemState, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (updated.errors[field as string]) {
          const newErrors = { ...updated.errors };
          delete newErrors[field as string];
          updated.errors = newErrors;
        }
        return updated;
      })
    );
  };

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleCollapse = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCollapsed: !item.isCollapsed } : item))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const onSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedItems = items.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one product to save.");
      return;
    }

    // Validate all selected items
    let hasValidationError = false;
    const validatedPayloads: ProductFormValues[] = [];

    const updatedItems = items.map((item) => {
      if (!item.selected) return item;

      const priceNum = item.purchasePrice !== "" ? parseFloat(item.purchasePrice) : undefined;
      const rawForm: ProductFormValues = {
        name: item.name,
        brand: item.brand,
        category: item.category,
        purchaseDate: item.purchaseDate,
        warrantyMonths: Number(item.warrantyMonths) || 12,
        store: item.store,
        notes: item.notes,
        purchasePrice: priceNum !== undefined && !isNaN(priceNum) ? priceNum : undefined,
        receiptUrl: receiptUrl || "",
      };

      const result = productSchema.safeParse(rawForm);
      if (!result.success) {
        hasValidationError = true;
        const itemErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            itemErrors[String(issue.path[0])] = issue.message;
          }
        });
        return { ...item, errors: itemErrors, isCollapsed: false };
      }

      validatedPayloads.push(result.data);
      return { ...item, errors: {} };
    });

    setItems(updatedItems);

    if (hasValidationError) {
      toast.error("Please resolve the validation errors indicated below.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createMultipleProductsAction(validatedPayloads);
      const savedCount = res.count || validatedPayloads.length;

      toast.success(`${savedCount} product${savedCount > 1 ? "s" : ""} saved from this receipt.`);
      sessionStorage.removeItem("vaultly_extracted_receipt");

      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save products",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBadge = (item: ExtractedItemState, fieldName: string) => {
    const status = item.fieldStatus[fieldName];
    if (status === "extracted") {
      return (
        <span className="inline-flex items-center gap-xs rounded-pill bg-primary-pale px-sm py-xxs text-caption text-ink font-semibold">
          <IconCheck size={12} stroke={2.5} className="text-primary-active" />
          AI-extracted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-xs rounded-pill bg-status-expiring-pale px-sm py-xxs text-caption text-status-expiring font-semibold">
        <IconAlertTriangle size={12} stroke={2} />
        Needs review
      </span>
    );
  };

  if (isLoadingStorage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-body-md text-mute">Loading extracted details…</p>
      </div>
    );
  }

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="w-full space-y-xl max-w-4xl pb-28">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-xs text-body-sm text-mute hover:text-ink transition-colors mb-md"
        >
          <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
          Upload another receipt
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-md">
          <div>
            <div className="flex items-center gap-md">
              <h1 className="text-display-sm text-ink">Review Extracted Products</h1>
              <span className="inline-flex items-center gap-xs rounded-pill bg-primary-pale px-md py-xs text-body-sm font-semibold text-ink">
                <IconSparkles size={16} className="text-primary-active" />
                {items.length} {items.length === 1 ? "Item" : "Items"} Detected
              </span>
            </div>
            <p className="mt-xs text-body-md text-body">
              Vaultly AI detected line items from your receipt. Uncheck any item you don&apos;t wish to save, or edit details directly.
            </p>
          </div>

          {items.length > 1 && (
            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={() => toggleSelectAll(true)}
                className="text-body-sm text-primary hover:underline font-medium"
              >
                Select All
              </button>
              <span className="text-mute">•</span>
              <button
                type="button"
                onClick={() => toggleSelectAll(false)}
                className="text-body-sm text-mute hover:text-ink font-medium"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Document Preview Card */}
      {receiptUrl && (
        <div className="card-content border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-md bg-surface-muted">
          <div className="flex items-center gap-md">
            <div className="flex size-12 items-center justify-center rounded-xl bg-canvas border border-border text-ink shrink-0">
              <IconReceipt size={28} stroke={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-body-md-strong text-ink">Attached Receipt Image</p>
              <p className="text-body-sm text-mute truncate max-w-xs md:max-w-md">
                {receiptUrl}
              </p>
            </div>
          </div>

          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0"
          >
            <Button variant="secondary">
              <IconExternalLink size={18} stroke={2} aria-hidden="true" />
              View Original Receipt
            </Button>
          </a>
        </div>
      )}

      {/* Items List */}
      <form onSubmit={onSubmitAll} className="space-y-lg">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`card-content border transition-colors ${
              item.selected
                ? "border-border bg-canvas"
                : "border-border/60 bg-surface-muted/50 opacity-75"
            }`}
          >
            {/* Item Card Header Bar */}
            <div className="flex items-center justify-between gap-md pb-md border-b border-border mb-lg">
              <div className="flex items-center gap-md min-w-0">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  id={`select_${item.id}`}
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                  className="size-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-sm flex-wrap">
                    <label
                      htmlFor={`select_${item.id}`}
                      className="text-body-md-strong text-ink cursor-pointer truncate"
                    >
                      {item.name || `Item #${index + 1}`}
                    </label>

                    {item.selected ? (
                      <span className="inline-flex items-center gap-xxs rounded-pill bg-primary-pale px-xs py-xxs text-caption text-ink font-semibold">
                        <IconCheck size={12} stroke={2.5} className="text-primary-active" />
                        Will save
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-xxs rounded-pill bg-surface-muted px-xs py-xxs text-caption text-mute font-semibold">
                        Skipped
                      </span>
                    )}
                  </div>

                  <p className="text-body-sm text-mute">
                    {item.purchasePrice ? `$${item.purchasePrice}` : "Price N/A"}{" "}
                    {item.store ? `• ${item.store}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-xs shrink-0">
                <button
                  type="button"
                  onClick={() => toggleCollapse(item.id)}
                  className="p-xs text-mute hover:text-ink rounded-lg transition-colors"
                  aria-label={item.isCollapsed ? "Expand details" : "Collapse details"}
                >
                  {item.isCollapsed ? (
                    <IconChevronDown size={20} />
                  ) : (
                    <IconChevronUp size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Editable Form Content */}
            {!item.isCollapsed && (
              <div className="space-y-xl">
                {/* ── Section 1: Product Details ──────────────────────────────── */}
                <div>
                  <h3 className="text-body-md-strong text-ink mb-md flex items-center gap-xs">
                    <IconPackage size={18} className="text-primary" />
                    Product Details
                  </h3>

                  <div className="grid gap-lg md:grid-cols-2">
                    {/* Name */}
                    <div className="flex flex-col gap-xs md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`name_${item.id}`} className="text-body-sm-strong text-ink">
                          Product Name <span className="text-status-expired">*</span>
                        </label>
                        {renderBadge(item, "name")}
                      </div>
                      <input
                        id={`name_${item.id}`}
                        type="text"
                        disabled={!item.selected}
                        value={item.name}
                        onChange={(e) => updateItemField(item.id, "name", e.target.value)}
                        placeholder="e.g. AirPods Pro (2nd generation)"
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                      {item.errors.name && (
                        <p className="text-body-sm text-status-expired mt-xxs">
                          {item.errors.name}
                        </p>
                      )}
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`brand_${item.id}`} className="text-body-sm-strong text-ink">
                          Brand / Manufacturer
                        </label>
                        {renderBadge(item, "brand")}
                      </div>
                      <input
                        id={`brand_${item.id}`}
                        type="text"
                        disabled={!item.selected}
                        value={item.brand}
                        onChange={(e) => updateItemField(item.id, "brand", e.target.value)}
                        placeholder="e.g. Apple"
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`category_${item.id}`} className="text-body-sm-strong text-ink">
                          Category
                        </label>
                        {renderBadge(item, "category")}
                      </div>
                      <select
                        id={`category_${item.id}`}
                        disabled={!item.selected}
                        value={item.category}
                        onChange={(e) => updateItemField(item.id, "category", e.target.value)}
                        className="text-input w-full bg-canvas cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Purchase Information ────────────────────────── */}
                <div className="pt-md border-t border-border/60">
                  <h3 className="text-body-md-strong text-ink mb-md">Purchase Information</h3>

                  <div className="grid gap-lg md:grid-cols-3">
                    {/* Purchase Date */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`purchaseDate_${item.id}`} className="text-body-sm-strong text-ink">
                          Purchase Date <span className="text-status-expired">*</span>
                        </label>
                        {renderBadge(item, "purchaseDate")}
                      </div>
                      <input
                        id={`purchaseDate_${item.id}`}
                        type="date"
                        disabled={!item.selected}
                        value={item.purchaseDate}
                        onChange={(e) => updateItemField(item.id, "purchaseDate", e.target.value)}
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                      {item.errors.purchaseDate && (
                        <p className="text-body-sm text-status-expired mt-xxs">
                          {item.errors.purchaseDate}
                        </p>
                      )}
                    </div>

                    {/* Store */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`store_${item.id}`} className="text-body-sm-strong text-ink">
                          Store / Retailer
                        </label>
                        {renderBadge(item, "store")}
                      </div>
                      <input
                        id={`store_${item.id}`}
                        type="text"
                        disabled={!item.selected}
                        value={item.store}
                        onChange={(e) => updateItemField(item.id, "store", e.target.value)}
                        placeholder="e.g. Apple Store, Amazon"
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>

                    {/* Purchase Price */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`purchasePrice_${item.id}`} className="text-body-sm-strong text-ink">
                          Purchase Price ($)
                        </label>
                        {renderBadge(item, "purchasePrice")}
                      </div>
                      <input
                        id={`purchasePrice_${item.id}`}
                        type="number"
                        step="0.01"
                        disabled={!item.selected}
                        value={item.purchasePrice}
                        onChange={(e) => updateItemField(item.id, "purchasePrice", e.target.value)}
                        placeholder="e.g. 249.00"
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Warranty & Notes ─────────────────────────────── */}
                <div className="pt-md border-t border-border/60">
                  <h3 className="text-body-md-strong text-ink mb-md">Warranty & Notes</h3>

                  <div className="grid gap-lg md:grid-cols-2">
                    {/* Warranty Months */}
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`warrantyMonths_${item.id}`} className="text-body-sm-strong text-ink">
                          Warranty Duration (Months) <span className="text-status-expired">*</span>
                        </label>
                        {renderBadge(item, "warrantyMonths")}
                      </div>
                      <input
                        id={`warrantyMonths_${item.id}`}
                        type="number"
                        min="0"
                        disabled={!item.selected}
                        value={item.warrantyMonths}
                        onChange={(e) => updateItemField(item.id, "warrantyMonths", parseInt(e.target.value) || 0)}
                        placeholder="e.g. 12 or 24"
                        className="text-input w-full focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                      {item.errors.warrantyMonths && (
                        <p className="text-body-sm text-status-expired mt-xxs">
                          {item.errors.warrantyMonths}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-xs md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`notes_${item.id}`} className="text-body-sm-strong text-ink">
                          Notes & Serial Numbers
                        </label>
                        {renderBadge(item, "notes")}
                      </div>
                      <textarea
                        id={`notes_${item.id}`}
                        rows={2}
                        disabled={!item.selected}
                        value={item.notes}
                        onChange={(e) => updateItemField(item.id, "notes", e.target.value)}
                        placeholder="e.g. Serial # C02X12345678"
                        className="text-input w-full resize-y focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Sticky Save Bar ─────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-[240px] right-0 z-30 flex items-center justify-between border-t border-border bg-canvas/95 px-xl py-lg backdrop-blur-md">
          <Link href="/dashboard/upload">
            <Button variant="tertiary">Cancel / Re-upload</Button>
          </Link>

          <div className="flex items-center gap-md">
            <span className="text-body-sm text-mute font-medium hidden sm:inline">
              {selectedCount} of {items.length} items selected
            </span>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || selectedCount === 0}
            >
              <IconCheck size={18} stroke={2} aria-hidden="true" />
              {isSubmitting
                ? "Saving products…"
                : `Confirm & Save ${selectedCount} ${selectedCount === 1 ? "Product" : "Products"}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

