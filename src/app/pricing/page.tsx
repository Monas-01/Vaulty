import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

import { LandingFooterCta } from "@/components/landing/landing-footer-cta";
import { LandingNav } from "@/components/landing/landing-nav";
import { Button } from "@/components/ui/button";

const INCLUDED_FEATURES = [
  "Unlimited receipts and warranties",
  "AI-powered data extraction",
  "Warranty expiry reminders",
  "Search across your whole vault",
  "All future updates while free",
];

export default function PricingPage() {
  return (
    <div className="landing flex min-h-screen flex-col justify-between bg-canvas-soft">
      <div>
        <LandingNav />

        <main className="mx-auto max-w-6xl px-lg py-3xl md:px-xl lg:py-[72px]">
          <div className="grid items-center gap-[48px] lg:grid-cols-[55%_40%] lg:gap-[64px]">
            {/* Left Content Column */}
            <div className="min-w-0 w-full text-left">
              <span className="mb-lg inline-flex rounded-pill bg-canvas px-lg py-xs text-caption text-ink font-semibold">
                Pricing
              </span>

              <h1 className="text-display-xl font-black text-ink leading-tight">
                Free while we build this right.
              </h1>

              <p className="mt-xl max-w-[480px] text-body-lg text-body">
                Vaultly is free for everyone right now — no credit card, no trial
                countdown, no catch. We&apos;re focused on making the product great
                before we think about charging for it.
              </p>

              <p className="mt-xl max-w-[480px] text-body-sm text-mute">
                We may introduce paid plans for power users in the future, but
                everyone using Vaultly today will be notified well in advance before
                anything changes.
              </p>
            </div>

            {/* Right Card Column */}
            <div className="flex shrink-0 justify-center lg:justify-end w-full">
              <div className="card-content w-full max-w-[440px] border border-border p-xl md:p-2xl shadow-xs">
                <div className="text-left">
                  <p className="text-display-md text-ink">Free</p>
                  <p className="mt-xs text-body-sm text-mute">
                    $0 / forever, for now
                  </p>
                </div>

                <hr className="my-xl border-border" />

                <ul className="flex flex-col gap-md">
                  {INCLUDED_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-md">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-emerald-pale text-accent-emerald">
                        <IconCheck size={16} stroke={2.5} aria-hidden="true" />
                      </span>
                      <span className="text-body-md text-ink font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-2xl">
                  <Link href="/login" className="block w-full">
                    <Button variant="primary" className="w-full">
                      Start your vault — it&apos;s free
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <LandingFooterCta />
    </div>
  );
}
