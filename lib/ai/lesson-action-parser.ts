import type { LiveCodingLanguage } from "@/types/live-coding";

export interface ParsedLessonActions {
  content: string;
  roadmap?: string;
  progress?: { step: number; status: "pending" | "in_progress" | "completed" };
  isCompleted?: boolean;
  images?: string[];
  actions?: Array<{
    type: "test_question" | "code_block" | "fill_blank" | "timed_bugfix" | "mini_test" | "choices" | "coding_challenge" | "question" | "quiz_redirect" | "test_redirect" | "bugfix_redirect" | "livecoding_redirect" | "create_test" | "create_quiz" | "create_bugfix" | "create_livecoding";
    data: any;
  }>;
}

/**
 * AI yanıtından action'ları parse eder
 */
export function parseLessonActions(content: string): ParsedLessonActions {
  const images: string[] = [];
  const actions: Array<{
    type: string;
    data: any;
  }> = [];
  let extractedRoadmap: string | null = null;
  let extractedProgress: { step: number; status: "pending" | "in_progress" | "completed" } | undefined;
  let isCompleted = false;
  let cleanedContent = content;

  // Parse ROADMAP tags
  const roadmapRegex = /\[ROADMAP:\s*([^\]]+)\]/gi;
  let match;
  while ((match = roadmapRegex.exec(content)) !== null) {
    extractedRoadmap = match[1].trim();
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse CURRENT_STEP tags - indicates which roadmap step the current message is for
  const currentStepRegex = /\[CURRENT_STEP:\s*(\d+)\]/gi;
  let hasCurrentStep = false;
  let currentStepNumber: number | undefined;
  while ((match = currentStepRegex.exec(content)) !== null) {
    const stepNumber = parseInt(match[1], 10);
    currentStepNumber = stepNumber;
    hasCurrentStep = true;
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse STEP_COMPLETE tags
  const stepCompleteRegex = /\[STEP_COMPLETE:\s*(\d+)\]/gi;
  let hasStepComplete = false;
  let stepCompleteNumber: number | undefined;
  while ((match = stepCompleteRegex.exec(content)) !== null) {
    const stepNumber = parseInt(match[1], 10);
    stepCompleteNumber = stepNumber;
    hasStepComplete = true;
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Set progress based on tags found
  // If STEP_COMPLETE is present, use it with "completed" status (takes priority)
  // Otherwise, if CURRENT_STEP is present, use it with "in_progress" status
  if (hasStepComplete && stepCompleteNumber !== undefined) {
    extractedProgress = {
      step: stepCompleteNumber,
      status: "completed",
    };
  } else if (hasCurrentStep && currentStepNumber !== undefined) {
    extractedProgress = {
      step: currentStepNumber,
      status: "in_progress",
    };
  }

  // Parse LESSON_COMPLETE tags - This is the primary way to mark completion
  const lessonCompleteRegex = /\[LESSON_COMPLETE\]/gi;
  if (lessonCompleteRegex.test(content)) {
    isCompleted = true;
    cleanedContent = cleanedContent.replace(lessonCompleteRegex, "");
  }

  // Check for explicit completion phrases only (not generic words like "tebrikler")
  // These must be clear, unambiguous completion statements
  const explicitCompletionPatterns = [
    /ders\s+tamamlandı[!.]?/i,
    /ders\s+bitti[!.]?/i,
    /dersi\s+bitirdin[!.]?/i,
    /dersi\s+tamamladın[!.]?/i,
    /ders\s+tamam[!.]?/i,
    /dersimiz\s+tamamlandı[!.]?/i,
    /dersimizi\s+bitirdik[!.]?/i,
    /dersi\s+tamamladık[!.]?/i,
    /ders\s+sona\s+erdi[!.]?/i,
  ];
  
  // Only mark as completed if we find an explicit completion pattern
  // AND it's not just a generic word in the middle of a sentence
  const contentLower = content.toLowerCase();
  const hasExplicitCompletion = explicitCompletionPatterns.some((pattern) => {
    const match = content.match(pattern);
    if (match) {
      // Make sure it's not part of a larger sentence that might be misleading
      const matchIndex = match.index || 0;
      const beforeMatch = content.substring(Math.max(0, matchIndex - 20), matchIndex);
      const afterMatch = content.substring(matchIndex + match[0].length, Math.min(content.length, matchIndex + match[0].length + 20));
      
      // If it's clearly a completion statement (ends with punctuation or at end of content)
      // and not part of a question or conditional
      const isQuestion = /[?]/.test(afterMatch.substring(0, 10));
      const isConditional = /eğer|if|when|ne zaman/i.test(beforeMatch);
      
      return !isQuestion && !isConditional;
    }
    return false;
  });
  
  if (hasExplicitCompletion) {
    isCompleted = true;
  }
  
  // Note: We do NOT check for generic words like "tebrikler" as they can appear
  // in the middle of a lesson and should not trigger completion

  // Parse CODE_BLOCK tags (multiline support)
  // Format: [CODE_BLOCK: language, code] or [CODE_BLOCK: language, code, editable, runnable]
  // Improved parsing to handle multi-line code and brackets in code
  const codeBlockTagRegex = /\[CODE_BLOCK:/gi;
  let codeBlockMatch;
  while ((codeBlockMatch = codeBlockTagRegex.exec(content)) !== null) {
    const tagStart = codeBlockMatch.index;
    const afterTagStart = tagStart + '[CODE_BLOCK:'.length;
    const afterTag = content.substring(afterTagStart);
    
    // Find language (until first comma, but handle spaces)
    const languageMatch = afterTag.match(/^\s*([^,]+?)\s*,\s*/s);
    if (!languageMatch) {
      // Invalid format, skip
      console.warn("[CODE_BLOCK] Invalid format - missing language:", afterTag.substring(0, 50));
      continue;
    }
    
    const language = languageMatch[1].trim();
    const afterLanguage = afterTag.substring(languageMatch[0].length);
    
    // Find the closing bracket by tracking bracket depth
    // Strategy: First find the closing bracket, then parse backwards from the end
    // This way, code content with commas (like function parameters) won't be mistaken for parameter separators
    let bracketDepth = 1; // We're inside [CODE_BLOCK: ... ]
    let closingBracketPos = -1;
    
    for (let pos = 0; pos < afterLanguage.length; pos++) {
      const char = afterLanguage[pos];
      
      if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        bracketDepth--;
        if (bracketDepth === 0) {
          closingBracketPos = pos;
          break;
        }
      }
    }
    
    if (closingBracketPos === -1) {
      console.error("[CODE_BLOCK] Invalid format - no closing bracket found");
      continue;
    }
    
    // Extract the content between language and closing bracket
    const contentBetween = afterLanguage.substring(0, closingBracketPos);
    
    // Now parse from the end backwards to find editable/runnable parameters
    // Strategy: Check if last parts are "true"/"false"/"editable"/"runnable"
    // If so, they are parameters; otherwise, everything is code
    // This way, code with commas (like "def topla(a, b)") won't be split incorrectly
    
    let code = contentBetween.trim();
    let editableStr = '';
    let runnableStr = '';
    
    // Valid parameter values
    const validParamValues = ['true', 'false', 'editable', 'runnable'];
    
    // Try to detect if there are editable/runnable parameters at the end
    // Look for patterns like: ", true", ", false", ", editable", ", runnable" at the end
    const trimmedContent = contentBetween.trim();
    
    // Check if the last part (after last comma) is a valid parameter value
    const lastCommaIndex = trimmedContent.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      const afterLastComma = trimmedContent.substring(lastCommaIndex + 1).trim().toLowerCase();
      
      if (validParamValues.includes(afterLastComma)) {
        // We have at least one parameter (runnable)
        runnableStr = afterLastComma;
        const beforeLastComma = trimmedContent.substring(0, lastCommaIndex).trim();
        
        // Check if there's another parameter before this one
        const secondLastCommaIndex = beforeLastComma.lastIndexOf(',');
        if (secondLastCommaIndex !== -1) {
          const afterSecondLastComma = beforeLastComma.substring(secondLastCommaIndex + 1).trim().toLowerCase();
          
          if (validParamValues.includes(afterSecondLastComma)) {
            // We have both editable and runnable
            editableStr = afterSecondLastComma;
            code = beforeLastComma.substring(0, secondLastCommaIndex).trim();
          } else {
            // Only runnable parameter, everything before is code
            code = beforeLastComma;
          }
        } else {
          // Only runnable parameter, everything before is code
          code = beforeLastComma;
        }
      } else {
        // Last part is not a parameter, everything is code
        code = contentBetween.trim();
      }
    } else {
      // No commas found, everything is code
      code = contentBetween.trim();
    }
    // Remove leading/trailing quotes if present
    code = code.replace(/^["']|["']$/g, '');
    // Replace escaped newlines
    code = code.replace(/\\n/g, '\n');
    
    const editable = editableStr.toLowerCase() === 'true' || editableStr.toLowerCase() === 'editable';
    const runnable = runnableStr.toLowerCase() === 'true' || runnableStr.toLowerCase() === 'runnable';
    const readonly = !editable;
    
    // Extract the full tag for removal
    const fullTagEnd = afterTagStart + closingBracketPos + 1; // +1 for the closing ]
    const fullTag = content.substring(tagStart, fullTagEnd);
    
    actions.push({
      type: "code_block",
      data: { language, code, editable, runnable, readonly },
    });
    cleanedContent = cleanedContent.replace(fullTag, "");
  }

  // Parse TEST_QUESTION tags
  const testQuestionRegex = /\[TEST_QUESTION:\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi;
  while ((match = testQuestionRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const optionA = match[2].trim();
    const optionB = match[3].trim();
    const optionC = match[4].trim();
    const optionD = match[5].trim();
    const correctIndex = parseInt(match[6].trim(), 10);
    
    if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "test_question",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [optionA, optionB, optionC, optionD],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse FILL_BLANK tags
  const fillBlankRegex = /\[FILL_BLANK:\s*([^,]+?),\s*((?:[^,\]]+?)(?:,\s*[^,\]]+?)*)\]/gi;
  while ((match = fillBlankRegex.exec(content)) !== null) {
    const code = match[1].trim();
    const blanksStr = match[2].trim();
    const blanks = blanksStr.split(',').map(b => b.trim()).filter(Boolean);
    
    actions.push({
      type: "fill_blank",
      data: { code, blanks },
    });
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse TIMED_BUGFIX tags
  const timedBugfixRegex = /\[TIMED_BUGFIX:\s*((?:[^,\]]|\[[^\]]+\])+?),\s*(\d+)\]/gis;
  while ((match = timedBugfixRegex.exec(content)) !== null) {
    let code = match[1].trim();
    code = code.replace(/\\n/g, '\n');
    const timeSeconds = parseInt(match[2].trim(), 10);
    
    if (!isNaN(timeSeconds) && timeSeconds > 0) {
      actions.push({
        type: "timed_bugfix",
        data: { code, timeSeconds },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  /**
   * Normalize option format: Remove "A)", "B)", etc. prefixes and keep just the text
   */
  function normalizeOption(option: string): string {
    // Remove patterns like "A)", "B)", "C)", "D)" at the start
    return option.replace(/^[A-D]\)\s*/i, '').trim();
  }

  /**
   * Try to fix malformed MINI_TEST content
   */
  function tryFixMiniTestContent(rawContent: string): string | null {
    // Pattern 1: Missing opening bracket, starts with "= " or similar
    // Example: "= 10, A) Listenin tüm elemanlarını değiştirir, B) İlk elemanı 10 ile değiştirir, C) Listeyi siler, D) Listeyi sıfırlar, 1]"
    const missingBracketPattern = /^=\s*([^,]+?),\s*(.+?),\s*(\d+)\]?$/;
    const match1 = rawContent.match(missingBracketPattern);
    if (match1) {
      // This looks like: "= question, A) option1, B) option2, C) option3, D) option4, index]"
      // We need to extract properly - this is tricky, let's try a different approach
      // Actually, this pattern might be too complex, let's handle it in the main parser
    }

    // Pattern 2: Content that looks like it should be a question but is malformed
    // Try to detect if it starts with a question-like pattern
    if (rawContent.includes('A)') && rawContent.includes('B)') && rawContent.includes('C)') && rawContent.includes('D)')) {
      // Has all options, might be fixable
      return rawContent;
    }

    return null;
  }

  /**
   * Parse MINI_TEST with improved error handling and auto-fix
   */
  function parseMiniTestTag(fullMatch: string, innerContent: string): boolean {
    let rawContent = innerContent.trim();
    
    // Try to fix malformed content first
    const fixedContent = tryFixMiniTestContent(rawContent);
    if (fixedContent && fixedContent !== rawContent) {
      rawContent = fixedContent;
    }

    // Handle missing closing bracket - look for content that ends with "]"
    // but might be missing from the tag itself
    let actualContent = rawContent;
    if (!rawContent.endsWith(']') && rawContent.includes(',')) {
      // Might be missing closing bracket, try to find where it should end
      // Look for pattern: question, A) ..., B) ..., C) ..., D) ..., index]
      const lastBracketIndex = content.indexOf(']', content.indexOf(fullMatch) + fullMatch.length);
      if (lastBracketIndex !== -1) {
        const extendedContent = content.substring(
          content.indexOf(fullMatch) + fullMatch.length - 1, // -1 to include the ]
          lastBracketIndex + 1
        );
        if (extendedContent.match(/^[^\]]+,\s*[A-D]\)/i)) {
          actualContent = extendedContent.slice(1, -1); // Remove the ] we added
        }
      }
    }

    // Try to parse by splitting on comma, but handle commas in text
    // Format: question, optionA, optionB, optionC, optionD, correctIndex
    // We know the last item is the index (single digit), and we need 4 options before it
    // So we split and take the last 5 items (4 options + 1 index)
    let parts = actualContent.split(',').map(p => p.trim()).filter(p => p.length > 0);
    
    // If we have fewer than 6 parts, try to detect malformed patterns
    if (parts.length < 6) {
      // Pattern: "= 10, A) option, B) option, C) option, D) option, 1]"
      // This might be parsed as: ["= 10", "A) option", "B) option", "C) option", "D) option", "1]"]
      // We need to handle this case
      
      // Check if first part starts with "=" and might be part of the question
      if (parts.length >= 5 && parts[0].startsWith('=')) {
        // Try to reconstruct: the "= 10" might be part of a question like "my_list[0] = 10"
        // Look for patterns like "A)", "B)", "C)", "D)" in the parts
        const optionPattern = /^[A-D]\)/i;
        let optionStartIndex = -1;
        for (let i = 0; i < parts.length; i++) {
          if (optionPattern.test(parts[i])) {
            optionStartIndex = i;
            break;
          }
        }
        
        if (optionStartIndex !== -1 && optionStartIndex + 4 < parts.length) {
          // We found where options start
          const questionParts = parts.slice(0, optionStartIndex);
          const optionA = normalizeOption(parts[optionStartIndex]);
          const optionB = normalizeOption(parts[optionStartIndex + 1]);
          const optionC = normalizeOption(parts[optionStartIndex + 2]);
          const optionD = normalizeOption(parts[optionStartIndex + 3]);
          const correctIndexStr = parts[optionStartIndex + 4].replace(/\]/g, '').trim();
          const question = questionParts.join(', ');
          
          const correctIndex = parseInt(correctIndexStr, 10);
          
          if (question && question.length > 0 && 
              optionA && optionA.length > 0 &&
              optionB && optionB.length > 0 &&
              optionC && optionC.length > 0 &&
              optionD && optionD.length > 0 &&
              !isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
            actions.push({
              type: "mini_test",
              data: {
                question: {
                  text: question,
                  type: "multiple_choice",
                  options: [optionA, optionB, optionC, optionD],
                  correctIndex,
                },
              },
            });
            cleanedContent = cleanedContent.replace(fullMatch, "");
            return true;
          }
        }
      }
      
      // Log error for insufficient parts
      console.error("[MINI_TEST] Invalid format detected - insufficient parts:", {
        rawContent: innerContent,
        actualContent: actualContent,
        partsCount: parts.length,
        expectedParts: 6,
        allParts: parts,
        fullMatch: fullMatch,
      });
      // Still remove the tag to avoid showing it in content
      cleanedContent = cleanedContent.replace(fullMatch, "");
      return false;
    }

    // Normal parsing path - we have at least 6 parts
    // The last 5 should be: optionA, optionB, optionC, optionD, index
    // Everything before that is the question (may contain commas)
    const correctIndexStr = parts[parts.length - 1].replace(/\]/g, '').trim();
    const optionD = normalizeOption(parts[parts.length - 2]);
    const optionC = normalizeOption(parts[parts.length - 3]);
    const optionB = normalizeOption(parts[parts.length - 4]);
    const optionA = normalizeOption(parts[parts.length - 5]);
    const question = parts.slice(0, parts.length - 5).join(', '); // Rejoin question parts that may have commas
    
    const correctIndex = parseInt(correctIndexStr, 10);
    
    // Validate all required fields
    if (question && question.length > 0 && 
        optionA && optionA.length > 0 &&
        optionB && optionB.length > 0 &&
        optionC && optionC.length > 0 &&
        optionD && optionD.length > 0 &&
        !isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "mini_test",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [optionA, optionB, optionC, optionD],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(fullMatch, "");
      return true;
    } else {
      // Invalid format - log detailed warning
      console.warn("[MINI_TEST] Invalid format detected - validation failed:", {
        rawContent: innerContent,
        actualContent: actualContent,
        partsCount: parts.length,
        question: question || "missing or empty",
        optionA: optionA || "missing or empty",
        optionB: optionB || "missing or empty",
        optionC: optionC || "missing or empty",
        optionD: optionD || "missing or empty",
        correctIndex: isNaN(correctIndex) ? "invalid" : correctIndex,
        allParts: parts,
      });
      // Still remove the tag to avoid showing it in content
      cleanedContent = cleanedContent.replace(fullMatch, "");
      return false;
    }
  }

  // Parse MINI_TEST tags - supports format: [MINI_TEST: soru, A, B, C, D, doğru_index]
  // Improved regex to handle commas in question text and options, including brackets in questions
  // Strategy: Match [MINI_TEST: and then find the matching closing bracket, handling nested brackets
  const miniTestTagStartRegex = /\[MINI_TEST:\s*/gi;
  let miniTestMatch;
  const processedMatches: string[] = [];
  
  while ((miniTestMatch = miniTestTagStartRegex.exec(content)) !== null) {
    const tagStart = miniTestMatch.index;
    const afterTagStart = tagStart + miniTestMatch[0].length;
    const afterTag = content.substring(afterTagStart);
    
    // Find the closing bracket by tracking bracket depth
    // This handles cases where the question contains brackets like "my_list[0]"
    let bracketDepth = 1; // We're inside [MINI_TEST: ... ]
    let closingBracketPos = -1;
    
    for (let pos = 0; pos < afterTag.length; pos++) {
      const char = afterTag[pos];
      
      if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        bracketDepth--;
        if (bracketDepth === 0) {
          closingBracketPos = pos;
          break;
        }
      }
    }
    
    if (closingBracketPos === -1) {
      // No closing bracket found - might be malformed
      // Try to find content that looks like it should be a MINI_TEST
      // Look for pattern: content ending with ", 0]" or ", 1]" etc. within reasonable distance
      const searchLimit = Math.min(afterTag.length, 500); // Search up to 500 chars
      const indexPattern = /,\s*([0-3])\s*\]/;
      const indexMatch = afterTag.substring(0, searchLimit).match(indexPattern);
      
      if (indexMatch) {
        // Found a potential closing pattern, use it
        closingBracketPos = (indexMatch.index || 0) + indexMatch[0].length - 1;
      } else {
        // Still no closing bracket, log and skip
        console.error("[MINI_TEST] Invalid format - no closing bracket found:", {
          tagStart,
          afterTagPreview: afterTag.substring(0, 100),
        });
        // Try to remove the malformed tag by finding the next reasonable end point
        // Look for end of line or next tag start
        const nextTagStart = content.indexOf('[', afterTagStart);
        const nextNewline = content.indexOf('\n', afterTagStart);
        const endPoint = nextTagStart !== -1 && nextNewline !== -1 
          ? Math.min(nextTagStart, nextNewline)
          : (nextTagStart !== -1 ? nextTagStart : (nextNewline !== -1 ? nextNewline : afterTagStart + 200));
        
        const malformedTag = content.substring(tagStart, endPoint);
        cleanedContent = cleanedContent.replace(malformedTag, "");
        continue;
      }
    }
    
    // Extract the full tag
    const fullTagEnd = afterTagStart + closingBracketPos + 1;
    const fullTag = content.substring(tagStart, fullTagEnd);
    
    // Skip if we've already processed this match
    if (processedMatches.includes(fullTag)) {
      continue;
    }
    processedMatches.push(fullTag);
    
    // Extract inner content
    const innerContent = afterTag.substring(0, closingBracketPos).trim();
    
    // Parse the tag
    parseMiniTestTag(fullTag, innerContent);
  }
  
  // Also try to catch malformed patterns that don't have [MINI_TEST: prefix
  // Pattern: "= 10, A) ..., B) ..., C) ..., D) ..., 1]"
  const malformedPattern = /=\s*([^,]+?),\s*([A-D]\)[^,]+?),\s*([A-D]\)[^,]+?),\s*([A-D]\)[^,]+?),\s*([A-D]\)[^,]+?),\s*([0-3])\s*\]/gi;
  let malformedMatch;
  while ((malformedMatch = malformedPattern.exec(content)) !== null) {
    // This looks like a malformed MINI_TEST
    const question = malformedMatch[1].trim();
    const optionA = normalizeOption(malformedMatch[2]);
    const optionB = normalizeOption(malformedMatch[3]);
    const optionC = normalizeOption(malformedMatch[4]);
    const optionD = normalizeOption(malformedMatch[5]);
    const correctIndex = parseInt(malformedMatch[6], 10);
    
    if (question && question.length > 0 && 
        optionA && optionA.length > 0 &&
        optionB && optionB.length > 0 &&
        optionC && optionC.length > 0 &&
        optionD && optionD.length > 0 &&
        !isNaN(correctIndex) && correctIndex >= 0 && correctIndex < 4) {
      actions.push({
        type: "mini_test",
        data: {
          question: {
            text: question,
            type: "multiple_choice",
            options: [optionA, optionB, optionC, optionD],
            correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(malformedMatch[0], "");
      console.warn("[MINI_TEST] Fixed malformed pattern (missing [MINI_TEST: prefix):", {
        original: malformedMatch[0].substring(0, 100),
        question,
      });
    }
  }

  // Parse CHOICES tags
  const choicesRegex = /\[CHOICES:\s*([^\]]+)\]/gi;
  while ((match = choicesRegex.exec(content)) !== null) {
    const choicesStr = match[1].trim();
    const choices = choicesStr.split(",").map((c) => c.trim()).filter(Boolean);
    
    if (choices.length > 0) {
      actions.push({
        type: "choices",
        data: { choices },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse IMAGE tags
  const imageRegex = /\[IMAGE:\s*([^\]]+)\]/gi;
  while ((match = imageRegex.exec(content)) !== null) {
    const searchQuery = match[1].trim();
    images.push(searchQuery);
    cleanedContent = cleanedContent.replace(match[0], "");
  }

  // Parse CREATE_LIVECODING tags
  const createLivecodingRegex = /\[CREATE_LIVECODING:\s*([^,]+?),\s*((?:[^,\]]|\[CODE_BLOCK:[^\]]+\])+?),\s*([^\]]+?)\]/gis;
  while ((match = createLivecodingRegex.exec(content)) !== null) {
    let title = match[1].trim();
    let description = match[2].trim();
    let language = match[3].trim().toLowerCase() as LiveCodingLanguage;
    
    if (["csharp", "python", "javascript", "java"].includes(language)) {
      actions.push({
        type: "create_livecoding",
        data: {
          task: {
            title,
            description,
            languages: [language],
            acceptanceCriteria: [],
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Parse CREATE_BUGFIX tags
  const createBugfixRegex = /\[CREATE_BUGFIX:\s*([^,]+?),\s*((?:[^,\]]|\[CODE_BLOCK:[^\]]+\])+?),\s*([^,]+?),\s*([^\]]+?)\]/gis;
  while ((match = createBugfixRegex.exec(content)) !== null) {
    let title = match[1].trim();
    let buggyCode = match[2].trim();
    let fixDescription = match[3].trim();
    let language = match[4].trim().toLowerCase() as LiveCodingLanguage;
    
    buggyCode = buggyCode.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1').trim();
    
    if (["csharp", "python", "javascript", "java"].includes(language)) {
      actions.push({
        type: "create_bugfix",
        data: {
          task: {
            title,
            buggyCode,
            fixDescription,
            language,
          },
        },
      });
      cleanedContent = cleanedContent.replace(match[0], "");
    }
  }

  // Clean up test question intro messages - remove common patterns
  // These patterns should be removed from content if they appear before or after MINI_TEST tags
  const testIntroPatterns = [
    /bilgini\s+test\s+edelim[!.]?/gi,
    /şimdi\s+mini\s+test\s+sorularına\s+geçelim[!.]?/gi,
    /ilk\s+mini\s+test\s+sorusuna\s+geçelim[!.:]?/gi,
    /ilk\s+soru\s+ile\s+başlayalım[!.:]?/gi,
    /mini\s+test\s+soruları[!.:]?/gi,
    /ikinci\s+soruya\s+bakalım[!.:]?/gi,
    /ve\s+üçüncü\s+sorumuz[!.:]?/gi,
    /cevaplarını\s+bekliyorum[!.]?/gi,
    /şimdi\s+birkaç\s+soru\s+çözelim[!.:]?/gi,
    /hadi\s+test\s+edelim[!.]?/gi,
  ];
  
  testIntroPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  // Clean up multiple newlines
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n').trim();

  return {
    content: cleanedContent,
    roadmap: extractedRoadmap || undefined,
    progress: extractedProgress,
    isCompleted,
    images: images.length > 0 ? images : undefined,
    actions: actions.length > 0 ? actions as any : undefined,
  };
}


