import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log("[API_COURSES] Fetching all courses from database...");
    
    // Get all courses with their quizzes to check types
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        field: true,
        difficulty: true,
        estimatedDuration: true,
        content: true,
        quizzes: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`[API_COURSES] Found ${courses.length} courses in database`);
    courses.forEach((course: {
      id: string;
      title: string;
      description: string | null;
      category: string | null;
      field: string | null;
      difficulty: string;
      estimatedDuration: number | null;
      content: unknown;
      quizzes: { type: string }[];
    }) => {
      console.log(`[API_COURSES] Course: ${course.id} - ${course.title}`);
    });

    // Map courses to include module count and total lessons
    // Filter out junior live coding courses, bugfix courses, and live coding courses
    const coursesWithStats = courses
      .filter((course: {
        id: string;
        title: string;
        description: string | null;
        category: string | null;
        field: string | null;
        difficulty: string;
        estimatedDuration: number | null;
        content: unknown;
        quizzes: { type: string }[];
      }) => {
        // Filter out junior live coding courses
        // They have IDs like "course-{language}-junior" or titles containing "Junior Canlı Kodlama"
        const isJuniorCourse = 
          course.id.includes("-junior") || 
          course.title.toLowerCase().includes("junior canlı kodlama") ||
          course.title.toLowerCase().includes("junior live coding");
        
        // Filter out bugfix courses by checking quiz types and title/ID patterns
        const hasBugFixQuiz = course.quizzes.some((quiz) => quiz.type === "BUG_FIX");
        const isBugFixByPattern = 
          course.id.toLowerCase().includes("bugfix") ||
          course.id.toLowerCase().includes("bug-fix") ||
          course.title.toLowerCase().includes("bugfix") ||
          course.title.toLowerCase().includes("bug-fix") ||
          course.title.toLowerCase().includes("hata düzeltme");
        
        // Filter out live coding courses by checking quiz types and title/ID patterns
        const hasLiveCodingQuiz = course.quizzes.some((quiz) => quiz.type === "LIVE_CODING");
        const isLiveCodingByPattern = 
          course.id.toLowerCase().includes("live-coding") ||
          course.id.toLowerCase().includes("livecoding") ||
          course.title.toLowerCase().includes("canlı kodlama") ||
          course.title.toLowerCase().includes("live coding") ||
          course.title.toLowerCase().includes("live-coding");
        
        return !isJuniorCourse && !hasBugFixQuiz && !isBugFixByPattern && !hasLiveCodingQuiz && !isLiveCodingByPattern;
      })
      .map((course: {
        id: string;
        title: string;
        description: string | null;
        category: string | null;
        field: string | null;
        difficulty: string;
        estimatedDuration: number | null;
        content: unknown;
        quizzes: { type: string }[];
      }) => {
        const content = course.content as any;
        
        // Safely get modules array
        const modules = Array.isArray(content?.modules) ? content.modules : [];
        
        // Calculate total lessons by summing all relatedTopics in all modules
        const totalLessons = modules.reduce((total: number, module: any) => {
          if (!module || typeof module !== 'object') {
            return total;
          }
          const relatedTopics = Array.isArray(module?.relatedTopics) ? module.relatedTopics : [];
          return total + relatedTopics.length;
        }, 0);

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          field: course.field,
          difficulty: course.difficulty,
          estimatedDuration: course.estimatedDuration,
          moduleCount: modules.length,
          totalLessons,
        };
      });

    console.log(`[API_COURSES] Returning ${coursesWithStats.length} courses with stats (junior, bugfix, and live coding courses filtered out)`);
    return NextResponse.json({ courses: coursesWithStats });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Kurslar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

