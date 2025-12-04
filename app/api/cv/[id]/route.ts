import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cv = await db.cV.findUnique({
      where: { id: params.id },
      include: {
        template: true,
        uploads: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            url: true,
            name: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "CV bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ cv });
  } catch (error) {
    return NextResponse.json(
      { error: "CV yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data } = body;

    const cv = await db.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "CV bulunamadı" }, { status: 404 });
    }

    const updated = await db.cV.update({
      where: { id: params.id },
      data: {
        data: data as any,
      },
      include: {
        template: true,
      },
    });

    return NextResponse.json({ cv: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "CV güncellenirken bir hata oluştu" },
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cv = await db.cV.findUnique({
      where: { id: params.id },
      include: {
        jobApplications: true,
      },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "CV bulunamadı" }, { status: 404 });
    }

    // CV'yi sil (onDelete: Cascade ile ilgili job applications otomatik silinecek)
    await db.cV.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CV_DELETE] Hata:", error);
    // Daha detaylı hata mesajı
    const errorMessage = error?.message || "CV silinirken bir hata oluştu";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

