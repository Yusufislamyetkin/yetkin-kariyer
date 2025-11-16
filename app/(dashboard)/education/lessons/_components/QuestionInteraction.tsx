"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionType = "multiple_choice" | "open_ended";

type QuestionInteractionProps = {
  question: {
    text: string;
    type: QuestionType;
    options?: string[];
  };
  onAnswer: (answer: string) => void;
  onFeedback?: (feedback: string) => void;
  disabled?: boolean;
};

export function QuestionInteraction({
  question,
  onAnswer,
  onFeedback,
  disabled = false,
}: QuestionInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (disabled || submitted) return;

    const answer =
      question.type === "multiple_choice"
        ? question.options?.[selectedOption ?? -1] || ""
        : openAnswer.trim();

    if (!answer) return;

    setLoading(true);
    setSubmitted(true);

    try {
      onAnswer(answer);
      
      // If feedback callback is provided, call it
      if (onFeedback) {
        // Simulate feedback generation
        const feedback = question.type === "multiple_choice"
          ? "Cevabın alındı! Devam ediyoruz..."
          : "Cevabını inceliyorum...";
        
        setTimeout(() => {
          onFeedback(feedback);
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setLoading(false);
      setSubmitted(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400">🤔 Soru</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-900 dark:text-gray-100 font-medium">
          {question.text}
        </p>

        {question.type === "multiple_choice" && question.options ? (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isDisabled = disabled || submitted;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !isDisabled && setSelectedOption(index)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 text-gray-900 dark:text-gray-100",
                    isDisabled && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected
                          ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            disabled={disabled || submitted}
            placeholder="Cevabını buraya yaz..."
            rows={4}
            className={cn(
              "w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
              (disabled || submitted) && "opacity-60 cursor-not-allowed"
            )}
          />
        )}

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={
              disabled ||
              loading ||
              (question.type === "multiple_choice"
                ? selectedOption === null
                : !openAnswer.trim())
            }
            className="w-full gap-2"
            variant="gradient"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Cevabı Gönder
              </>
            )}
          </Button>
        )}

        {submitted && !loading && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Cevabın alındı!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
