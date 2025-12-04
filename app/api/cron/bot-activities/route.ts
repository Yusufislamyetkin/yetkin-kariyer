import { NextResponse } from "next/server";

// DEPRECATED: This endpoint is no longer used for cron jobs
// Bot activities are now triggered manually via /api/admin/bots/run
// This endpoint is kept for backward compatibility

export async function GET() {
  return NextResponse.json(
    {
      message: "This endpoint is deprecated. Use /api/admin/bots/run instead.",
      redirect: "/api/admin/bots/run",
    },
    { status: 301 }
  );
}

// Also support POST for manual triggers (redirects to admin endpoint)
export async function POST() {
  return GET();
}
