/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, ArrowLeft } from "lucide-react";

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
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchQuiz();
    }
  }, [params.id]);

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
    try {
      const response = await fetch(`/api/education/test/${params.id}`);
      const data = await response.json();
      const quizData = data.quiz;
      const questions = quizData.questions as Question[];
      setQuiz(quizData);
      setAnswers(new Array(questions.length).fill(-1));
    } catch (error) {
      console.error("Error fetching test:", error);
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

    try {
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;

      const response = await fetch(`/api/education/test/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, duration }),
      });

      const data = await response.json();
      if (response.ok) {
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
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Test yükleniyor...</p>
        </div>
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
          <Link href="/education/test">
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
      <Link href="/education/test">
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
            {/* Page Numbers - Scrollable on mobile */}
            <div className="w-full overflow-x-auto -mx-2 px-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-max">
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
                  disabled={submitting || answeredCount < quiz.questions.length}
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

