-- Module 12: Asenkron Programlama (Async/Await) - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
          "id": "module-12-async",
          "title": "Asenkron Programlama (Async/Await)",
          "summary": "Async/await modelini doğru uygula, deadlock ve kaynak kullanım problemlerini önle.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında async/await modelini doğru bağlamda kullanıp deadlock risklerini ortadan kaldırabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Async%20Await",
            "description": "Task tabanlı modelde concurrency ve kaynak kullanımını yönet."
          },
          "relatedTopics": [
            {
              "label": "Task Tabanlı Programlamaya Giriş",
              "href": "/education/lessons/async/task-based-programming",
              "description": "Task ve await anahtar kelimelerinin çalışma mantığını kavra."
            },
            {
              "label": "Async Streams Kullanımı",
              "href": "/education/lessons/async/async-streams",
              "description": "IAsyncEnumerable ile veri akışlarını asenkron işle."
            },
            {
              "label": "CancellationToken Yönetimi",
              "href": "/education/lessons/async/cancellation-token",
              "description": "Operasyonları kontrollü şekilde iptal etmenin yöntemlerini uygula."
            },
            {
              "label": "Async/Await Best Practices",
              "href": "/education/lessons/async/best-practices/async-await-best-practices",
              "description": "Async/await kullanımında en iyi pratikleri öğren."
            },
            {
              "label": "Task.Run() ve Task.Factory.StartNew() Kullanımı",
              "href": "/education/lessons/async/task-run/task-run-factory-startnew",
              "description": "Task.Run() ve Task.Factory.StartNew() kullanım senaryolarını kavra."
            },
            {
              "label": "ConfigureAwait ve SynchronizationContext",
              "href": "/education/lessons/async/configureawait/configureawait-synchronization-context",
              "description": "ConfigureAwait kullanımı ve SynchronizationContext kavramını öğren."
            },
            {
              "label": "Deadlock Önleme Stratejileri",
              "href": "/education/lessons/async/deadlock/deadlock-prevention-strategies",
              "description": "Async/await kullanımında deadlock önleme tekniklerini uygula."
            },
            {
              "label": "Task.WhenAll ve Task.WhenAny Kullanımı",
              "href": "/education/lessons/async/task-whenall/task-whenall-whenany",
              "description": "Paralel async operasyonları yönetmek için Task.WhenAll ve Task.WhenAny kullan."
            },
            {
              "label": "ValueTask ve Task Performans",
              "href": "/education/lessons/async/valuetask/valuetask-task-performance",
              "description": "ValueTask kullanımı ve Task ile performans karşılaştırması."
            },
            {
              "label": "Async Exception Handling",
              "href": "/education/lessons/async/exception-handling/async-exception-handling",
              "description": "Async metodlarda exception handling tekniklerini öğren."
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
    'Task Tabanlı Programlamaya Giriş - Mini Test',
    'Task-based programming hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Task nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Asenkron operasyonu temsil eden bir nesne",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Task, asenkron operasyonu temsil eden bir nesnedir."
      },
      {
        "question": "await anahtar kelimesi ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir keyword",
          "Taskın tamamlanmasını bekler ve sonucu döndürür",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "await anahtar kelimesi, Taskın tamamlanmasını bekler ve sonucu döndürür."
      },
      {
        "question": "async metod ne döndürür?",
        "type": "single",
        "options": [
          "Sadece void",
          "Task, Task<T> veya void (sadece event handlerlarda)",
          "Sadece Task",
          "Sadece Task<T>"
        ],
        "correctAnswer": 1,
        "explanation": "async metod Task, Task<T> veya void (sadece event handlerlarda) döndürebilir."
      },
      {
        "question": "Task vs Task<T> farkı nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "Task değer döndürmez, Task<T> T tipinde değer döndürür",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "Task değer döndürmez, Task<T> ise T tipinde değer döndürür."
      }
    ]'::jsonb,
    70,
    '/education/lessons/async/task-based-programming',
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
    'Async Streams Kullanımı - Mini Test',
    'Async streams hakkında temel bilgileri test eder.',
    '[
      {
        "question": "IAsyncEnumerable nedir?",
        "type": "single",
        "options": [
          "Sadece bir interface",
          "Asenkron olarak veri akışı sağlayan interface",
          "Sadece bir sınıf",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "IAsyncEnumerable, asenkron olarak veri akışı sağlayan bir interfacedir."
      },
      {
        "question": "Async streams ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece her zaman",
          "Büyük veri setlerini asenkron olarak işlerken",
          "Sadece küçük veri setlerinde",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Async streams, büyük veri setlerini asenkron olarak işlerken kullanılır."
      },
      {
        "question": "await foreach ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir loop",
          "IAsyncEnumerable üzerinde asenkron iteration yapar",
          "Sadece bir method",
          "Sadece bir keyword"
        ],
        "correctAnswer": 1,
        "explanation": "await foreach, IAsyncEnumerable üzerinde asenkron iteration yapar."
      },
      {
        "question": "yield return async metodlarda nasıl kullanılır?",
        "type": "single",
        "options": [
          "Kullanılamaz",
          "IAsyncEnumerable döndüren metodlarda yield return await kullanılır",
          "Sadece yield return kullanılır",
          "Sadece await kullanılır"
        ],
        "correctAnswer": 1,
        "explanation": "IAsyncEnumerable döndüren metodlarda yield return await kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/async/async-streams',
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
    'CancellationToken Yönetimi - Mini Test',
    'CancellationToken hakkında temel bilgileri test eder.',
    '[
      {
        "question": "CancellationToken nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Asenkron operasyonları iptal etmek için kullanılan token",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "CancellationToken, asenkron operasyonları iptal etmek için kullanılan bir tokendır."
      },
      {
        "question": "CancellationToken nasıl kullanılır?",
        "type": "single",
        "options": [
          "Sadece parametre olarak",
          "Async metodlara parametre olarak geçilir ve operasyon içinde kontrol edilir",
          "Sadece property olarak",
          "Sadece field olarak"
        ],
        "correctAnswer": 1,
        "explanation": "CancellationToken, async metodlara parametre olarak geçilir ve operasyon içinde kontrol edilir."
      },
      {
        "question": "CancellationTokenSource nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "CancellationToken oluşturan ve iptal sinyali gönderen sınıf",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "CancellationTokenSource, CancellationToken oluşturan ve iptal sinyali gönderen bir sınıftır."
      },
      {
        "question": "OperationCanceledException ne zaman fırlatılır?",
        "type": "single",
        "options": [
          "Sadece hata olduğunda",
          "CancellationToken iptal edildiğinde",
          "Sadece exception olduğunda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "OperationCanceledException, CancellationToken iptal edildiğinde fırlatılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/async/cancellation-token',
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
    'Async/Await Best Practices - Mini Test',
    'Async/await best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Async/await best practiceste en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece async kullan",
          "Async void sadece event handlerlarda kullan, ConfigureAwait(false) library kodunda kullan",
          "Sadece await kullan",
          "Sadece Task kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Async/await best practiceste en önemli kurallar: async void sadece event handler larda kullan, ConfigureAwait(false) library kodunda kullan."
      },
      {
        "question": "Task.Result veya .Wait() neden kullanılmamalıdır?",
        "type": "single",
        "options": [
          "Sadece yavaş",
          "Deadlock riski oluşturur",
          "Sadece memory leak",
          "Sadece exception"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Result veya .Wait() kullanımı, deadlock riski oluşturur."
      },
      {
        "question": "Fire-and-forget pattern nedir?",
        "type": "single",
        "options": [
          "Sadece bir pattern",
          "Async operasyonu başlatıp sonucunu beklemeden devam etme",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Fire-and-forget pattern, async operasyonu başlatıp sonucunu beklemeden devam etme patternidir."
      },
      {
        "question": "Async metod isimlendirme convention nedir?",
        "type": "single",
        "options": [
          "Sadece Async suffix",
          "Async metodlar Async suffix ile bitmelidir",
          "Sadece Task prefix",
          "Sadece await prefix"
        ],
        "correctAnswer": 1,
        "explanation": "Async metodlar Async suffix ile bitmelidir (örn: GetDataAsync)."
      }
    ]'::jsonb,
    70,
    '/education/lessons/async/best-practices/async-await-best-practices',
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
    'Task.Run() ve Task.Factory.StartNew() Kullanımı - Mini Test',
    'Task.Run() ve Task.Factory.StartNew() hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Task.Run() ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "CPU bound işlemleri thread poolda çalıştırır",
          "Sadece bir sınıf",
          "Sadece bir interface"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Run(), CPU bound işlemleri thread poolda çalıştırır."
      },
      {
        "question": "Task.Factory.StartNew() ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Daha fazla kontrol sağlayan Task oluşturma metodu",
          "Sadece bir sınıf",
          "Sadece bir interface"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Factory.StartNew(), daha fazla kontrol sağlayan Task oluşturma metodudur."
      },
      {
        "question": "Task.Run() vs Task.Factory.StartNew() farkı nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "Task.Run() daha basit ve önerilir, Task.Factory.StartNew() daha fazla seçenek sunar",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Run() daha basit ve önerilir, Task.Factory.StartNew() daha fazla seçenek sunar."
      },
      {
        "question": "Task.Run() ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece her zaman",
          "CPU bound işlemleri thread poolda çalıştırmak için",
          "Sadece I/O işlemleri için",
          "Sadece database işlemleri için"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Run(), CPU bound işlemleri thread poolda çalıştırmak için kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/async/task-run/task-run-factory',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

COMMIT;

COMMIT;
