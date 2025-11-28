import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CVRenderer from "@/app/components/cv/CVRenderer";
import { verifyPdfToken } from "@/lib/cv/pdf-token";

export default async function CVRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ pdf?: string; token?: string }> | { pdf?: string; token?: string };
}) {
  // Handle params as Promise (Next.js 15) or object (Next.js 14)
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams || {});
  const cvId = resolvedParams.id;
  const isPdfRequest = resolvedSearchParams.pdf === "true";
  const pdfToken = resolvedSearchParams.token;

  // Check if this is a PDF generation request with valid token
  let authorized = false;
  let userId: string | null = null;

  if (isPdfRequest && pdfToken) {
    // Get CV first to verify token
    const cv = await db.cV.findUnique({
      where: { id: cvId },
      select: { userId: true },
    });

    if (cv) {
      // Verify token
      const verification = verifyPdfToken(pdfToken, cvId, cv.userId);
      if (verification.valid) {
        authorized = true;
        userId = cv.userId;
      }
    }
  } else {
    // Regular request - check session
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }
    authorized = true;
    userId = session.user.id as string;
  }

  if (!authorized || !userId) {
    return <div>CV bulunamadı veya erişim reddedildi</div>;
  }

  const cv = await db.cV.findUnique({
    where: { id: cvId },
    include: {
      template: true,
    },
  });

  if (!cv || cv.userId !== userId) {
    return <div>CV bulunamadı</div>;
  }

  const cvData = cv.data as any;

  return (
    <div className="bg-gray-100 min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-[210mm] mx-auto">
        {/* Font and print CSS for Turkish characters and A4 layout */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap"
        />
        <style>{`
          @page { size: A4; margin: 0; }
          #cv-content { font-family: 'Noto Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
          html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}</style>
        <CVRenderer data={cvData} templateId={cv.templateId} id="cv-content" />
      </div>
    </div>
  );
}

