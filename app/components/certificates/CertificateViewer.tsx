"use client";

import { CertificateTemplate } from "./CertificateTemplate";
import { generatePDFFromElement } from "@/lib/cv/pdf-generator";
import { Download, Share2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface CertificateViewerProps {
  certificate: {
    id: string;
    userName: string;
    courseName: string;
    issuedAt: Date | string;
    certificateNumber: string;
  };
  showActions?: boolean;
}

export function CertificateViewer({
  certificate,
  showActions = true,
}: CertificateViewerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDFFromElement("certificate-template", {
        filename: `Sertifika-${certificate.certificateNumber}.pdf`,
        format: "a4",
        orientation: "portrait",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const verifyUrl = `${window.location.origin}/certificates/verify/${certificate.certificateNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.courseName} Sertifikası`,
          text: `${certificate.userName} adlı kursu tamamladı. Sertifikayı doğrulayın:`,
          url: verifyUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(verifyUrl);
      }
    } else {
      copyToClipboard(verifyUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full">
      {showActions && (
        <div className="mb-6 flex gap-4 justify-end">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? "PDF Oluşturuluyor..." : "PDF İndir"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Kopyalandı!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Paylaş
              </>
            )}
          </button>
        </div>
      )}

      <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
        <CertificateTemplate
          userName={certificate.userName}
          courseName={certificate.courseName}
          issuedAt={new Date(certificate.issuedAt)}
          certificateNumber={certificate.certificateNumber}
        />
      </div>
    </div>
  );
}

