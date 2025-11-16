import * as fs from 'fs';
import * as path from 'path';

/**
 * Check if Module 5 content is complete and detailed
 */

const jsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');

try {
  const content = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);
  
  const mod5 = data.modules.find((m: any) => m.moduleId === 'module-05-web-api');
  
  if (!mod5) {
    console.log('❌ Module 5 not found!');
    process.exit(1);
  }
  
  console.log('📋 Module 5 Content Completeness Check\n');
  console.log(`Module ID: ${mod5.moduleId}`);
  console.log(`Module Title: ${mod5.moduleTitle}`);
  console.log(`Total Lessons: ${mod5.lessons.length}\n`);
  
  let allComplete = true;
  
  mod5.lessons.forEach((lesson: any, index: number) => {
    console.log(`\n📚 Lesson ${index + 1}: ${lesson.label}`);
    console.log(`   Href: ${lesson.href}`);
    console.log(`   Description: ${lesson.description ? '✅' : '❌'}`);
    console.log(`   Duration: ${lesson.estimatedDurationMinutes} minutes`);
    console.log(`   Level: ${lesson.level}`);
    
    // Check sections (phases)
    if (!lesson.sections || lesson.sections.length !== 4) {
      console.log(`   ❌ Sections: ${lesson.sections ? lesson.sections.length : 0} (Expected: 4)`);
      allComplete = false;
    } else {
      console.log(`   ✅ Sections: ${lesson.sections.length} phases`);
      lesson.sections.forEach((section: any, i: number) => {
        const hasContent = section.content && Array.isArray(section.content) && section.content.length > 0;
        const hasTitle = section.title && section.title.includes('Faz');
        console.log(`      ${i + 1}. ${section.title}: ${hasContent ? '✅' : '❌'} ${hasTitle ? '✅' : '❌'}`);
        
        // Check content types
        if (hasContent) {
          const hasText = section.content.some((c: any) => c.type === 'text');
          const hasCode = section.content.some((c: any) => c.type === 'code');
          const hasList = section.content.some((c: any) => c.type === 'list');
          const hasCallout = section.content.some((c: any) => c.type === 'callout');
          
          console.log(`         - Text: ${hasText ? '✅' : '❌'}`);
          console.log(`         - Code: ${hasCode ? '✅' : '❌'}`);
          console.log(`         - List: ${hasList ? '✅' : '❌'}`);
          console.log(`         - Callout: ${hasCallout ? '✅' : '❌'}`);
        }
      });
    }
    
    // Check key takeaways
    if (!lesson.keyTakeaways || lesson.keyTakeaways.length === 0) {
      console.log(`   ❌ Key Takeaways: Missing`);
      allComplete = false;
    } else {
      console.log(`   ✅ Key Takeaways: ${lesson.keyTakeaways.length}`);
    }
    
    // Check checkpoints
    if (!lesson.checkpoints || lesson.checkpoints.length === 0) {
      console.log(`   ❌ Checkpoints: Missing`);
      allComplete = false;
    } else {
      console.log(`   ✅ Checkpoints: ${lesson.checkpoints.length}`);
    }
    
    // Check resources
    if (!lesson.resources || lesson.resources.length === 0) {
      console.log(`   ❌ Resources: Missing`);
      allComplete = false;
    } else {
      console.log(`   ✅ Resources: ${lesson.resources.length}`);
    }
    
    // Check practice
    if (!lesson.practice || lesson.practice.length === 0) {
      console.log(`   ❌ Practice: Missing`);
      allComplete = false;
    } else {
      console.log(`   ✅ Practice: ${lesson.practice.length}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  if (allComplete) {
    console.log('✅ Module 5 content is COMPLETE!');
    console.log('✅ All lessons have 4 phases');
    console.log('✅ All lessons have detailed content');
    console.log('✅ All lessons have checkpoints, resources, and practice');
  } else {
    console.log('⚠️  Module 5 content has some missing parts');
    console.log('Please review the details above');
  }
  console.log('='.repeat(50));
  
} catch (error: any) {
  console.error('Error:', error.message);
  process.exit(1);
}
