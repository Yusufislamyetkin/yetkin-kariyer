import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import bugfixCases from "@/data/bugfix-cases.json";
import type { LiveCodingLanguage } from "@/types/live-coding";

const LANGUAGE_TO_LIVECODING: Record<string, LiveCodingLanguage> = {
  csharp: "csharp",
  java: "java",
  python: "python",
  php: "javascript",
  javascript: "javascript",
  typescript: "javascript",
  go: "javascript",
  rust: "javascript",
  cpp: "javascript",
  kotlin: "java",
  swift: "javascript",
  ruby: "javascript",
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
    for (const languageData of bugfixCases.languages) {
      // Find or create course for this language
      const courseId = `course-${languageData.id}-bugfix`;
      let course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        course = await db.course.create({
          data: {
            id: courseId,
            title: `${languageData.name} Bugfix`,
            description: `${languageData.name} programlama dili için bugfix case'leri`,
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
          
          // Get buggy code for this language
          const buggyCode = (caseItem.buggyCode as Record<string, string>)?.[languageData.id] || "";
          
          // Create buggy code object
          const buggyCodeObj: Partial<Record<LiveCodingLanguage, string>> = {};
          buggyCodeObj[liveCodingLang] = buggyCode;

          // Create task
          const task = {
            id: caseItem.id,
            title: caseItem.title,
            description: caseItem.instructions,
            languages: [liveCodingLang] as LiveCodingLanguage[],
            timeLimitMinutes: 30,
            buggyCode: buggyCodeObj,
            hints: caseItem.hints || [],
            acceptanceCriteria: caseItem.acceptanceCriteria || [
              "Kod derlenmeli ve hatasız çalışmalı",
              "Hata düzeltilmeli",
              "Kod okunabilir ve temiz olmalı",
            ],
          };

          // Questions JSON
          const questions: Prisma.InputJsonValue = {
            tasks: [task],
            instructions: caseItem.instructions || `${caseItem.title} hatasını düzeltin.`,
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
                type: "BUG_FIX",
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
                type: "BUG_FIX",
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
          error: errors[0]?.error || "Bugfix case'leri veritabanına eklenemedi",
          errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      message: `${imported} adet bugfix case'i başarıyla veritabanına eklendi.${errors.length > 0 ? ` ${errors.length} hata oluştu.` : ""}`,
    });
  } catch (error: any) {
    console.error("Error inserting bugfix cases:", error);
    return NextResponse.json(
      { error: error.message || "Bugfix case'leri veritabanına eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

