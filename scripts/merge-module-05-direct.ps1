# Direct merge of Module 5 into main JSON
$ErrorActionPreference = "Stop"

$mainJsonPath = "data\lesson-contents\dotnet-core-lessons.json"
$module5JsonPath = "data\lesson-contents\module-05-console-detailed.json"
$backupPath = "$mainJsonPath.backup2"

Write-Host "Backing up main JSON..."
Copy-Item $mainJsonPath $backupPath -Force

Write-Host "Reading Module 5 JSON..."
$module5Content = Get-Content $module5JsonPath -Raw -Encoding UTF8
$module5Data = $module5Content | ConvertFrom-Json

Write-Host "Module 5 has $($module5Data.lessons.Count) lessons"

Write-Host "Reading main JSON (attempting to fix)..."
$mainContent = Get-Content $mainJsonPath -Raw -Encoding UTF8

# Try to fix common JSON issues
# Remove BOM
if ($mainContent.StartsWith([char]0xFEFF)) {
    $mainContent = $mainContent.Substring(1)
}

# Try to parse - if it fails, we'll need to fix it manually
try {
    $mainData = $mainContent | ConvertFrom-Json
    Write-Host "Main JSON parsed successfully"
    
    # Find module-05-web-api and replace with module-05
    $found = $false
    for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
        if ($mainData.modules[$i].moduleId -eq "module-05-web-api") {
            Write-Host "Found module-05-web-api at index $i, replacing with module-05"
            $mainData.modules[$i] = $module5Data
            $found = $true
            break
        }
    }
    
    if (-not $found) {
        Write-Host "module-05-web-api not found, adding module-05"
        # Find position after module-04
        $insertIndex = $mainData.modules.Count
        for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
            $moduleId = $mainData.modules[$i].moduleId
            if ($moduleId -eq "module-04-aspnet-mvc" -or $moduleId -eq "module-04") {
                $insertIndex = $i + 1
                break
            }
        }
        $mainData.modules.Insert($insertIndex, $module5Data)
    }
    
    # Update total lessons
    $totalLessons = 0
    foreach ($module in $mainData.modules) {
        if ($module.lessons -and $module.lessons.Count -gt 0) {
            $totalLessons += $module.lessons.Count
        }
    }
    $mainData.totalLessons = $totalLessons
    
    Write-Host "Writing updated JSON..."
    $jsonContent = $mainData | ConvertTo-Json -Depth 100
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText((Resolve-Path $mainJsonPath).Path, $jsonContent, $utf8NoBom)
    
    Write-Host "✅ Module 5 content updated successfully!"
    Write-Host "✅ Total lessons: $totalLessons"
    Write-Host "✅ Module 5 has $($module5Data.lessons.Count) lessons"
    
} catch {
    Write-Host "❌ Error: $_"
    Write-Host "JSON file has syntax errors that need to be fixed manually."
    Write-Host "Backup saved to: $backupPath"
    exit 1
}
