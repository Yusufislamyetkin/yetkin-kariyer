import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureAIEnabled, isAIEnabled } from "@/lib/ai/client";
import { validateCodeCompleteness, type LiveCodingLanguage } from "@/lib/ai/code-validator";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { checkUserSubscription } from "@/lib/services/subscription-service";

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
    // Allow test mode to bypass auth (for automated testing)
    const isTestMode = process.env.NODE_ENV === "test" || 
                      request.headers.get("x-test-mode") === "true";
    
    let session = null;
    let userId: string | null = null;
    if (!isTestMode) {
      session = await auth();
      userId = await getUserIdFromSession(session);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Abonelik kontrolü
      const subscription = await checkUserSubscription(userId);
      if (!subscription || !subscription.isActive) {
        return NextResponse.json(
          {
            error: "Abone değilsiniz. Lütfen bir abonelik planı seçin.",
            redirectTo: "/fiyatlandirma",
            requiresSubscription: true,
          },
          { status: 403 }
        );
      }
    }

    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: "AI servisi şu anda kullanılamıyor" },
        { status: 503 }
      );
    }

    const body: EvaluateOutputRequest = await request.json();
    const { taskDescription, expectedOutput, userCode, userOutput, language } = body;

    if (!taskDescription || !userCode) {
      return NextResponse.json(
        { error: "Eksik parametreler: taskDescription ve userCode gerekli" },
        { status: 400 }
      );
    }

    // userOutput is optional - if not provided, we'll do code-only analysis
    const hasUserOutput = userOutput && userOutput.trim().length > 0;

    const openai = await ensureAIEnabled();

    // Language-specific requirements for complete, runnable code
    const getLanguageRequirements = (lang: string): string => {
      const langLower = lang.toLowerCase();
      const requirements: Record<string, string> = {
        php: `PHP İÇİN ZORUNLU YAPILAR:
- Tüm değişkenler tanımlanmalı (örn: $a = 10; $b = 5;)
- Kod <?php ... ?> etiketleri içinde olmalı VEYA doğrudan PHP kodu olmalı
- Tüm kullanılan değişkenler önce tanımlanmalı
- Örnek tam kod: <?php\n$a = 10;\n$b = 5;\n$toplam = $a + $b;\necho "$a + $b = $toplam";\n?>`,
        python: `PYTHON İÇİN ZORUNLU YAPILAR:
- Tüm değişkenler tanımlanmalı (örn: a = 10; b = 5;)
- Gerekli import'lar eklenmeli (import sys, import math, vb.)
- Kod doğrudan çalıştırılabilir olmalı (main fonksiyonu gerekmez)
- Örnek tam kod: a = 10\nb = 5\ntoplam = a + b\nprint(f"{a} + {b} = {toplam}")`,
        javascript: `JAVASCRIPT İÇİN ZORUNLU YAPILAR:
- Tüm değişkenler tanımlanmalı (let, const, var ile)
- Gerekli modül import'ları eklenmeli
- Kod doğrudan çalıştırılabilir olmalı
- Örnek tam kod: const a = 10;\nconst b = 5;\nconst toplam = a + b;\nconsole.log(\`\${a} + \${b} = \${toplam}\`);`,
        java: `JAVA İÇİN ZORUNLU YAPILAR:
- public class Main { public static void main(String[] args) { ... } } yapısı olmalı
- Tüm değişkenler tanımlanmalı
- Gerekli import'lar eklenmeli
- Örnek tam kod: public class Main {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 5;\n        int toplam = a + b;\n        System.out.println(a + " + " + b + " = " + toplam);\n    }\n}`,
        csharp: `C# İÇİN ZORUNLU YAPILAR:
- using System; gibi gerekli using'ler olmalı
- class Program { static void Main(string[] args) { ... } } yapısı olmalı
- Tüm değişkenler tanımlanmalı
- Örnek tam kod: using System;\nclass Program {\n    static void Main(string[] args) {\n        int a = 10;\n        int b = 5;\n        int toplam = a + b;\n        Console.WriteLine($"{a} + {b} = {toplam}");\n    }\n}`,
        typescript: `TYPESCRIPT İÇİN ZORUNLU YAPILAR:
- Tüm değişkenler tip belirtilerek tanımlanmalı
- Gerekli import'lar eklenmeli
- Kod doğrudan çalıştırılabilir olmalı
- Örnek tam kod: const a: number = 10;\nconst b: number = 5;\nconst toplam: number = a + b;\nconsole.log(\`\${a} + \${b} = \${toplam}\`);`,
        go: `GO İÇİN ZORUNLU YAPILAR:
- package main olmalı
- import "fmt" gibi gerekli import'lar olmalı
- func main() { ... } fonksiyonu olmalı
- Tüm değişkenler tanımlanmalı
- Örnek tam kod: package main\nimport "fmt"\nfunc main() {\n    a := 10\n    b := 5\n    toplam := a + b\n    fmt.Printf("%d + %d = %d\\n", a, b, toplam)\n}`,
        rust: `RUST İÇİN ZORUNLU YAPILAR:
- fn main() { ... } fonksiyonu olmalı
- Tüm değişkenler let ile tanımlanmalı
- Gerekli use deyimleri eklenmeli
- Örnek tam kod: fn main() {\n    let a = 10;\n    let b = 5;\n    let toplam = a + b;\n    println!("{} + {} = {}", a, b, toplam);\n}`,
        cpp: `C++ İÇİN ZORUNLU YAPILAR:
- #include <iostream> gibi gerekli header'lar olmalı
- using namespace std; veya std:: prefix kullanılmalı
- int main() { ... } fonksiyonu olmalı
- Tüm değişkenler tanımlanmalı
- Örnek tam kod: #include <iostream>\nusing namespace std;\nint main() {\n    int a = 10;\n    int b = 5;\n    int toplam = a + b;\n    cout << a << " + " << b << " = " << toplam << endl;\n    return 0;\n}`,
        kotlin: `KOTLIN İÇİN ZORUNLU YAPILAR:
- fun main() { ... } fonksiyonu olmalı
- Tüm değişkenler val veya var ile tanımlanmalı
- Gerekli import'lar eklenmeli
- Örnek tam kod: fun main() {\n    val a = 10\n    val b = 5\n    val toplam = a + b\n    println("$a + $b = $toplam")\n}`,
        ruby: `RUBY İÇİN ZORUNLU YAPILAR:
- Tüm değişkenler tanımlanmalı
- Kod doğrudan çalıştırılabilir olmalı
- Gerekli require'lar eklenmeli
- Örnek tam kod: a = 10\nb = 5\ntoplam = a + b\nputs "#{a} + #{b} = #{toplam}"`,
      };
      return requirements[langLower] || `GENEL KURALLAR:
- Tüm değişkenler ve gerekli yapılar tanımlanmalı
- Kod doğrudan çalıştırılabilir olmalı
- Gerekli import/require/using deyimleri eklenmeli`;
    };

    const prompt = `Sen bir programlama öğretmenisin. Öğrencinin kodunu değerlendir.${hasUserOutput ? ' Öğrencinin kodunu ve çıktısını değerlendir.' : ' Kod henüz çalıştırılmamış, sadece kod analizi yap.'}

GÖREV AÇIKLAMASI:
${taskDescription}

BEKLENEN ÇIKTI:
${expectedOutput || "Belirtilmemiş"}

ÖĞRENCİNİN KODU (${language}):
\`\`\`${language}
${userCode}
\`\`\`
${hasUserOutput ? `ÖĞRENCİNİN ÜRETTİĞİ ÇIKTI:
${userOutput}` : `NOT: Kod henüz çalıştırılmamış. Sadece kod analizi yap.`}

${getLanguageRequirements(language)}

DEĞERLENDİRME GÖREVİN:
${hasUserOutput ? `1. Öğrencinin çıktısı beklenen çıktı ile eşleşiyor mu? (isCorrect: true/false)` : `1. Kodun doğru olup olmadığını analiz et. Kod çalıştırılmadığı için isCorrect'i false olarak işaretle.`}
2. Kodda hatalar var mı? Varsa hangi satırlarda ve ne tür hatalar? (errors array)
3. **ÖNEMLİ**: Kullanıcının yaptığı hatayı ÖZELLİKLE BELİRT. Hangi satırda, hangi kod bloğunda, ne tür bir hata var?
4. **ÖNEMLİ**: Kullanıcının nereyi düzeltmesi gerektiğini ÖZELLİKLE BELİRT. Satır numarası, kod bloğu, değişken adı, fonksiyon adı gibi spesifik bilgiler ver.
5. **KRİTİK**: Kodun doğru versiyonunu yaz (correctedCode). Bu kod TAM ve ÇALIŞTIRILABİLİR olmalı:
   - Tüm değişkenler tanımlanmalı (örneğin: $a = 10; $b = 5; gibi)
   - Gerekli import/require/using deyimleri eklenmeli
   - Gerekli fonksiyon yapıları (main, class, vb.) eklenmeli
   - Kod doğrudan kopyalanıp çalıştırılabilir olmalı
   - Yorum satırları ile açıklamalar ekle (// veya /* */ formatında)
6. Genel bir geri bildirim ver (feedback)
7. Önemli noktalar için yorum satırı açıklamaları listele (comments array)
8. Her hata için spesifik bilgi ver: location (örn: "Satır 5", "for döngüsü", "if bloğu"), issue (hatanın ne olduğu), fix (nasıl düzeltileceği)
${!hasUserOutput ? `9. **ÖNEMLİ**: Kod henüz çalıştırılmamış. Kullanıcıya kodunu çalıştırmasını öner.` : ''}

ÖNEMLİ KURALLAR:
- **EN ÖNEMLİSİ**: correctedCode TAM ve ÇALIŞTIRILABİLİR olmalı! Eksik değişken tanımları, import'lar veya gerekli yapılar ASLA olmamalı!
- correctedCode'da yorum satırları ile açıklamalar ekle (// veya /* */ formatında)
- Her önemli değişiklik veya düzeltme için yorum satırı ekle
- Yorum satırları Türkçe olmalı ve açıklayıcı olmalı
- Eğer kod doğruysa, sadece iyileştirme önerileri sun
- Hataları belirtirken satır numaralarını, kod bloklarını, değişken/fonksiyon adlarını ÖZELLİKLE belirt
- Kullanıcının nereyi düzeltmesi gerektiğini çok net bir şekilde açıkla
- JSON formatında yanıt ver, başka açıklama yapma
- Türkçe karakterleri doğru kullan (UTF-8 encoding)
- **KRİTİK**: correctedCode ve feedback alanlarında ASLA markdown kod blokları (\`\`\` veya \`\`\`python gibi) KULLANMA! Kodları doğrudan metin olarak yaz, markdown formatı kullanma!
- **KRİTİK**: correctedCode'da kullanılan TÜM değişkenler önce tanımlanmalı! Örneğin: Eğer $a ve $b kullanılıyorsa, mutlaka $a = ... ve $b = ... satırları olmalı!

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

      // Remove markdown code blocks from correctedCode and feedback
      // Pattern: ```language\ncode\n``` or ```\ncode\n```
      const removeMarkdownCodeBlocks = (text: string): string => {
        if (!text) return text;
        // Remove code blocks with language: ```python\ncode\n```
        let cleaned = text.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1');
        // Also remove any remaining triple backticks at start/end
        cleaned = cleaned.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
        return cleaned.trim();
      };

      // Clean correctedCode and feedback
      parsedResponse.correctedCode = removeMarkdownCodeBlocks(parsedResponse.correctedCode);
      parsedResponse.feedback = removeMarkdownCodeBlocks(parsedResponse.feedback);

      // Post-generation validation: Validate code completeness
      const normalizedLanguage = language.toLowerCase() as LiveCodingLanguage;
      const validationResult = validateCodeCompleteness(
        parsedResponse.correctedCode,
        normalizedLanguage
      );

      // If code is incomplete, add warnings to feedback and errors
      if (!validationResult.isComplete || !validationResult.isValid) {
        const validationWarnings = [
          ...validationResult.missingElements,
          ...validationResult.errors.map((e) => e.description),
        ];

        if (validationWarnings.length > 0) {
          // Add validation warnings to feedback
          parsedResponse.feedback = `${parsedResponse.feedback}\n\n⚠️ KOD DOĞRULAMA UYARILARI:\n${validationWarnings.map((w) => `- ${w}`).join("\n")}`;

          // Add validation errors to errors array
          validationResult.errors.forEach((error) => {
            parsedResponse.errors.push({
              line: error.line || 0,
              description: `Doğrulama: ${error.description}`,
            });
          });

          // Log for debugging
          console.warn(`[Code Validation] Incomplete code detected for ${language}:`, {
            missingElements: validationResult.missingElements,
            errors: validationResult.errors,
            suggestions: validationResult.suggestions,
          });
        }
      }

      // Add suggestions to comments if any
      if (validationResult.suggestions.length > 0) {
        parsedResponse.comments = [
          ...parsedResponse.comments,
          ...validationResult.suggestions.map((s) => `💡 ${s}`),
        ];
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

