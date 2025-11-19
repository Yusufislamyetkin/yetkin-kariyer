import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const upload = await (db as any).cVUpload?.findUnique?.({
      where: { id: params.id },
    });

    if (!upload || upload.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
    }

    const url = new URL(request.url);
    const forceDownload = url.searchParams.get("download") === "1";

    // Simple redirect with appropriate disposition suggestion
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `${forceDownload ? "attachment" : "inline"}; filename="${upload.name}"`
    );
    // Let the blob serve with correct content-type
    headers.set("Content-Type", upload.mimeType || "application/octet-stream");

    return NextResponse.redirect(upload.url, { headers, status: 302 });
  } catch (error) {
    console.error("[CV_UPLOAD_VIEW_GET]", error);
    return NextResponse.json(
      { error: "Dosya görüntülenemedi" },
      { status: 500 }
    );
  }
}


