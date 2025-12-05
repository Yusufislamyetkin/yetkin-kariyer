# Vercel Environment Variables Download Script
# Bu script, Vercel'deki environment variable'ları local'e indirir

Write-Host "=== Vercel Environment Variables İndirme ===" -ForegroundColor Cyan
Write-Host ""

# Vercel CLI kontrolü
Write-Host "Vercel CLI kontrol ediliyor..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI bulunamadı. Kurulum yapılıyor..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI kurulumu başarısız!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI kuruldu" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI zaten kurulu" -ForegroundColor Green
}

Write-Host ""

# Vercel'e login kontrolü
Write-Host "Vercel login durumu kontrol ediliyor..." -ForegroundColor Yellow
$null = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel'e giriş yapmanız gerekiyor..." -ForegroundColor Yellow
    Write-Host "Lütfen tarayıcıda açılan sayfada giriş yapın..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel login başarısız!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Vercel'e giriş yapılmış" -ForegroundColor Green
}

Write-Host ""

# Proje linki
$projectUrl = "https://vercel.com/kinyas-projects/yetkin-kariyer"
Write-Host "Proje: $projectUrl" -ForegroundColor Cyan
Write-Host ""

# Environment variables'ları pull et
Write-Host "Environment variables indiriliyor..." -ForegroundColor Yellow
Write-Host "Not: Bu işlem .env.local dosyası oluşturacak" -ForegroundColor Gray
Write-Host ""

# Vercel env pull komutu
vercel env pull .env.local

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Environment variables başarıyla indirildi!" -ForegroundColor Green
    Write-Host "📁 Dosya konumu: .env.local" -ForegroundColor Cyan
    
    # Dosya içeriğini kontrol et (sadece satır sayısını göster)
    if (Test-Path ".env.local") {
        $lineCount = (Get-Content ".env.local" | Measure-Object -Line).Lines
        Write-Host "📊 Toplam $lineCount satır environment variable indirildi" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "⚠️  GÜVENLİK UYARISI:" -ForegroundColor Yellow
        Write-Host "   .env.local dosyası hassas bilgiler içerir!" -ForegroundColor Yellow
        Write-Host "   Bu dosyayı Git'e commit etmeyin!" -ForegroundColor Yellow
        Write-Host "   .gitignore dosyasında olduğundan emin olun." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Environment variables indirme başarısız!" -ForegroundColor Red
    Write-Host "Lütfen şunları kontrol edin:" -ForegroundColor Yellow
    Write-Host "  1. Vercel'e giriş yaptığınızdan emin olun" -ForegroundColor Yellow
    Write-Host "  2. Proje linkinin doğru olduğundan emin olun" -ForegroundColor Yellow
    Write-Host "  3. Projeye erişim izniniz olduğundan emin olun" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== İşlem Tamamlandı ===" -ForegroundColor Green
