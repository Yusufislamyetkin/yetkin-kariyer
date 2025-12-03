import { getCertificateByNumber } from "@/lib/certificates/certificate-service";
import { CertificateViewer } from "@/app/components/certificates/CertificateViewer";
import { notFound } from "next/navigation";
import { CheckCircle2, Shield } from "lucide-react";

interface VerifyCertificatePageProps {
  params: Promise<{ certificateNumber: string }>;
}

export default async function VerifyCertificatePage({
  params,
}: VerifyCertificatePageProps) {
  const { certificateNumber } = await params;
  const certificate = await getCertificateByNumber(certificateNumber);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Doğrulanmış Sertifika
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Bu sertifika geçerlidir ve doğrulanmıştır
          </p>
        </div>

        {/* Verification Badge */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500 p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Sertifika Bilgileri
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aşağıdaki bilgiler bu sertifikanın geçerliliğini doğrular
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Kurs Adı
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {certificate.courseName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Sertifika Numarası
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {certificate.certificateNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Veriliş Tarihi
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {new Intl.DateTimeFormat("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(certificate.issuedAt))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Durum
              </p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Doğrulandı
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
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

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Bu sertifika{" "}
            <a
              href="https://ytkacademy.com"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              YTK Academy
            </a>{" "}
            tarafından verilmiştir ve doğrulanmıştır.
          </p>
        </div>
      </div>
    </div>
  );
}

