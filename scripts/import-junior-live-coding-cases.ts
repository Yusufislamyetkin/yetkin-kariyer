// Junior seviye canlı kodlama case'lerini veritabanına ekleyen script
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { getJuniorCaseTemplate } from "../lib/education/juniorCaseTemplates";

const prisma = new PrismaClient();

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

async function importJuniorCases() {
  const juniorCasesDir = path.join(process.cwd(), "data", "live-coding", "junior-cases");
  
  if (!fs.existsSync(juniorCasesDir)) {
    console.error("❌ Junior cases dizini bulunamadı:", juniorCasesDir);
    return;
  }

  const files = fs.readdirSync(juniorCasesDir).filter(f => f.endsWith("-junior-cases.json"));
  
  if (files.length === 0) {
    console.error("❌ Junior case JSON dosyası bulunamadı");
    return;
  }

  console.log(`📁 ${files.length} dil için case dosyası bulundu\n`);

  let totalImported = 0;
  let totalErrors = 0;
  const errors: Array<{ file: string; caseId: string; error: string }> = [];

  for (const file of files) {
    const filePath = path.join(juniorCasesDir, file);
    const language = file.replace("-junior-cases.json", "");

    console.log(`📝 İşleniyor: ${file} (${language})`);

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data: JuniorCaseFile = JSON.parse(content);

      if (!data.cases || !Array.isArray(data.cases)) {
        console.error(`  ❌ Geçersiz dosya yapısı: ${file}`);
        continue;
      }

      // Find or create course for this language
      const courseId = `course-${language}-junior`;
      let course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        course = await prisma.course.create({
          data: {
            id: courseId,
            title: `${data.languageName} Junior Canlı Kodlama`,
            description: `${data.languageName} programlama dili için junior seviye canlı kodlama case'leri`,
            topic: data.languageName,
            difficulty: "beginner",
            content: {},
          },
        });
        console.log(`  ✅ Course oluşturuldu: ${courseId}`);
      }

      // Import each case
      for (const caseItem of data.cases) {
        try {
          // Check if quiz already exists
          const existingQuiz = await prisma.quiz.findUnique({
            where: { id: caseItem.id },
          });

          if (existingQuiz) {
            console.log(`  ⚠️  Quiz zaten mevcut: ${caseItem.id}`);
            continue;
          }

          // Get initial code template
          const initialCode = getJuniorCaseTemplate(language);

          // Create task
          // Map language id to LiveCodingLanguage format
          const languageMap: Record<string, string> = {
            csharp: "csharp",
            java: "java",
            python: "python",
            javascript: "javascript",
            typescript: "javascript", // Map to supported
            go: "javascript", // Map to supported
            rust: "javascript", // Map to supported
            cpp: "javascript", // Map to supported
            kotlin: "java", // Map to supported
            swift: "javascript", // Map to supported
            php: "javascript", // Map to supported
            ruby: "python", // Map to supported
            scala: "java", // Map to supported
            dart: "javascript", // Map to supported
            r: "python", // Map to supported
          };
          
          const mappedLanguage = languageMap[language] || "csharp";
          const taskLanguages = [mappedLanguage] as any[];

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
          await prisma.quiz.create({
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
          console.log(`  ✅ Case eklendi: ${caseItem.title} (${caseItem.id})`);
        } catch (error: any) {
          totalErrors++;
          const errorMsg = error.message || "Bilinmeyen hata";
          errors.push({
            file,
            caseId: caseItem.id,
            error: errorMsg,
          });
          console.error(`  ❌ Hata (${caseItem.id}): ${errorMsg}`);
        }
      }

      console.log(`✅ ${file} tamamlandı (${data.cases.length} case)\n`);
    } catch (error: any) {
      console.error(`❌ Dosya okuma hatası (${file}): ${error.message}\n`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Özet:");
  console.log(`  ✅ Başarıyla eklenen: ${totalImported}`);
  console.log(`  ❌ Hata sayısı: ${totalErrors}`);

  if (errors.length > 0) {
    console.log("\n❌ Hatalar:");
    errors.forEach((e) => {
      console.log(`  - ${e.file} / ${e.caseId}: ${e.error}`);
    });
  }

  console.log("\n🎉 Import işlemi tamamlandı!");
}

// Run import
importJuniorCases()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

