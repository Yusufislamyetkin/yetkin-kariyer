'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

type MiniTestQuestion = {
  id: string;
  question: string;
  options: string[];
};

type MiniTestPayload = {
  id: string;
  title: string;
  description?: string | null;
  passingScore: number;
  lessonSlug: string;
  questionCount: number;
  questions: MiniTestQuestion[];
};

type MiniTestProgress = {
  attemptCount: number;
  lastAttempt: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    createdAt: string | Date;
    passed: boolean;
  } | null;
  completion: {
    score: number | null;
    passed: boolean;
    completedAt: string | Date | null;
  } | null;
} | null;

type MiniTestSubmission = {
  attempt: {
    id: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    createdAt: string;
  };
  completion: {
    passed: boolean;
    completedAt: string | null;
    score: number | null;
  };
  feedback: Array<{
    id: string;
    question: string;
    options: string[];
    selectedIndex: number;
    correctIndex: number | null;
    isCorrect: boolean;
    explanation: string | null;
  }>;
  passingScore: number;
};

type MiniTestStatusEvent = {
  passed: boolean;
};

type LessonMiniTestProps = {
  lessonSlug: string;
  lessonTitle: string;
  onStatusChange?: (event: MiniTestStatusEvent) => void;
};

function buildMiniTestApiPath(lessonSlug: string) {
  const prefix = "/education/lessons";
  const normalized = lessonSlug.startsWith(prefix)
    ? lessonSlug.slice(prefix.length)
    : lessonSlug;
  return `/api/lessons${normalized}/mini-test`;
}

export function LessonMiniTest({
  lessonSlug,
  lessonTitle,
  onStatusChange,
}: LessonMiniTestProps) {
  const [loading, setLoading] = useState(true);
  const [miniTest, setMiniTest] = useState<MiniTestPayload | null>(null);
  const [progress, setProgress] = useState<MiniTestProgress>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MiniTestSubmission | null>(null);
  const [miniTestPassed, setMiniTestPassed] = useState(false);

  const apiPath = useMemo(() => buildMiniTestApiPath(lessonSlug), [lessonSlug]);

  useEffect(() => {
    let isMounted = true;

    async function loadMiniTest() {
      setLoading(true);
      setLoadingError(null);
      try {
        const response = await fetch(apiPath, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const message =
            (errorBody?.error as string | undefined) ??
            "Mini test yüklenemedi.";
          throw new Error(message);
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }

        const fetchedMiniTest = data.miniTest as MiniTestPayload;
        const fetchedProgress = (data.progress ?? null) as MiniTestProgress;

        setMiniTest(fetchedMiniTest);
        setProgress(fetchedProgress);
        setSelectedAnswers(
          new Array(fetchedMiniTest.questionCount).fill(-1)
        );

        const alreadyPassed = Boolean(fetchedProgress?.completion?.passed);
        setMiniTestPassed(alreadyPassed);
        onStatusChange?.({ passed: alreadyPassed });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setLoadingError(
          error instanceof Error ? error.message : "Mini test yüklenemedi."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadMiniTest();

    return () => {
      isMounted = false;
    };
  }, [apiPath, onStatusChange]);

  const handleSelectAnswer = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setSelectedAnswers((prev) => {
        const next = [...prev];
        next[questionIndex] = optionIndex;
        return next;
      });
      setSubmissionError(null);
    },
    []
  );

  const handleReset = useCallback(() => {
    if (!miniTest) {
      return;
    }
    setSelectedAnswers(new Array(miniTest.questionCount).fill(-1));
    setResult(null);
    setSubmissionError(null);
  }, [miniTest]);

  const handleSubmit = useCallback(async () => {
    if (!miniTest) {
      return;
    }
    if (selectedAnswers.some((value) => value < 0)) {
      setSubmissionError("Lütfen tüm sorular için bir seçenek işaretleyin.");
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
          (errorBody?.error as string | undefined) ??
          "Mini test gönderilirken bir hata oluştu.";
        throw new Error(message);
      }

      const submission = (await response.json()) as MiniTestSubmission;
      setResult(submission);

      setProgress((prev) => ({
        attemptCount: (prev?.attemptCount ?? 0) + 1,
        lastAttempt: {
          score: submission.attempt.score,
          correctCount: submission.attempt.correctCount,
          totalQuestions: submission.attempt.totalQuestions,
          createdAt: submission.attempt.createdAt,
          passed: submission.attempt.passed,
        },
        completion: submission.completion,
      }));

      setMiniTestPassed(submission.completion.passed);
      onStatusChange?.({ passed: submission.completion.passed });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Mini test gönderilirken bir hata oluştu."
      );
    } finally {
      setSubmitting(false);
    }
  }, [apiPath, miniTest, onStatusChange, selectedAnswers]);

  if (loading) {
    return (
      <Card variant="elevated" className="border-blue-100 bg-blue-50/60">
        <CardContent className="flex items-center gap-3 px-5 py-6 text-sm text-blue-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          Mini test yükleniyor...
        </CardContent>
      </Card>
    );
  }

  if (loadingError || !miniTest) {
    return (
      <Card variant="elevated" className="border-amber-100 bg-amber-50/70">
        <CardContent className="space-y-2 px-5 py-6 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold">
            <XCircle className="h-4 w-4" />
            Mini test hazır değil
          </div>
          <p>{loadingError ?? "Bu ders için mini test henüz yayınlanmadı."}</p>
        </CardContent>
      </Card>
    );
  }

  const attemptInfo = progress?.lastAttempt;
  const completionInfo = progress?.completion;

  return (
    <div className="space-y-6">
      <Card variant="outlined" className="border-blue-200 bg-blue-50/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold text-blue-900">
            <span>Mini Test: {miniTest.title}</span>
            {miniTestPassed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Tamamlandı
              </span>
            ) : (
              <span className="text-xs font-medium text-blue-600">
                Minimum başarı: %{miniTest.passingScore}
              </span>
            )}
          </CardTitle>
          {miniTest.description && (
            <p className="text-sm text-blue-800">{miniTest.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                Soru sayısı
              </span>
              <span className="text-sm font-semibold">
                {miniTest.questionCount}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                Dene, öğren
              </span>
              <span className="text-sm font-semibold">
                {progress?.attemptCount ?? 0} deneme
              </span>
            </div>
            {attemptInfo && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-blue-800">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Son skor
                </span>
                <span className="text-sm font-semibold">
                  %{attemptInfo.score}
                </span>
              </div>
            )}
          </div>
          {completionInfo?.passed && (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Bu mini testi başarıyla tamamladın. Dilersen soruları yeniden
              çözerek kendini test etmeye devam edebilirsin.
            </p>
          )}
        </CardContent>
      </Card>

      {result ? (
        <Card variant="elevated" className="border-emerald-200 bg-emerald-50/70">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg text-emerald-900">
              {result.attempt.passed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-600" />
              )}
              %{result.attempt.score} -{" "}
              {result.attempt.passed
                ? "Mini test başarıyla tamamlandı"
                : "Hedefi geçemedin"}
            </CardTitle>
            <p className="text-sm text-emerald-900">
              Doğru cevap: {result.attempt.correctCount} /{" "}
              {result.attempt.totalQuestions}.{" "}
              {result.attempt.passed
                ? "Dersi tamamlandı olarak işaretleyebilirsin."
                : `Başarılı olmak için en az %{result.passingScore} skor gerekir.`}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {result.feedback.map((feedback, index) => {
                const isCorrect = feedback.isCorrect;
                const hasAnswer = feedback.selectedIndex >= 0;
                const correctLabel =
                  typeof feedback.correctIndex === "number"
                    ? feedback.options[feedback.correctIndex]
                    : null;
                const selectedLabel =
                  hasAnswer && feedback.selectedIndex < feedback.options.length
                    ? feedback.options[feedback.selectedIndex]
                    : null;

                return (
                  <div
                    key={feedback.id}
                    className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                          Soru {index + 1}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {feedback.question}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isCorrect ? "Doğru" : "Yanlış"}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-gray-600">
                      {hasAnswer ? (
                        <p>
                          <span className="font-semibold text-gray-700">
                            Seçimin:
                          </span>{" "}
                          {selectedLabel ?? "Belirsiz seçim"}
                        </p>
                      ) : (
                        <p className="font-semibold text-amber-600">
                          Bu soruda seçim yapılmadı.
                        </p>
                      )}
                      {correctLabel && (
                        <p>
                          <span className="font-semibold text-gray-700">
                            Doğru cevap:
                          </span>{" "}
                          {correctLabel}
                        </p>
                      )}
                    </div>
                    {feedback.explanation && (
                      <p className="mt-2 text-xs text-emerald-700">
                        {feedback.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {!result.attempt.passed && (
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-4 w-4" />
                  Yeniden dene
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                className="gap-2"
                onClick={handleReset}
              >
                Soruları yeniden çöz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              {lessonTitle} mini testini çöz
            </CardTitle>
            <p className="text-sm text-gray-600">
              Soruları yanıtlayarak dersin kazanımlarını doğrula. Tüm
              seçenekleri işaretledikten sonra cevaplarını gönder.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              {miniTest.questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Soru {questionIndex + 1}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {question.question}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const checked = selectedAnswers[questionIndex] === optionIndex;
                      return (
                        <label
                          key={`${question.id}-option-${optionIndex}`}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition ${
                            checked
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-blue-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${question.id}-options`}
                            value={optionIndex}
                            checked={checked}
                            onChange={() =>
                              handleSelectAnswer(questionIndex, optionIndex)
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {submissionError && (
              <p className="text-sm font-semibold text-amber-600">
                {submissionError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="gap-2"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Cevapları gönder
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={submitting}
              >
                İşaretlemeleri temizle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


