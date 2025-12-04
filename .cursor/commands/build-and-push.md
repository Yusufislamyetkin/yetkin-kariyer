# build-and-push

Projeyi build et, başarılı ise GitHub'a push et.

## Talimatlar

1. **Build Kontrolü:**
   - Önce `npm run build` komutunu çalıştır
   - Eğer build başarısız olursa, push yapma ve hata mesajını göster
   - Build başarılı ise devam et

2. **Git Durumu Kontrolü:**
   - `git status` ile değişiklikleri kontrol et
   - Eğer commit edilecek değişiklik yoksa, kullanıcıya bilgi ver ve işlemi sonlandır

3. **Commit ve Push:**
   - Tüm değişiklikleri stage'e ekle (`git add .`)
   - Kullanıcıdan commit mesajı iste veya otomatik bir mesaj oluştur
   - Commit oluştur (`git commit -m "..."`)
   - GitHub'a push et (`git push origin master` veya mevcut branch'e)

4. **Sonuç:**
   - Push başarılı ise onay mesajı göster
   - Hata varsa detaylı hata mesajı göster

**Önemli Notlar:**
- Her adımı kullanıcıya açıkça bildir ve terminal komutlarını çalıştırmadan önce ne yapacağını söyle
- Build başarısız olursa push yapma
- Git durumunu kontrol et, değişiklik yoksa kullanıcıya bilgi ver

