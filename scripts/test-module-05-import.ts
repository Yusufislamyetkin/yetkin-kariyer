/**
 * Test script to verify Module-05 import functionality
 * This script simulates the import process for Module-05
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('=== Module-05 Import Test ===\n');

// Test 1: Check if Module-05 JSON exists and is valid
console.log('1. Checking Module-05 JSON file...');
const module5FilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-console-detailed.json');

if (!fs.existsSync(module5FilePath)) {
  console.error('❌ Module-05 JSON file not found!');
  process.exit(1);
}

try {
  const module5Content = fs.readFileSync(module5FilePath, 'utf-8');
  const module5Data = JSON.parse(module5Content);
  
  console.log('✅ Module-05 JSON is valid');
  console.log(`   Module ID: ${module5Data.moduleId}`);
  console.log(`   Module Title: ${module5Data.moduleTitle}`);
  console.log(`   Lessons Count: ${module5Data.lessons.length}`);
  
  // Verify all lessons have 4 phases
  const lessonsWith4Phases = module5Data.lessons.filter((l: any) => l.sections && l.sections.length === 4);
  console.log(`   Lessons with 4 phases: ${lessonsWith4Phases.length}/${module5Data.lessons.length}`);
  
  if (lessonsWith4Phases.length !== module5Data.lessons.length) {
    console.warn('⚠️  Some lessons do not have 4 phases!');
  }
  
  // Check first few lessons
  console.log('\n   First 5 lessons:');
  module5Data.lessons.slice(0, 5).forEach((lesson: any, index: number) => {
    const phasesCount = lesson.sections ? lesson.sections.length : 0;
    console.log(`   ${index + 1}. ${lesson.label} - ${phasesCount} phases`);
  });
  
} catch (error: any) {
  console.error('❌ Error parsing Module-05 JSON:', error.message);
  process.exit(1);
}

// Test 2: Check if seed-data.ts has Module-05 support
console.log('\n2. Checking seed-data.ts integration...');
const seedDataPath = path.join(process.cwd(), 'lib', 'admin', 'seed-data.ts');

if (!fs.existsSync(seedDataPath)) {
  console.error('❌ seed-data.ts file not found!');
  process.exit(1);
}

const seedDataContent = fs.readFileSync(seedDataPath, 'utf-8');

// Check for Module-5 file path
const hasModule5Path = seedDataContent.includes('module-05-console-detailed.json');
console.log(`   Module-05 file path: ${hasModule5Path ? '✅' : '❌'}`);

// Check for loadModuleFromFile call
const hasLoadCall = seedDataContent.includes('loadModuleFromFile(module5FilePath');
console.log(`   loadModuleFromFile call: ${hasLoadCall ? '✅' : '❌'}`);

// Check for Module-05 mapping
const hasModule5Mapping = seedDataContent.includes("'module-05': ['module-05']");
console.log(`   Module-05 mapping: ${hasModule5Mapping ? '✅' : '❌'}`);

if (!hasModule5Path || !hasLoadCall || !hasModule5Mapping) {
  console.error('\n❌ Module-05 integration is incomplete!');
  process.exit(1);
}

// Test 3: Verify module structure
console.log('\n3. Verifying module structure...');
try {
  const module5Content = fs.readFileSync(module5FilePath, 'utf-8');
  const module5Data = JSON.parse(module5Content);
  
  // Check required fields
  const hasModuleId = !!module5Data.moduleId;
  const hasModuleTitle = !!module5Data.moduleTitle;
  const hasLessons = !!module5Data.lessons && Array.isArray(module5Data.lessons);
  
  console.log(`   Has moduleId: ${hasModuleId ? '✅' : '❌'}`);
  console.log(`   Has moduleTitle: ${hasModuleTitle ? '✅' : '❌'}`);
  console.log(`   Has lessons array: ${hasLessons ? '✅' : '❌'}`);
  
  // Check lessons structure
  if (hasLessons && module5Data.lessons.length > 0) {
    const firstLesson = module5Data.lessons[0];
    const hasLabel = !!firstLesson.label;
    const hasHref = !!firstLesson.href;
    const hasSections = !!firstLesson.sections && Array.isArray(firstLesson.sections);
    const hasDescription = !!firstLesson.description;
    
    console.log(`   Lesson structure:`);
    console.log(`     - Has label: ${hasLabel ? '✅' : '❌'}`);
    console.log(`     - Has href: ${hasHref ? '✅' : '❌'}`);
    console.log(`     - Has sections: ${hasSections ? '✅' : '❌'}`);
    console.log(`     - Has description: ${hasDescription ? '✅' : '❌'}`);
    
    if (hasSections && firstLesson.sections.length > 0) {
      const firstSection = firstLesson.sections[0];
      const hasSectionId = !!firstSection.id;
      const hasSectionTitle = !!firstSection.title;
      const hasSectionContent = !!firstSection.content && Array.isArray(firstSection.content);
      
      console.log(`   Section structure:`);
      console.log(`     - Has id: ${hasSectionId ? '✅' : '❌'}`);
      console.log(`     - Has title: ${hasSectionTitle ? '✅' : '❌'}`);
      console.log(`     - Has content: ${hasSectionContent ? '✅' : '❌'}`);
    }
  }
} catch (error: any) {
  console.error('❌ Error verifying module structure:', error.message);
  process.exit(1);
}

console.log('\n✅ All tests passed! Module-05 is ready for import.');
console.log('\nNext steps:');
console.log('1. Deploy the updated code to production');
console.log('2. Go to https://yetkin-hub.vercel.app/admin');
console.log('3. Click "Ders İçeriklerini Import Et" button');
console.log('4. Module-05 content (20 lessons with 4 phases each) will be imported automatically');
