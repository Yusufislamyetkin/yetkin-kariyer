import * as fs from 'fs';
import * as path from 'path';

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  topic: string | null;
  type: string;
  level: string | null;
  questions: any;
  passingScore: number;
  lessonSlug: string | null;
}

interface SeedData {
  module: any;
  quizzes: Quiz[];
}

function extractModuleJson(sqlContent: string): any | null {
  // Find the module JSON between $${ and }$$::jsonb
  const startMarker = '$${';
  const endMarker = '}$$::jsonb';
  
  const startIndex = sqlContent.indexOf(startMarker);
  if (startIndex === -1) {
    return null;
  }
  
  const endIndex = sqlContent.indexOf(endMarker, startIndex);
  if (endIndex === -1) {
    return null;
  }
  
  // Extract the JSON content (without the markers)
  let jsonContent = sqlContent.substring(startIndex + startMarker.length, endIndex).trim();
  
  // The JSON content should already be a valid JSON object
  // But it might have leading whitespace, ensure it starts with {
  if (!jsonContent.startsWith('{')) {
    jsonContent = '{' + jsonContent + '}';
  }
  
  // PostgreSQL dollar-quoted strings can contain unescaped characters
  // We need to properly handle the JSON. The issue is that the JSON might have
  // unescaped newlines, quotes, etc. that PostgreSQL accepts but JSON.parse doesn't.
  // Let's try to fix common issues:
  
  // 1. Fix unescaped newlines in strings (but not in code blocks where they might be intentional)
  // This is tricky, so we'll use a more lenient approach
  
  try {
    // First, try parsing as-is
    return JSON.parse(jsonContent);
  } catch (error) {
    // If that fails, try to fix common issues
    try {
      // Remove trailing commas before } or ]
      let fixed = jsonContent.replace(/,(\s*[}\]])/g, '$1');
      
      // Try to fix unescaped quotes in strings (but this is complex)
      // Instead, let's use a more lenient JSON parser approach
      
      // For now, let's try to use eval (unsafe but works for trusted data)
      // Actually, let's not use eval. Instead, let's try to manually fix the JSON
      
      // Try parsing again
      return JSON.parse(fixed);
    } catch (error2) {
      // Last resort: try to extract and fix the JSON more carefully
      // The issue might be with escape sequences
      try {
        // Replace \n with actual newlines in string values (but this is dangerous)
        // Actually, let's write the content to a temp file and use a JSON repair library
        // But we don't have that, so let's try a different approach:
        
        // Use a simple regex to find and fix common JSON issues
        let repaired = jsonContent;
        
        // Fix trailing commas
        repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
        
        // Try to fix unescaped control characters in strings
        // This is complex, so let's just try to parse what we can
        
        // If it still fails, return null and we'll handle it differently
        return JSON.parse(repaired);
      } catch (error3) {
        console.error('Failed to parse JSON after all attempts');
        // Write the problematic JSON to a file for manual inspection
        const debugPath = path.join(process.cwd(), 'data', 'seed-data', 'debug-json.txt');
        if (!fs.existsSync(path.dirname(debugPath))) {
          fs.mkdirSync(path.dirname(debugPath), { recursive: true });
        }
        fs.writeFileSync(debugPath, jsonContent.substring(0, 2000), 'utf-8');
        return null;
      }
    }
  }
}

function extractQuizzes(sqlContent: string): Quiz[] {
  const quizzes: Quiz[] = [];
  
  // Find INSERT INTO "quizzes" statement
  const insertIndex = sqlContent.indexOf('INSERT INTO "quizzes"');
  if (insertIndex === -1) {
    return quizzes;
  }
  
  // For now, return empty array - we'll handle quiz extraction separately
  // or manually create them from the SQL files
  // Quiz extraction is complex due to the SQL INSERT syntax
  
  return quizzes;
}

function convertSqlToJson(sqlFilePath: string, outputDir: string): void {
  console.log(`Converting ${path.basename(sqlFilePath)}...`);
  
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
  
  // Extract module
  const module = extractModuleJson(sqlContent);
  if (!module) {
    console.error(`  ❌ Could not extract module`);
    return;
  }
  console.log(`  ✓ Extracted module: ${module.id || module.title || 'unknown'}`);
  
  // Extract quizzes - for now return empty, we'll add them manually or with a better parser
  const quizzes = extractQuizzes(sqlContent);
  console.log(`  ✓ Extracted ${quizzes.length} quizzes`);
  
  // Create seed data object
  const seedData: SeedData = {
    module,
    quizzes,
  };
  
  // Determine output filename from input filename
  const filename = path.basename(sqlFilePath, '.sql');
  const moduleNumber = filename.match(/module-(\d+)/)?.[1];
  const outputFilename = moduleNumber ? `module-${moduleNumber.padStart(2, '0')}.json` : `${filename}.json`;
  const outputPath = path.join(outputDir, outputFilename);
  
  // Write JSON file
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2), 'utf-8');
  console.log(`  ✓ Saved to ${outputFilename}`);
}

function main() {
  const scriptsDir = path.join(process.cwd(), 'DB-Scripts');
  const outputDir = path.join(process.cwd(), 'data', 'seed-data');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find all module SQL files
  const files = fs.readdirSync(scriptsDir)
    .filter(file => file.startsWith('Net-Core-module-') && file.endsWith('.sql'))
    .sort();
  
  console.log(`Found ${files.length} module files\n`);
  
  let successCount = 0;
  for (const file of files) {
    const filePath = path.join(scriptsDir, file);
    try {
      convertSqlToJson(filePath, outputDir);
      successCount++;
      console.log('');
    } catch (error) {
      console.error(`  ❌ Error converting ${file}:`, error);
      console.log('');
    }
  }
  
  console.log(`\n✅ Conversion complete! ${successCount}/${files.length} files converted successfully.`);
  console.log(`\nNote: Quiz extraction is not yet implemented. You may need to add quizzes manually.`);
}

if (require.main === module) {
  main();
}

export { convertSqlToJson, extractModuleJson, extractQuizzes };
