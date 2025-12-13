/* eslint-disable no-console */
import { db } from "@/lib/db";
import { DEFAULT_TEMPLATES } from "@/app/api/cv/templates/defaultTemplates";
import { Prisma } from "@prisma/client";

const USER_EMAIL = "yusufislamyetkin@hotmail.com";

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    profilePhoto?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  hobbies: string[];
}

// 10 farklı CV içeriği
const cvDataList: Array<{ name: string; data: CVData; templateId: string }> = [
  // 1. Full Stack Developer
  {
    name: "Yusuf İslam Yetkin",
    templateId: "modern",
    data: {
      personalInfo: {
        name: "Yusuf İslam Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 123 4567",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufislamyetkin",
        website: "yusufyetkin.dev",
      },
      summary: "5+ yıllık deneyime sahip Full Stack Developer. React, Node.js, TypeScript ve PostgreSQL ile modern web uygulamaları geliştirme konusunda uzman. Mikroservis mimarileri ve cloud teknolojileri ile çalışma deneyimi.",
      experience: [
        {
          company: "TechCorp",
          position: "Senior Full Stack Developer",
          startDate: "2021-01",
          endDate: "2024-12",
          current: true,
          description: "React ve Node.js kullanarak ölçeklenebilir web uygulamaları geliştirdim. Ekip liderliği yaparak 3 kişilik geliştirici ekibini yönettim. CI/CD pipeline'ları kurarak deployment süreçlerini %40 hızlandırdım.",
        },
        {
          company: "StartupXYZ",
          position: "Full Stack Developer",
          startDate: "2019-06",
          endDate: "2020-12",
          current: false,
          description: "Vue.js ve Express.js ile e-ticaret platformu geliştirdim. RESTful API tasarımı ve PostgreSQL veritabanı optimizasyonu yaptım.",
        },
      ],
      education: [
        {
          school: "İstanbul Teknik Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startDate: "2015-09",
          endDate: "2019-06",
          gpa: "3.5/4.0",
        },
      ],
      skills: [
        "React",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "Docker",
        "AWS",
        "GraphQL",
        "Redis",
        "Jest",
        "Git",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "E-Commerce Platform",
          description: "Mikroservis mimarisi ile geliştirilmiş ölçeklenebilir e-ticaret platformu. 10,000+ günlük aktif kullanıcıya hizmet veriyor.",
          technologies: "React, Node.js, PostgreSQL, Redis, Docker, AWS",
          startDate: "2022-01",
          endDate: "2023-06",
          url: "https://github.com/yusufyetkin/ecommerce",
        },
        {
          name: "Real-time Chat Application",
          description: "WebSocket kullanarak gerçek zamanlı mesajlaşma uygulaması. Socket.io ve Redis pub/sub ile ölçeklenebilir yapı.",
          technologies: "React, Node.js, Socket.io, Redis, MongoDB",
          startDate: "2021-03",
          endDate: "2021-09",
        },
      ],
      achievements: [
        {
          title: "En İyi Proje Ödülü",
          description: "Şirket içi hackathon'da birinci oldum",
          date: "2023-05",
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023-03",
        },
        {
          name: "MongoDB Certified Developer",
          issuer: "MongoDB University",
          date: "2022-08",
        },
      ],
      references: [],
      hobbies: ["Açık kaynak projeler", "Teknoloji blog yazarlığı", "Futbol"],
    },
  },
  // 2. Frontend Developer
  {
    name: "Yusuf Y.",
    templateId: "classic",
    data: {
      personalInfo: {
        name: "Yusuf Y.",
        email: USER_EMAIL,
        phone: "+90 555 234 5678",
        address: "Ankara, Türkiye",
        linkedin: "linkedin.com/in/yusufy",
        website: "yusufy.dev",
      },
      summary: "Yaratıcı ve detay odaklı Frontend Developer. React, Vue.js ve modern CSS framework'leri ile kullanıcı dostu arayüzler tasarlama konusunda 4 yıllık deneyim. Responsive design ve performans optimizasyonu uzmanı.",
      experience: [
        {
          company: "DesignStudio",
          position: "Frontend Developer",
          startDate: "2020-03",
          endDate: "2024-12",
          current: true,
          description: "React ve TypeScript ile component library geliştirdim. Tailwind CSS kullanarak responsive tasarımlar oluşturdum. Web vitals skorlarını %30 iyileştirdim.",
        },
        {
          company: "WebAgency",
          position: "Junior Frontend Developer",
          startDate: "2018-07",
          endDate: "2020-02",
          current: false,
          description: "Vue.js ile client projeler geliştirdim. CSS preprocessor'lar ve build tool'ları kullandım.",
        },
      ],
      education: [
        {
          school: "Hacettepe Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.3/4.0",
        },
      ],
      skills: [
        "React",
        "Vue.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "SASS",
        "Webpack",
        "Vite",
        "Jest",
        "Cypress",
        "Figma",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Component Library",
          description: "Reusable React component library. Storybook ile dokümantasyon ve test coverage %90+.",
          technologies: "React, TypeScript, Storybook, Jest, Tailwind CSS",
          startDate: "2022-01",
          endDate: "2023-12",
          url: "https://github.com/yusufy/components",
        },
        {
          name: "Portfolio Website",
          description: "Modern ve performanslı portfolio websitesi. Lighthouse skoru 100/100.",
          technologies: "Next.js, TypeScript, Tailwind CSS, Framer Motion",
          startDate: "2021-06",
          endDate: "2021-08",
        },
      ],
      achievements: [
        {
          title: "Frontend Masters",
          description: "Şirket içi frontend yarışmasında birinci oldum",
          date: "2023-08",
        },
      ],
      certifications: [
        {
          name: "React Advanced Patterns",
          issuer: "Frontend Masters",
          date: "2023-01",
        },
      ],
      references: [],
      hobbies: ["UI/UX tasarımı", "Fotografçılık", "Yoga"],
    },
  },
  // 3. Backend Developer
  {
    name: "Yusuf İslam Yetkin",
    templateId: "professional",
    data: {
      personalInfo: {
        name: "Yusuf İslam Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 345 6789",
        address: "İzmir, Türkiye",
        linkedin: "linkedin.com/in/yusufislamyetkin-backend",
        website: "backend.yusufyetkin.dev",
      },
      summary: "Backend sistemleri ve API geliştirme konusunda 6 yıllık deneyime sahip Backend Developer. Node.js, Python ve mikroservis mimarileri ile yüksek performanslı sistemler tasarlama uzmanı. Database optimizasyonu ve sistem ölçeklendirme konularında derin bilgi.",
      experience: [
        {
          company: "CloudTech",
          position: "Senior Backend Developer",
          startDate: "2020-05",
          endDate: "2024-12",
          current: true,
          description: "Mikroservis mimarisi ile ölçeklenebilir backend sistemleri geliştirdim. PostgreSQL ve Redis ile database optimizasyonu yaptım. API response time'ları %50 azalttım.",
        },
        {
          company: "DataSystems",
          position: "Backend Developer",
          startDate: "2018-01",
          endDate: "2020-04",
          current: false,
          description: "RESTful ve GraphQL API'leri geliştirdim. Docker containerization ve CI/CD pipeline'ları kurulumu yaptım.",
        },
      ],
      education: [
        {
          school: "Orta Doğu Teknik Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startDate: "2013-09",
          endDate: "2017-06",
          gpa: "3.6/4.0",
        },
      ],
      skills: [
        "Node.js",
        "Python",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Docker",
        "Kubernetes",
        "GraphQL",
        "REST API",
        "Microservices",
        "RabbitMQ",
        "Apache Kafka",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Payment Gateway API",
          description: "Yüksek trafikli ödeme gateway API'si. 1M+ günlük transaction işleme kapasitesi. Redis caching ve database sharding ile optimize edildi.",
          technologies: "Node.js, PostgreSQL, Redis, Docker, Kubernetes",
          startDate: "2021-06",
          endDate: "2023-03",
        },
        {
          name: "Real-time Analytics System",
          description: "Apache Kafka ile real-time data processing sistemi. Event-driven architecture ile ölçeklenebilir yapı.",
          technologies: "Python, Apache Kafka, PostgreSQL, Redis, Docker",
          startDate: "2020-09",
          endDate: "2021-05",
        },
      ],
      achievements: [
        {
          title: "Backend Excellence Award",
          description: "Yılın backend geliştiricisi ödülü",
          date: "2023-12",
        },
      ],
      certifications: [
        {
          name: "Node.js Advanced Patterns",
          issuer: "Node.js Foundation",
          date: "2023-06",
        },
        {
          name: "PostgreSQL Performance",
          issuer: "PostgreSQL University",
          date: "2022-11",
        },
      ],
      references: [],
      hobbies: ["Açık kaynak katkıları", "Teknik yazı yazma", "Müzik"],
    },
  },
  // 4. DevOps Engineer
  {
    name: "Yusuf Yetkin",
    templateId: "tech",
    data: {
      personalInfo: {
        name: "Yusuf Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 456 7890",
        address: "Bursa, Türkiye",
        linkedin: "linkedin.com/in/yusufyetkin-devops",
        website: "devops.yusufyetkin.dev",
      },
      summary: "Cloud infrastructure ve CI/CD pipeline'ları konusunda uzman DevOps Engineer. AWS, Docker, Kubernetes ile container orchestration ve infrastructure as code deneyimi. 5+ yıllık sistem yönetimi ve otomasyon tecrübesi.",
      experience: [
        {
          company: "CloudFirst",
          position: "DevOps Engineer",
          startDate: "2021-02",
          endDate: "2024-12",
          current: true,
          description: "AWS infrastructure tasarımı ve yönetimi. Kubernetes cluster'ları kurulumu ve yönetimi. CI/CD pipeline'ları ile deployment süreçlerini otomatikleştirdim. Infrastructure maliyetlerini %35 azalttım.",
        },
        {
          company: "TechOps",
          position: "Junior DevOps Engineer",
          startDate: "2019-08",
          endDate: "2021-01",
          current: false,
          description: "Docker containerization ve Jenkins CI/CD kurulumu. Monitoring ve logging sistemleri kurulumu.",
        },
      ],
      education: [
        {
          school: "Boğaziçi Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.4/4.0",
        },
      ],
      skills: [
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Ansible",
        "Jenkins",
        "GitLab CI/CD",
        "Prometheus",
        "Grafana",
        "Linux",
        "Bash",
        "Python",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Multi-Cloud Infrastructure",
          description: "AWS ve Azure multi-cloud infrastructure setup. Terraform ile Infrastructure as Code. Auto-scaling ve load balancing konfigürasyonları.",
          technologies: "AWS, Azure, Terraform, Kubernetes, Docker",
          startDate: "2022-03",
          endDate: "2023-09",
        },
        {
          name: "CI/CD Pipeline Automation",
          description: "GitLab CI/CD ile tam otomatik deployment pipeline. Test, build, deploy ve rollback süreçleri otomatikleştirildi.",
          technologies: "GitLab CI/CD, Docker, Kubernetes, Bash",
          startDate: "2021-06",
          endDate: "2022-02",
        },
      ],
      achievements: [
        {
          title: "Infrastructure Excellence",
          description: "En iyi infrastructure tasarımı ödülü",
          date: "2023-10",
        },
      ],
      certifications: [
        {
          name: "AWS Certified DevOps Engineer",
          issuer: "Amazon Web Services",
          date: "2023-05",
        },
        {
          name: "Certified Kubernetes Administrator",
          issuer: "Cloud Native Computing Foundation",
          date: "2022-09",
        },
        {
          name: "Terraform Associate",
          issuer: "HashiCorp",
          date: "2022-03",
        },
      ],
      references: [],
      hobbies: ["Cloud teknolojileri", "Sistem mimarisi", "Doğa yürüyüşü"],
    },
  },
  // 5. Data Scientist
  {
    name: "Yusuf İ. Yetkin",
    templateId: "minimal",
    data: {
      personalInfo: {
        name: "Yusuf İ. Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 567 8901",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufiyetkin-datascience",
        website: "datascience.yusufyetkin.dev",
      },
      summary: "Machine Learning ve data analysis konusunda 4 yıllık deneyime sahip Data Scientist. Python, TensorFlow ve SQL ile predictive modeling ve data-driven insights üretme uzmanı. Büyük veri setleri ile çalışma ve model deployment deneyimi.",
      experience: [
        {
          company: "DataInsights",
          position: "Data Scientist",
          startDate: "2020-09",
          endDate: "2024-12",
          current: true,
          description: "Machine learning modelleri geliştirdim ve production'a deploy ettim. Customer churn prediction modeli ile %25 accuracy artışı sağladım. A/B testing ve statistical analysis yaptım.",
        },
        {
          company: "AnalyticsPro",
          position: "Junior Data Scientist",
          startDate: "2019-01",
          endDate: "2020-08",
          current: false,
          description: "Data cleaning ve exploratory data analysis. SQL queries ve data visualization. Regression ve classification modelleri geliştirdim.",
        },
      ],
      education: [
        {
          school: "İstanbul Üniversitesi",
          degree: "Yüksek Lisans",
          field: "Veri Bilimi",
          startDate: "2017-09",
          endDate: "2019-06",
          gpa: "3.7/4.0",
        },
        {
          school: "İstanbul Üniversitesi",
          degree: "Lisans",
          field: "İstatistik",
          startDate: "2013-09",
          endDate: "2017-06",
          gpa: "3.5/4.0",
        },
      ],
      skills: [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "SQL",
        "PostgreSQL",
        "Jupyter",
        "Tableau",
        "Apache Spark",
        "MLflow",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Customer Churn Prediction",
          description: "Deep learning modeli ile müşteri kaybı tahmini. %85 accuracy ile production'da kullanılıyor. Feature engineering ve hyperparameter tuning yapıldı.",
          technologies: "Python, TensorFlow, Scikit-learn, PostgreSQL",
          startDate: "2022-01",
          endDate: "2023-06",
        },
        {
          name: "Recommendation System",
          description: "Collaborative filtering ile ürün öneri sistemi. Real-time recommendations için Redis caching kullanıldı.",
          technologies: "Python, TensorFlow, Redis, PostgreSQL",
          startDate: "2021-03",
          endDate: "2021-12",
        },
      ],
      achievements: [
        {
          title: "Best ML Model",
          description: "Şirket içi ML yarışmasında birinci oldum",
          date: "2023-07",
        },
      ],
      certifications: [
        {
          name: "TensorFlow Developer Certificate",
          issuer: "Google",
          date: "2023-02",
        },
        {
          name: "Data Science Professional",
          issuer: "Coursera",
          date: "2022-06",
        },
      ],
      references: [],
      hobbies: ["Makine öğrenmesi araştırmaları", "Veri görselleştirme", "Satranç"],
    },
  },
  // 6. Product Manager
  {
    name: "Yusuf Yetkin",
    templateId: "executive",
    data: {
      personalInfo: {
        name: "Yusuf Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 678 9012",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufyetkin-pm",
        website: "pm.yusufyetkin.dev",
      },
      summary: "Product strategy ve roadmap planning konusunda 5 yıllık deneyime sahip Product Manager. Agile ve Scrum metodolojileri ile cross-functional team liderliği. User research, data analysis ve product metrics tracking deneyimi. SaaS ürünleri geliştirme ve launch tecrübesi.",
      experience: [
        {
          company: "ProductCo",
          position: "Senior Product Manager",
          startDate: "2021-04",
          endDate: "2024-12",
          current: true,
          description: "SaaS ürün roadmap'i oluşturdum ve yönettim. User research ve data analysis ile feature prioritization yaptım. Product metrics tracking ile %40 user engagement artışı sağladım. Cross-functional team liderliği yaptım.",
        },
        {
          company: "StartupHub",
          position: "Product Manager",
          startDate: "2019-06",
          endDate: "2021-03",
          current: false,
          description: "MVP geliştirme ve launch süreçlerini yönettim. User stories ve acceptance criteria yazdım. A/B testing ve product analytics yaptım.",
        },
      ],
      education: [
        {
          school: "Koç Üniversitesi",
          degree: "MBA",
          field: "İşletme",
          startDate: "2017-09",
          endDate: "2019-06",
          gpa: "3.6/4.0",
        },
        {
          school: "Boğaziçi Üniversitesi",
          degree: "Lisans",
          field: "Endüstri Mühendisliği",
          startDate: "2012-09",
          endDate: "2016-06",
          gpa: "3.4/4.0",
        },
      ],
      skills: [
        "Product Strategy",
        "Agile",
        "Scrum",
        "User Research",
        "Data Analysis",
        "Roadmap Planning",
        "A/B Testing",
        "Product Metrics",
        "Stakeholder Management",
        "Jira",
        "Figma",
        "SQL",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "SaaS Platform Launch",
          description: "Sıfırdan SaaS platformu launch. 0'dan 10,000+ kullanıcıya ulaştık. Product-market fit analizi ve iterative development.",
          technologies: "Product Management, User Research, Analytics",
          startDate: "2020-01",
          endDate: "2021-12",
        },
        {
          name: "Mobile App Redesign",
          description: "Kullanıcı feedback'i ile mobile app redesign. User journey mapping ve feature prioritization. %60 user retention artışı.",
          technologies: "Product Management, UX Research, Analytics",
          startDate: "2022-06",
          endDate: "2023-09",
        },
      ],
      achievements: [
        {
          title: "Product of the Year",
          description: "Yılın en iyi ürünü ödülü",
          date: "2023-11",
        },
      ],
      certifications: [
        {
          name: "Certified Scrum Product Owner",
          issuer: "Scrum Alliance",
          date: "2022-03",
        },
        {
          name: "Product Management Certificate",
          issuer: "Product School",
          date: "2021-08",
        },
      ],
      references: [],
      hobbies: ["Ürün inovasyonu", "Teknoloji trendleri", "Yoga"],
    },
  },
  // 7. UI/UX Designer
  {
    name: "Yusuf İslam Yetkin",
    templateId: "creative",
    data: {
      personalInfo: {
        name: "Yusuf İslam Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 789 0123",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufislamyetkin-design",
        website: "design.yusufyetkin.dev",
      },
      summary: "Kullanıcı odaklı tasarım ve creative problem solving konusunda 4 yıllık deneyime sahip UI/UX Designer. Figma, Adobe XD ve prototyping tool'ları ile modern ve erişilebilir arayüzler tasarlama uzmanı. User research, wireframing ve design system oluşturma deneyimi.",
      experience: [
        {
          company: "DesignStudio Pro",
          position: "Senior UI/UX Designer",
          startDate: "2021-01",
          endDate: "2024-12",
          current: true,
          description: "Design system oluşturdum ve yönettim. User research ve usability testing yaptım. Mobile ve web uygulamaları için UI/UX tasarımları yaptım. Design handoff ve developer collaboration.",
        },
        {
          company: "Creative Agency",
          position: "UI/UX Designer",
          startDate: "2019-03",
          endDate: "2020-12",
          current: false,
          description: "Client projeler için wireframe ve high-fidelity mockup'lar oluşturdum. User journey mapping ve persona oluşturma. Prototyping ve user testing.",
        },
      ],
      education: [
        {
          school: "Mimar Sinan Güzel Sanatlar Üniversitesi",
          degree: "Lisans",
          field: "Grafik Tasarım",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.5/4.0",
        },
      ],
      skills: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Prototyping",
        "User Research",
        "Wireframing",
        "Design Systems",
        "Usability Testing",
        "Adobe Creative Suite",
        "Illustration",
        "Typography",
        "Color Theory",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Design System",
          description: "Comprehensive design system oluşturma. Component library, style guide ve documentation. 50+ reusable component.",
          technologies: "Figma, Design Tokens, Storybook",
          startDate: "2022-03",
          endDate: "2023-06",
        },
        {
          name: "Mobile Banking App",
          description: "Kullanıcı dostu mobile banking app tasarımı. User research, wireframing ve prototyping. Accessibility ve usability odaklı tasarım.",
          technologies: "Figma, Adobe XD, Prototyping",
          startDate: "2021-06",
          endDate: "2022-02",
        },
      ],
      achievements: [
        {
          title: "Best UI Design",
          description: "Tasarım yarışmasında birinci oldum",
          date: "2023-09",
        },
      ],
      certifications: [
        {
          name: "UI/UX Design Specialization",
          issuer: "Coursera",
          date: "2022-05",
        },
      ],
      references: [],
      hobbies: ["Grafik tasarım", "İllüstrasyon", "Fotoğrafçılık"],
    },
  },
  // 8. Marketing Manager
  {
    name: "Yusuf Y.",
    templateId: "colorful",
    data: {
      personalInfo: {
        name: "Yusuf Y.",
        email: USER_EMAIL,
        phone: "+90 555 890 1234",
        address: "Ankara, Türkiye",
        linkedin: "linkedin.com/in/yusufy-marketing",
        website: "marketing.yusufyetkin.dev",
      },
      summary: "Digital marketing ve brand management konusunda 5 yıllık deneyime sahip Marketing Manager. SEO, SEM, social media marketing ve content strategy uzmanı. Campaign management ve ROI optimization deneyimi. Data-driven marketing approach.",
      experience: [
        {
          company: "MarketingPro",
          position: "Marketing Manager",
          startDate: "2020-07",
          endDate: "2024-12",
          current: true,
          description: "Digital marketing stratejisi oluşturdum ve yönettim. SEO ve SEM campaign'leri ile %60 organic traffic artışı sağladım. Social media marketing ve content strategy. Marketing budget yönetimi ve ROI tracking.",
        },
        {
          company: "Digital Agency",
          position: "Marketing Specialist",
          startDate: "2019-01",
          endDate: "2020-06",
          current: false,
          description: "Client projeler için marketing campaign'leri oluşturdum. Google Ads ve Facebook Ads yönetimi. Content creation ve social media management.",
        },
      ],
      education: [
        {
          school: "İstanbul Üniversitesi",
          degree: "Lisans",
          field: "İşletme",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.3/4.0",
        },
      ],
      skills: [
        "Digital Marketing",
        "SEO",
        "SEM",
        "Google Ads",
        "Facebook Ads",
        "Social Media Marketing",
        "Content Strategy",
        "Email Marketing",
        "Analytics",
        "Google Analytics",
        "HubSpot",
        "Marketing Automation",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "SEO Optimization Campaign",
          description: "Website SEO optimizasyonu. Keyword research ve on-page optimization. %150 organic traffic artışı.",
          technologies: "SEO, Google Analytics, Content Strategy",
          startDate: "2021-03",
          endDate: "2022-09",
        },
        {
          name: "Social Media Strategy",
          description: "Multi-platform social media strategy. Content calendar ve engagement optimization. 300% follower growth.",
          technologies: "Social Media, Content Marketing, Analytics",
          startDate: "2020-09",
          endDate: "2021-12",
        },
      ],
      achievements: [
        {
          title: "Marketing Excellence",
          description: "Yılın pazarlama kampanyası ödülü",
          date: "2023-08",
        },
      ],
      certifications: [
        {
          name: "Google Ads Certification",
          issuer: "Google",
          date: "2023-01",
        },
        {
          name: "HubSpot Content Marketing",
          issuer: "HubSpot",
          date: "2022-07",
        },
      ],
      references: [],
      hobbies: ["İçerik oluşturma", "Sosyal medya", "Okuma"],
    },
  },
  // 9. Finance Analyst
  {
    name: "Yusuf İslam Yetkin",
    templateId: "professional",
    data: {
      personalInfo: {
        name: "Yusuf İslam Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 901 2345",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufislamyetkin-finance",
        website: "finance.yusufyetkin.dev",
      },
      summary: "Financial analysis ve reporting konusunda 4 yıllık deneyime sahip Finance Analyst. Excel, SQL ve financial modeling uzmanı. Budget planning, variance analysis ve financial forecasting deneyimi. ERP sistemleri ve financial software kullanımı.",
      experience: [
        {
          company: "FinanceCorp",
          position: "Finance Analyst",
          startDate: "2020-09",
          endDate: "2024-12",
          current: true,
          description: "Monthly financial reporting ve variance analysis yaptım. Budget planning ve forecasting. Financial modeling ve data analysis. ERP sistemleri ile çalışma.",
        },
        {
          company: "Accounting Firm",
          position: "Junior Finance Analyst",
          startDate: "2019-06",
          endDate: "2020-08",
          current: false,
          description: "Financial data entry ve basic analysis. Excel ve accounting software kullanımı. Report preparation.",
        },
      ],
      education: [
        {
          school: "İstanbul Üniversitesi",
          degree: "Lisans",
          field: "İşletme",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.4/4.0",
        },
      ],
      skills: [
        "Financial Analysis",
        "Excel",
        "SQL",
        "Financial Modeling",
        "Budget Planning",
        "Variance Analysis",
        "Forecasting",
        "ERP Systems",
        "Power BI",
        "Tableau",
        "Accounting",
        "Financial Reporting",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Financial Dashboard",
          description: "Power BI ile financial dashboard oluşturma. Real-time financial metrics ve KPI tracking. Automated reporting.",
          technologies: "Power BI, SQL, Excel",
          startDate: "2022-01",
          endDate: "2023-06",
        },
        {
          name: "Budget Forecasting Model",
          description: "Advanced Excel model ile budget forecasting. Scenario analysis ve sensitivity analysis.",
          technologies: "Excel, Financial Modeling",
          startDate: "2021-03",
          endDate: "2021-12",
        },
      ],
      achievements: [
        {
          title: "Analyst of the Year",
          description: "Yılın finans analisti ödülü",
          date: "2023-12",
        },
      ],
      certifications: [
        {
          name: "Financial Modeling & Valuation",
          issuer: "CFI",
          date: "2023-04",
        },
        {
          name: "Excel Advanced",
          issuer: "Microsoft",
          date: "2022-09",
        },
      ],
      references: [],
      hobbies: ["Finansal analiz", "Yatırım", "Okuma"],
    },
  },
  // 10. HR Specialist
  {
    name: "Yusuf Yetkin",
    templateId: "classic",
    data: {
      personalInfo: {
        name: "Yusuf Yetkin",
        email: USER_EMAIL,
        phone: "+90 555 012 3456",
        address: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/yusufyetkin-hr",
        website: "hr.yusufyetkin.dev",
      },
      summary: "Recruitment ve talent management konusunda 5 yıllık deneyime sahip HR Specialist. End-to-end recruitment process, employee onboarding ve HRIS sistemleri uzmanı. Performance management ve employee relations deneyimi. Labor law ve HR compliance bilgisi.",
      experience: [
        {
          company: "HR Solutions",
          position: "HR Specialist",
          startDate: "2020-03",
          endDate: "2024-12",
          current: true,
          description: "Full-cycle recruitment process yönettim. 200+ pozisyon için candidate sourcing ve interviewing. Employee onboarding ve orientation programları. HRIS sistemleri yönetimi ve HR analytics.",
        },
        {
          company: "Talent Agency",
          position: "Recruitment Specialist",
          startDate: "2019-01",
          endDate: "2020-02",
          current: false,
          description: "IT ve tech pozisyonları için recruitment. Candidate screening ve interviewing. Job posting ve candidate sourcing.",
        },
      ],
      education: [
        {
          school: "Ankara Üniversitesi",
          degree: "Lisans",
          field: "İnsan Kaynakları Yönetimi",
          startDate: "2014-09",
          endDate: "2018-06",
          gpa: "3.5/4.0",
        },
      ],
      skills: [
        "Recruitment",
        "Talent Management",
        "HRIS",
        "Employee Onboarding",
        "Performance Management",
        "HR Analytics",
        "Interviewing",
        "Candidate Sourcing",
        "Labor Law",
        "HR Compliance",
        "LinkedIn Recruiter",
        "ATS Systems",
      ],
      languages: [
        { name: "Türkçe", level: "Ana Dil" },
        { name: "İngilizce", level: "İleri Seviye" },
      ],
      projects: [
        {
          name: "Recruitment Process Optimization",
          description: "Recruitment süreçlerini optimize ettim. Time-to-hire %40 azaldı. ATS sistemi implementasyonu ve process automation.",
          technologies: "ATS, HRIS, Process Optimization",
          startDate: "2021-06",
          endDate: "2022-12",
        },
        {
          name: "Employee Onboarding Program",
          description: "Comprehensive onboarding program oluşturma. New hire satisfaction %80'den %95'e çıktı.",
          technologies: "HRIS, Training, Documentation",
          startDate: "2020-09",
          endDate: "2021-06",
        },
      ],
      achievements: [
        {
          title: "HR Excellence Award",
          description: "En iyi HR uygulaması ödülü",
          date: "2023-07",
        },
      ],
      certifications: [
        {
          name: "SHRM Certified Professional",
          issuer: "SHRM",
          date: "2023-03",
        },
        {
          name: "HR Analytics Certificate",
          issuer: "HR Analytics Institute",
          date: "2022-08",
        },
      ],
      references: [],
      hobbies: ["İnsan kaynakları trendleri", "Networking", "Spor"],
    },
  },
];

async function ensureTemplates() {
  console.log("📋 Template'ler kontrol ediliyor...");
  
  for (const template of DEFAULT_TEMPLATES) {
    const existing = await db.cVTemplate.findUnique({
      where: { id: template.id },
    });

    if (!existing) {
      await db.cVTemplate.create({
        data: {
          id: template.id,
          name: template.name,
          preview: template.preview,
          structure: template.structure as Prisma.InputJsonValue,
        },
      });
      console.log(`✅ Template oluşturuldu: ${template.name}`);
    } else {
      console.log(`ℹ️  Template zaten mevcut: ${template.name}`);
    }
  }
}

async function findOrCreateUser() {
  console.log(`🔍 Kullanıcı aranıyor: ${USER_EMAIL}`);
  
  let user = await db.user.findUnique({
    where: { email: USER_EMAIL },
  });

  if (!user) {
    console.log("👤 Kullanıcı bulunamadı, oluşturuluyor...");
    user = await db.user.create({
      data: {
        email: USER_EMAIL,
        name: "Yusuf İslam Yetkin",
        role: "candidate",
        password: null, // OAuth users için null
      },
    });
    console.log(`✅ Kullanıcı oluşturuldu: ${user.id}`);
  } else {
    console.log(`✅ Kullanıcı bulundu: ${user.id}`);
  }

  return user;
}

async function createCVs(userId: string) {
  console.log(`\n📝 ${cvDataList.length} adet CV oluşturuluyor...\n`);

  const createdCVs = [];

  for (let i = 0; i < cvDataList.length; i++) {
    const cvInfo = cvDataList[i];
    
    try {
      // Template'in var olduğundan emin ol
      const template = await db.cVTemplate.findUnique({
        where: { id: cvInfo.templateId },
      });

      if (!template) {
        console.error(`❌ Template bulunamadı: ${cvInfo.templateId}`);
        continue;
      }

      const cv = await db.cV.create({
        data: {
          userId: userId,
          templateId: cvInfo.templateId,
          data: cvInfo.data as any,
        },
        include: {
          template: true,
        },
      });

      createdCVs.push(cv);
      console.log(`✅ CV ${i + 1}/${cvDataList.length} oluşturuldu: ${cvInfo.name} (${cvInfo.templateId})`);
    } catch (error: any) {
      console.error(`❌ CV ${i + 1} oluşturulurken hata:`, error.message);
    }
  }

  return createdCVs;
}

async function main() {
  try {
    console.log("🚀 CV oluşturma script'i başlatılıyor...\n");

    // 1. Template'leri kontrol et/oluştur
    await ensureTemplates();
    console.log("");

    // 2. Kullanıcıyı bul/oluştur
    const user = await findOrCreateUser();
    console.log("");

    // 3. CV'leri oluştur
    const createdCVs = await createCVs(user.id);

    console.log(`\n✨ Tamamlandı! ${createdCVs.length} adet CV başarıyla oluşturuldu.\n`);
    
    console.log("📊 Özet:");
    createdCVs.forEach((cv, index) => {
      const cvData = cv.data as any;
      console.log(`  ${index + 1}. ${cvData.personalInfo?.name || "CV"} - ${cv.template.name}`);
    });

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

main();
