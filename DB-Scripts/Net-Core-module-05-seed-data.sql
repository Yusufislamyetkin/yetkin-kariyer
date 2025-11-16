-- Module 05: Web API - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-05-web-api",
          "title": "Web API Geliştirme",
          "summary": "RESTful ilkelere uygun, sürümlenebilir ve güvenli Web API ler tasarla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında minimal API ve controller tabanlı yaklaşımlarla güvenli, sürümlenebilir API ler tasarlayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Web%20API",
            "description": "REST ilkeleri, dokümantasyon ve sürümleme yaklaşımlarını derinlemesine incele."
          },
          "relatedTopics": [
            {
              "label": "Minimal API Tasarımı",
              "href": "/education/lessons/web-api/minimal-api/getting-started",
              "description": "Hafif API uç noktalarını minimal template ile oluştur."
            },
            {
              "label": "API Versioning Senaryoları",
              "href": "/education/lessons/web-api/api-versioning/strategies",
              "description": "URI, header ve query tabanlı sürümleme stratejilerini karşılaştır."
            },
            {
              "label": "Swagger ve Dokümantasyon",
              "href": "/education/lessons/web-api/documentation/swagger-openapi",
              "description": "OpenAPI dökümanlarını otomatik üret ve özelleştir."
            },
            {
              "label": "RESTful API Tasarım Prensipleri",
              "href": "/education/lessons/web-api/rest/restful-design-principles",
              "description": "RESTful API tasarım prensiplerini öğren ve uygula.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "RESTful API ler stateless olmalıdır",
                "HTTP metodları doğru kullanılmalıdır (GET, POST, PUT, DELETE)",
                "Resource-based URL yapısı kullanılmalıdır",
                "HATEOAS ile hypermedia desteği sağlanabilir"
              ],
              "sections": [
                {
                  "id": "rest-principles",
                  "title": "RESTful Prensipler",
                  "summary": "RESTful API tasarım prensipleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "RESTful API ler stateless olmalı, HTTP metodları doğru kullanılmalı ve resource-based URL yapısı kullanılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// RESTful API örneği n[ApiController] n[Route("api/[controller] ")] npublic class ProductsController : ControllerBase n{ n    [HttpGet] n    public IActionResult Get() { } n     n    [HttpGet("{id} ")] n    public IActionResult Get(int id) { } n     n    [HttpPost] n    public IActionResult Create(Product product) { } n     n    [HttpPut("{id} ")] n    public IActionResult Update(int id, Product product) { } n     n    [HttpDelete("{id} ")] n    public IActionResult Delete(int id) { } n}",
                      "explanation": "RESTful API controller örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-rest",
                  "question": "RESTful API ler nasıl olmalıdır?",
                  "options": [
                    "Stateful",
                    "Stateless",
                    "Her ikisi de",
                    "Hiçbiri"
                  ],
                  "answer": "Stateless",
                  "rationale": "RESTful API ler stateless olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-rest-docs",
                  "label": "RESTful API Design",
                  "href": "https://restfulapi.net/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "RESTful API tasarım prensipleri hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-rest",
                  "title": "RESTful API Tasarımı",
                  "description": "RESTful prensiplere uygun API tasarla.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Resource-based URL yapısı kullan",
                    "HTTP metodlarını doğru kullan",
                    "Stateless tasarım yap"
                  ]
                }
              ]
            },
            {
              "label": "HTTP Status Codes ve Response Formatları",
              "href": "/education/lessons/web-api/http/status-codes-response-formats",
              "description": "HTTP status code ları ve response formatlarını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "HTTP status code ları doğru kullanılmalıdır",
                "200 OK başarılı işlemler için",
                "201 Created yeni kaynak oluşturma için",
                "400 Bad Request client hataları için",
                "500 Internal Server Error server hataları için"
              ],
              "sections": [
                {
                  "id": "status-codes",
                  "title": "HTTP Status Codes",
                  "summary": "HTTP status code kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "HTTP status code ları API response larında doğru kullanılmalıdır: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Status code kullanımı n[HttpGet("{id} ")] npublic IActionResult Get(int id) n{ n    var product = _repository.GetById(id); n    if (product == null) n        return NotFound(); // 404 n    return Ok(product); // 200 n} n n[HttpPost] npublic IActionResult Create(Product product) n{ n    _repository.Add(product); n    return CreatedAtAction(nameof(Get), new { id = product.Id }, product); // 201 n}",
                      "explanation": "HTTP status code kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-status",
                  "question": "Yeni kaynak oluşturma için hangi status code kullanılmalıdır?",
                  "options": [
                    "200 OK",
                    "201 Created",
                    "400 Bad Request",
                    "500 Internal Server Error"
                  ],
                  "answer": "201 Created",
                  "rationale": "Yeni kaynak oluşturma için 201 Created status code u kullanılmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-status-docs",
                  "label": "HTTP Status Codes",
                  "href": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "HTTP status code ları hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-status",
                  "title": "HTTP Status Codes",
                  "description": "Doğru HTTP status code larını kullan.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Farklı senaryolar için status code kullan",
                    "Response formatlarını standartlaştır",
                    "Error response ları yapılandır"
                  ]
                }
              ]
            },
            {
              "label": "API Authentication ve Authorization",
              "href": "/education/lessons/web-api/security/authentication-authorization",
              "description": "API authentication ve authorization mekanizmalarını öğren.",
              "estimatedDurationMinutes": 50,
              "level": "İleri",
              "keyTakeaways": [
                "Authentication kimlik doğrulama, Authorization yetkilendirmedir",
                "JWT token lar stateless authentication sağlar",
                "API key ler basit authentication için kullanılabilir",
                "OAuth 2.0 güvenli authorization sağlar"
              ],
              "sections": [
                {
                  "id": "auth-authz",
                  "title": "Authentication ve Authorization",
                  "summary": "API güvenliği için authentication ve authorization.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Authentication kimlik doğrulama, authorization ise yetkilendirmedir. JWT token lar stateless authentication sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// JWT Authentication nservices.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) n    .AddJwtBearer(options => n    { n        options.TokenValidationParameters = new TokenValidationParameters n        { n            ValidateIssuer = true, n            ValidateAudience = true, n            ValidateLifetime = true, n            ValidateIssuerSigningKey = true n        }; n    }); n n// Authorization n[Authorize] n[ApiController] npublic class ProductsController : ControllerBase n{ n    [Authorize(Roles ="Admin ")] n    [HttpDelete("{id} ")] n    public IActionResult Delete(int id) { } n}",
                      "explanation": "JWT authentication ve authorization örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-auth",
                  "question": "Authentication ve Authorization arasındaki fark nedir?",
                  "options": [
                    "Hiçbir fark yoktur",
                    "Authentication kimlik doğrulama, Authorization yetkilendirmedir",
                    "Her ikisi de aynıdır",
                    "Hiçbir şey"
                  ],
                  "answer": "Authentication kimlik doğrulama, Authorization yetkilendirmedir",
                  "rationale": "Authentication kimlik doğrulama, Authorization ise yetkilendirmedir."
                }
              ],
              "resources": [
                {
                  "id": "resource-auth-docs",
                  "label": "Microsoft Docs: Authentication",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authentication",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "Authentication ve authorization hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-auth",
                  "title": "API Authentication ve Authorization",
                  "description": "JWT token ile authentication ve authorization uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "İleri",
                  "instructions": [
                    "JWT authentication yapılandır",
                    "Authorization policy leri oluştur",
                    "Protected endpoint ler oluştur"
                  ]
                }
              ]
            },
            {
              "label": "API Rate Limiting ve Throttling",
              "href": "/education/lessons/web-api/performance/rate-limiting-throttling",
              "description": "API rate limiting ve throttling mekanizmalarını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Rate limiting API kullanımını sınırlar",
                "Throttling aşırı yüklenmeyi önler",
                "Fixed window ve sliding window stratejileri vardır",
                "Rate limiting performansı ve güvenliği artırır"
              ],
              "sections": [
                {
                  "id": "rate-limiting",
                  "title": "Rate Limiting ve Throttling",
                  "summary": "API kullanımını sınırlama.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Rate limiting API kullanımını sınırlar, throttling ise aşırı yüklenmeyi önler. Fixed window ve sliding window stratejileri vardır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Rate limiting middleware napp.UseRateLimiter(options => n{ n    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext => n        RateLimitPartition.GetFixedWindowLimiter( n            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), n            factory: partition => new FixedWindowRateLimiterOptions n            { n                AutoReplenishment = true, n                PermitLimit = 100, n                Window = TimeSpan.FromMinutes(1) n            })); n});",
                      "explanation": "Rate limiting yapılandırması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-rate",
                  "question": "Rate limiting in amacı nedir?",
                  "options": [
                    "API yi hızlandırmak",
                    "API kullanımını sınırlamak",
                    "API yi yavaşlatmak",
                    "Hiçbir şey"
                  ],
                  "answer": "API kullanımını sınırlamak",
                  "rationale": "Rate limiting API kullanımını sınırlar ve aşırı yüklenmeyi önler."
                }
              ],
              "resources": [
                {
                  "id": "resource-rate-docs",
                  "label": "Microsoft Docs: Rate Limiting",
                  "href": "https://learn.microsoft.com/aspnet/core/performance/rate-limit",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Rate limiting ve throttling hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-rate",
                  "title": "API Rate Limiting",
                  "description": "Rate limiting ve throttling mekanizmalarını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Rate limiting middleware ekle",
                    "Farklı stratejileri test et",
                    "Rate limit response ları yapılandır"
                  ]
                }
              ]
            },
            {
              "label": "API Error Handling ve Exception Management",
              "href": "/education/lessons/web-api/error-handling/exception-management",
              "description": "API error handling ve exception management stratejilerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Global exception handler kullanılmalıdır",
                "Error response ları standartlaştırılmalıdır",
                "Exception lar loglanmalıdır",
                "Client a uygun error mesajları döndürülmelidir"
              ],
              "sections": [
                {
                  "id": "error-handling",
                  "title": "Error Handling",
                  "summary": "API error handling stratejileri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Global exception handler kullanılmalı, error response ları standartlaştırılmalı ve exception lar loglanmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Global exception handler npublic class GlobalExceptionHandler : IExceptionHandler n{ n    public async ValueTask<bool> TryHandleAsync( n        HttpContext httpContext, n        Exception exception, n        CancellationToken cancellationToken) n    { n        var response = new ErrorResponse n        { n            StatusCode = 500, n            Message ="An error occurred \" n        }; n         n        httpContext.Response.StatusCode = 500; n        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken); n        return true; n    } n}",
                      "explanation": "Global exception handler örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-error",
                  "question": "Global exception handler ne işe yarar?",
                  "options": [
                    "Sadece exception ları loglar",
                    "Tüm exception ları merkezi olarak yönetir",
                    "Sadece error response oluşturur",
                    "Hiçbir şey"
                  ],
                  "answer": "Tüm exception ları merkezi olarak yönetir",
                  "rationale": "Global exception handler tüm exception ları merkezi olarak yönetir."
                }
              ],
              "resources": [
                {
                  "id": "resource-error-docs",
                  "label": "Microsoft Docs: Error Handling",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/error-handling",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Error handling ve exception management hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-error",
                  "title": "API Error Handling",
                  "description": "Global exception handler ve error response yapılandırması yap.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Global exception handler oluştur",
                    "Error response model i tanımla",
                    "Exception ları logla"
                  ]
                }
              ]
            },
            {
              "label": "API Testing ve Integration",
              "href": "/education/lessons/web-api/testing/api-testing-integration",
              "description": "API testing ve integration test stratejilerini öğren.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Unit test ler tek bir fonksiyonu test eder",
                "Integration test ler birden fazla bileşeni test eder",
                "TestServer ile in-memory test yapılabilir",
                "API test leri otomatikleştirilebilir"
              ],
              "sections": [
                {
                  "id": "api-testing",
                  "title": "API Testing",
                  "summary": "API test stratejileri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Unit test ler tek bir fonksiyonu test eder, integration test ler ise birden fazla bileşeni test eder. TestServer ile in-memory test yapılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Integration test npublic class ProductsApiTests : IClassFixture<WebApplicationFactory<Program>> n{ n    private readonly WebApplicationFactory<Program> _factory; n     n    [Fact] n    public async Task GetProducts_ReturnsSuccessStatusCode() n    { n        var client = _factory.CreateClient(); n        var response = await client.GetAsync("/api/products "); n        response.EnsureSuccessStatusCode(); n    } n}",
                      "explanation": "API integration test örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-testing",
                  "question": "Integration test ne test eder?",
                  "options": [
                    "Sadece tek bir fonksiyon",
                    "Birden fazla bileşen",
                    "Sadece view",
                    "Hiçbir şey"
                  ],
                  "answer": "Birden fazla bileşen",
                  "rationale": "Integration test ler birden fazla bileşeni test eder."
                }
              ],
              "resources": [
                {
                  "id": "resource-testing-docs",
                  "label": "Microsoft Docs: Testing",
                  "href": "https://learn.microsoft.com/aspnet/core/test/integration-tests",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "API testing ve integration test hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-testing",
                  "title": "API Testing",
                  "description": "Unit ve integration test ler yaz.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "Orta",
                  "instructions": [
                    "Unit test ler yaz",
                    "Integration test ler yaz",
                    "TestServer kullan"
                  ]
                }
              ]
            },
            {
              "label": "API Performance Optimization",
              "href": "/education/lessons/web-api/performance/api-optimization",
              "description": "API performans optimizasyonu tekniklerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Caching API response larını hızlandırır",
                "Async/await performansı artırır",
                "Pagination büyük veri setlerini optimize eder",
                "Compression response boyutunu azaltır"
              ],
              "sections": [
                {
                  "id": "api-optimization",
                  "title": "API Performance Optimization",
                  "summary": "API performans optimizasyonu teknikleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Caching API response larını hızlandırır, async/await performansı artırır, pagination büyük veri setlerini optimize eder."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Response caching n[ResponseCache(Duration = 60)] n[HttpGet] npublic IActionResult Get() n{ n    return Ok(_repository.GetAll()); n} n n// Pagination n[HttpGet] npublic IActionResult Get([FromQuery] int page = 1, [FromQuery] int pageSize = 10) n{ n    var products = _repository.GetAll() n        .Skip((page - 1) * pageSize) n        .Take(pageSize); n    return Ok(products); n}",
                      "explanation": "API performans optimizasyonu örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-optimization",
                  "question": "Caching ne işe yarar?",
                  "options": [
                    "API yi yavaşlatır",
                    "API response larını hızlandırır",
                    "API yi durdurur",
                    "Hiçbir şey"
                  ],
                  "answer": "API response larını hızlandırır",
                  "rationale": "Caching API response larını hızlandırır."
                }
              ],
              "resources": [
                {
                  "id": "resource-optimization-docs",
                  "label": "Microsoft Docs: Performance",
                  "href": "https://learn.microsoft.com/aspnet/core/performance",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "API performans optimizasyonu hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-optimization",
                  "title": "API Performance Optimization",
                  "description": "API performans optimizasyonu tekniklerini uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "İleri",
                  "instructions": [
                    "Response caching ekle",
                    "Pagination implement et",
                    "Compression yapılandır"
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
        'Mini Test: RESTful API Tasarım Prensipleri',
        'RESTful API tasarım prensiplerini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-rest-1",
            "question": "RESTful API ler nasıl olmalıdır?",
            "options": [
              "Stateful",
              "Stateless",
              "Her ikisi de",
              "Hiçbiri"
            ],
            "correctAnswer": 1,
            "explanation": "RESTful API ler stateless olmalıdır."
          },
          {
            "id": "mini-rest-2",
            "question": "Resource-based URL yapısı ne demektir?",
            "options": [
              "Sadece controller adı kullanmak",
              "Kaynakları URL de temsil etmek",
              "Sadece action adı kullanmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Resource-based URL yapısı, kaynakları URL de temsil etmek demektir (örn: /api/products)."
          },
          {
            "id": "mini-rest-3",
            "question": "HATEOAS nedir?",
            "options": [
              "Sadece bir kısaltma",
              "Hypermedia desteği sağlar",
              "Sadece bir standart",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "HATEOAS (Hypermedia as the Engine of Application State) hypermedia desteği sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/rest/restful-design-principles',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-http-status-codes-response-formats',
        'course-dotnet-roadmap',
        'Mini Test: HTTP Status Codes ve Response Formatları',
        'HTTP status code ları ve response formatlarını pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-status-1",
            "question": "Yeni kaynak oluşturma için hangi status code kullanılmalıdır?",
            "options": [
              "200 OK",
              "201 Created",
              "400 Bad Request",
              "500 Internal Server Error"
            ],
            "correctAnswer": 1,
            "explanation": "Yeni kaynak oluşturma için 201 Created status code u kullanılmalıdır."
          },
          {
            "id": "mini-status-2",
            "question": "Client hatası için hangi status code kullanılmalıdır?",
            "options": [
              "200 OK",
              "201 Created",
              "400 Bad Request",
              "500 Internal Server Error"
            ],
            "correctAnswer": 2,
            "explanation": "Client hatası için 400 Bad Request status code u kullanılmalıdır."
          },
          {
            "id": "mini-status-3",
            "question": "Server hatası için hangi status code kullanılmalıdır?",
            "options": [
              "200 OK",
              "201 Created",
              "400 Bad Request",
              "500 Internal Server Error"
            ],
            "correctAnswer": 3,
            "explanation": "Server hatası için 500 Internal Server Error status code u kullanılmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/http/status-codes-response-formats',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-security-authentication-authorization',
        'course-dotnet-roadmap',
        'Mini Test: API Authentication ve Authorization',
        'API authentication ve authorization konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-auth-1",
            "question": "Authentication ve Authorization arasındaki fark nedir?",
            "options": [
              "Hiçbir fark yoktur",
              "Authentication kimlik doğrulama, Authorization yetkilendirmedir",
              "Her ikisi de aynıdır",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Authentication kimlik doğrulama, Authorization ise yetkilendirmedir."
          },
          {
            "id": "mini-auth-2",
            "question": "JWT token lar ne sağlar?",
            "options": [
              "Sadece authentication",
              "Stateless authentication",
              "Sadece authorization",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "JWT token lar stateless authentication sağlar."
          },
          {
            "id": "mini-auth-3",
            "question": "OAuth 2.0 ne sağlar?",
            "options": [
              "Sadece authentication",
              "Güvenli authorization",
              "Sadece token",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "OAuth 2.0 güvenli authorization sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/security/authentication-authorization',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-performance-rate-limiting-throttling',
        'course-dotnet-roadmap',
        'Mini Test: API Rate Limiting ve Throttling',
        'API rate limiting ve throttling konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-rate-1",
            "question": "Rate limiting in amacı nedir?",
            "options": [
              "API yi hızlandırmak",
              "API kullanımını sınırlamak",
              "API yi yavaşlatmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Rate limiting API kullanımını sınırlar ve aşırı yüklenmeyi önler."
          },
          {
            "id": "mini-rate-2",
            "question": "Throttling ne işe yarar?",
            "options": [
              "API yi hızlandırır",
              "Aşırı yüklenmeyi önler",
              "API yi durdurur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Throttling aşırı yüklenmeyi önler."
          },
          {
            "id": "mini-rate-3",
            "question": "Fixed window ve sliding window stratejileri nedir?",
            "options": [
              "Sadece rate limiting stratejileri",
              "Rate limiting stratejileri",
              "Sadece throttling stratejileri",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Fixed window ve sliding window rate limiting stratejileridir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/performance/rate-limiting-throttling',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-error-handling-exception-management',
        'course-dotnet-roadmap',
        'Mini Test: API Error Handling ve Exception Management',
        'API error handling ve exception management konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-error-1",
            "question": "Global exception handler ne işe yarar?",
            "options": [
              "Sadece exception ları loglar",
              "Tüm exception ları merkezi olarak yönetir",
              "Sadece error response oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Global exception handler tüm exception ları merkezi olarak yönetir."
          },
          {
            "id": "mini-error-2",
            "question": "Error response ları nasıl olmalıdır?",
            "options": [
              "Standartlaştırılmış",
              "Her zaman farklı",
              "Sadece string",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 0,
            "explanation": "Error response ları standartlaştırılmalıdır."
          },
          {
            "id": "mini-error-3",
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
        '/education/lessons/web-api/error-handling/exception-management',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-testing-api-testing-integration',
        'course-dotnet-roadmap',
        'Mini Test: API Testing ve Integration',
        'API testing ve integration test konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-testing-1",
            "question": "Integration test ne test eder?",
            "options": [
              "Sadece tek bir fonksiyon",
              "Birden fazla bileşen",
              "Sadece view",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Integration test ler birden fazla bileşeni test eder."
          },
          {
            "id": "mini-testing-2",
            "question": "TestServer ne işe yarar?",
            "options": [
              "Sadece unit test",
              "In-memory test yapmak için",
              "Sadece integration test",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "TestServer ile in-memory test yapılabilir."
          },
          {
            "id": "mini-testing-3",
            "question": "API test leri otomatikleştirilebilir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "API test leri otomatikleştirilebilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/testing/api-testing-integration',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-performance-api-optimization',
        'course-dotnet-roadmap',
        'Mini Test: API Performance Optimization',
        'API performans optimizasyonu konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-optimization-1",
            "question": "Caching ne işe yarar?",
            "options": [
              "API yi yavaşlatır",
              "API response larını hızlandırır",
              "API yi durdurur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Caching API response larını hızlandırır."
          },
          {
            "id": "mini-optimization-2",
            "question": "Pagination ne işe yarar?",
            "options": [
              "API yi yavaşlatır",
              "Büyük veri setlerini optimize eder",
              "API yi durdurur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Pagination büyük veri setlerini optimize eder."
          },
          {
            "id": "mini-optimization-3",
            "question": "Compression ne işe yarar?",
            "options": [
              "Response boyutunu artırır",
              "Response boyutunu azaltır",
              "API yi yavaşlatır",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Compression response boyutunu azaltır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/web-api/performance/api-optimization',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

COMMIT;
