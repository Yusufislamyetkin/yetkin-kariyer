-- Module 07: Authentication & Authorization - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-07-auth",
          "title": "Authentication & Authorization",
          "summary": "JWT, cookie ve dış sağlayıcılarla kimlik doğrulama katmanını tasarla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında çoklu kimlik doğrulama şemalarını konfigüre edip policy tabanlı yetkilendirme kurallarını uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Authentication",
            "description": "Kimlik doğrulama akışlarını ve policy tabanlı yetkilendirmeyi bir arada incele."
          },
          "relatedTopics": [
            {
              "label": "JWT Kimlik Doğrulama Yapılandırması",
              "href": "/education/lessons/authentication/jwt/configuration",
              "description": "Token doğrulama parametrelerini ve refresh stratejilerini ayarla."
            },
            {
              "label": "Cookie ve Harici Sağlayıcılar",
              "href": "/education/lessons/authentication/cookie-external/login-flow",
              "description": "Cookie tabanlı oturumlar ve OAuth sağlayıcı entegrasyonlarını uygula."
            },
            {
              "label": "Policy Tabanlı Yetkilendirme",
              "href": "/education/lessons/authorization/policy-based",
              "description": "Requirement ve handler larla esnek kural setleri oluştur."
            },
            {
              "label": "Identity Framework Kullanımı",
              "href": "/education/lessons/authentication/identity/identity-framework",
              "description": "ASP.NET Core Identity framework ünü öğren ve kullan.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Identity framework kullanıcı yönetimi sağlar",
                "User, Role, Claim yönetimi yapılabilir",
                "Password hashing otomatik yapılır",
                "Email confirmation ve password reset desteklenir"
              ],
              "sections": [
                {
                  "id": "identity-framework",
                  "title": "Identity Framework",
                  "summary": "ASP.NET Core Identity kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Identity framework kullanıcı yönetimi, authentication ve authorization sağlar. User, Role, Claim yönetimi yapılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Identity yapılandırması nservices.AddIdentity<IdentityUser, IdentityRole>(options => n{ n    options.Password.RequireDigit = true; n    options.Password.RequiredLength = 8; n    options.SignIn.RequireConfirmedEmail = true; n}) n.AddEntityFrameworkStores<ApplicationDbContext>() n.AddDefaultTokenProviders();",
                      "explanation": "Identity framework yapılandırması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-identity",
                  "question": "Identity framework ne sağlar?",
                  "options": [
                    "Sadece authentication",
                    "Kullanıcı yönetimi, authentication ve authorization",
                    "Sadece authorization",
                    "Hiçbir şey"
                  ],
                  "answer": "Kullanıcı yönetimi, authentication ve authorization",
                  "rationale": "Identity framework kullanıcı yönetimi, authentication ve authorization sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-identity-docs",
                  "label": "Microsoft Docs: Identity",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authentication/identity",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "Identity framework hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-identity",
                  "title": "Identity Framework",
                  "description": "Identity framework ile kullanıcı yönetimi uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "Orta",
                  "instructions": [
                    "Identity yapılandır",
                    "User registration implement et",
                    "Login/logout yap"
                  ]
                }
              ]
            },
            {
              "label": "Claims ve ClaimsPrincipal",
              "href": "/education/lessons/authentication/claims/claims-principal",
              "description": "Claims ve ClaimsPrincipal kavramlarını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Claims kullanıcı hakkında bilgi içerir",
                "ClaimsPrincipal kullanıcıyı temsil eder",
                "Claims-based authorization yapılabilir",
                "Custom claims eklenebilir"
              ],
              "sections": [
                {
                  "id": "claims-principal",
                  "title": "Claims ve ClaimsPrincipal",
                  "summary": "Claims-based authentication ve authorization.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Claims kullanıcı hakkında bilgi içerir, ClaimsPrincipal ise kullanıcıyı temsil eder. Claims-based authorization yapılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Claims kullanımı nvar claims = new List<Claim> n{ n    new Claim(ClaimTypes.Name, user.UserName), n    new Claim(ClaimTypes.Email, user.Email), n    new Claim("CustomClaim ","Value ") n}; n nvar identity = new ClaimsIdentity(claims,"Cookie "); nvar principal = new ClaimsPrincipal(identity); n n// Authorization n[Authorize(Policy ="RequireCustomClaim ")] npublic IActionResult ProtectedAction() { }",
                      "explanation": "Claims ve ClaimsPrincipal kullanım örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-claims",
                  "question": "Claims ne içerir?",
                  "options": [
                    "Sadece kullanıcı adı",
                    "Kullanıcı hakkında bilgi",
                    "Sadece Email",
                    "Hiçbir şey"
                  ],
                  "answer": "Kullanıcı hakkında bilgi",
                  "rationale": "Claims kullanıcı hakkında bilgi içerir."
                }
              ],
              "resources": [
                {
                  "id": "resource-claims-docs",
                  "label": "Microsoft Docs: Claims",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authorization/claims",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Claims ve ClaimsPrincipal hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-claims",
                  "title": "Claims ve ClaimsPrincipal",
                  "description": "Claims-based authentication ve authorization uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Claims oluştur",
                    "ClaimsPrincipal kullan",
                    "Claims-based authorization yap"
                  ]
                }
              ]
            },
            {
              "label": "Role-Based Authorization",
              "href": "/education/lessons/authorization/role-based",
              "description": "Role-based authorization stratejilerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Role-based authorization roller üzerinden yapılır",
                "[Authorize(Roles ="Admin ")] kullanılabilir",
                "Kullanıcılara roller atanabilir",
                "Role management yapılabilir"
              ],
              "sections": [
                {
                  "id": "role-based",
                  "title": "Role-Based Authorization",
                  "summary": "Rol tabanlı yetkilendirme.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Role-based authorization roller üzerinden yapılır. [Authorize(Roles ="Admin ")] attribute u ile rol kontrolü yapılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Role-based authorization n[Authorize(Roles ="Admin ")] npublic IActionResult AdminAction() { } n n// Multiple roles n[Authorize(Roles ="Admin,Manager ")] npublic IActionResult AdminOrManagerAction() { } n n// Role atama nawait _userManager.AddToRoleAsync(user,"Admin ");",
                      "explanation": "Role-based authorization örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-role",
                  "question": "Role-based authorization nasıl yapılır?",
                  "options": [
                    "Sadece policy ile",
                    "Roller üzerinden",
                    "Sadece claims ile",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Roller üzerinden",
                  "rationale": "Role-based authorization roller üzerinden yapılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-role-docs",
                  "label": "Microsoft Docs: Role-Based Authorization",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authorization/roles",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Role-based authorization hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-role",
                  "title": "Role-Based Authorization",
                  "description": "Role-based authorization uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Roller oluştur",
                    "Kullanıcılara roller ata",
                    "Role-based authorization yap"
                  ]
                }
              ]
            },
            {
              "label": "Policy-Based Authorization Detayları",
              "href": "/education/lessons/authorization/policy-details",
              "description": "Policy-based authorization ın detaylarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Policy ler requirement ve handler lardan oluşur",
                "Custom requirement lar oluşturulabilir",
                "Handler lar requirement ları değerlendirir",
                "Policy ler esnek authorization sağlar"
              ],
              "sections": [
                {
                  "id": "policy-details",
                  "title": "Policy-Based Authorization",
                  "summary": "Policy ler, requirement lar ve handler lar.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Policy ler requirement ve handler lardan oluşur. Custom requirement lar oluşturulabilir, handler lar requirement ları değerlendirir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Policy yapılandırması nservices.AddAuthorization(options => n{ n    options.AddPolicy("RequireAge ", policy => n        policy.Requirements.Add(new MinimumAgeRequirement(18))); n}); n n// Requirement npublic class MinimumAgeRequirement : IAuthorizationRequirement n{ n    public int MinimumAge { get; } n    public MinimumAgeRequirement(int minimumAge) => MinimumAge = minimumAge; n} n n// Handler npublic class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement> n{ n    protected override Task HandleRequirementAsync( n        AuthorizationHandlerContext context, n        MinimumAgeRequirement requirement) n    { n        // Check age n        context.Succeed(requirement); n        return Task.CompletedTask; n    } n}",
                      "explanation": "Policy-based authorization örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-policy",
                  "question": "Policy ler ne içerir?",
                  "options": [
                    "Sadece requirement",
                    "Requirement ve handler",
                    "Sadece handler",
                    "Hiçbir şey"
                  ],
                  "answer": "Requirement ve handler",
                  "rationale": "Policy ler requirement ve handler lardan oluşur."
                }
              ],
              "resources": [
                {
                  "id": "resource-policy-docs",
                  "label": "Microsoft Docs: Policy-Based Authorization",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authorization/policies",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "Policy-based authorization hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-policy",
                  "title": "Policy-Based Authorization",
                  "description": "Custom policy, requirement ve handler oluştur.",
                  "type": "coding",
                  "estimatedMinutes": 40,
                  "difficulty": "İleri",
                  "instructions": [
                    "Custom requirement oluştur",
                    "Handler yaz",
                    "Policy yapılandır"
                  ]
                }
              ]
            },
            {
              "label": "External Authentication Providers",
              "href": "/education/lessons/authentication/external/external-providers",
              "description": "External authentication provider ları (Google, Facebook, etc.) entegre et.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "OAuth 2.0 ve OpenID Connect kullanılır",
                "Google, Facebook, Microsoft gibi provider lar desteklenir",
                "External login flow yapılandırılabilir",
                "User information external provider dan alınabilir"
              ],
              "sections": [
                {
                  "id": "external-providers",
                  "title": "External Authentication Providers",
                  "summary": "OAuth 2.0 ve OpenID Connect entegrasyonu.",
                  "content": [
                    {
                      "type": "text",
                      "body": "OAuth 2.0 ve OpenID Connect kullanılarak Google, Facebook, Microsoft gibi external provider lar entegre edilebilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Google authentication nservices.AddAuthentication() n    .AddGoogle(options => n    { n        options.ClientId = configuration["Google:ClientId "]; n        options.ClientSecret = configuration["Google:ClientSecret "]; n    }); n n// Facebook authentication nservices.AddAuthentication() n    .AddFacebook(options => n    { n        options.AppId = configuration["Facebook:AppId "]; n        options.AppSecret = configuration["Facebook:AppSecret "]; n    });",
                      "explanation": "External authentication provider yapılandırması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-external",
                  "question": "External authentication için hangi protokoller kullanılır?",
                  "options": [
                    "Sadece OAuth 2.0",
                    "OAuth 2.0 ve OpenID Connect",
                    "Sadece OpenID Connect",
                    "Hiçbir şey"
                  ],
                  "answer": "OAuth 2.0 ve OpenID Connect",
                  "rationale": "External authentication için OAuth 2.0 ve OpenID Connect kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-external-docs",
                  "label": "Microsoft Docs: External Authentication",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authentication/social",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "External authentication provider lar hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-external",
                  "title": "External Authentication Providers",
                  "description": "Google veya Facebook authentication entegre et.",
                  "type": "coding",
                  "estimatedMinutes": 40,
                  "difficulty": "Orta",
                  "instructions": [
                    "OAuth provider yapılandır",
                    "External login flow implement et",
                    "User information al"
                  ]
                }
              ]
            },
            {
              "label": "Token Management ve Refresh Tokens",
              "href": "/education/lessons/authentication/jwt/token-management",
              "description": "JWT token yönetimi ve refresh token stratejilerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Access token kısa ömürlü olmalıdır",
                "Refresh token uzun ömürlü olabilir",
                "Token refresh mekanizması implement edilmelidir",
                "Token revocation yapılabilir"
              ],
              "sections": [
                {
                  "id": "token-management",
                  "title": "Token Management",
                  "summary": "JWT token yönetimi ve refresh token.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Access token kısa ömürlü olmalı, refresh token uzun ömürlü olabilir. Token refresh mekanizması implement edilmelidir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Token generation nvar token = new JwtSecurityToken( n    issuer: _configuration["Jwt:Issuer "], n    audience: _configuration["Jwt:Audience "], n    claims: claims, n    expires: DateTime.UtcNow.AddMinutes(15), // Access token n    signingCredentials: credentials n); n n// Refresh token nvar refreshToken = GenerateRefreshToken(); nawait SaveRefreshToken(userId, refreshToken);",
                      "explanation": "Token generation ve refresh token örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-token",
                  "question": "Access token ne kadar ömürlü olmalıdır?",
                  "options": [
                    "Uzun ömürlü",
                    "Kısa ömürlü",
                    "Sınırsız",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Kısa ömürlü",
                  "rationale": "Access token kısa ömürlü olmalıdır (örn: 15 dakika)."
                }
              ],
              "resources": [
                {
                  "id": "resource-token-docs",
                  "label": "Microsoft Docs: JWT",
                  "href": "https://learn.microsoft.com/aspnet/core/security/authentication/jwt-authn",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Token management ve refresh token hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-token",
                  "title": "Token Management ve Refresh Tokens",
                  "description": "JWT token yönetimi ve refresh token mekanizması uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "İleri",
                  "instructions": [
                    "Access token oluştur",
                    "Refresh token implement et",
                    "Token refresh endpoint oluştur"
                  ]
                }
              ]
            },
            {
              "label": "Security Best Practices",
              "href": "/education/lessons/authentication/security/security-best-practices",
              "description": "Authentication ve authorization için güvenlik en iyi uygulamalarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Password hashing güçlü algoritmalar kullanmalıdır",
                "HTTPS kullanılmalıdır",
                "CSRF protection yapılmalıdır",
                "Rate limiting authentication endpoint lerinde kullanılmalıdır"
              ],
              "sections": [
                {
                  "id": "security-best-practices",
                  "title": "Security Best Practices",
                  "summary": "Authentication ve authorization güvenlik en iyi uygulamaları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Password hashing güçlü algoritmalar kullanmalı, HTTPS kullanılmalı, CSRF protection yapılmalı ve rate limiting authentication endpoint lerinde kullanılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Password hashing nvar hashedPassword = _passwordHasher.HashPassword(user, password); n n// CSRF protection nservices.AddAntiforgery(options => n{ n    options.HeaderName ="X-CSRF-TOKEN "; n}); n n// Rate limiting nservices.AddRateLimiter(options => n{ n    options.AddFixedWindowLimiter("login ", opt => n    { n        opt.PermitLimit = 5; n        opt.Window = TimeSpan.FromMinutes(1); n    }); n});",
                      "explanation": "Security best practices örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-security",
                  "question": "Password hashing nasıl olmalıdır?",
                  "options": [
                    "Zayıf algoritmalar",
                    "Güçlü algoritmalar",
                    "Düz metin",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Güçlü algoritmalar",
                  "rationale": "Password hashing güçlü algoritmalar (örn: bcrypt, Argon2) kullanmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-security-docs",
                  "label": "Microsoft Docs: Security",
                  "href": "https://learn.microsoft.com/aspnet/core/security",
                  "type": "documentation",
                  "estimatedMinutes": 35,
                  "description": "Security best practices hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-security",
                  "title": "Security Best Practices",
                  "description": "Authentication ve authorization güvenlik best practices uygula.",
                  "type": "coding",
                  "estimatedMinutes": 40,
                  "difficulty": "İleri",
                  "instructions": [
                    "Güçlü password hashing kullan",
                    "CSRF protection ekle",
                    "Rate limiting yapılandır"
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


-- Module 07: Authentication & Authorization - Mini Tests
INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Identity Framework Kullanımı - Mini Test',
    'Identity Framework kullanımı hakkında temel bilgileri test eder.',
    '[
      {
        "question": "ASP.NET Core Identity Frameworkün temel amacı nedir?",
        "type": "single",
        "options": [
          "Sadece kullanıcı kaydı yapmak",
          "Kullanıcı kimlik doğrulama ve yetkilendirme işlemlerini yönetmek",
          "Sadece şifre sıfırlama",
          "Sadece rol yönetimi"
        ],
        "correctAnswer": 1,
        "explanation": "Identity Framework, kullanıcı kimlik doğrulama, yetkilendirme, şifre yönetimi ve rol yönetimi gibi tüm kimlik işlemlerini yönetir."
      },
      {
        "question": "Identity Frameworkte kullanıcı bilgileri hangi tabloda saklanır?",
        "type": "single",
        "options": [
          "users",
          "AspNetUsers",
          "UserAccounts",
          "Accounts"
        ],
        "correctAnswer": 1,
        "explanation": "Identity Framework varsayılan olarak AspNetUsers tablosunu kullanır."
      },
      {
        "question": "Identity Frameworkte UserManager sınıfı ne için kullanılır?",
        "type": "single",
        "options": [
          "Sadece kullanıcı oluşturma",
          "Kullanıcı yönetimi işlemleri (oluşturma, güncelleme, silme, şifre yönetimi)",
          "Sadece rol atama",
          "Sadece token oluşturma"
        ],
        "correctAnswer": 1,
        "explanation": "UserManager, kullanıcı oluşturma, güncelleme, silme, şifre yönetimi ve diğer kullanıcı işlemlerini yönetir."
      },
      {
        "question": "Identity Frameworkte SignInManager ne için kullanılır?",
        "type": "single",
        "options": [
          "Sadece giriş yapma",
          "Kullanıcı giriş/çıkış işlemleri ve kimlik doğrulama",
          "Sadece çıkış yapma",
          "Sadece şifre kontrolü"
        ],
        "correctAnswer": 1,
        "explanation": "SignInManager, kullanıcı giriş, çıkış ve kimlik doğrulama işlemlerini yönetir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authentication/identity/identity-framework',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Claims ve ClaimsPrincipal - Mini Test',
    'Claims ve ClaimsPrincipal kavramlarını test eder.',
    '[
      {
        "question": "Claim nedir?",
        "type": "single",
        "options": [
          "Kullanıcı adı",
          "Kullanıcı hakkında bir bilgi parçası (key-value çifti)",
          "Sadece rol bilgisi",
          "Sadece Email"
        ],
        "correctAnswer": 1,
        "explanation": "Claim, kullanıcı hakkında bir bilgi parçasıdır ve key-value çifti olarak temsil edilir."
      },
      {
        "question": "ClaimsPrincipal nedir?",
        "type": "single",
        "options": [
          "Sadece kullanıcı adı",
          "Kullanıcının tüm claimlerini içeren ve kimlik doğrulama durumunu temsil eden nesne",
          "Sadece rol bilgisi",
          "Sadece token"
        ],
        "correctAnswer": 1,
        "explanation": "ClaimsPrincipal, kullanıcının tüm claimlerini içeren ve kimlik doğrulama durumunu temsil eden ana nesnedir."
      },
      {
        "question": "Claim türleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece Name ve Role",
          "Name, Role, Email, Custom claims ve daha fazlası",
          "Sadece Email",
          "Sadece Custom claims"
        ],
        "correctAnswer": 1,
        "explanation": "Claim türleri Name, Role, Email gibi standart claimler ve özel (custom) claim ler içerebilir."
      },
      {
        "question": "User.Claims özelliği ne döndürür?",
        "type": "single",
        "options": [
          "Sadece rol claimleri",
          "Kullanıcının tüm claimlerini içeren koleksiyon",
          "Sadece email claimi",
          "Boş koleksiyon"
        ],
        "correctAnswer": 1,
        "explanation": "User.Claims, kullanıcının tüm claimlerini içeren bir koleksiyon döndürür."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authentication/claims/claims-principal',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Role-Based Authorization - Mini Test',
    'Role-Based Authorization kavramını test eder.',
    '[
      {
        "question": "Role-Based Authorization nedir?",
        "type": "single",
        "options": [
          "Kullanıcı adına göre yetkilendirme",
          "Kullanıcının rolüne göre erişim kontrolü",
          "Sadece admin kontrolü",
          "Sadece user kontrolü"
        ],
        "correctAnswer": 1,
        "explanation": "Role-Based Authorization, kullanıcının rolüne göre erişim kontrolü yapar."
      },
      {
        "question": "[Authorize(Roles ="Admin ")] attributeu ne yapar?",
        "type": "single",
        "options": [
          "Sadece Admin kullanıcılarına izin verir",
          "Admin rolüne sahip kullanıcılara erişim izni verir",
          "Tüm kullanıcılara izin verir",
          "Hiçbir kullanıcıya izin vermez"
        ],
        "correctAnswer": 1,
        "explanation": "[Authorize(Roles ="Admin ")] attributeu, Admin rolüne sahip kullanıcılara erişim izni verir."
      },
      {
        "question": "Birden fazla role nasıl izin verilir?",
        "type": "single",
        "options": [
          "[Authorize(Roles ="Admin,User ")]",
          "[Authorize(Roles ="Admin User ")]",
          "[Authorize(Roles ="Admin|User ")]",
          "Sadece tek rol kullanılabilir"
        ],
        "correctAnswer": 0,
        "explanation": "Birden fazla role izin vermek için virgülle ayrılmış rol listesi kullanılır: [Authorize(Roles ="Admin,User ")]"
      },
      {
        "question": "RoleManager ne için kullanılır?",
        "type": "single",
        "options": [
          "Sadece rol oluşturma",
          "Rol yönetimi işlemleri (oluşturma, silme, kullanıcıya rol atama)",
          "Sadece rol silme",
          "Sadece kullanıcı listeleme"
        ],
        "correctAnswer": 1,
        "explanation": "RoleManager, rol oluşturma, silme, güncelleme ve kullanıcıya rol atama işlemlerini yönetir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authorization/role-based',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Policy-Based Authorization Detayları - Mini Test',
    'Policy-Based Authorization detaylarını test eder.',
    '[
      {
        "question": "Policy-Based Authorization nedir?",
        "type": "single",
        "options": [
          "Sadece rol kontrolü",
          "Esnek ve özelleştirilebilir yetkilendirme kuralları",
          "Sadece claim kontrolü",
          "Sadece kullanıcı adı kontrolü"
        ],
        "correctAnswer": 1,
        "explanation": "Policy-Based Authorization, esnek ve özelleştirilebilir yetkilendirme kuralları sağlar."
      },
      {
        "question": "Policy nasıl tanımlanır?",
        "type": "single",
        "options": [
          "Sadece attribute ile",
          "Startup.cs veya Program.cste AddAuthorization ile",
          "Sadece controllerda",
          "Sadece viewda"
        ],
        "correctAnswer": 1,
        "explanation": "Policy, Startup.cs veya Program.cste AddAuthorization ile tanımlanır."
      },
      {
        "question": "[Authorize(Policy ="EditPolicy ")] ne yapar?",
        "type": "single",
        "options": [
          "Sadece EditPolicy adında bir role izin verir",
          "EditPolicy adındaki policyye göre yetkilendirme yapar",
          "Tüm kullanıcılara izin verir",
          "Hiçbir kullanıcıya izin vermez"
        ],
        "correctAnswer": 1,
        "explanation": "[Authorize(Policy ="EditPolicy ")] attributeu, EditPolicy adındaki policy ye göre yetkilendirme yapar."
      },
      {
        "question": "Policy requirement nedir?",
        "type": "single",
        "options": [
          "Sadece bir kural",
          "Policynin kontrol ettiği özel bir gereksinim",
          "Sadece bir claim",
          "Sadece bir rol"
        ],
        "correctAnswer": 1,
        "explanation": "Policy requirement, policynin kontrol ettiği özel bir gereksinimdir ve IAuthorizationRequirement interface ini implement eder."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authorization/policy-details',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'External Authentication Providers - Mini Test',
    'External Authentication Providers kullanımını test eder.',
    '[
      {
        "question": "External Authentication nedir?",
        "type": "single",
        "options": [
          "Sadece Google ile giriş",
          "Üçüncü parti sağlayıcılar (Google, Facebook, Microsoft vb.) ile kimlik doğrulama",
          "Sadece Facebook ile giriş",
          "Sadece Microsoft ile giriş"
        ],
        "correctAnswer": 1,
        "explanation": "External Authentication, Google, Facebook, Microsoft gibi üçüncü parti sağlayıcılar ile kimlik doğrulama yapmaktır."
      },
      {
        "question": "OAuth 2.0 nedir?",
        "type": "single",
        "options": [
          "Sadece bir protokol",
          "Yetkilendirme için kullanılan bir protokol",
          "Sadece bir kütüphane",
          "Sadece bir framework"
        ],
        "correctAnswer": 1,
        "explanation": "OAuth 2.0, yetkilendirme için kullanılan bir protokoldür ve external authenticationda kullanılır."
      },
      {
        "question": "AddAuthentication().AddGoogle() ne yapar?",
        "type": "single",
        "options": [
          "Sadece Googleı ekler",
          "Google authentication sağlayıcısını yapılandırır",
          "Sadece bir middleware ekler",
          "Hiçbir şey yapmaz"
        ],
        "correctAnswer": 1,
        "explanation": "AddAuthentication().AddGoogle(), Google authentication sağlayıcısını yapılandırır."
      },
      {
        "question": "External login callback nasıl işlenir?",
        "type": "single",
        "options": [
          "Sadece controllerda",
          "SignInManager.ExternalLoginSignInAsync() ile",
          "Sadece viewda",
          "Sadece middlewarede"
        ],
        "correctAnswer": 1,
        "explanation": "External login callback, SignInManager.ExternalLoginSignInAsync() metodu ile işlenir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authentication/external/external-providers',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Token Management ve Refresh Tokens - Mini Test',
    'Token Management ve Refresh Tokens kavramlarını test eder.',
    '[
      {
        "question": "JWT Token nedir?",
        "type": "single",
        "options": [
          "Sadece bir string",
          "JSON Web Token - kimlik doğrulama için kullanılan token formatı",
          "Sadece bir şifre",
          "Sadece bir ID"
        ],
        "correctAnswer": 1,
        "explanation": "JWT (JSON Web Token), kimlik doğrulama için kullanılan token formatıdır."
      },
      {
        "question": "Refresh Token nedir?",
        "type": "single",
        "options": [
          "Sadece yeni bir token",
          "Access tokenı yenilemek için kullanılan token",
          "Sadece bir şifre",
          "Sadece bir ID"
        ],
        "correctAnswer": 1,
        "explanation": "Refresh Token, access tokenı yenilemek için kullanılan özel bir tokendır."
      },
      {
        "question": "Access token süresi dolduğunda ne yapılır?",
        "type": "single",
        "options": [
          "Kullanıcı tekrar giriş yapmalı",
          "Refresh token kullanılarak yeni access token alınır",
          "Token otomatik yenilenir",
          "Hiçbir şey yapılamaz"
        ],
        "correctAnswer": 1,
        "explanation": "Access token süresi dolduğunda, refresh token kullanılarak yeni access token alınır."
      },
      {
        "question": "Token güvenliği için en iyi pratik nedir?",
        "type": "single",
        "options": [
          "Tokenları her yerde saklamak",
          "Tokenları güvenli şekilde saklamak (httpOnly cookie, secure storage)",
          "Tokenları URL de göndermek",
          "Tokenları herkese açık tutmak"
        ],
        "correctAnswer": 1,
        "explanation": "Token güvenliği için tokenlar güvenli şekilde saklanmalıdır (httpOnly cookie, secure storage)."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authentication/jwt/token-management',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "quizzes" (
    "id",
    "type",
    "title",
    "description",
    "questions",
    "passingScore",
    "lessonSlug",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'MINI_TEST',
    'Security Best Practices - Mini Test',
    'Security Best Practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Şifre güvenliği için en iyi pratik nedir?",
        "type": "single",
        "options": [
          "Şifreleri düz metin olarak saklamak",
          "Şifreleri hashlemek ve salt kullanmak",
          "Şifreleri şifrelemek",
          "Şifreleri herkese açık tutmak"
        ],
        "correctAnswer": 1,
        "explanation": "Şifreler her zaman hashlenmeli ve salt kullanılmalıdır. Identity Framework bunu otomatik yapar."
      },
      {
        "question": "HTTPS kullanımı neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece hızlı bağlantı için",
          "Veri şifreleme ve güvenli iletişim için",
          "Sadece görünüm için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "HTTPS, veri şifreleme ve güvenli iletişim sağlar, özellikle authentication işlemlerinde kritiktir."
      },
      {
        "question": "CSRF saldırısından korunmak için ne yapılır?",
        "type": "single",
        "options": [
          "Hiçbir şey yapılmaz",
          "Anti-forgery token kullanılır",
          "Sadece HTTPS kullanılır",
          "Sadece authentication yapılır"
        ],
        "correctAnswer": 1,
        "explanation": "CSRF saldırısından korunmak için anti-forgery token (ValidateAntiForgeryToken) kullanılır."
      },
      {
        "question": "SQL Injectiondan korunmak için ne yapılır?",
        "type": "single",
        "options": [
          "Raw SQL sorguları kullanmak",
          "Parameterized queries ve ORM kullanmak",
          "String concatenation kullanmak",
          "Hiçbir şey yapılmaz"
        ],
        "correctAnswer": 1,
        "explanation": "SQL Injectiondan korunmak için parameterized queries ve ORM (Entity Framework) kullanılmalıdır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/authentication/security/security-best-practices',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 08: Logging ve Exception Handling - Mini Tests

COMMIT;
