import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CVRenderer from "@/app/components/cv/CVRenderer";

export default async function CVRenderPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Handle params as Promise (Next.js 15) or object (Next.js 14)
  const resolvedParams = await Promise.resolve(params);
  const cvId = resolvedParams.id;

  const cv = await db.cV.findUnique({
    where: { id: cvId },
    include: {
      template: true,
    },
  });

  if (!cv || cv.userId !== (session.user.id as string)) {
    return <div>CV bulunamadı</div>;
  }

  const cvData = cv.data as any;

  return (
    <div className="bg-gray-100 min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-[210mm] mx-auto">
        <CVRenderer data={cvData} templateId={cv.templateId} id="cv-content" />
      </div>
    </div>
  );
}

