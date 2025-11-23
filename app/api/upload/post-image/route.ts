import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { optimizeImage, createThumbnail } from "@/lib/image-optimization";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

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

    if (!file) {
      return NextResponse.json(
        { error: "Dosya eklenmedi" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'ı aşamaz" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG ve WebP formatları desteklenir" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image to max 1080p and convert to WebP
    const optimized = await optimizeImage(buffer, "webp");
    
    // Create thumbnail
    const thumbnail = await createThumbnail(buffer, "webp");

    const timestamp = Date.now();
    const filePath = `posts/${session.user.id}/${timestamp}.webp`;
    const thumbnailPath = `posts/${session.user.id}/${timestamp}_thumb.webp`;

    // Upload optimized image
    const blob = await put(filePath, optimized.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "image/webp",
    });

    // Upload thumbnail
    const thumbnailBlob = await put(thumbnailPath, thumbnail.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "image/webp",
    });

    return NextResponse.json({
      url: blob.url,
      thumbnailUrl: thumbnailBlob.url,
      size: optimized.size,
      originalSize: file.size,
      width: optimized.width,
      height: optimized.height,
      mimeType: "image/webp",
    });
  } catch (error) {
    console.error("[POST_IMAGE_UPLOAD]", error);
    return NextResponse.json(
      { error: "Görsel yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

