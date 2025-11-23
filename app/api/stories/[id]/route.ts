import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// Delete story
export async function DELETE(
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

    if (story.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu story'yi silme yetkiniz yok" },
        { status: 403 }
      );
    }

    await db.story.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STORY_DELETE]", error);
    return NextResponse.json(
      { error: "Story silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

