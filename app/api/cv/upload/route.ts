import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob yapılandırması eksik" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const cvId = formData.get("cvId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya eklenmedi" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'ı aşamaz" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece PDF veya Word (DOC/DOCX) yüklenebilir" },
        { status: 400 }
      );
    }

    // If cvId is provided, verify it belongs to the user
    if (cvId) {
      const cv = await db.cV.findUnique({
        where: { id: cvId },
        select: { userId: true },
      });

      if (!cv || cv.userId !== (session.user.id as string)) {
        return NextResponse.json(
          { error: "CV bulunamadı veya erişim reddedildi" },
          { status: 403 }
        );
      }
    }

    const sanitizedName = file.name.replace(/[^\w.\-]+/g, "_");
    const filePath = `cv-uploads/${session.user.id}/${Date.now()}-${sanitizedName}`;

    const blob = await put(filePath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const upload = await (db as any).cVUpload?.create?.({
      data: {
        userId: session.user.id as string,
        ...(cvId && { cvId }),
        url: blob.url,
        name: sanitizedName,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ upload });
  } catch (error) {
    console.error("[CV_UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "CV yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}


