import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate detailed Module 5 content with 4 phases
 */

interface Phase {
  id: string;
  title: string;
  summary: string;
  content: any[];
}

interface Lesson {
  label: string;
  href: string;
  description: string;
  estimatedDurationMinutes: number;
  level: string;
  keyTakeaways: string[];
  sections: Phase[];
  checkpoints: any[];
  resources: any[];
  practice: any[];
}

function createPhase1Content(lessonTitle: string, topicDescription: string, moduleTitle: string): any[] {
  return [
    {
      type: "text",
      body: `${topicDescription} ${lessonTitle}, modern web uygulamalarında veri alışverişi için kritik bir rol oynar. Bu fazda, ${lessonTitle} konusunun temel tanımını, ne olduğunu ve neden önemli olduğunu öğreneceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} nedir? Bu kavram, web API'lerinin nasıl çalıştığını ve nasıl tasarlandığını anlamak için temel bir yapı taşıdır. ${lessonTitle} konusunu derinlemesine anlamak, profesyonel seviyede API geliştirme yapabilmek için gereklidir.`
    },
    {
      type: "list",
      ordered: true,
      items: [
        `${lessonTitle} kavramının tanımı ve temel özellikleri`,
        `${lessonTitle} neden kullanılır ve hangi problemleri çözer`,
        `${lessonTitle} konusunun web API geliştirmedeki yeri ve önemi`,
        `Temel terminoloji ve kavramlar`,
        `Diğer yaklaşımlarla karşılaştırma ve farklar`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Temel Kavram Örneği\n// Bu örnek, ${lessonTitle} konusunun temel kullanımını gösterir\n\nusing Microsoft.AspNetCore.Mvc;\n\nnamespace WebAPI.Examples\n{\n    // ${lessonTitle} konusunun temel uygulaması\n    public class BasicExample\n    {\n        // Temel kavramlar burada açıklanacak\n    }\n}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun temel kullanımını gösterir. Kodun her satırı, konunun temel kavramlarını anlamanıza yardımcı olacak şekilde açıklanmıştır.`
    },
    {
      type: "callout",
      variant: "info",
      title: "Önemli Kavram",
      body: `${lessonTitle} konusunu öğrenirken dikkat etmeniz gereken en önemli nokta, bu konunun web API geliştirmedeki kritik rolüdür. Bu kavramı iyi anlamak, daha iyi API'ler tasarlamanızı sağlar.`
    }
  ];
}

function createPhase2Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  const slugBase = lessonSlug.replace(/\//g, "-");
  
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun pratikte nasıl kullanıldığını adım adım öğreneceksin. ${lessonTitle} kullanarak gerçek bir uygulama geliştirmenin tüm adımlarını göreceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} nasıl kullanılır? Bu sorunun cevabı, ${moduleTitle} modülünün en önemli kısmıdır. Pratik örnekler ve kod snippet'leri ile konuyu uygulamalı olarak öğreneceksin.`
    },
    {
      type: "list",
      ordered: true,
      items: [
        `${lessonTitle} kullanımının adım adım açıklaması`,
        `ASP.NET Core'da ${lessonTitle} implementasyonu`,
        `Gerekli paketlerin kurulumu ve yapılandırma`,
        `Temel kullanım örnekleri ve kod yazımı`,
        `Yaygın kullanım senaryoları ve pattern'ler`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Pratik Kullanım Örneği\n// Bu örnek, ${lessonTitle} konusunun gerçek bir projede nasıl kullanıldığını gösterir\n\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.AspNetCore.Builder;\nusing Microsoft.Extensions.DependencyInjection;\n\nnamespace WebAPI.Examples\n{\n    public class Startup\n    {\n        public void ConfigureServices(IServiceCollection services)\n        {\n            // ${lessonTitle} için servis kayıtları\n            services.AddControllers();\n            \n            // ${lessonTitle} yapılandırması\n            // Gerekli ayarlar burada yapılır\n        }\n        \n        public void Configure(IApplicationBuilder app)\n        {\n            // ${lessonTitle} middleware'leri\n            app.UseRouting();\n            app.UseEndpoints(endpoints =>\n            {\n                endpoints.MapControllers();\n            });\n        }\n    }\n    \n    [ApiController]\n    [Route("api/[controller]")]\n    public class ExampleController : ControllerBase\n    {
        // ${lessonTitle} kullanım örnekleri\n        [HttpGet]\n        public IActionResult Get()\n        {\n            // ${lessonTitle} implementasyonu\n            return Ok(new { message = "${lessonTitle} örneği" });\n        }\n    }\n}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun ASP.NET Core uygulamasında nasıl kullanıldığını gösterir. Startup.cs'de gerekli yapılandırmaları ve Controller'da kullanımını görebilirsiniz.`
    },
    {
      type: "callout",
      variant: "tip",
      title: "Pratik İpucu",
      body: `${lessonTitle} konusunu öğrenirken, kodları kendiniz yazarak denemek çok önemlidir. Sadece okumak yerine, her örneği çalıştırıp sonuçları gözlemleyin.`
    }
  ];
}

function createPhase3Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun ileri seviye kullanımlarını ve best practice'lerini öğreneceksin. Profesyonel seviyede API geliştirme yapmak için gerekli olan gelişmiş teknikleri ve optimizasyon stratejilerini göreceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} konusunda ileri seviye teknikler, daha performanslı, güvenli ve maintainable kod yazmanızı sağlar. Bu fazda, industry-standard yaklaşımları ve Microsoft'un önerdiği best practice'leri öğreneceksin.`
    },
    {
      type: "list",
      ordered: false,
      items: [
        `${lessonTitle} için best practice'ler ve önerilen yaklaşımlar`,
        `Performans optimizasyon teknikleri ve ipuçları`,
        `Güvenlik konuları ve dikkat edilmesi gerekenler`,
        `Yaygın hatalar ve bunlardan kaçınma yöntemleri`,
        `İleri seviye pattern'ler ve design pattern'ler`,
        `Testing stratejileri ve unit test yazımı`,
        `Error handling ve exception management`,
        `Logging ve monitoring yaklaşımları`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - İleri Seviye Kullanım Örneği\n// Bu örnek, ${lessonTitle} konusunun ileri seviye tekniklerini gösterir\n\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.Extensions.Logging;\nusing System;\nusing System.Threading.Tasks;\n\nnamespace WebAPI.Advanced\n{\n    [ApiController]\n    [Route("api/v1/[controller]")]\n    public class AdvancedController : ControllerBase\n    {\n        private readonly ILogger<AdvancedController> _logger;\n        \n        public AdvancedController(ILogger<AdvancedController> logger)\n        {\n            _logger = logger;\n        }\n        \n        // İleri seviye ${lessonTitle} implementasyonu\n        [HttpGet("{id}")]\n        [ProducesResponseType(200)]\n        [ProducesResponseType(404)]\n        [ProducesResponseType(500)]\n        public async Task<IActionResult> GetAdvanced(int id)\n        {\n            try\n            {\n                _logger.LogInformation("${lessonTitle} - Advanced operation started for ID: {Id}", id);\n                \n                // İleri seviye ${lessonTitle} işlemleri\n                // - Async/await pattern kullanımı\n                // - Proper error handling\n                // - Logging ve monitoring\n                // - Response caching\n                // - Rate limiting\n                \n                return Ok(new { id, message = "Advanced ${lessonTitle} implementation" });\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, "Error in ${lessonTitle} operation");\n                return StatusCode(500, new { error = "Internal server error" });\n            }\n        }\n    }\n}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun ileri seviye kullanımını gösterir. Async/await pattern, proper error handling, logging, ve response attributes gibi best practice'leri içerir.`
    },
    {
      type: "callout",
      variant: "warning",
      title: "Dikkat Edilmesi Gerekenler",
      body: `${lessonTitle} konusunda ileri seviye teknikler kullanırken, kodun okunabilirliğini ve maintainability'sini korumak çok önemlidir. Aşırı karmaşık çözümlerden kaçının.`
    }
  ];
}

function createPhase4Content(lessonTitle: string, topicDescription: string, moduleTitle: string, lessonSlug: string): any[] {
  return [
    {
      type: "text",
      body: `Bu fazda, ${lessonTitle} konusunun gerçek dünya senaryolarında nasıl kullanıldığını göreceksin. Endüstri standardı uygulamalarda ${lessonTitle} konusunun nasıl implement edildiğini, gerçek problemlerin nasıl çözüldüğünü ve troubleshooting tekniklerini öğreneceksin.`
    },
    {
      type: "text",
      body: `${lessonTitle} konusunu gerçek bir projede kullanırken karşılaşabileceğiniz senaryolar, çözüm yöntemleri ve best practice'ler bu fazda detaylı olarak açıklanmaktadır. Case study'ler ve gerçek dünya örnekleri ile konuyu pekiştireceksin.`
    },
    {
      type: "list",
      ordered: false,
      items: [
        `Gerçek dünya projelerinde ${lessonTitle} kullanım senaryoları`,
        `Enterprise seviyesinde ${lessonTitle} implementasyonu`,
        `Scalability ve performance konuları`,
        `Troubleshooting ve debugging teknikleri`,
        `Common issues ve çözümleri`,
        `Integration patterns ve microservices mimarisi`,
        `Deployment ve production considerations`,
        `Monitoring ve analytics yaklaşımları`
      ]
    },
    {
      type: "code",
      language: "csharp",
      code: `// ${lessonTitle} - Gerçek Dünya Senaryosu\n// Bu örnek, ${lessonTitle} konusunun production ortamında nasıl kullanıldığını gösterir\n\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.Extensions.Logging;\nusing Microsoft.Extensions.Caching.Memory;\nusing System;\nusing System.Threading.Tasks;\n\nnamespace WebAPI.Production\n{\n    [ApiController]\n    [Route("api/[controller]")]\n    public class ProductionController : ControllerBase\n    {\n        private readonly ILogger<ProductionController> _logger;\n        private readonly IMemoryCache _cache;\n        \n        public ProductionController(\n            ILogger<ProductionController> logger,\n            IMemoryCache cache)\n        {\n            _logger = logger;\n            _cache = cache;\n        }\n        \n        // Production-ready ${lessonTitle} implementasyonu\n        [HttpGet("data/{key}")]\n        [ResponseCache(Duration = 300)]\n        public async Task<IActionResult> GetProductionData(string key)\n        {\n            // Cache kontrolü\n            if (_cache.TryGetValue(key, out var cachedData))\n            {\n                _logger.LogInformation("Cache hit for key: {Key}", key);\n                return Ok(cachedData);\n            }\n            \n            try\n            {\n                // Gerçek dünya senaryosu: Database'den veri çekme\n                // ${lessonTitle} konusunun production'da kullanımı\n                \n                var data = await FetchDataFromDatabase(key);\n                \n                // Cache'e kaydet\n                _cache.Set(key, data, TimeSpan.FromMinutes(5));\n                \n                _logger.LogInformation("Data fetched and cached for key: {Key}", key);\n                \n                return Ok(data);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, "Error fetching data for key: {Key}", key);\n                return StatusCode(500, new { \n                    error = "An error occurred",\n                    message = "Please try again later" \n                });\n            }\n        }\n        \n        private async Task<object> FetchDataFromDatabase(string key)\n        {\n            // Simulated database operation\n            await Task.Delay(100);\n            return new { key, value = "Production data" };\n        }\n    }\n}`,
      explanation: `Bu kod örneği, ${lessonTitle} konusunun production ortamında nasıl kullanıldığını gösterir. Caching, error handling, logging, ve async operations gibi gerçek dünya senaryolarında gerekli olan tüm özellikleri içerir.`
    },
    {
      type: "callout",
      variant: "info",
      title: "Gerçek Dünya Senaryosu",
      body: `Bu örnek, ${lessonTitle} konusunun gerçek bir production uygulamasında nasıl kullanıldığını gösterir. Bu tür senaryolar, konuyu daha iyi anlamanızı ve profesyonel seviyede uygulama geliştirmenizi sağlar.`
    },
    {
      type: "text",
      body: `Troubleshooting: ${lessonTitle} konusunda karşılaşabileceğiniz yaygın problemler ve çözümleri:\n\n1. **Performans Problemleri**: Caching stratejileri, async operations kullanımı\n2. **Güvenlik Sorunları**: Authentication ve authorization kontrolü\n3. **Hata Yönetimi**: Proper exception handling ve error responses\n4. **Scalability**: Load balancing ve distributed systems yaklaşımları\n\nBu problemleri çözmek için yukarıdaki kod örneğinde gösterilen pattern'leri kullanabilirsiniz.`
    }
  ];
}

function createDetailedLesson(
  lessonTitle: string,
  lessonSlug: string,
  description: string,
  moduleTitle: string,
  level: string = "Orta"
): Lesson {
  const slugBase = lessonSlug.replace(/\//g, "-");
  
  return {
    label: lessonTitle,
    href: `/education/lessons/${lessonSlug}`,
    description: `${description} Bu ders, ${moduleTitle} modülünün kapsamlı bir parçasıdır ve gerçek dünya uygulamalarında pratik kullanım senaryolarını içerir.`,
    estimatedDurationMinutes: 60,
    level,
    keyTakeaways: [
      `${lessonTitle} konusunun ne olduğunu ve neden önemli olduğunu öğreneceksin.`,
      `${lessonTitle} konusunun nasıl kullanıldığını pratik örneklerle göreceksin.`,
      `${lessonTitle} için best practice'leri ve ileri seviye teknikleri öğreneceksin.`,
      `Gerçek dünya senaryolarında ${lessonTitle} konusunun nasıl uygulandığını göreceksin.`,
      `Troubleshooting ve debugging tekniklerini öğreneceksin.`
    ],
    sections: [
      {
        id: `${slugBase}-faz-1-tanim`,
        title: "Faz 1: Tanım ve Temel Kavramlar",
        summary: `${lessonTitle} konusunun tanımı, ne olduğu, neden kullanıldığı ve temel kavramları.`,
        content: createPhase1Content(lessonTitle, description, moduleTitle)
      },
      {
        id: `${slugBase}-faz-2-kullanim`,
        title: "Faz 2: Nasıl Kullanılır",
        summary: `${lessonTitle} konusunun pratikte nasıl kullanıldığı, adım adım implementasyon ve kod örnekleri.`,
        content: createPhase2Content(lessonTitle, description, moduleTitle, lessonSlug)
      },
      {
        id: `${slugBase}-faz-3-ileri-seviye`,
        title: "Faz 3: İleri Seviye ve Best Practices",
        summary: `${lessonTitle} konusunun ileri seviye kullanımları, best practice'ler, optimizasyon teknikleri ve yaygın hatalar.`,
        content: createPhase3Content(lessonTitle, description, moduleTitle, lessonSlug)
      },
      {
        id: `${slugBase}-faz-4-gercek-dunya`,
        title: "Faz 4: Gerçek Dünya Uygulamaları",
        summary: `${lessonTitle} konusunun gerçek dünya senaryolarında kullanımı, case study'ler, troubleshooting ve production considerations.`,
        content: createPhase4Content(lessonTitle, description, moduleTitle, lessonSlug)
      }
    ],
    checkpoints: [
      {
        id: `checkpoint-${slugBase}-1`,
        question: `${lessonTitle} nedir ve neden kullanılır?`,
        options: [
          `${lessonTitle}, web API'lerinde veri alışverişi için kullanılan bir standarttır.`,
          `${lessonTitle}, sadece Microsoft teknolojilerinde kullanılan bir kavramdır.`,
          `${lessonTitle}, sadece büyük projelerde gerekli olan bir özelliktir.`,
          `${lessonTitle}, modern web geliştirmede kullanılmayan eski bir teknolojidir.`
        ],
        answer: `${lessonTitle}, web API'lerinde veri alışverişi için kullanılan bir standarttır.`,
        rationale: `${lessonTitle} konusu, modern web API geliştirmede kritik öneme sahiptir ve tüm büyüklükteki projelerde kullanılır.`
      },
      {
        id: `checkpoint-${slugBase}-2`,
        question: `${lessonTitle} konusunda en yaygın hata nedir?`,
        options: [
          `Proper error handling yapmamak ve exception'ları doğru yönetmemek`,
          `Kod yazmamak`,
          `Documentation okumamak`,
          `API kullanmamak`
        ],
        answer: `Proper error handling yapmamak ve exception'ları doğru yönetmemek`,
        rationale: `${lessonTitle} konusunda en yaygın hata, proper error handling yapmamaktır. Bu, production ortamında ciddi problemlere yol açabilir.`
      }
    ],
    resources: [
      {
        id: `resource-${slugBase}-docs`,
        label: `${lessonTitle} - Microsoft Docs`,
        href: `https://learn.microsoft.com/aspnet/core/web-api`,
        type: "reading",
        estimatedMinutes: 30,
        description: `${lessonTitle} konusu hakkında detaylı Microsoft dokümantasyonu ve resmi kaynaklar.`
      },
      {
        id: `resource-${slugBase}-video`,
        label: `${lessonTitle} - Video Eğitim`,
        href: `https://learn.microsoft.com/aspnet/core/web-api`,
        type: "video",
        estimatedMinutes: 45,
        description: `${lessonTitle} konusunu görsel olarak öğrenmek için video eğitim ve tutorial'lar.`
      },
      {
        id: `resource-${slugBase}-sample`,
        label: `${lessonTitle} - Örnek Projeler`,
        href: `https://github.com/dotnet/aspnetcore/tree/main/src/WebApi`,
        type: "reading",
        estimatedMinutes: 60,
        description: `${lessonTitle} konusunun gerçek dünya örnekleri ve sample projeler.`
      }
    ],
    practice: [
      {
        id: `practice-${slugBase}-1`,
        title: `${lessonTitle} - Temel Uygulama`,
        description: `${lessonTitle} konusunun temel kullanımını içeren pratik bir uygulama geliştirin.`,
        type: "coding",
        estimatedMinutes: 45,
        difficulty: "Orta",
        instructions: [
          `Yeni bir ASP.NET Core Web API projesi oluşturun`,
          `${lessonTitle} konusunu implement edin`,
          `Temel CRUD operasyonları ekleyin`,
          `Error handling mekanizması ekleyin`,
          `Projeyi test edin ve çalıştığını doğrulayın`,
          `Best practice'leri uyguladığınızdan emin olun`
        ]
      },
      {
        id: `practice-${slugBase}-2`,
        title: `${lessonTitle} - İleri Seviye Uygulama`,
        description: `${lessonTitle} konusunun ileri seviye kullanımını içeren karmaşık bir uygulama geliştirin.`,
        type: "coding",
        estimatedMinutes: 90,
        difficulty: "İleri",
        instructions: [
          `${lessonTitle} konusunu ileri seviye tekniklerle implement edin`,
          `Caching, logging, ve monitoring ekleyin`,
          `Authentication ve authorization ekleyin`,
          `Unit testler yazın`,
          `Performance optimizasyonu yapın`,
          `Production-ready hale getirin`,
          `Documentation ekleyin`
        ]
      }
    ]
  };
}

// Module 5 Lessons
const module5Lessons: Lesson[] = [
  createDetailedLesson(
    "RESTful API Tasarımı",
    "aspnet-core/web-api/restful-design",
    "RESTful API tasarım prensipleri, resource naming, HTTP methods ve REST best practice'lerini öğren.",
    "Web API Geliştirme",
    "Orta"
  ),
  createDetailedLesson(
    "HTTP Status Codes",
    "aspnet-core/web-api/status-codes",
    "HTTP status code'ları, doğru status code seçimi ve API response standartlarını öğren.",
    "Web API Geliştirme",
    "Orta"
  ),
  createDetailedLesson(
    "API Versioning",
    "aspnet-core/web-api/versioning",
    "API versioning stratejileri, URL-based, header-based ve query-based versioning'i öğren.",
    "Web API Geliştirme",
    "Orta"
  ),
  createDetailedLesson(
    "Swagger/OpenAPI",
    "aspnet-core/web-api/swagger-openapi",
    "Swagger/OpenAPI entegrasyonu, API dokümantasyonu ve Swagger UI kullanımını öğren.",
    "Web API Geliştirme",
    "Orta"
  ),
  createDetailedLesson(
    "API Security",
    "aspnet-core/web-api/security",
    "API güvenliği, authentication, authorization, rate limiting ve API key yönetimini öğren.",
    "Web API Geliştirme",
    "Orta"
  )
];

// Write to JSON file
const module5Data = {
  moduleId: "module-05-web-api",
  moduleTitle: "Web API Geliştirme",
  lessons: module5Lessons
};

const outputPath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-detailed.json');
fs.writeFileSync(outputPath, JSON.stringify(module5Data, null, 2), 'utf-8');

console.log('✅ Module 5 detailed content created successfully!');
console.log(`✅ File saved to: ${outputPath}`);
console.log(`✅ Total lessons: ${module5Lessons.length}`);
