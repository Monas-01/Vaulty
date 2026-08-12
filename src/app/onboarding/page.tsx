"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_PICKS = [
  { id: "electronics", label: "Electronics" },
  { id: "appliances", label: "Appliances" },
  { id: "all", label: "All of it" },
] as const;

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedPick, setSelectedPick] = useState<string>("all");

  useEffect(() => {
    if (isLoaded && user) {
      setName(user.fullName || user.firstName || "");
    }
  }, [isLoaded, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas-soft p-lg">
      <div className="mb-xl flex flex-col items-center gap-sm">
        <Link href="/" className="flex items-center gap-sm transition-opacity hover:opacity-90">
          <Logo size={56} priority />
          <span className="text-body-md-strong text-ink text-xl">Vaultly</span>
        </Link>
      </div>

      <div className="card-content w-full max-w-[480px]">
        <div className="mb-xl text-center">
          <h1 className="text-display-sm text-ink">Welcome to Vaultly!</h1>
          <p className="mt-xs text-body-md text-mute">
            Let&apos;s set up your vault in a few seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
          <div className="flex flex-col gap-xs">
            <label htmlFor="name-input" className="text-body-sm-strong text-ink">
              What should we call you?
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="text-input w-full"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <span className="text-body-sm-strong text-ink">
              What do you want to track first?
            </span>
            <div className="mt-xs flex flex-wrap gap-sm">
              {QUICK_PICKS.map((pick) => {
                const isSelected = selectedPick === pick.id;
                return (
                  <button
                    key={pick.id}
                    type="button"
                    onClick={() => setSelectedPick(pick.id)}
                    className={cn(
                      "rounded-pill border border-border bg-canvas px-lg py-sm text-body-sm-strong transition-colors cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary-pale text-ink shadow-xs"
                        : "text-mute hover:bg-primary-pale hover:text-ink",
                    )}
                  >
                    {pick.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-md flex flex-col items-center gap-md">
            <Button type="submit" variant="primary" className="w-full">
              Continue to Vault
            </Button>
            <Link
              href="/dashboard"
              className="text-body-sm text-mute transition-colors hover:text-ink hover:underline"
            >
              Skip for now
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
