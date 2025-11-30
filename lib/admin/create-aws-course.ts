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
 * Create complete AWS course structure with predefined content
 */
export async function createAWSCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting AWS course creation...");

  const courseContent: CourseContent = {
    overview: {
      description:
        "Amazon Web Services (AWS), dünyanın en kapsamlı ve yaygın olarak kullanılan bulut platformudur. Bu kapsamlı kurs ile AWS'in temellerinden ileri seviye konularına kadar her şeyi öğreneceksiniz. Bulut altyapısı, compute, storage, database, networking ve güvenlik konularında uzmanlaşacaksınız.",
      estimatedDurationMinutes: 788, // 15 modül × 15 ders × 3.5 dakika (ortalama)
    },
    learningObjectives: [
      "AWS'in temel kavramlarını ve mimarisini anlamak",
      "EC2, S3, RDS gibi temel AWS servislerini kullanmak",
      "IAM ile güvenlik ve erişim yönetimi yapmak",
      "VPC ile network yapılandırması yapmak",
      "Lambda ile serverless uygulamalar geliştirmek",
      "CloudFormation ile Infrastructure as Code uygulamak",
      "CI/CD pipeline'ları kurmak ve monitoring yapmak",
    ],
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "Ağ (networking) temel kavramlarına aşinalık",
      "Linux/Unix komut satırı bilgisi (opsiyonel)",
      "Temel programlama bilgisi (opsiyonel)",
    ],
    modules: [
      {
        id: "module-01",
        title: "Module 1: AWS Tanımı ve Temelleri",
        summary:
          "AWS'in ne olduğu, tarihçesi, avantajları, bulut computing kavramları ve AWS global infrastructure.",
        durationMinutes: 450,
        objectives: [
          "AWS'in ne olduğunu ve neden kullanıldığını anlamak",
          "Bulut computing kavramını öğrenmek",
          "AWS'in avantajlarını ve kullanım alanlarını keşfetmek",
          "AWS global infrastructure'ı anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: AWS Nedir?",
            href: "/education/lessons/aws/module-01/lesson-01",
            description: "AWS'in temel tanımı ve genel bakış",
          },
          {
            label: "Ders 2: Bulut Computing Nedir?",
            href: "/education/lessons/aws/module-01/lesson-02",
            description: "Cloud computing kavramı",
          },
          {
            label: "Ders 3: AWS'in Tarihçesi",
            href: "/education/lessons/aws/module-01/lesson-03",
            description: "AWS'in ortaya çıkışı ve gelişimi",
          },
          {
            label: "Ders 4: IaaS, PaaS, SaaS",
            href: "/education/lessons/aws/module-01/lesson-04",
            description: "Bulut servis modelleri",
          },
          {
            label: "Ders 5: AWS'in Avantajları",
            href: "/education/lessons/aws/module-01/lesson-05",
            description: "Ölçeklenebilirlik, maliyet, güvenlik",
          },
          {
            label: "Ders 6: AWS Kullanım Alanları",
            href: "/education/lessons/aws/module-01/lesson-06",
            description: "Web hosting, big data, AI/ML",
          },
          {
            label: "Ders 7: AWS Global Infrastructure",
            href: "/education/lessons/aws/module-01/lesson-07",
            description: "Regions, Availability Zones, Edge Locations",
          },
          {
            label: "Ders 8: AWS Regions",
            href: "/education/lessons/aws/module-01/lesson-08",
            description: "Bölge seçimi ve özellikleri",
          },
          {
            label: "Ders 9: Availability Zones",
            href: "/education/lessons/aws/module-01/lesson-09",
            description: "Yüksek erişilebilirlik",
          },
          {
            label: "Ders 10: AWS Pricing Model",
            href: "/education/lessons/aws/module-01/lesson-10",
            description: "Fiyatlandırma modeli",
          },
          {
            label: "Ders 11: AWS Free Tier",
            href: "/education/lessons/aws/module-01/lesson-11",
            description: "Ücretsiz kullanım seviyesi",
          },
          {
            label: "Ders 12: AWS Support Plans",
            href: "/education/lessons/aws/module-01/lesson-12",
            description: "Destek planları",
          },
          {
            label: "Ders 13: AWS Marketplace",
            href: "/education/lessons/aws/module-01/lesson-13",
            description: "AWS pazar yeri",
          },
          {
            label: "Ders 14: AWS Ekosistemi",
            href: "/education/lessons/aws/module-01/lesson-14",
            description: "AWS topluluğu ve araçlar",
          },
          {
            label: "Ders 15: Modül Özeti ve Değerlendirme",
            href: "/education/lessons/aws/module-01/lesson-15",
            description: "Modül kapsamında öğrenilenlerin özeti",
          },
        ],
      },
      {
        id: "module-02",
        title: "Module 2: AWS Hesap Yönetimi ve IAM",
        summary:
          "AWS hesap oluşturma, IAM (Identity and Access Management), kullanıcı yönetimi, roller, politikalar ve güvenlik.",
        durationMinutes: 450,
        objectives: [
          "AWS hesap yönetimini öğrenmek",
          "IAM kavramını anlamak",
          "Kullanıcı ve rol yönetimi yapmayı öğrenmek",
          "Politika yönetimi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: AWS Hesap Oluşturma",
            href: "/education/lessons/aws/module-02/lesson-01",
            description: "AWS hesabı açma",
          },
          {
            label: "Ders 2: AWS Console",
            href: "/education/lessons/aws/module-02/lesson-02",
            description: "AWS Management Console",
          },
          {
            label: "Ders 3: IAM Nedir?",
            href: "/education/lessons/aws/module-02/lesson-03",
            description: "IAM kavramı",
          },
          {
            label: "Ders 4: IAM Users",
            href: "/education/lessons/aws/module-02/lesson-04",
            description: "Kullanıcı oluşturma ve yönetimi",
          },
          {
            label: "Ders 5: IAM Groups",
            href: "/education/lessons/aws/module-02/lesson-05",
            description: "Grup yönetimi",
          },
          {
            label: "Ders 6: IAM Roles",
            href: "/education/lessons/aws/module-02/lesson-06",
            description: "Rol oluşturma ve yönetimi",
          },
          {
            label: "Ders 7: IAM Policies",
            href: "/education/lessons/aws/module-02/lesson-07",
            description: "Politika oluşturma",
          },
          {
            label: "Ders 8: Policy Documents",
            href: "/education/lessons/aws/module-02/lesson-08",
            description: "JSON politika dokümanları",
          },
          {
            label: "Ders 9: MFA (Multi-Factor Authentication)",
            href: "/education/lessons/aws/module-02/lesson-09",
            description: "Çok faktörlü kimlik doğrulama",
          },
          {
            label: "Ders 10: Access Keys",
            href: "/education/lessons/aws/module-02/lesson-10",
            description: "API erişim anahtarları",
          },
          {
            label: "Ders 11: IAM Best Practices",
            href: "/education/lessons/aws/module-02/lesson-11",
            description: "IAM kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 12: Cross-Account Access",
            href: "/education/lessons/aws/module-02/lesson-12",
            description: "Hesaplar arası erişim",
          },
          {
            label: "Ders 13: IAM Identity Center",
            href: "/education/lessons/aws/module-02/lesson-13",
            description: "Merkezi kimlik yönetimi",
          },
          {
            label: "Ders 14: Security Best Practices",
            href: "/education/lessons/aws/module-02/lesson-14",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-02/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-03",
        title: "Module 3: EC2 (Elastic Compute Cloud)",
        summary:
          "EC2 instances, instance types, AMIs, security groups, key pairs, EBS volumes, load balancing ve auto scaling.",
        durationMinutes: 450,
        objectives: [
          "EC2 kavramını anlamak",
          "EC2 instance oluşturmayı öğrenmek",
          "Security groups yapılandırmasını öğrenmek",
          "EBS volumes kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: EC2 Nedir?",
            href: "/education/lessons/aws/module-03/lesson-01",
            description: "EC2 kavramı",
          },
          {
            label: "Ders 2: EC2 Instance Types",
            href: "/education/lessons/aws/module-03/lesson-02",
            description: "Instance türleri",
          },
          {
            label: "Ders 3: AMI (Amazon Machine Image)",
            href: "/education/lessons/aws/module-03/lesson-03",
            description: "AMI kavramı ve kullanımı",
          },
          {
            label: "Ders 4: EC2 Instance Launch",
            href: "/education/lessons/aws/module-03/lesson-04",
            description: "Instance başlatma",
          },
          {
            label: "Ders 5: Key Pairs",
            href: "/education/lessons/aws/module-03/lesson-05",
            description: "SSH anahtar çiftleri",
          },
          {
            label: "Ders 6: Security Groups",
            href: "/education/lessons/aws/module-03/lesson-06",
            description: "Güvenlik grupları",
          },
          {
            label: "Ders 7: Network ACLs",
            href: "/education/lessons/aws/module-03/lesson-07",
            description: "Ağ erişim kontrol listeleri",
          },
          {
            label: "Ders 8: EBS Volumes",
            href: "/education/lessons/aws/module-03/lesson-08",
            description: "Elastic Block Store",
          },
          {
            label: "Ders 9: EBS Volume Types",
            href: "/education/lessons/aws/module-03/lesson-09",
            description: "EBS volume türleri",
          },
          {
            label: "Ders 10: Instance Storage",
            href: "/education/lessons/aws/module-03/lesson-10",
            description: "Instance store volumes",
          },
          {
            label: "Ders 11: Elastic IP Addresses",
            href: "/education/lessons/aws/module-03/lesson-11",
            description: "Statik IP adresleri",
          },
          {
            label: "Ders 12: EC2 Instance Lifecycle",
            href: "/education/lessons/aws/module-03/lesson-12",
            description: "Instance yaşam döngüsü",
          },
          {
            label: "Ders 13: EC2 Best Practices",
            href: "/education/lessons/aws/module-03/lesson-13",
            description: "EC2 kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Cost Optimization",
            href: "/education/lessons/aws/module-03/lesson-14",
            description: "Maliyet optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-03/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-04",
        title: "Module 4: S3 (Simple Storage Service)",
        summary:
          "S3 buckets, objects, storage classes, versioning, lifecycle policies, encryption, access control ve S3 best practices.",
        durationMinutes: 450,
        objectives: [
          "S3 kavramını anlamak",
          "S3 bucket oluşturmayı öğrenmek",
          "Storage classes kullanmayı öğrenmek",
          "S3 güvenlik yapılandırmasını öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: S3 Nedir?",
            href: "/education/lessons/aws/module-04/lesson-01",
            description: "S3 kavramı",
          },
          {
            label: "Ders 2: S3 Buckets",
            href: "/education/lessons/aws/module-04/lesson-02",
            description: "Bucket oluşturma",
          },
          {
            label: "Ders 3: S3 Objects",
            href: "/education/lessons/aws/module-04/lesson-03",
            description: "Object yükleme ve yönetimi",
          },
          {
            label: "Ders 4: S3 Storage Classes",
            href: "/education/lessons/aws/module-04/lesson-04",
            description: "Depolama sınıfları",
          },
          {
            label: "Ders 5: S3 Standard",
            href: "/education/lessons/aws/module-04/lesson-05",
            description: "Standart depolama",
          },
          {
            label: "Ders 6: S3 Intelligent-Tiering",
            href: "/education/lessons/aws/module-04/lesson-06",
            description: "Akıllı katmanlama",
          },
          {
            label: "Ders 7: S3 Glacier",
            href: "/education/lessons/aws/module-04/lesson-07",
            description: "Arşiv depolama",
          },
          {
            label: "Ders 8: S3 Versioning",
            href: "/education/lessons/aws/module-04/lesson-08",
            description: "Versiyonlama",
          },
          {
            label: "Ders 9: S3 Lifecycle Policies",
            href: "/education/lessons/aws/module-04/lesson-09",
            description: "Yaşam döngüsü politikaları",
          },
          {
            label: "Ders 10: S3 Encryption",
            href: "/education/lessons/aws/module-04/lesson-10",
            description: "Şifreleme",
          },
          {
            label: "Ders 11: S3 Access Control",
            href: "/education/lessons/aws/module-04/lesson-11",
            description: "Erişim kontrolü",
          },
          {
            label: "Ders 12: S3 CORS",
            href: "/education/lessons/aws/module-04/lesson-12",
            description: "Cross-Origin Resource Sharing",
          },
          {
            label: "Ders 13: S3 Transfer Acceleration",
            href: "/education/lessons/aws/module-04/lesson-13",
            description: "Transfer hızlandırma",
          },
          {
            label: "Ders 14: S3 Best Practices",
            href: "/education/lessons/aws/module-04/lesson-14",
            description: "S3 kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-04/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-05",
        title: "Module 5: RDS (Relational Database Service)",
        summary:
          "RDS database instances, database engines, multi-AZ deployments, read replicas, backups, snapshots ve RDS best practices.",
        durationMinutes: 450,
        objectives: [
          "RDS kavramını anlamak",
          "RDS instance oluşturmayı öğrenmek",
          "Database engine seçimini öğrenmek",
          "Backup ve recovery yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: RDS Nedir?",
            href: "/education/lessons/aws/module-05/lesson-01",
            description: "RDS kavramı",
          },
          {
            label: "Ders 2: RDS Database Engines",
            href: "/education/lessons/aws/module-05/lesson-02",
            description: "MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
          },
          {
            label: "Ders 3: RDS Instance Creation",
            href: "/education/lessons/aws/module-05/lesson-03",
            description: "RDS instance oluşturma",
          },
          {
            label: "Ders 4: RDS Instance Classes",
            href: "/education/lessons/aws/module-05/lesson-04",
            description: "Instance sınıfları",
          },
          {
            label: "Ders 5: RDS Storage",
            href: "/education/lessons/aws/module-05/lesson-05",
            description: "Depolama yapılandırması",
          },
          {
            label: "Ders 6: Multi-AZ Deployments",
            href: "/education/lessons/aws/module-05/lesson-06",
            description: "Çoklu bölge dağıtımı",
          },
          {
            label: "Ders 7: Read Replicas",
            href: "/education/lessons/aws/module-05/lesson-07",
            description: "Okuma replikaları",
          },
          {
            label: "Ders 8: RDS Backups",
            href: "/education/lessons/aws/module-05/lesson-08",
            description: "Otomatik yedekleme",
          },
          {
            label: "Ders 9: RDS Snapshots",
            href: "/education/lessons/aws/module-05/lesson-09",
            description: "Manuel snapshot'lar",
          },
          {
            label: "Ders 10: RDS Security",
            href: "/education/lessons/aws/module-05/lesson-10",
            description: "Güvenlik yapılandırması",
          },
          {
            label: "Ders 11: RDS Monitoring",
            href: "/education/lessons/aws/module-05/lesson-11",
            description: "Performans izleme",
          },
          {
            label: "Ders 12: RDS Maintenance",
            href: "/education/lessons/aws/module-05/lesson-12",
            description: "Bakım pencereleri",
          },
          {
            label: "Ders 13: RDS Best Practices",
            href: "/education/lessons/aws/module-05/lesson-13",
            description: "RDS kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: RDS vs Self-Managed",
            href: "/education/lessons/aws/module-05/lesson-14",
            description: "RDS ve self-managed karşılaştırması",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-05/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-06",
        title: "Module 6: Lambda (Serverless Computing)",
        summary:
          "AWS Lambda, serverless computing, function creation, triggers, event sources, Lambda layers, environment variables ve Lambda best practices.",
        durationMinutes: 450,
        objectives: [
          "Lambda kavramını anlamak",
          "Lambda function oluşturmayı öğrenmek",
          "Event sources kullanmayı öğrenmek",
          "Serverless architecture tasarlamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Lambda Nedir?",
            href: "/education/lessons/aws/module-06/lesson-01",
            description: "Lambda kavramı",
          },
          {
            label: "Ders 2: Serverless Computing",
            href: "/education/lessons/aws/module-06/lesson-02",
            description: "Serverless yaklaşımı",
          },
          {
            label: "Ders 3: Lambda Function Creation",
            href: "/education/lessons/aws/module-06/lesson-03",
            description: "Fonksiyon oluşturma",
          },
          {
            label: "Ders 4: Lambda Runtime",
            href: "/education/lessons/aws/module-06/lesson-04",
            description: "Runtime ortamları",
          },
          {
            label: "Ders 5: Lambda Handlers",
            href: "/education/lessons/aws/module-06/lesson-05",
            description: "Handler fonksiyonları",
          },
          {
            label: "Ders 6: Event Sources",
            href: "/education/lessons/aws/module-06/lesson-06",
            description: "Olay kaynakları",
          },
          {
            label: "Ders 7: API Gateway Integration",
            href: "/education/lessons/aws/module-06/lesson-07",
            description: "API Gateway entegrasyonu",
          },
          {
            label: "Ders 8: S3 Triggers",
            href: "/education/lessons/aws/module-06/lesson-08",
            description: "S3 event trigger'ları",
          },
          {
            label: "Ders 9: Lambda Layers",
            href: "/education/lessons/aws/module-06/lesson-09",
            description: "Lambda katmanları",
          },
          {
            label: "Ders 10: Environment Variables",
            href: "/education/lessons/aws/module-06/lesson-10",
            description: "Ortam değişkenleri",
          },
          {
            label: "Ders 11: Lambda Permissions",
            href: "/education/lessons/aws/module-06/lesson-11",
            description: "İzin yönetimi",
          },
          {
            label: "Ders 12: Lambda Monitoring",
            href: "/education/lessons/aws/module-06/lesson-12",
            description: "CloudWatch entegrasyonu",
          },
          {
            label: "Ders 13: Lambda Best Practices",
            href: "/education/lessons/aws/module-06/lesson-13",
            description: "Lambda kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Cost Optimization",
            href: "/education/lessons/aws/module-06/lesson-14",
            description: "Maliyet optimizasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-06/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-07",
        title: "Module 7: VPC (Virtual Private Cloud)",
        summary:
          "VPC kavramı, subnets, route tables, internet gateways, NAT gateways, security groups, NACLs ve VPC peering.",
        durationMinutes: 450,
        objectives: [
          "VPC kavramını anlamak",
          "VPC oluşturmayı öğrenmek",
          "Subnet yapılandırmasını öğrenmek",
          "Network routing yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: VPC Nedir?",
            href: "/education/lessons/aws/module-07/lesson-01",
            description: "VPC kavramı",
          },
          {
            label: "Ders 2: VPC Creation",
            href: "/education/lessons/aws/module-07/lesson-02",
            description: "VPC oluşturma",
          },
          {
            label: "Ders 3: CIDR Blocks",
            href: "/education/lessons/aws/module-07/lesson-03",
            description: "IP adres aralıkları",
          },
          {
            label: "Ders 4: Subnets",
            href: "/education/lessons/aws/module-07/lesson-04",
            description: "Alt ağlar",
          },
          {
            label: "Ders 5: Public vs Private Subnets",
            href: "/education/lessons/aws/module-07/lesson-05",
            description: "Public ve private subnet'ler",
          },
          {
            label: "Ders 6: Internet Gateway",
            href: "/education/lessons/aws/module-07/lesson-06",
            description: "İnternet ağ geçidi",
          },
          {
            label: "Ders 7: Route Tables",
            href: "/education/lessons/aws/module-07/lesson-07",
            description: "Yönlendirme tabloları",
          },
          {
            label: "Ders 8: NAT Gateway",
            href: "/education/lessons/aws/module-07/lesson-08",
            description: "Network Address Translation",
          },
          {
            label: "Ders 9: Security Groups",
            href: "/education/lessons/aws/module-07/lesson-09",
            description: "Güvenlik grupları",
          },
          {
            label: "Ders 10: Network ACLs",
            href: "/education/lessons/aws/module-07/lesson-10",
            description: "Ağ erişim kontrol listeleri",
          },
          {
            label: "Ders 11: VPC Peering",
            href: "/education/lessons/aws/module-07/lesson-11",
            description: "VPC eşleştirme",
          },
          {
            label: "Ders 12: VPN Connections",
            href: "/education/lessons/aws/module-07/lesson-12",
            description: "VPN bağlantıları",
          },
          {
            label: "Ders 13: VPC Best Practices",
            href: "/education/lessons/aws/module-07/lesson-13",
            description: "VPC kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Network Security",
            href: "/education/lessons/aws/module-07/lesson-14",
            description: "Ağ güvenliği",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-07/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-08",
        title: "Module 8: CloudFormation (Infrastructure as Code)",
        summary:
          "CloudFormation kavramı, templates, stacks, parameters, outputs, resources, nested stacks ve CloudFormation best practices.",
        durationMinutes: 450,
        objectives: [
          "Infrastructure as Code kavramını anlamak",
          "CloudFormation templates yazmayı öğrenmek",
          "Stack yönetimi yapmayı öğrenmek",
          "CloudFormation best practices uygulamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Infrastructure as Code",
            href: "/education/lessons/aws/module-08/lesson-01",
            description: "IaC kavramı",
          },
          {
            label: "Ders 2: CloudFormation Nedir?",
            href: "/education/lessons/aws/module-08/lesson-02",
            description: "CloudFormation kavramı",
          },
          {
            label: "Ders 3: CloudFormation Templates",
            href: "/education/lessons/aws/module-08/lesson-03",
            description: "Template yapısı",
          },
          {
            label: "Ders 4: YAML vs JSON",
            href: "/education/lessons/aws/module-08/lesson-04",
            description: "Template formatları",
          },
          {
            label: "Ders 5: Template Sections",
            href: "/education/lessons/aws/module-08/lesson-05",
            description: "Template bölümleri",
          },
          {
            label: "Ders 6: Parameters",
            href: "/education/lessons/aws/module-08/lesson-06",
            description: "Parametreler",
          },
          {
            label: "Ders 7: Resources",
            href: "/education/lessons/aws/module-08/lesson-07",
            description: "Kaynak tanımları",
          },
          {
            label: "Ders 8: Outputs",
            href: "/education/lessons/aws/module-08/lesson-08",
            description: "Çıktılar",
          },
          {
            label: "Ders 9: Intrinsic Functions",
            href: "/education/lessons/aws/module-08/lesson-09",
            description: "Yerleşik fonksiyonlar",
          },
          {
            label: "Ders 10: Stack Creation",
            href: "/education/lessons/aws/module-08/lesson-10",
            description: "Stack oluşturma",
          },
          {
            label: "Ders 11: Stack Updates",
            href: "/education/lessons/aws/module-08/lesson-11",
            description: "Stack güncelleme",
          },
          {
            label: "Ders 12: Nested Stacks",
            href: "/education/lessons/aws/module-08/lesson-12",
            description: "İç içe stack'ler",
          },
          {
            label: "Ders 13: Change Sets",
            href: "/education/lessons/aws/module-08/lesson-13",
            description: "Değişiklik setleri",
          },
          {
            label: "Ders 14: CloudFormation Best Practices",
            href: "/education/lessons/aws/module-08/lesson-14",
            description: "CloudFormation kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-08/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-09",
        title: "Module 9: CI/CD (CodePipeline, CodeBuild, CodeDeploy)",
        summary:
          "AWS CI/CD servisleri, CodePipeline, CodeBuild, CodeDeploy, GitHub integration, build specifications ve deployment strategies.",
        durationMinutes: 450,
        objectives: [
          "CI/CD kavramını anlamak",
          "CodePipeline kurmayı öğrenmek",
          "CodeBuild yapılandırmasını öğrenmek",
          "CodeDeploy kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: CI/CD Temelleri",
            href: "/education/lessons/aws/module-09/lesson-01",
            description: "Sürekli entegrasyon ve dağıtım",
          },
          {
            label: "Ders 2: CodePipeline Nedir?",
            href: "/education/lessons/aws/module-09/lesson-02",
            description: "CodePipeline kavramı",
          },
          {
            label: "Ders 3: Pipeline Creation",
            href: "/education/lessons/aws/module-09/lesson-03",
            description: "Pipeline oluşturma",
          },
          {
            label: "Ders 4: Pipeline Stages",
            href: "/education/lessons/aws/module-09/lesson-04",
            description: "Pipeline aşamaları",
          },
          {
            label: "Ders 5: Source Actions",
            href: "/education/lessons/aws/module-09/lesson-05",
            description: "Kaynak aksiyonları",
          },
          {
            label: "Ders 6: Build Actions",
            href: "/education/lessons/aws/module-09/lesson-06",
            description: "Derleme aksiyonları",
          },
          {
            label: "Ders 7: Deploy Actions",
            href: "/education/lessons/aws/module-09/lesson-07",
            description: "Dağıtım aksiyonları",
          },
          {
            label: "Ders 8: CodeBuild",
            href: "/education/lessons/aws/module-09/lesson-08",
            description: "CodeBuild kavramı",
          },
          {
            label: "Ders 9: Buildspec Files",
            href: "/education/lessons/aws/module-09/lesson-09",
            description: "Build yapılandırma dosyaları",
          },
          {
            label: "Ders 10: CodeDeploy",
            href: "/education/lessons/aws/module-09/lesson-10",
            description: "CodeDeploy kavramı",
          },
          {
            label: "Ders 11: Deployment Strategies",
            href: "/education/lessons/aws/module-09/lesson-11",
            description: "Dağıtım stratejileri",
          },
          {
            label: "Ders 12: GitHub Integration",
            href: "/education/lessons/aws/module-09/lesson-12",
            description: "GitHub entegrasyonu",
          },
          {
            label: "Ders 13: CI/CD Best Practices",
            href: "/education/lessons/aws/module-09/lesson-13",
            description: "CI/CD kullanım en iyi uygulamaları",
          },
          {
            label: "Ders 14: Pipeline Monitoring",
            href: "/education/lessons/aws/module-09/lesson-14",
            description: "Pipeline izleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-09/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-10",
        title: "Module 10: Monitoring ve Logging (CloudWatch)",
        summary:
          "CloudWatch metrics, alarms, logs, dashboards, CloudWatch Insights, X-Ray ve monitoring best practices.",
        durationMinutes: 450,
        objectives: [
          "CloudWatch kavramını anlamak",
          "Metrics ve alarms kullanmayı öğrenmek",
          "Logs yönetimini öğrenmek",
          "Monitoring stratejileri uygulamayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: CloudWatch Nedir?",
            href: "/education/lessons/aws/module-10/lesson-01",
            description: "CloudWatch kavramı",
          },
          {
            label: "Ders 2: CloudWatch Metrics",
            href: "/education/lessons/aws/module-10/lesson-02",
            description: "Metrikler",
          },
          {
            label: "Ders 3: Custom Metrics",
            href: "/education/lessons/aws/module-10/lesson-03",
            description: "Özel metrikler",
          },
          {
            label: "Ders 4: CloudWatch Alarms",
            href: "/education/lessons/aws/module-10/lesson-04",
            description: "Alarm oluşturma",
          },
          {
            label: "Ders 5: Alarm Actions",
            href: "/education/lessons/aws/module-10/lesson-05",
            description: "Alarm aksiyonları",
          },
          {
            label: "Ders 6: CloudWatch Logs",
            href: "/education/lessons/aws/module-10/lesson-06",
            description: "Log grupları ve akışları",
          },
          {
            label: "Ders 7: Log Groups",
            href: "/education/lessons/aws/module-10/lesson-07",
            description: "Log grup yönetimi",
          },
          {
            label: "Ders 8: Log Streams",
            href: "/education/lessons/aws/module-10/lesson-08",
            description: "Log akışları",
          },
          {
            label: "Ders 9: CloudWatch Dashboards",
            href: "/education/lessons/aws/module-10/lesson-09",
            description: "Gösterge panelleri",
          },
          {
            label: "Ders 10: CloudWatch Insights",
            href: "/education/lessons/aws/module-10/lesson-10",
            description: "Log sorgulama",
          },
          {
            label: "Ders 11: CloudWatch Events",
            href: "/education/lessons/aws/module-10/lesson-11",
            description: "EventBridge",
          },
          {
            label: "Ders 12: X-Ray",
            href: "/education/lessons/aws/module-10/lesson-12",
            description: "Dağıtık izleme",
          },
          {
            label: "Ders 13: Monitoring Best Practices",
            href: "/education/lessons/aws/module-10/lesson-13",
            description: "İzleme en iyi uygulamaları",
          },
          {
            label: "Ders 14: Cost Monitoring",
            href: "/education/lessons/aws/module-10/lesson-14",
            description: "Maliyet izleme",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-10/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-11",
        title: "Module 11: Security ve Compliance",
        summary:
          "AWS güvenlik, security groups, IAM best practices, encryption, AWS Shield, WAF, GuardDuty ve compliance frameworks.",
        durationMinutes: 450,
        objectives: [
          "AWS güvenlik kavramını anlamak",
          "Security best practices uygulamayı öğrenmek",
          "Encryption kullanmayı öğrenmek",
          "Compliance frameworks anlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: AWS Security Model",
            href: "/education/lessons/aws/module-11/lesson-01",
            description: "AWS güvenlik modeli",
          },
          {
            label: "Ders 2: Shared Responsibility Model",
            href: "/education/lessons/aws/module-11/lesson-02",
            description: "Paylaşılan sorumluluk modeli",
          },
          {
            label: "Ders 3: Security Groups Best Practices",
            href: "/education/lessons/aws/module-11/lesson-03",
            description: "Güvenlik grubu en iyi uygulamaları",
          },
          {
            label: "Ders 4: Encryption at Rest",
            href: "/education/lessons/aws/module-11/lesson-04",
            description: "Beklemede şifreleme",
          },
          {
            label: "Ders 5: Encryption in Transit",
            href: "/education/lessons/aws/module-11/lesson-05",
            description: "Aktarımda şifreleme",
          },
          {
            label: "Ders 6: AWS KMS",
            href: "/education/lessons/aws/module-11/lesson-06",
            description: "Key Management Service",
          },
          {
            label: "Ders 7: AWS Secrets Manager",
            href: "/education/lessons/aws/module-11/lesson-07",
            description: "Gizli bilgi yönetimi",
          },
          {
            label: "Ders 8: AWS Shield",
            href: "/education/lessons/aws/module-11/lesson-08",
            description: "DDoS koruması",
          },
          {
            label: "Ders 9: AWS WAF",
            href: "/education/lessons/aws/module-11/lesson-09",
            description: "Web Application Firewall",
          },
          {
            label: "Ders 10: GuardDuty",
            href: "/education/lessons/aws/module-11/lesson-10",
            description: "Tehdit tespiti",
          },
          {
            label: "Ders 11: Security Hub",
            href: "/education/lessons/aws/module-11/lesson-11",
            description: "Güvenlik merkezi",
          },
          {
            label: "Ders 12: Compliance Frameworks",
            href: "/education/lessons/aws/module-11/lesson-12",
            description: "Uyumluluk çerçeveleri",
          },
          {
            label: "Ders 13: Security Best Practices",
            href: "/education/lessons/aws/module-11/lesson-13",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 14: Security Auditing",
            href: "/education/lessons/aws/module-11/lesson-14",
            description: "Güvenlik denetimi",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-11/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-12",
        title: "Module 12: Cost Management",
        summary:
          "AWS cost management, pricing models, cost optimization, AWS Cost Explorer, budgets, reserved instances ve cost best practices.",
        durationMinutes: 450,
        objectives: [
          "AWS pricing modelini anlamak",
          "Cost optimization tekniklerini öğrenmek",
          "Cost Explorer kullanmayı öğrenmek",
          "Budget yönetimi yapmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: AWS Pricing Model",
            href: "/education/lessons/aws/module-12/lesson-01",
            description: "Fiyatlandırma modeli",
          },
          {
            label: "Ders 2: Pay-as-You-Go",
            href: "/education/lessons/aws/module-12/lesson-02",
            description: "Kullandıkça öde",
          },
          {
            label: "Ders 3: Reserved Instances",
            href: "/education/lessons/aws/module-12/lesson-03",
            description: "Rezerve edilmiş instance'lar",
          },
          {
            label: "Ders 4: Savings Plans",
            href: "/education/lessons/aws/module-12/lesson-04",
            description: "Tasarruf planları",
          },
          {
            label: "Ders 5: Spot Instances",
            href: "/education/lessons/aws/module-12/lesson-05",
            description: "Spot instance'lar",
          },
          {
            label: "Ders 6: AWS Cost Explorer",
            href: "/education/lessons/aws/module-12/lesson-06",
            description: "Maliyet analiz aracı",
          },
          {
            label: "Ders 7: Cost Allocation Tags",
            href: "/education/lessons/aws/module-12/lesson-07",
            description: "Maliyet tahsis etiketleri",
          },
          {
            label: "Ders 8: AWS Budgets",
            href: "/education/lessons/aws/module-12/lesson-08",
            description: "Bütçe yönetimi",
          },
          {
            label: "Ders 9: Cost Anomaly Detection",
            href: "/education/lessons/aws/module-12/lesson-09",
            description: "Maliyet anomali tespiti",
          },
          {
            label: "Ders 10: Right Sizing",
            href: "/education/lessons/aws/module-12/lesson-10",
            description: "Doğru boyutlandırma",
          },
          {
            label: "Ders 11: Resource Optimization",
            href: "/education/lessons/aws/module-12/lesson-11",
            description: "Kaynak optimizasyonu",
          },
          {
            label: "Ders 12: Cost Optimization Strategies",
            href: "/education/lessons/aws/module-12/lesson-12",
            description: "Maliyet optimizasyon stratejileri",
          },
          {
            label: "Ders 13: Cost Best Practices",
            href: "/education/lessons/aws/module-12/lesson-13",
            description: "Maliyet yönetimi en iyi uygulamaları",
          },
          {
            label: "Ders 14: Cost Reporting",
            href: "/education/lessons/aws/module-12/lesson-14",
            description: "Maliyet raporlama",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-12/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-13",
        title: "Module 13: Advanced Services",
        summary:
          "AWS gelişmiş servisler, API Gateway, SQS, SNS, DynamoDB, ElastiCache, Route 53, CloudFront ve advanced features.",
        durationMinutes: 450,
        objectives: [
          "Gelişmiş AWS servislerini öğrenmek",
          "API Gateway kullanmayı öğrenmek",
          "Message queuing kullanmayı öğrenmek",
          "Advanced features kullanmayı öğrenmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: API Gateway",
            href: "/education/lessons/aws/module-13/lesson-01",
            description: "API Gateway kavramı",
          },
          {
            label: "Ders 2: API Gateway Features",
            href: "/education/lessons/aws/module-13/lesson-02",
            description: "API Gateway özellikleri",
          },
          {
            label: "Ders 3: SQS (Simple Queue Service)",
            href: "/education/lessons/aws/module-13/lesson-03",
            description: "Kuyruk servisi",
          },
          {
            label: "Ders 4: SNS (Simple Notification Service)",
            href: "/education/lessons/aws/module-13/lesson-04",
            description: "Bildirim servisi",
          },
          {
            label: "Ders 5: DynamoDB",
            href: "/education/lessons/aws/module-13/lesson-05",
            description: "NoSQL veritabanı",
          },
          {
            label: "Ders 6: ElastiCache",
            href: "/education/lessons/aws/module-13/lesson-06",
            description: "Cache servisi",
          },
          {
            label: "Ders 7: Route 53",
            href: "/education/lessons/aws/module-13/lesson-07",
            description: "DNS servisi",
          },
          {
            label: "Ders 8: CloudFront",
            href: "/education/lessons/aws/module-13/lesson-08",
            description: "CDN servisi",
          },
          {
            label: "Ders 9: ECS (Elastic Container Service)",
            href: "/education/lessons/aws/module-13/lesson-09",
            description: "Container servisi",
          },
          {
            label: "Ders 10: EKS (Elastic Kubernetes Service)",
            href: "/education/lessons/aws/module-13/lesson-10",
            description: "Kubernetes servisi",
          },
          {
            label: "Ders 11: Step Functions",
            href: "/education/lessons/aws/module-13/lesson-11",
            description: "Workflow servisi",
          },
          {
            label: "Ders 12: EventBridge",
            href: "/education/lessons/aws/module-13/lesson-12",
            description: "Event-driven architecture",
          },
          {
            label: "Ders 13: Advanced Features",
            href: "/education/lessons/aws/module-13/lesson-13",
            description: "Gelişmiş özellikler",
          },
          {
            label: "Ders 14: Service Integration",
            href: "/education/lessons/aws/module-13/lesson-14",
            description: "Servis entegrasyonu",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-13/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-14",
        title: "Module 14: Best Practices",
        summary:
          "AWS geliştirmede en iyi uygulamalar, well-architected framework, güvenlik, performans, maliyet optimizasyonu ve operasyonel mükemmellik.",
        durationMinutes: 450,
        objectives: [
          "Well-Architected Framework öğrenmek",
          "Güvenlik best practices uygulamak",
          "Performans optimizasyon tekniklerini öğrenmek",
          "Operasyonel mükemmellik sağlamak",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Well-Architected Framework",
            href: "/education/lessons/aws/module-14/lesson-01",
            description: "İyi mimari çerçevesi",
          },
          {
            label: "Ders 2: Operational Excellence",
            href: "/education/lessons/aws/module-14/lesson-02",
            description: "Operasyonel mükemmellik",
          },
          {
            label: "Ders 3: Security Pillar",
            href: "/education/lessons/aws/module-14/lesson-03",
            description: "Güvenlik sütunu",
          },
          {
            label: "Ders 4: Reliability Pillar",
            href: "/education/lessons/aws/module-14/lesson-04",
            description: "Güvenilirlik sütunu",
          },
          {
            label: "Ders 5: Performance Efficiency",
            href: "/education/lessons/aws/module-14/lesson-05",
            description: "Performans verimliliği",
          },
          {
            label: "Ders 6: Cost Optimization",
            href: "/education/lessons/aws/module-14/lesson-06",
            description: "Maliyet optimizasyonu",
          },
          {
            label: "Ders 7: Security Best Practices",
            href: "/education/lessons/aws/module-14/lesson-07",
            description: "Güvenlik en iyi uygulamaları",
          },
          {
            label: "Ders 8: Performance Best Practices",
            href: "/education/lessons/aws/module-14/lesson-08",
            description: "Performans en iyi uygulamaları",
          },
          {
            label: "Ders 9: Cost Best Practices",
            href: "/education/lessons/aws/module-14/lesson-09",
            description: "Maliyet en iyi uygulamaları",
          },
          {
            label: "Ders 10: Monitoring Best Practices",
            href: "/education/lessons/aws/module-14/lesson-10",
            description: "İzleme en iyi uygulamaları",
          },
          {
            label: "Ders 11: Disaster Recovery",
            href: "/education/lessons/aws/module-14/lesson-11",
            description: "Felaket kurtarma",
          },
          {
            label: "Ders 12: High Availability",
            href: "/education/lessons/aws/module-14/lesson-12",
            description: "Yüksek erişilebilirlik",
          },
          {
            label: "Ders 13: Scalability Patterns",
            href: "/education/lessons/aws/module-14/lesson-13",
            description: "Ölçeklenebilirlik desenleri",
          },
          {
            label: "Ders 14: Architecture Patterns",
            href: "/education/lessons/aws/module-14/lesson-14",
            description: "Mimari desenler",
          },
          {
            label: "Ders 15: Modül Özeti ve Uygulama",
            href: "/education/lessons/aws/module-14/lesson-15",
            description: "Öğrenilenlerin pratik uygulaması",
          },
        ],
      },
      {
        id: "module-15",
        title: "Module 15: Capstone Project",
        summary:
          "Kapsamlı bir AWS projesi geliştirerek tüm öğrenilenleri uygulama, gerçek dünya senaryosu ve portfolio projesi.",
        durationMinutes: 450,
        objectives: [
          "Tüm öğrenilenleri bir projede uygulamak",
          "Gerçek dünya senaryosu geliştirmek",
          "Portfolio projesi oluşturmak",
          "End-to-end AWS uygulaması geliştirmek",
        ],
        relatedTopics: [
          {
            label: "Ders 1: Proje Planlama",
            href: "/education/lessons/aws/module-15/lesson-01",
            description: "Proje gereksinimleri ve planlama",
          },
          {
            label: "Ders 2: Mimari Tasarım",
            href: "/education/lessons/aws/module-15/lesson-02",
            description: "AWS mimarisi tasarımı",
          },
          {
            label: "Ders 3: VPC Setup",
            href: "/education/lessons/aws/module-15/lesson-03",
            description: "VPC yapılandırması",
          },
          {
            label: "Ders 4: EC2 Implementation",
            href: "/education/lessons/aws/module-15/lesson-04",
            description: "EC2 instance'ları",
          },
          {
            label: "Ders 5: RDS Setup",
            href: "/education/lessons/aws/module-15/lesson-05",
            description: "RDS veritabanı",
          },
          {
            label: "Ders 6: S3 Implementation",
            href: "/education/lessons/aws/module-15/lesson-06",
            description: "S3 depolama",
          },
          {
            label: "Ders 7: Lambda Functions",
            href: "/education/lessons/aws/module-15/lesson-07",
            description: "Serverless fonksiyonlar",
          },
          {
            label: "Ders 8: API Gateway",
            href: "/education/lessons/aws/module-15/lesson-08",
            description: "API Gateway yapılandırması",
          },
          {
            label: "Ders 9: Security Implementation",
            href: "/education/lessons/aws/module-15/lesson-09",
            description: "Güvenlik implementasyonu",
          },
          {
            label: "Ders 10: Monitoring Setup",
            href: "/education/lessons/aws/module-15/lesson-10",
            description: "CloudWatch yapılandırması",
          },
          {
            label: "Ders 11: CI/CD Pipeline",
            href: "/education/lessons/aws/module-15/lesson-11",
            description: "CodePipeline kurulumu",
          },
          {
            label: "Ders 12: Cost Optimization",
            href: "/education/lessons/aws/module-15/lesson-12",
            description: "Maliyet optimizasyonu",
          },
          {
            label: "Ders 13: Documentation",
            href: "/education/lessons/aws/module-15/lesson-13",
            description: "Proje dokümantasyonu",
          },
          {
            label: "Ders 14: Project Review",
            href: "/education/lessons/aws/module-15/lesson-14",
            description: "Proje incelemesi",
          },
          {
            label: "Ders 15: Project Presentation",
            href: "/education/lessons/aws/module-15/lesson-15",
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

