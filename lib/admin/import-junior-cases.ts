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

  // Map language id to LiveCodingLanguage format
  const languageMap: Record<string, "csharp" | "java" | "python" | "javascript"> = {
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

  // Track how many cases have been imported for each target language
  const targetLanguageCounts: Record<"csharp" | "java" | "python" | "javascript", number> = {
    csharp: 0,
    java: 0,
    python: 0,
    javascript: 0,
  };

  // First, collect all cases grouped by target language
  const casesByTargetLanguage: Record<"csharp" | "java" | "python" | "javascript", Array<{ file: string; caseItem: JuniorCase; language: string; languageName: string }>> = {
    csharp: [],
    java: [],
    python: [],
    javascript: [],
  };

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

      const mappedLanguage = languageMap[language] || "csharp";
      
      // Collect cases for this target language
      for (const caseItem of data.cases) {
        casesByTargetLanguage[mappedLanguage].push({
          file,
          caseItem,
          language,
          languageName: data.languageName,
        });
      }
    } catch (error: any) {
      errors.push({ file, caseId: "all", error: error.message || "Dosya okuma hatası" });
    }
  }

  // Now import exactly 6 cases per target language
  for (const targetLanguage of ["csharp", "java", "python", "javascript"] as const) {
    const cases = casesByTargetLanguage[targetLanguage];
    
    if (cases.length === 0) {
      console.log(`[IMPORT_JUNIOR_CASES] No cases found for target language: ${targetLanguage}`);
      continue;
    }

    // Find or create course for this target language
    const courseId = `course-${targetLanguage}-junior`;
    let course = await db.course.findUnique({
      where: { id: courseId },
    });

    const languageNames: Record<typeof targetLanguage, string> = {
      csharp: "C#",
      java: "Java",
      python: "Python",
      javascript: "JavaScript",
    };

    if (!course) {
      course = await db.course.create({
        data: {
          id: courseId,
          title: `${languageNames[targetLanguage]} Junior Canlı Kodlama`,
          description: `${languageNames[targetLanguage]} programlama dili için junior seviye canlı kodlama case'leri`,
          topic: languageNames[targetLanguage],
          difficulty: "beginner",
          content: {},
        },
      });
    }

    // Import exactly 6 cases for this target language
    const casesToImport = cases.slice(0, 6);
    
    console.log(`[IMPORT_JUNIOR_CASES] Importing ${casesToImport.length} cases for ${targetLanguage} (${cases.length} total available)`);
    
    for (const { file, caseItem } of casesToImport) {
        try {
          // Check if quiz already exists
          const existingQuiz = await db.quiz.findUnique({
            where: { id: caseItem.id },
          });

          // Get initial code template for the target language
          const initialCode = getJuniorCaseTemplate(targetLanguage);

          // Ensure languages array is properly typed as LiveCodingLanguage[]
          const taskLanguages: ("csharp" | "java" | "python" | "javascript")[] = [targetLanguage];

          // Validate that we have at least one valid language
          if (taskLanguages.length === 0) {
            throw new Error(`No valid language for ${targetLanguage}`);
          }

          // Create task with proper structure matching LiveCodingTask interface
          const task = {
            id: `task-${caseItem.id}`,
            title: caseItem.title,
            description: caseItem.taskDescription,
            languages: taskLanguages, // Array of LiveCodingLanguage
            timeLimitMinutes: caseItem.timeLimitMinutes || 30,
            acceptanceCriteria: Array.isArray(caseItem.acceptanceCriteria) && caseItem.acceptanceCriteria.length > 0
              ? caseItem.acceptanceCriteria
              : [
                  "Kod derlenmeli ve hatasız çalışmalı",
                  "Beklenen çıktıyı üretmeli",
                  "Kod okunabilir ve temiz olmalı",
                ],
            initialCode: {
              [targetLanguage]: initialCode,
            } as Record<string, string>,
          };

          // Questions JSON - structure must match what normalizeLiveCodingPayload expects
          // It expects: { tasks: LiveCodingTask[], instructions?: string }
          const questions: Prisma.InputJsonValue = {
            tasks: [task],
            instructions: caseItem.description || `${caseItem.title} konusunda pratik yapın. Görevi tamamlamak için verilen kriterleri karşılamalısınız.`,
          };

          // Validate task structure before saving
          if (!task.id || !task.title || !task.description || !Array.isArray(task.languages) || task.languages.length === 0) {
            throw new Error(`Invalid task structure for ${caseItem.id}: missing required fields`);
          }

          // Update existing quiz or create new one
          if (existingQuiz) {
            console.log(`[IMPORT_JUNIOR_CASES] Quiz ${caseItem.id} already exists, updating...`);
            await db.quiz.update({
              where: { id: caseItem.id },
              data: {
                title: caseItem.title,
                description: caseItem.description,
                topic: languageNames[targetLanguage],
                level: (caseItem.level === "beginner" || caseItem.level === "intermediate" || caseItem.level === "advanced")
                  ? caseItem.level
                  : "beginner",
                questions,
              },
            });
          } else {
            // Create quiz
            await db.quiz.create({
              data: {
                id: caseItem.id,
                courseId: course.id,
                title: caseItem.title,
                description: caseItem.description,
                topic: languageNames[targetLanguage],
                type: "LIVE_CODING",
                level: (caseItem.level === "beginner" || caseItem.level === "intermediate" || caseItem.level === "advanced")
                  ? caseItem.level
                  : "beginner",
                questions,
                passingScore: 60,
              },
            });
          }

          console.log(`[IMPORT_JUNIOR_CASES] Successfully imported case: ${caseItem.id} for target language: ${targetLanguage}`, {
            quizId: caseItem.id,
            title: caseItem.title,
            targetLanguage,
            taskLanguages: taskLanguages,
            courseId: course.id,
          });
          totalImported++;
          targetLanguageCounts[targetLanguage]++;
        } catch (error: any) {
          const errorMsg = error.message || "Bilinmeyen hata";
          errors.push({
            file,
            caseId: caseItem.id,
            error: errorMsg,
          });
        }
      }
  }

  console.log(`[IMPORT_JUNIOR_CASES] Import completed`, {
    totalImported,
    byLanguage: targetLanguageCounts,
    errors: errors.length,
  });

  return {
    success: totalImported > 0,
    imported: totalImported,
    errors,
  };
}

