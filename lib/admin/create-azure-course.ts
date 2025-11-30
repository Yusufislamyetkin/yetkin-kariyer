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
 * Create complete Azure course structure with predefined content
 */
export async function createAzureCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting Azure course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Microsoft Azure, dünyanın önde gelen bulut platformlarından biridir. Bu kapsamlı kurs ile Azure'un temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Bulut altyapısı, compute, storage, database, networking, güvenlik ve DevOps konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "Azure'un temel kavramlarını ve mimarisini anlamak",
      "App Service, Functions, Storage gibi temel Azure servislerini kullanmak",
      "Azure Active Directory ile kimlik ve erişim yönetimi yapmak",
      "Virtual Network ile network yapılandırması yapmak",
      "Azure Functions ile serverless uygulamalar geliştirmek",
      "ARM Templates ile Infrastructure as Code uygulamak",
      "Azure DevOps ile CI/CD pipeline'ları kurmak ve monitoring yapmak",
    ],
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "Ağ (networking) temel kavramlarına aşinalık",
      "Windows/Linux sistem yönetimi bilgisi (opsiyonel)",
      "Temel programlama bilgisi (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: Azure Tanımı ve Temelleri",
        summary:
          "Azure'un ne olduğu, tarihçesi, avantajları, bulut computing kavramları ve Azure global infrastructure.",
        durationMinutes: 450,
        objectives: [
          "Azure'un ne olduğunu ve neden kullanıldığını anlamak",
          "Bulut computing kavramını öğrenmek",
          "Azure'un avantajlarını ve kullanım alanlarını keşfetmek",
          "Azure global infrastructure'ı anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Nedir?",
            href: "/education/lessons/azure/module-01/lesson-01",
            description: "Azure'un temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Bulut Computing Nedir?",
            href: "/education/lessons/azure/module-01/lesson-02",
            description: "Cloud computing kavramı",
          },
          {
            label: "Ders 3: Azure'un Tarihçesi",
            href: "/education/lessons/azure/module-01/lesson-03",
            description: "Azure'un ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: IaaS, PaaS, SaaS",
            href: "/education/lessons/azure/module-01/lesson-04",
            description: "Bulut servis modelleri",
          },
          {
            label: "Ders 5: Azure'un Avantajları",
            href: "/education/lessons/azure/module-01/lesson-05",
            description: "Ölçeklenebilirlik, maliyet, güvenlik",
          },
          {
            label: "Ders 6: Azure Kullanım Alanları",
            href: "/education/lessons/azure/module-01/lesson-06",
            description: "Web hosting, big data, AI/ML",
          },
          {
            label: "Ders 7: Azure Global Infrastructure",
            href: "/education/lessons/azure/module-01/lesson-07",
            description: "Regions, Availability Zones, Edge Locations",
          },
          {
            label: "Ders 8: Azure vs AWS vs GCP",
            href: "/education/lessons/azure/module-01/lesson-08",
            description: "Bulut sağlayıcıları karşılaştırması",
          },
          {
            label: "Ders 9: Azure Pricing Model",
            href: "/education/lessons/azure/module-01/lesson-09",
            description: "Fiyatlandırma modelleri ve maliyet yönetimi",
          },
          {
            label: "Ders 10: Azure Free Tier",
            href: "/education/lessons/azure/module-01/lesson-10",
            description: "Ücretsiz servisler ve limitler",
          },
          {
            label: "Ders 11: Azure Portal'a Giriş",
            href: "/education/lessons/azure/module-01/lesson-11",
            description: "Azure Portal kullanımı",
          },
          {
            label: "Ders 12: Azure CLI ve PowerShell",
            href: "/education/lessons/azure/module-01/lesson-12",
            description: "Komut satırı araçları",
          },
          {
            label: "Ders 13: Azure Resource Manager",
            href: "/education/lessons/azure/module-01/lesson-13",
            description: "ARM mimarisi ve kaynak yönetimi",
          },
          {
            label: "Ders 14: Azure Service Categories",
            href: "/education/lessons/azure/module-01/lesson-14",
            description: "Compute, Storage, Database, Networking",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: Azure App Service",
        summary:
          "Azure App Service ile web uygulamaları, API'ler ve mobil backend'ler geliştirme ve deploy etme.",
        durationMinutes: 450,
        objectives: [
          "App Service'in ne olduğunu ve nasıl kullanıldığını anlamak",
          "Web App oluşturma ve deploy etme",
          "App Service planları ve pricing",
          "Continuous Deployment yapılandırması",
        ],
        relatedTopics: [
          {
            label: "Ders 1: App Service Nedir?",
            href: "/education/lessons/azure/module-02/lesson-01",
            description: "App Service tanımı ve özellikleri",
          },
          {
            label: "Ders 2: App Service Planları",
            href: "/education/lessons/azure/module-02/lesson-02",
            description: "Plan türleri ve seçimi",
          },
          {
            label: "Ders 3: Web App Oluşturma",
            href: "/education/lessons/azure/module-02/lesson-03",
            description: "Portal üzerinden web app oluşturma",
          },
          {
            label: "Ders 4: Deployment Options",
            href: "/education/lessons/azure/module-02/lesson-04",
            description: "Deploy yöntemleri",
          },
          {
            label: "Ders 5: Continuous Deployment",
            href: "/education/lessons/azure/module-02/lesson-05",
            description: "GitHub, Azure DevOps entegrasyonu",
          },
          {
            label: "Ders 6: Application Settings",
            href: "/education/lessons/azure/module-02/lesson-06",
            description: "App settings ve connection strings",
          },
          {
            label: "Ders 7: Custom Domains ve SSL",
            href: "/education/lessons/azure/module-02/lesson-07",
            description: "Domain yapılandırması",
          },
          {
            label: "Ders 8: Scaling ve Performance",
            href: "/education/lessons/azure/module-02/lesson-08",
            description: "Scale up/down ve auto-scaling",
          },
          {
            label: "Ders 9: Deployment Slots",
            href: "/education/lessons/azure/module-02/lesson-09",
            description: "Staging ve production slots",
          },
          {
            label: "Ders 10: App Service Logs",
            href: "/education/lessons/azure/module-02/lesson-10",
            description: "Logging ve monitoring",
          },
          {
            label: "Ders 11: App Service Backup",
            href: "/education/lessons/azure/module-02/lesson-11",
            description: "Backup ve restore işlemleri",
          },
          {
            label: "Ders 12: App Service Authentication",
            href: "/education/lessons/azure/module-02/lesson-12",
            description: "Built-in authentication",
          },
          {
            label: "Ders 13: API Apps ve Mobile Apps",
            href: "/education/lessons/azure/module-02/lesson-13",
            description: "API ve mobil backend",
          },
          {
            label: "Ders 14: App Service Best Practices",
            href: "/education/lessons/azure/module-02/lesson-14",
            description: "En iyi uygulamalar",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-02/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: Azure Functions",
        summary:
          "Azure Functions ile serverless uygulamalar geliştirme, event-driven architecture ve mikroservisler.",
        durationMinutes: 450,
        objectives: [
          "Azure Functions'ın ne olduğunu anlamak",
          "Function App oluşturma ve yapılandırma",
          "Triggers ve bindings kullanımı",
          "Serverless architecture tasarımı",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Functions Nedir?",
            href: "/education/lessons/azure/module-03/lesson-01",
            description: "Serverless computing ve Functions",
          },
          {
            label: "Ders 2: Function App Oluşturma",
            href: "/education/lessons/azure/module-03/lesson-02",
            description: "Portal ve CLI ile oluşturma",
          },
          {
            label: "Ders 3: HTTP Trigger Functions",
            href: "/education/lessons/azure/module-03/lesson-03",
            description: "HTTP trigger ile API oluşturma",
          },
          {
            label: "Ders 4: Timer Trigger Functions",
            href: "/education/lessons/azure/module-03/lesson-04",
            description: "Zamanlanmış görevler",
          },
          {
            label: "Ders 5: Blob Storage Trigger",
            href: "/education/lessons/azure/module-03/lesson-05",
            description: "Blob events ile tetikleme",
          },
          {
            label: "Ders 6: Queue Trigger Functions",
            href: "/education/lessons/azure/module-03/lesson-06",
            description: "Queue messages ile işleme",
          },
          {
            label: "Ders 7: Cosmos DB Trigger",
            href: "/education/lessons/azure/module-03/lesson-07",
            description: "Database change feed",
          },
          {
            label: "Ders 8: Input ve Output Bindings",
            href: "/education/lessons/azure/module-03/lesson-08",
            description: "Binding kavramı ve kullanımı",
          },
          {
            label: "Ders 9: Function App Settings",
            href: "/education/lessons/azure/module-03/lesson-09",
            description: "Configuration ve environment variables",
          },
          {
            label: "Ders 10: Durable Functions",
            href: "/education/lessons/azure/module-03/lesson-10",
            description: "Orchestration ve state management",
          },
          {
            label: "Ders 11: Function Monitoring",
            href: "/education/lessons/azure/module-03/lesson-11",
            description: "Application Insights entegrasyonu",
          },
          {
            label: "Ders 12: Function Pricing",
            href: "/education/lessons/azure/module-03/lesson-12",
            description: "Consumption vs Premium plan",
          },
          {
            label: "Ders 13: Function Security",
            href: "/education/lessons/azure/module-03/lesson-13",
            description: "Authentication ve authorization",
          },
          {
            label: "Ders 14: Function Best Practices",
            href: "/education/lessons/azure/module-03/lesson-14",
            description: "Performance ve maliyet optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-03/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: Azure Storage Accounts",
        summary:
          "Azure Storage ile blob, file, queue ve table storage kullanımı, data management ve backup stratejileri.",
        durationMinutes: 450,
        objectives: [
          "Azure Storage'un ne olduğunu anlamak",
          "Storage Account oluşturma ve yapılandırma",
          "Blob, File, Queue, Table storage kullanımı",
          "Storage security ve performance",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Storage Nedir?",
            href: "/education/lessons/azure/module-04/lesson-01",
            description: "Storage servisleri genel bakış",
          },
          {
            label: "Ders 2: Storage Account Oluşturma",
            href: "/education/lessons/azure/module-04/lesson-02",
            description: "Account türleri ve yapılandırma",
          },
          {
            label: "Ders 3: Blob Storage Temelleri",
            href: "/education/lessons/azure/module-04/lesson-03",
            description: "Blob storage kavramı",
          },
          {
            label: "Ders 4: Blob Containers",
            href: "/education/lessons/azure/module-04/lesson-04",
            description: "Container oluşturma ve yönetimi",
          },
          {
            label: "Ders 5: Blob Types (Block, Page, Append)",
            href: "/education/lessons/azure/module-04/lesson-05",
            description: "Blob türleri ve kullanım alanları",
          },
          {
            label: "Ders 6: File Storage",
            href: "/education/lessons/azure/module-04/lesson-06",
            description: "Azure Files ve SMB protokolü",
          },
          {
            label: "Ders 7: Queue Storage",
            href: "/education/lessons/azure/module-04/lesson-07",
            description: "Message queue yönetimi",
          },
          {
            label: "Ders 8: Table Storage",
            href: "/education/lessons/azure/module-04/lesson-08",
            description: "NoSQL table storage",
          },
          {
            label: "Ders 9: Storage Access Keys",
            href: "/education/lessons/azure/module-04/lesson-09",
            description: "Authentication ve access control",
          },
          {
            label: "Ders 10: Shared Access Signatures (SAS)",
            href: "/education/lessons/azure/module-04/lesson-10",
            description: "Güvenli erişim token'ları",
          },
          {
            label: "Ders 11: Storage Lifecycle Management",
            href: "/education/lessons/azure/module-04/lesson-11",
            description: "Data tiering ve archiving",
          },
          {
            label: "Ders 12: Storage Replication",
            href: "/education/lessons/azure/module-04/lesson-12",
            description: "LRS, GRS, ZRS, RA-GRS",
          },
          {
            label: "Ders 13: Storage Performance",
            href: "/education/lessons/azure/module-04/lesson-13",
            description: "Standard vs Premium storage",
          },
          {
            label: "Ders 14: Storage Security",
            href: "/education/lessons/azure/module-04/lesson-14",
            description: "Encryption ve network security",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-04/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: Azure SQL Database",
        summary:
          "Azure SQL Database ile managed relational database servisleri, migration, scaling ve performance optimization.",
        durationMinutes: 450,
        objectives: [
          "Azure SQL Database'in ne olduğunu anlamak",
          "SQL Database oluşturma ve yapılandırma",
          "Migration stratejileri",
          "Performance tuning ve optimization",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure SQL Database Nedir?",
            href: "/education/lessons/azure/module-05/lesson-01",
            description: "Managed database servisi",
          },
          {
            label: "Ders 2: SQL Database Oluşturma",
            href: "/education/lessons/azure/module-05/lesson-02",
            description: "Portal ve CLI ile oluşturma",
          },
          {
            label: "Ders 3: Database Service Tiers",
            href: "/education/lessons/azure/module-05/lesson-03",
            description: "DTU ve vCore modelleri",
          },
          {
            label: "Ders 4: Elastic Pools",
            href: "/education/lessons/azure/module-05/lesson-04",
            description: "Resource sharing ve cost optimization",
          },
          {
            label: "Ders 5: Database Migration",
            href: "/education/lessons/azure/module-05/lesson-05",
            description: "On-premises'den Azure'a migration",
          },
          {
            label: "Ders 6: Connection Strings",
            href: "/education/lessons/azure/module-05/lesson-06",
            description: "Application connection yapılandırması",
          },
          {
            label: "Ders 7: Firewall Rules",
            href: "/education/lessons/azure/module-05/lesson-07",
            description: "Network security ve access control",
          },
          {
            label: "Ders 8: Database Backup",
            href: "/education/lessons/azure/module-05/lesson-08",
            description: "Automated backups ve restore",
          },
          {
            label: "Ders 9: Point-in-Time Restore",
            href: "/education/lessons/azure/module-05/lesson-09",
            description: "Time-based restore işlemleri",
          },
          {
            label: "Ders 10: Geo-Replication",
            href: "/education/lessons/azure/module-05/lesson-10",
            description: "Multi-region replication",
          },
          {
            label: "Ders 11: Query Performance Insights",
            href: "/education/lessons/azure/module-05/lesson-11",
            description: "Performance monitoring ve optimization",
          },
          {
            label: "Ders 12: Automatic Tuning",
            href: "/education/lessons/azure/module-05/lesson-12",
            description: "AI-powered performance optimization",
          },
          {
            label: "Ders 13: Database Security",
            href: "/education/lessons/azure/module-05/lesson-13",
            description: "Encryption, auditing, threat detection",
          },
          {
            label: "Ders 14: SQL Database Best Practices",
            href: "/education/lessons/azure/module-05/lesson-14",
            description: "Design patterns ve optimization",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-05/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Azure Cosmos DB",
        summary:
          "Azure Cosmos DB ile globally distributed NoSQL database, multi-model support ve high availability.",
        durationMinutes: 450,
        objectives: [
          "Cosmos DB'nin ne olduğunu anlamak",
          "Cosmos DB account ve database oluşturma",
          "API seçimi (SQL, MongoDB, Cassandra, etc.)",
          "Global distribution ve consistency",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Cosmos DB Nedir?",
            href: "/education/lessons/azure/module-06/lesson-01",
            description: "Globally distributed NoSQL database",
          },
          {
            label: "Ders 2: Cosmos DB Account Oluşturma",
            href: "/education/lessons/azure/module-06/lesson-02",
            description: "Account yapılandırması",
          },
          {
            label: "Ders 3: API Models",
            href: "/education/lessons/azure/module-06/lesson-03",
            description: "SQL, MongoDB, Cassandra, Gremlin",
          },
          {
            label: "Ders 4: Database ve Container Oluşturma",
            href: "/education/lessons/azure/module-06/lesson-04",
            description: "Data model yapısı",
          },
          {
            label: "Ders 5: Request Units (RU)",
            href: "/education/lessons/azure/module-06/lesson-05",
            description: "Throughput ve pricing model",
          },
          {
            label: "Ders 6: Partition Keys",
            href: "/education/lessons/azure/module-06/lesson-06",
            description: "Data partitioning stratejileri",
          },
          {
            label: "Ders 7: Consistency Levels",
            href: "/education/lessons/azure/module-06/lesson-07",
            description: "Strong, Bounded, Session, Eventual",
          },
          {
            label: "Ders 8: Global Distribution",
            href: "/education/lessons/azure/module-06/lesson-08",
            description: "Multi-region deployment",
          },
          {
            label: "Ders 9: Cosmos DB Queries",
            href: "/education/lessons/azure/module-06/lesson-09",
            description: "SQL API queries",
          },
          {
            label: "Ders 10: Indexing Policies",
            href: "/education/lessons/azure/module-06/lesson-10",
            description: "Automatic ve custom indexing",
          },
          {
            label: "Ders 11: Change Feed",
            href: "/education/lessons/azure/module-06/lesson-11",
            description: "Real-time data streaming",
          },
          {
            label: "Ders 12: Cosmos DB Security",
            href: "/education/lessons/azure/module-06/lesson-12",
            description: "Encryption, firewall, access control",
          },
          {
            label: "Ders 13: Performance Optimization",
            href: "/education/lessons/azure/module-06/lesson-13",
            description: "RU optimization ve best practices",
          },
          {
            label: "Ders 14: Cosmos DB Migration",
            href: "/education/lessons/azure/module-06/lesson-14",
            description: "Data migration tools",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-06/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: Azure Virtual Network",
        summary:
          "Azure Virtual Network ile network yapılandırması, subnets, network security groups ve connectivity.",
        durationMinutes: 450,
        objectives: [
          "Virtual Network'un ne olduğunu anlamak",
          "VNet oluşturma ve yapılandırma",
          "Subnets, NSGs ve routing",
          "Site-to-Site ve Point-to-Site VPN",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Virtual Network Nedir?",
            href: "/education/lessons/azure/module-07/lesson-01",
            description: "Network isolation ve segmentation",
          },
          {
            label: "Ders 2: VNet Oluşturma",
            href: "/education/lessons/azure/module-07/lesson-02",
            description: "Address space yapılandırması",
          },
          {
            label: "Ders 3: Subnets",
            href: "/education/lessons/azure/module-07/lesson-03",
            description: "Subnet design ve yönetimi",
          },
          {
            label: "Ders 4: Network Security Groups (NSG)",
            href: "/education/lessons/azure/module-07/lesson-04",
            description: "Firewall rules ve security",
          },
          {
            label: "Ders 5: Application Security Groups",
            href: "/education/lessons/azure/module-07/lesson-05",
            description: "ASG ile security management",
          },
          {
            label: "Ders 6: VNet Peering",
            href: "/education/lessons/azure/module-07/lesson-06",
            description: "VNet'ler arası bağlantı",
          },
          {
            label: "Ders 7: User Defined Routes (UDR)",
            href: "/education/lessons/azure/module-07/lesson-07",
            description: "Custom routing tables",
          },
          {
            label: "Ders 8: VPN Gateway",
            href: "/education/lessons/azure/module-07/lesson-08",
            description: "Site-to-Site VPN",
          },
          {
            label: "Ders 9: Point-to-Site VPN",
            href: "/education/lessons/azure/module-07/lesson-09",
            description: "Client-to-VNet connection",
          },
          {
            label: "Ders 10: ExpressRoute",
            href: "/education/lessons/azure/module-07/lesson-10",
            description: "Private connection to Azure",
          },
          {
            label: "Ders 11: Load Balancer",
            href: "/education/lessons/azure/module-07/lesson-11",
            description: "Traffic distribution",
          },
          {
            label: "Ders 12: Application Gateway",
            href: "/education/lessons/azure/module-07/lesson-12",
            description: "Layer 7 load balancing",
          },
          {
            label: "Ders 13: Network Watcher",
            href: "/education/lessons/azure/module-07/lesson-13",
            description: "Network monitoring ve diagnostics",
          },
          {
            label: "Ders 14: Network Best Practices",
            href: "/education/lessons/azure/module-07/lesson-14",
            description: "Design patterns ve security",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-07/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: Azure Active Directory",
        summary:
          "Azure AD ile identity ve access management, authentication, authorization ve single sign-on.",
        durationMinutes: 450,
        objectives: [
          "Azure AD'nin ne olduğunu anlamak",
          "User ve group yönetimi",
          "Application registration ve SSO",
          "Conditional Access policies",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure AD Nedir?",
            href: "/education/lessons/azure/module-08/lesson-01",
            description: "Identity and access management",
          },
          {
            label: "Ders 2: Azure AD Tenant",
            href: "/education/lessons/azure/module-08/lesson-02",
            description: "Directory yapısı",
          },
          {
            label: "Ders 3: User Management",
            href: "/education/lessons/azure/module-08/lesson-03",
            description: "User oluşturma ve yönetimi",
          },
          {
            label: "Ders 4: Group Management",
            href: "/education/lessons/azure/module-08/lesson-04",
            description: "Security ve distribution groups",
          },
          {
            label: "Ders 5: Application Registration",
            href: "/education/lessons/azure/module-08/lesson-05",
            description: "App registration ve configuration",
          },
          {
            label: "Ders 6: Single Sign-On (SSO)",
            href: "/education/lessons/azure/module-08/lesson-06",
            description: "SAML ve OAuth 2.0",
          },
          {
            label: "Ders 7: Multi-Factor Authentication (MFA)",
            href: "/education/lessons/azure/module-08/lesson-07",
            description: "Two-factor authentication",
          },
          {
            label: "Ders 8: Conditional Access",
            href: "/education/lessons/azure/module-08/lesson-08",
            description: "Policy-based access control",
          },
          {
            label: "Ders 9: Role-Based Access Control (RBAC)",
            href: "/education/lessons/azure/module-08/lesson-09",
            description: "Azure resource permissions",
          },
          {
            label: "Ders 10: Azure AD B2B",
            href: "/education/lessons/azure/module-08/lesson-10",
            description: "External user collaboration",
          },
          {
            label: "Ders 11: Azure AD B2C",
            href: "/education/lessons/azure/module-08/lesson-11",
            description: "Consumer identity management",
          },
          {
            label: "Ders 12: Identity Protection",
            href: "/education/lessons/azure/module-08/lesson-12",
            description: "Risk detection ve remediation",
          },
          {
            label: "Ders 13: Privileged Identity Management",
            href: "/education/lessons/azure/module-08/lesson-13",
            description: "Just-in-time access",
          },
          {
            label: "Ders 14: Azure AD Best Practices",
            href: "/education/lessons/azure/module-08/lesson-14",
            description: "Security ve governance",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-08/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: Azure DevOps",
        summary:
          "Azure DevOps ile CI/CD pipelines, source control, testing, release management ve project management.",
        durationMinutes: 450,
        objectives: [
          "Azure DevOps'un ne olduğunu anlamak",
          "Repositories ve source control",
          "Build ve release pipelines",
          "Test management ve reporting",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure DevOps Nedir?",
            href: "/education/lessons/azure/module-09/lesson-01",
            description: "DevOps platform genel bakış",
          },
          {
            label: "Ders 2: Azure Repos",
            href: "/education/lessons/azure/module-09/lesson-02",
            description: "Git repositories",
          },
          {
            label: "Ders 3: Azure Pipelines",
            href: "/education/lessons/azure/module-09/lesson-03",
            description: "CI/CD pipeline'ları",
          },
          {
            label: "Ders 4: Build Pipelines",
            href: "/education/lessons/azure/module-09/lesson-04",
            description: "YAML ve classic pipelines",
          },
          {
            label: "Ders 5: Release Pipelines",
            href: "/education/lessons/azure/module-09/lesson-05",
            description: "Multi-stage deployments",
          },
          {
            label: "Ders 6: Azure Artifacts",
            href: "/education/lessons/azure/module-09/lesson-06",
            description: "Package management",
          },
          {
            label: "Ders 7: Azure Test Plans",
            href: "/education/lessons/azure/module-09/lesson-07",
            description: "Test case management",
          },
          {
            label: "Ders 8: Azure Boards",
            href: "/education/lessons/azure/module-09/lesson-08",
            description: "Work item tracking",
          },
          {
            label: "Ders 9: Pipeline Variables",
            href: "/education/lessons/azure/module-09/lesson-09",
            description: "Configuration ve secrets",
          },
          {
            label: "Ders 10: Service Connections",
            href: "/education/lessons/azure/module-09/lesson-10",
            description: "Azure resource connections",
          },
          {
            label: "Ders 11: Deployment Groups",
            href: "/education/lessons/azure/module-09/lesson-11",
            description: "Target machine groups",
          },
          {
            label: "Ders 12: Pipeline Templates",
            href: "/education/lessons/azure/module-09/lesson-12",
            description: "Reusable pipeline components",
          },
          {
            label: "Ders 13: Azure DevOps Best Practices",
            href: "/education/lessons/azure/module-09/lesson-13",
            description: "CI/CD patterns ve strategies",
          },
          {
            label: "Ders 14: Integration with GitHub",
            href: "/education/lessons/azure/module-09/lesson-14",
            description: "External repository integration",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-09/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: ARM Templates",
        summary:
          "Azure Resource Manager Templates ile Infrastructure as Code, template authoring ve deployment automation.",
        durationMinutes: 450,
        objectives: [
          "ARM Templates'ın ne olduğunu anlamak",
          "Template syntax ve structure",
          "Parameters, variables ve outputs",
          "Template deployment stratejileri",
        ],
        relatedTopics: [
          {
            label: "Ders 1: ARM Templates Nedir?",
            href: "/education/lessons/azure/module-10/lesson-01",
            description: "Infrastructure as Code",
          },
          {
            label: "Ders 2: Template Structure",
            href: "/education/lessons/azure/module-10/lesson-02",
            description: "JSON schema ve format",
          },
          {
            label: "Ders 3: Parameters",
            href: "/education/lessons/azure/module-10/lesson-03",
            description: "Dynamic values ve validation",
          },
          {
            label: "Ders 4: Variables",
            href: "/education/lessons/azure/module-10/lesson-04",
            description: "Reusable values",
          },
          {
            label: "Ders 5: Resources",
            href: "/education/lessons/azure/module-10/lesson-05",
            description: "Resource definitions",
          },
          {
            label: "Ders 6: Outputs",
            href: "/education/lessons/azure/module-10/lesson-06",
            description: "Deployment results",
          },
          {
            label: "Ders 7: Template Functions",
            href: "/education/lessons/azure/module-10/lesson-07",
            description: "Built-in functions",
          },
          {
            label: "Ders 8: Linked Templates",
            href: "/education/lessons/azure/module-10/lesson-08",
            description: "Template composition",
          },
          {
            label: "Ders 9: Template Deployment",
            href: "/education/lessons/azure/module-10/lesson-09",
            description: "Portal, CLI, PowerShell",
          },
          {
            label: "Ders 10: Resource Dependencies",
            href: "/education/lessons/azure/module-10/lesson-10",
            description: "dependsOn ve implicit dependencies",
          },
          {
            label: "Ders 11: Template Validation",
            href: "/education/lessons/azure/module-10/lesson-11",
            description: "Pre-deployment validation",
          },
          {
            label: "Ders 12: Template Best Practices",
            href: "/education/lessons/azure/module-10/lesson-12",
            description: "Design patterns ve organization",
          },
          {
            label: "Ders 13: Bicep Language",
            href: "/education/lessons/azure/module-10/lesson-13",
            description: "Modern template language",
          },
          {
            label: "Ders 14: Template Gallery",
            href: "/education/lessons/azure/module-10/lesson-14",
            description: "Community templates",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-10/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Azure Security",
        summary:
          "Azure Security Center, Key Vault, encryption, threat protection ve security best practices.",
        durationMinutes: 450,
        objectives: [
          "Azure security modelini anlamak",
          "Security Center kullanımı",
          "Key Vault ile secret management",
          "Threat detection ve response",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Security Model",
            href: "/education/lessons/azure/module-11/lesson-01",
            description: "Shared responsibility model",
          },
          {
            label: "Ders 2: Azure Security Center",
            href: "/education/lessons/azure/module-11/lesson-02",
            description: "Unified security management",
          },
          {
            label: "Ders 3: Security Recommendations",
            href: "/education/lessons/azure/module-11/lesson-03",
            description: "Automated security assessments",
          },
          {
            label: "Ders 4: Azure Key Vault",
            href: "/education/lessons/azure/module-11/lesson-04",
            description: "Secrets, keys, certificates",
          },
          {
            label: "Ders 5: Key Vault Access Policies",
            href: "/education/lessons/azure/module-11/lesson-05",
            description: "RBAC ve access control",
          },
          {
            label: "Ders 6: Encryption at Rest",
            href: "/education/lessons/azure/module-11/lesson-06",
            description: "Data encryption",
          },
          {
            label: "Ders 7: Encryption in Transit",
            href: "/education/lessons/azure/module-11/lesson-07",
            description: "TLS/SSL configuration",
          },
          {
            label: "Ders 8: Azure Firewall",
            href: "/education/lessons/azure/module-11/lesson-08",
            description: "Network security",
          },
          {
            label: "Ders 9: DDoS Protection",
            href: "/education/lessons/azure/module-11/lesson-09",
            description: "Distributed denial of service",
          },
          {
            label: "Ders 10: Azure Sentinel",
            href: "/education/lessons/azure/module-11/lesson-10",
            description: "SIEM ve SOAR",
          },
          {
            label: "Ders 11: Threat Detection",
            href: "/education/lessons/azure/module-11/lesson-11",
            description: "Anomaly detection",
          },
          {
            label: "Ders 12: Compliance and Governance",
            href: "/education/lessons/azure/module-11/lesson-12",
            description: "Regulatory compliance",
          },
          {
            label: "Ders 13: Azure Policy",
            href: "/education/lessons/azure/module-11/lesson-13",
            description: "Governance ve compliance",
          },
          {
            label: "Ders 14: Security Best Practices",
            href: "/education/lessons/azure/module-11/lesson-14",
            description: "Defense in depth",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-11/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Azure Monitoring",
        summary:
          "Azure Monitor, Application Insights, Log Analytics, metrics, alerts ve diagnostics.",
        durationMinutes: 450,
        objectives: [
          "Azure monitoring ekosistemini anlamak",
          "Application Insights kullanımı",
          "Log Analytics queries",
          "Alerts ve action groups",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Monitor Nedir?",
            href: "/education/lessons/azure/module-12/lesson-01",
            description: "Unified monitoring platform",
          },
          {
            label: "Ders 2: Application Insights",
            href: "/education/lessons/azure/module-12/lesson-02",
            description: "Application performance monitoring",
          },
          {
            label: "Ders 3: Application Insights Setup",
            href: "/education/lessons/azure/module-12/lesson-03",
            description: "SDK integration",
          },
          {
            label: "Ders 4: Custom Telemetry",
            href: "/education/lessons/azure/module-12/lesson-04",
            description: "Custom events ve metrics",
          },
          {
            label: "Ders 5: Log Analytics Workspace",
            href: "/education/lessons/azure/module-12/lesson-05",
            description: "Centralized logging",
          },
          {
            label: "Ders 6: KQL Queries",
            href: "/education/lessons/azure/module-12/lesson-06",
            description: "Kusto Query Language",
          },
          {
            label: "Ders 7: Metrics Explorer",
            href: "/education/lessons/azure/module-12/lesson-07",
            description: "Performance metrics",
          },
          {
            label: "Ders 8: Alert Rules",
            href: "/education/lessons/azure/module-12/lesson-08",
            description: "Condition-based alerts",
          },
          {
            label: "Ders 9: Action Groups",
            href: "/education/lessons/azure/module-12/lesson-09",
            description: "Alert notifications",
          },
          {
            label: "Ders 10: Diagnostic Settings",
            href: "/education/lessons/azure/module-12/lesson-10",
            description: "Resource logging",
          },
          {
            label: "Ders 11: Workbooks",
            href: "/education/lessons/azure/module-12/lesson-11",
            description: "Custom dashboards",
          },
          {
            label: "Ders 12: Azure Monitor for VMs",
            href: "/education/lessons/azure/module-12/lesson-12",
            description: "VM performance monitoring",
          },
          {
            label: "Ders 13: Cost Management",
            href: "/education/lessons/azure/module-12/lesson-13",
            description: "Cost analysis ve optimization",
          },
          {
            label: "Ders 14: Monitoring Best Practices",
            href: "/education/lessons/azure/module-12/lesson-14",
            description: "Observability patterns",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-12/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Azure Cost Management",
        summary:
          "Azure Cost Management ile maliyet analizi, budgeting, cost optimization ve resource tagging.",
        durationMinutes: 450,
        objectives: [
          "Azure pricing modelini anlamak",
          "Cost Management kullanımı",
          "Budget ve alerts yapılandırması",
          "Cost optimization stratejileri",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Pricing Model",
            href: "/education/lessons/azure/module-13/lesson-01",
            description: "Pay-as-you-go, reservations",
          },
          {
            label: "Ders 2: Cost Management Overview",
            href: "/education/lessons/azure/module-13/lesson-02",
            description: "Cost analysis tools",
          },
          {
            label: "Ders 3: Cost Analysis",
            href: "/education/lessons/azure/module-13/lesson-03",
            description: "Spending breakdown",
          },
          {
            label: "Ders 4: Budgets",
            href: "/education/lessons/azure/module-13/lesson-04",
            description: "Budget creation ve tracking",
          },
          {
            label: "Ders 5: Cost Alerts",
            href: "/education/lessons/azure/module-13/lesson-05",
            description: "Spending notifications",
          },
          {
            label: "Ders 6: Resource Tagging",
            href: "/education/lessons/azure/module-13/lesson-06",
            description: "Cost allocation",
          },
          {
            label: "Ders 7: Azure Reservations",
            href: "/education/lessons/azure/module-13/lesson-07",
            description: "Pre-purchase discounts",
          },
          {
            label: "Ders 8: Azure Hybrid Benefit",
            href: "/education/lessons/azure/module-13/lesson-08",
            description: "License optimization",
          },
          {
            label: "Ders 9: Spot VMs",
            href: "/education/lessons/azure/module-13/lesson-09",
            description: "Cost-effective compute",
          },
          {
            label: "Ders 10: Right-Sizing",
            href: "/education/lessons/azure/module-13/lesson-10",
            description: "Resource optimization",
          },
          {
            label: "Ders 11: Cost Optimization Recommendations",
            href: "/education/lessons/azure/module-13/lesson-11",
            description: "Automated suggestions",
          },
          {
            label: "Ders 12: Cost Allocation",
            href: "/education/lessons/azure/module-13/lesson-12",
            description: "Department/project tracking",
          },
          {
            label: "Ders 13: Azure Cost Calculator",
            href: "/education/lessons/azure/module-13/lesson-13",
            description: "Estimation tools",
          },
          {
            label: "Ders 14: Cost Management Best Practices",
            href: "/education/lessons/azure/module-13/lesson-14",
            description: "Cost control strategies",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-13/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Azure Advanced Services",
        summary:
          "Azure Kubernetes Service (AKS), Azure Container Instances, Azure Logic Apps ve Azure Service Bus.",
        durationMinutes: 450,
        objectives: [
          "AKS ile container orchestration",
          "Container Instances kullanımı",
          "Logic Apps ile workflow automation",
          "Service Bus ile messaging",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Kubernetes Service (AKS)",
            href: "/education/lessons/azure/module-14/lesson-01",
            description: "Managed Kubernetes",
          },
          {
            label: "Ders 2: AKS Cluster Oluşturma",
            href: "/education/lessons/azure/module-14/lesson-02",
            description: "Cluster setup ve configuration",
          },
          {
            label: "Ders 3: Container Instances",
            href: "/education/lessons/azure/module-14/lesson-03",
            description: "Serverless containers",
          },
          {
            label: "Ders 4: Azure Logic Apps",
            href: "/education/lessons/azure/module-14/lesson-04",
            description: "Workflow automation",
          },
          {
            label: "Ders 5: Logic App Connectors",
            href: "/education/lessons/azure/module-14/lesson-05",
            description: "Integration connectors",
          },
          {
            label: "Ders 6: Azure Service Bus",
            href: "/education/lessons/azure/module-14/lesson-06",
            description: "Message queuing",
          },
          {
            label: "Ders 7: Service Bus Queues",
            href: "/education/lessons/azure/module-14/lesson-07",
            description: "Queue messaging",
          },
          {
            label: "Ders 8: Service Bus Topics",
            href: "/education/lessons/azure/module-14/lesson-08",
            description: "Pub/Sub messaging",
          },
          {
            label: "Ders 9: Event Grid",
            href: "/education/lessons/azure/module-14/lesson-09",
            description: "Event-driven architecture",
          },
          {
            label: "Ders 10: Azure API Management",
            href: "/education/lessons/azure/module-14/lesson-10",
            description: "API gateway",
          },
          {
            label: "Ders 11: Azure CDN",
            href: "/education/lessons/azure/module-14/lesson-11",
            description: "Content delivery network",
          },
          {
            label: "Ders 12: Azure Search",
            href: "/education/lessons/azure/module-14/lesson-12",
            description: "Search-as-a-service",
          },
          {
            label: "Ders 13: Azure Cognitive Services",
            href: "/education/lessons/azure/module-14/lesson-13",
            description: "AI/ML services",
          },
          {
            label: "Ders 14: Service Integration Patterns",
            href: "/education/lessons/azure/module-14/lesson-14",
            description: "Architecture patterns",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/azure/module-14/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Azure Best Practices ve Case Studies",
        summary:
          "Azure best practices, architecture patterns, real-world case studies ve production deployment stratejileri.",
        durationMinutes: 450,
        objectives: [
          "Azure best practices'i öğrenmek",
          "Architecture patterns uygulamak",
          "Real-world scenarios analiz etmek",
          "Production deployment planlaması",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Azure Well-Architected Framework",
            href: "/education/lessons/azure/module-15/lesson-01",
            description: "Architecture best practices",
          },
          {
            label: "Ders 2: Reliability Patterns",
            href: "/education/lessons/azure/module-15/lesson-02",
            description: "High availability design",
          },
          {
            label: "Ders 3: Security Patterns",
            href: "/education/lessons/azure/module-15/lesson-03",
            description: "Defense in depth",
          },
          {
            label: "Ders 4: Performance Optimization",
            href: "/education/lessons/azure/module-15/lesson-04",
            description: "Scalability patterns",
          },
          {
            label: "Ders 5: Cost Optimization Patterns",
            href: "/education/lessons/azure/module-15/lesson-05",
            description: "Cost-effective architectures",
          },
          {
            label: "Ders 6: Disaster Recovery",
            href: "/education/lessons/azure/module-15/lesson-06",
            description: "Business continuity planning",
          },
          {
            label: "Ders 7: Multi-Region Deployment",
            href: "/education/lessons/azure/module-15/lesson-07",
            description: "Global distribution",
          },
          {
            label: "Ders 8: Microservices Architecture",
            href: "/education/lessons/azure/module-15/lesson-08",
            description: "Container-based services",
          },
          {
            label: "Ders 9: Serverless Architecture",
            href: "/education/lessons/azure/module-15/lesson-09",
            description: "Function-based design",
          },
          {
            label: "Ders 10: Case Study: E-Commerce Platform",
            href: "/education/lessons/azure/module-15/lesson-10",
            description: "Real-world implementation",
          },
          {
            label: "Ders 11: Case Study: SaaS Application",
            href: "/education/lessons/azure/module-15/lesson-11",
            description: "Multi-tenant architecture",
          },
          {
            label: "Ders 12: Case Study: Data Analytics Platform",
            href: "/education/lessons/azure/module-15/lesson-12",
            description: "Big data processing",
          },
          {
            label: "Ders 13: Migration Strategies",
            href: "/education/lessons/azure/module-15/lesson-13",
            description: "On-premises to cloud",
          },
          {
            label: "Ders 14: Production Deployment Checklist",
            href: "/education/lessons/azure/module-15/lesson-14",
            description: "Go-live preparation",
          },
          {
            label: "Ders 15: Kurs Özeti ve Final Değerlendirme",
            href: "/education/lessons/azure/module-15/lesson-15",
            description: "Tüm kurs kapsamında öğrenilenlerin özeti",
          },
        ],
      },
    ],
  };

  return courseContent;
}

