"use client";

import {
  IconBell,
  IconLayoutDashboard,
  IconPackage,
  IconReceipt,
  IconSettings,
  IconShieldCheck,
  IconUpload,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Receipt", icon: IconUpload },
  { href: "/dashboard/products", label: "Products", icon: IconPackage },
  { href: "/dashboard/receipts", label: "Receipts", icon: IconReceipt },
  { href: "/dashboard/warranties", label: "Warranties", icon: IconShieldCheck },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: IconBell,
  },
  { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-xs px-md py-lg" aria-label="Dashboard">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-md rounded-lg px-lg py-md transition-colors duration-150",
              isActive
                ? "bg-canvas-soft text-ink"
                : "text-body hover:bg-canvas-soft hover:text-ink",
            )}
          >
            {/* Animated active indicator bar */}
            {isActive && (
              <motion.span
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <item.icon
              size={20}
              stroke={2}
              aria-hidden="true"
              className={cn("shrink-0", isActive && "text-primary")}
            />
            <span
              className={cn(
                isActive ? "text-body-md-strong" : "text-body-md",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
