import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // If id is a number, it's likely a moduleIndex, return 404 to let Next.js try moduleIndex route
    if (!isNaN(Number(params.id)) && Number(params.id) > 0) {
      return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
    }

    const course = await db.course.findUnique({
      where: { id: params.id },
      include: {
        quizzes: {
          where: {
            type: "MINI_TEST", // Sadece MINI_TEST tipi quiz'ler kurslarla ilişkili
          },
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
    }

    const normalizedContent = normalizeCourseContent(
      course.content,
      course.estimatedDuration,
      course.description
    );

    // Get all lesson records to merge content into modules
    const allLessons = await db.course.findMany({
      where: {
        OR: [
          { id: { startsWith: "lesson-" } },
          { id: { startsWith: "topic-" } },
        ],
      },
      select: {
        id: true,
        content: true,
      },
    });

    // Create a map of lesson content by href
    const lessonContentMap = new Map<string, any>();
    for (const lessonRecord of allLessons) {
      const lessonContent = lessonRecord.content as any;
      if (lessonContent?.href) {
        lessonContentMap.set(lessonContent.href, lessonContent);
      }
    }

    // Merge lesson content into modules
    if (normalizedContent.modules && Array.isArray(normalizedContent.modules)) {
      // Determine course expertise for building lesson hrefs
      const courseExpertise = course.expertise?.toLowerCase().replace(/\s+/g, '-') || 
                             course.topic?.toLowerCase().replace(/\s+/g, '-') || 
                             (course.id.includes('java') ? 'java' : 
                              course.id.includes('dotnet') ? 'dotnet-core' : 
                              course.id.includes('nodejs') ? 'nodejs' : 'java');
      
      for (const courseModule of normalizedContent.modules) {
        // Convert Java format (lessons) to relatedTopics format if needed
        if (courseModule.lessons && Array.isArray(courseModule.lessons) && (!courseModule.relatedTopics || courseModule.relatedTopics.length === 0)) {
          courseModule.relatedTopics = courseModule.lessons.map((lesson: any) => {
            // Build href from module and lesson slug
            const moduleId = courseModule.id || '';
            const lessonSlug = lesson.slug || lesson.id || '';
            const href = `/education/lessons/${courseExpertise}/${moduleId}/${lessonSlug}`;
            
            return {
              label: lesson.title || lesson.label || 'Ders',
              href: href,
              description: lesson.description || lesson.title || '',
            };
          });
        }
        
        // Ensure relatedTopics exists and is an array
        if (courseModule.relatedTopics && Array.isArray(courseModule.relatedTopics)) {
          for (let i = 0; i < courseModule.relatedTopics.length; i++) {
            const topic = courseModule.relatedTopics[i];
            if (topic?.href) {
              const lessonContent = lessonContentMap.get(topic.href);
              if (lessonContent) {
                // Merge content from lesson record
                courseModule.relatedTopics[i] = {
                  ...topic,
                  sections: lessonContent.sections || topic.sections || [],
                  keyTakeaways: lessonContent.keyTakeaways || topic.keyTakeaways || [],
                  checkpoints: lessonContent.checkpoints || topic.checkpoints || [],
                  resources: lessonContent.resources || topic.resources || [],
                  practice: lessonContent.practice || topic.practice || [],
                  description: lessonContent.description || topic.description,
                  estimatedDurationMinutes: lessonContent.estimatedDurationMinutes || topic.estimatedDurationMinutes,
                  level: lessonContent.level || topic.level,
                };
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      course: {
        ...course,
        content: normalizedContent,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Kurs yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

