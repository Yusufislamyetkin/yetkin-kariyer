# Final check for Module 5 content completeness
$jsonPath = "data\lesson-contents\module-05-detailed.json"

Write-Host "`n=== MODULE 5 İÇERİK KONTROLÜ ===" -ForegroundColor Cyan
Write-Host ""

try {
    $json = Get-Content $jsonPath -Raw -Encoding UTF8
    $data = $json | ConvertFrom-Json
    
    Write-Host "✅ Module ID: $($data.moduleId)" -ForegroundColor Green
    Write-Host "✅ Module Title: $($data.moduleTitle)" -ForegroundColor Green
    Write-Host "✅ Toplam Ders: $($data.lessons.Count)" -ForegroundColor Green
    Write-Host ""
    
    $allComplete = $true
    
    foreach ($lesson in $data.lessons) {
        Write-Host "📚 $($lesson.label)" -ForegroundColor Yellow
        Write-Host "   Faz Sayısı: $($lesson.sections.Count) " -NoNewline
        if ($lesson.sections.Count -eq 4) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌ (Beklenen: 4)" -ForegroundColor Red
            $allComplete = $false
        }
        
        Write-Host "   Description: " -NoNewline
        if ($lesson.description) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌" -ForegroundColor Red
            $allComplete = $false
        }
        
        Write-Host "   Key Takeaways: $($lesson.keyTakeaways.Count) " -NoNewline
        if ($lesson.keyTakeaways.Count -gt 0) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌" -ForegroundColor Red
            $allComplete = $false
        }
        
        Write-Host "   Checkpoints: $($lesson.checkpoints.Count) " -NoNewline
        if ($lesson.checkpoints.Count -gt 0) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌" -ForegroundColor Red
            $allComplete = $false
        }
        
        Write-Host "   Resources: $($lesson.resources.Count) " -NoNewline
        if ($lesson.resources.Count -gt 0) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌" -ForegroundColor Red
            $allComplete = $false
        }
        
        Write-Host "   Practice: $($lesson.practice.Count) " -NoNewline
        if ($lesson.practice.Count -gt 0) {
            Write-Host "✅" -ForegroundColor Green
        } else {
            Write-Host "❌" -ForegroundColor Red
            $allComplete = $false
        }
        
        # Check each phase
        foreach ($section in $lesson.sections) {
            $hasContent = $section.content -and $section.content.Count -gt 0
            Write-Host "      - $($section.title): " -NoNewline
            if ($hasContent) {
                Write-Host "✅ ($($section.content.Count) içerik)" -ForegroundColor Green
            } else {
                Write-Host "❌ (İçerik yok)" -ForegroundColor Red
                $allComplete = $false
            }
        }
        
        Write-Host ""
    }
    
    Write-Host "=================================" -ForegroundColor Cyan
    if ($allComplete) {
        Write-Host "✅ MODULE 5 İÇERİĞİ TAMAMEN HAZIR!" -ForegroundColor Green
        Write-Host "✅ Tüm dersler 4 fazlı yapıda" -ForegroundColor Green
        Write-Host "✅ Tüm dersler detaylı içeriğe sahip" -ForegroundColor Green
        Write-Host "✅ Import edilmeye hazır" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Bazı eksiklikler var" -ForegroundColor Yellow
    }
    Write-Host "=================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Hata: $_" -ForegroundColor Red
    exit 1
}
