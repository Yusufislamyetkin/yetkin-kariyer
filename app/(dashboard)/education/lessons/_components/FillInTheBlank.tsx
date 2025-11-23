"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";

type FillInTheBlankProps = {
  code: string;
  blanks: string[];
  onComplete: (answers: string[]) => void;
  onSkip?: () => void;
};

export function FillInTheBlank({ code, blanks, onComplete, onSkip }: FillInTheBlankProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(blanks.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Replace blanks in code with input fields
  const renderCodeWithBlanks = () => {
    const parts: Array<{ type: "text" | "input"; content: string; index?: number }> = [];
    let remainingCode = code;
    let blankIndex = 0;

    // Try to find blanks in the code - look for common patterns like ___, ???, or explicit blank markers
    const blankPatterns = [
      /___/g,
      /\?\?\?/g,
      /\[BLANK\]/gi,
      /<blank>/gi,
    ];

    // If code doesn't have explicit markers, we'll insert them at strategic points
    if (!blankPatterns.some(pattern => pattern.test(remainingCode))) {
      // Split by lines and add blanks at the end of each line that looks incomplete
      const lines = remainingCode.split('\n');
      const processedLines: string[] = [];
      
      lines.forEach((line, lineIndex) => {
        processedLines.push(line);
        // Add blank after lines that end with certain patterns
        if (line.trim().endsWith('=') || line.trim().endsWith(':') || 
            (lineIndex < blanks.length && blankIndex < blanks.length)) {
          processedLines.push(`___BLANK_${blankIndex}___`);
          blankIndex++;
        }
      });
      
      remainingCode = processedLines.join('\n');
    }

    // Now parse the code with blank markers
    let currentPos = 0;
    blankIndex = 0;

    while (currentPos < remainingCode.length && blankIndex < blanks.length) {
      // Look for blank markers
      const blankMarker = `___BLANK_${blankIndex}___`;
      const blankPos = remainingCode.indexOf(blankMarker, currentPos);
      
      if (blankPos === -1) {
        // No more blanks found, add remaining text
        if (currentPos < remainingCode.length) {
          parts.push({ type: "text", content: remainingCode.substring(currentPos) });
        }
        break;
      }

      // Add text before blank
      if (blankPos > currentPos) {
        parts.push({ type: "text", content: remainingCode.substring(currentPos, blankPos) });
      }

      // Add input field
      parts.push({ type: "input", content: "", index: blankIndex });
      blankIndex++;
      currentPos = blankPos + blankMarker.length;
    }

    // Add remaining text
    if (currentPos < remainingCode.length) {
      parts.push({ type: "text", content: remainingCode.substring(currentPos) });
    }

    return parts;
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = useCallback(() => {
    if (answers.some((a) => !a.trim())) {
      return;
    }
    setIsSubmitted(true);
    onComplete(answers);
  }, [answers, onComplete]);

  const parts = renderCodeWithBlanks();
  let inputIndex = 0;

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900/40 dark:bg-purple-950/30 mb-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Boşluk Doldurma
        </h3>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Aşağıdaki kodda boşlukları doldurun:
        </p>

        <div className="mb-4 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg font-mono text-sm">
          {parts.map((part, idx) => {
            if (part.type === "text") {
              return (
                <span key={idx} className="text-gray-100">
                  {part.content}
                </span>
              );
            } else {
              const currentInputIndex = inputIndex++;
              return (
                <input
                  key={idx}
                  type="text"
                  value={answers[part.index!]}
                  onChange={(e) => handleAnswerChange(part.index!, e.target.value)}
                  className="inline-block mx-1 px-2 py-1 bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-gray-100 border-2 border-yellow-400 dark:border-yellow-600 rounded min-w-[80px] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="?"
                  disabled={isSubmitted}
                />
              );
            }
          })}
        </div>

        {!isSubmitted ? (
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={answers.some((a) => !a.trim())}
              className="flex-1"
            >
              Kontrol Et
            </Button>
            {onSkip && (
              <Button onClick={onSkip} variant="outline">
                Geç
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Cevaplarınız gönderildi! AI öğretmen değerlendirecek.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

