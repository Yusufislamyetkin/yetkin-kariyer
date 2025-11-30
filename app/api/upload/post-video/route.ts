import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const MAX_DURATION_SECONDS = 30; // 30 seconds
const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // MOV
  "video/x-msvideo", // AVI (optional)
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
    const duration = formData.get("duration") as string | null; // Client-side'dan gelen süre

    if (!file) {
      return NextResponse.json(
        { error: "Dosya eklenmedi" },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Dosya boyutu ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB'ı aşamaz` },
        { status: 400 }
      );
    }

    // Format kontrolü
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece MP4, WebM ve MOV formatları desteklenir" },
        { status: 400 }
      );
    }

    // Süre kontrolü (client-side'dan gelen değer)
    if (duration) {
      const durationSeconds = parseFloat(duration);
      if (isNaN(durationSeconds) || durationSeconds > MAX_DURATION_SECONDS) {
        return NextResponse.json(
          { error: `Video süresi ${MAX_DURATION_SECONDS} saniyeyi aşamaz` },
          { status: 400 }
        );
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "mp4";
    const filePath = `posts/videos/${session.user.id}/${timestamp}.${fileExtension}`;

    // Upload video
    const blob = await put(filePath, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type,
    });

    return NextResponse.json({
      url: blob.url,
      size: file.size,
      mimeType: file.type,
      duration: duration ? parseFloat(duration) : null,
    });
  } catch (error) {
    console.error("[POST_VIDEO_UPLOAD]", error);
    return NextResponse.json(
      { error: "Video yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

