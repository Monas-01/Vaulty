import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Logo } from "@/components/brand/Logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas-soft">
      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-[240px] flex-col border-r border-border bg-canvas">
        {/* Logo */}
        <div className="flex h-[72px] shrink-0 items-center gap-sm border-b border-border px-xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-sm transition-opacity hover:opacity-90"
          >
            <Logo size={34} />
            <span className="text-body-md-strong text-ink">Vaultly</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pt-md">
          <SidebarNav />
        </div>
      </aside>

      {/* ── Main area (responsive offset) ────────────────────────── */}
      <div className="flex flex-1 flex-col w-full pl-0 md:pl-[240px]">
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <DashboardHeader />

        {/* ── Page content ────────────────────────────────────────────── */}
        <main className="flex-1 p-md sm:p-xl lg:p-2xl">{children}</main>
      </div>
    </div>
  );
}
