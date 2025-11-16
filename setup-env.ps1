# Environment Variables Setup Script
# Bu script, gerekli environment variable'ları kontrol eder ve eksik olanları gösterir

Write-Host "=== Environment Variables Kontrolü ===" -ForegroundColor Cyan
Write-Host ""

$requiredVars = @(
    @{Name="AUTH_SECRET"; Description="NextAuth secret (giriş için gerekli)"; Required=$true},
    @{Name="NEXTAUTH_SECRET"; Description="NextAuth secret (alternatif)"; Required=$false},
    @{Name="POSTGRES_PRISMA_URL"; Description="PostgreSQL connection string"; Required=$true},
    @{Name="POSTGRES_URL_NON_POOLING"; Description="PostgreSQL non-pooling connection"; Required=$true},
    @{Name="NEXTAUTH_URL"; Description="NextAuth URL"; Required=$true},
    @{Name="OPENAI_API_KEY"; Description="OpenAI API key (opsiyonel)"; Required=$false},
    @{Name="BLOB_READ_WRITE_TOKEN"; Description="Vercel Blob Storage token (opsiyonel)"; Required=$false},
    @{Name="NEXT_PUBLIC_SIGNALR_URL"; Description="SignalR Hub URL (opsiyonel - chat için)"; Required=$false}
)

$missingRequired = @()
$missingOptional = @()

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var.Name, "Process")
    if ([string]::IsNullOrEmpty($value)) {
        $value = [Environment]::GetEnvironmentVariable($var.Name, "User")
    }
    if ([string]::IsNullOrEmpty($value)) {
        $value = [Environment]::GetEnvironmentVariable($var.Name, "Machine")
    }
    
    # .env dosyasından da kontrol et
    if ([string]::IsNullOrEmpty($value) -and (Test-Path ".env")) {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "$($var.Name)=(.+)") {
            $value = $matches[1].Trim()
        }
    }
    
    if ([string]::IsNullOrEmpty($value)) {
        if ($var.Required) {
            $missingRequired += $var
            Write-Host "❌ $($var.Name): EKSIK (GEREKLI)" -ForegroundColor Red
        } else {
            $missingOptional += $var
            Write-Host "⚠️  $($var.Name): EKSIK (OPSIYONEL)" -ForegroundColor Yellow
        }
    } else {
        $displayValue = if ($var.Name -match "SECRET|KEY|TOKEN|PASSWORD") { "***" } else { $value.Substring(0, [Math]::Min(50, $value.Length)) }
        Write-Host "✅ $($var.Name): $displayValue" -ForegroundColor Green
    }
    Write-Host "   $($var.Description)" -ForegroundColor Gray
    Write-Host ""
}

if ($missingRequired.Count -gt 0) {
    Write-Host "=== EKSIK GEREKLI DEGISKENLER ===" -ForegroundColor Red
    Write-Host ""
    
    # AUTH_SECRET kontrolü
    $authSecretMissing = $missingRequired | Where-Object { $_.Name -eq "AUTH_SECRET" -or $_.Name -eq "NEXTAUTH_SECRET" }
    if ($authSecretMissing) {
        Write-Host "🔑 AUTH_SECRET oluşturmak için:" -ForegroundColor Yellow
        Write-Host "   openssl rand -base64 32" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Veya PowerShell ile:" -ForegroundColor Yellow
        Write-Host "   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))" -ForegroundColor Cyan
        Write-Host ""
    }
    
    Write-Host "📝 .env dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($var in $missingRequired) {
        Write-Host "$($var.Name)=your-value-here" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Örnek .env dosyası için README.md dosyasına bakın." -ForegroundColor Gray
    Write-Host ""
    exit 1
} else {
    Write-Host "=== TÜM GEREKLI DEGISKENLER MEVCUT ===" -ForegroundColor Green
    Write-Host ""
    
    if ($missingOptional.Count -gt 0) {
        Write-Host "⚠️  Opsiyonel değişkenler eksik (bazı özellikler çalışmayabilir):" -ForegroundColor Yellow
        foreach ($var in $missingOptional) {
            Write-Host "   - $($var.Name): $($var.Description)" -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    Write-Host "✅ Uygulama çalışmaya hazır!" -ForegroundColor Green
    exit 0
}

