# CV Bazlı Mülakat - Manuel Test Checklist

Bu doküman, CV bazlı mülakat sisteminin deploy öncesi manuel test adımlarını içerir.

## Ön Hazırlık

- [ ] Development server çalışıyor (`npm run dev`)
- [ ] Database bağlantısı aktif
- [ ] Authentication çalışıyor (giriş yapılmış)
- [ ] En az bir CV oluşturulmuş

## Test Senaryoları

### 1. CV Listesi Yükleme

**Test Adımları:**
1. `/interview/cv-based` sayfasına git
2. Sayfanın yüklendiğini kontrol et
3. CV listesinin görüntülendiğini kontrol et

**Beklenen Sonuç:**
- [ ] Sayfa hatasız yükleniyor
- [ ] CV'ler listeleniyor
- [ ] Her CV için "Mülakat Oluştur" butonu görünüyor
- [ ] CV yoksa uygun mesaj gösteriliyor

**Hata Durumu:**
- [ ] Hata mesajı görüntüleniyor
- [ ] Console'da hata logu var mı kontrol et

---

### 2. Interview Oluşturma

**Test Adımları:**
1. Bir CV seç
2. "Mülakat Oluştur" butonuna tıkla
3. Loading state'i gözlemle
4. Progress bar'ı kontrol et

**Beklenen Sonuç:**
- [ ] Buton tıklandığında loading state aktif oluyor
- [ ] "Oluşturuluyor..." mesajı görünüyor
- [ ] Progress bar görünüyor ve güncelleniyor
- [ ] Aşama bilgileri doğru gösteriliyor (Aşama 1/3, Aşama 2/3, Aşama 3/3)
- [ ] Progress yüzdesi artıyor (0% → 33% → 66% → 100%)

**Hata Durumu:**
- [ ] Hata mesajı görüntüleniyor
- [ ] Polling duruyor
- [ ] Kullanıcı tekrar deneyebiliyor

---

### 3. Status Polling

**Test Adımları:**
1. Interview oluşturma işlemini başlat
2. Browser DevTools → Network tab'ını aç
3. Status polling request'lerini gözlemle
4. Her 2.5 saniyede bir request yapıldığını kontrol et

**Beklenen Sonuç:**
- [ ] `/api/interview/cv-based/[id]/status` endpoint'ine düzenli istekler gidiyor
- [ ] Response'larda status, stage, progress bilgileri var
- [ ] Question count artıyor
- [ ] Tamamlandığında polling duruyor

**Hata Durumu:**
- [ ] Hata durumunda polling duruyor
- [ ] Error status döndüğünde kullanıcıya bildiriliyor

---

### 4. Yönlendirme

**Test Adımları:**
1. Interview oluşturma işlemini tamamla
2. "Tamamlandı!" mesajını bekle
3. Otomatik yönlendirmeyi gözlemle

**Beklenen Sonuç:**
- [ ] "Mülakat başarıyla oluşturuldu! Yönlendiriliyorsunuz..." mesajı görünüyor
- [ ] 1.5 saniye sonra `/interview/practice/[id]` sayfasına yönlendiriliyor
- [ ] 404 hatası YOK
- [ ] Practice sayfası doğru yükleniyor

**Hata Durumu:**
- [ ] Yönlendirme hatası varsa console'da log var mı kontrol et

---

### 5. Soru Normalizasyonu

**Test Adımları:**
1. Interview oluşturulduktan sonra practice sayfasına git
2. Browser DevTools → Network tab'ında GET request'i kontrol et
3. Response'daki questions formatını kontrol et

**Beklenen Sonuç:**
- [ ] Questions array formatında geliyor
- [ ] Her soruda `id`, `type`, `question`, `stage` field'ları var
- [ ] Stage bilgileri doğru (1, 2, 3)
- [ ] Sorular görüntüleniyor

**Hata Durumu:**
- [ ] Questions boş array geliyorsa, API route'unda normalizasyon hatası olabilir
- [ ] Console'da parse error var mı kontrol et

---

### 6. Interview Type Kontrolü

**Test Adımları:**
1. CV-based interview oluştur
2. Practice sayfasına git
3. Browser DevTools → Console'u aç
4. Network request'lerini kontrol et

**Beklenen Sonuç:**
- [ ] Interview type "cv_based" olarak geliyor
- [ ] Doğru endpoint kullanılıyor (`/api/interview/cv-based/[id]`)
- [ ] Practice sayfasında interview type kontrolü çalışıyor

**Hata Durumu:**
- [ ] Yanlış endpoint kullanılıyorsa, practice sayfasında type kontrolü çalışmıyor olabilir

---

### 7. Error Handling

**Test Adımları:**
1. Interview oluşturma sırasında bir hata simüle et (ör: AI servisi kapalı)
2. Hata mesajının görüntülendiğini kontrol et
3. Polling'in durduğunu kontrol et

**Beklenen Sonuç:**
- [ ] Hata mesajı kullanıcıya gösteriliyor
- [ ] Polling duruyor
- [ ] Interview description'da hata mesajı var
- [ ] Status check'te error status dönüyor

**Hata Durumu:**
- [ ] Hata mesajı görünmüyorsa, frontend error handling çalışmıyor olabilir

---

### 8. Practice Sayfası Fonksiyonları

**Test Adımları:**
1. CV-based interview'i practice sayfasında aç
2. Soruları görüntüle
3. "Çıkış" butonuna tıkla

**Beklenen Sonuç:**
- [ ] Sorular doğru görüntüleniyor
- [ ] "Çıkış" butonu `/interview/cv-based` sayfasına yönlendiriyor
- [ ] Interview type kontrolü çalışıyor

**Hata Durumu:**
- [ ] Yanlış sayfaya yönlendiriliyorsa, handleLeaveRoom fonksiyonunda type kontrolü çalışmıyor olabilir

---

## Performans Kontrolleri

- [ ] Interview oluşturma süresi makul (1-3 dakika)
- [ ] Status polling çok sık yapılmıyor (2.5 saniye aralık)
- [ ] Sayfa yükleme süreleri kabul edilebilir
- [ ] Memory leak yok (uzun süre açık bırakıp kontrol et)

---

## Browser Uyumluluk

- [ ] Chrome/Edge - Çalışıyor
- [ ] Firefox - Çalışıyor
- [ ] Safari - Çalışıyor (eğer test edilebiliyorsa)

---

## Mobile Responsive

- [ ] Mobile görünümde sayfa düzgün görünüyor
- [ ] Butonlar tıklanabilir
- [ ] Progress bar görünüyor
- [ ] Text'ler okunabilir

---

## Son Kontroller

- [ ] Tüm console error'ları temizlendi
- [ ] Network request'ler başarılı (200, 201 status codes)
- [ ] Database'de interview kayıtları doğru oluşturuluyor
- [ ] Questions field'ı doğru formatlanmış

---

## Notlar

- Test sırasında karşılaşılan sorunları buraya not al:
  - 
  - 
  - 

---

## Test Sonucu

- [ ] Tüm testler başarılı
- [ ] Kritik hatalar yok
- [ ] Deploy için hazır

**Test Tarihi:** _______________
**Test Eden:** _______________
**Sonuç:** _______________

