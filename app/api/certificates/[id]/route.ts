import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCertificateById } from "@/lib/certificates/certificate-service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const certificate = await getCertificateById(params.id, userId);

    if (!certificate) {
      return NextResponse.json({ error: "Sertifika bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { error: "Sertifika getirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

