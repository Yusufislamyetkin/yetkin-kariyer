-- Module 10: Unit Test ve Integration Test - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-10-testing",
          "title": "Unit Test ve Integration Test",
          "summary": "Test piramidini uygula, bağımlılıkları izole et ve pipeline a otomatik testler ekle.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında xUnit tabanlı birim testler yazıp WebApplicationFactory ile entegrasyon testleri oluşturabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Testing",
            "description": "Test piramidi, fixture yönetimi ve mock stratejilerini bir arada gör."
          },
          "relatedTopics": [
            {
              "label": "xUnit ile Birim Testler",
              "href": "/education/lessons/testing/xunit/unit-testing-basics",
              "description": "Arrange-Act-Assert kalıbını gerçek kod örnekleriyle uygula."
            },
            {
              "label": "WebApplicationFactory Kullanımı",
              "href": "/education/lessons/testing/integration/webapplicationfactory",
              "description": "API entegrasyon testlerinde in-memory server ayağa kaldır."
            },
            {
              "label": "Test Verisi ve Fixture Yönetimi",
              "href": "/education/lessons/testing/test-data/fixtures",
              "description": "Ortak test verilerini fixture ve builder desenleriyle yönet."
            },
            {
              "label": "Mock ve Stub Kullanımı",
              "href": "/education/lessons/testing/mocking/mock-stub-usage",
              "description": "Moq ve NSubstitute ile mock ve stub kullanımını öğren."
            },
            {
              "label": "Test Coverage ve Code Coverage",
              "href": "/education/lessons/testing/coverage/test-coverage-code-coverage",
              "description": "Test coverage ölçümü ve code coverage analizini uygula."
            },
            {
              "label": "Test Driven Development (TDD)",
              "href": "/education/lessons/testing/tdd/test-driven-development",
              "description": "TDD yaklaşımını ve red-green-refactor cycleını öğren."
            },
            {
              "label": "Integration Test Best Practices",
              "href": "/education/lessons/testing/integration/integration-test-best-practices",
              "description": "Integration test yazma ve yönetim için en iyi pratikleri uygula."
            },
            {
              "label": "Test Isolation ve Test Independence",
              "href": "/education/lessons/testing/isolation/test-isolation-independence",
              "description": "Test izolasyonu ve bağımsızlığı prensiplerini kavra."
            },
            {
              "label": "Test Data Builders ve Factories",
              "href": "/education/lessons/testing/test-data/test-data-builders-factories",
              "description": "Test data builder ve factory patternlerini uygula."
            },
            {
              "label": "Test Performance ve Optimization",
              "href": "/education/lessons/testing/performance/test-performance-optimization",
              "description": "Test performansını optimize etme tekniklerini öğren."
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
    'xUnit ile Birim Testler - Mini Test',
    'xUnit unit testing hakkında temel bilgileri test eder.',
    '[
      {
        "question": "xUnit nedir?",
        "type": "single",
        "options": [
          "Sadece bir framework",
          ".NET için açık kaynaklı unit testing framework",
          "Sadece bir kütüphane",
          "Sadece bir tool"
        ],
        "correctAnswer": 1,
        "explanation": "xUnit, .NET için açık kaynaklı unit testing frameworküdür."
      },
      {
        "question": "Arrange-Act-Assert (AAA) pattern nedir?",
        "type": "single",
        "options": [
          "Sadece bir isim",
          "Unit test yapısını organize etmek için bir pattern (Arrange: hazırlık, Act: eylem, Assert: doğrulama)",
          "Sadece bir metod",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "AAA pattern, unit test yapısını organize etmek için kullanılır: Arrange (hazırlık), Act (eylem), Assert (doğrulama)."
      },
      {
        "question": "[Fact] ve [Theory] attributeları arasındaki fark nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "[Fact] tek bir test, [Theory] parametreli testler için",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "[Fact] tek bir test için, [Theory] ise parametreli testler için kullanılır."
      },
      {
        "question": "Assert.Equal() ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir değer karşılaştırır",
          "İki değerin eşit olup olmadığını kontrol eder",
          "Sadece bir değer yazar",
          "Sadece bir değer okur"
        ],
        "correctAnswer": 1,
        "explanation": "Assert.Equal(), iki değerin eşit olup olmadığını kontrol eder."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/xunit/unit-testing-basics',
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
    'WebApplicationFactory Kullanımı - Mini Test',
    'WebApplicationFactory hakkında temel bilgileri test eder.',
    '[
      {
        "question": "WebApplicationFactory nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Integration testler için in-memory test server oluşturan factory",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "WebApplicationFactory, integration testler için in-memory test server oluşturan bir factorydir."
      },
      {
        "question": "WebApplicationFactory kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha hızlı",
          "Gerçek HTTP istekleri göndermeden test yapma imkanı",
          "Sadece daha az memory",
          "Sadece daha kolay"
        ],
        "correctAnswer": 1,
        "explanation": "WebApplicationFactory, gerçek HTTP istekleri göndermeden test yapma imkanı sağlar."
      },
      {
        "question": "WebApplicationFactory ile test yazarken ne yapılmalıdır?",
        "type": "single",
        "options": [
          "Sadece HTTP client oluştur",
          "Test serverı başlat, HTTP client oluştur ve istek gönder",
          "Sadece server başlat",
          "Sadece istek gönder"
        ],
        "correctAnswer": 1,
        "explanation": "WebApplicationFactory ile test yazarken test serverı başlat, HTTP client oluştur ve istek gönder."
      },
      {
        "question": "WebApplicationFactory custom configuration nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece constructorda",
          "WithWebHostBuilder() metodu ile",
          "Sadece property ile",
          "Sadece method ile"
        ],
        "correctAnswer": 1,
        "explanation": "WebApplicationFactory custom configuration, WithWebHostBuilder() metodu ile yapılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/integration/webapplicationfactory',
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
    'Test Verisi ve Fixture Yönetimi - Mini Test',
    'Test data ve fixture management hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Test fixture nedir?",
        "type": "single",
        "options": [
          "Sadece bir dosya",
          "Test için gerekli setup ve teardown işlemlerini içeren yapı",
          "Sadece bir sınıf",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Test fixture, test için gerekli setup ve teardown işlemlerini içeren yapıdır."
      },
      {
        "question": "xUnitte fixture nasıl oluşturulur?",
        "type": "single",
        "options": [
          "Sadece bir sınıf oluştur",
          "IClassFixture<T> veya ICollectionFixture<T> interfacelerini implement ederek",
          "Sadece bir method oluştur",
          "Sadece bir property oluştur"
        ],
        "correctAnswer": 1,
        "explanation": "xUnitte fixture, IClassFixture<T> veya ICollectionFixture<T> interface lerini implement ederek oluşturulur."
      },
      {
        "question": "Test data builder pattern nedir?",
        "type": "single",
        "options": [
          "Sadece bir pattern",
          "Test verilerini fluent API ile oluşturmayı sağlayan pattern",
          "Sadece bir sınıf",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Test data builder pattern, test verilerini fluent API ile oluşturmayı sağlayan bir patterndir."
      },
      {
        "question": "Fixture kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod",
          "Test setup kodunu tekrar kullanılabilir hale getirir",
          "Sadece daha hızlı",
          "Sadece daha az memory"
        ],
        "correctAnswer": 1,
        "explanation": "Fixture kullanmanın avantajı, test setup kodunu tekrar kullanılabilir hale getirmesidir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/test-data/fixtures',
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
    'Mock ve Stub Kullanımı - Mini Test',
    'Mock ve stub kullanımı hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Mock nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Test sırasında davranışı kontrol edilebilen sahte nesne",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Mock, test sırasında davranışı kontrol edilebilen sahte nesnedir."
      },
      {
        "question": "Stub nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Sabit yanıtlar döndüren sahte nesne",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Stub, sabit yanıtlar döndüren sahte nesnedir."
      },
      {
        "question": "Moq kütüphanesi ne için kullanılır?",
        "type": "single",
        "options": [
          "Sadece bir kütüphane",
          ".NET için mock nesneleri oluşturmak için",
          "Sadece bir tool",
          "Sadece bir framework"
        ],
        "correctAnswer": 1,
        "explanation": "Moq, .NET için mock nesneleri oluşturmak için kullanılan bir kütüphanedir."
      },
      {
        "question": "Mock.Of<T>() ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir sınıf oluşturur",
          "T tipinde bir mock nesnesi oluşturur",
          "Sadece bir interface oluşturur",
          "Sadece bir method çağırır"
        ],
        "correctAnswer": 1,
        "explanation": "Mock.Of<T>(), T tipinde bir mock nesnesi oluşturur."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/mocking/mock-stub-usage',
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
    'Test Coverage ve Code Coverage - Mini Test',
    'Test coverage ve code coverage hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Code coverage nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Testlerin kodun ne kadarını kapsadığını gösteren metrik",
          "Sadece bir sayı",
          "Sadece bir yüzde"
        ],
        "correctAnswer": 1,
        "explanation": "Code coverage, testlerin kodun ne kadarını kapsadığını gösteren bir metriktir."
      },
      {
        "question": "Code coverage %100 olmalı mı?",
        "type": "single",
        "options": [
          "Evet, her zaman",
          "Hayır, önemli olan kaliteli testler yazmaktır",
          "Evet, ama sadece küçük projelerde",
          "Bazen"
        ],
        "correctAnswer": 1,
        "explanation": "Code coverage %100 olmak zorunda değildir, önemli olan kaliteli testler yazmaktır."
      },
      {
        "question": "Hangi araçlar code coverage ölçümü için kullanılır?",
        "type": "single",
        "options": [
          "Sadece Visual Studio",
          "Coverlet, dotCover, Visual Studio Code Coverage vb.",
          "Sadece dotCover",
          "Sadece Coverlet"
        ],
        "correctAnswer": 1,
        "explanation": "Coverlet, dotCover, Visual Studio Code Coverage gibi araçlar code coverage ölçümü için kullanılır."
      },
      {
        "question": "Branch coverage nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Kodun tüm dallarının (if-else, switch-case) test edilip edilmediğini gösteren metrik",
          "Sadece bir sayı",
          "Sadece bir yüzde"
        ],
        "correctAnswer": 1,
        "explanation": "Branch coverage, kodun tüm dallarının (if-else, switch-case) test edilip edilmediğini gösteren bir metriktir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/coverage/test-coverage-code-coverage',
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
    'Test Driven Development (TDD) - Mini Test',
    'TDD hakkında temel bilgileri test eder.',
    '[
      {
        "question": "TDD nedir?",
        "type": "single",
        "options": [
          "Sadece bir metodoloji",
          "Test Driven Development - önce test yazıp sonra kodu yazma yaklaşımı",
          "Sadece bir pattern",
          "Sadece bir teknik"
        ],
        "correctAnswer": 1,
        "explanation": "TDD (Test Driven Development), önce test yazıp sonra kodu yazma yaklaşımıdır."
      },
      {
        "question": "Red-Green-Refactor cycle nedir?",
        "type": "single",
        "options": [
          "Sadece bir isim",
          "TDDnin temel döngüsü: Red (test yaz, fail ol), Green (kodu yaz, test geç), Refactor (kodu iyileştir)",
          "Sadece bir metod",
          "Sadece bir pattern"
        ],
        "correctAnswer": 1,
        "explanation": "Red-Green-Refactor cycle, TDDnin temel döngüsüdür: Red (test yaz, fail ol), Green (kodu yaz, test geç), Refactor (kodu iyileştir)."
      },
      {
        "question": "TDDnin avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod",
          "Daha iyi tasarım, daha az bug ve daha güvenli refactoring",
          "Sadece daha hızlı",
          "Sadece daha az memory"
        ],
        "correctAnswer": 1,
        "explanation": "TDDnin avantajı, daha iyi tasarım, daha az bug ve daha güvenli refactoring sağlamasıdır."
      },
      {
        "question": "TDDde ilk adım nedir?",
        "type": "single",
        "options": [
          "Kod yaz",
          "Test yaz (Red)",
          "Refactor yap",
          "Debug yap"
        ],
        "correctAnswer": 1,
        "explanation": "TDDde ilk adım, test yazmaktır (Red phase)."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/tdd/test-driven-development',
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
    'Integration Test Best Practices - Mini Test',
    'Integration test best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Integration test nedir?",
        "type": "single",
        "options": [
          "Sadece bir test türü",
          "Birden fazla bileşenin birlikte çalışmasını test eden test",
          "Sadece bir unit test",
          "Sadece bir end-to-end test"
        ],
        "correctAnswer": 1,
        "explanation": "Integration test, birden fazla bileşenin birlikte çalışmasını test eden testtir."
      },
      {
        "question": "Integration test best practiceste en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece hızlı test yaz",
          "Test verilerini izole et ve temizle",
          "Sadece mock kullan",
          "Sadece stub kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Integration test best practiceste en önemli kural, test verilerini izole etmek ve temizlemektir."
      },
      {
        "question": "Integration testte database nasıl yönetilir?",
        "type": "single",
        "options": [
          "Production database kullan",
          "In-memory database veya test database kullan",
          "Sadece mock database kullan",
          "Sadece stub database kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Integration testte in-memory database veya test database kullanılmalıdır."
      },
      {
        "question": "Integration test performansı nasıl optimize edilir?",
        "type": "single",
        "options": [
          "Sadece daha az test yaz",
          "Test verilerini paylaş, paralel çalıştır ve gereksiz setupları kaldır",
          "Sadece daha hızlı database kullan",
          "Sadece daha hızlı server kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Integration test performansı, test verilerini paylaşarak, paralel çalıştırarak ve gereksiz setupları kaldırarak optimize edilir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/integration/integration-test-best-practices',
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
    'Test Isolation ve Test Independence - Mini Test',
    'Test isolation ve independence hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Test isolation nedir?",
        "type": "single",
        "options": [
          "Sadece bir kural",
          "Testlerin birbirinden bağımsız çalışması",
          "Sadece bir pattern",
          "Sadece bir teknik"
        ],
        "correctAnswer": 1,
        "explanation": "Test isolation, testlerin birbirinden bağımsız çalışmasıdır."
      },
      {
        "question": "Test independence neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Testlerin herhangi bir sırada çalışabilmesi ve birbirini etkilememesi için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Test independence, testlerin herhangi bir sırada çalışabilmesi ve birbirini etkilememesi için önemlidir."
      },
      {
        "question": "Test isolation nasıl sağlanır?",
        "type": "single",
        "options": [
          "Sadece mock kullan",
          "Her test için yeni instance oluştur, shared state kullanma, test verilerini temizle",
          "Sadece stub kullan",
          "Sadece fixture kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Test isolation, her test için yeni instance oluşturarak, shared state kullanmayarak ve test verilerini temizleyerek sağlanır."
      },
      {
        "question": "Shared state test isolationı nasıl etkiler?",
        "type": "single",
        "options": [
          "Hiç etkilemez",
          "Testlerin birbirini etkilemesine ve yanlış sonuçlara neden olur",
          "Sadece performansı etkiler",
          "Sadece memoryyi etkiler"
        ],
        "correctAnswer": 1,
        "explanation": "Shared state, testlerin birbirini etkilemesine ve yanlış sonuçlara neden olur."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/isolation/test-isolation-independence',
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
    'Test Data Builders ve Factories - Mini Test',
    'Test data builders ve factories hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Test data builder pattern nedir?",
        "type": "single",
        "options": [
          "Sadece bir pattern",
          "Test verilerini fluent API ile oluşturmayı sağlayan pattern",
          "Sadece bir sınıf",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Test data builder pattern, test verilerini fluent API ile oluşturmayı sağlayan bir patterndir."
      },
      {
        "question": "Test data factory nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Test verilerini oluşturan factory sınıfı",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Test data factory, test verilerini oluşturan factory sınıfıdır."
      },
      {
        "question": "Builder pattern kullanmanın avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece daha az kod",
          "Okunabilir ve esnek test verisi oluşturma",
          "Sadece daha hızlı",
          "Sadece daha az memory"
        ],
        "correctAnswer": 1,
        "explanation": "Builder pattern kullanmanın avantajı, okunabilir ve esnek test verisi oluşturmadır."
      },
      {
        "question": "Fluent API nedir?",
        "type": "single",
        "options": [
          "Sadece bir API",
          "Method chaining ile okunabilir kod yazmayı sağlayan API",
          "Sadece bir interface",
          "Sadece bir pattern"
        ],
        "correctAnswer": 1,
        "explanation": "Fluent API, method chaining ile okunabilir kod yazmayı sağlayan bir APIdir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/test-data/test-data-builders-factories',
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
    'Test Performance ve Optimization - Mini Test',
    'Test performance ve optimization hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Test performance neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Hızlı feedback loop ve CI/CD pipeline performansı için",
          "Sadece memory için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Test performance, hızlı feedback loop ve CI/CD pipeline performansı için önemlidir."
      },
      {
        "question": "Test performansını optimize etmek için ne yapılabilir?",
        "type": "single",
        "options": [
          "Sadece daha az test yaz",
          "Paralel çalıştır, gereksiz setup/teardown kaldır, in-memory database kullan",
          "Sadece daha hızlı server kullan",
          "Sadece daha hızlı database kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Test performansını optimize etmek için paralel çalıştır, gereksiz setup/teardown kaldır ve in-memory database kullan."
      },
      {
        "question": "xUnit paralel test execution nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece otomatik",
          "xunit.runner.json dosyasında MaxParallelThreads ayarlanarak",
          "Sadece manuel",
          "Kullanılamaz"
        ],
        "correctAnswer": 1,
        "explanation": "xUnit paralel test execution, xunit.runner.json dosyasında MaxParallelThreads ayarlanarak yapılır."
      },
      {
        "question": "Test performansı için hangi database kullanılmalıdır?",
        "type": "single",
        "options": [
          "Production database",
          "In-memory database (SQLite in-memory, EF Core in-memory)",
          "Sadece SQL Server",
          "Sadece PostgreSQL"
        ],
        "correctAnswer": 1,
        "explanation": "Test performansı için in-memory database (SQLite in-memory, EF Core in-memory) kullanılmalıdır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/testing/performance/test-performance-optimization',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 11: Performans ve Caching Teknikleri - Mini Tests

COMMIT;
