"use client";

import { formatCertificateDate } from "@/lib/certificates/certificate-utils";

interface CertificateTemplateProps {
  userName: string;
  courseName: string;
  issuedAt: Date;
  certificateNumber: string;
  className?: string;
}

export function CertificateTemplate({
  userName,
  courseName,
  issuedAt,
  certificateNumber,
  className = "",
}: CertificateTemplateProps) {
  const formattedDate = formatCertificateDate(new Date(issuedAt));

  return (
    <div
      id="certificate-template"
      className={`bg-gradient-to-br from-amber-50 via-white to-blue-50 border-8 border-amber-400 shadow-2xl ${className}`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-600 opacity-30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-600 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-600 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-600 opacity-30"></div>

      {/* Watermark pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(139, 69, 19, 0.1) 35px,
            rgba(139, 69, 19, 0.1) 70px
          )`,
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="text-6xl font-serif text-amber-800 mb-2">SERTİFİKA</div>
          <div className="text-xl text-gray-600 font-light tracking-widest">
            CERTIFICATE OF COMPLETION
          </div>
        </div>

        {/* Decorative line */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8"></div>

        {/* Main text */}
        <div className="mb-12 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Bu sertifika, aşağıda adı geçen
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="font-bold text-3xl text-amber-900 block my-4">
              {userName}
            </span>
            kişisinin
          </p>
        </div>

        {/* Course name */}
        <div className="mb-12">
          <div className="text-2xl font-semibold text-amber-800 mb-2">
            {courseName}
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            adlı kursu başarıyla tamamladığını belirtir.
          </p>
        </div>

        {/* Decorative line */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8"></div>

        {/* Date */}
        <div className="mb-16">
          <div className="text-sm text-gray-600 mb-2">Veriliş Tarihi / Date Issued</div>
          <div className="text-lg font-semibold text-gray-800">{formattedDate}</div>
        </div>

        {/* Certificate number */}
        <div className="mt-auto pt-8 border-t-2 border-amber-300 w-full">
          <div className="text-xs text-gray-500 mb-1">Sertifika Numarası / Certificate Number</div>
          <div className="text-sm font-mono text-gray-700">{certificateNumber}</div>
        </div>

        {/* Footer decorative elements */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-amber-400 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-amber-200 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500 font-serif italic">
              Verified Certificate
            </div>
            <div className="w-16 h-16 border-2 border-amber-400 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-amber-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

