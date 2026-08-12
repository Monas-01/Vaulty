"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

interface WarrantyStatusFilterProps {
  activeCount: number;
  expiringCount: number;
  expiredCount: number;
  totalCount: number;
}

export function WarrantyStatusFilter({
  activeCount,
  expiringCount,
  expiredCount,
  totalCount,
}: WarrantyStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = (searchParams.get("status") || "all").toLowerCase();

  const handleStatusSelect = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-sm">
      {/* All */}
      <button
        type="button"
        onClick={() => handleStatusSelect("all")}
        className={cn(
          "rounded-pill border border-border px-lg py-xs text-body-sm-strong transition-colors cursor-pointer",
          currentStatus === "all"
            ? "border-primary bg-primary-pale text-ink shadow-xs"
            : "bg-canvas text-mute hover:bg-primary-pale hover:text-ink",
        )}
      >
        All ({totalCount})
      </button>

      {/* Active */}
      <button
        type="button"
        onClick={() => handleStatusSelect("active")}
        className={cn(
          "badge-active cursor-pointer transition-opacity",
          currentStatus === "active"
            ? "ring-2 ring-status-active ring-offset-2 opacity-100"
            : "opacity-80 hover:opacity-100",
        )}
      >
        Active ({activeCount})
      </button>

      {/* Expiring Soon */}
      <button
        type="button"
        onClick={() => handleStatusSelect("expiring")}
        className={cn(
          "badge-expiring cursor-pointer transition-opacity",
          currentStatus === "expiring"
            ? "ring-2 ring-status-expiring ring-offset-2 opacity-100"
            : "opacity-80 hover:opacity-100",
        )}
      >
        Expiring ({expiringCount})
      </button>

      {/* Expired */}
      <button
        type="button"
        onClick={() => handleStatusSelect("expired")}
        className={cn(
          "badge-expired cursor-pointer transition-opacity",
          currentStatus === "expired"
            ? "ring-2 ring-status-expired ring-offset-2 opacity-100"
            : "opacity-80 hover:opacity-100",
        )}
      >
        Expired ({expiredCount})
      </button>
    </div>
  );
}
