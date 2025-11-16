-- Module 13: Docker ile Containerization - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-13-docker",
          "title": "Docker ile Containerization",
          "summary": "Uygulamanı containerize et, image optimizasyonu ve orchestrator entegrasyonuna hazırla.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında çok aşamalı Dockerfile lar oluşturup container tabanlı dağıtımı yönetebileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Docker%20.NET",
            "description": "Multi-stage Dockerfile ve container best practice lerini öğren."
          },
          "relatedTopics": [
            {
              "label": "Multi-stage Dockerfile Oluşturma",
              "href": "/education/lessons/docker/multi-stage-builds",
              "description": "SDK ve runtime katmanlarını ayırarak hafif image üret."
            },
            {
              "label": "Container Ortam Değişkenleri",
              "href": "/education/lessons/docker/environment-configuration",
              "description": "Farklı ortam konfigürasyonlarını container seviyesinde yönet."
            },
            {
              "label": "Health Check ve Probing",
              "href": "/education/lessons/docker/health-checks",
              "description": "Container sağlık durumunu izleyen prob ları yapılandır."
            },
            {
              "label": "Docker Image Optimizasyonu",
              "href": "/education/lessons/docker/optimization/docker-image-optimization",
              "description": "Docker image boyutunu ve build süresini optimize etme tekniklerini öğren."
            },
            {
              "label": "Docker Compose ile Multi-Container Uygulamalar",
              "href": "/education/lessons/docker/docker-compose/multi-container-applications",
              "description": "Docker Compose ile çoklu container uygulamalarını yönet."
            },
            {
              "label": ".NET Core için Docker Best Practices",
              "href": "/education/lessons/docker/best-practices/dotnet-docker-best-practices",
              "description": ".NET Core uygulamaları için Docker best practices lerini uygula."
            },
            {
              "label": "Docker Volume ve Bind Mount Kullanımı",
              "href": "/education/lessons/docker/volumes/docker-volumes-bind-mounts",
              "description": "Docker volume ve bind mount kullanımını öğren."
            },
            {
              "label": "Docker Networking ve Service Discovery",
              "href": "/education/lessons/docker/networking/docker-networking-service-discovery",
              "description": "Docker networking ve service discovery mekanizmalarını kavra."
            },
            {
              "label": "Container Security Best Practices",
              "href": "/education/lessons/docker/security/container-security-best-practices",
              "description": "Container güvenliği için en iyi pratikleri uygula."
            },
            {
              "label": "Docker Registry ve Image Management",
              "href": "/education/lessons/docker/registry/docker-registry-image-management",
              "description": "Docker registry kullanımı ve image yönetim stratejilerini öğren."
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
