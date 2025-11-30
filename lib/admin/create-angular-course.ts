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
 * Create complete Angular course structure with predefined content
 */
export async function createAngularCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Angular course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Angular, Google tarafından geliştirilen modern bir frontend framework'üdür. Bu kapsamlı kurs ile Angular'un temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. TypeScript, Components, Services, Routing, RxJS ve daha fazlası ile modern web uygulamaları geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "Angular framework'ünün temel kavramlarını ve mimarisini anlamak",
      "TypeScript programlama dilini etkili bir şekilde kullanmak",
      "Component-based mimari ile modern web uygulamaları geliştirmek",
      "RxJS ile reactive programming yapmak",
      "Routing ve navigation yönetimi yapmak",
      "Forms ve validation işlemlerini uygulamak",
      "HTTP client ile API entegrasyonu yapmak",
      "Testing ve yazılım kalitesini artırma tekniklerini öğrenmek",
    ],
    prerequisites: [
      "Temel HTML, CSS ve JavaScript bilgisi",
      "Nesne yönelimli programlama (OOP) kavramlarına aşinalık",
      "Web teknolojileri hakkında temel bilgi",
      "Node.js ve npm hakkında temel bilgi",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Angular Tanımı ve Temelleri",
        summary:
          "Angular'un ne olduğu, tarihçesi, avantajları ve diğer frontend framework'lerden farkları hakkında temel bilgiler.",
        durationMinutes: 450,
        objectives: [
          "Angular'un ne olduğunu ve neden kullanıldığını anlamak",
          "Angular vs React vs Vue karşılaştırması yapmak",
          "Angular'un avantajlarını ve kullanım alanlarını keşfetmek",
          "Modern web geliştirme ekosistemini anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Angular Nedir?",
            href: "/education/lessons/angular/module-01/lesson-01",
            description: "Angular'un temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Angular vs React vs Vue",
            href: "/education/lessons/angular/module-01/lesson-02",
            description: "Popüler frontend framework'lerin karşılaştırması",
          },
          {
            label: "Ders 3: Angular'un Tarihçesi ve Gelişimi",
            href: "/education/lessons/angular/module-01/lesson-03",
            description: "AngularJS'den Angular'a geçiş ve versiyon geçmişi",
          },
          {
            label: "Ders 4: Angular'un Avantajları",
            href: "/education/lessons/angular/module-01/lesson-04",
            description: "TypeScript, DI, CLI gibi avantajlar",
          },
          {
            label: "Ders 5: Angular Kullanım Alanları",
            href: "/education/lessons/angular/module-01/lesson-05",
            description: "SPA, enterprise uygulamalar, mobil uygulamalar",
          },
          {
            label: "Ders 6: Angular Ekosistemi",
            href: "/education/lessons/angular/module-01/lesson-06",
            description: "Angular CLI, Material, RxJS ekosistemi",
          },
          {
            label: "Ders 7: Angular CLI'ye Giriş",
            href: "/education/lessons/angular/module-01/lesson-07",
            description: "Angular CLI kurulumu ve temel komutlar",
          },
          {
            label: "Ders 8: İlk Angular Projesi",
            href: "/education/lessons/angular/module-01/lesson-08",
            description: "Yeni proje oluşturma ve yapılandırma",
          },
          {
            label: "Ders 9: Proje Yapısı",
            href: "/education/lessons/angular/module-01/lesson-09",
            description: "Angular proje klasör yapısı ve dosya organizasyonu",
          },
          {
            label: "Ders 10: Angular Versiyonları",
            href: "/education/lessons/angular/module-01/lesson-10",
            description: "Angular versiyon geçmişi ve güncelleme stratejileri",
          },
          {
            label: "Ders 11: Angular Kurulum Gereksinimleri",
            href: "/education/lessons/angular/module-01/lesson-11",
            description: "Node.js, npm ve sistem gereksinimleri",
          },
          {
            label: "Ders 12: Angular ile Neler Yapılabilir?",
            href: "/education/lessons/angular/module-01/lesson-12",
            description: "Web, mobil ve desktop uygulamaları",
          },
          {
            label: "Ders 13: Angular Performans Özellikleri",
            href: "/education/lessons/angular/module-01/lesson-13",
            description: "Change detection, lazy loading, AOT compilation",
          },
          {
            label: "Ders 14: Angular Topluluk Desteği",
            href: "/education/lessons/angular/module-01/lesson-14",
            description: "Açık kaynak topluluk ve kaynaklar",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/angular/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: TypeScript Temelleri",
        summary:
          "TypeScript programlama dilinin temel syntax'ı, veri tipleri, sınıflar, interface'ler ve Angular ile kullanımı.",
        durationMinutes: 450,
        objectives: [
          "TypeScript syntax kurallarını öğrenmek",
          "Veri tipleri ve type annotations kullanmak",
          "Sınıf ve interface kavramlarını anlamak",
          "Angular ile TypeScript kullanımını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: TypeScript'e Giriş",
            href: "/education/lessons/angular/module-02/lesson-01",
            description: "TypeScript'in ne olduğu ve avantajları",
          },
          {
            label: "Ders 2: Veri Tipleri",
            href: "/education/lessons/angular/module-02/lesson-02",
            description: "string, number, boolean, any, void tipleri",
          },
          {
            label: "Ders 3: Array ve Tuple",
            href: "/education/lessons/angular/module-02/lesson-03",
            description: "Dizi ve tuple kullanımı",
          },
          {
            label: "Ders 4: Enum ve Union Types",
            href: "/education/lessons/angular/module-02/lesson-04",
            description: "Enum tanımlama ve union type'lar",
          },
          {
            label: "Ders 5: Interface ve Type Aliases",
            href: "/education/lessons/angular/module-02/lesson-05",
            description: "Interface tanımlama ve type aliases",
          },
          {
            label: "Ders 6: Class ve Inheritance",
            href: "/education/lessons/angular/module-02/lesson-06",
            description: "Sınıf tanımlama ve kalıtım",
          },
          {
            label: "Ders 7: Access Modifiers",
            href: "/education/lessons/angular/module-02/lesson-07",
            description: "public, private, protected kullanımı",
          },
          {
            label: "Ders 8: Generics",
            href: "/education/lessons/angular/module-02/lesson-08",
            description: "Generic type'lar ve kullanımı",
          },
          {
            label: "Ders 9: Decorators",
            href: "/education/lessons/angular/module-02/lesson-09",
            description: "Decorator'lar ve Angular'da kullanımı",
          },
          {
            label: "Ders 10: Modules ve Namespaces",
            href: "/education/lessons/angular/module-02/lesson-10",
            description: "ES6 modules ve namespace'ler",
          },
          {
            label: "Ders 11: Async/Await",
            href: "/education/lessons/angular/module-02/lesson-11",
            description: "Asenkron programlama ve Promise'ler",
          },
          {
            label: "Ders 12: Type Guards",
            href: "/education/lessons/angular/module-02/lesson-12",
            description: "Type narrowing ve type guards",
          },
          {
            label: "Ders 13: Utility Types",
            href: "/education/lessons/angular/module-02/lesson-13",
            description: "Partial, Pick, Omit gibi utility type'lar",
          },
          {
            label: "Ders 14: TypeScript Configuration",
            href: "/education/lessons/angular/module-02/lesson-14",
            description: "tsconfig.json yapılandırması",
          },
          {
            label: "Ders 15: TypeScript Best Practices",
            href: "/education/lessons/angular/module-02/lesson-15",
            description: "TypeScript kullanımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Components ve Templates",
        summary:
          "Angular component yapısı, template syntax, data binding, directives ve component lifecycle.",
        durationMinutes: 450,
        objectives: [
          "Component yapısını anlamak ve oluşturmak",
          "Template syntax ve data binding kullanmak",
          "Directives kullanmayı öğrenmek",
          "Component lifecycle hooks'larını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Component Nedir?",
            href: "/education/lessons/angular/module-03/lesson-01",
            description: "Component kavramı ve yapısı",
          },
          {
            label: "Ders 2: Component Oluşturma",
            href: "/education/lessons/angular/module-03/lesson-02",
            description: "Yeni component oluşturma ve yapılandırma",
          },
          {
            label: "Ders 3: Template Syntax",
            href: "/education/lessons/angular/module-03/lesson-03",
            description: "Template yazım kuralları ve syntax",
          },
          {
            label: "Ders 4: Interpolation",
            href: "/education/lessons/angular/module-03/lesson-04",
            description: "String interpolation ve kullanımı",
          },
          {
            label: "Ders 5: Property Binding",
            href: "/education/lessons/angular/module-03/lesson-05",
            description: "Property binding syntax ve örnekleri",
          },
          {
            label: "Ders 6: Event Binding",
            href: "/education/lessons/angular/module-03/lesson-06",
            description: "Event handling ve event binding",
          },
          {
            label: "Ders 7: Two-Way Data Binding",
            href: "/education/lessons/angular/module-03/lesson-07",
            description: "ngModel ile iki yönlü veri bağlama",
          },
          {
            label: "Ders 8: Structural Directives",
            href: "/education/lessons/angular/module-03/lesson-08",
            description: "*ngIf, *ngFor, *ngSwitch kullanımı",
          },
          {
            label: "Ders 9: Attribute Directives",
            href: "/education/lessons/angular/module-03/lesson-09",
            description: "ngClass, ngStyle kullanımı",
          },
          {
            label: "Ders 10: Component Lifecycle",
            href: "/education/lessons/angular/module-03/lesson-10",
            description: "Lifecycle hooks ve kullanım senaryoları",
          },
          {
            label: "Ders 11: ViewChild ve ContentChild",
            href: "/education/lessons/angular/module-03/lesson-11",
            description: "Child component'lere erişim",
          },
          {
            label: "Ders 12: Component Communication",
            href: "/education/lessons/angular/module-03/lesson-12",
            description: "@Input ve @Output ile iletişim",
          },
          {
            label: "Ders 13: Component Styling",
            href: "/education/lessons/angular/module-03/lesson-13",
            description: "Component styles ve ViewEncapsulation",
          },
          {
            label: "Ders 14: Dynamic Components",
            href: "/education/lessons/angular/module-03/lesson-14",
            description: "Dinamik component oluşturma",
          },
          {
            label: "Ders 15: Component Best Practices",
            href: "/education/lessons/angular/module-03/lesson-15",
            description: "Component tasarımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Services ve Dependency Injection",
        summary:
          "Angular services, dependency injection, singleton pattern ve servis yaşam döngüleri.",
        durationMinutes: 450,
        objectives: [
          "Service kavramını anlamak ve oluşturmak",
          "Dependency Injection kullanmayı öğrenmek",
          "Singleton pattern'i anlamak",
          "Service yaşam döngülerini yönetmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Service Nedir?",
            href: "/education/lessons/angular/module-04/lesson-01",
            description: "Service kavramı ve kullanım alanları",
          },
          {
            label: "Ders 2: Service Oluşturma",
            href: "/education/lessons/angular/module-04/lesson-02",
            description: "Yeni service oluşturma",
          },
          {
            label: "Ders 3: Dependency Injection Temelleri",
            href: "/education/lessons/angular/module-04/lesson-03",
            description: "DI kavramı ve Angular'da kullanımı",
          },
          {
            label: "Ders 4: Injectable Decorator",
            href: "/education/lessons/angular/module-04/lesson-04",
            description: "@Injectable ve providedIn kullanımı",
          },
          {
            label: "Ders 5: Provider Kavramı",
            href: "/education/lessons/angular/module-04/lesson-05",
            description: "Provider'lar ve servis kayıtları",
          },
          {
            label: "Ders 6: Root vs Component Level Providers",
            href: "/education/lessons/angular/module-04/lesson-06",
            description: "Provider scope'ları ve farkları",
          },
          {
            label: "Ders 7: Singleton Pattern",
            href: "/education/lessons/angular/module-04/lesson-07",
            description: "Singleton servisler ve kullanımı",
          },
          {
            label: "Ders 8: Service Injection",
            href: "/education/lessons/angular/module-04/lesson-08",
            description: "Constructor injection ve kullanımı",
          },
          {
            label: "Ders 9: Multiple Instances",
            href: "/education/lessons/angular/module-04/lesson-09",
            description: "Çoklu instance oluşturma",
          },
          {
            label: "Ders 10: Service Communication",
            href: "/education/lessons/angular/module-04/lesson-10",
            description: "Servisler arası iletişim",
          },
          {
            label: "Ders 11: Shared Services",
            href: "/education/lessons/angular/module-04/lesson-11",
            description: "Paylaşılan servisler ve state management",
          },
          {
            label: "Ders 12: Factory Providers",
            href: "/education/lessons/angular/module-04/lesson-12",
            description: "Factory function'lar ile servis oluşturma",
          },
          {
            label: "Ders 13: Value Providers",
            href: "/education/lessons/angular/module-04/lesson-13",
            description: "Value provider'lar ve kullanımı",
          },
          {
            label: "Ders 14: Optional Dependencies",
            href: "/education/lessons/angular/module-04/lesson-14",
            description: "@Optional ve @Inject kullanımı",
          },
          {
            label: "Ders 15: Service Best Practices",
            href: "/education/lessons/angular/module-04/lesson-15",
            description: "Service tasarımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Routing ve Navigation",
        summary:
          "Angular Router, route yapılandırması, navigation, route guards ve lazy loading.",
        durationMinutes: 450,
        objectives: [
          "Angular Router'ı anlamak ve kullanmak",
          "Route yapılandırması yapmak",
          "Navigation işlemlerini yönetmek",
          "Route guards kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Routing Temelleri",
            href: "/education/lessons/angular/module-05/lesson-01",
            description: "SPA routing kavramı ve Angular Router",
          },
          {
            label: "Ders 2: Router Module Yapılandırması",
            href: "/education/lessons/angular/module-05/lesson-02",
            description: "RouterModule import ve yapılandırma",
          },
          {
            label: "Ders 3: Route Tanımlama",
            href: "/education/lessons/angular/module-05/lesson-03",
            description: "Routes array ve path tanımlama",
          },
          {
            label: "Ders 4: Router Outlet",
            href: "/education/lessons/angular/module-05/lesson-04",
            description: "<router-outlet> kullanımı",
          },
          {
            label: "Ders 5: RouterLink Directive",
            href: "/education/lessons/angular/module-05/lesson-05",
            description: "routerLink ile navigation",
          },
          {
            label: "Ders 6: Programmatic Navigation",
            href: "/education/lessons/angular/module-05/lesson-06",
            description: "Router service ile programatik navigation",
          },
          {
            label: "Ders 7: Route Parameters",
            href: "/education/lessons/angular/module-05/lesson-07",
            description: "Route parametreleri ve ActivatedRoute",
          },
          {
            label: "Ders 8: Query Parameters",
            href: "/education/lessons/angular/module-05/lesson-08",
            description: "Query string parametreleri",
          },
          {
            label: "Ders 9: Child Routes",
            href: "/education/lessons/angular/module-05/lesson-09",
            description: "Nested routing ve child routes",
          },
          {
            label: "Ders 10: Route Guards",
            href: "/education/lessons/angular/module-05/lesson-10",
            description: "CanActivate, CanDeactivate guards",
          },
          {
            label: "Ders 11: Resolve Guards",
            href: "/education/lessons/angular/module-05/lesson-11",
            description: "Resolve guard ile data preloading",
          },
          {
            label: "Ders 12: Lazy Loading",
            href: "/education/lessons/angular/module-05/lesson-12",
            description: "Lazy loading modules ve routing",
          },
          {
            label: "Ders 13: Wildcard Routes",
            href: "/education/lessons/angular/module-05/lesson-13",
            description: "404 sayfası ve wildcard routing",
          },
          {
            label: "Ders 14: Route Animations",
            href: "/education/lessons/angular/module-05/lesson-14",
            description: "Route transition animasyonları",
          },
          {
            label: "Ders 15: Routing Best Practices",
            href: "/education/lessons/angular/module-05/lesson-15",
            description: "Routing tasarımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: RxJS ve Observables",
        summary:
          "Reactive programming, Observables, Operators, Subjects ve Angular'da kullanımı.",
        durationMinutes: 450,
        objectives: [
          "Reactive programming kavramını anlamak",
          "Observables ve Promises farkını öğrenmek",
          "RxJS operators kullanmayı öğrenmek",
          "Subjects ve kullanım senaryolarını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Reactive Programming",
            href: "/education/lessons/angular/module-06/lesson-01",
            description: "Reactive programming kavramı",
          },
          {
            label: "Ders 2: Observables Nedir?",
            href: "/education/lessons/angular/module-06/lesson-02",
            description: "Observable pattern ve kullanımı",
          },
          {
            label: "Ders 3: Observables vs Promises",
            href: "/education/lessons/angular/module-06/lesson-03",
            description: "İki pattern'in karşılaştırması",
          },
          {
            label: "Ders 4: Observable Oluşturma",
            href: "/education/lessons/angular/module-06/lesson-04",
            description: "of, from, create ile observable oluşturma",
          },
          {
            label: "Ders 5: Subscription ve Unsubscribe",
            href: "/education/lessons/angular/module-06/lesson-05",
            description: "Subscribe ve memory leak önleme",
          },
          {
            label: "Ders 6: Map ve Filter Operators",
            href: "/education/lessons/angular/module-06/lesson-06",
            description: "Transformation ve filtering operators",
          },
          {
            label: "Ders 7: Merge ve Concat",
            href: "/education/lessons/angular/module-06/lesson-07",
            description: "Observable birleştirme operators",
          },
          {
            label: "Ders 8: SwitchMap ve MergeMap",
            href: "/education/lessons/angular/module-06/lesson-08",
            description: "Higher-order mapping operators",
          },
          {
            label: "Ders 9: Debounce ve Throttle",
            href: "/education/lessons/angular/module-06/lesson-09",
            description: "Time-based operators",
          },
          {
            label: "Ders 10: Subjects",
            href: "/education/lessons/angular/module-06/lesson-10",
            description: "Subject, BehaviorSubject, ReplaySubject",
          },
          {
            label: "Ders 11: Async Pipe",
            href: "/education/lessons/angular/module-06/lesson-11",
            description: "async pipe ile template'te kullanım",
          },
          {
            label: "Ders 12: Error Handling",
            href: "/education/lessons/angular/module-06/lesson-12",
            description: "catchError ve retry operators",
          },
          {
            label: "Ders 13: Custom Operators",
            href: "/education/lessons/angular/module-06/lesson-13",
            description: "Kendi operator'larınızı yazma",
          },
          {
            label: "Ders 14: RxJS Best Practices",
            href: "/education/lessons/angular/module-06/lesson-14",
            description: "RxJS kullanımında en iyi uygulamalar",
          },
          {
            label: "Ders 15: RxJS Testing",
            href: "/education/lessons/angular/module-06/lesson-15",
            description: "Observable'ları test etme",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Forms ve Validation",
        summary:
          "Template-driven forms, reactive forms, form validation, custom validators ve form handling.",
        durationMinutes: 450,
        objectives: [
          "Template-driven forms oluşturmak",
          "Reactive forms kullanmayı öğrenmek",
          "Form validation yapmak",
          "Custom validators yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Forms Temelleri",
            href: "/education/lessons/angular/module-07/lesson-01",
            description: "Angular forms ve yaklaşımlar",
          },
          {
            label: "Ders 2: Template-Driven Forms",
            href: "/education/lessons/angular/module-07/lesson-02",
            description: "NgForm ve template-driven yaklaşım",
          },
          {
            label: "Ders 3: Two-Way Binding ile Forms",
            href: "/education/lessons/angular/module-07/lesson-03",
            description: "ngModel ile form binding",
          },
          {
            label: "Ders 4: Reactive Forms Giriş",
            href: "/education/lessons/angular/module-07/lesson-04",
            description: "FormBuilder ve FormGroup",
          },
          {
            label: "Ders 5: FormControl ve FormArray",
            href: "/education/lessons/angular/module-07/lesson-05",
            description: "FormControl ve FormArray kullanımı",
          },
          {
            label: "Ders 6: Built-in Validators",
            href: "/education/lessons/angular/module-07/lesson-06",
            description: "required, email, min, max validators",
          },
          {
            label: "Ders 7: Custom Validators",
            href: "/education/lessons/angular/module-07/lesson-07",
            description: "Kendi validator fonksiyonlarınızı yazma",
          },
          {
            label: "Ders 8: Async Validators",
            href: "/education/lessons/angular/module-07/lesson-08",
            description: "Asenkron validation işlemleri",
          },
          {
            label: "Ders 9: Form Status ve Errors",
            href: "/education/lessons/angular/module-07/lesson-09",
            description: "Form state yönetimi ve hata gösterimi",
          },
          {
            label: "Ders 10: Dynamic Forms",
            href: "/education/lessons/angular/module-07/lesson-10",
            description: "Dinamik form alanları oluşturma",
          },
          {
            label: "Ders 11: Nested FormGroups",
            href: "/education/lessons/angular/module-07/lesson-11",
            description: "İç içe form grupları",
          },
          {
            label: "Ders 12: Form Submission",
            href: "/education/lessons/angular/module-07/lesson-12",
            description: "Form gönderimi ve veri işleme",
          },
          {
            label: "Ders 13: Form Reset ve Pristine",
            href: "/education/lessons/angular/module-07/lesson-13",
            description: "Form sıfırlama ve state yönetimi",
          },
          {
            label: "Ders 14: FormArray ile Dinamik Listeler",
            href: "/education/lessons/angular/module-07/lesson-14",
            description: "FormArray ile dinamik form alanları",
          },
          {
            label: "Ders 15: Forms Best Practices",
            href: "/education/lessons/angular/module-07/lesson-15",
            description: "Form tasarımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: HTTP Client ve API Entegrasyonu",
        summary:
          "HttpClient, HTTP istekleri, error handling, interceptors ve API entegrasyonu.",
        durationMinutes: 450,
        objectives: [
          "HttpClient kullanmayı öğrenmek",
          "HTTP istekleri yapmak (GET, POST, PUT, DELETE)",
          "Error handling yapmak",
          "Interceptors kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: HttpClient Giriş",
            href: "/education/lessons/angular/module-08/lesson-01",
            description: "HttpClientModule ve yapılandırma",
          },
          {
            label: "Ders 2: GET Request",
            href: "/education/lessons/angular/module-08/lesson-02",
            description: "GET isteği yapma ve veri çekme",
          },
          {
            label: "Ders 3: POST Request",
            href: "/education/lessons/angular/module-08/lesson-03",
            description: "POST isteği ile veri gönderme",
          },
          {
            label: "Ders 4: PUT ve DELETE Request",
            href: "/education/lessons/angular/module-08/lesson-04",
            description: "PUT ve DELETE istekleri",
          },
          {
            label: "Ders 5: Request Options",
            href: "/education/lessons/angular/module-08/lesson-05",
            description: "Headers, params ve options",
          },
          {
            label: "Ders 6: Response Types",
            href: "/education/lessons/angular/module-08/lesson-06",
            description: "JSON, text, blob response tipleri",
          },
          {
            label: "Ders 7: Error Handling",
            href: "/education/lessons/angular/module-08/lesson-07",
            description: "HttpErrorResponse ve hata yönetimi",
          },
          {
            label: "Ders 8: Retry ve Timeout",
            href: "/education/lessons/angular/module-08/lesson-08",
            description: "Retry logic ve timeout yönetimi",
          },
          {
            label: "Ders 9: HTTP Interceptors",
            href: "/education/lessons/angular/module-08/lesson-09",
            description: "Interceptor'lar ve kullanım senaryoları",
          },
          {
            label: "Ders 10: Auth Interceptor",
            href: "/education/lessons/angular/module-08/lesson-10",
            description: "Token ekleme ve authentication",
          },
          {
            label: "Ders 11: Error Interceptor",
            href: "/education/lessons/angular/module-08/lesson-11",
            description: "Global error handling interceptor",
          },
          {
            label: "Ders 12: Loading Interceptor",
            href: "/education/lessons/angular/module-08/lesson-12",
            description: "Loading state yönetimi",
          },
          {
            label: "Ders 13: Caching Strategies",
            href: "/education/lessons/angular/module-08/lesson-13",
            description: "HTTP response caching",
          },
          {
            label: "Ders 14: Progress Events",
            href: "/education/lessons/angular/module-08/lesson-14",
            description: "Upload/download progress tracking",
          },
          {
            label: "Ders 15: HTTP Best Practices",
            href: "/education/lessons/angular/module-08/lesson-15",
            description: "HTTP client kullanımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Pipes ve Directives",
        summary:
          "Built-in pipes, custom pipes, structural directives, attribute directives ve kullanım senaryoları.",
        durationMinutes: 450,
        objectives: [
          "Built-in pipes kullanmayı öğrenmek",
          "Custom pipes yazmak",
          "Structural directives oluşturmak",
          "Attribute directives yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Pipes Nedir?",
            href: "/education/lessons/angular/module-09/lesson-01",
            description: "Pipe kavramı ve kullanım alanları",
          },
          {
            label: "Ders 2: Built-in Pipes",
            href: "/education/lessons/angular/module-09/lesson-02",
            description: "DatePipe, CurrencyPipe, DecimalPipe",
          },
          {
            label: "Ders 3: String Pipes",
            href: "/education/lessons/angular/module-09/lesson-03",
            description: "UpperCasePipe, LowerCasePipe, TitleCasePipe",
          },
          {
            label: "Ders 4: Async Pipe",
            href: "/education/lessons/angular/module-09/lesson-04",
            description: "AsyncPipe ile observable handling",
          },
          {
            label: "Ders 5: Custom Pipe Oluşturma",
            href: "/education/lessons/angular/module-09/lesson-05",
            description: "@Pipe decorator ile custom pipe",
          },
          {
            label: "Ders 6: Pipe Parameters",
            href: "/education/lessons/angular/module-09/lesson-06",
            description: "Pipe'lara parametre geçirme",
          },
          {
            label: "Ders 7: Pure vs Impure Pipes",
            href: "/education/lessons/angular/module-09/lesson-07",
            description: "Pipe performansı ve pure/impure",
          },
          {
            label: "Ders 8: Directives Giriş",
            href: "/education/lessons/angular/module-09/lesson-08",
            description: "Directive türleri ve kullanımı",
          },
          {
            label: "Ders 9: Structural Directives",
            href: "/education/lessons/angular/module-09/lesson-09",
            description: "*ngIf, *ngFor gibi structural directives",
          },
          {
            label: "Ders 10: Custom Structural Directive",
            href: "/education/lessons/angular/module-09/lesson-10",
            description: "Kendi structural directive'inizi yazma",
          },
          {
            label: "Ders 11: Attribute Directives",
            href: "/education/lessons/angular/module-09/lesson-11",
            description: "ngClass, ngStyle attribute directives",
          },
          {
            label: "Ders 12: Custom Attribute Directive",
            href: "/education/lessons/angular/module-09/lesson-12",
            description: "Kendi attribute directive'inizi yazma",
          },
          {
            label: "Ders 13: HostListener ve HostBinding",
            href: "/education/lessons/angular/module-09/lesson-13",
            description: "Host element event ve property binding",
          },
          {
            label: "Ders 14: Directive Communication",
            href: "/education/lessons/angular/module-09/lesson-14",
            description: "Directive'ler arası iletişim",
          },
          {
            label: "Ders 15: Pipes ve Directives Best Practices",
            href: "/education/lessons/angular/module-09/lesson-15",
            description: "Pipes ve directives kullanımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: State Management",
        summary:
          "Component state, service-based state management, NgRx, state management patterns ve best practices.",
        durationMinutes: 450,
        objectives: [
          "State management kavramını anlamak",
          "Service-based state management yapmak",
          "NgRx ile state management öğrenmek",
          "State management patterns uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: State Management Nedir?",
            href: "/education/lessons/angular/module-10/lesson-01",
            description: "State management kavramı ve ihtiyaç",
          },
          {
            label: "Ders 2: Component State",
            href: "/education/lessons/angular/module-10/lesson-02",
            description: "Component içi state yönetimi",
          },
          {
            label: "Ders 3: Service-Based State",
            href: "/education/lessons/angular/module-10/lesson-03",
            description: "Service ile state yönetimi",
          },
          {
            label: "Ders 4: BehaviorSubject ile State",
            href: "/education/lessons/angular/module-10/lesson-04",
            description: "RxJS ile reactive state",
          },
          {
            label: "Ders 5: NgRx Giriş",
            href: "/education/lessons/angular/module-10/lesson-05",
            description: "NgRx kütüphanesi ve Redux pattern",
          },
          {
            label: "Ders 6: Store ve Actions",
            href: "/education/lessons/angular/module-10/lesson-06",
            description: "NgRx Store ve Action'lar",
          },
          {
            label: "Ders 7: Reducers",
            href: "/education/lessons/angular/module-10/lesson-07",
            description: "Reducer fonksiyonları ve state güncelleme",
          },
          {
            label: "Ders 8: Selectors",
            href: "/education/lessons/angular/module-10/lesson-08",
            description: "Selector'lar ile state seçimi",
          },
          {
            label: "Ders 9: Effects",
            href: "/education/lessons/angular/module-10/lesson-09",
            description: "NgRx Effects ile side effects",
          },
          {
            label: "Ders 10: Entity Adapter",
            href: "/education/lessons/angular/module-10/lesson-10",
            description: "EntityAdapter ile collection yönetimi",
          },
          {
            label: "Ders 11: Feature Modules",
            href: "/education/lessons/angular/module-10/lesson-11",
            description: "Feature-based state organization",
          },
          {
            label: "Ders 12: DevTools",
            href: "/education/lessons/angular/module-10/lesson-12",
            description: "Redux DevTools ile debugging",
          },
          {
            label: "Ders 13: State Management Patterns",
            href: "/education/lessons/angular/module-10/lesson-13",
            description: "Farklı state management pattern'leri",
          },
          {
            label: "Ders 14: When to Use NgRx",
            href: "/education/lessons/angular/module-10/lesson-14",
            description: "NgRx kullanım senaryoları",
          },
          {
            label: "Ders 15: State Management Best Practices",
            href: "/education/lessons/angular/module-10/lesson-15",
            description: "State management en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Testing",
        summary:
          "Unit testing, component testing, service testing, e2e testing, Jasmine, Karma ve testing best practices.",
        durationMinutes: 450,
        objectives: [
          "Angular testing framework'ünü anlamak",
          "Component testleri yazmak",
          "Service testleri yazmak",
          "E2E testleri yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/angular/module-11/lesson-01",
            description: "Testing kavramı ve Angular testing",
          },
          {
            label: "Ders 2: Jasmine ve Karma",
            href: "/education/lessons/angular/module-11/lesson-02",
            description: "Testing framework'leri",
          },
          {
            label: "Ders 3: TestBed Yapılandırması",
            href: "/education/lessons/angular/module-11/lesson-03",
            description: "TestBed ile test ortamı kurulumu",
          },
          {
            label: "Ders 4: Component Testing",
            href: "/education/lessons/angular/module-11/lesson-04",
            description: "Component testleri yazma",
          },
          {
            label: "Ders 5: Component DOM Testing",
            href: "/education/lessons/angular/module-11/lesson-05",
            description: "DOM element'lerini test etme",
          },
          {
            label: "Ders 6: Service Testing",
            href: "/education/lessons/angular/module-11/lesson-06",
            description: "Service testleri yazma",
          },
          {
            label: "Ders 7: HTTP Testing",
            href: "/education/lessons/angular/module-11/lesson-07",
            description: "HttpTestingController ile HTTP testleri",
          },
          {
            label: "Ders 8: Router Testing",
            href: "/education/lessons/angular/module-11/lesson-08",
            description: "Router ve navigation testleri",
          },
          {
            label: "Ders 9: Form Testing",
            href: "/education/lessons/angular/module-11/lesson-09",
            description: "Form ve validation testleri",
          },
          {
            label: "Ders 10: Async Testing",
            href: "/education/lessons/angular/module-11/lesson-10",
            description: "Asenkron işlemlerin test edilmesi",
          },
          {
            label: "Ders 11: Mocking ve Spies",
            href: "/education/lessons/angular/module-11/lesson-11",
            description: "Jasmine spies ve mock objeler",
          },
          {
            label: "Ders 12: Code Coverage",
            href: "/education/lessons/angular/module-11/lesson-12",
            description: "Test coverage analizi",
          },
          {
            label: "Ders 13: E2E Testing",
            href: "/education/lessons/angular/module-11/lesson-13",
            description: "Protractor ve Cypress ile E2E testler",
          },
          {
            label: "Ders 14: Testing Best Practices",
            href: "/education/lessons/angular/module-11/lesson-14",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 15: Test-Driven Development",
            href: "/education/lessons/angular/module-11/lesson-15",
            description: "TDD yaklaşımı ve Angular'da uygulama",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Performance Optimization",
        summary:
          "Change detection, OnPush strategy, lazy loading, AOT compilation, bundle optimization ve performance best practices.",
        durationMinutes: 450,
        objectives: [
          "Angular change detection mekanizmasını anlamak",
          "Performance optimizasyon tekniklerini öğrenmek",
          "Lazy loading uygulamak",
          "Bundle size optimizasyonu yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/angular/module-12/lesson-01",
            description: "Web uygulaması performans metrikleri",
          },
          {
            label: "Ders 2: Change Detection",
            href: "/education/lessons/angular/module-12/lesson-02",
            description: "Angular change detection mekanizması",
          },
          {
            label: "Ders 3: OnPush Change Detection",
            href: "/education/lessons/angular/module-12/lesson-03",
            description: "OnPush strategy ve kullanımı",
          },
          {
            label: "Ders 4: Detach ve Reattach",
            href: "/education/lessons/angular/module-12/lesson-04",
            description: "ChangeDetectorRef ile manuel kontrol",
          },
          {
            label: "Ders 5: TrackBy Functions",
            href: "/education/lessons/angular/module-12/lesson-05",
            description: "*ngFor ile trackBy kullanımı",
          },
          {
            label: "Ders 6: Lazy Loading Modules",
            href: "/education/lessons/angular/module-12/lesson-06",
            description: "Lazy loading ile bundle size azaltma",
          },
          {
            label: "Ders 7: AOT Compilation",
            href: "/education/lessons/angular/module-12/lesson-07",
            description: "Ahead-of-Time compilation avantajları",
          },
          {
            label: "Ders 8: Tree Shaking",
            href: "/education/lessons/angular/module-12/lesson-08",
            description: "Dead code elimination",
          },
          {
            label: "Ders 9: Bundle Analysis",
            href: "/education/lessons/angular/module-12/lesson-09",
            description: "Webpack bundle analyzer",
          },
          {
            label: "Ders 10: Code Splitting",
            href: "/education/lessons/angular/module-12/lesson-10",
            description: "Code splitting stratejileri",
          },
          {
            label: "Ders 11: Virtual Scrolling",
            href: "/education/lessons/angular/module-12/lesson-11",
            description: "CDK Virtual Scrolling",
          },
          {
            label: "Ders 12: Image Optimization",
            href: "/education/lessons/angular/module-12/lesson-12",
            description: "Lazy loading images ve optimization",
          },
          {
            label: "Ders 13: Service Workers",
            href: "/education/lessons/angular/module-12/lesson-13",
            description: "PWA ve service worker caching",
          },
          {
            label: "Ders 14: Performance Monitoring",
            href: "/education/lessons/angular/module-12/lesson-14",
            description: "Performance monitoring araçları",
          },
          {
            label: "Ders 15: Performance Best Practices",
            href: "/education/lessons/angular/module-12/lesson-15",
            description: "Performance optimizasyon en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Advanced Topics",
        summary:
          "Angular Material, animations, i18n, PWA, server-side rendering, advanced patterns ve enterprise features.",
        durationMinutes: 450,
        objectives: [
          "Angular Material kullanmayı öğrenmek",
          "Animations implementasyonu yapmak",
          "Internationalization (i18n) yapmak",
          "PWA özelliklerini uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Angular Material Giriş",
            href: "/education/lessons/angular/module-13/lesson-01",
            description: "Material Design ve Angular Material",
          },
          {
            label: "Ders 2: Material Components",
            href: "/education/lessons/angular/module-13/lesson-02",
            description: "Button, Card, Dialog gibi component'ler",
          },
          {
            label: "Ders 3: Material Forms",
            href: "/education/lessons/angular/module-13/lesson-03",
            description: "Material form component'leri",
          },
          {
            label: "Ders 4: Material Navigation",
            href: "/education/lessons/angular/module-13/lesson-04",
            description: "Sidenav, toolbar, menu component'leri",
          },
          {
            label: "Ders 5: Angular Animations",
            href: "/education/lessons/angular/module-13/lesson-05",
            description: "BrowserAnimationsModule ve animations",
          },
          {
            label: "Ders 6: Animation Triggers",
            href: "/education/lessons/angular/module-13/lesson-06",
            description: "Trigger, state, transition tanımlama",
          },
          {
            label: "Ders 7: Route Animations",
            href: "/education/lessons/angular/module-13/lesson-07",
            description: "Route transition animasyonları",
          },
          {
            label: "Ders 8: Internationalization (i18n)",
            href: "/education/lessons/angular/module-13/lesson-08",
            description: "Çoklu dil desteği ve i18n",
          },
          {
            label: "Ders 9: PWA Temelleri",
            href: "/education/lessons/angular/module-13/lesson-09",
            description: "Progressive Web App kavramı",
          },
          {
            label: "Ders 10: Service Workers",
            href: "/education/lessons/angular/module-13/lesson-10",
            description: "Service worker ve offline support",
          },
          {
            label: "Ders 11: Server-Side Rendering",
            href: "/education/lessons/angular/module-13/lesson-11",
            description: "Angular Universal ve SSR",
          },
          {
            label: "Ders 12: Micro Frontends",
            href: "/education/lessons/angular/module-13/lesson-12",
            description: "Micro frontend architecture",
          },
          {
            label: "Ders 13: Angular Elements",
            href: "/education/lessons/angular/module-13/lesson-13",
            description: "Web Components ve Angular Elements",
          },
          {
            label: "Ders 14: Schematics",
            href: "/education/lessons/angular/module-13/lesson-14",
            description: "Custom schematics oluşturma",
          },
          {
            label: "Ders 15: Enterprise Patterns",
            href: "/education/lessons/angular/module-13/lesson-15",
            description: "Enterprise uygulama pattern'leri",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices ve Patterns",
        summary:
          "Angular geliştirmede en iyi uygulamalar, kod organizasyonu, architecture patterns, security ve maintainability.",
        durationMinutes: 450,
        objectives: [
          "Kod organizasyonu standartlarını öğrenmek",
          "Architecture patterns uygulamak",
          "Security best practices uygulamak",
          "Maintainable kod yazmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Organization",
            href: "/education/lessons/angular/module-14/lesson-01",
            description: "Proje yapısı ve dosya organizasyonu",
          },
          {
            label: "Ders 2: Feature Modules",
            href: "/education/lessons/angular/module-14/lesson-02",
            description: "Feature-based module organization",
          },
          {
            label: "Ders 3: Shared Modules",
            href: "/education/lessons/angular/module-14/lesson-03",
            description: "Shared module pattern ve kullanımı",
          },
          {
            label: "Ders 4: Core Module",
            href: "/education/lessons/angular/module-14/lesson-04",
            description: "Core module ve singleton services",
          },
          {
            label: "Ders 5: Naming Conventions",
            href: "/education/lessons/angular/module-14/lesson-05",
            description: "Angular naming conventions",
          },
          {
            label: "Ders 6: Component Design",
            href: "/education/lessons/angular/module-14/lesson-06",
            description: "Component tasarım prensipleri",
          },
          {
            label: "Ders 7: Service Design",
            href: "/education/lessons/angular/module-14/lesson-07",
            description: "Service tasarım ve sorumlulukları",
          },
          {
            label: "Ders 8: Error Handling Strategies",
            href: "/education/lessons/angular/module-14/lesson-08",
            description: "Global error handling ve strategies",
          },
          {
            label: "Ders 9: Logging Best Practices",
            href: "/education/lessons/angular/module-14/lesson-09",
            description: "Logging stratejileri ve tools",
          },
          {
            label: "Ders 10: Security Best Practices",
            href: "/education/lessons/angular/module-14/lesson-10",
            description: "XSS, CSRF ve güvenlik önlemleri",
          },
          {
            label: "Ders 11: Code Review Guidelines",
            href: "/education/lessons/angular/module-14/lesson-11",
            description: "Code review checklist ve guidelines",
          },
          {
            label: "Ders 12: Documentation",
            href: "/education/lessons/angular/module-14/lesson-12",
            description: "Kod dokümantasyonu ve JSDoc",
          },
          {
            label: "Ders 13: Refactoring Techniques",
            href: "/education/lessons/angular/module-14/lesson-13",
            description: "Kod refactoring teknikleri",
          },
          {
            label: "Ders 14: Technical Debt",
            href: "/education/lessons/angular/module-14/lesson-14",
            description: "Technical debt yönetimi",
          },
          {
            label: "Ders 15: Continuous Improvement",
            href: "/education/lessons/angular/module-14/lesson-15",
            description: "Sürekli iyileştirme kültürü",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir Angular projesi geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
        durationMinutes: 450,
        objectives: [
          "Tüm öğrenilenleri bir projede uygulamak",
          "Gerçek dünya senaryosu geliştirmek",
          "Portfolio projesi oluşturmak",
          "End-to-end Angular uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Proje Planlama",
            href: "/education/lessons/angular/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/angular/module-15/lesson-02",
            description: "Uygulama mimarisi tasarımı",
          },
          {
            label: "Ders 3: Component Hierarchy",
            href: "/education/lessons/angular/module-15/lesson-03",
            description: "Component yapısı ve hiyerarşi",
          },
          {
            label: "Ders 4: Routing Yapılandırması",
            href: "/education/lessons/angular/module-15/lesson-04",
            description: "Route yapılandırması ve lazy loading",
          },
          {
            label: "Ders 5: State Management",
            href: "/education/lessons/angular/module-15/lesson-05",
            description: "State management implementasyonu",
          },
          {
            label: "Ders 6: API Entegrasyonu",
            href: "/education/lessons/angular/module-15/lesson-06",
            description: "HTTP client ve API entegrasyonu",
          },
          {
            label: "Ders 7: Forms ve Validation",
            href: "/education/lessons/angular/module-15/lesson-07",
            description: "Form handling ve validation",
          },
          {
            label: "Ders 8: Authentication",
            href: "/education/lessons/angular/module-15/lesson-08",
            description: "Auth implementasyonu ve guards",
          },
          {
            label: "Ders 9: UI/UX Implementation",
            href: "/education/lessons/angular/module-15/lesson-09",
            description: "Material Design ve UI implementation",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/angular/module-15/lesson-10",
            description: "Kapsamlı error handling",
          },
          {
            label: "Ders 11: Testing Strategy",
            href: "/education/lessons/angular/module-15/lesson-11",
            description: "Test stratejisi ve implementasyonu",
          },
          {
            label: "Ders 12: Performance Optimization",
            href: "/education/lessons/angular/module-15/lesson-12",
            description: "Performance optimizasyonu",
          },
          {
            label: "Ders 13: Deployment Preparation",
            href: "/education/lessons/angular/module-15/lesson-13",
            description: "Production build ve deployment",
          },
          {
            label: "Ders 14: Documentation",
            href: "/education/lessons/angular/module-15/lesson-14",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 15: Project Review ve Presentation",
            href: "/education/lessons/angular/module-15/lesson-15",
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

