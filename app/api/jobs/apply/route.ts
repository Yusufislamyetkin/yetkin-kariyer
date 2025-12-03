import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { recordEvent } from "@/lib/services/gamification/antiAbuse";
import { applyRules } from "@/lib/services/gamification/rules";
import { put } from "@vercel/blob";
import { createMinimalCvData, getOrCreateDefaultTemplate } from "@/lib/utils/cv-helpers";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["application/pdf"];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let jobId: string;
    let cvId: string | undefined;

    // Check if request is FormData (PDF upload) or JSON (existing CV)
    if (contentType.includes("multipart/form-data")) {
      // PDF upload mode
      const formData = await request.formData();
      jobId = formData.get("jobId") as string;
      const pdfFile = formData.get("pdfFile") as File | null;

      if (!jobId) {
        return NextResponse.json(
          { error: "İş ilanı ID'si gereklidir" },
          { status: 400 }
        );
      }

      if (!pdfFile || pdfFile.size === 0) {
        return NextResponse.json(
          { error: "PDF dosyası gereklidir" },
          { status: 400 }
        );
      }

      // Validate file
      if (pdfFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Dosya boyutu 10MB'ı aşamaz" },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(pdfFile.type)) {
        return NextResponse.json(
          { error: "Sadece PDF dosyaları kabul edilir" },
          { status: 400 }
        );
      }

      // Upload PDF to Vercel Blob
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { error: "Blob yapılandırması eksik" },
          { status: 500 }
        );
      }

      const sanitizedName = pdfFile.name.replace(/[^\w.\-]+/g, "_");
      const filePath = `job-applications/${session.user.id}/${Date.now()}-${sanitizedName}`;

      const blob = await put(filePath, pdfFile, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      // Get or create default template
      const template = await getOrCreateDefaultTemplate();

      // Create minimal CV with PDF reference
      const cvData = createMinimalCvData(blob.url, sanitizedName);
      const cv = await db.cV.create({
        data: {
          userId: session.user.id as string,
          templateId: template.id,
          data: cvData as any,
        },
      });

      // Create CVUpload record
      await db.cVUpload.create({
        data: {
          cvId: cv.id,
          userId: session.user.id as string,
          url: blob.url,
          name: sanitizedName,
          mimeType: pdfFile.type,
          size: pdfFile.size,
        },
      });

      cvId = cv.id;
    } else {
      // Existing CV mode (JSON)
      const body = await request.json();
      jobId = body.jobId;
      cvId = body.cvId;

      if (!jobId || !cvId) {
        return NextResponse.json(
          { error: "İş ilanı ID'si ve CV ID'si gereklidir" },
          { status: 400 }
        );
      }
    }

    // Check if already applied
    const existing = await db.jobApplication.findFirst({
      where: {
        jobId,
        userId: session.user.id as string,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu ilana zaten başvurdunuz" },
        { status: 400 }
      );
    }

    if (!cvId) {
      return NextResponse.json(
        { error: "CV ID'si bulunamadı" },
        { status: 400 }
      );
    }

    const application = await db.jobApplication.create({
      data: {
        jobId,
        userId: session.user.id as string,
        cvId,
        status: "pending",
      },
      include: {
        job: {
          select: {
            title: true,
          },
        },
        cv: {
          select: {
            id: true,
          },
        },
      },
    });

    // Emit gamification event
    try {
      const event = await recordEvent({
        userId: session.user.id as string,
        type: "job_application",
        payload: { jobId },
      });
      await applyRules({ userId: session.user.id as string, type: "job_application", payload: { sourceEventId: event.id } });
    } catch (e) {
      console.warn("Gamification job_application failed:", e);
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { error: "Başvuru yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

