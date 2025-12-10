import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCampaignStatus, cancelCampaign } from "@/lib/bot/campaign-service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const campaignId = params.id;

    const result = await getCampaignStatus(campaignId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Kampanya durumu getirilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
    });
  } catch (error: any) {
    console.error("[CAMPAIGN_API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Kampanya durumu getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const campaignId = params.id;

    const result = await cancelCampaign(campaignId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Kampanya iptal edilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("[CAMPAIGN_API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Kampanya iptal edilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

