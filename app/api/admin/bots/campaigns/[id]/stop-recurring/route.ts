import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaignId = params.id;
    const response = await fetch(`${BACKEND_API_URL}/Admin/StopRecurringBotCampaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to stop recurring bot campaign');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[STOP_RECURRING_BOT_CAMPAIGN_API]", error);
    return NextResponse.json(
      { error: error.message || "Tekrarlayan bot kampanyası durdurulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

