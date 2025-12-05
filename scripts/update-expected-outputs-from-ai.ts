/**
 * Update Expected Outputs from AI Analysis
 * 
 * This script:
 * 1. Loads all live coding cases
 * 2. For each case, runs correct code and gets AI analysis
 * 3. Runs AI's correctedCode and gets its output
 * 4. Compares with current expectedOutput
 * 5. Updates JSON files if different
 */

import fs from "fs";
import path from "path";
import {
  loadLiveCodingCases,
  runCodeForTestCase,
  analyzeCodeWithAI,
  compareOutputs,
  normalizeOutput,
  getAuthCookie,
  getSampleCorrectCode,
  type LiveCodingTestCase,
} from "../tests/live-coding/test-helpers";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const DELAY_BETWEEN_CASES = 300; // ms

interface UpdateResult {
  caseId: string;
  language: string;
  title: string;
  status: "updated" | "skipped" | "error" | "already_matched";
  oldExpectedOutput?: string;
  newExpectedOutput?: string;
  error?: string;
}

/**
 * Generate correct code for a test case
 */
function generateCorrectCode(testCase: LiveCodingTestCase): string {
  // Try to get sample correct code first
  const sampleCode = getSampleCorrectCode(testCase, testCase.language);
  if (sampleCode) {
    return sampleCode;
  }

  // Fallback to starter code
  return testCase.starterCode?.[testCase.language] || "";
}

/**
 * Load JSON file for a language
 */
function loadLanguageJson(language: string): any {
  const filePath = path.join(
    process.cwd(),
    "data",
    "live-coding-cases",
    `${language}-cases.json`
  );
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Backup JSON file
 */
function backupJsonFile(language: string): void {
  const filePath = path.join(
    process.cwd(),
    "data",
    "live-coding-cases",
    `${language}-cases.json`
  );
  
  if (!fs.existsSync(filePath)) {
    return;
  }

  const backupPath = `${filePath}.backup`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`  📦 Backup created: ${backupPath}`);
}

/**
 * Update JSON file with new expectedOutput
 */
function updateJsonFile(
  language: string,
  caseId: string,
  newExpectedOutput: string
): boolean {
  try {
    const data = loadLanguageJson(language);
    if (!data || !data.cases) {
      console.error(`  ❌ Could not load JSON for ${language}`);
      return false;
    }

    // Find the case
    const caseIndex = data.cases.findIndex((c: any) => c.id === caseId);
    if (caseIndex === -1) {
      console.error(`  ❌ Case ${caseId} not found in ${language}-cases.json`);
      return false;
    }

    // Update expectedOutput
    if (!data.cases[caseIndex].testCases || data.cases[caseIndex].testCases.length === 0) {
      console.error(`  ❌ No testCases found for ${caseId}`);
      return false;
    }

    data.cases[caseIndex].testCases[0].expectedOutput = newExpectedOutput;

    // Write back to file
    const filePath = path.join(
      process.cwd(),
      "data",
      "live-coding-cases",
      `${language}-cases.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`  ❌ Error updating JSON for ${caseId}:`, error);
    return false;
  }
}

/**
 * Process a single case
 */
async function processCase(
  testCase: LiveCodingTestCase,
  authCookie: string | null,
  progress: string
): Promise<UpdateResult> {
  const result: UpdateResult = {
    caseId: testCase.id,
    language: testCase.language,
    title: testCase.title,
    status: "skipped",
  };

  const expectedOutput = testCase.testCases?.[0]?.expectedOutput;
  if (!expectedOutput) {
    result.status = "error";
    result.error = "No expectedOutput found";
    return result;
  }

  result.oldExpectedOutput = expectedOutput;

  try {
    // Step 1: Generate and run correct code
    console.log(`${progress} 🔄 [1/4] Running correct code...`);
    const correctCode = generateCorrectCode(testCase);
    
    if (!correctCode || correctCode.trim().length === 0) {
      result.status = "error";
      result.error = "No code generated";
      return result;
    }

    const runResult = await runCodeForTestCase(correctCode, testCase.language, BASE_URL);
    
    if (runResult.errorMessage) {
      result.status = "error";
      result.error = `Run failed: ${runResult.errorMessage}`;
      return result;
    }

    const actualOutput = runResult.stdout || runResult.output || "";
    
    // Step 2: Check if current output already matches
    console.log(`${progress} 🔍 [2/4] Comparing current output...`);
    const isCurrentlyCorrect = compareOutputs(actualOutput, expectedOutput);
    
    if (isCurrentlyCorrect) {
      result.status = "already_matched";
      console.log(`${progress} ✅ [2/4] Already matches, skipping`);
      return result;
    }

    // Step 3: Get AI analysis
    console.log(`${progress} 🤖 [3/4] Getting AI analysis...`);
    const aiEvaluation = await analyzeCodeWithAI(
      testCase.description || testCase.title,
      expectedOutput,
      correctCode,
      actualOutput,
      testCase.language,
      BASE_URL,
      authCookie || undefined
    );

    if (aiEvaluation.feedback?.includes("AI servisi") || 
        aiEvaluation.feedback?.includes("AI değerlendirmesi")) {
      result.status = "error";
      result.error = "AI service not available";
      return result;
    }

    if (!aiEvaluation.correctedCode || aiEvaluation.correctedCode.trim().length === 0) {
      result.status = "error";
      result.error = "No correctedCode from AI";
      return result;
    }

    // Step 4: Run correctedCode and get output
    console.log(`${progress} 🔄 [4/4] Running AI's correctedCode...`);
    const correctedRunResult = await runCodeForTestCase(
      aiEvaluation.correctedCode,
      testCase.language,
      BASE_URL
    );

    if (correctedRunResult.errorMessage) {
      result.status = "error";
      result.error = `CorrectedCode run failed: ${correctedRunResult.errorMessage}`;
      return result;
    }

    const aiOutput = correctedRunResult.stdout || correctedRunResult.output || "";
    const normalizedAIOutput = normalizeOutput(aiOutput);

    if (!normalizedAIOutput || normalizedAIOutput.trim().length === 0) {
      result.status = "error";
      result.error = "AI correctedCode produced no output";
      return result;
    }

    // Step 5: Compare and update if different
    const normalizedCurrent = normalizeOutput(expectedOutput);
    const isDifferent = normalizedCurrent !== normalizedAIOutput;

    if (isDifferent) {
      // Update JSON file
      const updated = updateJsonFile(testCase.language, testCase.id, normalizedAIOutput);
      
      if (updated) {
        result.status = "updated";
        result.newExpectedOutput = normalizedAIOutput;
        console.log(`${progress} ✏️  [4/4] Updated expectedOutput`);
        console.log(`${progress}    Old: ${normalizedCurrent.substring(0, 60).replace(/\n/g, " ")}...`);
        console.log(`${progress}    New: ${normalizedAIOutput.substring(0, 60).replace(/\n/g, " ")}...`);
      } else {
        result.status = "error";
        result.error = "Failed to update JSON file";
      }
    } else {
      result.status = "already_matched";
      console.log(`${progress} ✅ [4/4] AI output matches current expectedOutput`);
    }

    return result;
  } catch (error) {
    result.status = "error";
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

/**
 * Main function
 */
async function main() {
  console.log("📊 AI-Based Expected Output Güncelleme Başlatılıyor...\n");

  // Get authentication
  console.log("🔐 Authentication cookie alınıyor...");
  const authCookie = await getAuthCookie();
  if (!authCookie) {
    console.warn("⚠️  Could not get auth cookie. Some tests may fail with 401.");
    console.warn("   Continuing anyway (test mode may bypass auth)...\n");
  } else {
    console.log("✅ Authentication başarılı\n");
  }

  // Load all cases
  const cases = loadLiveCodingCases();
  if (cases.length === 0) {
    console.error("❌ No test cases loaded");
    process.exit(1);
  }

  console.log(`📋 Toplam ${cases.length} case yüklendi\n`);

  // Group cases by language for efficient JSON updates
  const casesByLanguage = new Map<string, LiveCodingTestCase[]>();
  for (const testCase of cases) {
    if (!casesByLanguage.has(testCase.language)) {
      casesByLanguage.set(testCase.language, []);
    }
    casesByLanguage.get(testCase.language)!.push(testCase);
  }

  // Create backups for all language files
  console.log("📦 Creating backups...");
  for (const language of casesByLanguage.keys()) {
    backupJsonFile(language);
  }
  console.log("");

  const results: UpdateResult[] = [];
  let processedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let alreadyMatchedCount = 0;

  // Process each case
  for (let i = 0; i < cases.length; i++) {
    const testCase = cases[i];
    const progress = `[${i + 1}/${cases.length}]`;

    console.log(`${progress} 🔄 ${testCase.id} (${testCase.language}) işleniyor...`);

    const result = await processCase(testCase, authCookie, progress);
    results.push(result);

    switch (result.status) {
      case "updated":
        updatedCount++;
        processedCount++;
        break;
      case "already_matched":
        alreadyMatchedCount++;
        skippedCount++;
        break;
      case "error":
        errorCount++;
        processedCount++;
        console.log(`${progress} ❌ Error: ${result.error}`);
        break;
      case "skipped":
        skippedCount++;
        break;
    }

    // Delay between cases to avoid rate limiting
    if (i < cases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CASES));
    }

    console.log(""); // Empty line for readability
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📈 Özet:");
  console.log("=".repeat(60));
  console.log(`  Toplam: ${cases.length}`);
  console.log(`  İşlenen: ${processedCount}`);
  console.log(`  Güncellenen: ${updatedCount}`);
  console.log(`  Zaten eşleşen: ${alreadyMatchedCount}`);
  console.log(`  Atlanan: ${skippedCount - alreadyMatchedCount}`);
  console.log(`  Hata: ${errorCount}`);

  // Print updated cases
  if (updatedCount > 0) {
    console.log("\n✏️  Güncellenen Case'ler:");
    results
      .filter(r => r.status === "updated")
      .forEach(r => {
        console.log(`  - ${r.caseId} (${r.language}): ${r.title}`);
        if (r.oldExpectedOutput && r.newExpectedOutput) {
          const oldPreview = r.oldExpectedOutput.substring(0, 50).replace(/\n/g, " ");
          const newPreview = r.newExpectedOutput.substring(0, 50).replace(/\n/g, " ");
          console.log(`    Old: ${oldPreview}...`);
          console.log(`    New: ${newPreview}...`);
        }
      });
  }

  // Print error cases
  if (errorCount > 0) {
    console.log("\n❌ Hata Olan Case'ler:");
    results
      .filter(r => r.status === "error")
      .forEach(r => {
        console.log(`  - ${r.caseId} (${r.language}): ${r.error}`);
      });
  }

  console.log("\n✅ Güncelleme tamamlandı!");
  console.log("💡 Backup dosyaları .backup uzantılı olarak kaydedildi.");
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

