import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooterCta } from "@/components/landing/landing-footer-cta";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";

export default function Home() {
  return (
    <div className="landing min-h-screen bg-canvas">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingFooterCta />
      </main>
    </div>
  );
}
