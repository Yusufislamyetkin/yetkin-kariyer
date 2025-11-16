-- Kariyer Platform Database Cleanup Script
-- Bu script veritabanındaki tüm tabloları güvenli şekilde temizler.
-- Çalıştırmadan önce önemli verilerinizi yedekleyin.

BEGIN;

-- Enable pgcrypto extension for gen_random_uuid() function
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

TRUNCATE TABLE
    "chat_message_receipts",
    "chat_attachments",
    "chat_messages",
    "chat_group_memberships",
    "chat_groups",
    "friendships",
    "hackathon_submissions",
    "hackathon_team_members",
    "hackathon_applications",
    "hackathon_teams",
    "hackathons",
    "hackaton_leaderboard_entries",
    "bug_fix_leaderboard_entries",
    "live_coding_leaderboard_entries",
    "test_leaderboard_entries",
    "hackaton_attempts",
    "bug_fix_attempts",
    "live_coding_attempts",
    "test_attempts",
    "dashboard_goal_plans",
    "user_streaks",
    "employer_comments",
    "leaderboard_entries",
    "daily_goals",
    "user_badges",
    "badges",
    "wrong_questions",
    "assistant_threads",
    "learning_paths",
    "career_plans",
    "job_applications",
    "jobs",
    "cvs",
    "cv_templates",
    "interview_attempts",
    "interviews",
    "quiz_attempts",
    "quizzes",
    "courses",
    "app_users"
RESTART IDENTITY CASCADE;

INSERT INTO "app_users" (
    "id",
    "email",
    "password",
    "name",
    "role",
    "profileImage",
    "createdAt",
    "updatedAt"
)
VALUES
    (
        'user-ayse-k',
        'ayse.kaya@example.com',
        '$2b$10$examplehashedpasswordaaaaaaaaaaaaaaaaaaaaaa',
        'Ayşe Kaya',
        'candidate',
        'https://avatars.dicebear.com/api/initials/Ayse%20Kaya.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user-burak-t',
        'burak.tan@example.com',
        '$2b$10$examplehashedpasswordbbbbbbbbbbbbbbbbbbbbbb',
        'Burak Tan',
        'candidate',
        'https://avatars.dicebear.com/api/initials/Burak%20Tan.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user-cem-y',
        'cem.yildiz@example.com',
        '$2b$10$examplehashedpasswordcccccccccccccccccccccc',
        'Cem Yıldız',
        'candidate',
        'https://avatars.dicebear.com/api/initials/Cem%20Yildiz.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user-derya-a',
        'derya.aksoy@example.com',
        '$2b$10$examplehashedpassworddddddddddddddddddddddd',
        'Derya Aksoy',
        'candidate',
        'https://avatars.dicebear.com/api/initials/Derya%20Aksoy.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user-emre-s',
        'emre.sahin@example.com',
        '$2b$10$examplehashedpasswordeeeeeeeeeeeeeeeeeeeeee',
        'Emre Şahin',
        'candidate',
        'https://avatars.dicebear.com/api/initials/Emre%20Sahin.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user-admin-ozgur',
        'ozgur.demir@example.com',
        '$2b$10$examplehashedpasswordffffffffffffffffffffff',
        'Özgür Demir',
        'admin',
        'https://avatars.dicebear.com/api/initials/Ozgur%20Demir.svg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

INSERT INTO "friendships" (
    "id",
    "requesterId",
    "addresseeId",
    "status",
    "requestedAt",
    "respondedAt",
    "cancelledAt",
    "blockedById"
)
VALUES
    (
        'friend-ayse-burak',
        'user-ayse-k',
        'user-burak-t',
        'accepted',
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        CURRENT_TIMESTAMP - INTERVAL '9 days',
        NULL,
        NULL
    ),
    (
        'friend-ayse-derya',
        'user-ayse-k',
        'user-derya-a',
        'pending',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        NULL,
        NULL,
        NULL
    ),
    (
        'friend-burak-emre',
        'user-burak-t',
        'user-emre-s',
        'accepted',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        CURRENT_TIMESTAMP - INTERVAL '6 days',
        NULL,
        NULL
    );
INSERT INTO "courses" (
    "id",
    "title",
    "description",
    "category",
    "field",
    "subCategory",
    "expertise",
    "topic",
    "topicContent",
    "difficulty",
    "content",
    "estimatedDuration",
    "createdAt",
    "updatedAt"
)
VALUES (
    'course-dotnet-roadmap',
    '.NET Core Backend Roadmap',
    'Modern .NET Core uygulamaları geliştirmek için uçtan uca yol haritası ve uygulamalı modüller.',
    'software-development',
    'backend',
    'dotnet',
    'backend',
    '.NET Core',
    '.NET Core Roadmap',
    'intermediate',
    $$
    {
      "overview": {
        "description": "Modern .NET Core altyapısını temel dil becerilerinden production seviyesinde dağıtımlara kadar kapsayan yoğun bir öğrenme yolu.",
        "targetAudience": [
          "Backend geliştiricileri",
          "Full-stack geliştiriciler",
          "Yeni nesil servis mimarileri ile çalışmak isteyen yazılım mühendisleri"
        ],
        "skills": [
          "C# 12 ve modern dil özellikleri",
          ".NET Core mimarisi",
          "ASP.NET Core MVC ve minimal APIler",
          "Güvenlik, test, gözlemlenebilirlik",
          "Container, CI/CD ve mikroservis tasarımı"
        ],
        "estimatedDurationMinutes": 1470,
        "outcomes": [
          ".NET Core mimari katmanlarını açıklayabilir ve uygun tasarım kararları verebilir",
          "ASP.NET Core MVC ve Web API projelerini production seviyesinde inşa edip yönetebilir",
          "Test, logging, configuration ve performans optimizasyonu gibi operasyonel gereksinimleri uygulayabilir",
          "Container, CI/CD ve mikroservis mimarileriyle ölçeklenebilir dağıtım senaryoları kurabilir"
        ]
      },
      "learningObjectives": [
        "C# dil özellikleri ve .NET Core runtime bileşenlerini sağlam temele oturtmak",
        "Katmanlı ve bağımlılık yönetimi güçlü backend projeleri tasarlamak",
        "Güvenlik, hata yönetimi, konfigürasyon ve gözlemlenebilirlik pratiklerini standartlaştırmak",
        "Container, CI/CD ve mikroservis mimarileriyle gerçek dünya dağıtımlarına hazırlanmak"
      ],
      "prerequisites": [
        "Temel programlama bilgisi ve en az bir obje yönelimli dil deneyimi",
        "HTTP, REST ve JSON kavramlarına aşinalık",
        "Git temel iş akışlarını uygulama deneyimi"
      ],
      "modules": [
        {
          "id": "module-01-csharp",
          "title": "C# Temelleri",
          "summary": "Modern C# dil özelliklerini pekiştir ve nesne yönelimli prensiplerle üretkenliğini artır.",
          "durationMinutes": 300,
          "objectives": [
            "Modern C# dil sözdizimini, koleksiyonları ve pattern matching gibi özellikleri üretken şekilde kullanmak",
            "Döngü kontrol akışını analiz ederek hata ayıklama ve performans iyileştirme yapabilmek",
            "Farklı iterasyon ihtiyaçları için uygun C# döngü yapısını seçebilmek",
            "Değişkenler, veri tipleri ve tip dönüşümlerini doğru şekilde kullanmak",
            "Metotları, parametreleri ve dönüş değerlerini etkili şekilde tasarlamak",
            "Sınıflar, nesneler ve nesne yönelimli programlama prensiplerini uygulamak",
            "Diziler ve koleksiyonları verimli şekilde yönetmek",
            "Hata yönetimi ve exception handling mekanizmalarını kullanmak"
          ],
          "activities": [
            {
              "id": "activity-for-loop-anatomy",
              "title": "For döngüsünün anatomisini incele",
              "type": "reading",
              "estimatedMinutes": 10,
              "prompt": "For döngüsünün başlangıç, koşul ve artış bölümlerinin nasıl birlikte çalıştığını kavramak için örnek kodları yorumla."
            },
            {
              "id": "activity-trace-iteration",
              "title": "İterasyon akışını takip et",
              "type": "interactive",
              "estimatedMinutes": 12,
              "prompt": "Bir döngü çalışırken sayaç değerlerinin nasıl güncellendiğini adım adım izleyerek terminal çıktıları ile eşleştir."
            },
            {
              "id": "activity-build-practice",
              "title": "Mini pratik görevleri tamamla",
              "type": "coding",
              "estimatedMinutes": 15,
              "prompt": "Basit egzersizlerle döngü koşullarını değiştirerek farklı senaryoları kodla ve sonuçlarını gözlemle."
            },
            {
              "id": "activity-variables-types",
              "title": "Değişken tiplerini keşfet",
              "type": "reading",
              "estimatedMinutes": 15,
              "prompt": "C# veri tiplerini (int, string, bool, double) ve tip güvenliğini örneklerle incele."
            },
            {
              "id": "activity-method-design",
              "title": "Metot tasarımı pratiği",
              "type": "coding",
              "estimatedMinutes": 20,
              "prompt": "Parametreli metotlar yazarak kod tekrarını azalt ve modüler programlama yapısını kur."
            },
            {
              "id": "activity-class-creation",
              "title": "Sınıf ve nesne oluşturma",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": "Sınıf tanımları yaparak encapsulation ve nesne yönelimli programlama prensiplerini uygula."
            },
            {
              "id": "activity-collections-practice",
              "title": "Koleksiyonlar ile çalışma",
              "type": "coding",
              "estimatedMinutes": 20,
              "prompt": "List, Dictionary ve Array koleksiyonlarını kullanarak veri yönetimi senaryolarını kodla."
            },
            {
              "id": "activity-exception-handling",
              "title": "Hata yönetimi uygulaması",
              "type": "coding",
              "estimatedMinutes": 18,
              "prompt": "try-catch blokları ile exception handling mekanizmalarını gerçek senaryolarda kullan."
            }
          ],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=C%23%20Temelleri",
            "description": "Modülün öne çıkan ders ve kaynaklarını tek ekranda incele."
          },
          "relatedTopics": [
            {
              "label": "For Döngüsü Nedir?",
              "href": "/education/lessons/csharp/loops/for",
              "description": "İterasyon mantığını ve sözdizimini örneklerle öğren.",
              "estimatedDurationMinutes": 35,
              "level": "Başlangıç",
              "keyTakeaways": [
                "For döngüsünün üç ana bölümünü (başlatma, koşul, artış) doğru şekilde yapılandırabilirsin.",
                "İterasyon akışını analiz ederek döngünün kaç kez çalışacağını önceden tahmin edebilirsin.",
                "Gerçek senaryolarda döngüleri optimize etmek için break ve continue gibi kontrol ifadelerini seçebilirsin."
              ],
              "sections": [
                {
                  "id": "for-foundations",
                  "title": "Temel Yapı Taşları",
                  "summary": "For döngüsünün üç ana bileşenini hikayeleştirerek öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Bir for döngüsü; başlangıç, koşul ve artış ifadelerinin uyumlu çalışmasıyla kontrollü yinelemeyi mümkün kılar. Her bir blok yanlış kurgulandığında tüm akış dengesizleşir."
                    },
                    {
                      "type": "list",
                      "ordered": true,
                      "items": [
                        "Başlatma (initialization) bölümünde sayaç değerini belirlersin.",
                        "Koşul (condition) ifadesi her iterasyonda doğrulanır ve akışın devam edip etmeyeceğine karar verir.",
                        "Artış (iteration) bölümü sayaç değişkenini güncelleyerek ilerleyişi kontrol eder."
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "for (int i = 0; i < 5; i++) n{ n    Console.WriteLine($ \"Sayaç: {i}\"); n}",
                      "explanation": "Sayaç 0dan başlar, koşul sağlandığı sürece döngü bloğu çalışır ve her turda artış ifadesi uygulanır."
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "İpucu",
                      "body": "Sayaç değişkenini yalnızca döngü içinde kullanacaksan scopeu daraltmak için tanımı for ifadesinin içinde bırak."
                    }
                  ]
                },
                {
                  "id": "for-flow-control",
                  "title": "Akış Kontrolünü Cesurca Yönet",
                  "summary": "Iterasyon akışını adım adım takip ederek hata yapma riskini azalt.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Her iterasyon dört kritik adımdan oluşur. Koşulu bilinçli tasarlamak sonsuz döngüleri önler, artış ifadesinin doğru yerde olması performans kazandırır."
                    },
                    {
                      "type": "list",
                      "ordered": true,
                      "items": [
                        "Sayaç değişkeni başlangıç değerine set edilir.",
                        "Koşul ifadesi değerlendirilir; false olduğunda döngü sona erer.",
                        "Döngü bloğu çalıştırılır ve gerekli işlemler yapılır.",
                        "Artış ifadesi çalışır, sayaç güncellenir ve akış koşula geri döner."
                      ]
                    },
                    {
                      "type": "quote",
                      "body": \"Kontrol akışını diyagram üzerinde canlandırmak, karmaşık iterasyonları zihinde çözümlemenin en hızlı yoludur. \",
                      "attribution": "Grace Hopper"
                    },
                    {
                      "type": "text",
                      "body": "Koşulu yanlış tasarlamak sonsuz döngülere yol açabilir; sayaç güncellemesinin ulaşılabilir olduğundan emin ol."
                    }
                  ]
                },
                {
                  "id": "for-real-world",
                  "title": "Gerçek Dünya Senaryoları",
                  "summary": "Diziler, koleksiyonlar ve koşullu filtreler için pratik örnekler.",
                  "content": [
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "int toplam = 0; nfor (int n = 1; n <= 10; n++) n{ n    toplam += n; n} nConsole.WriteLine($ \"Toplam: {toplam}\");",
                      "explanation": "1 ile 10 arasındaki sayıların toplamını hesaplamak için birikimli toplam yaklaşımı kullanılır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "for (int i = 0; i <= 20; i++) n{ n    if (i % 2 != 0) n    { n        continue; n    } n    Console.WriteLine(i); n}",
                      "explanation": "continue ifadesi koşulu sağlamayan durumları atlayarak yalnızca çift sayıları ekrana yazdırır."
                    },
                    {
                      "type": "callout",
                      "variant": "warning",
                      "title": "Desk Check Yap",
                      "body": "Gerçek veri kümelerinde iterasyon adımlarını birkaç örnek değerle zihinden veya kağıt üzerinde takip etmek hataları çok erken yakalamanı sağlar."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-iteration-count",
                  "question": \"for (int i = 1; i <= 5; i += 2) \" döngüsü kaç kez çalışır?",
                  "options": ["2", "3", "4", "5"],
                  "answer": "3",
                  "rationale": "Sayaç değerleri 1, 3 ve 5 olur; koşul 5ten sonra sağlanmadığı için üç iterasyon gerçekleşir."
                },
                {
                  "id": "checkpoint-break-keyword",
                  "question": "Bir döngüyü mevcut iterasyonun dışında tamamen sonlandırmak için hangi anahtar kelime kullanılır?",
                  "options": ["continue", "stop", "break", "return"],
                  "answer": "break",
                  "rationale": "break ifadesi döngüyü veya switch bloğunu anında sonlandırır."
                }
              ],
              "resources": [
                {
                  "id": "resource-msdocs-for",
                  "label": "Microsoft Docs: for statement (C# reference)",
                  "href": "https://learn.microsoft.com/tr-tr/dotnet/csharp/language-reference/statements/iteration-statements#the-for-statement",
                  "type": "reading",
                  "estimatedMinutes": 8,
                  "description": "For döngüsünün resmi C# belgeleri üzerinden ayrıntılı anlatımı."
                },
                {
                  "id": "resource-practice-for",
                  "label": "Temel döngü egzersizleri",
                  "href": "https://www.programiz.com/csharp-programming/for-loop",
                  "type": "practice",
                  "estimatedMinutes": 12,
                  "description": "Basitten orta seviyeye kadar örnekler ile döngü pratikleri yap."
                }
              ],
              "practice": [
                {
                  "id": "practice-sum-until-n",
                  "title": "1 den N e kadar toplama",
                  "description": "Kullanıcıdan alınan pozitif N değeri için 1 den N e kadar olan sayıların toplamını hesaplayan bir program yaz.",
                  "type": "coding",
                  "estimatedMinutes": 15,
                  "difficulty": "Kolay",
                  "instructions": [
                    "Kullanıcıdan pozitif bir tamsayı alın.",
                    "Toplamı saklamak için başlangıç değeri 0 olan bir değişken tanımlayın.",
                    "For döngüsü ile sayaç değerini 1 den N e kadar artırarak toplamı güncelleyin.",
                    "Sonucu Console.WriteLine ile ekrana yazdırın."
                  ]
                },
                {
                  "id": "practice-even-filter",
                  "title": "Çift sayıları filtrele",
                  "description": "0 ile 50 arasında kalan tüm çift sayıları ekrana yazdıran bir for döngüsü tasarla.",
                  "type": "coding",
                  "estimatedMinutes": 10,
                  "difficulty": "Kolay",
                  "instructions": [
                    "Sayaç başlangıcını 0, bitiş değerini 50 olarak belirleyin.",
                    "if koşulu ile sayaç değerinin çift olup olmadığını kontrol edin.",
                    "Çift sayı olduğunda değeri ekrana yazdırın."
                  ]
                }
              ]
            },
            {
              "label": "Foreach Döngüsü Nasıl Kullanılır?",
              "href": "/education/lessons/csharp/loops/foreach",
              "description": "Koleksiyonlar üzerinde güvenli yineleme yapısını keşfet.",
              "estimatedDurationMinutes": 30,
              "level": "Başlangıç",
              "keyTakeaways": [
                "Foreach döngüsü koleksiyonlar üzerinde güvenli ve okunabilir iterasyon sağlar.",
                "Index yönetimi gerektirmeyen durumlarda foreach tercih edilmelidir.",
                "IEnumerable arayüzünü implement eden tüm koleksiyonlarda kullanılabilir."
              ],
              "sections": [
                {
                  "id": "foreach-foundations",
                  "title": "Foreach Temelleri",
                  "summary": "Foreach döngüsünün sözdizimi ve kullanım alanlarını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Foreach döngüsü, bir koleksiyonun her elemanı üzerinde işlem yapmak için tasarlanmış özel bir yapıdır. Index yönetimi gerektirmez ve daha okunabilir kod yazmanı sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "string[] isimler = {"Ali ","Ayşe ","Mehmet \" }; nforeach (string isim in isimler) n{ n    Console.WriteLine(isim); n}",
                      "explanation": "Foreach döngüsü ile bir dizinin tüm elemanlarını kolayca işleyebilirsin."
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "İpucu",
                      "body": "Foreach döngüsü sırasında koleksiyonu değiştirmek hata verir. Değişiklik yapman gerekiyorsa for döngüsü kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-foreach-modify",
                  "question": "Foreach döngüsü içinde koleksiyonu değiştirmek neden hata verir?",
                  "options": [
                    "Performans sorunları yaratır",
                    "Koleksiyonun durumu değiştiği için iterasyon tutarsız hale gelir",
                    "Foreach sadece okuma amaçlıdır",
                    "Derleyici hatası verir"
                  ],
                  "answer": "Koleksiyonun durumu değiştiği için iterasyon tutarsız hale gelir",
                  "rationale": "Foreach döngüsü başlangıçta koleksiyonun snapshotını alır. Koleksiyon değişirse iterasyon tutarsız hale gelir."
                }
              ]
            },
            {
              "label": "While ve Do-While Döngüleri",
              "href": "/education/lessons/csharp/loops/while",
              "description": "Koşul tabanlı döngüler ile esnek iterasyon yapıları oluştur.",
              "estimatedDurationMinutes": 40,
              "level": "Başlangıç",
              "keyTakeaways": [
                "While döngüsü koşul başta kontrol edilir, do-while döngüsü sonda kontrol edilir.",
                "Do-while döngüsü en az bir kez çalışır, while döngüsü hiç çalışmayabilir.",
                "Kullanıcı girişi ve menü sistemleri için ideal döngü yapılarıdır."
              ],
              "sections": [
                {
                  "id": "while-foundations",
                  "title": "While Döngüsü",
                  "summary": "Koşul tabanlı tekrarlama yapısını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "While döngüsü, belirli bir koşul true olduğu sürece kod bloğunu tekrar tekrar çalıştırır. Koşul her iterasyonun başında kontrol edilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "int sayac = 0; nwhile (sayac < 5) n{ n    Console.WriteLine($ \"Sayaç: {sayac}\"); n    sayac++; n}",
                      "explanation": "While döngüsü koşul sağlandığı sürece çalışır. Sayaç güncellemesini unutma, yoksa sonsuz döngü oluşur."
                    },
                    {
                      "type": "callout",
                      "variant": "warning",
                      "title": "Dikkat",
                      "body": "While döngülerinde koşulu mutlaka döngü içinde güncelle, aksi halde sonsuz döngü oluşur."
                    }
                  ]
                },
                {
                  "id": "dowhile-foundations",
                  "title": "Do-While Döngüsü",
                  "summary": "En az bir kez çalışan döngü yapısını keşfet.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Do-while döngüsü, kod bloğunu önce çalıştırır, sonra koşulu kontrol eder. Bu sayede döngü en az bir kez çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "int secim; ndo n{ n    Console.WriteLine("Menü: 1-Çıkış "); n    secim = int.Parse(Console.ReadLine()); n} while (secim != 1);",
                      "explanation": "Do-while döngüsü kullanıcı girişi ve menü sistemleri için idealdir çünkü en az bir kez çalışır."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-while-vs-dowhile",
                  "question": "While ve do-while döngüleri arasındaki temel fark nedir?",
                  "options": [
                    "Do-while daha hızlıdır",
                    "Do-while en az bir kez çalışır, while hiç çalışmayabilir",
                    "While sadece sayısal değerlerle çalışır",
                    "Do-while sadece koleksiyonlarla kullanılır"
                  ],
                  "answer": "Do-while en az bir kez çalışır, while hiç çalışmayabilir",
                  "rationale": "Do-while döngüsü koşulu sonda kontrol ettiği için kod bloğu en az bir kez çalışır."
                }
              ]
            },
            {
              "label": "Değişkenler ve Veri Tipleri",
              "href": "/education/lessons/csharp/basics/variables-types",
              "description": "C# veri tiplerini, değişken tanımlamayı ve tip dönüşümlerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Başlangıç",
              "keyTakeaways": [
                "C# güçlü tipli bir dildir; her değişkenin tipi belirtilmelidir.",
                "Value typelar stack te, reference type lar heap te saklanır.",
                "var anahtar kelimesi tip çıkarımı için kullanılabilir.",
                "Tip dönüşümleri explicit (açık) veya implicit (örtük) olabilir."
              ],
              "sections": [
                {
                  "id": "variables-basics",
                  "title": "Değişken Tanımlama",
                  "summary": "Değişken tanımlama kurallarını ve best practiceleri öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "C# dilinde değişkenler kullanılmadan önce tanımlanmalıdır. Her değişkenin bir tipi vardır ve bu tip değişkenin saklayabileceği veri türünü belirler."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "int yas = 25; nstring isim ="Ahmet "; nbool aktif = true; ndouble maas = 5000.50; nvar sehir ="İstanbul "; // Tip çıkarımı",
                      "explanation": "Farklı veri tiplerinde değişken tanımlama örnekleri. var anahtar kelimesi ile tip çıkarımı yapılabilir."
                    },
                    {
                      "type": "list",
                      "ordered": false,
                      "items": [
                        "int: Tamsayılar için (32-bit)",
                        "string: Metin verileri için",
                        "bool: Mantıksal değerler (true/false)",
                        "double: Ondalıklı sayılar için",
                        "decimal: Finansal hesaplamalar için yüksek hassasiyet"
                      ]
                    }
                  ]
                },
                {
                  "id": "type-conversion",
                  "title": "Tip Dönüşümleri",
                  "summary": "Tip dönüşümlerini güvenli şekilde yapmayı öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "C# dilinde tip dönüşümleri iki şekilde yapılabilir: implicit (örtük) ve explicit (açık) dönüşümler."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Implicit dönüşüm (küçük tip -> büyük tip) nint sayi = 10; nlong buyukSayi = sayi; // Otomatik dönüşüm n n// Explicit dönüşüm (büyük tip -> küçük tip) ndouble ondalik = 9.8; nint tamSayi = (int)ondalik; // 9 (kesirli kısım atılır) n n// Parse ve TryParse nstring metin ="123 "; nint sonuc = int.Parse(metin); nbool basarili = int.TryParse(metin, out int deger);",
                      "explanation": "Farklı tip dönüşüm yöntemleri. TryParse güvenli dönüşüm için tercih edilmelidir."
                    },
                    {
                      "type": "callout",
                      "variant": "warning",
                      "title": "Dikkat",
                      "body": "Parse metodu başarısız olursa exception fırlatır. TryParse kullanarak güvenli dönüşüm yap."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-var-keyword",
                  "question": "var anahtar kelimesi ne zaman kullanılmalıdır?",
                  "options": [
                    "Her zaman, kod daha kısa olur",
                    "Tip açıkça belli olduğunda ve okunabilirliği artırdığında",
                    "Sadece string değişkenler için",
                    "Hiçbir zaman kullanılmamalıdır"
                  ],
                  "answer": "Tip açıkça belli olduğunda ve okunabilirliği artırdığında",
                  "rationale": "var kullanımı kod okunabilirliğini artırabilir ancak tip belirsizliği yaratmamalıdır."
                }
              ]
            },
            {
              "label": "Metotlar ve Fonksiyonlar",
              "href": "/education/lessons/csharp/basics/methods",
              "description": "Metot tanımlama, parametreler ve dönüş değerleri ile modüler kod yazmayı öğren.",
              "estimatedDurationMinutes": 50,
              "level": "Başlangıç",
              "keyTakeaways": [
                "Metotlar kod tekrarını azaltır ve modüler programlama sağlar.",
                "Parametreler metoda veri geçirmek için kullanılır.",
                "Return ifadesi metottan değer döndürmek için kullanılır.",
                "Void metotlar değer döndürmez, sadece işlem yapar."
              ],
              "sections": [
                {
                  "id": "method-basics",
                  "title": "Metot Tanımlama",
                  "summary": "Metot yapısını ve temel kullanımını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Metotlar, belirli bir işlevi yerine getiren kod bloklarıdır. Metotlar sayesinde kod tekrarını azaltır ve programı daha modüler hale getirirsin."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Void metot (değer döndürmez) nstatic void Selamla(string isim) n{ n    Console.WriteLine($ \"Merhaba {isim}!\"); n} n n// Değer döndüren metot nstatic int Topla(int a, int b) n{ n    return a + b; n} n n// Metot çağırma nSelamla( "Ahmet"); nint sonuc = Topla(5, 3); // 8",
                      "explanation": "Void ve değer döndüren metot örnekleri. Metotlar static olarak tanımlanabilir."
                    }
                  ]
                },
                {
                  "id": "method-parameters",
                  "title": "Parametreler ve Overloading",
                  "summary": "Farklı parametre türlerini ve metot aşırı yüklemesini öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Metotlar parametre alabilir ve aynı isimde farklı parametrelerle birden fazla metot tanımlanabilir (overloading)."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Varsayılan parametreli metot nstatic void Yazdir(string mesaj, bool buyukHarf = false) n{ n    if (buyukHarf) n        Console.WriteLine(mesaj.ToUpper()); n    else n        Console.WriteLine(mesaj); n} n n// Metot overloading nstatic int Carp(int a, int b) => a * b; nstatic double Carp(double a, double b) => a * b; n n// Kullanım nYazdir("Merhaba "); // Varsayılan parametre kullanılır nYazdir("Merhaba ", true); // Parametre belirtilir",
                      "explanation": "Varsayılan parametreler ve metot aşırı yükleme örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-return-statement",
                  "question": "Return ifadesi ne zaman kullanılır?",
                  "options": [
                    "Sadece void metotlarda",
                    "Değer döndüren metotlarda ve metottan erken çıkmak için",
                    "Sadece string döndüren metotlarda",
                    "Hiçbir zaman gerekli değildir"
                  ],
                  "answer": "Değer döndüren metotlarda ve metottan erken çıkmak için",
                  "rationale": "Return ifadesi hem değer döndürmek hem de metottan erken çıkmak için kullanılabilir."
                }
              ]
            },
            {
              "label": "Sınıflar ve Nesneler",
              "href": "/education/lessons/csharp/oop/classes-objects",
              "description": "Nesne yönelimli programlamanın temellerini, sınıf tanımlama ve nesne oluşturmayı öğren.",
              "estimatedDurationMinutes": 60,
              "level": "Orta",
              "keyTakeaways": [
                "Sınıflar nesnelerin şablonudur, nesneler sınıfların örnekleridir.",
                "Encapsulation (kapsülleme) veri ve metotları bir arada tutar.",
                "Constructor (yapıcı) metotlar nesne oluşturulurken çalışır.",
                "Properties (özellikler) veri erişimini kontrol eder."
              ],
              "sections": [
                {
                  "id": "class-basics",
                  "title": "Sınıf Tanımlama",
                  "summary": "Sınıf yapısını ve temel bileşenlerini öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Sınıflar, nesne yönelimli programlamanın temel yapı taşlarıdır. Bir sınıf, veri (alanlar) ve bu veriyi işleyen metotları bir arada tutar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public class Kisi n{ n    // Alanlar (Fields) n    private string ad; n    private int yas; n     n    // Property (Özellik) n    public string Ad n    { n        get { return ad; } n        set { ad = value; } n    } n     n    // Constructor (Yapıcı) n    public Kisi(string ad, int yas) n    { n        this.ad = ad; n        this.yas = yas; n    } n     n    // Metot n    public void BilgileriGoster() n    { n        Console.WriteLine($ \"Ad: {ad}, Yaş: {yas}\"); n    } n} n n// Kullanım nKisi kisi1 = new Kisi( "Ahmet", 25); nkisi1.BilgileriGoster();",
                      "explanation": "Sınıf tanımlama, constructor, property ve metot örnekleri. new anahtar kelimesi ile nesne oluşturulur."
                    }
                  ]
                },
                {
                  "id": "encapsulation",
                  "title": "Kapsülleme (Encapsulation)",
                  "summary": "Veri gizleme ve erişim kontrolünü öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Encapsulation, verilerin doğrudan erişimini engelleyip kontrollü erişim sağlar. Bu sayede veri bütünlüğü korunur."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public class Hesap n{ n    private double bakiye; // Private alan n     n    public double Bakiye // Public property n    { n        get { return bakiye; } n        private set { bakiye = value; } // Sadece sınıf içinden set edilebilir n    } n     n    public void ParaYatir(double miktar) n    { n        if (miktar > 0) n            bakiye += miktar; n    } n     n    public bool ParaCek(double miktar) n    { n        if (miktar > 0 && miktar <= bakiye) n        { n            bakiye -= miktar; n            return true; n        } n        return false; n    } n}",
                      "explanation": "Encapsulation örneği. Bakiye alanı private, erişim property ve metotlar üzerinden kontrol ediliyor."
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "İpucu",
                      "body": "Private alanlar sınıf dışından erişilemez. Public property ve metotlar kontrollü erişim sağlar."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-constructor",
                  "question": "Constructor metot ne zaman çalışır?",
                  "options": [
                    "Sınıf tanımlandığında",
                    "Nesne oluşturulduğunda (new ile)",
                    "Metot çağrıldığında",
                    "Program başladığında"
                  ],
                  "answer": "Nesne oluşturulduğunda (new ile)",
                  "rationale": "Constructor metotlar nesne oluşturulurken otomatik olarak çalışır ve nesneyi başlatır."
                }
              ]
            },
            {
              "label": "Diziler ve Koleksiyonlar",
              "href": "/education/lessons/csharp/collections/arrays-lists",
              "description": "Diziler, List, Dictionary ve diğer koleksiyon türlerini öğren ve verimli kullan.",
              "estimatedDurationMinutes": 55,
              "level": "Başlangıç",
              "keyTakeaways": [
                "Diziler sabit boyutludur, List dinamik boyutludur.",
                "Dictionary key-value çiftleri için idealdir.",
                "Koleksiyonlar System.Collections.Generic namespaceinde bulunur.",
                "LINQ ile koleksiyonlar üzerinde güçlü sorgular yazılabilir."
              ],
              "sections": [
                {
                  "id": "arrays-basics",
                  "title": "Diziler (Arrays)",
                  "summary": "Dizi tanımlama ve kullanımını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Diziler, aynı tipte birden fazla değeri saklamak için kullanılır. Boyutları sabittir ve tanımlandıktan sonra değiştirilemez."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Dizi tanımlama nint[] sayilar = new int[5]; // 5 elemanlı dizi nint[] sayilar2 = { 1, 2, 3, 4, 5 }; // Başlangıç değerleri ile n n// Dizi kullanımı nsayilar[0] = 10; nint ilkEleman = sayilar[0]; nint uzunluk = sayilar.Length; n n// Çok boyutlu dizi nint[,] matris = new int[3, 3];",
                      "explanation": "Dizi tanımlama ve kullanım örnekleri. Diziler 0-based index kullanır."
                    }
                  ]
                },
                {
                  "id": "lists-collections",
                  "title": "List ve Koleksiyonlar",
                  "summary": "Dinamik koleksiyonları öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "List ve diğer koleksiyonlar dinamik boyutludur. Eleman ekleme ve çıkarma işlemleri kolaydır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Collections.Generic; n n// List kullanımı nList<string> isimler = new List<string>(); nisimler.Add("Ahmet "); nisimler.Add("Ayşe "); nisimler.Remove("Ahmet "); nint sayi = isimler.Count; n n// Dictionary kullanımı (Key-Value) nDictionary<string, int> yaslar = new Dictionary<string, int>(); nyaslar["Ahmet "] = 25; nyaslar["Ayşe "] = 30; nint ahmetYasi = yaslar["Ahmet "]; n n// HashSet (benzersiz elemanlar) nHashSet<int> benzersizSayilar = new HashSet<int> { 1, 2, 3, 2, 1 }; // {1, 2, 3}",
                      "explanation": "List, Dictionary ve HashSet kullanım örnekleri. Her koleksiyon türü farklı senaryolar için idealdir."
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "İpucu",
                      "body": "Dictionaryde var olmayan bir key e erişmeye çalışırsan KeyNotFoundException hatası alırsın. TryGetValue kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-list-vs-array",
                  "question": "Dizi ve List arasındaki temel fark nedir?",
                  "options": [
                    "List daha hızlıdır",
                    "Dizi dinamik boyutludur, List sabit boyutludur",
                    "List dinamik boyutludur, dizi sabit boyutludur",
                    "Hiçbir fark yoktur"
                  ],
                  "answer": "List dinamik boyutludur, dizi sabit boyutludur",
                  "rationale": "Diziler tanımlandıktan sonra boyutu değiştirilemez, List ise eleman ekleme/çıkarma ile dinamik olarak büyüyüp küçülebilir."
                }
              ]
            },
            {
              "label": "Hata Yönetimi (Exception Handling)",
              "href": "/education/lessons/csharp/basics/exception-handling",
              "description": "Try-catch blokları ile hataları yakalama ve yönetme tekniklerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Başlangıç",
              "keyTakeaways": [
                "Try-catch blokları hataları yakalayıp uygulamanın çökmesini önler.",
                "Finally bloğu her durumda çalışır, kaynak temizleme için idealdir.",
                "Spesifik exception türlerini yakalamak genel Exceptiondan daha iyidir.",
                "Exceptionları loglamak ve kullanıcıya anlamlı mesajlar göstermek önemlidir."
              ],
              "sections": [
                {
                  "id": "try-catch-basics",
                  "title": "Try-Catch Yapısı",
                  "summary": "Temel hata yakalama mekanizmasını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Try-catch blokları, çalışma zamanında oluşabilecek hataları yakalayıp uygulamanın çökmesini önler. Hatalar exception olarak fırlatılır ve catch bloğunda yakalanır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "try n{ n    int sayi = int.Parse(Console.ReadLine()); n    int sonuc = 10 / sayi; n    Console.WriteLine($ \"Sonuç: {sonuc}\"); n} ncatch (FormatException ex) n{ n    Console.WriteLine($ \"Geçersiz format: {ex.Message} "); n} ncatch (DivideByZeroException ex) n{ n    Console.WriteLine($ \"Sıfıra bölme hatası: {ex.Message} "); n} ncatch (Exception ex) n{ n    Console.WriteLine($ \"Beklenmeyen hata: {ex.Message} "); n} nfinally n{ n    Console.WriteLine("İşlem tamamlandı. "); n}",
                      "explanation": "Try-catch-finally yapısı. Spesifik exceptionlar önce, genel Exception en sonda yakalanmalıdır."
                    },
                    {
                      "type": "callout",
                      "variant": "warning",
                      "title": "Dikkat",
                      "body": "Catch bloklarını spesifikten genele doğru sırala. Genel Exception catch bloğu en sonda olmalıdır."
                    }
                  ]
                },
                {
                  "id": "exception-types",
                  "title": "Exception Türleri",
                  "summary": "Yaygın exception türlerini ve kullanım senaryolarını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "C# dilinde birçok exception türü vardır. Her exception türü belirli bir hata durumunu temsil eder."
                    },
                    {
                      "type": "list",
                      "ordered": false,
                      "items": [
                        "ArgumentNullException: Null parametre hatası",
                        "ArgumentException: Geçersiz parametre hatası",
                        "IndexOutOfRangeException: Dizi sınırları dışı erişim",
                        "NullReferenceException: Null referans hatası",
                        "FormatException: Format hatası (Parse işlemlerinde)",
                        "DivideByZeroException: Sıfıra bölme hatası"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Özel exception fırlatma nif (yas < 0) n{ n    throw new ArgumentException("Yaş negatif olamaz ", nameof(yas)); n} n n// Exception mesajı ve stack trace ncatch (Exception ex) n{ n    Console.WriteLine($ \"Hata: {ex.Message} "); n    Console.WriteLine($ \"Detay: {ex.StackTrace} "); n}",
                      "explanation": "Özel exception fırlatma ve exception bilgilerine erişim örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-finally-block",
                  "question": "Finally bloğu ne zaman çalışır?",
                  "options": [
                    "Sadece hata oluştuğunda",
                    "Sadece hata oluşmadığında",
                    "Her durumda (hata olsun ya da olmasın)",
                    "Sadece return ifadesi kullanıldığında"
                  ],
                  "answer": "Her durumda (hata olsun ya da olmasın)",
                  "rationale": "Finally bloğu try-catch yapısından çıkılmadan önce her durumda çalışır, kaynak temizleme için idealdir."
                }
              ]
            },
            {
              "label": "Console.WriteLine ile Çıktı Yazdırma",
              "href": "/education/lessons/csharp/basics/console-writeline",
              "description": "Temel giriş/çıkış işlemlerini pratik senaryolarla uygula."
            },
            {
              "label": "LINQ ile Koleksiyon Sorgulama",
              "href": "/education/lessons/csharp/collections/linq-basics",
              "description": "Language Integrated Query ile koleksiyonlar üzerinde güçlü sorgular yazmayı öğren.",
              "estimatedDurationMinutes": 50,
              "level": "Başlangıç",
              "keyTakeaways": [
                "LINQ, koleksiyonlar üzerinde SQL benzeri sorgular yazmanı sağlar",
                "Where, Select, OrderBy gibi temel LINQ metodlarını kullanabilirsin",
                "Method syntax ve query syntax olmak üzere iki farklı yazım şekli vardır",
                "LINQ sorguları lazy evaluation kullanır, sadece gerektiğinde çalışır",
                "GroupBy ve Join ile karmaşık veri işlemleri yapabilirsin"
              ],
              "sections": [
                {
                  "id": "linq-foundations",
                  "title": "LINQ Temelleri",
                  "summary": "LINQ nedir ve nasıl kullanılır?",
                  "content": [
                    {
                      "type": "text",
                      "body": "LINQ (Language Integrated Query), C# diline entegre edilmiş güçlü bir sorgulama teknolojisidir. Koleksiyonlar, veritabanları ve XML gibi farklı veri kaynakları üzerinde tutarlı bir sorgulama deneyimi sunar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Linq; n nList<int> sayilar = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }; n n// Method Syntax nvar ciftSayilar = sayilar.Where(x => x % 2 == 0).ToList(); n n// Query Syntax nvar ciftSayilar2 = (from sayi in sayilar n                    where sayi % 2 == 0 n                    select sayi).ToList();",
                      "explanation": "LINQun iki farklı yazım şekli: Method syntax (lambda expressions) ve Query syntax (SQL benzeri)."
                    },
                    {
                      "type": "list",
                      "ordered": false,
                      "items": [
                        "Method Syntax: Lambda expressions kullanır, daha esnek",
                        "Query Syntax: SQL benzeri, daha okunabilir",
                        "Her iki syntax da aynı sonucu üretir",
                        "Method syntax daha yaygın kullanılır"
                      ]
                    }
                  ]
                },
                {
                  "id": "linq-basic-methods",
                  "title": "Temel LINQ Metodları",
                  "summary": "Where, Select, OrderBy gibi temel metodları öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "LINQun en sık kullanılan metodları: Where (filtreleme), Select (dönüştürme), OrderBy (sıralama), GroupBy (gruplama) ve Join (birleştirme)."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "List<string> isimler = new List<string> {"Ahmet ","Ayşe ","Mehmet ","Ali ","Zeynep \" }; n n// Where: Filtreleme nvar aIleBaslayanlar = isimler.Where(i => i.StartsWith( "A")).ToList(); n n// Select: Dönüştürme nvar buyukHarfler = isimler.Select(i => i.ToUpper()).ToList(); n n// OrderBy: Sıralama nvar sirali = isimler.OrderBy(i => i).ToList(); n n// Where + Select kombinasyonu nvar uzunIsimler = isimler n    .Where(i => i.Length > 4) n    .Select(i => i.ToUpper()) n    .ToList();",
                      "explanation": "Temel LINQ metodlarının kullanım örnekleri. Metodlar zincirlenebilir (method chaining)."
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "Method Chaining",
                      "body": "LINQ metodları zincirlenebilir. Her metod yeni bir IEnumerable döndürür, bu sayede ardışık işlemler yapabilirsin."
                    }
                  ]
                },
                {
                  "id": "linq-advanced",
                  "title": "İleri Seviye LINQ",
                  "summary": "GroupBy, Join ve aggregation metodlarını öğren.",
                  "content": [
                    {
                      "type": "text",
                      "body": "LINQ ile karmaşık veri işlemleri yapabilirsin: gruplama, birleştirme ve toplama işlemleri."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// GroupBy: Gruplama nvar gruplu = isimler.GroupBy(i => i.Length); nforeach (var grup in gruplu) n{ n    Console.WriteLine($ \"Uzunluk {grup.Key}: {string.Join(\",  ", grup)}"); n} n n// Aggregation: Toplama, ortalama vb. nList<int> sayilar = new List<int> { 1, 2, 3, 4, 5 }; nint toplam = sayilar.Sum(); nint enBuyuk = sayilar.Max(); ndouble ortalama = sayilar.Average(); nint sayi = sayilar.Count();",
                      "explanation": "GroupBy ile verileri gruplayabilir, Sum, Max, Average, Count gibi metodlarla toplama işlemleri yapabilirsin."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Join: İki koleksiyonu birleştirme nvar kisiler = new List<Person> { new Person { Id = 1, Name ="Ahmet \" } }; nvar adresler = new List<Address> { new Address { PersonId = 1, City =  "İstanbul \" } }; n nvar sonuc = from kisi in kisiler n            join adres in adresler on kisi.Id equals adres.PersonId n            select new { kisi.Name, adres.City };",
                      "explanation": "Join ile iki koleksiyonu birleştirerek ilişkili verileri sorgulayabilirsin."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-linq-syntax",
                  "question": "LINQun iki yazım şekli nedir?",
                  "options": [
                    "Method syntax ve Query syntax",
                    "SQL syntax ve C# syntax",
                    "Lambda syntax ve Expression syntax",
                    "Inline syntax ve Block syntax"
                  ],
                  "answer": "Method syntax ve Query syntax",
                  "rationale": "LINQ, method syntax (lambda expressions) ve query syntax (SQL benzeri) olmak üzere iki farklı yazım şekli sunar."
                },
                {
                  "id": "checkpoint-linq-lazy",
                  "question": "LINQ sorguları ne zaman çalıştırılır?",
                  "options": [
                    "Hemen sorgu yazıldığında",
                    "Sadece sonuç kullanıldığında (lazy evaluation)",
                    "Sadece ToList() çağrıldığında",
                    "Her zaman anında"
                  ],
                  "answer": "Sadece sonuç kullanıldığında (lazy evaluation)",
                  "rationale": "LINQ sorguları lazy evaluation kullanır, yani sorgu yazıldığında çalışmaz, sadece sonuç kullanıldığında (foreach, ToList() vb.) çalışır."
                },
                {
                  "id": "checkpoint-linq-where",
                  "question": "Where metodu ne işe yarar?",
                  "options": [
                    "Koleksiyonu sıralar",
                    "Koleksiyonu filtreler",
                    "Koleksiyonu dönüştürür",
                    "Koleksiyonu gruplar"
                  ],
                  "answer": "Koleksiyonu filtreler",
                  "rationale": "Where metodu, belirtilen koşula uyan elemanları filtreleyerek yeni bir koleksiyon döndürür."
                }
              ],
              "resources": [
                {
                  "id": "resource-linq-docs",
                  "label": "Microsoft Docs: LINQ (C#)",
                  "href": "https://learn.microsoft.com/tr-tr/dotnet/csharp/programming-guide/concepts/linq/",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "LINQun resmi dokümantasyonu ve örnekleri."
                },
                {
                  "id": "resource-linq-101",
                  "label": "LINQ 101 Örnekleri",
                  "href": "https://github.com/microsoft/101-linq-samples",
                  "type": "practice",
                  "estimatedMinutes": 30,
                  "description": "Microsoftun resmi LINQ örnekleri koleksiyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-linq-filter",
                  "title": "LINQ ile Filtreleme",
                  "description": "Bir sayı listesinden çift sayıları filtrele ve karelerini al.",
                  "type": "coding",
                  "estimatedMinutes": 15,
                  "difficulty": "Kolay",
                  "instructions": [
                    "1-100 arası sayılar içeren bir List<int> oluştur",
                    "Where ile çift sayıları filtrele",
                    "Select ile her sayının karesini al",
                    "Sonuçları ekrana yazdır"
                  ]
                },
                {
                  "id": "practice-linq-group",
                  "title": "LINQ ile Gruplama",
                  "description": "İsim listesini uzunluklarına göre grupla.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "String listesi oluştur",
                    "GroupBy ile isimleri uzunluklarına göre grupla",
                    "Her grup için isimleri ve sayısını yazdır"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "module-02-architecture",
          "title": ".NET Core Mimarisi ve Yapısı",
          "summary": "CLR, BCL ve host bileşenlerini kavrayarak uygulamanın yaşam döngüsünü yönet.",
          "durationMinutes": 180,
          "objectives": [
            "Bu modülü tamamladığında .NET Core runtime bileşenlerini ve uygulama yaşam döngüsünü açıklayıp doğru host yapılandırmaları yapabileceksin.",
            "CLR, BCL ve assembly yapısını derinlemesine anlayacak ve uygulama başlatma süreçlerini yönetebileceksin.",
            "Garbage Collection ve JIT compilation mekanizmalarını kavrayıp performans optimizasyonları yapabileceksin.",
            "Host builder patternini kullanarak servis yaşam döngüsünü yönetebileceksin."
          ],
          "activities": [
            {
              "id": "activity-arch-01-clr-overview",
              "type": "concept",
              "title": "Common Language Runtime (CLR) Temelleri",
              "estimatedMinutes": 20,
              "content": "CLR, .NET Core un kalbidir ve managed kodun çalıştırılmasından sorumludur. CLR ın temel bileşenleri: n n**1. Type System (Tip Sistemi)** n- CTS (Common Type System): Tüm dillerin ortak tip sistemini tanımlar n- CLS (Common Language Specification): Diller arası uyumluluk kuralları n n**2. Memory Management (Bellek Yönetimi)** n- Managed heap: Otomatik bellek yönetimi n- Stack: Value type lar ve referanslar için n- Garbage Collector: Otomatik bellek temizleme n n**3. Execution Engine (Çalıştırma Motoru)** n- JIT (Just-In-Time) Compiler: IL kodunu native koda çevirir n- IL (Intermediate Language): Platform bağımsız ara dil n- Metadata: Tip bilgileri ve assembly yapısı n n**4. Security Model (Güvenlik Modeli)** n- Code Access Security (CAS) n- Role-based security n- Assembly evidence ve permissions",
              "highlights": [
                "CLR, managed kodun çalıştırılmasından ve bellek yönetiminden sorumludur",
                "JIT compiler, IL kodunu çalışma zamanında native koda çevirir",
                "Garbage Collector otomatik olarak kullanılmayan bellek alanlarını temizler",
                "Metadata, assembly içindeki tip ve üye bilgilerini içerir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "CLRExample.cs",
                  "code": "using System; nusing System.Reflection; n nclass Program n{ n    static void Main() n    { n        // Assembly bilgilerini al n        Assembly assembly = Assembly.GetExecutingAssembly(); n        Console.WriteLine("Assembly Name:  \" + assembly.FullName); n        Console.WriteLine( "CLR Version:  \" + Environment.Version); n         n        // Runtime bilgileri n        Console.WriteLine( "Is 64-bit:  \" + Environment.Is64BitProcess); n        Console.WriteLine( "OS Version:  \" + Environment.OSVersion); n         n        // GC bilgileri n        Console.WriteLine( "GC Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n    } n}",
                  "explanation": "Bu örnek, CLR hakkında temel bilgileri gösterir: assembly bilgileri, runtime versiyonu, işlem mimarisi ve garbage collection istatistikleri."
                }
              ],
              "checklist": [
                {
                  "id": "check-clr-understanding",
                  "label": "CLRın temel bileşenlerini (Type System, Memory Management, Execution Engine) açıklayabilirim",
                  "explanation": "CLRın her bir bileşeninin rolünü ve birbirleriyle nasıl etkileşime girdiğini anlamak önemlidir."
                },
                {
                  "id": "check-jit-understanding",
                  "label": "JIT compilation sürecini ve IL kodunun native koda dönüşümünü anlıyorum",
                  "explanation": "JIT compilerın nasıl çalıştığını anlamak, performans optimizasyonları için kritiktir."
                }
              ]
            },
            {
              "id": "activity-arch-02-bcl-overview",
              "type": "concept",
              "title": "Base Class Library (BCL) Yapısı",
              "estimatedMinutes": 15,
              "content": "BCL, .NET Core uygulamalarında kullanılan temel sınıf kütüphanesidir. BCLın ana bileşenleri: n n**1. System Namespace** n- Temel tipler (String, Int32, DateTime, etc.) n- Collections (List, Dictionary, Queue, etc.) n- I/O işlemleri (File, Stream, etc.) n n**2. System.Collections.Generic** n- Generic koleksiyonlar (List<T>, Dictionary<TKey, TValue>) n- Performanslı ve type-safe veri yapıları n n**3. System.Linq** n- LINQ (Language Integrated Query) n- Collection üzerinde sorgulama ve dönüşüm işlemleri n n**4. System.Threading** n- Thread yönetimi n- Task Parallel Library (TPL) n- Async/await desteği n n**5. System.Text** n- String encoding/decoding n- StringBuilder n- Regex işlemleri n n**6. System.Net** n- HTTP client işlemleri n- Network protokolleri n- WebSocket desteği",
              "highlights": [
                "BCL, .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır",
                "Generic koleksiyonlar type-safe ve performanslıdır",
                "LINQ, koleksiyonlar üzerinde güçlü sorgulama imkanı sağlar",
                "System.Threading namespace i modern async/await programlamayı destekler"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "BCLExample.cs",
                  "code": "using System; nusing System.Collections.Generic; nusing System.Linq; n nclass Program n{ n    static void Main() n    { n        // Generic Collections n        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }; n         n        // LINQ Operations n        var evenNumbers = numbers.Where(n => n % 2 == 0).ToList(); n        var sum = numbers.Sum(); n        var average = numbers.Average(); n         n        Console.WriteLine("Even Numbers:  \" + string.Join( ",", evenNumbers)); n        Console.WriteLine( "Sum:  \" + sum); n        Console.WriteLine( "Average:  \" + average); n         n        // Dictionary Example n        var dictionary = new Dictionary<string, int> n        { n            {  "one", 1 }, n            {  "two", 2 }, n            {  "three", 3 } n        }; n         n        foreach (var kvp in dictionary) n        { n            Console.WriteLine($ \"{kvp.Key}: {kvp.Value} "); n        } n    } n}",
                  "explanation": "Bu örnek, BCLın temel bileşenlerini gösterir: generic koleksiyonlar, LINQ sorguları ve dictionary kullanımı."
                }
              ],
              "checklist": [
                {
                  "id": "check-bcl-namespaces",
                  "label": "BCL ın ana namespace lerini ve kullanım alanlarını biliyorum",
                  "explanation": "BCLın organizasyonunu anlamak, doğru namespace leri kullanmak için önemlidir."
                },
                {
                  "id": "check-generic-collections",
                  "label": "Generic koleksiyonların avantajlarını ve kullanım senaryolarını anlıyorum",
                  "explanation": "Generic koleksiyonlar type-safe ve performanslı çözümler sunar."
                }
              ]
            },
            {
              "id": "activity-arch-03-assembly-structure",
              "type": "concept",
              "title": "Assembly Yapısı ve Metadata",
              "estimatedMinutes": 20,
              "content": "Assembly, .NET Core da kodun dağıtım birimidir. Her assembly şunları içerir: n n**1. Assembly Manifest** n- Assembly kimliği (name, version, culture) n- Referans edilen diğer assembly ler n- Güvenlik izinleri n- Public key token n n**2. Type Metadata** n- Sınıf, interface, struct tanımları n- Metot, property, field bilgileri n- Attribute lar ve annotation lar n n**3. IL Code (Intermediate Language)** n- Platform bağımsız ara dil kodu n- JIT compiler tarafından native koda çevrilir n n**4. Resources** n- Embedded resources (resimler, string ler) n- Satellite assemblies (yerelleştirme) n n**Assembly Türleri:** n- **Executable (.exe)**: Çalıştırılabilir uygulama n- **Library (.dll)**: Paylaşılan kütüphane n- **Satellite**: Yerelleştirme kaynakları n n**Strong Naming:** n- Assembly ye benzersiz kimlik verir n- Version kontrolü sağlar n- GAC (Global Assembly Cache) için gereklidir",
              "highlights": [
                "Assembly, .NET Core da kodun dağıtım ve yürütme birimidir",
                "Metadata, reflection ve IntelliSense için gerekli bilgileri içerir",
                "IL kodu platform bağımsızdır ve JIT compiler tarafından native koda çevrilir",
                "Strong naming, assembly lerin benzersiz kimliğini sağlar"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "AssemblyExample.cs",
                  "code": "using System; nusing System.Reflection; n nclass Program n{ n    static void Main() n    { n        // Mevcut assembly bilgileri n        Assembly assembly = Assembly.GetExecutingAssembly(); n         n        // Assembly Manifest Bilgileri n        Console.WriteLine("Full Name:  \" + assembly.FullName); n        Console.WriteLine( "Location:  \" + assembly.Location); n        Console.WriteLine( "Entry Point:  \" + assembly.EntryPoint?.Name); n         n        // Assembly deki tipler n        Type[] types = assembly.GetTypes(); n        Console.WriteLine( \"  nTypes in Assembly: "); n        foreach (var type in types) n        { n            Console.WriteLine( \"  -  \" + type.FullName); n             n            // Tip in metodları n            MethodInfo[] methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static); n            foreach (var method in methods) n            { n                if (!method.IsSpecialName) n                    Console.WriteLine( \"    Method:  \" + method.Name); n            } n        } n         n        // Referans edilen assembly ler n        Console.WriteLine( \"  nReferenced Assemblies: "); n        foreach (var refAssembly in assembly.GetReferencedAssemblies()) n        { n            Console.WriteLine( \"  -  \" + refAssembly.FullName); n        } n    } n}",
                  "explanation": "Bu örnek, assembly yapısını incelemek için reflection kullanır: manifest bilgileri, tipler, metodlar ve referanslar."
                }
              ],
              "checklist": [
                {
                  "id": "check-assembly-components",
                  "label": "Assembly nin bileşenlerini (manifest, metadata, IL code) açıklayabilirim",
                  "explanation": "Assembly yapısını anlamak, debugging ve deployment için kritiktir."
                },
                {
                  "id": "check-metadata-usage",
                  "label": "Metadata nın reflection ve IntelliSense için nasıl kullanıldığını anlıyorum",
                  "explanation": "Metadata, .NET in güçlü reflection özelliklerinin temelidir."
                }
              ]
            },
            {
              "id": "activity-arch-04-app-startup",
              "type": "guided-exercise",
              "title": "Uygulama Başlatma Süreci",
              "estimatedMinutes": 25,
              "description": "Bir .NET Core uygulamasının başlatma sürecini adım adım inceleyelim ve host yapılandırmasını öğrenelim.",
              "steps": [
                {
                  "title": "Program.cs Yapısını İncele",
                  "detail": "Modern .NET Core uygulamaları top-level statements kullanır. Program.cs dosyasında uygulamanın giriş noktasını belirle.",
                  "hint": "Top-level statements, Main metodunu otomatik oluşturur.",
                  "reference": "https://learn.microsoft.com/dotnet/csharp/fundamentals/program-structure/top-level-statements"
                },
                {
                  "title": "Host Builder Oluştur",
                  "detail": "Host.CreateDefaultBuilder() ile varsayılan host yapılandırmasını oluştur. Bu, logging, configuration ve dependency injection ı otomatik yapılandırır.",
                  "hint": "CreateDefaultBuilder, appsettings.json ve environment variables ı otomatik yükler."
                },
                {
                  "title": "Servisleri Kaydet",
                  "detail": "ConfigureServices metodunda veya extension metodlarıyla servisleri DI container a kaydet.",
                  "hint": "AddScoped, AddSingleton, AddTransient lifetime seçeneklerini kullan."
                },
                {
                  "title": "Middleware Pipeline ını Yapılandır",
                  "detail": "Configure metodunda middleware leri sırayla ekle. Sıralama çok önemlidir!",
                  "hint": "UseRouting() ve UseEndpoints() arasında middleware ekle."
                },
                {
                  "title": "Host u Çalıştır",
                  "detail": "Build() ve Run() metodlarıyla host u başlat. Run() blocking bir çağrıdır.",
                  "hint": "RunAsync() kullanarak async başlatma da yapabilirsin."
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "Program.cs",
                "code": "using Microsoft.Extensions.Hosting; nusing Microsoft.Extensions.DependencyInjection; nusing Microsoft.Extensions.Logging; n n// TODO: Host builder oluştur ve yapılandır n nvar host = Host.CreateDefaultBuilder(args) n    .ConfigureServices((context, services) => n    { n        // TODO: Servisleri buraya ekle n        // services.AddScoped<IMyService, MyService>(); n    }) n    .ConfigureLogging(logging => n    { n        // TODO: Logging yapılandırması n        logging.AddConsole(); n    }) n    .Build(); n n// TODO: Host u başlat n// await host.RunAsync(); n",
                "explanation": "Bu starter code, host builder patterninin temel yapısını gösterir. Adımları takip ederek tamamlayın."
              },
              "hints": [
                "Host.CreateDefaultBuilder() varsayılan yapılandırmaları içerir",
                "ConfigureServices içinde servisleri kaydederken lifetime a dikkat edin",
                "Middleware sıralaması request pipeline ında kritik öneme sahiptir",
                "Run() blocking, RunAsync() non-blocking çalışır"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Host başarıyla oluşturuldu ve çalıştırıldı",
                  "En az bir servis DI container a kaydedildi",
                  "Logging yapılandırması eklendi",
                  "Uygulama hatasız başlatılıyor"
                ]
              }
            },
            {
              "id": "activity-arch-05-host-builder",
              "type": "guided-exercise",
              "title": "Generic Host Builder Pattern",
              "estimatedMinutes": 30,
              "description": "Generic Host patternini kullanarak servis yaşam döngüsünü yönetmeyi öğrenelim.",
              "steps": [
                {
                  "title": "IHostedService Interface ini Anla",
                  "detail": "IHostedService, arka plan servisleri için kullanılır. StartAsync ve StopAsync metodlarını içerir.",
                  "hint": "BackgroundService, IHostedService in abstract implementasyonudur."
                },
                {
                  "title": "Background Service Oluştur",
                  "detail": "BackgroundService den türeyen bir sınıf oluştur ve ExecuteAsync metodunu override et.",
                  "hint": "ExecuteAsync, servis çalıştığı sürece devam eden async işlemleri içerir."
                },
                {
                  "title": "Hosted Service i Kaydet",
                  "detail": "AddHostedService<T>() extension metodunu kullanarak servisi kaydet.",
                  "hint": "Hosted service ler singleton olarak kaydedilir."
                },
                {
                  "title": "Graceful Shutdown Yapılandır",
                  "detail": "CancellationToken kullanarak servisin düzgün şekilde kapanmasını sağla.",
                  "hint": "StoppingToken, uygulama kapanırken set edilir."
                },
                {
                  "title": "Host Lifecycle ını Test Et",
                  "detail": "Uygulamayı başlat ve durdur, servislerin doğru şekilde başlayıp durduğunu doğrula.",
                  "hint": "Console.WriteLine ile lifecycle event lerini logla."
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "BackgroundWorkerService.cs",
                "code": "using Microsoft.Extensions.Hosting; n npublic class BackgroundWorkerService : BackgroundService n{ n    private readonly ILogger<BackgroundWorkerService> _logger; n     n    public BackgroundWorkerService(ILogger<BackgroundWorkerService> logger) n    { n        _logger = logger; n    } n     n    protected override async Task ExecuteAsync(CancellationToken stoppingToken) n    { n        _logger.LogInformation("Background Service başlatıldı. "); n         n        // TODO: Periyodik işlemleri buraya ekle n        while (!stoppingToken.IsCancellationRequested) n        { n            // TODO: İş mantığını buraya ekle n            await Task.Delay(1000, stoppingToken); n        } n         n        _logger.LogInformation("Background Service durduruldu. "); n    } n}",
                "explanation": "Bu starter code, BackgroundService patterninin temel yapısını gösterir. ExecuteAsync metodunu tamamlayın."
              },
              "hints": [
                "BackgroundService, IHostedService in kolay kullanım için sağlanan abstract sınıfıdır",
                "CancellationToken, graceful shutdown için kritiktir",
                "ExecuteAsync içinde sonsuz döngü kullanılır, ancak cancellation token kontrol edilir",
                "Host kapanırken tüm hosted service ler otomatik durdurulur"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Background service başarıyla oluşturuldu",
                  "ExecuteAsync içinde cancellation token kontrol ediliyor",
                  "Servis host ile birlikte başlatılıp durduruluyor",
                  "Logging ile lifecycle event leri görüntüleniyor"
                ]
              }
            },
            {
              "id": "activity-arch-06-garbage-collection",
              "type": "concept",
              "title": "Garbage Collection (GC) Mekanizması",
              "estimatedMinutes": 25,
              "content": "Garbage Collector (GC), .NET Core da otomatik bellek yönetiminden sorumludur. Managed heap üzerindeki kullanılmayan nesneleri otomatik olarak temizler. n n**GC Generations (Nesil Sistemi):** n- **Generation 0**: Yeni oluşturulan nesneler (küçük, kısa ömürlü) n- **Generation 1**: Generation 0 dan kurtulan nesneler (orta ömürlü) n- **Generation 2**: Uzun ömürlü nesneler (büyük nesneler, static alanlar) n n**GC Türleri:** n- **Ephemeral GC**: Generation 0 ve 1 i temizler (hızlı) n- **Full GC**: Tüm generation ları temizler (yavaş, blocking) n- **Background GC**: Generation 2 için arka planda çalışır (non-blocking) n n**GC Stratejileri:** n- **Workstation GC**: Client uygulamalar için optimize edilmiş n- **Server GC**: Sunucu uygulamaları için çoklu thread ile çalışır n n**GC Optimizasyon İpuçları:** n- Büyük nesneleri mümkün olduğunca az kullan n- IDisposable pattern ini doğru uygula n- String concatenation yerine StringBuilder kullan n- Event handler ları unsubscribe et n- Weak references kullan (cache senaryolarında)",
              "highlights": [
                "GC, managed heap teki kullanılmayan nesneleri otomatik temizler",
                "Generation sistemi, GC performansını optimize eder",
                "Workstation GC client, Server GC sunucu uygulamaları için optimize edilmiştir",
                "IDisposable pattern, unmanaged kaynakların temizlenmesi için kritiktir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "GCExample.cs",
                  "code": "using System; n nclass Program n{ n    static void Main() n    { n        // GC istatistiklerini göster n        Console.WriteLine("=== GC İstatistikleri === "); n        Console.WriteLine("Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Generation 1 Collections:  \" + GC.CollectionCount(1)); n        Console.WriteLine( "Generation 2 Collections:  \" + GC.CollectionCount(2)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // Büyük nesne oluştur n        byte[] largeArray = new byte[1000000]; n        Console.WriteLine( \"  nBüyük nesne oluşturuldu. "); n        Console.WriteLine("Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // Nesneyi null yap ve GC yi zorla n        largeArray = null; n        GC.Collect(); n        GC.WaitForPendingFinalizers(); n         n        Console.WriteLine( \"  nGC çalıştırıldı. "); n        Console.WriteLine("Generation 0 Collections:  \" + GC.CollectionCount(0)); n        Console.WriteLine( "Total Memory:  \" + GC.GetTotalMemory(false) +  \" bytes "); n         n        // GC Latency Mode n        Console.WriteLine( \"  nGC Latency Mode:  \" + GCSettings.LatencyMode); n         n        // Server GC kontrolü n        Console.WriteLine( "Is Server GC:  \" + GCSettings.IsServerGC); n    } n}",
                  "explanation": "Bu örnek, GC nin çalışmasını gösterir: collection sayıları, bellek kullanımı ve GC ayarları."
                }
              ],
              "checklist": [
                {
                  "id": "check-gc-generations",
                  "label": "GC generation sistemini (0, 1, 2) ve her birinin amacını anlıyorum",
                  "explanation": "Generation sistemi, GC performansını önemli ölçüde artırır."
                },
                {
                  "id": "check-gc-optimization",
                  "label": "GC optimizasyon tekniklerini (IDisposable, StringBuilder, etc.) biliyorum",
                  "explanation": "Doğru bellek yönetimi, uygulama performansını doğrudan etkiler."
                }
              ]
            },
            {
              "id": "activity-arch-07-jit-compilation",
              "type": "concept",
              "title": "JIT (Just-In-Time) Compilation",
              "estimatedMinutes": 20,
              "content": "JIT compiler, IL (Intermediate Language) kodunu çalışma zamanında native makine koduna çevirir. n n**JIT Compilation Süreci:** n1. **IL Loading**: Assembly den IL kodu yüklenir n2. **Type Verification**: Tip güvenliği kontrol edilir n3. **JIT Compilation**: IL kodu native koda çevrilir n4. **Code Caching**: Derlenen kod cache lenir (sonraki çağrılar için) n5. **Execution**: Native kod çalıştırılır n n**JIT Optimizasyonları:** n- **Inlining**: Küçük metodları çağrı yerine inline eder n- **Dead Code Elimination**: Kullanılmayan kodları kaldırır n- **Loop Optimizations**: Döngü optimizasyonları yapar n- **Register Allocation**: CPU register larını optimize kullanır n n**Tiered Compilation:** n- **Tier 0 (Quick JIT)**: Hızlı derleme, az optimizasyon n- **Tier 1 (Optimized JIT)**: Yavaş derleme, çok optimizasyon n- Hot path ler Tier 1 e yükseltilir n n**AOT (Ahead-of-Time) Compilation:** n- .NET Native ve Native AOT ile önceden derleme n- Daha hızlı başlatma, daha küçük footprint n- Reflection sınırlamaları",
              "highlights": [
                "JIT compiler, IL kodunu çalışma zamanında native koda çevirir",
                "Tiered compilation, performans ve başlatma süresi arasında denge sağlar",
                "JIT optimizasyonları (inlining, dead code elimination) performansı artırır",
                "AOT compilation, başlatma süresini azaltır ancak bazı sınırlamalar getirir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "JITExample.cs",
                  "code": "using System; nusing System.Diagnostics; nusing System.Runtime.CompilerServices; n nclass Program n{ n    static void Main() n    { n        // İlk çağrı (JIT compilation dahil) n        var sw = Stopwatch.StartNew(); n        CalculateSum(1000000); n        sw.Stop(); n        Console.WriteLine("İlk çağrı (JIT dahil):  \" + sw.ElapsedMilliseconds +  \" ms "); n         n        // Sonraki çağrılar (cached native code) n        sw.Restart(); n        for (int i = 0; i < 10; i++) n        { n            CalculateSum(1000000); n        } n        sw.Stop(); n        Console.WriteLine("10 çağrı (cached):  \" + sw.ElapsedMilliseconds +  \" ms "); n         n        // AggressiveInlining örneği n        sw.Restart(); n        InlinedMethod(); n        sw.Stop(); n        Console.WriteLine("Inlined method:  \" + sw.ElapsedMilliseconds +  \" ms "); n    } n     n    static int CalculateSum(int n) n    { n        int sum = 0; n        for (int i = 0; i < n; i++) n        { n            sum += i; n        } n        return sum; n    } n     n    [MethodImpl(MethodImplOptions.AggressiveInlining)] n    static int InlinedMethod() n    { n        return 42; n    } n}",
                  "explanation": "Bu örnek, JIT compilation ın etkisini gösterir: ilk çağrıda JIT overhead i, sonraki çağrılarda cached native code performansı."
                }
              ],
              "checklist": [
                {
                  "id": "check-jit-process",
                  "label": "JIT compilation sürecini (IL → native code) anlıyorum",
                  "explanation": "JIT compilation, .NET in platform bağımsızlığının temelidir."
                },
                {
                  "id": "check-tiered-compilation",
                  "label": "Tiered compilation kavramını ve avantajlarını biliyorum",
                  "explanation": "Tiered compilation, başlatma süresi ve performans arasında denge sağlar."
                }
              ]
            },
            {
              "id": "activity-arch-08-runtime-components",
              "type": "knowledge-check",
              "title": "Runtime Bileşenleri Bilgi Kontrolü",
              "estimatedMinutes": 15,
              "questions": [
                {
                  "id": "q-runtime-01",
                  "question": "CLRın temel sorumlulukları nelerdir?",
                  "options": [
                    "Sadece bellek yönetimi",
                    "Bellek yönetimi, tip sistemi, güvenlik ve kod çalıştırma",
                    "Sadece kod derleme",
                    "Sadece güvenlik kontrolü"
                  ],
                  "answer": 1,
                  "explanation": "CLR, managed kodun çalıştırılmasından sorumlu olan runtime dır ve bellek yönetimi, tip sistemi, güvenlik ve kod çalıştırma gibi birçok sorumluluğu vardır."
                },
                {
                  "id": "q-runtime-02",
                  "question": "GC Generation 0 da hangi tür nesneler bulunur?",
                  "options": [
                    "Uzun ömürlü nesneler",
                    "Yeni oluşturulan, kısa ömürlü nesneler",
                    "Static nesneler",
                    "Büyük nesneler"
                  ],
                  "answer": 1,
                  "explanation": "Generation 0, yeni oluşturulan ve genellikle kısa ömürlü olan nesneleri içerir. Çoğu nesne Generation 0 da kalır ve hızlıca temizlenir."
                },
                {
                  "id": "q-runtime-03",
                  "question": "JIT compiler ne zaman çalışır?",
                  "options": [
                    "Derleme zamanında",
                    "Çalışma zamanında, metod ilk çağrıldığında",
                    "Uygulama yüklendiğinde",
                    "Hiçbir zaman"
                  ],
                  "answer": 1,
                  "explanation": "JIT compiler, metod ilk çağrıldığında IL kodunu native koda çevirir. Bu just-in-time yaklaşımıdır."
                },
                {
                  "id": "q-runtime-04",
                  "question": "Assembly manifest i ne içerir?",
                  "options": [
                    "Sadece IL kodu",
                    "Assembly kimliği, referanslar ve güvenlik bilgileri",
                    "Sadece tip tanımları",
                    "Sadece kaynaklar"
                  ],
                  "answer": 1,
                  "explanation": "Assembly manifest, assembly nin kimliği (name, version, culture), referans edilen diğer assembly ler ve güvenlik izinleri gibi metadata bilgilerini içerir."
                },
                {
                  "id": "q-runtime-05",
                  "question": "Host.CreateDefaultBuilder() ne yapar?",
                  "options": [
                    "Sadece logging yapılandırır",
                    "Logging, configuration ve dependency injection ı otomatik yapılandırır",
                    "Sadece configuration yükler",
                    "Hiçbir şey yapmaz"
                  ],
                  "answer": 1,
                  "explanation": "CreateDefaultBuilder(), logging, configuration (appsettings.json, environment variables) ve dependency injection gibi temel servisleri otomatik olarak yapılandırır."
                }
              ]
            },
            {
              "id": "activity-arch-09-lifecycle-challenge",
              "type": "code-challenge",
              "title": "Uygulama Yaşam Döngüsü Yönetimi",
              "estimatedMinutes": 35,
              "description": "Bir .NET Core uygulaması oluştur ve host lifecycle event lerini yönet. Uygulama başlatma, çalışma ve kapanma süreçlerini logla ve graceful shutdown implementasyonu yap.",
              "acceptanceCriteria": [
                "Host builder ile uygulama oluşturulmalı",
                "IHostApplicationLifetime interface i kullanılarak lifecycle event leri yakalanmalı",
                "ApplicationStarted, ApplicationStopping ve ApplicationStopped event leri loglanmalı",
                "Graceful shutdown için CancellationToken kullanılmalı",
                "Background service ile lifecycle entegrasyonu yapılmalı"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "LifecycleApp.cs",
                "code": "using Microsoft.Extensions.Hosting; nusing Microsoft.Extensions.DependencyInjection; nusing Microsoft.Extensions.Logging; n nvar host = Host.CreateDefaultBuilder(args) n    .ConfigureServices((context, services) => n    { n        // TODO: IHostApplicationLifetime servisini kullan n        // TODO: Background service ekle n    }) n    .Build(); n n// TODO: Lifecycle event lerini yakala ve logla n nawait host.RunAsync(); n",
                "explanation": "Bu starter code, host lifecycle yönetimi için temel yapıyı gösterir. Lifecycle event lerini yakalayıp loglayın."
              },
              "testCases": [
                {
                  "id": "test-lifecycle-01",
                  "description": "Uygulama başlatıldığında ApplicationStarted event i tetiklenmeli",
                  "input": "Uygulama başlatılır",
                  "expectedOutput": "ApplicationStarted log mesajı görünmeli"
                },
                {
                  "id": "test-lifecycle-02",
                  "description": "Ctrl+C ile uygulama durdurulduğunda ApplicationStopping event i tetiklenmeli",
                  "input": "SIGTERM veya Ctrl+C sinyali gönderilir",
                  "expectedOutput": "ApplicationStopping log mesajı görünmeli, background service düzgün durdurulmalı"
                },
                {
                  "id": "test-lifecycle-03",
                  "description": "Uygulama tamamen kapandığında ApplicationStopped event i tetiklenmeli",
                  "input": "Uygulama kapanır",
                  "expectedOutput": "ApplicationStopped log mesajı görünmeli"
                }
              ],
              "evaluationTips": [
                "IHostApplicationLifetime, host tan resolve edilebilir",
                "ApplicationStarted, ApplicationStopping ve ApplicationStopped event lerini dinle",
                "CancellationToken ı background service lerde kullan",
                "Console.CancelKeyPress event ini de kullanabilirsin"
              ]
            },
            {
              "id": "activity-arch-10-reflection",
              "type": "reflection",
              "title": "Runtime Mimarisi Üzerine Düşünme",
              "estimatedMinutes": 10,
              "prompts": [
                "CLR, BCL ve assembly yapısının birbirleriyle nasıl etkileşime girdiğini düşün. Hangi bileşen hangi bileşene bağımlı?",
                "Garbage Collection un uygulama performansına etkisini değerlendir. Hangi senaryolarda GC optimizasyonu kritik olur?",
                "JIT compilation ın avantaj ve dezavantajlarını düşün. AOT compilation ne zaman tercih edilmeli?",
                "Host builder patterninin dependency injection ve configuration yönetimindeki rolünü değerlendir. Alternatif yaklaşımlar neler olabilir?"
              ],
              "expectedTakeaways": [
                "Runtime bileşenlerinin birbirleriyle nasıl entegre olduğunu anlamak",
                "Performans optimizasyonu için runtime mekanizmalarını doğru kullanmak",
                "Uygulama mimarisinde host patterninin önemini kavramak"
              ]
            }
          ],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Core%20Mimarisi",
            "description": "CLR, host ve servis yaşam döngüsünü görselleyen içerikleri incele."
          },
          "relatedTopics": [
            {
              "label": "CLR Yaşam Döngüsü",
              "href": "/education/lessons/dotnet/runtime/clr-lifecycle",
              "description": "Uygulama başlatma, JIT ve GC süreçlerini ayrıntılı incele."
            },
            {
              "label": "Generic Host Yapılandırması",
              "href": "/education/lessons/dotnet/runtime/generic-host",
              "description": "Host builder ve servis kayıtlarını pratik olarak uygula."
            },
            {
              "label": "Konfigürasyon Pipeline ı",
              "href": "/education/lessons/dotnet/runtime/configuration-pipeline",
              "description": "Çok katmanlı konfigürasyon kaynaklarını sırayla yükle."
            },
            {
              "label": "Assembly Loading ve Reflection",
              "href": "/education/lessons/dotnet/runtime/assembly-loading-reflection",
              "description": "Assembly leri dinamik yükleme ve reflection ile runtime da tip bilgilerine erişim.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Assembly.Load ve Assembly.LoadFrom ile dinamik yükleme yapabilirsin",
                "Reflection ile runtime da tip, metot ve property bilgilerine erişebilirsin",
                "Activator.CreateInstance ile dinamik nesne oluşturabilirsin",
                "Metadata ve attribute ları reflection ile okuyabilirsin",
                "Assembly loading stratejileri performansı etkiler"
              ],
              "sections": [
                {
                  "id": "assembly-loading",
                  "title": "Assembly Yükleme Stratejileri",
                  "summary": "Assembly leri farklı yöntemlerle yükleme.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Assembly leri dinamik olarak yüklemek için farklı yöntemler vardır: Assembly.Load, Assembly.LoadFrom, Assembly.LoadFile. Her birinin farklı kullanım senaryoları vardır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Reflection; n n// Assembly.Load: Assembly name ile yükleme nAssembly assembly1 = Assembly.Load("MyLibrary "); n n// Assembly.LoadFrom: Dosya yolu ile yükleme nAssembly assembly2 = Assembly.LoadFrom(@"C:  MyApp  MyLibrary.dll "); n n// Assembly.LoadFile: Dosyayı doğrudan yükleme (context yok) nAssembly assembly3 = Assembly.LoadFile(@"C:  MyApp  MyLibrary.dll "); n n// Mevcut assembly yi al nAssembly currentAssembly = Assembly.GetExecutingAssembly();",
                      "explanation": "Farklı assembly yükleme yöntemleri. Load, LoadFrom ve LoadFile farklı context lerde çalışır."
                    }
                  ]
                },
                {
                  "id": "reflection-basics",
                  "title": "Reflection Temelleri",
                  "summary": "Tip bilgilerine runtime da erişim.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Reflection, runtime da tip bilgilerine erişmeyi sağlar. Type sınıfı, metotlar, property ler ve field lar hakkında bilgi verir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Reflection; n nType type = typeof(MyClass); n n// Metotları al nMethodInfo[] methods = type.GetMethods(); nforeach (var method in methods) n{ n    Console.WriteLine($ \"Method: {method.Name}\"); n} n n// Propertyleri al nPropertyInfo[] properties = type.GetProperties(); nforeach (var prop in properties) n{ n    Console.WriteLine($ \"Property: {prop.Name}, Type: {prop.PropertyType} "); n} n n// Attribute ları al nvar attributes = type.GetCustomAttributes();",
                      "explanation": "Reflection ile tip bilgilerine erişim örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-assembly-load",
                  "question": "Assembly.Load ve Assembly.LoadFrom arasındaki fark nedir?",
                  "options": [
                    "LoadFrom daha hızlıdır",
                    "Load assembly name ile, LoadFrom dosya yolu ile yükler",
                    "Hiçbir fark yoktur",
                    "Load sadece .exe dosyaları için kullanılır"
                  ],
                  "answer": "Load assembly name ile, LoadFrom dosya yolu ile yükler",
                  "rationale": "Assembly.Load assembly name (FQN) ile yükleme yapar, Assembly.LoadFrom ise dosya yolu ile yükleme yapar."
                }
              ],
              "resources": [
                {
                  "id": "resource-reflection-docs",
                  "label": "Microsoft Docs: Reflection",
                  "href": "https://learn.microsoft.com/dotnet/csharp/programming-guide/concepts/reflection",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Reflection konusunda detaylı dokümantasyon."
                }
              ],
              "practice": [
                {
                  "id": "practice-reflection",
                  "title": "Reflection ile Dinamik Nesne Oluşturma",
                  "description": "Reflection kullanarak dinamik nesne oluştur ve metot çağır.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Bir sınıf tanımla",
                    "Activator.CreateInstance ile nesne oluştur",
                    "MethodInfo ile metot bilgisini al",
                    "Invoke ile metodu çağır"
                  ]
                }
              ]
            },
            {
              "label": "Garbage Collection Stratejileri ve Optimizasyonu",
              "href": "/education/lessons/dotnet/runtime/gc-strategies-optimization",
              "description": "GC mekanizmalarını derinlemesine öğren ve performans optimizasyonu yap.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Workstation GC ve Server GC arasındaki farkları anlayabilirsin",
                "GC generation sistemini (0, 1, 2) optimize edebilirsin",
                "IDisposable patternini doğru uygulayabilirsin",
                "Large Object Heap (LOH) kullanımını optimize edebilirsin",
                "GC latency mode larını senaryoya göre seçebilirsin"
              ],
              "sections": [
                {
                  "id": "gc-strategies",
                  "title": "GC Stratejileri",
                  "summary": "Workstation vs Server GC.",
                  "content": [
                    {
                      "type": "text",
                      "body": "GC nin iki ana stratejisi vardır: Workstation GC (client uygulamalar için) ve Server GC (sunucu uygulamaları için). Server GC çoklu thread kullanır ve daha yüksek throughput sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System; n n// GC stratejisi kontrolü nbool isServerGC = GCSettings.IsServerGC; nConsole.WriteLine($ \"Server GC: {isServerGC}\"); n n// GC latency mode nGCLatencyMode mode = GCSettings.LatencyMode; nConsole.WriteLine($ \"Latency Mode: {mode} "); n n// Latency mode değiştirme (dikkatli kullan) n// GCSettings.LatencyMode = GCLatencyMode.LowLatency;",
                      "explanation": "GC stratejisi ve latency mode kontrolü."
                    }
                  ]
                },
                {
                  "id": "gc-optimization",
                  "title": "GC Optimizasyonu",
                  "summary": "Performans için GC optimizasyon teknikleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "GC optimizasyonu için: IDisposable pattern kullan, büyük nesnelerden kaçın, string concatenation yerine StringBuilder kullan, event handler ları unsubscribe et."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// IDisposable pattern örneği npublic class ResourceManager : IDisposable n{ n    private bool disposed = false; n     n    public void Dispose() n    { n        Dispose(true); n        GC.SuppressFinalize(this); n    } n     n    protected virtual void Dispose(bool disposing) n    { n        if (!disposed) n        { n            if (disposing) n            { n                // Managed kaynakları temizle n            } n            // Unmanaged kaynakları temizle n            disposed = true; n        } n    } n}",
                      "explanation": "IDisposable pattern implementasyonu."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-gc-strategies",
                  "question": "Server GC ne zaman kullanılmalıdır?",
                  "options": [
                    "Tüm uygulamalarda",
                    "Sunucu uygulamalarında yüksek throughput gerektiğinde",
                    "Sadece desktop uygulamalarında",
                    "Hiçbir zaman"
                  ],
                  "answer": "Sunucu uygulamalarında yüksek throughput gerektiğinde",
                  "rationale": "Server GC çoklu thread kullanır ve sunucu uygulamalarında daha yüksek throughput sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-gc-docs",
                  "label": "Microsoft Docs: Garbage Collection",
                  "href": "https://learn.microsoft.com/dotnet/standard/garbage-collection/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "GC hakkında detaylı dokümantasyon."
                }
              ],
              "practice": [
                {
                  "id": "practice-gc-optimization",
                  "title": "GC Optimizasyonu",
                  "description": "IDisposable pattern implementasyonu yap ve GC performansını ölç.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "IDisposable interface ini implement et",
                    "Using statement ile kaynak yönetimi yap",
                    "GC istatistiklerini ölç ve karşılaştır"
                  ]
                }
              ]
            },
            {
              "label": "JIT Compilation Süreçleri ve Tiered Compilation",
              "href": "/education/lessons/dotnet/runtime/jit-tiered-compilation",
              "description": "JIT compilation mekanizmasını ve tiered compilation stratejisini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "JIT compiler IL kodunu native koda çevirir",
                "Tiered compilation performans ve başlatma süresi arasında denge sağlar",
                "Tier 0 (Quick JIT) hızlı başlatma sağlar",
                "Tier 1 (Optimized JIT) hot path ler için optimize edilmiş kod üretir",
                "AOT compilation başlatma süresini azaltır"
              ],
              "sections": [
                {
                  "id": "jit-process",
                  "title": "JIT Compilation Süreci",
                  "summary": "IL den native koda dönüşüm.",
                  "content": [
                    {
                      "type": "text",
                      "body": "JIT compiler, IL (Intermediate Language) kodunu çalışma zamanında native makine koduna çevirir. Bu süreç metod ilk çağrıldığında gerçekleşir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// JIT compilation otomatik olarak gerçekleşir n// İlk çağrıda metod derlenir ve cache lenir npublic class MyClass n{ n    public void MyMethod() n    { n        // Bu metod ilk çağrıldığında JIT tarafından derlenir n        Console.WriteLine("Hello from JIT compiled method "); n    } n}",
                      "explanation": "JIT compilation otomatik olarak gerçekleşir, ilk metod çağrısında."
                    }
                  ]
                },
                {
                  "id": "tiered-compilation",
                  "title": "Tiered Compilation",
                  "summary": "İki seviyeli derleme stratejisi.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Tiered compilation, iki seviyeli derleme stratejisidir: Tier 0 (Quick JIT) hızlı başlatma, Tier 1 (Optimized JIT) performans optimizasyonu sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Tiered compilation varsayılan olarak açıktır (.NET Core 2.1+) n// Runtime.json ile yapılandırılabilir: n// { n//  "runtimeOptions ": { n//    "TieredCompilation ": true n//   } n// }",
                      "explanation": "Tiered compilation varsayılan olarak açıktır."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-jit-tiered",
                  "question": "Tiered compilation ın avantajı nedir?",
                  "options": [
                    "Sadece hızlı başlatma sağlar",
                    "Başlatma süresi ve performans arasında denge sağlar",
                    "Sadece performans sağlar",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Başlatma süresi ve performans arasında denge sağlar",
                  "rationale": "Tiered compilation, Tier 0 ile hızlı başlatma, Tier 1 ile performans optimizasyonu sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-jit-docs",
                  "label": "Microsoft Docs: Tiered Compilation",
                  "href": "https://learn.microsoft.com/dotnet/core/runtime-config/compilation",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Tiered compilation dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-jit",
                  "title": "JIT Compilation Analizi",
                  "description": "JIT compilation sürecini gözlemle ve tiered compilation etkisini ölç.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Metod çağrı sürelerini ölç",
                    "İlk çağrı vs sonraki çağrıları karşılaştır",
                    "Tiered compilation etkisini gözlemle"
                  ]
                }
              ]
            },
            {
              "label": "Base Class Library (BCL) Kullanımı",
              "href": "/education/lessons/dotnet/runtime/bcl-usage",
              "description": "BCLın temel namespace lerini ve kullanım senaryolarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Başlangıç",
              "keyTakeaways": [
                "BCLın ana namespace lerini (System, System.Collections.Generic, System.Linq) tanıyabilirsin",
                "Generic koleksiyonların avantajlarını anlayabilirsin",
                "LINQ ile koleksiyon sorgulama yapabilirsin",
                "System.Threading ile async/await kullanabilirsin",
                "System.Text ile string işlemleri yapabilirsin"
              ],
              "sections": [
                {
                  "id": "bcl-namespaces",
                  "title": "BCL Namespace leri",
                  "summary": "Temel namespace ler ve kullanımları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "BCL, .NET Core un temel sınıf kütüphanesidir. System, System.Collections.Generic, System.Linq, System.Threading, System.Text gibi namespace ler içerir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System; nusing System.Collections.Generic; nusing System.Linq; nusing System.Threading.Tasks; n n// Generic Collections nvar list = new List<int> { 1, 2, 3, 4, 5 }; nvar dict = new Dictionary<string, int>(); n n// LINQ nvar evens = list.Where(x => x % 2 == 0).ToList(); n n// Async/Await nawait Task.Delay(1000);",
                      "explanation": "BCLın temel namespace lerinin kullanımı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-bcl",
                  "question": "BCL nedir?",
                  "options": [
                    "Sadece System namespace i",
                    ".NET Core un temel sınıf kütüphanesi",
                    "Sadece koleksiyonlar",
                    "Sadece LINQ"
                  ],
                  "answer": ".NET Core un temel sınıf kütüphanesi",
                  "rationale": "BCL (Base Class Library), .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-bcl-docs",
                  "label": "Microsoft Docs: .NET API Reference",
                  "href": "https://learn.microsoft.com/dotnet/api/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "BCL API referansı."
                }
              ],
              "practice": [
                {
                  "id": "practice-bcl",
                  "title": "BCL Kullanımı",
                  "description": "Farklı BCL namespace lerini kullanarak örnek uygulama yap.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Kolay",
                  "instructions": [
                    "Generic koleksiyonlar kullan",
                    "LINQ sorguları yaz",
                    "Async/await kullan",
                    "String işlemleri yap"
                  ]
                }
              ]
            },
            {
              "label": "Runtime Hosting Modelleri",
              "href": "/education/lessons/dotnet/runtime/runtime-hosting-models",
              "description": "Farklı runtime hosting modellerini ve kullanım senaryolarını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Self-contained ve framework-dependent deployment modellerini anlayabilirsin",
                "Single-file deployment avantajlarını öğrenebilirsin",
                "ReadyToRun (R2R) compilation kullanabilirsin",
                "Native AOT deployment modelini anlayabilirsin",
                "Deployment model seçimini senaryoya göre yapabilirsin"
              ],
              "sections": [
                {
                  "id": "hosting-models",
                  "title": "Hosting Modelleri",
                  "summary": "Farklı deployment modelleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": ".NET Core farklı hosting modelleri sunar: Framework-dependent (FDD), Self-contained (SCD), Single-file, ReadyToRun (R2R) ve Native AOT."
                    },
                    {
                      "type": "code",
                      "language": "bash",
                      "code": "# Framework-dependent deployment n# .NET runtime sistemde yüklü olmalı ndotnet publish -c Release n n# Self-contained deployment n# .NET runtime uygulamayla birlikte gelir ndotnet publish -c Release --self-contained true n n# Single-file deployment ndotnet publish -c Release -p:PublishSingleFile=true n n# ReadyToRun ndotnet publish -c Release -p:PublishReadyToRun=true",
                      "explanation": "Farklı deployment modelleri için publish komutları."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-hosting",
                  "question": "Self-contained deployment in avantajı nedir?",
                  "options": [
                    "Daha küçük dosya boyutu",
                    ".NET runtime ın sistemde yüklü olması gerekmez",
                    "Daha hızlı başlatma",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": ".NET runtime ın sistemde yüklü olması gerekmez",
                  "rationale": "Self-contained deployment, .NET runtime ı uygulamayla birlikte paketler, bu yüzden sistemde .NET yüklü olması gerekmez."
                }
              ],
              "resources": [
                {
                  "id": "resource-hosting-docs",
                  "label": "Microsoft Docs: .NET Deployment",
                  "href": "https://learn.microsoft.com/dotnet/core/deploying/",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Deployment modelleri dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-hosting",
                  "title": "Deployment Model Karşılaştırması",
                  "description": "Farklı deployment modellerini test et ve karşılaştır.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "FDD ve SCD modellerini test et",
                    "Dosya boyutlarını karşılaştır",
                    "Başlatma sürelerini ölç"
                  ]
                }
              ]
            },
            {
              "label": "Memory Management Best Practices",
              "href": "/education/lessons/dotnet/runtime/memory-management-best-practices",
              "description": "Bellek yönetimi için en iyi uygulamaları öğren ve performansı optimize et.",
              "estimatedDurationMinutes": 50,
              "level": "Orta",
              "keyTakeaways": [
                "Stack ve heap kullanımını anlayabilirsin",
                "Value type vs reference type farklarını kavrayabilirsin",
                "IDisposable patternini doğru uygulayabilirsin",
                "Memory leak leri önleyebilirsin",
                "Large Object Heap (LOH) kullanımını optimize edebilirsin"
              ],
              "sections": [
                {
                  "id": "memory-basics",
                  "title": "Bellek Temelleri",
                  "summary": "Stack ve heap kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "C# dilinde value typelar stack te, reference type lar heap te saklanır. Stack hızlı ama sınırlı, heap yavaş ama büyük."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Value type (stack) nint number = 42; nbool flag = true; n n// Reference type (heap) nstring text ="Hello "; nList<int> list = new List<int>(); n n// Struct (value type, stack) nstruct Point n{ n    public int X; n    public int Y; n} n n// Class (reference type, heap) nclass Person n{ n    public string Name; n}",
                      "explanation": "Value type ve reference type örnekleri."
                    }
                  ]
                },
                {
                  "id": "memory-optimization",
                  "title": "Bellek Optimizasyonu",
                  "summary": "En iyi uygulamalar.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Bellek optimizasyonu için: IDisposable kullan, büyük nesnelerden kaçın, string concatenation yerine StringBuilder kullan, event handler ları unsubscribe et, using statement kullan."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Using statement ile otomatik dispose nusing (var stream = new FileStream("file.txt ", FileMode.Open)) n{ n    // Stream kullanımı n} n// Stream otomatik dispose edilir n n// StringBuilder kullanımı nvar sb = new StringBuilder(); nfor (int i = 0; i < 1000; i++) n{ n    sb.Append(i.ToString()); n} nstring result = sb.ToString();",
                      "explanation": "Bellek optimizasyonu örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-memory",
                  "question": "Value typelar nerede saklanır?",
                  "options": [
                    "Heap te",
                    "Stack te",
                    "Her ikisinde de",
                    "Hiçbirinde"
                  ],
                  "answer": "Stack te",
                  "rationale": "Value typelar (int, bool, struct) stack te saklanır ve değerleri doğrudan taşınır."
                }
              ],
              "resources": [
                {
                  "id": "resource-memory-docs",
                  "label": "Microsoft Docs: Memory Management",
                  "href": "https://learn.microsoft.com/dotnet/standard/garbage-collection/",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Bellek yönetimi dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-memory",
                  "title": "Bellek Optimizasyonu",
                  "description": "IDisposable pattern kullan ve bellek kullanımını optimize et.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "IDisposable implement et",
                    "Using statement kullan",
                    "Bellek kullanımını ölç ve optimize et"
                  ]
                }
              ]
            },
            {
              "label": "Platform Abstraction Layer (PAL)",
              "href": "/education/lessons/dotnet/runtime/platform-abstraction-layer",
              "description": "PAL ın rolünü ve platform bağımsızlığını nasıl sağladığını öğren.",
              "estimatedDurationMinutes": 35,
              "level": "İleri",
              "keyTakeaways": [
                "PAL ın .NET Core un platform bağımsızlığını nasıl sağladığını anlayabilirsin",
                "Platform-specific API lerin nasıl abstract edildiğini öğrenebilirsin",
                "RuntimeIdentifier (RID) kavramını anlayabilirsin",
                "Cross-platform geliştirme prensiplerini kavrayabilirsin",
                "Platform detection API lerini kullanabilirsin"
              ],
              "sections": [
                {
                  "id": "pal-overview",
                  "title": "PAL Genel Bakış",
                  "summary": "Platform bağımsızlık katmanı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "PAL (Platform Abstraction Layer), .NET Core un platform bağımsızlığını sağlar. Platform-specific API leri abstract eder ve cross-platform çalışmayı mümkün kılar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.Runtime.InteropServices; n n// Platform detection nif (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) n{ n    Console.WriteLine("Windows platform "); n} nelse if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)) n{ n    Console.WriteLine("Linux platform "); n} nelse if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX)) n{ n    Console.WriteLine("macOS platform "); n} n n// Architecture nConsole.WriteLine($ \"Architecture: {RuntimeInformation.ProcessArchitecture} ");",
                      "explanation": "Platform detection örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-pal",
                  "question": "PAL ın amacı nedir?",
                  "options": [
                    "Sadece Windows desteği",
                    "Platform bağımsızlığı sağlamak",
                    "Sadece Linux desteği",
                    "Hiçbir şey"
                  ],
                  "answer": "Platform bağımsızlığı sağlamak",
                  "rationale": "PAL (Platform Abstraction Layer), .NET Core un farklı platformlarda çalışmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-pal-docs",
                  "label": "Microsoft Docs: Cross-platform",
                  "href": "https://learn.microsoft.com/dotnet/core/deploying/",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Cross-platform geliştirme dokümantasyonu."
                }
              ],
              "practice": [
                {
                  "id": "practice-pal",
                  "title": "Platform Detection",
                  "description": "Platform detection API lerini kullan ve platform-specific kod yaz.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "RuntimeInformation kullan",
                    "Platform detection yap",
                    "Platform-specific kod yaz"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "module-03-project-structure",
          "title": "Proje Yapısı ve Dependency Injection",
          "summary": "Katmanlı klasörleme, SOLID prensipleri ve DI container yapılandırmalarıyla bakım kolaylığı sağla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında maintainable solution yapıları kurup dependency injection kayıtlarını temiz şekilde yönetebileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Clean%20Architecture",
            "description": "Katmanlı solution tasarımları ve DI desenlerini adım adım öğren."
          },
          "relatedTopics": [
            {
              "label": "Solution Katmanlarını Tasarlama",
              "href": "/education/lessons/architecture/clean-architecture/solution-structure",
              "description": "Domain, Application ve Infrastructure katmanlarını konumlandır."
            },
            {
              "label": "Servis Kayıtlarını Düzenleme",
              "href": "/education/lessons/architecture/clean-architecture/service-registration",
              "description": "Extension metotlarıyla modüler DI kayıtları oluştur."
            },
            {
              "label": "Sınır Bağımlılıklarını Yönetme",
              "href": "/education/lessons/architecture/clean-architecture/dependency-rules",
              "description": "Katmanlar arası bağımlılık kurallarını SOLID ile hizala."
            },
            {
              "label": "Interface Segregation Principle (ISP)",
              "href": "/education/lessons/architecture/solid/interface-segregation",
              "description": "ISP prensibini öğren ve gereksiz bağımlılıkları önle.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "ISP, client ların kullanmadığı interface metodlarına bağımlı olmamasını sağlar",
                "Büyük interface leri küçük, spesifik interface lere böl",
                "ISP test edilebilirliği ve bakım kolaylığını artırır",
                "YAGNI (You Aren t Gonna Need It) prensibini uygula"
              ],
              "sections": [
                {
                  "id": "isp-principle",
                  "title": "ISP Prensibi",
                  "summary": "Interface segregation nedir?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Interface Segregation Principle (ISP), client ların kullanmadığı interface metodlarına bağımlı olmamasını gerektirir. Büyük interface leri küçük, spesifik interface lere bölmek gerekir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Tüm metodları içeren büyük interface npublic interface IWorker n{ n    void Work(); n    void Eat(); n    void Sleep(); n} n n// İyi: Küçük, spesifik interface ler npublic interface IWorkable n{ n    void Work(); n} n npublic interface IEatable n{ n    void Eat(); n} n npublic interface ISleepable n{ n    void Sleep(); n}",
                      "explanation": "Büyük interface leri küçük, spesifik interface lere bölerek ISP yi uygula."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-isp",
                  "question": "ISP nin amacı nedir?",
                  "options": [
                    "Daha fazla interface oluşturmak",
                    "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
                    "Daha az kod yazmak",
                    "Hiçbir şey"
                  ],
                  "answer": "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
                  "rationale": "ISP, client ların sadece ihtiyaç duydukları metodlara bağımlı olmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-isp-docs",
                  "label": "SOLID Principles: ISP",
                  "href": "https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "ISP hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-isp",
                  "title": "ISP Uygulaması",
                  "description": "Büyük bir interface i küçük interface lere böl.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Büyük bir interface tanımla",
                    "Küçük, spesifik interface lere böl",
                    "Client ları güncelle"
                  ]
                }
              ]
            },
            {
              "label": "Dependency Inversion Principle (DIP)",
              "href": "/education/lessons/architecture/solid/dependency-inversion",
              "description": "DIP prensibini öğren ve yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağla.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "DIP, yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını gerektirir",
                "Her ikisi de abstraction lara (interface lere) bağımlı olmalıdır",
                "DIP test edilebilirliği ve esnekliği artırır",
                "Dependency Injection DIP yi uygulamanın bir yoludur"
              ],
              "sections": [
                {
                  "id": "dip-principle",
                  "title": "DIP Prensibi",
                  "summary": "Dependency inversion nedir?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Dependency Inversion Principle (DIP), yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını gerektirir. Her ikisi de abstraction lara (interface lere) bağımlı olmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Yüksek seviye modül düşük seviye modüle bağımlı npublic class OrderService n{ n    private SqlServerRepository _repository = new SqlServerRepository(); n    // OrderService, SqlServerRepository ye doğrudan bağımlı n} n n// İyi: Her ikisi de interface e bağımlı npublic interface IRepository n{ n    void Save(Order order); n} n npublic class OrderService n{ n    private readonly IRepository _repository; n    public OrderService(IRepository repository) n    { n        _repository = repository; n    } n}",
                      "explanation": "DIP yi uygulayarak yüksek seviye modüllerin düşük seviye modüllere bağımlı olmasını önle."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-dip",
                  "question": "DIP nin amacı nedir?",
                  "options": [
                    "Daha fazla interface oluşturmak",
                    "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
                    "Daha az kod yazmak",
                    "Hiçbir şey"
                  ],
                  "answer": "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
                  "rationale": "DIP, yüksek seviye modüllerin abstraction lara (interface lere) bağımlı olmasını sağlar."
                }
              ],
              "resources": [
                {
                  "id": "resource-dip-docs",
                  "label": "SOLID Principles: DIP",
                  "href": "https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "DIP hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-dip",
                  "title": "DIP Uygulaması",
                  "description": "DIP prensibini uygulayarak bağımlılıkları tersine çevir.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Yüksek seviye modül tanımla",
                    "Interface oluştur",
                    "Dependency injection kullan"
                  ]
                }
              ]
            },
            {
              "label": "Service Lifetime Yönetimi",
              "href": "/education/lessons/architecture/di/service-lifetime",
              "description": "Singleton, Scoped ve Transient lifetime larını öğren ve doğru kullan.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Singleton: Uygulama yaşam döngüsü boyunca tek bir instance",
                "Scoped: Her HTTP request için bir instance",
                "Transient: Her çağrıda yeni instance",
                "Lifetime seçimi performans ve thread-safety yi etkiler",
                "Yanlış lifetime seçimi memory leak lere neden olabilir"
              ],
              "sections": [
                {
                  "id": "lifetime-types",
                  "title": "Lifetime Türleri",
                  "summary": "Singleton, Scoped, Transient.",
                  "content": [
                    {
                      "type": "text",
                      "body": "ASP.NET Core da üç service lifetime türü vardır: Singleton (uygulama yaşam döngüsü boyunca tek instance), Scoped (her HTTP request için bir instance), Transient (her çağrıda yeni instance)."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Service kayıtları nservices.AddSingleton<ISingletonService, SingletonService>(); nservices.AddScoped<IScopedService, ScopedService>(); nservices.AddTransient<ITransientService, TransientService>(); n n// Singleton: Uygulama boyunca tek instance n// Scoped: Request başına bir instance n// Transient: Her çağrıda yeni instance",
                      "explanation": "Farklı lifetime türlerinin kullanımı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-lifetime",
                  "question": "Scoped lifetime ne zaman kullanılmalıdır?",
                  "options": [
                    "Her zaman",
                    "Her HTTP request için bir instance gerektiğinde",
                    "Sadece singleton alternatifi olarak",
                    "Hiçbir zaman"
                  ],
                  "answer": "Her HTTP request için bir instance gerektiğinde",
                  "rationale": "Scoped lifetime, her HTTP request için bir instance oluşturur, bu da Entity Framework DbContext gibi servisler için idealdir."
                }
              ],
              "resources": [
                {
                  "id": "resource-lifetime-docs",
                  "label": "Microsoft Docs: Dependency Injection",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/dependency-injection",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Service lifetime hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-lifetime",
                  "title": "Lifetime Yönetimi",
                  "description": "Farklı lifetime türlerini kullan ve davranışlarını gözlemle.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Farklı lifetime türleriyle servis kaydet",
                    "Instance ları gözlemle",
                    "Thread-safety yi test et"
                  ]
                }
              ]
            },
            {
              "label": "Factory Pattern ile DI",
              "href": "/education/lessons/architecture/di/factory-pattern",
              "description": "Factory pattern kullanarak dinamik servis oluşturma.",
              "estimatedDurationMinutes": 40,
              "level": "İleri",
              "keyTakeaways": [
                "Factory pattern, servis oluşturma mantığını merkezileştirir",
                "IFactory<T> interface i ile factory pattern uygulanabilir",
                "Factory pattern, runtime da servis seçimine izin verir",
                "Func<T> delegate i de factory olarak kullanılabilir"
              ],
              "sections": [
                {
                  "id": "factory-pattern",
                  "title": "Factory Pattern",
                  "summary": "Factory pattern ile servis oluşturma.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Factory pattern, servis oluşturma mantığını merkezileştirir. IFactory<T> interface i veya Func<T> delegate i kullanılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Factory interface npublic interface ILoggerFactory n{ n    ILogger CreateLogger(string category); n} n n// Factory implementasyonu npublic class LoggerFactory : ILoggerFactory n{ n    public ILogger CreateLogger(string category) n    { n        return new ConsoleLogger(category); n    } n} n n// Kullanım nservices.AddSingleton<ILoggerFactory, LoggerFactory>();",
                      "explanation": "Factory pattern ile servis oluşturma örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-factory",
                  "question": "Factory patternin avantajı nedir?",
                  "options": [
                    "Daha hızlı servis oluşturma",
                    "Servis oluşturma mantığını merkezileştirme",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Servis oluşturma mantığını merkezileştirme",
                  "rationale": "Factory pattern, servis oluşturma mantığını merkezileştirerek kod tekrarını azaltır."
                }
              ],
              "resources": [
                {
                  "id": "resource-factory-docs",
                  "label": "Factory Pattern",
                  "href": "https://refactoring.guru/design-patterns/factory-method",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Factory pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-factory",
                  "title": "Factory Pattern Uygulaması",
                  "description": "Factory pattern kullanarak dinamik servis oluştur.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "İleri",
                  "instructions": [
                    "Factory interface oluştur",
                    "Factory implementasyonu yap",
                    "DI container a kaydet ve kullan"
                  ]
                }
              ]
            },
            {
              "label": "Options Pattern Kullanımı",
              "href": "/education/lessons/architecture/di/options-pattern",
              "description": "Options pattern ile konfigürasyon yönetimi.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Options pattern, strongly-typed configuration sağlar",
                "IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T> kullanılabilir",
                "Options pattern validation desteği sağlar",
                "Options pattern, appsettings.json dan otomatik yüklenir"
              ],
              "sections": [
                {
                  "id": "options-pattern",
                  "title": "Options Pattern",
                  "summary": "Strongly-typed configuration.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Options pattern, strongly-typed configuration sağlar. IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T> interface leri kullanılabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Options class npublic class DatabaseOptions n{ n    public string ConnectionString { get; set; } n    public int Timeout { get; set; } n} n n// Kayıt nservices.Configure<DatabaseOptions>(configuration.GetSection("Database ")); n n// Kullanım npublic class MyService n{ n    private readonly DatabaseOptions _options; n    public MyService(IOptions<DatabaseOptions> options) n    { n        _options = options.Value; n    } n}",
                      "explanation": "Options pattern kullanım örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-options",
                  "question": "Options patternin avantajı nedir?",
                  "options": [
                    "Daha hızlı configuration",
                    "Strongly-typed configuration ve validation",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Strongly-typed configuration ve validation",
                  "rationale": "Options pattern, strongly-typed configuration sağlar ve validation desteği sunar."
                }
              ],
              "resources": [
                {
                  "id": "resource-options-docs",
                  "label": "Microsoft Docs: Options Pattern",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/configuration/options",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Options pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-options",
                  "title": "Options Pattern Uygulaması",
                  "description": "Options pattern kullanarak configuration yönet.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Options class oluştur",
                    "appsettings.json a ekle",
                    "IOptions<T> kullan"
                  ]
                }
              ]
            },
            {
              "label": "Extension Methods ile DI Kayıtları",
              "href": "/education/lessons/architecture/di/extension-methods",
              "description": "Extension methods ile modüler servis kayıtları.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Extension methods, servis kayıtlarını modülerleştirir",
                "IServiceCollection extension metodları oluştur",
                "Extension methods, kod organizasyonunu iyileştirir",
                "Her modül kendi extension metodunu sağlayabilir"
              ],
              "sections": [
                {
                  "id": "extension-methods",
                  "title": "Extension Methods",
                  "summary": "Modüler servis kayıtları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Extension methods, servis kayıtlarını modülerleştirir. IServiceCollection extension metodları oluşturarak her modül kendi servislerini kaydedebilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Extension method npublic static class ServiceCollectionExtensions n{ n    public static IServiceCollection AddMyServices(this IServiceCollection services) n    { n        services.AddScoped<IMyService, MyService>(); n        services.AddSingleton<IMyRepository, MyRepository>(); n        return services; n    } n} n n// Kullanım nservices.AddMyServices();",
                      "explanation": "Extension methods ile modüler servis kayıtları."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-extension",
                  "question": "Extension methods ın avantajı nedir?",
                  "options": [
                    "Daha hızlı servis kaydı",
                    "Modüler ve organize servis kayıtları",
                    "Daha az kod",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Modüler ve organize servis kayıtları",
                  "rationale": "Extension methods, servis kayıtlarını modülerleştirir ve kod organizasyonunu iyileştirir."
                }
              ],
              "resources": [
                {
                  "id": "resource-extension-docs",
                  "label": "Microsoft Docs: Extension Methods",
                  "href": "https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/extension-methods",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Extension methods hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-extension",
                  "title": "Extension Methods Uygulaması",
                  "description": "Extension methods ile modüler servis kayıtları oluştur.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "Extension method oluştur",
                    "Servis kayıtlarını ekle",
                    "Program.cs de kullan"
                  ]
                }
              ]
            },
            {
              "label": "Service Locator Pattern ve Anti-Pattern ler",
              "href": "/education/lessons/architecture/di/service-locator-anti-patterns",
              "description": "Service Locator patternini öğren ve anti-pattern lerden kaçın.",
              "estimatedDurationMinutes": 40,
              "level": "İleri",
              "keyTakeaways": [
                "Service Locator pattern bir anti-pattern dir",
                "Dependency Injection, Service Locator dan daha iyidir",
                "Hidden dependencies test edilebilirliği azaltır",
                "Constructor injection tercih edilmelidir"
              ],
              "sections": [
                {
                  "id": "service-locator",
                  "title": "Service Locator Anti-Pattern",
                  "summary": "Service Locator neden kötü?",
                  "content": [
                    {
                      "type": "text",
                      "body": "Service Locator pattern bir anti-pattern dir çünkü hidden dependencies oluşturur ve test edilebilirliği azaltır. Dependency Injection tercih edilmelidir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Kötü: Service Locator npublic class MyService n{ n    public void DoSomething() n    { n        var dependency = ServiceLocator.GetService<IDependency>(); n        // Hidden dependency! n    } n} n n// İyi: Dependency Injection npublic class MyService n{ n    private readonly IDependency _dependency; n    public MyService(IDependency dependency) n    { n        _dependency = dependency; // Explicit dependency n    } n}",
                      "explanation": "Service Locator yerine Dependency Injection kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-locator",
                  "question": "Service Locator neden anti-pattern dir?",
                  "options": [
                    "Daha yavaştır",
                    "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
                    "Daha fazla kod gerektirir",
                    "Hiçbir nedeni yoktur"
                  ],
                  "answer": "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
                  "rationale": "Service Locator, hidden dependencies oluşturur ve test edilebilirliği azaltır."
                }
              ],
              "resources": [
                {
                  "id": "resource-locator-docs",
                  "label": "Service Locator Anti-Pattern",
                  "href": "https://martinfowler.com/articles/injection.html",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Service Locator anti-pattern hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-locator",
                  "title": "Anti-Pattern leri Önleme",
                  "description": "Service Locator kullanımını Dependency Injection a çevir.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "İleri",
                  "instructions": [
                    "Service Locator kullanımını bul",
                    "Constructor injection a çevir",
                    "Test edilebilirliği iyileştir"
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "module-04-aspnet-mvc",
          "title": "ASP.NET Core MVC",
          "summary": "MVC pattern ile server-rendered uygulamalar geliştir ve view lifecycle ını yönet.",
          "durationMinutes": 240,
          "objectives": [
            "MVC patternin temel bileşenlerini (Model, View, Controller) anlayıp uygulayabileceksin",
            "Routing mekanizmasını (convention-based ve attribute routing) kullanarak URL yapılarını yönetebileceksin",
            "Model binding ve validasyon süreçlerini uçtan uca uygulayabileceksin",
            "Razor view engine ile dinamik HTML içerikleri oluşturabileceksin",
            "View lifecycle ını anlayıp partial views, view components ve tag helpers kullanabileceksin",
            "Action filters ve result filters ile cross-cutting concerns leri yönetebileceksin"
          ],
          "activities": [
            {
              "id": "activity-mvc-pattern-intro",
              "type": "concept",
              "title": "MVC Pattern Temelleri",
              "estimatedMinutes": 20,
              "content": "Model-View-Controller (MVC) pattern, uygulama mantığını üç ana bileşene ayırarak separation of concerns prensibini uygular: n n**Model**: Veri ve iş mantığını temsil eder. Domain modelleri, veri erişim katmanı ve business logic burada yer alır. n n**View**: Kullanıcı arayüzünü temsil eder. Razor view engine ile HTML içerikleri oluşturulur ve model verileri görüntülenir. n n**Controller**: Kullanıcı girişlerini işler, model ile etkileşime girer ve uygun view ı seçer. Action methods HTTP isteklerini işler. n nASP.NET Core MVC de bu bileşenler dependency injection ile gevşek bağlı (loosely coupled) şekilde çalışır.",
              "highlights": [
                "MVC pattern separation of concerns sağlayarak test edilebilirliği artırır",
                "Controller lar action methods içerir ve HTTP isteklerini işler",
                "View lar Razor syntax ile dinamik HTML üretir",
                "Model binding otomatik olarak HTTP verilerini C# nesnelerine dönüştürür"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "HomeController.cs",
                  "code": "using Microsoft.AspNetCore.Mvc; n nnamespace MyApp.Controllers n{ n    public class HomeController : Controller n    { n        public IActionResult Index() n        { n            var model = new { Message ="Hoş geldiniz! \" }; n            return View(model); n        } n    } n}",
                  "explanation": "Basit bir MVC controller örneği. Index action method u bir view döndürür."
                }
              ],
              "checklist": [
                {
                  "id": "check-mvc-components",
                  "label": "MVC nin üç ana bileşenini (Model, View, Controller) anladığını doğrula",
                  "explanation": "Her bileşenin sorumluluğunu açıklayabilmelisin"
                },
                {
                  "id": "check-controller-basics",
                  "label": "Controller sınıfının Controller base class ından türediğini öğren",
                  "explanation": "Controller base class View(), Json(), Redirect() gibi helper method lar sağlar"
                }
              ]
            },
            {
              "id": "activity-controller-actions",
              "type": "guided-exercise",
              "title": "Controller ve Action Methods Oluşturma",
              "estimatedMinutes": 30,
              "description": "Bir MVC controller oluşturup farklı action method türlerini uygulayacaksın.",
              "steps": [
                {
                  "title": "Projeyi hazırla",
                  "detail": "dotnet new mvc -n MvcDemo komutu ile yeni bir MVC projesi oluştur.",
                  "hint": "MVC template i Views, Controllers ve Models klasörlerini otomatik oluşturur"
                },
                {
                  "title": "Yeni controller ekle",
                  "detail": "Controllers klasörüne ProductsController.cs dosyası ekle ve temel CRUD action ları oluştur.",
                  "hint": "Controller isimleri  Controller  ile bitmeli ve Controller base class ından türemeli"
                },
                {
                  "title": "Action method türlerini uygula",
                  "detail": "Index (GET), Create (GET ve POST), Details (GET), Edit (GET ve POST), Delete (GET ve POST) action larını ekle.",
                  "hint": "HTTP verb lerine göre method isimlendirmesi yap: [HttpGet], [HttpPost] attribute larını kullan"
                },
                {
                  "title": "View ları oluştur",
                  "detail": "Her action için Views/Products klasöründe ilgili Razor view dosyalarını oluştur.",
                  "hint": "View() method u Views/{Controller}/{Action}.cshtml dosyasını arar"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "ProductsController.cs",
                "code": "using Microsoft.AspNetCore.Mvc; n nnamespace MvcDemo.Controllers n{ n    public class ProductsController : Controller n    { n        // TODO: Index action method unu ekle n        // TODO: Create (GET ve POST) action larını ekle n        // TODO: Details action ını ekle n    } n}",
                "explanation": "Controller iskeleti. Action method ları ekleyerek tamamla."
              },
              "hints": [
                "Action method lar public ve IActionResult (veya ActionResult) döndürmeli",
                "View() method una model parametresi geçerek view a veri aktarabilirsin",
                "RedirectToAction() ile başka bir action a yönlendirme yapabilirsin"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Tüm action method lar doğru HTTP verb attribute larına sahip",
                  "View lar ilgili action lardan çağrılıyor",
                  "Model verileri view lara doğru şekilde aktarılıyor"
                ]
              }
            },
            {
              "id": "activity-routing-concepts",
              "type": "concept",
              "title": "Routing Mekanizması",
              "estimatedMinutes": 25,
              "content": "Routing, gelen HTTP isteklerini uygun controller action ına yönlendiren mekanizmadır. ASP.NET Core MVC de iki tür routing vardır: n n**Convention-based Routing**: Program.cs veya Startup.cs de MapControllerRoute ile tanımlanır. Varsayılan pattern: `{controller=Home}/{action=Index}/{id?}` n n**Attribute Routing**: Controller ve action method larına [Route] attribute u ile doğrudan tanımlanır. Daha esnek ve açık bir yaklaşımdır. n nRoute constraints ile parametre tiplerini kısıtlayabilir, route values ile dinamik segmentler oluşturabilirsin.",
              "highlights": [
                "Convention-based routing merkezi yönetim sağlar, attribute routing daha esnektir",
                "Route constraints (int, min, max, regex) ile parametre validasyonu yapılabilir",
                "Route order önemlidir - daha spesifik route lar önce tanımlanmalı",
                "Named routes ile URL generation yapılabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "Program.cs",
                  "code": "app.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} \" n);",
                  "explanation": "Varsayılan convention-based route tanımı"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[Route("urunler ")] n[Route("products ")] npublic class ProductsController : Controller n{ n    [Route("liste ")] n    [Route("list ")] n    public IActionResult Index() { ... } n     n    [Route("{id:int} ")] n    public IActionResult Details(int id) { ... } n}",
                  "explanation": "Attribute routing örneği - hem Türkçe hem İngilizce URL desteği"
                }
              ],
              "checklist": [
                {
                  "id": "check-routing-types",
                  "label": "Convention-based ve attribute routing arasındaki farkı anla",
                  "explanation": "Her iki yaklaşımın avantaj ve dezavantajlarını değerlendir"
                },
                {
                  "id": "check-route-constraints",
                  "label": "Route constraints kullanarak tip güvenliği sağla",
                  "explanation": "{id:int} gibi constraint ler ile sadece integer değerler kabul edilir"
                }
              ]
            },
            {
              "id": "activity-routing-practice",
              "type": "guided-exercise",
              "title": "Routing Uygulaması",
              "estimatedMinutes": 25,
              "description": "Hem convention-based hem de attribute routing kullanarak farklı URL pattern leri oluşturacaksın.",
              "steps": [
                {
                  "title": "Custom route tanımla",
                  "detail": "Program.cs de blog yazıları için özel bir route pattern oluştur: blog/{year:int}/{month:int}/{slug}",
                  "hint": "MapControllerRoute ile name, pattern ve defaults parametrelerini kullan"
                },
                {
                  "title": "Attribute routing ekle",
                  "detail": "BlogController a [Route("blog ")] attribute u ekle ve action lara özel route lar tanımla.",
                  "hint": "[Route("{year:int}/{month:int}/{slug} ")] gibi constraint li route lar kullan"
                },
                {
                  "title": "Route test et",
                  "detail": "Farklı URL leri test ederek route ların doğru çalıştığını doğrula.",
                  "hint": "Route debugger veya logging ile route eşleşmelerini gözlemle"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "Program.cs",
                "code": "// TODO: Custom blog route unu ekle napp.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} \" n);",
                "explanation": "Varsayılan route yapılandırması. Blog route unu ekle."
              },
              "validation": {
                "type": "self",
                "criteria": [
                  "Blog route u doğru pattern ile eşleşiyor",
                  "Attribute routing çalışıyor ve constraint ler doğru çalışıyor",
                  "URL generation (Url.Action, Html.ActionLink) doğru route ları üretiyor"
                ]
              }
            },
            {
              "id": "activity-model-binding",
              "type": "concept",
              "title": "Model Binding ve Validasyon",
              "estimatedMinutes": 30,
              "content": "Model binding, HTTP isteğinden gelen verileri (query string, form data, route values, headers) otomatik olarak C# nesnelerine dönüştürür. n n**Binding Sources**: n- Route values: URL segment lerinden n- Query string: ?key=value parametrelerinden n- Form data: POST request body den n- Headers: HTTP header lardan n n**Validasyon**: Data Annotations ([Required], [StringLength], [Range]) veya FluentValidation ile model doğrulama yapılır. ModelState.IsValid ile kontrol edilir. n n**Custom Model Binders**: Özel binding mantığı için IModelBinder interface i implement edilebilir.",
              "highlights": [
                "Model binding otomatik olarak primitive ve complex typeları bind eder",
                "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları binding source u belirtir",
                "ModelState dictionary validation hatalarını içerir",
                "Custom validation attribute ları oluşturulabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "Product.cs",
                  "code": "using System.ComponentModel.DataAnnotations; n npublic class Product n{ n    public int Id { get; set; } n     n    [Required(ErrorMessage ="Ürün adı zorunludur ")] n    [StringLength(100, MinimumLength = 3)] n    public string Name { get; set; } = string.Empty; n     n    [Range(0.01, 10000, ErrorMessage ="Fiyat 0.01 ile 10000 arasında olmalı ")] n    public decimal Price { get; set; } n}",
                  "explanation": "Data Annotations ile model validasyonu"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[HttpPost] npublic IActionResult Create(Product product) n{ n    if (!ModelState.IsValid) n    { n        return View(product); n    } n     n    // Model geçerli, kaydet n    return RedirectToAction(nameof(Index)); n}",
                  "explanation": "ModelState validasyon kontrolü"
                }
              ],
              "checklist": [
                {
                  "id": "check-binding-sources",
                  "label": "Farklı binding source larını ([FromQuery], [FromRoute], vb.) anla",
                  "explanation": "Her source un ne zaman kullanılacağını öğren"
                },
                {
                  "id": "check-validation",
                  "label": "Model validasyonunu uygula ve hata mesajlarını göster",
                  "explanation": "ValidationSummary ve ValidationMessageFor helper larını kullan"
                }
              ]
            },
            {
              "id": "activity-model-binding-practice",
              "type": "guided-exercise",
              "title": "Model Binding ve Validasyon Uygulaması",
              "estimatedMinutes": 35,
              "description": "Form oluşturup model binding ve validasyon sürecini uçtan uca uygulayacaksın.",
              "steps": [
                {
                  "title": "Model sınıfı oluştur",
                  "detail": "RegisterViewModel sınıfı oluştur ve Email, Password, ConfirmPassword alanlarına uygun validation attribute ları ekle.",
                  "hint": "[EmailAddress], [Compare("Password ")] gibi attribute ları kullan"
                },
                {
                  "title": "GET ve POST action ları oluştur",
                  "detail": "AccountController da Register (GET) boş model döndürsün, Register (POST) model i alıp validate etsin.",
                  "hint": "ModelState.IsValid kontrolü yap ve hatalıysa view a geri dön"
                },
                {
                  "title": "View oluştur",
                  "detail": "Register.cshtml view ında Html.BeginForm, Html.TextBoxFor, Html.ValidationMessageFor helper larını kullan.",
                  "hint": "Tag helpers (<form>, <input asp-for>) veya HTML helpers kullanabilirsin"
                },
                {
                  "title": "Client-side validasyon ekle",
                  "detail": "jQuery Unobtrusive Validation script lerini ekleyerek client-side validasyon sağla.",
                  "hint": "_ValidationScriptsPartial.cshtml kullan veya CDN den script leri ekle"
                }
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "RegisterViewModel.cs",
                "code": "using System.ComponentModel.DataAnnotations; n npublic class RegisterViewModel n{ n    // TODO: Email, Password, ConfirmPassword propertylerini ekle n    // TODO: Uygun validation attribute larını ekle n}",
                "explanation": "Model sınıfı iskeleti. Propertyleri ve validasyonları ekle."
              },
              "validation": {
                "type": "self",
                "criteria": [
                  "Model binding doğru çalışıyor (form verileri model e aktarılıyor)",
                  "Server-side validasyon çalışıyor ve hata mesajları gösteriliyor",
                  "Client-side validasyon çalışıyor (sayfa yenilenmeden hatalar gösteriliyor)",
                  "Geçerli verilerle form başarıyla submit ediliyor"
                ]
              }
            },
            {
              "id": "activity-razor-views",
              "type": "concept",
              "title": "Razor View Engine",
              "estimatedMinutes": 25,
              "content": "Razor, C# kodunu HTML ile birleştiren bir view engine dir. @ sembolü ile C# kodunu HTML içine gömebilirsin. n n**Razor Syntax**: n- @variable: Değişken değeri yazdırma n- @{ code }: C# kod blokları n- @if, @foreach, @while: Kontrol yapıları n- @model: View ın model tipini belirtme n- @using: Namespace import n n**Layout ve Sections**: n- _Layout.cshtml: Ana sayfa şablonu n- @RenderBody(): İçerik yerleştirme noktası n- @RenderSection(): İsteğe bağlı bölümler (scripts, styles) n n**Partial Views**: Yeniden kullanılabilir view bileşenleri. @Html.Partial() veya <partial> tag helper ile render edilir.",
              "highlights": [
                "Razor syntax @ ile başlar ve HTML ile sorunsuz entegre olur",
                "Layout lar sayfa yapısını standartlaştırır",
                "Partial views kod tekrarını önler",
                "ViewData, ViewBag, TempData ile controller dan view a veri aktarılır"
              ],
              "codeSamples": [
                {
                  "language": "html",
                  "filename": "Index.cshtml",
                  "code": "@model List<Product> n n<h1>Ürünler</h1> n n@if (Model.Any()) n{ n    <ul> n        @foreach (var product in Model) n        { n            <li>@product.Name - @product.Price.ToString("C ")</li> n        } n    </ul> n} nelse n{ n    <p>Henüz ürün yok.</p> n}",
                  "explanation": "Razor syntax ile model verilerini listeleme"
                },
                {
                  "language": "html",
                  "filename": "_ProductCard.cshtml",
                  "code": "@model Product n n<div class="card "> n    <h3>@Model.Name</h3> n    <p>@Model.Price.ToString("C ")</p> n</div>",
                  "explanation": "Partial view örneği - yeniden kullanılabilir bileşen"
                }
              ],
              "checklist": [
                {
                  "id": "check-razor-syntax",
                  "label": "Temel Razor syntax ını (@, @{}, @if, @foreach) öğren",
                  "explanation": "Razor syntax ı ile dinamik içerik oluşturmayı pratik et"
                },
                {
                  "id": "check-layouts",
                  "label": "Layout yapısını anla ve kullan",
                  "explanation": "_Layout.cshtml ve @RenderBody() kullanımını öğren"
                }
              ]
            },
            {
              "id": "activity-view-lifecycle",
              "type": "concept",
              "title": "View Lifecycle ve Execution",
              "estimatedMinutes": 20,
              "content": "View lifecycle, bir view ın render edilmesinden önce ve sonra gerçekleşen süreçleri ifade eder: n n**View Execution Sırası**: n1. Action method çalışır ve ViewResult döndürür n2. View engine uygun view dosyasını bulur (View discovery) n3. View ın model i set edilir n4. View start dosyaları (_ViewStart.cshtml) çalışır n5. Layout belirlenir (_Layout.cshtml) n6. View render edilir n7. Layout içine view içeriği yerleştirilir (@RenderBody) n8. Sections render edilir (@RenderSection) n n**View Discovery**: n- Views/{Controller}/{Action}.cshtml n- Views/Shared/{Action}.cshtml n- Belirtilen path (View("CustomPath ")) n n**View Components**: Daha karmaşık, yeniden kullanılabilir view bileşenleri için kullanılır. Controller dan bağımsız logic içerebilir.",
              "highlights": [
                "View discovery otomatik olarak view dosyasını bulur",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "View Components hem logic hem de view içerebilir",
                "Partial views sadece HTML render eder, View Components daha güçlüdür"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "public IActionResult Index() n{ n    var products = _productService.GetAll(); n    return View(products); // View discovery: Views/Products/Index.cshtml n} n npublic IActionResult Custom() n{ n    return View("SpecialView "); // Views/Products/SpecialView.cshtml n} n npublic IActionResult Shared() n{ n    return View("~/Views/Shared/CustomView.cshtml "); // Tam path n}",
                  "explanation": "Farklı view discovery senaryoları"
                }
              ],
              "checklist": [
                {
                  "id": "check-view-discovery",
                  "label": "View discovery mekanizmasını anla",
                  "explanation": "View() method unun view dosyasını nasıl bulduğunu öğren"
                },
                {
                  "id": "check-view-components",
                  "label": "View Components kavramını öğren",
                  "explanation": "View Components in partial view lerden farkını anla"
                }
              ]
            },
            {
              "id": "activity-tag-helpers",
              "type": "guided-exercise",
              "title": "Tag Helpers ile Form Geliştirme",
              "estimatedMinutes": 30,
              "description": "Tag helpers kullanarak type-safe ve IntelliSense destekli form oluşturacaksın.",
              "steps": [
                {
                  "title": "Tag helper ları etkinleştir",
                  "detail": "_ViewImports.cshtml dosyasına @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers ekle.",
                  "hint": "Tag helpers varsayılan olarak MVC template inde etkindir"
                },
                {
                  "title": "Form oluştur",
                  "detail": "asp-controller, asp-action, asp-route-* attribute larını kullanarak form oluştur.",
                  "hint": "<form asp-controller="Products \" asp-action= "Create \" method= "post"> kullan"
                },
                {
                  "title": "Input tag helpers kullan",
                  "detail": "asp-for attribute u ile model e bağlı input lar oluştur (asp-for="Model.Name ").",
                  "hint": "asp-for otomatik olarak name, id, value ve validation attribute larını ekler"
                },
                {
                  "title": "Validation tag helpers ekle",
                  "detail": "asp-validation-for ve asp-validation-summary tag helper larını kullan.",
                  "hint": "<div asp-validation-summary="All "></div> tüm hataları gösterir"
                }
              ],
              "starterCode": {
                "language": "html",
                "filename": "Create.cshtml",
                "code": "@model Product n n<!-- TODO: Form tag helper ile form oluştur --> n<!-- TODO: Input tag helpers ile alanları ekle --> n<!-- TODO: Validation tag helpers ekle -->",
                "explanation": "Tag helper lar ile form oluşturma iskeleti"
              },
              "hints": [
                "asp-for attribute u model property sine bağlanır ve otomatik validation ekler",
                "Tag helpers IntelliSense desteği sağlar",
                "asp-route-* ile route parameter ları geçilebilir"
              ],
              "validation": {
                "type": "self",
                "criteria": [
                  "Form doğru controller ve action a submit ediyor",
                  "Input lar model e doğru bağlanmış",
                  "Validation mesajları gösteriliyor",
                  "Client-side validasyon çalışıyor"
                ]
              }
            },
            {
              "id": "activity-filters",
              "type": "concept",
              "title": "Action ve Result Filters",
              "estimatedMinutes": 25,
              "content": "Filters, action method ların execution pipeline ına müdahale etmeyi sağlar. Cross-cutting concerns (logging, caching, authorization) için kullanılır. n n**Filter Types**: n- **Authorization Filters**: [Authorize], [AllowAnonymous] - Kimlik doğrulama n- **Action Filters**: [ActionFilter] - Action öncesi/sonrası logic n- **Result Filters**: [ResultFilter] - Result render öncesi/sonrası logic n- **Exception Filters**: [ExceptionFilter] - Hata yakalama n- **Resource Filters**: [ResourceFilter] - Pipeline ın erken aşamalarında çalışır n n**Filter Execution Order**: n1. Authorization Filters n2. Resource Filters (OnResourceExecuting) n3. Model Binding n4. Action Filters (OnActionExecuting) n5. Action Execution n6. Action Filters (OnActionExecuted) n7. Result Filters (OnResultExecuting) n8. Result Execution n9. Result Filters (OnResultExecuted) n10. Resource Filters (OnResourceExecuted)",
              "highlights": [
                "Filters cross-cutting concerns için kullanılır",
                "Filter lar global, controller veya action seviyesinde uygulanabilir",
                "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur",
                "Filter order önemlidir - [Order] attribute ile sıralama yapılabilir"
              ],
              "codeSamples": [
                {
                  "language": "csharp",
                  "filename": "LogActionFilter.cs",
                  "code": "using Microsoft.AspNetCore.Mvc.Filters; n npublic class LogActionFilter : IActionFilter n{ n    private readonly ILogger<LogActionFilter> _logger; n     n    public LogActionFilter(ILogger<LogActionFilter> logger) n    { n        _logger = logger; n    } n     n    public void OnActionExecuting(ActionExecutingContext context) n    { n        _logger.LogInformation("Action başlıyor: {Action} ", context.ActionDescriptor.DisplayName); n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        _logger.LogInformation("Action tamamlandı: {Action} ", context.ActionDescriptor.DisplayName); n    } n}",
                  "explanation": "Custom action filter örneği - logging için"
                },
                {
                  "language": "csharp",
                  "filename": "ProductsController.cs",
                  "code": "[ServiceFilter(typeof(LogActionFilter))] n[ResponseCache(Duration = 60)] npublic class ProductsController : Controller n{ n    [Authorize] n    [ValidateAntiForgeryToken] n    [HttpPost] n    public IActionResult Create(Product product) { ... } n}",
                  "explanation": "Filter ların controller ve action seviyesinde kullanımı"
                }
              ],
              "checklist": [
                {
                  "id": "check-filter-types",
                  "label": "Farklı filter türlerini ve execution order ını anla",
                  "explanation": "Her filter türünün ne zaman çalıştığını öğren"
                },
                {
                  "id": "check-custom-filters",
                  "label": "Custom filter oluşturmayı öğren",
                  "explanation": "IActionFilter, IResultFilter gibi interface leri implement et"
                }
              ]
            },
            {
              "id": "activity-filters-practice",
              "type": "code-challenge",
              "title": "Custom Filter Geliştirme",
              "estimatedMinutes": 40,
              "description": "Performance monitoring için custom action filter oluşturup action execution süresini ölçeceksin.",
              "acceptanceCriteria": [
                "Filter action execution süresini ölçmeli ve log lamalı",
                "Filter DI container a kayıtlı olmalı",
                "Filter hem controller hem action seviyesinde kullanılabilmeli",
                "Execution süresi belirli bir threshold u aşarsa warning log u yazılmalı"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "PerformanceFilter.cs",
                "code": "using Microsoft.AspNetCore.Mvc.Filters; n n// TODO: IActionFilter interface ini implement et n// TODO: Stopwatch kullanarak execution süresini ölç n// TODO: ILogger ile log yaz npublic class PerformanceFilter n{ n    // TODO: Implementation n}",
                "explanation": "Performance monitoring filter iskeleti"
              },
              "testCases": [
                {
                  "id": "scenario-fast-action",
                  "description": "Hızlı action (< 100ms) normal log yazmalı",
                  "input": "Basit bir action method",
                  "expectedOutput": "Info level log ile execution süresi"
                },
                {
                  "id": "scenario-slow-action",
                  "description": "Yavaş action (> 1000ms) warning log yazmalı",
                  "input": "Thread.Sleep(1500) içeren action",
                  "expectedOutput": "Warning level log ile performance uyarısı"
                }
              ],
              "evaluationTips": [
                "Filter ı Program.cs de services.AddScoped ile kaydet",
                "[ServiceFilter] veya [TypeFilter] attribute larını kullan",
                "Stopwatch sınıfını kullanarak süre ölçümü yap"
              ]
            },
            {
              "id": "activity-view-components",
              "type": "code-challenge",
              "title": "View Component Geliştirme",
              "estimatedMinutes": 45,
              "description": "Yeniden kullanılabilir bir navigation menu view component i oluşturacaksın.",
              "acceptanceCriteria": [
                "ViewComponent sınıfı oluşturulmalı ve Invoke/InvokeAsync method u içermeli",
                "View component in kendi view  ı olmalı (Views/Shared/Components/NavigationMenu/Default.cshtml)",
                "Component DI ile servisleri kullanabilmeli",
                "Component tag helper veya @await Component.InvokeAsync ile kullanılabilmeli"
              ],
              "starterCode": {
                "language": "csharp",
                "filename": "NavigationMenuViewComponent.cs",
                "code": "using Microsoft.AspNetCore.Mvc; n n// TODO: ViewComponent base class ından türet n// TODO: Menu item ları dinamik olarak oluştur n// TODO: DI ile IMenuService kullan (opsiyonel) npublic class NavigationMenuViewComponent n{ n    // TODO: Implementation n}",
                "explanation": "View component iskeleti"
              },
              "testCases": [
                {
                  "id": "scenario-render-menu",
                  "description": "View component menu yu render etmeli",
                  "input": "<vc:navigation-menu /> veya @await Component.InvokeAsync("NavigationMenu ")",
                  "expectedOutput": "HTML navigation menu render edilmeli"
                }
              ],
              "evaluationTips": [
                "View component ler Views/Shared/Components/{ComponentName}/Default.cshtml path inde olmalı",
                "Tag helper kullanımı için _ViewImports.cshtml e @addTagHelper ekle",
                "View component ler async method lar içerebilir"
              ]
            },
            {
              "id": "activity-knowledge-check",
              "type": "knowledge-check",
              "title": "MVC Kavramlarını Kontrol Et",
              "estimatedMinutes": 15,
              "questions": [
                {
                  "id": "q1-mvc-components",
                  "question": "MVC patternin üç ana bileşeni nedir?",
                  "options": [
                    "Model, View, Controller",
                    "Middleware, View, Controller",
                    "Model, View, Component",
                    "Module, View, Controller"
                  ],
                  "answer": 0,
                  "explanation": "MVC pattern Model (veri ve iş mantığı), View (kullanıcı arayüzü) ve Controller (kullanıcı girişi ve koordinasyon) olmak üzere üç bileşenden oluşur."
                },
                {
                  "id": "q2-view-lifecycle",
                  "question": "View lifecycle da hangi sırayla işlemler gerçekleşir?",
                  "options": [
                    "Action → View Discovery → Layout → Render",
                    "View Discovery → Action → Render → Layout",
                    "Layout → Action → View Discovery → Render",
                    "Render → Action → View Discovery → Layout"
                  ],
                  "answer": 0,
                  "explanation": "Önce action method çalışır, sonra view engine view dosyasını bulur (view discovery), layout belirlenir ve son olarak view render edilir."
                },
                {
                  "id": "q3-model-binding",
                  "question": "Model binding için hangi attribute kullanılır?",
                  "options": [
                    "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                    "[BindQuery], [BindRoute], [BindForm]",
                    "[QueryParam], [RouteParam], [FormParam]",
                    "[GetFromQuery], [GetFromRoute]"
                  ],
                  "answer": 0,
                  "explanation": "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları model binding source unu belirtir."
                },
                {
                  "id": "q4-filters",
                  "question": "Filter execution order da hangi filter en önce çalışır?",
                  "options": [
                    "Authorization Filters",
                    "Action Filters",
                    "Result Filters",
                    "Exception Filters"
                  ],
                  "answer": 0,
                  "explanation": "Authorization filters en önce çalışır, çünkü kullanıcının yetkisi olmadan diğer işlemler yapılmamalıdır."
                }
              ]
            }
          ],
          "checkpoints": [
            {
              "id": "checkpoint-mvc-project",
              "title": "MVC Projesi Geliştirme",
              "description": "Tüm öğrendiklerini birleştirerek tam özellikli bir MVC uygulaması geliştir.",
              "tasks": [
                {
                  "id": "task-crud-operations",
                  "description": "Bir entity için tam CRUD (Create, Read, Update, Delete) operasyonları oluştur. Model binding, validasyon, routing ve view ları uygula.",
                  "resources": [
                    {
                      "id": "resource-aspnet-mvc-docs",
                      "title": "ASP.NET Core MVC Dokümantasyonu",
                      "url": "https://learn.microsoft.com/aspnet/core/mvc/overview",
                      "type": "documentation"
                    }
                  ],
                  "coachTips": [
                    "Her action method için uygun HTTP verb attribute larını kullan",
                    "Model validasyonunu hem client-side hem server-side uygula",
                    "Partial view ler veya view components kullanarak kod tekrarını önle"
                  ]
                },
                {
                  "id": "task-filters-implementation",
                  "description": "Custom action filter oluşturup logging, performance monitoring veya caching gibi bir cross-cutting concern uygula.",
                  "coachTips": [
                    "Filter ı DI container a kaydetmeyi unutma",
                    "Filter execution order ını göz önünde bulundur",
                    "Async filter lar için IAsyncActionFilter kullan"
                  ]
                }
              ],
              "successCriteria": [
                "CRUD operasyonları tam ve çalışır durumda",
                "Model validasyonu hem client hem server tarafında çalışıyor",
                "Custom filter başarıyla uygulanmış ve çalışıyor",
                "View lar temiz, yeniden kullanılabilir ve maintainable",
                "Routing yapısı mantıklı ve RESTful prensiplere uygun"
              ],
              "estimatedMinutes": 120
            }
          ],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=ASP.NET%20Core%20MVC",
            "description": "Controller, view ve filter pipeline ını uygulamalı şekilde keşfet."
          },
          "relatedTopics": [
            {
              "label": "Attribute Routing ile Çalışma",
              "href": "/education/lessons/aspnet-mvc/routing/attribute-routing",
              "description": "Controller bazlı özel rota tanımlarını uygula.",
              "estimatedDurationMinutes": 30,
              "level": "Orta",
              "keyTakeaways": [
                "[Route] attribute u ile controller ve action seviyesinde routing tanımlanabilir",
                "Route constraints ile parametre tiplerini kısıtlayabilirsin",
                "Attribute routing convention-based routing den daha esnektir",
                "Multiple route attribute ları ile aynı action a farklı URL ler tanımlanabilir"
              ],
              "sections": [
                {
                  "id": "section-attribute-routing-basics",
                  "title": "Attribute Routing Temelleri",
                  "summary": "[Route] attribute u ile controller ve action method larına doğrudan route tanımlama",
                  "content": [
                    {
                      "type": "text",
                      "body": "Attribute routing, route tanımlarını controller ve action method larına doğrudan attribute olarak eklemeni sağlar. Bu yaklaşım convention-based routing den daha esnek ve açıktır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[Route("api/products ")] npublic class ProductsController : Controller n{ n    [Route("list ")] n    public IActionResult Index() { ... } n     n    [Route("{id:int} ")] n    public IActionResult Details(int id) { ... } n}",
                      "explanation": "Controller ve action seviyesinde attribute routing örneği"
                    },
                    {
                      "type": "list",
                      "title": "Attribute Routing Avantajları",
                      "items": [
                        "Route tanımları action method ların yanında, kod okunabilirliği artar",
                        "Her action için özel URL pattern leri tanımlanabilir",
                        "Route constraints doğrudan attribute içinde belirtilebilir",
                        "Multiple route lar aynı action a eklenebilir"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-route-constraints",
                  "title": "Route Constraints",
                  "summary": "Parametre tiplerini ve değer aralıklarını kısıtlama",
                  "content": [
                    {
                      "type": "text",
                      "body": "Route constraints, URL parametrelerinin hangi değerleri alabileceğini kısıtlar. Bu sayede tip güvenliği ve validasyon sağlanır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[Route("blog/{year:int:min(2000)}/{month:int:range(1,12)}/{slug:minlength(5)} ")] npublic IActionResult Post(int year, int month, string slug) { ... }",
                      "explanation": "Route constraints örneği: year 2000 den büyük, month 1-12 arası, slug en az 5 karakter"
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "Yaygın Route Constraints",
                      "body": "int, long, float, double, bool, datetime, guid, minlength(n), maxlength(n), length(n), min(n), max(n), range(min,max), alpha, regex(pattern)"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-attribute-routing",
                  "question": "Aşağıdakilerden hangisi attribute routing in avantajıdır?",
                  "options": [
                    "Route tanımları action method ların yanında yer alır",
                    "Sadece GET istekleri için kullanılabilir",
                    "Convention-based routing den daha yavaştır",
                    "Sadece controller seviyesinde tanımlanabilir"
                  ],
                  "answer": "Route tanımları action method ların yanında yer alır",
                  "rationale": "Attribute routing in en büyük avantajı, route tanımlarının action method ların hemen yanında yer alması ve kod okunabilirliğini artırmasıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-attribute-routing-docs",
                  "label": "ASP.NET Core Attribute Routing Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/routing#attribute-routing",
                  "type": "documentation",
                  "estimatedMinutes": 15
                }
              ],
              "practice": [
                {
                  "id": "practice-custom-routes",
                  "title": "Özel Route lar Oluştur",
                  "description": "Blog yazıları için özel route pattern leri oluştur",
                  "type": "guided",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "BlogController oluştur ve [Route("blog ")] attribute u ekle",
                    "Post action ına [Route("{year:int}/{month:int}/{slug} ")] route u ekle",
                    "Farklı URL pattern leri test et",
                    "Route constraints ekleyerek validasyon sağla"
                  ]
                }
              ]
            },
            {
              "label": "Model Binding ve Validasyon",
              "href": "/education/lessons/aspnet-mvc/model-binding/overview",
              "description": "Form verilerini binding sürecinde doğrulamayı öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Model binding HTTP verilerini otomatik olarak C# nesnelerine dönüştürür",
                "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları binding source unu belirtir",
                "Data Annotations ile model validasyonu yapılır",
                "ModelState.IsValid ile validasyon kontrolü yapılır"
              ],
              "sections": [
                {
                  "id": "section-model-binding-basics",
                  "title": "Model Binding Temelleri",
                  "summary": "HTTP istek verilerinin C# nesnelerine otomatik dönüştürülmesi",
                  "content": [
                    {
                      "type": "text",
                      "body": "Model binding, HTTP isteğinden gelen verileri (query string, form data, route values, headers) otomatik olarak C# nesnelerine dönüştürür. ASP.NET Core MVC bu işlemi otomatik olarak yapar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Query string: ?name=Product&price=100 npublic IActionResult Create(string name, decimal price) { ... } n n// Form data n[HttpPost] npublic IActionResult Create(Product product) { ... } n n// Route parameter n[Route("{id:int} ")] npublic IActionResult Details(int id) { ... }",
                      "explanation": "Farklı binding source larından veri alma örnekleri"
                    },
                    {
                      "type": "list",
                      "title": "Binding Source ları",
                      "items": [
                        "Route values: URL segment lerinden (varsayılan)",
                        "Query string: ?key=value parametrelerinden",
                        "Form data: POST request body den",
                        "Headers: HTTP header lardan ([FromHeader])",
                        "Body: JSON/XML içerikten ([FromBody])"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-data-annotations",
                  "title": "Data Annotations ile Validasyon",
                  "summary": "Model property lerine validation attribute ları ekleme",
                  "content": [
                    {
                      "type": "text",
                      "body": "Data Annotations, model sınıflarına validation attribute ları ekleyerek server-side ve client-side validasyon sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using System.ComponentModel.DataAnnotations; n npublic class Product n{ n    [Required(ErrorMessage ="Ürün adı zorunludur ")] n    [StringLength(100, MinimumLength = 3)] n    public string Name { get; set; } = string.Empty; n     n    [Range(0.01, 10000, ErrorMessage ="Fiyat 0.01 ile 10000 arasında olmalı ")] n    public decimal Price { get; set; } n     n    [EmailAddress] n    public string ContactEmail { get; set; } = string.Empty; n}",
                      "explanation": "Data Annotations ile model validasyonu"
                    },
                    {
                      "type": "callout",
                      "variant": "info",
                      "title": "Yaygın Validation Attribute ları",
                      "body": "[Required], [StringLength], [Range], [EmailAddress], [Url], [Phone], [CreditCard], [Compare], [RegularExpression], [MinLength], [MaxLength]"
                    }
                  ]
                },
                {
                  "id": "section-modelstate",
                  "title": "ModelState ile Validasyon Kontrolü",
                  "summary": "ModelState.IsValid ile validasyon hatalarını kontrol etme",
                  "content": [
                    {
                      "type": "text",
                      "body": "ModelState dictionary, model binding ve validasyon sürecindeki tüm hataları içerir. ModelState.IsValid ile model in geçerli olup olmadığını kontrol edebilirsin."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[HttpPost] npublic IActionResult Create(Product product) n{ n    if (!ModelState.IsValid) n    { n        // Validasyon hataları var, view a geri dön n        return View(product); n    } n     n    // Model geçerli, kaydet n    _productService.Create(product); n    return RedirectToAction(nameof(Index)); n}",
                      "explanation": "ModelState.IsValid ile validasyon kontrolü"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model Product n n<div asp-validation-summary="All \" class= "text-danger"></div> n n<div class= "form-group"> n    <label asp-for= "Name"></label> n    <input asp-for= "Name \" class= "form-control \" /> n    <span asp-validation-for= "Name \" class= "text-danger"></span> n</div>",
                      "explanation": "View da validation mesajlarını gösterme"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-model-binding",
                  "question": "Model binding için hangi attribute kullanılır?",
                  "options": [
                    "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                    "[BindQuery], [BindRoute], [BindForm]",
                    "[QueryParam], [RouteParam], [FormParam]",
                    "[GetFromQuery], [GetFromRoute]"
                  ],
                  "answer": "[FromQuery], [FromRoute], [FromForm], [FromBody]",
                  "rationale": "[FromQuery], [FromRoute], [FromForm], [FromBody] attribute ları model binding source unu belirtir."
                }
              ],
              "resources": [
                {
                  "id": "resource-model-binding-docs",
                  "label": "ASP.NET Core Model Binding Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/models/model-binding",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-form-validation",
                  "title": "Form Validasyonu Uygula",
                  "description": "Kayıt formu için model binding ve validasyon uygula",
                  "type": "guided",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "RegisterViewModel sınıfı oluştur (Email, Password, ConfirmPassword)",
                    "Validation attribute ları ekle ([Required], [EmailAddress], [Compare])",
                    "AccountController da Register (GET ve POST) action ları oluştur",
                    "View da validation mesajlarını göster",
                    "Client-side validasyon için jQuery Unobtrusive Validation ekle"
                  ]
                }
              ]
            },
            {
              "label": "Razor View Best Practice leri",
              "href": "/education/lessons/aspnet-mvc/views/razor-best-practices",
              "description": "View bileşenleri ve layout düzenleriyle yeniden kullanılabilirlik sağla.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Razor syntax (@) ile C# kodunu HTML içine gömebilirsin",
                "Layout lar sayfa yapısını standartlaştırır",
                "Partial views kod tekrarını önler",
                "ViewData, ViewBag, TempData ile controller dan view a veri aktarılır"
              ],
              "sections": [
                {
                  "id": "section-razor-syntax",
                  "title": "Razor Syntax Temelleri",
                  "summary": "@ sembolü ile C# kodunu HTML içine gömme",
                  "content": [
                    {
                      "type": "text",
                      "body": "Razor, C# kodunu HTML ile birleştiren bir view engine dir. @ sembolü ile C# kodunu HTML içine gömebilirsin."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model List<Product> n n<h1>Ürünler</h1> n n@if (Model.Any()) n{ n    <ul> n        @foreach (var product in Model) n        { n            <li>@product.Name - @product.Price.ToString("C ")</li> n        } n    </ul> n} nelse n{ n    <p>Henüz ürün yok.</p> n}",
                      "explanation": "Razor syntax ile model verilerini listeleme"
                    },
                    {
                      "type": "list",
                      "title": "Razor Syntax Özellikleri",
                      "items": [
                        "@variable: Değişken değeri yazdırma",
                        "@{ code }: C# kod blokları",
                        "@if, @foreach, @while: Kontrol yapıları",
                        "@model: View ın model tipini belirtme",
                        "@using: Namespace import"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-layouts",
                  "title": "Layout ve Sections",
                  "summary": "Ana sayfa şablonları ve bölümler",
                  "content": [
                    {
                      "type": "text",
                      "body": "Layout lar sayfa yapısını standartlaştırır. _Layout.cshtml ana şablon, @RenderBody() içerik yerleştirme noktası, @RenderSection() ise isteğe bağlı bölümler için kullanılır."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _Layout.cshtml *@ n<!DOCTYPE html> n<html> n<head> n    <title>@ViewData["Title "]</title> n</head> n<body> n    <header>...</header> n    <main>@RenderBody()</main> n    <footer>...</footer> n    @RenderSection("Scripts ", required: false) n</body> n</html>",
                      "explanation": "Layout dosyası yapısı"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Index.cshtml *@ n@{ n    Layout ="_Layout "; n    ViewData["Title "] ="Ana Sayfa "; n} n n<h1>Hoş Geldiniz</h1> n n@section Scripts { n    <script src="custom.js "></script> n}",
                      "explanation": "View da layout ve section kullanımı"
                    }
                  ]
                },
                {
                  "id": "section-partial-views",
                  "title": "Partial Views",
                  "summary": "Yeniden kullanılabilir view bileşenleri",
                  "content": [
                    {
                      "type": "text",
                      "body": "Partial views, yeniden kullanılabilir view bileşenleridir. @Html.Partial() veya <partial> tag helper ile render edilir."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ProductCard.cshtml *@ n@model Product n n<div class="card "> n    <h3>@Model.Name</h3> n    <p>@Model.Price.ToString("C ")</p> n    <a href="/products/@Model.Id ">Detaylar</a> n</div>",
                      "explanation": "Partial view örneği"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Index.cshtml *@ n@model List<Product> n n@foreach (var product in Model) n{ n    <partial name="_ProductCard \" model= "product \" /> n}",
                      "explanation": "Partial view ı kullanma"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-razor",
                  "question": "Razor syntax da C# kodunu HTML içine gömek için hangi sembol kullanılır?",
                  "options": [
                    "@",
                    "#",
                    "$",
                    "%"
                  ],
                  "answer": "@",
                  "rationale": "Razor syntax da @ sembolü C# kodunu HTML içine gömek için kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-razor-docs",
                  "label": "Razor Syntax Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/razor",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-partial-views",
                  "title": "Partial View Oluştur",
                  "description": "Yeniden kullanılabilir bir partial view bileşeni oluştur",
                  "type": "guided",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "_ProductCard.cshtml partial view ı oluştur",
                    "Product model ini kullanarak kart görünümü tasarla",
                    "Index view ında partial view  ı kullan",
                    "Farklı sayfalarda aynı partial view ı kullan"
                  ]
                }
              ]
            },
            {
              "label": "View Lifecycle ve Execution",
              "href": "/education/lessons/aspnet-mvc/views/view-lifecycle",
              "description": "View ların nasıl render edildiğini ve lifecycle ını derinlemesine incele.",
              "estimatedDurationMinutes": 35,
              "level": "İleri",
              "keyTakeaways": [
                "View execution sırası: Action → View Discovery → Layout → Render",
                "View discovery otomatik olarak view dosyasını bulur",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "View Components hem logic hem de view içerebilir"
              ],
              "sections": [
                {
                  "id": "section-view-execution",
                  "title": "View Execution Sırası",
                  "summary": "Bir view ın render edilmesi sırasındaki adımlar",
                  "content": [
                    {
                      "type": "text",
                      "body": "View lifecycle, bir view ın render edilmesinden önce ve sonra gerçekleşen süreçleri ifade eder."
                    },
                    {
                      "type": "list",
                      "title": "View Execution Adımları",
                      "ordered": true,
                      "items": [
                        "Action method çalışır ve ViewResult döndürür",
                        "View engine uygun view dosyasını bulur (View discovery)",
                        "View ın model i set edilir",
                        "View start dosyaları (_ViewStart.cshtml) çalışır",
                        "Layout belirlenir (_Layout.cshtml)",
                        "View render edilir",
                        "Layout içine view içeriği yerleştirilir (@RenderBody)",
                        "Sections render edilir (@RenderSection)"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public IActionResult Index() n{ n    var products = _productService.GetAll(); n    return View(products); // View discovery: Views/Products/Index.cshtml n}",
                      "explanation": "View() method u view discovery yapar"
                    }
                  ]
                },
                {
                  "id": "section-view-discovery",
                  "title": "View Discovery Mekanizması",
                  "summary": "View engine in view dosyasını nasıl bulduğu",
                  "content": [
                    {
                      "type": "text",
                      "body": "View discovery, view engine in uygun view dosyasını bulma sürecidir. ASP.NET Core MVC belirli bir sırayla view dosyalarını arar."
                    },
                    {
                      "type": "list",
                      "title": "View Discovery Sırası",
                      "items": [
                        "Views/{Controller}/{Action}.cshtml",
                        "Views/Shared/{Action}.cshtml",
                        "Belirtilen path (View("CustomPath "))"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Varsayılan view discovery nreturn View(products); // Views/Products/Index.cshtml n n// Özel view belirtme nreturn View("SpecialView "); // Views/Products/SpecialView.cshtml n n// Tam path nreturn View("~/Views/Shared/CustomView.cshtml ");",
                      "explanation": "Farklı view discovery senaryoları"
                    }
                  ]
                },
                {
                  "id": "section-view-components",
                  "title": "View Components",
                  "summary": "Logic içeren yeniden kullanılabilir view bileşenleri",
                  "content": [
                    {
                      "type": "text",
                      "body": "View Components, partial view lerden daha güçlü bir yapıdır. Hem logic hem de view içerebilir ve controller dan bağımsız çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "public class NavigationMenuViewComponent : ViewComponent n{ n    private readonly IMenuService _menuService; n     n    public NavigationMenuViewComponent(IMenuService menuService) n    { n        _menuService = menuService; n    } n     n    public IViewComponentResult Invoke() n    { n        var menuItems = _menuService.GetMenuItems(); n        return View(menuItems); n    } n}",
                      "explanation": "View Component örneği"
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Views/Shared/Components/NavigationMenu/Default.cshtml *@ n@model List<MenuItem> n n<nav> n    @foreach (var item in Model) n    { n        <a href="@item.Url ">@item.Text</a> n    } n</nav>",
                      "explanation": "View Component view ı"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-view-lifecycle",
                  "question": "View lifecycle da hangi sırayla işlemler gerçekleşir?",
                  "options": [
                    "Action → View Discovery → Layout → Render",
                    "View Discovery → Action → Render → Layout",
                    "Layout → Action → View Discovery → Render",
                    "Render → Action → View Discovery → Layout"
                  ],
                  "answer": "Action → View Discovery → Layout → Render",
                  "rationale": "Önce action method çalışır, sonra view engine view dosyasını bulur (view discovery), layout belirlenir ve son olarak view render edilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-view-lifecycle-docs",
                  "label": "View Lifecycle Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/overview",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ]
            },
            {
              "label": "Action ve Result Filters",
              "href": "/education/lessons/aspnet-mvc/filters/action-filters",
              "description": "Cross-cutting concerns için filter pipeline ını yönet.",
              "estimatedDurationMinutes": 50,
              "level": "İleri",
              "keyTakeaways": [
                "Filters cross-cutting concerns için kullanılır",
                "Filter execution order önemlidir",
                "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur",
                "Filter lar global, controller veya action seviyesinde uygulanabilir"
              ],
              "sections": [
                {
                  "id": "section-filter-types",
                  "title": "Filter Türleri",
                  "summary": "Farklı filter türleri ve kullanım alanları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Filters, action method ların execution pipeline ına müdahale etmeyi sağlar. Cross-cutting concerns (logging, caching, authorization) için kullanılır."
                    },
                    {
                      "type": "list",
                      "title": "Filter Türleri",
                      "items": [
                        "Authorization Filters: [Authorize], [AllowAnonymous] - Kimlik doğrulama",
                        "Action Filters: [ActionFilter] - Action öncesi/sonrası logic",
                        "Result Filters: [ResultFilter] - Result render öncesi/sonrası logic",
                        "Exception Filters: [ExceptionFilter] - Hata yakalama",
                        "Resource Filters: [ResourceFilter] - Pipeline ın erken aşamalarında çalışır"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "[ServiceFilter(typeof(LogActionFilter))] n[ResponseCache(Duration = 60)] npublic class ProductsController : Controller n{ n    [Authorize] n    [ValidateAntiForgeryToken] n    [HttpPost] n    public IActionResult Create(Product product) { ... } n}",
                      "explanation": "Filter ların controller ve action seviyesinde kullanımı"
                    }
                  ]
                },
                {
                  "id": "section-filter-execution",
                  "title": "Filter Execution Order",
                  "summary": "Filter ların çalışma sırası",
                  "content": [
                    {
                      "type": "text",
                      "body": "Filter execution order önemlidir. Her filter türü belirli bir sırada çalışır."
                    },
                    {
                      "type": "list",
                      "title": "Filter Execution Sırası",
                      "ordered": true,
                      "items": [
                        "Authorization Filters",
                        "Resource Filters (OnResourceExecuting)",
                        "Model Binding",
                        "Action Filters (OnActionExecuting)",
                        "Action Execution",
                        "Action Filters (OnActionExecuted)",
                        "Result Filters (OnResultExecuting)",
                        "Result Execution",
                        "Result Filters (OnResultExecuted)",
                        "Resource Filters (OnResourceExecuted)"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-custom-filters",
                  "title": "Custom Filter Oluşturma",
                  "summary": "Kendi filter ınızı yazma",
                  "content": [
                    {
                      "type": "text",
                      "body": "Custom filter lar IActionFilter, IResultFilter gibi interface ler implement ederek oluşturulur."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "using Microsoft.AspNetCore.Mvc.Filters; n npublic class LogActionFilter : IActionFilter n{ n    private readonly ILogger<LogActionFilter> _logger; n     n    public LogActionFilter(ILogger<LogActionFilter> logger) n    { n        _logger = logger; n    } n     n    public void OnActionExecuting(ActionExecutingContext context) n    { n        _logger.LogInformation("Action başlıyor: {Action} ",  n            context.ActionDescriptor.DisplayName); n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        _logger.LogInformation("Action tamamlandı: {Action} ",  n            context.ActionDescriptor.DisplayName); n    } n}",
                      "explanation": "Custom action filter örneği - logging için"
                    },
                    {
                      "type": "callout",
                      "variant": "tip",
                      "title": "Filter Kaydı",
                      "body": "Filter ı Program.cs de services.AddScoped ile kaydet ve [ServiceFilter] veya [TypeFilter] attribute larını kullan."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-filters",
                  "question": "Filter execution order da hangi filter en önce çalışır?",
                  "options": [
                    "Authorization Filters",
                    "Action Filters",
                    "Result Filters",
                    "Exception Filters"
                  ],
                  "answer": "Authorization Filters",
                  "rationale": "Authorization filters en önce çalışır, çünkü kullanıcının yetkisi olmadan diğer işlemler yapılmamalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-filters-docs",
                  "label": "ASP.NET Core Filters Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/filters",
                  "type": "documentation",
                  "estimatedMinutes": 25
                }
              ],
              "practice": [
                {
                  "id": "practice-custom-filter",
                  "title": "Custom Filter Oluştur",
                  "description": "Performance monitoring için custom action filter oluştur",
                  "type": "code-challenge",
                  "estimatedMinutes": 40,
                  "difficulty": "İleri",
                  "instructions": [
                    "PerformanceFilter sınıfı oluştur (IActionFilter implement et)",
                    "Stopwatch kullanarak action execution süresini ölç",
                    "ILogger ile log yaz (threshold aşılırsa warning)",
                    "Filter ı DI container a kaydet",
                    "Controller veya action seviyesinde kullan"
                  ]
                }
              ]
            },
            {
              "label": "Tag Helpers Kullanımı",
              "href": "/education/lessons/aspnet-mvc/views/tag-helpers",
              "description": "Type-safe ve IntelliSense destekli HTML helper ları kullan.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Tag helpers type-safe ve IntelliSense destekli HTML oluşturur",
                "asp-for attribute u model property sine bağlanır",
                "Tag helpers otomatik validation attribute ları ekler",
                "asp-route-* ile route parameter ları geçilebilir"
              ],
              "sections": [
                {
                  "id": "section-tag-helpers-basics",
                  "title": "Tag Helpers Temelleri",
                  "summary": "Tag helper ları etkinleştirme ve kullanma",
                  "content": [
                    {
                      "type": "text",
                      "body": "Tag helpers, HTML helper ların modern alternatifidir. Type-safe, IntelliSense destekli ve daha okunabilir HTML oluşturur."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ViewImports.cshtml *@ n@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers n n@* Form tag helper *@ n<form asp-controller="Products \" asp-action= "Create \" method= "post"> n    <input asp-for= "Model.Name \" /> n    <span asp-validation-for= "Model.Name"></span> n</form>",
                      "explanation": "Tag helper kullanımı"
                    },
                    {
                      "type": "list",
                      "title": "Yaygın Tag Helpers",
                      "items": [
                        "<form asp-controller="... \" asp-action= "...">: Form oluşturma",
                        "<input asp-for="... ">: Model e bağlı input",
                        "<label asp-for="... ">: Model e bağlı label",
                        "<select asp-for="... \" asp-items= "...">: Dropdown list",
                        "<a asp-controller="... \" asp-action= "...">: Action link",
                        "<div asp-validation-summary="... ">: Validation özeti"
                      ]
                    }
                  ]
                },
                {
                  "id": "section-form-tag-helpers",
                  "title": "Form Tag Helpers",
                  "summary": "Form ve input tag helper ları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Form tag helper ları model binding ve validation için otomatik attribute lar ekler."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@model Product n n<form asp-controller="Products \" asp-action= "Create \" method= "post"> n    <div class= "form-group"> n        <label asp-for= "Name"></label> n        <input asp-for= "Name \" class= "form-control \" /> n        <span asp-validation-for= "Name \" class= "text-danger"></span> n    </div> n     n    <div class= "form-group"> n        <label asp-for= "Price"></label> n        <input asp-for= "Price \" class= "form-control \" type= "number \" /> n        <span asp-validation-for= "Price \" class= "text-danger"></span> n    </div> n     n    <button type= "submit">Kaydet</button> n</form>",
                      "explanation": "Form tag helper ları ile model binding"
                    },
                    {
                      "type": "callout",
                      "variant": "info",
                      "title": "Otomatik Özellikler",
                      "body": "asp-for attribute u otomatik olarak name, id, value ve validation attribute larını ekler. Client-side validasyon için jQuery Unobtrusive Validation gerekir."
                    }
                  ]
                },
                {
                  "id": "section-anchor-tag-helpers",
                  "title": "Anchor Tag Helpers",
                  "summary": "Link oluşturma tag helper ları",
                  "content": [
                    {
                      "type": "text",
                      "body": "Anchor tag helper ları URL generation yapar ve route parameter larını otomatik olarak ekler."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* Action link *@ n<a asp-controller="Products \" asp-action= "Details \" asp-route-id= "@product.Id"> n    Detaylar n</a> n n@* Route link *@ n<a asp-route= "blog-post \" asp-route-year= "2024 \" asp-route-month= "1 \" asp-route-slug= "my-post"> n    Blog Yazısı n</a>",
                      "explanation": "Anchor tag helper kullanımı"
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-tag-helpers",
                  "question": "Tag helper ları etkinleştirmek için hangi dosyaya ne eklenir?",
                  "options": [
                    "_ViewImports.cshtml e @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers",
                    "_Layout.cshtml e @addTagHelper eklenir",
                    "Program.cs de services.AddTagHelpers() çağrılır",
                    "Tag helper lar varsayılan olarak etkindir"
                  ],
                  "answer": "_ViewImports.cshtml e @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers",
                  "rationale": "Tag helper ları _ViewImports.cshtml dosyasına @addTagHelper direktifi eklenerek etkinleştirilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-tag-helpers-docs",
                  "label": "Tag Helpers Dokümantasyonu",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/tag-helpers/intro",
                  "type": "documentation",
                  "estimatedMinutes": 20
                }
              ],
              "practice": [
                {
                  "id": "practice-tag-helpers-form",
                  "title": "Tag Helpers ile Form Oluştur",
                  "description": "Tag helper ları kullanarak tam özellikli bir form oluştur",
                  "type": "guided",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Product model i için Create formu oluştur",
                    "asp-controller ve asp-action attribute larını kullan",
                    "asp-for ile input ları model e bağla",
                    "asp-validation-for ile validation mesajlarını göster",
                    "Client-side validasyon için script leri ekle"
                  ]
                }
              ]
            },
            {
              "label": "TempData ve Session Yönetimi",
              "href": "/education/lessons/aspnet-mvc/state-management/tempdata-session",
              "description": "TempData ve Session ile state yönetimi yap.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "TempData bir sonraki request e kadar veri saklar",
                "Session kullanıcı oturumu boyunca veri saklar",
                "TempData.Keep() ile veriyi koruyabilirsin",
                "Session memory de veya distributed cache te saklanabilir"
              ],
              "sections": [
                {
                  "id": "tempdata-session",
                  "title": "TempData ve Session",
                  "summary": "State yönetimi için TempData ve Session kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "TempData bir sonraki request e kadar veri saklar, Session ise kullanıcı oturumu boyunca veri saklar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// TempData kullanımı npublic IActionResult Create(Product product) n{ n    // ... n    TempData["SuccessMessage "] ="Ürün başarıyla oluşturuldu. "; n    return RedirectToAction("Index "); n} n n// View da n@if (TempData["SuccessMessage "] != null) n{ n    <div class="alert alert-success ">@TempData["SuccessMessage "]</div> n} n n// Session kullanımı nHttpContext.Session.SetString("UserName ", user.Name); nvar userName = HttpContext.Session.GetString("UserName ");",
                      "explanation": "TempData ve Session kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-tempdata",
                  "question": "TempData ne kadar süre veri saklar?",
                  "options": [
                    "Her zaman",
                    "Bir sonraki request e kadar",
                    "Kullanıcı oturumu boyunca",
                    "Hiçbir zaman"
                  ],
                  "answer": "Bir sonraki request e kadar",
                  "rationale": "TempData bir sonraki request e kadar veri saklar."
                }
              ],
              "resources": [
                {
                  "id": "resource-tempdata-docs",
                  "label": "Microsoft Docs: TempData",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/app-state",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "TempData ve Session hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-tempdata",
                  "title": "TempData ve Session Kullanımı",
                  "description": "TempData ve Session ile state yönetimi yap.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "TempData ile mesaj göster",
                    "Session ile kullanıcı bilgisi sakla",
                    "TempData.Keep() kullan"
                  ]
                }
              ]
            },
            {
              "label": "ViewBag, ViewData ve Model Kullanımı",
              "href": "/education/lessons/aspnet-mvc/views/viewbag-viewdata-model",
              "description": "ViewBag, ViewData ve Model arasındaki farkları öğren.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "ViewBag dynamic property ler kullanır",
                "ViewData dictionary kullanır",
                "Model strongly-typed veri aktarımı sağlar",
                "Model tercih edilmelidir"
              ],
              "sections": [
                {
                  "id": "viewbag-viewdata-model",
                  "title": "ViewBag, ViewData ve Model",
                  "summary": "Controller dan view a veri aktarma yöntemleri.",
                  "content": [
                    {
                      "type": "text",
                      "body": "ViewBag dynamic property ler kullanır, ViewData dictionary kullanır, Model ise strongly-typed veri aktarımı sağlar."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// ViewBag kullanımı nViewBag.Message ="Hoş geldiniz! "; nViewBag.Count = 10; n n// ViewData kullanımı nViewData["Message "] ="Hoş geldiniz! "; nViewData["Count "] = 10; n n// Model kullanımı (tercih edilen) nreturn View(product); n n// View da n@model Product n<h1>@Model.Name</h1>",
                      "explanation": "ViewBag, ViewData ve Model kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-viewbag",
                  "question": "Hangi yöntem tercih edilmelidir?",
                  "options": [
                    "ViewBag",
                    "ViewData",
                    "Model",
                    "Hiçbiri"
                  ],
                  "answer": "Model",
                  "rationale": "Model strongly-typed veri aktarımı sağladığı için tercih edilmelidir."
                }
              ],
              "resources": [
                {
                  "id": "resource-viewbag-docs",
                  "label": "Microsoft Docs: ViewBag, ViewData",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/overview",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "ViewBag, ViewData ve Model hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-viewbag",
                  "title": "ViewBag, ViewData ve Model Kullanımı",
                  "description": "Farklı veri aktarım yöntemlerini kullan.",
                  "type": "coding",
                  "estimatedMinutes": 20,
                  "difficulty": "Orta",
                  "instructions": [
                    "ViewBag ile veri aktar",
                    "ViewData ile veri aktar",
                    "Model ile veri aktar ve karşılaştır"
                  ]
                }
              ]
            },
            {
              "label": "Layout ve _ViewStart Yapılandırması",
              "href": "/education/lessons/aspnet-mvc/views/layout-viewstart",
              "description": "Layout ve _ViewStart ile sayfa yapısını standartlaştır.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "Layout sayfa yapısını standartlaştırır",
                "_ViewStart.cshtml tüm view lar için ortak ayarları içerir",
                "Sections ile layout a içerik eklenebilir",
                "Nested layout lar oluşturulabilir"
              ],
              "sections": [
                {
                  "id": "layout-viewstart",
                  "title": "Layout ve _ViewStart",
                  "summary": "Sayfa yapısını standartlaştırma.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Layout sayfa yapısını standartlaştırır, _ViewStart.cshtml ise tüm view lar için ortak ayarları içerir."
                    },
                    {
                      "type": "code",
                      "language": "html",
                      "code": "@* _ViewStart.cshtml *@ n@{ n    Layout ="_Layout "; n} n n@* _Layout.cshtml *@ n<!DOCTYPE html> n<html> n<head> n    <title>@ViewData["Title "]</title> n</head> n<body> n    @RenderBody() n    @RenderSection("Scripts ", required: false) n</body> n</html>",
                      "explanation": "Layout ve _ViewStart yapılandırması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-layout",
                  "question": "_ViewStart.cshtml ne işe yarar?",
                  "options": [
                    "Sadece layout belirler",
                    "Tüm view lar için ortak ayarları içerir",
                    "Sadece script ekler",
                    "Hiçbir şey"
                  ],
                  "answer": "Tüm view lar için ortak ayarları içerir",
                  "rationale": "_ViewStart.cshtml tüm view lar için ortak ayarları içerir."
                }
              ],
              "resources": [
                {
                  "id": "resource-layout-docs",
                  "label": "Microsoft Docs: Layout",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/views/layout",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Layout ve _ViewStart hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-layout",
                  "title": "Layout ve _ViewStart Yapılandırması",
                  "description": "Layout ve _ViewStart ile sayfa yapısını standartlaştır.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Layout oluştur",
                    "_ViewStart.cshtml yapılandır",
                    "Sections kullan"
                  ]
                }
              ]
            },
            {
              "label": "Action ve Result Filters",
              "href": "/education/lessons/aspnet-mvc/filters/action-result-filters",
              "description": "Action ve Result filters ile cross-cutting concerns yönet.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Action filters action method dan önce/sonra çalışır",
                "Result filters result tan önce/sonra çalışır",
                "IActionFilter ve IResultFilter interface leri kullanılır",
                "Filters authorization, logging, caching için kullanılır"
              ],
              "sections": [
                {
                  "id": "action-result-filters",
                  "title": "Action ve Result Filters",
                  "summary": "Cross-cutting concerns için filters.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Action filters action method dan önce/sonra çalışır, Result filters ise result  tan önce/sonra çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Action Filter npublic class LogActionFilter : IActionFilter n{ n    public void OnActionExecuting(ActionExecutingContext context) n    { n        // Action dan önce n    } n     n    public void OnActionExecuted(ActionExecutedContext context) n    { n        // Action dan sonra n    } n} n n// Kullanım n[ServiceFilter(typeof(LogActionFilter))] npublic IActionResult Index() n{ n    return View(); n}",
                      "explanation": "Action filter örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-filters",
                  "question": "Action filter ne zaman çalışır?",
                  "options": [
                    "Sadece action dan önce",
                    "Action dan önce ve sonra",
                    "Sadece action dan sonra",
                    "Hiçbir zaman"
                  ],
                  "answer": "Action dan önce ve sonra",
                  "rationale": "Action filter, OnActionExecuting ve OnActionExecuted metodlarıyla action dan önce ve sonra çalışır."
                }
              ],
              "resources": [
                {
                  "id": "resource-filters-docs",
                  "label": "Microsoft Docs: Filters",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/filters",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Action ve Result filters hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-filters",
                  "title": "Action ve Result Filters",
                  "description": "Action ve Result filters ile cross-cutting concerns yönet.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "İleri",
                  "instructions": [
                    "Action filter oluştur",
                    "Result filter oluştur",
                    "Filters ı kullan"
                  ]
                }
              ]
            },
            {
              "label": "Model Binding ve Validation",
              "href": "/education/lessons/aspnet-mvc/models/model-binding-validation",
              "description": "Model binding ve validation mekanizmalarını öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Model binding HTTP verilerini C# nesnelerine dönüştürür",
                "Data annotations ile validation yapılır",
                "ModelState.IsValid ile validation kontrol edilir",
                "Client-side ve server-side validation desteklenir"
              ],
              "sections": [
                {
                  "id": "model-binding-validation",
                  "title": "Model Binding ve Validation",
                  "summary": "HTTP verilerini model e dönüştürme ve doğrulama.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Model binding HTTP verilerini C# nesnelerine dönüştürür, validation ise verilerin doğruluğunu kontrol eder."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Model npublic class Product n{ n    [Required] n    [StringLength(100)] n    public string Name { get; set; } n     n    [Range(0, 10000)] n    public decimal Price { get; set; } n} n n// Controller n[HttpPost] npublic IActionResult Create(Product product) n{ n    if (ModelState.IsValid) n    { n        // ... n        return RedirectToAction("Index "); n    } n    return View(product); n}",
                      "explanation": "Model binding ve validation örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-model-binding",
                  "question": "Model binding ne yapar?",
                  "options": [
                    "Sadece validation yapar",
                    "HTTP verilerini C# nesnelerine dönüştürür",
                    "Sadece view oluşturur",
                    "Hiçbir şey"
                  ],
                  "answer": "HTTP verilerini C# nesnelerine dönüştürür",
                  "rationale": "Model binding HTTP verilerini C# nesnelerine dönüştürür."
                }
              ],
              "resources": [
                {
                  "id": "resource-model-binding-docs",
                  "label": "Microsoft Docs: Model Binding",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/models/model-binding",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Model binding ve validation hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-model-binding",
                  "title": "Model Binding ve Validation",
                  "description": "Model binding ve validation mekanizmalarını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Model oluştur",
                    "Data annotations ekle",
                    "Validation kontrol et"
                  ]
                }
              ]
            },
            {
              "label": "Routing Stratejileri",
              "href": "/education/lessons/aspnet-mvc/routing/routing-strategies",
              "description": "Convention-based ve attribute routing stratejilerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Convention-based routing Program.cs de tanımlanır",
                "Attribute routing daha esnek ve açıktır",
                "Route constraints parametre tiplerini kısıtlar",
                "Route values dinamik segmentler oluşturur"
              ],
              "sections": [
                {
                  "id": "routing-strategies",
                  "title": "Routing Stratejileri",
                  "summary": "Convention-based ve attribute routing.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Convention-based routing Program.cs de tanımlanır, attribute routing ise controller ve action lara [Route] attribute u ile doğrudan tanımlanır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Convention-based routing napp.MapControllerRoute( n    name:"default ", n    pattern:"{controller=Home}/{action=Index}/{id?} "); n n// Attribute routing n[Route("api/[controller] ")] npublic class ProductsController : Controller n{ n    [HttpGet("{id:int} ")] n    public IActionResult Get(int id) n    { n        // ... n    } n}",
                      "explanation": "Convention-based ve attribute routing örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-routing",
                  "question": "Attribute routing in avantajı nedir?",
                  "options": [
                    "Daha yavaştır",
                    "Daha esnek ve açıktır",
                    "Daha az özellik sunar",
                    "Hiçbir avantajı yoktur"
                  ],
                  "answer": "Daha esnek ve açıktır",
                  "rationale": "Attribute routing daha esnek ve açık bir yaklaşımdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-routing-docs",
                  "label": "Microsoft Docs: Routing",
                  "href": "https://learn.microsoft.com/aspnet/core/mvc/controllers/routing",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Routing stratejileri hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-routing",
                  "title": "Routing Stratejileri",
                  "description": "Convention-based ve attribute routing stratejilerini uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Convention-based routing tanımla",
                    "Attribute routing kullan",
                    "Route constraints ekle"
                  ]
                }
              ]
            }
          ]
        },
        {
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
        },
        {
          "id": "module-06-middleware",
          "title": "Middleware ve Pipeline Yönetimi",
          "summary": "Request pipeline ını özelleştir, cross-cutting ihtiyaçları yapılandır ve performansı izle.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında custom middleware yazarak istek akışını kontrol edebilecek ve gözlemlenebilirlik için metrikler toplayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Middleware",
            "description": "İstek işleme sırasını kontrol etmek için middleware zincirini yönet."
          },
          "relatedTopics": [
            {
              "label": "Custom Middleware Yazımı",
              "href": "/education/lessons/middleware/custom-middleware",
              "description": "RequestDelegate kullanarak yeniden kullanılabilir bileşenler tasarla."
            },
            {
              "label": "Pipeline Sıralamasını Yönetme",
              "href": "/education/lessons/middleware/pipeline-ordering",
              "description": "UseRouting ve UseEndpoints gibi kritik middleware leri sırala."
            },
            {
              "label": "İstek Günlüğü ve İzleme",
              "href": "/education/lessons/middleware/request-logging",
              "description": "İstek başına korelasyon ve gecikme ölçümleri ekle."
            },
            {
              "label": "Middleware Pipeline Yapısı",
              "href": "/education/lessons/middleware/pipeline-structure",
              "description": "Middleware pipeline yapısını ve çalışma mantığını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware pipeline request i sırayla işler",
                "RequestDelegate bir sonraki middleware i çağırır",
                "Middleware sırası çok önemlidir",
                "Use() metodu middleware ekler"
              ],
              "sections": [
                {
                  "id": "pipeline-structure",
                  "title": "Pipeline Yapısı",
                  "summary": "Middleware pipeline çalışma mantığı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware pipeline request i sırayla işler. Her middleware bir sonraki middleware i RequestDelegate ile çağırır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Middleware pipeline napp.Use(async (context, next) => n{ n    // Request işleme n    await next(); // Sonraki middleware n    // Response işleme n});",
                      "explanation": "Middleware pipeline yapısı."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-pipeline",
                  "question": "Middleware pipeline nasıl çalışır?",
                  "options": [
                    "Paralel olarak",
                    "Sırayla",
                    "Rastgele",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Sırayla",
                  "rationale": "Middleware pipeline request i sırayla işler."
                }
              ],
              "resources": [
                {
                  "id": "resource-pipeline-docs",
                  "label": "Microsoft Docs: Middleware",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware pipeline yapısı hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-pipeline",
                  "title": "Middleware Pipeline",
                  "description": "Middleware pipeline yapısını anla ve uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware pipeline oluştur",
                    "RequestDelegate kullan",
                    "Sıralamayı test et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Sıralaması ve Execution Order",
              "href": "/education/lessons/middleware/execution-order",
              "description": "Middleware sıralamasının önemini ve execution order ı öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware sırası çok önemlidir",
                "UseRouting() ve UseEndpoints() doğru yerde olmalıdır",
                "Exception handling middleware en üstte olmalıdır",
                "Authentication middleware routing den önce olmalıdır"
              ],
              "sections": [
                {
                  "id": "execution-order",
                  "title": "Execution Order",
                  "summary": "Middleware sıralaması ve önemi.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware sırası çok önemlidir. Exception handling middleware en üstte, authentication routing den önce, UseRouting() ve UseEndpoints() doğru yerde olmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Doğru middleware sırası napp.UseExceptionHandler(); // En üstte napp.UseHttpsRedirection(); napp.UseStaticFiles(); napp.UseRouting(); napp.UseAuthentication(); // Routing den sonra napp.UseAuthorization(); napp.UseEndpoints(endpoints => n{ n    endpoints.MapControllers(); n});",
                      "explanation": "Doğru middleware sıralaması."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-order",
                  "question": "Exception handling middleware nerede olmalıdır?",
                  "options": [
                    "En altta",
                    "En üstte",
                    "Ortada",
                    "Hiçbir yerde"
                  ],
                  "answer": "En üstte",
                  "rationale": "Exception handling middleware en üstte olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-order-docs",
                  "label": "Microsoft Docs: Middleware Order",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware sıralaması hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-order",
                  "title": "Middleware Sıralaması",
                  "description": "Doğru middleware sıralamasını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware sırasını düzenle",
                    "UseRouting() ve UseEndpoints() doğru yere koy",
                    "Test et"
                  ]
                }
              ]
            },
            {
              "label": "Conditional Middleware",
              "href": "/education/lessons/middleware/conditional-middleware",
              "description": "Koşullu middleware kullanımını öğren.",
              "estimatedDurationMinutes": 35,
              "level": "Orta",
              "keyTakeaways": [
                "UseWhen() ile koşullu middleware eklenebilir",
                "Map() ile path-based middleware eklenebilir",
                "MapWhen() ile daha karmaşık koşullar kullanılabilir",
                "Conditional middleware performansı artırabilir"
              ],
              "sections": [
                {
                  "id": "conditional-middleware",
                  "title": "Conditional Middleware",
                  "summary": "Koşullu middleware kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "UseWhen(), Map() ve MapWhen() ile koşullu middleware eklenebilir. Bu sayede sadece belirli koşullarda middleware çalışır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// UseWhen ile koşullu middleware napp.UseWhen(context => context.Request.Path.StartsWithSegments("/api "), n    appBuilder => n    { n        appBuilder.UseAuthentication(); n    }); n n// Map ile path-based middleware napp.Map("/admin ", adminApp => n{ n    adminApp.UseAuthentication(); n    adminApp.UseAuthorization(); n});",
                      "explanation": "Koşullu middleware kullanım örnekleri."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-conditional",
                  "question": "UseWhen() ne işe yarar?",
                  "options": [
                    "Sadece middleware ekler",
                    "Koşullu middleware ekler",
                    "Sadece path belirler",
                    "Hiçbir şey"
                  ],
                  "answer": "Koşullu middleware ekler",
                  "rationale": "UseWhen() koşullu middleware ekler."
                }
              ],
              "resources": [
                {
                  "id": "resource-conditional-docs",
                  "label": "Microsoft Docs: Conditional Middleware",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 20,
                  "description": "Conditional middleware hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-conditional",
                  "title": "Conditional Middleware",
                  "description": "Koşullu middleware kullanımını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 25,
                  "difficulty": "Orta",
                  "instructions": [
                    "UseWhen() kullan",
                    "Map() ile path-based middleware ekle",
                    "Test et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Dependency Injection",
              "href": "/education/lessons/middleware/di-middleware",
              "description": "Middleware lerde dependency injection kullanımını öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware constructor da DI kullanılabilir",
                "IMiddleware interface i ile DI desteklenir",
                "Service lifetime lara dikkat edilmelidir",
                "Scoped servisler middleware de dikkatli kullanılmalıdır"
              ],
              "sections": [
                {
                  "id": "di-middleware",
                  "title": "Middleware Dependency Injection",
                  "summary": "Middleware lerde DI kullanımı.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware constructor da DI kullanılabilir. IMiddleware interface i ile DI desteklenir. Service lifetime lara dikkat edilmelidir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Constructor injection npublic class LoggingMiddleware n{ n    private readonly ILogger<LoggingMiddleware> _logger; n    private readonly RequestDelegate _next; n     n    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger) n    { n        _next = next; n        _logger = logger; n    } n     n    public async Task InvokeAsync(HttpContext context) n    { n        _logger.LogInformation("Request: {Path} ", context.Request.Path); n        await _next(context); n    } n}",
                      "explanation": "Middleware de DI kullanım örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-di-middleware",
                  "question": "Middleware de DI nasıl kullanılır?",
                  "options": [
                    "Sadece Invoke metodunda",
                    "Constructor da",
                    "Sadece Use metodunda",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Constructor da",
                  "rationale": "Middleware constructor da DI kullanılabilir."
                }
              ],
              "resources": [
                {
                  "id": "resource-di-middleware-docs",
                  "label": "Microsoft Docs: Middleware DI",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware de DI kullanımı hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-di-middleware",
                  "title": "Middleware Dependency Injection",
                  "description": "Middleware de DI kullanımını uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Middleware constructor da DI kullan",
                    "IMiddleware interface i kullan",
                    "Service lifetime lara dikkat et"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Exception Handling",
              "href": "/education/lessons/middleware/exception-handling",
              "description": "Middleware lerde exception handling stratejilerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Exception handling middleware en üstte olmalıdır",
                "Try-catch ile exception yakalanabilir",
                "Error response ları standartlaştırılmalıdır",
                "Exception lar loglanmalıdır"
              ],
              "sections": [
                {
                  "id": "exception-handling",
                  "title": "Exception Handling",
                  "summary": "Middleware lerde exception handling.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Exception handling middleware en üstte olmalıdır. Try-catch ile exception yakalanabilir, error response ları standartlaştırılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Exception handling middleware napp.UseExceptionHandler(errorApp => n{ n    errorApp.Run(async context => n    { n        context.Response.StatusCode = 500; n        context.Response.ContentType ="application/json "; n         n        var error = new { Message ="An error occurred \" }; n        await context.Response.WriteAsJsonAsync(error); n    }); n});",
                      "explanation": "Exception handling middleware örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-exception-middleware",
                  "question": "Exception handling middleware nerede olmalıdır?",
                  "options": [
                    "En altta",
                    "En üstte",
                    "Ortada",
                    "Hiçbir yerde"
                  ],
                  "answer": "En üstte",
                  "rationale": "Exception handling middleware en üstte olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-exception-middleware-docs",
                  "label": "Microsoft Docs: Exception Handling",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/error-handling",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware de exception handling hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-exception-middleware",
                  "title": "Middleware Exception Handling",
                  "description": "Middleware de exception handling uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Exception handling middleware oluştur",
                    "Error response ları standartlaştır",
                    "Exception ları logla"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Performance Monitoring",
              "href": "/education/lessons/middleware/performance-monitoring",
              "description": "Middleware performans izleme tekniklerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "İleri",
              "keyTakeaways": [
                "Middleware execution time ölçülebilir",
                "Performance counters kullanılabilir",
                "Metrics toplanabilir",
                "Performance monitoring production da kritiktir"
              ],
              "sections": [
                {
                  "id": "performance-monitoring",
                  "title": "Performance Monitoring",
                  "summary": "Middleware performans izleme.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware execution time ölçülebilir, performance counters kullanılabilir ve metrics toplanabilir."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Performance monitoring middleware napp.Use(async (context, next) => n{ n    var stopwatch = Stopwatch.StartNew(); n    await next(); n    stopwatch.Stop(); n     n    _logger.LogInformation("Request {Path} took {ElapsedMilliseconds}ms ", n        context.Request.Path, stopwatch.ElapsedMilliseconds); n});",
                      "explanation": "Performance monitoring middleware örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-performance",
                  "question": "Performance monitoring ne işe yarar?",
                  "options": [
                    "Sadece loglama",
                    "Middleware performansını izleme ve optimize etme",
                    "Sadece metrik toplama",
                    "Hiçbir şey"
                  ],
                  "answer": "Middleware performansını izleme ve optimize etme",
                  "rationale": "Performance monitoring middleware performansını izleme ve optimize etme için kullanılır."
                }
              ],
              "resources": [
                {
                  "id": "resource-performance-docs",
                  "label": "Microsoft Docs: Performance",
                  "href": "https://learn.microsoft.com/aspnet/core/performance",
                  "type": "documentation",
                  "estimatedMinutes": 30,
                  "description": "Performance monitoring hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-performance",
                  "title": "Middleware Performance Monitoring",
                  "description": "Middleware performans izleme uygula.",
                  "type": "coding",
                  "estimatedMinutes": 35,
                  "difficulty": "İleri",
                  "instructions": [
                    "Execution time ölç",
                    "Metrics topla",
                    "Performance counter lar kullan"
                  ]
                }
              ]
            },
            {
              "label": "Middleware Best Practices",
              "href": "/education/lessons/middleware/best-practices",
              "description": "Middleware geliştirme için en iyi uygulamaları öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta",
              "keyTakeaways": [
                "Middleware ler tek sorumluluk prensibine uymalıdır",
                "Reusable middleware ler yazılmalıdır",
                "Performance a dikkat edilmelidir",
                "Error handling doğru yapılmalıdır"
              ],
              "sections": [
                {
                  "id": "best-practices",
                  "title": "Best Practices",
                  "summary": "Middleware geliştirme en iyi uygulamaları.",
                  "content": [
                    {
                      "type": "text",
                      "body": "Middleware ler tek sorumluluk prensibine uymalı, reusable olmalı, performance a dikkat edilmeli ve error handling doğru yapılmalıdır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Best practice: Reusable middleware npublic static class MiddlewareExtensions n{ n    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app) n    { n        return app.UseMiddleware<CustomMiddleware>(); n    } n} n n// Kullanım napp.UseCustomMiddleware();",
                      "explanation": "Reusable middleware extension method örneği."
                    }
                  ]
                }
              ],
              "checkpoints": [
                {
                  "id": "checkpoint-best-practices",
                  "question": "Middleware ler nasıl olmalıdır?",
                  "options": [
                    "Karmaşık ve çok işlevli",
                    "Tek sorumluluk prensibine uygun ve reusable",
                    "Sadece basit",
                    "Hiçbir şekilde"
                  ],
                  "answer": "Tek sorumluluk prensibine uygun ve reusable",
                  "rationale": "Middleware ler tek sorumluluk prensibine uygun ve reusable olmalıdır."
                }
              ],
              "resources": [
                {
                  "id": "resource-best-practices-docs",
                  "label": "Microsoft Docs: Middleware Best Practices",
                  "href": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware",
                  "type": "documentation",
                  "estimatedMinutes": 25,
                  "description": "Middleware best practices hakkında detaylı bilgi."
                }
              ],
              "practice": [
                {
                  "id": "practice-best-practices",
                  "title": "Middleware Best Practices",
                  "description": "Middleware geliştirme best practices uygula.",
                  "type": "coding",
                  "estimatedMinutes": 30,
                  "difficulty": "Orta",
                  "instructions": [
                    "Reusable middleware yaz",
                    "Extension method oluştur",
                    "Performance a dikkat et"
                  ]
                }
              ]
            }
          ]
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
          "id": "module-11-performance",
          "title": "Performans ve Caching Teknikleri",
          "summary": "Profiling, caching ve asenkron işleme taktikleriyle uygulamanı hızlandır.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında darboğazları profilleyip memory veya distributed cache stratejileri uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Performance",
            "description": "Profiling araçları ve cache stratejilerini pratiğe dök."
          },
          "relatedTopics": [
            {
              "label": "dotnet-counters ile Profiling",
              "href": "/education/lessons/performance/profiling/dotnet-counters",
              "description": "Runtime metriklerini gerçek zamanlı takip et."
            },
            {
              "label": "MemoryCache vs Distributed Cache",
              "href": "/education/lessons/performance/caching/memory-vs-distributed",
              "description": "Farklı caching yaklaşımlarını senaryolara göre kıyasla."
            },
            {
              "label": "Performans İçin Sağlık Kontrolleri",
              "href": "/education/lessons/performance/health-checks/performance-endpoints",
              "description": "Health check uç noktalarıyla servis durumunu izle."
            },
            {
              "label": "Performance Profiling Araçları",
              "href": "/education/lessons/performance/profiling/performance-profiling-tools",
              "description": "PerfView, dotTrace, Application Insights gibi profiling araçlarını kullan."
            },
            {
              "label": "Memory Leak Detection ve Analysis",
              "href": "/education/lessons/performance/memory/memory-leak-detection-analysis",
              "description": "Memory leak tespiti ve analiz tekniklerini öğren."
            },
            {
              "label": "Response Caching ve Output Caching",
              "href": "/education/lessons/performance/caching/response-output-caching",
              "description": "Response caching ve output caching stratejilerini uygula."
            },
            {
              "label": "Redis Cache Entegrasyonu",
              "href": "/education/lessons/performance/caching/redis-cache-integration",
              "description": "Redis ile distributed caching entegrasyonunu yapılandır."
            },
            {
              "label": "Cache Invalidation Stratejileri",
              "href": "/education/lessons/performance/caching/cache-invalidation-strategies",
              "description": "Cache invalidation stratejilerini ve patternlerini öğren."
            },
            {
              "label": "Performance Best Practices",
              "href": "/education/lessons/performance/best-practices/performance-best-practices",
              "description": "Performance optimization için en iyi pratikleri uygula."
            },
            {
              "label": "Async/Await Performance Optimization",
              "href": "/education/lessons/performance/async/async-await-performance-optimization",
              "description": "Async/await kullanımında performance optimization tekniklerini öğren."
            }
          ]
        },
        {
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
        },
        {
          "id": "module-13-docker",
          "title": "Docker ile Containerization",
          "summary": "Uygulamanı containerize et, image optimizasyonu ve orchestrator entegrasyonuna hazırla.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında çok aşamalı Dockerfile lar oluşturup container tabanlı dağıtımı yönetebileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Docker%20.NET",
            "description": "Multi-stage Dockerfile ve container best practice lerini öğren."
          },
          "relatedTopics": [
            {
              "label": "Multi-stage Dockerfile Oluşturma",
              "href": "/education/lessons/docker/multi-stage-builds",
              "description": "SDK ve runtime katmanlarını ayırarak hafif image üret."
            },
            {
              "label": "Container Ortam Değişkenleri",
              "href": "/education/lessons/docker/environment-configuration",
              "description": "Farklı ortam konfigürasyonlarını container seviyesinde yönet."
            },
            {
              "label": "Health Check ve Probing",
              "href": "/education/lessons/docker/health-checks",
              "description": "Container sağlık durumunu izleyen prob ları yapılandır."
            },
            {
              "label": "Docker Image Optimizasyonu",
              "href": "/education/lessons/docker/optimization/docker-image-optimization",
              "description": "Docker image boyutunu ve build süresini optimize etme tekniklerini öğren."
            },
            {
              "label": "Docker Compose ile Multi-Container Uygulamalar",
              "href": "/education/lessons/docker/docker-compose/multi-container-applications",
              "description": "Docker Compose ile çoklu container uygulamalarını yönet."
            },
            {
              "label": ".NET Core için Docker Best Practices",
              "href": "/education/lessons/docker/best-practices/dotnet-docker-best-practices",
              "description": ".NET Core uygulamaları için Docker best practices lerini uygula."
            },
            {
              "label": "Docker Volume ve Bind Mount Kullanımı",
              "href": "/education/lessons/docker/volumes/docker-volumes-bind-mounts",
              "description": "Docker volume ve bind mount kullanımını öğren."
            },
            {
              "label": "Docker Networking ve Service Discovery",
              "href": "/education/lessons/docker/networking/docker-networking-service-discovery",
              "description": "Docker networking ve service discovery mekanizmalarını kavra."
            },
            {
              "label": "Container Security Best Practices",
              "href": "/education/lessons/docker/security/container-security-best-practices",
              "description": "Container güvenliği için en iyi pratikleri uygula."
            },
            {
              "label": "Docker Registry ve Image Management",
              "href": "/education/lessons/docker/registry/docker-registry-image-management",
              "description": "Docker registry kullanımı ve image yönetim stratejilerini öğren."
            }
          ]
        },
        {
          "id": "module-14-cicd",
          "title": "CI/CD ve Deployment Süreçleri",
          "summary": "Pipeline otomasyonu, kalite kapıları ve mavi-yeşil dağıtımlarla üretime güvenli geçiş yap.",
          "durationMinutes": 45,
          "objectives": [
            "Bu modülü tamamladığında uçtan uca CI/CD pipeline ları tasarlayıp güvenli dağıtım stratejileri uygulayabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=CI%2FCD",
            "description": "Build, test ve release aşamalarını otomatikleştiren pipeline lar tasarla."
          },
          "relatedTopics": [
            {
              "label": "Build Pipeline Tasarımı",
              "href": "/education/lessons/cicd/build-pipeline",
              "description": "Bağımlılık indirme, derleme ve test adımlarını optimize et."
            },
            {
              "label": "Blue-Green ve Canary Dağıtımlar",
              "href": "/education/lessons/cicd/deployment-strategies",
              "description": "Risk azaltıcı dağıtım stratejilerini kıyasla ve uygula."
            },
            {
              "label": "Kalite Kapıları ve Onay Akışları",
              "href": "/education/lessons/cicd/quality-gates",
              "description": "Manual approval, code coverage ve statik analiz kontrolleri ekle."
            },
            {
              "label": "GitHub Actions ve Azure DevOps Pipeline",
              "href": "/education/lessons/cicd/pipelines/github-actions-azure-devops",
              "description": "GitHub Actions ve Azure DevOps pipeline yapılandırmasını öğren."
            },
            {
              "label": "Automated Testing in CI/CD",
              "href": "/education/lessons/cicd/testing/automated-testing-cicd",
              "description": "CI/CD pipeline ında otomatik test entegrasyonunu uygula."
            },
            {
              "label": "Release Management ve Versioning",
              "href": "/education/lessons/cicd/release/release-management-versioning",
              "description": "Release management ve semantic versioning stratejilerini öğren."
            },
            {
              "label": "Infrastructure as Code (IaC)",
              "href": "/education/lessons/cicd/iac/infrastructure-as-code",
              "description": "Terraform, ARM templates veya Bicep ile IaC uygulamasını öğren."
            },
            {
              "label": "CI/CD Security Best Practices",
              "href": "/education/lessons/cicd/security/cicd-security-best-practices",
              "description": "CI/CD pipeline güvenliği için en iyi pratikleri uygula."
            },
            {
              "label": "Rollback stratejileri",
              "href": "/education/lessons/cicd/rollback/rollback-strategies",
              "description": "Deployment rollback stratejilerini ve otomasyonunu öğren."
            },
            {
              "label": "CI/CD Monitoring ve Alerting",
              "href": "/education/lessons/cicd/monitoring/cicd-monitoring-alerting",
              "description": "CI/CD pipeline monitoring ve alerting mekanizmalarını kavra."
            }
          ]
        },
        {
          "id": "module-15-microservices",
          "title": "Microservices Mimarisi",
          "summary": "Dağıtık yapı taşlarını, servis sınırlarını ve gözlemlenebilirlik gereksinimlerini planla.",
          "durationMinutes": 60,
          "objectives": [
            "Bu modülü tamamladığında bağlam sınırlarını tanımlayıp dayanıklı mikroservis iletişim desenleri kurabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=Microservices",
            "description": "Servis sınırları, iletişim desenleri ve gözlemlenebilirliği tek çatı altında öğren."
          },
          "relatedTopics": [
            {
              "label": "Bounded Context Tasarımı",
              "href": "/education/lessons/microservices/bounded-context",
              "description": "Domain-driven design ile servis sınırlarını modelle."
            },
            {
              "label": "Servisler Arası İletişim Desenleri",
              "href": "/education/lessons/microservices/communication-patterns",
              "description": "Sync, async ve event-driven iletişim opsiyonlarını değerlendir."
            },
            {
              "label": "Gözlemlenebilirlik Temelleri",
              "href": "/education/lessons/microservices/observability/foundations",
              "description": "Tracing, logging ve metrics bileşenlerini senkronize et."
            },
            {
              "label": "API Gateway Pattern",
              "href": "/education/lessons/microservices/api-gateway/api-gateway-pattern",
              "description": "API Gateway pattern ve kullanım senaryolarını öğren."
            },
            {
              "label": "Service Mesh ve Istio",
              "href": "/education/lessons/microservices/service-mesh/service-mesh-istio",
              "description": "Service mesh kavramı ve Istio kullanımını öğren."
            },
            {
              "label": "Circuit Breaker Pattern",
              "href": "/education/lessons/microservices/resilience/circuit-breaker-pattern",
              "description": "Circuit breaker pattern ve Polly kütüphanesi kullanımını öğren."
            },
            {
              "label": "Event Sourcing ve CQRS",
              "href": "/education/lessons/microservices/events/event-sourcing-cqrs",
              "description": "Event sourcing ve CQRS pattern lerini mikroservis mimarisinde uygula."
            },
            {
              "label": "Distributed Transactions ve Saga Pattern",
              "href": "/education/lessons/microservices/transactions/distributed-transactions-saga",
              "description": "Distributed transaction yönetimi ve Saga pattern kullanımını öğren."
            },
            {
              "label": "Microservices Testing Stratejileri",
              "href": "/education/lessons/microservices/testing/microservices-testing-strategies",
              "description": "Mikroservis test stratejileri ve contract testing i öğren."
            },
            {
              "label": "Microservices Security Best Practices",
              "href": "/education/lessons/microservices/security/microservices-security-best-practices",
              "description": "Mikroservis güvenliği için en iyi pratikleri uygula."
            }
          ]
        },
        {
          "id": "module-16-libraries",
          "title": "Kütüphaneler",
          "summary": ".NET ekosistemindeki üretkenliği artıran popüler kütüphaneleri keşfet.",
          "durationMinutes": 30,
          "objectives": [
            "Bu modülü tamamladığında MediatR, FluentValidation ve AutoMapper gibi üretkenlik kütüphanelerini doğru senaryolarda kullanabileceksin."
          ],
          "activities": [],
          "learnLink": {
            "label": "Konuyu Öğren",
            "href": "/education/courses?search=.NET%20Libraries",
            "description": "Ecosistemde sık kullanılan kütüphanelerin rol ve kullanım alanlarını öğren."
          },
          "relatedTopics": [
            {
              "label": "MediatR ile CQRS Uygulama",
              "href": "/education/lessons/libraries/mediatr/cqrs",
              "description": "Komut ve sorguları aracı katmanla yönlendir."
            },
            {
              "label": "FluentValidation ile Doğrulama",
              "href": "/education/lessons/libraries/fluentvalidation/rules",
              "description": "Zengin validasyon kurallarını akıcı API ile tanımla."
            },
            {
              "label": "AutoMapper ile Nesne Eşleme",
              "href": "/education/lessons/libraries/automapper/mapping-profiles",
              "description": "DTO ve domain nesneleri arasında mapping profilleri oluştur."
            },
            {
              "label": "Polly ile Resilience Patterns",
              "href": "/education/lessons/libraries/polly/resilience-patterns",
              "description": "Polly ile retry, circuit breaker ve timeout pattern lerini uygula."
            },
            {
              "label": "Serilog ile Structured Logging",
              "href": "/education/lessons/libraries/serilog/structured-logging",
              "description": "Serilog ile structured logging ve enrichment kullanımını öğren."
            },
            {
              "label": "Mapster ile High-Performance Mapping",
              "href": "/education/lessons/libraries/mapster/high-performance-mapping",
              "description": "Mapster ile yüksek performanslı object mapping i öğren."
            },
            {
              "label": "Refit ile Type-Safe HTTP Clients",
              "href": "/education/lessons/libraries/refit/type-safe-http-clients",
              "description": "Refit ile type-safe HTTP client kullanımını öğren."
            },
            {
              "label": "Swashbuckle ve Swagger Entegrasyonu",
              "href": "/education/lessons/libraries/swashbuckle/swagger-integration",
              "description": "Swashbuckle ile Swagger/OpenAPI dokümantasyonunu yapılandır."
            },
            {
              "label": "Hangfire ile Background Jobs",
              "href": "/education/lessons/libraries/hangfire/background-jobs",
              "description": "Hangfire ile background job processing i öğren."
            },
            {
              "label": "MassTransit ile Message Bus",
              "href": "/education/lessons/libraries/masstransit/message-bus",
              "description": "MassTransit ile message bus ve event-driven architecture ı uygula."
            }
          ]
        },
        {
          "id": "module-17-entity-framework-core",
          "title": "Entity Framework Core İleri Seviye",
          "summary": "EF Core ile veritabanı işlemlerini optimize et, migration stratejilerini yönet ve performans sorunlarını çöz.",
          "durationMinutes": 180,
          "objectives": [
            "EF Core migration stratejilerini ve veri seed işlemlerini yönetmek",
            "Change tracking, eager loading ve lazy loading kavramlarını uygulamak",
            "Query performansını optimize etmek için AsNoTracking ve compiled queries kullanmak",
            "Raw SQL ve stored procedure entegrasyonlarını yapmak",
            "Unit of Work ve Repository pattern lerini EF Core ile uygulamak"
          ],
          "activities": [
            {
              "id": "activity-ef-migrations",
              "title": "Migration Stratejileri",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Code-first yaklaşımıyla migration oluştur, veri dönüşümlerini yönet ve rollback senaryolarını uygula."
            },
            {
              "id": "activity-ef-change-tracking",
              "title": "Change Tracking Optimizasyonu",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": "AsNoTracking kullanarak read-only sorguları optimize et ve change tracking maliyetlerini azalt."
            },
            {
              "id": "activity-ef-eager-loading",
              "title": "Eager Loading Stratejileri",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Include ve ThenInclude ile ilişkili verileri tek sorguda yükle ve N+1 problem ini çöz."
            },
            {
              "id": "activity-ef-compiled-queries",
              "title": "Compiled Queries ile Performans",
              "type": "coding",
              "estimatedMinutes": 20,
              "prompt": "Sık kullanılan sorguları compile ederek performansı artır."
            },
            {
              "id": "activity-ef-raw-sql",
              "title": "Raw SQL ve Stored Procedures",
              "type": "coding",
              "estimatedMinutes": 25,
              "prompt": "FromSqlRaw ve ExecuteSqlRaw ile raw SQL sorguları çalıştır."
            },
            {
              "id": "activity-ef-repository-pattern",
              "title": "Repository Pattern Uygulaması",
              "type": "coding",
              "estimatedMinutes": 30,
              "prompt": "Generic repository pattern ile veri erişim katmanını soyutla."
            }
          ],
          "checkpoints": [
            {
              "id": "checkpoint-ef-notracking",
              "title": "AsNoTracking Kullanım Senaryosu",
              "description": "Hangi durumlarda AsNoTracking kullanılmalıdır?",
              "tasks": [
                {
                  "id": "task-ef-notracking-analysis",
                  "description": "Read-only sorgular için AsNoTracking kullanımını analiz et ve performans farkını ölç."
                }
              ],
              "successCriteria": [
                "AsNoTracking in ne zaman kullanılacağını açıklayabilirsin",
                "Change tracking maliyetini ölçebilirsin"
              ],
              "estimatedMinutes": 20
            }
          ],
          "learnLink": {
            "label": "EF Core Öğren",
            "href": "/education/courses?search=Entity%20Framework%20Core",
            "description": "EF Core best practice leri ve performans optimizasyon tekniklerini incele."
          },
          "relatedTopics": [
            {
              "label": "EF Core Migration Yönetimi",
              "href": "/education/lessons/ef-core/migrations/overview",
              "description": "Code-first migration stratejilerini ve veri dönüşümlerini öğren.",
              "estimatedDurationMinutes": 45,
              "level": "Orta",
              "keyTakeaways": [
                "Migration dosyalarını oluşturma ve uygulama",
                "Veri migration senaryolarını yönetme",
                "Rollback stratejileri"
              ]
            },
            {
              "label": "Change Tracking ve Performans",
              "href": "/education/lessons/ef-core/change-tracking/optimization",
              "description": "Change tracking maliyetlerini azaltma tekniklerini öğren.",
              "estimatedDurationMinutes": 40,
              "level": "Orta"
            },
            {
              "label": "Eager Loading ve N+1 Problemi",
              "href": "/education/lessons/ef-core/loading-strategies/eager-loading",
              "description": "Include ve ThenInclude ile ilişkili verileri optimize et.",
              "estimatedDurationMinutes": 50,
              "level": "Orta"
            },
            {
              "label": "Lazy Loading ve Explicit Loading",
              "href": "/education/lessons/ef-core/loading-strategies/lazy-explicit-loading",
              "description": "Lazy loading ve explicit loading stratejilerini öğren."
            },
            {
              "label": "Compiled Queries ve Performance",
              "href": "/education/lessons/ef-core/performance/compiled-queries",
              "description": "Compiled queries ile query performansını optimize et."
            },
            {
              "label": "Raw SQL ve Stored Procedures",
              "href": "/education/lessons/ef-core/raw-sql/stored-procedures",
              "description": "Raw SQL sorguları ve stored procedure kullanımını öğren."
            },
            {
              "label": "Unit of Work ve Repository Pattern",
              "href": "/education/lessons/ef-core/patterns/unit-of-work-repository",
              "description": "Unit of Work ve Repository pattern lerini EF Core ile uygula."
            },
            {
              "label": "EF Core Interceptors",
              "href": "/education/lessons/ef-core/interceptors/ef-core-interceptors",
              "description": "EF Core interceptors ile query ve command interception ı öğren."
            },
            {
              "label": "Database Seeding ve Initialization",
              "href": "/education/lessons/ef-core/seeding/database-seeding-initialization",
              "description": "Database seeding ve initialization stratejilerini uygula."
            },
            {
              "label": "EF Core Value Converters",
              "href": "/education/lessons/ef-core/value-converters/ef-core-value-converters",
              "description": "Value converters ile custom type mapping i öğren."
            },
            {
              "label": "EF Core Query Filters",
              "href": "/education/lessons/ef-core/query-filters/ef-core-query-filters",
              "description": "Global query filters ile soft delete ve multi-tenancy yi uygula."
            },
            {
              "label": "EF Core Performance Best Practices",
              "href": "/education/lessons/ef-core/best-practices/ef-core-performance-best-practices",
              "description": "EF Core performance optimization için en iyi pratikleri öğren."
            }
          ]
        },
        {
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
              },
              {
                "label": "Uzman",
                "description": "CI/CD, rollback stratejisi ve otomatik testler tam entegre."
              }
            ]
          }
        ],
        "recommendedDurationMinutes": 720
      }
    }
    $$::jsonb,
    1140,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
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
    (
        'quiz-dotnet-daily-challenge',
        'course-dotnet-roadmap',
        'Daily .NET Core Challenge',
        'Kariyer rekabet ekranında gösterilecek günlük bilgi testi.',
        '.NET Core',
        'TEST',
        'intermediate',
        '[{"id":"q1","question":"Dependency Injection hangi avantajı sağlar?","options":["Bağımlılıkları merkezi olarak yönetir","Performansı otomatik artırır","Veritabanı bağlantısı oluşturur","UI bileşenlerini günceller"],"answer":0},{"id":"q2","question":"Minimal API kullanmak için hangi namespace gereklidir?","options":["Microsoft.AspNetCore.Builder","System.Linq","System.Net.Http","Microsoft.Extensions.Hosting"],"answer":0}]'::jsonb,
        70,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'quiz-dotnet-bugfix-sprint',
        'course-dotnet-roadmap',
        'Bug Fix Sprint',
        'Gerçek hata kayıtlarını hızlıca çözerek puan topla.',
        '.NET Core',
        'BUG_FIX',
        'intermediate',
        '[{"id":"bf1","scenario":"API yanıt süresini etkileyen null referans hatasını düzelt.","weight":50},{"id":"bf2","scenario":"Caching katmanındaki yanlış konfigürasyonu gider.","weight":50}]'::jsonb,
        75,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'quiz-dotnet-live-coding',
        'course-dotnet-roadmap',
        'Live Coding Warmup',
        'Gerçek zamanlı kodlama görevleri ile reflekslerini güçlendir.',
        '.NET Core',
        'LIVE_CODING',
        'advanced',
        '[{"id":"lc1","challenge":"Minimal API ile CRUD endpoint hazırla.","weight":60},{"id":"lc2","challenge":"Background service ekleyerek e-mail gönderimini planla.","weight":40}]'::jsonb,
        80,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'quiz-dotnet-hackaton',
        'course-dotnet-roadmap',
        'Hackaton Sprint',
        'Takım içinde servis mimarisi kur, ölçeklenebilirlik planı hazırla.',
        '.NET Core',
        'HACKATON',
        'advanced',
        '[{"id":"hack1","deliverable":"Domain driven tasarım diyagramı hazırla.","weight":40},{"id":"hack2","deliverable":"Observability paketi entegre et.","weight":30},{"id":"hack3","deliverable":"CI/CD pipeline tanımı yap.","weight":30}]'::jsonb,
        70,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    -- Mini test entries (type = 'MINI_TEST') are linked to lesson detayı via lessonSlug.
    -- Yeni ders mini testleri eklerken slug alanını /education/lessons/... formatında doldurmanız yeterlidir.
    (
        'mini-test-csharp-loops-for',
        'course-dotnet-roadmap',
        'Mini Test: For Döngüsü Ustalığı',
        'Konu anlatımını tamamladıktan sonra for döngüsü pratiklerini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-for-1",
            "question": "For döngüsünde koşul ifadesi false olduğunda ne olur?",
            "options": [
              "Sayaç güncellenir ve döngü devam eder",
              "Döngü sonlanır ve akış döngü dışındaki ilk satıra geçer",
              "Koşul tekrar true olana kadar beklenir",
              "Sayaç değeri sıfırlanır ve döngü baştan çalışır"
            ],
            "correctAnswer": 1,
            "explanation": "Koşul ifadesi false olduğunda döngü blokları çalıştırılmaz ve program akışı döngüyü izleyen ifadeye aktarılır."
          },
          {
            "id": "mini-for-2",
            "question": "Aşağıdaki ifadelerden hangisi 10 dan geriye doğru ikişer azaltarak iterasyon yapar?",
            "options": [
              "for (int i = 10; i > 0; i++)",
              "for (int i = 10; i >= 0; i -= 2)",
              "for (int i = 0; i <= 10; i += 2)",
              "for (int i = 0; i < 10; i--)"
            ],
            "correctAnswer": 1,
            "explanation": "Başlangıç değeri 10, koşulu i >= 0 ve her adımda iki azaltma işlemi gerekliliği i -= 2 ile sağlanır."
          },
          {
            "id": "mini-for-3",
            "question": "break anahtar kelimesi ile ilgili aşağıdakilerden hangisi doğrudur?",
            "options": [
              "Sadece while döngülerinde kullanılabilir",
              "Döngünün mevcut iterasyonunu atlar ve devam eder",
              "Döngüyü tamamen sonlandırarak kontrolü dışarı taşır",
              "Sayaç değerini bir artırdıktan sonra döngüden çıkar"
            ],
            "correctAnswer": 2,
            "explanation": "break anahtar kelimesi döngü veya switch ifadeleri içerisinde kullanıldığında mevcut işlemi sonlandırıp kontrolü bir üst bloktaki ilk satıra taşır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/loops/for',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-loops-foreach',
        'course-dotnet-roadmap',
        'Mini Test: Foreach Döngüsü',
        'Foreach döngüsü konusunu tamamladıktan sonra bilgini test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-foreach-1",
            "question": "Foreach döngüsü hangi durumlarda kullanılmalıdır?",
            "options": [
              "Sadece diziler için",
              "Index yönetimi gerektirmeyen koleksiyon iterasyonlarında",
              "Sadece List koleksiyonları için",
              "Sadece Dictionary için"
            ],
            "correctAnswer": 1,
            "explanation": "Foreach döngüsü, index yönetimi gerektirmeyen durumlarda koleksiyonlar üzerinde güvenli ve okunabilir iterasyon sağlar."
          },
          {
            "id": "mini-foreach-2",
            "question": "Foreach döngüsü içinde koleksiyonu değiştirmek neden hata verir?",
            "options": [
              "Performans sorunları yaratır",
              "Koleksiyonun durumu değiştiği için iterasyon tutarsız hale gelir",
              "Foreach sadece okuma amaçlıdır",
              "Derleyici hatası verir"
            ],
            "correctAnswer": 1,
            "explanation": "Foreach döngüsü başlangıçta koleksiyonun snapshotını alır. Koleksiyon değişirse iterasyon tutarsız hale gelir ve InvalidOperationException fırlatılır."
          },
          {
            "id": "mini-foreach-3",
            "question": "Aşağıdakilerden hangisi foreach ile kullanılamaz?",
            "options": [
              "List<string>",
              "Dictionary<string, int>",
              "int[]",
              "int (primitive type)"
            ],
            "correctAnswer": 3,
            "explanation": "Foreach döngüsü IEnumerable arayüzünü implement eden koleksiyonlarla çalışır. Primitive typelar (int, string vb.) koleksiyon değildir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/loops/foreach',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-loops-while',
        'course-dotnet-roadmap',
        'Mini Test: While ve Do-While Döngüleri',
        'While ve do-while döngüleri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-while-1",
            "question": "While ve do-while döngüleri arasındaki temel fark nedir?",
            "options": [
              "Do-while daha hızlıdır",
              "Do-while en az bir kez çalışır, while hiç çalışmayabilir",
              "While sadece sayısal değerlerle çalışır",
              "Do-while sadece koleksiyonlarla kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "Do-while döngüsü koşulu sonda kontrol ettiği için kod bloğu en az bir kez çalışır. While döngüsü ise koşulu başta kontrol eder, false ise hiç çalışmayabilir."
          },
          {
            "id": "mini-while-2",
            "question": "While döngüsünde sonsuz döngü oluşmaması için ne yapılmalıdır?",
            "options": [
              "Koşul ifadesini her zaman true yap",
              "Döngü içinde koşulu mutlaka güncelle",
              "Sadece for döngüsü kullan",
              "Break ifadesi kullan"
            ],
            "correctAnswer": 1,
            "explanation": "While döngülerinde koşulu mutlaka döngü içinde güncellemek gerekir, aksi halde koşul her zaman true kalır ve sonsuz döngü oluşur."
          },
          {
            "id": "mini-while-3",
            "question": "Do-while döngüsü hangi senaryolarda tercih edilir?",
            "options": [
              "Koleksiyon iterasyonlarında",
              "Kullanıcı girişi ve menü sistemlerinde",
              "Sadece sayısal hesaplamalarda",
              "Sadece string işlemlerinde"
            ],
            "correctAnswer": 1,
            "explanation": "Do-while döngüsü, en az bir kez çalışması gereken durumlarda (kullanıcı girişi, menü sistemleri) idealdir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/loops/while',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-basics-variables-types',
        'course-dotnet-roadmap',
        'Mini Test: Değişkenler ve Veri Tipleri',
        'Değişken tanımlama ve tip dönüşümleri konusunu test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-vars-1",
            "question": "var anahtar kelimesi ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman, kod daha kısa olur",
              "Tip açıkça belli olduğunda ve okunabilirliği artırdığında",
              "Sadece string değişkenler için",
              "Hiçbir zaman kullanılmamalıdır"
            ],
            "correctAnswer": 1,
            "explanation": "var kullanımı kod okunabilirliğini artırabilir ancak tip belirsizliği yaratmamalıdır. Tip açıkça belli olduğunda (örn: new List<int>()) kullanılabilir."
          },
          {
            "id": "mini-vars-2",
            "question": "C# dilinde value type ve reference type arasındaki fark nedir?",
            "options": [
              "Value typelar heap te, reference type lar stack te saklanır",
              "Value typelar stack te, reference type lar heap te saklanır",
              "Hiçbir fark yoktur",
              "Value typelar sadece sayısal değerler için kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "Value typelar (int, bool, struct) stack te saklanır ve değerleri doğrudan taşınır. Reference type lar (class, string) heap te saklanır ve referansları taşınır."
          },
          {
            "id": "mini-vars-3",
            "question": "Güvenli tip dönüşümü için hangi metod kullanılmalıdır?",
            "options": [
              "Parse",
              "TryParse",
              "Convert",
              "Cast"
            ],
            "correctAnswer": 1,
            "explanation": "TryParse metodu güvenli tip dönüşümü sağlar. Başarısız olursa exception fırlatmaz, false döndürür. Parse metodu başarısız olursa exception fırlatır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/basics/variables-types',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-basics-methods',
        'course-dotnet-roadmap',
        'Mini Test: Metotlar ve Fonksiyonlar',
        'Metot tanımlama ve kullanımı konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-methods-1",
            "question": "Return ifadesi ne zaman kullanılır?",
            "options": [
              "Sadece void metotlarda",
              "Değer döndüren metotlarda ve metottan erken çıkmak için",
              "Sadece string döndüren metotlarda",
              "Hiçbir zaman gerekli değildir"
            ],
            "correctAnswer": 1,
            "explanation": "Return ifadesi hem değer döndüren metotlarda değer döndürmek için hem de metottan erken çıkmak için kullanılabilir."
          },
          {
            "id": "mini-methods-2",
            "question": "Metot overloading nedir?",
            "options": [
              "Aynı isimde farklı parametrelerle birden fazla metot tanımlama",
              "Metotları override etme",
              "Metotları static yapma",
              "Metotları private yapma"
            ],
            "correctAnswer": 0,
            "explanation": "Metot overloading, aynı isimde farklı parametre sayısı veya tipleriyle birden fazla metot tanımlamaktır. Derleyici parametrelere göre doğru metodu seçer."
          },
          {
            "id": "mini-methods-3",
            "question": "Void metotlar ne döndürür?",
            "options": [
              "null",
              "0",
              "Hiçbir şey döndürmez",
              "void"
            ],
            "correctAnswer": 2,
            "explanation": "Void metotlar değer döndürmez, sadece işlem yapar. Return ifadesi kullanılırsa sadece metottan çıkmak için kullanılır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/basics/methods',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-oop-classes-objects',
        'course-dotnet-roadmap',
        'Mini Test: Sınıflar ve Nesneler',
        'Nesne yönelimli programlama temellerini test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-classes-1",
            "question": "Constructor metot ne zaman çalışır?",
            "options": [
              "Sınıf tanımlandığında",
              "Nesne oluşturulduğunda (new ile)",
              "Metot çağrıldığında",
              "Program başladığında"
            ],
            "correctAnswer": 1,
            "explanation": "Constructor metotlar nesne oluşturulurken (new anahtar kelimesi ile) otomatik olarak çalışır ve nesneyi başlatır."
          },
          {
            "id": "mini-classes-2",
            "question": "Encapsulation (kapsülleme) nedir?",
            "options": [
              "Sınıfları birleştirme",
              "Verilerin doğrudan erişimini engelleyip kontrollü erişim sağlama",
              "Metotları gizleme",
              "Sınıfları private yapma"
            ],
            "correctAnswer": 1,
            "explanation": "Encapsulation, verilerin doğrudan erişimini engelleyip property ve metotlar üzerinden kontrollü erişim sağlayarak veri bütünlüğünü korur."
          },
          {
            "id": "mini-classes-3",
            "question": "Property (özellik) ne işe yarar?",
            "options": [
              "Sadece veri saklar",
              "Veri erişimini kontrol eder ve get/set işlemleri yapar",
              "Sadece metot çağırır",
              "Sınıfı başlatır"
            ],
            "correctAnswer": 1,
            "explanation": "Propertyler veri erişimini kontrol eder. get accessor veri okuma, set accessor veri yazma işlemlerini yapar. Encapsulation sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/oop/classes-objects',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-collections-arrays-lists',
        'course-dotnet-roadmap',
        'Mini Test: Diziler ve Koleksiyonlar',
        'Diziler ve koleksiyon türleri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-collections-1",
            "question": "Dizi ve List arasındaki temel fark nedir?",
            "options": [
              "List daha hızlıdır",
              "Dizi dinamik boyutludur, List sabit boyutludur",
              "List dinamik boyutludur, dizi sabit boyutludur",
              "Hiçbir fark yoktur"
            ],
            "correctAnswer": 2,
            "explanation": "Diziler tanımlandıktan sonra boyutu değiştirilemez (sabit boyutlu). List ise eleman ekleme/çıkarma ile dinamik olarak büyüyüp küçülebilir."
          },
          {
            "id": "mini-collections-2",
            "question": "Dictionary koleksiyonu ne için kullanılır?",
            "options": [
              "Sadece string değerler için",
              "Key-value çiftleri için",
              "Sadece sayısal değerler için",
              "Sıralı veri saklamak için"
            ],
            "correctAnswer": 1,
            "explanation": "Dictionary<TKey, TValue> key-value çiftleri için idealdir. Her key benzersiz olmalıdır ve hızlı arama sağlar."
          },
          {
            "id": "mini-collections-3",
            "question": "Dictionary de var olmayan bir key e erişmeye çalışırsak ne olur?",
            "options": [
              "null döndürür",
              "KeyNotFoundException hatası fırlatır",
              "0 döndürür",
              "Boş string döndürür"
            ],
            "correctAnswer": 1,
            "explanation": "Dictionary de var olmayan bir key e erişmeye çalışırsak KeyNotFoundException hatası fırlatılır. Güvenli erişim için TryGetValue kullanılmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/collections/arrays-lists',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-basics-exception-handling',
        'course-dotnet-roadmap',
        'Mini Test: Hata Yönetimi',
        'Exception handling mekanizmalarını test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-exception-1",
            "question": "Finally bloğu ne zaman çalışır?",
            "options": [
              "Sadece hata oluştuğunda",
              "Sadece hata oluşmadığında",
              "Her durumda (hata olsun ya da olmasın)",
              "Sadece return ifadesi kullanıldığında"
            ],
            "correctAnswer": 2,
            "explanation": "Finally bloğu try-catch yapısından çıkılmadan önce her durumda çalışır, kaynak temizleme için idealdir."
          },
          {
            "id": "mini-exception-2",
            "question": "Catch bloklarını nasıl sıralamalıyız?",
            "options": [
              "Genelden spesifike doğru",
              "Spesifikten genele doğru",
              "Alfabetik sırayla",
              "Fark etmez"
            ],
            "correctAnswer": 1,
            "explanation": "Catch bloklarını spesifikten genele doğru sıralamalıyız. Spesifik exception lar önce, genel Exception en sonda yakalanmalıdır."
          },
          {
            "id": "mini-exception-3",
            "question": "TryParse metodu ne döndürür?",
            "options": [
              "Sadece dönüştürülmüş değer",
              "bool (başarı durumu) ve out parametre ile değer",
              "Sadece bool",
              "Exception"
            ],
            "correctAnswer": 1,
            "explanation": "TryParse metodu bool döndürür (başarı durumu) ve out parametre ile dönüştürülmüş değeri döndürür. Exception fırlatmaz."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/basics/exception-handling',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-basics-console-writeline',
        'course-dotnet-roadmap',
        'Mini Test: Console.WriteLine',
        'Temel giriş/çıkış işlemlerini test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-console-1",
            "question": "Console.WriteLine ile Console.Write arasındaki fark nedir?",
            "options": [
              "WriteLine satır sonu ekler, Write eklemez",
              "WriteLine daha hızlıdır",
              "Write sadece string kabul eder",
              "Hiçbir fark yoktur"
            ],
            "correctAnswer": 0,
            "explanation": "Console.WriteLine çıktıdan sonra satır sonu (newline) ekler, Console.Write ise eklemez. İkisi de aynı veri tiplerini kabul eder."
          },
          {
            "id": "mini-console-2",
            "question": "String interpolation için hangi syntax kullanılır?",
            "options": [
              "$ \"...\"",
              "\"...\"",
              "$ \"...\"",
              "@\"...\""
            ],
            "correctAnswer": 0,
            "explanation": "String interpolation için $ sembolü kullanılır: $ \"Merhaba {isim} ". Bu sayede değişken değerleri string içine gömülebilir."
          },
          {
            "id": "mini-console-3",
            "question": "Console.ReadLine() ne döndürür?",
            "options": [
              "int",
              "string",
              "char",
              "void"
            ],
            "correctAnswer": 1,
            "explanation": "Console.ReadLine() kullanıcıdan satır okur ve string olarak döndürür. Sayısal değer almak için Parse veya TryParse kullanılmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/basics/console-writeline',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-csharp-collections-linq-basics',
        'course-dotnet-roadmap',
        'Mini Test: LINQ ile Koleksiyon Sorgulama',
        'LINQ sorguları konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-linq-1",
            "question": "LINQ un iki yazım şekli nedir?",
            "options": [
              "Method syntax ve Query syntax",
              "SQL syntax ve C# syntax",
              "Lambda syntax ve Expression syntax",
              "Inline syntax ve Block syntax"
            ],
            "correctAnswer": 0,
            "explanation": "LINQ, method syntax (lambda expressions) ve query syntax (SQL benzeri) olmak üzere iki farklı yazım şekli sunar."
          },
          {
            "id": "mini-linq-2",
            "question": "LINQ sorguları ne zaman çalıştırılır?",
            "options": [
              "Hemen sorgu yazıldığında",
              "Sadece sonuç kullanıldığında (lazy evaluation)",
              "Sadece ToList() çağrıldığında",
              "Her zaman anında"
            ],
            "correctAnswer": 1,
            "explanation": "LINQ sorguları lazy evaluation kullanır, yani sorgu yazıldığında çalışmaz, sadece sonuç kullanıldığında (foreach, ToList() vb.) çalışır."
          },
          {
            "id": "mini-linq-3",
            "question": "Where metodu ne işe yarar?",
            "options": [
              "Koleksiyonu sıralar",
              "Koleksiyonu filtreler",
              "Koleksiyonu dönüştürür",
              "Koleksiyonu gruplar"
            ],
            "correctAnswer": 1,
            "explanation": "Where metodu, belirtilen koşula uyan elemanları filtreleyerek yeni bir koleksiyon döndürür."
          },
          {
            "id": "mini-linq-4",
            "question": "Select metodu ne işe yarar?",
            "options": [
              "Koleksiyonu filtreler",
              "Koleksiyonu dönüştürür",
              "Koleksiyonu sıralar",
              "Koleksiyonu gruplar"
            ],
            "correctAnswer": 1,
            "explanation": "Select metodu, koleksiyonun her elemanını dönüştürerek yeni bir koleksiyon oluşturur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/csharp/collections/linq-basics',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-assembly-loading-reflection',
        'course-dotnet-roadmap',
        'Mini Test: Assembly Loading ve Reflection',
        'Assembly yükleme ve reflection konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-reflection-1",
            "question": "Assembly.Load ve Assembly.LoadFrom arasındaki fark nedir?",
            "options": [
              "LoadFrom daha hızlıdır",
              "Load assembly name ile, LoadFrom dosya yolu ile yükler",
              "Hiçbir fark yoktur",
              "Load sadece .exe dosyaları için kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "Assembly.Load assembly name (FQN) ile yükleme yapar, Assembly.LoadFrom ise dosya yolu ile yükleme yapar."
          },
          {
            "id": "mini-reflection-2",
            "question": "Reflection ile ne yapılabilir?",
            "options": [
              "Sadece tip bilgilerini okuma",
              "Tip bilgilerini okuma, dinamik nesne oluşturma ve metot çağırma",
              "Sadece metot çağırma",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Reflection ile tip bilgilerini okuyabilir, dinamik nesne oluşturabilir (Activator.CreateInstance) ve metot çağırabilirsin (MethodInfo.Invoke)."
          },
          {
            "id": "mini-reflection-3",
            "question": "Activator.CreateInstance ne işe yarar?",
            "options": [
              "Sadece tip bilgisi alır",
              "Dinamik olarak nesne oluşturur",
              "Sadece metot çağırır",
              "Assembly yükler"
            ],
            "correctAnswer": 1,
            "explanation": "Activator.CreateInstance, reflection kullanarak runtime da dinamik olarak nesne oluşturur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/assembly-loading-reflection',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-gc-strategies-optimization',
        'course-dotnet-roadmap',
        'Mini Test: Garbage Collection Stratejileri',
        'GC mekanizmaları ve optimizasyon tekniklerini test et.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-gc-1",
            "question": "Server GC ne zaman kullanılmalıdır?",
            "options": [
              "Tüm uygulamalarda",
              "Sunucu uygulamalarında yüksek throughput gerektiğinde",
              "Sadece desktop uygulamalarında",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Server GC çoklu thread kullanır ve sunucu uygulamalarında daha yüksek throughput sağlar."
          },
          {
            "id": "mini-gc-2",
            "question": "GC generation sisteminde kaç generation vardır?",
            "options": [
              "1",
              "2",
              "3",
              "4"
            ],
            "correctAnswer": 2,
            "explanation": "GC generation sistemi 3 seviyeden oluşur: Generation 0 (yeni nesneler), Generation 1 (orta ömürlü), Generation 2 (uzun ömürlü)."
          },
          {
            "id": "mini-gc-3",
            "question": "IDisposable patterninin amacı nedir?",
            "options": [
              "Sadece bellek temizleme",
              "Managed ve unmanaged kaynakların kontrollü temizlenmesi",
              "Sadece unmanaged kaynak temizleme",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "IDisposable pattern, hem managed hem de unmanaged kaynakların kontrollü şekilde temizlenmesini sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/gc-strategies-optimization',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-jit-tiered-compilation',
        'course-dotnet-roadmap',
        'Mini Test: JIT ve Tiered Compilation',
        'JIT compilation ve tiered compilation konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-jit-1",
            "question": "JIT compiler ne zaman çalışır?",
            "options": [
              "Derleme zamanında",
              "Çalışma zamanında, metod ilk çağrıldığında",
              "Uygulama yüklendiğinde",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "JIT compiler, metod ilk çağrıldığında IL kodunu native koda çevirir. Bu  just-in-time  yaklaşımıdır."
          },
          {
            "id": "mini-jit-2",
            "question": "Tiered compilation ın avantajı nedir?",
            "options": [
              "Sadece hızlı başlatma sağlar",
              "Başlatma süresi ve performans arasında denge sağlar",
              "Sadece performans sağlar",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Tiered compilation, Tier 0 ile hızlı başlatma, Tier 1 ile performans optimizasyonu sağlar."
          },
          {
            "id": "mini-jit-3",
            "question": "AOT compilation ın avantajı nedir?",
            "options": [
              "Daha yavaş başlatma",
              "Daha hızlı başlatma ve daha küçük footprint",
              "Sadece daha küçük footprint",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "AOT (Ahead-of-Time) compilation, uygulamanın önceden derlenmesini sağlar, bu da daha hızlı başlatma ve daha küçük footprint sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/jit-tiered-compilation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-bcl-usage',
        'course-dotnet-roadmap',
        'Mini Test: Base Class Library Kullanımı',
        'BCL namespace leri ve kullanım senaryolarını test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-bcl-1",
            "question": "BCL nedir?",
            "options": [
              "Sadece System namespace i",
              ".NET Core un temel sınıf kütüphanesi",
              "Sadece koleksiyonlar",
              "Sadece LINQ"
            ],
            "correctAnswer": 1,
            "explanation": "BCL (Base Class Library), .NET Core un temel sınıf kütüphanesidir ve tüm uygulamalarda kullanılır."
          },
          {
            "id": "mini-bcl-2",
            "question": "System.Linq namespace i ne için kullanılır?",
            "options": [
              "Sadece koleksiyon oluşturma",
              "Koleksiyonlar üzerinde sorgulama ve dönüşüm işlemleri",
              "Sadece string işlemleri",
              "Sadece async işlemler"
            ],
            "correctAnswer": 1,
            "explanation": "System.Linq namespace i LINQ (Language Integrated Query) için kullanılır ve koleksiyonlar üzerinde sorgulama ve dönüşüm işlemleri sağlar."
          },
          {
            "id": "mini-bcl-3",
            "question": "Generic koleksiyonların avantajı nedir?",
            "options": [
              "Sadece daha hızlıdır",
              "Type-safe ve performanslıdır",
              "Sadece type-safe dir",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Generic koleksiyonlar (List<T>, Dictionary<TKey, TValue>) hem type-safe hem de performanslıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/bcl-usage',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-runtime-hosting-models',
        'course-dotnet-roadmap',
        'Mini Test: Runtime Hosting Modelleri',
        'Deployment modelleri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-hosting-1",
            "question": "Self-contained deployment in avantajı nedir?",
            "options": [
              "Daha küçük dosya boyutu",
              ".NET runtime ın sistemde yüklü olması gerekmez",
              "Daha hızlı başlatma",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Self-contained deployment, .NET runtime ı uygulamayla birlikte paketler, bu yüzden sistemde .NET yüklü olması gerekmez."
          },
          {
            "id": "mini-hosting-2",
            "question": "ReadyToRun (R2R) compilation nedir?",
            "options": [
              "Sadece IL kodu",
              "Önceden derlenmiş native kod",
              "Sadece JIT compilation",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ReadyToRun (R2R) compilation, uygulamanın önceden native koda derlenmesini sağlar, bu da daha hızlı başlatma sağlar."
          },
          {
            "id": "mini-hosting-3",
            "question": "Single-file deployment in avantajı nedir?",
            "options": [
              "Sadece daha küçük dosya boyutu",
              "Tek bir dosya olarak dağıtım ve daha kolay deployment",
              "Sadece daha hızlı başlatma",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Single-file deployment, tüm uygulamayı tek bir dosya olarak paketler, bu da dağıtımı kolaylaştırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/runtime-hosting-models',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-memory-management-best-practices',
        'course-dotnet-roadmap',
        'Mini Test: Memory Management Best Practices',
        'Bellek yönetimi en iyi uygulamalarını test et.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-memory-1",
            "question": "Value type lar nerede saklanır?",
            "options": [
              "Heap te",
              "Stack te",
              "Her ikisinde de",
              "Hiçbirinde"
            ],
            "correctAnswer": 1,
            "explanation": "Value type lar (int, bool, struct) stack te saklanır ve değerleri doğrudan taşınır."
          },
          {
            "id": "mini-memory-2",
            "question": "String concatenation yerine ne kullanılmalıdır?",
            "options": [
              "Sadece string",
              "StringBuilder",
              "Sadece List<string>",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "String concatenation yerine StringBuilder kullanılmalıdır, özellikle döngülerde çünkü daha performanslıdır."
          },
          {
            "id": "mini-memory-3",
            "question": "Using statement ın amacı nedir?",
            "options": [
              "Sadece dosya okuma",
              "IDisposable nesnelerin otomatik dispose edilmesi",
              "Sadece bellek temizleme",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Using statement, IDisposable interface ini implement eden nesnelerin otomatik olarak dispose edilmesini sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/memory-management-best-practices',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-dotnet-runtime-platform-abstraction-layer',
        'course-dotnet-roadmap',
        'Mini Test: Platform Abstraction Layer',
        'PAL ve cross-platform geliştirme konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-pal-1",
            "question": "PAL ın amacı nedir?",
            "options": [
              "Sadece Windows desteği",
              "Platform bağımsızlığı sağlamak",
              "Sadece Linux desteği",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "PAL (Platform Abstraction Layer), .NET Core un farklı platformlarda çalışmasını sağlar."
          },
          {
            "id": "mini-pal-2",
            "question": "RuntimeInformation.IsOSPlatform ne için kullanılır?",
            "options": [
              "Sadece platform adını almak",
              "Platform detection yapmak",
              "Sadece mimariyi öğrenmek",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RuntimeInformation.IsOSPlatform, çalışılan platformu tespit etmek için kullanılır (Windows, Linux, macOS)."
          },
          {
            "id": "mini-pal-3",
            "question": "RID (Runtime Identifier) nedir?",
            "options": [
              "Sadece platform adı",
              "Platform ve mimariyi tanımlayan benzersiz tanımlayıcı",
              "Sadece mimari",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RID (Runtime Identifier), platform ve mimariyi tanımlayan benzersiz tanımlayıcıdır (örn: win-x64, linux-x64)."
          }
        ]'::jsonb,
        70,
        '/education/lessons/dotnet/runtime/platform-abstraction-layer',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-solid-interface-segregation',
        'course-dotnet-roadmap',
        'Mini Test: Interface Segregation Principle',
        'ISP prensibini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-isp-1",
            "question": "ISP nin amacı nedir?",
            "options": [
              "Daha fazla interface oluşturmak",
              "Client ların kullanmadığı metodlara bağımlı olmamasını sağlamak",
              "Daha az kod yazmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ISP, client ların sadece ihtiyaç duydukları metodlara bağımlı olmasını sağlar."
          },
          {
            "id": "mini-isp-2",
            "question": "Büyük interface ler nasıl bölünmelidir?",
            "options": [
              "Daha fazla metod ekleyerek",
              "Küçük, spesifik interface lere bölerek",
              "Daha az metod ekleyerek",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Büyük interface ler küçük, spesifik interface lere bölünmelidir."
          },
          {
            "id": "mini-isp-3",
            "question": "ISP nin faydası nedir?",
            "options": [
              "Daha hızlı kod",
              "Test edilebilirlik ve bakım kolaylığı",
              "Daha az bellek",
              "Hiçbir faydası yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "ISP, test edilebilirliği ve bakım kolaylığını artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/solid/interface-segregation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-solid-dependency-inversion',
        'course-dotnet-roadmap',
        'Mini Test: Dependency Inversion Principle',
        'DIP prensibini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-dip-1",
            "question": "DIP nin amacı nedir?",
            "options": [
              "Daha fazla interface oluşturmak",
              "Yüksek seviye modüllerin düşük seviye modüllere bağımlı olmamasını sağlamak",
              "Daha az kod yazmak",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, yüksek seviye modüllerin abstraction lara (interface lere) bağımlı olmasını sağlar."
          },
          {
            "id": "mini-dip-2",
            "question": "DIP nasıl uygulanır?",
            "options": [
              "Daha fazla class oluşturarak",
              "Dependency Injection kullanarak",
              "Daha az interface kullanarak",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, Dependency Injection kullanılarak uygulanır."
          },
          {
            "id": "mini-dip-3",
            "question": "DIP nin faydası nedir?",
            "options": [
              "Daha hızlı kod",
              "Test edilebilirlik ve esneklik",
              "Daha az bellek",
              "Hiçbir faydası yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "DIP, test edilebilirliği ve esnekliği artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/solid/dependency-inversion',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-service-lifetime',
        'course-dotnet-roadmap',
        'Mini Test: Service Lifetime Yönetimi',
        'Service lifetime türlerini pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-lifetime-1",
            "question": "Scoped lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Her HTTP request için bir instance gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Scoped lifetime, her HTTP request için bir instance oluşturur, bu da Entity Framework DbContext gibi servisler için idealdir."
          },
          {
            "id": "mini-lifetime-2",
            "question": "Singleton lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Uygulama yaşam döngüsü boyunca tek instance gerektiğinde",
              "Sadece scoped alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Singleton lifetime, uygulama yaşam döngüsü boyunca tek bir instance oluşturur."
          },
          {
            "id": "mini-lifetime-3",
            "question": "Transient lifetime ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Her çağrıda yeni instance gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Transient lifetime, her çağrıda yeni bir instance oluşturur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/service-lifetime',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-factory-pattern',
        'course-dotnet-roadmap',
        'Mini Test: Factory Pattern ile DI',
        'Factory pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-factory-1",
            "question": "Factory pattern in avantajı nedir?",
            "options": [
              "Daha hızlı servis oluşturma",
              "Servis oluşturma mantığını merkezileştirme",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Factory pattern, servis oluşturma mantığını merkezileştirerek kod tekrarını azaltır."
          },
          {
            "id": "mini-factory-2",
            "question": "Factory pattern ne zaman kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Runtime da servis seçimi gerektiğinde",
              "Sadece singleton alternatifi olarak",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Factory pattern, runtime da servis seçimine izin verir."
          },
          {
            "id": "mini-factory-3",
            "question": "Func<T> delegate i factory olarak kullanılabilir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Func<T> delegate i de factory olarak kullanılabilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/factory-pattern',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-options-pattern',
        'course-dotnet-roadmap',
        'Mini Test: Options Pattern',
        'Options pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-options-1",
            "question": "Options pattern in avantajı nedir?",
            "options": [
              "Daha hızlı configuration",
              "Strongly-typed configuration ve validation",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Options pattern, strongly-typed configuration sağlar ve validation desteği sunar."
          },
          {
            "id": "mini-options-2",
            "question": "IOptions<T> ve IOptionsSnapshot<T> arasındaki fark nedir?",
            "options": [
              "Hiçbir fark yoktur",
              "IOptionsSnapshot<T> değişiklikleri algılar, IOptions<T> algılamaz",
              "IOptions<T> daha hızlıdır",
              "IOptionsSnapshot<T> sadece singleton için kullanılır"
            ],
            "correctAnswer": 1,
            "explanation": "IOptionsSnapshot<T> değişiklikleri algılar, IOptions<T> algılamaz."
          },
          {
            "id": "mini-options-3",
            "question": "Options pattern validation desteği sağlar mı?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Options pattern validation desteği sağlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/options-pattern',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-extension-methods',
        'course-dotnet-roadmap',
        'Mini Test: Extension Methods ile DI',
        'Extension methods konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-extension-1",
            "question": "Extension methods ın avantajı nedir?",
            "options": [
              "Daha hızlı servis kaydı",
              "Modüler ve organize servis kayıtları",
              "Daha az kod",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Extension methods, servis kayıtlarını modülerleştirir ve kod organizasyonunu iyileştirir."
          },
          {
            "id": "mini-extension-2",
            "question": "Extension methods hangi tip üzerinde tanımlanır?",
            "options": [
              "Sadece class",
              "IServiceCollection gibi interface ler",
              "Sadece struct",
              "Hiçbir tip"
            ],
            "correctAnswer": 1,
            "explanation": "Extension methods, IServiceCollection gibi interface ler üzerinde tanımlanabilir."
          },
          {
            "id": "mini-extension-3",
            "question": "Her modül kendi extension metodunu sağlayabilir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Her modül kendi extension metodunu sağlayabilir, bu da modülerliği artırır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/extension-methods',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-architecture-di-service-locator-anti-patterns',
        'course-dotnet-roadmap',
        'Mini Test: Service Locator Anti-Pattern',
        'Service Locator anti-pattern konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-locator-1",
            "question": "Service Locator neden anti-pattern dir?",
            "options": [
              "Daha yavaştır",
              "Hidden dependencies oluşturur ve test edilebilirliği azaltır",
              "Daha fazla kod gerektirir",
              "Hiçbir nedeni yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Service Locator, hidden dependencies oluşturur ve test edilebilirliği azaltır."
          },
          {
            "id": "mini-locator-2",
            "question": "Service Locator yerine ne kullanılmalıdır?",
            "options": [
              "Daha fazla Service Locator",
              "Dependency Injection",
              "Daha az Service Locator",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Service Locator yerine Dependency Injection kullanılmalıdır."
          },
          {
            "id": "mini-locator-3",
            "question": "Constructor injection tercih edilmelidir mi?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Constructor injection, explicit dependencies sağladığı için tercih edilmelidir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/architecture/di/service-locator-anti-patterns',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-state-management-tempdata-session',
        'course-dotnet-roadmap',
        'Mini Test: TempData ve Session Yönetimi',
        'TempData ve Session konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-tempdata-1",
            "question": "TempData ne kadar süre veri saklar?",
            "options": [
              "Her zaman",
              "Bir sonraki request e kadar",
              "Kullanıcı oturumu boyunca",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "TempData bir sonraki request e kadar veri saklar."
          },
          {
            "id": "mini-tempdata-2",
            "question": "Session ne kadar süre veri saklar?",
            "options": [
              "Her zaman",
              "Bir sonraki request e kadar",
              "Kullanıcı oturumu boyunca",
              "Hiçbir zaman"
            ],
            "correctAnswer": 2,
            "explanation": "Session kullanıcı oturumu boyunca veri saklar."
          },
          {
            "id": "mini-tempdata-3",
            "question": "TempData.Keep() ne işe yarar?",
            "options": [
              "TempData yı siler",
              "TempData yı bir sonraki request e kadar korur",
              "Session ı temizler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "TempData.Keep() TempData yı bir sonraki request e kadar korur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/state-management/tempdata-session',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-views-viewbag-viewdata-model',
        'course-dotnet-roadmap',
        'Mini Test: ViewBag, ViewData ve Model',
        'ViewBag, ViewData ve Model konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-viewbag-1",
            "question": "Hangi yöntem tercih edilmelidir?",
            "options": [
              "ViewBag",
              "ViewData",
              "Model",
              "Hiçbiri"
            ],
            "correctAnswer": 2,
            "explanation": "Model strongly-typed veri aktarımı sağladığı için tercih edilmelidir."
          },
          {
            "id": "mini-viewbag-2",
            "question": "ViewBag nasıl çalışır?",
            "options": [
              "Dictionary kullanır",
              "Dynamic property ler kullanır",
              "Strongly-typed kullanır",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "ViewBag dynamic property ler kullanır."
          },
          {
            "id": "mini-viewbag-3",
            "question": "ViewData nasıl çalışır?",
            "options": [
              "Dictionary kullanır",
              "Dynamic property ler kullanır",
              "Strongly-typed kullanır",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 0,
            "explanation": "ViewData dictionary kullanır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/views/viewbag-viewdata-model',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-views-layout-viewstart',
        'course-dotnet-roadmap',
        'Mini Test: Layout ve _ViewStart',
        'Layout ve _ViewStart konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-layout-1",
            "question": "_ViewStart.cshtml ne işe yarar?",
            "options": [
              "Sadece layout belirler",
              "Tüm view lar için ortak ayarları içerir",
              "Sadece script ekler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "_ViewStart.cshtml tüm view lar için ortak ayarları içerir."
          },
          {
            "id": "mini-layout-2",
            "question": "Layout ne işe yarar?",
            "options": [
              "Sadece view oluşturur",
              "Sayfa yapısını standartlaştırır",
              "Sadece script ekler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Layout sayfa yapısını standartlaştırır."
          },
          {
            "id": "mini-layout-3",
            "question": "Sections ile ne yapılabilir?",
            "options": [
              "Sadece layout oluşturulur",
              "Layout a içerik eklenebilir",
              "Sadece view oluşturulur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Sections ile layout a içerik eklenebilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/views/layout-viewstart',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-filters-action-result-filters',
        'course-dotnet-roadmap',
        'Mini Test: Action ve Result Filters',
        'Action ve Result filters konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-filters-1",
            "question": "Action filter ne zaman çalışır?",
            "options": [
              "Sadece action dan önce",
              "Action dan önce ve sonra",
              "Sadece action dan sonra",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Action filter, OnActionExecuting ve OnActionExecuted metodlarıyla action dan önce ve sonra çalışır."
          },
          {
            "id": "mini-filters-2",
            "question": "Result filter ne zaman çalışır?",
            "options": [
              "Sadece result tan önce",
              "Result tan önce ve sonra",
              "Sadece result tan sonra",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Result filter, result tan önce ve sonra çalışır."
          },
          {
            "id": "mini-filters-3",
            "question": "Filters ne için kullanılır?",
            "options": [
              "Sadece logging",
              "Authorization, logging, caching gibi cross-cutting concerns",
              "Sadece caching",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Filters authorization, logging, caching gibi cross-cutting concerns için kullanılır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/filters/action-result-filters',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-models-model-binding-validation',
        'course-dotnet-roadmap',
        'Mini Test: Model Binding ve Validation',
        'Model binding ve validation konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-model-binding-1",
            "question": "Model binding ne yapar?",
            "options": [
              "Sadece validation yapar",
              "HTTP verilerini C# nesnelerine dönüştürür",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Model binding HTTP verilerini C# nesnelerine dönüştürür."
          },
          {
            "id": "mini-model-binding-2",
            "question": "Validation nasıl yapılır?",
            "options": [
              "Sadece client-side",
              "Data annotations ile",
              "Sadece server-side",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Validation data annotations ile yapılır."
          },
          {
            "id": "mini-model-binding-3",
            "question": "ModelState.IsValid ne işe yarar?",
            "options": [
              "Sadece model oluşturur",
              "Validation kontrolü yapar",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "ModelState.IsValid validation kontrolü yapar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/models/model-binding-validation',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-aspnet-mvc-routing-routing-strategies',
        'course-dotnet-roadmap',
        'Mini Test: Routing Stratejileri',
        'Routing stratejileri konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-routing-1",
            "question": "Attribute routing in avantajı nedir?",
            "options": [
              "Daha yavaştır",
              "Daha esnek ve açıktır",
              "Daha az özellik sunar",
              "Hiçbir avantajı yoktur"
            ],
            "correctAnswer": 1,
            "explanation": "Attribute routing daha esnek ve açık bir yaklaşımdır."
          },
          {
            "id": "mini-routing-2",
            "question": "Convention-based routing nerede tanımlanır?",
            "options": [
              "Sadece controller da",
              "Program.cs de",
              "Sadece view da",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Convention-based routing Program.cs de tanımlanır."
          },
          {
            "id": "mini-routing-3",
            "question": "Route constraints ne işe yarar?",
            "options": [
              "Sadece route oluşturur",
              "Parametre tiplerini kısıtlar",
              "Sadece view oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Route constraints parametre tiplerini kısıtlar."
          }
        ]'::jsonb,
        70,
        '/education/lessons/aspnet-mvc/routing/routing-strategies',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-web-api-rest-restful-design-principles',
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
    (
        'mini-test-middleware-pipeline-structure',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Pipeline Yapısı',
        'Middleware pipeline yapısını pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-pipeline-1",
            "question": "Middleware pipeline nasıl çalışır?",
            "options": [
              "Paralel olarak",
              "Sırayla",
              "Rastgele",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware pipeline request i sırayla işler."
          },
          {
            "id": "mini-pipeline-2",
            "question": "RequestDelegate ne işe yarar?",
            "options": [
              "Sadece request oluşturur",
              "Bir sonraki middleware i çağırır",
              "Sadece response oluşturur",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "RequestDelegate bir sonraki middleware i çağırır."
          },
          {
            "id": "mini-pipeline-3",
            "question": "Use() metodu ne işe yarar?",
            "options": [
              "Sadece middleware siler",
              "Middleware ekler",
              "Sadece middleware listeler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Use() metodu middleware ekler."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/pipeline-structure',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-execution-order',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Sıralaması ve Execution Order',
        'Middleware sıralamasını pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-order-1",
            "question": "Exception handling middleware nerede olmalıdır?",
            "options": [
              "En altta",
              "En üstte",
              "Ortada",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Exception handling middleware en üstte olmalıdır."
          },
          {
            "id": "mini-order-2",
            "question": "Authentication middleware nerede olmalıdır?",
            "options": [
              "Routing den önce",
              "Routing den sonra",
              "En altta",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Authentication middleware routing den sonra olmalıdır."
          },
          {
            "id": "mini-order-3",
            "question": "UseRouting() ve UseEndpoints() nerede olmalıdır?",
            "options": [
              "Rastgele",
              "Doğru sırada",
              "Sadece başta",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "UseRouting() ve UseEndpoints() doğru sırada olmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/execution-order',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-conditional-middleware',
        'course-dotnet-roadmap',
        'Mini Test: Conditional Middleware',
        'Conditional middleware konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-conditional-1",
            "question": "UseWhen() ne işe yarar?",
            "options": [
              "Sadece middleware ekler",
              "Koşullu middleware ekler",
              "Sadece path belirler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "UseWhen() koşullu middleware ekler."
          },
          {
            "id": "mini-conditional-2",
            "question": "Map() ne işe yarar?",
            "options": [
              "Sadece path belirler",
              "Path-based middleware ekler",
              "Sadece middleware siler",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Map() path-based middleware ekler."
          },
          {
            "id": "mini-conditional-3",
            "question": "Conditional middleware performansı nasıl etkiler?",
            "options": [
              "Yavaşlatır",
              "Artırabilir",
              "Etkilemez",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Conditional middleware performansı artırabilir çünkü sadece gerektiğinde çalışır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/conditional-middleware',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-di-middleware',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Dependency Injection',
        'Middleware DI konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-di-middleware-1",
            "question": "Middleware de DI nasıl kullanılır?",
            "options": [
              "Sadece Invoke metodunda",
              "Constructor da",
              "Sadece Use metodunda",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware constructor da DI kullanılabilir."
          },
          {
            "id": "mini-di-middleware-2",
            "question": "IMiddleware interface i ne sağlar?",
            "options": [
              "Sadece DI",
              "DI desteği",
              "Sadece middleware",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "IMiddleware interface i DI desteği sağlar."
          },
          {
            "id": "mini-di-middleware-3",
            "question": "Scoped servisler middleware de nasıl kullanılmalıdır?",
            "options": [
              "Her zaman",
              "Dikkatli kullanılmalıdır",
              "Hiçbir zaman",
              "Sadece bazen"
            ],
            "correctAnswer": 1,
            "explanation": "Scoped servisler middleware de dikkatli kullanılmalıdır çünkü middleware singleton olabilir."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/di-middleware',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-exception-handling',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Exception Handling',
        'Middleware exception handling konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-exception-middleware-1",
            "question": "Exception handling middleware nerede olmalıdır?",
            "options": [
              "En altta",
              "En üstte",
              "Ortada",
              "Hiçbir yerde"
            ],
            "correctAnswer": 1,
            "explanation": "Exception handling middleware en üstte olmalıdır."
          },
          {
            "id": "mini-exception-middleware-2",
            "question": "Error response ları nasıl olmalıdır?",
            "options": [
              "Her zaman farklı",
              "Standartlaştırılmış",
              "Sadece string",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Error response ları standartlaştırılmalıdır."
          },
          {
            "id": "mini-exception-middleware-3",
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
        '/education/lessons/middleware/exception-handling',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-performance-monitoring',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Performance Monitoring',
        'Middleware performance monitoring konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'advanced',
        '[
          {
            "id": "mini-performance-1",
            "question": "Performance monitoring ne işe yarar?",
            "options": [
              "Sadece loglama",
              "Middleware performansını izleme ve optimize etme",
              "Sadece metrik toplama",
              "Hiçbir şey"
            ],
            "correctAnswer": 1,
            "explanation": "Performance monitoring middleware performansını izleme ve optimize etme için kullanılır."
          },
          {
            "id": "mini-performance-2",
            "question": "Middleware execution time nasıl ölçülür?",
            "options": [
              "Sadece Stopwatch ile",
              "Stopwatch veya performance counter ile",
              "Sadece performance counter ile",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware execution time Stopwatch veya performance counter ile ölçülebilir."
          },
          {
            "id": "mini-performance-3",
            "question": "Performance monitoring production da kritik midir?",
            "options": [
              "Hayır",
              "Evet",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Performance monitoring production da kritiktir çünkü performans sorunlarını tespit etmeye yardımcı olur."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/performance-monitoring',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'mini-test-middleware-best-practices',
        'course-dotnet-roadmap',
        'Mini Test: Middleware Best Practices',
        'Middleware best practices konusunu pekiştir.',
        '.NET Core',
        'MINI_TEST',
        'intermediate',
        '[
          {
            "id": "mini-best-practices-1",
            "question": "Middleware ler nasıl olmalıdır?",
            "options": [
              "Karmaşık ve çok işlevli",
              "Tek sorumluluk prensibine uygun ve reusable",
              "Sadece basit",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Middleware ler tek sorumluluk prensibine uygun ve reusable olmalıdır."
          },
          {
            "id": "mini-best-practices-2",
            "question": "Reusable middleware nasıl oluşturulur?",
            "options": [
              "Sadece class olarak",
              "Extension method ile",
              "Sadece interface ile",
              "Hiçbir şekilde"
            ],
            "correctAnswer": 1,
            "explanation": "Reusable middleware extension method ile oluşturulur."
          },
          {
            "id": "mini-best-practices-3",
            "question": "Error handling middleware de nasıl olmalıdır?",
            "options": [
              "Yanlış yapılmalı",
              "Doğru yapılmalı",
              "Sadece bazen",
              "Hiçbir zaman"
            ],
            "correctAnswer": 1,
            "explanation": "Error handling middleware de doğru yapılmalıdır."
          }
        ]'::jsonb,
        70,
        '/education/lessons/middleware/best-practices',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
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
    'dotnet-counters ile Profiling - Mini Test',
    'dotnet-counters profiling hakkında temel bilgileri test eder.',
    '[
      {
        "question": "dotnet-counters nedir?",
        "type": "single",
        "options": [
          "Sadece bir tool",
          ".NET Core runtime metriklerini izlemek için bir tool",
          "Sadece bir kütüphane",
          "Sadece bir framework"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, .NET Core runtime metriklerini izlemek için kullanılan bir tooldur."
      },
      {
        "question": "dotnet-counters hangi metrikleri izler?",
        "type": "single",
        "options": [
          "Sadece CPU",
          "CPU, memory, GC, exceptions, thread pool vb.",
          "Sadece memory",
          "Sadece GC"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, CPU, memory, GC, exceptions, thread pool gibi çeşitli metrikleri izler."
      },
      {
        "question": "dotnet-counters nasıl kullanılır?",
        "type": "single",
        "options": [
          "Sadece GUI ile",
          "Command line ile: dotnet-counters monitor <process-id>",
          "Sadece API ile",
          "Sadece config dosyası ile"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, command line ile kullanılır: dotnet-counters monitor <process-id>."
      },
      {
        "question": "dotnet-counters hangi durumlarda kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Productionda performance sorunlarını tespit etmek için",
          "Sadece testte",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "dotnet-counters, productionda performance sorunlarını tespit etmek için kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/profiling/dotnet-counters',
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
    'MemoryCache vs Distributed Cache - Mini Test',
    'MemoryCache ve Distributed Cache hakkında temel bilgileri test eder.',
    '[
      {
        "question": "MemoryCache nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Tek bir sunucuda çalışan in-memory cache",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "MemoryCache, tek bir sunucuda çalışan in-memory cachedir."
      },
      {
        "question": "Distributed Cache nedir?",
        "type": "single",
        "options": [
          "Sadece bir sınıf",
          "Birden fazla sunucu arasında paylaşılan cache (Redis, SQL Server Cache vb.)",
          "Sadece bir interface",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Distributed Cache, birden fazla sunucu arasında paylaşılan cachedir (Redis, SQL Server Cache vb.)."
      },
      {
        "question": "MemoryCache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Tek sunucu veya sticky session senaryolarında",
          "Sadece developmentta",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "MemoryCache, tek sunucu veya sticky session senaryolarında kullanılır."
      },
      {
        "question": "Distributed Cache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Load balanced, multi-server senaryolarında",
          "Sadece tek sunucuda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Distributed Cache, load balanced, multi-server senaryolarında kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/memory-vs-distributed',
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
    'Performans İçin Sağlık Kontrolleri - Mini Test',
    'Performance health checks hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Health check nedir?",
        "type": "single",
        "options": [
          "Sadece bir endpoint",
          "Uygulama ve bağımlılıklarının sağlık durumunu kontrol eden mekanizma",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Health check, uygulama ve bağımlılıklarının sağlık durumunu kontrol eden bir mekanizmadır."
      },
      {
        "question": "Health check endpointi nasıl yapılandırılır?",
        "type": "single",
        "options": [
          "Sadece appsettings.jsonda",
          "AddHealthChecks() ve MapHealthChecks() ile",
          "Sadece Program.cste",
          "Sadece Startup.cste"
        ],
        "correctAnswer": 1,
        "explanation": "Health check endpointi, AddHealthChecks() ve MapHealthChecks() ile yapılandırılır."
      },
      {
        "question": "Health check neden önemlidir?",
        "type": "single",
        "options": [
          "Sadece görünüm için",
          "Load balancerlar ve orchestrator lar için servis durumunu bildirmek için",
          "Sadece performans için",
          "Hiçbir neden yok"
        ],
        "correctAnswer": 1,
        "explanation": "Health check, load balancerlar ve orchestrator lar için servis durumunu bildirmek için önemlidir."
      },
      {
        "question": "Health check türleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece basic",
          "Basic, database, external service, custom health checks",
          "Sadece database",
          "Sadece external service"
        ],
        "correctAnswer": 1,
        "explanation": "Health check türleri: basic, database, external service, custom health checks."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/health-checks/performance-endpoints',
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
    'Performance Profiling Araçları - Mini Test',
    'Performance profiling tools hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Performance profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Uygulama performansını analiz etme ve darboğazları tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Performance profiling, uygulama performansını analiz etme ve darboğazları tespit etme işlemidir."
      },
      {
        "question": "Hangi profiling araçları kullanılır?",
        "type": "single",
        "options": [
          "Sadece Visual Studio",
          "PerfView, dotTrace, Application Insights, Visual Studio Profiler vb.",
          "Sadece PerfView",
          "Sadece dotTrace"
        ],
        "correctAnswer": 1,
        "explanation": "PerfView, dotTrace, Application Insights, Visual Studio Profiler gibi araçlar profiling için kullanılır."
      },
      {
        "question": "CPU profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "CPU kullanımını analiz etme ve hot pathleri tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "CPU profiling, CPU kullanımını analiz etme ve hot pathleri tespit etme işlemidir."
      },
      {
        "question": "Memory profiling nedir?",
        "type": "single",
        "options": [
          "Sadece bir metrik",
          "Memory kullanımını analiz etme ve memory leakleri tespit etme",
          "Sadece bir tool",
          "Sadece bir method"
        ],
        "correctAnswer": 1,
        "explanation": "Memory profiling, memory kullanımını analiz etme ve memory leakleri tespit etme işlemidir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/profiling/performance-profiling-tools',
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
    'Memory Leak Detection ve Analysis - Mini Test',
    'Memory leak detection hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Memory leak nedir?",
        "type": "single",
        "options": [
          "Sadece bir hata",
          "Kullanılmayan nesnelerin memoryden temizlenmemesi",
          "Sadece bir warning",
          "Sadece bir exception"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, kullanılmayan nesnelerin memoryden temizlenmemesidir."
      },
      {
        "question": "Memory leak nasıl tespit edilir?",
        "type": "single",
        "options": [
          "Sadece manuel kontrol",
          "Profiling araçları (dotMemory, PerfView, Visual Studio Diagnostic Tools) ile",
          "Sadece log kontrolü",
          "Sadece exception kontrolü"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, profiling araçları (dotMemory, PerfView, Visual Studio Diagnostic Tools) ile tespit edilir."
      },
      {
        "question": "Memory leakin yaygın nedenleri nelerdir?",
        "type": "single",
        "options": [
          "Sadece GC",
          "Event handlerlar, static collections, unmanaged resources, circular references",
          "Sadece static variables",
          "Sadece event handlers"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leakin yaygın nedenleri: event handler lar, static collections, unmanaged resources, circular references."
      },
      {
        "question": "Memory leak nasıl önlenir?",
        "type": "single",
        "options": [
          "Sadece GC çağırarak",
          "Event handlerları unsubscribe et, IDisposable implement et, using statement kullan",
          "Sadece static kullanmayarak",
          "Sadece GC çağırarak"
        ],
        "correctAnswer": 1,
        "explanation": "Memory leak, event handlerları unsubscribe ederek, IDisposable implement ederek ve using statement kullanarak önlenir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/memory/memory-leak-detection-analysis',
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
    'Response Caching ve Output Caching - Mini Test',
    'Response caching ve output caching hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Response caching nedir?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "HTTP responseların cache  lenmesi",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Response caching, HTTP responseların cache  lenmesidir."
      },
      {
        "question": "[ResponseCache] attribute ne yapar?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "Response caching için cache headers ekler",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "[ResponseCache] attribute, response caching için cache headers ekler."
      },
      {
        "question": "Output caching nedir?",
        "type": "single",
        "options": [
          "Sadece bir attribute",
          "ASP.NET Coreda response output unun cache  lenmesi",
          "Sadece bir method",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Output caching, ASP.NET Coreda response output unun cache  lenmesidir."
      },
      {
        "question": "Response caching ve output caching arasındaki fark nedir?",
        "type": "single",
        "options": [
          "Hiçbir fark yok",
          "Response caching HTTP headers kullanır, output caching server-side cache kullanır",
          "Sadece isim farkı var",
          "Sadece performans farkı var"
        ],
        "correctAnswer": 1,
        "explanation": "Response caching HTTP headers kullanır, output caching server-side cache kullanır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/response-output-caching',
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
    'Redis Cache Entegrasyonu - Mini Test',
    'Redis cache integration hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Redis nedir?",
        "type": "single",
        "options": [
          "Sadece bir database",
          "In-memory data structure store - distributed cache için kullanılan",
          "Sadece bir dosya",
          "Sadece bir API"
        ],
        "correctAnswer": 1,
        "explanation": "Redis, in-memory data structure storedur ve distributed cache için kullanılır."
      },
      {
        "question": "Redis cache nasıl entegre edilir?",
        "type": "single",
        "options": [
          "Sadece connection string ile",
          "AddStackExchangeRedisCache() ve configuration ile",
          "Sadece appsettings.json ile",
          "Sadece Program.cs ile"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cache, AddStackExchangeRedisCache() ve configuration ile entegre edilir."
      },
      {
        "question": "Redis cachein avantajı nedir?",
        "type": "single",
        "options": [
          "Sadece hızlı",
          "Yüksek performans, distributed cache, persistence desteği",
          "Sadece kolay",
          "Sadece ucuz"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cachein avantajı, yüksek performans, distributed cache ve persistence desteğidir."
      },
      {
        "question": "Redis cache ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Sadece developmentta",
          "Load balanced, multi-server senaryolarında ve yüksek performans gerektiğinde",
          "Sadece tek sunucuda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Redis cache, load balanced, multi-server senaryolarında ve yüksek performans gerektiğinde kullanılır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/redis-cache-integration',
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
    'Cache Invalidation Stratejileri - Mini Test',
    'Cache invalidation strategies hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Cache invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Cachedeki eski verileri geçersiz kılma ve temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Cache invalidation, cachedeki eski verileri geçersiz kılma ve temizleme işlemidir."
      },
      {
        "question": "Cache invalidation stratejileri nelerdir?",
        "type": "single",
        "options": [
          "Sadece time-based",
          "Time-based, event-based, manual invalidation",
          "Sadece event-based",
          "Sadece manual"
        ],
        "correctAnswer": 1,
        "explanation": "Cache invalidation stratejileri: time-based, event-based, manual invalidation."
      },
      {
        "question": "Time-based invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Belirli bir süre sonra cachei otomatik temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Time-based invalidation, belirli bir süre sonra cachei otomatik temizlemedir."
      },
      {
        "question": "Event-based invalidation nedir?",
        "type": "single",
        "options": [
          "Sadece bir method",
          "Veri değiştiğinde cachei temizleme",
          "Sadece bir attribute",
          "Sadece bir sınıf"
        ],
        "correctAnswer": 1,
        "explanation": "Event-based invalidation, veri değiştiğinde cachei temizlemedir."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/caching/cache-invalidation-strategies',
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
    'Performance Best Practices - Mini Test',
    'Performance best practices hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Performance best practiceste en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece cache kullan",
          "Önce ölç, sonra optimize et",
          "Sadece async kullan",
          "Sadece profiling yap"
        ],
        "correctAnswer": 1,
        "explanation": "Performance best practiceste en önemli kural, önce ölç, sonra optimize et  tir."
      },
      {
        "question": "Performance optimizationda ne yapılmamalıdır?",
        "type": "single",
        "options": [
          "Sadece profiling yapma",
          "Premature optimization - ölçmeden optimize etme",
          "Sadece cache kullanma",
          "Sadece async kullanma"
        ],
        "correctAnswer": 1,
        "explanation": "Performance optimizationda premature optimization (ölçmeden optimize etme) yapılmamalıdır."
      },
      {
        "question": "Database query optimization nasıl yapılır?",
        "type": "single",
        "options": [
          "Sadece index ekle",
          "Index ekle, N+1 problemi çöz, pagination kullan, select only needed columns",
          "Sadece pagination kullan",
          "Sadece N+1 çöz"
        ],
        "correctAnswer": 1,
        "explanation": "Database query optimization, index ekleyerek, N+1 problemini çözerek, pagination kullanarak ve sadece gerekli kolonları seçerek yapılır."
      },
      {
        "question": "Async/await performanceı nasıl etkiler?",
        "type": "single",
        "options": [
          "Sadece yavaşlatır",
          "I/O bound işlemlerde thread blockingi önleyerek performansı artırır",
          "Sadece hızlandırır",
          "Hiçbir etkisi yok"
        ],
        "correctAnswer": 1,
        "explanation": "Async/await, I/O bound işlemlerde thread blockingi önleyerek performansı artırır."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/best-practices/performance-best-practices',
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
    'Async/Await Performance Optimization - Mini Test',
    'Async/await performance optimization hakkında temel bilgileri test eder.',
    '[
      {
        "question": "Async/await performance optimizationda en önemli kural nedir?",
        "type": "single",
        "options": [
          "Sadece async kullan",
          "I/O bound işlemlerde async kullan, CPU bound işlemlerde Task.Run() kullan",
          "Sadece Task.Run() kullan",
          "Sadece sync kullan"
        ],
        "correctAnswer": 1,
        "explanation": "Async/await performance optimizationda en önemli kural, I/O bound işlemlerde async kullanmak, CPU bound işlemlerde Task.Run() kullanmaktır."
      },
      {
        "question": "ConfigureAwait(false) ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Library kodunda, UI contextine ihtiyaç olmadığında",
          "Sadece UI kodunda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "ConfigureAwait(false), library kodunda, UI contextine ihtiyaç olmadığında kullanılır."
      },
      {
        "question": "Async void ne zaman kullanılır?",
        "type": "single",
        "options": [
          "Her zaman",
          "Sadece event handlerlarda",
          "Sadece methodlarda",
          "Hiçbir zaman"
        ],
        "correctAnswer": 1,
        "explanation": "Async void, sadece event handlerlarda kullanılmalıdır."
      },
      {
        "question": "Task.Result veya .Wait() kullanımı neden tehlikelidir?",
        "type": "single",
        "options": [
          "Sadece yavaş",
          "Deadlock riski oluşturur",
          "Sadece memory leak",
          "Sadece exception"
        ],
        "correctAnswer": 1,
        "explanation": "Task.Result veya .Wait() kullanımı, deadlock riski oluşturur."
      }
    ]'::jsonb,
    70,
    '/education/lessons/performance/async/async-await-performance-optimization',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Module 12: Asenkron Programlama (Async/Await) - Mini Tests
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

