-- Module 18: Docker ve Kubernetes - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-18-docker-kubernetes",
          "title": "Docker ve Kubernetes",
          "summary": "Containerization, Docker Compose, Kubernetes deployment ve orchestration stratejileri.",
          "durationMinutes": 150,
          "objectives": [
            "Docker container ları oluşturup yönetmek",
            "Docker Compose ile multi-container uygulamaları çalıştırmak",
            "Kubernetes temel kavramlarını (Pod, Service, Deployment) anlamak",
            ".NET Core uygulamalarını Kubernetes e deploy etmek",
            "Helm charts ile deployment ları yönetmek"
          ],
          "activities": [
            {
              "id": "activity-dockerfile",
              "title": "Dockerfile Oluşturma",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": ".NET Core uygulaması için optimize edilmiş Dockerfile yaz."
            },
            {
              "id": "activity-docker-compose",
              "title": "Docker Compose Yapılandırması",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Multi-container uygulama için docker-compose.yml oluştur."
            },
            {
              "id": "activity-kubernetes-basics",
              "title": "Kubernetes Temelleri",
              "type": "coding",
              "estimatedMinutes": 35,
              "prompt": "Pod, Service ve Deployment YAML dosyalarını oluştur."
            },
            {
              "id": "activity-helm-charts",
              "title": "Helm Charts",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Helm chart oluştur ve .NET Core uygulamasını deploy et."
            }
          ],
          "learnLink": {
            "label": "Docker & K8s Öğren",
            "href": "/education/courses?search=Docker",
            "description": "Containerization ve orchestration tekniklerini incele."
          },
          "relatedTopics": [
            {
              "label": "Docker Temelleri",
              "href": "/education/lessons/docker/basics/containers",
              "description": "Docker container ları oluşturma ve yönetme tekniklerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta"
            },
            {
              "label": "Kubernetes Deployment",
              "href": "/education/lessons/kubernetes/deployment/basics",
              "description": "Kubernetes e .NET Core uygulaması deploy etme sürecini öğren.",
              "estimatedDurationMinutes": 50,
              "level": "İleri"
            },
            {
              "label": "Helm Charts",
              "href": "/education/lessons/kubernetes/helm/charts",
              "description": "Helm ile Kubernetes deployment larını yönet.",
              "estimatedDurationMinutes": 45,
              "level": "İleri"
            },
            {
              "label": "Kubernetes Pods ve Services",
              "href": "/education/lessons/kubernetes/pods-services/kubernetes-pods-services",
              "description": "Kubernetes Pods ve Services kavramlarını öğren."
            },
            {
              "label": "Kubernetes Deployments ve ReplicaSets",
              "href": "/education/lessons/kubernetes/deployments/kubernetes-deployments-replicasets",
              "description": "Kubernetes Deployments ve ReplicaSets yönetimini öğren."
            },
            {
              "label": "Kubernetes ConfigMaps ve Secrets",
              "href": "/education/lessons/kubernetes/configmaps-secrets/kubernetes-configmaps-secrets",
              "description": "Kubernetes ConfigMaps ve Secrets yönetimini öğren."
            },
            {
              "label": "Kubernetes Ingress ve Load Balancing",
              "href": "/education/lessons/kubernetes/ingress/kubernetes-ingress-load-balancing",
              "description": "Kubernetes Ingress ve load balancing yapılandırmasını öğren."
            },
            {
              "label": "Kubernetes Health Checks ve Probes",
              "href": "/education/lessons/kubernetes/health-checks/kubernetes-health-checks-probes",
              "description": "Kubernetes health checks ve probes yapılandırmasını öğren."
            },
            {
              "label": "Kubernetes Resource Management",
              "href": "/education/lessons/kubernetes/resources/kubernetes-resource-management",
              "description": "Kubernetes resource limits ve requests yönetimini öğren."
            },
            {
              "label": "Kubernetes Namespaces ve RBAC",
              "href": "/education/lessons/kubernetes/security/kubernetes-namespaces-rbac",
              "description": "Kubernetes namespaces ve RBAC yapılandırmasını öğren."
            },
            {
              "label": "Kubernetes Monitoring ve Logging",
              "href": "/education/lessons/kubernetes/monitoring/kubernetes-monitoring-logging",
              "description": "Kubernetes monitoring ve logging stratejilerini öğren."
            },
            {
              "label": "Kubernetes Best Practices",
              "href": "/education/lessons/kubernetes/best-practices/kubernetes-best-practices",
              "description": "Kubernetes deployment ve yönetim için en iyi pratikleri öğren."
            }
          ]
        }
      ],
      "resources": [
        {
          "id": "resource-microsoft-docs",
          "title": "Microsoft Learn - .NET Documentation",
          "url": "https://learn.microsoft.com/dotnet/",
          "type": "documentation",
          "description": ".NET ekosisteminin resmi dokümantasyonu."
        },
        {
          "id": "resource-aspnet-core",
          "title": "ASP.NET Core Fundamentals",
          "url": "https://learn.microsoft.com/aspnet/core/fundamentals/",
          "type": "documentation",
          "description": "Middleware, dependency injection ve konfigürasyon gibi temel konseptler."
        },
        {
          "id": "resource-dotnet-podcast",
          "title": "The .NET Show Podcast",
          "url": "https://dotnet.microsoft.com/en-us/podcasts",
          "type": "video",
          "description": ".NET dünyasındaki güncel gelişmeleri takip et."
        },
        {
          "id": "resource-github-templates",
          "title": "Clean Architecture Template",
          "url": "https://github.com/jasontaylordev/CleanArchitecture",
          "type": "repository",
          "description": "Katmanlı çözüm yapısı ve best practice örnekleri."
        }
      ],
      "capstone": {
        "title": "Mikroservis Tabanlı Görev Yönetimi Platformu",
        "description": "Kullanıcı yönetimi, görev planlama ve raporlama servislerinden oluşan, containerize edilmiş bir platform tasarla.",
        "problemStatement": "Farklı ekiplerin görevlerini yönettiği platform ölçek sorunları yaşıyor; .NET Core tabanlı mikroservis mimarisiyle yeniden inşa edilmesi isteniyor.",
        "deliverables": [
          "Servis sınırlarını tanımlayan mimari diyagram",
          "ASP.NET Core Web API, Identity ve background worker servis kodları",
          "Docker Compose veya Kubernetes manifestleri",
          "CI/CD pipeline tanımı ve kalite raporu"
        ],
        "evaluationCriteria": [
          {
            "id": "capstone-architecture",
            "dimension": "Mimari Tasarım",
            "levels": [
              {
                "label": "Başlangıç",
                "description": "Servis sınırları belirsiz, bağımlılıklar gevşek tanımlanmış."
              },
              {
                "label": "Yetkin",
                "description": "Servisler net ayrılmış, paylaşılan kontratlar dokümante edilmiş."
              },
              {
                "label": "Uzman",
                "description": "Event-driven akışlar, gözlemlenebilirlik ve dayanıklılık desenleri uygulanmış."
              }
            ]
          },
          {
            "id": "capstone-operations",
            "dimension": "Operasyonel Hazırlık",
            "levels": [
              {
                "label": "Başlangıç",
                "description": "Loglama ve hata yönetimi sınırlı."
              },
              {
                "label": "Yetkin",
                "description": "Observability ve health check uç noktaları mevcut."
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
