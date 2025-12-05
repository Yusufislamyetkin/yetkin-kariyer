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

    // Fetch the file from blob storage and proxy it
    try {
      const fileResponse = await fetch(upload.url);
      if (!fileResponse.ok) {
        throw new Error("Dosya alınamadı");
      }

      const fileBuffer = await fileResponse.arrayBuffer();
      const headers = new Headers();
      headers.set(
        "Content-Disposition",
        `${forceDownload ? "attachment" : "inline"}; filename="${upload.name}"`
      );
      headers.set("Content-Type", upload.mimeType || "application/octet-stream");
      headers.set("Content-Length", fileBuffer.byteLength.toString());
      // Allow iframe embedding
      headers.set("X-Frame-Options", "SAMEORIGIN");
      headers.set("Content-Security-Policy", "frame-ancestors 'self'");

      return new NextResponse(fileBuffer, { headers });
    } catch (error) {
      console.error("[CV_UPLOAD_VIEW_PROXY]", error);
      // Fallback to redirect if proxy fails
      const headers = new Headers();
      headers.set(
        "Content-Disposition",
        `${forceDownload ? "attachment" : "inline"}; filename="${upload.name}"`
      );
      headers.set("Content-Type", upload.mimeType || "application/octet-stream");
      return NextResponse.redirect(upload.url, { headers, status: 302 });
    }
  } catch (error) {
    console.error("[CV_UPLOAD_VIEW_GET]", error);
    return NextResponse.json(
      { error: "Dosya görüntülenemedi" },
      { status: 500 }
    );
  }
}


