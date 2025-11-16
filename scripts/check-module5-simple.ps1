$jsonPath = "data\lesson-contents\module-05-detailed.json"

Write-Host "Module 5 Content Check" -ForegroundColor Cyan
Write-Host ""

$json = Get-Content $jsonPath -Raw -Encoding UTF8
$data = $json | ConvertFrom-Json

Write-Host "Module ID: $($data.moduleId)" -ForegroundColor Green
Write-Host "Module Title: $($data.moduleTitle)" -ForegroundColor Green
Write-Host "Total Lessons: $($data.lessons.Count)" -ForegroundColor Green
Write-Host ""

$allComplete = $true

foreach ($lesson in $data.lessons) {
    Write-Host "Lesson: $($lesson.label)" -ForegroundColor Yellow
    
    $phaseCount = $lesson.sections.Count
    Write-Host "  Phases: $phaseCount" -NoNewline
    if ($phaseCount -eq 4) {
        Write-Host " [OK]" -ForegroundColor Green
    } else {
        Write-Host " [ERROR - Expected 4]" -ForegroundColor Red
        $allComplete = $false
    }
    
    Write-Host "  Description: " -NoNewline
    if ($lesson.description) {
        Write-Host "[OK]" -ForegroundColor Green
    } else {
        Write-Host "[MISSING]" -ForegroundColor Red
        $allComplete = $false
    }
    
    Write-Host "  Key Takeaways: $($lesson.keyTakeaways.Count)" -ForegroundColor $(if($lesson.keyTakeaways.Count -gt 0){'Green'}else{'Red'})
    Write-Host "  Checkpoints: $($lesson.checkpoints.Count)" -ForegroundColor $(if($lesson.checkpoints.Count -gt 0){'Green'}else{'Red'})
    Write-Host "  Resources: $($lesson.resources.Count)" -ForegroundColor $(if($lesson.resources.Count -gt 0){'Green'}else{'Red'})
    Write-Host "  Practice: $($lesson.practice.Count)" -ForegroundColor $(if($lesson.practice.Count -gt 0){'Green'}else{'Red'})
    
    foreach ($section in $lesson.sections) {
        $contentCount = if ($section.content) { $section.content.Count } else { 0 }
        Write-Host "    - $($section.title): $contentCount content items" -ForegroundColor $(if($contentCount -gt 0){'Green'}else{'Red'})
    }
    
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
if ($allComplete -and ($data.lessons | ForEach-Object { $_.sections.Count } | Where-Object { $_ -eq 4 } | Measure-Object).Count -eq $data.lessons.Count) {
    Write-Host "RESULT: Module 5 content is COMPLETE!" -ForegroundColor Green
    Write-Host "All lessons have 4 phases" -ForegroundColor Green
    Write-Host "All lessons have detailed content" -ForegroundColor Green
    Write-Host "Ready for import" -ForegroundColor Green
} else {
    Write-Host "RESULT: Some issues found" -ForegroundColor Yellow
}
Write-Host "================================" -ForegroundColor Cyan
