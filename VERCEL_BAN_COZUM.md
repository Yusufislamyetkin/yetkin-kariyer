# Vercel Ban Sorunu - Acil Çözüm Adımları

## Durum
Domain'e ve uygulamaya erişilemiyor (hem PC hem telefon). Vercel rate limiting veya ban uygulanmış olabilir.

## Acil Çözüm Adımları

### 1. Vercel Dashboard'a Erişim
- Vercel.com'a giriş yapın
- Dashboard → Settings → Rate Limiting bölümünü kontrol edin
- Analytics → Functions bölümünden istek sayılarını kontrol edin

### 2. Vercel Support'a Başvurun
**Email:** support@vercel.com
**Konu:** "Rate Limiting / Ban Issue - Domain Access Blocked"

**İçerik:**
```
Merhaba,

Domain'im [your-domain] erişilemez durumda. Rate limiting veya ban uygulanmış olabilir. 
Canlı kodlama sayfasındaki bir bug nedeniyle çok fazla istek atılmış olabilir.

Bug'ı düzelttik ve rate limiting ekledik. Lütfen ban'ı kaldırabilir misiniz?

Domain: [your-domain]
Proje: [project-name]
```

### 3. Geçici Çözümler

#### A. IP Değiştirme
- WiFi'yi kapatıp açın (yeni IP almak için)
- VPN kullanın
- Mobil veri kullanın (farklı IP)

#### B. Farklı Domain/Subdomain
- Vercel'de yeni bir deployment oluşturun
- Farklı bir subdomain kullanın (örn: staging.yourdomain.com)

#### C. Vercel CLI ile Kontrol
```bash
vercel login
vercel projects ls
vercel inspect [deployment-url]
```

### 4. Rate Limiting Ayarları

Vercel Dashboard → Settings → Rate Limiting:
- **Free Plan:** 100 requests/second per IP
- **Pro Plan:** 1000 requests/second per IP

Eğer limit aşıldıysa:
1. Rate limiting'i geçici olarak artırın (Pro plan gerekli)
2. Veya birkaç saat bekleyin (limit reset olur)

### 5. Kod Düzeltmeleri (Yapıldı ✅)

- ✅ Live coding sayfasına rate limiting eklendi
- ✅ Retry mekanizması sınırlandırıldı (max 3 deneme)
- ✅ Exponential backoff eklendi
- ✅ Chat summary polling azaltıldı (5s → 60s)
- ✅ Friend request polling azaltıldı (30s → 60s)
- ✅ SignalR reconnect retry sınırlandırıldı

### 6. Deployment Sonrası

1. Yeni bir commit yapın ve deploy edin
2. Vercel Dashboard'da yeni deployment'ı kontrol edin
3. Analytics'te istek sayılarını izleyin
4. Support'a düzeltmeleri yaptığınızı bildirin

### 7. Monitoring

Vercel Dashboard → Analytics:
- **Functions:** Hangi endpoint'ler en çok çağrılıyor?
- **Edge Network:** Hangi sayfalar en çok trafik alıyor?
- **Errors:** Hangi hatalar oluşuyor?

## Önleme

1. **Rate Limiting:** Tüm API route'larına rate limiting ekleyin
2. **Error Handling:** Error durumlarında retry mekanizması sınırlandırın
3. **Polling:** Polling interval'lerini artırın (60+ saniye)
4. **Monitoring:** Vercel Analytics'i düzenli kontrol edin
5. **Alerts:** Rate limit yaklaştığında uyarı alın

## İletişim

Vercel Support:
- Email: support@vercel.com
- Discord: https://vercel.com/discord
- Twitter: @vercel

