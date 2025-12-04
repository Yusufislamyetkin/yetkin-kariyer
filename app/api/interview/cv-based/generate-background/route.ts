import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInterviewForCV } from "@/lib/background/cv-interview-generator";

export const maxDuration = 60; // 60 seconds timeout for Vercel

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cvId } = body;

    if (!cvId || typeof cvId !== "string") {
      return NextResponse.json(
        { error: "CV ID gereklidir" },
        { status: 400 }
      );
    }

    const result = await generateInterviewForCV(cvId, session.user.id as string);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Mülakat oluşturulamadı" },
        { status: result.error === "CV bulunamadı" ? 404 : result.error === "Bu CV'ye erişim yetkiniz yok" ? 403 : 500 }
      );
    }

    if (result.alreadyExists) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Bu CV için zaten mülakat mevcut",
          interviewId: result.interviewId 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        interviewId: result.interviewId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CV_INTERVIEW_BG] Genel hata:", error);
    return NextResponse.json(
      { error: `Mülakat oluşturulurken bir hata oluştu: ${error?.message || "Bilinmeyen hata"}` },
      { status: 500 }
    );
  }
}

