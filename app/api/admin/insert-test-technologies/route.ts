import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Test teknolojileri, modüller ve testler için seed data
const testTechnologiesData = [
  {
    technology: ".NET Core",
    description: ".NET Core ekosistemi için kapsamlı test paketleri",
    modules: [
      {
        id: "module-01",
        title: "C# Temelleri",
        summary: "C# programlama dilinin temel kavramları ve syntax",
        tests: [
          {
            title: "C# Temelleri - Test 1",
            description: "Değişkenler, veri tipleri ve temel operatörler",
            level: "beginner",
            questionCount: 20,
            timeLimitMinutes: 30,
          },
          {
            title: "C# Temelleri - Test 2",
            description: "Kontrol yapıları ve döngüler",
            level: "beginner",
            questionCount: 20,
            timeLimitMinutes: 30,
          },
        ],
      },
      {
        id: "module-02",
        title: "Object-Oriented Programming",
        summary: "Nesne yönelimli programlama prensipleri",
        tests: [
          {
            title: "OOP - Test 1",
            description: "Sınıflar, nesneler ve encapsulation",
            level: "intermediate",
            questionCount: 25,
            timeLimitMinutes: 40,
          },
          {
            title: "OOP - Test 2",
            description: "Inheritance, polymorphism ve abstraction",
            level: "intermediate",
            questionCount: 25,
            timeLimitMinutes: 40,
          },
        ],
      },
      {
        id: "module-03",
        title: "ASP.NET Core Web API",
        summary: "RESTful API geliştirme ve best practices",
        tests: [
          {
            title: "Web API - Test 1",
            description: "Controller, routing ve HTTP methods",
            level: "intermediate",
            questionCount: 30,
            timeLimitMinutes: 45,
          },
          {
            title: "Web API - Test 2",
            description: "Middleware, dependency injection ve authentication",
            level: "advanced",
            questionCount: 30,
            timeLimitMinutes: 45,
          },
        ],
      },
    ],
  },
  {
    technology: "Java",
    description: "Java programlama dili ve ekosistemi için test paketleri",
    modules: [
      {
        id: "module-01",
        title: "Java Fundamentals",
        summary: "Java dilinin temel özellikleri ve syntax",
        tests: [
          {
            title: "Java Fundamentals - Test 1",
            description: "Temel Java kavramları ve syntax",
            level: "beginner",
            questionCount: 20,
            timeLimitMinutes: 30,
          },
        ],
      },
      {
        id: "module-02",
        title: "Spring Framework",
        summary: "Spring Framework ile enterprise uygulama geliştirme",
        tests: [
          {
            title: "Spring Framework - Test 1",
            description: "Spring Core ve dependency injection",
            level: "intermediate",
            questionCount: 25,
            timeLimitMinutes: 40,
          },
        ],
      },
    ],
  },
  {
    technology: "React",
    description: "React kütüphanesi için frontend test paketleri",
    modules: [
      {
        id: "module-01",
        title: "React Fundamentals",
        summary: "React'in temel kavramları ve component yapısı",
        tests: [
          {
            title: "React Fundamentals - Test 1",
            description: "Components, props ve state",
            level: "beginner",
            questionCount: 20,
            timeLimitMinutes: 30,
          },
        ],
      },
      {
        id: "module-02",
        title: "React Hooks",
        summary: "Modern React hooks API kullanımı",
        tests: [
          {
            title: "React Hooks - Test 1",
            description: "useState, useEffect ve custom hooks",
            level: "intermediate",
            questionCount: 25,
            timeLimitMinutes: 40,
          },
        ],
      },
    ],
  },
];

export async function POST() {
  try {
    console.log("[INSERT_TEST_TECHNOLOGIES] Starting test technologies insertion...");
    let totalTechnologies = 0;
    let totalModules = 0;
    let totalTests = 0;

    for (const techData of testTechnologiesData) {
      totalTechnologies++;
      let isFirstTest = true; // Her teknoloji için ilk test için teknoloji description'ını kullan
      
      // Her teknoloji için modüller ve testler oluştur
      for (const moduleData of techData.modules) {
        totalModules++;
        
        // Her modül için testler oluştur
        for (const testData of moduleData.tests) {
          totalTests++;
          
          // Test için questions array'i oluştur
          const questions = Array.from({ length: testData.questionCount }, (_, i) => ({
            id: `q-${techData.technology.toLowerCase().replace(/\s+/g, '-')}-${moduleData.id}-${i + 1}`,
            question: `${testData.title} - Soru ${i + 1}`,
            options: [
              "Seçenek A",
              "Seçenek B",
              "Seçenek C",
              "Seçenek D",
            ],
            correctAnswer: i % 4,
            explanation: "Bu soru için açıklama eklenecek.",
          }));

          // Content objesi oluştur (modules array'i içinde bu modülü içermeli)
          const content = {
            modules: [
              {
                id: moduleData.id,
                title: moduleData.title,
                summary: moduleData.summary,
              },
            ],
            overview: {
              estimatedDurationMinutes: testData.timeLimitMinutes,
            },
          };

          // İlk test için teknoloji description'ını kullan, diğerleri için test description'ını kullan
          const quizDescription = isFirstTest 
            ? techData.description 
            : testData.description;

          // Quiz oluştur (courseId null, type TEST, topic teknoloji adı)
          try {
            await db.quiz.create({
              data: {
                type: "TEST",
                title: testData.title,
                description: quizDescription,
                topic: techData.technology,
                level: testData.level,
                questions: questions as any,
                content: content as any,
                passingScore: 70,
                courseId: null,
              },
            });
          } catch (quizError) {
            console.error(`Error creating quiz for ${techData.technology} - ${testData.title}:`, quizError);
            throw quizError;
          }

          isFirstTest = false; // İlk testten sonra false yap
        }
      }
    }

    console.log(`[INSERT_TEST_TECHNOLOGIES] Successfully inserted: ${totalTechnologies} technologies, ${totalModules} modules, ${totalTests} tests`);

    return NextResponse.json({
      message: `Test teknolojileri başarıyla eklendi: ${totalTechnologies} teknoloji, ${totalModules} modül, ${totalTests} test`,
      stats: {
        technologiesCreated: totalTechnologies,
        modulesCreated: totalModules,
        lessonsCreated: totalTests, // API response'da lessonsCreated olarak gösteriliyor
      },
    });
  } catch (error: any) {
    console.error("[INSERT_TEST_TECHNOLOGIES] Error inserting test technologies:", error);
    return NextResponse.json(
      { error: error.message || "Test teknolojileri eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

