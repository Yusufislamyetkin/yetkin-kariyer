-- Module 06: Middleware - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-06-middleware",
          "title": "Middleware ve Pipeline Yönetimi",
          "summary": "Request pipeline ını özelleştir, cross-cutting ihtiyaçları yapılandır ve performansı izle.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında custom middleware yazarak istek akışını kontrol edebilecek ve gözlemlenebilirlik için metrikler toplayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Middleware",
            "description": "İstek işleme sırasını kontrol etmek için middleware zincirini yönet."
          },
          "relatedTopics": [
            {
              "label": "Custom Middleware Yazımı",
              "href": "/education/lessons/middleware/custom-middleware",
              "description": "RequestDelegate kullanarak yeniden kullanılabilir bileşenler tasarla."
            },
            {
              "label": "Pipeline Sıralamasını Yönetme",
              "href": "/education/lessons/middleware/pipeline-ordering",
              "description": "UseRouting ve UseEndpoints gibi kritik middleware leri sırala."
            },
            {
              "label": "İstek Günlüğü ve İzleme",
              "href": "/education/lessons/middleware/request-logging",
              "description": "İstek başına korelasyon ve gecikme ölçümleri ekle."
            },
            {
              "label": "Middleware Pipeline Yapısı",
              "href": "/education/lessons/middleware/pipeline-structure",
              "description": "Middleware pipeline yapısını ve çalışma mantığını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware pipeline request i sırayla işler",
                "RequestDelegate bir sonraki middleware i çağırır",
                "Middleware sırası çok önemlidir",
                "Use() metodu middleware ekler"
              ],
              "sections": [
                {
                  "id": "pipeline-structure",
                  "title": "Pipeline Yapısı",
                  "summary": "Middleware pipeline çalışma mantığı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware pipeline request i sırayla işler. Her middleware bir sonraki middleware i RequestDelegate ile çağırır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Middleware pipeline napp.Use(async (context, next) => n{ n    // Request işleme n    await next(); // Sonraki middleware n    // Response işleme n});",
                      "explanation": "Middleware pipeline yapısı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-pipeline",
                  "question": "Middleware pipeline nasıl çalışır?",
                  "options": [
                    "Paralel olarak",
                    "Sırayla",
                    "Rastgele",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Sırayla",
                  "rationale": "Middleware pipeline request i sırayla işler."
                }
              ],
              "resources": [
                {
                  "id": "resource-pipeline-docs",
                  "label": "Microsoft Docs: Middleware",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware pipeline yapısı hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-pipeline",
                  "title": "Middleware Pipeline",
                  "description": "Middleware pipeline yapısını anla ve uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware pipeline oluştur",
                    "RequestDelegate kullan",
                    "Sıralamayı test et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Sıralaması ve Execution Order",
              "href": "/education/lessons/middleware/execution-order",
              "description": "Middleware sıralamasının önemini ve execution order ı öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware sırası çok önemlidir",
                "UseRouting() ve UseEndpoints() doğru yerde olmalıdır",
                "Exception handling middleware en üstte olmalıdır",
                "Authentication middleware routing den önce olmalıdır"
              ],
              "sections": [
                {
                  "id": "execution-order",
                  "title": "Execution Order",
                  "summary": "Middleware sıralaması ve önemi.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware sırası çok önemlidir. Exception handling middleware en üstte, authentication routing den önce, UseRouting() ve UseEndpoints() doğru yerde olmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Doğru middleware sırası napp.UseExceptionHandler(); // En üstte napp.UseHttpsRedirection(); napp.UseStaticFiles(); napp.UseRouting(); napp.UseAuthentication(); // Routing den sonra napp.UseAuthorization(); napp.UseEndpoints(endpoints => n{ n    endpoints.MapControllers(); n});",
                      "explanation": "Doğru middleware sıralaması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-order",
                  "question": "Exception handling middleware nerede olmalıdır?",
                  "options": [
                    "En altta",
                    "En üstte",
                    "Ortada",
                    "Hiçbir yerde"
                  ],
                  "answer": "En üstte",
                  "rationale": "Exception handling middleware en üstte olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-order-docs",
                  "label": "Microsoft Docs: Middleware Order",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware sıralaması hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-order",
                  "title": "Middleware Sıralaması",
                  "description": "Doğru middleware sıralamasını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware sırasını düzenle",
                    "UseRouting() ve UseEndpoints() doğru yere koy",
                    "Test et"
                  ]
                }
              ]
            },
            {
              "label": "Conditional Middleware",
              "href": "/education/lessons/middleware/conditional-middleware",
              "description": "Koşullu middleware kullanımını öğren.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "UseWhen() ile koşullu middleware eklenebilir",
                "Map() ile path-based middleware eklenebilir",
                "MapWhen() ile daha karmaşık koşullar kullanılabilir",
                "Conditional middleware performansı artırabilir"
              ],
              "sections": [
                {
                  "id": "conditional-middleware",
                  "title": "Conditional Middleware",
                  "summary": "Koşullu middleware kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "UseWhen(), Map() ve MapWhen() ile koşullu middleware eklenebilir. Bu sayede sadece belirli koşullarda middleware çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// UseWhen ile koşullu middleware napp.UseWhen(context => context.Request.Path.StartsWithSegments("/api "), n    appBuilder => n    { n        appBuilder.UseAuthentication(); n    }); n n// Map ile path-based middleware napp.Map("/admin ", adminApp => n{ n    adminApp.UseAuthentication(); n    adminApp.UseAuthorization(); n});",
                      "explanation": "Koşullu middleware kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-conditional",
                  "question": "UseWhen() ne işe yarar?",
                  "options": [
                    "Sadece middleware ekler",
                    "Koşullu middleware ekler",
                    "Sadece path belirler",
                    "Hiçbir şey"
                  ],
                  "answer": "Koşullu middleware ekler",
                  "rationale": "UseWhen() koşullu middleware ekler."
                }
              ],
              "resources": [
                {
                  "id": "resource-conditional-docs",
                  "label": "Microsoft Docs: Conditional Middleware",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Conditional middleware hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-conditional",
                  "title": "Conditional Middleware",
                  "description": "Koşullu middleware kullanımını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "UseWhen() kullan",
                    "Map() ile path-based middleware ekle",
                    "Test et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Dependency Injection",
              "href": "/education/lessons/middleware/di-middleware",
              "description": "Middleware lerde dependency injection kullanımını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware constructor da DI kullanılabilir",
                "IMiddleware interface i ile DI desteklenir",
                "Service lifetime lara dikkat edilmelidir",
                "Scoped servisler middleware de dikkatli kullanılmalıdır"
              ],
              "sections": [
                {
                  "id": "di-middleware",
                  "title": "Middleware Dependency Injection",
                  "summary": "Middleware lerde DI kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware constructor da DI kullanılabilir. IMiddleware interface i ile DI desteklenir. Service lifetime lara dikkat edilmelidir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Constructor injection npublic class LoggingMiddleware n{ n    private readonly ILogger<LoggingMiddleware> _logger; n    private readonly RequestDelegate _next; n     n    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger) n    { n        _next = next; n        _logger = logger; n    } n     n    public async Task InvokeAsync(HttpContext context) n    { n        _logger.LogInformation("Request: {Path} ", context.Request.Path); n        await _next(context); n    } n}",
                      "explanation": "Middleware de DI kullanım örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-di-middleware",
                  "question": "Middleware de DI nasıl kullanılır?",
                  "options": [
                    "Sadece Invoke metodunda",
                    "Constructor da",
                    "Sadece Use metodunda",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Constructor da",
                  "rationale": "Middleware constructor da DI kullanılabilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-di-middleware-docs",
                  "label": "Microsoft Docs: Middleware DI",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware de DI kullanımı hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-di-middleware",
                  "title": "Middleware Dependency Injection",
                  "description": "Middleware de DI kullanımını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware constructor da DI kullan",
                    "IMiddleware interface i kullan",
                    "Service lifetime lara dikkat et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Exception Handling",
              "href": "/education/lessons/middleware/exception-handling",
              "description": "Middleware lerde exception handling stratejilerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Exception handling middleware en üstte olmalıdır",
                "Try-catch ile exception yakalanabilir",
                "Error response ları standartlaştırılmalıdır",
                "Exception lar loglanmalıdır"
              ],
              "sections": [
                {
                  "id": "exception-handling",
                  "title": "Exception Handling",
                  "summary": "Middleware lerde exception handling.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Exception handling middleware en üstte olmalıdır. Try-catch ile exception yakalanabilir, error response ları standartlaştırılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Exception handling middleware napp.UseExceptionHandler(errorApp => n{ n    errorApp.Run(async context => n    { n        context.Response.StatusCode = 500; n        context.Response.ContentType ="application/json "; n         n        var error = new { Message ="An error occurred \" }; n        await context.Response.WriteAsJsonAsync(error); n    }); n});",
                      "explanation": "Exception handling middleware örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-exception-middleware",
                  "question": "Exception handling middleware nerede olmalıdır?",
                  "options": [
                    "En altta",
                    "En üstte",
                    "Ortada",
                    "Hiçbir yerde"
                  ],
                  "answer": "En üstte",
                  "rationale": "Exception handling middleware en üstte olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-exception-middleware-docs",
                  "label": "Microsoft Docs: Exception Handling",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/error-handling",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware de exception handling hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-exception-middleware",
                  "title": "Middleware Exception Handling",
                  "description": "Middleware de exception handling uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Exception handling middleware oluştur",
                    "Error response ları standartlaştır",
                    "Exception ları logla"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Performance Monitoring",
              "href": "/education/lessons/middleware/performance-monitoring",
              "description": "Middleware performans izleme tekniklerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Middleware execution time ölçülebilir",
                "Performance counters kullanılabilir",
                "Metrics toplanabilir",
                "Performance monitoring production da kritiktir"
              ],
              "sections": [
                {
                  "id": "performance-monitoring",
                  "title": "Performance Monitoring",
                  "summary": "Middleware performans izleme.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware execution time ölçülebilir, performance counters kullanılabilir ve metrics toplanabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Performance monitoring middleware napp.Use(async (context, next) => n{ n    var stopwatch = Stopwatch.StartNew(); n    await next(); n    stopwatch.Stop(); n     n    _logger.LogInformation("Request {Path} took {ElapsedMilliseconds}ms ", n        context.Request.Path, stopwatch.ElapsedMilliseconds); n});",
                      "explanation": "Performance monitoring middleware örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-performance",
                  "question": "Performance monitoring ne işe yarar?",
                  "options": [
                    "Sadece loglama",
                    "Middleware performansını izleme ve optimize etme",
                    "Sadece metrik toplama",
                    "Hiçbir şey"
                  ],
                  "answer": "Middleware performansını izleme ve optimize etme",
                  "rationale": "Performance monitoring middleware performansını izleme ve optimize etme için kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-performance-docs",
                  "label": "Microsoft Docs: Performance",
                  "href": "https://learn.microsoft.com/aspnet/core/performance",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Performance monitoring hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-performance",
                  "title": "Middleware Performance Monitoring",
                  "description": "Middleware performans izleme uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "İleri",
                  "instructions": [
                    "Execution time ölç",
                    "Metrics topla",
                    "Performance counter lar kullan"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Best Practices",
              "href": "/education/lessons/middleware/best-practices",
              "description": "Middleware geliştirme için en iyi uygulamaları öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware ler tek sorumluluk prensibine uymalıdır",
                "Reusable middleware ler yazılmalıdır",
                "Performance a dikkat edilmelidir",
                "Error handling doğru yapılmalıdır"
              ],
              "sections": [
                {
                  "id": "best-practices",
                  "title": "Best Practices",
                  "summary": "Middleware geliştirme en iyi uygulamaları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware ler tek sorumluluk prensibine uymalı, reusable olmalı, performance a dikkat edilmeli ve error handling doğru yapılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Best practice: Reusable middleware npublic static class MiddlewareExtensions n{ n    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app) n    { n        return app.UseMiddleware<CustomMiddleware>(); n    } n} n n// Kullanım napp.UseCustomMiddleware();",
                      "explanation": "Reusable middleware extension method örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-best-practices",
                  "question": "Middleware ler nasıl olmalıdır?",
                  "options": [
                    "Karmaşık ve çok işlevli",
                    "Tek sorumluluk prensibine uygun ve reusable",
                    "Sadece basit",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Tek sorumluluk prensibine uygun ve reusable",
                  "rationale": "Middleware ler tek sorumluluk prensibine uygun ve reusable olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-best-practices-docs",
                  "label": "Microsoft Docs: Middleware Best Practices",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware best practices hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-best-practices",
                  "title": "Middleware Best Practices",
                  "description": "Middleware geliştirme best practices uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Reusable middleware yaz",
                    "Extension method oluştur",
                    "Performance a dikkat et"
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
        'Mini Test: Middleware Pipeline Yapısı',
        'Middleware pipeline yapısını pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-pipeline-1",
            "question": "Middleware pipeline nasıl çalışır?",
            "options": [
              "Paralel olarak",
              "Sırayla",
              "Rastgele",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware pipeline request i sırayla işler."
          },
          {
            "id": "mini-pipeline-2",
            "question": "RequestDelegate ne işe yarar?",
            "options": [
              "Sadece request oluşturur",
              "Bir sonraki middleware i çağırır",
              "Sadece response oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RequestDelegate bir sonraki middleware i çağırır."
          },
          {
            "id": "mini-pipeline-3",
            "question": "Use() metodu ne işe yarar?",
            "options": [
              "Sadece middleware siler",
              "Middleware ekler",
              "Sadece middleware listeler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Use() metodu middleware ekler."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/pipeline-structure',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-execution-order',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Sıralaması ve Execution Order',
        'Middleware sıralamasını pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-order-1",
            "question": "Exception handling middleware nerede olmalıdır?",
            "options": [
              "En altta",
              "En üstte",
              "Ortada",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Exception handling middleware en üstte olmalıdır."
          },
          {
            "id": "mini-order-2",
            "question": "Authentication middleware nerede olmalıdır?",
            "options": [
              "Routing den önce",
              "Routing den sonra",
              "En altta",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Authentication middleware routing den sonra olmalıdır."
          },
          {
            "id": "mini-order-3",
            "question": "UseRouting() ve UseEndpoints() nerede olmalıdır?",
            "options": [
              "Rastgele",
              "Doğru sırada",
              "Sadece başta",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "UseRouting() ve UseEndpoints() doğru sırada olmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/execution-order',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-conditional-middleware',
        'course-dotnet-roadmap',
        'Mini Test: Conditional Middleware',
        'Conditional middleware konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-conditional-1",
            "question": "UseWhen() ne işe yarar?",
            "options": [
              "Sadece middleware ekler",
              "Koşullu middleware ekler",
              "Sadece path belirler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "UseWhen() koşullu middleware ekler."
          },
          {
            "id": "mini-conditional-2",
            "question": "Map() ne işe yarar?",
            "options": [
              "Sadece path belirler",
              "Path-based middleware ekler",
              "Sadece middleware siler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Map() path-based middleware ekler."
          },
          {
            "id": "mini-conditional-3",
            "question": "Conditional middleware performansı nasıl etkiler?",
            "options": [
              "Yavaşlatır",
              "Artırabilir",
              "Etkilemez",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Conditional middleware performansı artırabilir çünkü sadece gerektiğinde çalışır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/conditional-middleware',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-di-middleware',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Dependency Injection',
        'Middleware DI konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-di-middleware-1",
            "question": "Middleware de DI nasıl kullanılır?",
            "options": [
              "Sadece Invoke metodunda",
              "Constructor da",
              "Sadece Use metodunda",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware constructor da DI kullanılabilir."
          },
          {
            "id": "mini-di-middleware-2",
            "question": "IMiddleware interface i ne sağlar?",
            "options": [
              "Sadece DI",
              "DI desteği",
              "Sadece middleware",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "IMiddleware interface i DI desteği sağlar."
          },
          {
            "id": "mini-di-middleware-3",
            "question": "Scoped servisler middleware de nasıl kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Dikkatli kullanılmalıdır",
              "Hiçbir zaman",
              "Sadece bazen"
            ],
            "correctAnswer": 1,
            "explanation": "Scoped servisler middleware de dikkatli kullanılmalıdır çünkü middleware singleton olabilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/di-middleware',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-exception-handling',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Exception Handling',
        'Middleware exception handling konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-exception-middleware-1",
            "question": "Exception handling middleware nerede olmalıdır?",
            "options": [
              "En altta",
              "En üstte",
              "Ortada",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Exception handling middleware en üstte olmalıdır."
          },
          {
            "id": "mini-exception-middleware-2",
            "question": "Error response ları nasıl olmalıdır?",
            "options": [
              "Her zaman farklı",
              "Standartlaştırılmış",
              "Sadece string",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Error response ları standartlaştırılmalıdır."
          },
          {
            "id": "mini-exception-middleware-3",
            "question": "Exception lar ne yapılmalıdır?",
            "options": [
              "Sadece loglanmalı",
              "Loglanmalı ve client a uygun mesaj döndürülmeli",
              "Sadece client a döndürülmeli",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Exception lar loglanmalı ve client a uygun error mesajları döndürülmelidir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/exception-handling',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-performance-monitoring',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Performance Monitoring',
        'Middleware performance monitoring konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-performance-1",
            "question": "Performance monitoring ne işe yarar?",
            "options": [
              "Sadece loglama",
              "Middleware performansını izleme ve optimize etme",
              "Sadece metrik toplama",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Performance monitoring middleware performansını izleme ve optimize etme için kullanılır."
          },
          {
            "id": "mini-performance-2",
            "question": "Middleware execution time nasıl ölçülür?",
            "options": [
              "Sadece Stopwatch ile",
              "Stopwatch veya performance counter ile",
              "Sadece performance counter ile",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware execution time Stopwatch veya performance counter ile ölçülebilir."
          },
          {
            "id": "mini-performance-3",
            "question": "Performance monitoring production da kritik midir?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Performance monitoring production da kritiktir çünkü performans sorunlarını tespit etmeye yardımcı olur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/performance-monitoring',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-best-practices',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Best Practices',
        'Middleware best practices konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-best-practices-1",
            "question": "Middleware ler nasıl olmalıdır?",
            "options": [
              "Karmaşık ve çok işlevli",
              "Tek sorumluluk prensibine uygun ve reusable",
              "Sadece basit",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware ler tek sorumluluk prensibine uygun ve reusable olmalıdır."
          },
          {
            "id": "mini-best-practices-2",
            "question": "Reusable middleware nasıl oluşturulur?",
            "options": [
              "Sadece class olarak",
              "Extension method ile",
              "Sadece interface ile",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Reusable middleware extension method ile oluşturulur."
          },
          {
            "id": "mini-best-practices-3",
            "question": "Error handling middleware de nasıl olmalıdır?",
            "options": [
              "Yanlış yapılmalı",
              "Doğru yapılmalı",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Error handling middleware de doğru yapılmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/best-practices',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

COMMIT;
