"use client";

import { IconAlertOctagon, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-xl text-center">
       <div className="card-content max-w-[28rem] w-full border border-border flex flex-col items-center justify-center py-3xl text-center shadow-lg">
        <div className="flex size-20 items-center justify-center rounded-full bg-status-expired-pale text-status-expired">
          <IconAlertOctagon size={36} stroke={1.5} />
        </div>

        <h1 className="mt-xl text-display-sm text-ink">Something went wrong</h1>

        <p className="mt-md text-body-md text-body">
          An unexpected error occurred while processing your request.
        </p>

        <div className="mt-2xl flex flex-col sm:flex-row items-center justify-center gap-md w-full">
          <Button variant="primary" onClick={() => reset()} className="w-full sm:w-auto">
            <IconRefresh size={18} stroke={2} aria-hidden="true" />
            Try again
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
