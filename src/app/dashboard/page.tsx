import {
  IconAlertTriangle,
  IconPackage,
  IconShieldCheck,
  IconVault,
} from "@tabler/icons-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getProducts } from "@/lib/actions/products";
import { calculateWarranty, formatDate } from "@/lib/product-helpers";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();
  const products = await getProducts();

  const productsWithWarranty = products.map((product) => ({
    ...product,
    warranty: calculateWarranty(product.purchaseDate, product.warrantyMonths),
  }));

  const totalProducts = products.length;
  const activeWarranties = productsWithWarranty.filter(
    (p) => p.warranty.status === "active"
  ).length;
  const expiringSoon = productsWithWarranty.filter(
    (p) => p.warranty.status === "expiring"
  ).length;

  const recentProducts = [...productsWithWarranty]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const STAT_CARDS = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: IconPackage,
      iconBg: "bg-accent-cyan-pale text-accent-cyan",
    },
    {
      label: "Active Warranties",
      value: activeWarranties,
      icon: IconShieldCheck,
      iconBg: "bg-accent-emerald-pale text-accent-emerald",
    },
    {
      label: "Expiring Soon",
      value: expiringSoon,
      icon: IconAlertTriangle,
      iconBg: "bg-accent-orange-pale text-accent-orange",
    },
  ] as const;

  return (
    <div className="space-y-xl">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div>
        <h1 className="text-display-sm text-ink">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-xs text-body-md text-body">
          Here&apos;s what&apos;s happening in your vault.
        </p>
      </div>

      {totalProducts === 0 ? (
        /* ── Empty state ───────────────────────────────────────────────── */
        <div className="card-content flex flex-col items-center justify-center border border-border py-3xl text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary-pale">
            <IconVault size={36} stroke={1.5} className="text-ink" />
          </div>
          <h2 className="mt-xl text-display-sm text-ink">
            Nothing in your vault yet
          </h2>
          <p className="mt-md text-body-md text-body max-w-[440px]">
            Upload a receipt and we&apos;ll extract everything automatically.
          </p>
          <div className="mt-2xl">
            <Link href="/dashboard/upload">
              <Button variant="primary">Upload your first receipt</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <div className="grid gap-lg md:grid-cols-3">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="card-content flex items-start justify-between border border-border"
              >
                <div>
                  <p className="text-body-sm text-mute">{stat.label}</p>
                  <p className="mt-sm stat-value text-stat-number text-ink font-semibold">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <stat.icon size={20} stroke={2} aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>

          {/* ── Recently uploaded ───────────────────────────────────────── */}
          <div className="card-content border border-border">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-display-sm text-ink">Recently uploaded</h2>
              <Link
                href="/dashboard/products"
                className="text-body-sm-strong text-ink hover:text-primary-active transition-colors"
              >
                View all products →
              </Link>
            </div>

            <div className="divide-y divide-border">
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  className="flex items-center justify-between py-lg first:pt-0 last:pb-0 group hover:opacity-90 transition-opacity"
                >
                  <div className="min-w-0 pr-md">
                    <p className="text-body-md-strong text-ink group-hover:text-primary-active transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="mt-xxs text-body-sm text-mute truncate">
                      {product.brand ? `${product.brand} • ` : ""}
                      {product.store || "General"} • Purchased {formatDate(product.purchaseDate)}
                    </p>
                  </div>
                  <span className={product.warranty.badgeClass}>
                    {product.warranty.status === "active"
                      ? "Active"
                      : product.warranty.status === "expiring"
                        ? "Expiring"
                        : "Expired"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
