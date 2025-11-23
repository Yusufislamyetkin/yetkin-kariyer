"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CodeBlock } from "./CodeBlock";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

type TimedBugfixProps = {
  code: string;
  timeSeconds: number;
  onComplete: (success: boolean, timeSpent: number) => void;
  onSkip?: () => void;
};

export function TimedBugfix({ code, timeSeconds, onComplete, onSkip }: TimedBugfixProps) {
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          onComplete(false, timeSpent);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isCompleted, startTime, onComplete]);

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim()) return;
    
    setIsRunning(false);
    setIsCompleted(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    // For now, we'll consider it successful if user provided an answer
    // In a real implementation, you'd validate the answer
    onComplete(true, timeSpent);
  }, [userAnswer, startTime, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/40 dark:bg-orange-950/30 mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Zamanlı Hata Bulma
          </h3>
          <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Aşağıdaki kodda bir hata var. Zaman dolmadan hatayı bul ve açıkla!
        </p>

        <div className="mb-4">
          <CodeBlock code={code} language="text" />
        </div>

        {!isCompleted ? (
          <div className="space-y-3">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Hatayı buraya yazın..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[100px]"
              disabled={!isRunning}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || !isRunning}
                className="flex-1"
              >
                Cevabı Gönder
              </Button>
              {onSkip && (
                <Button
                  onClick={onSkip}
                  variant="outline"
                  disabled={!isRunning}
                >
                  Geç
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {timeLeft === 0
                ? "⏰ Süre doldu! Daha hızlı olmaya çalışın."
                : "✅ Cevabınız alındı! AI öğretmen değerlendirecek."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

