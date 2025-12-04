import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInterviewForCV } from "@/lib/background/cv-interview-generator";
import { verifyQStashSignature } from "@/lib/qstash";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for Vercel (QStash sayesinde timeout riski azalır)

export async function POST(request: Request) {
  try {
    // Body'yi önce al (sadece bir kez okunabilir)
    const bodyText = await request.text();
    
    // QStash webhook signature verification
    // Header case-insensitive olabilir, her iki format'ı kontrol et
    const signature = request.headers.get("Upstash-Signature") || request.headers.get("upstash-signature");
    const isQStashRequest = signature !== null;
    
    if (isQStashRequest) {
      // QStash'ten gelen request'i doğrula
      const isValid = verifyQStashSignature(signature, bodyText, request.url);
      if (!isValid) {
        console.error("[CV_INTERVIEW_BG] Invalid QStash signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } else {
      // Direct call için session kontrolü (backward compatibility)
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Body'yi parse et
    let body: any;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { cvId, userId } = body;

    if (!cvId || typeof cvId !== "string") {
      return NextResponse.json(
        { error: "CV ID gereklidir" },
        { status: 400 }
      );
    }

    // userId'yi belirle: QStash request'lerinde body'den, direct call'larda session'dan
    let finalUserId: string;
    if (isQStashRequest) {
      if (!userId || typeof userId !== "string") {
        return NextResponse.json(
          { error: "User ID gereklidir" },
          { status: 400 }
        );
      }
      finalUserId = userId;
    } else {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      finalUserId = session.user.id as string;
    }

    const result = await generateInterviewForCV(cvId, finalUserId);

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

