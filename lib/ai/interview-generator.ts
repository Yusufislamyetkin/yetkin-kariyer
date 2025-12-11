import { z } from "zod";
import { createChatCompletion, ensureAIEnabled, isAIEnabled, AIResponseValidationError } from "./client";
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
    eliminationQuestions: z.array(interviewQuestionSchema).min(2).optional(),
    liveCoding: interviewQuestionSchema.nullable().optional(),
    bugFix: interviewQuestionSchema.nullable().optional(),
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

// Stage-specific schemas
const stage1QuestionsSchema = z.object({
  stage1_introduction: z.array(interviewQuestionSchema),
});

const stage2QuestionsSchema = z.object({
  stage2_experience: z.array(interviewQuestionSchema),
});

const stage3QuestionsSchema = z.object({
  stage3_technical: z.object({
    testQuestions: z.array(interviewQuestionSchema).min(8), // 5'ten 8'e çıkarıldı
    eliminationQuestions: z.array(interviewQuestionSchema).min(2).optional(), // Eleme soruları eklendi
    liveCoding: interviewQuestionSchema.nullable().optional(),
    bugFix: interviewQuestionSchema.nullable().optional(),
    realWorldScenarios: z.array(interviewQuestionSchema).min(2),
  }),
});

/**
 * CV özetini oluşturan helper fonksiyon
 */
async function getCVSummary(cvId: string): Promise<{ cvData: CVData; cvInfo: ReturnType<typeof extractCVInfo>; cvSummary: string; positionTypeLabels: Record<PositionType, string> }> {
  const cv = await db.cV.findUnique({
    where: { id: cvId },
  });

  if (!cv) {
    throw new Error("CV bulunamadı");
  }

  const cvData = cv.data as CVData;
  const cvInfo = extractCVInfo(cvData);

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

  return { cvData, cvInfo, cvSummary, positionTypeLabels };
}

/**
 * Aşama 1: Genel Tanışma ve Kişisel Bilgiler soruları oluşturur
 */
export async function generateStage1Questions(cvId: string): Promise<z.infer<typeof stage1QuestionsSchema>> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin.");
  }

  const { cvData, cvInfo, cvSummary, positionTypeLabels } = await getCVSummary(cvId);

  const prompt = `
Bir ${positionTypeLabels[cvInfo.positionType]} pozisyonu için CV'ye göre genel tanışma ve kişisel bilgiler soruları hazırla.

${cvSummary}

AŞAMA 1 - GENEL TANIŞMA VE KİŞİSEL BİLGİLER (5-7 soru):
SADECE CV'deki kişisel bilgiler, özet, eğitim ve diller bölümlerinden sorular oluştur.

KRİTİK KURALLAR - AŞAMA 1:
- SADECE kişisel bilgiler, eğitim, diller ve CV özeti soruları
- HİÇBİR iş deneyimi, proje, başarı veya sertifika sorusu SORMA
- Aşama 2'de deneyim ve projeler sorulacak, bu aşamada bunlara dokunma
- Sorular tanışma ve kişisel bilgi odaklı olmalı

YASAK SORU TİPLERİ - ASLA SORMA:
- E-posta adresi, telefon numarası, adres gibi iletişim bilgileri hakkında sorular
- LinkedIn profili, sosyal medya hesapları, GitHub profili gibi sosyal platformlar hakkında sorular
- "E-posta adresiniz olan X üzerinden sizinle iletişim kurabiliriz" gibi ifadeler içeren sorular
- "LinkedIn profilinizdeki bilgiler doğrultusunda" gibi ifadeler içeren sorular
- Kişisel iletişim bilgilerini doğrulama veya kullanma amaçlı sorular
- Bu tür sorular profesyonel mülakatlarda uygunsuzdur ve ASLA sorulmamalıdır

1. **Kişisel Tanışma ve Tanıtım** (2-3 soru):
   - Kullanıcının kendisini tanıtması
   - CV'deki kişisel bilgilere dayalı sorular (isim, genel tanıtım - AMA iletişim bilgileri değil)
   - Genel kariyer motivasyonu (ama deneyim detaylarına girme)
   - NOT: "Bu pozisyona neden başvurduğu" gibi genel sorular sorma. CV'deki spesifik kişisel bilgilere göre sorular oluştur.
   - NOT: E-posta, telefon, LinkedIn gibi iletişim bilgileri hakkında ASLA soru sorma

2. **CV Özeti** (1-2 soru):
   - CV özetindeki bilgilere göre sorular
   - Kariyer hedefleri ve motivasyonları (genel seviyede)
   - Özet bölümünde bahsedilen önemli noktalar
   - NOT: Özette bahsedilen projeler veya deneyimler hakkında detaylı sorular sorma, bunlar Aşama 2'de sorulacak

3. **Eğitim Geçmişi** (2-3 soru):
   - Eğitim bilgilerine göre detaylı sorular
   - Eğitimin pozisyonla ilişkisi
   - Eğitim sırasında edinilen genel deneyimler (ama iş deneyimi değil)
   - GPA (varsa) ve akademik başarılar
   - Eğitim sırasındaki projeler (eğitim projeleri, iş projeleri değil)

4. **Diller** (1-2 soru):
   - İngilizce seviyesi detaylı test (özellikle teknik dokümantasyon okuma/yazma)
   - Diğer diller (varsa) ve kullanım alanları
   - Dil becerilerinin işe katkısı (genel seviyede)

ÖNEMLİ NOTLAR:
- Pozisyon Tipi: ${positionTypeLabels[cvInfo.positionType]}
- Seviye: ${cvInfo.level}
- Deneyim: ${cvInfo.yearsOfExperience} yıl
- Teknolojiler: ${cvInfo.technologies.join(", ") || "Belirtilmemiş"}
- Sorular ${cvInfo.level} seviyeye uygun olmalı
- Tüm sorular Türkçe olmalı
- Sorular gerçekçi ve pratik olmalı
- Behavioral sorular STAR metoduna uygun olmalı
- KRİTİK: Tüm sorular CV'deki gerçek bilgilere dayalı olmalı. "Bu pozisyona neden başvurduğu", "Bu ilana neden başvurdunuz" gibi genel sorular SORMA.
- KRİTİK: Aşama 1'de HİÇBİR iş deneyimi, proje, başarı veya sertifika sorusu sorma. Bunlar Aşama 2'de sorulacak.
- KRİTİK: E-posta adresi, telefon numarası, LinkedIn profili, sosyal medya hesapları gibi iletişim bilgileri hakkında ASLA soru sorma. Bu tür sorular profesyonel mülakatlarda uygunsuzdur.

SORU FORMATI:
Her soru şu formatta olmalı:
{
  "id": "unique_id",
  "type": "behavioral",
  "question": "Soru metni",
  "prompt": "Ek açıklama (opsiyonel)",
  "description": "Detaylı açıklama (opsiyonel)",
  "difficulty": "${cvInfo.level}",
  "resources": ["ipucu1", "ipucu2"] (opsiyonel)
}

JSON formatında yanıt ver:
{
  "stage1_introduction": [...] // 5-7 soru
}
`;

  try {
    const result = await createChatCompletion({
      schema: stage1QuestionsSchema,
      messages: [
        {
          role: "system",
          content: `Sen bir ${positionTypeLabels[cvInfo.positionType]} mülakat uzmanısın ve İK profesyonelisin. CV'lere göre çok kapsamlı, gerçekçi ve adil mülakat soruları hazırlıyorsun. 

AŞAMA 1 İÇİN KRİTİK KURALLAR:
1. SADECE kişisel bilgiler, eğitim, diller ve CV özeti soruları oluştur
2. HİÇBİR iş deneyimi, proje, başarı veya sertifika sorusu sorma - bunlar Aşama 2'de sorulacak
3. "Bu pozisyona neden başvurduğu" gibi genel sorular ASLA sorma
4. CV'deki gerçek kişisel bilgilere (isim, eğitim, diller) dayalı spesifik sorular oluştur
5. Eğitim sırasındaki akademik projeler sorulabilir, ama iş deneyimi projeleri sorulmamalı
6. YASAK: E-posta adresi, telefon numarası, LinkedIn profili, sosyal medya hesapları, GitHub profili gibi iletişim bilgileri hakkında ASLA soru sorma
7. YASAK: "E-posta adresiniz olan X üzerinden sizinle iletişim kurabiliriz" gibi ifadeler içeren sorular ASLA oluşturma
8. YASAK: "LinkedIn profilinizdeki bilgiler doğrultusunda" gibi ifadeler içeren sorular ASLA oluşturma
9. Bu tür sorular profesyonel mülakatlarda uygunsuzdur ve kesinlikle sorulmamalıdır

Her zaman JSON formatında yanıt ver.`,
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
    console.error("[generateStage1Questions] Hata:", error);
    throw new Error(`Aşama 1 soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}`);
  }
}

/**
 * Aşama 2: Deneyim, Projeler ve Başarılar soruları oluşturur
 */
export async function generateStage2Questions(cvId: string): Promise<z.infer<typeof stage2QuestionsSchema>> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin.");
  }

  const { cvData, cvInfo, cvSummary, positionTypeLabels } = await getCVSummary(cvId);

  const prompt = `
Bir ${positionTypeLabels[cvInfo.positionType]} pozisyonu için CV'ye göre deneyim, projeler ve başarılar soruları hazırla.

${cvSummary}

AŞAMA 2 - DENEYİM, PROJELER VE BAŞARILAR (8-12 soru):
SADECE CV'deki deneyim, projeler, başarılar, sertifikalar ve referanslar bölümlerinden sorular oluştur.

KRİTİK KURALLAR - AŞAMA 2:
- SADECE iş deneyimleri, projeler, başarılar, sertifikalar ve referanslar soruları
- HİÇBİR kişisel tanışma, eğitim veya dil sorusu SORMA
- Aşama 1'de kişisel bilgiler ve eğitim soruldu, bu aşamada bunlara dokunma
- Sorular profesyonel deneyim ve pratik uygulama odaklı olmalı

1. **İş Deneyimleri** (Her iş yeri için 2-3 soru, toplam 4-6 soru):
   - Şirket kültürü ve çalışma ortamı
   - Takım yapısı ve çalışma şekli
   - Kullanılan teknolojiler, araçlar ve metodolojiler (detaylı)
   - Sorumluluklar ve başarılar (somut örneklerle)
   - Yaşanan zorluklar ve çözüm yöntemleri (STAR metodu ile)
   - Takım çalışması deneyimleri
   - Çalışma metodolojileri (Agile, Scrum, Kanban, vb.)
   - İş yerinden ayrılma nedenleri (varsa)
   - NOT: Eğitim sırasındaki stajlar veya part-time işler de dahil edilebilir

2. **Projeler** (Her önemli proje için 1-2 soru, toplam 2-4 soru):
   - Proje amacı, kapsamı ve hedefleri
   - Kullanılan teknolojiler ve neden seçildiği (teknik detaylar)
   - Projedeki rol ve sorumluluklar
   - Karşılaşılan teknik zorluklar ve çözümler (derinlemesine)
   - Proje sonuçları ve öğrenilenler
   - Proje URL'i varsa (github, vb.) hakkında sorular
   - NOT: Sadece iş projeleri veya önemli kişisel projeler, eğitim projeleri değil

3. **Başarılar** (1-2 soru, varsa):
   - Başarıların detayları ve önemi
   - Başarıya giden süreç (STAR metodu)
   - Ölçülebilir sonuçlar ve etkileri

4. **Sertifikalar** (1-2 soru, varsa):
   - Sertifika içeriği ve kazanılan bilgiler
   - Sertifikanın işe katkısı
   - Sertifika sürecinde edinilen deneyimler

5. **Referanslar** (1 soru, varsa ve opsiyonel):
   - Referanslarla çalışma deneyimi
   - Öneriler ve geri bildirimler

ÖNEMLİ NOTLAR:
- Pozisyon Tipi: ${positionTypeLabels[cvInfo.positionType]}
- Seviye: ${cvInfo.level}
- Deneyim: ${cvInfo.yearsOfExperience} yıl
- Teknolojiler: ${cvInfo.technologies.join(", ") || "Belirtilmemiş"}
- Sorular ${cvInfo.level} seviyeye uygun olmalı
- Tüm sorular Türkçe olmalı
- Sorular gerçekçi ve pratik olmalı
- Behavioral sorular STAR metoduna uygun olmalı
- KRİTİK: Aşama 2'de HİÇBİR kişisel tanışma, eğitim veya dil sorusu sorma. Bunlar Aşama 1'de soruldu.

SORU FORMATI:
Her soru şu formatta olmalı:
{
  "id": "unique_id",
  "type": "behavioral" | "case",
  "question": "Soru metni",
  "prompt": "Ek açıklama (opsiyonel)",
  "description": "Detaylı açıklama (opsiyonel)",
  "difficulty": "${cvInfo.level}",
  "resources": ["ipucu1", "ipucu2"] (opsiyonel)
}

JSON formatında yanıt ver:
{
  "stage2_experience": [...] // 8-12 soru
}
`;

  try {
    const result = await createChatCompletion({
      schema: stage2QuestionsSchema,
      messages: [
        {
          role: "system",
          content: `Sen bir ${positionTypeLabels[cvInfo.positionType]} mülakat uzmanısın ve İK profesyonelisin. CV'lere göre çok kapsamlı, gerçekçi ve adil mülakat soruları hazırlıyorsun. 

AŞAMA 2 İÇİN KRİTİK KURALLAR:
1. SADECE iş deneyimleri, projeler, başarılar, sertifikalar ve referanslar soruları oluştur
2. HİÇBİR kişisel tanışma, eğitim veya dil sorusu sorma - bunlar Aşama 1'de soruldu
3. Sorular profesyonel deneyim ve pratik uygulama odaklı olmalı
4. Teknik detaylara ve somut örneklere odaklan
5. STAR metodunu kullanarak behavioral sorular oluştur

Her zaman JSON formatında yanıt ver.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      timeoutMs: 90000, // 90 seconds for complex CV analysis
      maxRetries: 3, // More retries for complex operations
    });

    if (!result.parsed) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    return result.parsed;
  } catch (error: any) {
    console.error("[generateStage2Questions] Hata:", error);
    throw new Error(`Aşama 2 soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}`);
  }
}

/**
 * Aşama 3: Teknik Mülakat soruları oluşturur
 */
export async function generateStage3Questions(cvId: string): Promise<z.infer<typeof stage3QuestionsSchema>> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin.");
  }

  const { cvData, cvInfo, cvSummary, positionTypeLabels } = await getCVSummary(cvId);

  // Pozisyon tipine göre teknik soru şablonu
  const getTechnicalQuestionsTemplate = (positionType: PositionType): string => {
    switch (positionType) {
      case "devops":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Mimari, performans, güvenlik, optimizasyon odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * Docker: "Docker container lifecycle nedir? Container vs Image farkı nedir? Detaylı anlatır mısınız?"
  * Docker: "Docker multi-stage build nedir? Neden kullanılır? Performans avantajları nelerdir?"
  * Kubernetes: "Kubernetes pod scheduling algoritması nasıl çalışır? Node affinity nedir? Detaylı anlatır mısınız?"
  * Kubernetes: "Kubernetes service types (ClusterIP, NodePort, LoadBalancer) arasındaki farklar nelerdir? Hangi durumda hangisi kullanılmalıdır?"
  * Terraform: "Terraform state management nedir? Remote state kullanmanın avantajları nelerdir? State locking nasıl çalışır?"
  * Terraform: "Terraform modules nedir? DRY prensibini uygulamak için nasıl kullanılır?"
  * CI/CD: "CI/CD pipeline'da build cache stratejileri nelerdir? Pipeline performansını nasıl optimize edersiniz?"
  * CI/CD: "GitLab CI vs Jenkins karşılaştırması. Hangi durumda hangisini tercih edersiniz?"
  * AWS: "AWS ECS vs EKS farkı nedir? Hangi durumda hangisini kullanmalıyız?"
  * Monitoring: "Prometheus vs Grafana farkı nedir? Alerting mekanizması nasıl çalışır?"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "10 milyon kullanıcılı bir sistemde zero-downtime deployment stratejisi nasıl olmalı?"
  * Örnek: "Kubernetes cluster'da resource quota ve limit range nasıl yönetilir? OOM (Out of Memory) durumları nasıl önlenir?"
  
- 2-3 adet gerçek dünya senaryosu (production outage, scaling, deployment strategies)`;

      case "test_engineer":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Test stratejileri, framework mimarisi, performans optimizasyonu odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * Selenium: "Selenium WebDriver architecture nasıl çalışır? Explicit vs Implicit wait farkı nedir? Detaylı anlatır mısınız?"
  * Selenium: "Selenium Grid nedir? Parallel test execution nasıl yapılır? Scalability nasıl sağlanır?"
  * Cypress: "Cypress test execution model nasıl çalışır? Selenium'dan farkları nelerdir? Detaylı anlatır mısınız?"
  * Cypress: "Cypress'te async operations nasıl handle edilir? Promise chain'ler nasıl yönetilir?"
  * Jest: "Jest mocking strategies nelerdir? Mock functions, spies ve stubs arasındaki farklar nedir?"
  * Jest: "Jest snapshot testing nedir? Ne zaman kullanılmalı? Avantaj ve dezavantajları nelerdir?"
  * TestNG: "TestNG parallel execution nasıl yapılır? Thread count ve data provider stratejileri nelerdir?"
  * TestNG: "TestNG dependency management nasıl çalışır? Test sıralaması nasıl kontrol edilir?"
  * Performance Testing: "Load testing vs Stress testing vs Spike testing farkları nelerdir? Hangi durumda hangisi kullanılmalıdır?"
  * API Testing: "REST API test automation stratejileri nelerdir? Postman vs RestAssured karşılaştırması"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "Flaky test'ler nasıl tespit edilir ve çözülür? Test stability nasıl artırılır?"
  * Örnek: "1000+ test case'li bir projede test execution süresini %50 azaltmak için hangi stratejileri uygularsınız?"
  
- 2-3 adet gerçek dünya senaryosu (test planı oluşturma, bug reproduction, test automation)`;

      case "security_engineer":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Security architecture, vulnerability management, incident response odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * OWASP: "OWASP Top 10 listesindeki güvenlik açıklarını detaylı anlatır mısınız? SQL Injection nasıl önlenir?"
  * OWASP: "XSS (Cross-Site Scripting) saldırıları nasıl çalışır? Reflected vs Stored XSS farkları nedir?"
  * Penetration Testing: "Penetration testing metodolojileri nelerdir? OWASP Testing Guide'a göre test süreci nasıl olmalıdır?"
  * Penetration Testing: "Burp Suite vs OWASP ZAP karşılaştırması. Hangi durumda hangisini kullanırsınız?"
  * Vulnerability Scanning: "Nessus vs OpenVAS farkları nelerdir? Vulnerability scanning stratejileri nasıl olmalıdır?"
  * Security Architecture: "Zero Trust architecture nedir? Network segmentation stratejileri nelerdir?"
  * Security Architecture: "Defense in depth stratejisi nedir? Katmanlı güvenlik nasıl uygulanır?"
  * GDPR/Compliance: "GDPR compliance için gerekli teknik önlemler nelerdir? Data encryption ve anonymization stratejileri"
  * Incident Response: "Security incident response plan nasıl oluşturulur? SIEM tools nasıl kullanılır?"
  * Cryptography: "Symmetric vs Asymmetric encryption farkları nedir? RSA vs AES ne zaman kullanılır?"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "Zero-day vulnerability tespit edildiğinde incident response süreci nasıl olmalıdır? Containment stratejileri nelerdir?"
  * Örnek: "Multi-cloud ortamında güvenlik yönetimi nasıl yapılır? Identity federation stratejileri nelerdir?"
  
- 2-3 adet gerçek dünya senaryosu (security breach response, vulnerability management)`;

      case "data_engineer":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Data pipeline, data modeling, performance optimization odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * Spark: "Spark RDD vs DataFrame vs Dataset farkları nelerdir? Hangi durumda hangisini kullanmalıyız?"
  * Spark: "Spark shuffle operation nedir? Shuffle optimization stratejileri nelerdir? Detaylı anlatır mısınız?"
  * Spark: "Spark broadcast variables ve accumulators nedir? Ne zaman kullanılır?"
  * Hadoop: "Hadoop MapReduce vs Spark farkları nedir? Hangi durumda hangisini tercih edersiniz?"
  * ETL: "ETL pipeline optimization stratejileri nelerdir? Incremental load vs Full load ne zaman kullanılır?"
  * ETL: "Data pipeline'da error handling ve retry mekanizmaları nasıl implement edilir?"
  * Data Warehouse: "Data warehouse design patterns nelerdir? Star schema vs Snowflake schema farkları"
  * Data Warehouse: "Data warehouse vs Data lake vs Data lakehouse farkları nedir? Hangi durumda hangisi kullanılmalıdır?"
  * Real-time Processing: "Real-time streaming architectures nelerdir? Kafka vs RabbitMQ vs Apache Pulsar karşılaştırması"
  * Data Quality: "Data quality metrics nelerdir? Data validation ve cleansing stratejileri nasıl uygulanır?"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "1 milyar satırlık bir dataset'te join operation'ı optimize etmek için hangi stratejileri uygularsınız?"
  * Örnek: "Real-time data pipeline'da data consistency nasıl sağlanır? Exactly-once processing nasıl garantilenir?"
  
- 2-3 adet gerçek dünya senaryosu (data pipeline optimization, data quality issues)`;

      case "cloud_engineer":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Cloud architecture, cost optimization, security odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * AWS Lambda: "AWS Lambda cold start optimization nasıl yapılır? Provisioned concurrency nedir? Detaylı anlatır mısınız?"
  * AWS Lambda: "Lambda function timeout ve memory allocation stratejileri nelerdir? Cost optimization nasıl yapılır?"
  * AWS: "AWS VPC architecture nedir? Subnet design ve routing strategies nelerdir?"
  * AWS: "AWS IAM policy evaluation logic nasıl çalışır? Least privilege principle nasıl uygulanır?"
  * Azure: "Azure Service Bus vs Event Grid vs Event Hubs farkları nedir? Hangi durumda hangisi kullanılmalıdır?"
  * Azure: "Azure App Service vs Azure Functions vs Azure Container Instances karşılaştırması"
  * GCP: "GCP IAM best practices nelerdir? Service accounts vs User accounts ne zaman kullanılır?"
  * GCP: "GCP Cloud Functions vs Cloud Run farkları nedir? Serverless architecture patterns"
  * Multi-cloud: "Multi-cloud networking stratejileri nelerdir? VPN vs Direct Connect vs Interconnect"
  * Cost Optimization: "Cloud cost optimization teknikleri nelerdir? Reserved instances vs Spot instances stratejileri"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "Multi-cloud ortamında disaster recovery stratejisi nasıl tasarlanır? RTO ve RPO hedefleri nasıl karşılanır?"
  * Örnek: "Cloud migration sırasında zero-downtime migration stratejisi nasıl uygulanır? Blue-green deployment pattern"
  
- 2-3 adet gerçek dünya senaryosu (cloud migration, cost optimization, disaster recovery)`;

      case "system_admin":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * System management, automation, troubleshooting odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * Linux: "Linux process management nasıl çalışır? Process states ve scheduling algorithms nelerdir? Detaylı anlatır mısınız?"
  * Linux: "Linux file permissions ve ACL (Access Control Lists) nasıl yönetilir? chmod, chown, setuid/setgid"
  * Linux: "Linux systemd service management nasıl yapılır? Unit files ve dependency management"
  * Windows: "Windows PowerShell automation stratejileri nelerdir? Desired State Configuration (DSC) nasıl kullanılır?"
  * Windows: "Windows Group Policy management nasıl yapılır? GPO inheritance ve precedence"
  * Scripting: "Bash scripting best practices nelerdir? Error handling ve logging stratejileri"
  * Scripting: "Python automation scripts'te subprocess vs os.system farkları nedir? Process management"
  * Monitoring: "System monitoring tools (Nagios, Zabbix, Prometheus) karşılaştırması. Alerting stratejileri"
  * Backup: "Backup ve recovery stratejileri nelerdir? Full vs Incremental vs Differential backup farkları"
  * Security: "System hardening best practices nelerdir? Firewall configuration ve intrusion detection"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "Production sistemde disk space dolduğunda hangi adımları izlersiniz? Log rotation ve cleanup stratejileri"
  * Örnek: "100+ server'lı bir ortamda configuration management nasıl yapılır? Infrastructure as Code stratejileri"
  
- 2-3 adet gerçek dünya senaryosu (system outage, security incident, capacity planning)`;

      case "network_engineer":
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Network architecture, routing protocols, security odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * Routing: "OSPF vs BGP routing protocols farkları nedir? Hangi durumda hangisi kullanılmalıdır? Detaylı anlatır mısınız?"
  * Routing: "OSPF area types (stub, NSSA, totally stubby) nelerdir? Network design'da nasıl kullanılır?"
  * Switching: "VLAN configuration ve trunking nasıl yapılır? 802.1Q tagging nedir?"
  * Switching: "Spanning Tree Protocol (STP) nasıl çalışır? RSTP vs MSTP farkları nedir?"
  * Firewall: "Firewall rule optimization stratejileri nelerdir? Stateful vs Stateless firewall farkları"
  * Firewall: "Network Address Translation (NAT) types nelerdir? Static NAT vs Dynamic NAT vs PAT"
  * VPN: "VPN protocols (IPSec, SSL/TLS, OpenVPN) karşılaştırması. Site-to-site vs Remote access VPN"
  * VPN: "VPN tunnel establishment process nasıl çalışır? IKE (Internet Key Exchange) protocol"
  * Network Monitoring: "Network monitoring tools (Wireshark, tcpdump, SNMP) nasıl kullanılır? Packet analysis"
  * Troubleshooting: "Network troubleshooting metodolojileri nelerdir? OSI model'e göre problem isolation"
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Örnek: "Multi-site network'te routing loop nasıl önlenir? BGP route filtering ve prefix lists"
  * Örnek: "High-availability network design nasıl yapılır? Redundancy ve failover stratejileri"
  
- 2-3 adet gerçek dünya senaryosu (network outage, security breach, capacity planning)`;

      default: // developer
        return `
- 8-10 adet KRİTİK ve NET teknik test sorusu (CV'deki teknolojilere göre, ${cvInfo.level} seviye)
  * Her soru CV'deki teknolojilerden en az birine spesifik olmalı
  * Sorular pratik uygulama ve problem çözme odaklı olmalı
  * Genel bilgi soruları yerine derinlemesine teknik sorular
  * Mimari, performans, güvenlik, optimizasyon odaklı sorular
  
  TEKNOLOJİ-SPESİFİK SORU ÖRNEKLERİ (CV'deki teknolojilere göre uyarlanmalı):
  * .NET Core: "ASP.NET Core middleware pipeline'ı ne işe yarar? Request pipeline'da middleware'lerin sırası neden önemlidir? Detaylı anlatır mısınız?"
  * .NET Core: "Dependency Injection container'da singleton, scoped ve transient yaşam döngüleri arasındaki farklar nelerdir? Hangi durumda hangisini kullanmalıyız?"
  * SOLID Prensipleri: "Liskov Substitution Principle (LSP) nedir? Detaylı anlatır mısınız? Gerçek bir örnekle açıklayabilir misiniz?"
  * SOLID Prensipleri: "Interface Segregation Principle (ISP) nedir? Neden önemlidir? Büyük interface'ler yerine küçük, spesifik interface'ler kullanmanın avantajları nelerdir?"
  * Data Consistency: "Data consistency nedir? ACID properties nelerdir? Detaylı anlatır mısınız?"
  * Microservices: "Mikroservis mimarisinde data tutarlılığı nasıl sağlanır? Eventual consistency nedir? Distributed transaction yönetimi nasıl yapılır?"
  * Microservices: "Saga pattern nedir? Mikroservisler arasında transaction yönetimi için nasıl kullanılır?"
  * C#: "C# async/await pattern'inde deadlock nasıl önlenir? ConfigureAwait(false) ne zaman kullanılmalıdır?"
  * Database: "Database transaction isolation levels nelerdir? Hangi durumda hangi isolation level kullanılmalıdır?"
  * Architecture: "Mikroservis mimarisinde distributed transaction nasıl yönetilir? Two-phase commit vs Saga pattern karşılaştırması"
  
  * Örnek: "C# async/await pattern'inde deadlock nasıl önlenir?", "Mikroservis mimarisinde distributed transaction nasıl yönetilir?" gibi spesifik ve zor sorular
  
- 2-3 adet ELEME SORUSU (çok zor, kritik sorular - adayı gerçekten test eden)
  * Bu sorular adayın gerçekten konuyu bilip bilmediğini test etmeli
  * Sadece ezberlenmiş cevaplarla geçilemeyecek derinlikte olmalı
  * Mimari tasarım, performans optimizasyonu, güvenlik, edge case'ler gibi konular
  * Örnek: "10 milyon kullanıcılı bir sistemde cache invalidation stratejisi nasıl olmalı?" gibi gerçek dünya problemleri
  * Örnek: "Mikroservis mimarisinde eventual consistency nasıl yönetilir? CAP theorem'e göre nasıl bir trade-off yapılmalıdır?"
  
- 1 adet canlı kodlama sorusu (${cvInfo.technologies[0] || "C#"} veya benzeri bir dilde)
  * Orta-ileri seviye zorlukta olmalı
  
- 1 adet bugfix sorusu (hatalı kod verilip düzeltilmesi istenecek)
  * Karmaşık bug'lar içermeli, basit syntax hataları değil
  
- 2-3 adet gerçek dünya senaryosu (örn: Kasım indirimlerinde yoğun trafik, mikroservis mimarisi, performans optimizasyonu, scaling challenges)
  * Senaryolar zorlaştırılmalı, gerçek production problemlerine benzer olmalı`;
    }
  };

  const isDeveloper = cvInfo.positionType === "developer";
  const primaryLanguage = cvInfo.technologies[0] || "C#";
  
  const prompt = `
Bir ${positionTypeLabels[cvInfo.positionType]} pozisyonu için CV'ye göre teknik mülakat soruları hazırla.

${cvSummary}

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
- Teknik sorular CV'deki teknolojilere göre olmalı
- Gerçek dünya senaryoları pratik ve uygulanabilir olmalı
${isDeveloper ? `- Canlı kodlama ve bugfix soruları ${primaryLanguage} dilinde olmalı` : "- Developer pozisyonu olmadığı için canlı kodlama ve bugfix soruları opsiyoneldir"}

KRİTİK: Teknik Sorular İçin Özel Gereksinimler - TÜM POZİSYON TİPLERİ İÇİN GEÇERLİ:
- testQuestions: CV'deki her teknoloji için derinlemesine ve kritik sorular oluştur
  * Sorular sadece genel bilgi sormamalı, pratik uygulama ve problem çözme odaklı olmalı
  * Her soru CV'deki teknolojilerden en az birine spesifik olarak odaklanmalı
  * Mimari tasarım, performans optimizasyonu, güvenlik, scalability gibi konulara odaklan
  * ${cvInfo.technologies.length > 0 ? `CV'deki teknolojiler (${cvInfo.technologies.join(", ")}) için özel sorular oluştur. Her teknoloji için en az 1-2 kritik soru olmalı.` : "CV'de teknoloji belirtilmemişse, pozisyon tipine göre uygun teknolojiler için sorular oluştur."}
  * Sorular ${cvInfo.level} seviyeye uygun derinlikte olmalı (beginner: temel kavramlar, intermediate: pratik uygulama, advanced: mimari ve optimizasyon)
  * Test soruları çoktan seçmeli veya açık uçlu olabilir, ancak mutlaka CV'deki teknolojilere özel olmalı
  
  TEKNOLOJİ-SPESİFİK SORU ÜRETME ÖRNEKLERİ (Pozisyon tipine göre):
  * Pozisyon: ${positionTypeLabels[cvInfo.positionType]}
  * CV'deki teknolojilere göre aşağıdaki gibi spesifik sorular üret:
  
  ÖRNEK FORMATLAR:
  - "CV'de Docker varsa: Docker container lifecycle nedir? Container vs Image farkı nedir? Detaylı anlatır mısınız?"
  - "CV'de Kubernetes varsa: Kubernetes pod scheduling algoritması nasıl çalışır? Node affinity nedir?"
  - "CV'de Selenium varsa: Selenium WebDriver architecture nasıl çalışır? Explicit vs Implicit wait farkı nedir?"
  - "CV'de Spark varsa: Spark RDD vs DataFrame vs Dataset farkları nelerdir? Hangi durumda hangisini kullanmalıyız?"
  - "CV'de AWS Lambda varsa: AWS Lambda cold start optimization nasıl yapılır? Provisioned concurrency nedir?"
  - "CV'de Linux varsa: Linux process management nasıl çalışır? Process states ve scheduling algorithms nelerdir?"
  - "CV'de OSPF varsa: OSPF vs BGP routing protocols farkları nedir? Area types nelerdir?"
  - "CV'de .NET Core varsa: ASP.NET Core middleware pipeline'ı ne işe yarar? Request pipeline'da middleware'lerin sırası neden önemlidir?"
  
  ÖNEMLİ: Her soru CV'deki teknolojilere göre bu formatta spesifik ve detaylı olmalı. Genel bilgi soruları ASLA sorma.

- eliminationQuestions: ELEME SORULARI (çok zor, kritik)
  * Bu sorular adayın gerçekten konuyu bilip bilmediğini test etmeli
  * Sadece ezberlenmiş cevaplarla geçilemeyecek derinlikte olmalı
  * Mimari tasarım, performans optimizasyonu, güvenlik, edge case'ler, distributed systems gibi konular
  * Gerçek production problemlerine benzer senaryolar
  * Pozisyon tipine (${positionTypeLabels[cvInfo.positionType]}) ve CV'deki teknolojilere göre özelleştirilmiş olmalı
  * Örnek: "10 milyon kullanıcılı bir sistemde cache invalidation stratejisi nasıl olmalı?" (Developer için)
  * Örnek: "Kubernetes cluster'da resource quota ve limit range nasıl yönetilir? OOM durumları nasıl önlenir?" (DevOps için)
  * Örnek: "Flaky test'ler nasıl tespit edilir ve çözülür? Test stability nasıl artırılır?" (Test Engineer için)
  * Örnek: "Zero-day vulnerability tespit edildiğinde incident response süreci nasıl olmalıdır?" (Security Engineer için)
  * Örnek: "1 milyar satırlık bir dataset'te join operation'ı optimize etmek için hangi stratejileri uygularsınız?" (Data Engineer için)
  * Örnek: "Multi-cloud ortamında disaster recovery stratejisi nasıl tasarlanır?" (Cloud Engineer için)
  * Örnek: "100+ server'lı bir ortamda configuration management nasıl yapılır?" (System Admin için)
  * Örnek: "Multi-site network'te routing loop nasıl önlenir? BGP route filtering stratejileri" (Network Engineer için)
  * Bu sorular adayı gerçekten zorlamalı ve elemede kritik rol oynamalı

KRİTİK GEREKSİNİMLER:
1. testQuestions: MUTLAKA en az 8 (sekiz) soru içermelidir. Daha az soru kabul edilmez!
2. eliminationQuestions: MUTLAKA en az 2 (iki) eleme sorusu içermelidir. Bu sorular çok zor olmalı!
3. realWorldScenarios: MUTLAKA en az 2 (iki) senaryo içermelidir. Senaryolar zorlaştırılmalı!
4. ${isDeveloper ? "liveCoding ve bugFix: Developer pozisyonları için MUTLAKA dahil edilmelidir. Orta-ileri seviye zorlukta olmalı." : "liveCoding ve bugFix: Opsiyoneldir, dahil edilmeyebilir."}

SORU FORMATI:
Her soru şu formatta olmalı:
{
  "id": "unique_id", // ZORUNLU: Her soru için benzersiz bir ID
  "type": "technical" | "case" | "live_coding" | "bug_fix", // ZORUNLU
  "question": "Soru metni", // ZORUNLU: Soru metni
  "prompt": "Ek açıklama", // OPSİYONEL
  "description": "Detaylı açıklama", // OPSİYONEL
  "difficulty": "${cvInfo.level}", // OPSİYONEL: "beginner" | "intermediate" | "advanced"
  "resources": ["ipucu1", "ipucu2"], // OPSİYONEL: String array
  "languages": ["csharp", "javascript"], // OPSİYONEL: Sadece kodlama soruları için
  "starterCode": {"csharp": "kod", "javascript": "kod"}, // OPSİYONEL: Sadece live_coding için
  "buggyCode": "hatalı kod", // OPSİYONEL: Sadece bug_fix için
  "timeLimitMinutes": 15, // OPSİYONEL: Number
  "supportingText": "Ek bilgi", // OPSİYONEL
  "acceptanceCriteria": ["kriter1", "kriter2"] // OPSİYONEL: String array
}

ÖRNEK JSON YAPISI:
{
  "stage3_technical": {
    "testQuestions": [
      {
        "id": "tech_1",
        "type": "technical",
        "question": "Soru metni buraya",
        "difficulty": "${cvInfo.level}"
      },
      {
        "id": "tech_2",
        "type": "technical",
        "question": "Başka bir soru",
        "difficulty": "${cvInfo.level}"
      }
      // ... en az 8 soru olmalı
    ],
    "eliminationQuestions": [
      {
        "id": "elim_1",
        "type": "technical",
        "question": "Çok zor eleme sorusu",
        "difficulty": "advanced"
      },
      {
        "id": "elim_2",
        "type": "technical",
        "question": "Başka bir eleme sorusu",
        "difficulty": "advanced"
      }
      // ... en az 2 eleme sorusu olmalı
    ],
    ${isDeveloper ? `"liveCoding": {
      "id": "live_coding_1",
      "type": "live_coding",
      "question": "Kodlama sorusu",
      "languages": ["csharp"],
      "starterCode": {"csharp": "// Başlangıç kodu"},
      "difficulty": "${cvInfo.level}"
    },
    "bugFix": {
      "id": "bug_fix_1",
      "type": "bug_fix",
      "question": "Bug düzeltme sorusu",
      "buggyCode": "// Hatalı kod",
      "difficulty": "${cvInfo.level}"
    },` : `"liveCoding": null,
    "bugFix": null,`}
    "realWorldScenarios": [
      {
        "id": "scenario_1",
        "type": "case",
        "question": "Gerçek dünya senaryosu",
        "difficulty": "${cvInfo.level}"
      }
      // ... en az 2 senaryo olmalı
    ]
  }
}

DİKKAT: 
- JSON yapısı TAM OLARAK yukarıdaki örnekteki gibi olmalıdır
- "stage3_technical" ana anahtarı MUTLAKA olmalıdır
- testQuestions MUTLAKA bir array olmalı ve en az 8 eleman içermelidir
- eliminationQuestions MUTLAKA bir array olmalı ve en az 2 eleman içermelidir (çok zor sorular)
- realWorldScenarios MUTLAKA bir array olmalı ve en az 2 eleman içermelidir
- Her soru için "id" ve "type" ve "question" alanları ZORUNLUDUR
- ${isDeveloper ? "Developer pozisyonu için liveCoding ve bugFix MUTLAKA dahil edilmelidir (null değil, obje olmalı)" : "liveCoding ve bugFix opsiyoneldir, null olabilir veya dahil edilmeyebilir"}
`;

  try {
    const result = await createChatCompletion({
      schema: stage3QuestionsSchema,
      messages: [
        {
          role: "system",
          content: `Sen bir ${positionTypeLabels[cvInfo.positionType]} mülakat uzmanısın ve İK profesyonelisin. CV'lere göre çok kapsamlı, gerçekçi ve adil teknik mülakat soruları hazırlıyorsun. Pozisyon tipine göre (${positionTypeLabels[cvInfo.positionType]}) uygun teknik sorular hazırlıyorsun. 

KRİTİK KURALLAR - TÜM POZİSYON TİPLERİ İÇİN GEÇERLİ:
1. testQuestions: CV'deki teknolojilere (${cvInfo.technologies.join(", ") || "belirtilmemiş"}) göre KRİTİK ve NET sorular oluştur
   * En az 8 soru olmalı
   * Mimari, performans, güvenlik, optimizasyon odaklı sorular
   * Derinlemesine teknik bilgi gerektiren sorular
   * HER SORU CV'DEKİ TEKNOLOJİLERDEN EN AZ BİRİNE SPESİFİK OLMALI - Genel bilgi soruları ASLA sorma
   
   TEKNOLOJİ-SPESİFİK SORU ÜRETME KURALLARI (Pozisyon tipine göre):
   * Developer: CV'de .NET Core varsa middleware pipeline, dependency injection, async/await gibi konuları sor
   * Developer: SOLID prensipleri (özellikle Liskov Substitution, Interface Segregation) hakkında detaylı sorular sor
   * Developer: Data consistency, ACID properties, eventual consistency gibi veritabanı ve mimari konuları sor
   * Developer: Mikroservis mimarisinde data tutarlılığı, distributed transactions, Saga pattern gibi konuları sor
   * DevOps: CV'de Docker varsa container lifecycle, multi-stage build, image optimization gibi konuları sor
   * DevOps: CV'de Kubernetes varsa pod scheduling, service types, resource management gibi konuları sor
   * DevOps: CV'de Terraform varsa state management, modules, remote state gibi konuları sor
   * Test Engineer: CV'de Selenium varsa WebDriver architecture, wait strategies, Grid configuration gibi konuları sor
   * Test Engineer: CV'de Cypress varsa test execution model, async handling, best practices gibi konuları sor
   * Test Engineer: CV'de Jest varsa mocking strategies, snapshot testing, performance optimization gibi konuları sor
   * Security Engineer: CV'de OWASP varsa Top 10 vulnerabilities, security testing methodologies gibi konuları sor
   * Security Engineer: CV'de penetration testing tools varsa metodolojiler, tool comparison gibi konuları sor
   * Data Engineer: CV'de Spark varsa RDD vs DataFrame, shuffle optimization, broadcast variables gibi konuları sor
   * Data Engineer: CV'de ETL tools varsa pipeline optimization, error handling, incremental load gibi konuları sor
   * Cloud Engineer: CV'de AWS varsa Lambda optimization, VPC architecture, IAM policies gibi konuları sor
   * Cloud Engineer: CV'de Azure varsa Service Bus patterns, App Service vs Functions, cost optimization gibi konuları sor
   * System Admin: CV'de Linux varsa process management, systemd, file permissions gibi konuları sor
   * System Admin: CV'de scripting varsa automation strategies, error handling, best practices gibi konuları sor
   * Network Engineer: CV'de routing protocols varsa OSPF vs BGP, area types, route filtering gibi konuları sor
   * Network Engineer: CV'de switching varsa VLAN configuration, STP protocols, trunking gibi konuları sor
   
   ÖNEMLİ: Pozisyon tipine göre (${positionTypeLabels[cvInfo.positionType]}) uygun teknoloji konularını seç ve CV'deki teknolojilere göre spesifik sorular üret.

2. eliminationQuestions: ÇOK ZOR eleme soruları oluştur
   * En az 2 soru olmalı
   * Adayın gerçekten konuyu bilip bilmediğini test eden sorular
   * Sadece ezberlenmiş cevaplarla geçilemeyecek derinlikte
   * Gerçek production problemlerine benzer senaryolar
   * Mimari tasarım, distributed systems, scalability, performance optimization gibi konular
   * Pozisyon tipine ve CV'deki teknolojilere göre özelleştirilmiş eleme soruları
   * Örnek: "Mikroservis mimarisinde eventual consistency nasıl yönetilir? CAP theorem'e göre nasıl bir trade-off yapılmalıdır?"
   * Örnek: "10 milyon kullanıcılı bir sistemde zero-downtime deployment stratejisi nasıl olmalı?" (DevOps için)
   * Örnek: "1000+ test case'li bir projede test execution süresini %50 azaltmak için hangi stratejileri uygularsınız?" (Test Engineer için)

3. Her soru CV'deki teknolojilerden en az birine spesifik olmalı - Genel bilgi soruları ASLA sorma
4. Sorular pratik uygulama ve problem çözme odaklı olmalı, genel bilgi soruları değil
5. ${cvInfo.level} seviyeye uygun derinlikte sorular (beginner: temel, intermediate: pratik, advanced: mimari/optimizasyon)
6. Pozisyon tipine (${positionTypeLabels[cvInfo.positionType]}) göre uygun teknoloji ekosisteminden sorular seç
5. Her zaman JSON formatında yanıt ver ve aşağıdaki yapıya TAM OLARAK uy:
   - "stage3_technical" ana anahtarı ile başla
   - "testQuestions" array'i MUTLAKA en az 5 soru içermeli
   - "realWorldScenarios" array'i MUTLAKA en az 2 senaryo içermeli
   - ${isDeveloper ? '"liveCoding" ve "bugFix" MUTLAKA obje olarak dahil edilmeli (null değil)' : '"liveCoding" ve "bugFix" opsiyoneldir (null olabilir)'}
   - Her soru için "id", "type", "question" alanları zorunludur`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      timeoutMs: 90000, // 90 seconds for complex technical questions
      maxRetries: 3, // More retries for complex operations
    });

    if (!result.parsed) {
      console.error("[generateStage3Questions] AI yanıtı doğrulanamadı. Raw content:", result.content?.substring(0, 1000));
      throw new Error("AI yanıtı doğrulanamadı");
    }

    return result.parsed;
  } catch (error: any) {
    // Log detailed error information
    const errorDetails: any = {
      message: error?.message,
      name: error?.name,
    };
    
    // If it's an AIResponseValidationError, include zodErrors and payload
    if (error instanceof AIResponseValidationError) {
      errorDetails.zodErrors = error.zodErrors;
      errorDetails.payload = typeof error.payload === 'string' 
        ? error.payload.substring(0, 1000) 
        : error.payload;
    } else if (error && typeof error === 'object') {
      // Try to extract zodErrors and payload from error object
      if ('zodErrors' in error) {
        errorDetails.zodErrors = (error as any).zodErrors;
      }
      if ('payload' in error) {
        const payload = (error as any).payload;
        errorDetails.payload = typeof payload === 'string' 
          ? payload.substring(0, 1000) 
          : payload;
      }
    }
    
    console.error("[generateStage3Questions] Hata:", errorDetails);
    
    // If it's a validation error, include more details
    if (error instanceof AIResponseValidationError || error?.name === "AIResponseValidationError" || error?.message?.includes("JSON şeması")) {
      const zodErrors = error instanceof AIResponseValidationError 
        ? error.zodErrors 
        : errorDetails.zodErrors;
      
      const errorSummary = zodErrors 
        ? `\n\nHata detayları:\n${JSON.stringify(zodErrors, null, 2)}`
        : error?.message || "";
      
      // Create a new error that preserves the original error information
      const validationError = new Error(`Aşama 3 soruları oluşturulurken hata: AI yanıtı beklenen JSON şemasına uymuyor.${errorSummary}`);
      (validationError as any).zodErrors = zodErrors;
      (validationError as any).payload = errorDetails.payload;
      (validationError as any).name = "AIResponseValidationError";
      throw validationError;
    }
    
    throw new Error(`Aşama 3 soruları oluşturulurken hata: ${error?.message || "Bilinmeyen hata"}`);
  }
}

/**
 * CV'yi analiz edip mülakat soruları oluşturur (DEPRECATED - aşamalı versiyon kullanılmalı)
 * Bu fonksiyon backward compatibility için bırakılmıştır.
 * Yeni implementasyonlar için generateStage1Questions, generateStage2Questions, generateStage3Questions kullanılmalıdır.
 */
export async function generateInterviewFromCV(cvId: string): Promise<InterviewQuestions> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi devre dışı. OPENAI_API_KEY environment variable kontrol edin.");
  }

  // Tüm aşamaları sırayla oluştur
  const [stage1, stage2, stage3] = await Promise.all([
    generateStage1Questions(cvId),
    generateStage2Questions(cvId),
    generateStage3Questions(cvId),
  ]);

  return {
    stage1_introduction: stage1.stage1_introduction,
    stage2_experience: stage2.stage2_experience,
    stage3_technical: stage3.stage3_technical,
  };
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

  // Eleme soruları (çok zor sorular)
  if (questions.stage3_technical.eliminationQuestions && questions.stage3_technical.eliminationQuestions.length > 0) {
    questions.stage3_technical.eliminationQuestions.forEach((q, idx) => {
      allQuestions.push({
        ...q,
        id: q.id || `elimination_${idx + 1}`,
        stage: 3,
      });
    });
  }

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

