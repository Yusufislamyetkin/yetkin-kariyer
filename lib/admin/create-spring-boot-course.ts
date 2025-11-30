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
 * Create complete Spring Boot course structure with predefined content
 */
export async function createSpringBootCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Spring Boot course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Spring Boot, Java ekosisteminde en popüler framework'lerden biridir. Spring Boot ile hızlı, üretime hazır ve production-ready Java uygulamaları geliştirebilirsiniz. Bu kapsamlı kurs ile Spring Boot'un temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. RESTful API'ler, mikroservisler, veritabanı entegrasyonu ve güvenlik konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "Spring Boot framework'ünün temel kavramlarını ve mimarisini anlamak",
      "Spring Boot ile RESTful API'ler ve web uygulamaları geliştirmek",
      "Spring Data JPA ile veritabanı işlemleri yapmak",
      "Dependency Injection ve IoC container kullanmayı öğrenmek",
      "Spring Security ile authentication ve authorization implement etmek",
      "Spring Boot ile mikroservisler geliştirmek",
      "Testing ve deployment stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Java programlama dili bilgisi",
      "Object-Oriented Programming kavramlarına aşinalık",
      "HTTP ve web teknolojileri hakkında temel bilgi",
      "Veritabanı kavramlarına aşinalık",
      "Maven veya Gradle bilgisi (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Spring Boot Tanımı ve Temelleri",
        summary:
          "Spring Boot'un ne olduğu, Spring Framework ile ilişkisi, tarihçesi, avantajları ve Java ekosistemindeki yeri.",
        durationMinutes: 450,
        objectives: [
          "Spring Boot'un ne olduğunu ve neden kullanıldığını anlamak",
          "Spring Framework ile Spring Boot arasındaki farkları öğrenmek",
          "Spring Boot'un avantajlarını ve kullanım alanlarını keşfetmek",
          "Spring ekosistemini tanımak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring Boot Nedir?",
            href: "/education/lessons/spring-boot/module-01/lesson-01",
            description: "Spring Boot'un temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Spring Framework vs Spring Boot",
            href: "/education/lessons/spring-boot/module-01/lesson-02",
            description: "Spring Framework ve Spring Boot karşılaştırması",
          },
          {
            label: "Ders 3: Spring Boot'un Tarihçesi",
            href: "/education/lessons/spring-boot/module-01/lesson-03",
            description: "Spring Boot'un ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: Spring Boot'un Avantajları",
            href: "/education/lessons/spring-boot/module-01/lesson-04",
            description: "Auto-configuration, embedded server, production-ready",
          },
          {
            label: "Ders 5: Spring Boot Kullanım Alanları",
            href: "/education/lessons/spring-boot/module-01/lesson-05",
            description: "Web uygulamaları, REST API, mikroservisler",
          },
          {
            label: "Ders 6: Spring Ekosistemi",
            href: "/education/lessons/spring-boot/module-01/lesson-06",
            description: "Spring Framework, Spring Data, Spring Security",
          },
          {
            label: "Ders 7: Spring Boot Starter'ları",
            href: "/education/lessons/spring-boot/module-01/lesson-07",
            description: "Starter dependencies",
          },
          {
            label: "Ders 8: Spring Boot vs Diğer Framework'ler",
            href: "/education/lessons/spring-boot/module-01/lesson-08",
            description: "Java EE, Jakarta EE karşılaştırması",
          },
          {
            label: "Ders 9: Spring Boot'un Geleceği",
            href: "/education/lessons/spring-boot/module-01/lesson-09",
            description: "Spring Boot roadmap",
          },
          {
            label: "Ders 10: Spring Boot Kurulum Gereksinimleri",
            href: "/education/lessons/spring-boot/module-01/lesson-10",
            description: "JDK, Maven/Gradle gereksinimleri",
          },
          {
            label: "Ders 11: Spring Boot ile Neler Yapılabilir?",
            href: "/education/lessons/spring-boot/module-01/lesson-11",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 12: Spring Boot Performans",
            href: "/education/lessons/spring-boot/module-01/lesson-12",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 13: Spring Boot Geliştirici Deneyimi",
            href: "/education/lessons/spring-boot/module-01/lesson-13",
            description: "IDE desteği ve tooling",
          },
          {
            label: "Ders 14: Spring Boot Topluluk",
            href: "/education/lessons/spring-boot/module-01/lesson-14",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/spring-boot/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Spring Boot Kurulumu ve Proje Oluşturma",
        summary:
          "Spring Boot kurulumu, Spring Initializr, Maven/Gradle yapılandırması, IDE kurulumu ve ilk Spring Boot projesi.",
        durationMinutes: 450,
        objectives: [
          "Spring Boot kurulumunu öğrenmek",
          "Spring Initializr kullanmayı öğrenmek",
          "Maven/Gradle yapılandırmasını anlamak",
          "İlk Spring Boot projesini oluşturmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring Boot Kurulumu",
            href: "/education/lessons/spring-boot/module-02/lesson-01",
            description: "Spring Boot indirme ve kurulum",
          },
          {
            label: "Ders 2: Spring Initializr",
            href: "/education/lessons/spring-boot/module-02/lesson-02",
            description: "Proje oluşturma aracı",
          },
          {
            label: "Ders 3: Maven Yapılandırması",
            href: "/education/lessons/spring-boot/module-02/lesson-03",
            description: "pom.xml yapılandırması",
          },
          {
            label: "Ders 4: Gradle Yapılandırması",
            href: "/education/lessons/spring-boot/module-02/lesson-04",
            description: "build.gradle yapılandırması",
          },
          {
            label: "Ders 5: IntelliJ IDEA Kurulumu",
            href: "/education/lessons/spring-boot/module-02/lesson-05",
            description: "IDE kurulumu",
          },
          {
            label: "Ders 6: Eclipse/STS Kurulumu",
            href: "/education/lessons/spring-boot/module-02/lesson-06",
            description: "Alternatif IDE",
          },
          {
            label: "Ders 7: İlk Spring Boot Projesi",
            href: "/education/lessons/spring-boot/module-02/lesson-07",
            description: "Hello World uygulaması",
          },
          {
            label: "Ders 8: Project Structure",
            href: "/education/lessons/spring-boot/module-02/lesson-08",
            description: "Proje yapısı",
          },
          {
            label: "Ders 9: Application Properties",
            href: "/education/lessons/spring-boot/module-02/lesson-09",
            description: "Yapılandırma dosyaları",
          },
          {
            label: "Ders 10: Build ve Run",
            href: "/education/lessons/spring-boot/module-02/lesson-10",
            description: "Derleme ve çalıştırma",
          },
          {
            label: "Ders 11: Embedded Server",
            href: "/education/lessons/spring-boot/module-02/lesson-11",
            description: "Tomcat, Jetty, Undertow",
          },
          {
            label: "Ders 12: Spring Boot CLI",
            href: "/education/lessons/spring-boot/module-02/lesson-12",
            description: "Komut satırı aracı",
          },
          {
            label: "Ders 13: Spring Boot Best Practices",
            href: "/education/lessons/spring-boot/module-02/lesson-13",
            description: "Kurulum en iyi uygulamaları",
          },
          {
            label: "Ders 14: Troubleshooting",
            href: "/education/lessons/spring-boot/module-02/lesson-14",
            description: "Sorun giderme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Spring Boot Core Concepts",
        summary:
          "Spring Boot core concepts, auto-configuration, starter dependencies, application properties, profiles ve configuration management.",
        durationMinutes: 450,
        objectives: [
          "Auto-configuration kavramını anlamak",
          "Starter dependencies kullanmayı öğrenmek",
          "Application properties yapılandırmayı öğrenmek",
          "Profiles kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Auto-Configuration",
            href: "/education/lessons/spring-boot/module-03/lesson-01",
            description: "Otomatik yapılandırma",
          },
          {
            label: "Ders 2: Starter Dependencies",
            href: "/education/lessons/spring-boot/module-03/lesson-02",
            description: "Başlangıç bağımlılıkları",
          },
          {
            label: "Ders 3: Application Properties",
            href: "/education/lessons/spring-boot/module-03/lesson-03",
            description: "Yapılandırma özellikleri",
          },
          {
            label: "Ders 4: YAML Configuration",
            href: "/education/lessons/spring-boot/module-03/lesson-04",
            description: "YAML yapılandırması",
          },
          {
            label: "Ders 5: Profiles",
            href: "/education/lessons/spring-boot/module-03/lesson-05",
            description: "Ortam profilleri",
          },
          {
            label: "Ders 6: Configuration Properties",
            href: "/education/lessons/spring-boot/module-03/lesson-06",
            description: "@ConfigurationProperties",
          },
          {
            label: "Ders 7: Conditional Configuration",
            href: "/education/lessons/spring-boot/module-03/lesson-07",
            description: "@ConditionalOn",
          },
          {
            label: "Ders 8: Externalized Configuration",
            href: "/education/lessons/spring-boot/module-03/lesson-08",
            description: "Harici yapılandırma",
          },
          {
            label: "Ders 9: Configuration Best Practices",
            href: "/education/lessons/spring-boot/module-03/lesson-09",
            description: "Yapılandırma en iyi uygulamaları",
          },
          {
            label: "Ders 10: Environment Variables",
            href: "/education/lessons/spring-boot/module-03/lesson-10",
            description: "Ortam değişkenleri",
          },
          {
            label: "Ders 11: Command Line Arguments",
            href: "/education/lessons/spring-boot/module-03/lesson-11",
            description: "Komut satırı argümanları",
          },
          {
            label: "Ders 12: Configuration Order",
            href: "/education/lessons/spring-boot/module-03/lesson-12",
            description: "Yapılandırma sırası",
          },
          {
            label: "Ders 13: Custom Auto-Configuration",
            href: "/education/lessons/spring-boot/module-03/lesson-13",
            description: "Özel otomatik yapılandırma",
          },
          {
            label: "Ders 14: Configuration Validation",
            href: "/education/lessons/spring-boot/module-03/lesson-14",
            description: "Yapılandırma doğrulama",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Dependency Injection ve IoC",
        summary:
          "Spring Dependency Injection, Inversion of Control, @Component, @Service, @Repository, @Autowired ve bean management.",
        durationMinutes: 450,
        objectives: [
          "Dependency Injection kavramını anlamak",
          "IoC container kullanmayı öğrenmek",
          "Spring annotations kullanmayı öğrenmek",
          "Bean management yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Dependency Injection",
            href: "/education/lessons/spring-boot/module-04/lesson-01",
            description: "Bağımlılık enjeksiyonu",
          },
          {
            label: "Ders 2: Inversion of Control",
            href: "/education/lessons/spring-boot/module-04/lesson-02",
            description: "Kontrolün tersine çevrilmesi",
          },
          {
            label: "Ders 3: @Component",
            href: "/education/lessons/spring-boot/module-04/lesson-03",
            description: "Bileşen anotasyonu",
          },
          {
            label: "Ders 4: @Service",
            href: "/education/lessons/spring-boot/module-04/lesson-04",
            description: "Servis anotasyonu",
          },
          {
            label: "Ders 5: @Repository",
            href: "/education/lessons/spring-boot/module-04/lesson-05",
            description: "Depo anotasyonu",
          },
          {
            label: "Ders 6: @Autowired",
            href: "/education/lessons/spring-boot/module-04/lesson-06",
            description: "Otomatik bağlama",
          },
          {
            label: "Ders 7: @Qualifier",
            href: "/education/lessons/spring-boot/module-04/lesson-07",
            description: "Niteleyici anotasyon",
          },
          {
            label: "Ders 8: @Primary",
            href: "/education/lessons/spring-boot/module-04/lesson-08",
            description: "Birincil bean",
          },
          {
            label: "Ders 9: Bean Scopes",
            href: "/education/lessons/spring-boot/module-04/lesson-09",
            description: "Bean kapsamları",
          },
          {
            label: "Ders 10: @Configuration",
            href: "/education/lessons/spring-boot/module-04/lesson-10",
            description: "Yapılandırma sınıfları",
          },
          {
            label: "Ders 11: @Bean",
            href: "/education/lessons/spring-boot/module-04/lesson-11",
            description: "Bean tanımlama",
          },
          {
            label: "Ders 12: Constructor Injection",
            href: "/education/lessons/spring-boot/module-04/lesson-12",
            description: "Yapıcı enjeksiyonu",
          },
          {
            label: "Ders 13: Setter Injection",
            href: "/education/lessons/spring-boot/module-04/lesson-13",
            description: "Setter enjeksiyonu",
          },
          {
            label: "Ders 14: DI Best Practices",
            href: "/education/lessons/spring-boot/module-04/lesson-14",
            description: "DI kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Spring MVC ve RESTful APIs",
        summary:
          "Spring MVC, @Controller, @RestController, @RequestMapping, @GetMapping, @PostMapping, request handling ve response handling.",
        durationMinutes: 450,
        objectives: [
          "Spring MVC kavramını anlamak",
          "@Controller ve @RestController kullanmayı öğrenmek",
          "RESTful API geliştirmeyi öğrenmek",
          "Request ve response handling yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring MVC",
            href: "/education/lessons/spring-boot/module-05/lesson-01",
            description: "Model-View-Controller",
          },
          {
            label: "Ders 2: @Controller",
            href: "/education/lessons/spring-boot/module-05/lesson-02",
            description: "Kontrolör anotasyonu",
          },
          {
            label: "Ders 3: @RestController",
            href: "/education/lessons/spring-boot/module-05/lesson-03",
            description: "REST kontrolörü",
          },
          {
            label: "Ders 4: @RequestMapping",
            href: "/education/lessons/spring-boot/module-05/lesson-04",
            description: "İstek eşleştirme",
          },
          {
            label: "Ders 5: @GetMapping",
            href: "/education/lessons/spring-boot/module-05/lesson-05",
            description: "GET istekleri",
          },
          {
            label: "Ders 6: @PostMapping",
            href: "/education/lessons/spring-boot/module-05/lesson-06",
            description: "POST istekleri",
          },
          {
            label: "Ders 7: @PutMapping ve @DeleteMapping",
            href: "/education/lessons/spring-boot/module-05/lesson-07",
            description: "PUT ve DELETE istekleri",
          },
          {
            label: "Ders 8: @PathVariable",
            href: "/education/lessons/spring-boot/module-05/lesson-08",
            description: "Yol değişkenleri",
          },
          {
            label: "Ders 9: @RequestParam",
            href: "/education/lessons/spring-boot/module-05/lesson-09",
            description: "İstek parametreleri",
          },
          {
            label: "Ders 10: @RequestBody",
            href: "/education/lessons/spring-boot/module-05/lesson-10",
            description: "İstek gövdesi",
          },
          {
            label: "Ders 11: @ResponseBody",
            href: "/education/lessons/spring-boot/module-05/lesson-11",
            description: "Yanıt gövdesi",
          },
          {
            label: "Ders 12: ResponseEntity",
            href: "/education/lessons/spring-boot/module-05/lesson-12",
            description: "Yanıt varlığı",
          },
          {
            label: "Ders 13: Exception Handling",
            href: "/education/lessons/spring-boot/module-05/lesson-13",
            description: "@ControllerAdvice, @ExceptionHandler",
          },
          {
            label: "Ders 14: RESTful API Best Practices",
            href: "/education/lessons/spring-boot/module-05/lesson-14",
            description: "REST API en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Spring Data JPA",
        summary:
          "Spring Data JPA, JPA annotations, Entity, Repository, CrudRepository, JpaRepository, custom queries ve query methods.",
        durationMinutes: 450,
        objectives: [
          "Spring Data JPA kavramını anlamak",
          "Entity tanımlamayı öğrenmek",
          "Repository pattern kullanmayı öğrenmek",
          "Custom queries yazmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring Data JPA",
            href: "/education/lessons/spring-boot/module-06/lesson-01",
            description: "JPA entegrasyonu",
          },
          {
            label: "Ders 2: JPA Annotations",
            href: "/education/lessons/spring-boot/module-06/lesson-02",
            description: "@Entity, @Table, @Id",
          },
          {
            label: "Ders 3: Entity Relationships",
            href: "/education/lessons/spring-boot/module-06/lesson-03",
            description: "@OneToMany, @ManyToOne, @ManyToMany",
          },
          {
            label: "Ders 4: Repository Interface",
            href: "/education/lessons/spring-boot/module-06/lesson-04",
            description: "Depo arayüzü",
          },
          {
            label: "Ders 5: CrudRepository",
            href: "/education/lessons/spring-boot/module-06/lesson-05",
            description: "CRUD işlemleri",
          },
          {
            label: "Ders 6: JpaRepository",
            href: "/education/lessons/spring-boot/module-06/lesson-06",
            description: "JPA depo",
          },
          {
            label: "Ders 7: Query Methods",
            href: "/education/lessons/spring-boot/module-06/lesson-07",
            description: "Sorgu metodları",
          },
          {
            label: "Ders 8: @Query",
            href: "/education/lessons/spring-boot/module-06/lesson-08",
            description: "Özel sorgular",
          },
          {
            label: "Ders 9: Native Queries",
            href: "/education/lessons/spring-boot/module-06/lesson-09",
            description: "Yerel sorgular",
          },
          {
            label: "Ders 10: Pagination ve Sorting",
            href: "/education/lessons/spring-boot/module-06/lesson-10",
            description: "Sayfalama ve sıralama",
          },
          {
            label: "Ders 11: Transaction Management",
            href: "/education/lessons/spring-boot/module-06/lesson-11",
            description: "@Transactional",
          },
          {
            label: "Ders 12: Database Configuration",
            href: "/education/lessons/spring-boot/module-06/lesson-12",
            description: "Veritabanı yapılandırması",
          },
          {
            label: "Ders 13: JPA Best Practices",
            href: "/education/lessons/spring-boot/module-06/lesson-13",
            description: "JPA kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common JPA Patterns",
            href: "/education/lessons/spring-boot/module-06/lesson-14",
            description: "Yaygın JPA desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Spring Security",
        summary:
          "Spring Security, authentication, authorization, JWT, OAuth2, security configuration, method security ve security best practices.",
        durationMinutes: 450,
        objectives: [
          "Spring Security kavramını anlamak",
          "Authentication yapılandırmayı öğrenmek",
          "Authorization yapılandırmayı öğrenmek",
          "JWT ve OAuth2 kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring Security",
            href: "/education/lessons/spring-boot/module-07/lesson-01",
            description: "Güvenlik framework'ü",
          },
          {
            label: "Ders 2: Security Configuration",
            href: "/education/lessons/spring-boot/module-07/lesson-02",
            description: "Güvenlik yapılandırması",
          },
          {
            label: "Ders 3: Authentication",
            href: "/education/lessons/spring-boot/module-07/lesson-03",
            description: "Kimlik doğrulama",
          },
          {
            label: "Ders 4: Authorization",
            href: "/education/lessons/spring-boot/module-07/lesson-04",
            description: "Yetkilendirme",
          },
          {
            label: "Ders 5: UserDetailsService",
            href: "/education/lessons/spring-boot/module-07/lesson-05",
            description: "Kullanıcı detay servisi",
          },
          {
            label: "Ders 6: Password Encoding",
            href: "/education/lessons/spring-boot/module-07/lesson-06",
            description: "Şifre kodlama",
          },
          {
            label: "Ders 7: JWT",
            href: "/education/lessons/spring-boot/module-07/lesson-07",
            description: "JSON Web Token",
          },
          {
            label: "Ders 8: OAuth2",
            href: "/education/lessons/spring-boot/module-07/lesson-08",
            description: "OAuth2 entegrasyonu",
          },
          {
            label: "Ders 9: Method Security",
            href: "/education/lessons/spring-boot/module-07/lesson-09",
            description: "@PreAuthorize, @Secured",
          },
          {
            label: "Ders 10: CORS Configuration",
            href: "/education/lessons/spring-boot/module-07/lesson-10",
            description: "CORS yapılandırması",
          },
          {
            label: "Ders 11: CSRF Protection",
            href: "/education/lessons/spring-boot/module-07/lesson-11",
            description: "CSRF koruması",
          },
          {
            label: "Ders 12: Security Best Practices",
            href: "/education/lessons/spring-boot/module-07/lesson-12",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Security Patterns",
            href: "/education/lessons/spring-boot/module-07/lesson-13",
            description: "Yaygın güvenlik desenleri",
          },
          {
            label: "Ders 14: Security Testing",
            href: "/education/lessons/spring-boot/module-07/lesson-14",
            description: "Güvenlik testleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Validation ve Error Handling",
        summary:
          "Bean Validation, @Valid, @NotNull, @Size, custom validators, global exception handling, error responses ve validation best practices.",
        durationMinutes: 450,
        objectives: [
          "Bean Validation kavramını anlamak",
          "Validation annotations kullanmayı öğrenmek",
          "Custom validators yazmayı öğrenmek",
          "Global exception handling yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Bean Validation",
            href: "/education/lessons/spring-boot/module-08/lesson-01",
            description: "Doğrulama kavramı",
          },
          {
            label: "Ders 2: @Valid",
            href: "/education/lessons/spring-boot/module-08/lesson-02",
            description: "Doğrulama anotasyonu",
          },
          {
            label: "Ders 3: @NotNull, @NotEmpty",
            href: "/education/lessons/spring-boot/module-08/lesson-03",
            description: "Boşluk kontrolü",
          },
          {
            label: "Ders 4: @Size, @Min, @Max",
            href: "/education/lessons/spring-boot/module-08/lesson-04",
            description: "Boyut kontrolü",
          },
          {
            label: "Ders 5: @Email, @Pattern",
            href: "/education/lessons/spring-boot/module-08/lesson-05",
            description: "Format kontrolü",
          },
          {
            label: "Ders 6: Custom Validators",
            href: "/education/lessons/spring-boot/module-08/lesson-06",
            description: "Özel doğrulayıcılar",
          },
          {
            label: "Ders 7: Validation Groups",
            href: "/education/lessons/spring-boot/module-08/lesson-07",
            description: "Doğrulama grupları",
          },
          {
            label: "Ders 8: Global Exception Handling",
            href: "/education/lessons/spring-boot/module-08/lesson-08",
            description: "@ControllerAdvice",
          },
          {
            label: "Ders 9: @ExceptionHandler",
            href: "/education/lessons/spring-boot/module-08/lesson-09",
            description: "Hata yakalama",
          },
          {
            label: "Ders 10: Error Responses",
            href: "/education/lessons/spring-boot/module-08/lesson-10",
            description: "Hata yanıtları",
          },
          {
            label: "Ders 11: Validation Error Handling",
            href: "/education/lessons/spring-boot/module-08/lesson-11",
            description: "Doğrulama hataları",
          },
          {
            label: "Ders 12: Custom Error Messages",
            href: "/education/lessons/spring-boot/module-08/lesson-12",
            description: "Özel hata mesajları",
          },
          {
            label: "Ders 13: Validation Best Practices",
            href: "/education/lessons/spring-boot/module-08/lesson-13",
            description: "Doğrulama en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Validation Patterns",
            href: "/education/lessons/spring-boot/module-08/lesson-14",
            description: "Yaygın doğrulama desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Testing",
        summary:
          "Spring Boot testing, JUnit, Mockito, @SpringBootTest, @WebMvcTest, integration testing, test slices ve testing best practices.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "Integration test yazmayı öğrenmek",
          "Test slices kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/spring-boot/module-09/lesson-01",
            description: "Test türleri",
          },
          {
            label: "Ders 2: JUnit",
            href: "/education/lessons/spring-boot/module-09/lesson-02",
            description: "Test framework'ü",
          },
          {
            label: "Ders 3: @SpringBootTest",
            href: "/education/lessons/spring-boot/module-09/lesson-03",
            description: "Spring Boot test",
          },
          {
            label: "Ders 4: @WebMvcTest",
            href: "/education/lessons/spring-boot/module-09/lesson-04",
            description: "Web katmanı testi",
          },
          {
            label: "Ders 5: @DataJpaTest",
            href: "/education/lessons/spring-boot/module-09/lesson-05",
            description: "Veri katmanı testi",
          },
          {
            label: "Ders 6: Mockito",
            href: "/education/lessons/spring-boot/module-09/lesson-06",
            description: "Mock framework'ü",
          },
          {
            label: "Ders 7: @MockBean",
            href: "/education/lessons/spring-boot/module-09/lesson-07",
            description: "Mock bean",
          },
          {
            label: "Ders 8: TestContainers",
            href: "/education/lessons/spring-boot/module-09/lesson-08",
            description: "Test konteynerleri",
          },
          {
            label: "Ders 9: Integration Testing",
            href: "/education/lessons/spring-boot/module-09/lesson-09",
            description: "Entegrasyon testleri",
          },
          {
            label: "Ders 10: REST API Testing",
            href: "/education/lessons/spring-boot/module-09/lesson-10",
            description: "REST API testleri",
          },
          {
            label: "Ders 11: Test Coverage",
            href: "/education/lessons/spring-boot/module-09/lesson-11",
            description: "Test kapsamı",
          },
          {
            label: "Ders 12: Testing Best Practices",
            href: "/education/lessons/spring-boot/module-09/lesson-12",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Testing Patterns",
            href: "/education/lessons/spring-boot/module-09/lesson-13",
            description: "Yaygın test desenleri",
          },
          {
            label: "Ders 14: Performance Testing",
            href: "/education/lessons/spring-boot/module-09/lesson-14",
            description: "Performans testleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Actuator ve Monitoring",
        summary:
          "Spring Boot Actuator, health checks, metrics, endpoints, monitoring, logging, production readiness ve observability.",
        durationMinutes: 450,
        objectives: [
          "Spring Boot Actuator kavramını anlamak",
          "Health checks yapılandırmayı öğrenmek",
          "Metrics kullanmayı öğrenmek",
          "Monitoring yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Spring Boot Actuator",
            href: "/education/lessons/spring-boot/module-10/lesson-01",
            description: "Actuator kavramı",
          },
          {
            label: "Ders 2: Actuator Endpoints",
            href: "/education/lessons/spring-boot/module-10/lesson-02",
            description: "Uç noktalar",
          },
          {
            label: "Ders 3: Health Checks",
            href: "/education/lessons/spring-boot/module-10/lesson-03",
            description: "Sağlık kontrolleri",
          },
          {
            label: "Ders 4: Metrics",
            href: "/education/lessons/spring-boot/module-10/lesson-04",
            description: "Metrikler",
          },
          {
            label: "Ders 5: Custom Health Indicators",
            href: "/education/lessons/spring-boot/module-10/lesson-05",
            description: "Özel sağlık göstergeleri",
          },
          {
            label: "Ders 6: Info Endpoint",
            href: "/education/lessons/spring-boot/module-10/lesson-06",
            description: "Bilgi uç noktası",
          },
          {
            label: "Ders 7: Logging",
            href: "/education/lessons/spring-boot/module-10/lesson-07",
            description: "Loglama",
          },
          {
            label: "Ders 8: Logback Configuration",
            href: "/education/lessons/spring-boot/module-10/lesson-08",
            description: "Logback yapılandırması",
          },
          {
            label: "Ders 9: Monitoring Tools",
            href: "/education/lessons/spring-boot/module-10/lesson-09",
            description: "İzleme araçları",
          },
          {
            label: "Ders 10: Prometheus Integration",
            href: "/education/lessons/spring-boot/module-10/lesson-10",
            description: "Prometheus entegrasyonu",
          },
          {
            label: "Ders 11: Production Readiness",
            href: "/education/lessons/spring-boot/module-10/lesson-11",
            description: "Üretim hazırlığı",
          },
          {
            label: "Ders 12: Observability",
            href: "/education/lessons/spring-boot/module-10/lesson-12",
            description: "Gözlemlenebilirlik",
          },
          {
            label: "Ders 13: Actuator Best Practices",
            href: "/education/lessons/spring-boot/module-10/lesson-13",
            description: "Actuator en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Monitoring Patterns",
            href: "/education/lessons/spring-boot/module-10/lesson-14",
            description: "Yaygın izleme desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Microservices",
        summary:
          "Spring Boot microservices, service discovery, API Gateway, distributed configuration, inter-service communication ve microservices patterns.",
        durationMinutes: 450,
        objectives: [
          "Microservices kavramını anlamak",
          "Service discovery kullanmayı öğrenmek",
          "API Gateway yapılandırmayı öğrenmek",
          "Inter-service communication yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Microservices",
            href: "/education/lessons/spring-boot/module-11/lesson-01",
            description: "Mikroservis kavramı",
          },
          {
            label: "Ders 2: Service Discovery",
            href: "/education/lessons/spring-boot/module-11/lesson-02",
            description: "Servis keşfi",
          },
          {
            label: "Ders 3: Eureka",
            href: "/education/lessons/spring-boot/module-11/lesson-03",
            description: "Eureka servis keşfi",
          },
          {
            label: "Ders 4: Consul",
            href: "/education/lessons/spring-boot/module-11/lesson-04",
            description: "Consul servis keşfi",
          },
          {
            label: "Ders 5: API Gateway",
            href: "/education/lessons/spring-boot/module-11/lesson-05",
            description: "API ağ geçidi",
          },
          {
            label: "Ders 6: Spring Cloud Gateway",
            href: "/education/lessons/spring-boot/module-11/lesson-06",
            description: "Spring Cloud Gateway",
          },
          {
            label: "Ders 7: Distributed Configuration",
            href: "/education/lessons/spring-boot/module-11/lesson-07",
            description: "Dağıtık yapılandırma",
          },
          {
            label: "Ders 8: Config Server",
            href: "/education/lessons/spring-boot/module-11/lesson-08",
            description: "Yapılandırma sunucusu",
          },
          {
            label: "Ders 9: Inter-Service Communication",
            href: "/education/lessons/spring-boot/module-11/lesson-09",
            description: "Servisler arası iletişim",
          },
          {
            label: "Ders 10: Feign Client",
            href: "/education/lessons/spring-boot/module-11/lesson-10",
            description: "Feign istemcisi",
          },
          {
            label: "Ders 11: Circuit Breaker",
            href: "/education/lessons/spring-boot/module-11/lesson-11",
            description: "Devre kesici",
          },
          {
            label: "Ders 12: Resilience4j",
            href: "/education/lessons/spring-boot/module-11/lesson-12",
            description: "Dayanıklılık kütüphanesi",
          },
          {
            label: "Ders 13: Microservices Best Practices",
            href: "/education/lessons/spring-boot/module-11/lesson-13",
            description: "Mikroservis en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Microservices Patterns",
            href: "/education/lessons/spring-boot/module-11/lesson-14",
            description: "Yaygın mikroservis desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Caching",
        summary:
          "Spring Boot caching, @Cacheable, @CacheEvict, @CachePut, cache providers, Redis integration ve caching strategies.",
        durationMinutes: 450,
        objectives: [
          "Caching kavramını anlamak",
          "Spring Cache annotations kullanmayı öğrenmek",
          "Cache providers yapılandırmayı öğrenmek",
          "Redis integration yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Caching",
            href: "/education/lessons/spring-boot/module-12/lesson-01",
            description: "Önbellekleme kavramı",
          },
          {
            label: "Ders 2: @Cacheable",
            href: "/education/lessons/spring-boot/module-12/lesson-02",
            description: "Önbelleğe alınabilir",
          },
          {
            label: "Ders 3: @CacheEvict",
            href: "/education/lessons/spring-boot/module-12/lesson-03",
            description: "Önbellekten çıkarma",
          },
          {
            label: "Ders 4: @CachePut",
            href: "/education/lessons/spring-boot/module-12/lesson-04",
            description: "Önbelleğe koyma",
          },
          {
            label: "Ders 5: Cache Providers",
            href: "/education/lessons/spring-boot/module-12/lesson-05",
            description: "Önbellek sağlayıcıları",
          },
          {
            label: "Ders 6: Redis Integration",
            href: "/education/lessons/spring-boot/module-12/lesson-06",
            description: "Redis entegrasyonu",
          },
          {
            label: "Ders 7: Cache Configuration",
            href: "/education/lessons/spring-boot/module-12/lesson-07",
            description: "Önbellek yapılandırması",
          },
          {
            label: "Ders 8: Cache Keys",
            href: "/education/lessons/spring-boot/module-12/lesson-08",
            description: "Önbellek anahtarları",
          },
          {
            label: "Ders 9: Cache TTL",
            href: "/education/lessons/spring-boot/module-12/lesson-09",
            description: "Yaşam süresi",
          },
          {
            label: "Ders 10: Cache Strategies",
            href: "/education/lessons/spring-boot/module-12/lesson-10",
            description: "Önbellek stratejileri",
          },
          {
            label: "Ders 11: Cache Best Practices",
            href: "/education/lessons/spring-boot/module-12/lesson-11",
            description: "Önbellekleme en iyi uygulamaları",
          },
          {
            label: "Ders 12: Common Caching Patterns",
            href: "/education/lessons/spring-boot/module-12/lesson-12",
            description: "Yaygın önbellekleme desenleri",
          },
          {
            label: "Ders 13: Cache Monitoring",
            href: "/education/lessons/spring-boot/module-12/lesson-13",
            description: "Önbellek izleme",
          },
          {
            label: "Ders 14: Cache Performance",
            href: "/education/lessons/spring-boot/module-12/lesson-14",
            description: "Önbellek performansı",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Async Processing",
        summary:
          "Spring Boot async processing, @Async, CompletableFuture, message queues, RabbitMQ, Kafka integration ve async best practices.",
        durationMinutes: 450,
        objectives: [
          "Async processing kavramını anlamak",
          "@Async kullanmayı öğrenmek",
          "CompletableFuture kullanmayı öğrenmek",
          "Message queues entegre etmeyi öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Async Processing",
            href: "/education/lessons/spring-boot/module-13/lesson-01",
            description: "Asenkron işleme",
          },
          {
            label: "Ders 2: @Async",
            href: "/education/lessons/spring-boot/module-13/lesson-02",
            description: "Asenkron anotasyon",
          },
          {
            label: "Ders 3: CompletableFuture",
            href: "/education/lessons/spring-boot/module-13/lesson-03",
            description: "Tamamlanabilir gelecek",
          },
          {
            label: "Ders 4: Thread Pool Configuration",
            href: "/education/lessons/spring-boot/module-13/lesson-04",
            description: "İş parçacığı havuzu",
          },
          {
            label: "Ders 5: Message Queues",
            href: "/education/lessons/spring-boot/module-13/lesson-05",
            description: "Mesaj kuyrukları",
          },
          {
            label: "Ders 6: RabbitMQ Integration",
            href: "/education/lessons/spring-boot/module-13/lesson-06",
            description: "RabbitMQ entegrasyonu",
          },
          {
            label: "Ders 7: Kafka Integration",
            href: "/education/lessons/spring-boot/module-13/lesson-07",
            description: "Kafka entegrasyonu",
          },
          {
            label: "Ders 8: @Scheduled",
            href: "/education/lessons/spring-boot/module-13/lesson-08",
            description: "Zamanlanmış görevler",
          },
          {
            label: "Ders 9: Event-Driven Architecture",
            href: "/education/lessons/spring-boot/module-13/lesson-09",
            description: "Olay odaklı mimari",
          },
          {
            label: "Ders 10: Async Best Practices",
            href: "/education/lessons/spring-boot/module-13/lesson-10",
            description: "Asenkron en iyi uygulamaları",
          },
          {
            label: "Ders 11: Error Handling in Async",
            href: "/education/lessons/spring-boot/module-13/lesson-11",
            description: "Asenkron hata yönetimi",
          },
          {
            label: "Ders 12: Common Async Patterns",
            href: "/education/lessons/spring-boot/module-13/lesson-12",
            description: "Yaygın asenkron desenleri",
          },
          {
            label: "Ders 13: Async Testing",
            href: "/education/lessons/spring-boot/module-13/lesson-13",
            description: "Asenkron testler",
          },
          {
            label: "Ders 14: Performance Considerations",
            href: "/education/lessons/spring-boot/module-13/lesson-14",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Deployment ve Production",
        summary:
          "Spring Boot deployment, Docker, Kubernetes, CI/CD, production configuration, performance tuning ve deployment best practices.",
        durationMinutes: 450,
        objectives: [
          "Deployment sürecini anlamak",
          "Docker containerization yapmayı öğrenmek",
          "Kubernetes deployment yapmayı öğrenmek",
          "CI/CD pipeline kurmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Temelleri",
            href: "/education/lessons/spring-boot/module-14/lesson-01",
            description: "Dağıtım süreci",
          },
          {
            label: "Ders 2: JAR vs WAR",
            href: "/education/lessons/spring-boot/module-14/lesson-02",
            description: "Paketleme formatları",
          },
          {
            label: "Ders 3: Docker",
            href: "/education/lessons/spring-boot/module-14/lesson-03",
            description: "Konteynerleştirme",
          },
          {
            label: "Ders 4: Dockerfile",
            href: "/education/lessons/spring-boot/module-14/lesson-04",
            description: "Docker dosyası",
          },
          {
            label: "Ders 5: Docker Compose",
            href: "/education/lessons/spring-boot/module-14/lesson-05",
            description: "Docker Compose",
          },
          {
            label: "Ders 6: Kubernetes",
            href: "/education/lessons/spring-boot/module-14/lesson-06",
            description: "Kubernetes dağıtımı",
          },
          {
            label: "Ders 7: CI/CD",
            href: "/education/lessons/spring-boot/module-14/lesson-07",
            description: "Sürekli entegrasyon/dağıtım",
          },
          {
            label: "Ders 8: Jenkins",
            href: "/education/lessons/spring-boot/module-14/lesson-08",
            description: "Jenkins pipeline",
          },
          {
            label: "Ders 9: GitHub Actions",
            href: "/education/lessons/spring-boot/module-14/lesson-09",
            description: "GitHub Actions",
          },
          {
            label: "Ders 10: Production Configuration",
            href: "/education/lessons/spring-boot/module-14/lesson-10",
            description: "Üretim yapılandırması",
          },
          {
            label: "Ders 11: Performance Tuning",
            href: "/education/lessons/spring-boot/module-14/lesson-11",
            description: "Performans ayarlama",
          },
          {
            label: "Ders 12: Deployment Best Practices",
            href: "/education/lessons/spring-boot/module-14/lesson-12",
            description: "Dağıtım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Deployment Issues",
            href: "/education/lessons/spring-boot/module-14/lesson-13",
            description: "Yaygın dağıtım sorunları",
          },
          {
            label: "Ders 14: Monitoring in Production",
            href: "/education/lessons/spring-boot/module-14/lesson-14",
            description: "Üretimde izleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/spring-boot/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "Spring Boot geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir Spring Boot uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir Spring Boot uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/spring-boot/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/spring-boot/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Code Organization",
            href: "/education/lessons/spring-boot/module-15/lesson-03",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/spring-boot/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Mimari Tasarım",
            href: "/education/lessons/spring-boot/module-15/lesson-05",
            description: "Uygulama mimarisi",
          },
          {
            label: "Ders 6: Core Implementation",
            href: "/education/lessons/spring-boot/module-15/lesson-06",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 7: API Implementation",
            href: "/education/lessons/spring-boot/module-15/lesson-07",
            description: "API implementasyonu",
          },
          {
            label: "Ders 8: Data Management",
            href: "/education/lessons/spring-boot/module-15/lesson-08",
            description: "Veri yönetimi",
          },
          {
            label: "Ders 9: Security Implementation",
            href: "/education/lessons/spring-boot/module-15/lesson-09",
            description: "Güvenlik implementasyonu",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/spring-boot/module-15/lesson-10",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 11: Testing Strategy",
            href: "/education/lessons/spring-boot/module-15/lesson-11",
            description: "Test stratejisi",
          },
          {
            label: "Ders 12: Performance Optimization",
            href: "/education/lessons/spring-boot/module-15/lesson-12",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/spring-boot/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/spring-boot/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/spring-boot/module-15/lesson-15",
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

