"use client";

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconRefresh,
  IconUpload,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function DashboardUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "extracting" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;

    if (
      !selectedFile.type.startsWith("image/") &&
      selectedFile.type !== "application/pdf"
    ) {
      toast.error("Please select a valid image file (JPG, PNG, WebP) or PDF.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10 MB limit.");
      return;
    }

    setFile(selectedFile);
    setUploadStatus("uploading");
    setErrorMessage(null);
    setProgress(15);

    try {
      // Step 1: Read file as Base64 for Gemini
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      setProgress(35);

      // Step 2: Request presigned S3 URL
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to generate upload URL");
      }

      const { uploadUrl, fileUrl } = await presignedRes.json();
      setProgress(55);

      // Step 3: Direct PUT upload to AWS S3
      const s3UploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!s3UploadRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      setProgress(75);
      setUploadStatus("extracting");

      // Step 4: Call Gemini AI Extraction Route
      const extractRes = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl,
          base64Data,
          mimeType: selectedFile.type,
        }),
      });

      const extractData = await extractRes.json();

      if (!extractRes.ok || !extractData.success) {
        throw new Error(
          extractData.error || "Could not extract details from receipt",
        );
      }

      setProgress(100);
      setUploadStatus("success");

      // Store in sessionStorage for review page
      sessionStorage.setItem(
        "vaultly_extracted_receipt",
        JSON.stringify({
          extractedProducts: extractData.extractedProducts || [extractData.extractedData],
          fieldStatusList: extractData.fieldStatusList || [extractData.fieldStatus || {}],
          extractedData: extractData.extractedData,
          fieldStatus: extractData.fieldStatus || {},
          receiptUrl: fileUrl,
          fileName: selectedFile.name,
        }),
      );

      toast.success("Receipt processed! Review details below.");
      router.push("/dashboard/upload/review");
    } catch (err: any) {
      console.error(err);
      setUploadStatus("error");
      setErrorMessage(
        err?.message || "An unexpected error occurred during upload.",
      );
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* Back Button & Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-xs text-body-sm text-mute hover:text-ink transition-colors mb-md"
        >
          <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
          Back to products
        </Link>
        <h1 className="text-display-sm text-ink">Upload Receipt</h1>
        <p className="mt-xs text-body-md text-body">
          Upload a receipt or invoice. Vaultly AI reads the details, detects warranty duration, and prepares your product entry.
        </p>
      </div>

      {/* Upload Box / Card */}
      <div className="card-content border border-border p-2xl w-full min-w-0">
        {uploadStatus === "error" ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center text-center py-xl space-y-md w-full">
            <div className="flex size-16 items-center justify-center rounded-full bg-status-expired-pale text-status-expired">
              <IconAlertTriangle size={32} stroke={1.75} />
            </div>
            <div className="w-full max-w-[28rem] mx-auto text-center">
              <h2 className="text-body-md-strong text-ink">
                Extraction Unsuccessful
              </h2>
              <p className="mt-xs text-body-md text-body w-full max-w-[28rem] mx-auto text-center">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-md pt-lg">
              <Button variant="secondary" onClick={resetUpload}>
                <IconRefresh size={18} stroke={2} aria-hidden="true" />
                Retry Upload
              </Button>

              <Link href="/dashboard/products/new">
                <Button variant="primary">
                  <IconPlus size={18} stroke={2} aria-hidden="true" />
                  Skip & Enter Manually
                </Button>
              </Link>
            </div>
          </div>
        ) : uploadStatus === "uploading" || uploadStatus === "extracting" ? (
          /* Progress State */
          <div className="flex flex-col items-center justify-center py-2xl space-y-xl text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale text-ink">
              <IconUpload size={32} stroke={1.75} className="animate-bounce" />
            </div>

            <div className="space-y-xs">
              <h2 className="text-body-md-strong text-ink text-lg">
                {uploadStatus === "uploading"
                  ? "Uploading to Vault S3…"
                  : "Vaultly AI Reading Receipt…"}
              </h2>
              <p className="text-body-sm text-mute">
                {file?.name} ({(file?.size ? file.size / (1024 * 1024) : 0).toFixed(2)} MB)
              </p>
            </div>

            {/* Motion Animated Progress Bar */}
            <div className="w-full max-w-[28rem] space-y-xs">
              <div className="h-3 w-full overflow-hidden rounded-pill bg-surface-muted border border-border">
                <motion.div
                  className="h-full rounded-pill bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <p className="text-caption text-mute">{progress}% complete</p>
            </div>
          </div>
        ) : uploadStatus === "success" ? (
          /* Success Redirecting State */
          <div className="flex flex-col items-center justify-center py-2xl space-y-md text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale text-ink">
              <IconCheck size={32} stroke={2} />
            </div>
            <h2 className="text-body-md-strong text-ink text-lg">
              Receipt Extracted Successfully!
            </h2>
            <p className="text-body-sm text-mute">
              Redirecting to review screen…
            </p>
          </div>
        ) : (
          /* Idle Dropzone State */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-lg rounded-xl border-2 border-dashed transition-colors p-2xl text-center ${isDragOver
              ? "border-primary bg-primary-pale/40"
              : "border-border bg-canvas hover:border-primary hover:bg-primary-pale/20"
              }`}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              aria-label="Upload receipt image or PDF"
            />

            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary-pale text-ink transition-colors group-hover:bg-primary group-hover:text-on-primary">
              <IconUpload size={32} stroke={1.75} aria-hidden="true" />
            </span>

            <div className="text-center">
              <span className="block text-body-md-strong text-ink">
                Drop your receipt here, or browse
              </span>
              <span className="mt-xs block text-body-sm text-mute max-w-[260px] mx-auto">
                Supports JPG, PNG, WebP, or PDF documents up to 10 MB
              </span>
            </div>

            <Button variant="secondary" className="pointer-events-none mt-md">
              Choose file
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


