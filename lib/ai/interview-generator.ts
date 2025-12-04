import { z } from "zod";
import { createChatCompletion, ensureAIEnabled, isAIEnabled } from "./client";
import { db } from "@/lib/db";

// CV Data interface
interface CVData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    profilePhoto?: string;
  };
  summary?: string;
  experience?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    current?: boolean;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    name?: string;
    level?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
  }>;
  references?: Array<{
    name?: string;
    position?: string;
    company?: string;
    email?: string;
    phone?: string;
  }>;
  hobbies?: string[];
}

// Question schemas
const interviewQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["technical", "behavioral", "case", "live_coding", "bug_fix"]),
  question: z.string(),
  prompt: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  resources: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  starterCode: z.record(z.string()).optional(),
  buggyCode: z.string().optional(),
  timeLimitMinutes: z.number().optional(),
  supportingText: z.string().optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
});

const interviewQuestionsSchema = z.object({
  stage1_introduction: z.array(interviewQuestionSchema),
  stage2_experience: z.array(interviewQuestionSchema),
  stage3_technical: z.object({
    testQuestions: z.array(interviewQuestionSchema).min(5),
    liveCoding: interviewQuestionSchema.optional(),
    bugFix: interviewQuestionSchema.optional(),
    realWorldScenarios: z.array(interviewQuestionSchema).min(2),
  }),
});

type InterviewQuestions = z.infer<typeof interviewQuestionsSchema>;

/**
 * Pozisyon tipi
 */
type PositionType =
  | "developer"
  | "devops"
  | "test_engineer"
  | "system_admin"
  | "security_engineer"
  | "data_engineer"
  | "cloud_engineer"
  | "network_engineer"
  | "other";

/**
 * CV'den pozisyon tipini tespit eder
 */
function detectPositionType(cvData: CVData): PositionType {
  const allText = [
    cvData.summary || "",
    ...(cvData.experience || []).map((e) => `${e.position || ""} ${e.description || ""}`),
    ...(cvData.projects || []).map((p) => `${p.name || ""} ${p.description || ""} ${p.technologies || ""}`),
    ...(cvData.skills || []),
  ]
    .join(" ")
    .toLowerCase();

  // DevOps keywords
  if (
    allText.includes("devops") ||
    allText.includes("ci/cd") ||
    allText.includes("docker") ||
    allText.includes("kubernetes") ||
    allText.includes("terraform") ||
    allText.includes("ansible") ||
    allText.includes("jenkins") ||
    allText.includes("gitlab ci") ||
    allText.includes("github actions")
  ) {
    return "devops";
  }

  // Test Engineer keywords
  if (
    allText.includes("test engineer") ||
    allText.includes("qa engineer") ||
    allText.includes("quality assurance") ||
    allText.includes("test automation") ||
    allText.includes("selenium") ||
    allText.includes("cypress") ||
    allText.includes("junit") ||
    allText.includes("testng")
  ) {
    return "test_engineer";
  }

  // Security Engineer keywords
  if (
    allText.includes("security engineer") ||
    allText.includes("cybersecurity") ||
    allText.includes("penetration testing") ||
    allText.includes("vulnerability") ||
    allText.includes("owasp") ||
    allText.includes("security audit")
  ) {
    return "security_engineer";
  }

  // Data Engineer keywords
  if (
    allText.includes("data engineer") ||
    allText.includes("data scientist") ||
    allText.includes("etl") ||
    allText.includes("data pipeline") ||
    allText.includes("spark") ||
    allText.includes("hadoop") ||
    allText.includes("data warehouse")
  ) {
    return "data_engineer";
  }

  // Cloud Engineer keywords
  if (
    allText.includes("cloud engineer") ||
    allText.includes("aws") ||
    allText.includes("azure") ||
    allText.includes("gcp") ||
    allText.includes("google cloud") ||
    allText.includes("cloud architect")
  ) {
    return "cloud_engineer";
  }

  // System Admin keywords
  if (
    allText.includes("system administrator") ||
    allText.includes("sysadmin") ||
    allText.includes("network administrator") ||
    allText.includes("it administrator") ||
    allText.includes("server management")
  ) {
    return "system_admin";
  }

  // Network Engineer keywords
  if (
    allText.includes("network engineer") ||
    allText.includes("ccna") ||
    allText.includes("ccnp") ||
    allText.includes("routing") ||
    allText.includes("switching")
  ) {
    return "network_engineer";
  }

  // Default: Developer
  return "developer";
}

/**
 * CV'den teknolojileri ve seviyeyi çıkarır
 */
export function extractCVInfo(cvData: CVData): {
  technologies: string[];
  level: "beginner" | "intermediate" | "advanced";
  yearsOfExperience: number;
  position: string;
  englishLevel: string;
  positionType: PositionType;
} {
  const technologies: string[] = [];
  const skills = cvData.skills || [];
  const projects = cvData.projects || [];
  const experience = cvData.experience || [];

  // Skills'den teknolojileri çıkar
  skills.forEach((skill) => {
    if (skill && typeof skill === "string") {
      technologies.push(skill);
    }
  });

  // Projects'den teknolojileri çıkar
  projects.forEach((project) => {
    if (project.technologies && typeof project.technologies === "string") {
      const techs = project.technologies.split(/[,;]/).map((t) => t.trim());
      technologies.push(...techs);
    }
  });

  // Experience descriptions'den teknolojileri çıkar
  experience.forEach((exp) => {
    if (exp.description && typeof exp.description === "string") {
      // Basit teknoloji isimleri çıkarma (örnek: .NET, React, etc.)
      const techKeywords = [
        ".NET",
        "C#",
        "ASP.NET",
        "Entity Framework",
        "React",
        "Angular",
        "Vue",
        "Node.js",
        "Python",
        "Java",
        "Spring",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "SQL",
        "MongoDB",
        "Redis",
        "Microservices",
        "REST API",
        "GraphQL",
      ];
      techKeywords.forEach((keyword) => {
        if (exp.description?.toLowerCase().includes(keyword.toLowerCase())) {
          if (!technologies.includes(keyword)) {
            technologies.push(keyword);
          }
        }
      });
    }
  });

  // Seviye belirleme (pozisyon ve deneyim yıllarına göre)
  const position = experience[0]?.position || cvData.personalInfo?.name || "";
  const positionLower = position.toLowerCase();
  let level: "beginner" | "intermediate" | "advanced" = "intermediate";

  if (
    positionLower.includes("senior") ||
    positionLower.includes("lead") ||
    positionLower.includes("architect") ||
    positionLower.includes("principal")
  ) {
    level = "advanced";
  } else if (
    positionLower.includes("junior") ||
    positionLower.includes("intern") ||
    positionLower.includes("trainee")
  ) {
    level = "beginner";
  }

  // Deneyim yıllarını hesapla
  let yearsOfExperience = 0;
  if (experience.length > 0) {
    experience.forEach((exp) => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
        const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        yearsOfExperience += Math.max(0, years);
      }
    });
  }

  // Deneyim yıllarına göre seviye güncelle
  if (yearsOfExperience >= 5 && level !== "advanced") {
    level = "advanced";
  } else if (yearsOfExperience < 2 && level !== "beginner") {
    level = "beginner";
  }

  // İngilizce seviyesi
  const englishLevel =
    cvData.languages?.find((lang) => lang.name?.toLowerCase().includes("english"))?.level ||
    "Not specified";

  const positionType = detectPositionType(cvData);

  return {
    technologies: [...new Set(technologies)], // Duplicate'leri kaldır
    level,
    yearsOfExperience: Math.round(yearsOfExperience * 10) / 10,
    position: position || "Developer",
    englishLevel: englishLevel.toString(),
    positionType,
  };
}

/**
 * CV'yi analiz edip mülakat soruları oluşturur
 */
export async function generateInterviewFromCV(cvId: string): Promise<InterviewQuestions> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin.");
  }

  // CV'yi veritabanından al
  const cv = await db.cV.findUnique({
    where: { id: cvId },
  });

  if (!cv) {
    throw new Error("CV bulunamadı");
  }

  const cvData = cv.data as CVData;
  const cvInfo = extractCVInfo(cvData);

  // Pozisyon tipi etiketleri
  const positionTypeLabels: Record<PositionType, string> = {
    developer: "Yazılım Geliştirici",
    devops: "DevOps Engineer",
    test_engineer: "Test Engineer / QA Engineer",
    system_admin: "System Administrator",
    security_engineer: "Security Engineer",
    data_engineer: "Data Engineer / Data Scientist",
    cloud_engineer: "Cloud Engineer",
    network_engineer: "Network Engineer",
    other: "Teknoloji Uzmanı",
  };

  // CV özeti oluştur - TÜM bölümler dahil
  const cvSummary = `
CV ÖZETİ:
- İsim: ${cvData.personalInfo?.name || "Belirtilmemiş"}
- Email: ${cvData.personalInfo?.email || "Belirtilmemiş"}
- LinkedIn: ${cvData.personalInfo?.linkedin || "Belirtilmemiş"}
- Website: ${cvData.personalInfo?.website || "Belirtilmemiş"}
- Tespit Edilen Pozisyon Tipi: ${positionTypeLabels[cvInfo.positionType]}
- Mevcut/En Son Pozisyon: ${cvInfo.position}
- Deneyim Yılları: ${cvInfo.yearsOfExperience} yıl
- Seviye: ${cvInfo.level}
- Teknolojiler/Beceriler: ${cvInfo.technologies.join(", ") || "Belirtilmemiş"}

ÖZET:
${cvData.summary || "Belirtilmemiş"}

KİŞİSEL BİLGİLER:
- Adres: ${cvData.personalInfo?.address || "Belirtilmemiş"}
- Telefon: ${cvData.personalInfo?.phone || "Belirtilmemiş"}

EĞİTİM:
${(cvData.education || [])
  .map(
    (edu, idx) => `
${idx + 1}. ${edu.school || "Okul"} - ${edu.degree || "Derece"}
   Alan: ${edu.field || "Belirtilmemiş"}
   Tarih: ${edu.startDate || ""} - ${edu.endDate || ""}
   GPA: ${edu.gpa || "Belirtilmemiş"}
`
  )
  .join("\n") || "Belirtilmemiş"}

DİLLER:
${(cvData.languages || [])
  .map(
    (lang, idx) => `
${idx + 1}. ${lang.name || "Dil"}: ${lang.level || "Belirtilmemiş"}
`
  )
  .join("\n") || "Belirtilmemiş"}

İŞ DENEYİMLERİ:
${(cvData.experience || [])
  .map(
    (exp, idx) => `
${idx + 1}. ${exp.company || "Şirket"} - ${exp.position || "Pozisyon"}
   Tarih: ${exp.startDate || ""} - ${exp.current ? "Devam ediyor" : exp.endDate || ""}
   Açıklama: ${exp.description || "Belirtilmemiş"}
`
  )
  .join("\n") || "Belirtilmemiş"}

BECERİLER:
${(cvData.skills || []).join(", ") || "Belirtilmemiş"}

PROJELER:
${(cvData.projects || [])
  .map(
    (proj, idx) => `
${idx + 1}. ${proj.name || "Proje"}
   Teknolojiler: ${proj.technologies || "Belirtilmemiş"}
   Açıklama: ${proj.description || "Belirtilmemiş"}
   URL: ${proj.url || "Belirtilmemiş"}
   Tarih: ${proj.startDate || ""} - ${proj.endDate || ""}
`
  )
  .join("\n") || "Belirtilmemiş"}

BAŞARILAR:
${(cvData.achievements || [])
  .map(
    (ach, idx) => `
${idx + 1}. ${ach.title || "Başarı"}
   Açıklama: ${ach.description || "Belirtilmemiş"}
   Tarih: ${ach.date || "Belirtilmemiş"}
`
  )
  .join("\n") || "Belirtilmemiş"}

SERTİFİKALAR:
${(cvData.certifications || [])
  .map(
    (cert, idx) => `
${idx + 1}. ${cert.name || "Sertifika"}
   Veren: ${cert.issuer || "Belirtilmemiş"}
   Tarih: ${cert.date || "Belirtilmemiş"}
   Son Geçerlilik: ${cert.expiryDate || "Süresiz"}
`
  )
  .join("\n") || "Belirtilmemiş"}

REFERANSLAR:
${(cvData.references || [])
  .map(
    (ref, idx) => `
${idx + 1}. ${ref.name || "İsim"}
   Pozisyon: ${ref.position || "Belirtilmemiş"}
   Şirket: ${ref.company || "Belirtilmemiş"}
   Email: ${ref.email || "Belirtilmemiş"}
   Telefon: ${ref.phone || "Belirtilmemiş"}
`
  )
  .join("\n") || "Belirtilmemiş"}

HOBİLER:
${(cvData.hobbies || []).join(", ") || "Belirtilmemiş"}
`;

  // Pozisyon tipine göre teknik soru şablonu
  const getTechnicalQuestionsTemplate = (positionType: PositionType): string => {
    switch (positionType) {
      case "devops":
        return `
- CI/CD pipeline tasarımı ve yönetimi soruları
- Containerization (Docker, Kubernetes) soruları
- Cloud services (AWS, Azure, GCP) soruları
- Monitoring ve logging araçları
- Infrastructure as Code (Terraform, Ansible)
- Disaster recovery ve backup stratejileri
- 2-3 gerçek dünya senaryosu (production outage, scaling, deployment strategies)`;

      case "test_engineer":
        return `
- Test stratejileri ve metodolojileri soruları
- Test automation framework'leri (Selenium, Cypress, Jest, vb.)
- Test case design ve yazımı
- Bug tracking ve reporting süreçleri
- Performance testing ve load testing
- Security testing temelleri
- 2-3 gerçek dünya senaryosu (test planı oluşturma, bug reproduction, test automation)`;

      case "security_engineer":
        return `
- Security best practices ve standartlar
- Vulnerability assessment ve penetration testing
- Security architecture ve design patterns
- Compliance ve regulations (GDPR, ISO 27001, vb.)
- Security tools ve teknolojileri
- Incident response ve security monitoring
- 2-3 gerçek dünya senaryosu (security breach response, vulnerability management)`;

      case "data_engineer":
        return `
- Data pipeline design ve ETL processes
- Database optimization ve data modeling
- Big data technologies (Spark, Hadoop, vb.)
- Data warehouse ve data lake concepts
- Data quality ve data governance
- Real-time data processing
- 2-3 gerçek dünya senaryosu (data pipeline optimization, data quality issues)`;

      case "cloud_engineer":
        return `
- Cloud architecture ve design patterns
- Multi-cloud strategies
- Cloud security ve compliance
- Cost optimization
- Cloud migration strategies
- Serverless computing
- 2-3 gerçek dünya senaryosu (cloud migration, cost optimization, disaster recovery)`;

      case "system_admin":
        return `
- Network yönetimi ve troubleshooting
- Server management ve maintenance
- Security best practices
- Backup ve recovery strategies
- Scripting ve automation (Bash, PowerShell, Python)
- System monitoring ve performance tuning
- 2-3 gerçek dünya senaryosu (system outage, security incident, capacity planning)`;

      case "network_engineer":
        return `
- Network design ve architecture
- Routing ve switching protocols
- Network security ve firewalls
- Network troubleshooting
- VPN ve remote access solutions
- Network monitoring tools
- 2-3 gerçek dünya senaryosu (network outage, security breach, capacity planning)`;

      default: // developer
        return `
- 5-7 adet teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
- 1 adet canlı kodlama sorusu (${cvInfo.technologies[0] || "C#"} veya benzeri bir dilde)
- 1 adet bugfix sorusu (hatalı kod verilip düzeltilmesi istenecek)
- 2-3 adet gerçek dünya senaryosu (örn: Kasım indirimlerinde yoğun trafik, mikroservis mimarisi, performans optimizasyonu, scaling challenges)`;
    }
  };

  // Prompt oluştur
  const prompt = `
Bir ${positionTypeLabels[cvInfo.positionType]} pozisyonu için CV'ye göre çok kapsamlı ve gerçekçi bir mülakat hazırla. 
Mülakat 3 aşamadan oluşacak ve CV'deki TÜM bilgileri kapsayacak:

${cvSummary}

AŞAMA 1 - GENEL TANIŞMA VE KİŞİSEL BİLGİLER (5-7 soru):
CV'deki kişisel bilgiler, özet, eğitim ve diller bölümlerinden sorular oluştur:

1. **Kişisel Tanışma** (1-2 soru):
   - Kullanıcının kendisini tanıtması
   - Kariyer yolculuğu hakkında genel sorular
   - Bu pozisyona neden başvurduğu

2. **CV Özeti** (1-2 soru):
   - CV özetindeki bilgilere göre sorular
   - Kariyer hedefleri ve motivasyonları
   - Özet bölümünde bahsedilen önemli noktalar

3. **Eğitim Geçmişi** (1-2 soru):
   - Eğitim bilgilerine göre detaylı sorular
   - Eğitimin pozisyonla ilişkisi
   - Eğitim sırasında edinilen deneyimler
   - GPA (varsa) ve akademik başarılar

4. **Diller** (1-2 soru):
   - İngilizce seviyesi detaylı test (özellikle teknik dokümantasyon okuma/yazma)
   - Diğer diller (varsa) ve kullanım alanları
   - Dil becerilerinin işe katkısı

AŞAMA 2 - DENEYİM, PROJELER VE BAŞARILAR (8-12 soru):
CV'deki deneyim, projeler, başarılar, sertifikalar ve referanslar bölümlerinden sorular:

1. **İş Deneyimleri** (Her iş yeri için 2-3 soru, toplam 4-6 soru):
   - Şirket kültürü ve çalışma ortamı
   - Takım yapısı ve çalışma şekli
   - Kullanılan teknolojiler, araçlar ve metodolojiler
   - Sorumluluklar ve başarılar
   - Yaşanan zorluklar ve çözüm yöntemleri (STAR metodu ile)
   - Takım çalışması deneyimleri
   - Çalışma metodolojileri (Agile, Scrum, Kanban, vb.)
   - İş yerinden ayrılma nedenleri (varsa)

2. **Projeler** (Her önemli proje için 1-2 soru, toplam 2-4 soru):
   - Proje amacı, kapsamı ve hedefleri
   - Kullanılan teknolojiler ve neden seçildiği
   - Projedeki rol ve sorumluluklar
   - Karşılaşılan teknik zorluklar ve çözümler
   - Proje sonuçları ve öğrenilenler
   - Proje URL'i varsa (github, vb.) hakkında sorular

3. **Başarılar** (1-2 soru, varsa):
   - Başarıların detayları ve önemi
   - Başarıya giden süreç
   - Ölçülebilir sonuçlar ve etkileri

4. **Sertifikalar** (1-2 soru, varsa):
   - Sertifika içeriği ve kazanılan bilgiler
   - Sertifikanın işe katkısı
   - Sertifika sürecinde edinilen deneyimler

5. **Referanslar** (1 soru, varsa ve opsiyonel):
   - Referanslarla çalışma deneyimi
   - Öneriler ve geri bildirimler

AŞAMA 3 - TEKNİK MÜLAKAT (Pozisyon Tipine Göre Özelleştirilmiş):
${getTechnicalQuestionsTemplate(cvInfo.positionType)}

ÖNEMLİ NOTLAR:
- Pozisyon Tipi: ${positionTypeLabels[cvInfo.positionType]}
- Seviye: ${cvInfo.level}
- Deneyim: ${cvInfo.yearsOfExperience} yıl
- Teknolojiler: ${cvInfo.technologies.join(", ") || "Belirtilmemiş"}
- Sorular ${cvInfo.level} seviyeye uygun olmalı
- Tüm sorular Türkçe olmalı
- Sorular gerçekçi ve pratik olmalı
- Behavioral sorular STAR metoduna uygun olmalı
- Teknik sorular CV'deki teknolojilere göre olmalı

SORU FORMATI:
Her soru şu formatta olmalı:
{
  "id": "unique_id",
  "type": "technical" | "behavioral" | "case" | "live_coding" | "bug_fix",
  "question": "Soru metni",
  "prompt": "Ek açıklama (opsiyonel)",
  "description": "Detaylı açıklama (opsiyonel)",
  "difficulty": "${cvInfo.level}",
  "resources": ["ipucu1", "ipucu2"] (opsiyonel),
  "languages": ["csharp", "javascript", "python"] (sadece kodlama soruları için),
  "starterCode": {"csharp": "kod", "javascript": "kod"} (sadece live_coding için),
  "buggyCode": "hatalı kod" (sadece bug_fix için),
  "timeLimitMinutes": 15 (opsiyonel),
  "supportingText": "Ek bilgi" (opsiyonel),
  "acceptanceCriteria": ["kriter1", "kriter2"] (opsiyonel)
}

ÖNEMLİ:
- Sorular ${cvInfo.level} seviyeye uygun olmalı
- Teknolojiler: ${cvInfo.technologies.join(", ") || "Belirtilmemiş"}
- Gerçek dünya senaryoları pratik ve uygulanabilir olmalı
${cvInfo.positionType === "developer" ? `- Canlı kodlama ve bugfix soruları ${cvInfo.technologies[0] || "C#"} dilinde olmalı` : "- Developer pozisyonu olmadığı için canlı kodlama ve bugfix soruları opsiyoneldir"}
- Tüm sorular Türkçe olmalı
- JSON formatında yanıt ver

JSON formatında yanıt ver:
{
  "stage1_introduction": [...], // 5-7 soru
  "stage2_experience": [...], // 8-12 soru
  "stage3_technical": {
    "testQuestions": [...], // En az 5 soru
    "liveCoding": {...}, // Sadece developer pozisyonları için zorunlu
    "bugFix": {...}, // Sadece developer pozisyonları için zorunlu
    "realWorldScenarios": [...] // En az 2-3 senaryo
  }
}
`;

  try {
    const result = await createChatCompletion({
      schema: interviewQuestionsSchema,
      messages: [
        {
          role: "system",
          content: `Sen bir ${positionTypeLabels[cvInfo.positionType]} mülakat uzmanısın ve İK profesyonelisin. CV'lere göre çok kapsamlı, gerçekçi ve adil mülakat soruları hazırlıyorsun. CV'deki TÜM bölümleri (Kişisel Bilgiler, Özet, Deneyim, Eğitim, Beceriler, Diller, Projeler, Başarılar, Sertifikalar, Referanslar) analiz ederek sorular oluşturuyorsun. Pozisyon tipine göre (${positionTypeLabels[cvInfo.positionType]}) uygun teknik sorular hazırlıyorsun. Her zaman JSON formatında yanıt ver.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    if (!result.parsed) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    return result.parsed;
  } catch (error: any) {
    console.error("[generateInterviewFromCV] Hata:", error);
    throw new Error(`Mülakat soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}`);
  }
}

/**
 * Soruları interview formatına dönüştürür
 */
export function formatQuestionsForInterview(questions: InterviewQuestions): any[] {
  const allQuestions: any[] = [];

  // Aşama 1: Genel Tanışma
  questions.stage1_introduction.forEach((q, idx) => {
    allQuestions.push({
      ...q,
      id: q.id || `intro_${idx + 1}`,
      stage: 1,
    });
  });

  // Aşama 2: İş Deneyimleri
  questions.stage2_experience.forEach((q, idx) => {
    allQuestions.push({
      ...q,
      id: q.id || `experience_${idx + 1}`,
      stage: 2,
    });
  });

  // Aşama 3: Teknik Mülakat
  // Test soruları
  questions.stage3_technical.testQuestions.forEach((q, idx) => {
    allQuestions.push({
      ...q,
      id: q.id || `technical_test_${idx + 1}`,
      stage: 3,
    });
  });

  // Canlı kodlama (opsiyonel - sadece developer pozisyonları için)
  if (questions.stage3_technical.liveCoding) {
    allQuestions.push({
      ...questions.stage3_technical.liveCoding,
      id: questions.stage3_technical.liveCoding.id || "live_coding_1",
      stage: 3,
    });
  }

  // Bug fix (opsiyonel - sadece developer pozisyonları için)
  if (questions.stage3_technical.bugFix) {
    allQuestions.push({
      ...questions.stage3_technical.bugFix,
      id: questions.stage3_technical.bugFix.id || "bug_fix_1",
      stage: 3,
    });
  }

  // Gerçek dünya senaryoları
  questions.stage3_technical.realWorldScenarios.forEach((q, idx) => {
    allQuestions.push({
      ...q,
      id: q.id || `scenario_${idx + 1}`,
      stage: 3,
    });
  });

  return allQuestions;
}

