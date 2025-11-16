-- Module 14: CI/CD ve Deployment SÃ¼reÃ§leri - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-14-cicd",
          "title": "CI/CD ve Deployment Süreçleri",
          "summary": "Pipeline otomasyonu, kalite kapıları ve mavi-yeşil dağıtımlarla üretime güvenli geçiş yap.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında uçtan uca CI/CD pipeline ları tasarlayıp güvenli dağıtım stratejileri uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=CI%2FCD",
            "description": "Build, test ve release aşamalarını otomatikleştiren pipeline lar tasarla."
          },
          "relatedTopics": [
            {
              "label": "Build Pipeline Tasarımı",
              "href": "/education/lessons/cicd/build-pipeline",
              "description": "Bağımlılık indirme, derleme ve test adımlarını optimize et."
            },
            {
              "label": "Blue-Green ve Canary Dağıtımlar",
              "href": "/education/lessons/cicd/deployment-strategies",
              "description": "Risk azaltıcı dağıtım stratejilerini kıyasla ve uygula."
            },
            {
              "label": "Kalite Kapıları ve Onay Akışları",
              "href": "/education/lessons/cicd/quality-gates",
              "description": "Manual approval, code coverage ve statik analiz kontrolleri ekle."
            },
            {
              "label": "GitHub Actions ve Azure DevOps Pipeline",
              "href": "/education/lessons/cicd/pipelines/github-actions-azure-devops",
              "description": "GitHub Actions ve Azure DevOps pipeline yapılandırmasını öğren."
            },
            {
              "label": "Automated Testing in CI/CD",
              "href": "/education/lessons/cicd/testing/automated-testing-cicd",
              "description": "CI/CD pipeline ında otomatik test entegrasyonunu uygula."
            },
            {
              "label": "Release Management ve Versioning",
              "href": "/education/lessons/cicd/release/release-management-versioning",
              "description": "Release management ve semantic versioning stratejilerini öğren."
            },
            {
              "label": "Infrastructure as Code (IaC)",
              "href": "/education/lessons/cicd/iac/infrastructure-as-code",
              "description": "Terraform, ARM templates veya Bicep ile IaC uygulamasını öğren."
            },
            {
              "label": "CI/CD Security Best Practices",
              "href": "/education/lessons/cicd/security/cicd-security-best-practices",
              "description": "CI/CD pipeline güvenliği için en iyi pratikleri uygula."
            },
            {
              "label": "Rollback stratejileri",
              "href": "/education/lessons/cicd/rollback/rollback-strategies",
              "description": "Deployment rollback stratejilerini ve otomasyonunu öğren."
            },
            {
              "label": "CI/CD Monitoring ve Alerting",
              "href": "/education/lessons/cicd/monitoring/cicd-monitoring-alerting",
              "description": "CI/CD pipeline monitoring ve alerting mekanizmalarını kavra."
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
