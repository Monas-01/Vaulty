"use client";

import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Electronics",
  "Appliances",
  "Home & Kitchen",
  "Vehicles",
  "Fitness",
  "Tools",
  "Other",
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "All") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-md">
      {/* Search Input */}
      <div className="relative w-full max-w-[480px]">
        <IconSearch
          size={18}
          stroke={2}
          className="pointer-events-none absolute left-lg top-1/2 -translate-y-1/2 text-mute"
          aria-hidden="true"
        />
        <input
          type="search"
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search products by name, brand, or store…"
          className="text-input w-full pl-[44px]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-sm">
        {CATEGORIES.map((cat) => {
          const isSelected =
            currentCategory.toLowerCase() === cat.toLowerCase() ||
            (cat === "All" && !searchParams.get("category"));

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={cn(
                "rounded-pill border border-border bg-canvas px-lg py-sm text-body-sm-strong transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary-pale text-ink shadow-xs"
                  : "text-mute hover:bg-primary-pale hover:text-ink",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
