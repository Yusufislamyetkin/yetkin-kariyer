import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCertificateById } from "@/lib/certificates/certificate-service";

/**
 * This endpoint returns certificate data for client-side PDF generation
 * Actual PDF generation is done client-side using jsPDF + html2canvas
 */
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

    // Return certificate data for PDF generation
    return NextResponse.json({
      certificate: {
        id: certificate.id,
        userName: certificate.userName,
        courseName: certificate.courseName,
        issuedAt: certificate.issuedAt,
        certificateNumber: certificate.certificateNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching certificate for PDF:", error);
    return NextResponse.json(
      { error: "Sertifika getirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

