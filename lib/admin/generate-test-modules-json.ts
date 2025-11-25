import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import { createDotNetCourse } from "./create-dotnet-course";

interface CourseModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTopics?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
}

interface CourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites?: string[];
  modules: CourseModule[];
}

interface TestModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTests: Array<{
    id: string;
    title: string;
    description?: string;
    href: string;
  }>;
}

interface TestContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  modules: TestModule[];
}

/**
 * Kurs modüllerini veritabanından veya kurs oluşturma fonksiyonundan okuyup test modül JSON formatına dönüştürür
 */
export async function generateTestModulesJson(
  courseId: string,
  outputFileName: string,
  courseContentGenerator?: () => Promise<CourseContent>
): Promise<{ success: boolean; error?: string; modulesCount?: number }> {
  try {
    let courseContent: CourseContent | null = null;

    // Önce veritabanından kursu okumayı dene (veritabanı bağlantısı varsa)
    try {
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { content: true },
      });

      if (course && course.content) {
        courseContent = course.content as CourseContent;
      }
    } catch (dbError: any) {
      // Veritabanı bağlantısı yoksa veya hata varsa, generator kullan
      console.log(`Veritabanı bağlantısı yok veya kurs bulunamadı, kurs oluşturma fonksiyonu kullanılıyor: ${courseId}`);
    }

    // Veritabanından alınamadıysa ve generator varsa, generator'ı kullan
    if (!courseContent && courseContentGenerator) {
      console.log(`Kurs oluşturma fonksiyonu kullanılıyor: ${courseId}`);
      courseContent = await courseContentGenerator();
    } else if (!courseContent) {
      return {
        success: false,
        error: `Kurs bulunamadı ve kurs oluşturma fonksiyonu sağlanmadı: ${courseId}`,
      };
    }

    if (!courseContent) {
      return {
        success: false,
        error: `Kurs içeriği alınamadı: ${courseId}`,
      };
    }

    if (!Array.isArray(courseContent.modules)) {
      return {
        success: false,
        error: `Kurs içeriğinde modül bulunamadı: ${courseId}`,
      };
    }

    // Kurs modüllerini test modüllerine dönüştür
    const testModules: TestModule[] = courseContent.modules.map((module: any) => {
      // Modül başlığına "Testi" ekle
      const moduleTitle = module.title ? `${module.title} Testi` : "Test Modülü";

      // relatedTopics veya lessons'ı relatedTests'e dönüştür
      let relatedTests: Array<{
        id: string;
        title: string;
        description?: string;
        href: string;
      }> = [];

      if (module.relatedTopics && Array.isArray(module.relatedTopics)) {
        // .NET Core ve Node.js formatı (relatedTopics)
        relatedTests = module.relatedTopics.map((topic: any, index: number) => ({
          id: topic.href?.split("/").pop() || `test-${module.id}-${index}`,
          title: topic.label || topic.title || `${moduleTitle} - Test ${index + 1}`,
          description: topic.description || `${moduleTitle} için test`,
          href: topic.href || `/education/test/${courseId}/questions`,
        }));
      } else if (module.lessons && Array.isArray(module.lessons)) {
        // Java formatı (lessons)
        relatedTests = module.lessons.map((lesson: any, index: number) => ({
          id: lesson.slug || lesson.id || `test-${module.id}-${index}`,
          title: lesson.title || `${moduleTitle} - Test ${index + 1}`,
          description: lesson.description || `${moduleTitle} için test`,
          href: `/education/lessons/java/${module.id}/${lesson.slug || lesson.id}`,
        }));
      }

      return {
        id: module.id,
        title: moduleTitle,
        summary: module.summary || `${module.title || "Bu modül"} için test içeriği`,
        durationMinutes: module.durationMinutes || 0,
        objectives: Array.isArray(module.objectives) ? module.objectives : [],
        relatedTests: relatedTests,
      };
    });

    // Test content yapısını oluştur
    const testContent: TestContent = {
      overview: {
        description:
          courseContent.overview?.description ||
          "Test modülleri ile bilginizi test edin ve kendinizi değerlendirin.",
        estimatedDurationMinutes:
          courseContent.overview?.estimatedDurationMinutes || 0,
      },
      learningObjectives: Array.isArray(courseContent.learningObjectives)
        ? courseContent.learningObjectives
        : [],
      modules: testModules,
    };

    // JSON dosyasını kaydet
    const outputDir = path.join(process.cwd(), "data", "test-modules");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, JSON.stringify(testContent, null, 2), "utf-8");

    console.log(
      `✅ Test modül JSON dosyası oluşturuldu: ${outputPath} (${testModules.length} modül)`
    );

    return {
      success: true,
      modulesCount: testModules.length,
    };
  } catch (error: any) {
    console.error(`❌ Test modül JSON oluşturma hatası:`, error);
    return {
      success: false,
      error: error.message || "Bilinmeyen bir hata oluştu",
    };
  }
}

