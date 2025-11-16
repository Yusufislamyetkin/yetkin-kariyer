import * as fs from 'fs';
import * as path from 'path';

/**
 * Update Module 5 content in the main JSON file
 */

const mainJsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
const module5JsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-detailed.json');

try {
  // Read main JSON file
  console.log('Reading main JSON file...');
  const mainContent = fs.readFileSync(mainJsonPath, 'utf-8');
  const mainData = JSON.parse(mainContent);
  
  // Read Module 5 JSON file
  console.log('Reading Module 5 JSON file...');
  const module5Content = fs.readFileSync(module5JsonPath, 'utf-8');
  const module5Data = JSON.parse(module5Content);
  
  // Find Module 5 in main JSON
  const moduleIndex = mainData.modules.findIndex((m: any) => m.moduleId === 'module-05-web-api');
  
  if (moduleIndex >= 0) {
    console.log(`Found module-05-web-api at index ${moduleIndex}, updating...`);
    // Update existing module
    mainData.modules[moduleIndex] = module5Data;
  } else {
    console.log('module-05-web-api not found, adding new module...');
    // Add new module (find the right position - after module-04)
    const module04Index = mainData.modules.findIndex((m: any) => m.moduleId === 'module-04-aspnet-mvc');
    if (module04Index >= 0) {
      mainData.modules.splice(module04Index + 1, 0, module5Data);
    } else {
      mainData.modules.push(module5Data);
    }
  }
  
  // Update total lessons count if needed
  let totalLessons = 0;
  mainData.modules.forEach((module: any) => {
    if (module.lessons && Array.isArray(module.lessons)) {
      totalLessons += module.lessons.length;
    }
  });
  mainData.totalLessons = totalLessons;
  
  // Write updated JSON back
  console.log('Writing updated JSON file...');
  fs.writeFileSync(mainJsonPath, JSON.stringify(mainData, null, 2), 'utf-8');
  
  console.log('✅ Module 5 content updated successfully!');
  console.log(`✅ Total lessons in file: ${totalLessons}`);
  console.log(`✅ Module 5 has ${module5Data.lessons.length} lessons`);
} catch (error: any) {
  console.error('Error updating Module 5 content:', error.message);
  process.exit(1);
}
