import { IconPlus, IconReceipt, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { getProducts } from "@/lib/actions/products";
import {
  calculateWarranty,
  formatCurrency,
  formatDate,
} from "@/lib/product-helpers";
import { ProductFilters } from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, category } = await searchParams;
  const products = await getProducts(search, category);

  return (
    <div className="space-y-xl">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-display-sm text-ink">Products</h1>
          <p className="mt-xs text-body-md text-body">
            Manage your registered products, warranties, and receipt records.
          </p>
        </div>

        <Link href="/dashboard/products/new">
          <Button variant="primary">
            <IconPlus size={18} stroke={2} aria-hidden="true" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* ── Filters Bar ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>

      {/* ── Product List Grid ─────────────────────────────────────────── */}
      {products.length === 0 ? (
        <div className="card-content flex flex-col items-center justify-center border border-border py-3xl text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale">
            <IconReceipt size={32} stroke={1.5} className="text-ink" />
          </div>
          <h2 className="mt-xl text-display-sm text-ink">No products found</h2>
          <p className="mt-xs text-body-md text-body max-w-[420px]">
            {search || category
              ? "No products match your current search or category filter. Try clearing filters or searching for something else."
              : "Add your first product to track warranties, purchase dates, and receipt documentation."}
          </p>
          <div className="mt-xl">
            <Link href="/dashboard/products/new">
              <Button variant="primary">
                <IconPlus size={18} stroke={2} aria-hidden="true" />
                Add product now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const warranty = calculateWarranty(
              product.purchaseDate,
              product.warrantyMonths,
            );

            return (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="card-content border border-border flex flex-col justify-between hover:border-primary transition-colors cursor-pointer group min-w-0 w-full"
              >
                <div className="w-full min-w-0">
                  <div className="flex items-start justify-between gap-md mb-md w-full">
                    <div className="min-w-0 flex-1">
                      <span className="text-caption text-mute uppercase font-semibold block w-full">
                        {product.category || "General"}
                      </span>
                      <h3 className="text-body-md-strong text-ink group-hover:text-primary-active transition-colors truncate w-full">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-body-sm text-mute truncate w-full">{product.brand}</p>
                      )}
                    </div>

                    <span className={`${warranty.badgeClass} shrink-0`}>
                      {warranty.status === "active"
                        ? "Active"
                        : warranty.status === "expiring"
                          ? "Expiring"
                          : "Expired"}
                    </span>
                  </div>

                  <div className="space-y-xs pt-md border-t border-border text-body-sm text-body">
                    <div className="flex justify-between">
                      <span className="text-mute">Purchased:</span>
                      <span className="text-ink font-medium">
                        {formatDate(product.purchaseDate)}
                      </span>
                    </div>
                    {product.store && (
                      <div className="flex justify-between">
                        <span className="text-mute">Store:</span>
                        <span className="text-ink font-medium truncate max-w-[160px]">
                          {product.store}
                        </span>
                      </div>
                    )}
                    {product.purchasePrice != null && (
                      <div className="flex justify-between">
                        <span className="text-mute">Price:</span>
                        <span className="stat-value text-ink font-semibold">
                          {formatCurrency(product.purchasePrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-lg pt-md border-t border-border flex items-center justify-between text-body-sm">
                  <span className="text-mute flex items-center gap-xs">
                    <IconShieldCheck size={16} className="text-mute" />
                    {product.warrantyMonths} mos warranty
                  </span>
                  <span className="text-body-sm-strong text-ink group-hover:translate-x-0.5 transition-transform">
                    View details &rarr;
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
