import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingFooterCta() {
  return (
    <section className="w-full bg-ink mt-3xl">
      <div className="mx-auto flex max-w-6xl w-full flex-col items-start gap-xl px-lg py-3xl md:flex-row md:items-center md:justify-between md:px-xl">
        <h2 className="max-w-xl text-display-md text-canvas">
          Start protecting your purchases today
        </h2>
        <Link href="/login" className="shrink-0">
          <Button variant="primary">
            Get started — it&apos;s free
          </Button>
        </Link>
      </div>
    </section>
  );
}
