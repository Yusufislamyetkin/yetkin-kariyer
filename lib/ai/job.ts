import { z } from "zod";

import { createChatCompletion, isAIEnabled } from "./client";

const jobMatchSchema = z.object({
  matchScore: z.coerce.number().min(0).max(100).default(0),
  summary: z.string().default(""),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
  keywords: z
    .array(
      z.object({
        term: z.string(),
        matched: z.boolean().optional().default(false),
        note: z.string().optional().default(""),
      })
    )
    .default([]),
  coverLetter: z.string().default(""),
});

export type JobMatchAnalysis = z.infer<typeof jobMatchSchema>;

const buildJobMatchPrompt = ({
  cvData,
  jobTitle,
  jobDescription,
  jobRequirements,
}: {
  cvData: unknown;
  jobTitle: string;
  jobDescription?: string;
  jobRequirements?: unknown;
}) => `
Bir adayın CV'sini ve hedef iş ilanını karşılaştırarak yapılandırılmış bir analiz üret.

İş Başlığı: ${jobTitle}
İş Tanımı:
${jobDescription ?? "Belirtilmemiş"}

İş Gereksinimleri:
${JSON.stringify(jobRequirements ?? {}, null, 2)}

Adayın CV Verisi:
${JSON.stringify(cvData, null, 2)}

Kurallar:
- JSON formatında yanıt ver ve başka açıklama ekleme.
- "matchScore" alanı 0-100 arası genel uyumluluk skorunu temsil etsin.
- "strengths" adayın öne çıkan 3-5 niteliğini içersin.
- "gaps" adayın eksik olduğu kritik alanları listele.
- "nextSteps" uygulanabilir öneriler versin (ör. kurs, proje fikri, mentorluk).
- "keywords" listesinde her terim için "matched" bilgisini belirt.
- "coverLetter" alanında 3 paragrafı geçmeyen, Türkçe bir ön yazı oluştur. 

Beklenen JSON:
{
  "matchScore": 82,
  "summary": "Genel değerlendirme metni",
  "strengths": ["güçlü yön 1"],
  "gaps": ["eksik alan 1"],
  "nextSteps": ["aksiyon 1"],
  "keywords": [
    { "term": "React", "matched": true, "note": "3 yıllık deneyim" }
  ],
  "coverLetter": "Sayın ... ile başlayan kısa ön yazı"
}
`;

export async function analyzeJobMatch({
  cvData,
  jobTitle,
  jobDescription,
  jobRequirements,
}: {
  cvData: unknown;
  jobTitle: string;
  jobDescription?: string;
  jobRequirements?: unknown;
}): Promise<JobMatchAnalysis> {
  if (!isAIEnabled()) {
    throw new Error("AI servisi şu anda kullanılamıyor");
  }

  const { parsed } = await createChatCompletion({
    schema: jobMatchSchema,
    messages: [
      {
        role: "system",
        content:
          "Sen kariyer koçu ve işe alım uzmanısın. CV ile iş ilanını karşılaştırır, uyumluluk raporu ve örnek ön yazı üretirsin.",
      },
      {
        role: "user",
        content: buildJobMatchPrompt({
          cvData,
          jobTitle,
          jobDescription,
          jobRequirements,
        }),
      },
    ],
    temperature: 0.4,
  });

  if (!parsed) {
    throw new Error("Job match analizi başarısız oldu");
  }

  return parsed as JobMatchAnalysis;
}


