# githubsummary

Build yap, başarılı ise GitHub'a push et ve commit description'a UI test listesi ekle.

## Talimatlar

1. **Build Kontrolü:**
   - Önce `npm run build` komutunu çalıştır
   - Eğer build başarısız olursa, push yapma ve hata mesajını göster
   - Build başarılı ise devam et

2. **Git Durumu Kontrolü:**
   - `git status` ile değişiklikleri kontrol et
   - Eğer commit edilecek değişiklik yoksa, kullanıcıya bilgi ver

3. **UI Test Listesi Oluştur:**
   - Değiştirilen dosyaları analiz et (`git diff --name-only` ve `git diff --cached --name-only`)
   - Her dosya için `git diff` çıktısını analiz et (`git diff [dosya_yolu]`)
   - Dosya yollarını kullanıcı dostu sayfa/component isimlerine dönüştür:
     - `app/(dashboard)/dashboard/page.tsx` → "Dashboard sayfası"
     - `app/(dashboard)/chat/_components/GroupChatView.tsx` → "Chat sayfası - Grup sohbet görünümü"
     - `app/(dashboard)/dashboard/_components/StrikeDisplay.tsx` → "Dashboard sayfası - Strike gösterimi"
     - `app/(dashboard)/dashboard/_components/DayDetailModal.tsx` → "Dashboard sayfası - Gün detay modalı"
     - `app/(dashboard)/chat/_components/MessageList.tsx` → "Chat sayfası - Mesaj listesi"
     - `app/(dashboard)/chat/_components/MessageViewport.tsx` → "Chat sayfası - Mesaj görünüm alanı"
     - `app/(dashboard)/education/lessons/_components/LessonChat.tsx` → "Eğitim sayfası - Ders sohbeti"
     - `app/(dashboard)/education/results/[id]/page.tsx` → "Eğitim sonuçları sayfası"
     - `app/(dashboard)/jobs/browse/page.tsx` → "İş ilanları sayfası"
     - `app/(dashboard)/social/posts/[id]/page.tsx` → "Sosyal medya - Gönderi detay sayfası"
     - `app/components/social/PostCreate.tsx` → "Sosyal medya - Gönderi oluşturma"
     - `app/api/strike/route.ts` → "Strike API endpoint'i"
   - Git diff çıktısından değişen fonksiyon, component, state ve prop isimlerini çıkar
   - Teknik terimleri kullanıcı dostu ifadelere dönüştür:
     - `StrikeDisplay` → "strike gösterimi"
     - `DayDetailModal` → "gün detay modalı"
     - `MessageList` → "mesaj listesi"
     - `MessageViewport` → "mesaj görünüm alanı"
     - `GroupChatView` → "grup sohbet görünümü"
     - `LessonChat` → "ders sohbeti"
     - `PostCreate` → "gönderi oluşturma"
     - `onClick`, `handleClick`, `onSubmit` → "tıklama", "buton", "gönderme"
     - `useState`, `setState` → "durum değişikliği"
     - `useEffect` → "veri yükleme", "güncelleme"
   - Her değişiklik için spesifik test açıklaması oluştur:
     - Örnek: "Dashboard sayfasındaki kullanıcı aktiviteleri kart alanındaki kullanıcı aktiviteleri linkleri profil yönlendirmesi yapıyor mu kontrol edilecek"
     - Örnek: "Chat sayfasındaki grup sohbet görünümündeki mesaj gönderme butonu çalışıyor mu kontrol edilecek"
     - Örnek: "Dashboard sayfasındaki strike gösterimi bölümünde günlük tamamlanma durumu doğru gösteriliyor mu kontrol edilecek"
     - Örnek: "Dashboard sayfasındaki gün detay modalında tamamlanan görevler listeleniyor mu kontrol edilecek"

4. **Commit ve Push:**
   - Tüm değişiklikleri stage'e ekle (`git add .`)
   - Commit mesajı formatı:
     ```
     UI'da Test Edilmesi Gerekenler:
     - [Sayfa/Component adı]ndaki [bölüm/özellik] [ne yapıyor/yapıyor mu] kontrol edilecek
     - [Sayfa/Component adı]ndaki [bölüm/özellik] [ne yapıyor/yapıyor mu] kontrol edilecek
     ```
   - Commit oluştur (`git commit -m "..."`)
   - GitHub'a push et (`git push origin master`)

5. **Sonuç:**
   - Push başarılı ise onay mesajı göster
   - Hata varsa detaylı hata mesajı göster

## Örnek Commit Mesajı Formatı:
```
UI'da Test Edilmesi Gerekenler:
- Dashboard sayfasındaki strike gösterimi bölümünde günlük tamamlanma durumu doğru gösteriliyor mu kontrol edilecek
- Dashboard sayfasındaki gün detay modalında tamamlanan görevler listeleniyor mu kontrol edilecek
- Chat sayfasındaki grup sohbet görünümünde mesajlar doğru görüntüleniyor mu kontrol edilecek
- Chat sayfasındaki mesaj listesi bölümünde yeni mesajlar anlık olarak ekleniyor mu kontrol edilecek
- Eğitim sayfasındaki ders sohbeti bölümünde mesaj gönderme işlevi çalışıyor mu kontrol edilecek
```

**Not:** Her adımı kullanıcıya açıkça bildir ve terminal komutlarını çalıştırmadan önce ne yapacağını söyle. Test açıklamaları yazılımsal terimler içermemeli, kullanıcı dostu ve anlaşılır olmalıdır.
