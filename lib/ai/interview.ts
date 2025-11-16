import { z } from "zod";

import {
  createChatCompletion,
  ensureAIEnabled,
  isAIEnabled,
} from "./client";

const interviewAnalysisSchema = z.object({
  transcript: z.string().default(""),
  score: z.coerce.number().min(0).max(100),
  feedback: z
    .object({
      summary: z.string().optional().default(""),
      strengths: z.array(z.string()).optional().default([]),
      improvements: z.array(z.string()).optional().default([]),
      actionItems: z.array(z.string()).optional().default([]),
      categories: z
        .object({
          fluency: z.coerce.number().min(0).max(100).optional().default(0),
          content: z.coerce.number().min(0).max(100).optional().default(0),
          professionalism: z.coerce.number().min(0).max(100).optional().default(0),
          relevance: z.coerce.number().min(0).max(100).optional().default(0),
        })
        .optional()
        .default({
          fluency: 0,
          content: 0,
          professionalism: 0,
          relevance: 0,
        }),
    })
    .default({
      summary: "",
      strengths: [],
      improvements: [],
      actionItems: [],
      categories: {
        fluency: 0,
        content: 0,
        professionalism: 0,
        relevance: 0,
      },
    }),
});

const MIN_CHAR_THRESHOLD = 40;
const MIN_WORD_THRESHOLD = 6;

const normalizeWhitespace = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();

type ParsedTranscript = {
  raw: string | null;
  data: Record<string, any> | null;
  contentText: string;
  textCharCount: number;
  wordCount: number;
  hasCode: boolean;
  screenRecordingUrl: string | null;
  skippedRecording: boolean;
};

const defaultParsedTranscript: ParsedTranscript = {
  raw: null,
  data: null,
  contentText: "",
  textCharCount: 0,
  wordCount: 0,
  hasCode: false,
  screenRecordingUrl: null,
  skippedRecording: false,
};

const parseExistingTranscript = (value: string | null | undefined): ParsedTranscript => {
  if (!value) {
    return defaultParsedTranscript;
  }

  let parsed: Record<string, any> | null = null;

  try {
    parsed = JSON.parse(value);
  } catch (error) {
    const normalized = normalizeWhitespace(value);
    const wordCount = normalized.length > 0 ? normalized.split(/\s+/).filter(Boolean).length : 0;
    return {
      raw: value,
      data: null,
      contentText: normalized,
      textCharCount: normalized.length,
      wordCount,
      hasCode: false,
      screenRecordingUrl: null,
      skippedRecording: false,
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return defaultParsedTranscript;
  }

  const answers = (parsed as Record<string, any>).answers ?? {};
  const textAnswers = (answers?.text ?? {}) as Record<string, unknown>;
  const codeAnswers = (answers?.code ?? {}) as Record<string, unknown>;
  const languageSelections = (answers?.languageSelections ?? {}) as Record<string, unknown>;
  const questionOrder = Array.isArray(parsed?.questionOrder)
    ? (parsed?.questionOrder as Array<string | number>)
    : Object.keys(textAnswers);

  const segments: string[] = [];
  let textCharCount = 0;
  let wordCount = 0;
  let hasCode = false;

  const pushTextSegment = (label: string, content: string) => {
    const normalized = content.trim();
    if (!normalized) return;
    segments.push(`${label}:\n${normalized}`);
    textCharCount += normalized.length;
    wordCount += normalized.split(/\s+/).filter(Boolean).length;
  };

  const pushCodeSegment = (label: string, content: string, language?: string) => {
    const normalized = content.trim();
    if (!normalized) return;
    hasCode = true;
    segments.push(`${label}${language ? ` (${language})` : ""}:\n${normalized}`);
  };

  const uniqueIds = new Set<string>(
    questionOrder.map((item, index) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return `question_${item}`;
      return `question_${index + 1}`;
    })
  );

  Object.keys(textAnswers).forEach((id) => uniqueIds.add(id));
  Object.keys(codeAnswers).forEach((id) => uniqueIds.add(id));

  Array.from(uniqueIds).forEach((questionId, index) => {
    const label = `Soru ${index + 1}`;
    const textAnswer = textAnswers[questionId];
    const codeAnswer = codeAnswers[questionId];
    const selectedLanguage = languageSelections[questionId];

    if (typeof textAnswer === "string") {
      pushTextSegment(`${label} (Metin)`, textAnswer);
    }

    if (typeof codeAnswer === "string") {
      const language =
        typeof selectedLanguage === "string" ? selectedLanguage.toUpperCase() : undefined;
      pushCodeSegment(`${label} (Kod)`, codeAnswer, language);
    }
  });

  let contentText = segments.join("\n\n").trim();
  if (!contentText && typeof parsed?.content === "string") {
    const normalizedContent = (parsed.content as string).trim();
    contentText = normalizedContent;
    textCharCount = normalizedContent.length;
    wordCount = normalizedContent.split(/\s+/).filter(Boolean).length;
  }

  const screenRecordingUrl =
    typeof parsed?.screenRecordingUrl === "string" ? (parsed.screenRecordingUrl as string) : null;

  const skippedRecording =
    typeof parsed?.skippedRecording === "boolean" ? (parsed.skippedRecording as boolean) : false;

  return {
    raw: value,
    data: parsed,
    contentText,
    textCharCount,
    wordCount,
    hasCode,
    screenRecordingUrl,
    skippedRecording,
  };
};

const buildTranscriptRecord = ({
  base,
  content,
  screenRecordingUrl,
  skippedRecording,
}: {
  base: Record<string, any> | null;
  content: string;
  screenRecordingUrl: string | null;
  skippedRecording: boolean;
}) => {
  const payload: Record<string, any> = base && typeof base === "object" ? { ...base } : {};
  payload.content = content;
  if (screenRecordingUrl) {
    payload.screenRecordingUrl = screenRecordingUrl;
  }
  payload.skippedRecording = skippedRecording;
  payload.lastAnalyzedAt = new Date().toISOString();
  return JSON.stringify(payload);
};

const buildEmptyFeedback = () => ({
  summary: "Mülakat sırasında değerlendirilebilecek düzeyde sesli ya da yazılı yanıt bulunamadı.",
  strengths: [
    "Oturumu başlatarak mülakat pratiği için ilk adımı attınız.",
    "Teknik ortamı test etmek için oturum açmanız hazırlık alışkanlığı kazandırır.",
    "Hazırlık sürecinizi sürdürmeniz motivasyonunuzu gösteriyor.",
  ],
  improvements: [
    "Soruları yüksek sesle veya ayrıntılı yazılı yanıtlarla cevaplayın.",
    "Kamera ve mikrofon izinlerini kontrol edip kaydı başlattığınızdan emin olun.",
    "Her soru için düşüncelerinizi yapılandırıp örneklerle açıklayın.",
  ],
  actionItems: [
    "Bir sonraki oturumdan önce mikrofon/kamera testleri yapın.",
    "Sorulara sesli yanıt vererek en az 2-3 dakikalık açıklamalar yapmayı hedefleyin.",
    "Yanıtlarınızı STAR metoduna göre planlayıp prova edin.",
  ],
  categories: {
    fluency: 0,
    content: 0,
    professionalism: 0,
    relevance: 0,
  },
});

const TRANSCRIPTION_MODEL =
  process.env.OPENAI_TRANSCRIPTION_MODEL ?? "whisper-1";

const buildInterviewAnalysisPrompt = ({
  transcript,
  interviewTitle,
}: {
  transcript: string;
  interviewTitle?: string;
}) => `
Bir mülakat performansını analiz et. Aşağıdaki kriterlere göre değerlendirme yap.

Mülakat Başlığı: ${interviewTitle ?? "Bilinmiyor"}
Transkript:
"""
${transcript}
"""

Analiz Kuralları:
1. Adayı dört başlıkta (akıcılık, içerik, profesyonellik, cevap uygunluğu) 0-100 arasında puanla.
2. En az üç güçlü yön ve en az üç gelişim alanı belirle.
3. Adayın hemen uygulayabileceği somut aksiyon maddeleri öner (en az 2-3 adet).
4. Genel bir özet paragrafı hazırla (2-3 cümle).
5. Tonun yapıcı, destekleyici ve örnekli olsun.

Puanlama Kriterleri:
- Akıcılık (fluency): Konuşma akıcılığı, duraksamalar, kelime seçimi
- İçerik (content): Cevabın derinliği, teknik doğruluk, örnekler
- Profesyonellik (professionalism): Dil kullanımı, saygı, özgüven
- Cevap Uygunluğu (relevance): Soruya uygunluk, konu dışına çıkmama

JSON formatında yanıt ver (schema'ya uygun olmalı).
`;

/**
 * Video URL'inden ses çıkarma ve transkript oluşturma
 * OpenAI Whisper API video dosyalarını doğrudan desteklemediği için,
 * önce video'dan ses çıkarmak veya alternatif yöntemler kullanmak gerekir
 */
const extractAudioFromVideo = async (videoUrl: string): Promise<File | null> => {
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Video indirilemedi: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const arrayBuffer = await response.arrayBuffer();

    // Eğer zaten ses dosyası formatındaysa, direkt kullan
    if (contentType.startsWith("audio/")) {
      const extension = contentType.includes("mp3") ? "mp3" : 
                      contentType.includes("wav") ? "wav" : 
                      contentType.includes("m4a") ? "m4a" : "mp3";
      return new File([arrayBuffer], `audio.${extension}`, { type: contentType });
    }

    // Video dosyası için: OpenAI Whisper API bazı video formatlarını destekleyebilir
    // WebM formatını deneyelim (Whisper API bazı durumlarda kabul edebilir)
    if (contentType.includes("webm") || contentType.includes("video")) {
      // Not: Whisper API video dosyalarını doğrudan desteklemiyor
      // Production'da FFmpeg veya başka bir servis kullanılmalı
      // Şimdilik video dosyasını olduğu gibi göndermeyi deniyoruz
      // Eğer başarısız olursa, yazılı cevaplardan analiz yapılacak
      const extension = contentType.includes("webm") ? "webm" : 
                       contentType.includes("mp4") ? "mp4" : 
                       contentType.includes("mov") ? "mov" : "webm";
      return new File([arrayBuffer], `video.${extension}`, { type: contentType });
    }

    return null;
  } catch (error) {
    console.error("[extractAudioFromVideo] Hata:", error);
    return null;
  }
};

type TimestampedSegment = {
  start: number; // seconds
  end: number; // seconds
  text: string;
};

type TimestampedTranscript = {
  text: string;
  segments: TimestampedSegment[];
};

const transcribeVideo = async (
  videoUrl: string,
  withTimestamps = false
): Promise<string | TimestampedTranscript | null> => {
  try {
    const client = await ensureAIEnabled();
    
    console.log("[transcribeVideo] Video URL'inden ses çıkarılıyor:", videoUrl);
    const audioFile = await extractAudioFromVideo(videoUrl);
    
    if (!audioFile) {
      console.warn("[transcribeVideo] Video'dan ses çıkarılamadı");
      return null;
    }

    console.log("[transcribeVideo] Whisper API'ye gönderiliyor, model:", TRANSCRIPTION_MODEL);
    
    try {
      const transcription = await client.audio.transcriptions.create({
        file: audioFile,
        model: TRANSCRIPTION_MODEL,
        response_format: withTimestamps ? "verbose_json" : "text",
        temperature: 0.2,
        language: "tr", // Türkçe için
        timestamp_granularities: withTimestamps ? ["segment"] : undefined,
      });

      if (withTimestamps && typeof transcription === "object" && "segments" in transcription) {
        const verboseTranscription = transcription as any;
        const segments: TimestampedSegment[] = (verboseTranscription.segments || []).map(
          (seg: any) => ({
            start: seg.start || 0,
            end: seg.end || 0,
            text: seg.text || "",
          })
        );
        
        const result: TimestampedTranscript = {
          text: verboseTranscription.text || "",
          segments,
        };
        console.log("[transcribeVideo] Zaman damgalı transkript başarılı, segment sayısı:", segments.length);
        return result;
      }

      const text =
        typeof transcription === "string"
          ? transcription
          : (transcription as { text?: string }).text;

      const result = text?.trim() || null;
      console.log("[transcribeVideo] Transkript başarılı, uzunluk:", result?.length || 0);
      return result;
    } catch (whisperError: any) {
      // Whisper API video formatını desteklemiyorsa hata verebilir
      if (whisperError?.message?.includes("video") || 
          whisperError?.message?.includes("format") ||
          whisperError?.status === 400) {
        console.warn("[transcribeVideo] Video formatı desteklenmiyor, yazılı cevaplardan analiz yapılacak");
        return null;
      }
      throw whisperError;
    }
  } catch (error: any) {
    console.error("[transcribeVideo] Transkript hatası:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });
    return null;
  }
};

/**
 * Transkripti sorulara göre segmentlere ayırır
 * Her soru için ilgili transkript segmentini bulur
 */
const segmentTranscriptByQuestions = (
  transcript: string | TimestampedTranscript,
  questions: Array<{ id: string; question?: string; prompt?: string }>,
  questionOrder?: string[]
): Record<string, string> => {
  const segments: Record<string, string> = {};

  // Eğer zaman damgalı transkript yoksa, basit bir yaklaşım kullan
  if (typeof transcript === "string") {
    // Transkripti eşit parçalara böl (her soru için)
    const lines = transcript.split("\n").filter((line) => line.trim().length > 0);
    const questionsPerSegment = Math.max(1, Math.floor(lines.length / questions.length));

    questions.forEach((question, index) => {
      const startIndex = index * questionsPerSegment;
      const endIndex = index === questions.length - 1 ? lines.length : (index + 1) * questionsPerSegment;
      const questionLines = lines.slice(startIndex, endIndex);
      segments[question.id] = questionLines.join("\n").trim();
    });

    return segments;
  }

  // Zaman damgalı transkript varsa, daha akıllı segmentasyon yap
  const timestampedTranscript = transcript as TimestampedTranscript;
  const orderedQuestionIds = questionOrder || questions.map((q) => q.id);

  // Her soru için yaklaşık süreyi hesapla (eşit dağıtım)
  const totalDuration = timestampedTranscript.segments.length > 0
    ? timestampedTranscript.segments[timestampedTranscript.segments.length - 1].end
    : 0;
  const durationPerQuestion = totalDuration / questions.length;

  orderedQuestionIds.forEach((questionId, index) => {
    const startTime = index * durationPerQuestion;
    const endTime = index === questions.length - 1 ? totalDuration : (index + 1) * durationPerQuestion;

    // Bu zaman aralığındaki segmentleri bul
    const relevantSegments = timestampedTranscript.segments.filter(
      (seg) => seg.start >= startTime && seg.end <= endTime
    );

    if (relevantSegments.length > 0) {
      segments[questionId] = relevantSegments.map((seg) => seg.text).join(" ").trim();
    } else {
      // Eğer segment bulunamazsa, boş string
      segments[questionId] = "";
    }
  });

  return segments;
};

const questionCorrectnessSchema = z.object({
  correct: z.boolean(),
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().default(""),
  details: z.string().default(""),
});

type QuestionCorrectnessResult = z.infer<typeof questionCorrectnessSchema>;

/**
 * Tek bir soru için doğruluk kontrolü yapar
 */
const analyzeQuestionCorrectness = async ({
  question,
  answerTranscript,
  questionType,
}: {
  question: { id: string; question?: string; prompt?: string; type?: string };
  answerTranscript: string;
  questionType?: string;
}): Promise<QuestionCorrectnessResult> => {
  try {
    if (!isAIEnabled()) {
      throw new Error("AI servisi devre dışı");
    }

    const questionText = question.question || question.prompt || "Soru metni bulunamadı";
    const type = questionType || question.type || "unknown";

    // Eğer cevap transkripti yoksa veya çok kısaysa
    if (!answerTranscript || answerTranscript.trim().length < 10) {
      return {
        correct: false,
        score: 0,
        feedback: "Bu soruya yeterli cevap verilmemiş.",
        details: "Transkriptte bu soruya ait yeterli içerik bulunamadı.",
      };
    }

    console.log(`[analyzeQuestionCorrectness] Soru analizi başlatılıyor: ${question.id}`);

    // Soru tipine göre farklı prompt'lar
    const getPromptByType = (qType: string) => {
      switch (qType) {
        case "technical":
          return "Bu teknik bir sorudur. Cevabın teknik doğruluğunu, derinliğini ve örneklerin uygunluğunu değerlendir.";
        case "behavioral":
          return "Bu davranışsal bir sorudur. Cevabın STAR metoduna (Situation, Task, Action, Result) uygunluğunu, somut örnekler içerip içermediğini değerlendir.";
        case "case":
          return "Bu bir vaka çalışması sorusudur. Cevabın analitik yaklaşımını, çözüm önerilerinin mantıklılığını ve yapılandırılmış düşünmeyi değerlendir.";
        case "live_coding":
        case "bug_fix":
          return "Bu bir kodlama sorusudur. Cevabın kod kalitesini, algoritma doğruluğunu ve çözüm yaklaşımını değerlendir.";
        default:
          return "Cevabın soruya uygunluğunu, içeriğin derinliğini ve kalitesini değerlendir.";
      }
    };

    const typeSpecificGuidance = getPromptByType(type);

    const prompt = `
Bir mülakat sorusuna verilen cevabı analiz et ve doğruluğunu değerlendir.

Soru:
"""
${questionText}
"""

Soru Tipi: ${type}
${typeSpecificGuidance}

Adayın Cevabı (Transkript):
"""
${answerTranscript}
"""

Değerlendirme Kriterleri:
1. Cevap soruya doğrudan ve uygun şekilde yanıt veriyor mu?
2. Cevap teknik olarak doğru mu? (teknik sorular için)
3. Cevap yeterince detaylı ve örnekler içeriyor mu?
4. Cevap profesyonel ve yapılandırılmış mı?

JSON formatında yanıt ver:
{
  "correct": true/false,
  "score": 0-100 arası puan,
  "feedback": "Kısa geri bildirim (2-3 cümle)",
  "details": "Detaylı açıklama (opsiyonel)"
}
`;

    const { parsed: result } = await createChatCompletion({
      schema: questionCorrectnessSchema,
      messages: [
        {
          role: "system",
          content:
            "Sen bir mülakat değerlendirme uzmanısın. Sorulara verilen cevapların doğruluğunu ve kalitesini objektif olarak değerlendiriyorsun. Her zaman JSON formatında yanıt ver.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Daha tutarlı sonuçlar için düşük temperature
    });

    if (!result) {
      throw new Error("AI yanıtı doğrulanamadı");
    }

    console.log(`[analyzeQuestionCorrectness] Soru ${question.id} analizi tamamlandı, puan: ${result.score}`);

    // Ensure details and feedback are always strings
    return {
      ...result,
      feedback: result.feedback ?? "",
      details: result.details ?? "",
    };
  } catch (error: any) {
    console.error(`[analyzeQuestionCorrectness] Hata (soru ${question.id}):`, {
      message: error?.message,
      error,
    });

    // Fallback: Varsayılan sonuç
    return {
      correct: false,
      score: 0,
      feedback: "Analiz sırasında bir hata oluştu.",
      details: error?.message || "Bilinmeyen hata",
    };
  }
};

export async function analyzeInterview({
  videoUrl,
  interviewTitle,
  existingTranscript,
  questions,
  questionOrder,
}: {
  videoUrl?: string | null;
  interviewTitle?: string;
  existingTranscript?: string | null;
  questions?: Array<{ id: string; question?: string; prompt?: string; type?: string }>;
  questionOrder?: string[];
}): Promise<{
  transcript: string;
  score: number;
  feedback: any;
  questionScores?: Record<string, number>;
  questionFeedback?: Record<string, any>;
  questionCorrectness?: Record<string, any>;
}> {
  const parsedTranscript = parseExistingTranscript(existingTranscript);

  try {
    if (!isAIEnabled()) {
      console.warn("[analyzeInterview] AI servisi devre dışı");
      throw new Error("AI servisi devre dışı. Lütfen yöneticiye başvurun.");
    }

    console.log("[analyzeInterview] Analiz başlatılıyor", {
      hasVideoUrl: !!videoUrl,
      hasExistingTranscript: !!existingTranscript,
      existingTranscriptLength: parsedTranscript.contentText.length,
    });

    // Mevcut transkripti al
    let combinedTranscript = parsedTranscript.contentText;
    let timestampedTranscript: TimestampedTranscript | null = null;

    // Eğer mevcut transkript yetersizse ve video URL'i varsa, video'dan transkript çıkar
    if ((!combinedTranscript || combinedTranscript.length < MIN_CHAR_THRESHOLD) && videoUrl) {
      console.log("[analyzeInterview] Video'dan transkript çıkarılıyor...");
      try {
        // Soru bazlı analiz için zaman damgalı transkript al
        const transcribed = await transcribeVideo(videoUrl, questions && questions.length > 0);
        
        if (transcribed) {
          if (typeof transcribed === "string") {
            combinedTranscript = [combinedTranscript, transcribed]
              .filter(Boolean)
              .join("\n\n")
              .trim();
            console.log("[analyzeInterview] Video transkripti eklendi, toplam uzunluk:", combinedTranscript.length);
          } else {
            // Zaman damgalı transkript
            timestampedTranscript = transcribed;
            combinedTranscript = transcribed.text || combinedTranscript;
            console.log("[analyzeInterview] Zaman damgalı transkript eklendi, segment sayısı:", transcribed.segments.length);
          }
        } else {
          console.warn("[analyzeInterview] Video'dan transkript çıkarılamadı, yazılı cevaplar kullanılacak");
        }
      } catch (transcribeError: any) {
        console.error("[analyzeInterview] Transkript çıkarma hatası:", {
          message: transcribeError?.message,
          error: transcribeError,
        });
        // Transkript çıkarma başarısız olsa bile, yazılı cevaplardan devam et
      }
    }

    // Transkripti temizle ve kontrol et
    const cleanedTranscript = normalizeWhitespace(combinedTranscript);
    const transcriptTextLength = cleanedTranscript.length;
    const effectiveWordCount = cleanedTranscript
      ? cleanedTranscript.split(/\s+/).filter(Boolean).length
      : 0;
    const hasMeaningfulContent =
      transcriptTextLength >= MIN_CHAR_THRESHOLD ||
      effectiveWordCount >= MIN_WORD_THRESHOLD;

    console.log("[analyzeInterview] Transkript kontrolü:", {
      textLength: transcriptTextLength,
      wordCount: effectiveWordCount,
      hasMeaningfulContent,
    });

    // Eğer anlamlı içerik yoksa, fallback döndür
    if (!hasMeaningfulContent) {
      console.warn("[analyzeInterview] Yetersiz içerik, fallback döndürülüyor");
      const fallbackTranscript =
        cleanedTranscript ||
        "Yanıt kaydı bulunamadı. Kaydı başlattığınızdan ve soruları yanıtladığınızdan emin olun.";
      const transcriptRecord = buildTranscriptRecord({
        base: parsedTranscript.data,
        content: fallbackTranscript,
        screenRecordingUrl: parsedTranscript.screenRecordingUrl,
        skippedRecording: parsedTranscript.skippedRecording || !videoUrl,
      });

      return {
        transcript: transcriptRecord,
        score: 0,
        feedback: buildEmptyFeedback(),
      };
    }

    // AI analizi yap
    console.log("[analyzeInterview] AI analizi başlatılıyor...");
    const transcriptForPrompt = cleanedTranscript;

    let analysis;
    try {
      const result = await createChatCompletion({
        schema: interviewAnalysisSchema,
        messages: [
          {
            role: "system",
            content:
              "Sen bir mülakat değerlendirme uzmanısın. Kullanıcıların mülakat performanslarını analiz edip yapıcı geri bildirim veriyorsun. Her zaman JSON formatında yanıt ver.",
          },
          {
            role: "user",
            content: buildInterviewAnalysisPrompt({
              transcript: transcriptForPrompt,
              interviewTitle,
            }),
          },
        ],
        temperature: 0.4,
      });

      analysis = result.parsed;
    } catch (aiError: any) {
      console.error("[analyzeInterview] AI analiz hatası:", {
        message: aiError?.message,
        error: aiError,
      });
      throw new Error(
        `AI analizi başarısız oldu: ${aiError?.message || "Bilinmeyen hata"}`
      );
    }

    if (!analysis) {
      throw new Error("AI yanıtı doğrulanamadı veya boş döndü");
    }

    console.log("[analyzeInterview] AI analizi tamamlandı", {
      score: analysis.score,
      hasFeedback: !!analysis.feedback,
    });

    // Soru bazlı analiz yap (eğer sorular verilmişse)
    let questionScores: Record<string, number> = {};
    let questionFeedback: Record<string, any> = {};
    let questionCorrectness: Record<string, any> = {};

    if (questions && questions.length > 0) {
      console.log("[analyzeInterview] Soru bazlı analiz başlatılıyor...");
      
      // Transkripti sorulara göre segmentlere ayır
      const transcriptForSegmentation = timestampedTranscript || cleanedTranscript;
      const questionSegments = segmentTranscriptByQuestions(
        transcriptForSegmentation,
        questions,
        questionOrder
      );

      // Her soru için analiz yap
      const questionAnalyses = await Promise.allSettled(
        questions.map(async (question) => {
          const answerSegment = questionSegments[question.id] || "";
          const result = await analyzeQuestionCorrectness({
            question,
            answerTranscript: answerSegment,
            questionType: question.type,
          });
          return { questionId: question.id, result };
        })
      );

      // Sonuçları topla
      questionAnalyses.forEach((settled, index) => {
        const question = questions[index];
        if (!question) return;

        if (settled.status === "fulfilled") {
          const { questionId, result } = settled.value;
          questionScores[questionId] = result.score;
          questionFeedback[questionId] = {
            feedback: result.feedback,
            details: result.details,
          };
          questionCorrectness[questionId] = {
            correct: result.correct,
            score: result.score,
            details: result.details,
          };
        } else {
          // Hata durumunda varsayılan değerler
          questionScores[question.id] = 0;
          questionFeedback[question.id] = {
            feedback: "Analiz sırasında hata oluştu.",
            details: settled.reason?.message || "Bilinmeyen hata",
          };
          questionCorrectness[question.id] = {
            correct: false,
            score: 0,
            details: settled.reason?.message || "Bilinmeyen hata",
          };
        }
      });

      console.log("[analyzeInterview] Soru bazlı analiz tamamlandı", {
        analyzedQuestions: Object.keys(questionScores).length,
        totalQuestions: questions.length,
      });

      // Genel puanı soru bazlı puanlardan hesapla (eğer soru analizleri varsa)
      if (Object.keys(questionScores).length > 0) {
        const averageScore = Math.round(
          Object.values(questionScores).reduce((sum, score) => sum + score, 0) /
            Object.values(questionScores).length
        );
        // Genel puanı güncelle (soru bazlı puan %70, genel analiz %30 ağırlıklı)
        analysis.score = Math.round(analysis.score * 0.3 + averageScore * 0.7);
        console.log("[analyzeInterview] Genel puan güncellendi (soru bazlı):", analysis.score);
      }
    }

    // Final transkripti oluştur
    const finalTranscriptText =
      normalizeWhitespace(analysis.transcript || "") ||
      transcriptForPrompt ||
      "Transkript oluşturulamadı.";

    const transcriptRecord = buildTranscriptRecord({
      base: parsedTranscript.data,
      content: finalTranscriptText,
      screenRecordingUrl: parsedTranscript.screenRecordingUrl,
      skippedRecording: parsedTranscript.skippedRecording || !videoUrl,
    });

    return {
      transcript: transcriptRecord,
      score: analysis.score || 0,
      feedback: analysis.feedback || buildEmptyFeedback(),
      questionScores: Object.keys(questionScores).length > 0 ? questionScores : undefined,
      questionFeedback: Object.keys(questionFeedback).length > 0 ? questionFeedback : undefined,
      questionCorrectness: Object.keys(questionCorrectness).length > 0 ? questionCorrectness : undefined,
    };
  } catch (error: any) {
    console.error("[analyzeInterview] Genel hata:", {
      message: error?.message,
      stack: error?.stack,
      error,
    });

    // Fallback: Mevcut transkripti kullan
    const fallbackTranscript = buildTranscriptRecord({
      base: parsedTranscript.data,
      content:
        parsedTranscript.contentText ||
        "Transkript oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
      screenRecordingUrl: parsedTranscript.screenRecordingUrl,
      skippedRecording: parsedTranscript.skippedRecording || !videoUrl,
    });

    return {
      transcript: fallbackTranscript,
      score: 0,
      feedback: {
        ...buildEmptyFeedback(),
        summary: `Analiz şu anda tamamlanamadı: ${error?.message || "Bilinmeyen hata"}. Lütfen daha sonra tekrar deneyin veya yöneticiye başvurun.`,
      },
      questionScores: undefined,
      questionFeedback: undefined,
      questionCorrectness: undefined,
    };
  }
}

