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

DOĞALLIK KURALLARI:
- Aşırı pozitif veya abartılı dil kullanma (örn: "harbiden muazzam", "süper", "heyecan verici" gibi ifadeleri aşırı kullanma)
- Genel ifadeler yerine spesifik teknik detaylar, örnekler veya somut bilgiler kullan
- Kurgusal kişisel deneyim yazma (örn: "geçen hafta kullandım" gibi uydurma deneyimler)
- Cümle çeşitliliği kullan, kısa-uzun cümleler karıştır, doğal bir akışı taklit et
- Yapay tekrarlardan kaçın (aynı ifadeleri sık sık kullanma)
- Yüzeysel "harika paylaşım" gibi yorumlar yerine içerik odaklı yorumlar yaz
- Eleştirel veya sorgulayıcı sorular sorabilirsin, her şeyi övme
- Doğal, samimi ama aşırıya kaçmayan bir ton kullan

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
      "Harika bir paylaşım.",
      "Çok faydalı bilgiler, teşekkürler.",
      "Bu konuda daha fazla bilgi paylaşabilir misin.",
      "Güzel bir nokta, ben de benzer bir deneyim yaşamıştım.",
      "Teşekkürler, not aldım.",
    ];
    return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
  }
}

/**
 * Generate post content based on bot character and news source
 * Now generates LinkedIn-format posts (professional, no slang/typos)
 */
export async function generatePostContent(
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] },
  newsSource?: NewsSource
): Promise<string> {
  try {
    // Use LinkedIn post generation with automatic topic and type selection
    const topics = botCharacter.expertise && botCharacter.expertise.length > 0
      ? botCharacter.expertise
      : [
          "yazılım geliştirme",
          "teknoloji trendleri",
          "programlama ipuçları",
          "kariyer tavsiyeleri",
          "best practices",
          "yazılım mimarisi",
          "kod kalitesi",
          "teknoloji liderliği",
        ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Random post type (1-10)
    const randomPostType = (Math.floor(Math.random() * 10) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    // If news source is provided, incorporate it into the topic
    const finalTopic = newsSource 
      ? `${randomTopic} - ${newsSource.name} kaynağından ilham alarak`
      : randomTopic;

    // Generate LinkedIn-format post
    return await generateLinkedInPost(botCharacter, finalTopic, randomPostType);
  } catch (error: any) {
    console.error("[BOT_AI] Error generating post:", error);
    // Fallback to simple LinkedIn-style posts
    const fallbackPosts = [
      `**Teknoloji dünyasında önemli bir gelişme:**

🔹 Yeni trendler ve fırsatlar
🚀 Gelecek için hazırlık
⭐ Öğrenme ve gelişim

Siz bu konuda ne düşünüyorsunuz?

#teknoloji #yazılım #gelişim`,
      `**Yazılım geliştirme konusunda bir gözlem:**

Bugün paylaşmak istediğim önemli bir nokta var.

Siz de benzer deneyimler yaşadınız mı?

#yazılım #teknoloji #kariyer`,
    ];
    return fallbackPosts[Math.floor(Math.random() * fallbackPosts.length)];
  }
}

/**
 * Generate LinkedIn-format post content based on bot character, topic, and post type
 */
export async function generateLinkedInPost(
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] },
  topic: string,
  postType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
): Promise<string> {
  try {
    const systemPrompt = botCharacter.systemPrompt || `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."}`;

    // Post type descriptions
    const typeDescriptions: Record<number, string> = {
      1: "Kişisel Hikaye/Tecrübe - Samimi, hafif öz eleştiri içeren ve öğretici bir ton kullan. Kişisel deneyimler ve dersler paylaş. Bazen samimi dil kullanabilirsin.",
      2: "Teknik Karşılaştırma/Trend - Analitik ama heyecanlı ol. Karşılaştırmalı analiz yap, teknik detayları açıkla.",
      3: "Sektörel Eleştiri/Tavsiye - Otoriter ve çözüm odaklı ol. Problemleri belirt ve çözüm önerileri sun.",
      4: "İlginç Teknoloji Haberi - Merak uyandırıcı ve hafif gizemli ol. Haberi çarpıcı bir şekilde sun.",
      5: "Soru-Cevap / Tartışma Başlatıcı - Etkileşim odaklı, sorgulayıcı. Okuyucuları düşünmeye sevk eden sorular sor.",
      6: "Vaka Çalışması / Başarı Hikayesi - Somut sonuçlar, öğretici. Gerçek örnekler ve başarı hikayeleri paylaş.",
      7: "Trend Analizi / Gelecek Öngörüsü - Analitik, öngörücü. Gelecek trendleri ve olasılıkları analiz et.",
      8: "Araç/Teknoloji İncelemesi - Detaylı, karşılaştırmalı. Teknik detaylar ve pratik kullanım örnekleri ver.",
      9: "Kariyer İpuçları / Mentorluk - Öğretici, destekleyici. Kariyer gelişimi için pratik tavsiyeler sun.",
      10: "Topluluk Deneyimi / Etkinlik Paylaşımı - Samimi, paylaşımcı. Topluluk deneyimlerini ve etkinlikleri paylaş.",
    };

    const typeLabels: Record<number, string> = {
      1: "Kişisel Hikaye/Tecrübe",
      2: "Teknik Karşılaştırma/Trend",
      3: "Sektörel Eleştiri/Tavsiye",
      4: "İlginç Teknoloji Haberi",
      5: "Soru-Cevap / Tartışma Başlatıcı",
      6: "Vaka Çalışması / Başarı Hikayesi",
      7: "Trend Analizi / Gelecek Öngörüsü",
      8: "Araç/Teknoloji İncelemesi",
      9: "Kariyer İpuçları / Mentorluk",
      10: "Topluluk Deneyimi / Etkinlik Paylaşımı",
    };

    const typeDescription = typeDescriptions[postType] || typeDescriptions[1];
    const typeLabel = typeLabels[postType] || typeLabels[1];

    const userPrompt = `Sen, LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı (storytelling) güçlü bir Teknoloji Lideri ve İçerik Üreticisisin.

Amacın: Aşağıda belirteceğim [KONU] hakkında, profesyonellerin ilgisini çekecek, okunabilirliği yüksek, düşündürücü ve etkileşim (beğeni/yorum) getirecek bir LinkedIn gönderisi hazırlamak.

ZORUNLU ÖZELLİKLER (Mutlaka olmalı):

1. GİRİŞ (KANCA): İlk cümle çok çarpıcı olmalı. Okuyucuyu hemen yakalamalı. Bazen bir soru, bazen şaşırtıcı bir gerçek, bazen de genel geçer bir doğruya meydan okuma şeklinde başla.

2. YAPILANDIRMA: Asla devasa metin blokları kullanma. Paragrafları kısa tut (en fazla 2-3 cümle). Okumayı kolaylaştırmak için satır araları bırak.

3. SONUÇ (CTA): Gönderiyi mutlaka okuyucuya bir soru sorarak veya bir sonraki adımı göstererek bitir. Tartışma başlatmalarını sağla.

4. HASHTAG: Gönderinin sonuna konuya uygun 3-5 hashtag ekle. Hashtag'ler Türkçe veya İngilizce olabilir.

5. DİL: Akıcı, profesyonel bir Türkçe kullan. Kategoriye göre bazen samimi dil de kullanabilirsin.

OPSİYONEL ÖZELLİKLER (İhtiyaca göre kullan):

- Bold formatlama: Önemli noktaları vurgulamak için kullanabilirsin, ama zorunlu değil.
- Emoji kullanımı: Listelerde veya vurgularda kullanabilirsin, ama her yerde olması gerekmez.
- Bölüm ayraçları: Gerekirse kullanabilirsin, ama zorunlu değil.

ÖNEMLİ: Formatlamayı zorla kullanma. İçeriğe doğal olarak uygun formatlamayı seç. Her postta aynı formatı kullanmak zorunda değilsin.

TON:
${typeDescription}

[KONU]: ${topic}
[TÜR]: ${typeLabel}

Sadece post metnini ve sonuna uygun hashtag'leri çıktı olarak ver. Başka bir şey ekleme.`;

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
      temperature: 0.85,
    });

    if (!result.content) {
      throw new Error("Generated LinkedIn post is empty");
    }
    const content = result.content.trim();
    if (!content || content.length < 50) {
      throw new Error("Generated LinkedIn post is too short");
    }

    return content.substring(0, 2200); // Limit to 2200 chars
  } catch (error: any) {
    console.error("[BOT_AI] Error generating LinkedIn post:", error);
    // Fallback to simple LinkedIn-style posts
    const fallbackPosts = [
      `${topic} hakkında düşüncelerim:

Önemli bir nokta var ki paylaşmak istiyorum.

Siz bu konuda ne düşünüyorsunuz?

#teknoloji #yazılım #${topic.toLowerCase().replace(/\s+/g, "")}`,
      `Bugün ${topic} konusunda bir şeyler öğrendim.

Paylaşmak istedim çünkü bu bilgi değerli.

Siz de benzer bir deneyim yaşadınız mı?

#tech #${topic.toLowerCase().replace(/\s+/g, "")}`,
    ];
    return fallbackPosts[Math.floor(Math.random() * fallbackPosts.length)];
  }
}

/**
 * Generate badge share post content
 */
export async function generateBadgeSharePost(
  botCharacter: { persona: string; systemPrompt: string; name: string; expertise?: string[] },
  badge: { id: string; name: string; description: string; icon: string; color: string; category: string; rarity: string },
  userId: string,
  baseUrl?: string
): Promise<string> {
  try {
    const systemPrompt = botCharacter.systemPrompt || `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."}`;

    // Profile link
    const profileLink = baseUrl 
      ? `${baseUrl}/profile/${userId}?badge=${badge.id}`
      : `/profile/${userId}?badge=${badge.id}`;

    // Konfeti emoji/link
    const confettiEmoji = "🎉";

    const userPrompt = `Sen, LinkedIn üzerinde geniş bir takipçi kitlesine sahip, hem teknik derinliği olan hem de hikaye anlatıcılığı (storytelling) güçlü bir Teknoloji Lideri ve İçerik Üreticisisin.

Amacın: Yeni kazandığın bir rozeti paylaşmak için samimi, heyecanlı ve profesyonel bir LinkedIn gönderisi hazırlamak.

ZORUNLU ÖZELLİKLER:

1. GİRİŞ (KANCA): "Selam yeni rozet kazandım" gibi samimi ve heyecanlı bir giriş yap. ${confettiEmoji} emojisini kullan.

2. YAPILANDIRMA: Kısa paragraflar kullan (en fazla 2-3 cümle). Okumayı kolaylaştırmak için satır araları bırak.

3. ROZET BİLGİLERİ: Rozet ismini ve kısa bir açıklama paylaş. Rozetin önemini veya ne anlama geldiğini belirt.

4. PROFİL LİNKİ: Gönderinin altında profil linkini paylaş: ${profileLink}

5. SONUÇ (CTA): Gönderiyi samimi bir şekilde bitir. Diğerlerini de rozet kazanmaya teşvik edebilirsin.

6. HASHTAG: Gönderinin sonuna konuya uygun 3-5 hashtag ekle. Hashtag'ler Türkçe veya İngilizce olabilir.

7. DİL: Samimi ama profesyonel bir Türkçe kullan. Heyecanını göster ama abartma.

ROZET BİLGİLERİ:
- İsim: ${badge.name}
- Açıklama: ${badge.description}
- Kategori: ${badge.category}
- Nadirlik: ${badge.rarity}
- İkon: ${badge.icon}

Sadece post metnini ve sonuna uygun hashtag'leri çıktı olarak ver. Profil linkini de ekle. Başka bir şey ekleme.`;

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
      temperature: 0.85,
    });

    if (!result.content) {
      throw new Error("Generated badge share post is empty");
    }
    const content = result.content.trim();
    if (!content || content.length < 50) {
      throw new Error("Generated badge share post is too short");
    }

    // Ensure profile link is included
    let finalContent = content;
    if (!content.includes(profileLink) && !content.includes(`/profile/${userId}`)) {
      finalContent = `${content}\n\nProfilimde tüm rozetlerimi görebilirsiniz:\n${profileLink}`;
    }

    return finalContent.substring(0, 2200); // Limit to 2200 chars
  } catch (error: any) {
    console.error("[BOT_AI] Error generating badge share post:", error);
    // Fallback to simple badge share post
    const profileLink = baseUrl 
      ? `${baseUrl}/profile/${userId}?badge=${badge.id}`
      : `/profile/${userId}?badge=${badge.id}`;
    
    return `Selam! Yeni bir rozet kazandım! 🎉

${badge.icon} ${badge.name} rozetini kazandım. ${badge.description}

Profilimde tüm rozetlerimi görebilirsiniz:
${profileLink}

#rozet #başarı #teknoloji #${badge.category.toLowerCase().replace(/\s+/g, "")}`;
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

