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
 * Create complete Swift course structure with predefined content
 */
export async function createSwiftCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Swift course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Swift, Apple'ın geliştirdiği modern, güvenli ve güçlü bir programlama dilidir. Bu kapsamlı kurs ile Swift'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. iOS, macOS, watchOS ve tvOS uygulamaları geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "Swift programlama dilinin temel kavramlarını ve syntax'ını anlamak",
      "Optionals, Collections ve Control Flow kullanmayı öğrenmek",
      "Object-Oriented Programming ve Protocol-Oriented Programming yapmak",
      "Closures, Generics ve Error Handling kullanmayı öğrenmek",
      "UIKit ve SwiftUI ile iOS uygulamaları geliştirmek",
      "Memory management ve ARC (Automatic Reference Counting) anlamak",
      "Testing ve deployment stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Temel programlama bilgisi",
      "Object-Oriented Programming kavramlarına aşinalık",
      "Mac bilgisayar (iOS geliştirme için)",
      "Xcode kurulumu (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Swift Tanımı ve Temelleri",
        summary:
          "Swift'in ne olduğu, tarihçesi, avantajları, diğer dillerden farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "Swift'in ne olduğunu ve neden kullanıldığını anlamak",
          "Swift'in Objective-C ve diğer dillerden farklarını öğrenmek",
          "Swift'in avantajlarını ve kullanım alanlarını keşfetmek",
          "Swift Playgrounds ile tanışmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Swift Nedir?",
            href: "/education/lessons/swift/module-01/lesson-01",
            description: "Swift'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Swift vs Objective-C",
            href: "/education/lessons/swift/module-01/lesson-02",
            description: "Swift ve Objective-C karşılaştırması",
          },
          {
            label: "Ders 3: Swift'in Tarihçesi",
            href: "/education/lessons/swift/module-01/lesson-03",
            description: "Swift'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: Swift'in Avantajları",
            href: "/education/lessons/swift/module-01/lesson-04",
            description: "Güvenlik, hız, modern syntax",
          },
          {
            label: "Ders 5: Swift Kullanım Alanları",
            href: "/education/lessons/swift/module-01/lesson-05",
            description: "iOS, macOS, watchOS, tvOS",
          },
          {
            label: "Ders 6: Swift Ekosistemi",
            href: "/education/lessons/swift/module-01/lesson-06",
            description: "Xcode, Swift Package Manager, CocoaPods",
          },
          {
            label: "Ders 7: Swift Lisanslama",
            href: "/education/lessons/swift/module-01/lesson-07",
            description: "Apache 2.0 lisansı",
          },
          {
            label: "Ders 8: Swift Topluluk Desteği",
            href: "/education/lessons/swift/module-01/lesson-08",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 9: Swift'in Geleceği",
            href: "/education/lessons/swift/module-01/lesson-09",
            description: "Swift roadmap",
          },
          {
            label: "Ders 10: Swift Kurulum Gereksinimleri",
            href: "/education/lessons/swift/module-01/lesson-10",
            description: "Xcode ve sistem gereksinimleri",
          },
          {
            label: "Ders 11: Swift ile Neler Yapılabilir?",
            href: "/education/lessons/swift/module-01/lesson-11",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 12: Swift Performans",
            href: "/education/lessons/swift/module-01/lesson-12",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 13: Swift Geliştirici Deneyimi",
            href: "/education/lessons/swift/module-01/lesson-13",
            description: "Xcode IDE desteği",
          },
          {
            label: "Ders 14: Swift Güvenlik",
            href: "/education/lessons/swift/module-01/lesson-14",
            description: "Güvenlik özellikleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/swift/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Swift Kurulumu ve Xcode",
        summary:
          "Xcode kurulumu, Swift Playgrounds, proje oluşturma, Xcode interface, debugging ve temel geliştirme ortamı.",
        durationMinutes: 450,
        objectives: [
          "Xcode kurulumunu öğrenmek",
          "Swift Playgrounds kullanmayı öğrenmek",
          "Xcode interface'i anlamak",
          "Proje oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Xcode Kurulumu",
            href: "/education/lessons/swift/module-02/lesson-01",
            description: "Xcode indirme ve kurulum",
          },
          {
            label: "Ders 2: Xcode Interface",
            href: "/education/lessons/swift/module-02/lesson-02",
            description: "Xcode arayüzü",
          },
          {
            label: "Ders 3: Swift Playgrounds",
            href: "/education/lessons/swift/module-02/lesson-03",
            description: "Playground kullanımı",
          },
          {
            label: "Ders 4: Yeni Proje Oluşturma",
            href: "/education/lessons/swift/module-02/lesson-04",
            description: "Xcode projesi oluşturma",
          },
          {
            label: "Ders 5: Project Structure",
            href: "/education/lessons/swift/module-02/lesson-05",
            description: "Proje yapısı",
          },
          {
            label: "Ders 6: Build ve Run",
            href: "/education/lessons/swift/module-02/lesson-06",
            description: "Derleme ve çalıştırma",
          },
          {
            label: "Ders 7: Debugging",
            href: "/education/lessons/swift/module-02/lesson-07",
            description: "Hata ayıklama",
          },
          {
            label: "Ders 8: Breakpoints",
            href: "/education/lessons/swift/module-02/lesson-08",
            description: "Breakpoint kullanımı",
          },
          {
            label: "Ders 9: Console ve Logging",
            href: "/education/lessons/swift/module-02/lesson-09",
            description: "Konsol ve loglama",
          },
          {
            label: "Ders 10: Simulator",
            href: "/education/lessons/swift/module-02/lesson-10",
            description: "iOS Simulator kullanımı",
          },
          {
            label: "Ders 11: Version Control",
            href: "/education/lessons/swift/module-02/lesson-11",
            description: "Git entegrasyonu",
          },
          {
            label: "Ders 12: Swift Package Manager",
            href: "/education/lessons/swift/module-02/lesson-12",
            description: "Paket yönetimi",
          },
          {
            label: "Ders 13: CocoaPods",
            href: "/education/lessons/swift/module-02/lesson-13",
            description: "CocoaPods kullanımı",
          },
          {
            label: "Ders 14: Xcode Best Practices",
            href: "/education/lessons/swift/module-02/lesson-14",
            description: "Xcode kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Swift Syntax ve Temel Kavramlar",
        summary:
          "Swift syntax, değişkenler, sabitler, veri tipleri, operatörler, kontrol yapıları, döngüler ve fonksiyonlar.",
        durationMinutes: 450,
        objectives: [
          "Swift syntax kurallarını öğrenmek",
          "Veri tipleri ve değişken kullanımını anlamak",
          "Kontrol yapılarını kullanmak",
          "Fonksiyon tanımlamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Swift Syntax Temelleri",
            href: "/education/lessons/swift/module-03/lesson-01",
            description: "Swift syntax kuralları",
          },
          {
            label: "Ders 2: Variables ve Constants",
            href: "/education/lessons/swift/module-03/lesson-02",
            description: "var ve let kullanımı",
          },
          {
            label: "Ders 3: Veri Tipleri",
            href: "/education/lessons/swift/module-03/lesson-03",
            description: "Int, String, Bool, Double",
          },
          {
            label: "Ders 4: Type Inference",
            href: "/education/lessons/swift/module-03/lesson-04",
            description: "Tip çıkarımı",
          },
          {
            label: "Ders 5: Type Annotations",
            href: "/education/lessons/swift/module-03/lesson-05",
            description: "Tip tanımlama",
          },
          {
            label: "Ders 6: Operatörler",
            href: "/education/lessons/swift/module-03/lesson-06",
            description: "Aritmetik, karşılaştırma, mantıksal",
          },
          {
            label: "Ders 7: if-else Statements",
            href: "/education/lessons/swift/module-03/lesson-07",
            description: "Koşullu ifadeler",
          },
          {
            label: "Ders 8: switch Statements",
            href: "/education/lessons/swift/module-03/lesson-08",
            description: "Switch-case yapısı",
          },
          {
            label: "Ders 9: for-in Loops",
            href: "/education/lessons/swift/module-03/lesson-09",
            description: "Döngü yapıları",
          },
          {
            label: "Ders 10: while ve repeat-while",
            href: "/education/lessons/swift/module-03/lesson-10",
            description: "While döngüleri",
          },
          {
            label: "Ders 11: Functions",
            href: "/education/lessons/swift/module-03/lesson-11",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 12: Function Parameters",
            href: "/education/lessons/swift/module-03/lesson-12",
            description: "Parametreler ve dönüş değerleri",
          },
          {
            label: "Ders 13: String Interpolation",
            href: "/education/lessons/swift/module-03/lesson-13",
            description: "String birleştirme",
          },
          {
            label: "Ders 14: Comments ve Documentation",
            href: "/education/lessons/swift/module-03/lesson-14",
            description: "Yorumlar ve dokümantasyon",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Optionals ve Nil Handling",
        summary:
          "Swift Optionals, nil handling, optional binding, optional chaining, nil coalescing ve force unwrapping.",
        durationMinutes: 450,
        objectives: [
          "Optional kavramını anlamak",
          "Optional binding kullanmayı öğrenmek",
          "Optional chaining kullanmayı öğrenmek",
          "Nil handling stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Optionals Nedir?",
            href: "/education/lessons/swift/module-04/lesson-01",
            description: "Optional kavramı",
          },
          {
            label: "Ders 2: Optional Declaration",
            href: "/education/lessons/swift/module-04/lesson-02",
            description: "Optional tanımlama",
          },
          {
            label: "Ders 3: nil Value",
            href: "/education/lessons/swift/module-04/lesson-03",
            description: "nil değeri",
          },
          {
            label: "Ders 4: Optional Binding",
            href: "/education/lessons/swift/module-04/lesson-04",
            description: "if let, guard let",
          },
          {
            label: "Ders 5: Optional Chaining",
            href: "/education/lessons/swift/module-04/lesson-05",
            description: "? operatörü",
          },
          {
            label: "Ders 6: Nil Coalescing",
            href: "/education/lessons/swift/module-04/lesson-06",
            description: "?? operatörü",
          },
          {
            label: "Ders 7: Force Unwrapping",
            href: "/education/lessons/swift/module-04/lesson-07",
            description: "! operatörü",
          },
          {
            label: "Ders 8: Implicitly Unwrapped Optionals",
            href: "/education/lessons/swift/module-04/lesson-08",
            description: "IUO kullanımı",
          },
          {
            label: "Ders 9: Optional in Functions",
            href: "/education/lessons/swift/module-04/lesson-09",
            description: "Fonksiyonlarda optional",
          },
          {
            label: "Ders 10: Optional Best Practices",
            href: "/education/lessons/swift/module-04/lesson-10",
            description: "Optional kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 11: Optional vs Non-Optional",
            href: "/education/lessons/swift/module-04/lesson-11",
            description: "Ne zaman optional kullanılır",
          },
          {
            label: "Ders 12: Optional Patterns",
            href: "/education/lessons/swift/module-04/lesson-12",
            description: "Optional desenleri",
          },
          {
            label: "Ders 13: Optional in Collections",
            href: "/education/lessons/swift/module-04/lesson-13",
            description: "Koleksiyonlarda optional",
          },
          {
            label: "Ders 14: Common Optional Mistakes",
            href: "/education/lessons/swift/module-04/lesson-14",
            description: "Yaygın optional hataları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Collections",
        summary:
          "Swift collections, Arrays, Dictionaries, Sets, collection operations, iteration ve collection methods.",
        durationMinutes: 450,
        objectives: [
          "Collection kavramını anlamak",
          "Arrays kullanmayı öğrenmek",
          "Dictionaries kullanmayı öğrenmek",
          "Sets kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Collections Temelleri",
            href: "/education/lessons/swift/module-05/lesson-01",
            description: "Collection kavramı",
          },
          {
            label: "Ders 2: Arrays",
            href: "/education/lessons/swift/module-05/lesson-02",
            description: "Dizi oluşturma ve kullanımı",
          },
          {
            label: "Ders 3: Array Operations",
            href: "/education/lessons/swift/module-05/lesson-03",
            description: "Dizi işlemleri",
          },
          {
            label: "Ders 4: Array Methods",
            href: "/education/lessons/swift/module-05/lesson-04",
            description: "Dizi metodları",
          },
          {
            label: "Ders 5: Dictionaries",
            href: "/education/lessons/swift/module-05/lesson-05",
            description: "Sözlük oluşturma",
          },
          {
            label: "Ders 6: Dictionary Operations",
            href: "/education/lessons/swift/module-05/lesson-06",
            description: "Sözlük işlemleri",
          },
          {
            label: "Ders 7: Sets",
            href: "/education/lessons/swift/module-05/lesson-07",
            description: "Küme oluşturma",
          },
          {
            label: "Ders 8: Set Operations",
            href: "/education/lessons/swift/module-05/lesson-08",
            description: "Küme işlemleri",
          },
          {
            label: "Ders 9: Collection Iteration",
            href: "/education/lessons/swift/module-05/lesson-09",
            description: "Koleksiyon dolaşma",
          },
          {
            label: "Ders 10: Higher-Order Functions",
            href: "/education/lessons/swift/module-05/lesson-10",
            description: "map, filter, reduce",
          },
          {
            label: "Ders 11: Collection Subscripting",
            href: "/education/lessons/swift/module-05/lesson-11",
            description: "İndeksleme",
          },
          {
            label: "Ders 12: Collection Mutability",
            href: "/education/lessons/swift/module-05/lesson-12",
            description: "Değiştirilebilirlik",
          },
          {
            label: "Ders 13: Collection Performance",
            href: "/education/lessons/swift/module-05/lesson-13",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 14: Collection Best Practices",
            href: "/education/lessons/swift/module-05/lesson-14",
            description: "Collection kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Functions ve Methods",
        summary:
          "Swift functions, function parameters, return types, variadic parameters, inout parameters, function types ve methods.",
        durationMinutes: 450,
        objectives: [
          "Function kavramını anlamak",
          "Function parameters kullanmayı öğrenmek",
          "Function types kullanmayı öğrenmek",
          "Methods tanımlamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Functions Temelleri",
            href: "/education/lessons/swift/module-06/lesson-01",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 2: Function Parameters",
            href: "/education/lessons/swift/module-06/lesson-02",
            description: "Parametre tanımlama",
          },
          {
            label: "Ders 3: Return Types",
            href: "/education/lessons/swift/module-06/lesson-03",
            description: "Dönüş tipleri",
          },
          {
            label: "Ders 4: Parameter Labels",
            href: "/education/lessons/swift/module-06/lesson-04",
            description: "Parametre etiketleri",
          },
          {
            label: "Ders 5: Variadic Parameters",
            href: "/education/lessons/swift/module-06/lesson-05",
            description: "Değişken sayıda parametre",
          },
          {
            label: "Ders 6: In-Out Parameters",
            href: "/education/lessons/swift/module-06/lesson-06",
            description: "inout parametreler",
          },
          {
            label: "Ders 7: Function Types",
            href: "/education/lessons/swift/module-06/lesson-07",
            description: "Fonksiyon tipi",
          },
          {
            label: "Ders 8: Functions as Values",
            href: "/education/lessons/swift/module-06/lesson-08",
            description: "Fonksiyonları değer olarak kullanma",
          },
          {
            label: "Ders 9: Nested Functions",
            href: "/education/lessons/swift/module-06/lesson-09",
            description: "İç içe fonksiyonlar",
          },
          {
            label: "Ders 10: Methods",
            href: "/education/lessons/swift/module-06/lesson-10",
            description: "Metod tanımlama",
          },
          {
            label: "Ders 11: Instance Methods",
            href: "/education/lessons/swift/module-06/lesson-11",
            description: "Instance metodları",
          },
          {
            label: "Ders 12: Type Methods",
            href: "/education/lessons/swift/module-06/lesson-12",
            description: "Static metodlar",
          },
          {
            label: "Ders 13: Function Best Practices",
            href: "/education/lessons/swift/module-06/lesson-13",
            description: "Fonksiyon tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Function Overloading",
            href: "/education/lessons/swift/module-06/lesson-14",
            description: "Fonksiyon aşırı yükleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Classes ve Structures",
        summary:
          "Swift classes, structures, properties, methods, initializers, inheritance, computed properties ve property observers.",
        durationMinutes: 450,
        objectives: [
          "Class ve struct kavramını anlamak",
          "Class tanımlamayı öğrenmek",
          "Struct tanımlamayı öğrenmek",
          "Inheritance yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Classes ve Structures",
            href: "/education/lessons/swift/module-07/lesson-01",
            description: "Class ve struct kavramı",
          },
          {
            label: "Ders 2: Class Definition",
            href: "/education/lessons/swift/module-07/lesson-02",
            description: "Class tanımlama",
          },
          {
            label: "Ders 3: Structure Definition",
            href: "/education/lessons/swift/module-07/lesson-03",
            description: "Struct tanımlama",
          },
          {
            label: "Ders 4: Properties",
            href: "/education/lessons/swift/module-07/lesson-04",
            description: "Özellik tanımlama",
          },
          {
            label: "Ders 5: Stored Properties",
            href: "/education/lessons/swift/module-07/lesson-05",
            description: "Saklanan özellikler",
          },
          {
            label: "Ders 6: Computed Properties",
            href: "/education/lessons/swift/module-07/lesson-06",
            description: "Hesaplanan özellikler",
          },
          {
            label: "Ders 7: Property Observers",
            href: "/education/lessons/swift/module-07/lesson-07",
            description: "willSet ve didSet",
          },
          {
            label: "Ders 8: Initializers",
            href: "/education/lessons/swift/module-07/lesson-08",
            description: "Başlatıcılar",
          },
          {
            label: "Ders 9: Inheritance",
            href: "/education/lessons/swift/module-07/lesson-09",
            description: "Kalıtım",
          },
          {
            label: "Ders 10: Overriding",
            href: "/education/lessons/swift/module-07/lesson-10",
            description: "Override etme",
          },
          {
            label: "Ders 11: Class vs Struct",
            href: "/education/lessons/swift/module-07/lesson-11",
            description: "Class ve struct farkları",
          },
          {
            label: "Ders 12: Value Types vs Reference Types",
            href: "/education/lessons/swift/module-07/lesson-12",
            description: "Değer ve referans tipleri",
          },
          {
            label: "Ders 13: Access Control",
            href: "/education/lessons/swift/module-07/lesson-13",
            description: "Erişim kontrolü",
          },
          {
            label: "Ders 14: Class ve Struct Best Practices",
            href: "/education/lessons/swift/module-07/lesson-14",
            description: "Kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Protocols ve Extensions",
        summary:
          "Swift protocols, protocol conformance, protocol extensions, protocol-oriented programming ve extensions.",
        durationMinutes: 450,
        objectives: [
          "Protocol kavramını anlamak",
          "Protocol tanımlamayı öğrenmek",
          "Protocol extensions kullanmayı öğrenmek",
          "Protocol-oriented programming yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Protocols Nedir?",
            href: "/education/lessons/swift/module-08/lesson-01",
            description: "Protocol kavramı",
          },
          {
            label: "Ders 2: Protocol Definition",
            href: "/education/lessons/swift/module-08/lesson-02",
            description: "Protocol tanımlama",
          },
          {
            label: "Ders 3: Protocol Conformance",
            href: "/education/lessons/swift/module-08/lesson-03",
            description: "Protocol uyumluluğu",
          },
          {
            label: "Ders 4: Protocol Properties",
            href: "/education/lessons/swift/module-08/lesson-04",
            description: "Protocol özellikleri",
          },
          {
            label: "Ders 5: Protocol Methods",
            href: "/education/lessons/swift/module-08/lesson-05",
            description: "Protocol metodları",
          },
          {
            label: "Ders 6: Protocol Inheritance",
            href: "/education/lessons/swift/module-08/lesson-06",
            description: "Protocol kalıtımı",
          },
          {
            label: "Ders 7: Protocol Extensions",
            href: "/education/lessons/swift/module-08/lesson-07",
            description: "Protocol genişletme",
          },
          {
            label: "Ders 8: Protocol-Oriented Programming",
            href: "/education/lessons/swift/module-08/lesson-08",
            description: "POP yaklaşımı",
          },
          {
            label: "Ders 9: Extensions",
            href: "/education/lessons/swift/module-08/lesson-09",
            description: "Extension kavramı",
          },
          {
            label: "Ders 10: Extension Syntax",
            href: "/education/lessons/swift/module-08/lesson-10",
            description: "Extension tanımlama",
          },
          {
            label: "Ders 11: Computed Properties in Extensions",
            href: "/education/lessons/swift/module-08/lesson-11",
            description: "Extension'da özellikler",
          },
          {
            label: "Ders 12: Methods in Extensions",
            href: "/education/lessons/swift/module-08/lesson-12",
            description: "Extension'da metodlar",
          },
          {
            label: "Ders 13: Protocol Best Practices",
            href: "/education/lessons/swift/module-08/lesson-13",
            description: "Protocol kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Protocols",
            href: "/education/lessons/swift/module-08/lesson-14",
            description: "Yaygın protocol'ler",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Closures ve Generics",
        summary:
          "Swift closures, closure syntax, capturing values, escaping closures, generics, generic functions ve generic types.",
        durationMinutes: 450,
        objectives: [
          "Closure kavramını anlamak",
          "Closure syntax kullanmayı öğrenmek",
          "Generics kavramını anlamak",
          "Generic functions yazmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Closures Nedir?",
            href: "/education/lessons/swift/module-09/lesson-01",
            description: "Closure kavramı",
          },
          {
            label: "Ders 2: Closure Syntax",
            href: "/education/lessons/swift/module-09/lesson-02",
            description: "Closure yazımı",
          },
          {
            label: "Ders 3: Closure Expressions",
            href: "/education/lessons/swift/module-09/lesson-03",
            description: "Closure ifadeleri",
          },
          {
            label: "Ders 4: Trailing Closures",
            href: "/education/lessons/swift/module-09/lesson-04",
            description: "Sondaki closure'lar",
          },
          {
            label: "Ders 5: Capturing Values",
            href: "/education/lessons/swift/module-09/lesson-05",
            description: "Değer yakalama",
          },
          {
            label: "Ders 6: Escaping Closures",
            href: "/education/lessons/swift/module-09/lesson-06",
            description: "Kaçan closure'lar",
          },
          {
            label: "Ders 7: Autoclosures",
            href: "/education/lessons/swift/module-09/lesson-07",
            description: "Otomatik closure'lar",
          },
          {
            label: "Ders 8: Generics Nedir?",
            href: "/education/lessons/swift/module-09/lesson-08",
            description: "Generic kavramı",
          },
          {
            label: "Ders 9: Generic Functions",
            href: "/education/lessons/swift/module-09/lesson-09",
            description: "Generic fonksiyonlar",
          },
          {
            label: "Ders 10: Generic Types",
            href: "/education/lessons/swift/module-09/lesson-10",
            description: "Generic tipler",
          },
          {
            label: "Ders 11: Type Constraints",
            href: "/education/lessons/swift/module-09/lesson-11",
            description: "Tip kısıtlamaları",
          },
          {
            label: "Ders 12: Associated Types",
            href: "/education/lessons/swift/module-09/lesson-12",
            description: "İlişkili tipler",
          },
          {
            label: "Ders 13: Generic Best Practices",
            href: "/education/lessons/swift/module-09/lesson-13",
            description: "Generic kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Closure Patterns",
            href: "/education/lessons/swift/module-09/lesson-14",
            description: "Yaygın closure desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Error Handling",
        summary:
          "Swift error handling, Error protocol, throwing functions, do-catch statements, try-catch, defer statements ve error propagation.",
        durationMinutes: 450,
        objectives: [
          "Error handling kavramını anlamak",
          "Error protocol kullanmayı öğrenmek",
          "Throwing functions yazmayı öğrenmek",
          "Error handling stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Error Handling Temelleri",
            href: "/education/lessons/swift/module-10/lesson-01",
            description: "Hata yönetimi yaklaşımı",
          },
          {
            label: "Ders 2: Error Protocol",
            href: "/education/lessons/swift/module-10/lesson-02",
            description: "Error protocol",
          },
          {
            label: "Ders 3: Custom Errors",
            href: "/education/lessons/swift/module-10/lesson-03",
            description: "Özel hata tipleri",
          },
          {
            label: "Ders 4: Throwing Functions",
            href: "/education/lessons/swift/module-10/lesson-04",
            description: "Hata fırlatan fonksiyonlar",
          },
          {
            label: "Ders 5: do-catch Statements",
            href: "/education/lessons/swift/module-10/lesson-05",
            description: "Hata yakalama",
          },
          {
            label: "Ders 6: try Keyword",
            href: "/education/lessons/swift/module-10/lesson-06",
            description: "try kullanımı",
          },
          {
            label: "Ders 7: try? ve try!",
            href: "/education/lessons/swift/module-10/lesson-07",
            description: "Optional ve force try",
          },
          {
            label: "Ders 8: Error Propagation",
            href: "/education/lessons/swift/module-10/lesson-08",
            description: "Hata yayılımı",
          },
          {
            label: "Ders 9: defer Statements",
            href: "/education/lessons/swift/module-10/lesson-09",
            description: "defer kullanımı",
          },
          {
            label: "Ders 10: Result Type",
            href: "/education/lessons/swift/module-10/lesson-10",
            description: "Result tipi",
          },
          {
            label: "Ders 11: Error Handling Patterns",
            href: "/education/lessons/swift/module-10/lesson-11",
            description: "Hata yönetimi desenleri",
          },
          {
            label: "Ders 12: Error Recovery",
            href: "/education/lessons/swift/module-10/lesson-12",
            description: "Hata kurtarma",
          },
          {
            label: "Ders 13: Error Handling Best Practices",
            href: "/education/lessons/swift/module-10/lesson-13",
            description: "Hata yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Error Scenarios",
            href: "/education/lessons/swift/module-10/lesson-14",
            description: "Yaygın hata senaryoları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Memory Management ve ARC",
        summary:
          "Swift memory management, ARC (Automatic Reference Counting), strong references, weak references, unowned references ve memory leaks.",
        durationMinutes: 450,
        objectives: [
          "Memory management kavramını anlamak",
          "ARC mekanizmasını öğrenmek",
          "Reference types anlamak",
          "Memory leaks önlemeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Memory Management Temelleri",
            href: "/education/lessons/swift/module-11/lesson-01",
            description: "Bellek yönetimi kavramı",
          },
          {
            label: "Ders 2: ARC Nedir?",
            href: "/education/lessons/swift/module-11/lesson-02",
            description: "Automatic Reference Counting",
          },
          {
            label: "Ders 3: Strong References",
            href: "/education/lessons/swift/module-11/lesson-03",
            description: "Güçlü referanslar",
          },
          {
            label: "Ders 4: Weak References",
            href: "/education/lessons/swift/module-11/lesson-04",
            description: "Zayıf referanslar",
          },
          {
            label: "Ders 5: Unowned References",
            href: "/education/lessons/swift/module-11/lesson-05",
            description: "Sahipsiz referanslar",
          },
          {
            label: "Ders 6: Reference Cycles",
            href: "/education/lessons/swift/module-11/lesson-06",
            description: "Referans döngüleri",
          },
          {
            label: "Ders 7: Breaking Reference Cycles",
            href: "/education/lessons/swift/module-11/lesson-07",
            description: "Referans döngülerini kırma",
          },
          {
            label: "Ders 8: Closures ve Memory",
            href: "/education/lessons/swift/module-11/lesson-08",
            description: "Closure'larda bellek yönetimi",
          },
          {
            label: "Ders 9: Memory Leaks",
            href: "/education/lessons/swift/module-11/lesson-09",
            description: "Bellek sızıntıları",
          },
          {
            label: "Ders 10: Instruments",
            href: "/education/lessons/swift/module-11/lesson-10",
            description: "Bellek analiz araçları",
          },
          {
            label: "Ders 11: Value Types Memory",
            href: "/education/lessons/swift/module-11/lesson-11",
            description: "Değer tiplerinde bellek",
          },
          {
            label: "Ders 12: Memory Best Practices",
            href: "/education/lessons/swift/module-11/lesson-12",
            description: "Bellek yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 13: Performance Considerations",
            href: "/education/lessons/swift/module-11/lesson-13",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 14: Common Memory Issues",
            href: "/education/lessons/swift/module-11/lesson-14",
            description: "Yaygın bellek sorunları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: UIKit ile iOS Development",
        summary:
          "UIKit framework, View Controllers, Views, Auto Layout, Interface Builder, Storyboards, Navigation ve UIKit best practices.",
        durationMinutes: 450,
        objectives: [
          "UIKit framework'ünü anlamak",
          "View Controllers kullanmayı öğrenmek",
          "Auto Layout yapmayı öğrenmek",
          "UIKit ile iOS uygulaması geliştirmeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: UIKit Nedir?",
            href: "/education/lessons/swift/module-12/lesson-01",
            description: "UIKit framework",
          },
          {
            label: "Ders 2: View Controllers",
            href: "/education/lessons/swift/module-12/lesson-02",
            description: "ViewController yapısı",
          },
          {
            label: "Ders 3: Views",
            href: "/education/lessons/swift/module-12/lesson-03",
            description: "View hiyerarşisi",
          },
          {
            label: "Ders 4: Interface Builder",
            href: "/education/lessons/swift/module-12/lesson-04",
            description: "Görsel arayüz oluşturma",
          },
          {
            label: "Ders 5: Storyboards",
            href: "/education/lessons/swift/module-12/lesson-05",
            description: "Storyboard kullanımı",
          },
          {
            label: "Ders 6: Auto Layout",
            href: "/education/lessons/swift/module-12/lesson-06",
            description: "Otomatik yerleşim",
          },
          {
            label: "Ders 7: Constraints",
            href: "/education/lessons/swift/module-12/lesson-07",
            description: "Kısıtlamalar",
          },
          {
            label: "Ders 8: Navigation Controllers",
            href: "/education/lessons/swift/module-12/lesson-08",
            description: "Navigasyon yönetimi",
          },
          {
            label: "Ders 9: Table Views",
            href: "/education/lessons/swift/module-12/lesson-09",
            description: "Tablo görünümleri",
          },
          {
            label: "Ders 10: Collection Views",
            href: "/education/lessons/swift/module-12/lesson-10",
            description: "Koleksiyon görünümleri",
          },
          {
            label: "Ders 11: User Interactions",
            href: "/education/lessons/swift/module-12/lesson-11",
            description: "Kullanıcı etkileşimleri",
          },
          {
            label: "Ders 12: Delegation Pattern",
            href: "/education/lessons/swift/module-12/lesson-12",
            description: "Delegasyon deseni",
          },
          {
            label: "Ders 13: UIKit Best Practices",
            href: "/education/lessons/swift/module-12/lesson-13",
            description: "UIKit kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: UIKit vs SwiftUI",
            href: "/education/lessons/swift/module-12/lesson-14",
            description: "İki framework karşılaştırması",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: SwiftUI",
        summary:
          "SwiftUI framework, declarative UI, Views, Modifiers, State management, Data binding, Navigation ve SwiftUI best practices.",
        durationMinutes: 450,
        objectives: [
          "SwiftUI framework'ünü anlamak",
          "Declarative UI yaklaşımını öğrenmek",
          "State management yapmayı öğrenmek",
          "SwiftUI ile modern iOS uygulaması geliştirmeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: SwiftUI Nedir?",
            href: "/education/lessons/swift/module-13/lesson-01",
            description: "SwiftUI framework",
          },
          {
            label: "Ders 2: Declarative UI",
            href: "/education/lessons/swift/module-13/lesson-02",
            description: "Bildirimsel arayüz",
          },
          {
            label: "Ders 3: SwiftUI Views",
            href: "/education/lessons/swift/module-13/lesson-03",
            description: "View yapısı",
          },
          {
            label: "Ders 4: View Modifiers",
            href: "/education/lessons/swift/module-13/lesson-04",
            description: "View değiştiricileri",
          },
          {
            label: "Ders 5: State Management",
            href: "/education/lessons/swift/module-13/lesson-05",
            description: "@State, @Binding",
          },
          {
            label: "Ders 6: ObservableObject",
            href: "/education/lessons/swift/module-13/lesson-06",
            description: "Gözlemlenebilir nesneler",
          },
          {
            label: "Ders 7: Environment Objects",
            href: "/education/lessons/swift/module-13/lesson-07",
            description: "Ortam nesneleri",
          },
          {
            label: "Ders 8: Navigation",
            href: "/education/lessons/swift/module-13/lesson-08",
            description: "Navigasyon yapısı",
          },
          {
            label: "Ders 9: Lists ve ForEach",
            href: "/education/lessons/swift/module-13/lesson-09",
            description: "Liste görünümleri",
          },
          {
            label: "Ders 10: Forms",
            href: "/education/lessons/swift/module-13/lesson-10",
            description: "Form yapıları",
          },
          {
            label: "Ders 11: Animations",
            href: "/education/lessons/swift/module-13/lesson-11",
            description: "Animasyonlar",
          },
          {
            label: "Ders 12: Combine Framework",
            href: "/education/lessons/swift/module-13/lesson-12",
            description: "Combine entegrasyonu",
          },
          {
            label: "Ders 13: SwiftUI Best Practices",
            href: "/education/lessons/swift/module-13/lesson-13",
            description: "SwiftUI kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: SwiftUI vs UIKit",
            href: "/education/lessons/swift/module-13/lesson-14",
            description: "Framework karşılaştırması",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Testing ve Deployment",
        summary:
          "Swift testing, XCTest framework, unit testing, UI testing, TestFlight, App Store deployment ve iOS deployment best practices.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "UI test yazmayı öğrenmek",
          "App Store deployment yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/swift/module-14/lesson-01",
            description: "Test türleri",
          },
          {
            label: "Ders 2: XCTest Framework",
            href: "/education/lessons/swift/module-14/lesson-02",
            description: "XCTest kullanımı",
          },
          {
            label: "Ders 3: Unit Testing",
            href: "/education/lessons/swift/module-14/lesson-03",
            description: "Birim testleri",
          },
          {
            label: "Ders 4: Test Assertions",
            href: "/education/lessons/swift/module-14/lesson-04",
            description: "Test iddiaları",
          },
          {
            label: "Ders 5: Mocking",
            href: "/education/lessons/swift/module-14/lesson-05",
            description: "Mock objeler",
          },
          {
            label: "Ders 6: UI Testing",
            href: "/education/lessons/swift/module-14/lesson-06",
            description: "Arayüz testleri",
          },
          {
            label: "Ders 7: Test Coverage",
            href: "/education/lessons/swift/module-14/lesson-07",
            description: "Test kapsamı",
          },
          {
            label: "Ders 8: Code Signing",
            href: "/education/lessons/swift/module-14/lesson-08",
            description: "Kod imzalama",
          },
          {
            label: "Ders 9: App Store Connect",
            href: "/education/lessons/swift/module-14/lesson-09",
            description: "App Store yönetimi",
          },
          {
            label: "Ders 10: TestFlight",
            href: "/education/lessons/swift/module-14/lesson-10",
            description: "Beta test dağıtımı",
          },
          {
            label: "Ders 11: App Store Submission",
            href: "/education/lessons/swift/module-14/lesson-11",
            description: "App Store gönderimi",
          },
          {
            label: "Ders 12: App Review Process",
            href: "/education/lessons/swift/module-14/lesson-12",
            description: "Uygulama inceleme süreci",
          },
          {
            label: "Ders 13: Deployment Best Practices",
            href: "/education/lessons/swift/module-14/lesson-13",
            description: "Dağıtım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Version Management",
            href: "/education/lessons/swift/module-14/lesson-14",
            description: "Versiyon yönetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/swift/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "Swift geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir iOS uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir iOS uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/swift/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/swift/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Code Organization",
            href: "/education/lessons/swift/module-15/lesson-03",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/swift/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Mimari Tasarım",
            href: "/education/lessons/swift/module-15/lesson-05",
            description: "Uygulama mimarisi",
          },
          {
            label: "Ders 6: Core Implementation",
            href: "/education/lessons/swift/module-15/lesson-06",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 7: UI Implementation",
            href: "/education/lessons/swift/module-15/lesson-07",
            description: "Arayüz implementasyonu",
          },
          {
            label: "Ders 8: Data Management",
            href: "/education/lessons/swift/module-15/lesson-08",
            description: "Veri yönetimi",
          },
          {
            label: "Ders 9: Network Integration",
            href: "/education/lessons/swift/module-15/lesson-09",
            description: "Ağ entegrasyonu",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/swift/module-15/lesson-10",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 11: Testing Strategy",
            href: "/education/lessons/swift/module-15/lesson-11",
            description: "Test stratejisi",
          },
          {
            label: "Ders 12: Performance Optimization",
            href: "/education/lessons/swift/module-15/lesson-12",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/swift/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/swift/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/swift/module-15/lesson-15",
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

