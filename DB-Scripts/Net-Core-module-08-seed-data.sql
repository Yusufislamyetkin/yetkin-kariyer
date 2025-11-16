-- Module 08: Logging ve Exception Handling - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-08-logging",
          "title": "Logging ve Exception Handling",
          "summary": "Tutarlı log formatları oluştur ve hataları kullanıcı dostu, güvenli şekilde ele al.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında yapılandırılmış loglama kurup merkezi hata yönetimi stratejileri uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Logging",
            "description": "Yapılandırılmış logging ve global exception yönetimini standartlaştır."
          },
          "relatedTopics": [
            {
              "label": "Serilog ile Yapılandırılmış Logging",
              "href": "/education/lessons/logging/serilog/structured-logging",
              "description": "Serilog sink leri ve enrichment stratejilerini uygula."
            },
            {
              "label": "Global Exception Orta Katmanı",
              "href": "/education/lessons/logging/exception-handling/global-handler",
              "description": "ProblemDetails yanıtlarıyla kullanıcı dostu hatalar üret."
            },
            {
              "label": "Log Scope Kullanımı",
              "href": "/education/lessons/logging/log-scope",
              "description": "Korelasyon kimlikleriyle ilişkili log zincirleri oluştur."
            },
            {
              "label": "ILogger Interface ve Logging Levels",
              "href": "/education/lessons/logging/ilogger/ilogger-interface-levels",
              "description": "ILogger interface kullanımı ve log seviyelerini öğren."
            },
            {
              "label": "Log Filtering ve Configuration",
              "href": "/education/lessons/logging/filtering/log-filtering-configuration",
              "description": "Log filtreleme ve yapılandırma stratejilerini uygula."
            },
            {
              "label": "Exception Logging Best Practices",
              "href": "/education/lessons/logging/exception/exception-logging-best-practices",
              "description": "Exception logging için en iyi pratikleri öğren."
            },
            {
              "label": "Structured Logging Patterns",
              "href": "/education/lessons/logging/patterns/structured-logging-patterns",
              "description": "Yapılandırılmış logging desenlerini ve kullanım senaryolarını kavra."
            },
            {
              "label": "Log Aggregation ve Centralized Logging",
              "href": "/education/lessons/logging/aggregation/centralized-logging",
              "description": "Log toplama ve merkezi logging sistemlerini yapılandır."
            },
            {
              "label": "Error Tracking ve Monitoring",
              "href": "/education/lessons/logging/monitoring/error-tracking-monitoring",
              "description": "Hata takibi ve izleme araçlarını entegre et."
            },
            {
              "label": "Log Retention ve Archiving",
              "href": "/education/lessons/logging/retention/log-retention-archiving",
              "description": "Log saklama ve arşivleme stratejilerini uygula."
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
    'Serilog ile Yapılandırılmış Logging - Mini Test',
    'Serilog kullanımı hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Serilog nedir?",
        "type": "single",
        "options": [
          "Sadece bir logging kütüphanesi",
          "Yapılandırılmış logging için .NET kütüphanesi",
          "Sadece bir database",
          "Sadece bir framework"
        ],
        "correctAnswer": 1,
        "explanation": "Serilog, .NET için yapılandırılmış logging sağlayan bir kütüphanedir."
      },
      {
        "question": "Serilog sink nedir?",
        "type": "single",
        "options": [
          "Sadece bir dosya",
          "Log çıktısının yazıldığı hedef (console, file, database vb.)",
          "Sadece bir console",
          "Sadece bir database"
        ],
        "correctAnswer": 1,
        "explanation": "Sink, log çıktısının yazıldığı hedeftir (console, file, database, cloud services vb.)."
      },
      {
        "question": "Serilog enrichment nedir?",
        "type": "single",
        "options": [
          "Sadece log seviyesi",
          "Log kayıtlarına otomatik olarak eklenen ek bilgiler",
          "Sadece timestamp",
          "Sadece message"
        ],
        "correctAnswer": 1,
        "explanation": "Enrichment, log kayıtlarına otomatik olarak eklenen ek bilgilerdir (machine name, thread ID, user ID vb.)."
      },
      {
        "question": "Serilogta log formatı nasıl belirlenir?",
        "type": "single",
        "options": [
          "Sadece kod içinde",
          "OutputTemplate veya structured logging ile",
          "Sadece config dosyasında",
          "Otomatik belirlenir"
        ],
        "correctAnswer": 1,
        "explanation": "Serilogta log formatı OutputTemplate veya structured logging (JSON) ile belirlenir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/serilog/structured-logging',
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
    'Global Exception Orta Katmanı - Mini Test',
    'Global exception handling hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Global exception handler nedir?",
        "type": "single",
        "options": [
          "Sadece bir middleware",
          "Uygulama genelinde exceptionları yakalayan ve işleyen mekanizma",
          "Sadece bir controller",
          "Sadece bir service"
        ],
        "correctAnswer": 1,
        "explanation": "Global exception handler, uygulama genelinde exceptionları yakalayan ve işleyen bir mekanizmadır."
      },
      {
        "question": "ProblemDetails nedir?",
        "type": "single",
        "options": [
          "Sadece bir error mesajı",
          "RFC 7807 standardına uygun hata detayları formatı",
          "Sadece bir status code",
          "Sadece bir exception"
        ],
        "correctAnswer": 1,
        "explanation": "ProblemDetails, RFC 7807 standardına uygun hata detayları formatıdır ve kullanıcı dostu hata yanıtları sağlar."
      },
      {
        "question": "Exception middlewarede hangi exception türleri yakalanmalıdır?",
        "type": "single",
        "options": [
          "Sadece ApplicationException",
          "Tüm exception türleri, ancak hassas bilgiler korunmalıdır",
          "Sadece exception",
          "Hiçbir exception yakalanmamalı"
        ],
        "correctAnswer": 1,
        "explanation": "Exception middlewarede tüm exception türleri yakalanmalı, ancak hassas bilgiler (stack trace, connection strings vb.) production da korunmalıdır."
      },
      {
        "question": "Global exception handlerda logging neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece debug için",
          "Hata takibi, debugging ve monitoring için kritiktir",
          "Sadece görünüm için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Global exception handlerda logging, hata takibi, debugging ve monitoring için kritiktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/exception-handling/global-handler',
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
    'Log Scope Kullanımı - Mini Test',
    'Log scope kullanımı hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Log scope nedir?",
        "type": "single",
        "options": [
          "Sadece bir log mesajı",
          "Belirli bir işlem bağlamındaki tüm log kayıtlarına otomatik eklenen bilgiler",
          "Sadece bir timestamp",
          "Sadece bir ID"
        ],
        "correctAnswer": 1,
        "explanation": "Log scope, belirli bir işlem bağlamındaki tüm log kayıtlarına otomatik eklenen bilgilerdir."
      },
      {
        "question": "Korelasyon ID nedir?",
        "type": "single",
        "options": [
          "Sadece bir kullanıcı ID",
          "Bir isteği veya işlemi takip etmek için kullanılan benzersiz tanımlayıcı",
          "Sadece bir request ID",
          "Sadece bir transaction ID"
        ],
        "correctAnswer": 1,
        "explanation": "Korelasyon ID, bir isteği veya işlemi takip etmek için kullanılan benzersiz tanımlayıcıdır."
      },
      {
        "question": "Logger.BeginScope() ne yapar?",
        "type": "single",
        "options": [
          "Sadece yeni bir log başlatır",
          "Yeni bir log scope oluşturur ve dispose edilene kadar aktif kalır",
          "Sadece bir log seviyesi belirler",
          "Sadece bir sink ekler"
        ],
        "correctAnswer": 1,
        "explanation": "Logger.BeginScope(), yeni bir log scope oluşturur ve dispose edilene kadar aktif kalır."
      },
      {
        "question": "Log scope kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod yazmak",
          "İlişkili log kayıtlarını kolayca takip etmek ve filtrelemek",
          "Sadece daha hızlı logging",
          "Sadece daha az memory kullanmak"
        ],
        "correctAnswer": 1,
        "explanation": "Log scope kullanmanın avantajı, ilişkili log kayıtlarını kolayca takip etmek ve filtrelemektir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/log-scope',
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
    'ILogger Interface ve Logging Levels - Mini Test',
    'ILogger interface ve log seviyeleri hakkında temel bilgileri test eder.',
    '[
      {
        "question": "ILogger interface nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          ".NET Coreda logging için standart interface",
          "Sadece bir enum",
          "Sadece bir struct"
        ],
        "correctAnswer": 1,
        "explanation": "ILogger interface, .NET Coreda logging için standart interface  dir."
      },
      {
        "question": "Log seviyeleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece Info ve Error",
          "Trace, Debug, Information, Warning, Error, Critical",
          "Sadece Debug ve Error",
          "Sadece Info, Warning, Error"
        ],
        "correctAnswer": 1,
        "explanation": "Log seviyeleri: Trace, Debug, Information, Warning, Error, Critical."
      },
      {
        "question": "LogLevel.Information ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece hatalarda",
          "Genel bilgilendirme mesajları için",
          "Sadece debug için",
          "Sadece kritik hatalarda"
        ],
        "correctAnswer": 1,
        "explanation": "LogLevel.Information, genel bilgilendirme mesajları için kullanılır."
      },
      {
        "question": "ILogger<T> kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod",
          "Log kayıtlarında kaynak sınıf bilgisini otomatik ekler",
          "Sadece daha hızlı",
          "Sadece daha az memory"
        ],
        "correctAnswer": 1,
        "explanation": "ILogger<T> kullanmanın avantajı, log kayıtlarında kaynak sınıf bilgisini otomatik eklemesidir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/ilogger/ilogger-interface-levels',
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
    'Log Filtering ve Configuration - Mini Test',
    'Log filtering ve configuration hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Log filtering nedir?",
        "type": "single",
        "options": [
          "Sadece log silme",
          "Belirli kriterlere göre log kayıtlarını filtreleme",
          "Sadece log seviyesi değiştirme",
          "Sadece log formatı değiştirme"
        ],
        "correctAnswer": 1,
        "explanation": "Log filtering, belirli kriterlere göre (log seviyesi, kategori, namespace vb.) log kayıtlarını filtrelemedir."
      },
      {
        "question": "appsettings.jsonda log filtering nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece LogLevel ile",
          "Logging:LogLevel bölümünde kategori ve seviye belirterek",
          "Sadece Logging ile",
          "Sadece Filter ile"
        ],
        "correctAnswer": 1,
        "explanation": "appsettings.jsonda log filtering, Logging:LogLevel bölümünde kategori ve seviye belirterek yapılır."
      },
      {
        "question": "Log filteringde wildcard kullanımı nedir?",
        "type": "single",
        "options": [
          "Sadece * karakteri",
          "Belirli bir namespace veya kategori grubunu filtrelemek için",
          "Sadece ? karakteri",
          "Kullanılamaz"
        ],
        "correctAnswer": 1,
        "explanation": "Wildcard (*) kullanımı, belirli bir namespace veya kategori grubunu filtrelemek için kullanılır."
      },
      {
        "question": "Productionda log seviyesi genellikle ne olmalıdır?",
        "type": "single",
        "options": [
          "Trace",
          "Warning veya Error",
          "Debug",
          "Information"
        ],
        "correctAnswer": 1,
        "explanation": "Productionda log seviyesi genellikle Warning veya Error olmalıdır, çünkü çok fazla log performansı etkiler."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/filtering/log-filtering-configuration',
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
    'Exception Logging Best Practices - Mini Test',
    'Exception logging best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Exception loggingde en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece exception mesajını logla",
          "Exceptionı tam olarak logla, ancak hassas bilgileri koru",
          "Sadece stack tracei logla",
          "Hiçbir şey loglama"
        ],
        "correctAnswer": 1,
        "explanation": "Exception loggingde exception  ı tam olarak loglamalı, ancak hassas bilgileri (şifreler, connection strings vb.) korumalıyız."
      },
      {
        "question": "Exceptionlar nerede loglanmalıdır?",
        "type": "single",
        "options": [
          "Sadece controllerda",
          "Global exception handler ve kritik noktalarda",
          "Sadece servicelerde",
          "Sadece middlewarede"
        ],
        "correctAnswer": 1,
        "explanation": "Exceptionlar global exception handler ve kritik noktalarda loglanmalıdır."
      },
      {
        "question": "Inner exception nedir?",
        "type": "single",
        "options": [
          "Sadece bir exception türü",
          "Bir exceptionın neden olduğu asıl exception",
          "Sadece bir hata mesajı",
          "Sadece bir stack trace"
        ],
        "correctAnswer": 1,
        "explanation": "Inner exception, bir exceptionın neden olduğu asıl exception  dır ve mutlaka loglanmalıdır."
      },
      {
        "question": "Exception loggingde context bilgisi neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece debug için",
          "Hatanın nedenini ve koşullarını anlamak için",
          "Sadece görünüm için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Exception loggingde context bilgisi (user ID, request ID, parameters vb.), hatanın nedenini ve koşullarını anlamak için kritiktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/exception/exception-logging-best-practices',
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
    'Structured Logging Patterns - Mini Test',
    'Structured logging patterns hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Structured logging nedir?",
        "type": "single",
        "options": [
          "Sadece düz metin log",
          "JSON veya key-value formatında yapılandırılmış log",
          "Sadece XML log",
          "Sadece binary log"
        ],
        "correctAnswer": 1,
        "explanation": "Structured logging, JSON veya key-value formatında yapılandırılmış log formatıdır."
      },
      {
        "question": "Structured loggingin avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az yer kaplar",
          "Log kayıtlarını kolayca sorgulanabilir ve analiz edilebilir yapar",
          "Sadece daha hızlıdır",
          "Sadece daha az memory kullanır"
        ],
        "correctAnswer": 1,
        "explanation": "Structured logging, log kayıtlarını kolayca sorgulanabilir ve analiz edilebilir yapar."
      },
      {
        "question": "Serilogta structured logging nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece string interpolation ile",
          "Placeholder syntax (@Property) ile",
          "Sadece string concatenation ile",
          "Sadece ToString() ile"
        ],
        "correctAnswer": 1,
        "explanation": "Serilogta structured logging, placeholder syntax (@Property) ile yapılır."
      },
      {
        "question": "Structured loggingde property adlandırma neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Tutarlı sorgulama ve analiz için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Structured loggingde property adlandırma, tutarlı sorgulama ve analiz için kritiktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/patterns/structured-logging-patterns',
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
    'Log Aggregation ve Centralized Logging - Mini Test',
    'Log aggregation ve centralized logging hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Log aggregation nedir?",
        "type": "single",
        "options": [
          "Sadece log birleştirme",
          "Farklı kaynaklardan gelen logların merkezi bir yerde toplanması",
          "Sadece log silme",
          "Sadece log filtreleme"
        ],
        "correctAnswer": 1,
        "explanation": "Log aggregation, farklı kaynaklardan gelen logların merkezi bir yerde toplanmasıdır."
      },
      {
        "question": "Centralized loggingin avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az yer kaplar",
          "Tüm logları tek bir yerden görüntüleme, sorgulama ve analiz etme",
          "Sadece daha hızlıdır",
          "Sadece daha az memory kullanır"
        ],
        "correctAnswer": 1,
        "explanation": "Centralized logging, tüm logları tek bir yerden görüntüleme, sorgulama ve analiz etme imkanı sağlar."
      },
      {
        "question": "Hangi araçlar centralized logging için kullanılır?",
        "type": "single",
        "options": [
          "Sadece Serilog",
          "ELK Stack, Seq, Application Insights, Splunk vb.",
          "Sadece NLog",
          "Sadece Log4Net"
        ],
        "correctAnswer": 1,
        "explanation": "ELK Stack (Elasticsearch, Logstash, Kibana), Seq, Application Insights, Splunk gibi araçlar centralized logging için kullanılır."
      },
      {
        "question": "Log aggregationda korelasyon ID neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Farklı servislerden gelen ilgili logları birleştirmek için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Log aggregationda korelasyon ID, farklı servislerden gelen ilgili log ları birleştirmek için kritiktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/aggregation/centralized-logging',
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
    'Error Tracking ve Monitoring - Mini Test',
    'Error tracking ve monitoring hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Error tracking nedir?",
        "type": "single",
        "options": [
          "Sadece hata sayma",
          "Uygulamadaki hataları otomatik olarak yakalama, gruplama ve bildirme",
          "Sadece log okuma",
          "Sadece exception yakalama"
        ],
        "correctAnswer": 1,
        "explanation": "Error tracking, uygulamadaki hataları otomatik olarak yakalama, gruplama ve bildirme sistemidir."
      },
      {
        "question": "Hangi araçlar error tracking için kullanılır?",
        "type": "single",
        "options": [
          "Sadece Serilog",
          "Sentry, Application Insights, Raygun, Rollbar vb.",
          "Sadece NLog",
          "Sadece Log4Net"
        ],
        "correctAnswer": 1,
        "explanation": "Sentry, Application Insights, Raygun, Rollbar gibi araçlar error tracking için kullanılır."
      },
      {
        "question": "Error trackingde alerting neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Kritik hataları anında bildirmek ve hızlı müdahale sağlamak için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Error trackingde alerting, kritik hataları anında bildirmek ve hızlı müdahale sağlamak için önemlidir."
      },
      {
        "question": "Error trackingde fingerprinting nedir?",
        "type": "single",
        "options": [
          "Sadece bir ID",
          "Benzer hataları gruplamak için kullanılan teknik",
          "Sadece bir hash",
          "Sadece bir signature"
        ],
        "correctAnswer": 1,
        "explanation": "Fingerprinting, benzer hataları gruplamak için kullanılan bir tekniktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/monitoring/error-tracking-monitoring',
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
    'Log Retention ve Archiving - Mini Test',
    'Log retention ve archiving hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Log retention nedir?",
        "type": "single",
        "options": [
          "Sadece log silme",
          "Logların ne kadar süre saklanacağını belirleme politikası",
          "Sadece log arşivleme",
          "Sadece log filtreleme"
        ],
        "correctAnswer": 1,
        "explanation": "Log retention, logların ne kadar süre saklanacağını belirleme politikasıdır."
      },
      {
        "question": "Log retention politikası neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Depolama maliyetlerini kontrol etmek ve yasal gereklilikleri karşılamak için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Log retention politikası, depolama maliyetlerini kontrol etmek ve yasal gereklilikleri karşılamak için önemlidir."
      },
      {
        "question": "Log archiving nedir?",
        "type": "single",
        "options": [
          "Sadece log silme",
          "Eski logları uzun süreli saklama için arşivleme",
          "Sadece log filtreleme",
          "Sadece log birleştirme"
        ],
        "correctAnswer": 1,
        "explanation": "Log archiving, eski logları uzun süreli saklama için arşivleme işlemidir."
      },
      {
        "question": "Log retention stratejisi nasıl belirlenir?",
        "type": "single",
        "options": [
          "Sadece rastgele",
          "Yasal gereklilikler, iş ihtiyaçları ve maliyet faktörlerine göre",
          "Sadece performansa göre",
          "Sadece storage boyutuna göre"
        ],
        "correctAnswer": 1,
        "explanation": "Log retention stratejisi, yasal gereklilikler, iş ihtiyaçları ve maliyet faktörlerine göre belirlenir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/logging/retention/log-retention-archiving',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 09: Configuration Management - Mini Tests

COMMIT;
