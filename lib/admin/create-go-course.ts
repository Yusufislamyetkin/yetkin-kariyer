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
 * Create complete Go (Golang) course structure with predefined content
 */
export async function createGoCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Go course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Go (Golang), Google tarafından geliştirilen açık kaynaklı bir programlama dilidir. Bu kapsamlı kurs ile Go'nun temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Yüksek performanslı, eşzamanlı programlama ve mikroservis mimarileri geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "Go programlama dilinin temel kavramlarını ve syntax'ını anlamak",
      "Goroutines ve channels ile eşzamanlı programlama yapmak",
      "Go packages ve modules yapısını öğrenmek",
      "Web uygulamaları ve RESTful API'ler geliştirmek",
      "Database işlemleri ve ORM kullanımını öğrenmek",
      "Mikroservis mimarileri geliştirmek",
      "Testing ve deployment stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Temel programlama bilgisi",
      "Veri yapıları ve algoritmalar hakkında temel bilgi",
      "HTTP ve web teknolojileri hakkında temel bilgi",
      "Command line kullanımına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Go Tanımı ve Temelleri",
        summary:
          "Go'nun ne olduğu, tarihçesi, avantajları, diğer dillerden farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "Go'nun ne olduğunu ve neden kullanıldığını anlamak",
          "Go'nun diğer programlama dillerinden farklarını öğrenmek",
          "Go'nun avantajlarını ve kullanım alanlarını keşfetmek",
          "Go'nun tasarım felsefesini anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Go Nedir?",
            href: "/education/lessons/go/module-01/lesson-01",
            description: "Go'nun temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Go diğer dillerden farkı nedir?",
            href: "/education/lessons/go/module-01/lesson-02",
            description: "Go'nun C++, Java, Python gibi dillerden farkları",
          },
          {
            label: "Ders 3: Go'nun Tarihçesi",
            href: "/education/lessons/go/module-01/lesson-03",
            description: "Go'nun ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: Go'nun Tasarım Felsefesi",
            href: "/education/lessons/go/module-01/lesson-04",
            description: "Basitlik, hız, güvenlik prensipleri",
          },
          {
            label: "Ders 5: Go'nun Avantajları",
            href: "/education/lessons/go/module-01/lesson-05",
            description: "Performans, eşzamanlılık, derleme hızı",
          },
          {
            label: "Ders 6: Go Kullanım Alanları",
            href: "/education/lessons/go/module-01/lesson-06",
            description: "Web servisleri, mikroservisler, CLI araçları",
          },
          {
            label: "Ders 7: Go Ekosistemi",
            href: "/education/lessons/go/module-01/lesson-07",
            description: "Go topluluğu ve araçlar",
          },
          {
            label: "Ders 8: Go Lisanslama",
            href: "/education/lessons/go/module-01/lesson-08",
            description: "BSD-style lisans",
          },
          {
            label: "Ders 9: Go Topluluk Desteği",
            href: "/education/lessons/go/module-01/lesson-09",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 10: Go'nun Geleceği",
            href: "/education/lessons/go/module-01/lesson-10",
            description: "Go roadmap ve gelecek planları",
          },
          {
            label: "Ders 11: Go Kurulum Gereksinimleri",
            href: "/education/lessons/go/module-01/lesson-11",
            description: "Sistem gereksinimleri",
          },
          {
            label: "Ders 12: Go ile Neler Yapılabilir?",
            href: "/education/lessons/go/module-01/lesson-12",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 13: Go Performans",
            href: "/education/lessons/go/module-01/lesson-13",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 14: Go Geliştirici Deneyimi",
            href: "/education/lessons/go/module-01/lesson-14",
            description: "IDE desteği ve tooling",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/go/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Go Kurulumu ve Yapılandırma",
        summary:
          "Go kurulumu, GOPATH, GOROOT, workspace yapısı, go.mod, go.sum ve proje yapılandırması.",
        durationMinutes: 450,
        objectives: [
          "Go kurulumunu öğrenmek",
          "Workspace yapısını anlamak",
          "Go modules kullanmayı öğrenmek",
          "Proje yapısını kurmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Go Kurulumu",
            href: "/education/lessons/go/module-02/lesson-01",
            description: "Go kurulumu ve yapılandırma",
          },
          {
            label: "Ders 2: GOPATH ve GOROOT",
            href: "/education/lessons/go/module-02/lesson-02",
            description: "Go ortam değişkenleri",
          },
          {
            label: "Ders 3: Workspace Yapısı",
            href: "/education/lessons/go/module-02/lesson-03",
            description: "Go workspace organizasyonu",
          },
          {
            label: "Ders 4: Go Modules",
            href: "/education/lessons/go/module-02/lesson-04",
            description: "go.mod ve go.sum dosyaları",
          },
          {
            label: "Ders 5: go mod init",
            href: "/education/lessons/go/module-02/lesson-05",
            description: "Yeni modül oluşturma",
          },
          {
            label: "Ders 6: go get ve go install",
            href: "/education/lessons/go/module-02/lesson-06",
            description: "Paket yükleme ve kurulum",
          },
          {
            label: "Ders 7: go build ve go run",
            href: "/education/lessons/go/module-02/lesson-07",
            description: "Derleme ve çalıştırma",
          },
          {
            label: "Ders 8: go test",
            href: "/education/lessons/go/module-02/lesson-08",
            description: "Test çalıştırma",
          },
          {
            label: "Ders 9: go fmt ve go vet",
            href: "/education/lessons/go/module-02/lesson-09",
            description: "Kod formatlama ve kontrol",
          },
          {
            label: "Ders 10: IDE Integration",
            href: "/education/lessons/go/module-02/lesson-10",
            description: "VS Code, GoLand entegrasyonu",
          },
          {
            label: "Ders 11: Environment Variables",
            href: "/education/lessons/go/module-02/lesson-11",
            description: "Ortam değişkenleri yönetimi",
          },
          {
            label: "Ders 12: Cross-Compilation",
            href: "/education/lessons/go/module-02/lesson-12",
            description: "Farklı platformlar için derleme",
          },
          {
            label: "Ders 13: Build Tags",
            href: "/education/lessons/go/module-02/lesson-13",
            description: "Koşullu derleme",
          },
          {
            label: "Ders 14: Go Best Practices",
            href: "/education/lessons/go/module-02/lesson-14",
            description: "Yapılandırma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Go Syntax ve Temel Kavramlar",
        summary:
          "Go syntax, değişkenler, veri tipleri, operatörler, kontrol yapıları, döngüler ve fonksiyonlar.",
        durationMinutes: 450,
        objectives: [
          "Go syntax kurallarını öğrenmek",
          "Veri tipleri ve değişken kullanımını anlamak",
          "Kontrol yapılarını kullanmak",
          "Fonksiyon tanımlamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Go Syntax Temelleri",
            href: "/education/lessons/go/module-03/lesson-01",
            description: "Go syntax kuralları",
          },
          {
            label: "Ders 2: Değişkenler ve Sabitler",
            href: "/education/lessons/go/module-03/lesson-02",
            description: "var, const, := kullanımı",
          },
          {
            label: "Ders 3: Veri Tipleri",
            href: "/education/lessons/go/module-03/lesson-03",
            description: "int, string, bool, float64",
          },
          {
            label: "Ders 4: Operatörler",
            href: "/education/lessons/go/module-03/lesson-04",
            description: "Aritmetik, karşılaştırma, mantıksal",
          },
          {
            label: "Ders 5: if-else Statements",
            href: "/education/lessons/go/module-03/lesson-05",
            description: "Koşullu ifadeler",
          },
          {
            label: "Ders 6: switch Statements",
            href: "/education/lessons/go/module-03/lesson-06",
            description: "Switch-case yapısı",
          },
          {
            label: "Ders 7: for Loops",
            href: "/education/lessons/go/module-03/lesson-07",
            description: "Döngü yapıları",
          },
          {
            label: "Ders 8: Arrays ve Slices",
            href: "/education/lessons/go/module-03/lesson-08",
            description: "Dizi ve slice kullanımı",
          },
          {
            label: "Ders 9: Maps",
            href: "/education/lessons/go/module-03/lesson-09",
            description: "Map veri yapısı",
          },
          {
            label: "Ders 10: Functions",
            href: "/education/lessons/go/module-03/lesson-10",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 11: Multiple Return Values",
            href: "/education/lessons/go/module-03/lesson-11",
            description: "Çoklu dönüş değerleri",
          },
          {
            label: "Ders 12: Variadic Functions",
            href: "/education/lessons/go/module-03/lesson-12",
            description: "Değişken sayıda parametre",
          },
          {
            label: "Ders 13: Defer Statement",
            href: "/education/lessons/go/module-03/lesson-13",
            description: "Defer kullanımı",
          },
          {
            label: "Ders 14: Pointers",
            href: "/education/lessons/go/module-03/lesson-14",
            description: "Pointer kavramı ve kullanımı",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Packages ve Modules",
        summary:
          "Go packages, package organization, imports, exports, module system ve package management.",
        durationMinutes: 450,
        objectives: [
          "Package kavramını anlamak",
          "Package oluşturmayı öğrenmek",
          "Import ve export kullanmayı öğrenmek",
          "Module system kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Packages Nedir?",
            href: "/education/lessons/go/module-04/lesson-01",
            description: "Package kavramı",
          },
          {
            label: "Ders 2: Package Declaration",
            href: "/education/lessons/go/module-04/lesson-02",
            description: "package anahtar kelimesi",
          },
          {
            label: "Ders 3: Import Statements",
            href: "/education/lessons/go/module-04/lesson-03",
            description: "Paket import etme",
          },
          {
            label: "Ders 4: Exported vs Unexported",
            href: "/education/lessons/go/module-04/lesson-04",
            description: "Büyük/küçük harf kuralları",
          },
          {
            label: "Ders 5: Standard Library Packages",
            href: "/education/lessons/go/module-04/lesson-05",
            description: "Go standart kütüphanesi",
          },
          {
            label: "Ders 6: Custom Packages",
            href: "/education/lessons/go/module-04/lesson-06",
            description: "Özel paket oluşturma",
          },
          {
            label: "Ders 7: Package Organization",
            href: "/education/lessons/go/module-04/lesson-07",
            description: "Paket organizasyonu",
          },
          {
            label: "Ders 8: Module System",
            href: "/education/lessons/go/module-04/lesson-08",
            description: "Go modules",
          },
          {
            label: "Ders 9: go.mod File",
            href: "/education/lessons/go/module-04/lesson-09",
            description: "Modül tanımlama",
          },
          {
            label: "Ders 10: Version Management",
            href: "/education/lessons/go/module-04/lesson-10",
            description: "Paket versiyon yönetimi",
          },
          {
            label: "Ders 11: Private Modules",
            href: "/education/lessons/go/module-04/lesson-11",
            description: "Özel modül kullanımı",
          },
          {
            label: "Ders 12: Package Aliasing",
            href: "/education/lessons/go/module-04/lesson-12",
            description: "Paket takma adları",
          },
          {
            label: "Ders 13: Blank Imports",
            href: "/education/lessons/go/module-04/lesson-13",
            description: "Side-effect imports",
          },
          {
            label: "Ders 14: Package Best Practices",
            href: "/education/lessons/go/module-04/lesson-14",
            description: "Paket kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Functions ve Methods",
        summary:
          "Go functions, methods, function types, closures, higher-order functions ve function composition.",
        durationMinutes: 450,
        objectives: [
          "Function kavramını anlamak",
          "Method tanımlamayı öğrenmek",
          "Function types kullanmayı öğrenmek",
          "Closures ve higher-order functions kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Functions Temelleri",
            href: "/education/lessons/go/module-05/lesson-01",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 2: Function Parameters",
            href: "/education/lessons/go/module-05/lesson-02",
            description: "Parametre tanımlama",
          },
          {
            label: "Ders 3: Return Values",
            href: "/education/lessons/go/module-05/lesson-03",
            description: "Dönüş değerleri",
          },
          {
            label: "Ders 4: Named Return Values",
            href: "/education/lessons/go/module-05/lesson-04",
            description: "İsimlendirilmiş dönüş değerleri",
          },
          {
            label: "Ders 5: Methods",
            href: "/education/lessons/go/module-05/lesson-05",
            description: "Method tanımlama",
          },
          {
            label: "Ders 6: Value vs Pointer Receivers",
            href: "/education/lessons/go/module-05/lesson-06",
            description: "Receiver tipleri",
          },
          {
            label: "Ders 7: Function Types",
            href: "/education/lessons/go/module-05/lesson-07",
            description: "Fonksiyon tipi tanımlama",
          },
          {
            label: "Ders 8: Closures",
            href: "/education/lessons/go/module-05/lesson-08",
            description: "Closure kavramı",
          },
          {
            label: "Ders 9: Higher-Order Functions",
            href: "/education/lessons/go/module-05/lesson-09",
            description: "Yüksek dereceli fonksiyonlar",
          },
          {
            label: "Ders 10: Anonymous Functions",
            href: "/education/lessons/go/module-05/lesson-10",
            description: "İsimsiz fonksiyonlar",
          },
          {
            label: "Ders 11: Function Composition",
            href: "/education/lessons/go/module-05/lesson-11",
            description: "Fonksiyon birleştirme",
          },
          {
            label: "Ders 12: Recursion",
            href: "/education/lessons/go/module-05/lesson-12",
            description: "Özyineleme",
          },
          {
            label: "Ders 13: Function Best Practices",
            href: "/education/lessons/go/module-05/lesson-13",
            description: "Fonksiyon tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Error Handling in Functions",
            href: "/education/lessons/go/module-05/lesson-14",
            description: "Fonksiyonlarda hata yönetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Structs ve Interfaces",
        summary:
          "Go structs, struct methods, interfaces, interface implementation, type assertions ve polymorphism.",
        durationMinutes: 450,
        objectives: [
          "Struct kavramını anlamak",
          "Struct tanımlamayı öğrenmek",
          "Interface kavramını anlamak",
          "Polymorphism uygulamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Structs Nedir?",
            href: "/education/lessons/go/module-06/lesson-01",
            description: "Struct kavramı",
          },
          {
            label: "Ders 2: Struct Definition",
            href: "/education/lessons/go/module-06/lesson-02",
            description: "Struct tanımlama",
          },
          {
            label: "Ders 3: Struct Fields",
            href: "/education/lessons/go/module-06/lesson-03",
            description: "Struct alanları",
          },
          {
            label: "Ders 4: Struct Initialization",
            href: "/education/lessons/go/module-06/lesson-04",
            description: "Struct başlatma",
          },
          {
            label: "Ders 5: Struct Methods",
            href: "/education/lessons/go/module-06/lesson-05",
            description: "Struct metodları",
          },
          {
            label: "Ders 6: Embedded Structs",
            href: "/education/lessons/go/module-06/lesson-06",
            description: "İç içe struct'lar",
          },
          {
            label: "Ders 7: Interfaces Nedir?",
            href: "/education/lessons/go/module-06/lesson-07",
            description: "Interface kavramı",
          },
          {
            label: "Ders 8: Interface Definition",
            href: "/education/lessons/go/module-06/lesson-08",
            description: "Interface tanımlama",
          },
          {
            label: "Ders 9: Interface Implementation",
            href: "/education/lessons/go/module-06/lesson-09",
            description: "Interface implementasyonu",
          },
          {
            label: "Ders 10: Empty Interface",
            href: "/education/lessons/go/module-06/lesson-10",
            description: "interface{} kullanımı",
          },
          {
            label: "Ders 11: Type Assertions",
            href: "/education/lessons/go/module-06/lesson-11",
            description: "Tip kontrolü",
          },
          {
            label: "Ders 12: Type Switches",
            href: "/education/lessons/go/module-06/lesson-12",
            description: "Tip switch'leri",
          },
          {
            label: "Ders 13: Polymorphism",
            href: "/education/lessons/go/module-06/lesson-13",
            description: "Çok biçimlilik",
          },
          {
            label: "Ders 14: Interface Best Practices",
            href: "/education/lessons/go/module-06/lesson-14",
            description: "Interface kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Goroutines ve Channels",
        summary:
          "Go concurrency, goroutines, channels, select statement, channel patterns ve synchronization.",
        durationMinutes: 450,
        objectives: [
          "Concurrency kavramını anlamak",
          "Goroutines kullanmayı öğrenmek",
          "Channels kullanmayı öğrenmek",
          "Synchronization yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Concurrency Nedir?",
            href: "/education/lessons/go/module-07/lesson-01",
            description: "Eşzamanlılık kavramı",
          },
          {
            label: "Ders 2: Goroutines",
            href: "/education/lessons/go/module-07/lesson-02",
            description: "Goroutine oluşturma",
          },
          {
            label: "Ders 3: Goroutine Lifecycle",
            href: "/education/lessons/go/module-07/lesson-03",
            description: "Goroutine yaşam döngüsü",
          },
          {
            label: "Ders 4: Channels Nedir?",
            href: "/education/lessons/go/module-07/lesson-04",
            description: "Channel kavramı",
          },
          {
            label: "Ders 5: Channel Creation",
            href: "/education/lessons/go/module-07/lesson-05",
            description: "Channel oluşturma",
          },
          {
            label: "Ders 6: Channel Operations",
            href: "/education/lessons/go/module-07/lesson-06",
            description: "Channel gönderme/alma",
          },
          {
            label: "Ders 7: Buffered Channels",
            href: "/education/lessons/go/module-07/lesson-07",
            description: "Tamponlu channel'lar",
          },
          {
            label: "Ders 8: Channel Direction",
            href: "/education/lessons/go/module-07/lesson-08",
            description: "Tek yönlü channel'lar",
          },
          {
            label: "Ders 9: Select Statement",
            href: "/education/lessons/go/module-07/lesson-09",
            description: "select kullanımı",
          },
          {
            label: "Ders 10: Channel Patterns",
            href: "/education/lessons/go/module-07/lesson-10",
            description: "Yaygın channel desenleri",
          },
          {
            label: "Ders 11: sync Package",
            href: "/education/lessons/go/module-07/lesson-11",
            description: "WaitGroup, Mutex",
          },
          {
            label: "Ders 12: Context Package",
            href: "/education/lessons/go/module-07/lesson-12",
            description: "Context kullanımı",
          },
          {
            label: "Ders 13: Race Conditions",
            href: "/education/lessons/go/module-07/lesson-13",
            description: "Yarış durumları ve önleme",
          },
          {
            label: "Ders 14: Concurrency Best Practices",
            href: "/education/lessons/go/module-07/lesson-14",
            description: "Eşzamanlılık en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Error Handling",
        summary:
          "Go error handling, error interface, error wrapping, custom errors, panic, recover ve error best practices.",
        durationMinutes: 450,
        objectives: [
          "Error handling kavramını anlamak",
          "Error interface kullanmayı öğrenmek",
          "Custom errors oluşturmayı öğrenmek",
          "Panic ve recover kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Error Handling Temelleri",
            href: "/education/lessons/go/module-08/lesson-01",
            description: "Go error handling yaklaşımı",
          },
          {
            label: "Ders 2: error Interface",
            href: "/education/lessons/go/module-08/lesson-02",
            description: "error interface yapısı",
          },
          {
            label: "Ders 3: Error Return Pattern",
            href: "/education/lessons/go/module-08/lesson-03",
            description: "Hata döndürme deseni",
          },
          {
            label: "Ders 4: Error Checking",
            href: "/education/lessons/go/module-08/lesson-04",
            description: "Hata kontrolü",
          },
          {
            label: "Ders 5: Custom Errors",
            href: "/education/lessons/go/module-08/lesson-05",
            description: "Özel hata tipleri",
          },
          {
            label: "Ders 6: Error Wrapping",
            href: "/education/lessons/go/module-08/lesson-06",
            description: "fmt.Errorf ve errors.Wrap",
          },
          {
            label: "Ders 7: errors.Is ve errors.As",
            href: "/education/lessons/go/module-08/lesson-07",
            description: "Hata kontrol fonksiyonları",
          },
          {
            label: "Ders 8: Panic",
            href: "/education/lessons/go/module-08/lesson-08",
            description: "panic kullanımı",
          },
          {
            label: "Ders 9: Recover",
            href: "/education/lessons/go/module-08/lesson-09",
            description: "recover kullanımı",
          },
          {
            label: "Ders 10: Defer ve Error Handling",
            href: "/education/lessons/go/module-08/lesson-10",
            description: "defer ile hata yönetimi",
          },
          {
            label: "Ders 11: Error Logging",
            href: "/education/lessons/go/module-08/lesson-11",
            description: "Hata loglama",
          },
          {
            label: "Ders 12: Error Context",
            href: "/education/lessons/go/module-08/lesson-12",
            description: "Hata bağlamı ekleme",
          },
          {
            label: "Ders 13: Error Best Practices",
            href: "/education/lessons/go/module-08/lesson-13",
            description: "Hata yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Error Patterns",
            href: "/education/lessons/go/module-08/lesson-14",
            description: "Yaygın hata desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Testing",
        summary:
          "Go testing, unit tests, table-driven tests, benchmarks, test coverage, mocking ve integration tests.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "Benchmark test yazmayı öğrenmek",
          "Test coverage analizi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/go/module-09/lesson-01",
            description: "Go testing yaklaşımı",
          },
          {
            label: "Ders 2: Test Functions",
            href: "/education/lessons/go/module-09/lesson-02",
            description: "Test fonksiyonu yazma",
          },
          {
            label: "Ders 3: Testing Package",
            href: "/education/lessons/go/module-09/lesson-03",
            description: "testing paketi",
          },
          {
            label: "Ders 4: Test Execution",
            href: "/education/lessons/go/module-09/lesson-04",
            description: "go test komutu",
          },
          {
            label: "Ders 5: Table-Driven Tests",
            href: "/education/lessons/go/module-09/lesson-05",
            description: "Tablo tabanlı testler",
          },
          {
            label: "Ders 6: Subtests",
            href: "/education/lessons/go/module-09/lesson-06",
            description: "Alt testler",
          },
          {
            label: "Ders 7: Benchmarks",
            href: "/education/lessons/go/module-09/lesson-07",
            description: "Benchmark testleri",
          },
          {
            label: "Ders 8: Test Coverage",
            href: "/education/lessons/go/module-09/lesson-08",
            description: "Test kapsamı analizi",
          },
          {
            label: "Ders 9: Test Helpers",
            href: "/education/lessons/go/module-09/lesson-09",
            description: "Test yardımcı fonksiyonları",
          },
          {
            label: "Ders 10: Mocking",
            href: "/education/lessons/go/module-09/lesson-10",
            description: "Mock objeler",
          },
          {
            label: "Ders 11: Integration Tests",
            href: "/education/lessons/go/module-09/lesson-11",
            description: "Entegrasyon testleri",
          },
          {
            label: "Ders 12: Test Fixtures",
            href: "/education/lessons/go/module-09/lesson-12",
            description: "Test verileri",
          },
          {
            label: "Ders 13: Test Organization",
            href: "/education/lessons/go/module-09/lesson-13",
            description: "Test organizasyonu",
          },
          {
            label: "Ders 14: Testing Best Practices",
            href: "/education/lessons/go/module-09/lesson-14",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Web Development",
        summary:
          "Go web development, net/http package, HTTP handlers, routing, middleware, templates ve RESTful APIs.",
        durationMinutes: 450,
        objectives: [
          "Web development kavramını anlamak",
          "HTTP server oluşturmayı öğrenmek",
          "Routing yapmayı öğrenmek",
          "RESTful API geliştirmeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Web Development Temelleri",
            href: "/education/lessons/go/module-10/lesson-01",
            description: "Go web geliştirme yaklaşımı",
          },
          {
            label: "Ders 2: net/http Package",
            href: "/education/lessons/go/module-10/lesson-02",
            description: "HTTP paketi",
          },
          {
            label: "Ders 3: HTTP Server",
            href: "/education/lessons/go/module-10/lesson-03",
            description: "HTTP sunucu oluşturma",
          },
          {
            label: "Ders 4: HTTP Handlers",
            href: "/education/lessons/go/module-10/lesson-04",
            description: "Handler fonksiyonları",
          },
          {
            label: "Ders 5: Request ve Response",
            href: "/education/lessons/go/module-10/lesson-05",
            description: "HTTP request/response",
          },
          {
            label: "Ders 6: Routing",
            href: "/education/lessons/go/module-10/lesson-06",
            description: "URL routing",
          },
          {
            label: "Ders 7: URL Parameters",
            href: "/education/lessons/go/module-10/lesson-07",
            description: "URL parametreleri",
          },
          {
            label: "Ders 8: Query Parameters",
            href: "/education/lessons/go/module-10/lesson-08",
            description: "Query string",
          },
          {
            label: "Ders 9: Middleware",
            href: "/education/lessons/go/module-10/lesson-09",
            description: "Middleware pattern",
          },
          {
            label: "Ders 10: Templates",
            href: "/education/lessons/go/module-10/lesson-10",
            description: "HTML template'ler",
          },
          {
            label: "Ders 11: JSON Handling",
            href: "/education/lessons/go/module-10/lesson-11",
            description: "JSON encode/decode",
          },
          {
            label: "Ders 12: RESTful API",
            href: "/education/lessons/go/module-10/lesson-12",
            description: "REST API geliştirme",
          },
          {
            label: "Ders 13: HTTP Client",
            href: "/education/lessons/go/module-10/lesson-13",
            description: "HTTP istekleri gönderme",
          },
          {
            label: "Ders 14: Web Best Practices",
            href: "/education/lessons/go/module-10/lesson-14",
            description: "Web geliştirme en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Database Integration",
        summary:
          "Go database integration, database/sql package, SQL queries, prepared statements, transactions ve ORM.",
        durationMinutes: 450,
        objectives: [
          "Database integration kavramını anlamak",
          "database/sql kullanmayı öğrenmek",
          "SQL queries yazmayı öğrenmek",
          "ORM kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Database Integration Temelleri",
            href: "/education/lessons/go/module-11/lesson-01",
            description: "Go database yaklaşımı",
          },
          {
            label: "Ders 2: database/sql Package",
            href: "/education/lessons/go/module-11/lesson-02",
            description: "SQL paketi",
          },
          {
            label: "Ders 3: Database Connection",
            href: "/education/lessons/go/module-11/lesson-03",
            description: "Veritabanı bağlantısı",
          },
          {
            label: "Ders 4: Connection Pooling",
            href: "/education/lessons/go/module-11/lesson-04",
            description: "Bağlantı havuzlama",
          },
          {
            label: "Ders 5: SQL Queries",
            href: "/education/lessons/go/module-11/lesson-05",
            description: "SQL sorguları",
          },
          {
            label: "Ders 6: Prepared Statements",
            href: "/education/lessons/go/module-11/lesson-06",
            description: "Hazırlanmış ifadeler",
          },
          {
            label: "Ders 7: Transactions",
            href: "/education/lessons/go/module-11/lesson-07",
            description: "Transaction yönetimi",
          },
          {
            label: "Ders 8: Rows Scanning",
            href: "/education/lessons/go/module-11/lesson-08",
            description: "Sonuç satırlarını okuma",
          },
          {
            label: "Ders 9: GORM ORM",
            href: "/education/lessons/go/module-11/lesson-09",
            description: "GORM kullanımı",
          },
          {
            label: "Ders 10: Database Migrations",
            href: "/education/lessons/go/module-11/lesson-10",
            description: "Veritabanı migration'ları",
          },
          {
            label: "Ders 11: Multiple Databases",
            href: "/education/lessons/go/module-11/lesson-11",
            description: "Çoklu veritabanı",
          },
          {
            label: "Ders 12: Database Best Practices",
            href: "/education/lessons/go/module-11/lesson-12",
            description: "Veritabanı kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Performance Optimization",
            href: "/education/lessons/go/module-11/lesson-13",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 14: Error Handling",
            href: "/education/lessons/go/module-11/lesson-14",
            description: "Veritabanı hata yönetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Microservices",
        summary:
          "Go microservices, service communication, gRPC, message queues, service discovery ve distributed systems.",
        durationMinutes: 450,
        objectives: [
          "Microservices kavramını anlamak",
          "Service communication yapmayı öğrenmek",
          "gRPC kullanmayı öğrenmek",
          "Distributed systems desenlerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Microservices Mimarisi",
            href: "/education/lessons/go/module-12/lesson-01",
            description: "Mikroservis kavramı",
          },
          {
            label: "Ders 2: Service Communication",
            href: "/education/lessons/go/module-12/lesson-02",
            description: "Servis iletişimi",
          },
          {
            label: "Ders 3: RESTful Communication",
            href: "/education/lessons/go/module-12/lesson-03",
            description: "HTTP/REST iletişim",
          },
          {
            label: "Ders 4: gRPC",
            href: "/education/lessons/go/module-12/lesson-04",
            description: "gRPC protokolü",
          },
          {
            label: "Ders 5: Protocol Buffers",
            href: "/education/lessons/go/module-12/lesson-05",
            description: "protobuf kullanımı",
          },
          {
            label: "Ders 6: Message Queues",
            href: "/education/lessons/go/module-12/lesson-06",
            description: "RabbitMQ, Kafka",
          },
          {
            label: "Ders 7: Service Discovery",
            href: "/education/lessons/go/module-12/lesson-07",
            description: "Servis keşfi",
          },
          {
            label: "Ders 8: API Gateway",
            href: "/education/lessons/go/module-12/lesson-08",
            description: "API Gateway pattern",
          },
          {
            label: "Ders 9: Circuit Breaker",
            href: "/education/lessons/go/module-12/lesson-09",
            description: "Circuit breaker deseni",
          },
          {
            label: "Ders 10: Distributed Tracing",
            href: "/education/lessons/go/module-12/lesson-10",
            description: "Dağıtık izleme",
          },
          {
            label: "Ders 11: Service Mesh",
            href: "/education/lessons/go/module-12/lesson-11",
            description: "Service mesh kavramı",
          },
          {
            label: "Ders 12: Microservices Testing",
            href: "/education/lessons/go/module-12/lesson-12",
            description: "Mikroservis testleri",
          },
          {
            label: "Ders 13: Microservices Best Practices",
            href: "/education/lessons/go/module-12/lesson-13",
            description: "Mikroservis en iyi uygulamaları",
          },
          {
            label: "Ders 14: Deployment Strategies",
            href: "/education/lessons/go/module-12/lesson-14",
            description: "Dağıtım stratejileri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Performance Optimization",
        summary:
          "Go performance optimization, profiling, memory management, garbage collection, benchmarking ve optimization techniques.",
        durationMinutes: 450,
        objectives: [
          "Performance optimization tekniklerini öğrenmek",
          "Profiling yapmayı öğrenmek",
          "Memory management yapmayı öğrenmek",
          "Optimization techniques uygulamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/go/module-13/lesson-01",
            description: "Performans ölçümü",
          },
          {
            label: "Ders 2: Profiling Tools",
            href: "/education/lessons/go/module-13/lesson-02",
            description: "pprof kullanımı",
          },
          {
            label: "Ders 3: CPU Profiling",
            href: "/education/lessons/go/module-13/lesson-03",
            description: "CPU profil analizi",
          },
          {
            label: "Ders 4: Memory Profiling",
            href: "/education/lessons/go/module-13/lesson-04",
            description: "Bellek profil analizi",
          },
          {
            label: "Ders 5: Garbage Collection",
            href: "/education/lessons/go/module-13/lesson-05",
            description: "Çöp toplama mekanizması",
          },
          {
            label: "Ders 6: Memory Management",
            href: "/education/lessons/go/module-13/lesson-06",
            description: "Bellek yönetimi",
          },
          {
            label: "Ders 7: Benchmarking",
            href: "/education/lessons/go/module-13/lesson-07",
            description: "Benchmark testleri",
          },
          {
            label: "Ders 8: Optimization Techniques",
            href: "/education/lessons/go/module-13/lesson-08",
            description: "Optimizasyon teknikleri",
          },
          {
            label: "Ders 9: Code Optimization",
            href: "/education/lessons/go/module-13/lesson-09",
            description: "Kod optimizasyonu",
          },
          {
            label: "Ders 10: Algorithm Optimization",
            href: "/education/lessons/go/module-13/lesson-10",
            description: "Algoritma optimizasyonu",
          },
          {
            label: "Ders 11: Concurrency Optimization",
            href: "/education/lessons/go/module-13/lesson-11",
            description: "Eşzamanlılık optimizasyonu",
          },
          {
            label: "Ders 12: I/O Optimization",
            href: "/education/lessons/go/module-13/lesson-12",
            description: "Girdi/çıktı optimizasyonu",
          },
          {
            label: "Ders 13: Performance Monitoring",
            href: "/education/lessons/go/module-13/lesson-13",
            description: "Performans izleme",
          },
          {
            label: "Ders 14: Performance Best Practices",
            href: "/education/lessons/go/module-13/lesson-14",
            description: "Performans en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Deployment",
        summary:
          "Go deployment, Docker containerization, CI/CD pipelines, cloud deployment ve production best practices.",
        durationMinutes: 450,
        objectives: [
          "Deployment stratejilerini öğrenmek",
          "Docker containerization yapmayı öğrenmek",
          "CI/CD pipeline'ları kurmayı öğrenmek",
          "Cloud deployment yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Stratejileri",
            href: "/education/lessons/go/module-14/lesson-01",
            description: "Dağıtım modelleri",
          },
          {
            label: "Ders 2: Build Process",
            href: "/education/lessons/go/module-14/lesson-02",
            description: "Derleme süreci",
          },
          {
            label: "Ders 3: Static Binary",
            href: "/education/lessons/go/module-14/lesson-03",
            description: "Statik binary oluşturma",
          },
          {
            label: "Ders 4: Docker Temelleri",
            href: "/education/lessons/go/module-14/lesson-04",
            description: "Docker kavramları",
          },
          {
            label: "Ders 5: Dockerfile Oluşturma",
            href: "/education/lessons/go/module-14/lesson-05",
            description: "Go için Dockerfile",
          },
          {
            label: "Ders 6: Multi-Stage Builds",
            href: "/education/lessons/go/module-14/lesson-06",
            description: "Çok aşamalı derleme",
          },
          {
            label: "Ders 7: Docker Compose",
            href: "/education/lessons/go/module-14/lesson-07",
            description: "Multi-container uygulamalar",
          },
          {
            label: "Ders 8: CI/CD Concepts",
            href: "/education/lessons/go/module-14/lesson-08",
            description: "Sürekli entegrasyon",
          },
          {
            label: "Ders 9: GitHub Actions",
            href: "/education/lessons/go/module-14/lesson-09",
            description: "GitHub Actions CI/CD",
          },
          {
            label: "Ders 10: Cloud Deployment",
            href: "/education/lessons/go/module-14/lesson-10",
            description: "AWS, GCP, Azure deployment",
          },
          {
            label: "Ders 11: Kubernetes Deployment",
            href: "/education/lessons/go/module-14/lesson-11",
            description: "Kubernetes ile dağıtım",
          },
          {
            label: "Ders 12: Environment Configuration",
            href: "/education/lessons/go/module-14/lesson-12",
            description: "Ortam yapılandırması",
          },
          {
            label: "Ders 13: Monitoring ve Logging",
            href: "/education/lessons/go/module-14/lesson-13",
            description: "Production monitoring",
          },
          {
            label: "Ders 14: Deployment Best Practices",
            href: "/education/lessons/go/module-14/lesson-14",
            description: "Deployment en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/go/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "Go geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir proje geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir proje geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/go/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/go/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Code Organization",
            href: "/education/lessons/go/module-15/lesson-03",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 4: Documentation",
            href: "/education/lessons/go/module-15/lesson-04",
            description: "Kod dokümantasyonu",
          },
          {
            label: "Ders 5: Error Handling Best Practices",
            href: "/education/lessons/go/module-15/lesson-05",
            description: "Hata yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 6: Security Best Practices",
            href: "/education/lessons/go/module-15/lesson-06",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 7: Proje Planlama",
            href: "/education/lessons/go/module-15/lesson-07",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 8: Mimari Tasarım",
            href: "/education/lessons/go/module-15/lesson-08",
            description: "Sistem mimarisi",
          },
          {
            label: "Ders 9: Core Implementation",
            href: "/education/lessons/go/module-15/lesson-09",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 10: API Development",
            href: "/education/lessons/go/module-15/lesson-10",
            description: "RESTful API geliştirme",
          },
          {
            label: "Ders 11: Database Integration",
            href: "/education/lessons/go/module-15/lesson-11",
            description: "Veritabanı entegrasyonu",
          },
          {
            label: "Ders 12: Testing Strategy",
            href: "/education/lessons/go/module-15/lesson-12",
            description: "Test stratejisi",
          },
          {
            label: "Ders 13: Performance Optimization",
            href: "/education/lessons/go/module-15/lesson-13",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 14: Deployment ve CI/CD",
            href: "/education/lessons/go/module-15/lesson-14",
            description: "Dağıtım ve sürekli entegrasyon",
          },
          {
            label: "Ders 15: Project Review ve Presentation",
            href: "/education/lessons/go/module-15/lesson-15",
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

