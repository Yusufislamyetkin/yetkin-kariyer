import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getMockEducationItems,
  type EducationType,
} from "@/lib/mock/education";
import { normalizeLiveCodingPayload } from "@/lib/education/liveCoding";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validTypes: readonly EducationType[] = ["TEST", "LIVE_CODING", "BUG_FIX", "HACKATON"];
  const rawType = searchParams.get("type");
  const normalizedType = rawType && validTypes.includes(rawType as EducationType) ? (rawType as EducationType) : undefined;

  try {
    const expertise = searchParams.get("expertise");
    const topic = searchParams.get("topic");
    const content = searchParams.get("content");
    const level = searchParams.get("level");
    const typeParam = rawType; // TEST, LIVE_CODING, BUG_FIX, HACKATON
    const search = searchParams.get("search");

    const where: any = {
      type: {
        not: "MINI_TEST",
      },
    };

    // Build OR conditions for expertise, topic, and content filters
    // This allows filtering by both course.expertise and quiz.topic (for independent tests)
    const orConditions: any[] = [];

    if (expertise) {
      orConditions.push(
        { course: { expertise } },
        { topic: expertise }
      );
    }

    if (topic) {
      orConditions.push(
        { course: { topic } },
        { topic }
      );
    }

    if (content) {
      orConditions.push(
        { course: { topicContent: content } }
      );
    }

    if (orConditions.length > 0) {
      // Combine OR conditions with AND
      where.AND = [
        ...(where.AND || []),
        {
          OR: orConditions,
        },
      ];
    }

    if (level) {
      where.level = level;
    }

    if (typeParam) {
      if (typeParam === "MINI_TEST") {
        return NextResponse.json(
          { error: "Mini testler bu listede sunulmaz." },
          { status: 400 }
        );
      }
      if (validTypes.includes(typeParam as EducationType)) {
        where.type = typeParam;
      } else {
        return NextResponse.json(
          { error: `Geçersiz type değeri: ${typeParam}. Geçerli değerler: ${validTypes.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    // Add timeout protection for database queries
    // Optimize: Only select necessary fields for better performance
    // For LIVE_CODING, we need questions field for normalization, but we exclude it for other types to reduce payload
    const selectFields: any = {
      id: true,
      title: true,
      description: true,
      level: true,
      type: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          expertise: true,
          topic: true,
          topicContent: true,
          difficulty: true,
        },
      },
    };

    // Only include questions field for LIVE_CODING to reduce payload size for other types
    if (typeParam === "LIVE_CODING") {
      selectFields.questions = true;
    }

    // Log query for debugging
    console.log("[EDUCATION_ITEMS_GET] Query where clause:", JSON.stringify(where, null, 2));
    
    const queryPromise = db.quiz.findMany({
      where,
      select: selectFields,
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit results to prevent resource exhaustion
    });

    // Set a timeout of 5 seconds for the query (reduced from 10s for faster failure detection)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 5000);
    });

    const quizzes = await Promise.race([queryPromise, timeoutPromise]) as Awaited<typeof queryPromise>;

    // Log for debugging
    console.log(`[EDUCATION_ITEMS_GET] Found ${quizzes.length} quizzes with type: ${typeParam}`, {
      expertise: expertise || null,
      topic: topic || null,
      content: content || null,
      level: level || null,
      search: search || null,
    });
    
    if (quizzes.length > 0) {
      console.log(`[EDUCATION_ITEMS_GET] First quiz sample:`, {
        id: quizzes[0].id,
        title: quizzes[0].title,
        courseId: quizzes[0].course?.id || 'NO COURSE',
        courseTitle: quizzes[0].course?.title || 'NO COURSE TITLE',
      });
    }

    // Optimize: Normalize LIVE_CODING payloads on server-side to reduce client-side processing
    const processedItems = typeParam === "LIVE_CODING" 
      ? quizzes.map((quiz: any) => {
          if (!quiz.questions) {
            // Remove questions field to reduce payload size
            const { questions: _, ...rest } = quiz as any;
            return rest;
          }
          
          try {
            const normalized = normalizeLiveCodingPayload(quiz.questions);
            // Remove questions field and add normalized liveCoding data
            const { questions: _, ...rest } = quiz as any;
            return {
              ...rest,
              liveCoding: {
                tasks: normalized.tasks,
                instructions: normalized.instructions,
              },
            };
          } catch (error) {
            console.error(`[LIVE_CODING] Error normalizing quiz ${quiz.id}:`, error);
            // Remove questions field even on error to reduce payload size
            const { questions: _, ...rest } = quiz as any;
            return rest;
          }
        })
      : quizzes;

    return NextResponse.json({ items: processedItems });
  } catch (error) {
    console.error("[EDUCATION_ITEMS_GET] Error:", error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("[EDUCATION_ITEMS_GET] Error message:", error.message);
      console.error("[EDUCATION_ITEMS_GET] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[EDUCATION_ITEMS_GET] Database connection error detected");
      }
    }

    // Try to return fallback data
    try {
      const fallbackItems = getMockEducationItems({
        type: normalizedType,
        expertise: searchParams.get("expertise"),
        topic: searchParams.get("topic"),
        content: searchParams.get("content"),
        search: searchParams.get("search"),
      });

      if (fallbackItems.length > 0) {
        return NextResponse.json({
          items: fallbackItems,
          fallback: true,
        });
      }
    } catch (fallbackError) {
      console.error("[EDUCATION_ITEMS_GET] Fallback error:", fallbackError);
    }

    return NextResponse.json(
      {
        error: "Eğitim öğeleri yüklenirken bir hata oluştu",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}

