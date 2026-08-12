import { IconReceipt, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { getProducts } from "@/lib/actions/products";
import {
  calculateWarranty,
  formatCurrency,
  formatDate,
} from "@/lib/product-helpers";
import { Button } from "@/components/ui/button";
import { WarrantyStatusFilter } from "@/components/warranties/warranty-status-filter";

interface WarrantiesPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function WarrantiesPage({ searchParams }: WarrantiesPageProps) {
  const { status } = await searchParams;
  const products = await getProducts();

  // Calculate status for all products
  const productsWithWarranty = products.map((product) => {
    const warranty = calculateWarranty(product.purchaseDate, product.warrantyMonths);
    return { ...product, warranty };
  });

  // Calculate summary counts
  const activeCount = productsWithWarranty.filter(
    (p) => p.warranty.status === "active",
  ).length;
  const expiringCount = productsWithWarranty.filter(
    (p) => p.warranty.status === "expiring",
  ).length;
  const expiredCount = productsWithWarranty.filter(
    (p) => p.warranty.status === "expired",
  ).length;

  // Filter products by selected status pill
  const activeStatus = (status || "all").toLowerCase();
  const filteredProducts = productsWithWarranty.filter((p) => {
    if (activeStatus === "active") return p.warranty.status === "active";
    if (activeStatus === "expiring") return p.warranty.status === "expiring";
    if (activeStatus === "expired") return p.warranty.status === "expired";
    return true;
  });

  return (
    <div className="space-y-xl">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-display-sm text-ink">Warranties</h1>
          <p className="mt-xs text-body-md text-body">
            Track active coverage, expiring policies, and expired warranties in your vault.
          </p>
        </div>

        <Link href="/dashboard/upload">
          <Button variant="primary">Register New Receipt</Button>
        </Link>
      </div>

      {/* ── Status Summary Stats ────────────────────────────────────────── */}
      <div className="grid gap-lg sm:grid-cols-3">
        <div className="card-content border border-border flex items-center justify-between">
          <div>
            <span className="text-caption text-mute uppercase font-semibold">
              Active Warranties
            </span>
            <p className="mt-xxs stat-value text-display-sm text-ink">
              {activeCount}
            </p>
          </div>
          <span className="badge-active">Active</span>
        </div>

        <div className="card-content border border-border flex items-center justify-between">
          <div>
            <span className="text-caption text-mute uppercase font-semibold">
              Expiring Soon (30d)
            </span>
            <p className="mt-xxs stat-value text-display-sm text-ink">
              {expiringCount}
            </p>
          </div>
          <span className="badge-expiring">Expiring</span>
        </div>

        <div className="card-content border border-border flex items-center justify-between">
          <div>
            <span className="text-caption text-mute uppercase font-semibold">
              Expired
            </span>
            <p className="mt-xxs stat-value text-display-sm text-ink">
              {expiredCount}
            </p>
          </div>
          <span className="badge-expired">Expired</span>
        </div>
      </div>

      {/* ── Status Filter Control Pills ─────────────────────────────────── */}
      <div className="flex items-center gap-sm pt-md border-t border-border">
        <span className="text-body-sm-strong text-mute mr-xs">Filter by status:</span>
        <Suspense fallback={null}>
          <WarrantyStatusFilter
            activeCount={activeCount}
            expiringCount={expiringCount}
            expiredCount={expiredCount}
            totalCount={products.length}
          />
        </Suspense>
      </div>

      {/* ── Product List Grid ─────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <div className="card-content flex flex-col items-center justify-center border border-border py-3xl text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale">
            <IconShieldCheck size={32} stroke={1.5} className="text-ink" />
          </div>
          <h2 className="mt-xl text-display-sm text-ink">No warranties found</h2>
          <p className="mt-xs text-body-md text-body max-w-[420px]">
            No products match the selected warranty status filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const { warranty } = product;

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

                  {/* Progress Bar */}
                  <div className="space-y-xs my-md">
                    <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-muted border border-border">
                      <div
                        className={`h-full transition-all duration-300 rounded-pill ${
                          warranty.status === "active"
                            ? "bg-status-active"
                            : warranty.status === "expiring"
                              ? "bg-status-expiring"
                              : "bg-status-expired"
                        }`}
                        style={{ width: `${warranty.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-caption text-mute">
                      <span className="text-caption text-mute">Expires {formatDate(warranty.expirationDate)}</span>
                      <span className="text-caption text-mute">
                        {warranty.daysRemaining > 0
                          ? `${warranty.daysRemaining} days left`
                          : "Expired"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-md pt-md border-t border-border flex items-center justify-between text-body-sm text-body">
                  <span className="text-body-sm text-body">Store: {product.store || "—"}</span>
                  <span className="stat-value text-body-sm text-ink font-semibold">
                    {formatCurrency(product.purchasePrice)}
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
