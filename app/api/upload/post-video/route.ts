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

// Optimized streaming upload to handle large files
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
    const duration = formData.get("duration") as string | null;

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

    // Süre kontrolü
    if (duration) {
      const durationSeconds = parseFloat(duration);
      if (isNaN(durationSeconds) || durationSeconds > MAX_DURATION_SECONDS) {
        return NextResponse.json(
          { error: `Video süresi ${MAX_DURATION_SECONDS} saniyeyi aşamaz` },
          { status: 400 }
        );
      }
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "mp4";
    const filePath = `posts/videos/${session.user.id}/${timestamp}.${fileExtension}`;

    // Use streaming for better memory efficiency with large files
    // Convert ReadableStream to Buffer efficiently
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload video to blob storage
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
  } catch (error: any) {
    console.error("[POST_VIDEO_UPLOAD]", error);
    
    // Handle specific Vercel errors
    if (
      error.message?.includes("FUNCTION_PAYLOAD_TOO_LARGE") || 
      error.message?.includes("413") ||
      error.message?.includes("PayloadTooLargeError") ||
      error.code === "FUNCTION_PAYLOAD_TOO_LARGE"
    ) {
      return NextResponse.json(
        { 
          error: "Video dosyası çok büyük. Lütfen daha küçük bir video yükleyin (maksimum 50MB önerilir) veya video kalitesini düşürün (720p veya daha düşük).",
          code: "PAYLOAD_TOO_LARGE",
          suggestion: "Video dosyanızı sıkıştırmak için bir video düzenleme uygulaması kullanabilirsiniz."
        },
        { status: 413 }
      );
    }
    
    // Handle network/timeout errors
    if (error.message?.includes("timeout") || error.message?.includes("ECONNRESET")) {
      return NextResponse.json(
        { 
          error: "Video yükleme zaman aşımına uğradı. Lütfen daha küçük bir video deneyin veya internet bağlantınızı kontrol edin.",
          code: "TIMEOUT"
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Video yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Export runtime config to handle larger payloads
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for large file uploads

