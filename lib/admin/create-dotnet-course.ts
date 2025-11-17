interface CourseModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTopics: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

interface CourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

/**
 * Create complete .NET Core course structure with predefined content
 */
export async function createDotNetCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting .NET Core course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        ".NET Core, Microsoft'un açık kaynaklı, platformlar arası bir framework'üdür. Bu kapsamlı kurs ile .NET Core'un temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Modern web uygulamaları, API'ler ve mikroservisler geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      ".NET Core framework'ünün temel kavramlarını ve mimarisini anlamak",
      "C# programlama dilini etkili bir şekilde kullanmak",
      "RESTful API'ler ve web uygulamaları geliştirmek",
      "Entity Framework Core ile veritabanı işlemleri yapmak",
      "Dependency Injection ve modern yazılım desenlerini uygulamak",
      "Authentication ve Authorization mekanizmalarını implement etmek",
      "Test yazma ve yazılım kalitesini artırma tekniklerini öğrenmek",
    ],
    prerequisites: [
      "Temel programlama bilgisi",
      "Nesne yönelimli programlama (OOP) kavramlarına aşinalık",
      "HTTP ve web teknolojileri hakkında temel bilgi",
      "Veritabanı kavramlarına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: .NET Core Tanımı",
        summary:
          ".NET Core'un ne olduğu, tarihçesi, avantajları ve diğer teknolojilerden farkları hakkında temel bilgiler.",
        durationMinutes: 450,
        objectives: [
          ".NET Core'un ne olduğunu ve neden kullanıldığını anlamak",
          ".NET Framework ile .NET Core arasındaki farkları öğrenmek",
          ".NET Core'un avantajlarını ve kullanım alanlarını keşfetmek",
          "Platformlar arası geliştirme kavramını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: .NET Core Nedir",
            href: "/education/lessons/dotnet-core/module-01/lesson-01",
            description: ".NET Core'un temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: .NET Core diğer backend teknolojilerinden farkı nedir?",
            href: "/education/lessons/dotnet-core/module-01/lesson-02",
            description: ".NET Core'un Node.js, Python, Java gibi teknolojilerden farkları",
          },
          {
            label: "Ders 3: .NET Core'un Tarihçesi ve Gelişimi",
            href: "/education/lessons/dotnet-core/module-01/lesson-03",
            description: ".NET Core'un ortaya çıkışı ve versiyon geçmişi",
          },
          {
            label: "Ders 4: .NET Core vs .NET Framework",
            href: "/education/lessons/dotnet-core/module-01/lesson-04",
            description: "İki framework arasındaki temel farklar ve karşılaştırma",
          },
          {
            label: "Ders 5: .NET Core'un Avantajları",
            href: "/education/lessons/dotnet-core/module-01/lesson-05",
            description: "Performans, açık kaynak, platform bağımsızlığı gibi avantajlar",
          },
          {
            label: "Ders 6: .NET Core Kullanım Alanları",
            href: "/education/lessons/dotnet-core/module-01/lesson-06",
            description: "Web API, mikroservisler, cloud uygulamaları gibi kullanım senaryoları",
          },
          {
            label: "Ders 7: .NET Core Ekosistemi",
            href: "/education/lessons/dotnet-core/module-01/lesson-07",
            description: "NuGet paketleri, topluluk desteği ve ekosistem",
          },
          {
            label: "Ders 8: .NET Core Lisanslama",
            href: "/education/lessons/dotnet-core/module-01/lesson-08",
            description: "MIT lisansı ve ticari kullanım hakları",
          },
          {
            label: "Ders 9: .NET Core Topluluk Desteği",
            href: "/education/lessons/dotnet-core/module-01/lesson-09",
            description: "Açık kaynak topluluğu ve katkı süreçleri",
          },
          {
            label: "Ders 10: .NET Core'un Geleceği",
            href: "/education/lessons/dotnet-core/module-01/lesson-10",
            description: ".NET 5, .NET 6+ ve gelecek planları",
          },
          {
            label: "Ders 11: .NET Core Kurulum Gereksinimleri",
            href: "/education/lessons/dotnet-core/module-01/lesson-11",
            description: "Sistem gereksinimleri ve desteklenen platformlar",
          },
          {
            label: "Ders 12: .NET Core ile Neler Yapılabilir?",
            href: "/education/lessons/dotnet-core/module-01/lesson-12",
            description: "Web, mobil, desktop ve cloud uygulamaları",
          },
          {
            label: "Ders 13: .NET Core Performans Özellikleri",
            href: "/education/lessons/dotnet-core/module-01/lesson-13",
            description: "Yüksek performans ve ölçeklenebilirlik özellikleri",
          },
          {
            label: "Ders 14: .NET Core Güvenlik Özellikleri",
            href: "/education/lessons/dotnet-core/module-01/lesson-14",
            description: "Güvenlik mekanizmaları ve en iyi uygulamalar",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/dotnet-core/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti ve değerlendirme",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: C# Syntax ve Temelleri",
        summary:
          "C# programlama dilinin temel syntax'ı, veri tipleri, değişkenler, operatörler ve temel programlama kavramları.",
        durationMinutes: 450,
        objectives: [
          "C# syntax kurallarını öğrenmek",
          "Veri tipleri ve değişken kullanımını anlamak",
          "Operatörler ve ifadeleri kullanmak",
          "Temel programlama yapılarını uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: C# Diline Giriş",
            href: "/education/lessons/dotnet-core/module-02/lesson-01",
            description: "C# programlama dilinin temel özellikleri",
          },
          {
            label: "Ders 2: Veri Tipleri ve Değişkenler",
            href: "/education/lessons/dotnet-core/module-02/lesson-02",
            description: "int, string, bool gibi temel veri tipleri",
          },
          {
            label: "Ders 3: Operatörler",
            href: "/education/lessons/dotnet-core/module-02/lesson-03",
            description: "Aritmetik, karşılaştırma ve mantıksal operatörler",
          },
          {
            label: "Ders 4: Koşul İfadeleri (if-else)",
            href: "/education/lessons/dotnet-core/module-02/lesson-04",
            description: "Koşullu programlama ve if-else yapıları",
          },
          {
            label: "Ders 5: Switch-Case Yapısı",
            href: "/education/lessons/dotnet-core/module-02/lesson-05",
            description: "Çoklu koşul kontrolü için switch-case",
          },
          {
            label: "Ders 6: Döngüler (for, while, foreach)",
            href: "/education/lessons/dotnet-core/module-02/lesson-06",
            description: "Tekrarlayan işlemler için döngü yapıları",
          },
          {
            label: "Ders 7: Diziler (Arrays)",
            href: "/education/lessons/dotnet-core/module-02/lesson-07",
            description: "Dizi tanımlama ve kullanımı",
          },
          {
            label: "Ders 8: String İşlemleri",
            href: "/education/lessons/dotnet-core/module-02/lesson-08",
            description: "String manipülasyonu ve metodları",
          },
          {
            label: "Ders 9: Metodlar (Methods)",
            href: "/education/lessons/dotnet-core/module-02/lesson-09",
            description: "Metod tanımlama ve çağırma",
          },
          {
            label: "Ders 10: Parametreler ve Return Değerleri",
            href: "/education/lessons/dotnet-core/module-02/lesson-10",
            description: "Metod parametreleri ve dönüş değerleri",
          },
          {
            label: "Ders 11: Nullable Types",
            href: "/education/lessons/dotnet-core/module-02/lesson-11",
            description: "Null değer alabilen veri tipleri",
          },
          {
            label: "Ders 12: Enum Kullanımı",
            href: "/education/lessons/dotnet-core/module-02/lesson-12",
            description: "Sabit değer listeleri için enum",
          },
          {
            label: "Ders 13: Struct ve Class Farkı",
            href: "/education/lessons/dotnet-core/module-02/lesson-13",
            description: "Value type vs reference type",
          },
          {
            label: "Ders 14: Exception Handling (try-catch)",
            href: "/education/lessons/dotnet-core/module-02/lesson-14",
            description: "Hata yönetimi ve exception handling",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/dotnet-core/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Nesne Yönelimli Programlama (OOP)",
        summary:
          "Sınıflar, nesneler, kalıtım, polimorfizm, encapsulation ve abstraction gibi OOP prensipleri.",
        durationMinutes: 450,
        objectives: [
          "OOP prensiplerini anlamak ve uygulamak",
          "Sınıf ve nesne kavramlarını öğrenmek",
          "Kalıtım ve polimorfizm kullanmak",
          "Encapsulation ve abstraction uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: OOP Prensiplerine Giriş",
            href: "/education/lessons/dotnet-core/module-03/lesson-01",
            description: "Nesne yönelimli programlamanın temelleri",
          },
          {
            label: "Ders 2: Class ve Object Kavramları",
            href: "/education/lessons/dotnet-core/module-03/lesson-02",
            description: "Sınıf tanımlama ve nesne oluşturma",
          },
          {
            label: "Ders 3: Constructor ve Destructor",
            href: "/education/lessons/dotnet-core/module-03/lesson-03",
            description: "Nesne başlatma ve temizleme",
          },
          {
            label: "Ders 4: Properties ve Access Modifiers",
            href: "/education/lessons/dotnet-core/module-03/lesson-04",
            description: "Property tanımlama ve erişim kontrolü",
          },
          {
            label: "Ders 5: Encapsulation (Kapsülleme)",
            href: "/education/lessons/dotnet-core/module-03/lesson-05",
            description: "Veri gizleme ve kapsülleme prensibi",
          },
          {
            label: "Ders 6: Inheritance (Kalıtım)",
            href: "/education/lessons/dotnet-core/module-03/lesson-06",
            description: "Sınıf kalıtımı ve base class kullanımı",
          },
          {
            label: "Ders 7: Polymorphism (Çok Biçimlilik)",
            href: "/education/lessons/dotnet-core/module-03/lesson-07",
            description: "Method overriding ve virtual/override",
          },
          {
            label: "Ders 8: Abstract Class ve Interface",
            href: "/education/lessons/dotnet-core/module-03/lesson-08",
            description: "Soyut sınıflar ve arayüzler",
          },
          {
            label: "Ders 9: Interface Kullanımı",
            href: "/education/lessons/dotnet-core/module-03/lesson-09",
            description: "Interface tanımlama ve implementasyon",
          },
          {
            label: "Ders 10: Abstraction (Soyutlama)",
            href: "/education/lessons/dotnet-core/module-03/lesson-10",
            description: "Soyutlama prensibi ve uygulaması",
          },
          {
            label: "Ders 11: Static Class ve Members",
            href: "/education/lessons/dotnet-core/module-03/lesson-11",
            description: "Static anahtar kelimesi kullanımı",
          },
          {
            label: "Ders 12: Sealed Class ve Method",
            href: "/education/lessons/dotnet-core/module-03/lesson-12",
            description: "Kalıtımı engelleme",
          },
          {
            label: "Ders 13: Partial Class",
            href: "/education/lessons/dotnet-core/module-03/lesson-13",
            description: "Sınıfları bölme ve partial kullanımı",
          },
          {
            label: "Ders 14: Nested Class",
            href: "/education/lessons/dotnet-core/module-03/lesson-14",
            description: "İç içe sınıf tanımlama",
          },
          {
            label: "Ders 15: OOP Best Practices",
            href: "/education/lessons/dotnet-core/module-03/lesson-15",
            description: "OOP tasarım prensipleri ve en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: .NET Core Mimarisi",
        summary:
          ".NET Core'un mimari yapısı, runtime, CLR, BCL (Base Class Library) ve framework bileşenleri.",
        durationMinutes: 450,
        objectives: [
          ".NET Core mimarisini anlamak",
          "CLR ve runtime kavramlarını öğrenmek",
          "Base Class Library'yi tanımak",
          "Framework bileşenlerini anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: .NET Core Mimarisine Genel Bakış",
            href: "/education/lessons/dotnet-core/module-04/lesson-01",
            description: ".NET Core'un genel mimari yapısı",
          },
          {
            label: "Ders 2: Common Language Runtime (CLR)",
            href: "/education/lessons/dotnet-core/module-04/lesson-02",
            description: "CLR'in rolü ve işlevleri",
          },
          {
            label: "Ders 3: Base Class Library (BCL)",
            href: "/education/lessons/dotnet-core/module-04/lesson-03",
            description: "Temel sınıf kütüphanesi ve kullanımı",
          },
          {
            label: "Ders 4: .NET Core Runtime",
            href: "/education/lessons/dotnet-core/module-04/lesson-04",
            description: "Runtime yapısı ve çalışma prensipleri",
          },
          {
            label: "Ders 5: Assembly ve Namespace",
            href: "/education/lessons/dotnet-core/module-04/lesson-05",
            description: "Assembly kavramı ve namespace kullanımı",
          },
          {
            label: "Ders 6: Garbage Collection",
            href: "/education/lessons/dotnet-core/module-04/lesson-06",
            description: "Bellek yönetimi ve çöp toplama",
          },
          {
            label: "Ders 7: Just-In-Time (JIT) Compilation",
            href: "/education/lessons/dotnet-core/module-04/lesson-07",
            description: "JIT derleme süreci",
          },
          {
            label: "Ders 8: .NET Core SDK ve Runtime",
            href: "/education/lessons/dotnet-core/module-04/lesson-08",
            description: "SDK ve runtime farkları",
          },
          {
            label: "Ders 9: Package Management",
            href: "/education/lessons/dotnet-core/module-04/lesson-09",
            description: "NuGet paket yönetimi",
          },
          {
            label: "Ders 10: Project File Yapısı",
            href: "/education/lessons/dotnet-core/module-04/lesson-10",
            description: ".csproj dosyası ve yapılandırma",
          },
          {
            label: "Ders 11: Dependency Management",
            href: "/education/lessons/dotnet-core/module-04/lesson-11",
            description: "Bağımlılık yönetimi ve çözümleme",
          },
          {
            label: "Ders 12: Framework Targeting",
            href: "/education/lessons/dotnet-core/module-04/lesson-12",
            description: "Framework hedefleme ve uyumluluk",
          },
          {
            label: "Ders 13: Cross-Platform Development",
            href: "/education/lessons/dotnet-core/module-04/lesson-13",
            description: "Platformlar arası geliştirme",
          },
          {
            label: "Ders 14: .NET Core Deployment",
            href: "/education/lessons/dotnet-core/module-04/lesson-14",
            description: "Dağıtım modelleri ve seçenekleri",
          },
          {
            label: "Ders 15: Mimarı Karşılaştırma",
            href: "/education/lessons/dotnet-core/module-04/lesson-15",
            description: ".NET Core vs diğer framework'ler",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Dependency Injection",
        summary:
          "Dependency Injection deseni, IoC container'lar, servis yaşam döngüleri ve DI best practices.",
        durationMinutes: 450,
        objectives: [
          "Dependency Injection kavramını anlamak",
          "IoC container kullanmayı öğrenmek",
          "Servis yaşam döngülerini yönetmek",
          "DI best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Dependency Injection Nedir?",
            href: "/education/lessons/dotnet-core/module-05/lesson-01",
            description: "DI kavramına giriş ve temel prensipler",
          },
          {
            label: "Ders 2: Inversion of Control (IoC)",
            href: "/education/lessons/dotnet-core/module-05/lesson-02",
            description: "Kontrolün tersine çevrilmesi prensibi",
          },
          {
            label: "Ders 3: .NET Core DI Container",
            href: "/education/lessons/dotnet-core/module-05/lesson-03",
            description: "Built-in DI container kullanımı",
          },
          {
            label: "Ders 4: Service Registration",
            href: "/education/lessons/dotnet-core/module-05/lesson-04",
            description: "Servis kayıt işlemleri",
          },
          {
            label: "Ders 5: Service Lifetimes",
            href: "/education/lessons/dotnet-core/module-05/lesson-05",
            description: "Singleton, Scoped, Transient yaşam döngüleri",
          },
          {
            label: "Ders 6: Constructor Injection",
            href: "/education/lessons/dotnet-core/module-05/lesson-06",
            description: "Constructor üzerinden bağımlılık enjeksiyonu",
          },
          {
            label: "Ders 7: Property Injection",
            href: "/education/lessons/dotnet-core/module-05/lesson-07",
            description: "Property üzerinden enjeksiyon",
          },
          {
            label: "Ders 8: Method Injection",
            href: "/education/lessons/dotnet-core/module-05/lesson-08",
            description: "Metod parametresi olarak enjeksiyon",
          },
          {
            label: "Ders 9: Interface-based DI",
            href: "/education/lessons/dotnet-core/module-05/lesson-09",
            description: "Interface kullanarak bağımlılık yönetimi",
          },
          {
            label: "Ders 10: Multiple Implementations",
            href: "/education/lessons/dotnet-core/module-05/lesson-10",
            description: "Aynı interface için birden fazla implementasyon",
          },
          {
            label: "Ders 11: Factory Pattern with DI",
            href: "/education/lessons/dotnet-core/module-05/lesson-11",
            description: "Factory pattern ve DI birlikte kullanımı",
          },
          {
            label: "Ders 12: Third-party DI Containers",
            href: "/education/lessons/dotnet-core/module-05/lesson-12",
            description: "Autofac, Ninject gibi container'lar",
          },
          {
            label: "Ders 13: DI Best Practices",
            href: "/education/lessons/dotnet-core/module-05/lesson-13",
            description: "En iyi uygulamalar ve anti-pattern'ler",
          },
          {
            label: "Ders 14: DI Testing",
            href: "/education/lessons/dotnet-core/module-05/lesson-14",
            description: "DI ile test yazma stratejileri",
          },
          {
            label: "Ders 15: Advanced DI Scenarios",
            href: "/education/lessons/dotnet-core/module-05/lesson-15",
            description: "İleri seviye DI senaryoları",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Entity Framework Core",
        summary:
          "ORM framework'ü, veritabanı işlemleri, migrations, LINQ sorguları ve EF Core best practices.",
        durationMinutes: 450,
        objectives: [
          "Entity Framework Core'u anlamak",
          "Veritabanı işlemlerini yapmak",
          "Migration'ları yönetmek",
          "LINQ sorguları yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Entity Framework Core Giriş",
            href: "/education/lessons/dotnet-core/module-06/lesson-01",
            description: "EF Core'un ne olduğu ve avantajları",
          },
          {
            label: "Ders 2: Code First Approach",
            href: "/education/lessons/dotnet-core/module-06/lesson-02",
            description: "Code First yaklaşımı ile model tanımlama",
          },
          {
            label: "Ders 3: DbContext Oluşturma",
            href: "/education/lessons/dotnet-core/module-06/lesson-03",
            description: "DbContext sınıfı ve yapılandırma",
          },
          {
            label: "Ders 4: Entity Configuration",
            href: "/education/lessons/dotnet-core/module-06/lesson-04",
            description: "Entity yapılandırması ve fluent API",
          },
          {
            label: "Ders 5: Relationships (İlişkiler)",
            href: "/education/lessons/dotnet-core/module-06/lesson-05",
            description: "One-to-One, One-to-Many, Many-to-Many",
          },
          {
            label: "Ders 6: Migrations",
            href: "/education/lessons/dotnet-core/module-06/lesson-06",
            description: "Migration oluşturma ve uygulama",
          },
          {
            label: "Ders 7: LINQ Queries",
            href: "/education/lessons/dotnet-core/module-06/lesson-07",
            description: "LINQ ile veritabanı sorguları",
          },
          {
            label: "Ders 8: CRUD Operations",
            href: "/education/lessons/dotnet-core/module-06/lesson-08",
            description: "Create, Read, Update, Delete işlemleri",
          },
          {
            label: "Ders 9: Async Operations",
            href: "/education/lessons/dotnet-core/module-06/lesson-09",
            description: "Asenkron veritabanı işlemleri",
          },
          {
            label: "Ders 10: Query Performance",
            href: "/education/lessons/dotnet-core/module-06/lesson-10",
            description: "Sorgu performansı optimizasyonu",
          },
          {
            label: "Ders 11: Raw SQL Queries",
            href: "/education/lessons/dotnet-core/module-06/lesson-11",
            description: "Ham SQL sorguları çalıştırma",
          },
          {
            label: "Ders 12: Database Providers",
            href: "/education/lessons/dotnet-core/module-06/lesson-12",
            description: "SQL Server, PostgreSQL, MySQL desteği",
          },
          {
            label: "Ders 13: Change Tracking",
            href: "/education/lessons/dotnet-core/module-06/lesson-13",
            description: "Değişiklik takibi mekanizması",
          },
          {
            label: "Ders 14: Transactions",
            href: "/education/lessons/dotnet-core/module-06/lesson-14",
            description: "Transaction yönetimi",
          },
          {
            label: "Ders 15: EF Core Best Practices",
            href: "/education/lessons/dotnet-core/module-06/lesson-15",
            description: "En iyi uygulamalar ve performans ipuçları",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Web API Geliştirme",
        summary:
          "RESTful API tasarımı, ASP.NET Core Web API, routing, controller'lar, middleware ve API best practices.",
        durationMinutes: 450,
        objectives: [
          "RESTful API tasarım prensiplerini öğrenmek",
          "ASP.NET Core Web API projesi oluşturmak",
          "Controller ve routing yapılandırması yapmak",
          "API best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: RESTful API Nedir?",
            href: "/education/lessons/dotnet-core/module-07/lesson-01",
            description: "REST prensipleri ve API tasarımı",
          },
          {
            label: "Ders 2: ASP.NET Core Web API Projesi",
            href: "/education/lessons/dotnet-core/module-07/lesson-02",
            description: "Web API projesi oluşturma",
          },
          {
            label: "Ders 3: Controller Yapısı",
            href: "/education/lessons/dotnet-core/module-07/lesson-03",
            description: "Controller sınıfları ve action metodları",
          },
          {
            label: "Ders 4: Routing Yapılandırması",
            href: "/education/lessons/dotnet-core/module-07/lesson-04",
            description: "Route tanımlama ve yapılandırma",
          },
          {
            label: "Ders 5: HTTP Verbs ve Actions",
            href: "/education/lessons/dotnet-core/module-07/lesson-05",
            description: "GET, POST, PUT, DELETE metodları",
          },
          {
            label: "Ders 6: Request ve Response Models",
            href: "/education/lessons/dotnet-core/module-07/lesson-06",
            description: "DTO'lar ve model binding",
          },
          {
            label: "Ders 7: Status Codes",
            href: "/education/lessons/dotnet-core/module-07/lesson-07",
            description: "HTTP durum kodları ve kullanımı",
          },
          {
            label: "Ders 8: API Versioning",
            href: "/education/lessons/dotnet-core/module-07/lesson-08",
            description: "API versiyonlama stratejileri",
          },
          {
            label: "Ders 9: Content Negotiation",
            href: "/education/lessons/dotnet-core/module-07/lesson-09",
            description: "JSON, XML format desteği",
          },
          {
            label: "Ders 10: API Documentation (Swagger)",
            href: "/education/lessons/dotnet-core/module-07/lesson-10",
            description: "Swagger/OpenAPI entegrasyonu",
          },
          {
            label: "Ders 11: Error Handling",
            href: "/education/lessons/dotnet-core/module-07/lesson-11",
            description: "Hata yönetimi ve exception handling",
          },
          {
            label: "Ders 12: API Validation",
            href: "/education/lessons/dotnet-core/module-07/lesson-12",
            description: "Model validation ve data annotations",
          },
          {
            label: "Ders 13: API Security",
            href: "/education/lessons/dotnet-core/module-07/lesson-13",
            description: "Güvenlik best practices",
          },
          {
            label: "Ders 14: API Testing",
            href: "/education/lessons/dotnet-core/module-07/lesson-14",
            description: "API test stratejileri",
          },
          {
            label: "Ders 15: API Best Practices",
            href: "/education/lessons/dotnet-core/module-07/lesson-15",
            description: "RESTful API tasarım en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Authentication & Authorization",
        summary:
          "Kimlik doğrulama ve yetkilendirme mekanizmaları, JWT tokens, OAuth, Identity framework ve güvenlik.",
        durationMinutes: 450,
        objectives: [
          "Authentication ve Authorization kavramlarını anlamak",
          "JWT token kullanmayı öğrenmek",
          "ASP.NET Core Identity kullanmak",
          "Güvenlik best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Authentication vs Authorization",
            href: "/education/lessons/dotnet-core/module-08/lesson-01",
            description: "Kimlik doğrulama ve yetkilendirme farkları",
          },
          {
            label: "Ders 2: JWT (JSON Web Tokens)",
            href: "/education/lessons/dotnet-core/module-08/lesson-02",
            description: "JWT token yapısı ve kullanımı",
          },
          {
            label: "Ders 3: JWT Implementation",
            href: "/education/lessons/dotnet-core/module-08/lesson-03",
            description: "JWT token oluşturma ve doğrulama",
          },
          {
            label: "Ders 4: ASP.NET Core Identity",
            href: "/education/lessons/dotnet-core/module-08/lesson-04",
            description: "Identity framework'e giriş",
          },
          {
            label: "Ders 5: User Registration",
            href: "/education/lessons/dotnet-core/module-08/lesson-05",
            description: "Kullanıcı kayıt işlemleri",
          },
          {
            label: "Ders 6: User Login",
            href: "/education/lessons/dotnet-core/module-08/lesson-06",
            description: "Giriş işlemleri ve token üretme",
          },
          {
            label: "Ders 7: Password Hashing",
            href: "/education/lessons/dotnet-core/module-08/lesson-07",
            description: "Şifre hashleme ve güvenlik",
          },
          {
            label: "Ders 8: Role-based Authorization",
            href: "/education/lessons/dotnet-core/module-08/lesson-08",
            description: "Rol tabanlı yetkilendirme",
          },
          {
            label: "Ders 9: Policy-based Authorization",
            href: "/education/lessons/dotnet-core/module-08/lesson-09",
            description: "Politika tabanlı yetkilendirme",
          },
          {
            label: "Ders 10: Claims-based Authorization",
            href: "/education/lessons/dotnet-core/module-08/lesson-10",
            description: "Claim tabanlı yetkilendirme",
          },
          {
            label: "Ders 11: OAuth 2.0",
            href: "/education/lessons/dotnet-core/module-08/lesson-11",
            description: "OAuth 2.0 protokolü ve kullanımı",
          },
          {
            label: "Ders 12: External Authentication",
            href: "/education/lessons/dotnet-core/module-08/lesson-12",
            description: "Google, Facebook gibi dış servislerle giriş",
          },
          {
            label: "Ders 13: Refresh Tokens",
            href: "/education/lessons/dotnet-core/module-08/lesson-13",
            description: "Token yenileme mekanizması",
          },
          {
            label: "Ders 14: Security Best Practices",
            href: "/education/lessons/dotnet-core/module-08/lesson-14",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 15: Authentication Testing",
            href: "/education/lessons/dotnet-core/module-08/lesson-15",
            description: "Auth mekanizmalarını test etme",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Testing",
        summary:
          "Unit testing, integration testing, test frameworks (xUnit, NUnit), mocking ve test best practices.",
        durationMinutes: 450,
        objectives: [
          "Test yazma prensiplerini öğrenmek",
          "Unit test yazmak",
          "Integration test yazmak",
          "Mocking ve test araçlarını kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/dotnet-core/module-09/lesson-01",
            description: "Test türleri ve test pyramid",
          },
          {
            label: "Ders 2: xUnit Framework",
            href: "/education/lessons/dotnet-core/module-09/lesson-02",
            description: "xUnit test framework'üne giriş",
          },
          {
            label: "Ders 3: Unit Test Yazma",
            href: "/education/lessons/dotnet-core/module-09/lesson-03",
            description: "İlk unit test örnekleri",
          },
          {
            label: "Ders 4: Test Assertions",
            href: "/education/lessons/dotnet-core/module-09/lesson-04",
            description: "Assert metodları ve kullanımı",
          },
          {
            label: "Ders 5: Test Organization",
            href: "/education/lessons/dotnet-core/module-09/lesson-05",
            description: "Test organizasyonu ve yapısı",
          },
          {
            label: "Ders 6: Mocking with Moq",
            href: "/education/lessons/dotnet-core/module-09/lesson-06",
            description: "Moq framework ile mock oluşturma",
          },
          {
            label: "Ders 7: Test Data Builders",
            href: "/education/lessons/dotnet-core/module-09/lesson-07",
            description: "Test verisi oluşturma stratejileri",
          },
          {
            label: "Ders 8: Integration Testing",
            href: "/education/lessons/dotnet-core/module-09/lesson-08",
            description: "Entegrasyon testleri yazma",
          },
          {
            label: "Ders 9: API Testing",
            href: "/education/lessons/dotnet-core/module-09/lesson-09",
            description: "Web API testleri",
          },
          {
            label: "Ders 10: Database Testing",
            href: "/education/lessons/dotnet-core/module-09/lesson-10",
            description: "Veritabanı test stratejileri",
          },
          {
            label: "Ders 11: Test Coverage",
            href: "/education/lessons/dotnet-core/module-09/lesson-11",
            description: "Test kapsamı analizi",
          },
          {
            label: "Ders 12: Test-Driven Development (TDD)",
            href: "/education/lessons/dotnet-core/module-09/lesson-12",
            description: "TDD yaklaşımı ve uygulaması",
          },
          {
            label: "Ders 13: Behavior-Driven Development (BDD)",
            href: "/education/lessons/dotnet-core/module-09/lesson-13",
            description: "BDD yaklaşımı ve SpecFlow",
          },
          {
            label: "Ders 14: Performance Testing",
            href: "/education/lessons/dotnet-core/module-09/lesson-14",
            description: "Performans testleri",
          },
          {
            label: "Ders 15: Testing Best Practices",
            href: "/education/lessons/dotnet-core/module-09/lesson-15",
            description: "Test yazma en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Performance Optimization",
        summary:
          "Performans optimizasyonu, caching, async/await, memory management ve profiling teknikleri.",
        durationMinutes: 450,
        objectives: [
          "Performans optimizasyon tekniklerini öğrenmek",
          "Caching stratejileri uygulamak",
          "Async/await kullanımını optimize etmek",
          "Memory management yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/dotnet-core/module-10/lesson-01",
            description: "Performans ölçümü ve metrikler",
          },
          {
            label: "Ders 2: Profiling Tools",
            href: "/education/lessons/dotnet-core/module-10/lesson-02",
            description: "Performance profiler araçları",
          },
          {
            label: "Ders 3: Memory Management",
            href: "/education/lessons/dotnet-core/module-10/lesson-03",
            description: "Bellek yönetimi ve optimizasyon",
          },
          {
            label: "Ders 4: Caching Strategies",
            href: "/education/lessons/dotnet-core/module-10/lesson-04",
            description: "Önbellekleme stratejileri",
          },
          {
            label: "Ders 5: In-Memory Caching",
            href: "/education/lessons/dotnet-core/module-10/lesson-05",
            description: "IMemoryCache kullanımı",
          },
          {
            label: "Ders 6: Distributed Caching",
            href: "/education/lessons/dotnet-core/module-10/lesson-06",
            description: "Redis gibi dağıtık cache",
          },
          {
            label: "Ders 7: Async/Await Optimization",
            href: "/education/lessons/dotnet-core/module-10/lesson-07",
            description: "Asenkron kod optimizasyonu",
          },
          {
            label: "Ders 8: Database Query Optimization",
            href: "/education/lessons/dotnet-core/module-10/lesson-08",
            description: "Veritabanı sorgu optimizasyonu",
          },
          {
            label: "Ders 9: Connection Pooling",
            href: "/education/lessons/dotnet-core/module-10/lesson-09",
            description: "Bağlantı havuzlama",
          },
          {
            label: "Ders 10: Response Compression",
            href: "/education/lessons/dotnet-core/module-10/lesson-10",
            description: "Yanıt sıkıştırma",
          },
          {
            label: "Ders 11: Lazy Loading",
            href: "/education/lessons/dotnet-core/module-10/lesson-11",
            description: "Tembel yükleme stratejileri",
          },
          {
            label: "Ders 12: Pagination",
            href: "/education/lessons/dotnet-core/module-10/lesson-12",
            description: "Sayfalama ve veri sınırlama",
          },
          {
            label: "Ders 13: Background Jobs",
            href: "/education/lessons/dotnet-core/module-10/lesson-13",
            description: "Arka plan işleri ve queue'lar",
          },
          {
            label: "Ders 14: Load Testing",
            href: "/education/lessons/dotnet-core/module-10/lesson-14",
            description: "Yük testleri ve stres testleri",
          },
          {
            label: "Ders 15: Performance Best Practices",
            href: "/education/lessons/dotnet-core/module-10/lesson-15",
            description: "Performans optimizasyon en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Deployment",
        summary:
          "Uygulama dağıtımı, Docker containerization, CI/CD pipelines, cloud deployment ve production best practices.",
        durationMinutes: 450,
        objectives: [
          "Uygulama dağıtım stratejilerini öğrenmek",
          "Docker containerization yapmak",
          "CI/CD pipeline'ları kurmak",
          "Cloud deployment yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Stratejileri",
            href: "/education/lessons/dotnet-core/module-11/lesson-01",
            description: "Dağıtım modelleri ve seçenekleri",
          },
          {
            label: "Ders 2: Docker Temelleri",
            href: "/education/lessons/dotnet-core/module-11/lesson-02",
            description: "Docker kavramları ve kullanımı",
          },
          {
            label: "Ders 3: Dockerfile Oluşturma",
            href: "/education/lessons/dotnet-core/module-11/lesson-03",
            description: ".NET Core için Dockerfile",
          },
          {
            label: "Ders 4: Docker Compose",
            href: "/education/lessons/dotnet-core/module-11/lesson-04",
            description: "Multi-container uygulamalar",
          },
          {
            label: "Ders 5: Environment Configuration",
            href: "/education/lessons/dotnet-core/module-11/lesson-05",
            description: "Ortam yapılandırması ve appsettings",
          },
          {
            label: "Ders 6: CI/CD Concepts",
            href: "/education/lessons/dotnet-core/module-11/lesson-06",
            description: "Sürekli entegrasyon ve dağıtım",
          },
          {
            label: "Ders 7: GitHub Actions",
            href: "/education/lessons/dotnet-core/module-11/lesson-07",
            description: "GitHub Actions ile CI/CD",
          },
          {
            label: "Ders 8: Azure Deployment",
            href: "/education/lessons/dotnet-core/module-11/lesson-08",
            description: "Azure App Service'e dağıtım",
          },
          {
            label: "Ders 9: AWS Deployment",
            href: "/education/lessons/dotnet-core/module-11/lesson-09",
            description: "AWS Elastic Beanstalk ve ECS",
          },
          {
            label: "Ders 10: Linux Deployment",
            href: "/education/lessons/dotnet-core/module-11/lesson-10",
            description: "Linux sunuculara dağıtım",
          },
          {
            label: "Ders 11: Windows Deployment",
            href: "/education/lessons/dotnet-core/module-11/lesson-11",
            description: "IIS ve Windows Server",
          },
          {
            label: "Ders 12: Health Checks",
            href: "/education/lessons/dotnet-core/module-11/lesson-12",
            description: "Sağlık kontrolü ve monitoring",
          },
          {
            label: "Ders 13: Logging and Monitoring",
            href: "/education/lessons/dotnet-core/module-11/lesson-13",
            description: "Loglama ve izleme stratejileri",
          },
          {
            label: "Ders 14: Scaling Strategies",
            href: "/education/lessons/dotnet-core/module-11/lesson-14",
            description: "Ölçeklendirme stratejileri",
          },
          {
            label: "Ders 15: Production Best Practices",
            href: "/education/lessons/dotnet-core/module-11/lesson-15",
            description: "Production ortamı en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Microservices",
        summary:
          "Mikroservis mimarisi, service communication, API Gateway, service discovery ve distributed systems.",
        durationMinutes: 450,
        objectives: [
          "Mikroservis mimarisini anlamak",
          "Servis iletişimini yönetmek",
          "API Gateway kullanmak",
          "Distributed systems desenlerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Microservices Mimarisi",
            href: "/education/lessons/dotnet-core/module-12/lesson-01",
            description: "Mikroservis kavramı ve avantajları",
          },
          {
            label: "Ders 2: Monolith vs Microservices",
            href: "/education/lessons/dotnet-core/module-12/lesson-02",
            description: "Monolitik vs mikroservis karşılaştırması",
          },
          {
            label: "Ders 3: Service Communication",
            href: "/education/lessons/dotnet-core/module-12/lesson-03",
            description: "Servisler arası iletişim",
          },
          {
            label: "Ders 4: RESTful Communication",
            href: "/education/lessons/dotnet-core/module-12/lesson-04",
            description: "HTTP/REST ile servis iletişimi",
          },
          {
            label: "Ders 5: gRPC Communication",
            href: "/education/lessons/dotnet-core/module-12/lesson-05",
            description: "gRPC protokolü ve kullanımı",
          },
          {
            label: "Ders 6: Message Queues",
            href: "/education/lessons/dotnet-core/module-12/lesson-06",
            description: "RabbitMQ, Azure Service Bus",
          },
          {
            label: "Ders 7: API Gateway",
            href: "/education/lessons/dotnet-core/module-12/lesson-07",
            description: "API Gateway pattern ve Ocelot",
          },
          {
            label: "Ders 8: Service Discovery",
            href: "/education/lessons/dotnet-core/module-12/lesson-08",
            description: "Servis keşfi ve kayıt",
          },
          {
            label: "Ders 9: Circuit Breaker Pattern",
            href: "/education/lessons/dotnet-core/module-12/lesson-09",
            description: "Circuit breaker deseni",
          },
          {
            label: "Ders 10: Distributed Transactions",
            href: "/education/lessons/dotnet-core/module-12/lesson-10",
            description: "Dağıtık transaction yönetimi",
          },
          {
            label: "Ders 11: Event Sourcing",
            href: "/education/lessons/dotnet-core/module-12/lesson-11",
            description: "Event sourcing pattern",
          },
          {
            label: "Ders 12: CQRS Pattern",
            href: "/education/lessons/dotnet-core/module-12/lesson-12",
            description: "Command Query Responsibility Segregation",
          },
          {
            label: "Ders 13: Saga Pattern",
            href: "/education/lessons/dotnet-core/module-12/lesson-13",
            description: "Saga pattern ile transaction yönetimi",
          },
          {
            label: "Ders 14: Microservices Testing",
            href: "/education/lessons/dotnet-core/module-12/lesson-14",
            description: "Mikroservis test stratejileri",
          },
          {
            label: "Ders 15: Microservices Best Practices",
            href: "/education/lessons/dotnet-core/module-12/lesson-15",
            description: "Mikroservis mimarisi en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Advanced Patterns",
        summary:
          "İleri seviye tasarım desenleri, SOLID principles, design patterns ve enterprise architecture patterns.",
        durationMinutes: 450,
        objectives: [
          "SOLID prensiplerini anlamak",
          "Tasarım desenlerini uygulamak",
          "Enterprise architecture patterns öğrenmek",
          "Kod kalitesini artırmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: SOLID Principles",
            href: "/education/lessons/dotnet-core/module-13/lesson-01",
            description: "SOLID prensiplerine giriş",
          },
          {
            label: "Ders 2: Single Responsibility Principle",
            href: "/education/lessons/dotnet-core/module-13/lesson-02",
            description: "Tek sorumluluk prensibi",
          },
          {
            label: "Ders 3: Open/Closed Principle",
            href: "/education/lessons/dotnet-core/module-13/lesson-03",
            description: "Açık/kapalı prensibi",
          },
          {
            label: "Ders 4: Liskov Substitution Principle",
            href: "/education/lessons/dotnet-core/module-13/lesson-04",
            description: "Liskov yerine geçme prensibi",
          },
          {
            label: "Ders 5: Interface Segregation Principle",
            href: "/education/lessons/dotnet-core/module-13/lesson-05",
            description: "Arayüz ayrımı prensibi",
          },
          {
            label: "Ders 6: Dependency Inversion Principle",
            href: "/education/lessons/dotnet-core/module-13/lesson-06",
            description: "Bağımlılık tersine çevirme",
          },
          {
            label: "Ders 7: Creational Patterns",
            href: "/education/lessons/dotnet-core/module-13/lesson-07",
            description: "Factory, Builder, Singleton pattern'leri",
          },
          {
            label: "Ders 8: Structural Patterns",
            href: "/education/lessons/dotnet-core/module-13/lesson-08",
            description: "Adapter, Decorator, Facade pattern'leri",
          },
          {
            label: "Ders 9: Behavioral Patterns",
            href: "/education/lessons/dotnet-core/module-13/lesson-09",
            description: "Observer, Strategy, Command pattern'leri",
          },
          {
            label: "Ders 10: Repository Pattern",
            href: "/education/lessons/dotnet-core/module-13/lesson-10",
            description: "Repository pattern ve uygulaması",
          },
          {
            label: "Ders 11: Unit of Work Pattern",
            href: "/education/lessons/dotnet-core/module-13/lesson-11",
            description: "Unit of Work pattern",
          },
          {
            label: "Ders 12: Mediator Pattern",
            href: "/education/lessons/dotnet-core/module-13/lesson-12",
            description: "MediatR kütüphanesi",
          },
          {
            label: "Ders 13: Specification Pattern",
            href: "/education/lessons/dotnet-core/module-13/lesson-13",
            description: "Specification pattern",
          },
          {
            label: "Ders 14: Clean Architecture",
            href: "/education/lessons/dotnet-core/module-13/lesson-14",
            description: "Temiz mimari prensipleri",
          },
          {
            label: "Ders 15: Domain-Driven Design (DDD)",
            href: "/education/lessons/dotnet-core/module-13/lesson-15",
            description: "DDD kavramları ve uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices",
        summary:
          ".NET Core geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve maintainability.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Maintainable kod yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/dotnet-core/module-14/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Code Review Best Practices",
            href: "/education/lessons/dotnet-core/module-14/lesson-02",
            description: "Kod inceleme en iyi uygulamaları",
          },
          {
            label: "Ders 3: Naming Conventions",
            href: "/education/lessons/dotnet-core/module-14/lesson-03",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 4: Code Documentation",
            href: "/education/lessons/dotnet-core/module-14/lesson-04",
            description: "XML dokümantasyon ve yorumlar",
          },
          {
            label: "Ders 5: Error Handling Strategies",
            href: "/education/lessons/dotnet-core/module-14/lesson-05",
            description: "Hata yönetimi stratejileri",
          },
          {
            label: "Ders 6: Logging Best Practices",
            href: "/education/lessons/dotnet-core/module-14/lesson-06",
            description: "Loglama en iyi uygulamaları",
          },
          {
            label: "Ders 7: Security Best Practices",
            href: "/education/lessons/dotnet-core/module-14/lesson-07",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 8: Configuration Management",
            href: "/education/lessons/dotnet-core/module-14/lesson-08",
            description: "Yapılandırma yönetimi",
          },
          {
            label: "Ders 9: Environment Variables",
            href: "/education/lessons/dotnet-core/module-14/lesson-09",
            description: "Ortam değişkenleri kullanımı",
          },
          {
            label: "Ders 10: Secrets Management",
            href: "/education/lessons/dotnet-core/module-14/lesson-10",
            description: "Gizli bilgi yönetimi",
          },
          {
            label: "Ders 11: Code Refactoring",
            href: "/education/lessons/dotnet-core/module-14/lesson-11",
            description: "Kod refaktörleme teknikleri",
          },
          {
            label: "Ders 12: Technical Debt Management",
            href: "/education/lessons/dotnet-core/module-14/lesson-12",
            description: "Teknik borç yönetimi",
          },
          {
            label: "Ders 13: Maintainability",
            href: "/education/lessons/dotnet-core/module-14/lesson-13",
            description: "Bakım yapılabilirlik prensipleri",
          },
          {
            label: "Ders 14: Code Metrics",
            href: "/education/lessons/dotnet-core/module-14/lesson-14",
            description: "Kod metrikleri ve analiz",
          },
          {
            label: "Ders 15: Continuous Improvement",
            href: "/education/lessons/dotnet-core/module-14/lesson-15",
            description: "Sürekli iyileştirme kültürü",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir proje geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
        durationMinutes: 450,
        objectives: [
          "Tüm öğrenilenleri bir projede uygulamak",
          "Gerçek dünya senaryosu geliştirmek",
          "Portfolio projesi oluşturmak",
          "End-to-end uygulama geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Proje Planlama",
            href: "/education/lessons/dotnet-core/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/dotnet-core/module-15/lesson-02",
            description: "Sistem mimarisi tasarımı",
          },
          {
            label: "Ders 3: Database Design",
            href: "/education/lessons/dotnet-core/module-15/lesson-03",
            description: "Veritabanı tasarımı ve şema",
          },
          {
            label: "Ders 4: API Development",
            href: "/education/lessons/dotnet-core/module-15/lesson-04",
            description: "RESTful API geliştirme",
          },
          {
            label: "Ders 5: Authentication Implementation",
            href: "/education/lessons/dotnet-core/module-15/lesson-05",
            description: "Kimlik doğrulama implementasyonu",
          },
          {
            label: "Ders 6: Business Logic",
            href: "/education/lessons/dotnet-core/module-15/lesson-06",
            description: "İş mantığı geliştirme",
          },
          {
            label: "Ders 7: Error Handling",
            href: "/education/lessons/dotnet-core/module-15/lesson-07",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 8: Testing Strategy",
            href: "/education/lessons/dotnet-core/module-15/lesson-08",
            description: "Test stratejisi ve implementasyonu",
          },
          {
            label: "Ders 9: Performance Optimization",
            href: "/education/lessons/dotnet-core/module-15/lesson-09",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 10: Security Hardening",
            href: "/education/lessons/dotnet-core/module-15/lesson-10",
            description: "Güvenlik sertleştirme",
          },
          {
            label: "Ders 11: Documentation",
            href: "/education/lessons/dotnet-core/module-15/lesson-11",
            description: "API dokümantasyonu ve kullanım kılavuzu",
          },
          {
            label: "Ders 12: Deployment Preparation",
            href: "/education/lessons/dotnet-core/module-15/lesson-12",
            description: "Dağıtım hazırlığı ve yapılandırma",
          },
          {
            label: "Ders 13: CI/CD Setup",
            href: "/education/lessons/dotnet-core/module-15/lesson-13",
            description: "Sürekli entegrasyon ve dağıtım kurulumu",
          },
          {
            label: "Ders 14: Monitoring and Logging",
            href: "/education/lessons/dotnet-core/module-15/lesson-14",
            description: "İzleme ve loglama implementasyonu",
          },
          {
            label: "Ders 15: Project Review and Presentation",
            href: "/education/lessons/dotnet-core/module-15/lesson-15",
            description: "Proje incelemesi ve sunumu",
          },
        ],
      },
    ],
  };

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${courseContent.modules.length}, Total lessons: ${courseContent.modules.reduce(
      (sum, m) => sum + m.relatedTopics.length,
      0
    )}`
  );

  return courseContent;
}
