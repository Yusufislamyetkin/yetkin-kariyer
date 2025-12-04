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
   - Her değişen dosya için:
     a. **Dosya yolunu analiz et ve sayfa/component ismini çıkar:**
        - Dosya yolunu parçala ve anlamlı isimler oluştur
        - Örnekler:
          * `app/(dashboard)/dashboard/page.tsx` → "Dashboard sayfası"
          * `app/(dashboard)/education/hackaton/[id]/page.tsx` → "Hackathon Detay sayfası" (id parametresi varsa "Detay" ekle)
          * `app/(dashboard)/profile/page.tsx` → "Profil sayfası"
          * `app/(dashboard)/career/roadmap/page.tsx` → "Kariyer Yol Haritası sayfası"
          * `app/(dashboard)/dashboard/_components/DayDetailModal.tsx` → "Dashboard sayfasındaki Gün Detay Modal'ı"
          * `app/(dashboard)/education/hackaton/_components/TeamCard.tsx` → "Hackathon sayfasındaki Takım Kartı bileşeni"
          * `app/components/ThemeToggle.tsx` → "Tema Değiştirme bileşeni" (genel component)
          * `app/api/hackathons/[hackathonId]/submissions/route.ts` → "Hackathon Proje Gönderimi API'si" (sadece UI etkisi varsa ekle)
        - Dosya adından component ismini çıkar (PascalCase → boşluklu Türkçe isim)
          * `DayDetailModal` → "Gün Detay Modal'ı"
          * `TeamCard` → "Takım Kartı"
          * `ThemeToggle` → "Tema Değiştirme"
        - Klasör isimlerinden sayfa bağlamını anla
          * `dashboard` → "Dashboard"
          * `education/hackaton` → "Hackathon" veya "Eğitim > Hackathon"
          * `career/roadmap` → "Kariyer Yol Haritası"
          * `profile` → "Profil"
     b. **Dosya içeriğini oku ve component/özellik isimlerini bul:**
        - Dosyayı `read_file` ile oku
        - Export edilen component'lerin isimlerini bul:
          * `export default function ComponentName()` → ComponentName
          * `export function ComponentName()` → ComponentName
          * `export const ComponentName = () =>` → ComponentName
        - Component içindeki önemli fonksiyonları tespit et:
          * `handleSubmit`, `handleClick`, `handleChange` gibi event handler'lar
          * `onApply`, `onSubmit`, `onDelete` gibi callback fonksiyonlar
          * Form submit fonksiyonları
          * Modal açma/kapama fonksiyonları
        - State değişkenlerini bul:
          * `useState` hook'larından state isimlerini çıkar
          * Örnek: `const [isOpen, setIsOpen] = useState(false)` → "modal açma/kapama" veya "açık/kapalı durumu"
          * Örnek: `const [formData, setFormData] = useState({})` → "form verileri"
        - Prop isimlerini bul:
          * Component'in aldığı prop'ları tespit et
          * Örnek: `{ isOpen, onClose, title }` → "modal açma/kapama", "başlık"
        - Eğer dosya içeriğinden component ismi bulunamazsa, dosya adını kullan
     c. **Git diff'i analiz et ve UI değişikliklerini tespit et:**
        - `git diff [dosya_yolu]` komutunu çalıştır
        - Eklenen satırları (`+`) ve silinen satırları (`-`) analiz et
        - UI ile ilgili değişiklikleri tespit et:
          * **Event Handler'lar:** `onClick`, `onChange`, `onSubmit`, `onClose`, `onOpen` → "tıklama", "değişiklik", "gönderme", "kapatma", "açma"
          * **State değişiklikleri:** `useState` eklenmiş/çıkarılmış/değiştirilmiş → ilgili UI davranışını test et
          * **Form işlemleri:** `handleSubmit`, form validation, form field'ları → "form gönderimi", "form doğrulama"
          * **Modal/Dialog:** `isOpen`, `setIsOpen`, modal açma/kapama → "modal açma/kapama"
          * **Toast/Bildirim:** `showFeedback`, `toast`, notification → "bildirim mesajları"
          * **Navigation:** `router.push`, `redirect`, `Link` → "sayfa yönlendirme"
          * **API çağrıları:** `fetch`, `axios` → "veri yükleme", "form gönderimi"
          * **Stil değişiklikleri:** `className`, `style`, Tailwind class'ları → "görünüm", "stil"
          * **Koşullu render:** `if`, `&&`, `? :` → "görünürlük", "koşullu gösterim"
          * **Yeni component eklenmiş:** Yeni export edilen component → "yeni bileşen"
          * **Prop değişiklikleri:** Prop eklenmiş/çıkarılmış/değiştirilmiş → "bileşen özellikleri"
        - Değişikliklerin kullanıcıya nasıl yansıdığını düşün ve test senaryosu oluştur
     d. **Sayfa/Component ismini belirle:**
        - Dosya içeriğinden export default component ismini bul
        - Eğer bulunamazsa, dosya yolundan ve dosya adından çıkar
        - Örnek: `app/(dashboard)/education/hackaton/[id]/page.tsx` → "Hackathon Detay sayfası"
        - Örnek: `app/(dashboard)/dashboard/_components/DayDetailModal.tsx` → "Dashboard sayfasındaki Gün Detay Modal'ı"
     e. **Değişiklik türünü tespit et:**
        - Yeni özellik eklenmiş mi? (yeni fonksiyon, yeni state, yeni component)
        - Mevcut özellik değiştirilmiş mi? (fonksiyon güncellenmiş, state değişmiş, prop eklenmiş/çıkarılmış)
        - UI davranışı değişmiş mi? (onClick handler, form validation, modal açma/kapama, toast mesajı)
        - Stil değişikliği mi? (className, style, Tailwind class'ları)
     f. **Kullanıcı dostu test açıklaması oluştur:**
        - Teknik terimlerden kaçın (useState, useEffect, onClick, fetch, etc.)
        - Kullanıcının göreceği/göreceği davranışı açıkla
        - Test açıklaması formatı: "[Sayfa/Component adı]ndaki [özellik/bölüm] [ne yapıyor/yapıyor mu] kontrol edilecek"
        - Örnekler:
          * Modal değişikliği → "Dashboard sayfasındaki Gün Detay Modal'ının açılıp kapanması kontrol edilecek"
          * Form değişikliği → "Hackathon Detay sayfasındaki Başvuru formunun gönderilmesi ve doğrulama mesajları test edilecek"
          * State değişikliği → "Profil sayfasındaki kullanıcı bilgilerinin güncellenmesi ve kaydedilmesi kontrol edilecek"
          * Stil değişikliği → "Dashboard sayfasındaki kartların görünümü ve düzeni kontrol edilecek"
          * Yeni özellik → "Hackathon sayfasına eklenen Takım Kartı bileşeninin görüntülenmesi test edilecek"
          * API değişikliği → "Başvuru formu gönderildiğinde başarı/hata mesajlarının gösterilmesi kontrol edilecek"
          * Navigation değişikliği → "Butona tıklandığında doğru sayfaya yönlendirme yapılıp yapılmadığı test edilecek"
        - Her test maddesi spesifik ve test edilebilir olmalı
        - Genel ifadelerden kaçın (ör: "sayfanın çalışması" yerine "formun gönderilmesi")
   - Her dosya için en az 1, maksimum 3 test maddesi oluştur (en önemli değişikliklere odaklan)
   - Aynı sayfadaki birden fazla değişikliği tek bir test maddesinde birleştir (eğer mantıklıysa)

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


**Önemli Notlar:**
- Her adımı kullanıcıya açıkça bildir ve terminal komutlarını çalıştırmadan önce ne yapacağını söyle
- Test açıklamaları yazılımsal terimler içermemeli, kullanıcı dostu ve anlaşılır olmalıdır
- Dosya yollarından ve içeriklerinden sayfa/component isimlerini KENDİN BUL, kullanıcıdan sorma
- Git diff çıktısını ve dosya içeriğini analiz ederek hangi sayfada ne değiştiğini tespit et
- Eğer bir dosya yolu veya içerik belirsizse, dosyayı okuyarak component ismini ve amacını anla
- API route dosyaları sadece UI'da görünen değişikliklere neden oluyorsa test listesine ekle (ör: form submit endpoint'i değiştiyse, ilgili form test edilmeli)
- Stil değişiklikleri (CSS, Tailwind class'ları) için görsel test maddeleri ekle
- State yönetimi değişiklikleri için ilgili UI davranışlarını test et (ör: modal açma/kapama, form validation, toast mesajları)
