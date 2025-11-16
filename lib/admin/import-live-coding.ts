import * as fs from "fs";
import * as path from "path";
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

interface LiveCodingItem {
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  taskDescription: string;
  acceptanceCriteria?: string[];
  timeLimitMinutes?: number;
  expertise?: string;
  topic?: string;
  topicContent?: string;
}

interface LiveCodingJson {
  items: LiveCodingItem[];
}

export async function importLiveCodingFromJson(): Promise<{
  success: boolean;
  imported: number;
  errors: Array<{ title: string; error: string }>;
}> {
  const errors: Array<{ title: string; error: string }> = [];
  let imported = 0;

  try {
    const jsonFilePath = path.join(process.cwd(), "data", "live-coding", "csharp-live-coding.json");

    if (!fs.existsSync(jsonFilePath)) {
      return {
        success: false,
        imported: 0,
        errors: [{ title: "File", error: "JSON dosyası bulunamadı: " + jsonFilePath }],
      };
    }

    const content = fs.readFileSync(jsonFilePath, "utf-8");
    const data: LiveCodingJson = JSON.parse(content);

    if (!data.items || !Array.isArray(data.items)) {
      return {
        success: false,
        imported: 0,
        errors: [{ title: "Structure", error: "Geçersiz JSON yapısı: items array bulunamadı" }],
      };
    }

    // Find course
    const course = await db.course.findUnique({
      where: { id: "course-dotnet-roadmap" },
    });

    if (!course) {
      return {
        success: false,
        imported: 0,
        errors: [{ title: "Course", error: "course-dotnet-roadmap bulunamadı" }],
      };
    }

    // Collect course update data from all items
    let courseUpdateData: {
      expertise?: string;
      topic?: string;
      topicContent?: string;
    } = {};

    // Process each item
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      try {
        // Validate required fields
        if (!item.title || !item.description || !item.level || !item.taskDescription) {
          errors.push({
            title: item.title || `Item ${i + 1}`,
            error: "Eksik zorunlu alan: title, description, level veya taskDescription",
          });
          continue;
        }

        if (!["beginner", "intermediate", "advanced"].includes(item.level)) {
          errors.push({
            title: item.title,
            error: `Geçersiz seviye: ${item.level}`,
          });
          continue;
        }

        // Collect course update data (use first non-null value)
        if (item.expertise && !courseUpdateData.expertise) {
          courseUpdateData.expertise = item.expertise;
        }
        if (item.topic && !courseUpdateData.topic) {
          courseUpdateData.topic = item.topic;
        }
        if (item.topicContent && !courseUpdateData.topicContent) {
          courseUpdateData.topicContent = item.topicContent;
        }

        // Create task
        const task = {
          id: `task-${Date.now()}-${i}`,
          title: item.title,
          description: item.taskDescription,
          languages: ["csharp"] as LiveCodingLanguage[],
          timeLimitMinutes: item.timeLimitMinutes || (item.level === "beginner" ? 30 : item.level === "intermediate" ? 45 : 60),
          acceptanceCriteria: item.acceptanceCriteria && item.acceptanceCriteria.length > 0
            ? item.acceptanceCriteria
            : ["Kod derlenmeli ve hatasız çalışmalı", "Beklenen çıktıyı üretmeli", "Kod okunabilir ve temiz olmalı"],
          initialCode: {
            csharp: DEFAULT_CSHARP_TEMPLATE,
          },
        };

        // Questions JSON
        const questions: Prisma.InputJsonValue = {
          tasks: [task],
          instructions: item.description || `${item.title} konusunda pratik yapın. Görevi tamamlamak için verilen kriterleri karşılamalısınız.`,
        };

        // Generate unique quiz ID
        const quizId = `quiz-csharp-live-coding-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`;

        // Determine topic for quiz (prefer item.topic, then course.topic, then default)
        const quizTopic = item.topic || course.topic || courseUpdateData.topic || ".NET Core";

        // Create quiz
        await db.quiz.create({
          data: {
            id: quizId,
            courseId: course.id,
            title: item.title,
            description: item.description,
            topic: quizTopic,
            type: "LIVE_CODING",
            level: item.level,
            questions,
            passingScore: 60,
          },
        });

        imported++;
      } catch (error: any) {
        errors.push({
          title: item.title || `Item ${i + 1}`,
          error: error.message || "Bilinmeyen hata",
        });
      }
    }

    // Update course once with collected data (only if we have values and course doesn't have them)
    if (Object.keys(courseUpdateData).length > 0) {
      const updateData: {
        expertise?: string;
        topic?: string;
        topicContent?: string;
      } = {};

      // Only update if course field is null/empty and we have a value
      if (courseUpdateData.expertise && !course.expertise) {
        updateData.expertise = courseUpdateData.expertise;
      }
      if (courseUpdateData.topic && !course.topic) {
        updateData.topic = courseUpdateData.topic;
      }
      if (courseUpdateData.topicContent && !course.topicContent) {
        updateData.topicContent = courseUpdateData.topicContent;
      }

      if (Object.keys(updateData).length > 0) {
        await db.course.update({
          where: { id: course.id },
          data: updateData,
        });
      }
    }

    return {
      success: errors.length === 0,
      imported,
      errors,
    };
  } catch (error: any) {
    return {
      success: false,
      imported,
      errors: [{ title: "Import", error: error.message || "Bilinmeyen hata" }],
    };
  }
}

