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
 * Create complete Python course structure with predefined content
 */
export async function createPythonCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Python course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Python, modern yazılım geliştirmede en popüler programlama dillerinden biridir. Bu kapsamlı kurs ile Python'un temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Web geliştirme, veri bilimi, API geliştirme ve daha fazlası için Python becerileri kazanacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "Python programlama dilinin temel syntax'ını ve kavramlarını öğrenmek",
      "Veri yapıları ve algoritmaları Python ile uygulamak",
      "Nesne yönelimli programlama prensiplerini Python'da kullanmak",
      "Web framework'leri (Django/Flask) ile web uygulamaları geliştirmek",
      "RESTful API'ler geliştirmek",
      "Veritabanı işlemleri ve ORM kullanımını öğrenmek",
      "Test yazma ve yazılım kalitesini artırma tekniklerini öğrenmek",
      "Async programming ve modern Python özelliklerini kullanmak",
    ],
    prerequisites: [
      "Temel programlama bilgisi (opsiyonel ama faydalı)",
      "Bilgisayar kullanımına aşinalık",
      "Algoritma ve programlama mantığına ilgi",
      "Web teknolojileri hakkında temel bilgi (web geliştirme modülleri için)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Python Temelleri",
        summary:
          "Python programlama diline giriş, kurulum, temel syntax, değişkenler, veri tipleri ve temel programlama kavramları.",
        durationMinutes: 450,
        objectives: [
          "Python'un ne olduğunu ve neden kullanıldığını anlamak",
          "Python kurulumu ve geliştirme ortamı hazırlamak",
          "Temel Python syntax'ını öğrenmek",
          "Değişkenler ve veri tiplerini kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Python Nedir?",
            href: "/education/lessons/python/module-01/lesson-01",
            description: "Python programlama dilinin tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Python'un Avantajları ve Kullanım Alanları",
            href: "/education/lessons/python/module-01/lesson-02",
            description: "Python'un diğer dillerden farkları ve avantajları",
          },
          {
            label: "Ders 3: Python Kurulumu",
            href: "/education/lessons/python/module-01/lesson-03",
            description: "Python'un farklı işletim sistemlerinde kurulumu",
          },
          {
            label: "Ders 4: Geliştirme Ortamı Hazırlama",
            href: "/education/lessons/python/module-01/lesson-04",
            description: "IDE seçimi ve geliştirme ortamı kurulumu",
          },
          {
            label: "Ders 5: İlk Python Programı",
            href: "/education/lessons/python/module-01/lesson-05",
            description: "Hello World ve temel program yapısı",
          },
          {
            label: "Ders 6: Değişkenler ve İsimlendirme",
            href: "/education/lessons/python/module-01/lesson-06",
            description: "Değişken tanımlama ve Python isimlendirme kuralları",
          },
          {
            label: "Ders 7: Veri Tipleri",
            href: "/education/lessons/python/module-01/lesson-07",
            description: "int, float, str, bool gibi temel veri tipleri",
          },
          {
            label: "Ders 8: Type Conversion",
            href: "/education/lessons/python/module-01/lesson-08",
            description: "Veri tipi dönüşümleri ve type casting",
          },
          {
            label: "Ders 9: Input ve Output",
            href: "/education/lessons/python/module-01/lesson-09",
            description: "Kullanıcıdan veri alma ve ekrana yazdırma",
          },
          {
            label: "Ders 10: Comments ve Documentation",
            href: "/education/lessons/python/module-01/lesson-10",
            description: "Yorum satırları ve dokümantasyon yazma",
          },
          {
            label: "Ders 11: Python Syntax Kuralları",
            href: "/education/lessons/python/module-01/lesson-11",
            description: "Indentation, satır sonları ve syntax kuralları",
          },
          {
            label: "Ders 12: Python Interpreter Kullanımı",
            href: "/education/lessons/python/module-01/lesson-12",
            description: "REPL (Read-Eval-Print Loop) kullanımı",
          },
          {
            label: "Ders 13: Python Versiyonları",
            href: "/education/lessons/python/module-01/lesson-13",
            description: "Python 2 vs Python 3 farkları",
          },
          {
            label: "Ders 14: Python Ekosistemi",
            href: "/education/lessons/python/module-01/lesson-14",
            description: "PyPI, pip ve Python paket yönetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/python/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti ve değerlendirme",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Veri Yapıları",
        summary:
          "Python'daki temel veri yapıları: listeler, sözlükler, tuple'lar, set'ler ve bunların kullanımı.",
        durationMinutes: 450,
        objectives: [
          "List, dict, tuple, set veri yapılarını anlamak",
          "Veri yapılarını etkili bir şekilde kullanmak",
          "Veri yapıları üzerinde işlemler yapmak",
          "Uygun veri yapısını seçmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Listeler (Lists)",
            href: "/education/lessons/python/module-02/lesson-01",
            description: "List veri yapısı ve temel işlemler",
          },
          {
            label: "Ders 2: Liste Metodları",
            href: "/education/lessons/python/module-02/lesson-02",
            description: "append, extend, insert, remove gibi liste metodları",
          },
          {
            label: "Ders 3: Liste Slicing ve Indexing",
            href: "/education/lessons/python/module-02/lesson-03",
            description: "Liste elemanlarına erişim ve dilimleme",
          },
          {
            label: "Ders 4: Sözlükler (Dictionaries)",
            href: "/education/lessons/python/module-02/lesson-04",
            description: "Dict veri yapısı ve key-value çiftleri",
          },
          {
            label: "Ders 5: Sözlük Metodları",
            href: "/education/lessons/python/module-02/lesson-05",
            description: "get, keys, values, items gibi sözlük metodları",
          },
          {
            label: "Ders 6: Tuple'lar",
            href: "/education/lessons/python/module-02/lesson-06",
            description: "Immutable tuple veri yapısı",
          },
          {
            label: "Ders 7: Set'ler",
            href: "/education/lessons/python/module-02/lesson-07",
            description: "Set veri yapısı ve matematiksel işlemler",
          },
          {
            label: "Ders 8: Veri Yapıları Karşılaştırması",
            href: "/education/lessons/python/module-02/lesson-08",
            description: "Hangi durumda hangi veri yapısı kullanılmalı",
          },
          {
            label: "Ders 9: Nested Data Structures",
            href: "/education/lessons/python/module-02/lesson-09",
            description: "İç içe veri yapıları",
          },
          {
            label: "Ders 10: List Comprehensions",
            href: "/education/lessons/python/module-02/lesson-10",
            description: "Liste üreteçleri ve kısa yazım",
          },
          {
            label: "Ders 11: Dictionary Comprehensions",
            href: "/education/lessons/python/module-02/lesson-11",
            description: "Sözlük üreteçleri",
          },
          {
            label: "Ders 12: Veri Yapıları Üzerinde İterasyon",
            href: "/education/lessons/python/module-02/lesson-12",
            description: "for döngüleri ve iterasyon",
          },
          {
            label: "Ders 13: Copy ve Deep Copy",
            href: "/education/lessons/python/module-02/lesson-13",
            description: "Veri yapılarını kopyalama",
          },
          {
            label: "Ders 14: Veri Yapıları Performansı",
            href: "/education/lessons/python/module-02/lesson-14",
            description: "Veri yapılarının zaman karmaşıklığı",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Fonksiyonlar ve Modüller",
        summary:
          "Fonksiyon tanımlama, parametreler, return değerleri, lambda fonksiyonlar, modüller ve paketler.",
        durationMinutes: 450,
        objectives: [
          "Fonksiyon tanımlamayı ve kullanmayı öğrenmek",
          "Parametreler ve return değerlerini anlamak",
          "Lambda fonksiyonlarını kullanmak",
          "Modül ve paket sistemini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Fonksiyon Tanımlama",
            href: "/education/lessons/python/module-03/lesson-01",
            description: "def anahtar kelimesi ile fonksiyon oluşturma",
          },
          {
            label: "Ders 2: Fonksiyon Parametreleri",
            href: "/education/lessons/python/module-03/lesson-02",
            description: "Positional ve keyword parametreler",
          },
          {
            label: "Ders 3: Return Değerleri",
            href: "/education/lessons/python/module-03/lesson-03",
            description: "Fonksiyonlardan değer döndürme",
          },
          {
            label: "Ders 4: Default Parametreler",
            href: "/education/lessons/python/module-03/lesson-04",
            description: "Varsayılan parametre değerleri",
          },
          {
            label: "Ders 5: *args ve **kwargs",
            href: "/education/lessons/python/module-03/lesson-05",
            description: "Değişken sayıda parametre",
          },
          {
            label: "Ders 6: Lambda Fonksiyonlar",
            href: "/education/lessons/python/module-03/lesson-06",
            description: "Anonim fonksiyonlar ve kullanım alanları",
          },
          {
            label: "Ders 7: Scope ve Namespace",
            href: "/education/lessons/python/module-03/lesson-07",
            description: "Değişken kapsamı ve isim alanları",
          },
          {
            label: "Ders 8: Decorators",
            href: "/education/lessons/python/module-03/lesson-08",
            description: "Fonksiyon dekoratörleri",
          },
          {
            label: "Ders 9: Generator Fonksiyonlar",
            href: "/education/lessons/python/module-03/lesson-09",
            description: "yield anahtar kelimesi ve generator'lar",
          },
          {
            label: "Ders 10: Modül Oluşturma",
            href: "/education/lessons/python/module-03/lesson-10",
            description: "Python modül dosyası oluşturma",
          },
          {
            label: "Ders 11: Modül İçe Aktarma",
            href: "/education/lessons/python/module-03/lesson-11",
            description: "import, from import kullanımı",
          },
          {
            label: "Ders 12: Paketler (Packages)",
            href: "/education/lessons/python/module-03/lesson-12",
            description: "Paket yapısı ve __init__.py",
          },
          {
            label: "Ders 13: Standart Kütüphane",
            href: "/education/lessons/python/module-03/lesson-13",
            description: "Python standart kütüphane modülleri",
          },
          {
            label: "Ders 14: Third-party Paketler",
            href: "/education/lessons/python/module-03/lesson-14",
            description: "pip ile paket yükleme ve kullanma",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Nesne Yönelimli Programlama",
        summary:
          "Sınıflar, nesneler, kalıtım, polimorfizm, encapsulation, abstraction ve Python'da OOP prensipleri.",
        durationMinutes: 450,
        objectives: [
          "OOP prensiplerini Python'da uygulamak",
          "Sınıf ve nesne kavramlarını öğrenmek",
          "Kalıtım ve polimorfizm kullanmak",
          "Encapsulation ve abstraction uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: OOP Prensiplerine Giriş",
            href: "/education/lessons/python/module-04/lesson-01",
            description: "Nesne yönelimli programlamanın temelleri",
          },
          {
            label: "Ders 2: Class ve Object",
            href: "/education/lessons/python/module-04/lesson-02",
            description: "Sınıf tanımlama ve nesne oluşturma",
          },
          {
            label: "Ders 3: __init__ ve Constructor",
            href: "/education/lessons/python/module-04/lesson-03",
            description: "Nesne başlatma metodları",
          },
          {
            label: "Ders 4: Instance ve Class Variables",
            href: "/education/lessons/python/module-04/lesson-04",
            description: "Örnek ve sınıf değişkenleri",
          },
          {
            label: "Ders 5: Methods ve self",
            href: "/education/lessons/python/module-04/lesson-05",
            description: "Instance metodları ve self parametresi",
          },
          {
            label: "Ders 6: Encapsulation",
            href: "/education/lessons/python/module-04/lesson-06",
            description: "Veri gizleme ve kapsülleme",
          },
          {
            label: "Ders 7: Properties ve @property",
            href: "/education/lessons/python/module-04/lesson-07",
            description: "Property dekoratörü ve getter/setter",
          },
          {
            label: "Ders 8: Inheritance (Kalıtım)",
            href: "/education/lessons/python/module-04/lesson-08",
            description: "Sınıf kalıtımı ve super()",
          },
          {
            label: "Ders 9: Method Overriding",
            href: "/education/lessons/python/module-04/lesson-09",
            description: "Metod ezme ve polimorfizm",
          },
          {
            label: "Ders 10: Multiple Inheritance",
            href: "/education/lessons/python/module-04/lesson-10",
            description: "Çoklu kalıtım ve MRO",
          },
          {
            label: "Ders 11: Abstract Base Classes",
            href: "/education/lessons/python/module-04/lesson-11",
            description: "Soyut sınıflar ve abc modülü",
          },
          {
            label: "Ders 12: Magic Methods",
            href: "/education/lessons/python/module-04/lesson-12",
            description: "__str__, __repr__, __len__ gibi özel metodlar",
          },
          {
            label: "Ders 13: Static ve Class Methods",
            href: "/education/lessons/python/module-04/lesson-13",
            description: "@staticmethod ve @classmethod",
          },
          {
            label: "Ders 14: OOP Design Patterns",
            href: "/education/lessons/python/module-04/lesson-14",
            description: "Python'da tasarım desenleri",
          },
          {
            label: "Ders 15: OOP Best Practices",
            href: "/education/lessons/python/module-04/lesson-15",
            description: "OOP tasarım prensipleri ve en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Dosya İşlemleri",
        summary:
          "Dosya okuma, yazma, dosya yönetimi, JSON, CSV işlemleri ve dosya formatları.",
        durationMinutes: 450,
        objectives: [
          "Dosya okuma ve yazma işlemlerini öğrenmek",
          "Farklı dosya formatlarını işlemek",
          "Dosya yönetimi yapmak",
          "JSON ve CSV işlemlerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Dosya Okuma",
            href: "/education/lessons/python/module-05/lesson-01",
            description: "open() fonksiyonu ve dosya okuma",
          },
          {
            label: "Ders 2: Dosya Yazma",
            href: "/education/lessons/python/module-05/lesson-02",
            description: "Dosyaya veri yazma işlemleri",
          },
          {
            label: "Ders 3: Dosya Modları",
            href: "/education/lessons/python/module-05/lesson-03",
            description: "r, w, a, x modları ve kullanımı",
          },
          {
            label: "Ders 4: Context Managers",
            href: "/education/lessons/python/module-05/lesson-04",
            description: "with statement ve dosya yönetimi",
          },
          {
            label: "Ders 5: Dosya Yolları",
            href: "/education/lessons/python/module-05/lesson-05",
            description: "os.path ve pathlib kullanımı",
          },
          {
            label: "Ders 6: JSON İşlemleri",
            href: "/education/lessons/python/module-05/lesson-06",
            description: "json modülü ile JSON okuma/yazma",
          },
          {
            label: "Ders 7: CSV İşlemleri",
            href: "/education/lessons/python/module-05/lesson-07",
            description: "csv modülü ile CSV dosyaları",
          },
          {
            label: "Ders 8: Binary Dosyalar",
            href: "/education/lessons/python/module-05/lesson-08",
            description: "Binary mod ve dosya işlemleri",
          },
          {
            label: "Ders 9: Dosya ve Klasör Yönetimi",
            href: "/education/lessons/python/module-05/lesson-09",
            description: "os ve shutil modülleri",
          },
          {
            label: "Ders 10: Exception Handling in Files",
            href: "/education/lessons/python/module-05/lesson-10",
            description: "Dosya işlemlerinde hata yönetimi",
          },
          {
            label: "Ders 11: File Encoding",
            href: "/education/lessons/python/module-05/lesson-11",
            description: "UTF-8, encoding parametreleri",
          },
          {
            label: "Ders 12: Temporary Files",
            href: "/education/lessons/python/module-05/lesson-12",
            description: "Geçici dosya oluşturma",
          },
          {
            label: "Ders 13: File Compression",
            href: "/education/lessons/python/module-05/lesson-13",
            description: "zipfile ve tarfile modülleri",
          },
          {
            label: "Ders 14: Logging to Files",
            href: "/education/lessons/python/module-05/lesson-14",
            description: "logging modülü ile dosyaya log yazma",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Veritabanı İşlemleri",
        summary:
          "SQLite, PostgreSQL bağlantıları, SQLAlchemy ORM, veritabanı sorguları ve transaction yönetimi.",
        durationMinutes: 450,
        objectives: [
          "Veritabanı bağlantıları kurmak",
          "SQLAlchemy ORM kullanmayı öğrenmek",
          "CRUD işlemleri yapmak",
          "Transaction yönetimi yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Veritabanı Temelleri",
            href: "/education/lessons/python/module-06/lesson-01",
            description: "Veritabanı kavramları ve SQL'e giriş",
          },
          {
            label: "Ders 2: SQLite ile Çalışma",
            href: "/education/lessons/python/module-06/lesson-02",
            description: "sqlite3 modülü ve SQLite kullanımı",
          },
          {
            label: "Ders 3: SQLite CRUD İşlemleri",
            href: "/education/lessons/python/module-06/lesson-03",
            description: "Create, Read, Update, Delete işlemleri",
          },
          {
            label: "Ders 4: PostgreSQL Bağlantısı",
            href: "/education/lessons/python/module-06/lesson-04",
            description: "psycopg2 ile PostgreSQL bağlantısı",
          },
          {
            label: "Ders 5: SQLAlchemy Giriş",
            href: "/education/lessons/python/module-06/lesson-05",
            description: "ORM kavramı ve SQLAlchemy'ye giriş",
          },
          {
            label: "Ders 6: SQLAlchemy Models",
            href: "/education/lessons/python/module-06/lesson-06",
            description: "Model tanımlama ve tablo oluşturma",
          },
          {
            label: "Ders 7: SQLAlchemy Relationships",
            href: "/education/lessons/python/module-06/lesson-07",
            description: "One-to-Many, Many-to-Many ilişkiler",
          },
          {
            label: "Ders 8: SQLAlchemy Queries",
            href: "/education/lessons/python/module-06/lesson-08",
            description: "Query API ve sorgu yazma",
          },
          {
            label: "Ders 9: SQLAlchemy Sessions",
            href: "/education/lessons/python/module-06/lesson-09",
            description: "Session yönetimi ve transaction'lar",
          },
          {
            label: "Ders 10: Database Migrations",
            href: "/education/lessons/python/module-06/lesson-10",
            description: "Alembic ile migration yönetimi",
          },
          {
            label: "Ders 11: Raw SQL Queries",
            href: "/education/lessons/python/module-06/lesson-11",
            description: "SQLAlchemy ile ham SQL sorguları",
          },
          {
            label: "Ders 12: Connection Pooling",
            href: "/education/lessons/python/module-06/lesson-12",
            description: "Bağlantı havuzlama ve optimizasyon",
          },
          {
            label: "Ders 13: Database Best Practices",
            href: "/education/lessons/python/module-06/lesson-13",
            description: "Veritabanı işlemleri en iyi uygulamaları",
          },
          {
            label: "Ders 14: Database Testing",
            href: "/education/lessons/python/module-06/lesson-14",
            description: "Test veritabanları ve test stratejileri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Web Framework (Django/Flask)",
        summary:
          "Django ve Flask web framework'leri, proje yapısı, routing, template engine ve web uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Django ve Flask framework'lerini anlamak",
          "Web uygulaması projesi oluşturmak",
          "Routing ve view'ları yapılandırmak",
          "Template engine kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Web Framework Nedir?",
            href: "/education/lessons/python/module-07/lesson-01",
            description: "Web framework kavramı ve Python framework'leri",
          },
          {
            label: "Ders 2: Django Giriş",
            href: "/education/lessons/python/module-07/lesson-02",
            description: "Django kurulumu ve ilk proje",
          },
          {
            label: "Ders 3: Django Proje Yapısı",
            href: "/education/lessons/python/module-07/lesson-03",
            description: "Django proje ve app yapısı",
          },
          {
            label: "Ders 4: Django Models",
            href: "/education/lessons/python/module-07/lesson-04",
            description: "Django ORM ve model tanımlama",
          },
          {
            label: "Ders 5: Django Views",
            href: "/education/lessons/python/module-07/lesson-05",
            description: "Function-based ve class-based views",
          },
          {
            label: "Ders 6: Django Templates",
            href: "/education/lessons/python/module-07/lesson-06",
            description: "Django template engine ve syntax",
          },
          {
            label: "Ders 7: Django URL Routing",
            href: "/education/lessons/python/module-07/lesson-07",
            description: "URL patterns ve routing",
          },
          {
            label: "Ders 8: Flask Giriş",
            href: "/education/lessons/python/module-07/lesson-08",
            description: "Flask kurulumu ve ilk uygulama",
          },
          {
            label: "Ders 9: Flask Routing",
            href: "/education/lessons/python/module-07/lesson-09",
            description: "Flask route decorators ve URL patterns",
          },
          {
            label: "Ders 10: Flask Templates",
            href: "/education/lessons/python/module-07/lesson-10",
            description: "Jinja2 template engine",
          },
          {
            label: "Ders 11: Flask Blueprints",
            href: "/education/lessons/python/module-07/lesson-11",
            description: "Modüler uygulama yapısı",
          },
          {
            label: "Ders 12: Django vs Flask",
            href: "/education/lessons/python/module-07/lesson-12",
            description: "İki framework'ün karşılaştırması",
          },
          {
            label: "Ders 13: Static Files ve Media",
            href: "/education/lessons/python/module-07/lesson-13",
            description: "CSS, JS ve medya dosyaları yönetimi",
          },
          {
            label: "Ders 14: Form Handling",
            href: "/education/lessons/python/module-07/lesson-14",
            description: "Form işleme ve validation",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: RESTful API Geliştirme",
        summary:
          "RESTful API tasarımı, Django REST Framework, Flask-RESTful, API authentication ve API best practices.",
        durationMinutes: 450,
        objectives: [
          "RESTful API tasarım prensiplerini öğrenmek",
          "Django REST Framework kullanmak",
          "Flask ile API geliştirmek",
          "API authentication ve security uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: RESTful API Nedir?",
            href: "/education/lessons/python/module-08/lesson-01",
            description: "REST prensipleri ve API tasarımı",
          },
          {
            label: "Ders 2: Django REST Framework Giriş",
            href: "/education/lessons/python/module-08/lesson-02",
            description: "DRF kurulumu ve temel kavramlar",
          },
          {
            label: "Ders 3: DRF Serializers",
            href: "/education/lessons/python/module-08/lesson-03",
            description: "Serializer'lar ve data validation",
          },
          {
            label: "Ders 4: DRF ViewSets",
            href: "/education/lessons/python/module-08/lesson-04",
            description: "ViewSet'ler ve CRUD işlemleri",
          },
          {
            label: "Ders 5: DRF Routers",
            href: "/education/lessons/python/module-08/lesson-05",
            description: "URL routing ve endpoint yapılandırması",
          },
          {
            label: "Ders 6: DRF Permissions",
            href: "/education/lessons/python/module-08/lesson-06",
            description: "İzin yönetimi ve authentication",
          },
          {
            label: "Ders 7: Flask-RESTful",
            href: "/education/lessons/python/module-08/lesson-07",
            description: "Flask-RESTful ile API geliştirme",
          },
          {
            label: "Ders 8: API Authentication",
            href: "/education/lessons/python/module-08/lesson-08",
            description: "JWT, Token authentication",
          },
          {
            label: "Ders 9: API Versioning",
            href: "/education/lessons/python/module-08/lesson-09",
            description: "API versiyonlama stratejileri",
          },
          {
            label: "Ders 10: API Pagination",
            href: "/education/lessons/python/module-08/lesson-10",
            description: "Sayfalama ve veri sınırlama",
          },
          {
            label: "Ders 11: API Filtering ve Searching",
            href: "/education/lessons/python/module-08/lesson-11",
            description: "Filtreleme ve arama özellikleri",
          },
          {
            label: "Ders 12: API Documentation",
            href: "/education/lessons/python/module-08/lesson-12",
            description: "Swagger/OpenAPI dokümantasyonu",
          },
          {
            label: "Ders 13: API Error Handling",
            href: "/education/lessons/python/module-08/lesson-13",
            description: "Hata yönetimi ve status kodları",
          },
          {
            label: "Ders 14: API Testing",
            href: "/education/lessons/python/module-08/lesson-14",
            description: "API test stratejileri",
          },
          {
            label: "Ders 15: API Best Practices",
            href: "/education/lessons/python/module-08/lesson-15",
            description: "RESTful API tasarım en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Testing",
        summary:
          "Unit testing, integration testing, unittest, pytest framework, mocking ve test best practices.",
        durationMinutes: 450,
        objectives: [
          "Test yazma prensiplerini öğrenmek",
          "unittest ve pytest kullanmak",
          "Mocking ve test araçlarını kullanmak",
          "Test coverage ve best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/python/module-09/lesson-01",
            description: "Test türleri ve test pyramid",
          },
          {
            label: "Ders 2: unittest Framework",
            href: "/education/lessons/python/module-09/lesson-02",
            description: "unittest modülüne giriş",
          },
          {
            label: "Ders 3: unittest Test Yazma",
            href: "/education/lessons/python/module-09/lesson-03",
            description: "Test class'ları ve test metodları",
          },
          {
            label: "Ders 4: unittest Assertions",
            href: "/education/lessons/python/module-09/lesson-04",
            description: "Assert metodları ve kullanımı",
          },
          {
            label: "Ders 5: pytest Framework",
            href: "/education/lessons/python/module-09/lesson-05",
            description: "pytest kurulumu ve temel kullanım",
          },
          {
            label: "Ders 6: pytest Fixtures",
            href: "/education/lessons/python/module-09/lesson-06",
            description: "Fixture'lar ve test setup",
          },
          {
            label: "Ders 7: pytest Parametrization",
            href: "/education/lessons/python/module-09/lesson-07",
            description: "Parametreli testler",
          },
          {
            label: "Ders 8: Mocking with unittest.mock",
            href: "/education/lessons/python/module-09/lesson-08",
            description: "Mock objeler ve patching",
          },
          {
            label: "Ders 9: Mocking with pytest-mock",
            href: "/education/lessons/python/module-09/lesson-09",
            description: "pytest-mock kullanımı",
          },
          {
            label: "Ders 10: Integration Testing",
            href: "/education/lessons/python/module-09/lesson-10",
            description: "Entegrasyon testleri yazma",
          },
          {
            label: "Ders 11: Django Testing",
            href: "/education/lessons/python/module-09/lesson-11",
            description: "Django test framework'ü",
          },
          {
            label: "Ders 12: Flask Testing",
            href: "/education/lessons/python/module-09/lesson-12",
            description: "Flask test client kullanımı",
          },
          {
            label: "Ders 13: Test Coverage",
            href: "/education/lessons/python/module-09/lesson-13",
            description: "coverage.py ile test kapsamı",
          },
          {
            label: "Ders 14: Test-Driven Development",
            href: "/education/lessons/python/module-09/lesson-14",
            description: "TDD yaklaşımı ve uygulaması",
          },
          {
            label: "Ders 15: Testing Best Practices",
            href: "/education/lessons/python/module-09/lesson-15",
            description: "Test yazma en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Async Programming",
        summary:
          "Asynchronous programming, async/await, asyncio, concurrent programming ve async patterns.",
        durationMinutes: 450,
        objectives: [
          "Async programming kavramını anlamak",
          "async/await syntax'ını kullanmak",
          "asyncio kütüphanesini öğrenmek",
          "Concurrent programming yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Async Programming Nedir?",
            href: "/education/lessons/python/module-10/lesson-01",
            description: "Asenkron programlama kavramı",
          },
          {
            label: "Ders 2: async/await Syntax",
            href: "/education/lessons/python/module-10/lesson-02",
            description: "async ve await anahtar kelimeleri",
          },
          {
            label: "Ders 3: Coroutines",
            href: "/education/lessons/python/module-10/lesson-03",
            description: "Coroutine fonksiyonlar",
          },
          {
            label: "Ders 4: asyncio Modülü",
            href: "/education/lessons/python/module-10/lesson-04",
            description: "asyncio kütüphanesine giriş",
          },
          {
            label: "Ders 5: Event Loop",
            href: "/education/lessons/python/module-10/lesson-05",
            description: "Event loop yönetimi",
          },
          {
            label: "Ders 6: Tasks ve Futures",
            href: "/education/lessons/python/module-10/lesson-06",
            description: "Task oluşturma ve yönetimi",
          },
          {
            label: "Ders 7: Concurrent Execution",
            href: "/education/lessons/python/module-10/lesson-07",
            description: "asyncio.gather ve concurrent işlemler",
          },
          {
            label: "Ders 8: Async Context Managers",
            href: "/education/lessons/python/module-10/lesson-08",
            description: "Async with statement",
          },
          {
            label: "Ders 9: Async Generators",
            href: "/education/lessons/python/module-10/lesson-09",
            description: "Async generator fonksiyonlar",
          },
          {
            label: "Ders 10: Async HTTP Requests",
            href: "/education/lessons/python/module-10/lesson-10",
            description: "aiohttp ile async HTTP istekleri",
          },
          {
            label: "Ders 11: Async Database Operations",
            href: "/education/lessons/python/module-10/lesson-11",
            description: "Async veritabanı işlemleri",
          },
          {
            label: "Ders 12: Async Web Frameworks",
            href: "/education/lessons/python/module-10/lesson-12",
            description: "FastAPI, Quart gibi async framework'ler",
          },
          {
            label: "Ders 13: Threading vs Async",
            href: "/education/lessons/python/module-10/lesson-13",
            description: "Threading ve async karşılaştırması",
          },
          {
            label: "Ders 14: Async Best Practices",
            href: "/education/lessons/python/module-10/lesson-14",
            description: "Async programlama en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Data Science Temelleri",
        summary:
          "NumPy, Pandas, veri analizi, data manipulation ve temel data science kavramları.",
        durationMinutes: 450,
        objectives: [
          "NumPy kütüphanesini öğrenmek",
          "Pandas ile veri analizi yapmak",
          "Veri manipülasyonu yapmak",
          "Temel data science kavramlarını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Data Science Giriş",
            href: "/education/lessons/python/module-11/lesson-01",
            description: "Veri bilimi kavramları ve Python ekosistemi",
          },
          {
            label: "Ders 2: NumPy Giriş",
            href: "/education/lessons/python/module-11/lesson-02",
            description: "NumPy kurulumu ve temel kavramlar",
          },
          {
            label: "Ders 3: NumPy Arrays",
            href: "/education/lessons/python/module-11/lesson-03",
            description: "NumPy array oluşturma ve işlemler",
          },
          {
            label: "Ders 4: NumPy Operations",
            href: "/education/lessons/python/module-11/lesson-04",
            description: "Matematiksel işlemler ve fonksiyonlar",
          },
          {
            label: "Ders 5: NumPy Indexing ve Slicing",
            href: "/education/lessons/python/module-11/lesson-05",
            description: "Array indeksleme ve dilimleme",
          },
          {
            label: "Ders 6: Pandas Giriş",
            href: "/education/lessons/python/module-11/lesson-06",
            description: "Pandas kurulumu ve DataFrame kavramı",
          },
          {
            label: "Ders 7: Pandas DataFrame",
            href: "/education/lessons/python/module-11/lesson-07",
            description: "DataFrame oluşturma ve temel işlemler",
          },
          {
            label: "Ders 8: Pandas Series",
            href: "/education/lessons/python/module-11/lesson-08",
            description: "Series veri yapısı",
          },
          {
            label: "Ders 9: Pandas Data Selection",
            href: "/education/lessons/python/module-11/lesson-09",
            description: "Veri seçme ve filtreleme",
          },
          {
            label: "Ders 10: Pandas Data Cleaning",
            href: "/education/lessons/python/module-11/lesson-10",
            description: "Eksik veri ve veri temizleme",
          },
          {
            label: "Ders 11: Pandas GroupBy",
            href: "/education/lessons/python/module-11/lesson-11",
            description: "Gruplama ve aggregasyon işlemleri",
          },
          {
            label: "Ders 12: Pandas Merging",
            href: "/education/lessons/python/module-11/lesson-12",
            description: "DataFrame birleştirme işlemleri",
          },
          {
            label: "Ders 13: Data Visualization",
            href: "/education/lessons/python/module-11/lesson-13",
            description: "matplotlib ve seaborn ile görselleştirme",
          },
          {
            label: "Ders 14: Data Analysis Examples",
            href: "/education/lessons/python/module-11/lesson-14",
            description: "Pratik veri analizi örnekleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Web Scraping",
        summary:
          "Web scraping, BeautifulSoup, Scrapy, HTTP requests ve web verisi çekme teknikleri.",
        durationMinutes: 450,
        objectives: [
          "Web scraping kavramını anlamak",
          "BeautifulSoup kullanmayı öğrenmek",
          "Scrapy framework'ünü kullanmak",
          "Web verisi çekme tekniklerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Web Scraping Nedir?",
            href: "/education/lessons/python/module-12/lesson-01",
            description: "Web scraping kavramı ve kullanım alanları",
          },
          {
            label: "Ders 2: HTTP Requests",
            href: "/education/lessons/python/module-12/lesson-02",
            description: "requests kütüphanesi ile HTTP istekleri",
          },
          {
            label: "Ders 3: HTML Parsing",
            href: "/education/lessons/python/module-12/lesson-03",
            description: "HTML yapısını anlama",
          },
          {
            label: "Ders 4: BeautifulSoup Giriş",
            href: "/education/lessons/python/module-12/lesson-04",
            description: "BeautifulSoup kurulumu ve temel kullanım",
          },
          {
            label: "Ders 5: BeautifulSoup Selectors",
            href: "/education/lessons/python/module-12/lesson-05",
            description: "CSS selectors ve find metodları",
          },
          {
            label: "Ders 6: BeautifulSoup Data Extraction",
            href: "/education/lessons/python/module-12/lesson-06",
            description: "Veri çıkarma ve işleme",
          },
          {
            label: "Ders 7: Scrapy Framework",
            href: "/education/lessons/python/module-12/lesson-07",
            description: "Scrapy kurulumu ve proje yapısı",
          },
          {
            label: "Ders 8: Scrapy Spiders",
            href: "/education/lessons/python/module-12/lesson-08",
            description: "Spider oluşturma ve yapılandırma",
          },
          {
            label: "Ders 9: Scrapy Items",
            href: "/education/lessons/python/module-12/lesson-09",
            description: "Item tanımlama ve data pipeline",
          },
          {
            label: "Ders 10: Handling JavaScript",
            href: "/education/lessons/python/module-12/lesson-10",
            description: "Selenium ile JavaScript içerik",
          },
          {
            label: "Ders 11: API vs Scraping",
            href: "/education/lessons/python/module-12/lesson-11",
            description: "API kullanımı vs web scraping",
          },
          {
            label: "Ders 12: Scraping Ethics",
            href: "/education/lessons/python/module-12/lesson-12",
            description: "Yasal ve etik konular",
          },
          {
            label: "Ders 13: Rate Limiting",
            href: "/education/lessons/python/module-12/lesson-13",
            description: "İstek hızı sınırlama",
          },
          {
            label: "Ders 14: Error Handling in Scraping",
            href: "/education/lessons/python/module-12/lesson-14",
            description: "Hata yönetimi ve retry mekanizmaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/python/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Deployment",
        summary:
          "Uygulama dağıtımı, Docker containerization, cloud deployment, CI/CD ve production best practices.",
        durationMinutes: 450,
        objectives: [
          "Uygulama dağıtım stratejilerini öğrenmek",
          "Docker containerization yapmak",
          "Cloud platformlara deployment yapmak",
          "CI/CD pipeline'ları kurmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Stratejileri",
            href: "/education/lessons/python/module-13/lesson-01",
            description: "Dağıtım modelleri ve seçenekleri",
          },
          {
            label: "Ders 2: Environment Configuration",
            href: "/education/lessons/python/module-13/lesson-02",
            description: "Ortam değişkenleri ve yapılandırma",
          },
          {
            label: "Ders 3: Docker Temelleri",
            href: "/education/lessons/python/module-13/lesson-03",
            description: "Docker kavramları ve kullanımı",
          },
          {
            label: "Ders 4: Dockerfile Oluşturma",
            href: "/education/lessons/python/module-13/lesson-04",
            description: "Python uygulamaları için Dockerfile",
          },
          {
            label: "Ders 5: Docker Compose",
            href: "/education/lessons/python/module-13/lesson-05",
            description: "Multi-container uygulamalar",
          },
          {
            label: "Ders 6: Virtual Environments",
            href: "/education/lessons/python/module-13/lesson-06",
            description: "venv ve virtualenv kullanımı",
          },
          {
            label: "Ders 7: Requirements Management",
            href: "/education/lessons/python/module-13/lesson-07",
            description: "requirements.txt ve dependency yönetimi",
          },
          {
            label: "Ders 8: Heroku Deployment",
            href: "/education/lessons/python/module-13/lesson-08",
            description: "Heroku'ya Python uygulaması deploy etme",
          },
          {
            label: "Ders 9: AWS Deployment",
            href: "/education/lessons/python/module-13/lesson-09",
            description: "AWS Elastic Beanstalk ve EC2",
          },
          {
            label: "Ders 10: Google Cloud Deployment",
            href: "/education/lessons/python/module-13/lesson-10",
            description: "Google App Engine ve Cloud Run",
          },
          {
            label: "Ders 11: Azure Deployment",
            href: "/education/lessons/python/module-13/lesson-11",
            description: "Azure App Service'e dağıtım",
          },
          {
            label: "Ders 12: CI/CD Concepts",
            href: "/education/lessons/python/module-13/lesson-12",
            description: "Sürekli entegrasyon ve dağıtım",
          },
          {
            label: "Ders 13: GitHub Actions",
            href: "/education/lessons/python/module-13/lesson-13",
            description: "GitHub Actions ile CI/CD",
          },
          {
            label: "Ders 14: Production Best Practices",
            href: "/education/lessons/python/module-13/lesson-14",
            description: "Production ortamı en iyi uygulamaları",
          },
          {
            label: "Ders 15: Monitoring ve Logging",
            href: "/education/lessons/python/module-13/lesson-15",
            description: "Uygulama izleme ve loglama",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices",
        summary:
          "Python geliştirmede en iyi uygulamalar, kod kalitesi, PEP 8, güvenlik, performans ve maintainability.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "PEP 8 style guide uygulamak",
          "Güvenlik best practices uygulamak",
          "Maintainable kod yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: PEP 8 Style Guide",
            href: "/education/lessons/python/module-14/lesson-01",
            description: "Python kod stil rehberi",
          },
          {
            label: "Ders 2: Code Formatting",
            href: "/education/lessons/python/module-14/lesson-02",
            description: "black, autopep8 gibi formatlayıcılar",
          },
          {
            label: "Ders 3: Linting Tools",
            href: "/education/lessons/python/module-14/lesson-03",
            description: "pylint, flake8 ile kod analizi",
          },
          {
            label: "Ders 4: Type Hints",
            href: "/education/lessons/python/module-14/lesson-04",
            description: "Type annotations ve mypy",
          },
          {
            label: "Ders 5: Docstrings",
            href: "/education/lessons/python/module-14/lesson-05",
            description: "Dokümantasyon string'leri",
          },
          {
            label: "Ders 6: Error Handling Best Practices",
            href: "/education/lessons/python/module-14/lesson-06",
            description: "Exception handling stratejileri",
          },
          {
            label: "Ders 7: Logging Best Practices",
            href: "/education/lessons/python/module-14/lesson-07",
            description: "logging modülü ve en iyi uygulamalar",
          },
          {
            label: "Ders 8: Security Best Practices",
            href: "/education/lessons/python/module-14/lesson-08",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 9: Performance Optimization",
            href: "/education/lessons/python/module-14/lesson-09",
            description: "Kod performansı optimizasyonu",
          },
          {
            label: "Ders 10: Memory Management",
            href: "/education/lessons/python/module-14/lesson-10",
            description: "Bellek yönetimi ve optimizasyon",
          },
          {
            label: "Ders 11: Code Organization",
            href: "/education/lessons/python/module-14/lesson-11",
            description: "Proje yapısı ve kod organizasyonu",
          },
          {
            label: "Ders 12: Dependency Management",
            href: "/education/lessons/python/module-14/lesson-12",
            description: "pip, pipenv, poetry kullanımı",
          },
          {
            label: "Ders 13: Code Review",
            href: "/education/lessons/python/module-14/lesson-13",
            description: "Kod inceleme en iyi uygulamaları",
          },
          {
            label: "Ders 14: Refactoring",
            href: "/education/lessons/python/module-14/lesson-14",
            description: "Kod refaktörleme teknikleri",
          },
          {
            label: "Ders 15: Continuous Improvement",
            href: "/education/lessons/python/module-14/lesson-15",
            description: "Sürekli iyileştirme kültürü",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir proje geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
        durationMinutes: 450,
        objectives: [
          "Tüm öğrenilenleri bir projede uygulamak",
          "Gerçek dünya senaryosu geliştirmek",
          "Portfolio projesi oluşturmak",
          "End-to-end uygulama geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Proje Planlama",
            href: "/education/lessons/python/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/python/module-15/lesson-02",
            description: "Sistem mimarisi tasarımı",
          },
          {
            label: "Ders 3: Database Design",
            href: "/education/lessons/python/module-15/lesson-03",
            description: "Veritabanı tasarımı ve şema",
          },
          {
            label: "Ders 4: Backend Development",
            href: "/education/lessons/python/module-15/lesson-04",
            description: "API ve backend geliştirme",
          },
          {
            label: "Ders 5: Authentication Implementation",
            href: "/education/lessons/python/module-15/lesson-05",
            description: "Kimlik doğrulama implementasyonu",
          },
          {
            label: "Ders 6: Business Logic",
            href: "/education/lessons/python/module-15/lesson-06",
            description: "İş mantığı geliştirme",
          },
          {
            label: "Ders 7: Error Handling",
            href: "/education/lessons/python/module-15/lesson-07",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 8: Testing Strategy",
            href: "/education/lessons/python/module-15/lesson-08",
            description: "Test stratejisi ve implementasyonu",
          },
          {
            label: "Ders 9: Performance Optimization",
            href: "/education/lessons/python/module-15/lesson-09",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 10: Security Hardening",
            href: "/education/lessons/python/module-15/lesson-10",
            description: "Güvenlik sertleştirme",
          },
          {
            label: "Ders 11: Documentation",
            href: "/education/lessons/python/module-15/lesson-11",
            description: "API dokümantasyonu ve kullanım kılavuzu",
          },
          {
            label: "Ders 12: Deployment Preparation",
            href: "/education/lessons/python/module-15/lesson-12",
            description: "Dağıtım hazırlığı ve yapılandırma",
          },
          {
            label: "Ders 13: CI/CD Setup",
            href: "/education/lessons/python/module-15/lesson-13",
            description: "Sürekli entegrasyon ve dağıtım kurulumu",
          },
          {
            label: "Ders 14: Monitoring and Logging",
            href: "/education/lessons/python/module-15/lesson-14",
            description: "İzleme ve loglama implementasyonu",
          },
          {
            label: "Ders 15: Project Review and Presentation",
            href: "/education/lessons/python/module-15/lesson-15",
            description: "Proje incelemesi ve sunumu",
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

