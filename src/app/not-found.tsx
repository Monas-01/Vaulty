import { IconQuestionMark } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas p-xl text-center">
      <div className="card-content w-full max-w-[480px] mx-auto border border-border flex flex-col items-center justify-center py-3xl text-center shadow-lg">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary-pale text-ink">
          <IconQuestionMark size={36} stroke={1.5} />
        </div>

        <h1 className="mt-xl text-display-sm text-ink">Page not found</h1>

        <p className="mt-md text-body-md text-body">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-2xl flex items-center justify-center gap-md">
          <Link href="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
