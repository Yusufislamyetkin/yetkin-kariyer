import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { createThumbnail } from "@/lib/image-optimization";
import sharp from "sharp";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
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
        { error: "Dosya boyutu 5MB'ı aşamaz" },
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

    // Optimize image (profile images should be smaller, max 512x512)
    // First resize manually for profile images
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    let width = metadata.width || 512;
    let height = metadata.height || 512;
    const maxSize = 512;
    
    if (width > maxSize || height > maxSize) {
      const aspectRatio = width / height;
      if (width > height) {
        width = maxSize;
        height = Math.round(maxSize / aspectRatio);
      } else {
        height = maxSize;
        width = Math.round(maxSize * aspectRatio);
      }
    }
    
    // Use rotate() to automatically handle EXIF orientation from mobile devices
    const resizedBuffer = await image
      .rotate()
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
    
    const optimized = {
      buffer: resizedBuffer,
      width,
      height,
      format: "webp" as const,
      size: resizedBuffer.length,
    };
    
    // Create thumbnail (320x320 for profile)
    const thumbnail = await createThumbnail(buffer, "webp");

    const timestamp = Date.now();
    const filePath = `profiles/${session.user.id}/${timestamp}.webp`;
    const thumbnailPath = `profiles/${session.user.id}/${timestamp}_thumb.webp`;

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
    console.error("[PROFILE_IMAGE_UPLOAD]", error);
    return NextResponse.json(
      { error: "Profil görseli yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

