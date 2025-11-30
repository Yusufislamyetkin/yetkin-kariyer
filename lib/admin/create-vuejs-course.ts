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
 * Create complete Vue.js course structure with predefined content
 */
export async function createVueJSCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Vue.js course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Vue.js, kullanıcı arayüzleri geliştirmek için kullanılan ilerici bir JavaScript framework'üdür. Bu kapsamlı kurs ile Vue.js'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Modern, performanslı ve ölçeklenebilir web uygulamaları geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "Vue.js framework'ünün temel kavramlarını ve mimarisini anlamak",
      "Component-based development yaklaşımını öğrenmek",
      "Vue.js directives ve template syntax'ını etkili kullanmak",
      "State management (Vuex/Pinia) ile uygulama durumunu yönetmek",
      "Vue Router ile routing ve navigation implementasyonu yapmak",
      "Composition API ile modern Vue.js geliştirme tekniklerini öğrenmek",
      "Testing ve deployment stratejilerini uygulamak",
    ],
    prerequisites: [
      "Temel JavaScript bilgisi",
      "HTML ve CSS temel bilgisi",
      "ES6+ JavaScript özelliklerine aşinalık",
      "Web geliştirme temel kavramlarına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Vue.js Tanımı ve Temelleri",
        summary:
          "Vue.js'in ne olduğu, tarihçesi, avantajları, diğer framework'lerden farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "Vue.js'in ne olduğunu ve neden kullanıldığını anlamak",
          "Vue.js'in React ve Angular gibi framework'lerden farklarını öğrenmek",
          "Vue.js'in avantajlarını ve kullanım alanlarını keşfetmek",
          "Progressive framework kavramını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Vue.js Nedir?",
            href: "/education/lessons/vuejs/module-01/lesson-01",
            description: "Vue.js'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Vue.js diğer framework'lerden farkı nedir?",
            href: "/education/lessons/vuejs/module-01/lesson-02",
            description: "Vue.js'in React, Angular gibi framework'lerden farkları",
          },
          {
            label: "Ders 3: Vue.js'in Tarihçesi ve Gelişimi",
            href: "/education/lessons/vuejs/module-01/lesson-03",
            description: "Vue.js'in ortaya çıkışı ve versiyon geçmişi",
          },
          {
            label: "Ders 4: Progressive Framework",
            href: "/education/lessons/vuejs/module-01/lesson-04",
            description: "İlerici framework kavramı ve avantajları",
          },
          {
            label: "Ders 5: Vue.js'in Avantajları",
            href: "/education/lessons/vuejs/module-01/lesson-05",
            description: "Öğrenme kolaylığı, performans, esneklik gibi avantajlar",
          },
          {
            label: "Ders 6: Vue.js Kullanım Alanları",
            href: "/education/lessons/vuejs/module-01/lesson-06",
            description: "SPA, SSR, mobil uygulamalar gibi kullanım senaryoları",
          },
          {
            label: "Ders 7: Vue.js Ekosistemi",
            href: "/education/lessons/vuejs/module-01/lesson-07",
            description: "Vue CLI, Vuex, Vue Router ve topluluk desteği",
          },
          {
            label: "Ders 8: Vue.js Lisanslama",
            href: "/education/lessons/vuejs/module-01/lesson-08",
            description: "MIT lisansı ve ticari kullanım hakları",
          },
          {
            label: "Ders 9: Vue.js Topluluk Desteği",
            href: "/education/lessons/vuejs/module-01/lesson-09",
            description: "Açık kaynak topluluğu ve katkı süreçleri",
          },
          {
            label: "Ders 10: Vue.js'in Geleceği",
            href: "/education/lessons/vuejs/module-01/lesson-10",
            description: "Vue 3+ ve gelecek planları",
          },
          {
            label: "Ders 11: Vue.js Kurulum Gereksinimleri",
            href: "/education/lessons/vuejs/module-01/lesson-11",
            description: "Sistem gereksinimleri ve desteklenen platformlar",
          },
          {
            label: "Ders 12: Vue.js ile Neler Yapılabilir?",
            href: "/education/lessons/vuejs/module-01/lesson-12",
            description: "Web, mobil, desktop uygulamaları",
          },
          {
            label: "Ders 13: Vue.js Performans Özellikleri",
            href: "/education/lessons/vuejs/module-01/lesson-13",
            description: "Yüksek performans ve optimizasyon özellikleri",
          },
          {
            label: "Ders 14: Vue.js Geliştirici Deneyimi",
            href: "/education/lessons/vuejs/module-01/lesson-14",
            description: "Geliştirici dostu özellikler ve araçlar",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/vuejs/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti ve değerlendirme",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Vue.js Kurulumu ve Proje Yapısı",
        summary:
          "Vue.js projesi oluşturma, kurulum yöntemleri, proje yapısı ve geliştirme ortamı kurulumu.",
        durationMinutes: 450,
        objectives: [
          "Vue.js projesi oluşturmayı öğrenmek",
          "Farklı kurulum yöntemlerini anlamak",
          "Proje yapısını ve dosya organizasyonunu öğrenmek",
          "Geliştirme ortamını kurmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Vue.js Kurulum Yöntemleri",
            href: "/education/lessons/vuejs/module-02/lesson-01",
            description: "CDN, npm, Vue CLI kurulum seçenekleri",
          },
          {
            label: "Ders 2: Vue CLI ile Proje Oluşturma",
            href: "/education/lessons/vuejs/module-02/lesson-02",
            description: "Vue CLI kullanarak yeni proje oluşturma",
          },
          {
            label: "Ders 3: Vite ile Proje Oluşturma",
            href: "/education/lessons/vuejs/module-02/lesson-03",
            description: "Vite build tool ile modern Vue.js projesi",
          },
          {
            label: "Ders 4: Proje Yapısı ve Dosya Organizasyonu",
            href: "/education/lessons/vuejs/module-02/lesson-04",
            description: "Klasör yapısı ve dosya organizasyonu",
          },
          {
            label: "Ders 5: package.json ve Bağımlılıklar",
            href: "/education/lessons/vuejs/module-02/lesson-05",
            description: "Package yönetimi ve bağımlılıklar",
          },
          {
            label: "Ders 6: Development Server",
            href: "/education/lessons/vuejs/module-02/lesson-06",
            description: "Geliştirme sunucusu ve hot reload",
          },
          {
            label: "Ders 7: Build ve Production",
            href: "/education/lessons/vuejs/module-02/lesson-07",
            description: "Production build oluşturma",
          },
          {
            label: "Ders 8: IDE ve Editor Kurulumu",
            href: "/education/lessons/vuejs/module-02/lesson-08",
            description: "VS Code ve Vue.js eklentileri",
          },
          {
            label: "Ders 9: ESLint ve Prettier",
            href: "/education/lessons/vuejs/module-02/lesson-09",
            description: "Kod kalitesi araçları",
          },
          {
            label: "Ders 10: TypeScript Desteği",
            href: "/education/lessons/vuejs/module-02/lesson-10",
            description: "TypeScript ile Vue.js projesi",
          },
          {
            label: "Ders 11: Environment Variables",
            href: "/education/lessons/vuejs/module-02/lesson-11",
            description: "Ortam değişkenleri yönetimi",
          },
          {
            label: "Ders 12: Proxy Configuration",
            href: "/education/lessons/vuejs/module-02/lesson-12",
            description: "API proxy yapılandırması",
          },
          {
            label: "Ders 13: Webpack ve Vite Yapılandırması",
            href: "/education/lessons/vuejs/module-02/lesson-13",
            description: "Build tool yapılandırması",
          },
          {
            label: "Ders 14: Testing Setup",
            href: "/education/lessons/vuejs/module-02/lesson-14",
            description: "Test ortamı kurulumu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Template Syntax ve Directives",
        summary:
          "Vue.js template syntax, directives (v-if, v-for, v-bind, v-on), interpolation ve data binding.",
        durationMinutes: 450,
        objectives: [
          "Vue.js template syntax'ını öğrenmek",
          "Directives kullanımını anlamak",
          "Data binding tekniklerini uygulamak",
          "Event handling yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Template Syntax Temelleri",
            href: "/education/lessons/vuejs/module-03/lesson-01",
            description: "Vue.js template yapısı ve syntax",
          },
          {
            label: "Ders 2: Interpolation (Mustache Syntax)",
            href: "/education/lessons/vuejs/module-03/lesson-02",
            description: "Veri gösterimi ve interpolation",
          },
          {
            label: "Ders 3: v-bind Directive",
            href: "/education/lessons/vuejs/module-03/lesson-03",
            description: "Attribute binding ve v-bind kullanımı",
          },
          {
            label: "Ders 4: v-if, v-else-if, v-else",
            href: "/education/lessons/vuejs/module-03/lesson-04",
            description: "Koşullu rendering",
          },
          {
            label: "Ders 5: v-show Directive",
            href: "/education/lessons/vuejs/module-03/lesson-05",
            description: "v-show vs v-if farkları",
          },
          {
            label: "Ders 6: v-for Directive",
            href: "/education/lessons/vuejs/module-03/lesson-06",
            description: "Liste rendering ve v-for kullanımı",
          },
          {
            label: "Ders 7: v-on Directive (Event Handling)",
            href: "/education/lessons/vuejs/module-03/lesson-07",
            description: "Event handling ve metod çağırma",
          },
          {
            label: "Ders 8: Event Modifiers",
            href: "/education/lessons/vuejs/module-03/lesson-08",
            description: ".prevent, .stop, .once gibi modifier'lar",
          },
          {
            label: "Ders 9: v-model Directive",
            href: "/education/lessons/vuejs/module-03/lesson-09",
            description: "Two-way data binding",
          },
          {
            label: "Ders 10: Computed Properties in Templates",
            href: "/education/lessons/vuejs/module-03/lesson-10",
            description: "Template'lerde computed kullanımı",
          },
          {
            label: "Ders 11: Methods in Templates",
            href: "/education/lessons/vuejs/module-03/lesson-11",
            description: "Template'lerde metod çağırma",
          },
          {
            label: "Ders 12: Class ve Style Binding",
            href: "/education/lessons/vuejs/module-03/lesson-12",
            description: "Dinamik class ve style binding",
          },
          {
            label: "Ders 13: Key Attribute",
            href: "/education/lessons/vuejs/module-03/lesson-13",
            description: "v-for'da key kullanımı",
          },
          {
            label: "Ders 14: Directives Best Practices",
            href: "/education/lessons/vuejs/module-03/lesson-14",
            description: "Directive kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Components Temelleri",
        summary:
          "Vue.js component yapısı, component oluşturma, props, events, component communication ve reusability.",
        durationMinutes: 450,
        objectives: [
          "Component kavramını anlamak",
          "Component oluşturmayı öğrenmek",
          "Props ve events kullanmayı öğrenmek",
          "Component communication yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Component Nedir?",
            href: "/education/lessons/vuejs/module-04/lesson-01",
            description: "Component kavramı ve avantajları",
          },
          {
            label: "Ders 2: Single File Components (SFC)",
            href: "/education/lessons/vuejs/module-04/lesson-02",
            description: ".vue dosya yapısı",
          },
          {
            label: "Ders 3: Component Registration",
            href: "/education/lessons/vuejs/module-04/lesson-03",
            description: "Global ve local component kaydı",
          },
          {
            label: "Ders 4: Props Temelleri",
            href: "/education/lessons/vuejs/module-04/lesson-04",
            description: "Props tanımlama ve kullanımı",
          },
          {
            label: "Ders 5: Props Validation",
            href: "/education/lessons/vuejs/module-04/lesson-05",
            description: "Props tip kontrolü ve validasyon",
          },
          {
            label: "Ders 6: Events ve $emit",
            href: "/education/lessons/vuejs/module-04/lesson-06",
            description: "Child-to-parent communication",
          },
          {
            label: "Ders 7: Slots",
            href: "/education/lessons/vuejs/module-04/lesson-07",
            description: "Content projection ve slots",
          },
          {
            label: "Ders 8: Named Slots",
            href: "/education/lessons/vuejs/module-04/lesson-08",
            description: "Çoklu slot kullanımı",
          },
          {
            label: "Ders 9: Scoped Slots",
            href: "/education/lessons/vuejs/module-04/lesson-09",
            description: "Slot props ve scoped slots",
          },
          {
            label: "Ders 10: Component Communication Patterns",
            href: "/education/lessons/vuejs/module-04/lesson-10",
            description: "Farklı iletişim desenleri",
          },
          {
            label: "Ders 11: Dynamic Components",
            href: "/education/lessons/vuejs/module-04/lesson-11",
            description: "Dinamik component rendering",
          },
          {
            label: "Ders 12: Component Reusability",
            href: "/education/lessons/vuejs/module-04/lesson-12",
            description: "Yeniden kullanılabilir component tasarımı",
          },
          {
            label: "Ders 13: Component Composition",
            href: "/education/lessons/vuejs/module-04/lesson-13",
            description: "Component birleştirme stratejileri",
          },
          {
            label: "Ders 14: Component Best Practices",
            href: "/education/lessons/vuejs/module-04/lesson-14",
            description: "Component tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Computed Properties ve Watchers",
        summary:
          "Computed properties, watchers, reactive data, dependency tracking ve performans optimizasyonu.",
        durationMinutes: 450,
        objectives: [
          "Computed properties kavramını anlamak",
          "Watchers kullanmayı öğrenmek",
          "Reactive data sistemini öğrenmek",
          "Performans optimizasyonu yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Computed Properties Nedir?",
            href: "/education/lessons/vuejs/module-05/lesson-01",
            description: "Computed properties kavramı",
          },
          {
            label: "Ders 2: Computed vs Methods",
            href: "/education/lessons/vuejs/module-05/lesson-02",
            description: "Computed ve methods farkları",
          },
          {
            label: "Ders 3: Computed Properties Kullanımı",
            href: "/education/lessons/vuejs/module-05/lesson-03",
            description: "Computed property tanımlama",
          },
          {
            label: "Ders 4: Computed Setters",
            href: "/education/lessons/vuejs/module-05/lesson-04",
            description: "Computed property setter'ları",
          },
          {
            label: "Ders 5: Watchers Nedir?",
            href: "/education/lessons/vuejs/module-05/lesson-05",
            description: "Watcher kavramı ve kullanım alanları",
          },
          {
            label: "Ders 6: Watch Kullanımı",
            href: "/education/lessons/vuejs/module-05/lesson-06",
            description: "watch API kullanımı",
          },
          {
            label: "Ders 7: Deep Watching",
            href: "/education/lessons/vuejs/module-05/lesson-07",
            description: "Nested object watching",
          },
          {
            label: "Ders 8: Immediate Watchers",
            href: "/education/lessons/vuejs/module-05/lesson-08",
            description: "İlk yüklemede çalışan watchers",
          },
          {
            label: "Ders 9: Watch Multiple Sources",
            href: "/education/lessons/vuejs/module-05/lesson-09",
            description: "Birden fazla kaynağı izleme",
          },
          {
            label: "Ders 10: Reactive System",
            href: "/education/lessons/vuejs/module-05/lesson-10",
            description: "Vue.js reactive sistem",
          },
          {
            label: "Ders 11: Dependency Tracking",
            href: "/education/lessons/vuejs/module-05/lesson-11",
            description: "Bağımlılık takibi mekanizması",
          },
          {
            label: "Ders 12: Performance Considerations",
            href: "/education/lessons/vuejs/module-05/lesson-12",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 13: When to Use Computed vs Watch",
            href: "/education/lessons/vuejs/module-05/lesson-13",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 14: Advanced Patterns",
            href: "/education/lessons/vuejs/module-05/lesson-14",
            description: "İleri seviye kullanım desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Component Lifecycle",
        summary:
          "Vue.js component lifecycle hooks, lifecycle stages, hook kullanımı ve best practices.",
        durationMinutes: 450,
        objectives: [
          "Component lifecycle kavramını anlamak",
          "Lifecycle hooks kullanmayı öğrenmek",
          "Lifecycle stages'i öğrenmek",
          "Hook kullanım best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Component Lifecycle Nedir?",
            href: "/education/lessons/vuejs/module-06/lesson-01",
            description: "Lifecycle kavramı ve aşamaları",
          },
          {
            label: "Ders 2: beforeCreate Hook",
            href: "/education/lessons/vuejs/module-06/lesson-02",
            description: "Component oluşturma öncesi",
          },
          {
            label: "Ders 3: created Hook",
            href: "/education/lessons/vuejs/module-06/lesson-03",
            description: "Component oluşturulduktan sonra",
          },
          {
            label: "Ders 4: beforeMount Hook",
            href: "/education/lessons/vuejs/module-06/lesson-04",
            description: "DOM'a mount edilmeden önce",
          },
          {
            label: "Ders 5: mounted Hook",
            href: "/education/lessons/vuejs/module-06/lesson-05",
            description: "DOM'a mount edildikten sonra",
          },
          {
            label: "Ders 6: beforeUpdate Hook",
            href: "/education/lessons/vuejs/module-06/lesson-06",
            description: "Güncelleme öncesi",
          },
          {
            label: "Ders 7: updated Hook",
            href: "/education/lessons/vuejs/module-06/lesson-07",
            description: "Güncelleme sonrası",
          },
          {
            label: "Ders 8: beforeUnmount Hook",
            href: "/education/lessons/vuejs/module-06/lesson-08",
            description: "Unmount öncesi",
          },
          {
            label: "Ders 9: unmounted Hook",
            href: "/education/lessons/vuejs/module-06/lesson-09",
            description: "Unmount sonrası",
          },
          {
            label: "Ders 10: Error Handling Hooks",
            href: "/education/lessons/vuejs/module-06/lesson-10",
            description: "errorCaptured hook",
          },
          {
            label: "Ders 11: Lifecycle in Composition API",
            href: "/education/lessons/vuejs/module-06/lesson-11",
            description: "Composition API lifecycle",
          },
          {
            label: "Ders 12: Common Use Cases",
            href: "/education/lessons/vuejs/module-06/lesson-12",
            description: "Yaygın kullanım senaryoları",
          },
          {
            label: "Ders 13: Lifecycle Best Practices",
            href: "/education/lessons/vuejs/module-06/lesson-13",
            description: "Hook kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Memory Leaks Prevention",
            href: "/education/lessons/vuejs/module-06/lesson-14",
            description: "Bellek sızıntısı önleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: State Management (Vuex/Pinia)",
        summary:
          "State management kavramı, Vuex store, mutations, actions, getters ve Pinia kullanımı.",
        durationMinutes: 450,
        objectives: [
          "State management kavramını anlamak",
          "Vuex store yapısını öğrenmek",
          "Mutations, actions ve getters kullanmayı öğrenmek",
          "Pinia ile modern state management yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: State Management Nedir?",
            href: "/education/lessons/vuejs/module-07/lesson-01",
            description: "State management kavramı ve ihtiyacı",
          },
          {
            label: "Ders 2: Vuex Store Yapısı",
            href: "/education/lessons/vuejs/module-07/lesson-02",
            description: "Vuex store oluşturma ve yapılandırma",
          },
          {
            label: "Ders 3: State",
            href: "/education/lessons/vuejs/module-07/lesson-03",
            description: "Store state tanımlama",
          },
          {
            label: "Ders 4: Getters",
            href: "/education/lessons/vuejs/module-07/lesson-04",
            description: "Computed state değerleri",
          },
          {
            label: "Ders 5: Mutations",
            href: "/education/lessons/vuejs/module-07/lesson-05",
            description: "State değişiklikleri",
          },
          {
            label: "Ders 6: Actions",
            href: "/education/lessons/vuejs/module-07/lesson-06",
            description: "Asenkron işlemler ve actions",
          },
          {
            label: "Ders 7: Modules",
            href: "/education/lessons/vuejs/module-07/lesson-07",
            description: "Store modülleri ve organizasyon",
          },
          {
            label: "Ders 8: Vuex in Components",
            href: "/education/lessons/vuejs/module-07/lesson-08",
            description: "Component'lerde Vuex kullanımı",
          },
          {
            label: "Ders 9: Pinia Giriş",
            href: "/education/lessons/vuejs/module-07/lesson-09",
            description: "Pinia nedir ve avantajları",
          },
          {
            label: "Ders 10: Pinia Stores",
            href: "/education/lessons/vuejs/module-07/lesson-10",
            description: "Pinia store oluşturma",
          },
          {
            label: "Ders 11: Pinia State ve Getters",
            href: "/education/lessons/vuejs/module-07/lesson-11",
            description: "Pinia state yönetimi",
          },
          {
            label: "Ders 12: Pinia Actions",
            href: "/education/lessons/vuejs/module-07/lesson-12",
            description: "Pinia actions kullanımı",
          },
          {
            label: "Ders 13: Vuex vs Pinia",
            href: "/education/lessons/vuejs/module-07/lesson-13",
            description: "İki kütüphane karşılaştırması",
          },
          {
            label: "Ders 14: State Management Best Practices",
            href: "/education/lessons/vuejs/module-07/lesson-14",
            description: "State management en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Routing (Vue Router)",
        summary:
          "Vue Router kullanımı, route tanımlama, navigation, route guards, nested routes ve dynamic routes.",
        durationMinutes: 450,
        objectives: [
          "Vue Router kavramını anlamak",
          "Route tanımlamayı öğrenmek",
          "Navigation yapmayı öğrenmek",
          "Route guards kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Vue Router Nedir?",
            href: "/education/lessons/vuejs/module-08/lesson-01",
            description: "Vue Router kavramı ve kullanımı",
          },
          {
            label: "Ders 2: Vue Router Kurulumu",
            href: "/education/lessons/vuejs/module-08/lesson-02",
            description: "Router kurulumu ve yapılandırma",
          },
          {
            label: "Ders 3: Basic Routing",
            href: "/education/lessons/vuejs/module-08/lesson-03",
            description: "Temel route tanımlama",
          },
          {
            label: "Ders 4: router-view ve router-link",
            href: "/education/lessons/vuejs/module-08/lesson-04",
            description: "Route rendering ve navigation",
          },
          {
            label: "Ders 5: Dynamic Routes",
            href: "/education/lessons/vuejs/module-08/lesson-05",
            description: "Parametreli route'lar",
          },
          {
            label: "Ders 6: Nested Routes",
            href: "/education/lessons/vuejs/module-08/lesson-06",
            description: "İç içe route yapıları",
          },
          {
            label: "Ders 7: Named Routes",
            href: "/education/lessons/vuejs/module-08/lesson-07",
            description: "İsimlendirilmiş route'lar",
          },
          {
            label: "Ders 8: Programmatic Navigation",
            href: "/education/lessons/vuejs/module-08/lesson-08",
            description: "Kod ile navigation",
          },
          {
            label: "Ders 9: Route Params ve Query",
            href: "/education/lessons/vuejs/module-08/lesson-09",
            description: "Route parametreleri ve query string",
          },
          {
            label: "Ders 10: Route Guards",
            href: "/education/lessons/vuejs/module-08/lesson-10",
            description: "beforeEach, beforeResolve, afterEach",
          },
          {
            label: "Ders 11: Per-Route Guards",
            href: "/education/lessons/vuejs/module-08/lesson-11",
            description: "beforeEnter guard",
          },
          {
            label: "Ders 12: Component Guards",
            href: "/education/lessons/vuejs/module-08/lesson-12",
            description: "beforeRouteEnter, beforeRouteUpdate",
          },
          {
            label: "Ders 13: Lazy Loading Routes",
            href: "/education/lessons/vuejs/module-08/lesson-13",
            description: "Code splitting ve lazy loading",
          },
          {
            label: "Ders 14: Router Best Practices",
            href: "/education/lessons/vuejs/module-08/lesson-14",
            description: "Routing en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Forms ve Validation",
        summary:
          "Form handling, v-model kullanımı, form validation, custom validators ve form libraries.",
        durationMinutes: 450,
        objectives: [
          "Form handling tekniklerini öğrenmek",
          "Form validation yapmayı öğrenmek",
          "Custom validators oluşturmayı öğrenmek",
          "Form libraries kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Form Handling Temelleri",
            href: "/education/lessons/vuejs/module-09/lesson-01",
            description: "Vue.js'de form işleme",
          },
          {
            label: "Ders 2: v-model ile Form Binding",
            href: "/education/lessons/vuejs/module-09/lesson-02",
            description: "Form elemanları ile two-way binding",
          },
          {
            label: "Ders 3: Input Types",
            href: "/education/lessons/vuejs/module-09/lesson-03",
            description: "Farklı input tipleri",
          },
          {
            label: "Ders 4: Checkbox ve Radio",
            href: "/education/lessons/vuejs/module-09/lesson-04",
            description: "Checkbox ve radio button handling",
          },
          {
            label: "Ders 5: Select ve Option",
            href: "/education/lessons/vuejs/module-09/lesson-05",
            description: "Dropdown ve select handling",
          },
          {
            label: "Ders 6: Form Validation Temelleri",
            href: "/education/lessons/vuejs/module-09/lesson-06",
            description: "Temel validation teknikleri",
          },
          {
            label: "Ders 7: Custom Validators",
            href: "/education/lessons/vuejs/module-09/lesson-07",
            description: "Özel validator fonksiyonları",
          },
          {
            label: "Ders 8: Validation Messages",
            href: "/education/lessons/vuejs/module-09/lesson-08",
            description: "Hata mesajları gösterimi",
          },
          {
            label: "Ders 9: VeeValidate Library",
            href: "/education/lessons/vuejs/module-09/lesson-09",
            description: "VeeValidate kütüphanesi",
          },
          {
            label: "Ders 10: Form Submission",
            href: "/education/lessons/vuejs/module-09/lesson-10",
            description: "Form gönderimi ve işleme",
          },
          {
            label: "Ders 11: Async Validation",
            href: "/education/lessons/vuejs/module-09/lesson-11",
            description: "Asenkron validation",
          },
          {
            label: "Ders 12: Form Reset ve Clear",
            href: "/education/lessons/vuejs/module-09/lesson-12",
            description: "Form sıfırlama",
          },
          {
            label: "Ders 13: Multi-Step Forms",
            href: "/education/lessons/vuejs/module-09/lesson-13",
            description: "Çok adımlı formlar",
          },
          {
            label: "Ders 14: Form Best Practices",
            href: "/education/lessons/vuejs/module-09/lesson-14",
            description: "Form tasarım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Composition API",
        summary:
          "Vue 3 Composition API, setup function, reactive API, ref, computed, watch ve composables.",
        durationMinutes: 450,
        objectives: [
          "Composition API kavramını anlamak",
          "setup function kullanmayı öğrenmek",
          "Reactive API kullanmayı öğrenmek",
          "Composables oluşturmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Composition API Nedir?",
            href: "/education/lessons/vuejs/module-10/lesson-01",
            description: "Composition API kavramı ve avantajları",
          },
          {
            label: "Ders 2: setup Function",
            href: "/education/lessons/vuejs/module-10/lesson-02",
            description: "setup function kullanımı",
          },
          {
            label: "Ders 3: ref API",
            href: "/education/lessons/vuejs/module-10/lesson-03",
            description: "ref ile reactive değişkenler",
          },
          {
            label: "Ders 4: reactive API",
            href: "/education/lessons/vuejs/module-10/lesson-04",
            description: "reactive ile object reactivity",
          },
          {
            label: "Ders 5: computed in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-05",
            description: "Composition API'de computed",
          },
          {
            label: "Ders 6: watch in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-06",
            description: "Composition API'de watch",
          },
          {
            label: "Ders 7: Lifecycle Hooks in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-07",
            description: "onMounted, onUpdated gibi hooks",
          },
          {
            label: "Ders 8: Props in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-08",
            description: "Props kullanımı",
          },
          {
            label: "Ders 9: Emits in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-09",
            description: "Events emit etme",
          },
          {
            label: "Ders 10: Composables",
            href: "/education/lessons/vuejs/module-10/lesson-10",
            description: "Reusable logic composables",
          },
          {
            label: "Ders 11: Custom Composables",
            href: "/education/lessons/vuejs/module-10/lesson-11",
            description: "Özel composable fonksiyonları",
          },
          {
            label: "Ders 12: provide/inject in Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-12",
            description: "Dependency injection",
          },
          {
            label: "Ders 13: Options API vs Composition API",
            href: "/education/lessons/vuejs/module-10/lesson-13",
            description: "İki API karşılaştırması",
          },
          {
            label: "Ders 14: Composition API Best Practices",
            href: "/education/lessons/vuejs/module-10/lesson-14",
            description: "Composition API en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Testing",
        summary:
          "Vue.js testing, unit testing, component testing, Vue Test Utils, Jest, Vitest ve E2E testing.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "Component test yazmayı öğrenmek",
          "E2E test yazmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/vuejs/module-11/lesson-01",
            description: "Test türleri ve test pyramid",
          },
          {
            label: "Ders 2: Vue Test Utils",
            href: "/education/lessons/vuejs/module-11/lesson-02",
            description: "Vue Test Utils kütüphanesi",
          },
          {
            label: "Ders 3: Component Mounting",
            href: "/education/lessons/vuejs/module-11/lesson-03",
            description: "Component mount etme",
          },
          {
            label: "Ders 4: Testing Component Props",
            href: "/education/lessons/vuejs/module-11/lesson-04",
            description: "Props test etme",
          },
          {
            label: "Ders 5: Testing Events",
            href: "/education/lessons/vuejs/module-11/lesson-05",
            description: "Event test etme",
          },
          {
            label: "Ders 6: Testing Slots",
            href: "/education/lessons/vuejs/module-11/lesson-06",
            description: "Slot test etme",
          },
          {
            label: "Ders 7: Jest Integration",
            href: "/education/lessons/vuejs/module-11/lesson-07",
            description: "Jest test framework",
          },
          {
            label: "Ders 8: Vitest Integration",
            href: "/education/lessons/vuejs/module-11/lesson-08",
            description: "Vitest test framework",
          },
          {
            label: "Ders 9: Mocking",
            href: "/education/lessons/vuejs/module-11/lesson-09",
            description: "Mock ve stub kullanımı",
          },
          {
            label: "Ders 10: Testing Async Operations",
            href: "/education/lessons/vuejs/module-11/lesson-10",
            description: "Asenkron işlem testleri",
          },
          {
            label: "Ders 11: Testing Vuex/Pinia",
            href: "/education/lessons/vuejs/module-11/lesson-11",
            description: "State management testleri",
          },
          {
            label: "Ders 12: Testing Vue Router",
            href: "/education/lessons/vuejs/module-11/lesson-12",
            description: "Router testleri",
          },
          {
            label: "Ders 13: E2E Testing",
            href: "/education/lessons/vuejs/module-11/lesson-13",
            description: "Cypress, Playwright ile E2E testler",
          },
          {
            label: "Ders 14: Testing Best Practices",
            href: "/education/lessons/vuejs/module-11/lesson-14",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Performance Optimization",
        summary:
          "Vue.js performans optimizasyonu, lazy loading, code splitting, virtual scrolling ve bundle optimization.",
        durationMinutes: 450,
        objectives: [
          "Performans optimizasyon tekniklerini öğrenmek",
          "Lazy loading uygulamayı öğrenmek",
          "Code splitting yapmayı öğrenmek",
          "Bundle optimization yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/vuejs/module-12/lesson-01",
            description: "Performans ölçümü ve metrikler",
          },
          {
            label: "Ders 2: Component Lazy Loading",
            href: "/education/lessons/vuejs/module-12/lesson-02",
            description: "Async component loading",
          },
          {
            label: "Ders 3: Route-based Code Splitting",
            href: "/education/lessons/vuejs/module-12/lesson-03",
            description: "Route bazlı code splitting",
          },
          {
            label: "Ders 4: Virtual Scrolling",
            href: "/education/lessons/vuejs/module-12/lesson-04",
            description: "Büyük listeler için virtual scrolling",
          },
          {
            label: "Ders 5: v-memo Directive",
            href: "/education/lessons/vuejs/module-12/lesson-05",
            description: "Memoization ile optimizasyon",
          },
          {
            label: "Ders 6: Computed Caching",
            href: "/education/lessons/vuejs/module-12/lesson-06",
            description: "Computed property caching",
          },
          {
            label: "Ders 7: v-once Directive",
            href: "/education/lessons/vuejs/module-12/lesson-07",
            description: "One-time rendering",
          },
          {
            label: "Ders 8: Bundle Analysis",
            href: "/education/lessons/vuejs/module-12/lesson-08",
            description: "Bundle boyutu analizi",
          },
          {
            label: "Ders 9: Tree Shaking",
            href: "/education/lessons/vuejs/module-12/lesson-09",
            description: "Kullanılmayan kod temizleme",
          },
          {
            label: "Ders 10: Image Optimization",
            href: "/education/lessons/vuejs/module-12/lesson-10",
            description: "Görsel optimizasyonu",
          },
          {
            label: "Ders 11: Prefetching ve Preloading",
            href: "/education/lessons/vuejs/module-12/lesson-11",
            description: "Kaynak ön yükleme",
          },
          {
            label: "Ders 12: SSR Performance",
            href: "/education/lessons/vuejs/module-12/lesson-12",
            description: "Server-side rendering performansı",
          },
          {
            label: "Ders 13: Performance Monitoring",
            href: "/education/lessons/vuejs/module-12/lesson-13",
            description: "Performans izleme araçları",
          },
          {
            label: "Ders 14: Performance Best Practices",
            href: "/education/lessons/vuejs/module-12/lesson-14",
            description: "Performans optimizasyon en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Deployment",
        summary:
          "Vue.js uygulama deployment, build process, hosting options, CI/CD ve production best practices.",
        durationMinutes: 450,
        objectives: [
          "Deployment stratejilerini öğrenmek",
          "Build process'i anlamak",
          "Hosting seçeneklerini öğrenmek",
          "CI/CD pipeline'ları kurmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Stratejileri",
            href: "/education/lessons/vuejs/module-13/lesson-01",
            description: "Dağıtım modelleri ve seçenekleri",
          },
          {
            label: "Ders 2: Production Build",
            href: "/education/lessons/vuejs/module-13/lesson-02",
            description: "Production build oluşturma",
          },
          {
            label: "Ders 3: Environment Configuration",
            href: "/education/lessons/vuejs/module-13/lesson-03",
            description: "Ortam yapılandırması",
          },
          {
            label: "Ders 4: Static Hosting",
            href: "/education/lessons/vuejs/module-13/lesson-04",
            description: "Netlify, Vercel gibi static hosting",
          },
          {
            label: "Ders 5: CDN Deployment",
            href: "/education/lessons/vuejs/module-13/lesson-05",
            description: "CDN ile dağıtım",
          },
          {
            label: "Ders 6: Docker Deployment",
            href: "/education/lessons/vuejs/module-13/lesson-06",
            description: "Containerization ve Docker",
          },
          {
            label: "Ders 7: CI/CD Concepts",
            href: "/education/lessons/vuejs/module-13/lesson-07",
            description: "Sürekli entegrasyon ve dağıtım",
          },
          {
            label: "Ders 8: GitHub Actions",
            href: "/education/lessons/vuejs/module-13/lesson-08",
            description: "GitHub Actions ile CI/CD",
          },
          {
            label: "Ders 9: GitLab CI/CD",
            href: "/education/lessons/vuejs/module-13/lesson-09",
            description: "GitLab CI/CD pipeline",
          },
          {
            label: "Ders 10: SSR Deployment",
            href: "/education/lessons/vuejs/module-13/lesson-10",
            description: "Nuxt.js SSR deployment",
          },
          {
            label: "Ders 11: Monitoring ve Logging",
            href: "/education/lessons/vuejs/module-13/lesson-11",
            description: "Production monitoring",
          },
          {
            label: "Ders 12: Error Tracking",
            href: "/education/lessons/vuejs/module-13/lesson-12",
            description: "Sentry gibi error tracking",
          },
          {
            label: "Ders 13: Performance Monitoring",
            href: "/education/lessons/vuejs/module-13/lesson-13",
            description: "Production performans izleme",
          },
          {
            label: "Ders 14: Deployment Best Practices",
            href: "/education/lessons/vuejs/module-13/lesson-14",
            description: "Deployment en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices",
        summary:
          "Vue.js geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve maintainability.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Maintainable kod yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/vuejs/module-14/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/vuejs/module-14/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Component Structure",
            href: "/education/lessons/vuejs/module-14/lesson-03",
            description: "Component yapısı ve organizasyon",
          },
          {
            label: "Ders 4: Code Organization",
            href: "/education/lessons/vuejs/module-14/lesson-04",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 5: Error Handling",
            href: "/education/lessons/vuejs/module-14/lesson-05",
            description: "Hata yönetimi stratejileri",
          },
          {
            label: "Ders 6: Security Best Practices",
            href: "/education/lessons/vuejs/module-14/lesson-06",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 7: Accessibility",
            href: "/education/lessons/vuejs/module-14/lesson-07",
            description: "Erişilebilirlik (a11y) standartları",
          },
          {
            label: "Ders 8: SEO Best Practices",
            href: "/education/lessons/vuejs/module-14/lesson-08",
            description: "SEO optimizasyonu",
          },
          {
            label: "Ders 9: Code Review Guidelines",
            href: "/education/lessons/vuejs/module-14/lesson-09",
            description: "Kod inceleme kılavuzları",
          },
          {
            label: "Ders 10: Documentation",
            href: "/education/lessons/vuejs/module-14/lesson-10",
            description: "Kod dokümantasyonu",
          },
          {
            label: "Ders 11: Refactoring Techniques",
            href: "/education/lessons/vuejs/module-14/lesson-11",
            description: "Kod refaktörleme teknikleri",
          },
          {
            label: "Ders 12: Technical Debt Management",
            href: "/education/lessons/vuejs/module-14/lesson-12",
            description: "Teknik borç yönetimi",
          },
          {
            label: "Ders 13: Maintainability",
            href: "/education/lessons/vuejs/module-14/lesson-13",
            description: "Bakım yapılabilirlik prensipleri",
          },
          {
            label: "Ders 14: Team Collaboration",
            href: "/education/lessons/vuejs/module-14/lesson-14",
            description: "Takım işbirliği ve workflow",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/vuejs/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir Vue.js projesi geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
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
            href: "/education/lessons/vuejs/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/vuejs/module-15/lesson-02",
            description: "Uygulama mimarisi tasarımı",
          },
          {
            label: "Ders 3: Component Architecture",
            href: "/education/lessons/vuejs/module-15/lesson-03",
            description: "Component yapısı tasarımı",
          },
          {
            label: "Ders 4: State Management Setup",
            href: "/education/lessons/vuejs/module-15/lesson-04",
            description: "State management yapılandırması",
          },
          {
            label: "Ders 5: Routing Implementation",
            href: "/education/lessons/vuejs/module-15/lesson-05",
            description: "Routing yapılandırması",
          },
          {
            label: "Ders 6: API Integration",
            href: "/education/lessons/vuejs/module-15/lesson-06",
            description: "Backend API entegrasyonu",
          },
          {
            label: "Ders 7: Authentication Implementation",
            href: "/education/lessons/vuejs/module-15/lesson-07",
            description: "Kimlik doğrulama implementasyonu",
          },
          {
            label: "Ders 8: Form Handling",
            href: "/education/lessons/vuejs/module-15/lesson-08",
            description: "Form işleme ve validation",
          },
          {
            label: "Ders 9: Error Handling",
            href: "/education/lessons/vuejs/module-15/lesson-09",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 10: Testing Strategy",
            href: "/education/lessons/vuejs/module-15/lesson-10",
            description: "Test stratejisi ve implementasyonu",
          },
          {
            label: "Ders 11: Performance Optimization",
            href: "/education/lessons/vuejs/module-15/lesson-11",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 12: Documentation",
            href: "/education/lessons/vuejs/module-15/lesson-12",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 13: Deployment Preparation",
            href: "/education/lessons/vuejs/module-15/lesson-13",
            description: "Dağıtım hazırlığı",
          },
          {
            label: "Ders 14: CI/CD Setup",
            href: "/education/lessons/vuejs/module-15/lesson-14",
            description: "Sürekli entegrasyon kurulumu",
          },
          {
            label: "Ders 15: Project Review ve Presentation",
            href: "/education/lessons/vuejs/module-15/lesson-15",
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

