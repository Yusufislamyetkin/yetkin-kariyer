import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCertificateById } from "@/lib/certificates/certificate-service";
import { CertificateViewer } from "@/app/components/certificates/CertificateViewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CertificatePageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificateDetailPage({
  params,
}: CertificatePageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const certificate = await getCertificateById(id, session.user.id);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/certificates"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Sertifikalara Dön</span>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {certificate.courseName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sertifika Numarası: {certificate.certificateNumber}
        </p>
      </div>

      {/* Certificate Viewer */}
      <CertificateViewer
        certificate={{
          id: certificate.id,
          userName: certificate.userName,
          courseName: certificate.courseName,
          issuedAt: certificate.issuedAt,
          certificateNumber: certificate.certificateNumber,
        }}
        showActions={true}
      />
    </div>
  );
}

