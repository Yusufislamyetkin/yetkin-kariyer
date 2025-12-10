import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCampaign, getCampaigns } from "@/lib/bot/campaign-service";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const result = await getCampaigns(status);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Kampanyalar getirilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaigns: result.campaigns || [],
    });
  } catch (error: any) {
    console.error("[CAMPAIGNS_API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Kampanyalar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = await createCampaign({
      name: body.name,
      activityType: body.activityType,
      botCount: body.botCount,
      totalActivities: body.totalActivities,
      durationHours: body.durationHours,
      config: body.config,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Kampanya oluşturulamadı" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: result.campaign,
      message: result.message,
    });
  } catch (error: any) {
    console.error("[CAMPAIGNS_API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Kampanya oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

