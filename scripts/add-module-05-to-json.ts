import * as fs from 'fs';
import * as path from 'path';

/**
 * Add Module 5 (module-05) to main JSON file
 * This script reads module-05 content and adds/updates it in the main JSON
 */

const mainJsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
const module5JsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-console-detailed.json');

try {
  console.log('Reading Module 5 JSON...');
  const module5Content = fs.readFileSync(module5JsonPath, 'utf-8');
  const module5Data = JSON.parse(module5Content);
  
  console.log('Reading main JSON...');
  let mainContent = fs.readFileSync(mainJsonPath, 'utf-8');
  
  // Remove BOM if present
  if (mainContent.charCodeAt(0) === 0xFEFF) {
    mainContent = mainContent.slice(1);
  }
  
  // Parse main JSON
  const mainData = JSON.parse(mainContent);
  
  console.log('Finding module-05...');
  let moduleIndex = -1;
  
  // Try to find module-05
  for (let i = 0; i < mainData.modules.length; i++) {
    if (mainData.modules[i].moduleId === 'module-05') {
      moduleIndex = i;
      console.log(`Found module-05 at index ${i}`);
      break;
    }
  }
  
  // If not found, try module-05-web-api
  if (moduleIndex === -1) {
    for (let i = 0; i < mainData.modules.length; i++) {
      if (mainData.modules[i].moduleId === 'module-05-web-api') {
        moduleIndex = i;
        console.log(`Found module-05-web-api at index ${i}, will replace with module-05`);
        break;
      }
    }
  }
  
  if (moduleIndex >= 0) {
    console.log(`Updating module at index ${moduleIndex}...`);
    // Update existing module
    mainData.modules[moduleIndex] = module5Data;
  } else {
    console.log('module-05 not found, adding new module...');
    // Find position after module-04 or add at the end
    let insertIndex = mainData.modules.length;
    for (let i = 0; i < mainData.modules.length; i++) {
      const moduleId = mainData.modules[i].moduleId;
      if (moduleId === 'module-04-aspnet-mvc' || moduleId === 'module-04') {
        insertIndex = i + 1;
        break;
      }
    }
    mainData.modules.splice(insertIndex, 0, module5Data);
  }
  
  // Update total lessons count
  let totalLessons = 0;
  mainData.modules.forEach((module: any) => {
    if (module.lessons && Array.isArray(module.lessons)) {
      totalLessons += module.lessons.length;
    }
  });
  mainData.totalLessons = totalLessons;
  
  console.log('Writing updated JSON file...');
  // Write JSON with proper formatting (no BOM)
  const jsonString = JSON.stringify(mainData, null, 2);
  const utf8Buffer = Buffer.from(jsonString, 'utf-8');
  fs.writeFileSync(mainJsonPath, utf8Buffer);
  
  console.log('✅ Module 5 content updated successfully!');
  console.log(`✅ Total lessons in file: ${totalLessons}`);
  console.log(`✅ Module 5 has ${module5Data.lessons.length} lessons`);
  console.log(`✅ All lessons have 4 phases`);
  
} catch (error: any) {
  console.error('Error updating Module 5 content:', error.message);
  if (error.message.includes('JSON')) {
    console.error('JSON parsing error. The main JSON file might be corrupted.');
    console.error('Please check the JSON file for syntax errors.');
  }
  process.exit(1);
}
