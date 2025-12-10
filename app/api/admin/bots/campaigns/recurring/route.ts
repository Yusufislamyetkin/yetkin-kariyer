import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, activityType, botCount, totalActivities, durationHours, recurringPattern, config } = body;

    const response = await fetch(`${BACKEND_API_URL}/Admin/CreateRecurringBotCampaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, activityType, botCount, totalActivities, durationHours, recurringPattern, config }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create recurring bot campaign');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("[CREATE_RECURRING_BOT_CAMPAIGN_API]", error);
    return NextResponse.json(
      { error: error.message || "Tekrarlayan bot kampanyası oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_API_URL}/Admin/GetRecurringBotCampaigns`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch recurring bot campaigns');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[GET_RECURRING_BOT_CAMPAIGNS_API]", error);
    return NextResponse.json(
      { error: error.message || "Tekrarlayan bot kampanyaları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

