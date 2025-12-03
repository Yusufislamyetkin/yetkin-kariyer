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
   - Dosya yollarını ve dosya içeriğini analiz ederek kullanıcı dostu sayfa/component isimlerine dönüştür
   - Git diff çıktısından değişen fonksiyon, component, state ve prop isimlerini çıkar
   - Teknik terimleri kullanıcı dostu ifadelere dönüştür
   - Her değişiklik için spesifik test açıklaması oluştur

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


**Not:** Her adımı kullanıcıya açıkça bildir ve terminal komutlarını çalıştırmadan önce ne yapacağını söyle. Test açıklamaları yazılımsal terimler içermemeli, kullanıcı dostu ve anlaşılır olmalıdır.
