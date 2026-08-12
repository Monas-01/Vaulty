import { IconPackage, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

import { getProducts } from "@/lib/actions/products";
import {
  calculateWarranty,
  formatCurrency,
  formatDate,
} from "@/lib/product-helpers";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const products = await getProducts(query);

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div>
        <h1 className="text-display-sm text-ink">Search Results</h1>
        <p className="mt-xs text-body-md text-body">
          {query
            ? `Showing products matching "${query}" (${products.length} found)`
            : "Enter a search query in the search bar above."}
        </p>
      </div>

      {/* Results List / Grid */}
      {products.length === 0 ? (
        <div className="card-content flex flex-col items-center justify-center border border-border py-3xl text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale">
            <IconSearch size={32} stroke={1.5} className="text-ink" />
          </div>
          <h2 className="mt-xl text-display-sm text-ink">No products found</h2>
          <p className="mt-xs text-body-md text-body max-w-[420px]">
            No products match your search query &quot;{query}&quot;. Try searching for a different product name, brand, or store.
          </p>
        </div>
      ) : (
        <div className="space-y-md">
          {products.map((product) => {
            const warranty = calculateWarranty(
              product.purchaseDate,
              product.warrantyMonths,
            );

            return (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="card-content border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-md hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-md">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-canvas-soft border border-border text-ink">
                    <IconPackage size={24} />
                  </div>
                  <div>
                    <span className="text-caption text-mute uppercase font-semibold">
                      {product.category || "General"}
                    </span>
                    <h3 className="text-body-md-strong text-ink group-hover:text-primary-active transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-body-sm text-mute">
                      {product.brand ? `${product.brand} • ` : ""}
                      {product.store || "No store listed"} • Purchased {formatDate(product.purchaseDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-xl">
                  {product.purchasePrice != null && (
                    <span className="stat-value text-body-md text-ink font-semibold">
                      {formatCurrency(product.purchasePrice)}
                    </span>
                  )}

                  <span className={warranty.badgeClass}>
                    {warranty.status === "active"
                      ? "Active"
                      : warranty.status === "expiring"
                        ? "Expiring"
                        : "Expired"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
