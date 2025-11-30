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
 * Create complete Kotlin course structure with predefined content
 */
export async function createKotlinCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Kotlin course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Kotlin, JetBrains tarafından geliştirilen modern, güvenli ve Java ile tam uyumlu bir programlama dilidir. Android geliştirmenin resmi dili olan Kotlin ile Android uygulamaları, backend servisleri ve multiplatform projeler geliştirebilirsiniz. Bu kapsamlı kurs ile Kotlin'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "Kotlin programlama dilinin temel kavramlarını ve syntax'ını anlamak",
      "Null safety, Data classes ve Extension functions kullanmayı öğrenmek",
      "Object-Oriented Programming ve Functional Programming yapmak",
      "Coroutines ile asenkron programlama yapmayı öğrenmek",
      "Android Development ve Jetpack Compose ile modern Android uygulamaları geliştirmek",
      "Kotlin Multiplatform ile cross-platform projeler geliştirmek",
      "Testing ve deployment stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Temel programlama bilgisi",
      "Object-Oriented Programming kavramlarına aşinalık",
      "Java bilgisi (opsiyonel ama faydalı)",
      "Android Studio kurulumu (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Kotlin Tanımı ve Temelleri",
        summary:
          "Kotlin'in ne olduğu, tarihçesi, avantajları, Java ile uyumluluğu ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "Kotlin'in ne olduğunu ve neden kullanıldığını anlamak",
          "Kotlin'in Java'dan farklarını öğrenmek",
          "Kotlin'in avantajlarını ve kullanım alanlarını keşfetmek",
          "Kotlin ekosistemini tanımak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Kotlin Nedir?",
            href: "/education/lessons/kotlin/module-01/lesson-01",
            description: "Kotlin'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Kotlin vs Java",
            href: "/education/lessons/kotlin/module-01/lesson-02",
            description: "Kotlin ve Java karşılaştırması",
          },
          {
            label: "Ders 3: Kotlin'in Tarihçesi",
            href: "/education/lessons/kotlin/module-01/lesson-03",
            description: "Kotlin'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: Kotlin'in Avantajları",
            href: "/education/lessons/kotlin/module-01/lesson-04",
            description: "Null safety, conciseness, interoperability",
          },
          {
            label: "Ders 5: Kotlin Kullanım Alanları",
            href: "/education/lessons/kotlin/module-01/lesson-05",
            description: "Android, Backend, Multiplatform",
          },
          {
            label: "Ders 6: Kotlin Ekosistemi",
            href: "/education/lessons/kotlin/module-01/lesson-06",
            description: "JetBrains, Android, Gradle",
          },
          {
            label: "Ders 7: Kotlin Lisanslama",
            href: "/education/lessons/kotlin/module-01/lesson-07",
            description: "Apache 2.0 lisansı",
          },
          {
            label: "Ders 8: Kotlin Topluluk Desteği",
            href: "/education/lessons/kotlin/module-01/lesson-08",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 9: Kotlin'in Geleceği",
            href: "/education/lessons/kotlin/module-01/lesson-09",
            description: "Kotlin roadmap",
          },
          {
            label: "Ders 10: Kotlin Kurulum Gereksinimleri",
            href: "/education/lessons/kotlin/module-01/lesson-10",
            description: "JDK ve IDE gereksinimleri",
          },
          {
            label: "Ders 11: Kotlin ile Neler Yapılabilir?",
            href: "/education/lessons/kotlin/module-01/lesson-11",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 12: Kotlin Performans",
            href: "/education/lessons/kotlin/module-01/lesson-12",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 13: Kotlin Geliştirici Deneyimi",
            href: "/education/lessons/kotlin/module-01/lesson-13",
            description: "IDE desteği ve tooling",
          },
          {
            label: "Ders 14: Kotlin Güvenlik",
            href: "/education/lessons/kotlin/module-01/lesson-14",
            description: "Güvenlik özellikleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/kotlin/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Kotlin Kurulumu ve IDE",
        summary:
          "Kotlin kurulumu, IntelliJ IDEA, Android Studio, proje oluşturma, Gradle yapılandırması ve temel geliştirme ortamı.",
        durationMinutes: 450,
        objectives: [
          "Kotlin kurulumunu öğrenmek",
          "IntelliJ IDEA kullanmayı öğrenmek",
          "Android Studio ile Kotlin kullanmayı öğrenmek",
          "Gradle yapılandırmasını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Kotlin Kurulumu",
            href: "/education/lessons/kotlin/module-02/lesson-01",
            description: "Kotlin indirme ve kurulum",
          },
          {
            label: "Ders 2: IntelliJ IDEA",
            href: "/education/lessons/kotlin/module-02/lesson-02",
            description: "IntelliJ IDEA arayüzü",
          },
          {
            label: "Ders 3: Android Studio",
            href: "/education/lessons/kotlin/module-02/lesson-03",
            description: "Android Studio kurulumu",
          },
          {
            label: "Ders 4: Yeni Proje Oluşturma",
            href: "/education/lessons/kotlin/module-02/lesson-04",
            description: "Kotlin projesi oluşturma",
          },
          {
            label: "Ders 5: Project Structure",
            href: "/education/lessons/kotlin/module-02/lesson-05",
            description: "Proje yapısı",
          },
          {
            label: "Ders 6: Gradle Yapılandırması",
            href: "/education/lessons/kotlin/module-02/lesson-06",
            description: "build.gradle dosyası",
          },
          {
            label: "Ders 7: Build ve Run",
            href: "/education/lessons/kotlin/module-02/lesson-07",
            description: "Derleme ve çalıştırma",
          },
          {
            label: "Ders 8: Debugging",
            href: "/education/lessons/kotlin/module-02/lesson-08",
            description: "Hata ayıklama",
          },
          {
            label: "Ders 9: Kotlin REPL",
            href: "/education/lessons/kotlin/module-02/lesson-09",
            description: "Kotlin REPL kullanımı",
          },
          {
            label: "Ders 10: Kotlin Playground",
            href: "/education/lessons/kotlin/module-02/lesson-10",
            description: "Online Kotlin playground",
          },
          {
            label: "Ders 11: Version Control",
            href: "/education/lessons/kotlin/module-02/lesson-11",
            description: "Git entegrasyonu",
          },
          {
            label: "Ders 12: Kotlin Plugins",
            href: "/education/lessons/kotlin/module-02/lesson-12",
            description: "IDE eklentileri",
          },
          {
            label: "Ders 13: Build Tools",
            href: "/education/lessons/kotlin/module-02/lesson-13",
            description: "Gradle, Maven",
          },
          {
            label: "Ders 14: IDE Best Practices",
            href: "/education/lessons/kotlin/module-02/lesson-14",
            description: "IDE kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Kotlin Syntax ve Temel Kavramlar",
        summary:
          "Kotlin syntax, değişkenler, sabitler, veri tipleri, operatörler, kontrol yapıları, döngüler ve fonksiyonlar.",
        durationMinutes: 450,
        objectives: [
          "Kotlin syntax kurallarını öğrenmek",
          "Veri tipleri ve değişken kullanımını anlamak",
          "Kontrol yapılarını kullanmak",
          "Fonksiyon tanımlamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Kotlin Syntax Temelleri",
            href: "/education/lessons/kotlin/module-03/lesson-01",
            description: "Kotlin syntax kuralları",
          },
          {
            label: "Ders 2: Variables ve Val",
            href: "/education/lessons/kotlin/module-03/lesson-02",
            description: "var ve val kullanımı",
          },
          {
            label: "Ders 3: Veri Tipleri",
            href: "/education/lessons/kotlin/module-03/lesson-03",
            description: "Int, String, Boolean, Double",
          },
          {
            label: "Ders 4: Type Inference",
            href: "/education/lessons/kotlin/module-03/lesson-04",
            description: "Tip çıkarımı",
          },
          {
            label: "Ders 5: Type Annotations",
            href: "/education/lessons/kotlin/module-03/lesson-05",
            description: "Tip tanımlama",
          },
          {
            label: "Ders 6: Operatörler",
            href: "/education/lessons/kotlin/module-03/lesson-06",
            description: "Aritmetik, karşılaştırma, mantıksal",
          },
          {
            label: "Ders 7: if-else Expressions",
            href: "/education/lessons/kotlin/module-03/lesson-07",
            description: "Koşullu ifadeler",
          },
          {
            label: "Ders 8: when Expressions",
            href: "/education/lessons/kotlin/module-03/lesson-08",
            description: "when yapısı (switch benzeri)",
          },
          {
            label: "Ders 9: for Loops",
            href: "/education/lessons/kotlin/module-03/lesson-09",
            description: "Döngü yapıları",
          },
          {
            label: "Ders 10: while ve do-while",
            href: "/education/lessons/kotlin/module-03/lesson-10",
            description: "While döngüleri",
          },
          {
            label: "Ders 11: Functions",
            href: "/education/lessons/kotlin/module-03/lesson-11",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 12: Function Parameters",
            href: "/education/lessons/kotlin/module-03/lesson-12",
            description: "Parametreler ve dönüş değerleri",
          },
          {
            label: "Ders 13: String Templates",
            href: "/education/lessons/kotlin/module-03/lesson-13",
            description: "String birleştirme",
          },
          {
            label: "Ders 14: Comments ve Documentation",
            href: "/education/lessons/kotlin/module-03/lesson-14",
            description: "Yorumlar ve dokümantasyon",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Null Safety",
        summary:
          "Kotlin null safety, nullable types, safe calls, elvis operator, not-null assertions ve null handling stratejileri.",
        durationMinutes: 450,
        objectives: [
          "Null safety kavramını anlamak",
          "Nullable types kullanmayı öğrenmek",
          "Safe calls kullanmayı öğrenmek",
          "Null handling stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Null Safety Nedir?",
            href: "/education/lessons/kotlin/module-04/lesson-01",
            description: "Null safety kavramı",
          },
          {
            label: "Ders 2: Nullable Types",
            href: "/education/lessons/kotlin/module-04/lesson-02",
            description: "? operatörü ile nullable",
          },
          {
            label: "Ders 3: Non-Null Types",
            href: "/education/lessons/kotlin/module-04/lesson-03",
            description: "Non-null tipler",
          },
          {
            label: "Ders 4: Safe Calls",
            href: "/education/lessons/kotlin/module-04/lesson-04",
            description: "?. operatörü",
          },
          {
            label: "Ders 5: Elvis Operator",
            href: "/education/lessons/kotlin/module-04/lesson-05",
            description: "?: operatörü",
          },
          {
            label: "Ders 6: Not-Null Assertions",
            href: "/education/lessons/kotlin/module-04/lesson-06",
            description: "!! operatörü",
          },
          {
            label: "Ders 7: Safe Casts",
            href: "/education/lessons/kotlin/module-04/lesson-07",
            description: "as? operatörü",
          },
          {
            label: "Ders 8: let Function",
            href: "/education/lessons/kotlin/module-04/lesson-08",
            description: "let ile null kontrolü",
          },
          {
            label: "Ders 9: Nullable in Functions",
            href: "/education/lessons/kotlin/module-04/lesson-09",
            description: "Fonksiyonlarda nullable",
          },
          {
            label: "Ders 10: Null Safety Best Practices",
            href: "/education/lessons/kotlin/module-04/lesson-10",
            description: "Null safety kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 11: Platform Types",
            href: "/education/lessons/kotlin/module-04/lesson-11",
            description: "Java interop'ta null safety",
          },
          {
            label: "Ders 12: Null Safety Patterns",
            href: "/education/lessons/kotlin/module-04/lesson-12",
            description: "Null safety desenleri",
          },
          {
            label: "Ders 13: Null Safety in Collections",
            href: "/education/lessons/kotlin/module-04/lesson-13",
            description: "Koleksiyonlarda null safety",
          },
          {
            label: "Ders 14: Common Null Safety Mistakes",
            href: "/education/lessons/kotlin/module-04/lesson-14",
            description: "Yaygın null safety hataları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Collections",
        summary:
          "Kotlin collections, Lists, Sets, Maps, collection operations, iteration, higher-order functions ve collection methods.",
        durationMinutes: 450,
        objectives: [
          "Collection kavramını anlamak",
          "Lists kullanmayı öğrenmek",
          "Maps kullanmayı öğrenmek",
          "Sets kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Collections Temelleri",
            href: "/education/lessons/kotlin/module-05/lesson-01",
            description: "Collection kavramı",
          },
          {
            label: "Ders 2: Lists",
            href: "/education/lessons/kotlin/module-05/lesson-02",
            description: "List oluşturma ve kullanımı",
          },
          {
            label: "Ders 3: List Operations",
            href: "/education/lessons/kotlin/module-05/lesson-03",
            description: "List işlemleri",
          },
          {
            label: "Ders 4: Mutable Lists",
            href: "/education/lessons/kotlin/module-05/lesson-04",
            description: "Değiştirilebilir listeler",
          },
          {
            label: "Ders 5: Maps",
            href: "/education/lessons/kotlin/module-05/lesson-05",
            description: "Map oluşturma",
          },
          {
            label: "Ders 6: Map Operations",
            href: "/education/lessons/kotlin/module-05/lesson-06",
            description: "Map işlemleri",
          },
          {
            label: "Ders 7: Sets",
            href: "/education/lessons/kotlin/module-05/lesson-07",
            description: "Set oluşturma",
          },
          {
            label: "Ders 8: Set Operations",
            href: "/education/lessons/kotlin/module-05/lesson-08",
            description: "Set işlemleri",
          },
          {
            label: "Ders 9: Collection Iteration",
            href: "/education/lessons/kotlin/module-05/lesson-09",
            description: "Koleksiyon dolaşma",
          },
          {
            label: "Ders 10: Higher-Order Functions",
            href: "/education/lessons/kotlin/module-05/lesson-10",
            description: "map, filter, reduce",
          },
          {
            label: "Ders 11: Collection Subscripting",
            href: "/education/lessons/kotlin/module-05/lesson-11",
            description: "İndeksleme",
          },
          {
            label: "Ders 12: Collection Mutability",
            href: "/education/lessons/kotlin/module-05/lesson-12",
            description: "Değiştirilebilirlik",
          },
          {
            label: "Ders 13: Collection Performance",
            href: "/education/lessons/kotlin/module-05/lesson-13",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 14: Collection Best Practices",
            href: "/education/lessons/kotlin/module-05/lesson-14",
            description: "Collection kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Functions ve Lambdas",
        summary:
          "Kotlin functions, function parameters, default parameters, named parameters, lambda expressions, higher-order functions ve inline functions.",
        durationMinutes: 450,
        objectives: [
          "Function kavramını anlamak",
          "Function parameters kullanmayı öğrenmek",
          "Lambda expressions kullanmayı öğrenmek",
          "Higher-order functions yazmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Functions Temelleri",
            href: "/education/lessons/kotlin/module-06/lesson-01",
            description: "Fonksiyon tanımlama",
          },
          {
            label: "Ders 2: Function Parameters",
            href: "/education/lessons/kotlin/module-06/lesson-02",
            description: "Parametre tanımlama",
          },
          {
            label: "Ders 3: Default Parameters",
            href: "/education/lessons/kotlin/module-06/lesson-03",
            description: "Varsayılan parametreler",
          },
          {
            label: "Ders 4: Named Parameters",
            href: "/education/lessons/kotlin/module-06/lesson-04",
            description: "İsimlendirilmiş parametreler",
          },
          {
            label: "Ders 5: Variable Arguments",
            href: "/education/lessons/kotlin/module-06/lesson-05",
            description: "vararg kullanımı",
          },
          {
            label: "Ders 6: Lambda Expressions",
            href: "/education/lessons/kotlin/module-06/lesson-06",
            description: "Lambda ifadeleri",
          },
          {
            label: "Ders 7: Higher-Order Functions",
            href: "/education/lessons/kotlin/module-06/lesson-07",
            description: "Yüksek seviye fonksiyonlar",
          },
          {
            label: "Ders 8: Inline Functions",
            href: "/education/lessons/kotlin/module-06/lesson-08",
            description: "inline fonksiyonlar",
          },
          {
            label: "Ders 9: Extension Functions",
            href: "/education/lessons/kotlin/module-06/lesson-09",
            description: "Genişletme fonksiyonları",
          },
          {
            label: "Ders 10: Infix Functions",
            href: "/education/lessons/kotlin/module-06/lesson-10",
            description: "Infix fonksiyonlar",
          },
          {
            label: "Ders 11: Tail Recursion",
            href: "/education/lessons/kotlin/module-06/lesson-11",
            description: "Kuyruk özyineleme",
          },
          {
            label: "Ders 12: Function Types",
            href: "/education/lessons/kotlin/module-06/lesson-12",
            description: "Fonksiyon tipleri",
          },
          {
            label: "Ders 13: Function Best Practices",
            href: "/education/lessons/kotlin/module-06/lesson-13",
            description: "Fonksiyon tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Function Patterns",
            href: "/education/lessons/kotlin/module-06/lesson-14",
            description: "Yaygın fonksiyon desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Classes ve Objects",
        summary:
          "Kotlin classes, objects, properties, constructors, inheritance, data classes, sealed classes ve object declarations.",
        durationMinutes: 450,
        objectives: [
          "Class kavramını anlamak",
          "Class tanımlamayı öğrenmek",
          "Data classes kullanmayı öğrenmek",
          "Inheritance yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Classes ve Objects",
            href: "/education/lessons/kotlin/module-07/lesson-01",
            description: "Class ve object kavramı",
          },
          {
            label: "Ders 2: Class Definition",
            href: "/education/lessons/kotlin/module-07/lesson-02",
            description: "Class tanımlama",
          },
          {
            label: "Ders 3: Properties",
            href: "/education/lessons/kotlin/module-07/lesson-03",
            description: "Özellik tanımlama",
          },
          {
            label: "Ders 4: Constructors",
            href: "/education/lessons/kotlin/module-07/lesson-04",
            description: "Yapıcılar",
          },
          {
            label: "Ders 5: Primary ve Secondary Constructors",
            href: "/education/lessons/kotlin/module-07/lesson-05",
            description: "Birincil ve ikincil yapıcılar",
          },
          {
            label: "Ders 6: Data Classes",
            href: "/education/lessons/kotlin/module-07/lesson-06",
            description: "Veri sınıfları",
          },
          {
            label: "Ders 7: Sealed Classes",
            href: "/education/lessons/kotlin/module-07/lesson-07",
            description: "Mühürlü sınıflar",
          },
          {
            label: "Ders 8: Inheritance",
            href: "/education/lessons/kotlin/module-07/lesson-08",
            description: "Kalıtım",
          },
          {
            label: "Ders 9: Overriding",
            href: "/education/lessons/kotlin/module-07/lesson-09",
            description: "Override etme",
          },
          {
            label: "Ders 10: Abstract Classes",
            href: "/education/lessons/kotlin/module-07/lesson-10",
            description: "Soyut sınıflar",
          },
          {
            label: "Ders 11: Object Declarations",
            href: "/education/lessons/kotlin/module-07/lesson-11",
            description: "Object tanımlamaları",
          },
          {
            label: "Ders 12: Companion Objects",
            href: "/education/lessons/kotlin/module-07/lesson-12",
            description: "Eşlik nesneleri",
          },
          {
            label: "Ders 13: Access Modifiers",
            href: "/education/lessons/kotlin/module-07/lesson-13",
            description: "Erişim değiştiricileri",
          },
          {
            label: "Ders 14: Class Best Practices",
            href: "/education/lessons/kotlin/module-07/lesson-14",
            description: "Class kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Generics ve Type System",
        summary:
          "Kotlin generics, generic functions, generic classes, type parameters, variance, reified types ve type system.",
        durationMinutes: 450,
        objectives: [
          "Generic kavramını anlamak",
          "Generic functions yazmayı öğrenmek",
          "Generic classes kullanmayı öğrenmek",
          "Variance kavramını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Generics Nedir?",
            href: "/education/lessons/kotlin/module-08/lesson-01",
            description: "Generic kavramı",
          },
          {
            label: "Ders 2: Generic Functions",
            href: "/education/lessons/kotlin/module-08/lesson-02",
            description: "Generic fonksiyonlar",
          },
          {
            label: "Ders 3: Generic Classes",
            href: "/education/lessons/kotlin/module-08/lesson-03",
            description: "Generic sınıflar",
          },
          {
            label: "Ders 4: Type Parameters",
            href: "/education/lessons/kotlin/module-08/lesson-04",
            description: "Tip parametreleri",
          },
          {
            label: "Ders 5: Type Constraints",
            href: "/education/lessons/kotlin/module-08/lesson-05",
            description: "Tip kısıtlamaları",
          },
          {
            label: "Ders 6: Variance",
            href: "/education/lessons/kotlin/module-08/lesson-06",
            description: "Varyans kavramı",
          },
          {
            label: "Ders 7: Covariance",
            href: "/education/lessons/kotlin/module-08/lesson-07",
            description: "Kovaryans",
          },
          {
            label: "Ders 8: Contravariance",
            href: "/education/lessons/kotlin/module-08/lesson-08",
            description: "Kontravaryans",
          },
          {
            label: "Ders 9: Reified Type Parameters",
            href: "/education/lessons/kotlin/module-08/lesson-09",
            description: "Somutlaştırılmış tip parametreleri",
          },
          {
            label: "Ders 10: Star Projections",
            href: "/education/lessons/kotlin/module-08/lesson-10",
            description: "Yıldız projeksiyonları",
          },
          {
            label: "Ders 11: Type Erasure",
            href: "/education/lessons/kotlin/module-08/lesson-11",
            description: "Tip silme",
          },
          {
            label: "Ders 12: Generic Best Practices",
            href: "/education/lessons/kotlin/module-08/lesson-12",
            description: "Generic kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Generic Patterns",
            href: "/education/lessons/kotlin/module-08/lesson-13",
            description: "Yaygın generic desenleri",
          },
          {
            label: "Ders 14: Type System Overview",
            href: "/education/lessons/kotlin/module-08/lesson-14",
            description: "Tip sistemi genel bakış",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Coroutines",
        summary:
          "Kotlin coroutines, async programming, suspend functions, coroutine scope, coroutine context, flow ve channel.",
        durationMinutes: 450,
        objectives: [
          "Coroutine kavramını anlamak",
          "Suspend functions kullanmayı öğrenmek",
          "Coroutine scope yönetmeyi öğrenmek",
          "Asenkron programlama yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Coroutines Nedir?",
            href: "/education/lessons/kotlin/module-09/lesson-01",
            description: "Coroutine kavramı",
          },
          {
            label: "Ders 2: Async Programming",
            href: "/education/lessons/kotlin/module-09/lesson-02",
            description: "Asenkron programlama",
          },
          {
            label: "Ders 3: Suspend Functions",
            href: "/education/lessons/kotlin/module-09/lesson-03",
            description: "Askıya alma fonksiyonları",
          },
          {
            label: "Ders 4: Coroutine Builders",
            href: "/education/lessons/kotlin/module-09/lesson-04",
            description: "launch, async, runBlocking",
          },
          {
            label: "Ders 5: Coroutine Scope",
            href: "/education/lessons/kotlin/module-09/lesson-05",
            description: "Coroutine kapsamı",
          },
          {
            label: "Ders 6: Coroutine Context",
            href: "/education/lessons/kotlin/module-09/lesson-06",
            description: "Coroutine bağlamı",
          },
          {
            label: "Ders 7: Dispatchers",
            href: "/education/lessons/kotlin/module-09/lesson-07",
            description: "Dağıtıcılar",
          },
          {
            label: "Ders 8: Job ve Deferred",
            href: "/education/lessons/kotlin/module-09/lesson-08",
            description: "İş ve ertelenmiş değerler",
          },
          {
            label: "Ders 9: Exception Handling",
            href: "/education/lessons/kotlin/module-09/lesson-09",
            description: "Hata yönetimi",
          },
          {
            label: "Ders 10: Flow",
            href: "/education/lessons/kotlin/module-09/lesson-10",
            description: "Akış yapısı",
          },
          {
            label: "Ders 11: Channel",
            href: "/education/lessons/kotlin/module-09/lesson-11",
            description: "Kanal yapısı",
          },
          {
            label: "Ders 12: Coroutine Best Practices",
            href: "/education/lessons/kotlin/module-09/lesson-12",
            description: "Coroutine kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Testing Coroutines",
            href: "/education/lessons/kotlin/module-09/lesson-13",
            description: "Coroutine testleri",
          },
          {
            label: "Ders 14: Common Coroutine Patterns",
            href: "/education/lessons/kotlin/module-09/lesson-14",
            description: "Yaygın coroutine desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Android Development Temelleri",
        summary:
          "Android geliştirme temelleri, Activity lifecycle, Fragment, Layout, Views, Resources, Manifest ve Android architecture.",
        durationMinutes: 450,
        objectives: [
          "Android geliştirme temellerini anlamak",
          "Activity lifecycle yönetmeyi öğrenmek",
          "Fragment kullanmayı öğrenmek",
          "Android UI oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Android Development Temelleri",
            href: "/education/lessons/kotlin/module-10/lesson-01",
            description: "Android geliştirme giriş",
          },
          {
            label: "Ders 2: Android Studio Setup",
            href: "/education/lessons/kotlin/module-10/lesson-02",
            description: "Android Studio kurulumu",
          },
          {
            label: "Ders 3: Activity Lifecycle",
            href: "/education/lessons/kotlin/module-10/lesson-03",
            description: "Activity yaşam döngüsü",
          },
          {
            label: "Ders 4: Fragment",
            href: "/education/lessons/kotlin/module-10/lesson-04",
            description: "Fragment yapısı",
          },
          {
            label: "Ders 5: Layouts",
            href: "/education/lessons/kotlin/module-10/lesson-05",
            description: "Yerleşim yapıları",
          },
          {
            label: "Ders 6: Views",
            href: "/education/lessons/kotlin/module-10/lesson-06",
            description: "Görünüm bileşenleri",
          },
          {
            label: "Ders 7: Resources",
            href: "/education/lessons/kotlin/module-10/lesson-07",
            description: "Kaynak yönetimi",
          },
          {
            label: "Ders 8: AndroidManifest",
            href: "/education/lessons/kotlin/module-10/lesson-08",
            description: "Manifest dosyası",
          },
          {
            label: "Ders 9: Intents",
            href: "/education/lessons/kotlin/module-10/lesson-09",
            description: "Intent yapısı",
          },
          {
            label: "Ders 10: SharedPreferences",
            href: "/education/lessons/kotlin/module-10/lesson-10",
            description: "Veri saklama",
          },
          {
            label: "Ders 11: RecyclerView",
            href: "/education/lessons/kotlin/module-10/lesson-11",
            description: "Liste görünümü",
          },
          {
            label: "Ders 12: Android Architecture",
            href: "/education/lessons/kotlin/module-10/lesson-12",
            description: "Mimari desenler",
          },
          {
            label: "Ders 13: Android Best Practices",
            href: "/education/lessons/kotlin/module-10/lesson-13",
            description: "Android geliştirme en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Android Patterns",
            href: "/education/lessons/kotlin/module-10/lesson-14",
            description: "Yaygın Android desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Jetpack Compose",
        summary:
          "Jetpack Compose, declarative UI, Composable functions, State management, Navigation, Theming ve Compose best practices.",
        durationMinutes: 450,
        objectives: [
          "Jetpack Compose framework'ünü anlamak",
          "Declarative UI yaklaşımını öğrenmek",
          "State management yapmayı öğrenmek",
          "Modern Android UI geliştirmeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Jetpack Compose Nedir?",
            href: "/education/lessons/kotlin/module-11/lesson-01",
            description: "Compose framework",
          },
          {
            label: "Ders 2: Declarative UI",
            href: "/education/lessons/kotlin/module-11/lesson-02",
            description: "Bildirimsel arayüz",
          },
          {
            label: "Ders 3: Composable Functions",
            href: "/education/lessons/kotlin/module-11/lesson-03",
            description: "@Composable fonksiyonlar",
          },
          {
            label: "Ders 4: State Management",
            href: "/education/lessons/kotlin/module-11/lesson-04",
            description: "remember, mutableStateOf",
          },
          {
            label: "Ders 5: Recomposition",
            href: "/education/lessons/kotlin/module-11/lesson-05",
            description: "Yeniden oluşturma",
          },
          {
            label: "Ders 6: Layouts",
            href: "/education/lessons/kotlin/module-11/lesson-06",
            description: "Column, Row, Box",
          },
          {
            label: "Ders 7: Modifiers",
            href: "/education/lessons/kotlin/module-11/lesson-07",
            description: "Değiştiriciler",
          },
          {
            label: "Ders 8: Lists",
            href: "/education/lessons/kotlin/module-11/lesson-08",
            description: "LazyColumn, LazyRow",
          },
          {
            label: "Ders 9: Navigation",
            href: "/education/lessons/kotlin/module-11/lesson-09",
            description: "Navigasyon yapısı",
          },
          {
            label: "Ders 10: Theming",
            href: "/education/lessons/kotlin/module-11/lesson-10",
            description: "Tema yönetimi",
          },
          {
            label: "Ders 11: Animations",
            href: "/education/lessons/kotlin/module-11/lesson-11",
            description: "Animasyonlar",
          },
          {
            label: "Ders 12: ViewModel Integration",
            href: "/education/lessons/kotlin/module-11/lesson-12",
            description: "ViewModel entegrasyonu",
          },
          {
            label: "Ders 13: Compose Best Practices",
            href: "/education/lessons/kotlin/module-11/lesson-13",
            description: "Compose kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Compose vs XML",
            href: "/education/lessons/kotlin/module-11/lesson-14",
            description: "Compose ve XML karşılaştırması",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Android Architecture Components",
        summary:
          "Android Architecture Components, ViewModel, LiveData, Room, WorkManager, Navigation Component ve Data Binding.",
        durationMinutes: 450,
        objectives: [
          "Architecture Components'ı anlamak",
          "ViewModel kullanmayı öğrenmek",
          "LiveData kullanmayı öğrenmek",
          "Room database kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Architecture Components",
            href: "/education/lessons/kotlin/module-12/lesson-01",
            description: "Mimari bileşenler",
          },
          {
            label: "Ders 2: ViewModel",
            href: "/education/lessons/kotlin/module-12/lesson-02",
            description: "ViewModel yapısı",
          },
          {
            label: "Ders 3: LiveData",
            href: "/education/lessons/kotlin/module-12/lesson-03",
            description: "LiveData kullanımı",
          },
          {
            label: "Ders 4: Room Database",
            href: "/education/lessons/kotlin/module-12/lesson-04",
            description: "Room veritabanı",
          },
          {
            label: "Ders 5: Entities ve DAOs",
            href: "/education/lessons/kotlin/module-12/lesson-05",
            description: "Varlıklar ve veri erişim nesneleri",
          },
          {
            label: "Ders 6: WorkManager",
            href: "/education/lessons/kotlin/module-12/lesson-06",
            description: "Arka plan işleri",
          },
          {
            label: "Ders 7: Navigation Component",
            href: "/education/lessons/kotlin/module-12/lesson-07",
            description: "Navigasyon bileşeni",
          },
          {
            label: "Ders 8: Data Binding",
            href: "/education/lessons/kotlin/module-12/lesson-08",
            description: "Veri bağlama",
          },
          {
            label: "Ders 9: Paging Library",
            href: "/education/lessons/kotlin/module-12/lesson-09",
            description: "Sayfalama kütüphanesi",
          },
          {
            label: "Ders 10: Lifecycle Components",
            href: "/education/lessons/kotlin/module-12/lesson-10",
            description: "Yaşam döngüsü bileşenleri",
          },
          {
            label: "Ders 11: Dependency Injection",
            href: "/education/lessons/kotlin/module-12/lesson-11",
            description: "Bağımlılık enjeksiyonu",
          },
          {
            label: "Ders 12: Architecture Best Practices",
            href: "/education/lessons/kotlin/module-12/lesson-12",
            description: "Mimari en iyi uygulamaları",
          },
          {
            label: "Ders 13: MVVM Pattern",
            href: "/education/lessons/kotlin/module-12/lesson-13",
            description: "MVVM deseni",
          },
          {
            label: "Ders 14: Common Architecture Patterns",
            href: "/education/lessons/kotlin/module-12/lesson-14",
            description: "Yaygın mimari desenler",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Testing",
        summary:
          "Kotlin testing, JUnit, Mockito, Android testing, unit testing, integration testing, UI testing ve testing best practices.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "Android test yazmayı öğrenmek",
          "Testing stratejilerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/kotlin/module-13/lesson-01",
            description: "Test türleri",
          },
          {
            label: "Ders 2: JUnit",
            href: "/education/lessons/kotlin/module-13/lesson-02",
            description: "JUnit framework",
          },
          {
            label: "Ders 3: Unit Testing",
            href: "/education/lessons/kotlin/module-13/lesson-03",
            description: "Birim testleri",
          },
          {
            label: "Ders 4: Mockito",
            href: "/education/lessons/kotlin/module-13/lesson-04",
            description: "Mock kütüphanesi",
          },
          {
            label: "Ders 5: Android Testing",
            href: "/education/lessons/kotlin/module-13/lesson-05",
            description: "Android test yapısı",
          },
          {
            label: "Ders 6: Instrumented Tests",
            href: "/education/lessons/kotlin/module-13/lesson-06",
            description: "Enstrümantasyon testleri",
          },
          {
            label: "Ders 7: UI Testing",
            href: "/education/lessons/kotlin/module-13/lesson-07",
            description: "Arayüz testleri",
          },
          {
            label: "Ders 8: Espresso",
            href: "/education/lessons/kotlin/module-13/lesson-08",
            description: "Espresso framework",
          },
          {
            label: "Ders 9: Test Coverage",
            href: "/education/lessons/kotlin/module-13/lesson-09",
            description: "Test kapsamı",
          },
          {
            label: "Ders 10: Testing Coroutines",
            href: "/education/lessons/kotlin/module-13/lesson-10",
            description: "Coroutine testleri",
          },
          {
            label: "Ders 11: Testing ViewModel",
            href: "/education/lessons/kotlin/module-13/lesson-11",
            description: "ViewModel testleri",
          },
          {
            label: "Ders 12: Testing Best Practices",
            href: "/education/lessons/kotlin/module-13/lesson-12",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 13: Test Automation",
            href: "/education/lessons/kotlin/module-13/lesson-13",
            description: "Test otomasyonu",
          },
          {
            label: "Ders 14: Common Testing Patterns",
            href: "/education/lessons/kotlin/module-13/lesson-14",
            description: "Yaygın test desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Deployment ve Publishing",
        summary:
          "Android app deployment, Google Play Store, app signing, versioning, release management, analytics ve app store optimization.",
        durationMinutes: 450,
        objectives: [
          "App deployment sürecini anlamak",
          "App signing yapmayı öğrenmek",
          "Google Play Store'a yüklemeyi öğrenmek",
          "Release management yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Temelleri",
            href: "/education/lessons/kotlin/module-14/lesson-01",
            description: "Dağıtım süreci",
          },
          {
            label: "Ders 2: App Signing",
            href: "/education/lessons/kotlin/module-14/lesson-02",
            description: "Uygulama imzalama",
          },
          {
            label: "Ders 3: Build Variants",
            href: "/education/lessons/kotlin/module-14/lesson-03",
            description: "Derleme varyantları",
          },
          {
            label: "Ders 4: ProGuard",
            href: "/education/lessons/kotlin/module-14/lesson-04",
            description: "Kod karartma",
          },
          {
            label: "Ders 5: Version Management",
            href: "/education/lessons/kotlin/module-14/lesson-05",
            description: "Versiyon yönetimi",
          },
          {
            label: "Ders 6: Google Play Console",
            href: "/education/lessons/kotlin/module-14/lesson-06",
            description: "Play Console yönetimi",
          },
          {
            label: "Ders 7: App Store Listing",
            href: "/education/lessons/kotlin/module-14/lesson-07",
            description: "Mağaza listeleme",
          },
          {
            label: "Ders 8: Release Management",
            href: "/education/lessons/kotlin/module-14/lesson-08",
            description: "Sürüm yönetimi",
          },
          {
            label: "Ders 9: Beta Testing",
            href: "/education/lessons/kotlin/module-14/lesson-09",
            description: "Beta test dağıtımı",
          },
          {
            label: "Ders 10: Analytics",
            href: "/education/lessons/kotlin/module-14/lesson-10",
            description: "Analitik entegrasyonu",
          },
          {
            label: "Ders 11: Crash Reporting",
            href: "/education/lessons/kotlin/module-14/lesson-11",
            description: "Çökme raporlama",
          },
          {
            label: "Ders 12: App Store Optimization",
            href: "/education/lessons/kotlin/module-14/lesson-12",
            description: "ASO stratejileri",
          },
          {
            label: "Ders 13: Deployment Best Practices",
            href: "/education/lessons/kotlin/module-14/lesson-13",
            description: "Dağıtım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Continuous Integration",
            href: "/education/lessons/kotlin/module-14/lesson-14",
            description: "CI/CD pipeline",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/kotlin/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "Kotlin geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir Android uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir Android uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/kotlin/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/kotlin/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Code Organization",
            href: "/education/lessons/kotlin/module-15/lesson-03",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/kotlin/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Mimari Tasarım",
            href: "/education/lessons/kotlin/module-15/lesson-05",
            description: "Uygulama mimarisi",
          },
          {
            label: "Ders 6: Core Implementation",
            href: "/education/lessons/kotlin/module-15/lesson-06",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 7: UI Implementation",
            href: "/education/lessons/kotlin/module-15/lesson-07",
            description: "Arayüz implementasyonu",
          },
          {
            label: "Ders 8: Data Management",
            href: "/education/lessons/kotlin/module-15/lesson-08",
            description: "Veri yönetimi",
          },
          {
            label: "Ders 9: Network Integration",
            href: "/education/lessons/kotlin/module-15/lesson-09",
            description: "Ağ entegrasyonu",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/kotlin/module-15/lesson-10",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 11: Testing Strategy",
            href: "/education/lessons/kotlin/module-15/lesson-11",
            description: "Test stratejisi",
          },
          {
            label: "Ders 12: Performance Optimization",
            href: "/education/lessons/kotlin/module-15/lesson-12",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/kotlin/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/kotlin/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/kotlin/module-15/lesson-15",
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

