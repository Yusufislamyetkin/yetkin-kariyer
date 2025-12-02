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
   - Her değişiklik için UI'da test edilmesi gerekenleri belirle:
     - `page.tsx` dosyaları → "📄 [Sayfa Adı] sayfası test edilmeli"
     - `_components/` veya `component` içeren dosyalar → "🧩 [Component Adı] componenti test edilmeli"
     - Diğer `.tsx` dosyaları → "⚛️ [Dosya Adı] UI değişiklikleri test edilmeli"
     - `api/*/route.ts` dosyaları → "🔌 [API Endpoint] API endpoint'i test edilmeli"

4. **Commit ve Push:**
   - Tüm değişiklikleri stage'e ekle (`git add .`)
   - Commit mesajı formatı:
     ```
     Update: [Tarih/Saat]
     
     📋 UI'da Test Edilmesi Gerekenler:
     [Yukarıda oluşturulan test listesi]
     ```
   - Commit oluştur (`git commit -m "..."`)
   - GitHub'a push et (`git push origin master`)

5. **Sonuç:**
   - Push başarılı ise onay mesajı göster
   - Hata varsa detaylı hata mesajı göster

## Örnek Commit Mesajı Formatı:
```
Update: 2025-01-15 14:30:00

📋 UI'da Test Edilmesi Gerekenler:
- 📄 Dashboard sayfası test edilmeli
- 🧩 DayDetailModal componenti test edilmeli
- ⚛️ StrikeDisplay UI değişiklikleri test edilmeli
```

**Not:** Her adımı kullanıcıya açıkça bildir ve terminal komutlarını çalıştırmadan önce ne yapacağını söyle.
