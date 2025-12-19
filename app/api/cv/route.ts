import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { DEFAULT_TEMPLATES } from "./templates/defaultTemplates";
import { generateInterviewForCV } from "@/lib/background/cv-interview-generator";
import { checkUserSubscription } from "@/lib/services/subscription-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    
    // Debug: Log userId to help diagnose the issue
    console.log("Fetching CVs for userId:", userId);

    const cvs = await db.cV.findMany({
      where: { userId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
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
      orderBy: { updatedAt: "desc" },
    });

    // Debug: Log found CVs
    console.log(`Found ${cvs.length} CVs for userId: ${userId}`);

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json(
      { error: "CV'ler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Abonelik kontrolü
    const subscription = await checkUserSubscription(session.user.id as string);
    if (!subscription || !subscription.isActive) {
      return NextResponse.json(
        {
          error: "Abone değilsiniz. Lütfen bir abonelik planı seçin.",
          redirectTo: "/fiyatlandirma",
          requiresSubscription: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { templateId, data } = body as {
      templateId?: string;
      data?: unknown;
    };

    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Geçerli bir şablon kimliği gereklidir" },
        { status: 400 }
      );
    }

    if (data === undefined) {
      return NextResponse.json(
        { error: "CV verisi eksik" },
        { status: 400 }
      );
    }

    let template = await db.cVTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      const fallbackTemplate = DEFAULT_TEMPLATES.find(
        (item) => item.id === templateId
      );

      if (fallbackTemplate) {
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

    const cv = await db.cV.create({
      data: {
        userId: session.user.id as string,
        templateId: template.id,
        data: data as any,
      },
      include: {
        template: true,
      },
    });

    // Arka planda mülakat oluşturmayı tetikle (fire-and-forget)
    if (process.env.OPENAI_API_KEY) {
      // Fire and forget - don't await
      generateInterviewForCV(cv.id, session.user.id as string).catch((error) => {
        // Silently fail - interview can be generated later
        console.error("[CV_CREATE] Background interview generation failed:", error);
      });
    }

    return NextResponse.json({ cv }, { status: 201 });
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json(
      { error: "CV oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

