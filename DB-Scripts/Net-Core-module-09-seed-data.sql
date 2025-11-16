-- Module 09: Configuration Management - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-09-configuration",
          "title": "Configuration Management",
          "summary": "Environment bazlı konfigürasyon kaynaklarını yönet ve gizli bilgileri güvenli sakla.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında environment bazlı kaynakları birleştirerek sağlam konfigürasyon yönetimi kurabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Configuration%20Management",
            "description": "Konfigürasyon provider zincirini ve gizli anahtar yönetimini kavra."
          },
          "relatedTopics": [
            {
              "label": "Konfigürasyon Sağlayıcıları",
              "href": "/education/lessons/configuration/providers/overview",
              "description": "Json, environment ve user secrets kaynaklarını birlikte kullan."
            },
            {
              "label": "Options Pattern ile Çalışma",
              "href": "/education/lessons/configuration/options-pattern/validation",
              "description": "Strongly typed options sınıflarını doğrulama ile beraber uygula."
            },
            {
              "label": "Secret Manager Entegrasyonu",
              "href": "/education/lessons/configuration/secret-manager",
              "description": "Gizli anahtarları yerel geliştirici ortamında güvenle sakla."
            },
            {
              "label": "IConfiguration Interface Kullanımı",
              "href": "/education/lessons/configuration/iconfiguration/iconfiguration-interface",
              "description": "IConfiguration interface kullanımını ve configuration okuma yöntemlerini öğren."
            },
            {
              "label": "Environment Variables Yönetimi",
              "href": "/education/lessons/configuration/environment/environment-variables",
              "description": "Environment variables kullanımı ve yönetim stratejilerini uygula."
            },
            {
              "label": "Configuration Binding ve Validation",
              "href": "/education/lessons/configuration/binding/configuration-binding-validation",
              "description": "Configuration binding ve validation tekniklerini öğren."
            },
            {
              "label": "Configuration Reload ve Hot Reload",
              "href": "/education/lessons/configuration/reload/configuration-reload-hot-reload",
              "description": "Configuration reload ve hot reload mekanizmalarını kavra."
            },
            {
              "label": "Azure Key Vault Entegrasyonu",
              "href": "/education/lessons/configuration/azure/azure-key-vault-integration",
              "description": "Azure Key Vault ile güvenli configuration yönetimini uygula."
            },
            {
              "label": "Configuration Best Practices",
              "href": "/education/lessons/configuration/best-practices/configuration-best-practices",
              "description": "Configuration yönetimi için en iyi pratikleri öğren."
            },
            {
              "label": "Multi-Environment Configuration Stratejileri",
              "href": "/education/lessons/configuration/multi-environment/multi-environment-strategies",
              "description": "Çoklu ortam (dev, staging, production) configuration stratejilerini uygula."
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
    'Konfigürasyon Sağlayıcıları - Mini Test',
    'Configuration providers hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Configuration provider nedir?",
        "type": "single",
        "options": [
          "Sadece bir dosya",
          "Configuration verilerini okuyan kaynak (JSON, environment variables, vb.)",
          "Sadece bir database",
          "Sadece bir API"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration provider, configuration verilerini okuyan kaynaktır (JSON, environment variables, user secrets, vb.)."
      },
      {
        "question": "Configuration providerların yüklenme sırası neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Son eklenen provider önceki değerleri override eder",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration providerların yüklenme sırası önemlidir çünkü son eklenen provider önceki değerleri override eder."
      },
      {
        "question": "Hangi configuration providerlar varsayılan olarak kullanılır?",
        "type": "single",
        "options": [
          "Sadece JSON",
          "JSON, environment variables, command line arguments",
          "Sadece environment variables",
          "Sadece user secrets"
        ],
        "correctAnswer": 1,
        "explanation": "Varsayılan olarak JSON, environment variables ve command line arguments kullanılır."
      },
      {
        "question": "appsettings.json ve appsettings.{Environment}.json arasındaki fark nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "appsettings.{Environment}.json ortam bazlı override sağlar",
          "Sadece isim farkı var",
          "Sadece format farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "appsettings.{Environment}.json, ortam bazlı (Development, Staging, Production) override sağlar."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/providers/overview',
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
    'Options Pattern ile Çalışma - Mini Test',
    'Options pattern hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Options Pattern nedir?",
        "type": "single",
        "options": [
          "Sadece bir desen",
          "Strongly typed configuration değerlerini yönetmek için bir desen",
          "Sadece bir interface",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Options Pattern, strongly typed configuration değerlerini yönetmek için kullanılan bir desendir."
      },
      {
        "question": "IOptions<T> ve IOptionsSnapshot<T> arasındaki fark nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "IOptionsSnapshot<T> configuration değişikliklerini algılar",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "IOptionsSnapshot<T>, configuration değişikliklerini algılar ve her requestte yeni değerleri okur."
      },
      {
        "question": "Options validation nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece manuel kontrol",
          "IValidateOptions<T> interface veya Data Annotations ile",
          "Sadece try-catch ile",
          "Sadece if-else ile"
        ],
        "correctAnswer": 1,
        "explanation": "Options validation, IValidateOptions<T> interface veya Data Annotations ile yapılır."
      },
      {
        "question": "Configure<T>() metodu ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir sınıf oluşturur",
          "Options sınıfını configurationdan bind eder ve DI container a ekler",
          "Sadece bir değer okur",
          "Sadece bir dosya açar"
        ],
        "correctAnswer": 1,
        "explanation": "Configure<T>() metodu, options sınıfını configurationdan bind eder ve DI container a ekler."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/options-pattern/validation',
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
    'Secret Manager Entegrasyonu - Mini Test',
    'Secret Manager hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Secret Manager nedir?",
        "type": "single",
        "options": [
          "Sadece bir database",
          "Geliştirme ortamında gizli bilgileri güvenli saklamak için bir araç",
          "Sadece bir dosya",
          "Sadece bir API"
        ],
        "correctAnswer": 1,
        "explanation": "Secret Manager, geliştirme ortamında gizli bilgileri (connection strings, API keys vb.) güvenli saklamak için bir araçtır."
      },
      {
        "question": "Secret Managerda secret lar nerede saklanır?",
        "type": "single",
        "options": [
          "Proje klasöründe",
          "Kullanıcı profil klasöründe (Windows: %APPDATA%, Mac/Linux: ~/.microsoft/usersecrets)",
          "Sadece appsettings.jsonda",
          "Sadece environment variablesda"
        ],
        "correctAnswer": 1,
        "explanation": "Secret Managerda secret lar kullanıcı profil klasöründe saklanır ve proje klasörüne commit edilmez."
      },
      {
        "question": "dotnet user-secrets init ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir klasör oluşturur",
          "Projeye UserSecretsId ekler",
          "Sadece bir dosya oluşturur",
          "Hiçbir şey yapmaz"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet user-secrets init, projeye UserSecretsId ekler ve secret storageı başlatır."
      },
      {
        "question": "Secret Manager productionda kullanılmalı mı?",
        "type": "single",
        "options": [
          "Evet, her zaman",
          "Hayır, sadece development için. Productionda Azure Key Vault veya benzeri kullanılmalı",
          "Evet, ama sadece küçük projelerde",
          "Bazen"
        ],
        "correctAnswer": 1,
        "explanation": "Secret Manager sadece development için kullanılmalıdır. Productionda Azure Key Vault veya benzeri güvenli secret management araçları kullanılmalıdır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/secret-manager',
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
    'IConfiguration Interface Kullanımı - Mini Test',
    'IConfiguration interface hakkında temel bilgileri test eder.',
    '[
      {
        "question": "IConfiguration interface nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          ".NET Coreda configuration verilerine erişmek için kullanılan interface",
          "Sadece bir enum",
          "Sadece bir struct"
        ],
        "correctAnswer": 1,
        "explanation": "IConfiguration interface, .NET Coreda configuration verilerine erişmek için kullanılan standart interface  dir."
      },
      {
        "question": "Configuration[""Key:SubKey""] syntaxı ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir değer okur",
          "Nested configuration değerlerine erişim sağlar",
          "Sadece bir key ekler",
          "Sadece bir değer yazar"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration[""Key:SubKey""] syntaxı, nested configuration değerlerine erişim sağlar."
      },
      {
        "question": "GetSection() metodu ne döndürür?",
        "type": "single",
        "options": [
          "Sadece bir string",
          "IConfigurationSection - belirli bir configuration bölümü",
          "Sadece bir int",
          "Sadece bir bool"
        ],
        "correctAnswer": 1,
        "explanation": "GetSection() metodu, belirli bir configuration bölümünü (IConfigurationSection) döndürür."
      },
      {
        "question": "IConfiguration DI ile nasıl inject edilir?",
        "type": "single",
        "options": [
          "Sadece constructorda",
          "Constructorda IConfiguration parametresi ile",
          "Sadece property ile",
          "Sadece method ile"
        ],
        "correctAnswer": 1,
        "explanation": "IConfiguration, constructorda IConfiguration parametresi ile DI ile inject edilir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/iconfiguration/iconfiguration-interface',
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
    'Environment Variables Yönetimi - Mini Test',
    'Environment variables hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Environment variable nedir?",
        "type": "single",
        "options": [
          "Sadece bir değişken",
          "İşletim sistemi veya container seviyesinde tanımlanan değişken",
          "Sadece bir string",
          "Sadece bir config değeri"
        ],
        "correctAnswer": 1,
        "explanation": "Environment variable, işletim sistemi veya container seviyesinde tanımlanan değişkendir."
      },
      {
        "question": "Environment variablelar configuration provider sırasında nerede yer alır?",
        "type": "single",
        "options": [
          "En başta",
          "JSON dosyalarından sonra, command line argumentstan önce",
          "En sonda",
          "Sadece JSONdan önce"
        ],
        "correctAnswer": 1,
        "explanation": "Environment variablelar JSON dosyalarından sonra, command line arguments  tan önce yüklenir."
      },
      {
        "question": "Environment variable naming convention nedir?",
        "type": "single",
        "options": [
          "Sadece küçük harf",
          "Genellikle UPPER_CASE ve double colon (::) nested keys için",
          "Sadece büyük harf",
          "Sadece camelCase"
        ],
        "correctAnswer": 1,
        "explanation": "Environment variable naming convention genellikle UPPER_CASE ve double colon (::) nested keys için kullanılır."
      },
      {
        "question": "ASPNETCORE_ENVIRONMENT variable ne için kullanılır?",
        "type": "single",
        "options": [
          "Sadece bir değişken",
          "Uygulama ortamını (Development, Staging, Production) belirler",
          "Sadece bir config değeri",
          "Sadece bir flag"
        ],
        "correctAnswer": 1,
        "explanation": "ASPNETCORE_ENVIRONMENT variable, uygulama ortamını (Development, Staging, Production) belirler."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/environment/environment-variables',
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
    'Configuration Binding ve Validation - Mini Test',
    'Configuration binding ve validation hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Configuration binding nedir?",
        "type": "single",
        "options": [
          "Sadece bir değer okuma",
          "Configuration değerlerini strongly typed sınıflara otomatik map etme",
          "Sadece bir değer yazma",
          "Sadece bir değer silme"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration binding, configuration değerlerini strongly typed sınıflara otomatik map etme işlemidir."
      },
      {
        "question": "Bind() metodu ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir değer okur",
          "Configuration değerlerini bir sınıf instanceına bind eder",
          "Sadece bir değer yazar",
          "Sadece bir değer siler"
        ],
        "correctAnswer": 1,
        "explanation": "Bind() metodu, configuration değerlerini bir sınıf instanceına bind eder."
      },
      {
        "question": "Configuration validation neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Uygulama başlangıcında hatalı configurationı yakalamak için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration validation, uygulama başlangıcında hatalı configurationı yakalamak için önemlidir."
      },
      {
        "question": "Data Annotations ile validation nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece [Required] attribute ile",
          "Options sınıfına [Required], [Range], [Url] gibi attributelar ekleyerek",
          "Sadece [Range] attribute ile",
          "Sadece [Url] attribute ile"
        ],
        "correctAnswer": 1,
        "explanation": "Data Annotations ile validation, options sınıfına [Required], [Range], [Url] gibi attributelar ekleyerek yapılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/binding/configuration-binding-validation',
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
    'Configuration Reload ve Hot Reload - Mini Test',
    'Configuration reload ve hot reload hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Configuration reload nedir?",
        "type": "single",
        "options": [
          "Sadece bir değer okuma",
          "Configuration değişikliklerini uygulama çalışırken yeniden yükleme",
          "Sadece bir değer yazma",
          "Sadece bir değer silme"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration reload, configuration değişikliklerini uygulama çalışırken yeniden yükleme işlemidir."
      },
      {
        "question": "IOptionsSnapshot<T> neden reload destekler?",
        "type": "single",
        "options": [
          "Sadece performans için",
          "Her requestte yeni configuration değerlerini okur",
          "Sadece memory için",
          "Sadece görünüm için"
        ],
        "correctAnswer": 1,
        "explanation": "IOptionsSnapshot<T>, her requestte yeni configuration değerlerini okur, bu yüzden reload destekler."
      },
      {
        "question": "Hot reload nedir?",
        "type": "single",
        "options": [
          "Sadece bir değer okuma",
          "Kod değişikliklerini uygulama çalışırken yeniden yükleme",
          "Sadece bir değer yazma",
          "Sadece bir değer silme"
        ],
        "correctAnswer": 1,
        "explanation": "Hot reload, kod değişikliklerini uygulama çalışırken yeniden yükleme özelliğidir."
      },
      {
        "question": "Configuration reload productionda kullanılmalı mı?",
        "type": "single",
        "options": [
          "Evet, her zaman",
          "Dikkatli kullanılmalı, performans etkisi olabilir",
          "Hayır, hiçbir zaman",
          "Sadece küçük projelerde"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration reload productionda dikkatli kullanılmalıdır çünkü performans etkisi olabilir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/reload/configuration-reload-hot-reload',
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
    'Azure Key Vault Entegrasyonu - Mini Test',
    'Azure Key Vault hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Azure Key Vault nedir?",
        "type": "single",
        "options": [
          "Sadece bir database",
          "Gizli bilgileri (secrets, keys, certificates) güvenli saklamak için bulut servisi",
          "Sadece bir dosya",
          "Sadece bir API"
        ],
        "correctAnswer": 1,
        "explanation": "Azure Key Vault, gizli bilgileri (secrets, keys, certificates) güvenli saklamak için bir bulut servisidir."
      },
      {
        "question": "Azure Key Vaulta erişim nasıl sağlanır?",
        "type": "single",
        "options": [
          "Sadece connection string ile",
          "Managed Identity veya Service Principal ile",
          "Sadece username/password ile",
          "Sadece API key ile"
        ],
        "correctAnswer": 1,
        "explanation": "Azure Key Vaulta erişim, Managed Identity veya Service Principal ile sağlanır."
      },
      {
        "question": "AddAzureKeyVault() metodu ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir connection ekler",
          "Azure Key Vaultu configuration provider olarak ekler",
          "Sadece bir değer okur",
          "Sadece bir değer yazar"
        ],
        "correctAnswer": 1,
        "explanation": "AddAzureKeyVault() metodu, Azure Key Vaultu configuration provider olarak ekler."
      },
      {
        "question": "Azure Key Vault neden production için önerilir?",
        "type": "single",
        "options": [
          "Sadece performans için",
          "Güvenli secret management, audit logging ve access control sağlar",
          "Sadece maliyet için",
          "Sadece kolaylık için"
        ],
        "correctAnswer": 1,
        "explanation": "Azure Key Vault, güvenli secret management, audit logging ve access control sağladığı için production için önerilir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/azure/azure-key-vault-integration',
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
    'Configuration Best Practices - Mini Test',
    'Configuration best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Configuration best practiceste en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece JSON kullan",
          "Gizli bilgileri asla kod veya config dosyalarına commit etme",
          "Sadece environment variables kullan",
          "Sadece user secrets kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration best practiceste en önemli kural, gizli bilgileri asla kod veya config dosyalarına commit etmemektir."
      },
      {
        "question": "Configuration dosyalarında ne saklanmalıdır?",
        "type": "single",
        "options": [
          "Gizli bilgiler",
          "Sadece non-sensitive, default değerler",
          "Connection strings",
          "API keys"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration dosyalarında sadece non-sensitive, default değerler saklanmalıdır."
      },
      {
        "question": "Strongly typed options kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod",
          "Type safety, IntelliSense ve compile-time error checking",
          "Sadece daha hızlı",
          "Sadece daha az memory"
        ],
        "correctAnswer": 1,
        "explanation": "Strongly typed options kullanmanın avantajı, type safety, IntelliSense ve compile-time error checking sağlamasıdır."
      },
      {
        "question": "Configuration validation ne zaman yapılmalıdır?",
        "type": "single",
        "options": [
          "Sadece runtimeda",
          "Uygulama başlangıcında (startup)",
          "Sadece request sırasında",
          "Sadece hata olduğunda"
        ],
        "correctAnswer": 1,
        "explanation": "Configuration validation, uygulama başlangıcında (startup) yapılmalıdır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/best-practices/configuration-best-practices',
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
    'Multi-Environment Configuration Stratejileri - Mini Test',
    'Multi-environment configuration hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Multi-environment configuration nedir?",
        "type": "single",
        "options": [
          "Sadece bir config dosyası",
          "Farklı ortamlar (dev, staging, production) için farklı configuration",
          "Sadece bir environment variable",
          "Sadece bir secret"
        ],
        "correctAnswer": 1,
        "explanation": "Multi-environment configuration, farklı ortamlar (dev, staging, production) için farklı configuration yönetimidir."
      },
      {
        "question": "appsettings.{Environment}.json stratejisi nedir?",
        "type": "single",
        "options": [
          "Sadece bir dosya adı",
          "Ortam bazlı configuration override stratejisi",
          "Sadece bir klasör adı",
          "Sadece bir değişken adı"
        ],
        "correctAnswer": 1,
        "explanation": "appsettings.{Environment}.json stratejisi, ortam bazlı configuration override stratejisidir."
      },
      {
        "question": "Environment-specific configurationda öncelik sırası nedir?",
        "type": "single",
        "options": [
          "Sadece JSON",
          "appsettings.json -> appsettings.{Environment}.json -> Environment Variables -> Command Line",
          "Sadece environment variables",
          "Sadece command line"
        ],
        "correctAnswer": 1,
        "explanation": "Öncelik sırası: appsettings.json -> appsettings.{Environment}.json -> Environment Variables -> Command Line."
      },
      {
        "question": "Production configurationda ne yapılmalıdır?",
        "type": "single",
        "options": [
          "Tüm bilgileri config dosyasına koy",
          "Gizli bilgileri Azure Key Vault veya benzeri güvenli storageda sakla",
          "Sadece JSON kullan",
          "Sadece environment variables kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Production configurationda gizli bilgiler Azure Key Vault veya benzeri güvenli storage da saklanmalıdır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/configuration/multi-environment/multi-environment-strategies',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 10: Unit Test ve Integration Test - Mini Tests

COMMIT;
