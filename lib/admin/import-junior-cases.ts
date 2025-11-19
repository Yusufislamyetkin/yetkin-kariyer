// Junior seviye canlı kodlama case'lerini veritabanına ekleyen fonksiyon
import fs from "fs";
import path from "path";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getJuniorCaseTemplate } from "@/lib/education/juniorCaseTemplates";

interface JuniorCase {
  id: string;
  title: string;
  description: string;
  taskDescription: string;
  level: string;
  timeLimitMinutes: number;
  acceptanceCriteria: string[];
}

interface JuniorCaseFile {
  language: string;
  languageName: string;
  cases: JuniorCase[];
}

export async function importJuniorCases(): Promise<{
  success: boolean;
  imported: number;
  errors: Array<{ file: string; caseId: string; error: string }>;
}> {
  const juniorCasesDir = path.join(process.cwd(), "data", "live-coding", "junior-cases");
  
  if (!fs.existsSync(juniorCasesDir)) {
    return {
      success: false,
      imported: 0,
      errors: [{ file: "directory", caseId: "all", error: `Junior cases dizini bulunamadı: ${juniorCasesDir}` }],
    };
  }

  const files = fs.readdirSync(juniorCasesDir).filter(f => f.endsWith("-junior-cases.json"));
  
  if (files.length === 0) {
    return {
      success: false,
      imported: 0,
      errors: [{ file: "directory", caseId: "all", error: "Junior case JSON dosyası bulunamadı" }],
    };
  }

  let totalImported = 0;
  const errors: Array<{ file: string; caseId: string; error: string }> = [];

  for (const file of files) {
    const filePath = path.join(juniorCasesDir, file);
    const language = file.replace("-junior-cases.json", "");

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data: JuniorCaseFile = JSON.parse(content);

      if (!data.cases || !Array.isArray(data.cases)) {
        errors.push({ file, caseId: "all", error: "Geçersiz dosya yapısı" });
        continue;
      }

      // Find or create course for this language
      const courseId = `course-${language}-junior`;
      let course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        course = await db.course.create({
          data: {
            id: courseId,
            title: `${data.languageName} Junior Canlı Kodlama`,
            description: `${data.languageName} programlama dili için junior seviye canlı kodlama case'leri`,
            topic: data.languageName,
            difficulty: "beginner",
            content: {},
          },
        });
      }

      // Import each case
      for (const caseItem of data.cases) {
        try {
          // Check if quiz already exists
          const existingQuiz = await db.quiz.findUnique({
            where: { id: caseItem.id },
          });

          if (existingQuiz) {
            continue; // Skip if already exists
          }

          // Get initial code template
          const initialCode = getJuniorCaseTemplate(language);

          // Map language id to LiveCodingLanguage format
          const languageMap: Record<string, string> = {
            csharp: "csharp",
            java: "java",
            python: "python",
            javascript: "javascript",
            typescript: "javascript",
            go: "javascript",
            rust: "javascript",
            cpp: "javascript",
            kotlin: "java",
            swift: "javascript",
            php: "javascript",
            ruby: "python",
            scala: "java",
            dart: "javascript",
            r: "python",
          };
          
          const mappedLanguage = languageMap[language] || "csharp";
          const taskLanguages = [mappedLanguage] as any[];

          // Create task
          const task = {
            id: `task-${caseItem.id}`,
            title: caseItem.title,
            description: caseItem.taskDescription,
            languages: taskLanguages,
            timeLimitMinutes: caseItem.timeLimitMinutes || 30,
            acceptanceCriteria: caseItem.acceptanceCriteria || [
              "Kod derlenmeli ve hatasız çalışmalı",
              "Beklenen çıktıyı üretmeli",
              "Kod okunabilir ve temiz olmalı",
            ],
            initialCode: {
              [mappedLanguage]: initialCode,
            },
          };

          // Questions JSON
          const questions: Prisma.InputJsonValue = {
            tasks: [task],
            instructions: caseItem.description || `${caseItem.title} konusunda pratik yapın. Görevi tamamlamak için verilen kriterleri karşılamalısınız.`,
          };

          // Create quiz
          await db.quiz.create({
            data: {
              id: caseItem.id,
              courseId: course.id,
              title: caseItem.title,
              description: caseItem.description,
              topic: data.languageName,
              type: "LIVE_CODING",
              level: caseItem.level || "beginner",
              questions,
              passingScore: 60,
            },
          });

          totalImported++;
        } catch (error: any) {
          const errorMsg = error.message || "Bilinmeyen hata";
          errors.push({
            file,
            caseId: caseItem.id,
            error: errorMsg,
          });
        }
      }
    } catch (error: any) {
      errors.push({ file, caseId: "all", error: error.message || "Dosya okuma hatası" });
    }
  }

  return {
    success: totalImported > 0,
    imported: totalImported,
    errors,
  };
}

