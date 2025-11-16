-- Module 17: Entity Framework Core Ä°leri Seviye - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-17-entity-framework-core",
          "title": "Entity Framework Core İleri Seviye",
          "summary": "EF Core ile veritabanı işlemlerini optimize et, migration stratejilerini yönet ve performans sorunlarını çöz.",
          "durationMinutes": 180,
          "objectives": [
            "EF Core migration stratejilerini ve veri seed işlemlerini yönetmek",
            "Change tracking, eager loading ve lazy loading kavramlarını uygulamak",
            "Query performansını optimize etmek için AsNoTracking ve compiled queries kullanmak",
            "Raw SQL ve stored procedure entegrasyonlarını yapmak",
            "Unit of Work ve Repository pattern lerini EF Core ile uygulamak"
          ],
          "activities": [
            {
              "id": "activity-ef-migrations",
              "title": "Migration Stratejileri",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Code-first yaklaşımıyla migration oluştur, veri dönüşümlerini yönet ve rollback senaryolarını uygula."
            },
            {
              "id": "activity-ef-change-tracking",
              "title": "Change Tracking Optimizasyonu",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": "AsNoTracking kullanarak read-only sorguları optimize et ve change tracking maliyetlerini azalt."
            },
            {
              "id": "activity-ef-eager-loading",
              "title": "Eager Loading Stratejileri",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Include ve ThenInclude ile ilişkili verileri tek sorguda yükle ve N+1 problem ini çöz."
            },
            {
              "id": "activity-ef-compiled-queries",
              "title": "Compiled Queries ile Performans",
              "type": "coding",
              "estimatedMinutes": 20,
              "prompt": "Sık kullanılan sorguları compile ederek performansı artır."
            },
            {
              "id": "activity-ef-raw-sql",
              "title": "Raw SQL ve Stored Procedures",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": "FromSqlRaw ve ExecuteSqlRaw ile raw SQL sorguları çalıştır."
            },
            {
              "id": "activity-ef-repository-pattern",
              "title": "Repository Pattern Uygulaması",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Generic repository pattern ile veri erişim katmanını soyutla."
            }
          ],
          "checkpoints": [
            {
              "id": "checkpoint-ef-notracking",
              "title": "AsNoTracking Kullanım Senaryosu",
              "description": "Hangi durumlarda AsNoTracking kullanılmalıdır?",
              "tasks": [
                {
                  "id": "task-ef-notracking-analysis",
                  "description": "Read-only sorgular için AsNoTracking kullanımını analiz et ve performans farkını ölç."
                }
              ],
              "successCriteria": [
                "AsNoTracking in ne zaman kullanılacağını açıklayabilirsin",
                "Change tracking maliyetini ölçebilirsin"
              ],
              "estimatedMinutes": 20
            }
          ],
          "learnLink": {
            "label": "EF Core Öğren",
            "href": "/education/courses?search=Entity%20Framework%20Core",
            "description": "EF Core best practice leri ve performans optimizasyon tekniklerini incele."
          },
          "relatedTopics": [
            {
              "label": "EF Core Migration Yönetimi",
              "href": "/education/lessons/ef-core/migrations/overview",
              "description": "Code-first migration stratejilerini ve veri dönüşümlerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Migration dosyalarını oluşturma ve uygulama",
                "Veri migration senaryolarını yönetme",
                "Rollback stratejileri"
              ]
            },
            {
              "label": "Change Tracking ve Performans",
              "href": "/education/lessons/ef-core/change-tracking/optimization",
              "description": "Change tracking maliyetlerini azaltma tekniklerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta"
            },
            {
              "label": "Eager Loading ve N+1 Problemi",
              "href": "/education/lessons/ef-core/loading-strategies/eager-loading",
              "description": "Include ve ThenInclude ile ilişkili verileri optimize et.",
              "estimatedDurationMinutes": 50,
              "level": "Orta"
            },
            {
              "label": "Lazy Loading ve Explicit Loading",
              "href": "/education/lessons/ef-core/loading-strategies/lazy-explicit-loading",
              "description": "Lazy loading ve explicit loading stratejilerini öğren."
            },
            {
              "label": "Compiled Queries ve Performance",
              "href": "/education/lessons/ef-core/performance/compiled-queries",
              "description": "Compiled queries ile query performansını optimize et."
            },
            {
              "label": "Raw SQL ve Stored Procedures",
              "href": "/education/lessons/ef-core/raw-sql/stored-procedures",
              "description": "Raw SQL sorguları ve stored procedure kullanımını öğren."
            },
            {
              "label": "Unit of Work ve Repository Pattern",
              "href": "/education/lessons/ef-core/patterns/unit-of-work-repository",
              "description": "Unit of Work ve Repository pattern lerini EF Core ile uygula."
            },
            {
              "label": "EF Core Interceptors",
              "href": "/education/lessons/ef-core/interceptors/ef-core-interceptors",
              "description": "EF Core interceptors ile query ve command interception ı öğren."
            },
            {
              "label": "Database Seeding ve Initialization",
              "href": "/education/lessons/ef-core/seeding/database-seeding-initialization",
              "description": "Database seeding ve initialization stratejilerini uygula."
            },
            {
              "label": "EF Core Value Converters",
              "href": "/education/lessons/ef-core/value-converters/ef-core-value-converters",
              "description": "Value converters ile custom type mapping i öğren."
            },
            {
              "label": "EF Core Query Filters",
              "href": "/education/lessons/ef-core/query-filters/ef-core-query-filters",
              "description": "Global query filters ile soft delete ve multi-tenancy yi uygula."
            },
            {
              "label": "EF Core Performance Best Practices",
              "href": "/education/lessons/ef-core/best-practices/ef-core-performance-best-practices",
              "description": "EF Core performance optimization için en iyi pratikleri öğren."
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
