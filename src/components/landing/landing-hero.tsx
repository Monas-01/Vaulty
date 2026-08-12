"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { ReceiptDropzone } from "@/components/landing/receipt-dropzone";
import { TypewriterHeadline } from "@/components/landing/typewriter-headline";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-lg py-3xl md:px-xl lg:py-[72px]">
        <div className="grid items-center gap-[64px] lg:grid-cols-[55%_40%]">
          <div className="min-w-0 w-full">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-lg inline-flex rounded-pill bg-canvas px-lg py-xs text-caption text-ink"
            >
              Receipts, warranties, one vault
            </motion.p>

            <TypewriterHeadline className="text-[clamp(44px,8vw,96px)] leading-[0.875] font-black text-ink" />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-xl max-w-[480px] text-body-lg text-body"
            >
              Upload a receipt photo and Vaultly reads the details, tracks your
              warranty, and reminds you before it expires — so you always have
              proof when you need it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-2xl flex flex-col gap-md sm:flex-row sm:items-center"
            >
              <Link href="/login">
                <Button variant="primary">Start your vault — it&apos;s free</Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="tertiary">See how it works</Button>
              </Link>
            </motion.div>
          </div>

          <div className="relative flex shrink-0 justify-center lg:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
            >
              <div className="absolute -left-10 top-6 h-52 w-52 rounded-full bg-accent-orange/20 blur-[120px]" />
              <div className="absolute -right-6 bottom-0 h-60 w-60 rounded-full bg-accent-cyan/20 blur-[120px]" />
              <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-accent-pink/20 blur-[120px]" />
            </div>
            <ReceiptDropzone className="relative z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
