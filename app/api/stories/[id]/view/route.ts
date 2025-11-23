import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// Mark story as viewed
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const story = await db.story.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story bulunamadı" }, { status: 404 });
    }

    // Check if already viewed
    const existingView = await db.storyView.findUnique({
      where: {
        storyId_userId: {
          storyId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!existingView) {
      await db.storyView.create({
        data: {
          storyId: params.id,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STORY_VIEW]", error);
    return NextResponse.json(
      { error: "Story görüntülenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

