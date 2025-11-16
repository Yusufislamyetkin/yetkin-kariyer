import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createChatCompletion, isAIEnabled } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { normalizeCourseContent } from "@/lib/education/courseContent";
import type { LiveCodingLanguage } from "@/types/live-coding";

const LessonChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const LessonChatRequestSchema = z.object({
  lessonSlug: z.string().min(1),
  messages: z.array(LessonChatMessageSchema).optional(),
  lessonPlan: z.string().optional().nullable(),
});

function ensureString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => ensureString(item))
    .filter((item): item is string => typeof item === "string");
}

function normalizeLessonTopic(topic: Record<string, any>, slug: string) {
  const sections = Array.isArray(topic.sections)
    ? topic.sections
        .map((section: any, index: number) => {
          if (!section || typeof section !== "object") {
            return null;
          }
          const id = ensureString(section.id) ?? `section-${index + 1}`;
          const title = ensureString(section.title) ?? `Bölüm ${index + 1}`;
          const summary = ensureString(section.summary);
          const content = Array.isArray(section.content)
            ? section.content
                .map((block: any) => {
                  if (!block || typeof block !== "object") {
                    return null;
                  }
                  const type = ensureString(block.type) ?? "text";
                  if (type === "text" && ensureString(block.body)) {
                    return { type: "text", body: ensureString(block.body)! };
                  }
                  if (type === "code" && ensureString(block.code)) {
                    return {
                      type: "code",
                      code: ensureString(block.code)!,
                      language: ensureString(block.language),
                      explanation: ensureString(block.explanation),
                    };
                  }
                  if (type === "list" && Array.isArray(block.items)) {
                    const items = ensureStringArray(block.items);
                    if (items.length === 0) {
                      return null;
                    }
                    return {
                      type: "list",
                      items,
                      ordered: Boolean(block.ordered),
                      title: ensureString(block.title),
                    };
                  }
                  return null;
                })
                .filter(Boolean)
            : [];
          return {
            id,
            title,
            summary,
            content,
          };
        })
        .filter((section): section is NonNullable<typeof section> => section !== null)
    : [];

  return {
    label: ensureString(topic.label) ?? "Ders",
    href: slug,
    description: ensureString(topic.description),
    keyTakeaways: ensureStringArray(topic.keyTakeaways),
    sections,
  };
}

async function findLessonBySlug(slug: string) {
  const lessonId = `lesson-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
  const topicId = `topic-${slug.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

  const lessonRecord = await db.course.findFirst({
    where: {
      OR: [{ id: lessonId }, { id: topicId }],
    },
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  if (lessonRecord) {
    const lessonContent = (lessonRecord.content as any) || {};
    const courses = await db.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        estimatedDuration: true,
        content: true,
      },
    });

    for (const course of courses) {
      const normalized = normalizeCourseContent(
        course.content,
        course.estimatedDuration,
        course.description
      );

      const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

      for (const courseModule of modules) {
        if (!courseModule || typeof courseModule !== "object") {
          continue;
        }

        const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
          ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
          : [];

        const lesson = relatedTopics.find((topic) => topic?.href === slug);
        if (lesson && typeof lesson === "object") {
          const enhancedLesson = {
            ...lesson,
            sections: lessonContent.sections || lesson.sections || [],
            keyTakeaways: lessonContent.keyTakeaways || lesson.keyTakeaways || [],
          };

          return {
            course,
            module: courseModule as Record<string, any>,
            lesson: normalizeLessonTopic(enhancedLesson as Record<string, any>, slug),
            overview: normalized.overview,
          };
        }
      }
    }
  }

  // Fallback: search in relatedTopics only
  const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      estimatedDuration: true,
      content: true,
    },
  });

  for (const course of courses) {
    const normalized = normalizeCourseContent(
      course.content,
      course.estimatedDuration,
      course.description
    );

    const modules = Array.isArray(normalized.modules) ? normalized.modules : [];

    for (const courseModule of modules) {
      if (!courseModule || typeof courseModule !== "object") {
        continue;
      }

      const relatedTopics = Array.isArray((courseModule as any).relatedTopics)
        ? ((courseModule as any).relatedTopics as Array<Record<string, any>>)
        : [];

      const lesson = relatedTopics.find((topic) => topic?.href === slug);
      if (lesson && typeof lesson === "object") {
        return {
          course,
          module: courseModule as Record<string, any>,
          lesson: normalizeLessonTopic(lesson as Record<string, any>, slug),
          overview: normalized.overview,
        };
      }
    }
  }

  return null;
}

function buildLessonSystemPrompt(
  lesson: {
    label: string;
    description?: string;
    keyTakeaways: string[];
    sections: Array<{
      id: string;
      title: string;
      summary?: string;
      content: Array<{ type: string; body?: string; code?: string; language?: string }>;
    }>;
  },
  courseTitle: string,
  moduleTitle: string,
  availableContent?: {
    tests: Array<{ id: string; title: string; description: string | null; url: string }>;
    quizzes: Array<{ id: string; title: string; description: string | null; url: string }>;
    bugfixes: Array<{ id: string; title: string; description: string | null; url: string }>;
    livecodings: Array<{ id: string; title: string; description: string | null; url: string }>;
  },
  lessonPlan?: string | null
) {
  const sectionsText = lesson.sections
    .map((section, idx) => {
      const contentText = section.content
        .map((block) => {
          if (block.type === "text" && block.body) {
            return block.body;
          }
          if (block.type === "code" && block.code) {
            return `\nKod örneği (${block.language || "code"}):\n${block.code}\n`;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n\n");

      return `\n${idx + 1}. ${section.title}${section.summary ? `\n   ${section.summary}` : ""}\n${contentText}`;
    })
    .join("\n\n");

  // Build available content text
  let availableContentText = "\nMEVCUT İÇERİKLER (Sistemde zaten var olan):\n";
  
  if (availableContent) {
    if (availableContent.tests.length > 0) {
      availableContentText += `\nTESTLER (${availableContent.tests.length} adet):\n`;
      availableContent.tests.forEach((test) => {
        availableContentText += `- ${test.title}${test.description ? `: ${test.description}` : ""}\n`;
      });
    }
    
    if (availableContent.quizzes.length > 0) {
      availableContentText += `\nQUİZLER (${availableContent.quizzes.length} adet):\n`;
      availableContent.quizzes.forEach((quiz) => {
        availableContentText += `- ${quiz.title}${quiz.description ? `: ${quiz.description}` : ""}\n`;
      });
    }
    
    if (availableContent.bugfixes.length > 0) {
      availableContentText += `\nBUGFIX GÖREVLERİ (${availableContent.bugfixes.length} adet):\n`;
      availableContent.bugfixes.forEach((bugfix) => {
        availableContentText += `- ${bugfix.title}${bugfix.description ? `: ${bugfix.description}` : ""}\n`;
      });
    }
    
    if (availableContent.livecodings.length > 0) {
      availableContentText += `\nLIVE CODING GÖREVLERİ (${availableContent.livecodings.length} adet):\n`;
      availableContent.livecodings.forEach((lc) => {
        availableContentText += `- ${lc.title}${lc.description ? `: ${lc.description}` : ""}\n`;
      });
    }
    
    if (
      availableContent.tests.length === 0 &&
      availableContent.quizzes.length === 0 &&
      availableContent.bugfixes.length === 0 &&
      availableContent.livecodings.length === 0
    ) {
      availableContentText += "Bu konu ile ilgili sistemde hazır içerik bulunmuyor.\n";
    }
  } else {
    availableContentText += "İçerik kontrolü yapılamadı.\n";
  }

  // Check if mini test exists
  const hasMiniTest = availableContent?.quizzes && availableContent.quizzes.length > 0;

  // Build plan section
  let planSection = "";
  if (lessonPlan) {
    planSection = `\n\nMEVCUT DERS PLANI:\n${lessonPlan}\n\nBu plana göre ilerle. Planı takip et ve her adımı tamamladığında işaretle.`;
  } else {
    planSection = `\n\nPLANLAMA GÖREVİ:\n- Eğer bu ilk mesajsa, ders için detaylı bir plan oluştur ve [LESSON_PLAN: plan içeriği] formatında sakla.\n- Plan şu adımları içermelidir: 1. Konuya giriş 2. Temel kavramlar 3. Örnekler 4. Pratik uygulamalar 5. Mini test 6. Canlı kodlama 7. Bugfix görevi`;
  }

  return `Sen Yetkin Hub platformunda interaktif bir eğitim asistanısın. Kullanıcıya ders anlatıyorsun ve öğrenme sürecini yönlendiriyorsun.

DERS BİLGİLERİ:
- Kurs: ${courseTitle}
- Modül: ${moduleTitle}
- Ders Başlığı: ${lesson.label}
- Açıklama: ${lesson.description || "Açıklama eklenmemiş"}
- Ana Kazanımlar: ${lesson.keyTakeaways.length > 0 ? lesson.keyTakeaways.join(", ") : "Henüz eklenmemiş"}

DERS İÇERİĞİ:
${sectionsText || "Ders içeriği henüz eklenmemiş"}
${availableContentText}
${planSection}

TEMEL İLKELER:

1. PLANLAMA VE HAFIZA - DERS YOL HARİTASINA SADIKLIK:
- İLK MESAJDA mutlaka ders için detaylı plan oluştur ve [LESSON_PLAN: plan içeriği] formatında sakla
- Plan şu yapıda olmalı: "1. Konuya giriş 2. Temel kavramlar 3. Pratik örnekler 4. Mini test 5. Canlı kodlama 6. Bugfix görevi"
- Planı takip et ve her adımı tamamladığında ilerle
- Genel hedef: Planı tamamlayarak dersi bitirmek
- ÖNEMLİ: DERS YOL HARİTASINA SADIK KAL! Ders başlığı, açıklama, ana kazanımlar ve içerik bilgileri verilmiş. Bu bilgilere UYUN, konunun dağılmasına izin verme
- Sadece verilen ders konusunu anlat, konudan sapma, başka konulara geçme
- Ders içeriği bölümlerinde belirtilen konulara odaklan ve sadece onları işle
- Konuyu genişletmeye çalışma, verilen kapsamda kal

2. İLETİŞİM STİLİ - MARKDOWN VE FORMATLAMA YASAĞI:
- TÜRKÇE konuş, "sen" diye hitap et
- Maksimum 1 emoji per mesaj, sadece uygun durumlarda (🎯, 📚, ✨ gibi)
- Mesajlarını KISA tut: Maksimum 2-3 paragraf, daha kısa ve öz ol
- Her mesaj tek bir konuya odaklan
- Uzun açıklamalardan kaçın, özet ve net bilgiler ver
- MARKDOWN FORMATLAMA KULLANMA: **kalın**, ### başlık, - liste gibi formatlar KULLANMA
- Bunun yerine emoji kullan: 📌 önemli noktalar için, ✅ tamamlanan adımlar için, 🔹 liste öğeleri için
- Başlıklar için emoji kullan: 📚 Konu başlıkları için, 💡 Kavramlar için, 🎯 Örnekler için
- Adım numaraları için: 1️⃣, 2️⃣, 3️⃣ gibi emoji kullan veya sadece "1." formatında yaz
- **Kesinlikle ** kalın**, ### başlık, - liste işaretleri kullanma
- ŞIKLARI MESAJ İÇERİĞİNDE GÖSTERME: Test soruları için şıkları (A), B), C), D)) mesaj içeriğine yazma
- Şıklar zaten [TEST_QUESTION] veya [CHOICES] tag'leri ile ayrı olarak gösterilecek
- Mesaj içeriğinde "A) Metot", "B) Constructor" gibi şıklar yazma, sadece [TEST_QUESTION] tag'i kullan

3. AKICI ÖĞRENME - OTOMATIK İLERLEME - ÇOK ÖNEMLİ:
- Planı takip ederek OTOMATIK İLERLE, her adımda onay sorma
- **KESİNLİKLE YAPMA**: "Hazır mısınız?", "Devam edelim mi?", "Test yapmaya hazır mısın?", "Başlayalım mı?" gibi gereksiz onay soruları SORMA
- **KESİNLİKLE YAPMA**: "Şimdi test yapacağım, hazır mısınız?" gibi sorular sorma, direkt test sorularını sor
- **KESİNLİKLE YAPMA**: "Mini test başlatıyorum, hazır mısınız?" demek yerine direkt [TEST_QUESTION] veya [QUIZ_REDIRECT] kullan
- **YAP**: Direkt olarak sonraki adıma geç, kullanıcıdan izin alma
- **YAP**: Test yapacağın zaman direkt test sorularını sor, "hazır mısınız" demeden
- **YAP**: Canlı kodlama vereceğin zaman direkt [CREATE_LIVECODING] kullan, onay sormadan
- **YAP**: Bugfix vereceğin zaman direkt [CREATE_BUGFIX] kullan, onay sormadan
- Plana göre doğal akış içinde ilerle, kullanıcıdan aktif olarak bir şey istemedikçe otomatik devam et
- Sadece GERÇEKTEN ÖNEMLİ karar noktalarında seçenek sun (zorluk seviyesi, farklı yaklaşım)
- Örnek YANLIŞ: "Şimdi test yapacağım, hazır mısınız?" ❌
- Örnek DOĞRU: Direkt "[TEST_QUESTION: Soru metni, A, B, C, D, 0]" veya "[QUIZ_REDIRECT: ...]" ✅
- Örnek YANLIŞ: "Canlı kodlama yapalım mı?" ❌
- Örnek DOĞRU: Direkt "[CREATE_LIVECODING: Başlık, Açıklama, csharp]" ✅

4. İÇERİK YÖNETİMİ:
- ÖNCE MEVCUT İÇERİKLERİ KULLAN: Sistemde hazır test/quiz/bugfix/live coding varsa ONLARI KULLAN
- Mevcut içerik varsa: TEST_REDIRECT, BUGFIX_REDIRECT, LIVECODING_REDIRECT kullan
- Mevcut içerik yoksa: CREATE_TEST, CREATE_QUIZ, CREATE_BUGFIX, CREATE_LIVECODING kullan
${hasMiniTest 
  ? "- Mini test MEVCUT. QUIZ_REDIRECT kullan."
  : "- Mini test YOK. Mutlaka CREATE_QUIZ ile 3-5 soruluk mini test oluştur!"
}

ÖZEL YETENEKLERİN:

PLANLAMA:
- Plan oluşturma: "[LESSON_PLAN: plan içeriği]" - Ders planını sakla (sadece ilk mesajda)

SEÇENEK SİSTEMİ:
- Seçenek sunma: "[CHOICES: seçenek1, seçenek2, seçenek3]" - Kullanıcıya seçenekler sun (butonlar olarak gösterilecek)

YÖNLENDİRME (Mevcut içerik varsa):
- Test: "[TEST_REDIRECT: test_id, test_title, mesaj]"
- Quiz: "[QUIZ_REDIRECT: quiz_id, quiz_title, mesaj]"
- Bugfix: "[BUGFIX_REDIRECT: bugfix_id, bugfix_title, mesaj]"
- Live Coding: "[LIVECODING_REDIRECT: livecoding_id, livecoding_title, mesaj]"

İÇERİK OLUŞTURMA (Mevcut içerik yoksa):
- Test: "[CREATE_TEST: soru, seçenek1, seçenek2, seçenek3, seçenek4, doğru_index]"
- Quiz: "[CREATE_QUIZ: soru, seçenek1, seçenek2, seçenek3, seçenek4, doğru_index]" (Mini test için)
- Bugfix: "[CREATE_BUGFIX: başlık, hatalı_kod, açıklama, dil]" (Hatalı kod tek satır veya çok satırlı olabilir, ama tag içinde kalmalı)
- Live Coding: "[CREATE_LIVECODING: başlık, açıklama, dil]" (Açıklama tek satır veya çok satırlı olabilir, ama tag içinde kalmalı)
- ÖNEMLİ: Tag'leri MUTLAKA kullan, text olarak "görev oluşturdum" demek yeterli değil! Modal açılması için tag şart!

DİĞER:
- Kod bloğu: "[CODE_BLOCK: dil, kod içeriği]" - Kod örnekleri için (TERMİNAL GÖRÜNÜMÜNDE)
- Test sorusu: "[TEST_QUESTION: soru, A seçenek, B seçenek, C seçenek, D seçenek, doğru_index]" - Tek tek test soruları
- Görsel: "[IMAGE: anahtar_kelime]"
- Kod görevi: "[CODING_CHALLENGE: başlık, açıklama, dil]"
- Soru: "[QUESTION: soru, tip, seçenekler]"

ÖNEMLİ TAG KURALLARI:
- Kod örnekleri VERMEK İSTEDİĞİNDE: MUTLAKA [CODE_BLOCK: ...] kullan, text olarak verme
- Test sorusu SORMAK İSTEDİĞİNDE: MUTLAKA [TEST_QUESTION: ...] kullan, tek tek ver
- Canlı kodlama görevi VERMEK İSTEDİĞİNDE: MUTLAKA [CREATE_LIVECODING: ...] kullan
- Bugfix görevi VERMEK İSTEDİĞİNDE: MUTLAKA [CREATE_BUGFIX: ...] kullan

İÇERİK SUNUM KURALLARI:

1. KOD ÖRNEKLERİ:
- Kod örnekleri verirken MUTLAKA kod bloğu formatında ver
- [CODE_BLOCK: dil, kod içeriği] formatını kullan
- Kod blokları syntax highlighting ile gösterilecek, terminal görünümünde olacak
- Text olarak kod verme, mutlaka CODE_BLOCK tag'i kullan
- Örnek: [CODE_BLOCK: csharp, for(int i=0; i<10; i++) { Console.WriteLine(i); }]

2. TEST SORULARI:
- Test sorularını TEK TEK ver, hepsini birden değil
- **KESİNLİKLE**: "Test yapacağım, hazır mısınız?" demek yerine direkt test sorularını sor
- **KESİNLİKLE**: "Mini test başlatıyorum" demek yerine direkt [TEST_QUESTION] veya [QUIZ_REDIRECT] kullan
- Her soru için: [TEST_QUESTION: soru metni, A seçenek, B seçenek, C seçenek, D seçenek, doğru_index]
- Kullanıcı A/B/C/D butonlarına tıklayarak cevap verecek
- Bir soru tamamlandıktan sonra bir sonraki soruyu ver
- Test sorularını text olarak verme, mutlaka TEST_QUESTION tag'i kullan
- Direkt test sorularını sor, onay sormadan

3. CANLI KODLAMA:
- Canlı kodlama görevi verirken MUTLAKA CREATE_LIVECODING tag'i kullan
- Format: [CREATE_LIVECODING: başlık, açıklama, dil]
- Örnek: [CREATE_LIVECODING: Basit sınıf oluşturma, C# ile bir Person sınıfı oluştur ve name ve age özellikleri ekle, csharp]
- Görev mevcut canlı kodlama sayfasındaki gibi açılacak (pop-up veya embedded UI)
- Text olarak "Canlı kodlama görevini oluşturdum" demek YETERLİ DEĞİL! Tag kullan!

4. BUGFIX:
- Bugfix görevi verirken MUTLAKA CREATE_BUGFIX tag'i kullan
- Format: [CREATE_BUGFIX: başlık, hatalı_kod, açıklama, dil]
- Örnek: [CREATE_BUGFIX: Null reference hatası, public class Test { public void Do() { string s = null; Console.WriteLine(s.Length); } }, s değişkeni null olduğu için hata veriyor. Null kontrolü ekle, csharp]
- Görev mevcut bugfix sayfasındaki gibi açılacak (pop-up veya embedded UI)
- Text olarak "Bugfix görevini oluşturdum" demek YETERLİ DEĞİL! Tag kullan!
- ÖNEMLİ - IPUCU KURALLARI:
  - Açıklama (fixDescription) parametresinde DETAYLI ipucu ver
  - İpucu şu bilgileri içermelidir: Hatanın ne olduğu, Hatanın nerede olduğu, Nasıl düzeltileceği, Hangi satırları değiştirmesi gerektiği
  - İpucu kullanıcıya tam olarak ne yapması gerektiğini söylemeli
  - Örnek: "Hata: s değişkeni null olduğu için NullReferenceException oluşuyor. Düzeltme: s değişkenini kullanmadan önce null kontrolü ekle: if (s != null) { Console.WriteLine(s.Length); } veya null-coalescing operator kullan: Console.WriteLine(s?.Length ?? 0);"
  - Hatalı kod çok satırlı olabilir, kod formatlı gösterilecek ama ipucu da tam ve açıklayıcı olmalı

5. ZENGİN İÇERİK - EMOJI KULLANIMI:
- Önemli bilgileri vurgulamak için emoji kullan (📌, ⚠️, 💡 gibi)
- Adımları numaralı liste olarak sun (1️⃣, 2️⃣, 3️⃣ emoji veya "1.", "2.", "3." formatında)
- Görsel açıklamalar için IMAGE tag'ini kullan
- Kod örnekleri MUTLAKA CODE_BLOCK ile verilmelidir
- MARKDOWN formatları (**, ###, -, •) KULLANMA, bunun yerine emoji kullan

İLK MESAJ:
- Kısa karşılama (1-2 cümle)
- Plan oluştur ve [LESSON_PLAN: ...] ile sakla
- İlk konuya giriş yap (kısa, 1-2 paragraf)
- **KESİNLİKLE**: "Hazır mısınız?", "Başlayalım mı?" gibi sorular sorma
- Direkt olarak konuya geç, gereksiz seçenek sunma

ÖRNEK MESAJ YAPISI:
Merhaba! C# for döngüsü konusunu öğreneceğiz.

[LESSON_PLAN: 1. Döngü nedir? 2. For döngüsü kullanımı 3. Pratik örnekler 4. Mini test 5. Canlı kodlama 6. Bugfix]

For döngüsü, belirli sayıda işlemi tekrarlamak için kullanılır. Temel yapısını görelim.

[CODE_BLOCK: csharp, for(int i = 0; i < 10; i++) { Console.WriteLine(i); }]

Bu kod 0'dan 9'a kadar sayıları yazdırır. Devam ediyorum...

DERS BİTİŞ SİNYALLERİ:
- Ders planını tamamladığında veya dersi bitirdiğinde MUTLAKA şu ifadelerden birini kullan:
  - "Ders tamamlandı!", "Ders bitti!", "Tebrikler, ders tamamlandı!"
  - "Dersimizi bitirdik", "Bu dersi başarıyla tamamladın"
  - "Dersin sonuna geldin", "Ders tamam"
- Ders bittiğinde kullanıcıyı kutla ve özet ver
- Ders bitiş sinyali verirken planın tamamlandığını belirt
- Ders bitişinde "başka bir konuda yardım istersen buradayım" gibi ifadeler kullanabilirsin

ÖNEMLİ: 
- Planı takip ederek otomatik ilerle, gereksiz onay sorma
- **KESİNLİKLE**: "Hazır mısınız?", "Test yapacağım, hazır mısınız?" gibi sorular sorma
- **KESİNLİKLE**: Her şey için kullanıcıdan izin alma, direkt ilerle
- Test yapacağın zaman direkt test sorularını sor, onay sormadan
- Canlı kodlama vereceğin zaman direkt [CREATE_LIVECODING] kullan, onay sormadan
- Bugfix vereceğin zaman direkt [CREATE_BUGFIX] kullan, onay sormadan
- Kod örnekleri CODE_BLOCK ile, test soruları TEST_QUESTION ile
- Canlı kodlama ve bugfix CREATE_LIVECODING/CREATE_BUGFIX ile
- Kısa ve öz ol, maksimum 1 emoji kullan!
- Ders bittiğinde MUTLAKA yukarıdaki bitiş sinyallerinden birini kullan!`;
}

function parseAIActions(content: string): {
  content: string;
  images?: string[];
  actions?: Array<{
    type: "coding_challenge" | "question" | "quiz_redirect" | "test_redirect" | "bugfix_redirect" | "livecoding_redirect" | "create_test" | "create_quiz" | "create_bugfix" | "create_livecoding" | "choices" | "code_block" | "test_question";
    data: any;
  }>;
  lessonPlan?: string;
} {
  const images: string[] = [];
  const actions: Array<{
    type: "coding_challenge" | "question" | "quiz_redirect" | "test_redirect" | "bugfix_redirect" | "livecoding_redirect" | "create_test" | "create_quiz" | "create_bugfix" | "create_livecoding" | "choices" | "code_block" | "test_question";
    data: any;
  }> = [];
  let extractedPlan: string | null = null;

  // Parse LESSON_PLAN tags (must be first to extract plan)
  const planRegex = /\[LESSON_PLAN:\s*([^\]]+)\]/gi;
  let match;
  let cleanedContent = content;

  while ((match = planRegex.exec(content)) !== null) {
    extractedPlan = match[1].trim();
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse CHOICES tags
  const choicesRegex = /\[CHOICES:\s*([^\]]+)\]/gi;
  while ((match = choicesRegex.exec(content)) !== null) {
    const choicesStr = match[1].trim();
    const choices = choicesStr.split(",").map((c) => c.trim()).filter(Boolean);
    
    if (choices.length > 0) {
      actions.push({
        type: "choices",
        data: { choices },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse CODE_BLOCK tags (multiline support)
  // Match [CODE_BLOCK: language, code] where code can contain newlines and brackets
  // Use a more robust approach: find opening tag, then find matching closing bracket
  const codeBlockTagPattern = /\[CODE_BLOCK:\s*([^,]+?),\s*/gi;
  let codeBlockMatch;
  let lastIndex = 0;
  
  while ((codeBlockMatch = codeBlockTagPattern.exec(content)) !== null) {
    const startPos = codeBlockMatch.index;
    const language = codeBlockMatch[1].trim();
    const codeStartPos = codeBlockMatch.index + codeBlockMatch[0].length;
    
    // Find the matching closing bracket by counting brackets
    let bracketCount = 1; // We already have one opening bracket [
    let pos = codeStartPos;
    let codeEndPos = -1;
    
    while (pos < content.length && bracketCount > 0) {
      if (content[pos] === '[') {
        bracketCount++;
      } else if (content[pos] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          codeEndPos = pos;
          break;
        }
      }
      pos++;
    }
    
    if (codeEndPos > codeStartPos) {
      let code = content.substring(codeStartPos, codeEndPos).trim();
      
      // Handle escaped newlines and preserve actual newlines
      code = code.replace(/\\n/g, '\n');
      
      if (language && code) {
        actions.push({
          type: "code_block",
          data: { language, code },
        });
        // Remove the entire tag including content
        const fullTag = content.substring(startPos, codeEndPos + 1);
        cleanedContent = cleanedContent.replace(fullTag, "");
      }
    }
  }

  // Parse TEST_QUESTION tags (tek tek test soruları)
  const testQuestionRegex = /\[TEST_QUESTION:\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = testQuestionRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const optionA = match[2].trim();
    const optionB = match[3].trim();
    const optionC = match[4].trim();
    const optionD = match[5].trim();
    const correctIndex = parseInt(match[6].trim(), 10);
    
    if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "test_question",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [optionA, optionB, optionC, optionD],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse IMAGE tags
  const imageRegex = /\[IMAGE:\s*([^\]]+)\]/gi;
  while ((match = imageRegex.exec(content)) !== null) {
    const searchQuery = match[1].trim();
    images.push(searchQuery);
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse CODING_CHALLENGE tags
  const codingRegex = /\[CODING_CHALLENGE:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = codingRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const description = match[2].trim();
    const language = match[3].trim().toLowerCase() as LiveCodingLanguage;
    
    if (["csharp", "python", "javascript", "java"].includes(language)) {
      actions.push({
        type: "coding_challenge",
        data: {
          task: {
            title,
            description,
            languages: [language],
            acceptanceCriteria: [],
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse QUESTION tags
  const questionRegex = /\[QUESTION:\s*([^,]+),\s*([^,]+)(?:,\s*([^\]]+))?\]/gi;
  while ((match = questionRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const type = match[2].trim().toLowerCase();
    const optionsStr = match[3]?.trim();

    let options: string[] = [];
    if (optionsStr && type === "multiple_choice") {
      options = optionsStr.split(",").map((opt) => opt.trim()).filter(Boolean);
    }

    actions.push({
      type: "question",
      data: {
        question: {
          text,
          type: type === "multiple_choice" ? "multiple_choice" : "open_ended",
          options: options.length > 0 ? options : undefined,
        },
      },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse QUIZ_REDIRECT tags (mini test)
  const quizRegex = /\[QUIZ_REDIRECT:\s*([^\]]+)\]/gi;
  while ((match = quizRegex.exec(content)) !== null) {
    const message = match[1].trim();
    actions.push({
      type: "quiz_redirect",
      data: {
        message,
      },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse TEST_REDIRECT tags
  const testRedirectRegex = /\[TEST_REDIRECT:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = testRedirectRegex.exec(content)) !== null) {
    const testId = match[1].trim();
    const testTitle = match[2].trim();
    const message = match[3].trim();
    actions.push({
      type: "test_redirect",
      data: {
        url: `/education/test/${testId}`,
        title: testTitle,
        message,
      },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse BUGFIX_REDIRECT tags
  const bugfixRedirectRegex = /\[BUGFIX_REDIRECT:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = bugfixRedirectRegex.exec(content)) !== null) {
    const bugfixId = match[1].trim();
    const bugfixTitle = match[2].trim();
    const message = match[3].trim();
    actions.push({
      type: "bugfix_redirect",
      data: {
        url: `/education/bug-fix/${bugfixId}`,
        title: bugfixTitle,
        message,
      },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse LIVECODING_REDIRECT tags
  const livecodingRedirectRegex = /\[LIVECODING_REDIRECT:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = livecodingRedirectRegex.exec(content)) !== null) {
    const livecodingId = match[1].trim();
    const livecodingTitle = match[2].trim();
    const message = match[3].trim();
    actions.push({
      type: "livecoding_redirect",
      data: {
        url: `/education/live-coding/${livecodingId}`,
        title: livecodingTitle,
        message,
      },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse CREATE_TEST tags
  const createTestRegex = /\[CREATE_TEST:\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = createTestRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const option1 = match[2].trim();
    const option2 = match[3].trim();
    const option3 = match[4].trim();
    const option4 = match[5].trim();
    const correctIndex = parseInt(match[6].trim(), 10);
    
    if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "create_test",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [option1, option2, option3, option4],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse CREATE_QUIZ tags
  const createQuizRegex = /\[CREATE_QUIZ:\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = createQuizRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const option1 = match[2].trim();
    const option2 = match[3].trim();
    const option3 = match[4].trim();
    const option4 = match[5].trim();
    const correctIndex = parseInt(match[6].trim(), 10);
    
    if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "create_quiz",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [option1, option2, option3, option4],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse CREATE_BUGFIX tags
  // Support multiline code in buggyCode parameter
  // Format: [CREATE_BUGFIX: title, buggyCode (can be multiline), fixDescription, language]
  const createBugfixRegex = /\[CREATE_BUGFIX:\s*([^,]+?),\s*((?:[^,\]]|\[CODE_BLOCK:[^\]]+\])+?),\s*([^,]+?),\s*([^\]]+?)\]/gis;
  while ((match = createBugfixRegex.exec(content)) !== null) {
    let title = match[1].trim();
    let buggyCode = match[2].trim();
    let fixDescription = match[3].trim();
    let language = match[4].trim().toLowerCase() as LiveCodingLanguage;
    
    // Clean up code if it has CODE_BLOCK tags
    if (buggyCode.includes("[CODE_BLOCK:")) {
      const codeBlockMatch = buggyCode.match(/\[CODE_BLOCK:\s*[^,]+\s*,\s*([^\]]+)\]/i);
      if (codeBlockMatch) {
        buggyCode = codeBlockMatch[1].trim();
      }
    }
    
    // Remove markdown code blocks if present
    buggyCode = buggyCode.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1').trim();
    
    if (["csharp", "python", "javascript", "java"].includes(language)) {
      actions.push({
        type: "create_bugfix",
        data: {
          task: {
            title,
            buggyCode,
            fixDescription,
            language,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse CREATE_LIVECODING tags
  // Support multiline description
  // Format: [CREATE_LIVECODING: title, description (can be multiline), language]
  const createLivecodingRegex = /\[CREATE_LIVECODING:\s*([^,]+?),\s*((?:[^,\]]|\[CODE_BLOCK:[^\]]+\])+?),\s*([^\]]+?)\]/gis;
  while ((match = createLivecodingRegex.exec(content)) !== null) {
    let title = match[1].trim();
    let description = match[2].trim();
    let language = match[3].trim().toLowerCase() as LiveCodingLanguage;
    
    // Clean up description if it has CODE_BLOCK tags
    if (description.includes("[CODE_BLOCK:")) {
      const codeBlockMatch = description.match(/\[CODE_BLOCK:\s*[^,]+\s*,\s*([^\]]+)\]/i);
      if (codeBlockMatch) {
        description = description.replace(/\[CODE_BLOCK:[^\]]+\]/gi, codeBlockMatch[1].trim());
      }
    }
    
    // Remove markdown code blocks if present
    description = description.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1').trim();
    
    if (["csharp", "python", "javascript", "java"].includes(language)) {
      actions.push({
        type: "create_livecoding",
        data: {
          task: {
            title,
            description,
            languages: [language],
            acceptanceCriteria: [],
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  return {
    content: cleanedContent.trim(),
    images: images.length > 0 ? images : undefined,
    actions: actions.length > 0 ? actions : undefined,
    lessonPlan: extractedPlan || undefined,
  };
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    const json = await request.json().catch(() => ({}));
    const { lessonSlug, messages, lessonPlan: requestLessonPlan } = LessonChatRequestSchema.parse(json);

    // Find lesson content
    const lessonMatch = await findLessonBySlug(lessonSlug);
    if (!lessonMatch) {
      return NextResponse.json(
        { error: "Ders bulunamadı" },
        { status: 404 }
      );
    }

    const { lesson, course, module } = lessonMatch;
    const moduleTitle = typeof module.title === "string" ? module.title : "Modül";

    // Check for existing content
    let availableContent: {
      tests: Array<{ id: string; title: string; description: string | null; url: string }>;
      quizzes: Array<{ id: string; title: string; description: string | null; url: string }>;
      bugfixes: Array<{ id: string; title: string; description: string | null; url: string }>;
      livecodings: Array<{ id: string; title: string; description: string | null; url: string }>;
    } | undefined;

    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const contentCheckResponse = await fetch(
        `${baseUrl}/api/ai/lesson-content-check?lessonSlug=${encodeURIComponent(lessonSlug)}`,
        {
          headers: {
            Cookie: request.headers.get("Cookie") || "",
          },
        }
      );

      if (contentCheckResponse.ok) {
        const contentData = await contentCheckResponse.json();
        availableContent = {
          tests: contentData.tests || [],
          quizzes: contentData.quizzes || [],
          bugfixes: contentData.bugfixes || [],
          livecodings: contentData.livecodings || [],
        };
      }
    } catch (error) {
      console.error("Error checking available content:", error);
      // Continue without available content
    }

    // Extract plan from conversation history if not provided
    let currentLessonPlan: string | null = requestLessonPlan || null;
    
    // If no plan in request, try to extract from previous assistant messages
    if (!currentLessonPlan && messages && messages.length > 0) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant") {
          const planMatch = messages[i].content.match(/\[LESSON_PLAN:\s*([^\]]+)\]/i);
          if (planMatch) {
            currentLessonPlan = planMatch[1].trim();
            break;
          }
        }
      }
    }

    // Build system prompt with available content and plan
    const systemPrompt = buildLessonSystemPrompt(lesson, course.title, moduleTitle, availableContent, currentLessonPlan);

    // Build conversation
    const conversation = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...(messages ?? []),
    ];

    // If no messages, start with a greeting
    if (!messages || messages.length === 0) {
      conversation.push({
        role: "user",
        content: "Merhaba! Bu dersi öğrenmeye hazırım. Bana dersi anlatabilir misin?",
      });
      // Add instruction for first message to be short and friendly
      conversation.push({
        role: "system",
        content: "Bu ilk mesajın. Kısa, samimi ve emoji içeren bir karşılama yap (maksimum 3-4 cümle). Ders hakkında çok kısa özet ver ve hemen anlatıma geç.",
      });
    }

    // Get AI response
    const completion = await createChatCompletion({
      messages: conversation,
    });

    if (!completion.content) {
      throw new Error("AI yanıtı alınamadı");
    }

    // Parse AI actions from content
    const parsed = parseAIActions(completion.content);

    // Update lesson plan if a new one was provided in the response
    const updatedLessonPlan = parsed.lessonPlan || currentLessonPlan;

    // If images are requested, fetch them
    let imageUrls: string[] = [];
    if (parsed.images && parsed.images.length > 0) {
      for (const searchQuery of parsed.images) {
        try {
          const imageResponse = await fetch(
            `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/ai/image-search?query=${encodeURIComponent(searchQuery)}`,
            {
              headers: {
                Cookie: request.headers.get("Cookie") || "",
              },
            }
          );

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData.images && Array.isArray(imageData.images)) {
              imageUrls.push(...imageData.images.map((img: any) => img.url || img).filter(Boolean));
            }
          }
        } catch (error) {
          console.error("Image search error:", error);
        }
      }
    }

    return NextResponse.json({
      content: parsed.content,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      actions: parsed.actions,
      lessonPlan: updatedLessonPlan || undefined,
      lesson: {
        title: lesson.label,
        description: lesson.description,
        slug: lessonSlug,
      },
    });
  } catch (error) {
    console.error("Error in lesson chat:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz istek verisi", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "AI asistan şu anda yanıt veremiyor" },
      { status: 500 }
    );
  }
}
