import {
  IconBellRinging,
  IconReceipt,
  IconSearch,
} from "@tabler/icons-react";

import { ProductStatusMockup } from "@/components/landing/product-status-mockup";

const features = [
  {
    icon: IconReceipt,
    title: "AI reads your receipt",
    description:
      "Snap a photo and Vaultly pulls out the store, product, price, and purchase date — ready for you to review and save.",
    iconBg: "bg-accent-cyan-pale text-accent-cyan",
  },
  {
    icon: IconBellRinging,
    title: "Warranty reminders before it's too late",
    description:
      "Vaultly tracks every warranty end date and nudges you while you still have time to claim or extend coverage.",
    iconBg: "bg-accent-orange-pale text-accent-orange",
  },
  {
    icon: IconSearch,
    title: "Search everything in seconds",
    description:
      "Find any receipt by product, store, or date. No more digging through email threads or shoeboxes.",
    iconBg: "bg-accent-pink-pale text-accent-pink",
  },
];

export function LandingFeatures() {
  return (
    <section
      id="product"
      className="scroll-mt-[72px] mx-auto max-w-6xl px-lg py-3xl md:px-xl"
    >
      <div className="grid items-center gap-[64px] lg:grid-cols-[55%_40%]">
        <div className="min-w-0 w-full">
          <p className="text-caption text-body">Product</p>
          <h2 className="scroll-mt-[72px] mt-sm text-display-md text-ink">
            Everything you buy, organized automatically
          </h2>
          <p className="mt-lg max-w-[480px] text-body-lg text-body">
            From upload to reminder, Vaultly handles the busywork so you can focus
            on using what you bought — not hunting for paperwork.
          </p>
        </div>

        <div className="flex shrink-0 justify-center lg:justify-end">
          <ProductStatusMockup />
        </div>
      </div>

      <div className="mt-3xl grid gap-xl md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="card-content">
            <span
              className={`mb-lg inline-flex size-12 items-center justify-center rounded-xl ${feature.iconBg}`}
            >
              <feature.icon size={24} stroke={1.75} aria-hidden="true" />
            </span>
            <h3 className="scroll-mt-[72px] text-display-sm text-ink">
              {feature.title}
            </h3>
            <p className="mt-md max-w-[480px] text-body-md text-body">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
