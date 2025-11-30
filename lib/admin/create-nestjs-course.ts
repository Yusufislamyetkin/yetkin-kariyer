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
 * Create complete NestJS course structure with predefined content
 */
export async function createNestJSCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting NestJS course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "NestJS, TypeScript ile yazılmış, güçlü ve ölçeklenebilir Node.js backend framework'üdür. Angular'dan ilham alan mimarisi ile modern, modüler ve test edilebilir uygulamalar geliştirebilirsiniz. Bu kapsamlı kurs ile NestJS'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. RESTful API'ler, GraphQL, mikroservisler, WebSocket ve güvenlik konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "NestJS framework'ünün temel kavramlarını ve mimarisini anlamak",
      "TypeScript ile NestJS uygulamaları geliştirmek",
      "Modules, Controllers, Providers ve Dependency Injection kullanmayı öğrenmek",
      "RESTful API'ler ve GraphQL API'ler geliştirmek",
      "Database entegrasyonu ve ORM kullanmayı öğrenmek",
      "Authentication, Authorization ve güvenlik implement etmek",
      "Mikroservisler, WebSocket ve real-time uygulamalar geliştirmek",
      "Testing ve deployment stratejilerini öğrenmek",
    ],
    prerequisites: [
      "JavaScript ve TypeScript programlama dili bilgisi",
      "Node.js ve npm/yarn bilgisi",
      "Object-Oriented Programming kavramlarına aşinalık",
      "HTTP ve web teknolojileri hakkında temel bilgi",
      "RESTful API kavramlarına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: NestJS Tanımı ve Temelleri",
        summary:
          "NestJS'in ne olduğu, Node.js ekosistemindeki yeri, Angular'dan ilham alan mimarisi, avantajları ve kullanım alanları.",
        durationMinutes: 450,
        objectives: [
          "NestJS'in ne olduğunu ve neden kullanıldığını anlamak",
          "NestJS'in diğer Node.js framework'lerinden farklarını öğrenmek",
          "NestJS'in avantajlarını ve kullanım alanlarını keşfetmek",
          "NestJS ekosistemini tanımak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: NestJS Nedir?",
            href: "/education/lessons/nestjs/module-01/lesson-01",
            description: "NestJS'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: NestJS vs Express",
            href: "/education/lessons/nestjs/module-01/lesson-02",
            description: "NestJS ve Express karşılaştırması",
          },
          {
            label: "Ders 3: NestJS'in Tarihçesi",
            href: "/education/lessons/nestjs/module-01/lesson-03",
            description: "NestJS'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: NestJS'in Avantajları",
            href: "/education/lessons/nestjs/module-01/lesson-04",
            description: "TypeScript, modülerlik, test edilebilirlik",
          },
          {
            label: "Ders 5: NestJS Kullanım Alanları",
            href: "/education/lessons/nestjs/module-01/lesson-05",
            description: "Web uygulamaları, REST API, GraphQL, mikroservisler",
          },
          {
            label: "Ders 6: NestJS Ekosistemi",
            href: "/education/lessons/nestjs/module-01/lesson-06",
            description: "NestJS CLI, paketler, topluluk",
          },
          {
            label: "Ders 7: Angular'dan İlham",
            href: "/education/lessons/nestjs/module-01/lesson-07",
            description: "Angular mimarisi benzerliği",
          },
          {
            label: "Ders 8: TypeScript Desteği",
            href: "/education/lessons/nestjs/module-01/lesson-08",
            description: "TypeScript entegrasyonu",
          },
          {
            label: "Ders 9: NestJS'in Geleceği",
            href: "/education/lessons/nestjs/module-01/lesson-09",
            description: "NestJS roadmap",
          },
          {
            label: "Ders 10: NestJS Kurulum Gereksinimleri",
            href: "/education/lessons/nestjs/module-01/lesson-10",
            description: "Node.js, npm/yarn gereksinimleri",
          },
          {
            label: "Ders 11: NestJS ile Neler Yapılabilir?",
            href: "/education/lessons/nestjs/module-01/lesson-11",
            description: "Kullanım senaryoları",
          },
          {
            label: "Ders 12: NestJS Performans",
            href: "/education/lessons/nestjs/module-01/lesson-12",
            description: "Performans özellikleri",
          },
          {
            label: "Ders 13: NestJS Geliştirici Deneyimi",
            href: "/education/lessons/nestjs/module-01/lesson-13",
            description: "IDE desteği ve tooling",
          },
          {
            label: "Ders 14: NestJS Topluluk",
            href: "/education/lessons/nestjs/module-01/lesson-14",
            description: "Açık kaynak topluluğu",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/nestjs/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: NestJS Kurulumu ve Proje Oluşturma",
        summary:
          "NestJS CLI kurulumu, proje oluşturma, proje yapısı, package.json yapılandırması, TypeScript yapılandırması ve ilk NestJS uygulaması.",
        durationMinutes: 450,
        objectives: [
          "NestJS CLI kurulumunu öğrenmek",
          "NestJS projesi oluşturmayı öğrenmek",
          "Proje yapısını anlamak",
          "TypeScript yapılandırmasını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: NestJS CLI Kurulumu",
            href: "/education/lessons/nestjs/module-02/lesson-01",
            description: "CLI indirme ve kurulum",
          },
          {
            label: "Ders 2: Yeni Proje Oluşturma",
            href: "/education/lessons/nestjs/module-02/lesson-02",
            description: "nest new komutu",
          },
          {
            label: "Ders 3: Project Structure",
            href: "/education/lessons/nestjs/module-02/lesson-03",
            description: "Proje yapısı",
          },
          {
            label: "Ders 4: package.json",
            href: "/education/lessons/nestjs/module-02/lesson-04",
            description: "Paket yapılandırması",
          },
          {
            label: "Ders 5: TypeScript Configuration",
            href: "/education/lessons/nestjs/module-02/lesson-05",
            description: "tsconfig.json",
          },
          {
            label: "Ders 6: Nest CLI Commands",
            href: "/education/lessons/nestjs/module-02/lesson-06",
            description: "CLI komutları",
          },
          {
            label: "Ders 7: Build ve Run",
            href: "/education/lessons/nestjs/module-02/lesson-07",
            description: "Derleme ve çalıştırma",
          },
          {
            label: "Ders 8: Development Mode",
            href: "/education/lessons/nestjs/module-02/lesson-08",
            description: "Geliştirme modu",
          },
          {
            label: "Ders 9: Hot Reload",
            href: "/education/lessons/nestjs/module-02/lesson-09",
            description: "Sıcak yeniden yükleme",
          },
          {
            label: "Ders 10: Environment Variables",
            href: "/education/lessons/nestjs/module-02/lesson-10",
            description: "Ortam değişkenleri",
          },
          {
            label: "Ders 11: IDE Setup",
            href: "/education/lessons/nestjs/module-02/lesson-11",
            description: "VS Code, WebStorm",
          },
          {
            label: "Ders 12: NestJS Best Practices",
            href: "/education/lessons/nestjs/module-02/lesson-12",
            description: "Kurulum en iyi uygulamaları",
          },
          {
            label: "Ders 13: Troubleshooting",
            href: "/education/lessons/nestjs/module-02/lesson-13",
            description: "Sorun giderme",
          },
          {
            label: "Ders 14: Project Templates",
            href: "/education/lessons/nestjs/module-02/lesson-14",
            description: "Proje şablonları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Modules, Controllers ve Providers",
        summary:
          "NestJS modules, @Module decorator, controllers, @Controller decorator, providers, @Injectable decorator ve dependency injection.",
        durationMinutes: 450,
        objectives: [
          "Modules kavramını anlamak",
          "Controllers kullanmayı öğrenmek",
          "Providers kullanmayı öğrenmek",
          "Dependency Injection yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Modules",
            href: "/education/lessons/nestjs/module-03/lesson-01",
            description: "Modül kavramı",
          },
          {
            label: "Ders 2: @Module Decorator",
            href: "/education/lessons/nestjs/module-03/lesson-02",
            description: "Modül dekoratörü",
          },
          {
            label: "Ders 3: App Module",
            href: "/education/lessons/nestjs/module-03/lesson-03",
            description: "Ana modül",
          },
          {
            label: "Ders 4: Feature Modules",
            href: "/education/lessons/nestjs/module-03/lesson-04",
            description: "Özellik modülleri",
          },
          {
            label: "Ders 5: Controllers",
            href: "/education/lessons/nestjs/module-03/lesson-05",
            description: "Kontrolör kavramı",
          },
          {
            label: "Ders 6: @Controller Decorator",
            href: "/education/lessons/nestjs/module-03/lesson-06",
            description: "Kontrolör dekoratörü",
          },
          {
            label: "Ders 7: Route Handlers",
            href: "/education/lessons/nestjs/module-03/lesson-07",
            description: "Rota işleyicileri",
          },
          {
            label: "Ders 8: Providers",
            href: "/education/lessons/nestjs/module-03/lesson-08",
            description: "Sağlayıcı kavramı",
          },
          {
            label: "Ders 9: @Injectable Decorator",
            href: "/education/lessons/nestjs/module-03/lesson-09",
            description: "Enjekte edilebilir dekoratör",
          },
          {
            label: "Ders 10: Dependency Injection",
            href: "/education/lessons/nestjs/module-03/lesson-10",
            description: "Bağımlılık enjeksiyonu",
          },
          {
            label: "Ders 11: Custom Providers",
            href: "/education/lessons/nestjs/module-03/lesson-11",
            description: "Özel sağlayıcılar",
          },
          {
            label: "Ders 12: Module Best Practices",
            href: "/education/lessons/nestjs/module-03/lesson-12",
            description: "Modül kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Patterns",
            href: "/education/lessons/nestjs/module-03/lesson-13",
            description: "Yaygın desenler",
          },
          {
            label: "Ders 14: Module Organization",
            href: "/education/lessons/nestjs/module-03/lesson-14",
            description: "Modül organizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: RESTful APIs",
        summary:
          "RESTful API geliştirme, HTTP methods, route parameters, query parameters, request body, response handling ve status codes.",
        durationMinutes: 450,
        objectives: [
          "RESTful API kavramını anlamak",
          "HTTP methods kullanmayı öğrenmek",
          "Route parameters kullanmayı öğrenmek",
          "Request ve response handling yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: RESTful API",
            href: "/education/lessons/nestjs/module-04/lesson-01",
            description: "REST kavramı",
          },
          {
            label: "Ders 2: HTTP Methods",
            href: "/education/lessons/nestjs/module-04/lesson-02",
            description: "GET, POST, PUT, DELETE",
          },
          {
            label: "Ders 3: @Get Decorator",
            href: "/education/lessons/nestjs/module-04/lesson-03",
            description: "GET istekleri",
          },
          {
            label: "Ders 4: @Post Decorator",
            href: "/education/lessons/nestjs/module-04/lesson-04",
            description: "POST istekleri",
          },
          {
            label: "Ders 5: @Put ve @Delete",
            href: "/education/lessons/nestjs/module-04/lesson-05",
            description: "PUT ve DELETE istekleri",
          },
          {
            label: "Ders 6: Route Parameters",
            href: "/education/lessons/nestjs/module-04/lesson-06",
            description: "@Param dekoratörü",
          },
          {
            label: "Ders 7: Query Parameters",
            href: "/education/lessons/nestjs/module-04/lesson-07",
            description: "@Query dekoratörü",
          },
          {
            label: "Ders 8: Request Body",
            href: "/education/lessons/nestjs/module-04/lesson-08",
            description: "@Body dekoratörü",
          },
          {
            label: "Ders 9: DTOs",
            href: "/education/lessons/nestjs/module-04/lesson-09",
            description: "Data Transfer Objects",
          },
          {
            label: "Ders 10: Response Handling",
            href: "/education/lessons/nestjs/module-04/lesson-10",
            description: "Yanıt işleme",
          },
          {
            label: "Ders 11: Status Codes",
            href: "/education/lessons/nestjs/module-04/lesson-11",
            description: "@HttpCode, @HttpStatus",
          },
          {
            label: "Ders 12: Headers",
            href: "/education/lessons/nestjs/module-04/lesson-12",
            description: "@Header dekoratörü",
          },
          {
            label: "Ders 13: RESTful API Best Practices",
            href: "/education/lessons/nestjs/module-04/lesson-13",
            description: "REST API en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common API Patterns",
            href: "/education/lessons/nestjs/module-04/lesson-14",
            description: "Yaygın API desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Database Integration",
        summary:
          "Database entegrasyonu, TypeORM, Prisma, Mongoose, database configuration, entities, repositories ve database operations.",
        durationMinutes: 450,
        objectives: [
          "Database entegrasyonu kavramını anlamak",
          "TypeORM kullanmayı öğrenmek",
          "Prisma kullanmayı öğrenmek",
          "Database operations yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Database Integration",
            href: "/education/lessons/nestjs/module-05/lesson-01",
            description: "Veritabanı entegrasyonu",
          },
          {
            label: "Ders 2: TypeORM",
            href: "/education/lessons/nestjs/module-05/lesson-02",
            description: "TypeORM ORM",
          },
          {
            label: "Ders 3: Prisma",
            href: "/education/lessons/nestjs/module-05/lesson-03",
            description: "Prisma ORM",
          },
          {
            label: "Ders 4: Mongoose",
            href: "/education/lessons/nestjs/module-05/lesson-04",
            description: "MongoDB için Mongoose",
          },
          {
            label: "Ders 5: Database Configuration",
            href: "/education/lessons/nestjs/module-05/lesson-05",
            description: "Veritabanı yapılandırması",
          },
          {
            label: "Ders 6: Entities",
            href: "/education/lessons/nestjs/module-05/lesson-06",
            description: "Varlık tanımlama",
          },
          {
            label: "Ders 7: Repositories",
            href: "/education/lessons/nestjs/module-05/lesson-07",
            description: "Depo pattern",
          },
          {
            label: "Ders 8: CRUD Operations",
            href: "/education/lessons/nestjs/module-05/lesson-08",
            description: "CRUD işlemleri",
          },
          {
            label: "Ders 9: Relationships",
            href: "/education/lessons/nestjs/module-05/lesson-09",
            description: "İlişkiler",
          },
          {
            label: "Ders 10: Migrations",
            href: "/education/lessons/nestjs/module-05/lesson-10",
            description: "Veritabanı göçleri",
          },
          {
            label: "Ders 11: Transactions",
            href: "/education/lessons/nestjs/module-05/lesson-11",
            description: "İşlemler",
          },
          {
            label: "Ders 12: Database Best Practices",
            href: "/education/lessons/nestjs/module-05/lesson-12",
            description: "Veritabanı en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Database Patterns",
            href: "/education/lessons/nestjs/module-05/lesson-13",
            description: "Yaygın veritabanı desenleri",
          },
          {
            label: "Ders 14: Performance Optimization",
            href: "/education/lessons/nestjs/module-05/lesson-14",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Validation ve Error Handling",
        summary:
          "Validation, class-validator, DTO validation, pipes, custom pipes, exception filters, global exception handling ve error responses.",
        durationMinutes: 450,
        objectives: [
          "Validation kavramını anlamak",
          "class-validator kullanmayı öğrenmek",
          "Pipes kullanmayı öğrenmek",
          "Exception handling yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Validation",
            href: "/education/lessons/nestjs/module-06/lesson-01",
            description: "Doğrulama kavramı",
          },
          {
            label: "Ders 2: class-validator",
            href: "/education/lessons/nestjs/module-06/lesson-02",
            description: "Doğrulama kütüphanesi",
          },
          {
            label: "Ders 3: Validation Decorators",
            href: "/education/lessons/nestjs/module-06/lesson-03",
            description: "@IsString, @IsNumber, @IsEmail",
          },
          {
            label: "Ders 4: DTO Validation",
            href: "/education/lessons/nestjs/module-06/lesson-04",
            description: "DTO doğrulama",
          },
          {
            label: "Ders 5: Pipes",
            href: "/education/lessons/nestjs/module-06/lesson-05",
            description: "Boru kavramı",
          },
          {
            label: "Ders 6: ValidationPipe",
            href: "/education/lessons/nestjs/module-06/lesson-06",
            description: "Doğrulama borusu",
          },
          {
            label: "Ders 7: Custom Pipes",
            href: "/education/lessons/nestjs/module-06/lesson-07",
            description: "Özel borular",
          },
          {
            label: "Ders 8: Exception Filters",
            href: "/education/lessons/nestjs/module-06/lesson-08",
            description: "İstisna filtreleri",
          },
          {
            label: "Ders 9: Global Exception Handling",
            href: "/education/lessons/nestjs/module-06/lesson-09",
            description: "Global hata yönetimi",
          },
          {
            label: "Ders 10: Custom Exceptions",
            href: "/education/lessons/nestjs/module-06/lesson-10",
            description: "Özel istisnalar",
          },
          {
            label: "Ders 11: Error Responses",
            href: "/education/lessons/nestjs/module-06/lesson-11",
            description: "Hata yanıtları",
          },
          {
            label: "Ders 12: Validation Best Practices",
            href: "/education/lessons/nestjs/module-06/lesson-12",
            description: "Doğrulama en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Validation Patterns",
            href: "/education/lessons/nestjs/module-06/lesson-13",
            description: "Yaygın doğrulama desenleri",
          },
          {
            label: "Ders 14: Error Handling Best Practices",
            href: "/education/lessons/nestjs/module-06/lesson-14",
            description: "Hata yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Authentication ve Authorization",
        summary:
          "Authentication, JWT, Passport, guards, decorators, role-based access control, OAuth2 ve security best practices.",
        durationMinutes: 450,
        objectives: [
          "Authentication kavramını anlamak",
          "JWT kullanmayı öğrenmek",
          "Passport entegrasyonu yapmayı öğrenmek",
          "Authorization yapılandırmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Authentication",
            href: "/education/lessons/nestjs/module-07/lesson-01",
            description: "Kimlik doğrulama",
          },
          {
            label: "Ders 2: JWT",
            href: "/education/lessons/nestjs/module-07/lesson-02",
            description: "JSON Web Token",
          },
          {
            label: "Ders 3: Passport",
            href: "/education/lessons/nestjs/module-07/lesson-03",
            description: "Passport entegrasyonu",
          },
          {
            label: "Ders 4: JWT Strategy",
            href: "/education/lessons/nestjs/module-07/lesson-04",
            description: "JWT stratejisi",
          },
          {
            label: "Ders 5: Guards",
            href: "/education/lessons/nestjs/module-07/lesson-05",
            description: "Koruma mekanizması",
          },
          {
            label: "Ders 6: @UseGuards",
            href: "/education/lessons/nestjs/module-07/lesson-06",
            description: "Koruma kullanımı",
          },
          {
            label: "Ders 7: Custom Guards",
            href: "/education/lessons/nestjs/module-07/lesson-07",
            description: "Özel korumalar",
          },
          {
            label: "Ders 8: Authorization",
            href: "/education/lessons/nestjs/module-07/lesson-08",
            description: "Yetkilendirme",
          },
          {
            label: "Ders 9: Role-Based Access Control",
            href: "/education/lessons/nestjs/module-07/lesson-09",
            description: "Rol tabanlı erişim kontrolü",
          },
          {
            label: "Ders 10: @Roles Decorator",
            href: "/education/lessons/nestjs/module-07/lesson-10",
            description: "Rol dekoratörü",
          },
          {
            label: "Ders 11: OAuth2",
            href: "/education/lessons/nestjs/module-07/lesson-11",
            description: "OAuth2 entegrasyonu",
          },
          {
            label: "Ders 12: Password Hashing",
            href: "/education/lessons/nestjs/module-07/lesson-12",
            description: "Şifre hashleme",
          },
          {
            label: "Ders 13: Security Best Practices",
            href: "/education/lessons/nestjs/module-07/lesson-13",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Security Patterns",
            href: "/education/lessons/nestjs/module-07/lesson-14",
            description: "Yaygın güvenlik desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Middleware ve Interceptors",
        summary:
          "Middleware, custom middleware, interceptors, @UseInterceptors, request/response transformation, logging ve performance monitoring.",
        durationMinutes: 450,
        objectives: [
          "Middleware kavramını anlamak",
          "Custom middleware yazmayı öğrenmek",
          "Interceptors kullanmayı öğrenmek",
          "Request/response transformation yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Middleware",
            href: "/education/lessons/nestjs/module-08/lesson-01",
            description: "Ara yazılım kavramı",
          },
          {
            label: "Ders 2: Custom Middleware",
            href: "/education/lessons/nestjs/module-08/lesson-02",
            description: "Özel ara yazılım",
          },
          {
            label: "Ders 3: @Injectable Middleware",
            href: "/education/lessons/nestjs/module-08/lesson-03",
            description: "Enjekte edilebilir ara yazılım",
          },
          {
            label: "Ders 4: Global Middleware",
            href: "/education/lessons/nestjs/module-08/lesson-04",
            description: "Global ara yazılım",
          },
          {
            label: "Ders 5: Interceptors",
            href: "/education/lessons/nestjs/module-08/lesson-05",
            description: "Kesici kavramı",
          },
          {
            label: "Ders 6: @UseInterceptors",
            href: "/education/lessons/nestjs/module-08/lesson-06",
            description: "Kesici kullanımı",
          },
          {
            label: "Ders 7: Request Interceptors",
            href: "/education/lessons/nestjs/module-08/lesson-07",
            description: "İstek kesicileri",
          },
          {
            label: "Ders 8: Response Interceptors",
            href: "/education/lessons/nestjs/module-08/lesson-08",
            description: "Yanıt kesicileri",
          },
          {
            label: "Ders 9: Logging Interceptor",
            href: "/education/lessons/nestjs/module-08/lesson-09",
            description: "Loglama kesicisi",
          },
          {
            label: "Ders 10: Transform Interceptor",
            href: "/education/lessons/nestjs/module-08/lesson-10",
            description: "Dönüştürme kesicisi",
          },
          {
            label: "Ders 11: Timeout Interceptor",
            href: "/education/lessons/nestjs/module-08/lesson-11",
            description: "Zaman aşımı kesicisi",
          },
          {
            label: "Ders 12: Cache Interceptor",
            href: "/education/lessons/nestjs/module-08/lesson-12",
            description: "Önbellek kesicisi",
          },
          {
            label: "Ders 13: Middleware ve Interceptor Best Practices",
            href: "/education/lessons/nestjs/module-08/lesson-13",
            description: "Kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Patterns",
            href: "/education/lessons/nestjs/module-08/lesson-14",
            description: "Yaygın desenler",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: GraphQL",
        summary:
          "GraphQL, @nestjs/graphql, schema definition, resolvers, queries, mutations, subscriptions ve GraphQL best practices.",
        durationMinutes: 450,
        objectives: [
          "GraphQL kavramını anlamak",
          "GraphQL schema tanımlamayı öğrenmek",
          "Resolvers yazmayı öğrenmek",
          "Queries, mutations ve subscriptions kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: GraphQL",
            href: "/education/lessons/nestjs/module-09/lesson-01",
            description: "GraphQL kavramı",
          },
          {
            label: "Ders 2: GraphQL vs REST",
            href: "/education/lessons/nestjs/module-09/lesson-02",
            description: "GraphQL ve REST karşılaştırması",
          },
          {
            label: "Ders 3: @nestjs/graphql",
            href: "/education/lessons/nestjs/module-09/lesson-03",
            description: "GraphQL modülü",
          },
          {
            label: "Ders 4: Schema Definition",
            href: "/education/lessons/nestjs/module-09/lesson-04",
            description: "Şema tanımlama",
          },
          {
            label: "Ders 5: Resolvers",
            href: "/education/lessons/nestjs/module-09/lesson-05",
            description: "Çözücüler",
          },
          {
            label: "Ders 6: @Query",
            href: "/education/lessons/nestjs/module-09/lesson-06",
            description: "Sorgu dekoratörü",
          },
          {
            label: "Ders 7: @Mutation",
            href: "/education/lessons/nestjs/module-09/lesson-07",
            description: "Değişiklik dekoratörü",
          },
          {
            label: "Ders 8: @Subscription",
            href: "/education/lessons/nestjs/module-09/lesson-08",
            description: "Abonelik dekoratörü",
          },
          {
            label: "Ders 9: GraphQL Types",
            href: "/education/lessons/nestjs/module-09/lesson-09",
            description: "GraphQL tipleri",
          },
          {
            label: "Ders 10: Input Types",
            href: "/education/lessons/nestjs/module-09/lesson-10",
            description: "Girdi tipleri",
          },
          {
            label: "Ders 11: Field Resolvers",
            href: "/education/lessons/nestjs/module-09/lesson-11",
            description: "Alan çözücüleri",
          },
          {
            label: "Ders 12: GraphQL Best Practices",
            href: "/education/lessons/nestjs/module-09/lesson-12",
            description: "GraphQL en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common GraphQL Patterns",
            href: "/education/lessons/nestjs/module-09/lesson-13",
            description: "Yaygın GraphQL desenleri",
          },
          {
            label: "Ders 14: GraphQL Tools",
            href: "/education/lessons/nestjs/module-09/lesson-14",
            description: "GraphQL araçları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: WebSocket ve Real-time",
        summary:
          "WebSocket, @nestjs/websockets, gateways, real-time communication, Socket.IO, event handling ve real-time best practices.",
        durationMinutes: 450,
        objectives: [
          "WebSocket kavramını anlamak",
          "Gateways kullanmayı öğrenmek",
          "Real-time communication yapmayı öğrenmek",
          "Socket.IO entegrasyonu yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: WebSocket",
            href: "/education/lessons/nestjs/module-10/lesson-01",
            description: "WebSocket kavramı",
          },
          {
            label: "Ders 2: @nestjs/websockets",
            href: "/education/lessons/nestjs/module-10/lesson-02",
            description: "WebSocket modülü",
          },
          {
            label: "Ders 3: Gateways",
            href: "/education/lessons/nestjs/module-10/lesson-03",
            description: "Ağ geçidi kavramı",
          },
          {
            label: "Ders 4: @WebSocketGateway",
            href: "/education/lessons/nestjs/module-10/lesson-04",
            description: "WebSocket ağ geçidi",
          },
          {
            label: "Ders 5: @SubscribeMessage",
            href: "/education/lessons/nestjs/module-10/lesson-05",
            description: "Mesaj aboneliği",
          },
          {
            label: "Ders 6: Socket.IO",
            href: "/education/lessons/nestjs/module-10/lesson-06",
            description: "Socket.IO entegrasyonu",
          },
          {
            label: "Ders 7: Real-time Communication",
            href: "/education/lessons/nestjs/module-10/lesson-07",
            description: "Gerçek zamanlı iletişim",
          },
          {
            label: "Ders 8: Event Handling",
            href: "/education/lessons/nestjs/module-10/lesson-08",
            description: "Olay işleme",
          },
          {
            label: "Ders 9: Connection Management",
            href: "/education/lessons/nestjs/module-10/lesson-09",
            description: "Bağlantı yönetimi",
          },
          {
            label: "Ders 10: Rooms ve Namespaces",
            href: "/education/lessons/nestjs/module-10/lesson-10",
            description: "Odalar ve ad alanları",
          },
          {
            label: "Ders 11: Broadcasting",
            href: "/education/lessons/nestjs/module-10/lesson-11",
            description: "Yayınlama",
          },
          {
            label: "Ders 12: WebSocket Best Practices",
            href: "/education/lessons/nestjs/module-10/lesson-12",
            description: "WebSocket en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common WebSocket Patterns",
            href: "/education/lessons/nestjs/module-10/lesson-13",
            description: "Yaygın WebSocket desenleri",
          },
          {
            label: "Ders 14: Performance Considerations",
            href: "/education/lessons/nestjs/module-10/lesson-14",
            description: "Performans düşünceleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Microservices",
        summary:
          "NestJS microservices, transport layers, message patterns, gRPC, RabbitMQ, Kafka, service communication ve microservices patterns.",
        durationMinutes: 450,
        objectives: [
          "Microservices kavramını anlamak",
          "Transport layers kullanmayı öğrenmek",
          "Message patterns öğrenmek",
          "Service communication yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Microservices",
            href: "/education/lessons/nestjs/module-11/lesson-01",
            description: "Mikroservis kavramı",
          },
          {
            label: "Ders 2: Transport Layers",
            href: "/education/lessons/nestjs/module-11/lesson-02",
            description: "Taşıma katmanları",
          },
          {
            label: "Ders 3: TCP Transport",
            href: "/education/lessons/nestjs/module-11/lesson-03",
            description: "TCP taşıma",
          },
          {
            label: "Ders 4: Redis Transport",
            href: "/education/lessons/nestjs/module-11/lesson-04",
            description: "Redis taşıma",
          },
          {
            label: "Ders 5: Message Patterns",
            href: "/education/lessons/nestjs/module-11/lesson-05",
            description: "Mesaj desenleri",
          },
          {
            label: "Ders 6: Request-Response",
            href: "/education/lessons/nestjs/module-11/lesson-06",
            description: "İstek-yanıt",
          },
          {
            label: "Ders 7: Event-Based",
            href: "/education/lessons/nestjs/module-11/lesson-07",
            description: "Olay tabanlı",
          },
          {
            label: "Ders 8: gRPC",
            href: "/education/lessons/nestjs/module-11/lesson-08",
            description: "gRPC entegrasyonu",
          },
          {
            label: "Ders 9: RabbitMQ",
            href: "/education/lessons/nestjs/module-11/lesson-09",
            description: "RabbitMQ entegrasyonu",
          },
          {
            label: "Ders 10: Kafka",
            href: "/education/lessons/nestjs/module-11/lesson-10",
            description: "Kafka entegrasyonu",
          },
          {
            label: "Ders 11: Service Communication",
            href: "/education/lessons/nestjs/module-11/lesson-11",
            description: "Servis iletişimi",
          },
          {
            label: "Ders 12: Microservices Best Practices",
            href: "/education/lessons/nestjs/module-11/lesson-12",
            description: "Mikroservis en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Microservices Patterns",
            href: "/education/lessons/nestjs/module-11/lesson-13",
            description: "Yaygın mikroservis desenleri",
          },
          {
            label: "Ders 14: Service Discovery",
            href: "/education/lessons/nestjs/module-11/lesson-14",
            description: "Servis keşfi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Testing",
        summary:
          "NestJS testing, Jest, unit testing, integration testing, e2e testing, test utilities, mocking ve testing best practices.",
        durationMinutes: 450,
        objectives: [
          "Testing kavramını anlamak",
          "Unit test yazmayı öğrenmek",
          "Integration test yazmayı öğrenmek",
          "E2E test yazmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/nestjs/module-12/lesson-01",
            description: "Test türleri",
          },
          {
            label: "Ders 2: Jest",
            href: "/education/lessons/nestjs/module-12/lesson-02",
            description: "Test framework'ü",
          },
          {
            label: "Ders 3: Unit Testing",
            href: "/education/lessons/nestjs/module-12/lesson-03",
            description: "Birim testleri",
          },
          {
            label: "Ders 4: Testing Module",
            href: "/education/lessons/nestjs/module-12/lesson-04",
            description: "Test modülü",
          },
          {
            label: "Ders 5: Mocking",
            href: "/education/lessons/nestjs/module-12/lesson-05",
            description: "Mock objeler",
          },
          {
            label: "Ders 6: Integration Testing",
            href: "/education/lessons/nestjs/module-12/lesson-06",
            description: "Entegrasyon testleri",
          },
          {
            label: "Ders 7: E2E Testing",
            href: "/education/lessons/nestjs/module-12/lesson-07",
            description: "Uçtan uca testler",
          },
          {
            label: "Ders 8: Test Utilities",
            href: "/education/lessons/nestjs/module-12/lesson-08",
            description: "Test yardımcıları",
          },
          {
            label: "Ders 9: Testing Controllers",
            href: "/education/lessons/nestjs/module-12/lesson-09",
            description: "Kontrolör testleri",
          },
          {
            label: "Ders 10: Testing Services",
            href: "/education/lessons/nestjs/module-12/lesson-10",
            description: "Servis testleri",
          },
          {
            label: "Ders 11: Testing Guards",
            href: "/education/lessons/nestjs/module-12/lesson-11",
            description: "Koruma testleri",
          },
          {
            label: "Ders 12: Test Coverage",
            href: "/education/lessons/nestjs/module-12/lesson-12",
            description: "Test kapsamı",
          },
          {
            label: "Ders 13: Testing Best Practices",
            href: "/education/lessons/nestjs/module-12/lesson-13",
            description: "Test yazma en iyi uygulamaları",
          },
          {
            label: "Ders 14: Common Testing Patterns",
            href: "/education/lessons/nestjs/module-12/lesson-14",
            description: "Yaygın test desenleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Caching ve Performance",
        summary:
          "Caching, @nestjs/cache-manager, Redis caching, cache strategies, performance optimization, monitoring ve performance best practices.",
        durationMinutes: 450,
        objectives: [
          "Caching kavramını anlamak",
          "@nestjs/cache-manager kullanmayı öğrenmek",
          "Redis caching yapmayı öğrenmek",
          "Performance optimization yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Caching",
            href: "/education/lessons/nestjs/module-13/lesson-01",
            description: "Önbellekleme kavramı",
          },
          {
            label: "Ders 2: @nestjs/cache-manager",
            href: "/education/lessons/nestjs/module-13/lesson-02",
            description: "Önbellek yöneticisi",
          },
          {
            label: "Ders 3: Cache Module",
            href: "/education/lessons/nestjs/module-13/lesson-03",
            description: "Önbellek modülü",
          },
          {
            label: "Ders 4: @CacheKey ve @CacheTTL",
            href: "/education/lessons/nestjs/module-13/lesson-04",
            description: "Önbellek dekoratörleri",
          },
          {
            label: "Ders 5: Redis Caching",
            href: "/education/lessons/nestjs/module-13/lesson-05",
            description: "Redis önbellekleme",
          },
          {
            label: "Ders 6: Cache Strategies",
            href: "/education/lessons/nestjs/module-13/lesson-06",
            description: "Önbellek stratejileri",
          },
          {
            label: "Ders 7: Cache Invalidation",
            href: "/education/lessons/nestjs/module-13/lesson-07",
            description: "Önbellek geçersiz kılma",
          },
          {
            label: "Ders 8: Performance Optimization",
            href: "/education/lessons/nestjs/module-13/lesson-08",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 9: Monitoring",
            href: "/education/lessons/nestjs/module-13/lesson-09",
            description: "İzleme",
          },
          {
            label: "Ders 10: Load Balancing",
            href: "/education/lessons/nestjs/module-13/lesson-10",
            description: "Yük dengeleme",
          },
          {
            label: "Ders 11: Caching Best Practices",
            href: "/education/lessons/nestjs/module-13/lesson-11",
            description: "Önbellekleme en iyi uygulamaları",
          },
          {
            label: "Ders 12: Common Caching Patterns",
            href: "/education/lessons/nestjs/module-13/lesson-12",
            description: "Yaygın önbellekleme desenleri",
          },
          {
            label: "Ders 13: Performance Best Practices",
            href: "/education/lessons/nestjs/module-13/lesson-13",
            description: "Performans en iyi uygulamaları",
          },
          {
            label: "Ders 14: Performance Testing",
            href: "/education/lessons/nestjs/module-13/lesson-14",
            description: "Performans testleri",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Deployment ve Production",
        summary:
          "NestJS deployment, Docker, Kubernetes, CI/CD, production configuration, environment setup ve deployment best practices.",
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
            href: "/education/lessons/nestjs/module-14/lesson-01",
            description: "Dağıtım süreci",
          },
          {
            label: "Ders 2: Build Process",
            href: "/education/lessons/nestjs/module-14/lesson-02",
            description: "Derleme süreci",
          },
          {
            label: "Ders 3: Docker",
            href: "/education/lessons/nestjs/module-14/lesson-03",
            description: "Konteynerleştirme",
          },
          {
            label: "Ders 4: Dockerfile",
            href: "/education/lessons/nestjs/module-14/lesson-04",
            description: "Docker dosyası",
          },
          {
            label: "Ders 5: Docker Compose",
            href: "/education/lessons/nestjs/module-14/lesson-05",
            description: "Docker Compose",
          },
          {
            label: "Ders 6: Kubernetes",
            href: "/education/lessons/nestjs/module-14/lesson-06",
            description: "Kubernetes dağıtımı",
          },
          {
            label: "Ders 7: CI/CD",
            href: "/education/lessons/nestjs/module-14/lesson-07",
            description: "Sürekli entegrasyon/dağıtım",
          },
          {
            label: "Ders 8: GitHub Actions",
            href: "/education/lessons/nestjs/module-14/lesson-08",
            description: "GitHub Actions",
          },
          {
            label: "Ders 9: Production Configuration",
            href: "/education/lessons/nestjs/module-14/lesson-09",
            description: "Üretim yapılandırması",
          },
          {
            label: "Ders 10: Environment Setup",
            href: "/education/lessons/nestjs/module-14/lesson-10",
            description: "Ortam kurulumu",
          },
          {
            label: "Ders 11: Process Management",
            href: "/education/lessons/nestjs/module-14/lesson-11",
            description: "PM2, systemd",
          },
          {
            label: "Ders 12: Deployment Best Practices",
            href: "/education/lessons/nestjs/module-14/lesson-12",
            description: "Dağıtım en iyi uygulamaları",
          },
          {
            label: "Ders 13: Common Deployment Issues",
            href: "/education/lessons/nestjs/module-14/lesson-13",
            description: "Yaygın dağıtım sorunları",
          },
          {
            label: "Ders 14: Monitoring in Production",
            href: "/education/lessons/nestjs/module-14/lesson-14",
            description: "Üretimde izleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/nestjs/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Best Practices ve Capstone",
        summary:
          "NestJS geliştirmede en iyi uygulamalar, kod kalitesi, güvenlik, performans ve kapsamlı bir NestJS uygulaması geliştirme.",
        durationMinutes: 450,
        objectives: [
          "Kod kalitesi standartlarını öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Kapsamlı bir NestJS uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Code Quality Standards",
            href: "/education/lessons/nestjs/module-15/lesson-01",
            description: "Kod kalitesi standartları",
          },
          {
            label: "Ders 2: Naming Conventions",
            href: "/education/lessons/nestjs/module-15/lesson-02",
            description: "İsimlendirme kuralları",
          },
          {
            label: "Ders 3: Code Organization",
            href: "/education/lessons/nestjs/module-15/lesson-03",
            description: "Kod organizasyonu",
          },
          {
            label: "Ders 4: Proje Planlama",
            href: "/education/lessons/nestjs/module-15/lesson-04",
            description: "Proje gereksinimleri",
          },
          {
            label: "Ders 5: Mimari Tasarım",
            href: "/education/lessons/nestjs/module-15/lesson-05",
            description: "Uygulama mimarisi",
          },
          {
            label: "Ders 6: Core Implementation",
            href: "/education/lessons/nestjs/module-15/lesson-06",
            description: "Temel implementasyon",
          },
          {
            label: "Ders 7: API Implementation",
            href: "/education/lessons/nestjs/module-15/lesson-07",
            description: "API implementasyonu",
          },
          {
            label: "Ders 8: Data Management",
            href: "/education/lessons/nestjs/module-15/lesson-08",
            description: "Veri yönetimi",
          },
          {
            label: "Ders 9: Security Implementation",
            href: "/education/lessons/nestjs/module-15/lesson-09",
            description: "Güvenlik implementasyonu",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/nestjs/module-15/lesson-10",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 11: Testing Strategy",
            href: "/education/lessons/nestjs/module-15/lesson-11",
            description: "Test stratejisi",
          },
          {
            label: "Ders 12: Performance Optimization",
            href: "/education/lessons/nestjs/module-15/lesson-12",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/nestjs/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/nestjs/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/nestjs/module-15/lesson-15",
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

