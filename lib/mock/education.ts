export type EducationType = "TEST" | "LIVE_CODING" | "BUG_FIX" | "HACKATON" | "MINI_TEST";

interface MockCourse {
  id: string;
  title: string;
  expertise: string | null;
  topic: string | null;
  topicContent: string | null;
  difficulty: string;
}

export interface MockEducationItem {
  id: string;
  type: EducationType;
  title: string;
  description: string | null;
  level: string | null;
  passingScore: number;
  course: MockCourse;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

const dotnetCourse: MockCourse = {
  id: "mock-course-dotnet",
  title: ".NET Core Backend Development",
  expertise: "backend",
  topic: ".NET Core",
  topicContent: "Gelişmiş .NET Core Yol Haritası",
  difficulty: "intermediate",
};

const oopQuestions = [
  {
    id: "mock-oop-1",
    question: "C# dilinde kapsülleme (encapsulation) neyi ifade eder?",
    options: [
      "Veri ve davranışın aynı sınıfta gruplanması",
      "Bir sınıfın başka bir sınıftan miras alması",
      "Metodların farklı parametrelerle aşırı yüklenmesi",
      "Sınıfların bellekteki kapladığı alanın azaltılması",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-oop-2",
    question: "Polymorphism hangi durumda kullanılır?",
    options: [
      "Aynı arayüzün farklı implementasyonlarla davranış değiştirmesi",
      "Sadece static metodlarda",
      "Sadece abstract sınıflarda",
      "Sınıfların constructor olmadan oluşturulmasında",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-oop-3",
    question: "SOLID prensiplerinden Liskov Yerine Geçme (LSP) neyi savunur?",
    options: [
      "Türetilmiş sınıfların temel sınıfın davranışını bozmadan kullanılabilmesi",
      "Sınıfların yalnızca tek bir sorumluluğu olması gerektiğini",
      "Bağımlılıkların somut sınıflar yerine soyutlamalara yapılmasını",
      "Arayüzlerin küçük ve amaç odaklı tanımlanmasını",
    ],
    correctAnswer: 0,
  },
];

const csharpQuestions = [
  {
    id: "mock-cs-1",
    question: "`async` ve `await` anahtar kelimeleri hangi senaryoda tercih edilmelidir?",
    options: [
      "I/O tabanlı işlemleri thread bloklamadan çalıştırmak istediğimizde",
      "Sadece CPU yoğun işlemlerde performansı artırmak için",
      "Class tanımlarken ctor oluşturmak için",
      "Struct tanımlarken bellek optimizasyonu yapmak için",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-cs-2",
    question: "`Span<T>` tipi ne tür bir avantaj sağlar?",
    options: [
      "Bellek tahsisi yapmadan veri dilimlerine erişim imkanı sunar",
      "LINQ sorgularını daha hızlı çalıştırır",
      "Nullable referansları otomatik olarak çözer",
      "Sadece reflection işlemlerini hızlandırır",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-cs-3",
    question: "Pattern matching ile ilgili doğru ifade hangisidir?",
    options: [
      "Switch ifadelerinde tip ve değere göre koşul yazmayı kolaylaştırır",
      "Sadece string karşılaştırmalarında kullanılabilir",
      "Yalnızca record tipleriyle birlikte kullanılabilir",
      "Compile-time yerine runtime hatalarını azaltır",
    ],
    correctAnswer: 0,
  },
];

const efQuestions = [
  {
    id: "mock-ef-1",
    question: "Entity Framework Core'da `AsNoTracking` kullanmak ne sağlar?",
    options: [
      "Okuma amaçlı sorgularda change tracking maliyetini ortadan kaldırır",
      "Sorguyu otomatik olarak cache'ler",
      "Migration dosyalarını yeniden oluşturur",
      "Veritabanında index ekler",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-ef-2",
    question: "Lazy loading ile ilgili doğru ifade hangisidir?",
    options: [
      "Navigasyon property'lerinin ihtiyaç duyulana kadar yüklenmemesini sağlar",
      "Tüm ilişkileri eager loading ile birlikte getirir",
      "Sadece in-memory database provider'ında çalışır",
      "Tracking'i kapatmak için zorunlu olarak kullanılır",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-ef-3",
    question: "EF Core'da `DbContext` yaşam süresini yönetirken hangi yaklaşım önerilir?",
    options: [
      "Dependency injection ile scoped yaşam süresi kullanmak",
      "Her istek için singleton context oluşturmak",
      "Context'i manuel olarak new'leyip global değişkende saklamak",
      "Context'i sadece static metodlarda kullanmak",
    ],
    correctAnswer: 0,
  },
];

// Dependency Injection soruları
const diQuestions = [
  {
    id: "mock-di-1",
    question: "ASP.NET Core'da service lifetime'lardan hangisi her HTTP request için yeni bir instance oluşturur?",
    options: [
      "Singleton",
      "Scoped",
      "Transient",
      "Request",
    ],
    correctAnswer: 1,
  },
  {
    id: "mock-di-2",
    question: "Constructor injection yerine service locator pattern kullanmanın dezavantajı nedir?",
    options: [
      "Daha hızlı çalışır",
      "Bağımlılıklar gizlenir ve test edilebilirlik azalır",
      "Daha az kod yazılır",
      "Memory kullanımı azalır",
    ],
    correctAnswer: 1,
  },
  {
    id: "mock-di-3",
    question: "Decorator pattern ile DI kullanırken hangi yaklaşım doğrudur?",
    options: [
      "Her decorator için ayrı interface tanımlanmalı",
      "Base interface'i implement eden decorator'lar zincirleme kaydedilmeli",
      "Sadece singleton lifetime kullanılmalı",
      "Decorator pattern DI ile kullanılamaz",
    ],
    correctAnswer: 1,
  },
];

// ASP.NET Core MVC soruları
const mvcQuestions = [
  {
    id: "mock-mvc-1",
    question: "ASP.NET Core MVC'de model binding hangi sırayla çalışır?",
    options: [
      "Form data → Route data → Query string → Request body",
      "Route data → Query string → Form data → Request body",
      "Request body → Form data → Route data → Query string",
      "Query string → Route data → Form data → Request body",
    ],
    correctAnswer: 1,
  },
  {
    id: "mock-mvc-2",
    question: "Action filter'ların çalışma sırası nedir?",
    options: [
      "OnActionExecuting → Action → OnActionExecuted → OnResultExecuting → Result → OnResultExecuted",
      "Action → OnActionExecuting → OnActionExecuted → Result",
      "OnActionExecuting → Action → Result → OnActionExecuted",
      "Sadece OnActionExecuting ve OnActionExecuted çalışır",
    ],
    correctAnswer: 0,
  },
];

// Middleware soruları
const middlewareQuestions = [
  {
    id: "mock-middleware-1",
    question: "Middleware pipeline'ında UseRouting ve UseEndpoints'in sırası neden önemlidir?",
    options: [
      "Performans için gerekli",
      "Routing middleware endpoint'leri bulmalı, UseEndpoints onları execute etmeli",
      "Sıra önemli değildir",
      "Sadece UseRouting gerekli, UseEndpoints opsiyonel",
    ],
    correctAnswer: 1,
  },
  {
    id: "mock-middleware-2",
    question: "Terminal middleware nedir?",
    options: [
      "Pipeline'ın sonunda çalışan middleware",
      "Request'i işleyip response döndüren ve pipeline'ı sonlandıran middleware",
      "Sadece hata durumlarında çalışan middleware",
      "Asenkron çalışan middleware",
    ],
    correctAnswer: 1,
  },
];

// Testing soruları
const testingQuestions = [
  {
    id: "mock-testing-1",
    question: "xUnit'te [Fact] ve [Theory] attribute'ları arasındaki fark nedir?",
    options: [
      "[Fact] tek senaryo, [Theory] birden fazla veri ile test",
      "[Fact] async test, [Theory] sync test",
      "Fark yok, ikisi de aynı",
      "[Fact] integration test, [Theory] unit test",
    ],
    correctAnswer: 0,
  },
  {
    id: "mock-testing-2",
    question: "Moq ile bir interface'i mock'lamak için hangi yaklaşım kullanılır?",
    options: [
      "new Mock<IInterface>()",
      "Mock.Create<IInterface>()",
      "Interface'i direkt new'leyebilirsin",
      "Moq sadece class'ları mock'lar",
    ],
    correctAnswer: 0,
  },
];

// Performance soruları
const performanceQuestions = [
  {
    id: "mock-perf-1",
    question: "In-memory cache ve distributed cache arasındaki temel fark nedir?",
    options: [
      "In-memory daha hızlıdır",
      "Distributed cache birden fazla sunucu arasında paylaşılabilir",
      "In-memory sadece development'ta kullanılır",
      "Fark yok, ikisi de aynı",
    ],
    correctAnswer: 1,
  },
  {
    id: "mock-perf-2",
    question: "Async/await kullanırken hangi durumda deadlock riski oluşur?",
    options: [
      "Task.Result veya .Wait() kullanıldığında",
      "Her zaman oluşur",
      "Sadece database sorgularında",
      "Deadlock riski yoktur",
    ],
    correctAnswer: 0,
  },
];

const mockEducationItems: MockEducationItem[] = [
  {
    id: "mock-oop-test-1",
    type: "TEST",
    title: "OOP Temelleri",
    description: "Nesne yönelimli programlama prensiplerine giriş testi.",
    level: "beginner",
    passingScore: 60,
    course: { ...dotnetCourse, topicContent: "OOP Temelleri" },
    questions: oopQuestions,
  },
  {
    id: "mock-cs-test-1",
    type: "TEST",
    title: "C# Gelişmiş Özellikler",
    description: "Modern C# dil özelliklerini ölçen pratik test.",
    level: "intermediate",
    passingScore: 65,
    course: { ...dotnetCourse, topicContent: "C# İleri Seviye" },
    questions: csharpQuestions,
  },
  {
    id: "mock-ef-test-1",
    type: "TEST",
    title: "Entity Framework Core Pratikleri",
    description: "EF Core performans ve best practice bilgilerinizi kontrol edin.",
    level: "intermediate",
    passingScore: 70,
    course: { ...dotnetCourse, topicContent: "Entity Framework Core" },
    questions: efQuestions,
  },
  {
    id: "mock-di-test-1",
    type: "TEST",
    title: "Dependency Injection ve IoC",
    description: "DI container, service lifetime ve SOLID prensipleri testi.",
    level: "intermediate",
    passingScore: 70,
    course: { ...dotnetCourse, topicContent: "Dependency Injection" },
    questions: diQuestions,
  },
  {
    id: "mock-mvc-test-1",
    type: "TEST",
    title: "ASP.NET Core MVC",
    description: "MVC pattern, routing, model binding ve filter'lar testi.",
    level: "intermediate",
    passingScore: 65,
    course: { ...dotnetCourse, topicContent: "ASP.NET Core MVC" },
    questions: mvcQuestions,
  },
  {
    id: "mock-middleware-test-1",
    type: "TEST",
    title: "Middleware ve Pipeline",
    description: "Request pipeline, custom middleware ve pipeline sıralaması testi.",
    level: "intermediate",
    passingScore: 70,
    course: { ...dotnetCourse, topicContent: "Middleware" },
    questions: middlewareQuestions,
  },
  {
    id: "mock-testing-test-1",
    type: "TEST",
    title: "Unit Testing ve xUnit",
    description: "xUnit, Moq ve test stratejileri bilgilerinizi ölçün.",
    level: "intermediate",
    passingScore: 70,
    course: { ...dotnetCourse, topicContent: "Testing" },
    questions: testingQuestions,
  },
  {
    id: "mock-performance-test-1",
    type: "TEST",
    title: "Performans Optimizasyonu",
    description: "Caching, async/await ve performans teknikleri testi.",
    level: "advanced",
    passingScore: 75,
    course: { ...dotnetCourse, topicContent: "Performance" },
    questions: performanceQuestions,
  },
  {
    id: "mock-live-coding-1",
    type: "LIVE_CODING",
    title: "Dotnet API Canlı Kodlama",
    description: "Minimal API ile CRUD operasyonu geliştirme oturumu.",
    level: "intermediate",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "API Tasarımı" },
    questions: [],
  },
  {
    id: "mock-live-coding-2",
    type: "LIVE_CODING",
    title: "EF Core Query Optimizasyonu",
    description: "N+1 problem'ini çözme ve query performansını artırma.",
    level: "advanced",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Entity Framework Core" },
    questions: [],
  },
  {
    id: "mock-live-coding-3",
    type: "LIVE_CODING",
    title: "Custom Middleware Geliştirme",
    description: "Request logging ve correlation ID ekleyen middleware yazma.",
    level: "intermediate",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Middleware" },
    questions: [],
  },
  {
    id: "mock-bugfix-1",
    type: "BUG_FIX",
    title: "Repository Pattern Hatası",
    description: "Repository katmanındaki null reference hatasını giderin.",
    level: "advanced",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Hata Ayıklama" },
    questions: [],
  },
  {
    id: "mock-bugfix-2",
    type: "BUG_FIX",
    title: "Memory Leak Tespiti",
    description: "Singleton service'te event handler kaynaklı memory leak'i bulun ve düzeltin.",
    level: "advanced",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Performance" },
    questions: [],
  },
  {
    id: "mock-bugfix-3",
    type: "BUG_FIX",
    title: "EF Core Change Tracking Sorunu",
    description: "AsNoTracking kullanılması gereken yerde tracking açık kalmış, performans sorunu var.",
    level: "intermediate",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Entity Framework Core" },
    questions: [],
  },
  {
    id: "mock-hackathon-1",
    type: "HACKATON",
    title: "Mikroservis Gözlemlenebilirlik Hackathon'u",
    description: "Observability ve dağıtık izleme odaklı iki günlük hackathon.",
    level: "advanced",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Observability" },
    questions: [],
  },
  {
    id: "mock-hackathon-2",
    type: "HACKATON",
    title: "Clean Architecture Hackathon",
    description: "SOLID prensiplerine uygun, test edilebilir bir e-ticaret API'si geliştirin.",
    level: "advanced",
    passingScore: 0,
    course: { ...dotnetCourse, topicContent: "Clean Architecture" },
    questions: [],
  },
];

export function getMockEducationItems(params: {
  type?: EducationType;
  expertise?: string | null;
  topic?: string | null;
  content?: string | null;
  search?: string | null;
}) {
  const { type, expertise, topic, content, search } = params;

  return mockEducationItems.filter((item) => {
    if (type && item.type !== type) return false;
    if (expertise && item.course.expertise !== expertise) return false;
    if (topic && item.course.topic !== topic) return false;
    if (content && item.course.topicContent !== content) return false;
    if (
      search &&
      !`${item.title} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function getMockEducationItemById(id: string) {
  return mockEducationItems.find((item) => item.id === id) ?? null;
}

export function getMockExpertises() {
  return Array.from(
    new Set(
      mockEducationItems
        .map((item) => item.course.expertise)
        .filter((expertise): expertise is string => Boolean(expertise))
    )
  ).sort();
}

export function getMockTopics(expertise: string) {
  return Array.from(
    new Set(
      mockEducationItems
        .filter((item) => item.course.expertise === expertise)
        .map((item) => item.course.topic)
        .filter((topic): topic is string => Boolean(topic))
    )
  ).sort();
}

export function getMockContents(expertise: string, topic: string) {
  return Array.from(
    new Set(
      mockEducationItems
        .filter(
          (item) =>
            item.course.expertise === expertise && item.course.topic === topic
        )
        .map((item) => item.course.topicContent)
        .filter((content): content is string => Boolean(content))
    )
  ).sort();
}


