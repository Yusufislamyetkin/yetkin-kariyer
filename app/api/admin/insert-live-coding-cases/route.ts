import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import liveCodingCases from "@/data/live-coding-cases.json";
import type { LiveCodingLanguage } from "@/types/live-coding";

const LANGUAGE_TO_LIVECODING: Record<string, LiveCodingLanguage> = {
  csharp: "csharp",
  java: "java",
  python: "python",
  php: "php",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  cpp: "cpp",
  kotlin: "kotlin",
  swift: "javascript", // Swift not supported by Piston API, mapping to javascript
  ruby: "ruby",
};

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let imported = 0;
    const errors: Array<{ title: string; error: string }> = [];

    // Process each language
    for (const languageData of liveCodingCases.languages) {
      // Find or create course for this language
      const courseId = `course-${languageData.id}-live-coding`;
      let course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        course = await db.course.create({
          data: {
            id: courseId,
            title: `${languageData.name} Canlı Kodlama`,
            description: `${languageData.name} programlama dili için canlı kodlama case'leri`,
            topic: languageData.name,
            difficulty: "beginner",
            content: {},
          },
        });
      }

      // Process each case for this language
      for (const caseItem of languageData.cases) {
        try {
          // Map language to LiveCodingLanguage
          const liveCodingLang = LANGUAGE_TO_LIVECODING[languageData.id] || "javascript";
          
          // Get starter code for this language
          const starterCode = (caseItem.starterCode as Record<string, string>)?.[languageData.id] || "";
          
          // Create initial code object
          const initialCodeObj: Partial<Record<LiveCodingLanguage, string>> = {};
          initialCodeObj[liveCodingLang] = starterCode;

          // Parse testCases
          const testCases = Array.isArray(caseItem.testCases)
            ? caseItem.testCases.map((tc: any) => ({
                input: tc.input || undefined,
                expectedOutput: tc.expectedOutput || "",
              }))
            : undefined;

          // Create task
          const task = {
            id: caseItem.id,
            title: caseItem.title,
            description: caseItem.instructions,
            languages: [liveCodingLang] as LiveCodingLanguage[],
            timeLimitMinutes: 30,
            acceptanceCriteria: [
              "Kod derlenmeli ve hatasız çalışmalı",
              "Beklenen çıktıyı üretmeli",
              "Kod okunabilir ve temiz olmalı",
            ],
            initialCode: initialCodeObj,
            testCases,
            hints: Array.isArray(caseItem.hints) ? caseItem.hints : undefined,
          };

          // Questions JSON
          const questions: Prisma.InputJsonValue = {
            tasks: [task],
            instructions: caseItem.instructions || `${caseItem.title} konusunda pratik yapın.`,
          };

          // Generate unique quiz ID
          const quizId = `quiz-${caseItem.id}`;

          // Check if quiz already exists
          const existingQuiz = await db.quiz.findUnique({
            where: { id: quizId },
          });

          if (existingQuiz) {
            // Update existing quiz
            await db.quiz.update({
              where: { id: quizId },
              data: {
                title: caseItem.title,
                description: caseItem.description,
                topic: languageData.name,
                type: "LIVE_CODING",
                level: caseItem.difficulty,
                questions,
                passingScore: 60,
              },
            });
          } else {
            // Create new quiz
            await db.quiz.create({
              data: {
                id: quizId,
                courseId: course.id,
                title: caseItem.title,
                description: caseItem.description,
                topic: languageData.name,
                type: "LIVE_CODING",
                level: caseItem.difficulty,
                questions,
                passingScore: 60,
              },
            });
          }

          imported++;
        } catch (error: any) {
          errors.push({
            title: caseItem.title,
            error: error.message || "Bilinmeyen hata",
          });
        }
      }
    }

    if (errors.length > 0 && imported === 0) {
      return NextResponse.json(
        { 
          error: errors[0]?.error || "Case'ler veritabanına eklenemedi",
          errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      message: `${imported} adet canlı kodlama case'i başarıyla veritabanına eklendi.${errors.length > 0 ? ` ${errors.length} hata oluştu.` : ""}`,
    });
  } catch (error: any) {
    console.error("Error inserting live coding cases:", error);
    return NextResponse.json(
      { error: error.message || "Case'ler veritabanına eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

