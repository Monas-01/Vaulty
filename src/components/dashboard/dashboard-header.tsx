"use client";

import { UserButton } from "@clerk/nextjs";
import { IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-canvas px-md sm:px-xl gap-md">
        {/* Left: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-sm md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg border border-border text-ink hover:bg-canvas-soft transition-colors cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <IconMenu2 size={20} stroke={2} />
          </button>

          <Link href="/dashboard" className="flex items-center gap-xs">
            <Logo size={28} />
          </Link>
        </div>

        {/* Center/Search Input Trigger */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="relative w-full max-w-[400px] cursor-pointer"
        >
          <IconSearch
            size={18}
            stroke={2}
            className="pointer-events-none absolute left-md sm:left-lg top-1/2 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <input
            type="text"
            readOnly
            placeholder="Search products, receipts… (⌘K)"
            className="text-input w-full pl-[38px] sm:pl-[44px] cursor-pointer text-body-sm sm:text-body-md"
          />
        </div>

        {/* Right: User section */}
        <div className="flex items-center gap-md shrink-0">
          <UserButton />
        </div>
      </header>

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex w-[280px] max-w-[80vw] flex-col border-r border-border bg-canvas z-10 h-full shadow-2xl">
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-lg">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-sm"
              >
                <Logo size={30} />
                <span className="text-body-md-strong text-ink">Vaultly</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-xs text-mute hover:bg-canvas-soft hover:text-ink transition-colors cursor-pointer"
              >
                <IconX size={20} />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto pt-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <SidebarNav />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
