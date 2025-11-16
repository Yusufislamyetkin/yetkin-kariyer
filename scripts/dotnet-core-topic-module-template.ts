/**
 * Template generator for creating a new .NET Core course module entry.
 *
 * Run with:
 *   npx tsx scripts/dotnet-core-topic-module-template.ts
 *
 * The script prints a scaffold that aligns with the CourseModule type so you can
 * paste it directly into the course seed JSON inside `database-seed.sql`.
 */

import { CourseModule } from "../types/course-content";

const moduleTemplate: CourseModule = {
  id: "module-xx-unique-slug",
  title: "Yeni Modül Başlığı",
  summary: "Bu modülün kısa özeti (2-3 cümle arası).",
  durationMinutes: 120,
  objectives: [
    "Modül sonunda ulaşılacak ilk öğrenme hedefi.",
    "İkinci öğrenme hedefi için açıklama.",
    "İsteğe bağlı üçüncü öğrenme hedefi."
  ],
  activities: [
    {
      id: "activity-intro-concept",
      type: "concept",
      title: "Kavramsal İçeriği Açıkla",
      estimatedMinutes: 15,
      content:
        "Bu bölümde konuya giriş yapan kavramsal açıklama yer alacak. Markdown desteklenir.",
      highlights: [
        "Anahtar noktaların madde madde listesi.",
        "Önemli bir teknik vurgu daha."
      ],
      codeSamples: [
        {
          language: "csharp",
          filename: "Program.cs",
          code: "// TODO: Örnek C# kodu buraya gelecek.",
          explanation: "Kod örneğinin kısa açıklaması."
        }
      ],
      checklist: [
        {
          id: "check-understanding",
          label: "Temel kavramları kavradığını kontrol et.",
          explanation: "Notlarını gözden geçir."
        }
      ]
    },
    {
      id: "activity-guided-exercise",
      type: "guided-exercise",
      title: "Adım Adım Uygulama",
      estimatedMinutes: 25,
      description: "Katılımcılar bu egzersizde yeni kavramı pekiştirir.",
      steps: [
        {
          title: "Projeyi hazırla",
          detail: "dotnet new webapi komutu ile temiz bir proje oluştur.",
          hint: "CLI kullanırken doğru proje adını verdiğinden emin ol."
        },
        {
          title: "Örnek özelliği ekle",
          detail: "Yeni controller ekleyerek temel endpoint'i oluştur.",
          hint: "Dependency Injection için gerekli servis kayıtlarını yap."
        }
      ],
      starterCode: {
        language: "csharp",
        filename: "WeatherForecastController.cs",
        code: "// TODO: Katılımcıların başlayacağı örnek kod.",
        explanation: "Controller iskeleti."
      },
      hints: [
        "dotnet watch komutu ile canlı reload alabilirsin.",
        "Swagger UI'da endpoint'i test etmeyi unutma."
      ],
      validation: {
        type: "self",
        criteria: [
          "Endpoint 200 döndürmeli.",
          "Controller DI ile kayıtlı servisi kullanmalı."
        ]
      }
    },
    {
      id: "activity-code-challenge",
      type: "code-challenge",
      title: "Bağımsız Kodlama Görevi",
      estimatedMinutes: 35,
      description: "Katılımcılar gerçekçi bir kullanım senaryosunu çözsün.",
      acceptanceCriteria: [
        "Yeni servis katmanı SOLID prensiplerine uygun olmalı.",
        "Repository, EF Core ile çalışmalı ve async yöntemler içermeli."
      ],
      starterCode: {
        language: "csharp",
        filename: "TodoService.cs",
        code: "// TODO: Çözümün başlangıç noktası.",
        explanation: "Servis arayüzü ve temel sınıf iskeleti."
      },
      testCases: [
        {
          id: "scenario-happy-path",
          description: "CRUD akışı düzgün çalışıyor mu?",
          input: "POST -> GET -> PUT -> DELETE istekleri",
          expectedOutput: "Tüm istekler 2xx cevapları döndürmeli."
        }
      ],
      evaluationTips: [
        "Logging ve hata yönetimi eklemeyi öner.",
        "Ek güvenlik kontrolleri için fikir ver."
      ]
    }
  ],
  checkpoints: [
    {
      id: "checkpoint-module-retrospective",
      title: "Modül Sonu Değerlendirmesi",
      description: "Katılımcıların modül boyunca inşa ettiği çözümü değerlendirme.",
      tasks: [
        {
          id: "task-demo",
          description: "Geliştirilen API'yi canlı olarak demo et.",
          resources: [
            {
              id: "resource-demo-checklist",
              title: "Demo Kontrol Listesi",
              url: "https://example.com/demo-checklist",
              type: "article"
            }
          ],
          coachTips: [
            "Dökümantasyonu API ile karşılaştır.",
            "Edge case senaryolarını test ettir."
          ]
        }
      ],
      successCriteria: [
        "API uç noktaları belirtilen gereksinimleri karşılıyor.",
        "Kod kalitesi ve test kapsamı yeterli.",
        "Katılımcı mimari tercihlerini açıklayabiliyor."
      ],
      estimatedMinutes: 30
    }
  ],
  learnLink: {
    label: "İlgili Dersler",
    href: "/education/courses?search=dotnet%20core",
    description: "Modülle bağlantılı dersler ve kaynaklar."
  },
  relatedTopics: [
    {
      label: "ASP.NET Core Middleware Pipeline",
      href: "/education/lessons/dotnet-core/middleware/pipeline",
      description: "Middleware sıralamasını ve request yaşam döngüsünü incele."
    },
    {
      label: "Dependency Injection Stratejileri",
      href: "/education/lessons/dotnet-core/architecture/di",
      description: "DI container yapılandırma seçenekleri."
    }
  ]
};

console.log(JSON.stringify(moduleTemplate, null, 2));


