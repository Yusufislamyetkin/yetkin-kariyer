import * as fs from 'fs';
import * as path from 'path';

interface TopicData {
  title: string;
  slug: string;
  desc: string;
}

interface ModuleData {
  moduleId: string;
  moduleTitle: string;
  topics: TopicData[];
}

const modulesData: ModuleData[] = [
  {
    moduleId: "module-03-project-structure",
    moduleTitle: "Proje Yapısı ve Dependency Injection",
    topics: [
      { title: "Proje Yapısı", slug: "project-structure", desc: "ASP.NET Core proje yapısını ve dosya organizasyonunu öğren." },
      { title: "Dependency Injection", slug: "dependency-injection", desc: "DI container'ı ve servis kayıtlarını derinlemesine öğren." },
      { title: "Service Lifetime", slug: "service-lifetime", desc: "Singleton, Scoped, Transient lifetime'larını kavra." },
      { title: "Configuration", slug: "configuration", desc: "appsettings.json ve configuration pattern'lerini öğren." },
      { title: "Startup", slug: "startup", desc: "Startup.cs ve Program.cs yapılandırmasını öğren." }
    ]
  },
  {
    moduleId: "module-04-aspnet-mvc",
    moduleTitle: "ASP.NET Core MVC",
    topics: [
      { title: "MVC Pattern", slug: "mvc-pattern", desc: "Model-View-Controller pattern'ini ve ASP.NET Core'da kullanımını öğren." },
      { title: "Controller", slug: "controller", desc: "Controller yapısı, action method'ları ve routing'i öğren." },
      { title: "View", slug: "view", desc: "Razor view engine, layout, partial view ve view component'leri öğren." },
      { title: "Model Binding", slug: "model-binding", desc: "Model binding mekanizması ve validation'ı öğren." },
      { title: "Routing", slug: "routing", desc: "Convention-based ve attribute routing'i öğren." }
    ]
  },
  {
    moduleId: "module-05-web-api",
    moduleTitle: "Web API Geliştirme",
    topics: [
      { title: "REST API", slug: "rest-api", desc: "RESTful API tasarım prensiplerini ve best practice'leri öğren." },
      { title: "HTTP Methods", slug: "http-methods", desc: "GET, POST, PUT, DELETE, PATCH metodlarını ve kullanım senaryolarını öğren." },
      { title: "API Controller", slug: "api-controller", desc: "API Controller yapısı ve action method'larını öğren." },
      { title: "Response Types", slug: "response-types", desc: "JSON, XML ve custom response formatlarını öğren." },
      { title: "Status Codes", slug: "status-codes", desc: "HTTP status code'ları ve doğru kullanımını öğren." }
    ]
  },
  {
    moduleId: "module-06-middleware",
    moduleTitle: "Middleware ve Pipeline Yönetimi",
    topics: [
      { title: "Middleware Pipeline", slug: "middleware-pipeline", desc: "Request pipeline yapısı ve middleware sıralamasını öğren." },
      { title: "Custom Middleware", slug: "custom-middleware", desc: "Özel middleware oluşturma ve kullanımını öğren." },
      { title: "Request/Response", slug: "request-response", desc: "Request ve Response nesnelerini manipüle etmeyi öğren." },
      { title: "Exception Middleware", slug: "exception-middleware", desc: "Global exception handling middleware'i oluşturmayı öğren." },
      { title: "Ordering", slug: "middleware-ordering", desc: "Middleware sıralaması ve best practice'leri öğren." }
    ]
  },
  {
    moduleId: "module-07-auth",
    moduleTitle: "Authentication & Authorization",
    topics: [
      { title: "Authentication vs Authorization", slug: "auth-vs-authorization", desc: "Kimlik doğrulama ve yetkilendirme farklarını öğren." },
      { title: "JWT", slug: "jwt", desc: "JSON Web Token yapısı, oluşturma ve doğrulama işlemlerini öğren." },
      { title: "Identity", slug: "identity", desc: "ASP.NET Core Identity framework'ünü öğren." },
      { title: "Claims", slug: "claims", desc: "Claims-based authentication ve authorization'ı öğren." },
      { title: "Policies", slug: "policies", desc: "Authorization policy'leri ve requirement'ları öğren." }
    ]
  },
  {
    moduleId: "module-08-logging",
    moduleTitle: "Logging ve Exception Handling",
    topics: [
      { title: "ILogger Interface", slug: "ilogger-interface", desc: "ILogger interface'i ve logging abstraction'ını öğren." },
      { title: "Log Levels", slug: "log-levels", desc: "Trace, Debug, Information, Warning, Error, Critical seviyelerini öğren." },
      { title: "Structured Logging", slug: "structured-logging", desc: "Yapılandırılmış logging ve best practice'leri öğren." },
      { title: "Serilog", slug: "serilog", desc: "Serilog kütüphanesi ve sink yapılandırmasını öğren." },
      { title: "Exception Logging", slug: "exception-logging", desc: "Exception logging stratejileri ve error handling'i öğren." }
    ]
  },
  {
    moduleId: "module-09-configuration",
    moduleTitle: "Configuration Management",
    topics: [
      { title: "Configuration Sources", slug: "configuration-sources", desc: "appsettings.json, environment variables, command line gibi kaynakları öğren." },
      { title: "appsettings.json", slug: "appsettings-json", desc: "appsettings.json yapısı ve environment-specific configuration'ı öğren." },
      { title: "Environment Variables", slug: "environment-variables", desc: "Environment variable'ları ve kullanımını öğren." },
      { title: "Options Pattern", slug: "options-pattern", desc: "Options pattern ve strongly-typed configuration'ı öğren." },
      { title: "IConfiguration", slug: "iconfiguration", desc: "IConfiguration interface'i ve configuration okuma işlemlerini öğren." }
    ]
  },
  {
    moduleId: "module-10-testing",
    moduleTitle: "Unit Test ve Integration Test",
    topics: [
      { title: "Unit Testing", slug: "unit-testing", desc: "Unit test yazma prensipleri ve best practice'leri öğren." },
      { title: "xUnit", slug: "xunit", desc: "xUnit test framework'ünü ve test yazma tekniklerini öğren." },
      { title: "Moq", slug: "moq", desc: "Moq mocking framework'ünü ve dependency mocking'i öğren." },
      { title: "Integration Testing", slug: "integration-testing", desc: "Integration test yazma ve WebApplicationFactory kullanımını öğren." },
      { title: "Test Coverage", slug: "test-coverage", desc: "Test coverage ölçümü ve analiz araçlarını öğren." }
    ]
  },
  {
    moduleId: "module-11-performance",
    moduleTitle: "Performans ve Caching Teknikleri",
    topics: [
      { title: "Caching", slug: "caching", desc: "Caching stratejileri ve kullanım senaryolarını öğren." },
      { title: "Memory Cache", slug: "memory-cache", desc: "IMemoryCache ve in-memory caching'i öğren." },
      { title: "Distributed Cache", slug: "distributed-cache", desc: "IDistributedCache ve Redis kullanımını öğren." },
      { title: "Response Caching", slug: "response-caching", desc: "Response caching middleware'i ve cache headers'ı öğren." },
      { title: "Performance Monitoring", slug: "performance-monitoring", desc: "Performance monitoring araçları ve profiling tekniklerini öğren." }
    ]
  },
  {
    moduleId: "module-12-async",
    moduleTitle: "Asenkron Programlama (Async/Await)",
    topics: [
      { title: "Async/Await", slug: "async-await", desc: "async/await pattern'i ve asenkron programlama temellerini öğren." },
      { title: "Task", slug: "task", desc: "Task sınıfı ve task-based asenkron programlamayı öğren." },
      { title: "Task<T>", slug: "task-generic", desc: "Task<T> ve değer döndüren asenkron metotları öğren." },
      { title: "ConfigureAwait", slug: "configureawait", desc: "ConfigureAwait ve synchronization context'i öğren." },
      { title: "Deadlock Prevention", slug: "deadlock-prevention", desc: "Deadlock'ları önleme teknikleri ve best practice'leri öğren." }
    ]
  },
  {
    moduleId: "module-13-docker",
    moduleTitle: "Docker ile Containerization",
    topics: [
      { title: "Docker Basics", slug: "docker-basics", desc: "Docker temelleri, container ve image kavramlarını öğren." },
      { title: "Dockerfile", slug: "dockerfile", desc: "Dockerfile yazma ve .NET Core uygulamalarını containerize etmeyi öğren." },
      { title: "Docker Compose", slug: "docker-compose", desc: "Docker Compose ile multi-container uygulamaları yönetmeyi öğren." },
      { title: "Containerization", slug: "containerization", desc: "Containerization stratejileri ve best practice'leri öğren." },
      { title: "Image Management", slug: "image-management", desc: "Docker image oluşturma, tag'leme ve registry yönetimini öğren." }
    ]
  },
  {
    moduleId: "module-14-cicd",
    moduleTitle: "CI/CD ve Deployment Süreçleri",
    topics: [
      { title: "CI/CD Concepts", slug: "cicd-concepts", desc: "Continuous Integration ve Continuous Deployment kavramlarını öğren." },
      { title: "GitHub Actions", slug: "github-actions", desc: "GitHub Actions ile CI/CD pipeline'ı oluşturmayı öğren." },
      { title: "Azure DevOps", slug: "azure-devops", desc: "Azure DevOps Pipelines ile deployment süreçlerini öğren." },
      { title: "Deployment Strategies", slug: "deployment-strategies", desc: "Blue-green, canary, rolling deployment stratejilerini öğren." },
      { title: "Pipeline", slug: "pipeline", desc: "CI/CD pipeline yapısı ve best practice'leri öğren." }
    ]
  },
  {
    moduleId: "module-15-microservices",
    moduleTitle: "Microservices Mimarisi",
    topics: [
      { title: "Microservices Architecture", slug: "microservices-architecture", desc: "Microservices mimarisi ve monolith'ten farklarını öğren." },
      { title: "Service Communication", slug: "service-communication", desc: "Service-to-service communication pattern'lerini öğren." },
      { title: "API Gateway", slug: "api-gateway", desc: "API Gateway pattern'i ve Ocelot kullanımını öğren." },
      { title: "Service Discovery", slug: "service-discovery", desc: "Service discovery mekanizmaları ve Consul kullanımını öğren." },
      { title: "Distributed Systems", slug: "distributed-systems", desc: "Distributed systems zorlukları ve çözümlerini öğren." }
    ]
  },
  {
    moduleId: "module-16-libraries",
    moduleTitle: "Kütüphaneler",
    topics: [
      { title: "NuGet Packages", slug: "nuget-packages", desc: "NuGet package manager ve package kullanımını öğren." },
      { title: "Package Management", slug: "package-management", desc: "Package versioning, dependency management ve restore işlemlerini öğren." },
      { title: "Third-party Libraries", slug: "third-party-libraries", desc: "Popüler third-party kütüphaneleri ve kullanım senaryolarını öğren." },
      { title: "Library Selection", slug: "library-selection", desc: "Kütüphane seçim kriterleri ve best practice'leri öğren." },
      { title: "Versioning", slug: "versioning", desc: "Semantic versioning ve package version yönetimini öğren." }
    ]
  },
  {
    moduleId: "module-17-ef-core",
    moduleTitle: "Entity Framework Core İleri Seviye",
    topics: [
      { title: "Entity Framework Core", slug: "ef-core", desc: "EF Core temelleri ve ORM kavramlarını öğren." },
      { title: "DbContext", slug: "dbcontext", desc: "DbContext yapısı ve DbSet kullanımını öğren." },
      { title: "Migrations", slug: "migrations", desc: "Code First migrations ve database schema yönetimini öğren." },
      { title: "LINQ Queries", slug: "linq-queries", desc: "LINQ sorguları ve query optimization tekniklerini öğren." },
      { title: "Relationships", slug: "relationships", desc: "Entity relationships, navigation properties ve foreign keys'i öğren." }
    ]
  },
  {
    moduleId: "module-18-docker-k8s",
    moduleTitle: "Docker ve Kubernetes",
    topics: [
      { title: "Kubernetes Basics", slug: "kubernetes-basics", desc: "Kubernetes temelleri, cluster ve node kavramlarını öğren." },
      { title: "Pods", slug: "pods", desc: "Pod yapısı, container orchestration ve pod lifecycle'ı öğren." },
      { title: "Services", slug: "services", desc: "Kubernetes Services ve service discovery'yi öğren." },
      { title: "Deployments", slug: "deployments", desc: "Deployment yapısı, replica sets ve rolling updates'i öğren." },
      { title: "Helm Charts", slug: "helm-charts", desc: "Helm package manager ve chart yapısını öğren." }
    ]
  }
];

function createTopicStructure(
  moduleId: string,
  topicTitle: string,
  topicSlug: string,
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
  let href: string;
  if (topicSlug.includes("dotnet-core") || topicSlug.includes("architecture")) {
    href = `/education/lessons/${topicSlug}`;
  } else {
    const moduleSlug = moduleId.replace("module-", "").replace(/-/g, "/");
    href = `/education/lessons/${moduleSlug}/${topicSlug}`;
  }

  return {
    label: topicTitle.includes("Nedir") ? topicTitle : `${topicTitle} Nedir?`,
    href,
    description: `${description} Bu konu, ${moduleTitle} modülünün önemli bir parçasıdır ve gerçek dünya uygulamalarında sıklıkla kullanılır.`,
    estimatedDurationMinutes: 35,
    level,
    keyTakeaways: [
      `${topicTitle} kavramını ve temel kullanımını öğreneceksin.`,
      `${moduleTitle} modülünde ${topicTitle} önemli bir rol oynar.`,
      "Pratik örneklerle konuyu pekiştireceksin.",
      "Gerçek dünya senaryolarında nasıl kullanıldığını göreceksin."
    ],
    sections: [
      {
        id: `${topicSlug}-overview`,
        title: `${topicTitle} Temelleri`,
        summary: `${topicTitle} kavramını ve temel kullanımını öğren.`,
        content: [
          {
            type: "text",
            body: `${description} Bu konu, ${moduleTitle} modülünün önemli bir parçasıdır ve gerçek dünya uygulamalarında sıklıkla kullanılır. ${topicTitle} kavramını derinlemesine anlamak, modern .NET Core uygulamaları geliştirmek için kritik öneme sahiptir.`
          },
          {
            type: "code",
            language: "csharp",
            code: `// ${topicTitle} örnek kullanımı\npublic class Example\n{\n    // Örnek kod buraya gelecek\n    public void ExampleMethod()\n    {\n        // ${topicTitle} kullanım örneği\n    }\n}`,
            explanation: `${topicTitle} kullanımına dair temel örnek. Bu örnek, konunun pratik uygulamasını gösterir.`
          },
          {
            type: "callout",
            variant: "tip",
            title: "İpucu",
            body: `${topicTitle} konusunda dikkat edilmesi gereken önemli noktalar. Best practice'leri takip ederek daha kaliteli kod yazabilirsin.`
          },
          {
            type: "text",
            body: `${topicTitle} konusunu öğrendikten sonra, gerçek dünya senaryolarında nasıl kullanıldığını görmek önemlidir. Bu konu, ${moduleTitle} modülünde diğer konularla birlikte kullanılarak güçlü uygulamalar oluşturmanı sağlar.`
          }
        ]
      },
      {
        id: `${topicSlug}-advanced`,
        title: `${topicTitle} İleri Seviye`,
        summary: `${topicTitle} konusunun ileri seviye kullanımlarını öğren.`,
        content: [
          {
            type: "text",
            body: `${topicTitle} konusunun ileri seviye kullanımları, karmaşık senaryolarda daha etkili çözümler üretmeni sağlar. Bu bölümde, konunun daha gelişmiş özelliklerini ve kullanım senaryolarını inceleyeceğiz.`
          },
          {
            type: "list",
            ordered: true,
            items: [
              `${topicTitle} için best practice'ler`,
              "Performans optimizasyon teknikleri",
              "Yaygın hatalar ve çözümleri",
              "Gerçek dünya kullanım senaryoları"
            ]
          }
        ]
      }
    ],
    checkpoints: [
      {
        id: `checkpoint-${topicSlug}`,
        question: `${topicTitle} ile ilgili temel soru?`,
        options: ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
        answer: "Seçenek 1",
        rationale: `${topicTitle} konusunda doğru yaklaşım, bu seçenekte açıklanmaktadır.`
      }
    ],
    resources: [
      {
        id: `resource-${topicSlug}`,
        label: `${topicTitle} - Microsoft Docs`,
        href: `https://learn.microsoft.com/dotnet/core`,
        type: "reading",
        estimatedMinutes: 15,
        description: `${topicTitle} konusu hakkında detaylı Microsoft dokümantasyonu.`
      }
    ],
    practice: [
      {
        id: `practice-${topicSlug}`,
        title: `${topicTitle} Pratik Uygulaması`,
        description: `${topicTitle} konusunu pratik bir örnekle pekiştir.`,
        type: "coding",
        estimatedMinutes: 20,
        difficulty: "Orta",
        instructions: [
          `${topicTitle} kullanarak basit bir örnek oluştur.`,
          "Kodun doğru çalıştığından emin ol.",
          "Best practice'leri uygula."
        ]
      }
    ]
  };
}

// Mevcut JSON'u oku
const jsonPath = path.join(process.cwd(), 'data', 'topic-lessons', 'dotnet-core-topics.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Yeni modülleri ekle
for (const moduleData of modulesData) {
  const topics = moduleData.topics.map(topicData =>
    createTopicStructure(
      moduleData.moduleId,
      topicData.title,
      topicData.slug,
      topicData.desc,
      moduleData.moduleTitle
    )
  );

  const newModule = {
    moduleId: moduleData.moduleId,
    moduleTitle: moduleData.moduleTitle,
    topics
  };

  data.modules.push(newModule);
}

// Toplam konu sayısını güncelle
const totalTopics = data.modules.reduce((sum: number, m: any) => sum + m.topics.length, 0);
data.totalTopics = totalTopics;

// JSON'u yaz
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`✅ ${modulesData.length} modül eklendi!`);
console.log(`✅ Toplam ${totalTopics} konu oluşturuldu!`);

