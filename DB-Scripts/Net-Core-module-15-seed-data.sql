-- Module 15: Microservices Mimarisi - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-15-microservices",
          "title": "Microservices Mimarisi",
          "summary": "Dağıtık yapı taşlarını, servis sınırlarını ve gözlemlenebilirlik gereksinimlerini planla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında bağlam sınırlarını tanımlayıp dayanıklı mikroservis iletişim desenleri kurabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Microservices",
            "description": "Servis sınırları, iletişim desenleri ve gözlemlenebilirliği tek çatı altında öğren."
          },
          "relatedTopics": [
            {
              "label": "Bounded Context Tasarımı",
              "href": "/education/lessons/microservices/bounded-context",
              "description": "Domain-driven design ile servis sınırlarını modelle."
            },
            {
              "label": "Servisler Arası İletişim Desenleri",
              "href": "/education/lessons/microservices/communication-patterns",
              "description": "Sync, async ve event-driven iletişim opsiyonlarını değerlendir."
            },
            {
              "label": "Gözlemlenebilirlik Temelleri",
              "href": "/education/lessons/microservices/observability/foundations",
              "description": "Tracing, logging ve metrics bileşenlerini senkronize et."
            },
            {
              "label": "API Gateway Pattern",
              "href": "/education/lessons/microservices/api-gateway/api-gateway-pattern",
              "description": "API Gateway pattern ve kullanım senaryolarını öğren."
            },
            {
              "label": "Service Mesh ve Istio",
              "href": "/education/lessons/microservices/service-mesh/service-mesh-istio",
              "description": "Service mesh kavramı ve Istio kullanımını öğren."
            },
            {
              "label": "Circuit Breaker Pattern",
              "href": "/education/lessons/microservices/resilience/circuit-breaker-pattern",
              "description": "Circuit breaker pattern ve Polly kütüphanesi kullanımını öğren."
            },
            {
              "label": "Event Sourcing ve CQRS",
              "href": "/education/lessons/microservices/events/event-sourcing-cqrs",
              "description": "Event sourcing ve CQRS pattern lerini mikroservis mimarisinde uygula."
            },
            {
              "label": "Distributed Transactions ve Saga Pattern",
              "href": "/education/lessons/microservices/transactions/distributed-transactions-saga",
              "description": "Distributed transaction yönetimi ve Saga pattern kullanımını öğren."
            },
            {
              "label": "Microservices Testing Stratejileri",
              "href": "/education/lessons/microservices/testing/microservices-testing-strategies",
              "description": "Mikroservis test stratejileri ve contract testing i öğren."
            },
            {
              "label": "Microservices Security Best Practices",
              "href": "/education/lessons/microservices/security/microservices-security-best-practices",
              "description": "Mikroservis güvenliği için en iyi pratikleri uygula."
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
