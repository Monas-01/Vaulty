import {
  IconBellRinging,
  IconBrain,
  IconReceipt,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";

import { LandingFooterCta } from "@/components/landing/landing-footer-cta";
import { LandingNav } from "@/components/landing/landing-nav";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Upload",
    description:
      "Snap a photo on your phone or drag and drop any receipt, invoice, or warranty document into Vaultly.",
    icon: IconReceipt,
    iconBg: "bg-accent-cyan-pale text-accent-cyan",
  },
  {
    step: "02",
    title: "We extract the details",
    description:
      "Our AI automatically extracts the store, product names, total price, purchase date, and coverage duration in seconds.",
    icon: IconBrain,
    iconBg: "bg-primary-pale text-ink",
  },
  {
    step: "03",
    title: "We track your warranty",
    description:
      "Vaultly categorizes your items and maintains an active countdown for every single warranty period.",
    icon: IconShieldCheck,
    iconBg: "bg-accent-emerald-pale text-accent-emerald",
  },
  {
    step: "04",
    title: "We remind you before it expires",
    description:
      "Get smart notifications well before coverage ends so you have ample time to claim repairs, returns, or extensions.",
    icon: IconBellRinging,
    iconBg: "bg-accent-orange-pale text-accent-orange",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="landing flex min-h-screen flex-col justify-between bg-canvas-soft">
      <div>
        <LandingNav />

        <main className="mx-auto max-w-6xl w-full px-lg py-3xl md:px-xl lg:py-[72px]">
          {/* Intro Section — same left-aligned grid as homepage hero & pricing */}
          <div className="min-w-0 w-full text-left">
            <span className="mb-lg inline-flex rounded-pill bg-canvas px-lg py-xs text-caption text-ink font-semibold">
              How it works
            </span>
            <h1 className="mt-sm text-display-xl font-black text-ink leading-tight">
              Simple, automatic receipt &amp; warranty tracking.
            </h1>
            <p className="mt-xl max-w-[560px] text-body-lg text-body">
              Upload a receipt photo and Vaultly reads the details, tracks your
              warranty, and reminds you before it expires.
            </p>
          </div>

          {/* 4-Step Visual Breakdown */}
          <div className="mt-3xl grid gap-xl md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="card-content flex flex-col justify-between border border-border p-xl shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-body-sm-strong text-mute">
                      Step {step.step}
                    </span>
                    <span
                      className={`inline-flex size-10 items-center justify-center rounded-xl ${step.iconBg}`}
                    >
                      <step.icon size={20} stroke={2} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-xl text-display-sm text-ink font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-md text-body-md text-body">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-page CTA */}
          <div className="mt-3xl text-center">
            <Link href="/login">
              <Button variant="primary">Start your vault — it&apos;s free</Button>
            </Link>
          </div>
        </main>
      </div>

      <LandingFooterCta />
    </div>
  );
}
