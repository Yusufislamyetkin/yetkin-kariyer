import type { LiveCodingLanguage } from "@/types/live-coding";
import { validateMiniTestAction } from "@/lib/ai/mini-test-validator";

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
      
      const shouldAccept = !isQuestion && !isConditional;
      
      if (shouldAccept) {
        console.log("[LESSON-ACTION-PARSER] Completion phrase detected:", {
          matched: match[0],
          pattern: pattern.toString(),
          beforeMatch: beforeMatch.substring(Math.max(0, beforeMatch.length - 10)),
          afterMatch: afterMatch.substring(0, 10),
        });
      } else {
        console.log("[LESSON-ACTION-PARSER] Completion phrase found but rejected:", {
          matched: match[0],
          reason: isQuestion ? "question detected" : "conditional detected",
          beforeMatch: beforeMatch.substring(Math.max(0, beforeMatch.length - 10)),
          afterMatch: afterMatch.substring(0, 10),
        });
      }
      
      return shouldAccept;
    }
    return false;
  });
  
  if (hasExplicitCompletion) {
    isCompleted = true;
    console.log("[LESSON-ACTION-PARSER] Lesson marked as completed via explicit completion phrase");
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
   * Parse MINI_TEST tag - simplified version that only handles standard format
   * Format: [MINI_TEST: soru, A, B, C, D, doğru_index]
   */
  function parseMiniTestTag(fullMatch: string, innerContent: string): boolean {
    const rawContent = innerContent.trim();
    
    // Split by comma - last 5 items should be: optionA, optionB, optionC, optionD, index
    // Everything before that is the question (may contain commas)
    const parts = rawContent.split(',').map(p => p.trim()).filter(p => p.length > 0);
    
    // Need at least 6 parts (question + 4 options + 1 index)
    if (parts.length < 6) {
      console.error("[MINI_TEST] Invalid format - insufficient parts:", {
        rawContent: innerContent,
        partsCount: parts.length,
        expectedParts: 6,
        fullMatch: fullMatch.substring(0, 150),
      });
      cleanedContent = cleanedContent.replace(fullMatch, "");
      return false;
    }

    // Extract: last 5 items are options + index, rest is question
    const correctIndexStr = parts[parts.length - 1].replace(/\]/g, '').trim();
    const optionD = normalizeOption(parts[parts.length - 2]);
    const optionC = normalizeOption(parts[parts.length - 3]);
    const optionB = normalizeOption(parts[parts.length - 4]);
    const optionA = normalizeOption(parts[parts.length - 5]);
    const question = parts.slice(0, parts.length - 5).join(', '); // Rejoin question parts that may have commas
    
    const correctIndex = parseInt(correctIndexStr, 10);
    
    // Build action data structure
    const actionData = {
      question: {
        text: question,
        type: "multiple_choice",
        options: [optionA, optionB, optionC, optionD],
        correctIndex,
      },
    };

    // Validate using the validator
    const validationResult = validateMiniTestAction(actionData);
    
    if (validationResult.isValid && validationResult.data) {
      // Use validated data
      actions.push({
        type: "mini_test",
        data: {
          question: {
            text: validationResult.data.question,
            type: "multiple_choice",
            options: validationResult.data.options,
            correctIndex: validationResult.data.correctIndex,
          },
        },
      });
      cleanedContent = cleanedContent.replace(fullMatch, "");
      return true;
    } else {
      // Invalid format - log error and remove tag
      console.error("[MINI_TEST] Invalid format - validation failed:", {
        rawContent: innerContent,
        partsCount: parts.length,
        validationErrors: validationResult.errors,
        fullMatch: fullMatch.substring(0, 150),
      });
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
  const seenQuestionKeys = new Set<string>();
  
  // Helper function to generate a unique key for a question (used for duplicate detection)
  const getQuestionKeyFromTag = (innerContent: string): string | null => {
    try {
      const parts = innerContent.split(',').map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length < 6) return null;
      
      const optionD = normalizeOption(parts[parts.length - 2]);
      const optionC = normalizeOption(parts[parts.length - 3]);
      const optionB = normalizeOption(parts[parts.length - 4]);
      const optionA = normalizeOption(parts[parts.length - 5]);
      const question = parts.slice(0, parts.length - 5).join(', ').trim().toLowerCase();
      const options = [optionA, optionB, optionC, optionD]
        .map(opt => opt.trim().toLowerCase())
        .filter(Boolean)
        .sort()
        .join("|");
      
      return `${question}::${options}`;
    } catch {
      return null;
    }
  };
  
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
      // No closing bracket found - invalid format, skip this tag
      console.error("[MINI_TEST] Invalid format - no closing bracket found:", {
        tagStart,
        afterTagPreview: afterTag.substring(0, 100),
      });
      continue;
    }
    
    // Extract the full tag
    const fullTagEnd = afterTagStart + closingBracketPos + 1;
    const fullTag = content.substring(tagStart, fullTagEnd);
    
    // Skip if we've already processed this exact tag
    if (processedMatches.includes(fullTag)) {
      continue;
    }
    
    // Extract inner content
    const innerContent = afterTag.substring(0, closingBracketPos).trim();
    
    // Check for duplicate questions based on content (not just tag string)
    const questionKey = getQuestionKeyFromTag(innerContent);
    if (questionKey && seenQuestionKeys.has(questionKey)) {
      console.warn("[MINI_TEST] Duplicate question detected and skipped:", {
        questionKey: questionKey.substring(0, 100),
        tagPreview: fullTag.substring(0, 150),
      });
      continue; // Skip this duplicate question
    }
    
    // Mark this tag and question as processed
    processedMatches.push(fullTag);
    if (questionKey) {
      seenQuestionKeys.add(questionKey);
    }
    
    // Parse the tag
    parseMiniTestTag(fullTag, innerContent);
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


