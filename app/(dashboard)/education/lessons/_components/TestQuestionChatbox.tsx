"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestQuestion {
  text?: string;
  question?: string;
  options?: string[];
  type?: string;
}

interface TestQuestionChatboxProps {
  question: TestQuestion | string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TestQuestionChatbox({
  question,
  onAnswer,
  disabled = false,
  className,
}: TestQuestionChatboxProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Normalize question data - handle nested question structure
  // Expected structure from parser: { question: { text: "...", options: [...], type: "multiple_choice", correctIndex: ... } }
  const questionData: TestQuestion = (() => {
    if (typeof question === "string") {
      console.warn("[TestQuestionChatbox] Question is a string, expected object:", question);
      return { text: question, options: [] };
    }
    
    if (!question || typeof question !== "object") {
      console.error("[TestQuestionChatbox] Invalid question prop type:", typeof question, question);
      return { text: "", options: [] };
    }
    
    // Check if question has nested structure (from mini_test action)
    // This is the expected structure: { question: { text: "...", options: [...], type: "multiple_choice" } }
    if (question.question && typeof question.question === "object" && !Array.isArray(question.question)) {
      const nestedQuestion = question.question as any;
      const normalized = {
        text: nestedQuestion.text || nestedQuestion.question || "",
        options: Array.isArray(nestedQuestion.options) 
          ? nestedQuestion.options
              .map((opt: any, idx: number) => {
                // Handle various option formats
                if (typeof opt === "string") return opt.trim();
                if (opt && typeof opt === "object" && opt.text) return opt.text.trim();
                if (opt && typeof opt === "object" && opt.label) return opt.label.trim();
                console.warn(`[TestQuestionChatbox] Invalid option at index ${idx}:`, opt);
                return null;
              })
              .filter((opt: any): opt is string => opt !== null && opt.length > 0)
          : [],
        type: nestedQuestion.type || (question as any).type || "multiple_choice",
      };
      
      // Enhanced debug logging
      if (!normalized.text || normalized.text.trim().length === 0) {
        console.error("[TestQuestionChatbox] Missing question text in nested structure:", {
          rawQuestion: question,
          nestedQuestion: nestedQuestion,
          normalized: normalized,
        });
      }
      if (normalized.options.length < 4) {
        console.warn("[TestQuestionChatbox] Insufficient options in nested structure:", {
          expected: 4,
          actual: normalized.options.length,
          options: normalized.options,
          nestedQuestion: nestedQuestion,
        });
      }
      
      return normalized;
    }
    
    // Direct structure (fallback - in case data comes in different format)
    const directNormalized = {
      text: (question as any).text || 
            ((question as any).question && typeof (question as any).question === "string" ? (question as any).question : "") || 
            "",
      options: Array.isArray((question as any).options) 
        ? (question as any).options
            .map((opt: any, idx: number) => {
              if (typeof opt === "string") return opt.trim();
              if (opt && typeof opt === "object" && opt.text) return opt.text.trim();
              if (opt && typeof opt === "object" && opt.label) return opt.label.trim();
              console.warn(`[TestQuestionChatbox] Invalid option at index ${idx} in direct structure:`, opt);
              return null;
            })
            .filter((opt: any): opt is string => opt !== null && opt.length > 0)
        : [],
      type: (question as any).type || "multiple_choice",
    };
    
    // Enhanced debug logging
    if (!directNormalized.text || directNormalized.text.trim().length === 0) {
      console.error("[TestQuestionChatbox] Missing question text in direct structure:", {
        rawQuestion: question,
        normalized: directNormalized,
      });
    }
    if (directNormalized.options.length < 4) {
      console.warn("[TestQuestionChatbox] Insufficient options in direct structure:", {
        expected: 4,
        actual: directNormalized.options.length,
        options: directNormalized.options,
        rawQuestion: question,
      });
    }
    
    return directNormalized;
  })();

  const questionText = questionData.text?.trim() || "";
  const options = questionData.options || [];
  const isMiniTest = questionData.type === "mini_test" || questionData.type === "multiple_choice";
  const hasValidOptions = options.length >= 4; // Mini test requires 4 options
  const hasQuestionText = questionText.length > 0;
  const hasPartialOptions = options.length > 0 && options.length < 4;
  
  // Show error state if critical data is missing
  const hasCriticalError = !hasQuestionText && options.length === 0;

  const handleOptionClick = (index: number, option: string) => {
    if (disabled || isSubmitted) return;
    setSelectedOption(index);
    setIsSubmitted(true);
    onAnswer(option);
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:border-purple-900/40 dark:from-purple-950/30 dark:via-gray-900/50 dark:to-purple-950/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            {isMiniTest ? "Mini Test Sorusu" : "Test Sorusu"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Critical Error State */}
          {hasCriticalError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ Kritik Hata: Test sorusu verisi eksik veya hatalı formatlanmış.
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-2">
                Lütfen AI öğretmene bildirin. Soru metni ve seçenekler bulunamadı.
              </p>
              <details className="mt-2 text-xs text-red-500 dark:text-red-400">
                <summary className="cursor-pointer">Debug Bilgisi</summary>
                <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs overflow-auto">
                  {JSON.stringify(question, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Question Text */}
          {hasQuestionText && (
            <div className="p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-purple-100 dark:border-purple-900/30">
              <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                {questionText}
              </p>
            </div>
          )}

          {/* Missing Question Text Warning */}
          {!hasQuestionText && !hasCriticalError && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                ⚠️ Soru metni bulunamadı.
              </p>
            </div>
          )}

          {/* Options */}
          {hasValidOptions ? (
            <div className="space-y-3">
              {options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedOption === index;
                const isDisabled = disabled || isSubmitted;

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index, option)}
                    disabled={isDisabled}
                    className={cn(
                      "w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all duration-200 group",
                      isSelected
                        ? "border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      isDisabled && !isSelected && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Option Letter Badge */}
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all",
                          isSelected
                            ? "bg-purple-600 text-white shadow-lg scale-110"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"
                        )}
                      >
                        {optionLetter}
                      </div>

                      {/* Option Text */}
                      <span
                        className={cn(
                          "flex-1 font-medium text-sm",
                          isSelected
                            ? "text-purple-900 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {option}
                      </span>

                      {/* Check Icon */}
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : hasPartialOptions ? (
            // Show partial options if available (even if less than 4)
            <div className="space-y-3">
              {options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedOption === index;
                const isDisabled = disabled || isSubmitted;

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index, option)}
                    disabled={isDisabled}
                    className={cn(
                      "w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all duration-200 group",
                      isSelected
                        ? "border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      isDisabled && !isSelected && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all",
                          isSelected
                            ? "bg-purple-600 text-white shadow-lg scale-110"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"
                        )}
                      >
                        {optionLetter}
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-medium text-sm",
                          isSelected
                            ? "text-purple-900 dark:text-purple-100"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ Eksik seçenekler: {options.length}/4 seçenek mevcut. Lütfen AI öğretmene bildirin.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ Bu test sorusu için seçenekler eksik. Lütfen AI öğretmene bildirin.
              </p>
              {options.length > 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-2">
                  Mevcut seçenekler: {options.length} adet (4 adet olmalı)
                </p>
              )}
              {options.length === 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-2">
                  Hiç seçenek bulunamadı. Test sorusu formatı hatalı olabilir.
                </p>
              )}
            </div>
          )}

          {/* Status Message */}
          {isSubmitted && selectedOption !== null && (
            <div className="pt-2">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium text-center">
                ✓ Cevabınız seçildi: {String.fromCharCode(65 + selectedOption)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


