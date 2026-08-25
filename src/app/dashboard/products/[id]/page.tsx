import { auth } from "@clerk/nextjs/server";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconCalendar,
  IconEdit,
  IconExternalLink,
  IconReceipt,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getProductById } from "@/lib/actions/products";
import {
  calculateWarranty,
  formatCurrency,
  formatDate,
} from "@/lib/product-helpers";
import { ProductDeleteButton } from "@/components/products/product-delete-button";
import { Button } from "@/components/ui/button";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const warranty = calculateWarranty(
    product.purchaseDate,
    product.warrantyMonths,
  );

  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* ── Top Bar & Actions ───────────────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-xs text-body-sm text-mute hover:text-ink transition-colors mb-md"
        >
          <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
          Back to products
        </Link>

        <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-md">
              <h1 className="text-display-sm text-ink">{product.name}</h1>
              <span className={warranty.badgeClass}>{warranty.statusLabel}</span>
            </div>
            <p className="mt-xs text-body-md text-mute">
              {product.brand ? `${product.brand} • ` : ""}
              {product.category || "General"}
            </p>
          </div>

          <div className="flex items-center gap-sm">
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Button variant="secondary">
                <IconEdit size={18} stroke={2} aria-hidden="true" />
                Edit
              </Button>
            </Link>

            <ProductDeleteButton id={product.id} name={product.name} />
          </div>
        </div>
      </div>

      {/* ── Warranty Progress Section ───────────────────────────────────── */}
      <div className="card-content border border-border space-y-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-pale text-ink">
              <IconShieldCheck size={24} stroke={1.5} />
            </div>
            <div>
              <h2 className="text-body-md-strong text-ink">Warranty Status</h2>
              <p className="text-body-sm text-mute">
                Expires on {formatDate(warranty.expirationDate)}
              </p>
            </div>
          </div>

          <span className="stat-value text-body-md-strong text-ink">
            {warranty.daysRemaining > 0
              ? `${warranty.daysRemaining} days left`
              : "Expired"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-xs">
          <div className="h-3 w-full overflow-hidden rounded-pill bg-surface-muted">
            <div
              className={`h-full transition-all duration-500 rounded-pill ${
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
            <span className="text-caption text-mute">Purchased: {formatDate(product.purchaseDate)}</span>
            <span className="text-caption text-mute">Duration: {product.warrantyMonths} Months</span>
          </div>
        </div>
      </div>

      {/* ── Product & Purchase Information ──────────────────────────────── */}
      <div className="card-content border border-border">
        <h2 className="text-display-sm text-ink mb-xl">Product Information</h2>

        <div className="grid gap-xl md:grid-cols-2">
          <div className="space-y-md">
            <div>
              <span className="text-caption text-mute uppercase font-semibold">
                Store / Retailer
              </span>
              <p className="mt-xxs text-body-md-strong text-ink flex items-center gap-xs">
                <IconBuildingStore size={18} className="text-mute" />
                {product.store || "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-caption text-mute uppercase font-semibold">
                Purchase Price
              </span>
              <p className="mt-xxs stat-value text-display-sm text-ink">
                {formatCurrency(product.purchasePrice)}
              </p>
            </div>
          </div>

          <div className="space-y-md">
            <div>
              <span className="text-caption text-mute uppercase font-semibold">
                Purchase Date
              </span>
              <p className="mt-xxs text-body-md-strong text-ink flex items-center gap-xs">
                <IconCalendar size={18} className="text-mute" />
                {formatDate(product.purchaseDate)}
              </p>
            </div>

            <div>
              <span className="text-caption text-mute uppercase font-semibold">
                Category
              </span>
              <p className="mt-xxs text-body-md-strong text-ink">
                {product.category || "General"}
              </p>
            </div>
          </div>

          {product.notes && (
            <div className="md:col-span-2 pt-md border-t border-border">
              <span className="text-caption text-mute uppercase font-semibold">
                Notes & Serial Numbers
              </span>
              <p className="mt-xs text-body-md text-body whitespace-pre-wrap">
                {product.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Linked Receipt / Invoice ────────────────────────────────────── */}
      <div className="card-content border border-border">
        <h2 className="text-display-sm text-ink mb-lg">Receipt & Invoice</h2>

        {product.receiptUrl ? (
          <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between p-lg rounded-xl bg-surface-muted border border-border">
            <div className="flex items-center gap-md">
              <div className="flex size-12 items-center justify-center rounded-xl bg-canvas border border-border text-ink">
                <IconReceipt size={28} stroke={1.5} />
              </div>
              <div>
                <p className="text-body-md-strong text-ink">Attached Receipt</p>
                <p className="text-body-sm text-mute truncate max-w-[280px]">
                  {product.receiptUrl}
                </p>
              </div>
            </div>

            <a
              href={product.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="secondary">
                <IconExternalLink size={18} stroke={2} aria-hidden="true" />
                View document
              </Button>
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-xl rounded-xl border border-dashed border-border text-center">
            <IconReceipt size={32} stroke={1.5} className="text-mute mb-sm" />
            <p className="text-body-md-strong text-ink">No receipt attached</p>
            <p className="text-body-sm text-mute mt-xxs">
              Edit this product to link a receipt image or document URL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
