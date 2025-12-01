import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Category to technology/keyword mapping
const categoryMappings: Record<string, string[]> = {
  "Backend Geliştirme": [
    ".NET Core", ".NET", "C#", "Java", "Node.js", "Nodejs", "Python", "Go", "Kotlin", 
    "Spring Boot", "Spring", "NestJS", "Nest", "Express", "Django", "Flask", "FastAPI"
  ],
  "Frontend Geliştirme": [
    "React", "Angular", "Next.js", "Nextjs", "Vue.js", "Vuejs", "Vue", "TypeScript", 
    "JavaScript", "JS", "HTML", "CSS", "Svelte", "Nuxt"
  ],
  "Mobil Geliştirme": [
    "Flutter", "Swift", "React Native", "Kotlin", "Java", "iOS", "Android", "Dart"
  ],
  "Veritabanı": [
    "MSSQL", "SQL Server", "MongoDB", "PostgreSQL", "MySQL", "SQL", "Database", 
    "Veritabanı", "Redis", "Oracle"
  ],
  "Cloud & DevOps": [
    "AWS", "Azure", "Docker", "Kubernetes", "K8s", "DevOps", "CI/CD", "Terraform", 
    "Cloud", "GCP", "Google Cloud"
  ],
  "Güvenlik": [
    "Ethical Hacking", "Hacking", "OWASP", "Security", "Güvenlik", "Penetration Testing",
    "Cybersecurity", "SSL", "TLS"
  ],
  "AI & Machine Learning": [
    "AI", "Artificial Intelligence", "Machine Learning", "ML", "Deep Learning", 
    "Neural Network", "TensorFlow", "PyTorch", "Yapay Zeka", "AI for Developers"
  ],
  "Full Stack Development": [
    "Full Stack", "Fullstack", "Full-Stack", "MEAN", "MERN", "MEVN", "LAMP", "LEMP"
  ]
};

function matchesCategory(course: any, categoryKeywords: string[]): boolean {
  const title = (course.title || "").toLowerCase();
  const topic = (course.topic || "").toLowerCase();
  const field = (course.field || "").toLowerCase();
  const category = (course.category || "").toLowerCase();
  const expertise = (course.expertise || "").toLowerCase();
  
  return categoryKeywords.some(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    return title.includes(lowerKeyword) || 
           topic.includes(lowerKeyword) || 
           field.includes(lowerKeyword) ||
           category.includes(lowerKeyword) ||
           expertise.includes(lowerKeyword);
  });
}

export async function GET(request: Request) {
  try {
    // Get all courses with their content
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        field: true,
        topic: true,
        expertise: true,
        content: true,
        quizzes: {
          select: {
            type: true,
          },
        },
      },
    });

    // Filter out junior live coding, bugfix, and live coding courses
    const filteredCourses = courses.filter((course: any) => {
      const isJuniorCourse = 
        course.id.includes("-junior") || 
        course.title.toLowerCase().includes("junior canlı kodlama") ||
        course.title.toLowerCase().includes("junior live coding");
      
      const hasBugFixQuiz = course.quizzes.some((quiz: any) => quiz.type === "BUG_FIX");
      const isBugFixByPattern = 
        course.id.toLowerCase().includes("bugfix") ||
        course.id.toLowerCase().includes("bug-fix") ||
        course.title.toLowerCase().includes("bugfix") ||
        course.title.toLowerCase().includes("bug-fix") ||
        course.title.toLowerCase().includes("hata düzeltme");
      
      const hasLiveCodingQuiz = course.quizzes.some((quiz: any) => quiz.type === "LIVE_CODING");
      const isLiveCodingByPattern = 
        course.id.toLowerCase().includes("live-coding") ||
        course.id.toLowerCase().includes("livecoding") ||
        course.title.toLowerCase().includes("canlı kodlama") ||
        course.title.toLowerCase().includes("live coding") ||
        course.title.toLowerCase().includes("live-coding");
      
      return !isJuniorCourse && !hasBugFixQuiz && !isBugFixByPattern && !hasLiveCodingQuiz && !isLiveCodingByPattern;
    });

    // Calculate lesson counts per category
    const categoryCounts: Record<string, number> = {};
    
    for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
      let totalLessons = 0;
      
      for (const course of filteredCourses) {
        if (matchesCategory(course, keywords)) {
          const content = course.content as any;
          const modules = Array.isArray(content?.modules) ? content.modules : [];
          
          const lessons = modules.reduce((total: number, module: any) => {
            if (!module || typeof module !== 'object') {
              return total;
            }
            const relatedTopics = Array.isArray(module?.relatedTopics) ? module.relatedTopics : [];
            return total + relatedTopics.length;
          }, 0);
          
          totalLessons += lessons;
        }
      }
      
      categoryCounts[categoryName] = totalLessons;
    }

    return NextResponse.json({ categoryCounts });
  } catch (error) {
    console.error("Error fetching category lesson counts:", error);
    return NextResponse.json(
      { error: "Kategori ders sayıları yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

