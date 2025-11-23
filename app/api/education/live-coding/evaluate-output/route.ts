import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureAIEnabled, isAIEnabled } from "@/lib/ai/client";

export interface EvaluateOutputRequest {
  taskDescription: string;
  expectedOutput: string;
  userCode: string;
  userOutput: string;
  language: string;
}

export interface EvaluateOutputResponse {
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

    const body: EvaluateOutputRequest = await request.json();
    const { taskDescription, expectedOutput, userCode, userOutput, language } = body;

    if (!taskDescription || !userCode || !userOutput) {
      return NextResponse.json(
        { error: "Eksik parametreler: taskDescription, userCode ve userOutput gerekli" },
        { status: 400 }
      );
    }

    const openai = await ensureAIEnabled();

    const prompt = `Sen bir programlama öğretmenisin. Öğrencinin kodunu ve çıktısını değerlendir.

GÖREV AÇIKLAMASI:
${taskDescription}

BEKLENEN ÇIKTI:
${expectedOutput}

ÖĞRENCİNİN KODU (${language}):
\`\`\`${language}
${userCode}
\`\`\`

ÖĞRENCİNİN ÜRETTİĞİ ÇIKTI:
${userOutput}

DEĞERLENDİRME GÖREVİN:
1. Öğrencinin çıktısı beklenen çıktı ile eşleşiyor mu? (isCorrect: true/false)
2. Kodda hatalar var mı? Varsa hangi satırlarda ve ne tür hatalar? (errors array)
3. **ÖNEMLİ**: Kullanıcının yaptığı hatayı ÖZELLİKLE BELİRT. Hangi satırda, hangi kod bloğunda, ne tür bir hata var?
4. **ÖNEMLİ**: Kullanıcının nereyi düzeltmesi gerektiğini ÖZELLİKLE BELİRT. Satır numarası, kod bloğu, değişken adı, fonksiyon adı gibi spesifik bilgiler ver.
5. Kodun doğru versiyonunu yaz, yorum satırları ile açıklamalar ekle (correctedCode)
6. Genel bir geri bildirim ver (feedback)
7. Önemli noktalar için yorum satırı açıklamaları listele (comments array)
8. Her hata için spesifik bilgi ver: location (örn: "Satır 5", "for döngüsü", "if bloğu"), issue (hatanın ne olduğu), fix (nasıl düzeltileceği)

ÖNEMLİ KURALLAR:
- correctedCode'da yorum satırları ile açıklamalar ekle (// veya /* */ formatında)
- Her önemli değişiklik veya düzeltme için yorum satırı ekle
- Yorum satırları Türkçe olmalı ve açıklayıcı olmalı
- Eğer kod doğruysa, sadece iyileştirme önerileri sun
- Hataları belirtirken satır numaralarını, kod bloklarını, değişken/fonksiyon adlarını ÖZELLİKLE belirt
- Kullanıcının nereyi düzeltmesi gerektiğini çok net bir şekilde açıkla
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
          content: "Sen bir programlama öğretmenisin. Öğrencilere kod değerlendirmesi yapıyorsun. Her zaman JSON formatında yanıt ver.",
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
      const parsedResponse = JSON.parse(responseContent) as EvaluateOutputResponse;
      
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
          correctedCode: userCode,
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
    console.error("Error evaluating output:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

