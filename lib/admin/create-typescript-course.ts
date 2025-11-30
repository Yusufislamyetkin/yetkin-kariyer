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
 * Create complete TypeScript course structure with predefined content
 */
export async function createTypeScriptCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting TypeScript course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "TypeScript, JavaScript'e tip güvenliği ekleyen güçlü bir programlama dilidir. Bu kapsamlı kurs ile TypeScript'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Modern web geliştirmede hata önleme, daha iyi geliştirici deneyimi ve ölçeklenebilir kod yazma becerileri kazanacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "TypeScript'in ne olduğunu ve JavaScript'ten farklarını anlamak",
      "Type annotations ve type system kullanmayı öğrenmek",
      "Interfaces, classes ve generics ile kod organizasyonu yapmak",
      "Advanced types ve utility types kullanmayı öğrenmek",
      "TypeScript'i React, Vue.js ve Node.js ile entegre etmek",
      "TypeScript compiler yapılandırması ve best practices öğrenmek",
      "Büyük projelerde TypeScript kullanım stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Temel JavaScript bilgisi",
      "ES6+ JavaScript özelliklerine aşinalık",
      "Programlama temel kavramlarına aşinalık",
      "Web geliştirme temel bilgisi",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: TypeScript Tanımı ve Temelleri",
        summary:
          "TypeScript'in ne olduğu, JavaScript'ten farkları, avantajları, tarihçesi ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "TypeScript'in ne olduğunu ve neden kullanıldığını anlamak",
          "JavaScript ile TypeScript arasındaki farkları öğrenmek",
          "TypeScript'in avantajlarını ve kullanım alanlarını keşfetmek",
          "Type safety kavramını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: TypeScript Nedir?",
            href: "/education/lessons/typescript/module-01/lesson-01",
            description: "TypeScript'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: TypeScript vs JavaScript",
            href: "/education/lessons/typescript/module-01/lesson-02",
            description: "TypeScript ve JavaScript arasındaki farklar",
          },
          {
            label: "Ders 3: TypeScript'in Tarihçesi",
            href: "/education/lessons/typescript/module-01/lesson-03",
            description: "TypeScript'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: Type Safety Kavramı",
            href: "/education/lessons/typescript/module-01/lesson-04",
            description: "Tip güvenliği ve avantajları",
          },
          {
            label: "Ders 5: TypeScript'in Avantajları",
            href: "/education/lessons/typescript/module-01/lesson-05",
            description: "Hata önleme, IDE desteği, refactoring gibi avantajlar",
          },
          {
            label: "Ders 6: TypeScript Kullanım Alanları",
            href: "/education/lessons/typescript/module-01/lesson-06",
            description: "Web, Node.js, mobil uygulamalar",
          },
          {
            label: "Ders 7: TypeScript Ekosistemi",
            href: "/education/lessons/typescript/module-01/lesson-07",
            description: "TypeScript topluluğu ve araçlar",
          },
          {
            label: "Ders 8: TypeScript Lisanslama",
            href: "/education/lessons/typescript/module-01/lesson-08",
            description: "Apache 2.0 lisansı",
          },
          {
            label: "Ders 9: TypeScript Topluluk Desteği",
            href: "/education/lessons/typescript/module-01/lesson-09",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 10: TypeScript'in Geleceği",
            href: "/education/lessons/typescript/module-01/lesson-10",
            description: "TypeScript roadmap ve gelecek planları",
          },
          {
            label: "Ders 11: TypeScript Kurulum Gereksinimleri",
            href: "/education/lessons/typescript/module-01/lesson-11",
            description: "Sistem gereksinimleri",
          },
          {
            label: "Ders 12: TypeScript ile Neler Yapılabilir?",
            href: "/education/lessons/typescript/module-01/lesson-12",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 13: TypeScript Performans",
            href: "/education/lessons/typescript/module-01/lesson-13",
            description: "Compile time vs runtime",
          },
          {
            label: "Ders 14: TypeScript Geliştirici Deneyimi",
            href: "/education/lessons/typescript/module-01/lesson-14",
            description: "IDE desteği ve tooling",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/typescript/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: TypeScript Kurulumu ve Yapılandırma",
        summary:
          "TypeScript kurulumu, tsconfig.json yapılandırması, compiler seçenekleri ve proje setup.",
        durationMinutes: 450,
        objectives: [
          "TypeScript kurulumunu öğrenmek",
          "tsconfig.json yapılandırmasını anlamak",
          "Compiler seçeneklerini öğrenmek",
          "Proje yapısını kurmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: TypeScript Kurulumu",
            href: "/education/lessons/typescript/module-02/lesson-01",
            description: "npm ile TypeScript kurulumu",
          },
          {
            label: "Ders 2: TypeScript Compiler (tsc)",
            href: "/education/lessons/typescript/module-02/lesson-02",
            description: "tsc komutu ve kullanımı",
          },
          {
            label: "Ders 3: tsconfig.json Oluşturma",
            href: "/education/lessons/typescript/module-02/lesson-03",
            description: "TypeScript yapılandırma dosyası",
          },
          {
            label: "Ders 4: Compiler Options",
            href: "/education/lessons/typescript/module-02/lesson-04",
            description: "Compiler seçenekleri",
          },
          {
            label: "Ders 5: Target ve Module",
            href: "/education/lessons/typescript/module-02/lesson-05",
            description: "ES versiyon seçimi",
          },
          {
            label: "Ders 6: Strict Mode",
            href: "/education/lessons/typescript/module-02/lesson-06",
            description: "Strict type checking",
          },
          {
            label: "Ders 7: Module Resolution",
            href: "/education/lessons/typescript/module-02/lesson-07",
            description: "Module çözümleme stratejileri",
          },
          {
            label: "Ders 8: Path Mapping",
            href: "/education/lessons/typescript/module-02/lesson-08",
            description: "Path alias yapılandırması",
          },
          {
            label: "Ders 9: Source Maps",
            href: "/education/lessons/typescript/module-02/lesson-09",
            description: "Debug için source map",
          },
          {
            label: "Ders 10: Watch Mode",
            href: "/education/lessons/typescript/module-02/lesson-10",
            description: "Otomatik derleme",
          },
          {
            label: "Ders 11: Project References",
            href: "/education/lessons/typescript/module-02/lesson-11",
            description: "Monorepo yapılandırması",
          },
          {
            label: "Ders 12: IDE Integration",
            href: "/education/lessons/typescript/module-02/lesson-12",
            description: "VS Code ve diğer IDE'ler",
          },
          {
            label: "Ders 13: Build Tools Integration",
            href: "/education/lessons/typescript/module-02/lesson-13",
            description: "Webpack, Vite, esbuild",
          },
          {
            label: "Ders 14: TypeScript Best Practices",
            href: "/education/lessons/typescript/module-02/lesson-14",
            description: "Yapılandırma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Types ve Type Annotations",
        summary:
          "TypeScript type system, primitive types, type annotations, type inference ve type checking.",
        durationMinutes: 450,
        objectives: [
          "Type system kavramını anlamak",
          "Primitive types kullanmayı öğrenmek",
          "Type annotations yazmayı öğrenmek",
          "Type inference anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Type System Temelleri",
            href: "/education/lessons/typescript/module-03/lesson-01",
            description: "Type system kavramı",
          },
          {
            label: "Ders 2: Primitive Types",
            href: "/education/lessons/typescript/module-03/lesson-02",
            description: "string, number, boolean, null, undefined",
          },
          {
            label: "Ders 3: Type Annotations",
            href: "/education/lessons/typescript/module-03/lesson-03",
            description: "Değişken tip tanımlama",
          },
          {
            label: "Ders 4: Type Inference",
            href: "/education/lessons/typescript/module-03/lesson-04",
            description: "Otomatik tip çıkarımı",
          },
          {
            label: "Ders 5: any Type",
            href: "/education/lessons/typescript/module-03/lesson-05",
            description: "any tipi ve kullanımı",
          },
          {
            label: "Ders 6: unknown Type",
            href: "/education/lessons/typescript/module-03/lesson-06",
            description: "unknown tipi ve type safety",
          },
          {
            label: "Ders 7: void ve never Types",
            href: "/education/lessons/typescript/module-03/lesson-07",
            description: "void ve never tip kullanımı",
          },
          {
            label: "Ders 8: Literal Types",
            href: "/education/lessons/typescript/module-03/lesson-08",
            description: "String ve number literal types",
          },
          {
            label: "Ders 9: Union Types",
            href: "/education/lessons/typescript/module-03/lesson-09",
            description: "Birden fazla tip birleştirme",
          },
          {
            label: "Ders 10: Intersection Types",
            href: "/education/lessons/typescript/module-03/lesson-10",
            description: "Tip kesişimi",
          },
          {
            label: "Ders 11: Type Aliases",
            href: "/education/lessons/typescript/module-03/lesson-11",
            description: "Tip takma adları",
          },
          {
            label: "Ders 12: Type Assertions",
            href: "/education/lessons/typescript/module-03/lesson-12",
            description: "Tip dönüşümü",
          },
          {
            label: "Ders 13: Type Guards",
            href: "/education/lessons/typescript/module-03/lesson-13",
            description: "Tip kontrolü fonksiyonları",
          },
          {
            label: "Ders 14: Type Narrowing",
            href: "/education/lessons/typescript/module-03/lesson-14",
            description: "Tip daraltma",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Interfaces",
        summary:
          "Interface tanımlama, interface kullanımı, optional properties, readonly, index signatures ve interface extension.",
        durationMinutes: 450,
        objectives: [
          "Interface kavramını anlamak",
          "Interface tanımlamayı öğrenmek",
          "Interface kullanmayı öğrenmek",
          "Interface extension yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Interface Nedir?",
            href: "/education/lessons/typescript/module-04/lesson-01",
            description: "Interface kavramı",
          },
          {
            label: "Ders 2: Basic Interface",
            href: "/education/lessons/typescript/module-04/lesson-02",
            description: "Temel interface tanımlama",
          },
          {
            label: "Ders 3: Optional Properties",
            href: "/education/lessons/typescript/module-04/lesson-03",
            description: "Opsiyonel özellikler",
          },
          {
            label: "Ders 4: Readonly Properties",
            href: "/education/lessons/typescript/module-04/lesson-04",
            description: "Sadece okunabilir özellikler",
          },
          {
            label: "Ders 5: Function Types in Interfaces",
            href: "/education/lessons/typescript/module-04/lesson-05",
            description: "Interface'de fonksiyon tipleri",
          },
          {
            label: "Ders 6: Index Signatures",
            href: "/education/lessons/typescript/module-04/lesson-06",
            description: "Dinamik özellikler",
          },
          {
            label: "Ders 7: Interface Extension",
            href: "/education/lessons/typescript/module-04/lesson-07",
            description: "Interface genişletme",
          },
          {
            label: "Ders 8: Multiple Interface Extension",
            href: "/education/lessons/typescript/module-04/lesson-08",
            description: "Birden fazla interface genişletme",
          },
          {
            label: "Ders 9: Interface vs Type Alias",
            href: "/education/lessons/typescript/module-04/lesson-09",
            description: "Interface ve type alias farkları",
          },
          {
            label: "Ders 10: Interface Merging",
            href: "/education/lessons/typescript/module-04/lesson-10",
            description: "Interface birleştirme",
          },
          {
            label: "Ders 11: Generic Interfaces",
            href: "/education/lessons/typescript/module-04/lesson-11",
            description: "Generic interface'ler",
          },
          {
            label: "Ders 12: Interface Implementation",
            href: "/education/lessons/typescript/module-04/lesson-12",
            description: "Class'larda interface kullanımı",
          },
          {
            label: "Ders 13: Interface Best Practices",
            href: "/education/lessons/typescript/module-04/lesson-13",
            description: "Interface kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Utility Types with Interfaces",
            href: "/education/lessons/typescript/module-04/lesson-14",
            description: "Utility types kullanımı",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Classes",
        summary:
          "TypeScript classes, inheritance, access modifiers, abstract classes, static members ve class decorators.",
        durationMinutes: 450,
        objectives: [
          "TypeScript classes kavramını anlamak",
          "Class tanımlamayı öğrenmek",
          "Inheritance yapmayı öğrenmek",
          "Access modifiers kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Classes Temelleri",
            href: "/education/lessons/typescript/module-05/lesson-01",
            description: "TypeScript class yapısı",
          },
          {
            label: "Ders 2: Class Properties",
            href: "/education/lessons/typescript/module-05/lesson-02",
            description: "Class özellikleri ve tip tanımlama",
          },
          {
            label: "Ders 3: Constructors",
            href: "/education/lessons/typescript/module-05/lesson-03",
            description: "Constructor tanımlama",
          },
          {
            label: "Ders 4: Methods",
            href: "/education/lessons/typescript/module-05/lesson-04",
            description: "Class metodları",
          },
          {
            label: "Ders 5: Access Modifiers",
            href: "/education/lessons/typescript/module-05/lesson-05",
            description: "public, private, protected",
          },
          {
            label: "Ders 6: Readonly Modifier",
            href: "/education/lessons/typescript/module-05/lesson-06",
            description: "Readonly özellikler",
          },
          {
            label: "Ders 7: Inheritance",
            href: "/education/lessons/typescript/module-05/lesson-07",
            description: "Class kalıtımı",
          },
          {
            label: "Ders 8: super Keyword",
            href: "/education/lessons/typescript/module-05/lesson-08",
            description: "Parent class erişimi",
          },
          {
            label: "Ders 9: Method Overriding",
            href: "/education/lessons/typescript/module-05/lesson-09",
            description: "Metod override etme",
          },
          {
            label: "Ders 10: Abstract Classes",
            href: "/education/lessons/typescript/module-05/lesson-10",
            description: "Soyut sınıflar",
          },
          {
            label: "Ders 11: Static Members",
            href: "/education/lessons/typescript/module-05/lesson-11",
            description: "Static özellikler ve metodlar",
          },
          {
            label: "Ders 12: Getters ve Setters",
            href: "/education/lessons/typescript/module-05/lesson-12",
            description: "Property accessors",
          },
          {
            label: "Ders 13: Class Decorators",
            href: "/education/lessons/typescript/module-05/lesson-13",
            description: "Class decorator'ları",
          },
          {
            label: "Ders 14: Class Best Practices",
            href: "/education/lessons/typescript/module-05/lesson-14",
            description: "Class tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Generics",
        summary:
          "Generic types, generic functions, generic classes, constraints, default type parameters ve utility generics.",
        durationMinutes: 450,
        objectives: [
          "Generic kavramını anlamak",
          "Generic functions yazmayı öğrenmek",
          "Generic classes kullanmayı öğrenmek",
          "Generic constraints uygulamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Generics Nedir?",
            href: "/education/lessons/typescript/module-06/lesson-01",
            description: "Generic kavramı ve avantajları",
          },
          {
            label: "Ders 2: Generic Functions",
            href: "/education/lessons/typescript/module-06/lesson-02",
            description: "Generic fonksiyon tanımlama",
          },
          {
            label: "Ders 3: Generic Classes",
            href: "/education/lessons/typescript/module-06/lesson-03",
            description: "Generic class tanımlama",
          },
          {
            label: "Ders 4: Generic Interfaces",
            href: "/education/lessons/typescript/module-06/lesson-04",
            description: "Generic interface'ler",
          },
          {
            label: "Ders 5: Multiple Type Parameters",
            href: "/education/lessons/typescript/module-06/lesson-05",
            description: "Birden fazla generic parametre",
          },
          {
            label: "Ders 6: Generic Constraints",
            href: "/education/lessons/typescript/module-06/lesson-06",
            description: "extends ile constraint",
          },
          {
            label: "Ders 7: Using Type Parameters in Constraints",
            href: "/education/lessons/typescript/module-06/lesson-07",
            description: "Constraint'te tip parametresi kullanımı",
          },
          {
            label: "Ders 8: Default Type Parameters",
            href: "/education/lessons/typescript/module-06/lesson-08",
            description: "Varsayılan tip parametreleri",
          },
          {
            label: "Ders 9: Conditional Types",
            href: "/education/lessons/typescript/module-06/lesson-09",
            description: "Koşullu tipler",
          },
          {
            label: "Ders 10: Mapped Types",
            href: "/education/lessons/typescript/module-06/lesson-10",
            description: "Tip dönüşümü",
          },
          {
            label: "Ders 11: Template Literal Types",
            href: "/education/lessons/typescript/module-06/lesson-11",
            description: "String literal type manipulation",
          },
          {
            label: "Ders 12: Generic Utility Types",
            href: "/education/lessons/typescript/module-06/lesson-12",
            description: "Partial, Required, Pick, Omit",
          },
          {
            label: "Ders 13: Generic Best Practices",
            href: "/education/lessons/typescript/module-06/lesson-13",
            description: "Generic kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Advanced Generic Patterns",
            href: "/education/lessons/typescript/module-06/lesson-14",
            description: "İleri seviye generic desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Modules ve Namespaces",
        summary:
          "ES modules, import/export, namespace, module resolution, declaration files ve ambient modules.",
        durationMinutes: 450,
        objectives: [
          "Module system kavramını anlamak",
          "Import/export kullanmayı öğrenmek",
          "Namespace kullanmayı öğrenmek",
          "Declaration files oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Modules Temelleri",
            href: "/education/lessons/typescript/module-07/lesson-01",
            description: "Module system kavramı",
          },
          {
            label: "Ders 2: Export Statements",
            href: "/education/lessons/typescript/module-07/lesson-02",
            description: "Export kullanımı",
          },
          {
            label: "Ders 3: Import Statements",
            href: "/education/lessons/typescript/module-07/lesson-03",
            description: "Import kullanımı",
          },
          {
            label: "Ders 4: Default Exports",
            href: "/education/lessons/typescript/module-07/lesson-04",
            description: "Varsayılan export",
          },
          {
            label: "Ders 5: Named Exports",
            href: "/education/lessons/typescript/module-07/lesson-05",
            description: "İsimlendirilmiş export",
          },
          {
            label: "Ders 6: Re-exporting",
            href: "/education/lessons/typescript/module-07/lesson-06",
            description: "Yeniden export etme",
          },
          {
            label: "Ders 7: Namespaces",
            href: "/education/lessons/typescript/module-07/lesson-07",
            description: "Namespace kullanımı",
          },
          {
            label: "Ders 8: Module vs Namespace",
            href: "/education/lessons/typescript/module-07/lesson-08",
            description: "Module ve namespace farkları",
          },
          {
            label: "Ders 9: Declaration Files (.d.ts)",
            href: "/education/lessons/typescript/module-07/lesson-09",
            description: "Type declaration dosyaları",
          },
          {
            label: "Ders 10: Ambient Modules",
            href: "/education/lessons/typescript/module-07/lesson-10",
            description: "Ambient module tanımlama",
          },
          {
            label: "Ders 11: Module Augmentation",
            href: "/education/lessons/typescript/module-07/lesson-11",
            description: "Module genişletme",
          },
          {
            label: "Ders 12: Triple-Slash Directives",
            href: "/education/lessons/typescript/module-07/lesson-12",
            description: "/// reference directives",
          },
          {
            label: "Ders 13: Module Resolution",
            href: "/education/lessons/typescript/module-07/lesson-13",
            description: "Module çözümleme stratejileri",
          },
          {
            label: "Ders 14: Module Best Practices",
            href: "/education/lessons/typescript/module-07/lesson-14",
            description: "Module kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Advanced Types",
        summary:
          "Utility types, conditional types, mapped types, template literal types ve type manipulation.",
        durationMinutes: 450,
        objectives: [
          "Utility types kullanmayı öğrenmek",
          "Conditional types anlamak",
          "Mapped types kullanmayı öğrenmek",
          "Type manipulation tekniklerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Utility Types Overview",
            href: "/education/lessons/typescript/module-08/lesson-01",
            description: "Utility types genel bakış",
          },
          {
            label: "Ders 2: Partial ve Required",
            href: "/education/lessons/typescript/module-08/lesson-02",
            description: "Partial ve Required utility types",
          },
          {
            label: "Ders 3: Pick ve Omit",
            href: "/education/lessons/typescript/module-08/lesson-03",
            description: "Pick ve Omit utility types",
          },
          {
            label: "Ders 4: Record",
            href: "/education/lessons/typescript/module-08/lesson-04",
            description: "Record utility type",
          },
          {
            label: "Ders 5: Exclude ve Extract",
            href: "/education/lessons/typescript/module-08/lesson-05",
            description: "Exclude ve Extract utility types",
          },
          {
            label: "Ders 6: NonNullable",
            href: "/education/lessons/typescript/module-08/lesson-06",
            description: "NonNullable utility type",
          },
          {
            label: "Ders 7: ReturnType ve Parameters",
            href: "/education/lessons/typescript/module-08/lesson-07",
            description: "Function type utilities",
          },
          {
            label: "Ders 8: Awaited",
            href: "/education/lessons/typescript/module-08/lesson-08",
            description: "Awaited utility type",
          },
          {
            label: "Ders 9: Conditional Types",
            href: "/education/lessons/typescript/module-08/lesson-09",
            description: "Koşullu tip tanımlama",
          },
          {
            label: "Ders 10: Mapped Types",
            href: "/education/lessons/typescript/module-08/lesson-10",
            description: "Tip dönüşümü",
          },
          {
            label: "Ders 11: Template Literal Types",
            href: "/education/lessons/typescript/module-08/lesson-11",
            description: "String literal manipulation",
          },
          {
            label: "Ders 12: Recursive Types",
            href: "/education/lessons/typescript/module-08/lesson-12",
            description: "Özyinelemeli tipler",
          },
          {
            label: "Ders 13: Branded Types",
            href: "/education/lessons/typescript/module-08/lesson-13",
            description: "Brand pattern",
          },
          {
            label: "Ders 14: Advanced Type Patterns",
            href: "/education/lessons/typescript/module-08/lesson-14",
            description: "İleri seviye tip desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Decorators",
        summary:
          "Decorator kavramı, class decorators, method decorators, property decorators ve decorator factories.",
        durationMinutes: 450,
        objectives: [
          "Decorator kavramını anlamak",
          "Class decorators kullanmayı öğrenmek",
          "Method decorators kullanmayı öğrenmek",
          "Decorator factories oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Decorators Nedir?",
            href: "/education/lessons/typescript/module-09/lesson-01",
            description: "Decorator kavramı",
          },
          {
            label: "Ders 2: Decorator Configuration",
            href: "/education/lessons/typescript/module-09/lesson-02",
            description: "experimentalDecorators ayarı",
          },
          {
            label: "Ders 3: Class Decorators",
            href: "/education/lessons/typescript/module-09/lesson-03",
            description: "Class decorator'ları",
          },
          {
            label: "Ders 4: Method Decorators",
            href: "/education/lessons/typescript/module-09/lesson-04",
            description: "Method decorator'ları",
          },
          {
            label: "Ders 5: Property Decorators",
            href: "/education/lessons/typescript/module-09/lesson-05",
            description: "Property decorator'ları",
          },
          {
            label: "Ders 6: Parameter Decorators",
            href: "/education/lessons/typescript/module-09/lesson-06",
            description: "Parameter decorator'ları",
          },
          {
            label: "Ders 7: Decorator Factories",
            href: "/education/lessons/typescript/module-09/lesson-07",
            description: "Parametreli decorator'lar",
          },
          {
            label: "Ders 8: Decorator Composition",
            href: "/education/lessons/typescript/module-09/lesson-08",
            description: "Birden fazla decorator",
          },
          {
            label: "Ders 9: Metadata Reflection",
            href: "/education/lessons/typescript/module-09/lesson-09",
            description: "reflect-metadata kullanımı",
          },
          {
            label: "Ders 10: Common Decorator Patterns",
            href: "/education/lessons/typescript/module-09/lesson-10",
            description: "Yaygın decorator desenleri",
          },
          {
            label: "Ders 11: Validation Decorators",
            href: "/education/lessons/typescript/module-09/lesson-11",
            description: "Validasyon decorator'ları",
          },
          {
            label: "Ders 12: Logging Decorators",
            href: "/education/lessons/typescript/module-09/lesson-12",
            description: "Logging decorator'ları",
          },
          {
            label: "Ders 13: Dependency Injection Decorators",
            href: "/education/lessons/typescript/module-09/lesson-13",
            description: "DI decorator'ları",
          },
          {
            label: "Ders 14: Decorator Best Practices",
            href: "/education/lessons/typescript/module-09/lesson-14",
            description: "Decorator kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: TypeScript ile React",
        summary:
          "React + TypeScript entegrasyonu, component typing, hooks typing, props interfaces ve React best practices.",
        durationMinutes: 450,
        objectives: [
          "React + TypeScript entegrasyonunu öğrenmek",
          "Component typing yapmayı öğrenmek",
          "Hooks typing yapmayı öğrenmek",
          "React TypeScript best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: React + TypeScript Setup",
            href: "/education/lessons/typescript/module-10/lesson-01",
            description: "React TypeScript projesi oluşturma",
          },
          {
            label: "Ders 2: Component Props Typing",
            href: "/education/lessons/typescript/module-10/lesson-02",
            description: "Component props tip tanımlama",
          },
          {
            label: "Ders 3: Functional Components",
            href: "/education/lessons/typescript/module-10/lesson-03",
            description: "Fonksiyonel component typing",
          },
          {
            label: "Ders 4: Class Components",
            href: "/education/lessons/typescript/module-10/lesson-04",
            description: "Class component typing",
          },
          {
            label: "Ders 5: useState Hook Typing",
            href: "/education/lessons/typescript/module-10/lesson-05",
            description: "useState tip tanımlama",
          },
          {
            label: "Ders 6: useEffect Hook Typing",
            href: "/education/lessons/typescript/module-10/lesson-06",
            description: "useEffect tip tanımlama",
          },
          {
            label: "Ders 7: Custom Hooks Typing",
            href: "/education/lessons/typescript/module-10/lesson-07",
            description: "Özel hook tip tanımlama",
          },
          {
            label: "Ders 8: Event Handlers",
            href: "/education/lessons/typescript/module-10/lesson-08",
            description: "Event handler tip tanımlama",
          },
          {
            label: "Ders 9: Refs Typing",
            href: "/education/lessons/typescript/module-10/lesson-09",
            description: "useRef tip tanımlama",
          },
          {
            label: "Ders 10: Context Typing",
            href: "/education/lessons/typescript/module-10/lesson-10",
            description: "Context tip tanımlama",
          },
          {
            label: "Ders 11: Higher-Order Components",
            href: "/education/lessons/typescript/module-10/lesson-11",
            description: "HOC tip tanımlama",
          },
          {
            label: "Ders 12: React Router Typing",
            href: "/education/lessons/typescript/module-10/lesson-12",
            description: "React Router tip tanımlama",
          },
          {
            label: "Ders 13: Redux Typing",
            href: "/education/lessons/typescript/module-10/lesson-13",
            description: "Redux tip tanımlama",
          },
          {
            label: "Ders 14: React TypeScript Best Practices",
            href: "/education/lessons/typescript/module-10/lesson-14",
            description: "React TypeScript en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: TypeScript ile Vue.js",
        summary:
          "Vue.js + TypeScript entegrasyonu, component typing, Composition API typing ve Vue TypeScript best practices.",
        durationMinutes: 450,
        objectives: [
          "Vue.js + TypeScript entegrasyonunu öğrenmek",
          "Component typing yapmayı öğrenmek",
          "Composition API typing yapmayı öğrenmek",
          "Vue TypeScript best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Vue.js + TypeScript Setup",
            href: "/education/lessons/typescript/module-11/lesson-01",
            description: "Vue TypeScript projesi oluşturma",
          },
          {
            label: "Ders 2: Component Props Typing",
            href: "/education/lessons/typescript/module-11/lesson-02",
            description: "Vue component props tip tanımlama",
          },
          {
            label: "Ders 3: Options API Typing",
            href: "/education/lessons/typescript/module-11/lesson-03",
            description: "Options API tip tanımlama",
          },
          {
            label: "Ders 4: Composition API Typing",
            href: "/education/lessons/typescript/module-11/lesson-04",
            description: "Composition API tip tanımlama",
          },
          {
            label: "Ders 5: ref ve reactive Typing",
            href: "/education/lessons/typescript/module-11/lesson-05",
            description: "ref ve reactive tip tanımlama",
          },
          {
            label: "Ders 6: Computed Typing",
            href: "/education/lessons/typescript/module-11/lesson-06",
            description: "computed tip tanımlama",
          },
          {
            label: "Ders 7: Watch Typing",
            href: "/education/lessons/typescript/module-11/lesson-07",
            description: "watch tip tanımlama",
          },
          {
            label: "Ders 8: Emits Typing",
            href: "/education/lessons/typescript/module-11/lesson-08",
            description: "Event emit tip tanımlama",
          },
          {
            label: "Ders 9: Vuex/Pinia Typing",
            href: "/education/lessons/typescript/module-11/lesson-09",
            description: "State management tip tanımlama",
          },
          {
            label: "Ders 10: Vue Router Typing",
            href: "/education/lessons/typescript/module-11/lesson-10",
            description: "Vue Router tip tanımlama",
          },
          {
            label: "Ders 11: Composables Typing",
            href: "/education/lessons/typescript/module-11/lesson-11",
            description: "Composable fonksiyon tip tanımlama",
          },
          {
            label: "Ders 12: Plugin Typing",
            href: "/education/lessons/typescript/module-11/lesson-12",
            description: "Vue plugin tip tanımlama",
          },
          {
            label: "Ders 13: Nuxt.js TypeScript",
            href: "/education/lessons/typescript/module-11/lesson-13",
            description: "Nuxt.js TypeScript entegrasyonu",
          },
          {
            label: "Ders 14: Vue TypeScript Best Practices",
            href: "/education/lessons/typescript/module-11/lesson-14",
            description: "Vue TypeScript en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: TypeScript ile Node.js",
        summary:
          "Node.js + TypeScript entegrasyonu, Express typing, database typing, API typing ve Node.js TypeScript best practices.",
        durationMinutes: 450,
        objectives: [
          "Node.js + TypeScript entegrasyonunu öğrenmek",
          "Express typing yapmayı öğrenmek",
          "Database typing yapmayı öğrenmek",
          "Node.js TypeScript best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Node.js + TypeScript Setup",
            href: "/education/lessons/typescript/module-12/lesson-01",
            description: "Node.js TypeScript projesi oluşturma",
          },
          {
            label: "Ders 2: Express Typing",
            href: "/education/lessons/typescript/module-12/lesson-02",
            description: "Express.js tip tanımlama",
          },
          {
            label: "Ders 3: Request ve Response Typing",
            href: "/education/lessons/typescript/module-12/lesson-03",
            description: "HTTP request/response tip tanımlama",
          },
          {
            label: "Ders 4: Middleware Typing",
            href: "/education/lessons/typescript/module-12/lesson-04",
            description: "Express middleware tip tanımlama",
          },
          {
            label: "Ders 5: Database Typing",
            href: "/education/lessons/typescript/module-12/lesson-05",
            description: "ORM ve database tip tanımlama",
          },
          {
            label: "Ders 6: API Routes Typing",
            href: "/education/lessons/typescript/module-12/lesson-06",
            description: "API route tip tanımlama",
          },
          {
            label: "Ders 7: Error Handling Typing",
            href: "/education/lessons/typescript/module-12/lesson-07",
            description: "Error tip tanımlama",
          },
          {
            label: "Ders 8: Environment Variables Typing",
            href: "/education/lessons/typescript/module-12/lesson-08",
            description: "Ortam değişkenleri tip tanımlama",
          },
          {
            label: "Ders 9: File System Typing",
            href: "/education/lessons/typescript/module-12/lesson-09",
            description: "fs module tip tanımlama",
          },
          {
            label: "Ders 10: Stream Typing",
            href: "/education/lessons/typescript/module-12/lesson-10",
            description: "Stream tip tanımlama",
          },
          {
            label: "Ders 11: Event Emitter Typing",
            href: "/education/lessons/typescript/module-12/lesson-11",
            description: "EventEmitter tip tanımlama",
          },
          {
            label: "Ders 12: Testing Typing",
            href: "/education/lessons/typescript/module-12/lesson-12",
            description: "Test framework tip tanımlama",
          },
          {
            label: "Ders 13: Microservices Typing",
            href: "/education/lessons/typescript/module-12/lesson-13",
            description: "Mikroservis tip tanımlama",
          },
          {
            label: "Ders 14: Node.js TypeScript Best Practices",
            href: "/education/lessons/typescript/module-12/lesson-14",
            description: "Node.js TypeScript en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: TypeScript Compiler",
        summary:
          "TypeScript compiler detayları, compiler API, programmatic API, AST manipulation ve custom transformers.",
        durationMinutes: 450,
        objectives: [
          "TypeScript compiler detaylarını anlamak",
          "Compiler API kullanmayı öğrenmek",
          "Programmatic API kullanmayı öğrenmek",
          "Custom transformers oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: TypeScript Compiler Overview",
            href: "/education/lessons/typescript/module-13/lesson-01",
            description: "Compiler yapısı ve süreç",
          },
          {
            label: "Ders 2: Compiler API",
            href: "/education/lessons/typescript/module-13/lesson-02",
            description: "TypeScript compiler API",
          },
          {
            label: "Ders 3: Program API",
            href: "/education/lessons/typescript/module-13/lesson-03",
            description: "Program oluşturma ve yönetme",
          },
          {
            label: "Ders 4: TypeChecker API",
            href: "/education/lessons/typescript/module-13/lesson-04",
            description: "Tip kontrolü API",
          },
          {
            label: "Ders 5: AST (Abstract Syntax Tree)",
            href: "/education/lessons/typescript/module-13/lesson-05",
            description: "AST yapısı ve kullanımı",
          },
          {
            label: "Ders 6: AST Traversal",
            href: "/education/lessons/typescript/module-13/lesson-06",
            description: "AST dolaşma",
          },
          {
            label: "Ders 7: AST Transformation",
            href: "/education/lessons/typescript/module-13/lesson-07",
            description: "AST dönüşümü",
          },
          {
            label: "Ders 8: Custom Transformers",
            href: "/education/lessons/typescript/module-13/lesson-08",
            description: "Özel transformer oluşturma",
          },
          {
            label: "Ders 9: Source File Manipulation",
            href: "/education/lessons/typescript/module-13/lesson-09",
            description: "Kaynak dosya manipülasyonu",
          },
          {
            label: "Ders 10: Code Generation",
            href: "/education/lessons/typescript/module-13/lesson-10",
            description: "Kod üretimi",
          },
          {
            label: "Ders 11: Language Service API",
            href: "/education/lessons/typescript/module-13/lesson-11",
            description: "Language service kullanımı",
          },
          {
            label: "Ders 12: Diagnostic Messages",
            href: "/education/lessons/typescript/module-13/lesson-12",
            description: "Hata mesajları",
          },
          {
            label: "Ders 13: Custom Linting",
            href: "/education/lessons/typescript/module-13/lesson-13",
            description: "Özel linting kuralları",
          },
          {
            label: "Ders 14: Compiler Best Practices",
            href: "/education/lessons/typescript/module-13/lesson-14",
            description: "Compiler kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices",
        summary:
          "TypeScript geliştirmede en iyi uygulamalar, kod kalitesi, tip güvenliği, performans ve maintainability.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Tip güvenliği best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Maintainable kod yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/typescript/module-14/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/typescript/module-14/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Type Safety Best Practices",
            href: "/education/lessons/typescript/module-14/lesson-03",
            description: "Tip güvenliği en iyi uygulamaları",
          },
          {
            label: "Ders 4: Avoiding any Type",
            href: "/education/lessons/typescript/module-14/lesson-04",
            description: "any kullanımından kaçınma",
          },
          {
            label: "Ders 5: Error Handling",
            href: "/education/lessons/typescript/module-14/lesson-05",
            description: "Hata yönetimi stratejileri",
          },
          {
            label: "Ders 6: Code Organization",
            href: "/education/lessons/typescript/module-14/lesson-06",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 7: Documentation",
            href: "/education/lessons/typescript/module-14/lesson-07",
            description: "JSDoc ve tip dokümantasyonu",
          },
          {
            label: "Ders 8: Testing with Types",
            href: "/education/lessons/typescript/module-14/lesson-08",
            description: "Tip güvenli test yazma",
          },
          {
            label: "Ders 9: Refactoring Techniques",
            href: "/education/lessons/typescript/module-14/lesson-09",
            description: "Kod refaktörleme teknikleri",
          },
          {
            label: "Ders 10: Performance Considerations",
            href: "/education/lessons/typescript/module-14/lesson-10",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 11: Migration Strategies",
            href: "/education/lessons/typescript/module-14/lesson-11",
            description: "JavaScript'ten TypeScript'e geçiş",
          },
          {
            label: "Ders 12: Team Collaboration",
            href: "/education/lessons/typescript/module-14/lesson-12",
            description: "Takım işbirliği",
          },
          {
            label: "Ders 13: Maintainability",
            href: "/education/lessons/typescript/module-14/lesson-13",
            description: "Bakım yapılabilirlik",
          },
          {
            label: "Ders 14: Common Pitfalls",
            href: "/education/lessons/typescript/module-14/lesson-14",
            description: "Yaygın hatalar ve çözümleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/typescript/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir TypeScript projesi geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
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
            href: "/education/lessons/typescript/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Type System Design",
            href: "/education/lessons/typescript/module-15/lesson-02",
            description: "Tip sistemi tasarımı",
          },
          {
            label: "Ders 3: Architecture Setup",
            href: "/education/lessons/typescript/module-15/lesson-03",
            description: "Mimari yapılandırma",
          },
          {
            label: "Ders 4: Core Types Implementation",
            href: "/education/lessons/typescript/module-15/lesson-04",
            description: "Temel tip implementasyonu",
          },
          {
            label: "Ders 5: Generic Components",
            href: "/education/lessons/typescript/module-15/lesson-05",
            description: "Generic component geliştirme",
          },
          {
            label: "Ders 6: API Integration",
            href: "/education/lessons/typescript/module-15/lesson-06",
            description: "API entegrasyonu ve tip tanımlama",
          },
          {
            label: "Ders 7: Error Handling",
            href: "/education/lessons/typescript/module-15/lesson-07",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 8: Testing Strategy",
            href: "/education/lessons/typescript/module-15/lesson-08",
            description: "Test stratejisi",
          },
          {
            label: "Ders 9: Performance Optimization",
            href: "/education/lessons/typescript/module-15/lesson-09",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 10: Documentation",
            href: "/education/lessons/typescript/module-15/lesson-10",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 11: Code Review",
            href: "/education/lessons/typescript/module-15/lesson-11",
            description: "Kod incelemesi",
          },
          {
            label: "Ders 12: Deployment Preparation",
            href: "/education/lessons/typescript/module-15/lesson-12",
            description: "Dağıtım hazırlığı",
          },
          {
            label: "Ders 13: CI/CD Setup",
            href: "/education/lessons/typescript/module-15/lesson-13",
            description: "Sürekli entegrasyon kurulumu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/typescript/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/typescript/module-15/lesson-15",
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

