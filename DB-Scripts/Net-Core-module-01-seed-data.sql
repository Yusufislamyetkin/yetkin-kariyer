-- Module 01: C# Temelleri - Mini Tests
BEGIN;

-- Courses tablosuna modul icerigini ekle
WITH new_module AS (
  SELECT
    $${
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
              "label": "For Döngüsü nedir?",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Sayaç: {i}\\\");\\n}",
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
                      "body": "Kontrol akışını diyagram üzerinde canlandırmak, karmaşık iterasyonları zihinde çözümlemenin en hızlı yoludur. ",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Toplam: {toplam}\\\");",
                      "explanation": "1 ile 10 arasındaki sayıların toplamını hesaplamak için birikimli toplam yaklaşımı kullanılır."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name =",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ali ","Ayşe ","Mehmet \" };\\nforeach (string isim in isimler)\\n{\\n    Console.WriteLine(isim);\\n}",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Sayaç: {sayac}\\\");\\n    sayac++;\\n}",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Menü: 1-Çıkış ");\\n    secim = int.Parse(Console.ReadLine());\\n} while (secim != 1);",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ahmet ";\\nbool aktif = true;\\ndouble maas = 5000.50;\\nvar sehir ="İstanbul "; // Tip çıkarımı",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="123 ";\\nint sonuc = int.Parse(metin);\\nbool basarili = int.TryParse(metin, out int deger);",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Merhaba {isim}!\");\\n}\\n\\n// Değer döndüren metot\\nstatic int Topla(int a, int b)\\n{\\n    return a + b;\\n}\\n\\n// Metot çağırma\\nSelamla( "Ahmet");\\nint sonuc = Topla(5, 3); // 8",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Merhaba "); // Varsayılan parametre kullanılır\\nYazdir("Merhaba ", true); // Parametre belirtilir",
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
              "label": "Sınıflar ve nesneler",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ad: {ad}, Yaş: {yas}\");\\n    }\\n}\\n\\n// Kullanım\\nKisi kisi1 = new Kisi( "Ahmet", 25);\\nkisi1.BilgileriGoster();",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name =",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name =",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ahmet ");\\nisimler.Add("Ayşe ");\\nisimler.Remove("Ahmet ");\\nint sayi = isimler.Count;\\n\\n// Dictionary kullanımı (Key-Value)\\nDictionary<string, int> yaslar =new Dictionary<string, int>();\\nyaslar["Ahmet "] = 25;\\nyaslar["Ayşe "] = 30;\\nint ahmetYasi = yaslar["Ahmet "];\\n\\n// HashSet (benzersiz elemanlar)\\nHashSet<int> benzersizSayilar =new HashSet<int> { 1, 2, 3, 2, 1 }; // {1, 2, 3}",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Sonuç: {sonuc}\");\\n}\\ncatch (FormatException ex)\\n{\\n    Console.WriteLine($ \"Geçersiz format: {ex.Message} ");\\n}\\ncatch (DivideByZeroException ex)\\n{\\n    Console.WriteLine($ \"Sıfıra bölme hatası: {ex.Message} ");\\n}\\ncatch (Exception ex)\\n{\\n    Console.WriteLine($ \"Beklenmeyen hata: {ex.Message} ");\\n}\\nfinally\\n{\\n    Console.WriteLine("İşlem tamamlandı. ");\\n}",
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
                        "ArgumentNullException:\\null parametre hatası",
                        "ArgumentException: Geçersiz parametre hatası",
                        "IndexOutOfRangeException: Dizi sınırları dışı erişim",
                        "NullReferenceException:\\null referans hatası",
                        "FormatException: Format hatası (Parse işlemlerinde)",
                        "DivideByZeroException: Sıfıra bölme hatası"
                      ]
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Yaş negatif olamaz \\\", nameof(yas));\\n}\\n\\n// Exception mesajı ve stack trace\\ncatch (Exception ex)\\n{\\n    Console.WriteLine($\\\"Hata: {ex.Message}\\\");\\n    Console.WriteLine($\\\"Detay: {ex.StackTrace}\\\");\\n}",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name =",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ahmet ","Ayşe ","Mehmet ","Ali ","Zeynep \" };\\n\\n// Where: Filtreleme\\nvar aIleBaslayanlar = isimler.Where(i => i.StartsWith( "A")).ToList();\\n\\n// Select: Dönüştürme\\nvar buyukHarfler = isimler.Select(i => i.ToUpper()).ToList();\\n\\n// OrderBy: Sıralama\\nvar sirali = isimler.OrderBy(i => i).ToList();\\n\\n// Where + Select kombinasyonu\\nvar uzunIsimler = isimler\\n    .Where(i => i.Length > 4)\\n    .Select(i => i.ToUpper())\\n    .ToList();",
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
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Uzunluk {grup.Key}: {string.Join(\",  ", grup)}");\\n}\\n\\n// Aggregation: Toplama, ortalama vb.\\nList<int> sayilar =new List<int> { 1, 2, 3, 4, 5 };\\nint toplam = sayilar.Sum();\\nint enBuyuk = sayilar.Max();\\ndouble ortalama = sayilar.Average();\\nint sayi = sayilar.Count();",
                      "explanation": "GroupBy ile verileri gruplayabilir, Sum, Max, Average, Count gibi metodlarla toplama işlemleri yapabilirsin."
                    },
                    {
                      "type": "code",
                      "language": "csharp",
                      "code": "// Join: İki koleksiyonu birleştirme\\nvar kisiler =\new List<Person> {\new Person { Id = 1,\\name ="Ahmet \" } };\\nvar adresler =new List<Address> {new Address { PersonId = 1, City =  "İstanbul \" } };\\n\\nvar sonuc = from kisi in kisiler\\n            join adres in adresler on kisi.Id equals adres.PersonId\\n            selectnew { kisi.Name, adres.City };",
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
                  "question": "LINQ sorgularıne zaman çalıştırılır?",
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
                  "question": "Where metodu\ne işe yarar?",
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
VALUES (
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
            "question": "For döngüsünde koşul ifadesi false olduğundane olur?",
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
            "question": "Foreach döngüsü içinde koleksiyonu değiştirmek\\neden hata verir?",
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
            "question": "While döngüsünde sonsuz döngü oluşmaması için\ne yapılmalıdır?",
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
            "question": "var anahtar kelimesine zaman kullanılmalıdır?",
            "options": [
              "Her zaman, kod daha kısa olur",
              "Tip açıkça belli olduğunda ve okunabilirliği artırdığında",
              "Sadece string değişkenler için",
              "Hiçbir zaman kullanılmamalıdır"
            ],
            "correctAnswer": 1,
            "explanation": "var kullanımı kod okunabilirliğini artırabilir ancak tip belirsizliği yaratmamalıdır. Tip açıkça belli olduğunda (örn:new List<int>()) kullanılabilir."
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
            "question": "Return ifadesine zaman kullanılır?",
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
            "question": "Metot overloadingnedir?",
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
            "question": "Void metotlar\ne döndürür?",
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
        'Mini Test: Sınıflar venesneler',
        'Nesne yönelimli programlama temellerini test et.',
        '.NET Core',
        'MINI_TEST',
        'beginner',
        '[
          {
            "id": "mini-classes-1",
            "question": "Constructor metotne zaman çalışır?",
            "options": [
              "Sınıf tanımlandığında",
              "Nesne oluşturulduğunda (new ile)",
              "Metot çağrıldığında",
              "Program başladığında"
            ],
            "correctAnswer": 1,
            "explanation": "Constructor metotlarnesne oluşturulurken (new anahtar kelimesi ile) otomatik olarak çalışır venesneyi başlatır."
          },
          {
            "id": "mini-classes-2",
            "question": "Encapsulation (kapsülleme)nedir?",
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
            "question": "Property (özellik)\ne işe yarar?",
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
            "question": "Dictionary koleksiyonu\ne için kullanılır?",
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
            "question": "Dictionary de var olmayan bir key e erişmeye çalışırsakne olur?",
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
            "question": "Finally bloğune zaman çalışır?",
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
            "question": "Catch bloklarını\\nasıl sıralamalıyız?",
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
            "question": "TryParse metodu\ne döndürür?",
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
            "question": "Console.ReadLine()\ne döndürür?",
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
            "question": "LINQ un iki yazım şeklinedir?",
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
            "question": "LINQ sorgularıne zaman çalıştırılır?",
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
            "question": "Where metodu\ne işe yarar?",
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
            "question": "Select metodu\ne işe yarar?",
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
    );

COMMIT;
