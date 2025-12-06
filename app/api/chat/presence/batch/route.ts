import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, channelIds } = body;
    
    if (!Array.isArray(channelIds) || channelIds.length === 0) {
      return NextResponse.json({ success: true });
    }

    const userId = session.user.id as string;
    const now = new Date();

    // Batch update - tüm memberships'i tek seferde güncelle
    await db.chatGroupMembership.updateMany({
      where: {
        userId,
        groupId: { in: channelIds },
      },
      data: {
        lastSeenAt: now,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRESENCE_BATCH] Error:", error);
    return NextResponse.json(
      { error: "Presence update failed" },
      { status: 500 }
    );
  }
}

