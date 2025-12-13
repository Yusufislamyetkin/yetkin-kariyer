import { createChatCompletion } from "./client";
import { z } from "zod";

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
}

interface InterviewQuestion {
  id: string;
  type?: string;
  question?: string;
  prompt?: string;
  description?: string;
  languages?: string[];
  buggyCode?: string;
  starterCode?: Record<string, string>;
  expectedFix?: string;
  acceptanceCriteria?: string[];
}

const answerSchema = z.object({
  textAnswer: z.string().optional(),
  codeAnswer: z.string().optional(),
  language: z.string().optional(),
});

/**
 * CV'deki bilgilere göre mülakat sorularına otomatik cevaplar oluşturur
 */
export async function generateInterviewAnswers(
  cvData: CVData,
  questions: InterviewQuestion[]
): Promise<{
  textResponses: Record<string, string>;
  codeResponses: Record<string, string>;
  codeLanguages: Record<string, string>;
}> {
  const textResponses: Record<string, string> = {};
  const codeResponses: Record<string, string> = {};
  const codeLanguages: Record<string, string> = {};

  // CV bilgilerini formatla
  const cvSummary = formatCVForPrompt(cvData);

  // Her soru için cevap oluştur
  for (const question of questions) {
    try {
      const questionType = question.type || "technical";
      
      if (questionType === "live_coding" || questionType === "bug_fix") {
        // Code soruları için
        const answer = await generateCodeAnswer(cvData, question, cvSummary);
        if (answer.codeAnswer) {
          codeResponses[question.id] = answer.codeAnswer;
          if (answer.language) {
            codeLanguages[question.id] = answer.language;
          } else if (question.languages && question.languages.length > 0) {
            codeLanguages[question.id] = question.languages[0];
          }
        }
      } else {
        // Text soruları için
        const answer = await generateTextAnswer(cvData, question, cvSummary);
        if (answer.textAnswer) {
          textResponses[question.id] = answer.textAnswer;
        }
      }
    } catch (error: any) {
      console.error(`[GENERATE_ANSWERS] Soru ${question.id} için cevap oluşturma hatası:`, error);
      // Hata durumunda boş cevap bırak
      if (question.type === "live_coding" || question.type === "bug_fix") {
        codeResponses[question.id] = "";
      } else {
        textResponses[question.id] = "";
      }
    }
  }

  return {
    textResponses,
    codeResponses,
    codeLanguages,
  };
}

/**
 * CV bilgilerini prompt için formatla
 */
function formatCVForPrompt(cvData: CVData): string {
  const parts: string[] = [];

  if (cvData.personalInfo?.name) {
    parts.push(`İsim: ${cvData.personalInfo.name}`);
  }

  if (cvData.summary) {
    parts.push(`Özet: ${cvData.summary}`);
  }

  if (cvData.experience && cvData.experience.length > 0) {
    parts.push("\nİş Deneyimleri:");
    cvData.experience.forEach((exp, idx) => {
      parts.push(
        `${idx + 1}. ${exp.position || "Pozisyon"} - ${exp.company || "Şirket"} (${exp.startDate || ""} - ${exp.endDate || "Devam ediyor"})`
      );
      if (exp.description) {
        parts.push(`   ${exp.description}`);
      }
    });
  }

  if (cvData.projects && cvData.projects.length > 0) {
    parts.push("\nProjeler:");
    cvData.projects.forEach((proj, idx) => {
      parts.push(`${idx + 1}. ${proj.name || "Proje"}`);
      if (proj.description) {
        parts.push(`   ${proj.description}`);
      }
      if (proj.technologies) {
        parts.push(`   Teknolojiler: ${proj.technologies}`);
      }
    });
  }

  if (cvData.skills && cvData.skills.length > 0) {
    parts.push(`\nYetenekler: ${cvData.skills.join(", ")}`);
  }

  if (cvData.education && cvData.education.length > 0) {
    parts.push("\nEğitim:");
    cvData.education.forEach((edu) => {
      parts.push(
        `- ${edu.degree || "Derece"} ${edu.field || ""} - ${edu.school || "Okul"}`
      );
    });
  }

  return parts.join("\n");
}

/**
 * Text soruları için cevap oluştur
 */
async function generateTextAnswer(
  cvData: CVData,
  question: InterviewQuestion,
  cvSummary: string
): Promise<{ textAnswer: string }> {
  const questionText = question.question || question.prompt || question.description || "";
  
  if (!questionText) {
    return { textAnswer: "" };
  }

  try {
    const result = await createChatCompletion({
      schema: answerSchema,
      messages: [
        {
          role: "system",
          content: `Sen bir iş görüşmesi adayısın. CV'ndeki bilgilere dayanarak mülakat sorularına samimi, profesyonel ve gerçekçi cevaplar veriyorsun. Cevapların CV'ndeki deneyim, projeler ve yeteneklerle tutarlı olmalı.`,
        },
        {
          role: "user",
          content: `CV Bilgilerim:
${cvSummary}

Mülakat Sorusu: ${questionText}

Bu soruya CV'mdeki bilgilere dayanarak samimi ve profesyonel bir cevap ver. Cevabın 2-4 paragraf arası olsun ve CV'mdeki deneyimlerimden örnekler içersin.`,
        },
      ],
      temperature: 0.7,
    });

    const answer = result.parsed?.textAnswer || "";
    return { textAnswer: answer };
  } catch (error: any) {
    console.error("[GENERATE_TEXT_ANSWER] Hata:", error);
    // Fallback: Basit bir cevap oluştur
    return {
      textAnswer: `CV'mdeki deneyimlerime göre, ${questionText} sorusuna cevap olarak şunu söyleyebilirim: ${cvData.summary || "Bu konuda deneyimim bulunmaktadır."}`,
    };
  }
}

/**
 * Code soruları için cevap oluştur
 */
async function generateCodeAnswer(
  cvData: CVData,
  question: InterviewQuestion,
  cvSummary: string
): Promise<{ codeAnswer: string; language?: string }> {
  const questionText = question.question || question.prompt || question.description || "";
  const languages = question.languages || ["javascript"];
  const preferredLanguage = languages[0] || "javascript";
  
  // CV'deki skills'e göre uygun dili seç
  const cvSkills = (cvData.skills || []).map(s => s.toLowerCase());
  let selectedLanguage = preferredLanguage;
  
  for (const lang of languages) {
    const langLower = lang.toLowerCase();
    if (
      cvSkills.some(skill => 
        skill.includes(langLower) || 
        skill.includes(langLower.replace("typescript", "ts")) ||
        skill.includes(langLower.replace("javascript", "js"))
      )
    ) {
      selectedLanguage = lang;
      break;
    }
  }

  try {
    // Bug fix soruları için
    if (question.type === "bug_fix" && question.buggyCode) {
      const result = await createChatCompletion({
        schema: answerSchema,
        messages: [
          {
            role: "system",
            content: `Sen deneyimli bir yazılım geliştiricisin. Hatalı kodu analiz edip düzeltiyorsun. CV'ndeki teknolojilere uygun şekilde kod yazıyorsun.`,
          },
          {
            role: "user",
            content: `CV Bilgilerim:
${cvSummary}

Hatalı Kod (${selectedLanguage}):
\`\`\`${selectedLanguage}
${question.buggyCode}
\`\`\`

${questionText ? `Soru: ${questionText}\n` : ""}
${question.expectedFix ? `Beklenen: ${question.expectedFix}\n` : ""}

Bu hatayı düzelt ve düzeltilmiş kodu ${selectedLanguage} dilinde yaz. Sadece düzeltilmiş kodu ver, açıklama yapma.`,
          },
        ],
        temperature: 0.3,
      });

      const codeAnswer = result.parsed?.codeAnswer || question.buggyCode;
      return { codeAnswer, language: selectedLanguage };
    }

    // Live coding soruları için
    const starterCode = question.starterCode?.[selectedLanguage] || "";
    
    const result = await createChatCompletion({
      schema: answerSchema,
      messages: [
        {
          role: "system",
          content: `Sen deneyimli bir yazılım geliştiricisin. CV'ndeki teknolojilere uygun şekilde kod yazıyorsun. Temiz, okunabilir ve etkili kod yazıyorsun.`,
        },
        {
          role: "user",
          content: `CV Bilgilerim:
${cvSummary}

Kodlama Sorusu: ${questionText}

${question.description ? `Açıklama: ${question.description}\n` : ""}
${starterCode ? `Başlangıç Kodu:\n\`\`\`${selectedLanguage}\n${starterCode}\n\`\`\`\n` : ""}
${question.acceptanceCriteria ? `Kabul Kriterleri:\n${question.acceptanceCriteria.map(c => `- ${c}`).join("\n")}\n` : ""}

Bu soruyu ${selectedLanguage} dilinde çöz. Sadece kodu ver, açıklama yapma.`,
        },
      ],
      temperature: 0.3,
    });

    const codeAnswer = result.parsed?.codeAnswer || starterCode;
    return { codeAnswer, language: selectedLanguage };
  } catch (error: any) {
    console.error("[GENERATE_CODE_ANSWER] Hata:", error);
    // Fallback: Starter code veya boş kod
    const fallbackCode = question.starterCode?.[selectedLanguage] || question.buggyCode || "";
    return { codeAnswer: fallbackCode, language: selectedLanguage };
  }
}
