import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserCertificates, generateCertificate } from "@/lib/certificates/certificate-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await getUserCertificates(session.user.id);
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Sertifikalar getirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, userName } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const certificate = await generateCertificate(
      session.user.id,
      courseId,
      userName
    );

    if (!certificate) {
      return NextResponse.json(
        { error: "Kurs tamamlanmamış veya sertifika oluşturulamadı." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: error.message || "Sertifika oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}

