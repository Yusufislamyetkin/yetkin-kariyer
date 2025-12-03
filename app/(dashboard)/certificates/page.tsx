import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ExternalLink, Download } from "lucide-react";
import { getUserCertificates } from "@/lib/certificates/certificate-service";
import { formatCertificateDateShort } from "@/lib/certificates/certificate-utils";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const certificates = await getUserCertificates(session.user.id);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Sertifikalarım
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Tamamladığınız kursların sertifikaları
          </p>
        </div>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Henüz sertifikanız yok
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Bir kursun tüm derslerini tamamladığınızda otomatik olarak sertifika kazanacaksınız.
          </p>
          <Link
            href="/education/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Kurslara Git
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate: any) => (
            <div
              key={certificate.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-6 text-white">
                <Award className="w-12 h-12 mb-3" />
                <h3 className="text-xl font-bold mb-1 line-clamp-2">
                  {certificate.courseName}
                </h3>
                <p className="text-amber-100 text-sm">
                  {formatCertificateDateShort(certificate.issuedAt)}
                </p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Sertifika Numarası
                  </p>
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                    {certificate.certificateNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/certificates/${certificate.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Görüntüle
                  </Link>
                  <Link
                    href={`/certificates/verify/${certificate.certificateNumber}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Doğrula
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

