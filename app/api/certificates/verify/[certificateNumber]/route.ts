import { NextResponse } from "next/server";
import { getCertificateByNumber } from "@/lib/certificates/certificate-service";

export async function GET(
  request: Request,
  { params }: { params: { certificateNumber: string } }
) {
  try {
    const certificate = await getCertificateByNumber(params.certificateNumber);

    if (!certificate) {
      return NextResponse.json(
        { error: "Sertifika bulunamadı veya geçersiz." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        userName: certificate.userName,
        courseName: certificate.courseName,
        issuedAt: certificate.issuedAt,
        certificateNumber: certificate.certificateNumber,
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Sertifika doğrulanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

