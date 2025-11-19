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
 * Create complete Node.js course structure with predefined content
 */
export async function createNodeJSCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Node.js course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Node.js, JavaScript'in sunucu tarafında çalışmasını sağlayan açık kaynaklı bir runtime ortamıdır. Bu kapsamlı kurs ile Node.js'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Modern web uygulamaları, API'ler, mikroservisler ve gerçek zamanlı uygulamalar geliştirme becerileri kazanacaksınız.",
      estimatedDurationMinutes: 6750, // 15 modül × 15 ders × 30 dakika
    },
    learningObjectives: [
      "Node.js runtime ortamını ve event loop mekanizmasını anlamak",
      "JavaScript asenkron programlama kavramlarını öğrenmek",
      "Express.js ile RESTful API'ler ve web uygulamaları geliştirmek",
      "Veritabanı işlemleri ve ORM kullanımını öğrenmek",
      "WebSocket ve gerçek zamanlı uygulamalar geliştirmek",
      "Authentication ve Authorization mekanizmalarını implement etmek",
      "Test yazma ve yazılım kalitesini artırma tekniklerini öğrenmek",
      "Production ortamı için deployment ve monitoring stratejilerini öğrenmek",
    ],
    prerequisites: [
      "Temel JavaScript bilgisi",
      "HTML ve CSS temel bilgisi",
      "HTTP ve web teknolojileri hakkında temel bilgi",
      "Veritabanı kavramlarına aşinalık",
      "Command line kullanımına aşinalık",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Node.js Tanımı ve Temelleri",
        summary:
          "Node.js'in ne olduğu, tarihçesi, avantajları, diğer backend teknolojilerinden farkları ve temel kavramlar.",
        durationMinutes: 450,
        objectives: [
          "Node.js'in ne olduğunu ve neden kullanıldığını anlamak",
          "Node.js'in diğer backend teknolojilerinden farklarını öğrenmek",
          "Node.js'in avantajlarını ve kullanım alanlarını keşfetmek",
          "Event-driven ve asenkron programlama kavramını anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Node.js Nedir?",
            href: "/education/lessons/nodejs/module-01/lesson-01",
            description: "Node.js'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Node.js diğer backend teknolojilerinden farkı nedir?",
            href: "/education/lessons/nodejs/module-01/lesson-02",
            description: "Node.js'in .NET Core, Python, Java gibi teknolojilerden farkları",
          },
          {
            label: "Ders 3: Node.js'in Tarihçesi ve Gelişimi",
            href: "/education/lessons/nodejs/module-01/lesson-03",
            description: "Node.js'in ortaya çıkışı ve versiyon geçmişi",
          },
          {
            label: "Ders 4: V8 JavaScript Engine",
            href: "/education/lessons/nodejs/module-01/lesson-04",
            description: "V8 engine'in rolü ve çalışma prensipleri",
          },
          {
            label: "Ders 5: Node.js'in Avantajları",
            href: "/education/lessons/nodejs/module-01/lesson-05",
            description: "Performans, ölçeklenebilirlik, JavaScript ekosistemi gibi avantajlar",
          },
          {
            label: "Ders 6: Node.js Kullanım Alanları",
            href: "/education/lessons/nodejs/module-01/lesson-06",
            description: "Web API, mikroservisler, real-time uygulamalar, CLI araçları",
          },
          {
            label: "Ders 7: Node.js Ekosistemi",
            href: "/education/lessons/nodejs/module-01/lesson-07",
            description: "npm paket yöneticisi, topluluk desteği ve ekosistem",
          },
          {
            label: "Ders 8: Node.js Kurulumu",
            href: "/education/lessons/nodejs/module-01/lesson-08",
            description: "Node.js ve npm kurulumu, versiyon yönetimi",
          },
          {
            label: "Ders 9: İlk Node.js Uygulaması",
            href: "/education/lessons/nodejs/module-01/lesson-09",
            description: "Hello World uygulaması ve temel yapı",
          },
          {
            label: "Ders 10: Node.js Modül Sistemi",
            href: "/education/lessons/nodejs/module-01/lesson-10",
            description: "CommonJS modül sistemi, require ve module.exports",
          },
          {
            label: "Ders 11: Node.js vs Browser JavaScript",
            href: "/education/lessons/nodejs/module-01/lesson-11",
            description: "Node.js ve tarayıcı JavaScript'i arasındaki farklar",
          },
          {
            label: "Ders 12: Node.js Performans Özellikleri",
            href: "/education/lessons/nodejs/module-01/lesson-12",
            description: "Yüksek performans ve ölçeklenebilirlik özellikleri",
          },
          {
            label: "Ders 13: Node.js Güvenlik Özellikleri",
            href: "/education/lessons/nodejs/module-01/lesson-13",
            description: "Güvenlik mekanizmaları ve en iyi uygulamalar",
          },
          {
            label: "Ders 14: Node.js'in Geleceği",
            href: "/education/lessons/nodejs/module-01/lesson-14",
            description: "Node.js roadmap ve gelecek planları",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/nodejs/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti ve değerlendirme",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: JavaScript Temelleri (Node.js için)",
        summary:
          "Node.js geliştirme için gerekli JavaScript temelleri: ES6+ özellikleri, asenkron programlama, callback'ler, promise'ler.",
        durationMinutes: 450,
        objectives: [
          "ES6+ JavaScript özelliklerini öğrenmek",
          "Asenkron programlama kavramlarını anlamak",
          "Callback, Promise ve async/await kullanımını öğrenmek",
          "Node.js için JavaScript best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: ES6+ Özelliklerine Giriş",
            href: "/education/lessons/nodejs/module-02/lesson-01",
            description: "Arrow functions, destructuring, spread operator",
          },
          {
            label: "Ders 2: Let, Const ve Block Scope",
            href: "/education/lessons/nodejs/module-02/lesson-02",
            description: "Değişken tanımlama ve scope kavramları",
          },
          {
            label: "Ders 3: Template Literals",
            href: "/education/lessons/nodejs/module-02/lesson-03",
            description: "String template'leri ve kullanımı",
          },
          {
            label: "Ders 4: Destructuring",
            href: "/education/lessons/nodejs/module-02/lesson-04",
            description: "Array ve object destructuring",
          },
          {
            label: "Ders 5: Arrow Functions",
            href: "/education/lessons/nodejs/module-02/lesson-05",
            description: "Arrow function syntax ve this binding",
          },
          {
            label: "Ders 6: Callback Functions",
            href: "/education/lessons/nodejs/module-02/lesson-06",
            description: "Callback pattern ve kullanımı",
          },
          {
            label: "Ders 7: Callback Hell Problemi",
            href: "/education/lessons/nodejs/module-02/lesson-07",
            description: "Callback hell ve çözüm yolları",
          },
          {
            label: "Ders 8: Promises",
            href: "/education/lessons/nodejs/module-02/lesson-08",
            description: "Promise yapısı ve kullanımı",
          },
          {
            label: "Ders 9: Promise Chaining",
            href: "/education/lessons/nodejs/module-02/lesson-09",
            description: "Promise zincirleme ve hata yönetimi",
          },
          {
            label: "Ders 10: Async/Await",
            href: "/education/lessons/nodejs/module-02/lesson-10",
            description: "Async/await syntax ve kullanımı",
          },
          {
            label: "Ders 11: Error Handling",
            href: "/education/lessons/nodejs/module-02/lesson-11",
            description: "Try-catch ve hata yönetimi",
          },
          {
            label: "Ders 12: Modules (ES6)",
            href: "/education/lessons/nodejs/module-02/lesson-12",
            description: "ES6 modül sistemi, import/export",
          },
          {
            label: "Ders 13: Classes ve Inheritance",
            href: "/education/lessons/nodejs/module-02/lesson-13",
            description: "ES6 class syntax ve kalıtım",
          },
          {
            label: "Ders 14: Generators ve Iterators",
            href: "/education/lessons/nodejs/module-02/lesson-14",
            description: "Generator functions ve iterator pattern",
          },
          {
            label: "Ders 15: JavaScript Best Practices",
            href: "/education/lessons/nodejs/module-02/lesson-15",
            description: "Node.js için JavaScript en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Node.js Core Modules",
        summary:
          "Node.js'in built-in modülleri: fs, path, http, https, url, querystring, crypto, stream ve daha fazlası.",
        durationMinutes: 450,
        objectives: [
          "Node.js core modüllerini tanımak",
          "File system işlemlerini yapmak",
          "HTTP server oluşturmak",
          "Stream'leri kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Core Modules Genel Bakış",
            href: "/education/lessons/nodejs/module-03/lesson-01",
            description: "Node.js built-in modülleri ve kullanımı",
          },
          {
            label: "Ders 2: File System (fs) Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-02",
            description: "Dosya okuma, yazma ve yönetimi",
          },
          {
            label: "Ders 3: Path Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-03",
            description: "Dosya yolu işlemleri ve path manipulation",
          },
          {
            label: "Ders 4: HTTP Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-04",
            description: "HTTP server ve client oluşturma",
          },
          {
            label: "Ders 5: HTTPS Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-05",
            description: "HTTPS server oluşturma ve SSL/TLS",
          },
          {
            label: "Ders 6: URL Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-06",
            description: "URL parsing ve manipulation",
          },
          {
            label: "Ders 7: QueryString Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-07",
            description: "Query string parsing ve encoding",
          },
          {
            label: "Ders 8: Events Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-08",
            description: "EventEmitter ve event-driven programlama",
          },
          {
            label: "Ders 9: Stream Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-09",
            description: "Readable, Writable, Transform streams",
          },
          {
            label: "Ders 10: Crypto Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-10",
            description: "Şifreleme, hash ve güvenlik işlemleri",
          },
          {
            label: "Ders 11: Buffer Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-11",
            description: "Binary data işleme ve buffer operations",
          },
          {
            label: "Ders 12: Process Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-12",
            description: "Process bilgileri ve environment variables",
          },
          {
            label: "Ders 13: OS Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-13",
            description: "İşletim sistemi bilgileri ve sistem çağrıları",
          },
          {
            label: "Ders 14: Util Modülü",
            href: "/education/lessons/nodejs/module-03/lesson-14",
            description: "Yardımcı fonksiyonlar ve utility methods",
          },
          {
            label: "Ders 15: Core Modules Best Practices",
            href: "/education/lessons/nodejs/module-03/lesson-15",
            description: "Core modül kullanımında en iyi uygulamalar",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Event Loop ve Asenkron Programlama",
        summary:
          "Node.js event loop mekanizması, call stack, callback queue, microtasks, timers ve asenkron programlama derinlemesine.",
        durationMinutes: 450,
        objectives: [
          "Event loop mekanizmasını anlamak",
          "Call stack ve callback queue kavramlarını öğrenmek",
          "Timers ve scheduling'i anlamak",
          "Asenkron programlama pattern'lerini uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Event Loop Nedir?",
            href: "/education/lessons/nodejs/module-04/lesson-01",
            description: "Event loop kavramına giriş",
          },
          {
            label: "Ders 2: Call Stack",
            href: "/education/lessons/nodejs/module-04/lesson-02",
            description: "Call stack yapısı ve çalışma prensipleri",
          },
          {
            label: "Ders 3: Callback Queue",
            href: "/education/lessons/nodejs/module-04/lesson-03",
            description: "Callback queue ve event queue",
          },
          {
            label: "Ders 4: Microtasks Queue",
            href: "/education/lessons/nodejs/module-04/lesson-04",
            description: "Promise callbacks ve microtasks",
          },
          {
            label: "Ders 5: Timers (setTimeout, setInterval)",
            href: "/education/lessons/nodejs/module-04/lesson-05",
            description: "Timer fonksiyonları ve kullanımı",
          },
          {
            label: "Ders 6: setImmediate ve process.nextTick",
            href: "/education/lessons/nodejs/module-04/lesson-06",
            description: "Immediate callbacks ve nextTick",
          },
          {
            label: "Ders 7: Event Loop Fazları",
            href: "/education/lessons/nodejs/module-04/lesson-07",
            description: "Event loop fazları ve sıralama",
          },
          {
            label: "Ders 8: Blocking vs Non-blocking",
            href: "/education/lessons/nodejs/module-04/lesson-08",
            description: "Bloklayan ve bloklamayan işlemler",
          },
          {
            label: "Ders 9: I/O Operations",
            href: "/education/lessons/nodejs/module-04/lesson-09",
            description: "Asenkron I/O işlemleri",
          },
          {
            label: "Ders 10: Concurrency Model",
            href: "/education/lessons/nodejs/module-04/lesson-10",
            description: "Node.js eşzamanlılık modeli",
          },
          {
            label: "Ders 11: Worker Threads",
            href: "/education/lessons/nodejs/module-04/lesson-11",
            description: "Worker threads ve CPU-intensive tasks",
          },
          {
            label: "Ders 12: Cluster Module",
            href: "/education/lessons/nodejs/module-04/lesson-12",
            description: "Multi-processing ve cluster yapısı",
          },
          {
            label: "Ders 13: Event Loop Debugging",
            href: "/education/lessons/nodejs/module-04/lesson-13",
            description: "Event loop performans analizi ve debugging",
          },
          {
            label: "Ders 14: Performance Optimization",
            href: "/education/lessons/nodejs/module-04/lesson-14",
            description: "Event loop optimizasyonu",
          },
          {
            label: "Ders 15: Asenkron Programlama Best Practices",
            href: "/education/lessons/nodejs/module-04/lesson-15",
            description: "Asenkron kod yazma en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: npm ve Paket Yönetimi",
        summary:
          "npm (Node Package Manager) kullanımı, package.json, dependency yönetimi, npm scripts, private packages ve paket yayınlama.",
        durationMinutes: 450,
        objectives: [
          "npm kullanımını öğrenmek",
          "Package.json yapılandırmasını anlamak",
          "Dependency yönetimini yapmak",
          "npm scripts ve automation kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: npm Nedir?",
            href: "/education/lessons/nodejs/module-05/lesson-01",
            description: "npm kavramına giriş ve temel kullanım",
          },
          {
            label: "Ders 2: Package.json Yapısı",
            href: "/education/lessons/nodejs/module-05/lesson-02",
            description: "package.json dosyası ve alanları",
          },
          {
            label: "Ders 3: Paket Kurulumu",
            href: "/education/lessons/nodejs/module-05/lesson-03",
            description: "npm install ve paket kurulumu",
          },
          {
            label: "Ders 4: Dependency Types",
            href: "/education/lessons/nodejs/module-05/lesson-04",
            description: "dependencies, devDependencies, peerDependencies",
          },
          {
            label: "Ders 5: Semantic Versioning",
            href: "/education/lessons/nodejs/module-05/lesson-05",
            description: "SemVer ve versiyon yönetimi",
          },
          {
            label: "Ders 6: npm Scripts",
            href: "/education/lessons/nodejs/module-05/lesson-06",
            description: "npm run scripts ve automation",
          },
          {
            label: "Ders 7: Package Lock File",
            href: "/education/lessons/nodejs/module-05/lesson-07",
            description: "package-lock.json ve dependency locking",
          },
          {
            label: "Ders 8: Global vs Local Packages",
            href: "/education/lessons/nodejs/module-05/lesson-08",
            description: "Global ve local paket kurulumu",
          },
          {
            label: "Ders 9: Paket Güncelleme",
            href: "/education/lessons/nodejs/module-05/lesson-09",
            description: "npm update ve paket güncelleme stratejileri",
          },
          {
            label: "Ders 10: Paket Kaldırma",
            href: "/education/lessons/nodejs/module-05/lesson-10",
            description: "npm uninstall ve temizlik",
          },
          {
            label: "Ders 11: npm Registry",
            href: "/education/lessons/nodejs/module-05/lesson-11",
            description: "npm registry ve paket arama",
          },
          {
            label: "Ders 12: Private Packages",
            href: "/education/lessons/nodejs/module-05/lesson-12",
            description: "Private paket yönetimi ve npm organizations",
          },
          {
            label: "Ders 13: Paket Yayınlama",
            href: "/education/lessons/nodejs/module-05/lesson-13",
            description: "npm publish ve paket yayınlama süreci",
          },
          {
            label: "Ders 14: Alternative Package Managers",
            href: "/education/lessons/nodejs/module-05/lesson-14",
            description: "Yarn, pnpm gibi alternatif paket yöneticileri",
          },
          {
            label: "Ders 15: npm Best Practices",
            href: "/education/lessons/nodejs/module-05/lesson-15",
            description: "Paket yönetimi en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Express.js Framework",
        summary:
          "Express.js framework'ü, routing, middleware, request/response handling, template engines ve Express best practices.",
        durationMinutes: 450,
        objectives: [
          "Express.js framework'ünü öğrenmek",
          "Routing yapılandırması yapmak",
          "Middleware yazmak ve kullanmak",
          "Express.js ile web uygulamaları geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Express.js Giriş",
            href: "/education/lessons/nodejs/module-06/lesson-01",
            description: "Express.js nedir ve neden kullanılır?",
          },
          {
            label: "Ders 2: Express.js Kurulumu",
            href: "/education/lessons/nodejs/module-06/lesson-02",
            description: "Express.js projesi oluşturma",
          },
          {
            label: "Ders 3: İlk Express Uygulaması",
            href: "/education/lessons/nodejs/module-06/lesson-03",
            description: "Hello World uygulaması",
          },
          {
            label: "Ders 4: Routing Temelleri",
            href: "/education/lessons/nodejs/module-06/lesson-04",
            description: "Route tanımlama ve HTTP metodları",
          },
          {
            label: "Ders 5: Route Parameters",
            href: "/education/lessons/nodejs/module-06/lesson-05",
            description: "Dynamic routes ve parametreler",
          },
          {
            label: "Ders 6: Query Parameters",
            href: "/education/lessons/nodejs/module-06/lesson-06",
            description: "Query string işleme",
          },
          {
            label: "Ders 7: Request ve Response Objects",
            href: "/education/lessons/nodejs/module-06/lesson-07",
            description: "req ve res objeleri",
          },
          {
            label: "Ders 8: Middleware Kavramı",
            href: "/education/lessons/nodejs/module-06/lesson-08",
            description: "Middleware nedir ve nasıl çalışır?",
          },
          {
            label: "Ders 9: Custom Middleware",
            href: "/education/lessons/nodejs/module-06/lesson-09",
            description: "Özel middleware yazma",
          },
          {
            label: "Ders 10: Built-in Middleware",
            href: "/education/lessons/nodejs/module-06/lesson-10",
            description: "express.json, express.urlencoded, express.static",
          },
          {
            label: "Ders 11: Third-party Middleware",
            href: "/education/lessons/nodejs/module-06/lesson-11",
            description: "CORS, helmet, morgan gibi middleware'ler",
          },
          {
            label: "Ders 12: Error Handling Middleware",
            href: "/education/lessons/nodejs/module-06/lesson-12",
            description: "Hata yönetimi middleware'i",
          },
          {
            label: "Ders 13: Router ve Route Organization",
            href: "/education/lessons/nodejs/module-06/lesson-13",
            description: "Express Router ve modüler route yapısı",
          },
          {
            label: "Ders 14: Template Engines",
            href: "/education/lessons/nodejs/module-06/lesson-14",
            description: "EJS, Pug, Handlebars template engine'leri",
          },
          {
            label: "Ders 15: Express.js Best Practices",
            href: "/education/lessons/nodejs/module-06/lesson-15",
            description: "Express.js geliştirme en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: RESTful API Geliştirme",
        summary:
          "RESTful API tasarımı, Express.js ile API geliştirme, CRUD işlemleri, API versioning, validation ve API best practices.",
        durationMinutes: 450,
        objectives: [
          "RESTful API tasarım prensiplerini öğrenmek",
          "Express.js ile REST API geliştirmek",
          "CRUD işlemlerini implement etmek",
          "API best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: RESTful API Nedir?",
            href: "/education/lessons/nodejs/module-07/lesson-01",
            description: "REST prensipleri ve API tasarımı",
          },
          {
            label: "Ders 2: RESTful API Tasarım Prensipleri",
            href: "/education/lessons/nodejs/module-07/lesson-02",
            description: "RESTful API tasarım kuralları",
          },
          {
            label: "Ders 3: HTTP Methods ve Status Codes",
            href: "/education/lessons/nodejs/module-07/lesson-03",
            description: "HTTP metodları ve durum kodları",
          },
          {
            label: "Ders 4: API Endpoint Tasarımı",
            href: "/education/lessons/nodejs/module-07/lesson-04",
            description: "Endpoint naming ve yapılandırma",
          },
          {
            label: "Ders 5: GET Endpoints",
            href: "/education/lessons/nodejs/module-07/lesson-05",
            description: "Veri okuma endpoint'leri",
          },
          {
            label: "Ders 6: POST Endpoints",
            href: "/education/lessons/nodejs/module-07/lesson-06",
            description: "Veri oluşturma endpoint'leri",
          },
          {
            label: "Ders 7: PUT ve PATCH Endpoints",
            href: "/education/lessons/nodejs/module-07/lesson-07",
            description: "Veri güncelleme endpoint'leri",
          },
          {
            label: "Ders 8: DELETE Endpoints",
            href: "/education/lessons/nodejs/module-07/lesson-08",
            description: "Veri silme endpoint'leri",
          },
          {
            label: "Ders 9: Request Validation",
            href: "/education/lessons/nodejs/module-07/lesson-09",
            description: "express-validator ile validation",
          },
          {
            label: "Ders 10: Error Handling",
            href: "/education/lessons/nodejs/module-07/lesson-10",
            description: "API hata yönetimi ve error responses",
          },
          {
            label: "Ders 11: API Versioning",
            href: "/education/lessons/nodejs/module-07/lesson-11",
            description: "API versiyonlama stratejileri",
          },
          {
            label: "Ders 12: API Documentation",
            href: "/education/lessons/nodejs/module-07/lesson-12",
            description: "Swagger/OpenAPI ile dokümantasyon",
          },
          {
            label: "Ders 13: API Security",
            href: "/education/lessons/nodejs/module-07/lesson-13",
            description: "API güvenlik best practices",
          },
          {
            label: "Ders 14: API Testing",
            href: "/education/lessons/nodejs/module-07/lesson-14",
            description: "API test stratejileri ve araçları",
          },
          {
            label: "Ders 15: RESTful API Best Practices",
            href: "/education/lessons/nodejs/module-07/lesson-15",
            description: "RESTful API tasarım en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Veritabanı İşlemleri",
        summary:
          "Veritabanı bağlantıları, MongoDB, Mongoose ORM, SQL veritabanları (PostgreSQL, MySQL), Prisma ORM ve veritabanı best practices.",
        durationMinutes: 450,
        objectives: [
          "Veritabanı bağlantılarını yönetmek",
          "MongoDB ve Mongoose kullanmayı öğrenmek",
          "SQL veritabanları ile çalışmayı öğrenmek",
          "ORM kullanımını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Veritabanı Seçimi",
            href: "/education/lessons/nodejs/module-08/lesson-01",
            description: "NoSQL vs SQL, veritabanı seçim kriterleri",
          },
          {
            label: "Ders 2: MongoDB Giriş",
            href: "/education/lessons/nodejs/module-08/lesson-02",
            description: "MongoDB nedir ve nasıl çalışır?",
          },
          {
            label: "Ders 3: MongoDB Kurulumu",
            href: "/education/lessons/nodejs/module-08/lesson-03",
            description: "MongoDB kurulumu ve bağlantı",
          },
          {
            label: "Ders 4: Mongoose ORM",
            href: "/education/lessons/nodejs/module-08/lesson-04",
            description: "Mongoose nedir ve nasıl kullanılır?",
          },
          {
            label: "Ders 5: Mongoose Schema ve Model",
            href: "/education/lessons/nodejs/module-08/lesson-05",
            description: "Schema tanımlama ve model oluşturma",
          },
          {
            label: "Ders 6: CRUD Operations (MongoDB)",
            href: "/education/lessons/nodejs/module-08/lesson-06",
            description: "Create, Read, Update, Delete işlemleri",
          },
          {
            label: "Ders 7: Mongoose Queries",
            href: "/education/lessons/nodejs/module-08/lesson-07",
            description: "Sorgu yazma ve filtreleme",
          },
          {
            label: "Ders 8: Relationships (MongoDB)",
            href: "/education/lessons/nodejs/module-08/lesson-08",
            description: "Referanslar ve ilişkiler",
          },
          {
            label: "Ders 9: PostgreSQL ile Çalışma",
            href: "/education/lessons/nodejs/module-08/lesson-09",
            description: "pg kütüphanesi ile PostgreSQL",
          },
          {
            label: "Ders 10: MySQL ile Çalışma",
            href: "/education/lessons/nodejs/module-08/lesson-10",
            description: "mysql2 kütüphanesi ile MySQL",
          },
          {
            label: "Ders 11: Prisma ORM",
            href: "/education/lessons/nodejs/module-08/lesson-11",
            description: "Prisma ORM kullanımı",
          },
          {
            label: "Ders 12: Sequelize ORM",
            href: "/education/lessons/nodejs/module-08/lesson-12",
            description: "Sequelize ORM kullanımı",
          },
          {
            label: "Ders 13: Database Migrations",
            href: "/education/lessons/nodejs/module-08/lesson-13",
            description: "Veritabanı migration'ları",
          },
          {
            label: "Ders 14: Connection Pooling",
            href: "/education/lessons/nodejs/module-08/lesson-14",
            description: "Bağlantı havuzlama ve optimizasyon",
          },
          {
            label: "Ders 15: Veritabanı Best Practices",
            href: "/education/lessons/nodejs/module-08/lesson-15",
            description: "Veritabanı işlemleri en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Authentication & Authorization",
        summary:
          "Kimlik doğrulama ve yetkilendirme, JWT tokens, bcrypt, passport.js, OAuth, session yönetimi ve güvenlik.",
        durationMinutes: 450,
        objectives: [
          "Authentication ve Authorization kavramlarını anlamak",
          "JWT token kullanmayı öğrenmek",
          "Password hashing ve güvenlik uygulamak",
          "OAuth ve social login implement etmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Authentication vs Authorization",
            href: "/education/lessons/nodejs/module-09/lesson-01",
            description: "Kimlik doğrulama ve yetkilendirme farkları",
          },
          {
            label: "Ders 2: JWT (JSON Web Tokens)",
            href: "/education/lessons/nodejs/module-09/lesson-02",
            description: "JWT token yapısı ve kullanımı",
          },
          {
            label: "Ders 3: JWT Implementation",
            href: "/education/lessons/nodejs/module-09/lesson-03",
            description: "jsonwebtoken ile JWT oluşturma ve doğrulama",
          },
          {
            label: "Ders 4: Password Hashing",
            href: "/education/lessons/nodejs/module-09/lesson-04",
            description: "bcrypt ile şifre hashleme",
          },
          {
            label: "Ders 5: User Registration",
            href: "/education/lessons/nodejs/module-09/lesson-05",
            description: "Kullanıcı kayıt işlemleri",
          },
          {
            label: "Ders 6: User Login",
            href: "/education/lessons/nodejs/module-09/lesson-06",
            description: "Giriş işlemleri ve token üretme",
          },
          {
            label: "Ders 7: JWT Middleware",
            href: "/education/lessons/nodejs/module-09/lesson-07",
            description: "Token doğrulama middleware'i",
          },
          {
            label: "Ders 8: Role-based Authorization",
            href: "/education/lessons/nodejs/module-09/lesson-08",
            description: "Rol tabanlı yetkilendirme",
          },
          {
            label: "Ders 9: Permission-based Authorization",
            href: "/education/lessons/nodejs/module-09/lesson-09",
            description: "İzin tabanlı yetkilendirme",
          },
          {
            label: "Ders 10: Session Management",
            href: "/education/lessons/nodejs/module-09/lesson-10",
            description: "express-session ile session yönetimi",
          },
          {
            label: "Ders 11: Passport.js",
            href: "/education/lessons/nodejs/module-09/lesson-11",
            description: "Passport.js authentication middleware",
          },
          {
            label: "Ders 12: OAuth 2.0",
            href: "/education/lessons/nodejs/module-09/lesson-12",
            description: "OAuth 2.0 protokolü ve kullanımı",
          },
          {
            label: "Ders 13: Social Login",
            href: "/education/lessons/nodejs/module-09/lesson-13",
            description: "Google, Facebook gibi sosyal girişler",
          },
          {
            label: "Ders 14: Refresh Tokens",
            href: "/education/lessons/nodejs/module-09/lesson-14",
            description: "Token yenileme mekanizması",
          },
          {
            label: "Ders 15: Security Best Practices",
            href: "/education/lessons/nodejs/module-09/lesson-15",
            description: "Authentication ve güvenlik en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: WebSocket ve Real-time Uygulamalar",
        summary:
          "WebSocket protokolü, Socket.io, gerçek zamanlı uygulamalar, chat uygulamaları, real-time notifications ve event-driven architecture.",
        durationMinutes: 450,
        objectives: [
          "WebSocket protokolünü anlamak",
          "Socket.io kullanmayı öğrenmek",
          "Real-time uygulamalar geliştirmek",
          "Event-driven architecture uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: WebSocket Nedir?",
            href: "/education/lessons/nodejs/module-10/lesson-01",
            description: "WebSocket protokolü ve kullanım alanları",
          },
          {
            label: "Ders 2: WebSocket vs HTTP",
            href: "/education/lessons/nodejs/module-10/lesson-02",
            description: "WebSocket ve HTTP karşılaştırması",
          },
          {
            label: "Ders 3: Socket.io Giriş",
            href: "/education/lessons/nodejs/module-10/lesson-03",
            description: "Socket.io nedir ve nasıl çalışır?",
          },
          {
            label: "Ders 4: Socket.io Kurulumu",
            href: "/education/lessons/nodejs/module-10/lesson-04",
            description: "Socket.io server ve client kurulumu",
          },
          {
            label: "Ders 5: Socket Events",
            href: "/education/lessons/nodejs/module-10/lesson-05",
            description: "Event emit ve listen",
          },
          {
            label: "Ders 6: Rooms ve Namespaces",
            href: "/education/lessons/nodejs/module-10/lesson-06",
            description: "Socket.io rooms ve namespaces",
          },
          {
            label: "Ders 7: Broadcasting",
            href: "/education/lessons/nodejs/module-10/lesson-07",
            description: "Mesaj yayınlama ve broadcasting",
          },
          {
            label: "Ders 8: Chat Uygulaması",
            href: "/education/lessons/nodejs/module-10/lesson-08",
            description: "Basit chat uygulaması geliştirme",
          },
          {
            label: "Ders 9: Real-time Notifications",
            href: "/education/lessons/nodejs/module-10/lesson-09",
            description: "Gerçek zamanlı bildirimler",
          },
          {
            label: "Ders 10: Socket Authentication",
            href: "/education/lessons/nodejs/module-10/lesson-10",
            description: "WebSocket authentication ve authorization",
          },
          {
            label: "Ders 11: Socket Middleware",
            href: "/education/lessons/nodejs/module-10/lesson-11",
            description: "Socket.io middleware kullanımı",
          },
          {
            label: "Ders 12: Error Handling",
            href: "/education/lessons/nodejs/module-10/lesson-12",
            description: "WebSocket hata yönetimi",
          },
          {
            label: "Ders 13: Scaling Socket.io",
            href: "/education/lessons/nodejs/module-10/lesson-13",
            description: "Socket.io ölçeklendirme stratejileri",
          },
          {
            label: "Ders 14: Alternative WebSocket Libraries",
            href: "/education/lessons/nodejs/module-10/lesson-14",
            description: "ws, uws gibi alternatif kütüphaneler",
          },
          {
            label: "Ders 15: Real-time Applications Best Practices",
            href: "/education/lessons/nodejs/module-10/lesson-15",
            description: "Real-time uygulama geliştirme en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Testing",
        summary:
          "Unit testing, integration testing, test frameworks (Jest, Mocha), mocking, test coverage ve test best practices.",
        durationMinutes: 450,
        objectives: [
          "Test yazma prensiplerini öğrenmek",
          "Jest ve Mocha kullanmayı öğrenmek",
          "Unit ve integration test yazmak",
          "Mocking ve test araçlarını kullanmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Testing Temelleri",
            href: "/education/lessons/nodejs/module-11/lesson-01",
            description: "Test türleri ve test pyramid",
          },
          {
            label: "Ders 2: Jest Framework",
            href: "/education/lessons/nodejs/module-11/lesson-02",
            description: "Jest test framework'üne giriş",
          },
          {
            label: "Ders 3: Mocha ve Chai",
            href: "/education/lessons/nodejs/module-11/lesson-03",
            description: "Mocha test framework ve Chai assertions",
          },
          {
            label: "Ders 4: Unit Test Yazma",
            href: "/education/lessons/nodejs/module-11/lesson-04",
            description: "İlk unit test örnekleri",
          },
          {
            label: "Ders 5: Test Assertions",
            href: "/education/lessons/nodejs/module-11/lesson-05",
            description: "Assert metodları ve kullanımı",
          },
          {
            label: "Ders 6: Test Organization",
            href: "/education/lessons/nodejs/module-11/lesson-06",
            description: "Test organizasyonu ve yapısı",
          },
          {
            label: "Ders 7: Mocking",
            href: "/education/lessons/nodejs/module-11/lesson-07",
            description: "Jest mock ve sinon ile mocking",
          },
          {
            label: "Ders 8: Async Testing",
            href: "/education/lessons/nodejs/module-11/lesson-08",
            description: "Asenkron kod testleri",
          },
          {
            label: "Ders 9: Integration Testing",
            href: "/education/lessons/nodejs/module-11/lesson-09",
            description: "Entegrasyon testleri yazma",
          },
          {
            label: "Ders 10: API Testing",
            href: "/education/lessons/nodejs/module-11/lesson-10",
            description: "supertest ile API testleri",
          },
          {
            label: "Ders 11: Database Testing",
            href: "/education/lessons/nodejs/module-11/lesson-11",
            description: "Veritabanı test stratejileri",
          },
          {
            label: "Ders 12: Test Coverage",
            href: "/education/lessons/nodejs/module-11/lesson-12",
            description: "Test kapsamı analizi ve coverage",
          },
          {
            label: "Ders 13: Test-Driven Development (TDD)",
            href: "/education/lessons/nodejs/module-11/lesson-13",
            description: "TDD yaklaşımı ve uygulaması",
          },
          {
            label: "Ders 14: E2E Testing",
            href: "/education/lessons/nodejs/module-11/lesson-14",
            description: "End-to-end test stratejileri",
          },
          {
            label: "Ders 15: Testing Best Practices",
            href: "/education/lessons/nodejs/module-11/lesson-15",
            description: "Test yazma en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Error Handling ve Logging",
        summary:
          "Hata yönetimi stratejileri, error handling middleware, logging (Winston, Pino), error monitoring ve debugging teknikleri.",
        durationMinutes: 450,
        objectives: [
          "Error handling stratejilerini öğrenmek",
          "Logging kütüphanelerini kullanmayı öğrenmek",
          "Error monitoring yapmak",
          "Debugging tekniklerini öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Error Handling Temelleri",
            href: "/education/lessons/nodejs/module-12/lesson-01",
            description: "Try-catch, error objeleri",
          },
          {
            label: "Ders 2: Error Types",
            href: "/education/lessons/nodejs/module-12/lesson-02",
            description: "Error türleri ve kullanımı",
          },
          {
            label: "Ders 3: Custom Error Classes",
            href: "/education/lessons/nodejs/module-12/lesson-03",
            description: "Özel hata sınıfları oluşturma",
          },
          {
            label: "Ders 4: Error Handling Middleware",
            href: "/education/lessons/nodejs/module-12/lesson-04",
            description: "Express error handling middleware",
          },
          {
            label: "Ders 5: Async Error Handling",
            href: "/education/lessons/nodejs/module-12/lesson-05",
            description: "Asenkron hata yönetimi",
          },
          {
            label: "Ders 6: Global Error Handler",
            href: "/education/lessons/nodejs/module-12/lesson-06",
            description: "Global hata yakalama mekanizması",
          },
          {
            label: "Ders 7: Logging Temelleri",
            href: "/education/lessons/nodejs/module-12/lesson-07",
            description: "Logging kavramı ve önemi",
          },
          {
            label: "Ders 8: Winston Logger",
            href: "/education/lessons/nodejs/module-12/lesson-08",
            description: "Winston logging kütüphanesi",
          },
          {
            label: "Ders 9: Pino Logger",
            href: "/education/lessons/nodejs/module-12/lesson-09",
            description: "Pino logging kütüphanesi",
          },
          {
            label: "Ders 10: Log Levels",
            href: "/education/lessons/nodejs/module-12/lesson-10",
            description: "Log seviyeleri ve kullanımı",
          },
          {
            label: "Ders 11: Log Formatting",
            href: "/education/lessons/nodejs/module-12/lesson-11",
            description: "Log formatlama ve yapılandırma",
          },
          {
            label: "Ders 12: Error Monitoring",
            href: "/education/lessons/nodejs/module-12/lesson-12",
            description: "Sentry, Rollbar gibi monitoring araçları",
          },
          {
            label: "Ders 13: Debugging Techniques",
            href: "/education/lessons/nodejs/module-12/lesson-13",
            description: "Node.js debugging teknikleri",
          },
          {
            label: "Ders 14: Production Error Handling",
            href: "/education/lessons/nodejs/module-12/lesson-14",
            description: "Production ortamı hata yönetimi",
          },
          {
            label: "Ders 15: Error Handling Best Practices",
            href: "/education/lessons/nodejs/module-12/lesson-15",
            description: "Hata yönetimi ve logging en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Performance Optimization",
        summary:
          "Performans optimizasyonu, caching stratejileri, load balancing, clustering, memory management ve profiling.",
        durationMinutes: 450,
        objectives: [
          "Performans optimizasyon tekniklerini öğrenmek",
          "Caching stratejileri uygulamak",
          "Load balancing ve clustering yapmak",
          "Memory management yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Performance Temelleri",
            href: "/education/lessons/nodejs/module-13/lesson-01",
            description: "Performans ölçümü ve metrikler",
          },
          {
            label: "Ders 2: Profiling Tools",
            href: "/education/lessons/nodejs/module-13/lesson-02",
            description: "Node.js profiling araçları",
          },
          {
            label: "Ders 3: Memory Management",
            href: "/education/lessons/nodejs/module-13/lesson-03",
            description: "Bellek yönetimi ve optimizasyon",
          },
          {
            label: "Ders 4: Caching Strategies",
            href: "/education/lessons/nodejs/module-13/lesson-04",
            description: "Önbellekleme stratejileri",
          },
          {
            label: "Ders 5: In-Memory Caching",
            href: "/education/lessons/nodejs/module-13/lesson-05",
            description: "node-cache, memory-cache kullanımı",
          },
          {
            label: "Ders 6: Redis Caching",
            href: "/education/lessons/nodejs/module-13/lesson-06",
            description: "Redis ile distributed caching",
          },
          {
            label: "Ders 7: Database Query Optimization",
            href: "/education/lessons/nodejs/module-13/lesson-07",
            description: "Veritabanı sorgu optimizasyonu",
          },
          {
            label: "Ders 8: Connection Pooling",
            href: "/education/lessons/nodejs/module-13/lesson-08",
            description: "Bağlantı havuzlama",
          },
          {
            label: "Ders 9: Load Balancing",
            href: "/education/lessons/nodejs/module-13/lesson-09",
            description: "Yük dengeleme stratejileri",
          },
          {
            label: "Ders 10: Clustering",
            href: "/education/lessons/nodejs/module-13/lesson-10",
            description: "Node.js cluster module",
          },
          {
            label: "Ders 11: Compression",
            href: "/education/lessons/nodejs/module-13/lesson-11",
            description: "Response compression",
          },
          {
            label: "Ders 12: CDN Kullanımı",
            href: "/education/lessons/nodejs/module-13/lesson-12",
            description: "Content Delivery Network",
          },
          {
            label: "Ders 13: Rate Limiting",
            href: "/education/lessons/nodejs/module-13/lesson-13",
            description: "express-rate-limit ile rate limiting",
          },
          {
            label: "Ders 14: Performance Monitoring",
            href: "/education/lessons/nodejs/module-13/lesson-14",
            description: "APM araçları ve monitoring",
          },
          {
            label: "Ders 15: Performance Best Practices",
            href: "/education/lessons/nodejs/module-13/lesson-15",
            description: "Performans optimizasyon en iyi uygulamaları",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Deployment ve DevOps",
        summary:
          "Uygulama dağıtımı, Docker containerization, CI/CD pipelines, cloud deployment (AWS, Heroku, Vercel), monitoring ve production best practices.",
        durationMinutes: 450,
        objectives: [
          "Uygulama dağıtım stratejilerini öğrenmek",
          "Docker containerization yapmak",
          "CI/CD pipeline'ları kurmak",
          "Cloud deployment yapmak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Deployment Stratejileri",
            href: "/education/lessons/nodejs/module-14/lesson-01",
            description: "Dağıtım modelleri ve seçenekleri",
          },
          {
            label: "Ders 2: Environment Configuration",
            href: "/education/lessons/nodejs/module-14/lesson-02",
            description: "Ortam yapılandırması ve .env dosyaları",
          },
          {
            label: "Ders 3: Docker Temelleri",
            href: "/education/lessons/nodejs/module-14/lesson-03",
            description: "Docker kavramları ve kullanımı",
          },
          {
            label: "Ders 4: Dockerfile Oluşturma",
            href: "/education/lessons/nodejs/module-14/lesson-04",
            description: "Node.js için Dockerfile",
          },
          {
            label: "Ders 5: Docker Compose",
            href: "/education/lessons/nodejs/module-14/lesson-05",
            description: "Multi-container uygulamalar",
          },
          {
            label: "Ders 6: CI/CD Concepts",
            href: "/education/lessons/nodejs/module-14/lesson-06",
            description: "Sürekli entegrasyon ve dağıtım",
          },
          {
            label: "Ders 7: GitHub Actions",
            href: "/education/lessons/nodejs/module-14/lesson-07",
            description: "GitHub Actions ile CI/CD",
          },
          {
            label: "Ders 8: Heroku Deployment",
            href: "/education/lessons/nodejs/module-14/lesson-08",
            description: "Heroku'ya dağıtım",
          },
          {
            label: "Ders 9: AWS Deployment",
            href: "/education/lessons/nodejs/module-14/lesson-09",
            description: "AWS Elastic Beanstalk ve EC2",
          },
          {
            label: "Ders 10: Vercel Deployment",
            href: "/education/lessons/nodejs/module-14/lesson-10",
            description: "Vercel'e dağıtım",
          },
          {
            label: "Ders 11: DigitalOcean Deployment",
            href: "/education/lessons/nodejs/module-14/lesson-11",
            description: "DigitalOcean'a dağıtım",
          },
          {
            label: "Ders 12: Health Checks",
            href: "/education/lessons/nodejs/module-14/lesson-12",
            description: "Sağlık kontrolü ve monitoring",
          },
          {
            label: "Ders 13: Logging ve Monitoring",
            href: "/education/lessons/nodejs/module-14/lesson-13",
            description: "Production loglama ve izleme",
          },
          {
            label: "Ders 14: Scaling Strategies",
            href: "/education/lessons/nodejs/module-14/lesson-14",
            description: "Ölçeklendirme stratejileri",
          },
          {
            label: "Ders 15: Production Best Practices",
            href: "/education/lessons/nodejs/module-14/lesson-15",
            description: "Production ortamı en iyi uygulamaları",
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
            href: "/education/lessons/nodejs/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/nodejs/module-15/lesson-02",
            description: "Sistem mimarisi tasarımı",
          },
          {
            label: "Ders 3: Database Design",
            href: "/education/lessons/nodejs/module-15/lesson-03",
            description: "Veritabanı tasarımı ve şema",
          },
          {
            label: "Ders 4: API Development",
            href: "/education/lessons/nodejs/module-15/lesson-04",
            description: "RESTful API geliştirme",
          },
          {
            label: "Ders 5: Authentication Implementation",
            href: "/education/lessons/nodejs/module-15/lesson-05",
            description: "Kimlik doğrulama implementasyonu",
          },
          {
            label: "Ders 6: Business Logic",
            href: "/education/lessons/nodejs/module-15/lesson-06",
            description: "İş mantığı geliştirme",
          },
          {
            label: "Ders 7: Real-time Features",
            href: "/education/lessons/nodejs/module-15/lesson-07",
            description: "WebSocket ve real-time özellikler",
          },
          {
            label: "Ders 8: Error Handling",
            href: "/education/lessons/nodejs/module-15/lesson-08",
            description: "Kapsamlı hata yönetimi",
          },
          {
            label: "Ders 9: Testing Strategy",
            href: "/education/lessons/nodejs/module-15/lesson-09",
            description: "Test stratejisi ve implementasyonu",
          },
          {
            label: "Ders 10: Performance Optimization",
            href: "/education/lessons/nodejs/module-15/lesson-10",
            description: "Performans optimizasyonu",
          },
          {
            label: "Ders 11: Security Hardening",
            href: "/education/lessons/nodejs/module-15/lesson-11",
            description: "Güvenlik sertleştirme",
          },
          {
            label: "Ders 12: Documentation",
            href: "/education/lessons/nodejs/module-15/lesson-12",
            description: "API dokümantasyonu ve kullanım kılavuzu",
          },
          {
            label: "Ders 13: Deployment Preparation",
            href: "/education/lessons/nodejs/module-15/lesson-13",
            description: "Dağıtım hazırlığı ve yapılandırma",
          },
          {
            label: "Ders 14: CI/CD Setup",
            href: "/education/lessons/nodejs/module-15/lesson-14",
            description: "Sürekli entegrasyon ve dağıtım kurulumu",
          },
          {
            label: "Ders 15: Project Review and Presentation",
            href: "/education/lessons/nodejs/module-15/lesson-15",
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

