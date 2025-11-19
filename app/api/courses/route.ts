import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log("[API_COURSES] Fetching all courses from database...");
    
    // Get all courses
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
    }) => {
      console.log(`[API_COURSES] Course: ${course.id} - ${course.title}`);
    });

    // Map courses to include module count and total lessons
    const coursesWithStats = courses.map((course: {
      id: string;
      title: string;
      description: string | null;
      category: string | null;
      field: string | null;
      difficulty: string;
      estimatedDuration: number | null;
      content: unknown;
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

    console.log(`[API_COURSES] Returning ${coursesWithStats.length} courses with stats`);
    return NextResponse.json({ courses: coursesWithStats });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Kurslar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

