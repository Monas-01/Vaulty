"use client";

import {
  IconArrowRight,
  IconPackage,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { getProducts } from "@/lib/actions/products";
import { calculateWarranty, formatCurrency } from "@/lib/product-helpers";
import { Button } from "@/components/ui/button";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [, startTransition] = useTransition();

  // Keyboard shortcut listener (⌘K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const products = await getProducts(query);
        setResults(products.slice(0, 5));
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (productId: string) => {
    onClose();
    router.push(`/dashboard/products/${productId}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-md">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
<div className="relative w-full max-w-[42rem] rounded-2xl border border-border bg-canvas shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="relative flex items-center border-b border-border px-lg py-md">
          <IconSearch
            size={20}
            stroke={2}
            className="text-mute mr-md shrink-0"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name, brand, store, or category… (Press ⌘K to toggle)"
            className="w-full bg-transparent text-body-md text-ink placeholder:text-mute focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-xs text-mute hover:bg-canvas-soft hover:text-ink transition-colors cursor-pointer"
          >
            <IconX size={18} />
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-md space-y-xs">
          {isSearching ? (
            <div className="p-xl text-center text-body-sm text-mute">
              Searching products…
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="p-xl text-center text-body-sm text-mute">
              No matching products found for &quot;{query}&quot;
            </div>
          ) : !query.trim() ? (
            <div className="p-lg text-center text-caption text-mute uppercase font-semibold">
              Type to search product records, stores, or categories
            </div>
          ) : (
            results.map((product) => {
              const warranty = calculateWarranty(
                product.purchaseDate,
                product.warrantyMonths,
              );

              return (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product.id)}
                  className="card-content border border-border flex items-center justify-between p-md hover:border-primary hover:bg-primary-pale/20 transition-colors cursor-pointer rounded-xl group"
                >
                  <div className="flex items-center gap-md min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-canvas-soft border border-border text-ink">
                      <IconPackage size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-md-strong text-ink group-hover:text-primary-active transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-body-sm text-mute truncate">
                        {product.brand ? `${product.brand} • ` : ""}
                        {product.store || "General"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-md shrink-0">
                    <span className="stat-value text-body-sm text-ink font-semibold">
                      {formatCurrency(product.purchasePrice)}
                    </span>
                    <span className={warranty.badgeClass}>
                      {warranty.status === "active"
                        ? "Active"
                        : warranty.status === "expiring"
                          ? "Expiring"
                          : "Expired"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div className="border-t border-border bg-canvas-soft px-lg py-sm flex items-center justify-between text-body-sm">
            <span className="text-mute">
              Showing top {results.length} results
            </span>
            <button
              type="button"
              onClick={handleFullSearch}
              className="inline-flex items-center gap-xs font-semibold text-ink hover:text-primary-active cursor-pointer"
            >
              View full search page <IconArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
