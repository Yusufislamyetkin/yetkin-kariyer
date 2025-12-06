# Prisma Query Analizi - Dashboard Performans Sorunu

## Mevcut Durum

Dashboard sayfası yüklendiğinde **300-500+ Prisma query** çalışıyor. Bu normal değil!

## Query Dağılımı

### 1. `/api/dashboard/stats` - 12 query ✅ (Optimize edildi)
- `quizAttempt.count` - 1 query
- `quizAttempt.aggregate` - 1 query  
- `testAttempt.count` - 1 query
- `interviewAttempt.count` - 1 query
- `interviewAttempt.aggregate` - 1 query
- `cV.count` - 1 query
- `jobApplication.count` - 1 query
- `lessonCompletion.count` - 1 query
- `hackathonTeamMember.findMany` - 1 query
- `post.count` - 1 query
- `postComment.count` - 1 query
- `chatMessage.count` - 1 query

**Toplam: 12 query** (Paralel çalışıyor, optimize edildi)

### 2. `/api/competition/leaderboard` - 100+ query ❌ (EN BÜYÜK SORUN)

Her leaderboard çağrısı için:
- `course.findMany` - 1 query
- `quizAttempt.findMany` - 1 query (TÜM kullanıcıların quiz'leri)
- `testAttempt.findMany` - 1 query (TÜM kullanıcıların test'leri)
- `liveCodingAttempt.findMany` - 1 query
- `bugFixAttempt.findMany` - 1 query
- `hackatonAttempt.findMany` - 1 query
- `userEarnedPoint.groupBy` - 1 query
- `user.findMany` - 1 query (TÜM kullanıcılar)
- `userBadge.findMany` - 1 query (TÜM kullanıcıların badge'leri)
- `leaderboardEntry.findMany` - 1 query (Eski sıralamalar)
- `leaderboardEntry.upsert` - 100 query (Her kullanıcı için)
- `leaderboardEntry.findUnique` - Potansiyel 100 query (Monthly winner için)

**Dashboard'da 3 çağrı var (daily, weekly, monthly):**
- **Toplam: 300-500+ query sadece leaderboard için!**

### 3. `/api/badges/user` - 2-3 query ✅
- `userBadge.findMany` - 1 query
- `badge.findMany` - 1 query
- JSON dosyası okuma (query değil)

**Toplam: 2-3 query**

### 4. `/api/strike` - 10-20 query ⚠️
- `user.findUnique` - 1 query
- `userStreak.findUnique` - 1 query
- `userStreak.create` - Potansiyel 1 query
- `lessonCompletion.findMany` - 1 query
- `quizAttempt.findMany` - 1 query
- `post.findMany` - 1 query
- `postComment.findMany` - 1 query
- `chatMessage.findMany` - 1 query
- `userEarnedPoint.findMany` - 1 query
- Ve daha fazlası...

**Toplam: 10-20 query**

### 5. `/api/ai/dashboard-insights` - 20-50 query ⚠️
- `quizAttempt.aggregate` - 1 query
- `interviewAttempt.aggregate` - 1 query
- `careerPlan.findFirst` - 1 query
- `goal.findMany` - 1 query
- `quizAttempt.findMany` - 1 query (düşük skorlar)
- `competition.findMany` - 1 query
- Ve daha fazlası...

**Toplam: 20-50 query**

### 6. `/api/profile/activity` - 10-30 query ⚠️
- `quizAttempt.findMany` - 1 query
- `interviewAttempt.findMany` - 1 query
- `lessonCompletion.findMany` - 1 query
- `cV.findMany` - 1 query
- `jobApplication.findMany` - 1 query
- `badgeEarned.findMany` - 1 query
- `hackatonAttempt.findMany` - 1 query
- Ve daha fazlası...

**Toplam: 10-30 query**

## Toplam Query Sayısı

**Minimum: 12 + 300 + 2 + 10 + 20 + 10 = 354 query**
**Maksimum: 12 + 500 + 3 + 20 + 50 + 30 = 615 query**

## Sorunlar

1. **Leaderboard API çok verimsiz**: Dashboard'da sadece kullanıcının sıralaması gerekiyor ama tüm leaderboard hesaplanıyor
2. **Gereksiz upsert'ler**: Her leaderboard çağrısında 100'e kadar upsert yapılıyor
3. **Tüm kullanıcı verileri çekiliyor**: Sadece bir kullanıcının verisi gerekiyor
4. **N+1 problemi**: Bazı yerlerde loop içinde query yapılıyor

## Çözüm Önerileri

### 1. Leaderboard API Optimizasyonu (Öncelik: YÜKSEK)

Dashboard için özel endpoint oluştur:
- `/api/competition/leaderboard/user-rank?period=daily`
- Sadece kullanıcının sıralamasını döner
- Tüm leaderboard'u hesaplamaz
- `leaderboardEntry` tablosundan direkt okur (zaten cache'lenmiş)

### 2. LeaderboardEntry Cache Kullanımı

Mevcut `leaderboardEntry` tablosu zaten cache görevi görüyor. Dashboard'da direkt buradan oku:
- Tüm leaderboard'u hesaplamaya gerek yok
- Sadece kullanıcının entry'sini oku

### 3. Batch Query Optimizasyonu

- Birden fazla period için tek seferde query yap
- `Promise.all` ile paralel çalıştır ama gereksiz query'leri kaldır

### 4. Lazy Loading

- AI recommendations ve motivation message'ı lazy load et
- İlk yüklemede gerekli değil

## Önerilen Değişiklikler

1. ✅ Stats API optimize edildi (count kullanımı)
2. ❌ Leaderboard API optimize edilmeli (user-rank endpoint)
3. ⚠️ Strike API optimize edilmeli
4. ⚠️ Activity API optimize edilmeli
5. ⚠️ AI Insights lazy load edilmeli

