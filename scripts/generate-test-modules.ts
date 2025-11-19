import { generateTestModulesJson } from "@/lib/admin/generate-test-modules-json";
import { createDotNetCourse } from "@/lib/admin/create-dotnet-course";
import { createNodeJSCourse } from "@/lib/admin/create-nodejs-course";
import { createReactCourse } from "@/lib/admin/create-react-course";
import { createAngularCourse } from "@/lib/admin/create-angular-course";
import { createNextJSCourse } from "@/lib/admin/create-nextjs-course";
import { createFlutterCourse } from "@/lib/admin/create-flutter-course";
import { createDockerKubernetesCourse } from "@/lib/admin/create-docker-kubernetes-course";
import { createOwaspCourse } from "@/lib/admin/create-owasp-course";
import { createAICourse } from "@/lib/admin/create-ai-course";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Java kurs içeriğini JSON dosyasından okur
 */
async function getJavaCourseContent() {
  const jsonPath = join(process.cwd(), "DB-Seeds", "JSON", "seed-course-java.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  const courseData = JSON.parse(jsonContent);
  return courseData.course.content;
}

/**
 * Ethical Hacking kurs içeriğini JSON dosyasından okur
 */
async function getEthicalHackingCourseContent() {
  const jsonPath = join(process.cwd(), "data", "ethical-hacking-course.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  return JSON.parse(jsonContent);
}

/**
 * MSSQL kurs içeriğini JSON dosyasından okur ve dönüştürür
 */
async function getMSSQLCourseContent() {
  const jsonPath = join(process.cwd(), "data", "lesson-contents", "mssql-course.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(jsonContent);
  
  // Transform MSSQL format to standard course content format
  return {
    overview: {
      description: data.description || "Microsoft SQL Server veritabanı yönetimi ve geliştirme konularında kapsamlı bir kurs.",
      estimatedDurationMinutes: data.totalLessons * 30,
    },
    learningObjectives: [
      "MSSQL veritabanı yönetimini öğrenmek",
      "SQL ve T-SQL komutlarını etkili kullanmak",
      "Stored procedures, functions ve triggers geliştirmek",
    ],
    prerequisites: [],
    modules: data.modules.map((module: any) => ({
      id: module.moduleId,
      title: module.moduleTitle,
      summary: module.moduleTitle,
      durationMinutes: (module.lessons?.length || 0) * 30,
      objectives: [],
      relatedTopics: module.lessons?.map((lesson: any) => ({
        label: lesson.label,
        href: lesson.href,
        description: lesson.description || "",
      })) || [],
    })),
  };
}

/**
 * OWASP kurs içeriğini JSON dosyasından okur ve dönüştürür
 */
async function getOWASPCourseContent() {
  const jsonPath = join(process.cwd(), "data", "seed-data", "owasp-course.json");
  const jsonContent = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(jsonContent);
  
  const courseContent = data.course.content;
  
  // Transform modules to match the expected format
  const transformedModules = courseContent.modules.map((module: any) => ({
    id: module.id,
    title: module.title,
    summary: module.summary,
    durationMinutes: module.durationMinutes,
    objectives: module.objectives,
    relatedTopics: module.lessons?.map((lesson: any) => ({
      label: lesson.title,
      href: `/education/lessons/owasp-security/${module.id}/${lesson.slug}`,
      description: lesson.title,
    })) || [],
  }));
  
  return {
    overview: courseContent.overview,
    learningObjectives: courseContent.learningObjectives || [],
    prerequisites: courseContent.prerequisites || [],
    modules: transformedModules,
  };
}

/**
 * Tüm test modül JSON dosyalarını oluşturur
 */
async function main() {
  console.log("🚀 Test modül JSON dosyaları oluşturuluyor...\n");

  const technologies = [
    { courseId: "course-dotnet-roadmap", fileName: "dotnet-core-test-modules.json", generator: createDotNetCourse, name: ".NET Core" },
    { courseId: "course-java-roadmap", fileName: "java-test-modules.json", generator: getJavaCourseContent, name: "Java" },
    { courseId: "course-nodejs-roadmap", fileName: "nodejs-test-modules.json", generator: createNodeJSCourse, name: "Node.js" },
    { courseId: "course-react-roadmap", fileName: "react-test-modules.json", generator: createReactCourse, name: "React" },
    { courseId: "course-angular-roadmap", fileName: "angular-test-modules.json", generator: createAngularCourse, name: "Angular" },
    { courseId: "course-nextjs-roadmap", fileName: "nextjs-test-modules.json", generator: createNextJSCourse, name: "Next.js" },
    { courseId: "course-flutter-roadmap", fileName: "flutter-test-modules.json", generator: createFlutterCourse, name: "Flutter" },
    { courseId: "course-docker-kubernetes-roadmap", fileName: "docker-kubernetes-test-modules.json", generator: createDockerKubernetesCourse, name: "Docker & Kubernetes" },
    { courseId: "course-owasp-security-roadmap", fileName: "owasp-security-test-modules.json", generator: getOWASPCourseContent, name: "OWASP Security" },
    { courseId: "course-ethical-hacking-roadmap", fileName: "ethical-hacking-test-modules.json", generator: getEthicalHackingCourseContent, name: "Ethical Hacking" },
    { courseId: "course-mssql-roadmap", fileName: "mssql-test-modules.json", generator: getMSSQLCourseContent, name: "MSSQL" },
    { courseId: "course-ai-for-developers-roadmap", fileName: "ai-for-developers-test-modules.json", generator: createAICourse, name: "AI for Developers" },
  ];

  const results = [];

  for (const tech of technologies) {
    console.log(`📝 ${tech.name} test modülleri oluşturuluyor...`);
    const result = await generateTestModulesJson(
      tech.courseId,
      tech.fileName,
      tech.generator || undefined
    );
    if (result.success) {
      console.log(`✅ ${tech.name}: ${result.modulesCount} modül oluşturuldu\n`);
      results.push({ name: tech.name, success: true, modules: result.modulesCount });
    } else {
      console.log(`❌ ${tech.name} hatası: ${result.error}\n`);
      results.push({ name: tech.name, success: false, error: result.error });
    }
  }

  console.log("\n✨ Test modül JSON dosyaları oluşturma tamamlandı!");
  console.log("\n📊 Özet:");
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  console.log(`✅ Başarılı: ${successful.length} teknoloji`);
  successful.forEach(r => console.log(`   - ${r.name}: ${r.modules} modül`));
  if (failed.length > 0) {
    console.log(`❌ Başarısız: ${failed.length} teknoloji`);
    failed.forEach(r => console.log(`   - ${r.name}: ${r.error}`));
  }
}

main().catch(console.error);

