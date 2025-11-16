import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_MIME_PREFIXES = ["image/", "audio/", "video/"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Blob yapılandırması eksik" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya eklenmedi" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Dosya boyutu 25MB'ı aşamaz" }, { status: 400 });
    }

    const isAllowed =
      ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix)) || ALLOWED_MIME_TYPES.includes(file.type);

    if (!isAllowed) {
      return NextResponse.json({ error: "Dosya formatı desteklenmiyor" }, { status: 400 });
    }

    const filePath = `chat/${session.user.id}/${Date.now()}-${file.name}`;

    const blob = await put(filePath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url,
      size: file.size,
      mimeType: file.type,
      name: file.name,
    });
  } catch (error) {
    console.error("[CHAT_UPLOAD_POST]", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

