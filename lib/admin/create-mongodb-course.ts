interface CourseModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTopics: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

interface CourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

/**
 * Create complete MongoDB course structure with predefined content
 */
export async function createMongoDBCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting MongoDB course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "MongoDB, modern uygulamalar için tasarlanmış popüler bir NoSQL doküman veritabanıdır. Bu kapsamlı kurs ile MongoDB'nin temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Doküman modeli, sorgulama, indeksleme, aggregation pipeline, replication, sharding ve performans optimizasyonu konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "MongoDB'nin temel kavramlarını ve NoSQL yaklaşımını anlamak",
      "Doküman modeli ve BSON formatını öğrenmek",
      "CRUD operasyonlarını etkili kullanmak",
      "Gelişmiş sorgulama ve filtreleme yapmak",
      "Aggregation pipeline ile karmaşık veri analizi yapmak",
      "İndeksleme ve performans optimizasyonu yapmak",
      "Replication ve sharding ile ölçeklenebilirlik sağlamak",
      "Güvenlik, backup ve recovery stratejilerini uygulamak",
    ],
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "Veritabanı kavramlarına aşinalık",
      "Temel programlama bilgisi (opsiyonel)",
      "JSON formatına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: MongoDB Tanımı ve Temelleri",
        summary:
          "MongoDB'nin ne olduğu, NoSQL kavramı, tarihçesi, avantajları, ilişkisel veritabanlarından farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "MongoDB'nin ne olduğunu ve neden kullanıldığını anlamak",
          "NoSQL kavramını öğrenmek",
          "MongoDB'nin ilişkisel veritabanlarından farklarını öğrenmek",
          "MongoDB'nin avantajlarını ve kullanım alanlarını keşfetmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: MongoDB Nedir?",
            href: "/education/lessons/mongodb/module-01/lesson-01",
            description: "MongoDB'nin temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: NoSQL Nedir?",
            href: "/education/lessons/mongodb/module-01/lesson-02",
            description: "NoSQL veritabanı kavramı",
          },
          {
            label: "Ders 3: MongoDB vs İlişkisel Veritabanları",
            href: "/education/lessons/mongodb/module-01/lesson-03",
            description: "MongoDB ve SQL veritabanları karşılaştırması",
          },
          {
            label: "Ders 4: MongoDB'nin Tarihçesi",
            href: "/education/lessons/mongodb/module-01/lesson-04",
            description: "MongoDB'nin ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 5: MongoDB'nin Avantajları",
            href: "/education/lessons/mongodb/module-01/lesson-05",
            description: "Esneklik, ölçeklenebilirlik, performans",
          },
          {
            label: "Ders 6: MongoDB Kullanım Alanları",
            href: "/education/lessons/mongodb/module-01/lesson-06",
            description: "Web uygulamaları, big data, IoT",
          },
          {
            label: "Ders 7: MongoDB Ekosistemi",
            href: "/education/lessons/mongodb/module-01/lesson-07",
            description: "MongoDB topluluğu ve araçlar",
          },
          {
            label: "Ders 8: Doküman Modeli",
            href: "/education/lessons/mongodb/module-01/lesson-08",
            description: "Doküman tabanlı veri modeli",
          },
          {
            label: "Ders 9: BSON Formatı",
            href: "/education/lessons/mongodb/module-01/lesson-09",
            description: "Binary JSON formatı",
          },
          {
            label: "Ders 10: MongoDB Lisanslama",
            href: "/education/lessons/mongodb/module-01/lesson-10",
            description: "Lisans modelleri",
          },
          {
            label: "Ders 11: MongoDB Atlas",
            href: "/education/lessons/mongodb/module-01/lesson-11",
            description: "Bulut tabanlı MongoDB servisi",
          },
          {
            label: "Ders 12: MongoDB Performans",
            href: "/education/lessons/mongodb/module-01/lesson-12",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 13: MongoDB Güvenlik",
            href: "/education/lessons/mongodb/module-01/lesson-13",
            description: "Güvenlik özellikleri",
          },
          {
            label: "Ders 14: MongoDB Topluluk",
            href: "/education/lessons/mongodb/module-01/lesson-14",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/mongodb/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: MongoDB Kurulumu ve Yapılandırma",
        summary:
          "MongoDB kurulumu, MongoDB Shell, Compass GUI, bağlantı yapılandırması, temel komutlar ve geliştirme ortamı.",
        durationMinutes: 450,
        objectives: [
          "MongoDB kurulumunu öğrenmek",
          "MongoDB Shell kullanmayı öğrenmek",
          "MongoDB Compass kullanmayı öğrenmek",
          "Bağlantı yapılandırmasını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: MongoDB Kurulumu",
            href: "/education/lessons/mongodb/module-02/lesson-01",
            description: "MongoDB indirme ve kurulum",
          },
          {
            label: "Ders 2: MongoDB Shell",
            href: "/education/lessons/mongodb/module-02/lesson-02",
            description: "mongo shell kullanımı",
          },
          {
            label: "Ders 3: MongoDB Compass",
            href: "/education/lessons/mongodb/module-02/lesson-03",
            description: "GUI aracı",
          },
          {
            label: "Ders 4: MongoDB Bağlantısı",
            href: "/education/lessons/mongodb/module-02/lesson-04",
            description: "Connection string",
          },
          {
            label: "Ders 5: MongoDB Yapılandırması",
            href: "/education/lessons/mongodb/module-02/lesson-05",
            description: "Yapılandırma dosyası",
          },
          {
            label: "Ders 6: Temel Komutlar",
            href: "/education/lessons/mongodb/module-02/lesson-06",
            description: "show dbs, use, help",
          },
          {
            label: "Ders 7: MongoDB Servis Yönetimi",
            href: "/education/lessons/mongodb/module-02/lesson-07",
            description: "Servis başlatma/durdurma",
          },
          {
            label: "Ders 8: MongoDB Atlas Kurulumu",
            href: "/education/lessons/mongodb/module-02/lesson-08",
            description: "Bulut kurulumu",
          },
          {
            label: "Ders 9: MongoDB Driver'ları",
            href: "/education/lessons/mongodb/module-02/lesson-09",
            description: "Programlama dili driver'ları",
          },
          {
            label: "Ders 10: MongoDB Logging",
            href: "/education/lessons/mongodb/module-02/lesson-10",
            description: "Log yönetimi",
          },
          {
            label: "Ders 11: MongoDB Monitoring",
            href: "/education/lessons/mongodb/module-02/lesson-11",
            description: "İzleme araçları",
          },
          {
            label: "Ders 12: MongoDB Best Practices",
            href: "/education/lessons/mongodb/module-02/lesson-12",
            description: "Kurulum en iyi uygulamaları",
          },
          {
            label: "Ders 13: Troubleshooting",
            href: "/education/lessons/mongodb/module-02/lesson-13",
            description: "Sorun giderme",
          },
          {
            label: "Ders 14: MongoDB Versiyonları",
            href: "/education/lessons/mongodb/module-02/lesson-14",
            description: "Versiyon yönetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Doküman Modeli ve Veri Yapıları",
        summary:
          "MongoDB doküman modeli, collections, documents, BSON, veri tipleri, nested documents, arrays ve veri yapıları.",
        durationMinutes: 450,
        objectives: [
          "Doküman modelini anlamak",
          "Collections ve documents kavramını öğrenmek",
          "BSON veri tiplerini öğrenmek",
          "Nested documents ve arrays kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Doküman Modeli",
            href: "/education/lessons/mongodb/module-03/lesson-01",
            description: "Doküman tabanlı model",
          },
          {
            label: "Ders 2: Collections",
            href: "/education/lessons/mongodb/module-03/lesson-02",
            description: "Koleksiyon kavramı",
          },
          {
            label: "Ders 3: Documents",
            href: "/education/lessons/mongodb/module-03/lesson-03",
            description: "Doküman yapısı",
          },
          {
            label: "Ders 4: BSON Veri Tipleri",
            href: "/education/lessons/mongodb/module-03/lesson-04",
            description: "BSON tip sistemi",
          },
          {
            label: "Ders 5: Nested Documents",
            href: "/education/lessons/mongodb/module-03/lesson-05",
            description: "İç içe dokümanlar",
          },
          {
            label: "Ders 6: Arrays",
            href: "/education/lessons/mongodb/module-03/lesson-06",
            description: "Dizi yapıları",
          },
          {
            label: "Ders 7: ObjectId",
            href: "/education/lessons/mongodb/module-03/lesson-07",
            description: "Doküman kimliği",
          },
          {
            label: "Ders 8: Date ve Timestamp",
            href: "/education/lessons/mongodb/module-03/lesson-08",
            description: "Tarih ve zaman",
          },
          {
            label: "Ders 9: Binary Data",
            href: "/education/lessons/mongodb/module-03/lesson-09",
            description: "İkili veri",
          },
          {
            label: "Ders 10: Decimal128",
            href: "/education/lessons/mongodb/module-03/lesson-10",
            description: "Ondalık sayılar",
          },
          {
            label: "Ders 11: Veri Yapısı Tasarımı",
            href: "/education/lessons/mongodb/module-03/lesson-11",
            description: "Doküman tasarımı",
          },
          {
            label: "Ders 12: Schema Design",
            href: "/education/lessons/mongodb/module-03/lesson-12",
            description: "Şema tasarımı",
          },
          {
            label: "Ders 13: Veri Tipleri Best Practices",
            href: "/education/lessons/mongodb/module-03/lesson-13",
            description: "Veri tipi seçimi",
          },
          {
            label: "Ders 14: Common Data Patterns",
            href: "/education/lessons/mongodb/module-03/lesson-14",
            description: "Yaygın veri desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: CRUD Operasyonları",
        summary:
          "MongoDB CRUD operasyonları, insert, find, update, delete, query operators, projection ve cursor operations.",
        durationMinutes: 450,
        objectives: [
          "CRUD operasyonlarını anlamak",
          "Insert operasyonlarını öğrenmek",
          "Find ve query operasyonlarını öğrenmek",
          "Update ve delete operasyonlarını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: CRUD Operasyonları",
            href: "/education/lessons/mongodb/module-04/lesson-01",
            description: "CRUD kavramı",
          },
          {
            label: "Ders 2: Insert One",
            href: "/education/lessons/mongodb/module-04/lesson-02",
            description: "Tek doküman ekleme",
          },
          {
            label: "Ders 3: Insert Many",
            href: "/education/lessons/mongodb/module-04/lesson-03",
            description: "Çoklu doküman ekleme",
          },
          {
            label: "Ders 4: Find",
            href: "/education/lessons/mongodb/module-04/lesson-04",
            description: "Doküman bulma",
          },
          {
            label: "Ders 5: Query Operators",
            href: "/education/lessons/mongodb/module-04/lesson-05",
            description: "Sorgu operatörleri",
          },
          {
            label: "Ders 6: Comparison Operators",
            href: "/education/lessons/mongodb/module-04/lesson-06",
            description: "Karşılaştırma operatörleri",
          },
          {
            label: "Ders 7: Logical Operators",
            href: "/education/lessons/mongodb/module-04/lesson-07",
            description: "Mantıksal operatörler",
          },
          {
            label: "Ders 8: Update One",
            href: "/education/lessons/mongodb/module-04/lesson-08",
            description: "Tek doküman güncelleme",
          },
          {
            label: "Ders 9: Update Many",
            href: "/education/lessons/mongodb/module-04/lesson-09",
            description: "Çoklu doküman güncelleme",
          },
          {
            label: "Ders 10: Update Operators",
            href: "/education/lessons/mongodb/module-04/lesson-10",
            description: "Güncelleme operatörleri",
          },
          {
            label: "Ders 11: Delete One",
            href: "/education/lessons/mongodb/module-04/lesson-11",
            description: "Tek doküman silme",
          },
          {
            label: "Ders 12: Delete Many",
            href: "/education/lessons/mongodb/module-04/lesson-12",
            description: "Çoklu doküman silme",
          },
          {
            label: "Ders 13: Projection",
            href: "/education/lessons/mongodb/module-04/lesson-13",
            description: "Alan seçimi",
          },
          {
            label: "Ders 14: Cursor Operations",
            href: "/education/lessons/mongodb/module-04/lesson-14",
            description: "İmleç işlemleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Gelişmiş Sorgulama",
        summary:
          "Gelişmiş sorgulama teknikleri, array queries, text search, geospatial queries, regex, sorting, limiting ve pagination.",
        durationMinutes: 450,
        objectives: [
          "Gelişmiş sorgulama tekniklerini öğrenmek",
          "Array queries yapmayı öğrenmek",
          "Text search kullanmayı öğrenmek",
          "Geospatial queries yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Gelişmiş Sorgulama",
            href: "/education/lessons/mongodb/module-05/lesson-01",
            description: "İleri seviye sorgular",
          },
          {
            label: "Ders 2: Array Queries",
            href: "/education/lessons/mongodb/module-05/lesson-02",
            description: "Dizi sorguları",
          },
          {
            label: "Ders 3: Array Operators",
            href: "/education/lessons/mongodb/module-05/lesson-03",
            description: "Dizi operatörleri",
          },
          {
            label: "Ders 4: Text Search",
            href: "/education/lessons/mongodb/module-05/lesson-04",
            description: "Metin arama",
          },
          {
            label: "Ders 5: Text Index",
            href: "/education/lessons/mongodb/module-05/lesson-05",
            description: "Metin indeksi",
          },
          {
            label: "Ders 6: Geospatial Queries",
            href: "/education/lessons/mongodb/module-05/lesson-06",
            description: "Coğrafi sorgular",
          },
          {
            label: "Ders 7: Geospatial Indexes",
            href: "/education/lessons/mongodb/module-05/lesson-07",
            description: "Coğrafi indeksler",
          },
          {
            label: "Ders 8: Regex Queries",
            href: "/education/lessons/mongodb/module-05/lesson-08",
            description: "Düzenli ifade sorguları",
          },
          {
            label: "Ders 9: Sorting",
            href: "/education/lessons/mongodb/module-05/lesson-09",
            description: "Sıralama",
          },
          {
            label: "Ders 10: Limiting",
            href: "/education/lessons/mongodb/module-05/lesson-10",
            description: "Sınırlama",
          },
          {
            label: "Ders 11: Pagination",
            href: "/education/lessons/mongodb/module-05/lesson-11",
            description: "Sayfalama",
          },
          {
            label: "Ders 12: Count ve Distinct",
            href: "/education/lessons/mongodb/module-05/lesson-12",
            description: "Sayma ve benzersiz değerler",
          },
          {
            label: "Ders 13: Query Performance",
            href: "/education/lessons/mongodb/module-05/lesson-13",
            description: "Sorgu performansı",
          },
          {
            label: "Ders 14: Query Best Practices",
            href: "/education/lessons/mongodb/module-05/lesson-14",
            description: "Sorgulama en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: İndeksleme",
        summary:
          "MongoDB indexing, index types, single field indexes, compound indexes, multikey indexes, text indexes, geospatial indexes ve index management.",
        durationMinutes: 450,
        objectives: [
          "İndeksleme kavramını anlamak",
          "Index types öğrenmek",
          "Index oluşturmayı öğrenmek",
          "Index yönetimini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: İndeksleme Nedir?",
            href: "/education/lessons/mongodb/module-06/lesson-01",
            description: "İndeks kavramı",
          },
          {
            label: "Ders 2: Index Types",
            href: "/education/lessons/mongodb/module-06/lesson-02",
            description: "İndeks türleri",
          },
          {
            label: "Ders 3: Single Field Indexes",
            href: "/education/lessons/mongodb/module-06/lesson-03",
            description: "Tek alan indeksleri",
          },
          {
            label: "Ders 4: Compound Indexes",
            href: "/education/lessons/mongodb/module-06/lesson-04",
            description: "Bileşik indeksler",
          },
          {
            label: "Ders 5: Multikey Indexes",
            href: "/education/lessons/mongodb/module-06/lesson-05",
            description: "Çoklu anahtar indeksleri",
          },
          {
            label: "Ders 6: Text Indexes",
            href: "/education/lessons/mongodb/module-06/lesson-06",
            description: "Metin indeksleri",
          },
          {
            label: "Ders 7: Geospatial Indexes",
            href: "/education/lessons/mongodb/module-06/lesson-07",
            description: "Coğrafi indeksler",
          },
          {
            label: "Ders 8: Index Creation",
            href: "/education/lessons/mongodb/module-06/lesson-08",
            description: "İndeks oluşturma",
          },
          {
            label: "Ders 9: Index Management",
            href: "/education/lessons/mongodb/module-06/lesson-09",
            description: "İndeks yönetimi",
          },
          {
            label: "Ders 10: Index Performance",
            href: "/education/lessons/mongodb/module-06/lesson-10",
            description: "İndeks performansı",
          },
          {
            label: "Ders 11: Index Strategy",
            href: "/education/lessons/mongodb/module-06/lesson-11",
            description: "İndeks stratejisi",
          },
          {
            label: "Ders 12: Index Analysis",
            href: "/education/lessons/mongodb/module-06/lesson-12",
            description: "İndeks analizi",
          },
          {
            label: "Ders 13: Index Best Practices",
            href: "/education/lessons/mongodb/module-06/lesson-13",
            description: "İndeksleme en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Index Patterns",
            href: "/education/lessons/mongodb/module-06/lesson-14",
            description: "Yaygın indeks desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Aggregation Pipeline",
        summary:
          "MongoDB aggregation pipeline, pipeline stages, $match, $group, $project, $sort, $limit, $unwind ve aggregation operators.",
        durationMinutes: 450,
        objectives: [
          "Aggregation pipeline kavramını anlamak",
          "Pipeline stages öğrenmek",
          "Aggregation operators kullanmayı öğrenmek",
          "Karmaşık veri analizi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Aggregation Pipeline",
            href: "/education/lessons/mongodb/module-07/lesson-01",
            description: "Pipeline kavramı",
          },
          {
            label: "Ders 2: Pipeline Stages",
            href: "/education/lessons/mongodb/module-07/lesson-02",
            description: "Pipeline aşamaları",
          },
          {
            label: "Ders 3: $match Stage",
            href: "/education/lessons/mongodb/module-07/lesson-03",
            description: "Filtreleme aşaması",
          },
          {
            label: "Ders 4: $group Stage",
            href: "/education/lessons/mongodb/module-07/lesson-04",
            description: "Gruplama aşaması",
          },
          {
            label: "Ders 5: $project Stage",
            href: "/education/lessons/mongodb/module-07/lesson-05",
            description: "Projeksiyon aşaması",
          },
          {
            label: "Ders 6: $sort Stage",
            href: "/education/lessons/mongodb/module-07/lesson-06",
            description: "Sıralama aşaması",
          },
          {
            label: "Ders 7: $limit ve $skip",
            href: "/education/lessons/mongodb/module-07/lesson-07",
            description: "Sınırlama aşamaları",
          },
          {
            label: "Ders 8: $unwind",
            href: "/education/lessons/mongodb/module-07/lesson-08",
            description: "Dizi açma",
          },
          {
            label: "Ders 9: $lookup",
            href: "/education/lessons/mongodb/module-07/lesson-09",
            description: "Birleştirme",
          },
          {
            label: "Ders 10: Aggregation Operators",
            href: "/education/lessons/mongodb/module-07/lesson-10",
            description: "Toplama operatörleri",
          },
          {
            label: "Ders 11: $addFields",
            href: "/education/lessons/mongodb/module-07/lesson-11",
            description: "Alan ekleme",
          },
          {
            label: "Ders 12: $facet",
            href: "/education/lessons/mongodb/module-07/lesson-12",
            description: "Çoklu pipeline",
          },
          {
            label: "Ders 13: Aggregation Best Practices",
            href: "/education/lessons/mongodb/module-07/lesson-13",
            description: "Aggregation en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Aggregation Patterns",
            href: "/education/lessons/mongodb/module-07/lesson-14",
            description: "Yaygın aggregation desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Transactions",
        summary:
          "MongoDB transactions, ACID properties, transaction operations, multi-document transactions, transaction best practices ve error handling.",
        durationMinutes: 450,
        objectives: [
          "Transaction kavramını anlamak",
          "ACID properties öğrenmek",
          "Transaction operations yapmayı öğrenmek",
          "Multi-document transactions kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Transactions Nedir?",
            href: "/education/lessons/mongodb/module-08/lesson-01",
            description: "Transaction kavramı",
          },
          {
            label: "Ders 2: ACID Properties",
            href: "/education/lessons/mongodb/module-08/lesson-02",
            description: "ACID özellikleri",
          },
          {
            label: "Ders 3: Transaction Operations",
            href: "/education/lessons/mongodb/module-08/lesson-03",
            description: "Transaction işlemleri",
          },
          {
            label: "Ders 4: Start Transaction",
            href: "/education/lessons/mongodb/module-08/lesson-04",
            description: "Transaction başlatma",
          },
          {
            label: "Ders 5: Commit Transaction",
            href: "/education/lessons/mongodb/module-08/lesson-05",
            description: "Transaction onaylama",
          },
          {
            label: "Ders 6: Abort Transaction",
            href: "/education/lessons/mongodb/module-08/lesson-06",
            description: "Transaction iptal",
          },
          {
            label: "Ders 7: Multi-Document Transactions",
            href: "/education/lessons/mongodb/module-08/lesson-07",
            description: "Çoklu doküman transaction'ları",
          },
          {
            label: "Ders 8: Transaction Isolation",
            href: "/education/lessons/mongodb/module-08/lesson-08",
            description: "Transaction izolasyonu",
          },
          {
            label: "Ders 9: Transaction Timeout",
            href: "/education/lessons/mongodb/module-08/lesson-09",
            description: "Zaman aşımı",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/mongodb/module-08/lesson-10",
            description: "Hata yönetimi",
          },
          {
            label: "Ders 11: Transaction Best Practices",
            href: "/education/lessons/mongodb/module-08/lesson-11",
            description: "Transaction en iyi uygulamaları",
          },
          {
            label: "Ders 12: Transaction Performance",
            href: "/education/lessons/mongodb/module-08/lesson-12",
            description: "Transaction performansı",
          },
          {
            label: "Ders 13: Common Transaction Patterns",
            href: "/education/lessons/mongodb/module-08/lesson-13",
            description: "Yaygın transaction desenleri",
          },
          {
            label: "Ders 14: Transaction vs Single Operations",
            href: "/education/lessons/mongodb/module-08/lesson-14",
            description: "Ne zaman transaction kullanılır",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Replication",
        summary:
          "MongoDB replication, replica sets, primary ve secondary nodes, oplog, failover, read preferences ve replication best practices.",
        durationMinutes: 450,
        objectives: [
          "Replication kavramını anlamak",
          "Replica sets öğrenmek",
          "Primary ve secondary nodes yönetmeyi öğrenmek",
          "Failover mekanizmasını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Replication Nedir?",
            href: "/education/lessons/mongodb/module-09/lesson-01",
            description: "Replikasyon kavramı",
          },
          {
            label: "Ders 2: Replica Sets",
            href: "/education/lessons/mongodb/module-09/lesson-02",
            description: "Replika setleri",
          },
          {
            label: "Ders 3: Primary Node",
            href: "/education/lessons/mongodb/module-09/lesson-03",
            description: "Birincil düğüm",
          },
          {
            label: "Ders 4: Secondary Nodes",
            href: "/education/lessons/mongodb/module-09/lesson-04",
            description: "İkincil düğümler",
          },
          {
            label: "Ders 5: Oplog",
            href: "/education/lessons/mongodb/module-09/lesson-05",
            description: "Operasyon günlüğü",
          },
          {
            label: "Ders 6: Replication Lag",
            href: "/education/lessons/mongodb/module-09/lesson-06",
            description: "Replikasyon gecikmesi",
          },
          {
            label: "Ders 7: Failover",
            href: "/education/lessons/mongodb/module-09/lesson-07",
            description: "Yedekleme mekanizması",
          },
          {
            label: "Ders 8: Read Preferences",
            href: "/education/lessons/mongodb/module-09/lesson-08",
            description: "Okuma tercihleri",
          },
          {
            label: "Ders 9: Write Concern",
            href: "/education/lessons/mongodb/module-09/lesson-09",
            description: "Yazma endişesi",
          },
          {
            label: "Ders 10: Replica Set Configuration",
            href: "/education/lessons/mongodb/module-09/lesson-10",
            description: "Replika set yapılandırması",
          },
          {
            label: "Ders 11: Replication Best Practices",
            href: "/education/lessons/mongodb/module-09/lesson-11",
            description: "Replikasyon en iyi uygulamaları",
          },
          {
            label: "Ders 12: Monitoring Replication",
            href: "/education/lessons/mongodb/module-09/lesson-12",
            description: "Replikasyon izleme",
          },
          {
            label: "Ders 13: Common Replication Patterns",
            href: "/education/lessons/mongodb/module-09/lesson-13",
            description: "Yaygın replikasyon desenleri",
          },
          {
            label: "Ders 14: Replication Troubleshooting",
            href: "/education/lessons/mongodb/module-09/lesson-14",
            description: "Replikasyon sorun giderme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Sharding",
        summary:
          "MongoDB sharding, sharded clusters, shard keys, mongos, config servers, sharding strategies ve sharding best practices.",
        durationMinutes: 450,
        objectives: [
          "Sharding kavramını anlamak",
          "Sharded clusters öğrenmek",
          "Shard keys seçmeyi öğrenmek",
          "Sharding stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Sharding Nedir?",
            href: "/education/lessons/mongodb/module-10/lesson-01",
            description: "Parçalama kavramı",
          },
          {
            label: "Ders 2: Sharded Clusters",
            href: "/education/lessons/mongodb/module-10/lesson-02",
            description: "Parçalı kümeler",
          },
          {
            label: "Ders 3: Shard Keys",
            href: "/education/lessons/mongodb/module-10/lesson-03",
            description: "Parça anahtarları",
          },
          {
            label: "Ders 4: Mongos",
            href: "/education/lessons/mongodb/module-10/lesson-04",
            description: "Yönlendirici",
          },
          {
            label: "Ders 5: Config Servers",
            href: "/education/lessons/mongodb/module-10/lesson-05",
            description: "Yapılandırma sunucuları",
          },
          {
            label: "Ders 6: Sharding Strategies",
            href: "/education/lessons/mongodb/module-10/lesson-06",
            description: "Parçalama stratejileri",
          },
          {
            label: "Ders 7: Range Sharding",
            href: "/education/lessons/mongodb/module-10/lesson-07",
            description: "Aralık parçalama",
          },
          {
            label: "Ders 8: Hash Sharding",
            href: "/education/lessons/mongodb/module-10/lesson-08",
            description: "Karma parçalama",
          },
          {
            label: "Ders 9: Zone Sharding",
            href: "/education/lessons/mongodb/module-10/lesson-09",
            description: "Bölge parçalama",
          },
          {
            label: "Ders 10: Chunk Management",
            href: "/education/lessons/mongodb/module-10/lesson-10",
            description: "Parça yönetimi",
          },
          {
            label: "Ders 11: Sharding Best Practices",
            href: "/education/lessons/mongodb/module-10/lesson-11",
            description: "Parçalama en iyi uygulamaları",
          },
          {
            label: "Ders 12: Monitoring Sharding",
            href: "/education/lessons/mongodb/module-10/lesson-12",
            description: "Parçalama izleme",
          },
          {
            label: "Ders 13: Common Sharding Patterns",
            href: "/education/lessons/mongodb/module-10/lesson-13",
            description: "Yaygın parçalama desenleri",
          },
          {
            label: "Ders 14: Sharding Troubleshooting",
            href: "/education/lessons/mongodb/module-10/lesson-14",
            description: "Parçalama sorun giderme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Performans Optimizasyonu",
        summary:
          "MongoDB performans optimizasyonu, query optimization, index optimization, connection pooling, caching, monitoring ve performance tuning.",
        durationMinutes: 450,
        objectives: [
          "Performans optimizasyonu kavramını anlamak",
          "Query optimization yapmayı öğrenmek",
          "Index optimization yapmayı öğrenmek",
          "Performance tuning yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performans Optimizasyonu",
            href: "/education/lessons/mongodb/module-11/lesson-01",
            description: "Performans kavramı",
          },
          {
            label: "Ders 2: Query Optimization",
            href: "/education/lessons/mongodb/module-11/lesson-02",
            description: "Sorgu optimizasyonu",
          },
          {
            label: "Ders 3: Index Optimization",
            href: "/education/lessons/mongodb/module-11/lesson-03",
            description: "İndeks optimizasyonu",
          },
          {
            label: "Ders 4: Explain Plan",
            href: "/education/lessons/mongodb/module-11/lesson-04",
            description: "Sorgu planı analizi",
          },
          {
            label: "Ders 5: Connection Pooling",
            href: "/education/lessons/mongodb/module-11/lesson-05",
            description: "Bağlantı havuzlama",
          },
          {
            label: "Ders 6: Caching",
            href: "/education/lessons/mongodb/module-11/lesson-06",
            description: "Önbellekleme",
          },
          {
            label: "Ders 7: Monitoring Tools",
            href: "/education/lessons/mongodb/module-11/lesson-07",
            description: "İzleme araçları",
          },
          {
            label: "Ders 8: Profiling",
            href: "/education/lessons/mongodb/module-11/lesson-08",
            description: "Profil oluşturma",
          },
          {
            label: "Ders 9: Resource Management",
            href: "/education/lessons/mongodb/module-11/lesson-09",
            description: "Kaynak yönetimi",
          },
          {
            label: "Ders 10: Write Performance",
            href: "/education/lessons/mongodb/module-11/lesson-10",
            description: "Yazma performansı",
          },
          {
            label: "Ders 11: Read Performance",
            href: "/education/lessons/mongodb/module-11/lesson-11",
            description: "Okuma performansı",
          },
          {
            label: "Ders 12: Performance Best Practices",
            href: "/education/lessons/mongodb/module-11/lesson-12",
            description: "Performans en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Performance Issues",
            href: "/education/lessons/mongodb/module-11/lesson-13",
            description: "Yaygın performans sorunları",
          },
          {
            label: "Ders 14: Performance Testing",
            href: "/education/lessons/mongodb/module-11/lesson-14",
            description: "Performans testleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Güvenlik",
        summary:
          "MongoDB güvenlik, authentication, authorization, roles, privileges, encryption, network security ve security best practices.",
        durationMinutes: 450,
        objectives: [
          "Güvenlik kavramını anlamak",
          "Authentication yapılandırmayı öğrenmek",
          "Authorization yapılandırmayı öğrenmek",
          "Encryption kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Güvenlik Temelleri",
            href: "/education/lessons/mongodb/module-12/lesson-01",
            description: "Güvenlik kavramı",
          },
          {
            label: "Ders 2: Authentication",
            href: "/education/lessons/mongodb/module-12/lesson-02",
            description: "Kimlik doğrulama",
          },
          {
            label: "Ders 3: Authorization",
            href: "/education/lessons/mongodb/module-12/lesson-03",
            description: "Yetkilendirme",
          },
          {
            label: "Ders 4: Roles",
            href: "/education/lessons/mongodb/module-12/lesson-04",
            description: "Roller",
          },
          {
            label: "Ders 5: Privileges",
            href: "/education/lessons/mongodb/module-12/lesson-05",
            description: "Ayrıcalıklar",
          },
          {
            label: "Ders 6: User Management",
            href: "/education/lessons/mongodb/module-12/lesson-06",
            description: "Kullanıcı yönetimi",
          },
          {
            label: "Ders 7: Encryption",
            href: "/education/lessons/mongodb/module-12/lesson-07",
            description: "Şifreleme",
          },
          {
            label: "Ders 8: Network Security",
            href: "/education/lessons/mongodb/module-12/lesson-08",
            description: "Ağ güvenliği",
          },
          {
            label: "Ders 9: TLS/SSL",
            href: "/education/lessons/mongodb/module-12/lesson-09",
            description: "Güvenli bağlantı",
          },
          {
            label: "Ders 10: Firewall Configuration",
            href: "/education/lessons/mongodb/module-12/lesson-10",
            description: "Güvenlik duvarı",
          },
          {
            label: "Ders 11: Security Best Practices",
            href: "/education/lessons/mongodb/module-12/lesson-11",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 12: Security Auditing",
            href: "/education/lessons/mongodb/module-12/lesson-12",
            description: "Güvenlik denetimi",
          },
          {
            label: "Ders 13: Common Security Issues",
            href: "/education/lessons/mongodb/module-12/lesson-13",
            description: "Yaygın güvenlik sorunları",
          },
          {
            label: "Ders 14: Security Monitoring",
            href: "/education/lessons/mongodb/module-12/lesson-14",
            description: "Güvenlik izleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Backup ve Recovery",
        summary:
          "MongoDB backup ve recovery, mongodump, mongorestore, point-in-time recovery, backup strategies ve disaster recovery.",
        durationMinutes: 450,
        objectives: [
          "Backup kavramını anlamak",
          "mongodump kullanmayı öğrenmek",
          "mongorestore kullanmayı öğrenmek",
          "Recovery stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Backup Temelleri",
            href: "/education/lessons/mongodb/module-13/lesson-01",
            description: "Yedekleme kavramı",
          },
          {
            label: "Ders 2: mongodump",
            href: "/education/lessons/mongodb/module-13/lesson-02",
            description: "Yedekleme aracı",
          },
          {
            label: "Ders 3: mongorestore",
            href: "/education/lessons/mongodb/module-13/lesson-03",
            description: "Geri yükleme aracı",
          },
          {
            label: "Ders 4: Backup Strategies",
            href: "/education/lessons/mongodb/module-13/lesson-04",
            description: "Yedekleme stratejileri",
          },
          {
            label: "Ders 5: Point-in-Time Recovery",
            href: "/education/lessons/mongodb/module-13/lesson-05",
            description: "Zaman noktası kurtarma",
          },
          {
            label: "Ders 6: Oplog Backup",
            href: "/education/lessons/mongodb/module-13/lesson-06",
            description: "Oplog yedekleme",
          },
          {
            label: "Ders 7: Snapshot Backup",
            href: "/education/lessons/mongodb/module-13/lesson-07",
            description: "Anlık görüntü yedekleme",
          },
          {
            label: "Ders 8: Automated Backups",
            href: "/education/lessons/mongodb/module-13/lesson-08",
            description: "Otomatik yedekleme",
          },
          {
            label: "Ders 9: Backup Storage",
            href: "/education/lessons/mongodb/module-13/lesson-09",
            description: "Yedekleme depolama",
          },
          {
            label: "Ders 10: Recovery Procedures",
            href: "/education/lessons/mongodb/module-13/lesson-10",
            description: "Kurtarma prosedürleri",
          },
          {
            label: "Ders 11: Disaster Recovery",
            href: "/education/lessons/mongodb/module-13/lesson-11",
            description: "Felaket kurtarma",
          },
          {
            label: "Ders 12: Backup Best Practices",
            href: "/education/lessons/mongodb/module-13/lesson-12",
            description: "Yedekleme en iyi uygulamaları",
          },
          {
            label: "Ders 13: Testing Backups",
            href: "/education/lessons/mongodb/module-13/lesson-13",
            description: "Yedekleme testleri",
          },
          {
            label: "Ders 14: Common Backup Issues",
            href: "/education/lessons/mongodb/module-13/lesson-14",
            description: "Yaygın yedekleme sorunları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: MongoDB Driver'ları ve Uygulama Entegrasyonu",
        summary:
          "MongoDB driver'ları, Node.js, Python, Java, C# driver'ları, connection management, error handling ve application integration.",
        durationMinutes: 450,
        objectives: [
          "MongoDB driver'larını anlamak",
          "Node.js driver kullanmayı öğrenmek",
          "Python driver kullanmayı öğrenmek",
          "Application integration yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: MongoDB Driver'ları",
            href: "/education/lessons/mongodb/module-14/lesson-01",
            description: "Driver kavramı",
          },
          {
            label: "Ders 2: Node.js Driver",
            href: "/education/lessons/mongodb/module-14/lesson-02",
            description: "Node.js entegrasyonu",
          },
          {
            label: "Ders 3: Python Driver",
            href: "/education/lessons/mongodb/module-14/lesson-03",
            description: "Python entegrasyonu",
          },
          {
            label: "Ders 4: Java Driver",
            href: "/education/lessons/mongodb/module-14/lesson-04",
            description: "Java entegrasyonu",
          },
          {
            label: "Ders 5: C# Driver",
            href: "/education/lessons/mongodb/module-14/lesson-05",
            description: "C# entegrasyonu",
          },
          {
            label: "Ders 6: Connection Management",
            href: "/education/lessons/mongodb/module-14/lesson-06",
            description: "Bağlantı yönetimi",
          },
          {
            label: "Ders 7: Error Handling",
            href: "/education/lessons/mongodb/module-14/lesson-07",
            description: "Hata yönetimi",
          },
          {
            label: "Ders 8: Async Operations",
            href: "/education/lessons/mongodb/module-14/lesson-08",
            description: "Asenkron işlemler",
          },
          {
            label: "Ders 9: Driver Best Practices",
            href: "/education/lessons/mongodb/module-14/lesson-09",
            description: "Driver kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 10: ORM Integration",
            href: "/education/lessons/mongodb/module-14/lesson-10",
            description: "ORM entegrasyonu",
          },
          {
            label: "Ders 11: Application Patterns",
            href: "/education/lessons/mongodb/module-14/lesson-11",
            description: "Uygulama desenleri",
          },
          {
            label: "Ders 12: Common Integration Issues",
            href: "/education/lessons/mongodb/module-14/lesson-12",
            description: "Yaygın entegrasyon sorunları",
          },
          {
            label: "Ders 13: Performance in Applications",
            href: "/education/lessons/mongodb/module-14/lesson-13",
            description: "Uygulamalarda performans",
          },
          {
            label: "Ders 14: Testing with Drivers",
            href: "/education/lessons/mongodb/module-14/lesson-14",
            description: "Driver'larla test",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/mongodb/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "MongoDB geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir MongoDB uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir MongoDB uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/mongodb/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Schema Design Best Practices",
            href: "/education/lessons/mongodb/module-15/lesson-02",
            description: "Şema tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 3: Query Optimization",
            href: "/education/lessons/mongodb/module-15/lesson-03",
            description: "Sorgu optimizasyonu",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/mongodb/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Mimari Tasarım",
            href: "/education/lessons/mongodb/module-15/lesson-05",
            description: "Uygulama mimarisi",
          },
          {
            label: "Ders 6: Core Implementation",
            href: "/education/lessons/mongodb/module-15/lesson-06",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 7: Data Modeling",
            href: "/education/lessons/mongodb/module-15/lesson-07",
            description: "Veri modelleme",
          },
          {
            label: "Ders 8: Index Strategy",
            href: "/education/lessons/mongodb/module-15/lesson-08",
            description: "İndeks stratejisi",
          },
          {
            label: "Ders 9: Performance Tuning",
            href: "/education/lessons/mongodb/module-15/lesson-09",
            description: "Performans ayarlama",
          },
          {
            label: "Ders 10: Security Implementation",
            href: "/education/lessons/mongodb/module-15/lesson-10",
            description: "Güvenlik implementasyonu",
          },
          {
            label: "Ders 11: Backup Strategy",
            href: "/education/lessons/mongodb/module-15/lesson-11",
            description: "Yedekleme stratejisi",
          },
          {
            label: "Ders 12: Monitoring ve Logging",
            href: "/education/lessons/mongodb/module-15/lesson-12",
            description: "İzleme ve loglama",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/mongodb/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/mongodb/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/mongodb/module-15/lesson-15",
            description: "Proje sunumu",
          },
        ],
      },
    ],
  };

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${courseContent.modules.length}, Total lessons: ${courseContent.modules.reduce(
      (sum, m) => sum + m.relatedTopics.length,
      0
    )}`
  );

  return courseContent;
}

