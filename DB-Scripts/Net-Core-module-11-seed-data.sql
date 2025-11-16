-- Module 11: Performans ve Caching Teknikleri - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-11-performance",
          "title": "Performans ve Caching Teknikleri",
          "summary": "Profiling, caching ve asenkron işleme taktikleriyle uygulamanı hızlandır.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında darboğazları profilleyip memory veya distributed cache stratejileri uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Performance",
            "description": "Profiling araçları ve cache stratejilerini pratiğe dök."
          },
          "relatedTopics": [
            {
              "label": "dotnet-counters ile Profiling",
              "href": "/education/lessons/performance/profiling/dotnet-counters",
              "description": "Runtime metriklerini gerçek zamanlı takip et."
            },
            {
              "label": "MemoryCache vs Distributed Cache",
              "href": "/education/lessons/performance/caching/memory-vs-distributed",
              "description": "Farklı caching yaklaşımlarını senaryolara göre kıyasla."
            },
            {
              "label": "Performans İçin Sağlık Kontrolleri",
              "href": "/education/lessons/performance/health-checks/performance-endpoints",
              "description": "Health check uç noktalarıyla servis durumunu izle."
            },
            {
              "label": "Performance Profiling Araçları",
              "href": "/education/lessons/performance/profiling/performance-profiling-tools",
              "description": "PerfView, dotTrace, Application Insights gibi profiling araçlarını kullan."
            },
            {
              "label": "Memory Leak Detection ve Analysis",
              "href": "/education/lessons/performance/memory/memory-leak-detection-analysis",
              "description": "Memory leak tespiti ve analiz tekniklerini öğren."
            },
            {
              "label": "Response Caching ve Output Caching",
              "href": "/education/lessons/performance/caching/response-output-caching",
              "description": "Response caching ve output caching stratejilerini uygula."
            },
            {
              "label": "Redis Cache Entegrasyonu",
              "href": "/education/lessons/performance/caching/redis-cache-integration",
              "description": "Redis ile distributed caching entegrasyonunu yapılandır."
            },
            {
              "label": "Cache Invalidation Stratejileri",
              "href": "/education/lessons/performance/caching/cache-invalidation-strategies",
              "description": "Cache invalidation stratejilerini ve patternlerini öğren."
            },
            {
              "label": "Performance Best Practices",
              "href": "/education/lessons/performance/best-practices/performance-best-practices",
              "description": "Performance optimization için en iyi pratikleri uygula."
            },
            {
              "label": "Async/Await Performance Optimization",
              "href": "/education/lessons/performance/async/async-await-performance-optimization",
              "description": "Async/await kullanımında performance optimization tekniklerini öğren."
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
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'dotnet-counters ile Profiling - Mini Test',
    'dotnet-counters profiling hakkında temel bilgileri test eder.',
    '[
      {
        "question": "dotnet-counters nedir?",
        "type": "single",
        "options": [
          "Sadece bir tool",
          ".NET Core runtime metriklerini izlemek için bir tool",
          "Sadece bir kütüphane",
          "Sadece bir framework"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, .NET Core runtime metriklerini izlemek için kullanılan bir tooldur."
      },
      {
        "question": "dotnet-counters hangi metrikleri izler?",
        "type": "single",
        "options": [
          "Sadece CPU",
          "CPU, memory, GC, exceptions, thread pool vb.",
          "Sadece memory",
          "Sadece GC"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, CPU, memory, GC, exceptions, thread pool gibi çeşitli metrikleri izler."
      },
      {
        "question": "dotnet-counters nasıl kullanılır?",
        "type": "single",
        "options": [
          "Sadece GUI ile",
          "Command line ile: dotnet-counters monitor <process-id>",
          "Sadece API ile",
          "Sadece config dosyası ile"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, command line ile kullanılır: dotnet-counters monitor <process-id>."
      },
      {
        "question": "dotnet-counters hangi durumlarda kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Productionda performance sorunlarını tespit etmek için",
          "Sadece testte",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, productionda performance sorunlarını tespit etmek için kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/profiling/dotnet-counters',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'MemoryCache vs Distributed Cache - Mini Test',
    'MemoryCache ve Distributed Cache hakkında temel bilgileri test eder.',
    '[
      {
        "question": "MemoryCache nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Tek bir sunucuda çalışan in-memory cache",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "MemoryCache, tek bir sunucuda çalışan in-memory cachedir."
      },
      {
        "question": "Distributed Cache nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Birden fazla sunucu arasında paylaşılan cache (Redis, SQL Server Cache vb.)",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Distributed Cache, birden fazla sunucu arasında paylaşılan cachedir (Redis, SQL Server Cache vb.)."
      },
      {
        "question": "MemoryCache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Tek sunucu veya sticky session senaryolarında",
          "Sadece developmentta",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "MemoryCache, tek sunucu veya sticky session senaryolarında kullanılır."
      },
      {
        "question": "Distributed Cache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Load balanced, multi-server senaryolarında",
          "Sadece tek sunucuda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Distributed Cache, load balanced, multi-server senaryolarında kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/memory-vs-distributed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Performans İçin Sağlık Kontrolleri - Mini Test',
    'Performance health checks hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Health check nedir?",
        "type": "single",
        "options": [
          "Sadece bir endpoint",
          "Uygulama ve bağımlılıklarının sağlık durumunu kontrol eden mekanizma",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Health check, uygulama ve bağımlılıklarının sağlık durumunu kontrol eden bir mekanizmadır."
      },
      {
        "question": "Health check endpointi nasıl yapılandırılır?",
        "type": "single",
        "options": [
          "Sadece appsettings.jsonda",
          "AddHealthChecks() ve MapHealthChecks() ile",
          "Sadece Program.cste",
          "Sadece Startup.cste"
        ],
        "correctAnswer": 1,
        "explanation": "Health check endpointi, AddHealthChecks() ve MapHealthChecks() ile yapılandırılır."
      },
      {
        "question": "Health check neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Load balancerlar ve orchestrator lar için servis durumunu bildirmek için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Health check, load balancerlar ve orchestrator lar için servis durumunu bildirmek için önemlidir."
      },
      {
        "question": "Health check türleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece basic",
          "Basic, database, external service, custom health checks",
          "Sadece database",
          "Sadece external service"
        ],
        "correctAnswer": 1,
        "explanation": "Health check türleri: basic, database, external service, custom health checks."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/health-checks/performance-endpoints',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Performance Profiling Araçları - Mini Test',
    'Performance profiling tools hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Performance profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Uygulama performansını analiz etme ve darboğazları tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Performance profiling, uygulama performansını analiz etme ve darboğazları tespit etme işlemidir."
      },
      {
        "question": "Hangi profiling araçları kullanılır?",
        "type": "single",
        "options": [
          "Sadece Visual Studio",
          "PerfView, dotTrace, Application Insights, Visual Studio Profiler vb.",
          "Sadece PerfView",
          "Sadece dotTrace"
        ],
        "correctAnswer": 1,
        "explanation": "PerfView, dotTrace, Application Insights, Visual Studio Profiler gibi araçlar profiling için kullanılır."
      },
      {
        "question": "CPU profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "CPU kullanımını analiz etme ve hot pathleri tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "CPU profiling, CPU kullanımını analiz etme ve hot pathleri tespit etme işlemidir."
      },
      {
        "question": "Memory profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Memory kullanımını analiz etme ve memory leakleri tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Memory profiling, memory kullanımını analiz etme ve memory leakleri tespit etme işlemidir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/profiling/performance-profiling-tools',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Memory Leak Detection ve Analysis - Mini Test',
    'Memory leak detection hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Memory leak nedir?",
        "type": "single",
        "options": [
          "Sadece bir hata",
          "Kullanılmayan nesnelerin memoryden temizlenmemesi",
          "Sadece bir warning",
          "Sadece bir exception"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, kullanılmayan nesnelerin memoryden temizlenmemesidir."
      },
      {
        "question": "Memory leak nasıl tespit edilir?",
        "type": "single",
        "options": [
          "Sadece manuel kontrol",
          "Profiling araçları (dotMemory, PerfView, Visual Studio Diagnostic Tools) ile",
          "Sadece log kontrolü",
          "Sadece exception kontrolü"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, profiling araçları (dotMemory, PerfView, Visual Studio Diagnostic Tools) ile tespit edilir."
      },
      {
        "question": "Memory leakin yaygın nedenleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece GC",
          "Event handlerlar, static collections, unmanaged resources, circular references",
          "Sadece static variables",
          "Sadece event handlers"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leakin yaygın nedenleri: event handler lar, static collections, unmanaged resources, circular references."
      },
      {
        "question": "Memory leak nasıl önlenir?",
        "type": "single",
        "options": [
          "Sadece GC çağırarak",
          "Event handlerları unsubscribe et, IDisposable implement et, using statement kullan",
          "Sadece static kullanmayarak",
          "Sadece GC çağırarak"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, event handlerları unsubscribe ederek, IDisposable implement ederek ve using statement kullanarak önlenir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/memory/memory-leak-detection-analysis',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Response Caching ve Output Caching - Mini Test',
    'Response caching ve output caching hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Response caching nedir?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "HTTP responseların cache  lenmesi",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Response caching, HTTP responseların cache  lenmesidir."
      },
      {
        "question": "[ResponseCache] attribute ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "Response caching için cache headers ekler",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "[ResponseCache] attribute, response caching için cache headers ekler."
      },
      {
        "question": "Output caching nedir?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "ASP.NET Coreda response output unun cache  lenmesi",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Output caching, ASP.NET Coreda response output unun cache  lenmesidir."
      },
      {
        "question": "Response caching ve output caching arasındaki fark nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "Response caching HTTP headers kullanır, output caching server-side cache kullanır",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "Response caching HTTP headers kullanır, output caching server-side cache kullanır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/response-output-caching',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Redis Cache Entegrasyonu - Mini Test',
    'Redis cache integration hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Redis nedir?",
        "type": "single",
        "options": [
          "Sadece bir database",
          "In-memory data structure store - distributed cache için kullanılan",
          "Sadece bir dosya",
          "Sadece bir API"
        ],
        "correctAnswer": 1,
        "explanation": "Redis, in-memory data structure storedur ve distributed cache için kullanılır."
      },
      {
        "question": "Redis cache nasıl entegre edilir?",
        "type": "single",
        "options": [
          "Sadece connection string ile",
          "AddStackExchangeRedisCache() ve configuration ile",
          "Sadece appsettings.json ile",
          "Sadece Program.cs ile"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cache, AddStackExchangeRedisCache() ve configuration ile entegre edilir."
      },
      {
        "question": "Redis cachein avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece hızlı",
          "Yüksek performans, distributed cache, persistence desteği",
          "Sadece kolay",
          "Sadece ucuz"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cachein avantajı, yüksek performans, distributed cache ve persistence desteğidir."
      },
      {
        "question": "Redis cache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Load balanced, multi-server senaryolarında ve yüksek performans gerektiğinde",
          "Sadece tek sunucuda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cache, load balanced, multi-server senaryolarında ve yüksek performans gerektiğinde kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/redis-cache-integration',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Cache Invalidation Stratejileri - Mini Test',
    'Cache invalidation strategies hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Cache invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Cachedeki eski verileri geçersiz kılma ve temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Cache invalidation, cachedeki eski verileri geçersiz kılma ve temizleme işlemidir."
      },
      {
        "question": "Cache invalidation stratejileri nelerdir?",
        "type": "single",
        "options": [
          "Sadece time-based",
          "Time-based, event-based, manual invalidation",
          "Sadece event-based",
          "Sadece manual"
        ],
        "correctAnswer": 1,
        "explanation": "Cache invalidation stratejileri: time-based, event-based, manual invalidation."
      },
      {
        "question": "Time-based invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Belirli bir süre sonra cachei otomatik temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Time-based invalidation, belirli bir süre sonra cachei otomatik temizlemedir."
      },
      {
        "question": "Event-based invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Veri değiştiğinde cachei temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Event-based invalidation, veri değiştiğinde cachei temizlemedir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/cache-invalidation-strategies',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Performance Best Practices - Mini Test',
    'Performance best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Performance best practiceste en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece cache kullan",
          "Önce ölç, sonra optimize et",
          "Sadece async kullan",
          "Sadece profiling yap"
        ],
        "correctAnswer": 1,
        "explanation": "Performance best practiceste en önemli kural, önce ölç, sonra optimize et  tir."
      },
      {
        "question": "Performance optimizationda ne yapılmamalıdır?",
        "type": "single",
        "options": [
          "Sadece profiling yapma",
          "Premature optimization - ölçmeden optimize etme",
          "Sadece cache kullanma",
          "Sadece async kullanma"
        ],
        "correctAnswer": 1,
        "explanation": "Performance optimizationda premature optimization (ölçmeden optimize etme) yapılmamalıdır."
      },
      {
        "question": "Database query optimization nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece index ekle",
          "Index ekle, N+1 problemi çöz, pagination kullan, select only needed columns",
          "Sadece pagination kullan",
          "Sadece N+1 çöz"
        ],
        "correctAnswer": 1,
        "explanation": "Database query optimization, index ekleyerek, N+1 problemini çözerek, pagination kullanarak ve sadece gerekli kolonları seçerek yapılır."
      },
      {
        "question": "Async/await performanceı nasıl etkiler?",
        "type": "single",
        "options": [
          "Sadece yavaşlatır",
          "I/O bound işlemlerde thread blockingi önleyerek performansı artırır",
          "Sadece hızlandırır",
          "Hiçbir etkisi yok"
        ],
        "correctAnswer": 1,
        "explanation": "Async/await, I/O bound işlemlerde thread blockingi önleyerek performansı artırır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/best-practices/performance-best-practices',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Async/Await Performance Optimization - Mini Test',
    'Async/await performance optimization hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Async/await performance optimizationda en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece async kullan",
          "I/O bound işlemlerde async kullan, CPU bound işlemlerde Task.Run() kullan",
          "Sadece Task.Run() kullan",
          "Sadece sync kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Async/await performance optimizationda en önemli kural, I/O bound işlemlerde async kullanmak, CPU bound işlemlerde Task.Run() kullanmaktır."
      },
      {
        "question": "ConfigureAwait(false) ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Library kodunda, UI contextine ihtiyaç olmadığında",
          "Sadece UI kodunda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "ConfigureAwait(false), library kodunda, UI contextine ihtiyaç olmadığında kullanılır."
      },
      {
        "question": "Async void ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Sadece event handlerlarda",
          "Sadece methodlarda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Async void, sadece event handlerlarda kullanılmalıdır."
      },
      {
        "question": "Task.Result veya .Wait() kullanımı neden tehlikelidir?",
        "type": "single",
        "options": [
          "Sadece yavaş",
          "Deadlock riski oluşturur",
          "Sadece memory leak",
          "Sadece exception"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Result veya .Wait() kullanımı, deadlock riski oluşturur."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/async/async-await-performance-optimization',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 12: Asenkron Programlama (Async/Await) - Mini Tests

COMMIT;
