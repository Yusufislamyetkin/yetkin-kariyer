import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get only course-dotnet-roadmap
    const courses = await db.course.findMany({
      where: {
        id: 'course-dotnet-roadmap',
      },
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

    // Map courses to include module count and total lessons
    const coursesWithStats = courses.map((course) => {
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

    return NextResponse.json({ courses: coursesWithStats });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Kurslar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

