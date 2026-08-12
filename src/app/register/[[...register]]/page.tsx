import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas-soft p-lg">
      <div className="mb-xl flex flex-col items-center gap-sm">
        <Link href="/" className="flex items-center gap-sm transition-opacity hover:opacity-90">
          <Logo size={56} priority />
          <span className="text-body-md-strong text-ink text-xl">Vaultly</span>
        </Link>
      </div>

      <div className="card-content w-full max-w-[420px]">
        <SignUp
          path="/register"
          routing="path"
          signInUrl="/login"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    </main>
  );
}
