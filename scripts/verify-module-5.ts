import * as fs from 'fs';
import * as path from 'path';

const jsonPath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');

try {
  const content = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);
  
  const mod5 = data.modules.find((m: any) => m.moduleId === 'module-05-web-api');
  
  if (mod5) {
    console.log('✅ Module 5 found!');
    console.log(`✅ Lessons: ${mod5.lessons.length}`);
    
    const lesson1 = mod5.lessons[0];
    console.log(`✅ First lesson: ${lesson1.label}`);
    console.log(`✅ Sections count: ${lesson1.sections ? lesson1.sections.length : 0}`);
    
    if (lesson1.sections && lesson1.sections.length > 0) {
      console.log('\n✅ Section titles:');
      lesson1.sections.forEach((s: any, i: number) => {
        console.log(`  ${i + 1}. ${s.title}`);
      });
      
      // Check if all sections are phases (should have "Faz" in title)
      const hasAllPhases = lesson1.sections.every((s: any) => 
        s.title.includes('Faz 1') || 
        s.title.includes('Faz 2') || 
        s.title.includes('Faz 3') || 
        s.title.includes('Faz 4')
      );
      
      if (hasAllPhases) {
        console.log('\n✅ All sections are organized as phases!');
      } else {
        console.log('\n⚠️  Some sections are not organized as phases');
      }
    }
    
    // Check all lessons
    console.log('\n✅ All lessons:');
    mod5.lessons.forEach((lesson: any, i: number) => {
      console.log(`  ${i + 1}. ${lesson.label} - ${lesson.sections ? lesson.sections.length : 0} sections`);
    });
    
  } else {
    console.log('❌ Module 5 not found!');
  }
} catch (error: any) {
  console.error('Error:', error.message);
  process.exit(1);
}
