import * as fs from 'fs';
import * as path from 'path';

/**
 * Update Module 5 (module-05) content in the main JSON file
 */

const mainJsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
const module5JsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-console-detailed.json');

try {
  // Read main JSON file
  console.log('Reading main JSON file...');
  const mainContent = fs.readFileSync(mainJsonPath, 'utf-8');
  const mainData = JSON.parse(mainContent);
  
  // Read Module 5 JSON file
  console.log('Reading Module 5 JSON file...');
  const module5Content = fs.readFileSync(module5JsonPath, 'utf-8');
  const module5Data = JSON.parse(module5Content);
  
  // Find Module 5 in main JSON (module-05, not module-05-web-api)
  let moduleIndex = mainData.modules.findIndex((m: any) => m.moduleId === 'module-05');
  
  // If not found, try to find module-05-web-api and replace it
  if (moduleIndex < 0) {
    moduleIndex = mainData.modules.findIndex((m: any) => m.moduleId === 'module-05-web-api');
  }
  
  if (moduleIndex >= 0) {
    console.log(`Found module at index ${moduleIndex}, updating...`);
    // Update existing module
    mainData.modules[moduleIndex] = module5Data;
  } else {
    console.log('module-05 not found, adding new module...');
    // Add new module (find the right position - after module-04)
    const module04Index = mainData.modules.findIndex((m: any) => 
      m.moduleId === 'module-04-aspnet-mvc' || m.moduleId === 'module-04'
    );
    if (module04Index >= 0) {
      mainData.modules.splice(module04Index + 1, 0, module5Data);
    } else {
      mainData.modules.push(module5Data);
    }
  }
  
  // Update total lessons count
  let totalLessons = 0;
  mainData.modules.forEach((module: any) => {
    if (module.lessons && Array.isArray(module.lessons)) {
      totalLessons += module.lessons.length;
    }
  });
  mainData.totalLessons = totalLessons;
  
  // Write updated JSON back
  console.log('Writing updated JSON file...');
  const jsonString = JSON.stringify(mainData, null, 2);
  const utf8NoBom = Buffer.from(jsonString, 'utf8');
  fs.writeFileSync(mainJsonPath, utf8NoBom, 'utf-8');
  
  console.log('✅ Module 5 content updated successfully!');
  console.log(`✅ Total lessons in file: ${totalLessons}`);
  console.log(`✅ Module 5 has ${module5Data.lessons.length} lessons`);
  console.log(`✅ All lessons have 4 phases`);
} catch (error: any) {
  console.error('Error updating Module 5 content:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
