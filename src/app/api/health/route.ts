import { NextResponse } from "next/server";

// Probes hit this every few seconds, so it deliberately touches no database.
// The Supabase pooler is in ap-south-1 (~210ms away), and a query per probe
// would cost more than it tells us. Liveness here means "the Node process is
// serving HTTP", which is exactly what the kubelet needs to decide on restart.
//
// Clerk middleware runs on /api/* via the matcher in src/proxy.ts, but only
// /dashboard/settings/profile calls auth.protect(), so this stays public.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
