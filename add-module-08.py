import json
import sys

# Modül 8 için 20 ders içeriği
module_08_lessons = [
    # Faz 1: API Temelleri ve RESTful İlkeler (5 ders)
    {
        "label": "API Kavramına Giriş",
        "href": "/education/lessons/api-development/api-intro",
        "description": "API (Application Programming Interface) nedir, ne işe yarar ve modern yazılım geliştirmede neden kritik öneme sahiptir? Web API'lerin temel kavramlarını, HTTP protokolü ile ilişkisini ve farklı API türlerini öğren. Bu ders, API geliştirme yolculuğunun temelini oluşturur ve gerçek dünya uygulamalarında API'lerin nasıl kullanıldığını gösterir.",
        "estimatedDurationMinutes": 50,
        "level": "Başlangıç",
        "keyTakeaways": [
            "API'nin ne olduğunu, ne işe yaradığını ve neden önemli olduğunu anlayacaksın.",
            "Web API'lerin HTTP protokolü ile nasıl çalıştığını öğreneceksin.",
            "REST, SOAP, GraphQL gibi farklı API türlerini tanıyacaksın.",
            "API'lerin modern yazılım mimarisindeki rolünü kavrayacaksın.",
            "API tasarım prensiplerinin temellerini öğreneceksin."
        ],
        "sections": [
            {
                "id": "api-intro-foundations",
                "title": "API Nedir ve Ne İşe Yarar?",
                "summary": "API kavramının temellerini ve modern yazılım geliştirmedeki rolünü öğren.",
                "content": [
                    {
                        "type": "text",
                        "body": "API (Application Programming Interface), farklı yazılım bileşenlerinin birbirleriyle iletişim kurmasını sağlayan bir arayüzdür. API'ler, uygulamaların veri alışverişi yapmasına, servisleri kullanmasına ve işlevsellik paylaşmasına olanak tanır. Modern yazılım geliştirmede API'ler, mikroservis mimarilerinin, mobil uygulamaların ve web servislerinin temelini oluşturur."
                    },
                    {
                        "type": "list",
                        "ordered": True,
                        "items": [
                            "API, iki farklı yazılım sistemi arasında köprü görevi görür.",
                            "API'ler, veri ve işlevsellik paylaşımını standartlaştırır.",
                            "Web API'ler HTTP protokolü üzerinden çalışır ve internet üzerinden erişilebilir.",
                            "API'ler, frontend ve backend arasında bağımsızlık sağlar.",
                            "Modern uygulamalar genellikle birden fazla API kullanır."
                        ]
                    },
                    {
                        "type": "code",
                        "language": "csharp",
                        "code": "// API kullanım örneği - HTTP isteği gönderme\nusing System.Net.Http;\n\npublic class ApiClient\n{\n    private readonly HttpClient _httpClient;\n    \n    public ApiClient(HttpClient httpClient)\n    {\n        _httpClient = httpClient;\n    }\n    \n    public async Task<string> GetDataAsync(string endpoint)\n    {\n        var response = await _httpClient.GetAsync(endpoint);\n        response.EnsureSuccessStatusCode();\n        return await response.Content.ReadAsStringAsync();\n    }\n}",
                        "explanation": "Bu örnek, bir API'den veri çekmek için HttpClient kullanımını gösterir. API endpoint'ine GET isteği gönderilir ve yanıt alınır."
                    },
                    {
                        "type": "callout",
                        "variant": "tip",
                        "title": "Önemli Not",
                        "body": "API'ler sadece veri alışverişi için değil, aynı zamanda iş mantığının paylaşılması için de kullanılır. İyi tasarlanmış bir API, kullanıcıların karmaşık işlemleri basit isteklerle gerçekleştirmesine olanak tanır."
                    }
                ]
            },
            {
                "id": "api-intro-types",
                "title": "API Türleri ve Kullanım Senaryoları",
                "summary": "REST, SOAP, GraphQL gibi farklı API türlerini ve ne zaman kullanılacaklarını öğren.",
                "content": [
                    {
                        "type": "text",
                        "body": "Farklı API türleri, farklı ihtiyaçlara hizmet eder. REST API'ler en yaygın kullanılan türdür ve web uygulamaları için idealdir. SOAP API'ler daha katı standartlara sahiptir ve kurumsal uygulamalarda tercih edilir. GraphQL ise esnek veri sorgulama ihtiyaçları için kullanılır."
                    },
                    {
                        "type": "list",
                        "ordered": False,
                        "items": [
                            "REST API: HTTP metodları (GET, POST, PUT, DELETE) kullanır, JSON formatında veri alışverişi yapar, stateless çalışır.",
                            "SOAP API: XML tabanlı, katı standartlara sahip, güvenlik ve işlem yönetimi için uygundur.",
                            "GraphQL: İstemcinin ihtiyaç duyduğu veriyi sorgulayabildiği esnek bir API türüdür.",
                            "gRPC: Yüksek performanslı, binary protokol kullanan, mikroservisler arası iletişim için idealdir."
                        ]
                    },
                    {
                        "type": "code",
                        "language": "csharp",
                        "code": "// REST API endpoint örneği\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class ProductsController : ControllerBase\n{\n    [HttpGet]\n    public IActionResult GetProducts()\n    {\n        var products = new[] { \"Ürün 1\", \"Ürün 2\" };\n        return Ok(products);\n    }\n}",
                        "explanation": "Bu örnek, ASP.NET Core'da basit bir REST API endpoint'inin nasıl oluşturulduğunu gösterir. GET isteği için bir endpoint tanımlanmıştır."
                    }
                ]
            },
            {
                "id": "api-intro-practical",
                "title": "Pratik Uygulamalar ve Gerçek Dünya Senaryoları",
                "summary": "API'lerin gerçek dünya uygulamalarında nasıl kullanıldığını örneklerle öğren.",
                "content": [
                    {
                        "type": "text",
                        "body": "API'ler modern yazılım geliştirmede her yerde kullanılır: e-ticaret siteleri ödeme API'leri kullanır, hava durumu uygulamaları meteoroloji API'lerinden veri çeker, sosyal medya uygulamaları platform API'lerini kullanır. Bu bölümde, gerçek dünya senaryolarını inceleyeceğiz."
                    },
                    {
                        "type": "callout",
                        "variant": "info",
                        "title": "Gerçek Dünya Örneği",
                        "body": "Bir e-ticaret uygulaması, ödeme işlemleri için ödeme gateway API'sini, kargo takibi için kargo API'sini ve müşteri bilgileri için CRM API'sini kullanabilir. Her API farklı bir servis sağlar ve uygulama bu servisleri birleştirerek kullanıcıya hizmet sunar."
                    }
                ]
            }
        ],
        "checkpoints": [
            {
                "id": "checkpoint-api-intro-1",
                "question": "API'nin açılımı nedir ve ne işe yarar?",
                "options": [
                    "Application Programming Interface - Yazılım bileşenleri arasında iletişim sağlar",
                    "Advanced Programming Interface - Gelişmiş programlama arayüzü",
                    "Application Process Interface - Uygulama işlem arayüzü",
                    "Automated Programming Interface - Otomatik programlama arayüzü"
                ],
                "answer": "Application Programming Interface - Yazılım bileşenleri arasında iletişim sağlar",
                "rationale": "API, Application Programming Interface'in kısaltmasıdır ve farklı yazılım bileşenlerinin birbirleriyle iletişim kurmasını sağlayan bir arayüzdür."
            },
            {
                "id": "checkpoint-api-intro-2",
                "question": "REST API'nin temel özelliklerinden hangisi doğrudur?",
                "options": [
                    "Stateless çalışır ve HTTP metodlarını kullanır",
                    "Sadece XML formatında veri alışverişi yapar",
                    "Her zaman güvenli bağlantı gerektirir",
                    "Sadece GET ve POST metodlarını destekler"
                ],
                "answer": "Stateless çalışır ve HTTP metodlarını kullanır",
                "rationale": "REST API'ler stateless çalışır (her istek bağımsızdır) ve HTTP metodlarını (GET, POST, PUT, DELETE) kullanır. JSON formatında veri alışverişi yapabilir."
            }
        ],
        "resources": [
            {
                "id": "resource-api-intro-docs",
                "label": "ASP.NET Core Web API - Microsoft Docs",
                "href": "https://learn.microsoft.com/aspnet/core/web-api",
                "type": "reading",
                "estimatedMinutes": 30,
                "description": "ASP.NET Core Web API hakkında detaylı Microsoft dokümantasyonu."
            }
        ],
        "practice": [
            {
                "id": "practice-api-intro-1",
                "title": "İlk API Endpoint'ini Oluştur",
                "description": "ASP.NET Core'da basit bir GET endpoint'i oluşturarak API geliştirmeye başla.",
                "type": "coding",
                "estimatedMinutes": 30,
                "difficulty": "Kolay",
                "instructions": [
                    "Yeni bir ASP.NET Core Web API projesi oluştur.",
                    "ProductsController adında bir controller oluştur.",
                    "GET endpoint'i ekle ve basit bir ürün listesi döndür.",
                    "Swagger UI'da endpoint'i test et.",
                    "Postman veya curl ile endpoint'e istek gönder."
                ]
            }
        ]
    }
]

# JSON dosyasını oku
with open('data/lesson-contents/dotnet-core-lessons.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Modül 8'i ekle
module_08 = {
    "moduleId": "module-08",
    "moduleTitle": "API Geliştirme (RESTful API – Minimal API / Controller Based)",
    "lessons": module_08_lessons
}

# Modül 8'i modules array'ine ekle
data['modules'].append(module_08)

# totalLessons'ı güncelle
data['totalLessons'] = data['totalLessons'] + len(module_08_lessons)

# JSON dosyasını yaz
with open('data/lesson-contents/dotnet-core-lessons.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Modül 8 başarıyla eklendi! {len(module_08_lessons)} ders eklendi.")

