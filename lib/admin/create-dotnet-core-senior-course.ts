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
 * Create complete .NET Core Senior course structure with interview preparation content
 * 12 modules, 375 lessons total - Expert level, interview-focused
 */
export async function createDotNetCoreSeniorCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting .NET Core Senior course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        ".NET Core Senior seviyesinde mülakata hazırlık kursu. İleri seviye C# konularından mimari desenlere, performans optimizasyonundan entegrasyon modüllerine kadar kapsamlı bir içerik. Senior developer pozisyonları için gerekli tüm teknik bilgileri mülakat soruları formatında öğreneceksiniz.",
      estimatedDurationMinutes: 1875, // 375 ders × 5 dakika (ortalama)
    },
    learningObjectives: [
      "İleri seviye C# özelliklerini ve memory yönetimini derinlemesine anlamak",
      "OOP prensipleri ve tasarım desenlerini pratik senaryolarda uygulamak",
      "Asenkron programlama ve performans optimizasyonu tekniklerini öğrenmek",
      "Mimari desenleri (DDD, Clean Architecture, CQRS) uygulamak",
      "Entity Framework Core ve SQL optimizasyonu tekniklerini öğrenmek",
      "Güvenlik mekanizmalarını (JWT, OAuth) detaylı şekilde anlamak",
      "Popüler entegrasyon modüllerini (FluentValidation, RabbitMQ, Redis) kullanmak",
      "Senior developer mülakatlarında sorulan teknik sorulara hazır olmak",
    ],
    prerequisites: [
      ".NET Core temel bilgisi",
      "C# programlama dili deneyimi",
      "Nesne yönelimli programlama (OOP) bilgisi",
      "Web API geliştirme deneyimi",
      "Veritabanı ve ORM kullanım deneyimi",
    ],
    modules: [],
  };

  // Module 1: İLERİ SEVİYE C# ANLAMA (100 ders)
  const advancedCSharpLessons = [
    "Delegate ve Event Nedir?",
    "Memory ve Span Nedir?",
    "Ref, In, Out Parametreleri Arasındaki Fark Nedir?",
    "Generics ve Constraints Nasıl Kullanılır?",
    "LINQ Detayları ve Performans Optimizasyonu",
    "Pattern Matching Nedir ve Nasıl Kullanılır?",
    "Records ve Init-only Setters Nedir?",
    "Nullable Reference Types Nasıl Kullanılır?",
    "Source Generators Nedir ve Nasıl Kullanılır?",
    "Ref Struct ve Stackalloc Nedir?",
    "Unsafe Code ve Pointer Kullanımı",
    "Attributes ve Reflection Detayları",
    "Expression Trees Nedir ve Nasıl Kullanılır?",
    "Dynamic Keyword ve Runtime Binding",
    "Covariance ve Contravariance Nedir?",
    "Extension Methods ve Best Practices",
    "Partial Classes ve Partial Methods",
    "Anonymous Types ve Tuples",
    "Local Functions ve Static Local Functions",
    "Pattern Matching ile Switch Expressions",
    "Discards ve Out Variables",
    "Default Interface Members (C# 8.0)",
    "Nullable Value Types Detayları",
    "String Interpolation ve FormattableString",
    "Nameof Operator Kullanımı",
    "Throw Expressions Nedir?",
    "Using Declarations ve Disposal Pattern",
    "Index ve Range Operators",
    "Async Streams (IAsyncEnumerable)",
    "Default Literal ve Target-typed New",
    "Init Accessors ve With Expressions",
    "File-scoped Namespaces",
    "Required Members (C# 11)",
    "Raw String Literals",
    "UTF-8 String Literals",
    "Generic Attributes",
    "Static Abstract Members in Interfaces",
    "Readonly Structs ve Performance",
    "Ref Returns ve Ref Locals",
    "Span<T> ve Memory<T> Kullanım Senaryoları",
    "ArrayPool<T> ile Memory Optimizasyonu",
    "StringBuilder vs String Interpolation Performansı",
    "Boxing ve Unboxing Performans Etkileri",
    "Value Types vs Reference Types Memory Layout",
    "Struct vs Class Ne Zaman Kullanılır?",
    "Immutable Collections ve Thread Safety",
    "Concurrent Collections Detayları",
    "Lazy<T> ve Lazy Initialization Patterns",
    "WeakReference ve Memory Management",
    "GC.Collect() Ne Zaman Kullanılır?",
    "Finalizers ve Dispose Pattern",
    "IDisposable ve Using Statement",
    "IEnumerable vs IQueryable Farkları",
    "Yield Return ve Iterator Pattern",
    "LINQ to Objects vs LINQ to SQL",
    "Expression<Func<T>> vs Func<T> Farkları",
    "Compiled Queries ve Performance",
    "AsParallel() ve PLINQ Kullanımı",
    "Aggregate ve Reduce Operations",
    "GroupBy ve ToLookup Farkları",
    "SelectMany ve Flattening Operations",
    "Zip ve Combine Operations",
    "Skip ve Take ile Pagination",
    "First vs FirstOrDefault vs Single",
    "Any vs Count > 0 Performansı",
    "Distinct ve Custom Equality Comparer",
    "OrderBy ve ThenBy Kullanımı",
    "Join Operations (Inner, Left, Right)",
    "GroupJoin ve Nested Collections",
    "Set Operations (Union, Intersect, Except)",
    "Partitioning Operations (SkipWhile, TakeWhile)",
    "Element Operations ve Exception Handling",
    "Conversion Operations (ToArray, ToList, ToDictionary)",
    "Aggregation Operations (Sum, Average, Min, Max)",
    "Quantifier Operations (All, Any, Contains)",
    "Generation Operations (Range, Repeat, Empty)",
    "Equality Operations (SequenceEqual)",
    "Concatenation Operations (Concat)",
    "Custom LINQ Operators Yazma",
    "Expression Trees ile Dynamic Queries",
    "IQueryable Provider Implementation",
    "Compile-time vs Runtime Type Checking",
    "Type Inference ve var Keyword",
    "Type Constraints (where T : class)",
    "Generic Method Overloading",
    "Generic Type Parameters ve Variance",
    "Open vs Closed Generic Types",
    "Generic Type Constraints Best Practices",
    "Covariant Return Types (C# 9.0)",
    "Static Local Functions ve Closures",
    "Local Functions vs Lambda Expressions",
    "Captured Variables ve Closures",
    "Expression-bodied Members",
    "Null-conditional Operators (?., ?[])",
    "Null-coalescing Operators (??, ??=)",
    "Pattern Matching ile Type Checking",
    "Switch Expressions vs Switch Statements",
    "Property Patterns ve Tuple Patterns",
    "Positional Patterns ve Deconstruction",
    "Relational Patterns (C# 9.0)",
    "Logical Patterns (and, or, not)",
    "Extended Property Patterns",
    "List Patterns (C# 11)",
  ];

  const module1: CourseModule = {
    id: "module-01",
    title: "Module 1: İleri Seviye C# Anlama",
    summary:
      "C# programlama dilinin ileri seviye özellikleri, memory yönetimi, generics, LINQ, pattern matching ve modern C# özellikleri. Senior developer mülakatlarında sıkça sorulan teknik konular.",
    durationMinutes: 500,
    objectives: [
      "Delegate ve Event mekanizmalarını derinlemesine anlamak",
      "Memory yönetimi ve Span<T> kullanımını öğrenmek",
      "Generics ve type constraints kullanımını master etmek",
      "LINQ operatörlerini ve performans optimizasyonunu öğrenmek",
      "Modern C# özelliklerini (Records, Pattern Matching) kullanmak",
    ],
    relatedTopics: advancedCSharpLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-01/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 2: OOP VE TASARIM DESENİ ANLAMA (25 ders)
  const oopDesignPatternLessons = [
    "Liskov Substitution Principle Nedir ve Nasıl Uygulanır?",
    "Dependency Injection Nedir ve Neden Önemlidir?",
    "SOLID Prensipleri Detaylı Açıklama",
    "Single Responsibility Principle Pratik Uygulaması",
    "Open/Closed Principle ve Extension Methods",
    "Interface Segregation Principle Best Practices",
    "Dependency Inversion Principle ve IoC Containers",
    "Factory Pattern Nedir ve Ne Zaman Kullanılır?",
    "Abstract Factory Pattern Uygulaması",
    "Builder Pattern ve Fluent Interface",
    "Singleton Pattern ve Thread Safety",
    "Prototype Pattern ve Object Cloning",
    "Adapter Pattern ve Legacy Code Integration",
    "Decorator Pattern ve Dynamic Behavior",
    "Facade Pattern ve Complex Subsystems",
    "Proxy Pattern ve Lazy Loading",
    "Composite Pattern ve Tree Structures",
    "Bridge Pattern ve Abstraction Separation",
    "Observer Pattern ve Event-driven Architecture",
    "Strategy Pattern ve Algorithm Selection",
    "Command Pattern ve Undo/Redo Functionality",
    "Chain of Responsibility Pattern",
    "State Pattern ve State Machines",
    "Template Method Pattern ve Code Reuse",
    "Visitor Pattern ve Double Dispatch",
  ];

  const module2: CourseModule = {
    id: "module-02",
    title: "Module 2: OOP ve Tasarım Deseni Anlama",
    summary:
      "SOLID prensipleri, tasarım desenleri (Creational, Structural, Behavioral) ve pratik uygulamaları. Mülakatlarda sıkça sorulan OOP ve design pattern soruları.",
    durationMinutes: 125,
    objectives: [
      "SOLID prensiplerini derinlemesine anlamak ve uygulamak",
      "Creational design patterns'i pratik senaryolarda kullanmak",
      "Structural design patterns ile kod organizasyonunu iyileştirmek",
      "Behavioral design patterns ile davranışsal esneklik sağlamak",
    ],
    relatedTopics: oopDesignPatternLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-02/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 3: ASENKRON PROGRAMLAMA (25 ders)
  const asyncProgrammingLessons = [
    "Task ve ValueTask Nedir? Aralarındaki Fark Nedir?",
    "Async/Await Detayları ve Execution Flow",
    "ConfigureAwait(false) Ne Zaman Kullanılır?",
    "CancellationToken Kullanımı ve Best Practices",
    "Parallel Programming ve Task Parallel Library",
    "Task.Run vs Task.Factory.StartNew Farkları",
    "TaskCompletionSource ve Custom Async Operations",
    "IAsyncEnumerable ve Async Streams",
    "Async LINQ ve Asynchronous Queries",
    "Deadlock Nasıl Engellenir?",
    "Async Void Ne Zaman Kullanılır?",
    "Task.WhenAll vs Task.WhenAny Kullanımı",
    "Exception Handling in Async Methods",
    "Async State Machine ve Compiler Transformation",
    "SynchronizationContext ve UI Thread",
    "SemaphoreSlim ve Async Locks",
    "AsyncLocal ve Execution Context",
    "Task.Yield() Ne Zaman Kullanılır?",
    "Task.Delay vs Thread.Sleep",
    "Fire-and-Forget Pattern ve Background Tasks",
    "Async Method Overloads ve Best Practices",
    "Task Schedulers ve Custom Scheduling",
    "Async Performance Optimization",
    "IAsyncDisposable ve Resource Management",
    "Async Patterns ve Anti-patterns",
  ];

  const module3: CourseModule = {
    id: "module-03",
    title: "Module 3: Asenkron Programlama",
    summary:
      "Task, ValueTask, async/await, cancellation tokens, parallel programming ve performans optimizasyonu. Asenkron programlamada karşılaşılan yaygın sorunlar ve çözümleri.",
    durationMinutes: 125,
    objectives: [
      "Task ve ValueTask arasındaki farkları anlamak",
      "Async/await mekanizmasını derinlemesine öğrenmek",
      "Deadlock ve race condition sorunlarını çözmek",
      "Asenkron programlamada performans optimizasyonu yapmak",
    ],
    relatedTopics: asyncProgrammingLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-03/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 4: MEMORY PERFORMANCE (25 ders)
  const memoryPerformanceLessons = [
    "Deadlock Nasıl Engellenir?",
    "Memory Leak Nasıl Tespit Edilir?",
    "Garbage Collection Detayları ve Generations",
    "Memory Profiling ve Diagnostic Tools",
    "Performance Optimization Teknikleri",
    "GC.Collect() Ne Zaman Çağrılır?",
    "WeakReference ve Memory Management",
    "Large Object Heap (LOH) ve Fragmentation",
    "Gen0, Gen1, Gen2 Garbage Collection",
    "Finalizers ve Performance Impact",
    "IDisposable Pattern ve Resource Management",
    "Using Statement ve Exception Safety",
    "Memory Allocation Patterns",
    "Stack vs Heap Memory Allocation",
    "Value Types ve Memory Efficiency",
    "ArrayPool<T> ve Memory Reuse",
    "Span<T> ve Zero-copy Operations",
    "Memory<T> ve Pinned Memory",
    "Unsafe Code ve Pointer Arithmetic",
    "Struct vs Class Memory Footprint",
    "String Interning ve Memory Usage",
    "StringBuilder vs String Concatenation",
    "Boxing ve Unboxing Performance Cost",
    "Ref Struct ve Stack-only Types",
    "Memory Diagnostic Tools (dotMemory, PerfView)",
  ];

  const module4: CourseModule = {
    id: "module-04",
    title: "Module 4: Memory ve Performance",
    summary:
      "Memory yönetimi, garbage collection, memory leak tespiti, deadlock önleme ve performans optimizasyonu teknikleri. Production ortamlarında karşılaşılan performans sorunları ve çözümleri.",
    durationMinutes: 125,
    objectives: [
      "Memory leak'leri tespit etmek ve önlemek",
      "Deadlock sorunlarını çözmek",
      "Garbage collection mekanizmasını anlamak",
      "Performans optimizasyonu tekniklerini uygulamak",
    ],
    relatedTopics: memoryPerformanceLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-04/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 5: ARCHITECTURE AND DESIGN (25 ders)
  const architectureDesignLessons = [
    "Domain-Driven Design (DDD) Nedir?",
    "Onion Architecture ve Dependency Rule",
    "Clean Architecture Prensipleri",
    "MVC, MVP, MVVM Pattern Karşılaştırması",
    "CQRS Pattern ve Command Query Separation",
    "Event Sourcing ve Event Store",
    "Hexagonal Architecture (Ports and Adapters)",
    "Layered Architecture ve Best Practices",
    "Microservices Architecture Patterns",
    "API Gateway Pattern ve Service Mesh",
    "Service Discovery ve Load Balancing",
    "Circuit Breaker Pattern",
    "Saga Pattern ve Distributed Transactions",
    "Database per Service Pattern",
    "Shared Database Anti-pattern",
    "Bounded Context ve Domain Modeling",
    "Aggregate Root ve Entity Design",
    "Value Objects ve Immutability",
    "Domain Events ve Event-driven Architecture",
    "Repository Pattern ve Unit of Work",
    "Specification Pattern ve Query Building",
    "Mediator Pattern ve CQRS",
    "Factory Pattern ve Domain Object Creation",
    "Strategy Pattern ve Business Rules",
    "Dependency Injection ve IoC Containers",
  ];

  const module5: CourseModule = {
    id: "module-05",
    title: "Module 5: Architecture ve Design",
    summary:
      "DDD, Clean Architecture, Onion Architecture, CQRS, Event Sourcing ve mikroservis mimarileri. Enterprise seviyesinde uygulama tasarımı ve mimari desenler.",
    durationMinutes: 125,
    objectives: [
      "Domain-Driven Design prensiplerini anlamak",
      "Clean Architecture ve Onion Architecture uygulamak",
      "CQRS ve Event Sourcing pattern'lerini öğrenmek",
      "Mikroservis mimarisi desenlerini uygulamak",
    ],
    relatedTopics: architectureDesignLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-05/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 6: DATA ACCESS, ORM (25 ders)
  const dataAccessORMLessons = [
    "EF Core Detayları ve Advanced Features",
    "SQL Optimizasyonu ve Query Tuning",
    "Query Performance ve N+1 Problem",
    "Migration Stratejileri ve Best Practices",
    "Raw SQL Kullanımı ve Stored Procedures",
    "Change Tracking ve State Management",
    "Lazy Loading vs Eager Loading vs Explicit Loading",
    "Include ve ThenInclude ile Navigation Properties",
    "AsNoTracking() ve Read-only Queries",
    "Compiled Queries ve Performance",
    "Bulk Operations ve Batch Updates",
    "Database Transactions ve SaveChanges",
    "Concurrency Control ve Optimistic Locking",
    "Database First vs Code First vs Model First",
    "Fluent API vs Data Annotations",
    "Custom Conventions ve Model Configuration",
    "Interceptors ve Database Events",
    "Global Query Filters ve Soft Delete",
    "Owned Types ve Value Objects",
    "Table Splitting ve Column Splitting",
    "Inheritance Strategies (TPH, TPT, TPC)",
    "Many-to-Many Relationships",
    "Database Providers ve Provider-specific Features",
    "Connection Pooling ve Connection Management",
    "Database Migrations ve Rollback Strategies",
  ];

  const module6: CourseModule = {
    id: "module-06",
    title: "Module 6: Data Access ve ORM",
    summary:
      "Entity Framework Core detayları, SQL optimizasyonu, query performance, migration stratejileri ve advanced ORM teknikleri. Production ortamlarında veritabanı erişimi best practices.",
    durationMinutes: 125,
    objectives: [
      "EF Core'un advanced özelliklerini öğrenmek",
      "SQL query optimizasyonu yapmak",
      "N+1 problem ve performans sorunlarını çözmek",
      "Migration stratejilerini uygulamak",
    ],
    relatedTopics: dataAccessORMLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-06/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 7: SECURITY (25 ders)
  const securityLessons = [
    "JWT Detayları ve Token Lifecycle",
    "OAuth 2.0 ve Authorization Flow",
    "Session Yönetimi ve State Management",
    "Cookie Güvenliği ve HttpOnly, Secure Flags",
    "Authentication vs Authorization Farkları",
    "Claims-based Authentication",
    "Role-based vs Policy-based Authorization",
    "Token Refresh ve Sliding Expiration",
    "Password Hashing ve Salt",
    "HTTPS ve SSL/TLS Configuration",
    "CORS Policy ve Cross-origin Requests",
    "CSRF Protection ve Anti-forgery Tokens",
    "XSS Prevention ve Input Validation",
    "SQL Injection Prevention ve Parameterized Queries",
    "API Security ve Rate Limiting",
    "Encryption ve Decryption",
    "Hashing Algorithms (SHA, MD5, BCrypt)",
    "Certificate-based Authentication",
    "Two-Factor Authentication (2FA)",
    "OpenID Connect ve Identity Providers",
    "SAML ve Enterprise SSO",
    "API Keys vs OAuth vs JWT",
    "Security Headers ve Best Practices",
    "Penetration Testing ve Security Audits",
    "Security Logging ve Monitoring",
  ];

  const module7: CourseModule = {
    id: "module-07",
    title: "Module 7: Security",
    summary:
      "JWT, OAuth 2.0, session yönetimi, cookie güvenliği, authentication ve authorization mekanizmaları. Web uygulamalarında güvenlik best practices ve yaygın güvenlik açıkları.",
    durationMinutes: 125,
    objectives: [
      "JWT ve OAuth 2.0 mekanizmalarını anlamak",
      "Authentication ve authorization stratejilerini uygulamak",
      "Güvenlik açıklarını (XSS, CSRF, SQL Injection) önlemek",
      "Güvenli API tasarımı yapmak",
    ],
    relatedTopics: securityLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-07/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 8: INTEGRATION MODULE FLUENT VALIDATION (25 ders)
  const fluentValidationLessons = [
    "FluentValidation Nedir ve Neden Kullanılır?",
    "FluentValidation Kurulumu ve Configuration",
    "Basic Validators ve Rule Definition",
    "Custom Validators Yazma",
    "Rule Sets ve Conditional Validation",
    "Cascading Validators ve Dependent Rules",
    "Async Validators ve Remote Validation",
    "Collection Validators ve Nested Objects",
    "Property Validators ve Custom Rules",
    "Validator Inheritance ve Reusability",
    "Localization ve Multi-language Support",
    "Error Messages ve Customization",
    "Severity Levels ve Warning Messages",
    "Pre-validation ve Pre-processing",
    "Post-validation ve Custom Logic",
    "Validator Composition ve Complex Rules",
    "Performance Optimization ve Caching",
    "Integration with ASP.NET Core",
    "Integration with Entity Framework",
    "Unit Testing Validators",
    "Validator Factories ve DI Integration",
    "Conditional Validation ve When/Unless",
    "Must vs Custom Validators",
    "Transform ve Value Transformation",
    "Best Practices ve Common Patterns",
  ];

  const module8: CourseModule = {
    id: "module-08",
    title: "Module 8: Integration Module - FluentValidation",
    summary:
      "FluentValidation kütüphanesi, custom validators, rule sets, async validation ve ASP.NET Core entegrasyonu. Kapsamlı ve esnek validation stratejileri.",
    durationMinutes: 125,
    objectives: [
      "FluentValidation kütüphanesini kullanmak",
      "Custom validators yazmak",
      "Rule sets ve conditional validation uygulamak",
      "ASP.NET Core ile entegrasyon yapmak",
    ],
    relatedTopics: fluentValidationLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-08/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 9: INTEGRATION MODULE RABBIT MQ (25 ders)
  const rabbitMQLessons = [
    "RabbitMQ Nedir ve Ne Zaman Kullanılır?",
    "RabbitMQ Kurulumu ve Configuration",
    "Message Queue Patterns ve Best Practices",
    "Publisher/Consumer Pattern Implementation",
    "Exchange Types (Direct, Topic, Fanout, Headers)",
    "Routing Keys ve Binding Strategies",
    "Message Durability ve Persistence",
    "Acknowledgment ve Message Confirmation",
    "Prefetch Count ve Consumer Performance",
    "Dead Letter Exchange ve Error Handling",
    "Message TTL ve Expiration",
    "Priority Queues ve Message Priority",
    "RPC Pattern ve Request/Response",
    "Work Queues ve Task Distribution",
    "Pub/Sub Pattern ve Event Broadcasting",
    "Connection Management ve Connection Pooling",
    "Channel Management ve Best Practices",
    "Clustering ve High Availability",
    "Mirrored Queues ve Replication",
    "Monitoring ve Management UI",
    "Performance Tuning ve Optimization",
    "Error Handling ve Retry Mechanisms",
    "Message Serialization ve Deserialization",
    "Integration with ASP.NET Core",
    "Best Practices ve Production Deployment",
  ];

  const module9: CourseModule = {
    id: "module-09",
    title: "Module 9: Integration Module - RabbitMQ",
    summary:
      "RabbitMQ message broker, exchange types, routing strategies, publisher/consumer patterns ve enterprise messaging patterns. Distributed systems için message queue kullanımı.",
    durationMinutes: 125,
    objectives: [
      "RabbitMQ message broker'ı kullanmak",
      "Exchange types ve routing stratejilerini anlamak",
      "Publisher/Consumer pattern'lerini uygulamak",
      "High availability ve clustering yapılandırması yapmak",
    ],
    relatedTopics: rabbitMQLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-09/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 10: INTEGRATION MODULE EF CORE (25 ders)
  const efCoreIntegrationLessons = [
    "EF Core Advanced Features ve Latest Updates",
    "Custom Conventions ve Model Configuration",
    "Interceptors ve Database Events",
    "Global Query Filters ve Soft Delete Pattern",
    "Owned Types ve Value Objects Mapping",
    "Table Splitting ve Column Splitting",
    "Inheritance Strategies (TPH, TPT, TPC)",
    "Many-to-Many Relationships ve Join Tables",
    "Database Providers ve Provider-specific Features",
    "Connection Resiliency ve Retry Logic",
    "Query Tags ve SQL Comments",
    "FromSqlRaw ve FromSqlInterpolated",
    "ExecuteSqlRaw ve ExecuteSqlInterpolated",
    "Database Functions ve Custom Functions",
    "Computed Columns ve Database-generated Values",
    "Sequences ve Identity Columns",
    "Database Views ve Materialized Views",
    "Raw SQL Queries ve Stored Procedures",
    "Change Tracking Strategies",
    "Bulk Operations ve Batch Updates",
    "Database Migrations ve Versioning",
    "Seed Data ve Initial Data",
    "Database Factories ve Context Pooling",
    "Performance Monitoring ve Diagnostics",
    "Best Practices ve Production Patterns",
  ];

  const module10: CourseModule = {
    id: "module-10",
    title: "Module 10: Integration Module - EF Core",
    summary:
      "Entity Framework Core advanced features, custom conventions, interceptors, query optimization ve production-ready patterns. Enterprise seviyesinde ORM kullanımı.",
    durationMinutes: 125,
    objectives: [
      "EF Core'un advanced özelliklerini kullanmak",
      "Custom conventions ve interceptors yazmak",
      "Query optimization ve performance tuning yapmak",
      "Production-ready EF Core patterns uygulamak",
    ],
    relatedTopics: efCoreIntegrationLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-10/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 11: REDIS (25 ders)
  const redisLessons = [
    "Redis Nedir ve Ne Zaman Kullanılır?",
    "Redis Kurulumu ve Configuration",
    "Caching Stratejileri ve Cache Patterns",
    "Distributed Caching ve Cache Invalidation",
    "Redis Data Types (String, Hash, List, Set, Sorted Set)",
    "Redis Commands ve Operations",
    "Key Expiration ve TTL Management",
    "Redis Pub/Sub ve Message Broadcasting",
    "Redis Transactions ve Atomic Operations",
    "Redis Lua Scripting ve Server-side Logic",
    "Redis Persistence (RDB, AOF)",
    "Redis Replication ve Master-Slave",
    "Redis Sentinel ve High Availability",
    "Redis Cluster ve Sharding",
    "Connection Pooling ve Performance",
    "Serialization ve Data Format",
    "Cache-aside Pattern",
    "Write-through Pattern",
    "Write-behind Pattern",
    "Cache Stampede ve Thundering Herd",
    "Redis Performance Tuning",
    "Memory Management ve Eviction Policies",
    "Monitoring ve Redis CLI",
    "Integration with ASP.NET Core",
    "Best Practices ve Production Deployment",
  ];

  const module11: CourseModule = {
    id: "module-11",
    title: "Module 11: Redis",
    summary:
      "Redis in-memory data store, caching stratejileri, distributed caching, pub/sub messaging ve high availability yapılandırması. Performans optimizasyonu için Redis kullanımı.",
    durationMinutes: 125,
    objectives: [
      "Redis in-memory data store'u kullanmak",
      "Caching stratejileri ve patterns uygulamak",
      "Distributed caching yapılandırması yapmak",
      "High availability ve clustering kurulumu yapmak",
    ],
    relatedTopics: redisLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-11/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Module 12: MSSQL (25 ders)
  const mssqlLessons = [
    "SQL Server Optimizasyonu ve Performance Tuning",
    "Index Stratejileri ve Index Types",
    "Query Tuning ve Execution Plans",
    "Statistics ve Query Optimizer",
    "Locking ve Concurrency Control",
    "Transaction Isolation Levels",
    "Deadlock Detection ve Prevention",
    "Blocking ve Blocking Analysis",
    "Wait Statistics ve Performance Monitoring",
    "Query Store ve Plan Analysis",
    "Index Fragmentation ve Maintenance",
    "Partitioning Strategies",
    "Columnstore Indexes ve Analytics",
    "In-Memory OLTP ve Memory-optimized Tables",
    "Temporal Tables ve History Tracking",
    "JSON Support ve JSON Queries",
    "Full-Text Search ve Indexing",
    "Stored Procedures ve Performance",
    "Functions vs Stored Procedures",
    "Triggers ve Best Practices",
    "Views ve Materialized Views",
    "Common Table Expressions (CTE)",
    "Window Functions ve Analytical Queries",
    "Pivot ve Unpivot Operations",
    "Best Practices ve Production Optimization",
  ];

  const module12: CourseModule = {
    id: "module-12",
    title: "Module 12: MSSQL",
    summary:
      "SQL Server optimizasyonu, index stratejileri, query tuning, execution plans ve performance monitoring. Production ortamlarında SQL Server best practices.",
    durationMinutes: 125,
    objectives: [
      "SQL Server query optimizasyonu yapmak",
      "Index stratejileri ve maintenance uygulamak",
      "Query tuning ve execution plan analizi yapmak",
      "Performance monitoring ve troubleshooting yapmak",
    ],
    relatedTopics: mssqlLessons.map((lesson, index) => ({
      label: `Ders ${index + 1}: ${lesson}`,
      href: `/education/lessons/dotnet-core-senior/module-12/lesson-${String(index + 1).padStart(2, "0")}`,
      description: lesson,
    })),
  };

  // Add all modules to course content
  courseContent.modules = [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
    module8,
    module9,
    module10,
    module11,
    module12,
  ];

  const totalModules = courseContent.modules.length;
  const totalLessons = courseContent.modules.reduce(
    (sum, module) => sum + module.relatedTopics.length,
    0
  );

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${totalModules}, Total lessons: ${totalLessons}`
  );

  return courseContent;
}

