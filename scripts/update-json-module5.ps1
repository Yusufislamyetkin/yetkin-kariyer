# Update Module 5 content in main JSON file
$ErrorActionPreference = "Stop"

$mainJsonPath = "data\lesson-contents\dotnet-core-lessons.json"
$module5JsonPath = "data\lesson-contents\module-05-detailed.json"

Write-Host "Reading Module 5 JSON..."
$module5Content = Get-Content $module5JsonPath -Raw -Encoding UTF8
$module5Data = ConvertFrom-Json $module5Content

Write-Host "Reading main JSON file..."
try {
    $mainContent = Get-Content $mainJsonPath -Raw -Encoding UTF8
    $mainData = ConvertFrom-Json $mainContent
    
    Write-Host "Finding module-05-web-api..."
    $moduleIndex = -1
    for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
        if ($mainData.modules[$i].moduleId -eq "module-05-web-api") {
            $moduleIndex = $i
            break
        }
    }
    
    if ($moduleIndex -ge 0) {
        Write-Host "Found module-05-web-api at index $moduleIndex, updating..."
        $mainData.modules[$moduleIndex] = $module5Data
    } else {
        Write-Host "module-05-web-api not found, adding new module..."
        # Find position after module-04
        $module04Index = -1
        for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
            if ($mainData.modules[$i].moduleId -eq "module-04-aspnet-mvc") {
                $module04Index = $i
                break
            }
        }
        if ($module04Index -ge 0) {
            $mainData.modules.Insert($module04Index + 1, $module5Data)
        } else {
            $mainData.modules += $module5Data
        }
    }
    
    # Update total lessons count
    $totalLessons = 0
    foreach ($module in $mainData.modules) {
        if ($module.lessons -and $module.lessons.Count -gt 0) {
            $totalLessons += $module.lessons.Count
        }
    }
    $mainData.totalLessons = $totalLessons
    
    Write-Host "Writing updated JSON file..."
    $jsonContent = $mainData | ConvertTo-Json -Depth 100 -Compress:$false
    [System.IO.File]::WriteAllText((Resolve-Path $mainJsonPath).Path, $jsonContent, [System.Text.Encoding]::UTF8)
    
    Write-Host "✅ Module 5 content updated successfully!"
    Write-Host "✅ Total lessons in file: $totalLessons"
    Write-Host "✅ Module 5 has $($module5Data.lessons.Count) lessons"
} catch {
    Write-Host "Error: $_"
    Write-Host "Stack trace: $($_.ScriptStackTrace)"
    exit 1
}
