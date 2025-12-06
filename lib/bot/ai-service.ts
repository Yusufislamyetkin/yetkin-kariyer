import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";
import { z } from "zod";
import { NewsSource } from "./news-sources";

/**
 * Analyze a post and generate a realistic comment
 */
export async function analyzePostForComment(
  postId: string,
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] }
): Promise<string> {
  try {
    // Get the post
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const systemPrompt = botCharacter.systemPrompt || `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."}`;

    const userPrompt = `Aşağıdaki gönderiyi oku ve gerçekçi, yardımsever bir yorum yaz. Yorum kısa ve samimi olmalı (maksimum 200 kelime). Türkçe yaz.

ÖNEMLİ:
- Doğal, konuşma diline yakın bir dil kullan
- Bazen küçük yazım hataları yapabilirsin (doğal görünmesi için, örn: "valla", "iyimişş", "harbiden", "muazzammm")
- Türkçe slang kullanabilirsin (valla, harbiden, iyimişş, süpermiş vs.)
- Kısa cümleler kullan, samimi ol
- Post içeriğine göre teknik detay veya kişisel deneyim paylaş
- Soru sorabilir veya ek kaynak önerebilirsin

Gönderi:
${post.content || "Görsel paylaşımı"}

${post.user?.name ? `Gönderi sahibi: ${post.user.name}` : ""}

Yorumunu yaz (sadece yorum metni, başka bir şey ekleme):`;

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.8,
    });

    if (!result.content) {
      throw new Error("Generated comment is empty");
    }
    const comment = result.content.trim();
    if (!comment || comment.length < 10) {
      throw new Error("Generated comment is too short");
    }

    return comment.substring(0, 1000); // Limit to 1000 chars
  } catch (error: any) {
    console.error("[BOT_AI] Error generating comment:", error);
    // Fallback to simple comments
    const fallbackComments = [
      "Harika bir paylaşım! 👍",
      "Çok faydalı bilgiler, teşekkürler!",
      "Bu konuda daha fazla bilgi paylaşabilir misin?",
      "Güzel bir nokta, ben de benzer bir deneyim yaşamıştım.",
      "Teşekkürler, not aldım!",
    ];
    return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
  }
}

/**
 * Generate post content based on bot character and news source
 */
export async function generatePostContent(
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] },
  newsSource?: NewsSource
): Promise<string> {
  try {
    const systemPrompt = botCharacter.systemPrompt || `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."}`;

    let userPrompt: string;

    if (newsSource) {
      // Güncel haber kaynağından içerik üret
      userPrompt = `Aşağıdaki haber kaynağından ilham alarak güncel bir yazılım/teknoloji haberini paylaş. Gönderi kolay okunabilir, samimi ve faydalı olmalı (maksimum 300 kelime). Türkçe yaz.

ÖNEMLİ:
- Kolay okunabilir, kısa paragraflar kullan
- Bazen küçük yazım hataları yapabilirsin (doğal görünmesi için, örn: "muazzammm", "süpermişş", "harbiden")
- Türkçe slang kullanabilirsin (valla, harbiden, iyimişş, süpermiş vs.)
- Kaynak belirt: Kaynak: [${newsSource.name}](${newsSource.website})
- Kişisel bir yorum veya deneyim ekle
- Gönderi formatı:
  * Başlık/başlangıç (emoji ile)
  * Haber içeriği (kısa paragraflar)
  * Özellikler listesi (varsa, bullet point ile)
  * Kaynak linki
  * Kapanış yorumu

Haber Kaynağı: ${newsSource.name} (${newsSource.category})
Website: ${newsSource.website}
${newsSource.description ? `Açıklama: ${newsSource.description}` : ""}

Gönderiyi yaz (sadece gönderi metni, başka bir şey ekleme):`;
    } else {
      // Fallback: Genel konu
      const topics = [
        "programlama ipuçları",
        "teknoloji haberleri",
        "öğrenme deneyimleri",
        "kod örnekleri",
        "kariyer tavsiyeleri",
        "yazılım geliştirme",
        "best practices",
        "yazılım problemi çözme hikayesi",
        "programlama dili özelliği",
      ];

      const expertiseTopics = botCharacter.expertise && botCharacter.expertise.length > 0
        ? botCharacter.expertise
        : topics;

      const randomTopic = expertiseTopics[Math.floor(Math.random() * expertiseTopics.length)];

      userPrompt = `Aşağıdaki konuda kısa, samimi ve faydalı bir sosyal medya gönderisi yaz (maksimum 300 kelime). Türkçe yaz. Gönderi gerçekçi ve kişisel deneyimler içermeli.

ÖNEMLİ:
- Kolay okunabilir, kısa paragraflar kullan
- Bazen küçük yazım hataları yapabilirsin (doğal görünmesi için)
- Türkçe slang kullanabilirsin (valla, harbiden, iyimişş vs.)

Konu: ${randomTopic}

Gönderiyi yaz (sadece gönderi metni, başka bir şey ekleme):`;
    }

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.9,
    });

    if (!result.content) {
      throw new Error("Generated content is empty");
    }
    const content = result.content.trim();
    if (!content || content.length < 20) {
      throw new Error("Generated content is too short");
    }

    return content.substring(0, 2200); // Limit to 2200 chars
  } catch (error: any) {
    console.error("[BOT_AI] Error generating post:", error);
    // Fallback to simple posts
    const fallbackPosts = [
      "Bugün yeni bir şey öğrendim! Paylaşmak istedim. 🚀",
      "Kodlama yaparken dikkat etmeniz gereken önemli bir nokta var...",
      "Toplulukta güzel bir deneyim yaşadım, teşekkürler herkese!",
      "Yazılım geliştirme konusunda birkaç ipucu paylaşmak istiyorum.",
      "Bugün harika bir kaynak keşfettim, sizinle de paylaşayım.",
    ];
    return fallbackPosts[Math.floor(Math.random() * fallbackPosts.length)];
  }
}

/**
 * Answer test questions based on bot character and quiz
 */
export async function answerTestQuestions(
  quizId: string,
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] }
): Promise<number[]> {
  try {
    // Get the quiz
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        questions: true,
        level: true,
        topic: true,
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const questions = quiz.questions as any;
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions found");
    }

    const systemPrompt = botCharacter.systemPrompt || `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."} Test sorularını cevaplarken gerçekçi bir şekilde davran.`;

    // Build question prompt
    const questionTexts = questions.map((q: any, index: number) => {
      const questionText = q.question || q.text || "";
      const options = q.options || [];
      return `${index + 1}. ${questionText}\n${options.map((opt: string, optIdx: number) => `   ${optIdx}. ${opt}`).join("\n")}`;
    }).join("\n\n");

    const userPrompt = `Aşağıdaki test sorularını cevapla. Her soru için sadece doğru cevabın numarasını (0'dan başlayarak) ver. Örneğin: [0, 2, 1, 0, 3]

Sorular:
${questionTexts}

Sadece cevapları JSON array formatında ver (örnek: [0, 1, 2, 0]):`;

    const answerSchema = z.array(z.number().int().min(0));

    const result = await createChatCompletion({
      schema: answerSchema,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more accurate answers
    });

    if (!result.parsed || !Array.isArray(result.parsed)) {
      throw new Error("Invalid answer format");
    }

    // Ensure we have answers for all questions
    const answers = result.parsed;
    while (answers.length < questions.length) {
      // Fill missing answers with random (but reasonable) choices
      const question = questions[answers.length];
      const optionCount = (question.options || []).length;
      answers.push(Math.floor(Math.random() * Math.min(optionCount, 4)));
    }

    return answers.slice(0, questions.length);
  } catch (error: any) {
    console.error("[BOT_AI] Error answering questions:", error);
    // Fallback to random answers (but try to be somewhat correct)
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: {
        questions: true,
      },
    });

    if (!quiz) {
      return [];
    }

    const questions = quiz.questions as any;
    if (!Array.isArray(questions)) {
      return [];
    }

    // Generate random answers but bias towards first option (often correct)
    return questions.map((q: any) => {
      const optionCount = (q.options || []).length;
      if (optionCount === 0) return 0;
      // 60% chance to pick first option, 40% random
      return Math.random() < 0.6 ? 0 : Math.floor(Math.random() * Math.min(optionCount, 4));
    });
  }
}

