"use client";

import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/login", label: "Login" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl w-full items-center justify-between px-lg md:px-xl">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90" style={{ gap: "10px" }}>
          <Logo size={48} priority />
          <span style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1 }} className="text-ink">Vaultly</span>
        </Link>

        <nav className="hidden items-center gap-xl md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-body-md text-body transition-colors duration-200 hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/login">
          <Button variant="primary">Get started</Button>
        </Link>
      </div>
    </header>
  );
}
