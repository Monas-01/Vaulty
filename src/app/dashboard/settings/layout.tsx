"use client";

import { IconBell, IconPalette, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  {
    label: "Profile",
    href: "/dashboard/settings/profile",
    icon: IconUser,
  },
  {
    label: "Theme",
    href: "/dashboard/settings/theme",
    icon: IconPalette,
  },
  {
    label: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: IconBell,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* ── Settings Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-display-sm text-ink">Settings</h1>
        <p className="mt-xs text-body-md text-body">
          Manage your profile details, visual preferences, and reminder notifications.
        </p>
      </div>

      {/* ── Settings Navigation Tabs ───────────────────────────────────── */}
      <div className="flex items-center gap-xs border-b border-border pb-xxs">
        {SETTINGS_TABS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            pathname.startsWith(`${tab.href}/`) ||
            (pathname === "/dashboard/settings" && tab.href === "/dashboard/settings/profile");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-xs px-lg py-sm text-body-sm-strong transition-colors border-b-2 -mb-[2px]",
                isActive
                  ? "border-primary text-ink font-semibold"
                  : "border-transparent text-mute hover:text-ink hover:border-border"
              )}
            >
              <tab.icon size={18} stroke={2} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Subpage Content ─────────────────────────────────────────────── */}
      <div className="w-full">{children}</div>
    </div>
  );
}
