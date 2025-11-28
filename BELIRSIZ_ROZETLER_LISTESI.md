# Belirsiz ve Çelişkili Rozetler Listesi

## 1. SCORE KATEGORİSİNDEKİ BELİRSİZ ROZETLER

### Problem: "score_type" değerleri belirsiz ve ölçülemez

#### A. "efsanevi" score_type'ı (40 rozet)
- **Sorun**: "Efsanevi skor" ne demek? Nasıl hesaplanıyor?
- **Örnekler**:
  - badge-050: "Efsanevi skorunuz 60 ve üzeri olsun" (T-BRONZE-002)
  - badge-060: "Efsanevi skorunuz 80 ve üzeri olsun" (T-SILVER-012)
  - badge-070: "Efsanevi skorunuz 90 ve üzeri olsun" (T-GOLD-022)
  - badge-080: "Efsanevi skorunuz 100 olsun" (T-PLAT-032)

#### B. "mükemmel" score_type'ı (40 rozet)
- **Sorun**: "Mükemmel skor" ne demek? Tek test mi, ortalama mı?
- **Örnekler**:
  - badge-044: "Mükemmel skorunuz 60 ve üzeri olsun" (T-BRONZE-005)
  - badge-054: "Mükemmel skorunuz 80 ve üzeri olsun" (T-SILVER-015)
  - badge-064: "Mükemmel skorunuz 90 ve üzeri olsun" (T-GOLD-025)
  - badge-074: "Mükemmel skorunuz 100 olsun" (T-PLAT-035)
  - badge-049: "Mükemmel skorunuz 70 ve üzeri olsun" (T-BRONZE-010) - ÇELİŞKİ: Aynı tier'da farklı skorlar

#### C. "yüksek" score_type'ı (40 rozet)
- **Sorun**: "Yüksek skor" ne demek? En yüksek tek test mi?
- **Örnekler**:
  - badge-045: "Yüksek skorunuz 65 ve üzeri olsun" (T-BRONZE-006)
  - badge-055: "Yüksek skorunuz 82 ve üzeri olsun" (T-SILVER-016)
  - badge-065: "Yüksek skorunuz 92 ve üzeri olsun" (T-GOLD-026)
  - badge-075: "Yüksek skorunuz 100 olsun" (T-PLAT-036)

#### D. "tutarlı" score_type'ı (40 rozet)
- **Sorun**: "Tutarlı skor" ne demek? Nasıl ölçülüyor?
- **Örnekler**:
  - badge-046: "Tutarlı skorunuz 70 ve üzeri olsun" (T-BRONZE-007)
  - badge-056: "Tutarlı skorunuz 85 ve üzeri olsun" (T-SILVER-017)
  - badge-066: "Tutarlı skorunuz 95 ve üzeri olsun" (T-GOLD-027)
  - badge-076: "Tutarlı skorunuz 100 olsun" (T-PLAT-037)

#### E. "başarılı" score_type'ı (40 rozet)
- **Sorun**: "Başarılı skor" ne demek? Belirsiz.
- **Örnekler**:
  - badge-047: "Başarılı skorunuz 60 ve üzeri olsun" (T-BRONZE-008)
  - badge-057: "Başarılı skorunuz 80 ve üzeri olsun" (T-SILVER-018)
  - badge-067: "Başarılı skorunuz 90 ve üzeri olsun" (T-GOLD-028)
  - badge-077: "Başarılı skorunuz 100 olsun" (T-PLAT-038)

#### F. "harika" score_type'ı (40 rozet)
- **Sorun**: "Harika skor" ne demek? Belirsiz.
- **Örnekler**:
  - badge-048: "Harika skorunuz 65 ve üzeri olsun" (T-BRONZE-009)
  - badge-058: "Harika skorunuz 82 ve üzeri olsun" (T-SILVER-019)
  - badge-068: "Harika skorunuz 92 ve üzeri olsun" (T-GOLD-029)
  - badge-078: "Harika skorunuz 100 olsun" (T-PLAT-039)

**TOPLAM BELİRSİZ SCORE ROZETLERİ: 240 rozet**

---

## 2. DAILY ACTIVITIES KATEGORİSİNDEKİ BELİRSİZ/TEKRAR EDEN ROZETLER

### Problem: Activity type'lar belirsiz veya tekrar ediyor

#### A. "pratik" activity_type (40 rozet)
- **Sorun**: "Pratik" ne demek? Test mi, kod mu, ders mi?
- **Örnekler**:
  - badge-010: "Bir günde 1 pratik tamamla" (G-BRONZE-002)
  - badge-020: "Bir günde 5 pratik tamamla" (G-SILVER-012)
  - badge-030: "Bir günde 10 pratik tamamla" (G-GOLD-022)
  - badge-040: "Bir günde 20 pratik tamamla" (G-PLAT-032)

#### B. "canlı kod" vs "canlı kodlama" (80 rozet)
- **Sorun**: İkisi aynı şey mi? Neden iki farklı type var?
- **Örnekler**:
  - badge-003: "Bir günde 3 canlı kod tamamla" (G-BRONZE-004) - activity_type: "canlı kod"
  - badge-007: "Bir günde 1 canlı kodlama tamamla" (G-BRONZE-008) - activity_type: "canlı kodlama"
  - Her ikisi de farklı tier'larda tekrar ediyor

#### C. "bugfix" vs "hata düzeltme" (80 rozet)
- **Sorun**: İkisi aynı şey mi? Neden iki farklı type var?
- **Örnekler**:
  - badge-004: "Bir günde 1 bugfix tamamla" (G-BRONZE-005) - activity_type: "bugfix"
  - badge-008: "Bir günde 2 hata düzeltme tamamla" (G-BRONZE-009) - activity_type: "hata düzeltme"
  - Her ikisi de farklı tier'larda tekrar ediyor

#### D. "eğitim" activity_type (40 rozet)
- **Sorun**: Çok genel, belirsiz. Test, kurs, ders hepsi eğitim değil mi?
- **Örnekler**:
  - badge-009: "Bir günde 3 eğitim tamamla" (G-BRONZE-010)
  - badge-019: "Bir günde 7 eğitim tamamla" (G-SILVER-020)
  - badge-029: "Bir günde 15 eğitim tamamla" (G-GOLD-030)
  - badge-039: "Bir günde 30 eğitim tamamla" (G-PLAT-040)

**TOPLAM BELİRSİZ DAILY ACTIVITY ROZETLERİ: 240 rozet**

---

## 3. STREAK KATEGORİSİNDEKİ BELİRSİZ ROZETLER

### Problem: Streak type'lar belirsiz ve açıklamalar çelişkili

#### A. Aynı description, farklı streak_type'lar
- **Sorun**: Aynı açıklama ("3 gün üst üste günlük aktivite yap") farklı streak_type'larla tekrar ediyor
- **Örnekler**:
  - badge-121: "3 gün üst üste günlük aktivite yap" - streak_type: "günlük aktivite" (SD-BRONZE-001)
  - badge-130: "3 gün üst üste günlük aktivite yap" - streak_type: "ritim" (SD-BRONZE-002)
  - badge-124: "3 gün üst üste günlük aktivite yap" - streak_type: "login" (SD-BRONZE-005)
  - badge-127: "3 gün üst üste günlük aktivite yap" - streak_type: "süreklilik" (SD-BRONZE-008)

#### B. Belirsiz streak_type'lar
- **"ritim"**: Ne demek? Belirsiz.
- **"aktif"**: Ne demek? Belirsiz.
- **"disiplin"**: Ne demek? Belirsiz.
- **"süreklilik"**: Ne demek? Belirsiz.
- **"düzen"**: Ne demek? Belirsiz.
- **"alışkanlık"**: Ne demek? Belirsiz.

**TOPLAM BELİRSİZ STREAK ROZETLERİ: 80 rozet**

---

## 4. SOCIAL INTERACTION KATEGORİSİNDEKİ BELİRSİZ ROZETLER

### Problem: Interaction type'lar belirsiz veya kullanıcı kontrolünde değil

#### A. "topluluk" interaction_type (40 rozet)
- **Sorun**: "Topluluk yap" ne demek? Belirsiz.
- **Örnekler**:
  - badge-090: "Toplam 10 topluluk yap" (SI-BRONZE-002)
  - badge-100: "Toplam 50 topluluk yap" (SI-SILVER-012)
  - badge-110: "Toplam 200 topluluk yap" (SI-GOLD-022)
  - badge-120: "Toplam 1000 topluluk yap" (SI-PLAT-032)

#### B. "etkileşim" interaction_type (40 rozet)
- **Sorun**: Çok genel. Beğeni, yorum, paylaşım hepsi etkileşim değil mi?
- **Örnekler**:
  - badge-088: "Toplam 15 etkileşim yap" (SI-BRONZE-009)
  - badge-098: "Toplam 75 etkileşim yap" (SI-SILVER-019)
  - badge-108: "Toplam 300 etkileşim yap" (SI-GOLD-029)
  - badge-118: "Toplam 1500 etkileşim yap" (SI-PLAT-039)

#### C. "sosyal" interaction_type (40 rozet)
- **Sorun**: Çok genel. Tüm sosyal aktiviteler zaten sosyal değil mi?
- **Örnekler**:
  - badge-089: "Toplam 20 sosyal yap" (SI-BRONZE-010)
  - badge-099: "Toplam 100 sosyal yap" (SI-SILVER-020)
  - badge-109: "Toplam 500 sosyal yap" (SI-GOLD-030)
  - badge-119: "Toplam 2000 sosyal yap" (SI-PLAT-040)

#### D. "arkadaş" ve "takipçi" interaction_type (80 rozet)
- **Sorun**: Kullanıcının tam kontrolünde değil. Başkaları takip ederse ne olacak?
- **Örnekler**:
  - badge-085: "Toplam 15 arkadaş yap" (SI-BRONZE-006)
  - badge-086: "Toplam 20 takipçi yap" (SI-BRONZE-007)
  - Her ikisi de farklı tier'larda tekrar ediyor

**TOPLAM BELİRSİZ SOCIAL INTERACTION ROZETLERİ: 200 rozet**

---

## 5. SPECIAL KATEGORİSİNDEKİ BELİRSİZ ROZETLER

### Problem: Special type'lar belirsiz ve aynı type farklı tier'larda tekrar ediyor

#### A. Belirsiz special_type'lar (160 rozet)
- **"benzersiz başarı"**: Ne demek? Belirsiz.
- **"hızlı tamamlama"**: Ne kadar hızlı? Belirsiz.
- **"mükemmel performans"**: Ne demek? Belirsiz.
- **"özel kombinasyon"**: Ne demek? Belirsiz.
- **"nadir başarı"**: Ne demek? Belirsiz.
- **"efsanevi an"**: Ne demek? Belirsiz.
- **"tarihi başarı"**: Ne demek? Belirsiz.

#### B. Aynı special_type farklı tier'larda (40 rozet)
- **Sorun**: Aynı "ilk test" special_type'ı hem bronze, hem silver, hem gold, hem platinum'da var
- **Örnekler**:
  - badge-161: "Ilk test başarısını elde et" (OZ-BRONZE-001) - special_type: "ilk test"
  - badge-171: "Ilk test başarısını elde et" (OZ-SILVER-011) - special_type: "ilk test"
  - badge-181: "Ilk test mükemmel performansı göster" (OZ-GOLD-021) - special_type: "ilk test"
  - badge-191: "Ilk test efsanevi başarısını elde et" (OZ-PLAT-031) - special_type: "ilk test"
- Aynı durum "ilk kurs", "ilk post" için de geçerli

**TOPLAM BELİRSİZ SPECIAL ROZETLERİ: 200 rozet**

---

## ÖZET

### Toplam Belirsiz/Çelişkili Rozet Sayısı: **960 rozet**

### Kategorilere Göre Dağılım:
1. **Score kategorisi**: 240 rozet (belirsiz score_type'lar)
2. **Daily Activities kategorisi**: 240 rozet (belirsiz/tekrar eden activity_type'lar)
3. **Streak kategorisi**: 80 rozet (belirsiz streak_type'lar)
4. **Social Interaction kategorisi**: 200 rozet (belirsiz interaction_type'lar)
5. **Special kategorisi**: 200 rozet (belirsiz special_type'lar)

### Ana Problemler:
1. **Belirsiz terimler**: "efsanevi", "mükemmel", "yüksek", "tutarlı", "başarılı", "harika" gibi skorların ne anlama geldiği belli değil
2. **Tekrar eden terimler**: "canlı kod" vs "canlı kodlama", "bugfix" vs "hata düzeltme"
3. **Genel terimler**: "pratik", "eğitim", "etkileşim", "sosyal" çok genel
4. **Kullanıcı kontrolü dışı**: "arkadaş", "takipçi" kullanıcının tam kontrolünde değil
5. **Aynı type farklı tier'lar**: Aynı special_type farklı tier'larda tekrar ediyor
6. **Çelişkili açıklamalar**: Aynı açıklama farklı type'larla tekrar ediyor

### Öneriler:
1. Belirsiz score_type'ları kaldır, sadece "tek test", "ortalama", "toplam" gibi net olanları kullan
2. Tekrar eden activity_type'ları birleştir ("canlı kod" ve "canlı kodlama" → "live_coding")
3. Genel terimleri kaldır veya daha spesifik hale getir
4. Kullanıcı kontrolü dışındaki rozetleri kaldır veya farklı şekilde tanımla
5. Aynı special_type'ı farklı tier'larda kullanma, her tier için farklı kriterler belirle

