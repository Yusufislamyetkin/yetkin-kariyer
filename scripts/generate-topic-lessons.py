#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
.NET Core 90 konu anlatımı JSON dosyası oluşturucu
"""

import json

# Modül listesi ve konuları
modules_data = [
    {
        "moduleId": "module-03-project-structure",
        "moduleTitle": "Proje Yapısı ve Dependency Injection",
        "topics": [
            {"title": "Proje Yapısı", "slug": "project-structure", "desc": "ASP.NET Core proje yapısını ve dosya organizasyonunu öğren."},
            {"title": "Dependency Injection", "slug": "dependency-injection", "desc": "DI container'ı ve servis kayıtlarını derinlemesine öğren."},
            {"title": "Service Lifetime", "slug": "service-lifetime", "desc": "Singleton, Scoped, Transient lifetime'larını kavra."},
            {"title": "Configuration", "slug": "configuration", "desc": "appsettings.json ve configuration pattern'lerini öğren."},
            {"title": "Startup", "slug": "startup", "desc": "Startup.cs ve Program.cs yapılandırmasını öğren."}
        ]
    },
    {
        "moduleId": "module-04-aspnet-mvc",
        "moduleTitle": "ASP.NET Core MVC",
        "topics": [
            {"title": "MVC Pattern", "slug": "mvc-pattern", "desc": "Model-View-Controller pattern'ini ve ASP.NET Core'da kullanımını öğren."},
            {"title": "Controller", "slug": "controller", "desc": "Controller yapısı, action method'ları ve routing'i öğren."},
            {"title": "View", "slug": "view", "desc": "Razor view engine, layout, partial view ve view component'leri öğren."},
            {"title": "Model Binding", "slug": "model-binding", "desc": "Model binding mekanizması ve validation'ı öğren."},
            {"title": "Routing", "slug": "routing", "desc": "Convention-based ve attribute routing'i öğren."}
        ]
    },
    {
        "moduleId": "module-05-web-api",
        "moduleTitle": "Web API Geliştirme",
        "topics": [
            {"title": "REST API", "slug": "rest-api", "desc": "RESTful API tasarım prensiplerini ve best practice'leri öğren."},
            {"title": "HTTP Methods", "slug": "http-methods", "desc": "GET, POST, PUT, DELETE, PATCH metodlarını ve kullanım senaryolarını öğren."},
            {"title": "API Controller", "slug": "api-controller", "desc": "API Controller yapısı ve action method'larını öğren."},
            {"title": "Response Types", "slug": "response-types", "desc": "JSON, XML ve custom response formatlarını öğren."},
            {"title": "Status Codes", "slug": "status-codes", "desc": "HTTP status code'ları ve doğru kullanımını öğren."}
        ]
    },
    {
        "moduleId": "module-06-middleware",
        "moduleTitle": "Middleware ve Pipeline Yönetimi",
        "topics": [
            {"title": "Middleware Pipeline", "slug": "middleware-pipeline", "desc": "Request pipeline yapısı ve middleware sıralamasını öğren."},
            {"title": "Custom Middleware", "slug": "custom-middleware", "desc": "Özel middleware oluşturma ve kullanımını öğren."},
            {"title": "Request/Response", "slug": "request-response", "desc": "Request ve Response nesnelerini manipüle etmeyi öğren."},
            {"title": "Exception Middleware", "slug": "exception-middleware", "desc": "Global exception handling middleware'i oluşturmayı öğren."},
            {"title": "Ordering", "slug": "middleware-ordering", "desc": "Middleware sıralaması ve best practice'leri öğren."}
        ]
    },
    {
        "moduleId": "module-07-auth",
        "moduleTitle": "Authentication & Authorization",
        "topics": [
            {"title": "Authentication vs Authorization", "slug": "auth-vs-authorization", "desc": "Kimlik doğrulama ve yetkilendirme farklarını öğren."},
            {"title": "JWT", "slug": "jwt", "desc": "JSON Web Token yapısı, oluşturma ve doğrulama işlemlerini öğren."},
            {"title": "Identity", "slug": "identity", "desc": "ASP.NET Core Identity framework'ünü öğren."},
            {"title": "Claims", "slug": "claims", "desc": "Claims-based authentication ve authorization'ı öğren."},
            {"title": "Policies", "slug": "policies", "desc": "Authorization policy'leri ve requirement'ları öğren."}
        ]
    },
    {
        "moduleId": "module-08-logging",
        "moduleTitle": "Logging ve Exception Handling",
        "topics": [
            {"title": "ILogger Interface", "slug": "ilogger-interface", "desc": "ILogger interface'i ve logging abstraction'ını öğren."},
            {"title": "Log Levels", "slug": "log-levels", "desc": "Trace, Debug, Information, Warning, Error, Critical seviyelerini öğren."},
            {"title": "Structured Logging", "slug": "structured-logging", "desc": "Yapılandırılmış logging ve best practice'leri öğren."},
            {"title": "Serilog", "slug": "serilog", "desc": "Serilog kütüphanesi ve sink yapılandırmasını öğren."},
            {"title": "Exception Logging", "slug": "exception-logging", "desc": "Exception logging stratejileri ve error handling'i öğren."}
        ]
    },
    {
        "moduleId": "module-09-configuration",
        "moduleTitle": "Configuration Management",
        "topics": [
            {"title": "Configuration Sources", "slug": "configuration-sources", "desc": "appsettings.json, environment variables, command line gibi kaynakları öğren."},
            {"title": "appsettings.json", "slug": "appsettings-json", "desc": "appsettings.json yapısı ve environment-specific configuration'ı öğren."},
            {"title": "Environment Variables", "slug": "environment-variables", "desc": "Environment variable'ları ve kullanımını öğren."},
            {"title": "Options Pattern", "slug": "options-pattern", "desc": "Options pattern ve strongly-typed configuration'ı öğren."},
            {"title": "IConfiguration", "slug": "iconfiguration", "desc": "IConfiguration interface'i ve configuration okuma işlemlerini öğren."}
        ]
    },
    {
        "moduleId": "module-10-testing",
        "moduleTitle": "Unit Test ve Integration Test",
        "topics": [
            {"title": "Unit Testing", "slug": "unit-testing", "desc": "Unit test yazma prensipleri ve best practice'leri öğren."},
            {"title": "xUnit", "slug": "xunit", "desc": "xUnit test framework'ünü ve test yazma tekniklerini öğren."},
            {"title": "Moq", "slug": "moq", "desc": "Moq mocking framework'ünü ve dependency mocking'i öğren."},
            {"title": "Integration Testing", "slug": "integration-testing", "desc": "Integration test yazma ve WebApplicationFactory kullanımını öğren."},
            {"title": "Test Coverage", "slug": "test-coverage", "desc": "Test coverage ölçümü ve analiz araçlarını öğren."}
        ]
    },
    {
        "moduleId": "module-11-performance",
        "moduleTitle": "Performans ve Caching Teknikleri",
        "topics": [
            {"title": "Caching", "slug": "caching", "desc": "Caching stratejileri ve kullanım senaryolarını öğren."},
            {"title": "Memory Cache", "slug": "memory-cache", "desc": "IMemoryCache ve in-memory caching'i öğren."},
            {"title": "Distributed Cache", "slug": "distributed-cache", "desc": "IDistributedCache ve Redis kullanımını öğren."},
            {"title": "Response Caching", "slug": "response-caching", "desc": "Response caching middleware'i ve cache headers'ı öğren."},
            {"title": "Performance Monitoring", "slug": "performance-monitoring", "desc": "Performance monitoring araçları ve profiling tekniklerini öğren."}
        ]
    },
    {
        "moduleId": "module-12-async",
        "moduleTitle": "Asenkron Programlama (Async/Await)",
        "topics": [
            {"title": "Async/Await", "slug": "async-await", "desc": "async/await pattern'i ve asenkron programlama temellerini öğren."},
            {"title": "Task", "slug": "task", "desc": "Task sınıfı ve task-based asenkron programlamayı öğren."},
            {"title": "Task<T>", "slug": "task-generic", "desc": "Task<T> ve değer döndüren asenkron metotları öğren."},
            {"title": "ConfigureAwait", "slug": "configureawait", "desc": "ConfigureAwait ve synchronization context'i öğren."},
            {"title": "Deadlock Prevention", "slug": "deadlock-prevention", "desc": "Deadlock'ları önleme teknikleri ve best practice'leri öğren."}
        ]
    },
    {
        "moduleId": "module-13-docker",
        "moduleTitle": "Docker ile Containerization",
        "topics": [
            {"title": "Docker Basics", "slug": "docker-basics", "desc": "Docker temelleri, container ve image kavramlarını öğren."},
            {"title": "Dockerfile", "slug": "dockerfile", "desc": "Dockerfile yazma ve .NET Core uygulamalarını containerize etmeyi öğren."},
            {"title": "Docker Compose", "slug": "docker-compose", "desc": "Docker Compose ile multi-container uygulamaları yönetmeyi öğren."},
            {"title": "Containerization", "slug": "containerization", "desc": "Containerization stratejileri ve best practice'leri öğren."},
            {"title": "Image Management", "slug": "image-management", "desc": "Docker image oluşturma, tag'leme ve registry yönetimini öğren."}
        ]
    },
    {
        "moduleId": "module-14-cicd",
        "moduleTitle": "CI/CD ve Deployment Süreçleri",
        "topics": [
            {"title": "CI/CD Concepts", "slug": "cicd-concepts", "desc": "Continuous Integration ve Continuous Deployment kavramlarını öğren."},
            {"title": "GitHub Actions", "slug": "github-actions", "desc": "GitHub Actions ile CI/CD pipeline'ı oluşturmayı öğren."},
            {"title": "Azure DevOps", "slug": "azure-devops", "desc": "Azure DevOps Pipelines ile deployment süreçlerini öğren."},
            {"title": "Deployment Strategies", "slug": "deployment-strategies", "desc": "Blue-green, canary, rolling deployment stratejilerini öğren."},
            {"title": "Pipeline", "slug": "pipeline", "desc": "CI/CD pipeline yapısı ve best practice'leri öğren."}
        ]
    },
    {
        "moduleId": "module-15-microservices",
        "moduleTitle": "Microservices Mimarisi",
        "topics": [
            {"title": "Microservices Architecture", "slug": "microservices-architecture", "desc": "Microservices mimarisi ve monolith'ten farklarını öğren."},
            {"title": "Service Communication", "slug": "service-communication", "desc": "Service-to-service communication pattern'lerini öğren."},
            {"title": "API Gateway", "slug": "api-gateway", "desc": "API Gateway pattern'i ve Ocelot kullanımını öğren."},
            {"title": "Service Discovery", "slug": "service-discovery", "desc": "Service discovery mekanizmaları ve Consul kullanımını öğren."},
            {"title": "Distributed Systems", "slug": "distributed-systems", "desc": "Distributed systems zorlukları ve çözümlerini öğren."}
        ]
    },
    {
        "moduleId": "module-16-libraries",
        "moduleTitle": "Kütüphaneler",
        "topics": [
            {"title": "NuGet Packages", "slug": "nuget-packages", "desc": "NuGet package manager ve package kullanımını öğren."},
            {"title": "Package Management", "slug": "package-management", "desc": "Package versioning, dependency management ve restore işlemlerini öğren."},
            {"title": "Third-party Libraries", "slug": "third-party-libraries", "desc": "Popüler third-party kütüphaneleri ve kullanım senaryolarını öğren."},
            {"title": "Library Selection", "slug": "library-selection", "desc": "Kütüphane seçim kriterleri ve best practice'leri öğren."},
            {"title": "Versioning", "slug": "versioning", "desc": "Semantic versioning ve package version yönetimini öğren."}
        ]
    },
    {
        "moduleId": "module-17-ef-core",
        "moduleTitle": "Entity Framework Core İleri Seviye",
        "topics": [
            {"title": "Entity Framework Core", "slug": "ef-core", "desc": "EF Core temelleri ve ORM kavramlarını öğren."},
            {"title": "DbContext", "slug": "dbcontext", "desc": "DbContext yapısı ve DbSet kullanımını öğren."},
            {"title": "Migrations", "slug": "migrations", "desc": "Code First migrations ve database schema yönetimini öğren."},
            {"title": "LINQ Queries", "slug": "linq-queries", "desc": "LINQ sorguları ve query optimization tekniklerini öğren."},
            {"title": "Relationships", "slug": "relationships", "desc": "Entity relationships, navigation properties ve foreign keys'i öğren."}
        ]
    },
    {
        "moduleId": "module-18-docker-k8s",
        "moduleTitle": "Docker ve Kubernetes",
        "topics": [
            {"title": "Kubernetes Basics", "slug": "kubernetes-basics", "desc": "Kubernetes temelleri, cluster ve node kavramlarını öğren."},
            {"title": "Pods", "slug": "pods", "desc": "Pod yapısı, container orchestration ve pod lifecycle'ı öğren."},
            {"title": "Services", "slug": "services", "desc": "Kubernetes Services ve service discovery'yi öğren."},
            {"title": "Deployments", "slug": "deployments", "desc": "Deployment yapısı, replica sets ve rolling updates'i öğren."},
            {"title": "Helm Charts", "slug": "helm-charts", "desc": "Helm package manager ve chart yapısını öğren."}
        ]
    }
]

def create_topic_structure(module_id, topic_title, topic_slug, description, module_title):
    """Bir konu için temel yapı oluştur"""
    level_map = {
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
    }
    
    module_prefix = module_id.split("-")[0] + "-" + module_id.split("-")[1]
    level = level_map.get(module_prefix, "Orta")
    
    # Slug oluştur
    if "dotnet-core" in topic_slug or "architecture" in topic_slug:
        href = f"/education/lessons/{topic_slug}"
    else:
        # Modül slug'ından path oluştur
        module_slug = module_id.replace("module-", "").replace("-", "/")
        href = f"/education/lessons/{module_slug}/{topic_slug}"
    
    return {
        "label": f"{topic_title} Nedir?" if "Nedir" not in topic_title else topic_title,
        "href": href,
        "description": description,
        "estimatedDurationMinutes": 35,
        "level": level,
        "keyTakeaways": [
            f"{topic_title} kavramını ve temel kullanımını öğreneceksin.",
            f"{module_title} modülünde {topic_title} önemli bir rol oynar.",
            "Pratik örneklerle konuyu pekiştireceksin."
        ],
        "sections": [
            {
                "id": f"{topic_slug}-overview",
                "title": f"{topic_title} Temelleri",
                "summary": f"{topic_title} kavramını ve temel kullanımını öğren.",
                "content": [
                    {
                        "type": "text",
                        "body": f"{description} Bu konu, {module_title} modülünün önemli bir parçasıdır ve gerçek dünya uygulamalarında sıklıkla kullanılır."
                    },
                    {
                        "type": "code",
                        "language": "csharp",
                        "code": f"// {topic_title} örnek kullanımı\npublic class Example\n{{\n    // Örnek kod buraya gelecek\n}}",
                        "explanation": f"{topic_title} kullanımına dair temel örnek."
                    },
                    {
                        "type": "callout",
                        "variant": "tip",
                        "title": "İpucu",
                        "body": f"{topic_title} konusunda dikkat edilmesi gereken önemli noktalar."
                    }
                ]
            }
        ],
        "checkpoints": [
            {
                "id": f"checkpoint-{topic_slug}",
                "question": f"{topic_title} ile ilgili temel soru?",
                "options": ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
                "answer": "Seçenek 1",
                "rationale": "Açıklama buraya gelecek."
            }
        ],
        "resources": [],
        "practice": []
    }

# Mevcut JSON'u oku
with open('data/topic-lessons/dotnet-core-topics.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Yeni modülleri ekle
for module_data in modules_data:
    topics = []
    for topic_data in module_data["topics"]:
        topic = create_topic_structure(
            module_data["moduleId"],
            topic_data["title"],
            topic_data["slug"],
            topic_data["desc"],
            module_data["moduleTitle"]
        )
        topics.append(topic)
    
    new_module = {
        "moduleId": module_data["moduleId"],
        "moduleTitle": module_data["moduleTitle"],
        "topics": topics
    }
    
    data["modules"].append(new_module)

# Toplam konu sayısını güncelle
total_topics = sum(len(m["topics"]) for m in data["modules"])
data["totalTopics"] = total_topics

# JSON'u yaz
with open('data/topic-lessons/dotnet-core-topics.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ {len(modules_data)} modül eklendi!")
print(f"✅ Toplam {total_topics} konu oluşturuldu!")

