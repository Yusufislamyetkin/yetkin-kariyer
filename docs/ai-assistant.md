# AI Assistant Integration Guide

Bu döküman, platformda kullanılan OpenAI tabanlı özellikleri, gerekli ortam değişkenlerini ve ChatGPT asistanı için kullanılacak sistem promptunu detaylandırır.

## 1. Özellik Özeti

- **Quiz Analizi & Mentor Sohbeti**: `/api/ai/analyze-quiz` ve `/api/ai/tutor`
- **Mülakat Analizi**: `/api/ai/analyze-interview`
- **İş Uyum Analizi**: `/api/ai/job-match`
- **Dashboard Önerileri**: `/api/ai/dashboard-insights` (mentor tarzı 3 aksiyon kartı döner)
- **Kariyer Planı**: `/api/ai/generate-career-plan`

Tüm uç noktalar AI servisinin aktif olmasını gerektirir.

## 2. Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI API anahtarı | - |
| `OPENAI_CHAT_MODEL` | Genel sohbet modeli | `gpt-4o-mini` |
| `OPENAI_JSON_MODEL` | JSON çıktı odaklı model | `OPENAI_CHAT_MODEL` |
| `OPENAI_TEMPERATURE` | Varsayılan sıcaklık | `0.7` |
| `OPENAI_MAX_RETRIES` | İstek tekrar sayısı | `2` |
| `OPENAI_TIMEOUT_MS` | Zaman aşımı (ms) | `20000` |
| `OPENAI_TRANSCRIPTION_MODEL` | Mülakat transkripsiyonu için model | `gpt-4o-mini-transcribe` |
| `AI_DISABLE` | `true` ise tüm AI çağrıları devre dışı kalır | - |
| `AI_USER_AGENT` | OpenAI istekleri için UA etiketi | `ai-recruit-platform/ai-client` |

> Not: `AI_DISABLE` env değişkeni ayarlanırsa kullanıcıya sade fallback mesajları gösterilir.

## 3. Kullanıma Hazır Sistem Promptu

Aşağıdaki prompt, ChatGPT bazlı bir asistanı platforma entegre ederken sistem mesajı olarak kullanılmalıdır.

```
You are “Yetkin Mentor”, the AI career copilot inside Yetkin Hub.
Your mission is to help Turkish-speaking candidates grow their skills, pass interviews, and land jobs.

Tone & Style:
- Be encouraging, actionable, and concise (max 4 sentences per answer).
- Prefer bullet points for lists.
- Refer to the user as “sen” and use Turkish UI terminology (ör. “Gönder”, “AI Analizi”).

Data you can reference when provided:
- Quiz & interview stats, CV metadata, job descriptions, personalized lessons, career plans.
- Weak topics or missing skills should become action items.

Behaviour Rules:
- Suggest concrete next steps (ör. “Bu hafta 2 kez Node.js pratik yap”).
- Offer platform-native guidance before dış kaynak (ör. Yetkin Hub kursları).
- If requested data is unavailable, say you don’t have it and propose how user can obtain it.
- Never expose raw JSON or system internals; summarise in natural language.
- For cover letter requests, output 3 kısa paragraf ve Türkçe imza (“Saygılarımla,<br/>[Ad Soyad]”).
- When preparing dashboard mentors, only use CTA linkleri sistemin verdiği resource listelerinden seç ve her kart için timeframe + actionSteps üret.
```

## 4. Mesaj Formatı

Asistanla konuşurken OpenAI Chat API sözleşmesi korunmalıdır:

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "<SYSTEM_PROMPT>" },
    { "role": "user", "content": "Güncel ATS skorumu nasıl yükseltebilirim?" }
  ]
}
```

- `assistant` mesajları UI tarafında saklanabilir.
- JSON çıktısı isteniyorsa `response_format: { "type": "json_object" }` ekleyin.

## 5. Oran Limitleri & Dayanıklılık

- Varsayılan tekrar denemeleri (`OPENAI_MAX_RETRIES`) artan gecikme ile çalışır.
- Timeout (`OPENAI_TIMEOUT_MS`) aşıldığında kullanıcıya “AI servisi şu anda yanıt vermiyor” mesajı dönülür.
- Gerektiğinde `AI_DISABLE=true` set edilerek tüm AI çağrıları hızlıca devre dışı bırakılabilir.

## 6. Test Senaryoları

- `GET /api/ai/dashboard-insights` → 3 mentor kartı dönmeli (AI kapalıysa fallback uygulanır).
- Mentör kartı formatı:

```json
{
  "source": "ai",
  "recommendations": [
    {
      "title": "Node.js Modülünü Pekiştir",
      "summary": "Bu hafta Node.js zayıf konunu kurs üzerinden tamamla.",
      "actionSteps": [
        "Bugün Node.js modülünü aç ve notlarını güncelle.",
        "Hafta içinde 2 mini egzersiz çöz.",
        "Hafta sonu aynı testi tekrar çöz."
      ],
      "timeframe": "Bu hafta",
      "ctaLabel": "Kursa Git",
      "ctaHref": "/education/courses?search=Node.js",
      "category": "Teknik Gelişim",
      "relatedGoalId": "goal_123",
      "metric": "Hedef: %80 üzeri skor"
    }
  ]
}
```

- AI devre dışı / hata durumunda `source: "fallback"` veya `source: "fallback-error"` döner; kartlar deterministik kurallarla oluşturulur.
- `POST /api/ai/job-match` → Match skoru, güçlü/gelişim alanları ve ön yazı döner.
- `POST /api/ai/analyze-interview` → kategori bazlı puanlar ve aksiyon maddeleri bulunur.

Tüm AI uç noktaları `401` (yetkisiz) ve `503` (AI devre dışı) durum kodlarını yönetir.

## 7. İleri Plan

- Asistan için kullanıcı mesaj geçmişini saklayarak bağlamsal sohbet deneyimi genişletilebilir.
- AI tabanlı CV optimizasyonu ileride yeniden değerlendirilebilir ve ATS skorları platform raporlarına entegre edilebilir.

Bu doküman güncellendikçe yeni özellikler ve prompt varyasyonları eklenmelidir.


