import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { DEFAULT_TEMPLATES } from "../templates/defaultTemplates";

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
    const { data, templateId } = body;

    const cv = await db.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "CV bulunamadı" }, { status: 404 });
    }

    // Update data object
    const updateData: { data?: any; templateId?: string } = {};
    
    if (data !== undefined) {
      updateData.data = data as any;
    }

    // If templateId is provided, validate and update it
    if (templateId !== undefined) {
      if (typeof templateId !== "string") {
        return NextResponse.json(
          { error: "Geçerli bir şablon kimliği gereklidir" },
          { status: 400 }
        );
      }

      // Check if template exists in database
      let template = await db.cVTemplate.findUnique({
        where: { id: templateId },
      });

      // If not in database, check default templates
      if (!template) {
        const fallbackTemplate = DEFAULT_TEMPLATES.find(
          (item) => item.id === templateId
        );

        if (fallbackTemplate) {
          // Create the template in database if it doesn't exist
          template = await db.cVTemplate.create({
            data: {
              id: fallbackTemplate.id,
              name: fallbackTemplate.name,
              preview: fallbackTemplate.preview,
              structure: fallbackTemplate.structure as Prisma.InputJsonValue,
            },
          });
        } else {
          return NextResponse.json(
            { error: "Şablon bulunamadı" },
            { status: 400 }
          );
        }
      }

      updateData.templateId = template.id;
    }

    const updated = await db.cV.update({
      where: { id: params.id },
      data: updateData,
      include: {
        template: true,
      },
    });

    return NextResponse.json({ cv: updated });
  } catch (error) {
    console.error("Error updating CV:", error);
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

