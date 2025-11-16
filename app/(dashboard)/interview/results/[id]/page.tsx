/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  RefreshCcw,
  Loader2,
  Sparkles,
  Download,
  ClipboardList,
  CheckCircle,
  Calendar,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface InterviewAttempt {
  id: string;
  videoUrl: string | null;
  transcript: string | null;
  aiScore: number | null;
  aiFeedback: any;
  questionScores?: Record<string, number> | null;
  questionFeedback?: Record<string, any> | null;
  questionCorrectness?: Record<string, any> | null;
  completedAt: string;
  screenRecordingUrl?: string | null;
  interview: {
    id: string;
    title: string;
    description: string | null;
    questions?: any;
  };
}

interface AIInterviewFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  actionItems: string[];
  categories: {
    fluency: number;
    content: number;
    professionalism: number;
    relevance: number;
  };
}

export default function InterviewResultsPage() {
  const params = useParams();
  const [attempt, setAttempt] = useState<InterviewAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIInterviewFeedback | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [parsedTranscript, setParsedTranscript] = useState<Record<string, any> | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [questionScores, setQuestionScores] = useState<Record<string, number> | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, any> | null>(null);
  const [questionCorrectness, setQuestionCorrectness] = useState<Record<string, any> | null>(null);
  const [questions, setQuestions] = useState<Array<{ id: string; question?: string; prompt?: string; type?: string }>>([]);

  const normalizeFeedback = (feedback: any): AIInterviewFeedback | null => {
    if (!feedback || typeof feedback !== "object") {
      return null;
    }

    const categories = feedback.categories ?? {};

    return {
      summary: feedback.summary ?? feedback.overall ?? "",
      strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
      improvements: Array.isArray(feedback.improvements)
        ? feedback.improvements
        : feedback.weaknesses ?? [],
      actionItems: Array.isArray(feedback.actionItems)
        ? feedback.actionItems
        : feedback.recommendations ?? [],
      categories: {
        fluency: Number(categories.fluency) || 0,
        content: Number(categories.content) || 0,
        professionalism: Number(categories.professionalism) || 0,
        relevance: Number(categories.relevance) || 0,
      },
    };
  };

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const parseTranscript = (value: string | null): Record<string, any> | null => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, any>) : null;
    } catch {
      return null;
    }
  };

  const updateTranscriptState = (value: string | null) => {
    const parsed = parseTranscript(value);
    setParsedTranscript(parsed);
    if (parsed && typeof parsed.content === "string") {
      setTranscript(parsed.content);
    } else {
      setTranscript(value);
    }
  };

  const handleDownloadTranscript = () => {
    if (!transcript) return;

    const blob = new Blob([transcript], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      attempt?.interview.title?.replace(/\s+/g, "-").toLowerCase() ?? "mulakat"
    }-transkript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateAnalysis = async () => {
    if (!attempt) return;
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      const response = await fetch("/api/ai/analyze-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewAttemptId: attempt.id, force: true }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI analizi oluşturulamadı");
      }

      setAnalysis(normalizeFeedback(data.analysis.feedback));
      setScore(data.analysis.score ?? null);
      updateTranscriptState(data.analysis.transcript ?? null);
      setQuestionScores(data.analysis.questionScores ?? null);
      setQuestionFeedback(data.analysis.questionFeedback ?? null);
      setQuestionCorrectness(data.analysis.questionCorrectness ?? null);
    } catch (error) {
      console.error("Error generating interview analysis:", error);
      setAnalysisError(
        error instanceof Error ? error.message : "AI analizi gerçekleştirilemedi."
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const categoryLabels: Record<
    keyof AIInterviewFeedback["categories"],
    string
  > = {
    fluency: "Konuşma Akıcılığı",
    content: "Cevap İçeriği",
    professionalism: "Profesyonellik",
    relevance: "Soruya Uygunluk",
  };

  useEffect(() => {
    if (params.id) {
      fetchResults();
    }
  }, [params.id]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/interview/results/${params.id}`);
      const data = await response.json();
      setAttempt(data.attempt);
      setAnalysis(normalizeFeedback(data.attempt?.aiFeedback));
      setScore(data.attempt?.aiScore ?? null);
      updateTranscriptState(data.attempt?.transcript ?? null);
      
      // Soru bazlı sonuçları yükle
      setQuestionScores(data.attempt?.questionScores ?? null);
      setQuestionFeedback(data.attempt?.questionFeedback ?? null);
      setQuestionCorrectness(data.attempt?.questionCorrectness ?? null);
      
      // Soruları parse et
      if (data.attempt?.interview?.questions) {
        try {
          const parsedQuestions = typeof data.attempt.interview.questions === "string"
            ? JSON.parse(data.attempt.interview.questions)
            : data.attempt.interview.questions;
          
          if (Array.isArray(parsedQuestions)) {
            setQuestions(parsedQuestions);
          }
        } catch (error) {
          console.error("Error parsing questions:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center text-gray-600 dark:text-gray-300">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Mülakat sonuçları yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center text-gray-500 dark:text-gray-400">
          Sonuç bulunamadı
        </div>
      </div>
    );
  }

  const categoriesData = analysis?.categories ?? {
    fluency: 0,
    content: 0,
    professionalism: 0,
    relevance: 0,
  };

  const screenRecordingUrl =
    attempt.screenRecordingUrl ?? parsedTranscript?.screenRecordingUrl ?? null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              AI Mülakat Değerlendirmesi
            </CardTitle>
            <CardDescription className="text-base">
              {attempt.interview.title}
            </CardDescription>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDateTime(attempt.completedAt)}
              </span>
              {attempt.interview.description && (
                <span className="max-w-md text-gray-500 dark:text-gray-400">
                  {attempt.interview.description}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
              <span className="text-3xl font-display font-bold">
                {score !== null ? `${score}%` : "--"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAnalysis}
              disabled={analysisLoading}
              className="flex items-center gap-2"
            >
              {analysisLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analiz yapılıyor...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  {analysis ? "Analizi Yenile" : "AI Analizi Oluştur"}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {analysisError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
              <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span>{analysisError}</span>
            </div>
          )}
          {parsedTranscript?.skippedRecording && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Bu oturumda kamera veya ses kaydı alınmadı. AI değerlendirmesi yalnızca yazılı yanıtlarınızı temel alır.
              </span>
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
            <p>
              Yapay zekâ değerlendirmesi; akıcılık, içerik derinliği, profesyonellik ve soru-cevap uyumu gibi kriterleri dikkate alır. Analizi
              yenileyerek gelişiminizi takip edebilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>

      {attempt.videoUrl && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Video Kaydı</CardTitle>
            <CardDescription>Mülakat kaydınızı izleyerek kendi performansınızı değerlendirin.</CardDescription>
          </CardHeader>
          <CardContent>
            <video
              src={attempt.videoUrl}
              controls
              className="w-full rounded-xl border border-gray-200 bg-black shadow-sm dark:border-gray-700"
            />
          </CardContent>
        </Card>
      )}

      {screenRecordingUrl && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ekran Kaydı</CardTitle>
            <CardDescription>
              Mülakat sırasında ekran paylaşımınız kayıt altına alındı. Gözden geçirmek için oynatabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <video
              src={screenRecordingUrl}
              controls
              className="w-full rounded-xl border border-gray-200 bg-black shadow-sm dark:border-gray-700"
            />
          </CardContent>
        </Card>
      )}

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>AI Geri Bildirimi</CardTitle>
          <CardDescription>Rubrik bazlı puanlar, güçlü yönler, gelişim alanları ve aksiyon önerileri</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {analysisLoading && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analiz hazırlanıyor...
            </div>
          )}

          {!analysis && !analysisLoading && (
            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/60 px-6 py-10 text-center dark:border-blue-900 dark:bg-blue-900/20">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-blue-500 dark:text-blue-300" />
              <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                Henüz AI geri bildirimi oluşturulmadı.
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Performans değerlendirmesi almak için yukarıdaki butona tıklayarak analizi başlatabilirsiniz.
              </p>
            </div>
          )}

          {analysis && !analysisLoading && (
            <div className="space-y-6">
              <div className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-900 shadow-sm dark:border-purple-900/40 dark:bg-purple-900/20 dark:text-purple-100">
                {analysis.summary || "Özet bilgisi bulunamadı."}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-900/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    Güçlü Yönler
                  </h4>
                  {analysis.strengths.length > 0 ? (
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {analysis.strengths.map((item, index) => (
                        <li key={`strength-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Henüz güçlü yön bulunamadı.</p>
                  )}
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-900/20">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    Gelişim Alanları
                  </h4>
                  {analysis.improvements.length > 0 ? (
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {analysis.improvements.map((item, index) => (
                        <li key={`improvement-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Henüz gelişim alanı belirtilmedi.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-900/20">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-blue-700 dark:text-blue-300">
                  <ClipboardList className="h-4 w-4" />
                  Aksiyon Planı
                </h4>
                {analysis.actionItems.length > 0 ? (
                  <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    {analysis.actionItems.map((item, index) => (
                      <li key={`action-${index}`} className="flex items-start gap-2">
                        <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-600 text-center text-xs font-semibold text-white dark:bg-blue-500">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Yapay zekâ henüz aksiyon önerisi üretmedi.
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(
                  Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>
                ).map((key) => {
                  const value = Math.min(Math.max(categoriesData[key] ?? 0, 0), 100);
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                    >
                      <div className="flex items-center justify-between text-sm font-semibold text-gray-800 dark:text-gray-100">
                        <span>{categoryLabels[key]}</span>
                        <span>%{Math.round(value)}</span>
                      </div>
                      <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {questionScores && questions.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Soru Bazlı Değerlendirme</CardTitle>
            <CardDescription>
              Her soru için AI tarafından yapılan doğruluk analizi ve puanlama
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const questionId = question.id;
              const score = questionScores[questionId] ?? 0;
              const feedback = questionFeedback?.[questionId];
              const correctness = questionCorrectness?.[questionId];
              const isCorrect = correctness?.correct ?? false;
              const questionText = question.question || question.prompt || `Soru ${index + 1}`;

              return (
                <div
                  key={questionId}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Soru {index + 1}: {questionText}
                      </h4>
                      {question.type && (
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {question.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                          isCorrect
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Puan</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        score >= 70
                          ? "bg-green-500"
                          : score >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>

                  {feedback?.feedback && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
                      <p className="font-medium text-gray-900 dark:text-gray-100">Geri Bildirim:</p>
                      <p className="mt-1">{feedback.feedback}</p>
                    </div>
                  )}

                  {feedback?.details && (
                    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
                      <p className="font-medium">Detaylar:</p>
                      <p className="mt-1">{feedback.details}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {transcript && (
        <Card variant="elevated">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Transkript</CardTitle>
              <CardDescription>AI analizi için kullanılan metin kaydını inceleyin.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownloadTranscript}
            >
              <Download className="h-4 w-4" />
              Transkripti İndir
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
              {transcript}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/interview/practice">
          <Button variant="gradient" className="flex items-center gap-2">
            Yeni Mülakat
          </Button>
        </Link>
        <Link href="/interview/history">
          <Button variant="secondary">Geçmişe Dön</Button>
        </Link>
      </div>
    </div>
  );
}

