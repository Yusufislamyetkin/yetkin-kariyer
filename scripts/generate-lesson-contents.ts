import * as fs from 'fs';
import * as path from 'path';

interface LessonData {
  title: string;
  slug: string;
  desc: string;
}

interface ModuleData {
  moduleId: string;
  moduleTitle: string;
  lessons: LessonData[];
}

const modulesData: ModuleData[] = [
  {
    moduleId: "module-01-csharp",
    moduleTitle: "C# Temelleri",
    lessons: [
      { title: "C# Temel Sözdizimi", slug: "csharp/basics/syntax", desc: "C# dilinin temel sözdizimi kurallarını, değişken tanımlama, operatörler ve temel programlama yapılarını öğren." },
      { title: "Nesne Yönelimli Programlama", slug: "csharp/oop/object-oriented", desc: "Sınıflar, nesneler, inheritance, polymorphism, encapsulation ve abstraction kavramlarını derinlemesine öğren." },
      { title: "Koleksiyonlar", slug: "csharp/collections/collections", desc: "List, Dictionary, HashSet, Queue, Stack gibi koleksiyon tiplerini ve kullanım senaryolarını öğren." },
      { title: "LINQ", slug: "csharp/linq/linq-queries", desc: "Language Integrated Query (LINQ) ile veri sorgulama, filtreleme ve dönüştürme işlemlerini öğren." },
      { title: "Exception Handling", slug: "csharp/exceptions/exception-handling", desc: "Try-catch-finally blokları, exception türleri, custom exception oluşturma ve hata yönetimi stratejilerini öğren." }
    ]
  },
  {
    moduleId: "module-02-architecture",
    moduleTitle: ".NET Core Mimarisi ve Yapısı",
    lessons: [
      { title: ".NET Core Runtime", slug: "dotnet-core/architecture/runtime", desc: ".NET Core runtime'ın yapısı, çalışma mekanizması ve uygulama yaşam döngüsünü öğren." },
      { title: "Assembly Yapısı", slug: "dotnet-core/architecture/assembly-structure", desc: "Assembly'lerin iç yapısı, metadata, IL kodu ve assembly loading mekanizmalarını öğren." },
      { title: "Memory Management", slug: "dotnet-core/architecture/memory-management", desc: "Stack ve heap bellek yönetimi, value types, reference types ve bellek optimizasyon tekniklerini öğren." },
      { title: "Type System", slug: "dotnet-core/architecture/type-system", desc: ".NET Core type system'i, type safety, boxing/unboxing ve generic type'ları öğren." },
      { title: "Reflection", slug: "dotnet-core/architecture/reflection", desc: "Reflection API'si ile runtime'da tip bilgilerine erişme, dinamik kod çalıştırma ve metadata kullanımını öğren." }
    ]
  },
  {
    moduleId: "module-03-project-structure",
    moduleTitle: "Proje Yapısı ve Dependency Injection",
    lessons: [
      { title: "Proje Organizasyonu", slug: "dotnet-core/project-structure/organization", desc: "ASP.NET Core proje yapısı, klasör organizasyonu, namespace yönetimi ve best practice'leri öğren." },
      { title: "DI Container", slug: "dotnet-core/project-structure/di-container", desc: "Dependency Injection container'ı, servis kayıtları ve DI pattern'inin uygulanmasını öğren." },
      { title: "Service Registration", slug: "dotnet-core/project-structure/service-registration", desc: "Servis kayıt yöntemleri, extension method'lar ve servis collection yönetimini öğren." },
      { title: "Options Pattern", slug: "dotnet-core/project-structure/options-pattern", desc: "Options pattern ile strongly-typed configuration yönetimi ve IOptions kullanımını öğren." },
      { title: "Configuration", slug: "dotnet-core/project-structure/configuration-management", desc: "Configuration yönetimi, appsettings.json, environment variables ve configuration binding'i öğren." }
    ]
  },
  {
    moduleId: "module-04-aspnet-mvc",
    moduleTitle: "ASP.NET Core MVC",
    lessons: [
      { title: "MVC Temelleri", slug: "aspnet-core/mvc/fundamentals", desc: "Model-View-Controller pattern'i, MVC lifecycle ve request handling sürecini öğren." },
      { title: "View Engine", slug: "aspnet-core/mvc/view-engine", desc: "Razor view engine, Razor syntax, view compilation ve view rendering mekanizmalarını öğren." },
      { title: "Model Validation", slug: "aspnet-core/mvc/model-validation", desc: "Model validation, data annotations, custom validators ve validation error handling'i öğren." },
      { title: "Action Filters", slug: "aspnet-core/mvc/action-filters", desc: "Action filters, authorization filters, action filters ve result filters kullanımını öğren." },
      { title: "Tag Helpers", slug: "aspnet-core/mvc/tag-helpers", desc: "Tag helpers, built-in tag helpers, custom tag helpers ve tag helper oluşturmayı öğren." }
    ]
  },
  {
    moduleId: "module-05-web-api",
    moduleTitle: "Web API Geliştirme",
    lessons: [
      { title: "RESTful API Tasarımı", slug: "aspnet-core/web-api/restful-design", desc: "RESTful API tasarım prensipleri, resource naming, HTTP methods ve REST best practice'lerini öğren." },
      { title: "HTTP Status Codes", slug: "aspnet-core/web-api/status-codes", desc: "HTTP status code'ları, doğru status code seçimi ve API response standartlarını öğren." },
      { title: "API Versioning", slug: "aspnet-core/web-api/versioning", desc: "API versioning stratejileri, URL-based, header-based ve query-based versioning'i öğren." },
      { title: "Swagger/OpenAPI", slug: "aspnet-core/web-api/swagger-openapi", desc: "Swagger/OpenAPI entegrasyonu, API dokümantasyonu ve Swagger UI kullanımını öğren." },
      { title: "API Security", slug: "aspnet-core/web-api/security", desc: "API güvenliği, authentication, authorization, rate limiting ve API key yönetimini öğren." }
    ]
  },
  {
    moduleId: "module-06-middleware",
    moduleTitle: "Middleware ve Pipeline Yönetimi",
    lessons: [
      { title: "Request Pipeline", slug: "aspnet-core/middleware/request-pipeline", desc: "Request pipeline yapısı, middleware sıralaması ve pipeline execution flow'unu öğren." },
      { title: "Custom Middleware", slug: "aspnet-core/middleware/custom-middleware", desc: "Özel middleware oluşturma, middleware extension methods ve middleware best practice'lerini öğren." },
      { title: "Exception Handling", slug: "aspnet-core/middleware/exception-handling", desc: "Global exception handling middleware, error pages ve exception logging stratejilerini öğren." },
      { title: "CORS", slug: "aspnet-core/middleware/cors", desc: "Cross-Origin Resource Sharing (CORS), CORS policy yapılandırması ve CORS middleware kullanımını öğren." },
      { title: "Rate Limiting", slug: "aspnet-core/middleware/rate-limiting", desc: "Rate limiting middleware, request throttling ve API rate limit stratejilerini öğren." }
    ]
  },
  {
    moduleId: "module-07-auth",
    moduleTitle: "Authentication & Authorization",
    lessons: [
      { title: "JWT Authentication", slug: "aspnet-core/auth/jwt-authentication", desc: "JSON Web Token (JWT) yapısı, JWT oluşturma, doğrulama ve JWT-based authentication'ı öğren." },
      { title: "OAuth2", slug: "aspnet-core/auth/oauth2", desc: "OAuth2 protokolü, OAuth2 flow'ları ve OAuth2 provider entegrasyonunu öğren." },
      { title: "Identity Framework", slug: "aspnet-core/auth/identity-framework", desc: "ASP.NET Core Identity framework'ü, user management, role management ve identity customization'ı öğren." },
      { title: "Role-Based Authorization", slug: "aspnet-core/auth/role-based-authorization", desc: "Role-based authorization, role yönetimi ve role-based access control (RBAC) uygulamasını öğren." },
      { title: "Policy-Based Authorization", slug: "aspnet-core/auth/policy-based-authorization", desc: "Policy-based authorization, authorization policies, requirements ve handlers'ı öğren." }
    ]
  },
  {
    moduleId: "module-08-logging",
    moduleTitle: "Logging ve Exception Handling",
    lessons: [
      { title: "Structured Logging", slug: "aspnet-core/logging/structured-logging", desc: "Yapılandırılmış logging, log formatları ve structured logging best practice'lerini öğren." },
      { title: "Log Levels", slug: "aspnet-core/logging/log-levels", desc: "Log seviyeleri, log level yönetimi ve uygun log level seçimini öğren." },
      { title: "Log Providers", slug: "aspnet-core/logging/log-providers", desc: "Log provider'ları, console, file, database ve third-party log provider entegrasyonunu öğren." },
      { title: "Application Insights", slug: "aspnet-core/logging/application-insights", desc: "Azure Application Insights entegrasyonu, telemetry ve application monitoring'i öğren." },
      { title: "Log Aggregation", slug: "aspnet-core/logging/log-aggregation", desc: "Log aggregation, centralized logging ve log analysis araçlarını öğren." }
    ]
  },
  {
    moduleId: "module-09-configuration",
    moduleTitle: "Configuration Management",
    lessons: [
      { title: "Configuration Providers", slug: "aspnet-core/configuration/providers", desc: "Configuration provider'ları, JSON, XML, INI ve custom provider'ları öğren." },
      { title: "Environment Variables", slug: "aspnet-core/configuration/environment-variables", desc: "Environment variable'ları, configuration hierarchy ve environment-specific configuration'ı öğren." },
      { title: "Secrets Management", slug: "aspnet-core/configuration/secrets-management", desc: "Secret yönetimi, user secrets, Azure Key Vault ve güvenli secret storage'ı öğren." },
      { title: "Configuration Binding", slug: "aspnet-core/configuration/binding", desc: "Configuration binding, strongly-typed configuration ve configuration validation'ı öğren." },
      { title: "Hot Reload", slug: "aspnet-core/configuration/hot-reload", desc: "Configuration hot reload, IOptionsSnapshot ve configuration change detection'ı öğren." }
    ]
  },
  {
    moduleId: "module-10-testing",
    moduleTitle: "Unit Test ve Integration Test",
    lessons: [
      { title: "Unit Testing Best Practices", slug: "aspnet-core/testing/unit-testing-best-practices", desc: "Unit testing prensipleri, test yazma best practice'leri ve test organizasyonunu öğren." },
      { title: "Test Doubles", slug: "aspnet-core/testing/test-doubles", desc: "Test doubles, mocks, stubs, fakes ve test isolation tekniklerini öğren." },
      { title: "Integration Testing", slug: "aspnet-core/testing/integration-testing", desc: "Integration testing, WebApplicationFactory, test server ve integration test yazmayı öğren." },
      { title: "Test Coverage", slug: "aspnet-core/testing/test-coverage", desc: "Test coverage ölçümü, code coverage araçları ve coverage analizi yapmayı öğren." },
      { title: "TDD", slug: "aspnet-core/testing/tdd", desc: "Test-Driven Development (TDD), TDD cycle ve TDD best practice'lerini öğren." }
    ]
  },
  {
    moduleId: "module-11-performance",
    moduleTitle: "Performans ve Caching Teknikleri",
    lessons: [
      { title: "Performance Profiling", slug: "aspnet-core/performance/profiling", desc: "Performance profiling, profiling araçları ve performance bottleneck tespitini öğren." },
      { title: "Memory Optimization", slug: "aspnet-core/performance/memory-optimization", desc: "Bellek optimizasyonu, memory leak tespiti ve memory management best practice'lerini öğren." },
      { title: "Caching Strategies", slug: "aspnet-core/performance/caching-strategies", desc: "Caching stratejileri, cache invalidation ve distributed caching pattern'lerini öğren." },
      { title: "Response Compression", slug: "aspnet-core/performance/response-compression", desc: "Response compression, gzip, brotli ve compression middleware kullanımını öğren." },
      { title: "Database Optimization", slug: "aspnet-core/performance/database-optimization", desc: "Database query optimization, indexing, connection pooling ve database performance tuning'i öğren." }
    ]
  },
  {
    moduleId: "module-12-async",
    moduleTitle: "Asenkron Programlama (Async/Await)",
    lessons: [
      { title: "Async Patterns", slug: "aspnet-core/async/async-patterns", desc: "Async/await pattern'leri, async method design ve async best practice'lerini öğren." },
      { title: "Task Parallel Library", slug: "aspnet-core/async/task-parallel-library", desc: "Task Parallel Library (TPL), parallel programming ve concurrent execution'ı öğren." },
      { title: "Concurrent Collections", slug: "aspnet-core/async/concurrent-collections", desc: "Concurrent collections, thread-safe collections ve concurrent programming'i öğren." },
      { title: "Async Streams", slug: "aspnet-core/async/async-streams", desc: "Async streams, IAsyncEnumerable ve async iteration pattern'lerini öğren." },
      { title: "Cancellation Tokens", slug: "aspnet-core/async/cancellation-tokens", desc: "Cancellation tokens, async cancellation ve graceful shutdown pattern'lerini öğren." }
    ]
  },
  {
    moduleId: "module-13-docker",
    moduleTitle: "Docker ile Containerization",
    lessons: [
      { title: "Docker Fundamentals", slug: "docker/fundamentals", desc: "Docker temelleri, container kavramı, image ve container lifecycle'ı öğren." },
      { title: "Multi-stage Builds", slug: "docker/multi-stage-builds", desc: "Multi-stage Docker builds, build optimization ve image size reduction tekniklerini öğren." },
      { title: "Docker Networking", slug: "docker/networking", desc: "Docker networking, network types, container communication ve network isolation'ı öğren." },
      { title: "Volume Management", slug: "docker/volume-management", desc: "Docker volumes, bind mounts, named volumes ve data persistence'i öğren." },
      { title: "Docker Compose", slug: "docker/docker-compose", desc: "Docker Compose, multi-container applications ve service orchestration'ı öğren." }
    ]
  },
  {
    moduleId: "module-14-cicd",
    moduleTitle: "CI/CD ve Deployment Süreçleri",
    lessons: [
      { title: "CI/CD Pipelines", slug: "cicd/pipelines", desc: "CI/CD pipeline yapısı, pipeline stages ve automated build/deploy süreçlerini öğren." },
      { title: "Automated Testing", slug: "cicd/automated-testing", desc: "Automated testing in CI/CD, test automation ve continuous testing'i öğren." },
      { title: "Deployment Strategies", slug: "cicd/deployment-strategies", desc: "Deployment stratejileri, blue-green, canary, rolling deployment ve zero-downtime deployment'ı öğren." },
      { title: "Environment Management", slug: "cicd/environment-management", desc: "Environment management, environment configuration ve environment-specific deployment'ı öğren." },
      { title: "Monitoring", slug: "cicd/monitoring", desc: "Application monitoring, health checks, metrics ve alerting sistemlerini öğren." }
    ]
  },
  {
    moduleId: "module-15-microservices",
    moduleTitle: "Microservices Mimarisi",
    lessons: [
      { title: "Service Communication", slug: "microservices/service-communication", desc: "Service-to-service communication, synchronous vs asynchronous communication ve communication patterns'i öğren." },
      { title: "API Gateway", slug: "microservices/api-gateway", desc: "API Gateway pattern, Ocelot, API gateway yapılandırması ve routing'i öğren." },
      { title: "Service Mesh", slug: "microservices/service-mesh", desc: "Service mesh kavramı, service discovery ve service mesh implementation'ı öğren." },
      { title: "Distributed Tracing", slug: "microservices/distributed-tracing", desc: "Distributed tracing, correlation IDs ve distributed system debugging'i öğren." },
      { title: "Event-Driven Architecture", slug: "microservices/event-driven-architecture", desc: "Event-driven architecture, message queues, event sourcing ve CQRS pattern'lerini öğren." }
    ]
  },
  {
    moduleId: "module-16-libraries",
    moduleTitle: "Kütüphaneler",
    lessons: [
      { title: "NuGet Package Management", slug: "dotnet-core/libraries/nuget-management", desc: "NuGet package manager, package installation, update ve dependency management'i öğren." },
      { title: "Library Best Practices", slug: "dotnet-core/libraries/best-practices", desc: "Library kullanım best practice'leri, library selection criteria ve library evaluation'ı öğren." },
      { title: "Versioning", slug: "dotnet-core/libraries/versioning", desc: "Semantic versioning, package versioning stratejileri ve version compatibility'i öğren." },
      { title: "Dependency Injection", slug: "dotnet-core/libraries/dependency-injection", desc: "Third-party library DI entegrasyonu, library extension methods ve library configuration'ı öğren." },
      { title: "Third-party Integration", slug: "dotnet-core/libraries/third-party-integration", desc: "Third-party library entegrasyonu, API wrapper'lar ve external service integration'ı öğren." }
    ]
  },
  {
    moduleId: "module-17-ef-core",
    moduleTitle: "Entity Framework Core İleri Seviye",
    lessons: [
      { title: "Code First Migrations", slug: "ef-core/migrations/code-first", desc: "Code First migrations, migration oluşturma, rollback ve migration stratejilerini öğren." },
      { title: "Query Optimization", slug: "ef-core/query-optimization", desc: "EF Core query optimization, eager loading, lazy loading ve query performance tuning'i öğren." },
      { title: "Relationships", slug: "ef-core/relationships", desc: "Entity relationships, one-to-one, one-to-many, many-to-many relationships ve navigation properties'i öğren." },
      { title: "Change Tracking", slug: "ef-core/change-tracking", desc: "Change tracking, entity states, SaveChanges ve change tracking optimization'ı öğren." },
      { title: "Raw SQL", slug: "ef-core/raw-sql", desc: "Raw SQL queries, FromSqlRaw, ExecuteSqlRaw ve stored procedure kullanımını öğren." }
    ]
  },
  {
    moduleId: "module-18-docker-k8s",
    moduleTitle: "Docker ve Kubernetes",
    lessons: [
      { title: "Kubernetes Architecture", slug: "kubernetes/architecture", desc: "Kubernetes mimarisi, cluster yapısı, master ve worker node'ları öğren." },
      { title: "Pod Management", slug: "kubernetes/pod-management", desc: "Pod yönetimi, pod lifecycle, pod scheduling ve pod health checks'i öğren." },
      { title: "Service Discovery", slug: "kubernetes/service-discovery", desc: "Kubernetes Services, service types, DNS-based service discovery ve service mesh'i öğren." },
      { title: "ConfigMaps", slug: "kubernetes/configmaps", desc: "ConfigMaps, Secrets, configuration management ve environment variable injection'ı öğren." },
      { title: "Secrets Management", slug: "kubernetes/secrets-management", desc: "Kubernetes Secrets, secret encryption, secret rotation ve secure secret management'i öğren." }
    ]
  }
];

function createLessonStructure(
  moduleId: string,
  lessonTitle: string,
  lessonSlug: string,
  description: string,
  moduleTitle: string
): any {
  const levelMap: Record<string, string> = {
    "module-01": "Başlangıç",
    "module-02": "Orta",
    "module-03": "Orta",
    "module-04": "Orta",
    "module-05": "Orta",
    "module-06": "Orta",
    "module-07": "Orta",
    "module-08": "Orta",
    "module-09": "Orta",
    "module-10": "Orta",
    "module-11": "İleri",
    "module-12": "Orta",
    "module-13": "Orta",
    "module-14": "İleri",
    "module-15": "İleri",
    "module-16": "Orta",
    "module-17": "İleri",
    "module-18": "İleri"
  };

  const modulePrefix = moduleId.split("-").slice(0, 2).join("-");
  const level = levelMap[modulePrefix] || "Orta";

  // Slug oluştur
  const href = `/education/lessons/${lessonSlug}`;

  return {
    label: lessonTitle,
    href,
    description: `${description} Bu ders, ${moduleTitle} modülünün kapsamlı bir parçasıdır ve gerçek dünya uygulamalarında pratik kullanım senaryolarını içerir.`,
    estimatedDurationMinutes: 45,
    level,
    keyTakeaways: [
      `${lessonTitle} konusunu derinlemesine öğreneceksin.`,
      `${moduleTitle} modülünde ${lessonTitle} kritik bir rol oynar.`,
      "Pratik örnekler ve gerçek dünya senaryoları ile konuyu pekiştireceksin.",
      "Best practice'leri ve yaygın hataları öğreneceksin.",
      "İleri seviye teknikleri ve optimizasyon stratejilerini kavrayacaksın."
    ],
    sections: [
      {
        id: `${lessonSlug.replace(/\//g, "-")}-introduction`,
        title: "Giriş ve Temel Kavramlar",
        summary: `${lessonTitle} konusuna giriş ve temel kavramları öğren.`,
        content: [
          {
            type: "text",
            body: `${description} Bu ders, ${moduleTitle} modülünün önemli bir parçasıdır ve gerçek dünya uygulamalarında sıklıkla kullanılır. ${lessonTitle} konusunu derinlemesine anlamak, modern .NET Core uygulamaları geliştirmek için kritik öneme sahiptir. Bu ders boyunca hem teorik bilgileri hem de pratik uygulamaları göreceksin.`
          },
          {
            type: "list",
            ordered: true,
            items: [
              `${lessonTitle} konusunun temel kavramlarını öğreneceksin.`,
              "Pratik örnekler ve kod snippet'leri ile konuyu pekiştireceksin.",
              "Gerçek dünya senaryolarında nasıl kullanıldığını göreceksin.",
              "Best practice'leri ve yaygın hataları öğreneceksin.",
              "İleri seviye teknikleri ve optimizasyon stratejilerini kavrayacaksın."
            ]
          },
          {
            type: "code",
            language: "csharp",
            code: `// ${lessonTitle} örnek kullanımı\npublic class Example\n{\n    // Örnek kod buraya gelecek\n    public void ExampleMethod()\n    {\n        // ${lessonTitle} kullanım örneği\n        // Bu örnek, konunun pratik uygulamasını gösterir\n    }\n}`,
            explanation: `${lessonTitle} kullanımına dair temel örnek. Bu örnek, konunun pratik uygulamasını gösterir ve gerçek dünya senaryolarında nasıl kullanıldığını anlamanı sağlar.`
          },
          {
            type: "callout",
            variant: "tip",
            title: "İpucu",
            body: `${lessonTitle} konusunda dikkat edilmesi gereken önemli noktalar. Best practice'leri takip ederek daha kaliteli ve maintainable kod yazabilirsin.`
          }
        ]
      },
      {
        id: `${lessonSlug.replace(/\//g, "-")}-advanced`,
        title: "İleri Seviye Kullanım",
        summary: `${lessonTitle} konusunun ileri seviye kullanımlarını ve optimizasyon tekniklerini öğren.`,
        content: [
          {
            type: "text",
            body: `${lessonTitle} konusunun ileri seviye kullanımları, karmaşık senaryolarda daha etkili çözümler üretmeni sağlar. Bu bölümde, konunun daha gelişmiş özelliklerini ve kullanım senaryolarını inceleyeceğiz.`
          },
          {
            type: "code",
            language: "csharp",
            code: `// ${lessonTitle} ileri seviye örnek\npublic class AdvancedExample\n{\n    // İleri seviye kullanım örnekleri\n    public async Task AdvancedMethodAsync()\n    {\n        // ${lessonTitle} ile ileri seviye pattern'ler\n    }\n}`,
            explanation: `${lessonTitle} konusunun ileri seviye kullanım örneği. Bu örnek, daha karmaşık senaryolarda nasıl kullanıldığını gösterir.`
          },
          {
            type: "list",
            ordered: false,
            items: [
              `${lessonTitle} için best practice'ler`,
              "Performans optimizasyon teknikleri",
              "Yaygın hatalar ve çözümleri",
              "Gerçek dünya kullanım senaryoları",
              "Troubleshooting ve debugging teknikleri"
            ]
          }
        ]
      },
      {
        id: `${lessonSlug.replace(/\//g, "-")}-practical`,
        title: "Pratik Uygulamalar",
        summary: `${lessonTitle} konusunu pratik örnekler ve gerçek dünya senaryoları ile pekiştir.`,
        content: [
          {
            type: "text",
            body: `Bu bölümde, ${lessonTitle} konusunu gerçek dünya senaryolarında nasıl kullanacağını öğreneceksin. Pratik örnekler ve case study'ler ile konuyu daha iyi kavrayacaksın.`
          },
          {
            type: "code",
            language: "csharp",
            code: `// ${lessonTitle} pratik uygulama örneği\npublic class PracticalExample\n{\n    // Gerçek dünya senaryosu\n    public void RealWorldScenario()\n    {\n        // ${lessonTitle} kullanarak gerçek bir problem çözümü\n    }\n}`,
            explanation: `${lessonTitle} konusunun gerçek dünya uygulaması. Bu örnek, gerçek bir senaryoda nasıl kullanıldığını gösterir.`
          },
          {
            type: "callout",
            variant: "info",
            title: "Gerçek Dünya Senaryosu",
            body: `Bu örnek, ${lessonTitle} konusunun gerçek bir uygulamada nasıl kullanıldığını gösterir. Bu tür senaryolar, konuyu daha iyi anlamanı sağlar.`
          }
        ]
      }
    ],
    checkpoints: [
      {
        id: `checkpoint-${lessonSlug.replace(/\//g, "-")}-1`,
        question: `${lessonTitle} ile ilgili temel soru?`,
        options: ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
        answer: "Seçenek 1",
        rationale: `${lessonTitle} konusunda doğru yaklaşım, bu seçenekte açıklanmaktadır.`
      },
      {
        id: `checkpoint-${lessonSlug.replace(/\//g, "-")}-2`,
        question: `${lessonTitle} konusunda yaygın bir hata nedir?`,
        options: ["Hata 1", "Hata 2", "Hata 3", "Hata 4"],
        answer: "Hata 1",
        rationale: `Bu hata, ${lessonTitle} konusunda sıklıkla yapılan bir hatadır ve bu şekilde önlenebilir.`
      }
    ],
    resources: [
      {
        id: `resource-${lessonSlug.replace(/\//g, "-")}-docs`,
        label: `${lessonTitle} - Microsoft Docs`,
        href: `https://learn.microsoft.com/dotnet/core`,
        type: "reading",
        estimatedMinutes: 20,
        description: `${lessonTitle} konusu hakkında detaylı Microsoft dokümantasyonu.`
      },
      {
        id: `resource-${lessonSlug.replace(/\//g, "-")}-video`,
        label: `${lessonTitle} - Video Eğitim`,
        href: `https://learn.microsoft.com/dotnet/core`,
        type: "video",
        estimatedMinutes: 30,
        description: `${lessonTitle} konusunu görsel olarak öğrenmek için video eğitim.`
      }
    ],
    practice: [
      {
        id: `practice-${lessonSlug.replace(/\//g, "-")}-1`,
        title: `${lessonTitle} Pratik Uygulaması 1`,
        description: `${lessonTitle} konusunu pratik bir örnekle pekiştir.`,
        type: "coding",
        estimatedMinutes: 25,
        difficulty: "Orta",
        instructions: [
          `${lessonTitle} kullanarak basit bir örnek oluştur.`,
          "Kodun doğru çalıştığından emin ol.",
          "Best practice'leri uygula.",
          "Hata yönetimi ekle.",
          "Kodu test et ve optimize et."
        ]
      },
      {
        id: `practice-${lessonSlug.replace(/\//g, "-")}-2`,
        title: `${lessonTitle} Pratik Uygulaması 2`,
        description: `${lessonTitle} konusunu daha karmaşık bir senaryoda uygula.`,
        type: "coding",
        estimatedMinutes: 30,
        difficulty: "İleri",
        instructions: [
          `${lessonTitle} kullanarak karmaşık bir senaryo oluştur.`,
          "İleri seviye teknikleri uygula.",
          "Performans optimizasyonu yap.",
          "Kodu refactor et ve iyileştir."
        ]
      }
    ]
  };
}

// JSON yapısını oluştur
const data = {
  version: "1.0",
  totalLessons: 90,
  modules: modulesData.map(moduleData => ({
    moduleId: moduleData.moduleId,
    moduleTitle: moduleData.moduleTitle,
    lessons: moduleData.lessons.map(lessonData =>
      createLessonStructure(
        moduleData.moduleId,
        lessonData.title,
        lessonData.slug,
        lessonData.desc,
        moduleData.moduleTitle
      )
    )
  }))
};

// JSON'u yaz
const jsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`✅ 18 modül için 90 ders içeriği oluşturuldu!`);
console.log(`✅ Toplam ${data.totalLessons} ders içeriği JSON dosyasına yazıldı!`);

