import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { LiveCodingLanguage } from "@/types/live-coding";

const DEFAULT_CSHARP_TEMPLATE = `using System;
using System.Collections.Generic;
using System.Linq;

namespace LiveCoding
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            // Çözümünüzü buraya yazın
        }
    }
}`;

const DEFAULT_PYTHON_TEMPLATE = `# Çözümünüzü buraya yazın
def main():
    pass

if __name__ == "__main__":
    main()
`;

const DEFAULT_JAVASCRIPT_TEMPLATE = `// Çözümünüzü buraya yazın
function main() {
    // Kodunuz buraya
}

main();
`;

const DEFAULT_JAVA_TEMPLATE = `public class Solution {
    public static void main(String[] args) {
        // Çözümünüzü buraya yazın
    }
}
`;

function getDefaultTemplate(language: LiveCodingLanguage): string {
  switch (language) {
    case "csharp":
      return DEFAULT_CSHARP_TEMPLATE;
    case "python":
      return DEFAULT_PYTHON_TEMPLATE;
    case "javascript":
      return DEFAULT_JAVASCRIPT_TEMPLATE;
    case "java":
      return DEFAULT_JAVA_TEMPLATE;
    default:
      return DEFAULT_CSHARP_TEMPLATE;
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      level,
      taskDescription,
      languages,
      timeLimitMinutes,
      acceptanceCriteria,
      initialCode,
      courseId,
      expertise,
      topic,
      topicContent,
    } = body;

    // Validation
    if (!title || !description || !level || !taskDescription) {
      return NextResponse.json(
        { error: "Başlık, açıklama, seviye ve görev açıklaması zorunludur" },
        { status: 400 }
      );
    }

    if (!languages || !Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json(
        { error: "En az bir dil seçilmelidir" },
        { status: 400 }
      );
    }

    const validLanguages: LiveCodingLanguage[] = ["csharp", "python", "javascript", "java"];
    const invalidLanguages = languages.filter((lang: string) => !validLanguages.includes(lang as LiveCodingLanguage));
    if (invalidLanguages.length > 0) {
      return NextResponse.json(
        { error: `Geçersiz dil: ${invalidLanguages.join(", ")}` },
        { status: 400 }
      );
    }

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return NextResponse.json(
        { error: "Seviye beginner, intermediate veya advanced olmalıdır" },
        { status: 400 }
      );
    }

    // Find or use default course
    let course;
    if (courseId) {
      course = await db.course.findUnique({
        where: { id: courseId },
      });
    } else {
      // Default to course-dotnet-roadmap
      course = await db.course.findUnique({
        where: { id: "course-dotnet-roadmap" },
      });
    }

    if (!course) {
      return NextResponse.json(
        { error: "Kurs bulunamadı" },
        { status: 404 }
      );
    }

    // Build initial code object
    const initialCodeObj: Partial<Record<LiveCodingLanguage, string>> = {};
    if (initialCode && typeof initialCode === "object") {
      languages.forEach((lang: LiveCodingLanguage) => {
        if (initialCode[lang]) {
          initialCodeObj[lang] = initialCode[lang];
        } else {
          initialCodeObj[lang] = getDefaultTemplate(lang);
        }
      });
    } else {
      languages.forEach((lang: LiveCodingLanguage) => {
        initialCodeObj[lang] = getDefaultTemplate(lang);
      });
    }

    // Create task
    const task = {
      id: `task-${Date.now()}`,
      title,
      description: taskDescription,
      languages: languages as LiveCodingLanguage[],
      timeLimitMinutes: timeLimitMinutes || (level === "beginner" ? 30 : level === "intermediate" ? 45 : 60),
      acceptanceCriteria: acceptanceCriteria && Array.isArray(acceptanceCriteria) 
        ? acceptanceCriteria 
        : ["Kod derlenmeli ve hatasız çalışmalı", "Beklenen çıktıyı üretmeli", "Kod okunabilir ve temiz olmalı"],
      initialCode: initialCodeObj,
    };

    // Questions JSON
    const questions: Prisma.InputJsonValue = {
      tasks: [task],
      instructions: description || `${title} konusunda pratik yapın. Görevi tamamlamak için verilen kriterleri karşılamalısınız.`,
    };

    // Generate unique quiz ID
    const quizId = `quiz-live-coding-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create quiz
    const quiz = await db.quiz.create({
      data: {
        id: quizId,
        courseId: course.id,
        title,
        description,
        topic: topic || course.topic || ".NET Core",
        type: "LIVE_CODING",
        level,
        questions,
        passingScore: 60,
      },
    });

    // Update course if expertise/topic/topicContent provided
    if (expertise || topic || topicContent) {
      await db.course.update({
        where: { id: course.id },
        data: {
          ...(expertise && { expertise }),
          ...(topic && { topic }),
          ...(topicContent && { topicContent }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        level: quiz.level,
        type: quiz.type,
      },
      message: "Canlı kodlama içeriği başarıyla oluşturuldu.",
    });
  } catch (error: any) {
    console.error("Error creating live coding:", error);
    return NextResponse.json(
      { error: error.message || "Canlı kodlama içeriği oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

