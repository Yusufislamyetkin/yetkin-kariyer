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
 * Create complete PostgreSQL course structure with predefined content
 */
export async function createPostgreSQLCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting PostgreSQL course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "PostgreSQL, güçlü ve açık kaynaklı bir ilişkisel veritabanı yönetim sistemidir. Bu kapsamlı kurs ile PostgreSQL'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Veritabanı tasarımı, SQL sorguları, performans optimizasyonu ve güvenlik konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "PostgreSQL'in temel kavramlarını ve mimarisini anlamak",
      "SQL syntax ve komutlarını etkili kullanmak",
      "Veritabanı tasarımı ve normalizasyon yapmak",
      "Gelişmiş SQL sorguları ve join'ler yazmak",
      "Functions, stored procedures ve triggers oluşturmak",
      "Performans optimizasyonu ve indexing yapmak",
      "Backup, recovery ve güvenlik stratejilerini uygulamak",
    ],
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "Veritabanı kavramlarına aşinalık",
      "Temel programlama bilgisi (opsiyonel)",
      "SQL temel bilgisi (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: PostgreSQL Tanımı ve Temelleri",
        summary:
          "PostgreSQL'in ne olduğu, tarihçesi, avantajları, diğer veritabanlarından farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "PostgreSQL'in ne olduğunu ve neden kullanıldığını anlamak",
          "PostgreSQL'in diğer veritabanlarından farklarını öğrenmek",
          "PostgreSQL'in avantajlarını ve kullanım alanlarını keşfetmek",
          "ACID özelliklerini anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: PostgreSQL Nedir?",
            href: "/education/lessons/postgresql/module-01/lesson-01",
            description: "PostgreSQL'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: PostgreSQL diğer veritabanlarından farkı nedir?",
            href: "/education/lessons/postgresql/module-01/lesson-02",
            description: "PostgreSQL'in MySQL, MSSQL gibi veritabanlarından farkları",
          },
          {
            label: "Ders 3: PostgreSQL'in Tarihçesi",
            href: "/education/lessons/postgresql/module-01/lesson-03",
            description: "PostgreSQL'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: ACID Özellikleri",
            href: "/education/lessons/postgresql/module-01/lesson-04",
            description: "ACID prensipleri",
          },
          {
            label: "Ders 5: PostgreSQL'in Avantajları",
            href: "/education/lessons/postgresql/module-01/lesson-05",
            description: "Açık kaynak, güvenilirlik, özellik zenginliği",
          },
          {
            label: "Ders 6: PostgreSQL Kullanım Alanları",
            href: "/education/lessons/postgresql/module-01/lesson-06",
            description: "Web uygulamaları, enterprise sistemler",
          },
          {
            label: "Ders 7: PostgreSQL Ekosistemi",
            href: "/education/lessons/postgresql/module-01/lesson-07",
            description: "PostgreSQL topluluğu ve araçlar",
          },
          {
            label: "Ders 8: PostgreSQL Lisanslama",
            href: "/education/lessons/postgresql/module-01/lesson-08",
            description: "PostgreSQL lisansı",
          },
          {
            label: "Ders 9: PostgreSQL Topluluk Desteği",
            href: "/education/lessons/postgresql/module-01/lesson-09",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 10: PostgreSQL'in Geleceği",
            href: "/education/lessons/postgresql/module-01/lesson-10",
            description: "PostgreSQL roadmap",
          },
          {
            label: "Ders 11: PostgreSQL Kurulum Gereksinimleri",
            href: "/education/lessons/postgresql/module-01/lesson-11",
            description: "Sistem gereksinimleri",
          },
          {
            label: "Ders 12: PostgreSQL ile Neler Yapılabilir?",
            href: "/education/lessons/postgresql/module-01/lesson-12",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 13: PostgreSQL Performans",
            href: "/education/lessons/postgresql/module-01/lesson-13",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 14: PostgreSQL Güvenlik",
            href: "/education/lessons/postgresql/module-01/lesson-14",
            description: "Güvenlik özellikleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/postgresql/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: PostgreSQL Kurulumu ve Yapılandırma",
        summary:
          "PostgreSQL kurulumu, yapılandırma dosyaları, bağlantı ayarları, kullanıcı yönetimi ve temel yönetim.",
        durationMinutes: 450,
        objectives: [
          "PostgreSQL kurulumunu öğrenmek",
          "Yapılandırma dosyalarını anlamak",
          "Kullanıcı yönetimi yapmayı öğrenmek",
          "Temel yönetim işlemlerini yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: PostgreSQL Kurulumu",
            href: "/education/lessons/postgresql/module-02/lesson-01",
            description: "PostgreSQL kurulumu",
          },
          {
            label: "Ders 2: psql Komut Satırı Aracı",
            href: "/education/lessons/postgresql/module-02/lesson-02",
            description: "psql kullanımı",
          },
          {
            label: "Ders 3: pgAdmin Kurulumu",
            href: "/education/lessons/postgresql/module-02/lesson-03",
            description: "GUI yönetim aracı",
          },
          {
            label: "Ders 4: Yapılandırma Dosyaları",
            href: "/education/lessons/postgresql/module-02/lesson-04",
            description: "postgresql.conf, pg_hba.conf",
          },
          {
            label: "Ders 5: Database Oluşturma",
            href: "/education/lessons/postgresql/module-02/lesson-05",
            description: "CREATE DATABASE",
          },
          {
            label: "Ders 6: Kullanıcı ve Rol Yönetimi",
            href: "/education/lessons/postgresql/module-02/lesson-06",
            description: "CREATE USER, CREATE ROLE",
          },
          {
            label: "Ders 7: İzin Yönetimi",
            href: "/education/lessons/postgresql/module-02/lesson-07",
            description: "GRANT, REVOKE",
          },
          {
            label: "Ders 8: Bağlantı Yönetimi",
            href: "/education/lessons/postgresql/module-02/lesson-08",
            description: "Connection pooling",
          },
          {
            label: "Ders 9: Log Yönetimi",
            href: "/education/lessons/postgresql/module-02/lesson-09",
            description: "Logging yapılandırması",
          },
          {
            label: "Ders 10: Memory Yapılandırması",
            href: "/education/lessons/postgresql/module-02/lesson-10",
            description: "Bellek ayarları",
          },
          {
            label: "Ders 11: Network Yapılandırması",
            href: "/education/lessons/postgresql/module-02/lesson-11",
            description: "Ağ ayarları",
          },
          {
            label: "Ders 12: Service Yönetimi",
            href: "/education/lessons/postgresql/module-02/lesson-12",
            description: "PostgreSQL servis yönetimi",
          },
          {
            label: "Ders 13: Environment Variables",
            href: "/education/lessons/postgresql/module-02/lesson-13",
            description: "Ortam değişkenleri",
          },
          {
            label: "Ders 14: Yapılandırma Best Practices",
            href: "/education/lessons/postgresql/module-02/lesson-14",
            description: "Yapılandırma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: SQL Syntax ve Temel Komutlar",
        summary:
          "SQL syntax, DDL komutları (CREATE, ALTER, DROP), DML komutları (SELECT, INSERT, UPDATE, DELETE) ve temel SQL işlemleri.",
        durationMinutes: 450,
        objectives: [
          "SQL syntax kurallarını öğrenmek",
          "DDL komutlarını kullanmayı öğrenmek",
          "DML komutlarını kullanmayı öğrenmek",
          "Temel SQL işlemlerini yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: SQL Syntax Temelleri",
            href: "/education/lessons/postgresql/module-03/lesson-01",
            description: "SQL syntax kuralları",
          },
          {
            label: "Ders 2: CREATE TABLE",
            href: "/education/lessons/postgresql/module-03/lesson-02",
            description: "Tablo oluşturma",
          },
          {
            label: "Ders 3: ALTER TABLE",
            href: "/education/lessons/postgresql/module-03/lesson-03",
            description: "Tablo değiştirme",
          },
          {
            label: "Ders 4: DROP TABLE",
            href: "/education/lessons/postgresql/module-03/lesson-04",
            description: "Tablo silme",
          },
          {
            label: "Ders 5: SELECT Statement",
            href: "/education/lessons/postgresql/module-03/lesson-05",
            description: "Veri sorgulama",
          },
          {
            label: "Ders 6: INSERT Statement",
            href: "/education/lessons/postgresql/module-03/lesson-06",
            description: "Veri ekleme",
          },
          {
            label: "Ders 7: UPDATE Statement",
            href: "/education/lessons/postgresql/module-03/lesson-07",
            description: "Veri güncelleme",
          },
          {
            label: "Ders 8: DELETE Statement",
            href: "/education/lessons/postgresql/module-03/lesson-08",
            description: "Veri silme",
          },
          {
            label: "Ders 9: WHERE Clause",
            href: "/education/lessons/postgresql/module-03/lesson-09",
            description: "Koşul filtreleme",
          },
          {
            label: "Ders 10: ORDER BY",
            href: "/education/lessons/postgresql/module-03/lesson-10",
            description: "Sıralama",
          },
          {
            label: "Ders 11: LIMIT ve OFFSET",
            href: "/education/lessons/postgresql/module-03/lesson-11",
            description: "Sonuç sınırlama",
          },
          {
            label: "Ders 12: DISTINCT",
            href: "/education/lessons/postgresql/module-03/lesson-12",
            description: "Benzersiz değerler",
          },
          {
            label: "Ders 13: SQL Best Practices",
            href: "/education/lessons/postgresql/module-03/lesson-13",
            description: "SQL yazma en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common SQL Patterns",
            href: "/education/lessons/postgresql/module-03/lesson-14",
            description: "Yaygın SQL desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Data Types ve Constraints",
        summary:
          "PostgreSQL veri tipleri, constraint'ler (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL) ve veri bütünlüğü.",
        durationMinutes: 450,
        objectives: [
          "PostgreSQL veri tiplerini öğrenmek",
          "Constraint kavramını anlamak",
          "Constraint tanımlamayı öğrenmek",
          "Veri bütünlüğünü sağlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Numeric Types",
            href: "/education/lessons/postgresql/module-04/lesson-01",
            description: "INTEGER, BIGINT, DECIMAL, NUMERIC",
          },
          {
            label: "Ders 2: Character Types",
            href: "/education/lessons/postgresql/module-04/lesson-02",
            description: "VARCHAR, CHAR, TEXT",
          },
          {
            label: "Ders 3: Date/Time Types",
            href: "/education/lessons/postgresql/module-04/lesson-03",
            description: "DATE, TIME, TIMESTAMP",
          },
          {
            label: "Ders 4: Boolean ve Other Types",
            href: "/education/lessons/postgresql/module-04/lesson-04",
            description: "BOOLEAN, UUID, JSON",
          },
          {
            label: "Ders 5: Array Types",
            href: "/education/lessons/postgresql/module-04/lesson-05",
            description: "Dizi veri tipleri",
          },
          {
            label: "Ders 6: Constraints Nedir?",
            href: "/education/lessons/postgresql/module-04/lesson-06",
            description: "Constraint kavramı",
          },
          {
            label: "Ders 7: PRIMARY KEY",
            href: "/education/lessons/postgresql/module-04/lesson-07",
            description: "Birincil anahtar",
          },
          {
            label: "Ders 8: FOREIGN KEY",
            href: "/education/lessons/postgresql/module-04/lesson-08",
            description: "Yabancı anahtar",
          },
          {
            label: "Ders 9: UNIQUE Constraint",
            href: "/education/lessons/postgresql/module-04/lesson-09",
            description: "Benzersizlik kısıtı",
          },
          {
            label: "Ders 10: CHECK Constraint",
            href: "/education/lessons/postgresql/module-04/lesson-10",
            description: "Kontrol kısıtı",
          },
          {
            label: "Ders 11: NOT NULL Constraint",
            href: "/education/lessons/postgresql/module-04/lesson-11",
            description: "Boş değer kısıtı",
          },
          {
            label: "Ders 12: DEFAULT Values",
            href: "/education/lessons/postgresql/module-04/lesson-12",
            description: "Varsayılan değerler",
          },
          {
            label: "Ders 13: Constraint Management",
            href: "/education/lessons/postgresql/module-04/lesson-13",
            description: "Constraint yönetimi",
          },
          {
            label: "Ders 14: Data Type Best Practices",
            href: "/education/lessons/postgresql/module-04/lesson-14",
            description: "Veri tipi seçimi en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Tables ve Indexes",
        summary:
          "Tablo tasarımı, normalizasyon, index oluşturma, index türleri, composite indexes ve index yönetimi.",
        durationMinutes: 450,
        objectives: [
          "Tablo tasarımını öğrenmek",
          "Normalizasyon yapmayı öğrenmek",
          "Index oluşturmayı öğrenmek",
          "Index yönetimi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Tablo Tasarımı",
            href: "/education/lessons/postgresql/module-05/lesson-01",
            description: "Tablo tasarım prensipleri",
          },
          {
            label: "Ders 2: Normalizasyon",
            href: "/education/lessons/postgresql/module-05/lesson-02",
            description: "1NF, 2NF, 3NF",
          },
          {
            label: "Ders 3: Denormalizasyon",
            href: "/education/lessons/postgresql/module-05/lesson-03",
            description: "Denormalizasyon stratejileri",
          },
          {
            label: "Ders 4: Indexes Nedir?",
            href: "/education/lessons/postgresql/module-05/lesson-04",
            description: "Index kavramı",
          },
          {
            label: "Ders 5: B-tree Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-05",
            description: "B-tree index türü",
          },
          {
            label: "Ders 6: Hash Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-06",
            description: "Hash index türü",
          },
          {
            label: "Ders 7: GiST Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-07",
            description: "GiST index türü",
          },
          {
            label: "Ders 8: GIN Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-08",
            description: "GIN index türü",
          },
          {
            label: "Ders 9: Composite Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-09",
            description: "Çoklu sütun index'leri",
          },
          {
            label: "Ders 10: Partial Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-10",
            description: "Kısmi index'ler",
          },
          {
            label: "Ders 11: Unique Indexes",
            href: "/education/lessons/postgresql/module-05/lesson-11",
            description: "Benzersiz index'ler",
          },
          {
            label: "Ders 12: Index Maintenance",
            href: "/education/lessons/postgresql/module-05/lesson-12",
            description: "Index bakımı",
          },
          {
            label: "Ders 13: Index Best Practices",
            href: "/education/lessons/postgresql/module-05/lesson-13",
            description: "Index kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Table ve Index Optimization",
            href: "/education/lessons/postgresql/module-05/lesson-14",
            description: "Tablo ve index optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Queries ve Joins",
        summary:
          "Gelişmiş SQL sorguları, JOIN türleri (INNER, LEFT, RIGHT, FULL), subqueries, CTEs ve window functions.",
        durationMinutes: 450,
        objectives: [
          "Gelişmiş SQL sorguları yazmayı öğrenmek",
          "JOIN türlerini kullanmayı öğrenmek",
          "Subqueries yazmayı öğrenmek",
          "Window functions kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Advanced SELECT",
            href: "/education/lessons/postgresql/module-06/lesson-01",
            description: "Gelişmiş SELECT sorguları",
          },
          {
            label: "Ders 2: Aggregate Functions",
            href: "/education/lessons/postgresql/module-06/lesson-02",
            description: "COUNT, SUM, AVG, MAX, MIN",
          },
          {
            label: "Ders 3: GROUP BY",
            href: "/education/lessons/postgresql/module-06/lesson-03",
            description: "Gruplama",
          },
          {
            label: "Ders 4: HAVING Clause",
            href: "/education/lessons/postgresql/module-06/lesson-04",
            description: "Gruplama filtreleme",
          },
          {
            label: "Ders 5: INNER JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-05",
            description: "İç birleştirme",
          },
          {
            label: "Ders 6: LEFT JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-06",
            description: "Sol dış birleştirme",
          },
          {
            label: "Ders 7: RIGHT JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-07",
            description: "Sağ dış birleştirme",
          },
          {
            label: "Ders 8: FULL OUTER JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-08",
            description: "Tam dış birleştirme",
          },
          {
            label: "Ders 9: CROSS JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-09",
            description: "Kartezyen çarpım",
          },
          {
            label: "Ders 10: Self JOIN",
            href: "/education/lessons/postgresql/module-06/lesson-10",
            description: "Kendi kendine birleştirme",
          },
          {
            label: "Ders 11: Subqueries",
            href: "/education/lessons/postgresql/module-06/lesson-11",
            description: "Alt sorgular",
          },
          {
            label: "Ders 12: Common Table Expressions (CTE)",
            href: "/education/lessons/postgresql/module-06/lesson-12",
            description: "WITH clause",
          },
          {
            label: "Ders 13: Window Functions",
            href: "/education/lessons/postgresql/module-06/lesson-13",
            description: "Pencere fonksiyonları",
          },
          {
            label: "Ders 14: Query Optimization",
            href: "/education/lessons/postgresql/module-06/lesson-14",
            description: "Sorgu optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Functions ve Stored Procedures",
        summary:
          "PostgreSQL functions, stored procedures, function parameters, return types, PL/pgSQL ve function best practices.",
        durationMinutes: 450,
        objectives: [
          "Function kavramını anlamak",
          "Function oluşturmayı öğrenmek",
          "Stored procedures kullanmayı öğrenmek",
          "PL/pgSQL kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Functions Nedir?",
            href: "/education/lessons/postgresql/module-07/lesson-01",
            description: "Function kavramı",
          },
          {
            label: "Ders 2: Built-in Functions",
            href: "/education/lessons/postgresql/module-07/lesson-02",
            description: "PostgreSQL yerleşik fonksiyonları",
          },
          {
            label: "Ders 3: CREATE FUNCTION",
            href: "/education/lessons/postgresql/module-07/lesson-03",
            description: "Fonksiyon oluşturma",
          },
          {
            label: "Ders 4: Function Parameters",
            href: "/education/lessons/postgresql/module-07/lesson-04",
            description: "Fonksiyon parametreleri",
          },
          {
            label: "Ders 5: Return Types",
            href: "/education/lessons/postgresql/module-07/lesson-05",
            description: "Dönüş tipleri",
          },
          {
            label: "Ders 6: PL/pgSQL Giriş",
            href: "/education/lessons/postgresql/module-07/lesson-06",
            description: "PL/pgSQL programlama dili",
          },
          {
            label: "Ders 7: PL/pgSQL Variables",
            href: "/education/lessons/postgresql/module-07/lesson-07",
            description: "Değişken tanımlama",
          },
          {
            label: "Ders 8: PL/pgSQL Control Structures",
            href: "/education/lessons/postgresql/module-07/lesson-08",
            description: "Kontrol yapıları",
          },
          {
            label: "Ders 9: Stored Procedures",
            href: "/education/lessons/postgresql/module-07/lesson-09",
            description: "Saklı prosedürler",
          },
          {
            label: "Ders 10: Function Overloading",
            href: "/education/lessons/postgresql/module-07/lesson-10",
            description: "Fonksiyon aşırı yükleme",
          },
          {
            label: "Ders 11: Recursive Functions",
            href: "/education/lessons/postgresql/module-07/lesson-11",
            description: "Özyinelemeli fonksiyonlar",
          },
          {
            label: "Ders 12: Function Security",
            href: "/education/lessons/postgresql/module-07/lesson-12",
            description: "Fonksiyon güvenliği",
          },
          {
            label: "Ders 13: Function Best Practices",
            href: "/education/lessons/postgresql/module-07/lesson-13",
            description: "Fonksiyon yazma en iyi uygulamaları",
          },
          {
            label: "Ders 14: Performance Considerations",
            href: "/education/lessons/postgresql/module-07/lesson-14",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Triggers ve Events",
        summary:
          "PostgreSQL triggers, trigger types, trigger functions, event triggers ve trigger best practices.",
        durationMinutes: 450,
        objectives: [
          "Trigger kavramını anlamak",
          "Trigger oluşturmayı öğrenmek",
          "Trigger functions yazmayı öğrenmek",
          "Event triggers kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Triggers Nedir?",
            href: "/education/lessons/postgresql/module-08/lesson-01",
            description: "Trigger kavramı",
          },
          {
            label: "Ders 2: BEFORE Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-02",
            description: "Önce tetiklenen trigger'lar",
          },
          {
            label: "Ders 3: AFTER Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-03",
            description: "Sonra tetiklenen trigger'lar",
          },
          {
            label: "Ders 4: INSTEAD OF Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-04",
            description: "Yerine tetiklenen trigger'lar",
          },
          {
            label: "Ders 5: CREATE TRIGGER",
            href: "/education/lessons/postgresql/module-08/lesson-05",
            description: "Trigger oluşturma",
          },
          {
            label: "Ders 6: Trigger Functions",
            href: "/education/lessons/postgresql/module-08/lesson-06",
            description: "Trigger fonksiyonları",
          },
          {
            label: "Ders 7: OLD ve NEW Records",
            href: "/education/lessons/postgresql/module-08/lesson-07",
            description: "Eski ve yeni kayıtlar",
          },
          {
            label: "Ders 8: Row-level Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-08",
            description: "Satır seviyesi trigger'lar",
          },
          {
            label: "Ders 9: Statement-level Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-09",
            description: "İfade seviyesi trigger'lar",
          },
          {
            label: "Ders 10: Conditional Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-10",
            description: "Koşullu trigger'lar",
          },
          {
            label: "Ders 11: Event Triggers",
            href: "/education/lessons/postgresql/module-08/lesson-11",
            description: "Olay trigger'ları",
          },
          {
            label: "Ders 12: Trigger Management",
            href: "/education/lessons/postgresql/module-08/lesson-12",
            description: "Trigger yönetimi",
          },
          {
            label: "Ders 13: Trigger Best Practices",
            href: "/education/lessons/postgresql/module-08/lesson-13",
            description: "Trigger kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Trigger Patterns",
            href: "/education/lessons/postgresql/module-08/lesson-14",
            description: "Yaygın trigger desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Views ve Materialized Views",
        summary:
          "PostgreSQL views, materialized views, view management, view updates ve view best practices.",
        durationMinutes: 450,
        objectives: [
          "View kavramını anlamak",
          "View oluşturmayı öğrenmek",
          "Materialized views kullanmayı öğrenmek",
          "View yönetimi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Views Nedir?",
            href: "/education/lessons/postgresql/module-09/lesson-01",
            description: "View kavramı",
          },
          {
            label: "Ders 2: CREATE VIEW",
            href: "/education/lessons/postgresql/module-09/lesson-02",
            description: "View oluşturma",
          },
          {
            label: "Ders 3: Simple Views",
            href: "/education/lessons/postgresql/module-09/lesson-03",
            description: "Basit view'lar",
          },
          {
            label: "Ders 4: Complex Views",
            href: "/education/lessons/postgresql/module-09/lesson-04",
            description: "Karmaşık view'lar",
          },
          {
            label: "Ders 5: View Updates",
            href: "/education/lessons/postgresql/module-09/lesson-05",
            description: "View güncelleme",
          },
          {
            label: "Ders 6: Updatable Views",
            href: "/education/lessons/postgresql/module-09/lesson-06",
            description: "Güncellenebilir view'lar",
          },
          {
            label: "Ders 7: Materialized Views",
            href: "/education/lessons/postgresql/module-09/lesson-07",
            description: "Materialized view kavramı",
          },
          {
            label: "Ders 8: CREATE MATERIALIZED VIEW",
            href: "/education/lessons/postgresql/module-09/lesson-08",
            description: "Materialized view oluşturma",
          },
          {
            label: "Ders 9: REFRESH MATERIALIZED VIEW",
            href: "/education/lessons/postgresql/module-09/lesson-09",
            description: "Materialized view yenileme",
          },
          {
            label: "Ders 10: View Indexes",
            href: "/education/lessons/postgresql/module-09/lesson-10",
            description: "View index'leri",
          },
          {
            label: "Ders 11: View Security",
            href: "/education/lessons/postgresql/module-09/lesson-11",
            description: "View güvenliği",
          },
          {
            label: "Ders 12: View Management",
            href: "/education/lessons/postgresql/module-09/lesson-12",
            description: "View yönetimi",
          },
          {
            label: "Ders 13: View Best Practices",
            href: "/education/lessons/postgresql/module-09/lesson-13",
            description: "View kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Performance Considerations",
            href: "/education/lessons/postgresql/module-09/lesson-14",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Transactions ve Locking",
        summary:
          "PostgreSQL transactions, ACID properties, transaction isolation levels, locking mechanisms ve deadlock handling.",
        durationMinutes: 450,
        objectives: [
          "Transaction kavramını anlamak",
          "ACID properties öğrenmek",
          "Transaction isolation levels anlamak",
          "Locking mechanisms kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Transactions Nedir?",
            href: "/education/lessons/postgresql/module-10/lesson-01",
            description: "Transaction kavramı",
          },
          {
            label: "Ders 2: BEGIN, COMMIT, ROLLBACK",
            href: "/education/lessons/postgresql/module-10/lesson-02",
            description: "Transaction komutları",
          },
          {
            label: "Ders 3: ACID Properties",
            href: "/education/lessons/postgresql/module-10/lesson-03",
            description: "ACID özellikleri",
          },
          {
            label: "Ders 4: Transaction Isolation",
            href: "/education/lessons/postgresql/module-10/lesson-04",
            description: "İzolasyon seviyeleri",
          },
          {
            label: "Ders 5: Read Uncommitted",
            href: "/education/lessons/postgresql/module-10/lesson-05",
            description: "Okunmamış okuma",
          },
          {
            label: "Ders 6: Read Committed",
            href: "/education/lessons/postgresql/module-10/lesson-06",
            description: "Okunmuş okuma",
          },
          {
            label: "Ders 7: Repeatable Read",
            href: "/education/lessons/postgresql/module-10/lesson-07",
            description: "Tekrarlanabilir okuma",
          },
          {
            label: "Ders 8: Serializable",
            href: "/education/lessons/postgresql/module-10/lesson-08",
            description: "Serileştirilebilir",
          },
          {
            label: "Ders 9: Locking Nedir?",
            href: "/education/lessons/postgresql/module-10/lesson-09",
            description: "Kilit mekanizması",
          },
          {
            label: "Ders 10: Row-level Locking",
            href: "/education/lessons/postgresql/module-10/lesson-10",
            description: "Satır seviyesi kilitleme",
          },
          {
            label: "Ders 11: Table-level Locking",
            href: "/education/lessons/postgresql/module-10/lesson-11",
            description: "Tablo seviyesi kilitleme",
          },
          {
            label: "Ders 12: Deadlocks",
            href: "/education/lessons/postgresql/module-10/lesson-12",
            description: "Kilitlenme durumları",
          },
          {
            label: "Ders 13: Lock Management",
            href: "/education/lessons/postgresql/module-10/lesson-13",
            description: "Kilit yönetimi",
          },
          {
            label: "Ders 14: Transaction Best Practices",
            href: "/education/lessons/postgresql/module-10/lesson-14",
            description: "Transaction kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Performance Tuning",
        summary:
          "PostgreSQL performans optimizasyonu, query optimization, EXPLAIN ANALYZE, VACUUM, ANALYZE ve performance monitoring.",
        durationMinutes: 450,
        objectives: [
          "Performans optimizasyon tekniklerini öğrenmek",
          "Query optimization yapmayı öğrenmek",
          "EXPLAIN ANALYZE kullanmayı öğrenmek",
          "Performance monitoring yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/postgresql/module-11/lesson-01",
            description: "Performans ölçümü",
          },
          {
            label: "Ders 2: EXPLAIN Statement",
            href: "/education/lessons/postgresql/module-11/lesson-02",
            description: "Sorgu planı analizi",
          },
          {
            label: "Ders 3: EXPLAIN ANALYZE",
            href: "/education/lessons/postgresql/module-11/lesson-03",
            description: "Gerçek zamanlı analiz",
          },
          {
            label: "Ders 4: Query Plan Reading",
            href: "/education/lessons/postgresql/module-11/lesson-04",
            description: "Sorgu planı okuma",
          },
          {
            label: "Ders 5: Index Usage",
            href: "/education/lessons/postgresql/module-11/lesson-05",
            description: "Index kullanımı",
          },
          {
            label: "Ders 6: Sequential Scan vs Index Scan",
            href: "/education/lessons/postgresql/module-11/lesson-06",
            description: "Tarama türleri",
          },
          {
            label: "Ders 7: VACUUM",
            href: "/education/lessons/postgresql/module-11/lesson-07",
            description: "VACUUM komutu",
          },
          {
            label: "Ders 8: ANALYZE",
            href: "/education/lessons/postgresql/module-11/lesson-08",
            description: "İstatistik güncelleme",
          },
          {
            label: "Ders 9: REINDEX",
            href: "/education/lessons/postgresql/module-11/lesson-09",
            description: "Index yeniden oluşturma",
          },
          {
            label: "Ders 10: Query Optimization",
            href: "/education/lessons/postgresql/module-11/lesson-10",
            description: "Sorgu optimizasyonu",
          },
          {
            label: "Ders 11: Connection Pooling",
            href: "/education/lessons/postgresql/module-11/lesson-11",
            description: "Bağlantı havuzlama",
          },
          {
            label: "Ders 12: Partitioning",
            href: "/education/lessons/postgresql/module-11/lesson-12",
            description: "Tablo bölümleme",
          },
          {
            label: "Ders 13: Performance Monitoring",
            href: "/education/lessons/postgresql/module-11/lesson-13",
            description: "Performans izleme",
          },
          {
            label: "Ders 14: Performance Best Practices",
            href: "/education/lessons/postgresql/module-11/lesson-14",
            description: "Performans optimizasyon en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Backup ve Recovery",
        summary:
          "PostgreSQL backup stratejileri, pg_dump, pg_restore, continuous archiving, point-in-time recovery ve backup best practices.",
        durationMinutes: 450,
        objectives: [
          "Backup stratejilerini öğrenmek",
          "pg_dump kullanmayı öğrenmek",
          "pg_restore kullanmayı öğrenmek",
          "Point-in-time recovery yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Backup Stratejileri",
            href: "/education/lessons/postgresql/module-12/lesson-01",
            description: "Yedekleme yaklaşımları",
          },
          {
            label: "Ders 2: pg_dump",
            href: "/education/lessons/postgresql/module-12/lesson-02",
            description: "pg_dump kullanımı",
          },
          {
            label: "Ders 3: pg_dumpall",
            href: "/education/lessons/postgresql/module-12/lesson-03",
            description: "Tüm veritabanı yedekleme",
          },
          {
            label: "Ders 4: pg_restore",
            href: "/education/lessons/postgresql/module-12/lesson-04",
            description: "Yedekten geri yükleme",
          },
          {
            label: "Ders 5: SQL Dump Format",
            href: "/education/lessons/postgresql/module-12/lesson-05",
            description: "SQL format yedek",
          },
          {
            label: "Ders 6: Custom Format",
            href: "/education/lessons/postgresql/module-12/lesson-06",
            description: "Özel format yedek",
          },
          {
            label: "Ders 7: Continuous Archiving",
            href: "/education/lessons/postgresql/module-12/lesson-07",
            description: "Sürekli arşivleme",
          },
          {
            label: "Ders 8: WAL Archiving",
            href: "/education/lessons/postgresql/module-12/lesson-08",
            description: "Write-Ahead Log arşivleme",
          },
          {
            label: "Ders 9: Point-in-Time Recovery",
            href: "/education/lessons/postgresql/module-12/lesson-09",
            description: "Belirli nokta geri yükleme",
          },
          {
            label: "Ders 10: Base Backup",
            href: "/education/lessons/postgresql/module-12/lesson-10",
            description: "Temel yedek",
          },
          {
            label: "Ders 11: Recovery Configuration",
            href: "/education/lessons/postgresql/module-12/lesson-11",
            description: "Geri yükleme yapılandırması",
          },
          {
            label: "Ders 12: Backup Automation",
            href: "/education/lessons/postgresql/module-12/lesson-12",
            description: "Otomatik yedekleme",
          },
          {
            label: "Ders 13: Backup Best Practices",
            href: "/education/lessons/postgresql/module-12/lesson-13",
            description: "Yedekleme en iyi uygulamaları",
          },
          {
            label: "Ders 14: Disaster Recovery",
            href: "/education/lessons/postgresql/module-12/lesson-14",
            description: "Felaket kurtarma",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Security ve Authentication",
        summary:
          "PostgreSQL güvenlik, authentication methods, SSL/TLS, encryption, row-level security ve security best practices.",
        durationMinutes: 450,
        objectives: [
          "Güvenlik kavramını anlamak",
          "Authentication methods kullanmayı öğrenmek",
          "SSL/TLS yapılandırmasını öğrenmek",
          "Row-level security uygulamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Security Temelleri",
            href: "/education/lessons/postgresql/module-13/lesson-01",
            description: "Güvenlik kavramı",
          },
          {
            label: "Ders 2: Authentication Methods",
            href: "/education/lessons/postgresql/module-13/lesson-02",
            description: "Kimlik doğrulama yöntemleri",
          },
          {
            label: "Ders 3: Password Authentication",
            href: "/education/lessons/postgresql/module-13/lesson-03",
            description: "Şifre tabanlı kimlik doğrulama",
          },
          {
            label: "Ders 4: Certificate Authentication",
            href: "/education/lessons/postgresql/module-13/lesson-04",
            description: "Sertifika tabanlı kimlik doğrulama",
          },
          {
            label: "Ders 5: SSL/TLS Configuration",
            href: "/education/lessons/postgresql/module-13/lesson-05",
            description: "SSL/TLS yapılandırması",
          },
          {
            label: "Ders 6: Encryption at Rest",
            href: "/education/lessons/postgresql/module-13/lesson-06",
            description: "Beklemede şifreleme",
          },
          {
            label: "Ders 7: Encryption in Transit",
            href: "/education/lessons/postgresql/module-13/lesson-07",
            description: "Aktarımda şifreleme",
          },
          {
            label: "Ders 8: Row-Level Security",
            href: "/education/lessons/postgresql/module-13/lesson-08",
            description: "Satır seviyesi güvenlik",
          },
          {
            label: "Ders 9: Column-Level Security",
            href: "/education/lessons/postgresql/module-13/lesson-09",
            description: "Sütun seviyesi güvenlik",
          },
          {
            label: "Ders 10: Audit Logging",
            href: "/education/lessons/postgresql/module-13/lesson-10",
            description: "Denetim loglama",
          },
          {
            label: "Ders 11: SQL Injection Prevention",
            href: "/education/lessons/postgresql/module-13/lesson-11",
            description: "SQL injection önleme",
          },
          {
            label: "Ders 12: Access Control",
            href: "/education/lessons/postgresql/module-13/lesson-12",
            description: "Erişim kontrolü",
          },
          {
            label: "Ders 13: Security Best Practices",
            href: "/education/lessons/postgresql/module-13/lesson-13",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 14: Security Auditing",
            href: "/education/lessons/postgresql/module-13/lesson-14",
            description: "Güvenlik denetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Advanced Features",
        summary:
          "PostgreSQL gelişmiş özellikler, JSON/JSONB, full-text search, extensions, foreign data wrappers ve advanced SQL features.",
        durationMinutes: 450,
        objectives: [
          "Gelişmiş özellikleri öğrenmek",
          "JSON/JSONB kullanmayı öğrenmek",
          "Full-text search yapmayı öğrenmek",
          "Extensions kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: JSON ve JSONB Types",
            href: "/education/lessons/postgresql/module-14/lesson-01",
            description: "JSON veri tipleri",
          },
          {
            label: "Ders 2: JSON Functions",
            href: "/education/lessons/postgresql/module-14/lesson-02",
            description: "JSON fonksiyonları",
          },
          {
            label: "Ders 3: JSONB Indexing",
            href: "/education/lessons/postgresql/module-14/lesson-03",
            description: "JSONB index'leme",
          },
          {
            label: "Ders 4: Full-Text Search",
            href: "/education/lessons/postgresql/module-14/lesson-04",
            description: "Tam metin arama",
          },
          {
            label: "Ders 5: tsvector ve tsquery",
            href: "/education/lessons/postgresql/module-14/lesson-05",
            description: "Arama veri tipleri",
          },
          {
            label: "Ders 6: GIN Indexes for Full-Text",
            href: "/education/lessons/postgresql/module-14/lesson-06",
            description: "Tam metin arama index'leri",
          },
          {
            label: "Ders 7: Extensions",
            href: "/education/lessons/postgresql/module-14/lesson-07",
            description: "PostgreSQL eklentileri",
          },
          {
            label: "Ders 8: Popular Extensions",
            href: "/education/lessons/postgresql/module-14/lesson-08",
            description: "Yaygın eklentiler",
          },
          {
            label: "Ders 9: Foreign Data Wrappers",
            href: "/education/lessons/postgresql/module-14/lesson-09",
            description: "Dış veri sarmalayıcıları",
          },
          {
            label: "Ders 10: Array Operations",
            href: "/education/lessons/postgresql/module-14/lesson-10",
            description: "Dizi işlemleri",
          },
          {
            label: "Ders 11: HStore",
            href: "/education/lessons/postgresql/module-14/lesson-11",
            description: "Anahtar-değer depolama",
          },
          {
            label: "Ders 12: PostGIS",
            href: "/education/lessons/postgresql/module-14/lesson-12",
            description: "Coğrafi veri eklentisi",
          },
          {
            label: "Ders 13: Advanced SQL Features",
            href: "/education/lessons/postgresql/module-14/lesson-13",
            description: "Gelişmiş SQL özellikleri",
          },
          {
            label: "Ders 14: Feature Best Practices",
            href: "/education/lessons/postgresql/module-14/lesson-14",
            description: "Özellik kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/postgresql/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "PostgreSQL geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir veritabanı projesi geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir veritabanı projesi geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/postgresql/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/postgresql/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Database Design Best Practices",
            href: "/education/lessons/postgresql/module-15/lesson-03",
            description: "Veritabanı tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/postgresql/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Database Schema Design",
            href: "/education/lessons/postgresql/module-15/lesson-05",
            description: "Veritabanı şema tasarımı",
          },
          {
            label: "Ders 6: Data Modeling",
            href: "/education/lessons/postgresql/module-15/lesson-06",
            description: "Veri modelleme",
          },
          {
            label: "Ders 7: Index Strategy",
            href: "/education/lessons/postgresql/module-15/lesson-07",
            description: "Index stratejisi",
          },
          {
            label: "Ders 8: Function Implementation",
            href: "/education/lessons/postgresql/module-15/lesson-08",
            description: "Fonksiyon implementasyonu",
          },
          {
            label: "Ders 9: Trigger Implementation",
            href: "/education/lessons/postgresql/module-15/lesson-09",
            description: "Trigger implementasyonu",
          },
          {
            label: "Ders 10: Security Implementation",
            href: "/education/lessons/postgresql/module-15/lesson-10",
            description: "Güvenlik implementasyonu",
          },
          {
            label: "Ders 11: Performance Optimization",
            href: "/education/lessons/postgresql/module-15/lesson-11",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 12: Backup Strategy",
            href: "/education/lessons/postgresql/module-15/lesson-12",
            description: "Yedekleme stratejisi",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/postgresql/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/postgresql/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/postgresql/module-15/lesson-15",
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

