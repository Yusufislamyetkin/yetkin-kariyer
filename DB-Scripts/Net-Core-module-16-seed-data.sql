-- Module 16: KÃ¼tÃ¼phaneler - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-16-libraries",
          "title": "Kütüphaneler",
          "summary": ".NET ekosistemindeki üretkenliği artıran popüler kütüphaneleri keşfet.",
          "durationMinutes": 30,
          "objectives": [
            "Bu modülü tamamladığında MediatR, FluentValidation ve AutoMapper gibi üretkenlik kütüphanelerini doğru senaryolarda kullanabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Libraries",
            "description": "Ecosistemde sık kullanılan kütüphanelerin rol ve kullanım alanlarını öğren."
          },
          "relatedTopics": [
            {
              "label": "MediatR ile CQRS Uygulama",
              "href": "/education/lessons/libraries/mediatr/cqrs",
              "description": "Komut ve sorguları aracı katmanla yönlendir."
            },
            {
              "label": "FluentValidation ile Doğrulama",
              "href": "/education/lessons/libraries/fluentvalidation/rules",
              "description": "Zengin validasyon kurallarını akıcı API ile tanımla."
            },
            {
              "label": "AutoMapper ile Nesne Eşleme",
              "href": "/education/lessons/libraries/automapper/mapping-profiles",
              "description": "DTO ve domain nesneleri arasında mapping profilleri oluştur."
            },
            {
              "label": "Polly ile Resilience Patterns",
              "href": "/education/lessons/libraries/polly/resilience-patterns",
              "description": "Polly ile retry, circuit breaker ve timeout pattern lerini uygula."
            },
            {
              "label": "Serilog ile Structured Logging",
              "href": "/education/lessons/libraries/serilog/structured-logging",
              "description": "Serilog ile structured logging ve enrichment kullanımını öğren."
            },
            {
              "label": "Mapster ile High-Performance Mapping",
              "href": "/education/lessons/libraries/mapster/high-performance-mapping",
              "description": "Mapster ile yüksek performanslı object mapping i öğren."
            },
            {
              "label": "Refit ile Type-Safe HTTP Clients",
              "href": "/education/lessons/libraries/refit/type-safe-http-clients",
              "description": "Refit ile type-safe HTTP client kullanımını öğren."
            },
            {
              "label": "Swashbuckle ve Swagger Entegrasyonu",
              "href": "/education/lessons/libraries/swashbuckle/swagger-integration",
              "description": "Swashbuckle ile Swagger/OpenAPI dokümantasyonunu yapılandır."
            },
            {
              "label": "Hangfire ile Background Jobs",
              "href": "/education/lessons/libraries/hangfire/background-jobs",
              "description": "Hangfire ile background job processing i öğren."
            },
            {
              "label": "MassTransit ile Message Bus",
              "href": "/education/lessons/libraries/masstransit/message-bus",
              "description": "MassTransit ile message bus ve event-driven architecture ı uygula."
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


-- Bu modÃ¼l iÃ§in henÃ¼z mini test eklenmemiÅŸtir.

COMMIT;
