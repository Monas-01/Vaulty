"use client";

import { IconUpload } from "@tabler/icons-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface ReceiptDropzoneProps {
  className?: string;
}

export function ReceiptDropzone({ className }: ReceiptDropzoneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={cn(
        "card-content flex h-[400px] w-[340px] shrink-0 flex-col overflow-hidden p-xl",
        className,
      )}
    >
      <button
        type="button"
        className="group flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center gap-lg rounded-xl border-2 border-dashed border-border bg-canvas px-lg py-xl transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Drop a receipt or click to upload"
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-pale text-ink transition-colors group-hover:bg-primary group-hover:text-on-primary">
          <IconUpload size={28} stroke={1.75} aria-hidden="true" />
        </span>
        <span className="max-w-[220px] text-center">
          <span className="block text-body-md-strong text-ink">
            Drop a receipt or click to upload
          </span>
          <span className="mt-xs block text-body-sm text-mute">
            JPG, PNG, or PDF up to 10 MB
          </span>
        </span>
      </button>
    </motion.div>
  );
}
