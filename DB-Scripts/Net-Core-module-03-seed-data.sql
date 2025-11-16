-- Module 03: Architecture - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-03-project-structure",
          "title": "Proje Yapısı ve Dependency Injection",
          "summary": "Katmanlı klasörleme, SOLID prensipleri ve DI container yapılandırmalarıyla bakım kolaylığı sağla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında maintainable solution yapıları kurup dependency injection kayıtlarını temiz şekilde yönetebileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Clean%20Architecture",
            "description": "Katmanlı solution tasarımları ve DI desenlerini adım adım öğren."
          },
          "relatedTopics": [
            {
              "label": "Solution Katmanlarını Tasarlama",
              "href": "/education/lessons/architecture/clean-architecture/solution-structure",
              "description": "Domain, Application ve Infrastructure katmanlarını konumlandır."
            },
            {
              "label": "Servis Kayıtlarını Düzenleme",
              "href": "/education/lessons/architecture/clean-architecture/service-registration",
              "description": "Extension metotlarıyla modüler DI kayıtları oluştur."
            },
            {
              "label": "Sınır Bağımlılıklarını Yönetme",
              "href": "/education/lessons/architecture/clean-architecture/dependency-rules",
              "description": "Katmanlar arası bağımlılık kurallarını SOLID ile hizala."
            },
            {
              "label": "Interface Segregation Principle (ISP)",
              "href": "/education/lessons/architecture/solid/interface-segregation",
              "description": "ISP prensibini öğren ve gereksiz bağımlılıkları önle.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "ISP, client ların kullanmadığı interface metodlarına bağımlı olmamasını sağlar",
                "Büyük interface leri küçük, spesifik interface lere böl",
                "ISP test edilebilirliği ve bakım kolaylığını artırır",
                "YAGNI (You Aren t Gonna Need It) prensibini uygula"
              ],
              "sections": [
                {
                  "id": "isp-principle",
                  "title": "ISP Prensibi",
                  "summary": "Interface segregation nedir?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Interface Segregation Principle (ISP), client ların kullanmadığı interface metodlarına bağımlı olmamasını gerektirir. Büyük interface leri küçük, spesifik interface lere bölmek gerekir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Tüm metodları içeren büyük interface npublic interface IWorker n{ n    void Work(); n    void Eat(); n    void Sleep(); n} n n// İyi: Küçük, spesifik interface ler npublic interface IWorkable n{ n    void Work(); n} n npublic interface IEatable n{ n    void Eat(); n} n npublic interface ISleepable n{ n    void Sleep(); n}",
                      "explanation": "Büyük interface leri küçük, spesifik interface lere bölerek ISP yi uygula."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-isp",
                  "question": "ISP nin amacı nedir?",
                  "options": [
                    "Daha fazla interface oluşturmak",
                    "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
                    "Daha az kod yazmak",
                    "Hiçbir şey"
                  ],
                  "answer": "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
                  "rationale": "ISP, client ların sadece ihtiyaç duydukları metodlara bağımlı olmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-isp-docs",
                  "label": "SOLID Principles: ISP",
                  "href": "https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "ISP hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-isp",
                  "title": "ISP Uygulaması",
                  "description": "Büyük bir interface i küçük interface lere böl.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Büyük bir interface tanımla",
                    "Küçük, spesifik interface lere böl",
                    "Client ları güncelle"
                  ]
                }
              ]
            },
            {
              "label": "Dependency Inversion Principle (DIP)",
              "href": "/education/lessons/architecture/solid/dependency-inversion",
              "description": "DIP prensibini öğren ve yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağla.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "DIP, yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını gerektirir",
                "Her ikisi de abstraction lara (interface lere) bağımlı olmalıdır",
                "DIP test edilebilirliği ve esnekliği artırır",
                "Dependency Injection DIP yi uygulamanın bir yoludur"
              ],
              "sections": [
                {
                  "id": "dip-principle",
                  "title": "DIP Prensibi",
                  "summary": "Dependency inversion nedir?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Dependency Inversion Principle (DIP), yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını gerektirir. Her ikisi de abstraction lara (interface lere) bağımlı olmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Yüksek seviye modül düşük seviye modüle bağımlı npublic class OrderService n{ n    private SqlServerRepository _repository = new SqlServerRepository(); n    // OrderService, SqlServerRepository ye doğrudan bağımlı n} n n// İyi: Her ikisi de interface e bağımlı npublic interface IRepository n{ n    void Save(Order order); n} n npublic class OrderService n{ n    private readonly IRepository _repository; n    public OrderService(IRepository repository) n    { n        _repository = repository; n    } n}",
                      "explanation": "DIP yi uygulayarak yüksek seviye modüllerin düşük seviye modüllere bağımlı olmasını önle."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-dip",
                  "question": "DIP nin amacı nedir?",
                  "options": [
                    "Daha fazla interface oluşturmak",
                    "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
                    "Daha az kod yazmak",
                    "Hiçbir şey"
                  ],
                  "answer": "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
                  "rationale": "DIP, yüksek seviye modüllerin abstraction lara (interface lere) bağımlı olmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-dip-docs",
                  "label": "SOLID Principles: DIP",
                  "href": "https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "DIP hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-dip",
                  "title": "DIP Uygulaması",
                  "description": "DIP prensibini uygulayarak bağımlılıkları tersine çevir.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Yüksek seviye modül tanımla",
                    "Interface oluştur",
                    "Dependency injection kullan"
                  ]
                }
              ]
            },
            {
              "label": "Service Lifetime Yönetimi",
              "href": "/education/lessons/architecture/di/service-lifetime",
              "description": "Singleton, Scoped ve Transient lifetime larını öğren ve doğru kullan.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Singleton: Uygulama yaşam döngüsü boyunca tek bir instance",
                "Scoped: Her HTTP request için bir instance",
                "Transient: Her çağrıda yeni instance",
                "Lifetime seçimi performans ve thread-safety yi etkiler",
                "Yanlış lifetime seçimi memory leak lere neden olabilir"
              ],
              "sections": [
                {
                  "id": "lifetime-types",
                  "title": "Lifetime Türleri",
                  "summary": "Singleton, Scoped, Transient.",
                  "content": [
                    {
                      "type": "text",
                      "body": "ASP.NET Core da üç service lifetime türü vardır: Singleton (uygulama yaşam döngüsü boyunca tek instance), Scoped (her HTTP request için bir instance), Transient (her çağrıda yeni instance)."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Service kayıtları nservices.AddSingleton<ISingletonService, SingletonService>(); nservices.AddScoped<IScopedService, ScopedService>(); nservices.AddTransient<ITransientService, TransientService>(); n n// Singleton: Uygulama boyunca tek instance n// Scoped: Request başına bir instance n// Transient: Her çağrıda yeni instance",
                      "explanation": "Farklı lifetime türlerinin kullanımı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-lifetime",
                  "question": "Scoped lifetime ne zaman kullanılmalıdır?",
                  "options": [
                    "Her zaman",
                    "Her HTTP request için bir instance gerektiğinde",
                    "Sadece singleton alternatifi olarak",
                    "Hiçbir zaman"
                  ],
                  "answer": "Her HTTP request için bir instance gerektiğinde",
                  "rationale": "Scoped lifetime, her HTTP request için bir instance oluşturur, bu da Entity Framework DbContext gibi servisler için idealdir."
                }
              ],
              "resources": [
                {
                  "id": "resource-lifetime-docs",
                  "label": "Microsoft Docs: Dependency Injection",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/dependency-injection",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Service lifetime hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-lifetime",
                  "title": "Lifetime Yönetimi",
                  "description": "Farklı lifetime türlerini kullan ve davranışlarını gözlemle.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Farklı lifetime türleriyle servis kaydet",
                    "Instance ları gözlemle",
                    "Thread-safety yi test et"
                  ]
                }
              ]
            },
            {
              "label": "Factory Pattern ile DI",
              "href": "/education/lessons/architecture/di/factory-pattern",
              "description": "Factory pattern kullanarak dinamik servis oluşturma.",
              "estimatedDurationMinutes": 40,
              "level": "İleri",
              "keyTakeaways": [
                "Factory pattern, servis oluşturma mantığını merkezileştirir",
                "IFactory<T> interface i ile factory pattern uygulanabilir",
                "Factory pattern, runtime da servis seçimine izin verir",
                "Func<T> delegate i de factory olarak kullanılabilir"
              ],
              "sections": [
                {
                  "id": "factory-pattern",
                  "title": "Factory Pattern",
                  "summary": "Factory pattern ile servis oluşturma.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Factory pattern, servis oluşturma mantığını merkezileştirir. IFactory<T> interface i veya Func<T> delegate i kullanılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Factory interface npublic interface ILoggerFactory n{ n    ILogger CreateLogger(string category); n} n n// Factory implementasyonu npublic class LoggerFactory : ILoggerFactory n{ n    public ILogger CreateLogger(string category) n    { n        return new ConsoleLogger(category); n    } n} n n// Kullanım nservices.AddSingleton<ILoggerFactory, LoggerFactory>();",
                      "explanation": "Factory pattern ile servis oluşturma örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-factory",
                  "question": "Factory patternin avantajı nedir?",
                  "options": [
                    "Daha hızlı servis oluşturma",
                    "Servis oluşturma mantığını merkezileştirme",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Servis oluşturma mantığını merkezileştirme",
                  "rationale": "Factory pattern, servis oluşturma mantığını merkezileştirerek kod tekrarını azaltır."
                }
              ],
              "resources": [
                {
                  "id": "resource-factory-docs",
                  "label": "Factory Pattern",
                  "href": "https://refactoring.guru/design-patterns/factory-method",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Factory pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-factory",
                  "title": "Factory Pattern Uygulaması",
                  "description": "Factory pattern kullanarak dinamik servis oluştur.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "İleri",
                  "instructions": [
                    "Factory interface oluştur",
                    "Factory implementasyonu yap",
                    "DI container a kaydet ve kullan"
                  ]
                }
              ]
            },
            {
              "label": "Options Pattern Kullanımı",
              "href": "/education/lessons/architecture/di/options-pattern",
              "description": "Options pattern ile konfigürasyon yönetimi.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Options pattern, strongly-typed configuration sağlar",
                "IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T> kullanılabilir",
                "Options pattern validation desteği sağlar",
                "Options pattern, appsettings.json dan otomatik yüklenir"
              ],
              "sections": [
                {
                  "id": "options-pattern",
                  "title": "Options Pattern",
                  "summary": "Strongly-typed configuration.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Options pattern, strongly-typed configuration sağlar. IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T> interface leri kullanılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Options class npublic class DatabaseOptions n{ n    public string ConnectionString { get; set; } n    public int Timeout { get; set; } n} n n// Kayıt nservices.Configure<DatabaseOptions>(configuration.GetSection("Database ")); n n// Kullanım npublic class MyService n{ n    private readonly DatabaseOptions _options; n    public MyService(IOptions<DatabaseOptions> options) n    { n        _options = options.Value; n    } n}",
                      "explanation": "Options pattern kullanım örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-options",
                  "question": "Options patternin avantajı nedir?",
                  "options": [
                    "Daha hızlı configuration",
                    "Strongly-typed configuration ve validation",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Strongly-typed configuration ve validation",
                  "rationale": "Options pattern, strongly-typed configuration sağlar ve validation desteği sunar."
                }
              ],
              "resources": [
                {
                  "id": "resource-options-docs",
                  "label": "Microsoft Docs: Options Pattern",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/configuration/options",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Options pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-options",
                  "title": "Options Pattern Uygulaması",
                  "description": "Options pattern kullanarak configuration yönet.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Options class oluştur",
                    "appsettings.json a ekle",
                    "IOptions<T> kullan"
                  ]
                }
              ]
            },
            {
              "label": "Extension Methods ile DI Kayıtları",
              "href": "/education/lessons/architecture/di/extension-methods",
              "description": "Extension methods ile modüler servis kayıtları.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Extension methods, servis kayıtlarını modülerleştirir",
                "IServiceCollection extension metodları oluştur",
                "Extension methods, kod organizasyonunu iyileştirir",
                "Her modül kendi extension metodunu sağlayabilir"
              ],
              "sections": [
                {
                  "id": "extension-methods",
                  "title": "Extension Methods",
                  "summary": "Modüler servis kayıtları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Extension methods, servis kayıtlarını modülerleştirir. IServiceCollection extension metodları oluşturarak her modül kendi servislerini kaydedebilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Extension method npublic static class ServiceCollectionExtensions n{ n    public static IServiceCollection AddMyServices(this IServiceCollection services) n    { n        services.AddScoped<IMyService, MyService>(); n        services.AddSingleton<IMyRepository, MyRepository>(); n        return services; n    } n} n n// Kullanım nservices.AddMyServices();",
                      "explanation": "Extension methods ile modüler servis kayıtları."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-extension",
                  "question": "Extension methods ın avantajı nedir?",
                  "options": [
                    "Daha hızlı servis kaydı",
                    "Modüler ve organize servis kayıtları",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Modüler ve organize servis kayıtları",
                  "rationale": "Extension methods, servis kayıtlarını modülerleştirir ve kod organizasyonunu iyileştirir."
                }
              ],
              "resources": [
                {
                  "id": "resource-extension-docs",
                  "label": "Microsoft Docs: Extension Methods",
                  "href": "https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/extension-methods",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Extension methods hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-extension",
                  "title": "Extension Methods Uygulaması",
                  "description": "Extension methods ile modüler servis kayıtları oluştur.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Extension method oluştur",
                    "Servis kayıtlarını ekle",
                    "Program.cs de kullan"
                  ]
                }
              ]
            },
            {
              "label": "Service Locator Pattern ve Anti-Pattern ler",
              "href": "/education/lessons/architecture/di/service-locator-anti-patterns",
              "description": "Service Locator patternini öğren ve anti-pattern lerden kaçın.",
              "estimatedDurationMinutes": 40,
              "level": "İleri",
              "keyTakeaways": [
                "Service Locator pattern bir anti-pattern dir",
                "Dependency Injection, Service Locator dan daha iyidir",
                "Hidden dependencies test edilebilirliği azaltır",
                "Constructor injection tercih edilmelidir"
              ],
              "sections": [
                {
                  "id": "service-locator",
                  "title": "Service Locator Anti-Pattern",
                  "summary": "Service Locator neden kötü?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Service Locator pattern bir anti-pattern dir çünkü hidden dependencies oluşturur ve test edilebilirliği azaltır. Dependency Injection tercih edilmelidir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Service Locator npublic class MyService n{ n    public void DoSomething() n    { n        var dependency = ServiceLocator.GetService<IDependency>(); n        // Hidden dependency! n    } n} n n// İyi: Dependency Injection npublic class MyService n{ n    private readonly IDependency _dependency; n    public MyService(IDependency dependency) n    { n        _dependency = dependency; // Explicit dependency n    } n}",
                      "explanation": "Service Locator yerine Dependency Injection kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-locator",
                  "question": "Service Locator neden anti-pattern dir?",
                  "options": [
                    "Daha yavaştır",
                    "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
                    "Daha fazla kod gerektirir",
                    "Hiçbir nedeni yoktur"
                  ],
                  "answer": "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
                  "rationale": "Service Locator, hidden dependencies oluşturur ve test edilebilirliği azaltır."
                }
              ],
              "resources": [
                {
                  "id": "resource-locator-docs",
                  "label": "Service Locator Anti-Pattern",
                  "href": "https://martinfowler.com/articles/injection.html",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Service Locator anti-pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-locator",
                  "title": "Anti-Pattern leri Önleme",
                  "description": "Service Locator kullanımını Dependency Injection a çevir.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "İleri",
                  "instructions": [
                    "Service Locator kullanımını bul",
                    "Constructor injection a çevir",
                    "Test edilebilirliği iyileştir"
                  ]
                }
              ]
            }
          ]
        }$$::jsonb AS module
)
UPDATE "courses"
SET "content" = jsonb_set(
  "content",
  '{modules}',
  COALESCE(("content"->'modules'), '[]'::jsonb) || (SELECT module FROM new_module)
)
WHERE "id" = 'course-dotnet-roadmap'
  AND NOT EXISTS (
    SELECT 1 
    FROM jsonb_array_elements("content"->'modules') AS m
    WHERE m->>'id' = (SELECT module->>'id' FROM new_module)
  );


INSERT INTO "quizzes" (
    "id",
    "courseId",
    "title",
    "description",
    "topic",
    "type",
    "level",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
)
VALUES
        'course-dotnet-roadmap',
        'Mini Test: Interface Segregation Principle',
        'ISP prensibini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-isp-1",
            "question": "ISP nin amacı nedir?",
            "options": [
              "Daha fazla interface oluşturmak",
              "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
              "Daha az kod yazmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ISP, client ların sadece ihtiyaç duydukları metodlara bağımlı olmasını sağlar."
          },
          {
            "id": "mini-isp-2",
            "question": "Büyük interface ler nasıl bölünmelidir?",
            "options": [
              "Daha fazla metod ekleyerek",
              "Küçük, spesifik interface lere bölerek",
              "Daha az metod ekleyerek",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Büyük interface ler küçük, spesifik interface lere bölünmelidir."
          },
          {
            "id": "mini-isp-3",
            "question": "ISP nin faydası nedir?",
            "options": [
              "Daha hızlı kod",
              "Test edilebilirlik ve bakım kolaylığı",
              "Daha az bellek",
              "Hiçbir faydası yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "ISP, test edilebilirliği ve bakım kolaylığını artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/solid/interface-segregation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-solid-dependency-inversion',
        'course-dotnet-roadmap',
        'Mini Test: Dependency Inversion Principle',
        'DIP prensibini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-dip-1",
            "question": "DIP nin amacı nedir?",
            "options": [
              "Daha fazla interface oluşturmak",
              "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
              "Daha az kod yazmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, yüksek seviye modüllerin abstraction lara (interface lere) bağımlı olmasını sağlar."
          },
          {
            "id": "mini-dip-2",
            "question": "DIP nasıl uygulanır?",
            "options": [
              "Daha fazla class oluşturarak",
              "Dependency Injection kullanarak",
              "Daha az interface kullanarak",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, Dependency Injection kullanılarak uygulanır."
          },
          {
            "id": "mini-dip-3",
            "question": "DIP nin faydası nedir?",
            "options": [
              "Daha hızlı kod",
              "Test edilebilirlik ve esneklik",
              "Daha az bellek",
              "Hiçbir faydası yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, test edilebilirliği ve esnekliği artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/solid/dependency-inversion',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-service-lifetime',
        'course-dotnet-roadmap',
        'Mini Test: Service Lifetime Yönetimi',
        'Service lifetime türlerini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-lifetime-1",
            "question": "Scoped lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Her HTTP request için bir instance gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Scoped lifetime, her HTTP request için bir instance oluşturur, bu da Entity Framework DbContext gibi servisler için idealdir."
          },
          {
            "id": "mini-lifetime-2",
            "question": "Singleton lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Uygulama yaşam döngüsü boyunca tek instance gerektiğinde",
              "Sadece scoped alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Singleton lifetime, uygulama yaşam döngüsü boyunca tek bir instance oluşturur."
          },
          {
            "id": "mini-lifetime-3",
            "question": "Transient lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Her çağrıda yeni instance gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Transient lifetime, her çağrıda yeni bir instance oluşturur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/service-lifetime',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-factory-pattern',
        'course-dotnet-roadmap',
        'Mini Test: Factory Pattern ile DI',
        'Factory pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-factory-1",
            "question": "Factory pattern in avantajı nedir?",
            "options": [
              "Daha hızlı servis oluşturma",
              "Servis oluşturma mantığını merkezileştirme",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Factory pattern, servis oluşturma mantığını merkezileştirerek kod tekrarını azaltır."
          },
          {
            "id": "mini-factory-2",
            "question": "Factory pattern ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Runtime da servis seçimi gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Factory pattern, runtime da servis seçimine izin verir."
          },
          {
            "id": "mini-factory-3",
            "question": "Func<T> delegate i factory olarak kullanılabilir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Func<T> delegate i de factory olarak kullanılabilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/factory-pattern',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-options-pattern',
        'course-dotnet-roadmap',
        'Mini Test: Options Pattern',
        'Options pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-options-1",
            "question": "Options pattern in avantajı nedir?",
            "options": [
              "Daha hızlı configuration",
              "Strongly-typed configuration ve validation",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Options pattern, strongly-typed configuration sağlar ve validation desteği sunar."
          },
          {
            "id": "mini-options-2",
            "question": "IOptions<T> ve IOptionsSnapshot<T> arasındaki fark nedir?",
            "options": [
              "Hiçbir fark yoktur",
              "IOptionsSnapshot<T> değişiklikleri algılar, IOptions<T> algılamaz",
              "IOptions<T> daha hızlıdır",
              "IOptionsSnapshot<T> sadece singleton için kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "IOptionsSnapshot<T> değişiklikleri algılar, IOptions<T> algılamaz."
          },
          {
            "id": "mini-options-3",
            "question": "Options pattern validation desteği sağlar mı?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Options pattern validation desteği sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/options-pattern',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-extension-methods',
        'course-dotnet-roadmap',
        'Mini Test: Extension Methods ile DI',
        'Extension methods konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-extension-1",
            "question": "Extension methods ın avantajı nedir?",
            "options": [
              "Daha hızlı servis kaydı",
              "Modüler ve organize servis kayıtları",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Extension methods, servis kayıtlarını modülerleştirir ve kod organizasyonunu iyileştirir."
          },
          {
            "id": "mini-extension-2",
            "question": "Extension methods hangi tip üzerinde tanımlanır?",
            "options": [
              "Sadece class",
              "IServiceCollection gibi interface ler",
              "Sadece struct",
              "Hiçbir tip"
            ],
            "correctAnswer": 1,
            "explanation": "Extension methods, IServiceCollection gibi interface ler üzerinde tanımlanabilir."
          },
          {
            "id": "mini-extension-3",
            "question": "Her modül kendi extension metodunu sağlayabilir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Her modül kendi extension metodunu sağlayabilir, bu da modülerliği artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/extension-methods',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-service-locator-anti-patterns',
        'course-dotnet-roadmap',
        'Mini Test: Service Locator Anti-Pattern',
        'Service Locator anti-pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-locator-1",
            "question": "Service Locator neden anti-pattern dir?",
            "options": [
              "Daha yavaştır",
              "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
              "Daha fazla kod gerektirir",
              "Hiçbir nedeni yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Service Locator, hidden dependencies oluşturur ve test edilebilirliği azaltır."
          },
          {
            "id": "mini-locator-2",
            "question": "Service Locator yerine ne kullanılmalıdır?",
            "options": [
              "Daha fazla Service Locator",
              "Dependency Injection",
              "Daha az Service Locator",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Service Locator yerine Dependency Injection kullanılmalıdır."
          },
          {
            "id": "mini-locator-3",
            "question": "Constructor injection tercih edilmelidir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Constructor injection, explicit dependencies sağladığı için tercih edilmelidir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/service-locator-anti-patterns',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (

COMMIT;
