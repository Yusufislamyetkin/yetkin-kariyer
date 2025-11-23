/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, ArrowLeft, X, Sparkles, Brain, MessageSquare } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  course: {
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
  } | null;
}

export default function TestQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const technologyParam = params?.technology;
  const moduleParam = params?.module;
  const testIdParam = params?.testId;
  const technology = Array.isArray(technologyParam) ? technologyParam[0] : technologyParam;
  const moduleSlug = Array.isArray(moduleParam) ? moduleParam[0] : moduleParam;
  const testId = Array.isArray(testIdParam) ? testIdParam[0] : testIdParam;
  const decodedTechnology = technology ? decodeURIComponent(technology) : "";
  const decodedModule = moduleSlug ? decodeURIComponent(moduleSlug) : "";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    {
      icon: Brain,
      text: "Profil Bilginize Göre Sorular Üretiliyor",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Sparkles,
      text: "AI Seviyenize Uygun Test Sorularını Hazırlıyor",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: MessageSquare,
      text: "Test Sonrası Soruları AI İle Tartışmayı Unutmayın",
      color: "text-rose-600 dark:text-rose-400",
    },
  ];

  useEffect(() => {
    if (testId) {
      fetchQuiz();
    }
  }, [testId]);

  // Loading progress ve mesaj animasyonu
  useEffect(() => {
    if (!loading) return;

    // Progress bar animasyonu (0-90% arası, gerçek yükleme tamamlanana kadar)
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return 90; // %90'a kadar gider, gerçek yükleme bitince %100 olur
        return prev + Math.random() * 3; // Yavaş yavaş artır
      });
    }, 500);

    // Mesaj rotasyonu (her 3 saniyede bir değişir)
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [loading]);

  // Yükleme tamamlandığında progress'i %100 yap
  useEffect(() => {
    if (!loading && loadingProgress < 100) {
      setLoadingProgress(100);
    }
  }, [loading, loadingProgress]);

  useEffect(() => {
    if (!loading && quiz && !startTime) {
      setStartTime(Date.now());
    }
  }, [loading, quiz, startTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchQuiz = async () => {
    setLoadingProgress(0); // Yükleme başladığında progress'i sıfırla
    try {
      const response = await fetch(
        `/api/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}/${testId}/questions`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Test yüklenirken bir hata oluştu");
      }
      
      const quizData = data.quiz;
      
      if (!quizData) {
        throw new Error("Test bulunamadı");
      }
      
      const questions = quizData.questions as Question[];
      
      if (!questions || questions.length === 0) {
        console.warn("Test soruları bulunamadı");
        setQuiz(null);
        return;
      }
      
      setQuiz(quizData);
      setAnswers(new Array(questions.length).fill(-1));
      setLoadingProgress(100); // Yükleme tamamlandı
    } catch (error) {
      console.error("Error fetching test:", error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;

      const response = await fetch(
        `/api/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}/${testId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, duration }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || data.message || "Test gönderilirken bir hata oluştu";
        console.error("Error submitting test:", errorMessage, data);
        setSubmitError(errorMessage);
        return;
      }

      if (!data.quizAttempt || !data.quizAttempt.id) {
        const errorMessage = "Test sonucu alınamadı. Lütfen tekrar deneyin.";
        console.error("Error: quizAttempt or quizAttempt.id is missing", data);
        setSubmitError(errorMessage);
        return;
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "latest-achievement",
          JSON.stringify({
            attemptId: data.quizAttempt.id,
            source: "test",
            badgeResults: data.badgeResults,
            goalResults: data.goalResults,
            score: data.score,
            quizTitle: quiz?.title ?? "",
            timestamp: Date.now(),
          })
        );
      }
      
      router.push(`/education/results/${data.quizAttempt.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Test gönderilirken beklenmeyen bir hata oluştu";
      console.error("Error submitting test:", error);
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    const CurrentIcon = loadingMessages[loadingMessageIndex].icon;
    const currentMessage = loadingMessages[loadingMessageIndex].text;
    const currentColor = loadingMessages[loadingMessageIndex].color;

    return (
      <div className="flex items-center justify-center min-h-[600px] px-4">
        <Card variant="elevated" className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center animate-pulse">
                  <CurrentIcon className={`h-10 w-10 ${currentColor.replace('text-', 'text-white')} animate-bounce`} />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-20 animate-ping"></div>
              </div>

              {/* Main Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                  {currentMessage}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ortalama soru üretme süresi: ~30 saniye
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">İlerleme</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                {loadingMessages.map((msg, index) => {
                  const Icon = msg.icon;
                  const isActive = index === loadingMessageIndex;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-5 w-5 ${
                            isActive
                              ? msg.color
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium ${
                            isActive
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading Dots */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="elevated" className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Test Bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aradığınız test mevcut değil veya erişim yetkiniz bulunmuyor.
          </p>
          <Link href={`/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}`}>
            <Button variant="gradient">Testlere Dön</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href={`/education/tests/${encodeURIComponent(decodedTechnology)}/${encodeURIComponent(decodedModule)}`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Testlere Dön
        </Button>
      </Link>

      {/* Header Card */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{quiz.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm">
                {quiz.course?.expertise && (
                  <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.expertise}</span>
                )}
                {quiz.course?.topic && (
                  <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.topic}</span>
                )}
                {quiz.course?.topicContent && (
                  <span className="px-2 py-1 bg-white/20 rounded">{quiz.course.topicContent}</span>
                )}
              </div>
              <p className="text-purple-100 text-sm mt-2">
                {quiz.questions.length} soru • Geçme notu: %{quiz.passingScore}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Clock className="h-5 w-5" />
                <span className="font-display font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                İlerleme
              </span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {currentQuestion + 1} / {quiz.questions.length}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Cevaplanan: {answeredCount} / {quiz.questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Question Card */}
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">
              {currentQuestion + 1}
            </span>
            <span className="text-gray-900 dark:text-gray-100">Soru</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
            {question.question}
          </h2>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                    isSelected
                      ? "border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md md:shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`flex-1 font-medium ${
                      isSelected
                        ? "text-purple-900 dark:text-purple-100"
                        : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {option}
                    </span>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card variant="elevated">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Hata</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Page Numbers - Centered */}
            <div className="w-full overflow-x-auto -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap py-3">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all cursor-pointer ${
                      index === currentQuestion
                        ? "bg-purple-600 text-white shadow-lg scale-110"
                        : answer !== -1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Önceki Soru
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Testi Bitir
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  Sonraki Soru
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

