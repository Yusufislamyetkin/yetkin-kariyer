# Mini Test Soruları Döngü ve Görüntüleme Problemini Çözme Planı

## Problem Analizi

Ekranda görülen sorunlar:
1. **Döngüsel tekrar**: AI sürekli "Cevabını bekliyorum!" mesajı gönderiyor
2. **Eksik şıklar**: "şıkları vermedin" mesajı - AI MINI_TEST formatını doğru kullanmıyor
3. **Soru durumu takibi yok**: Hangi soruların sorulduğu/cevaplandığı takip edilmiyor
4. **Geribildirim yok**: Format hatalı olduğunda AI'ya düzeltme bildirimi yok
5. **Kart formatında gösterilmeme**: Mini test soruları bazen kart olarak gösterilmiyor, sadece metin mesajı olarak kalıyor

## Kök Neden Analizi

1. **Format Validation Eksikliği**: AI'dan gelen MINI_TEST formatı validate edilmiyor, hatalı formatlar frontend'e geçiyor
2. **Parsing Hataları**: Action parser bazen hatalı formatları yakalayamıyor veya yanlış parse ediyor
3. **State Management**: Frontend'de mini test sorularının durumu düzgün takip edilmiyor
4. **UI Rendering Logic**: Kart gösterimi için gerekli koşullar her zaman sağlanmıyor
5. **AI Geri Bildirim Eksikliği**: Hatalı format için AI'ya düzeltme mesajı gönderilmiyor

## Çözüm Yapısı

### 1. Thread Metadata ve Quiz Tracking
**Dosya**: `lib/ai/lesson-assistant.ts`, `app/api/ai/lesson-assistant/route.ts`

- Thread metadata'ya quiz state ekle:
  - `askedQuestions`: Sorulan soruların listesi (duplicate prevention)
  - `currentQuestionIndex`: Şu anki aktif soru index'i
  - `answeredQuestions`: Cevaplanan sorular
  - `pendingQuestions`: Bekleyen sorular
  - `lastQuestionTime`: Son soru zamanı (loop detection için)

- Aynı sorunun tekrar sorulmasını engelle
- Quiz progress'i thread'e kaydet

### 2. Format Validation ve Geri Bildirim Döngüsü
**Dosya**: `lib/ai/lesson-action-parser.ts`, `app/api/ai/lesson-assistant/route.ts`

- `validateMiniTestFormat()` fonksiyonu oluştur:
  - Hata kategorileri: `MISSING_OPTIONS`, `INVALID_FORMAT`, `MISSING_QUESTION`, `INVALID_INDEX`
  - Detaylı hata mesajları döndür
  - Parse edilebilir format kontrolü

- Hatalı format için otomatik geri bildirim:
  - Validation başarısız olursa AI'ya correction mesajı gönder
  - Retry mekanizması (max 2 retry)
  - Hata kategorisine göre özel düzeltme mesajı

### 3. Action Parser İyileştirmeleri
**Dosya**: `lib/ai/lesson-action-parser.ts`

- Gelişmiş MINI_TEST parsing:
  - Daha esnek format handling (malformed patterns)
  - Otomatik düzeltme denemeleri
  - Detaylı error logging ve kategorizasyon
  - Partial parsing (eğer bazı şıklar eksikse uyarı ver ama parse et)

- Parsing sonucu metadata:
  - `parseStatus`: `success`, `partial`, `failed`
  - `errors`: Hata listesi
  - `warnings`: Uyarı listesi

### 4. Prompt Builder İyileştirmeleri
**Dosya**: `lib/ai/lesson-prompt-builder.ts`

- Format validation kurallarını güçlendir:
  - Daha fazla örnek (doğru ve yanlış)
  - Hata önleme mekanizmaları
  - Format hatası durumunda ne yapılacağı açıklama

- Context-aware prompting:
  - Eğer önceki soruda format hatası varsa, bunu prompt'a ekle
  - Thread metadata'dan quiz durumunu al ve prompt'a ekle

### 5. Frontend: Mini Test Kart Gösterimi
**Dosya**: `app/(dashboard)/education/lessons/_components/LessonChat.tsx`

- Kart gösterimi garantisi:
  - `pendingTestQuestions` state'ini düzgün yönet
  - `handleActions` fonksiyonunda mini_test action'larını her zaman topla
  - Inline rendering ve end-of-list rendering'i birleştir
  - Parsing hatalarında bile fallback gösterimi sağla

- State management iyileştirmeleri:
  - `currentTestQuestionIndex` doğru güncelle
  - `answeredTestQuestionIndex` tracking
  - Question deduplication

- Error handling:
  - Parsing hatası durumunda kullanıcıya bilgi ver
  - Retry butonu göster
  - Debug bilgilerini göster (development mode)

### 6. Frontend: TestQuestionChatbox İyileştirmeleri
**Dosya**: `app/(dashboard)/education/lessons/_components/TestQuestionChatbox.tsx`

- Daha iyi error handling:
  - Partial options durumunda uyarı göster ama soruyu göster
  - Missing question durumunda placeholder göster
  - Format hatası durumunda retry seçeneği

- Visual improvements:
  - Loading state
  - Error state
  - Success state

### 7. Loop Prevention
**Dosya**: `app/api/ai/lesson-assistant/route.ts`

- Duplicate question detection:
  - Aynı sorunun X dakika içinde tekrar sorulmasını engelle
  - Thread metadata'dan son soru zamanını kontrol et

- Message pattern detection:
  - "Cevabını bekliyorum" gibi tekrarlayan mesajları tespit et
  - Context'e quiz state ekle ki AI tekrar sormasın

## Dosya Değişiklikleri

1. `lib/ai/lesson-assistant.ts` - Thread metadata quiz tracking
2. `app/api/ai/lesson-assistant/route.ts` - Format validation, geri bildirim döngüsü, loop prevention
3. `lib/ai/lesson-action-parser.ts` - Gelişmiş parsing, validation, error handling
4. `lib/ai/lesson-prompt-builder.ts` - Format validation kuralları, context-aware prompting
5. `app/(dashboard)/education/lessons/_components/LessonChat.tsx` - State management, kart gösterimi garantisi
6. `app/(dashboard)/education/lessons/_components/TestQuestionChatbox.tsx` - Error handling, visual improvements

## Uygulama Adımları

### Faz 1: Backend - Validation ve Tracking
1. Format validation fonksiyonu oluştur
2. Thread metadata'ya quiz tracking ekle
3. API route'a validation ve geri bildirim ekle
4. Action parser'ı geliştir

### Faz 2: Backend - Prompt ve Context
5. Prompt builder'a validation kuralları ekle
6. Context-aware prompting implementasyonu
7. Loop prevention mekanizması

### Faz 3: Frontend - State ve Rendering
8. State management iyileştirmeleri
9. Kart gösterimi garantisi
10. Error handling ve UI iyileştirmeleri

### Faz 4: Test ve Doğrulama
11. Tüm senaryoları test et
12. Edge case'leri handle et
13. Performance optimization

## Beklenen Sonuçlar

1. ✅ Mini test soruları her zaman kart formatında gösterilecek
2. ✅ Format hataları yakalanacak ve AI'ya geri bildirim verilecek
3. ✅ Döngüsel tekrar problemi çözülecek
4. ✅ Soru durumu düzgün takip edilecek
5. ✅ Kullanıcı deneyimi iyileştirilecek (hata mesajları, retry seçenekleri)

