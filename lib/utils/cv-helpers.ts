import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { DEFAULT_TEMPLATES } from "@/app/api/cv/templates/defaultTemplates";

/**
 * Creates minimal CV data structure for PDF uploads
 */
export function createMinimalCvData(pdfUrl: string, fileName: string) {
  return {
    personalInfo: {
      name: "PDF CV",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      website: "",
    },
    summary: "Yüklenen PDF CV",
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    achievements: [],
    certifications: [],
    references: [],
    hobbies: [],
    pdfUpload: true,
    pdfUrl: pdfUrl,
    pdfFileName: fileName,
  };
}

/**
 * Gets or creates a default template for PDF CVs
 * Uses "classic" template as default
 */
export async function getOrCreateDefaultTemplate() {
  const defaultTemplateId = "classic";
  
  // Try to find existing template
  let template = await db.cVTemplate.findUnique({
    where: { id: defaultTemplateId },
  });

  if (!template) {
    // Find in default templates
    const fallbackTemplate = DEFAULT_TEMPLATES.find(
      (item) => item.id === defaultTemplateId
    );

    if (fallbackTemplate) {
      template = await db.cVTemplate.create({
        data: {
          id: fallbackTemplate.id,
          name: fallbackTemplate.name,
          preview: fallbackTemplate.preview,
          structure: fallbackTemplate.structure as Prisma.InputJsonValue,
        },
      });
    } else {
      // Fallback to first available template
      const firstTemplate = DEFAULT_TEMPLATES[0];
      if (firstTemplate) {
        template = await db.cVTemplate.findUnique({
          where: { id: firstTemplate.id },
        }) || await db.cVTemplate.create({
          data: {
            id: firstTemplate.id,
            name: firstTemplate.name,
            preview: firstTemplate.preview,
            structure: firstTemplate.structure as Prisma.InputJsonValue,
          },
        });
      }
    }
  }

  if (!template) {
    throw new Error("CV şablonu bulunamadı");
  }

  return template;
}

