# Verify Module-05 integration
$ErrorActionPreference = "Stop"

Write-Host "=== Module-05 Integration Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check if Module-05 JSON exists
$module5Path = "data\lesson-contents\module-05-console-detailed.json"
$module5Exists = Test-Path $module5Path

Write-Host "1. Module-05 JSON file exists: " -NoNewline
if ($module5Exists) {
    Write-Host "YES" -ForegroundColor Green
    
    # Validate JSON
    try {
        $module5Content = Get-Content $module5Path -Raw -Encoding UTF8
        $module5Data = $module5Content | ConvertFrom-Json
        Write-Host "   ✅ JSON is valid" -ForegroundColor Green
        Write-Host "   Module ID: $($module5Data.moduleId)" -ForegroundColor Gray
        Write-Host "   Module Title: $($module5Data.moduleTitle)" -ForegroundColor Gray
        Write-Host "   Lessons Count: $($module5Data.lessons.Count)" -ForegroundColor Gray
        
        # Check first few lessons
        Write-Host "   First 3 lessons:" -ForegroundColor Gray
        $module5Data.lessons[0..2] | ForEach-Object {
            Write-Host "     - $($_.label): $($_.sections.Count) phases" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   ❌ JSON is invalid: $_" -ForegroundColor Red
    }
} else {
    Write-Host "NO" -ForegroundColor Red
}

Write-Host ""

# Check if seed-data.ts has Module-05 import
$seedDataPath = "lib\admin\seed-data.ts"
$seedDataExists = Test-Path $seedDataPath

Write-Host "2. seed-data.ts file exists: " -NoNewline
if ($seedDataExists) {
    Write-Host "YES" -ForegroundColor Green
    
    $seedDataContent = Get-Content $seedDataPath -Raw -Encoding UTF8
    
    # Check for Module-05 import
    $hasModule5Import = $seedDataContent -match "module-05-console-detailed\.json"
    Write-Host "   Module-05 import added: " -NoNewline
    if ($hasModule5Import) {
        Write-Host "YES" -ForegroundColor Green
    } else {
        Write-Host "NO" -ForegroundColor Red
    }
    
    # Check for Module-05 mapping
    $hasModule5Mapping = $seedDataContent -match "'module-05':\s*\['module-05'\]"
    Write-Host "   Module-05 mapping added: " -NoNewline
    if ($hasModule5Mapping) {
        Write-Host "YES" -ForegroundColor Green
    } else {
        Write-Host "NO" -ForegroundColor Red
    }
    
    # Check for loadModuleFromFile call
    $hasLoadCall = $seedDataContent -match "loadModuleFromFile\(module5FilePath"
    Write-Host "   loadModuleFromFile call added: " -NoNewline
    if ($hasLoadCall) {
        Write-Host "YES" -ForegroundColor Green
    } else {
        Write-Host "NO" -ForegroundColor Red
    }
} else {
    Write-Host "NO" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Final summary
if ($module5Exists -and $seedDataExists -and $hasModule5Import -and $hasModule5Mapping -and $hasLoadCall) {
    Write-Host "✅ All checks passed! Module-05 is ready for import." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://yetkin-hub.vercel.app/admin" -ForegroundColor Gray
    Write-Host "2. Click 'Ders İçeriklerini Import Et' button" -ForegroundColor Gray
    Write-Host "3. Module-05 content will be imported automatically" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some checks failed. Please review the output above." -ForegroundColor Yellow
}
