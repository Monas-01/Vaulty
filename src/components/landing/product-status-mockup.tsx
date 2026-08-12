"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const products = [
  {
    name: "MacBook Pro 14″",
    store: "Apple Store",
    badge: "active" as const,
    label: "Active",
  },
  {
    name: "Sony WH-1000XM5",
    store: "Best Buy",
    badge: "expiring" as const,
    label: "Expiring soon",
  },
  {
    name: "Dyson V15 Detect",
    store: "Amazon",
    badge: "active" as const,
    label: "Active",
  },
];

const badgeClass = {
  active: "badge-active",
  expiring: "badge-expiring",
  expired: "badge-expired",
} as const;

interface ProductStatusMockupProps {
  className?: string;
}

export function ProductStatusMockup({ className }: ProductStatusMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "card-content flex h-[400px] w-[340px] shrink-0 flex-col gap-md overflow-hidden p-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-body-md-strong text-ink">Your vault</p>
        <span className="text-caption text-mute">3 items</span>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-sm">
        {products.map((product, index) => (
          <motion.li
            key={product.name}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + index * 0.1 }}
            className="flex items-center justify-between gap-md rounded-xl bg-surface-muted px-lg py-md"
          >
            <div className="min-w-0">
              <p className="truncate text-body-md-strong text-ink">
                {product.name}
              </p>
              <p className="truncate text-body-sm text-mute">{product.store}</p>
            </div>
            <span className={cn(badgeClass[product.badge], "shrink-0")}>
              {product.label}
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="rounded-xl bg-status-expiring-pale px-lg py-md">
        <p className="text-caption text-status-expiring">Next reminder</p>
        <p className="text-body-sm-strong text-ink">
          Sony headphones warranty — 12 days left
        </p>
      </div>
    </motion.div>
  );
}
