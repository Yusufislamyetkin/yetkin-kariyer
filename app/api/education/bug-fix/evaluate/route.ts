import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureAIEnabled, isAIEnabled } from "@/lib/ai/client";

export interface BugFixEvaluateRequest {
  taskDescription: string;
  buggyCode: string;
  fixedCode: string;
  expectedOutput: string;
  userOutput: string;
  language: string;
  expectedFix?: string | null;
  acceptanceCriteria?: string[];
}

export interface BugFixEvaluateResponse {
  feedback: string;
  correctedCode: string;
  comments: string[];
  isCorrect: boolean;
  errors: Array<{ line: number; description: string }>;
  specificErrors?: Array<{ location: string; issue: string; fix: string }>;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: "AI servisi şu anda kullanılamıyor" },
        { status: 503 }
      );
    }

    const body: BugFixEvaluateRequest = await request.json();
    const {
      taskDescription,
      buggyCode,
      fixedCode,
      expectedOutput,
      userOutput,
      language,
      expectedFix,
      acceptanceCriteria,
    } = body;

    if (!taskDescription || !buggyCode || !fixedCode || !userOutput) {
      return NextResponse.json(
        { error: "Eksik parametreler: taskDescription, buggyCode, fixedCode ve userOutput gerekli" },
        { status: 400 }
      );
    }

    const openai = await ensureAIEnabled();

    const acceptanceCriteriaText = acceptanceCriteria && acceptanceCriteria.length > 0
      ? `\nKABUL KRİTERLERİ:\n${acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
      : "";

    const expectedFixText = expectedFix ? `\nBEKLENEN DÜZELTME AÇIKLAMASI:\n${expectedFix}` : "";

    const prompt = `Sen bir bug fix (hata düzeltme) değerlendirme uzmanısın. Öğrencinin hatalı kodu düzeltip düzeltmediğini analiz et.

GÖREV AÇIKLAMASI:
${taskDescription}
${expectedFixText}

HATALI KOD (${language}):
\`\`\`${language}
${buggyCode}
\`\`\`

ÖĞRENCİNİN DÜZELTTİĞİ KOD (${language}):
\`\`\`${language}
${fixedCode}
\`\`\`

BEKLENEN ÇIKTI:
${expectedOutput}

ÖĞRENCİNİN ÜRETTİĞİ ÇIKTI:
${userOutput}
${acceptanceCriteriaText}

DEĞERLENDİRME GÖREVİN:
1. Öğrenci hatayı doğru şekilde düzeltmiş mi? (isCorrect: true/false)
2. Çıktı beklenen çıktı ile eşleşiyor mu?
3. Acceptance criteria'lar karşılanmış mı?
4. Kodda hatalar var mı? Varsa hangi satırlarda ve ne tür hatalar? (errors array)
5. **ÖNEMLİ**: Kullanıcının yaptığı hatayı veya eksikliği ÖZELLİKLE BELİRT. Hangi satırda, hangi kod bloğunda, ne tür bir sorun var?
6. **ÖNEMLİ**: Kullanıcının nereyi düzeltmesi gerektiğini ÖZELLİKLE BELİRT. Satır numarası, kod bloğu, değişken adı, fonksiyon adı gibi spesifik bilgiler ver.
7. Kodun doğru versiyonunu yaz, yorum satırları ile açıklamalar ekle (correctedCode)
8. Genel bir geri bildirim ver (feedback)
9. Önemli noktalar için yorum satırı açıklamaları listele (comments array)
10. Her hata için spesifik bilgi ver: location (örn: "Satır 5", "for döngüsü", "if bloğu"), issue (hatanın ne olduğu), fix (nasıl düzeltileceği)

ÖNEMLİ KURALLAR:
- correctedCode'da yorum satırları ile açıklamalar ekle (// veya /* */ formatında)
- Her önemli değişiklik veya düzeltme için yorum satırı ekle
- Yorum satırları Türkçe olmalı ve açıklayıcı olmalı
- Eğer kod doğruysa, sadece iyileştirme önerileri sun
- Hataları belirtirken satır numaralarını, kod bloklarını, değişken/fonksiyon adlarını ÖZELLİKLE belirt
- Kullanıcının nereyi düzeltmesi gerektiğini çok net bir şekilde açıkla
- Bug fix'in doğruluğunu değerlendirirken hem çıktıyı hem de kod değişikliklerini göz önünde bulundur
- JSON formatında yanıt ver, başka açıklama yapma
- Türkçe karakterleri doğru kullan (UTF-8 encoding)

YANIT FORMATI (JSON):
{
  "isCorrect": boolean,
  "feedback": "string (Türkçe, detaylı açıklama)",
  "correctedCode": "string (kod + yorum satırları)",
  "comments": ["string", "string"],
  "errors": [
    {"line": number, "description": "string (Türkçe)"}
  ],
  "specificErrors": [
    {
      "location": "string (örn: 'Satır 5', 'for döngüsü', 'if bloğu')",
      "issue": "string (hatanın ne olduğu, Türkçe)",
      "fix": "string (nasıl düzeltileceği, Türkçe)"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir bug fix değerlendirme uzmanısın. Öğrencilere kod düzeltme değerlendirmesi yapıyorsun. Her zaman JSON formatında yanıt ver.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json(
        { error: "AI yanıtı alınamadı" },
        { status: 500 }
      );
    }

    try {
      const parsedResponse = JSON.parse(responseContent) as BugFixEvaluateResponse;
      
      // Validate response structure
      if (
        typeof parsedResponse.isCorrect !== "boolean" ||
        typeof parsedResponse.feedback !== "string" ||
        typeof parsedResponse.correctedCode !== "string" ||
        !Array.isArray(parsedResponse.comments) ||
        !Array.isArray(parsedResponse.errors)
      ) {
        throw new Error("Geçersiz response formatı");
      }

      // Ensure specificErrors is an array if present
      if (parsedResponse.specificErrors && !Array.isArray(parsedResponse.specificErrors)) {
        parsedResponse.specificErrors = [];
      }

      return NextResponse.json(parsedResponse, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } catch (parseError) {
      console.error("AI response parse error:", parseError);
      console.error("Raw response:", responseContent);
      
      // Fallback: Try to extract useful information from raw response
      return NextResponse.json(
        {
          isCorrect: false,
          feedback: "AI yanıtı parse edilemedi. Lütfen tekrar deneyin.",
          correctedCode: fixedCode,
          comments: [],
          errors: [{ line: 0, description: "AI yanıtı işlenemedi" }],
          specificErrors: [],
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
  } catch (error) {
    console.error("Error evaluating bug fix:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

