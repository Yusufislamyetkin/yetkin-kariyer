"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TutorChat } from "./TutorChat";
import { WrongQuestionsSidebar } from "./WrongQuestionsSidebar";

interface WrongQuestion {
  id: string;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  status: "not_reviewed" | "reviewed" | "understood";
  notes: string | null;
  createdAt: string;
  quizAttempt: {
    quiz: {
      title: string;
      topic: string | null;
      course: {
        field: string | null;
        subCategory: string | null;
      } | null;
    };
  };
}

export function TutorChatWrapper() {
  const [allWrongQuestions, setAllWrongQuestions] = useState<WrongQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchWrongQuestions = async () => {
      try {
        console.log("[TutorChatWrapper] Fetching wrong questions...");
        setError(null);
        const response = await fetch("/api/education/wrong-questions");
        
        console.log("[TutorChatWrapper] Response status:", response.status);
        
        if (!response.ok) {
          throw new Error("Sorular yüklenirken bir hata oluştu");
        }
        
        const data = await response.json();
        console.log("[TutorChatWrapper] Received data:", data);
        const questions = data.wrongQuestions || [];
        console.log("[TutorChatWrapper] Questions count:", questions.length);
        
        // Tüm soruları sakla (sidebar için)
        setAllWrongQuestions(questions);
        
        // Sadece "understood" olmayan soruları bul (chat için)
        const notUnderstoodQuestions = questions.filter(
          (q: WrongQuestion) => q.status !== "understood"
        );
        console.log("[TutorChatWrapper] Not understood questions count:", notUnderstoodQuestions.length);
        
        // İlk soruyu aktif yap (understood olmayanlar arasından)
        if (notUnderstoodQuestions.length > 0) {
          // Tüm sorular listesinde ilk understood olmayan sorunun index'ini bul
          const firstNotUnderstoodIndex = questions.findIndex(
            (q: WrongQuestion) => q.id === notUnderstoodQuestions[0].id
          );
          console.log("[TutorChatWrapper] Setting current question index:", firstNotUnderstoodIndex);
          setCurrentQuestionIndex(firstNotUnderstoodIndex);
        } else {
          console.log("[TutorChatWrapper] No not-understood questions found");
        }
      } catch (error) {
        console.error("[TutorChatWrapper] Error fetching wrong questions:", error);
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        console.log("[TutorChatWrapper] Setting loading to false");
        setLoading(false);
      }
    };

    fetchWrongQuestions();
  }, []);

  const handleQuestionUnderstood = async (questionId: string) => {
    try {
      const response = await fetch("/api/education/wrong-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: questionId, status: "understood" }),
      });

      if (response.ok) {
        // Sorunun status'unu güncelle
        setAllWrongQuestions((prev) => {
          return prev.map((q) => 
            q.id === questionId ? { ...q, status: "understood" as const } : q
          );
        });
        
        // Eğer aktif soru anlaşıldıysa, bir sonraki understood olmayan soruya geç
        const notUnderstoodQuestions = allWrongQuestions
          .map((q, idx) => ({ q, idx }))
          .filter(({ q }) => q.id !== questionId && q.status !== "understood");
        
        if (notUnderstoodQuestions.length > 0) {
          const nextQuestion = notUnderstoodQuestions[0];
          const nextIndex = allWrongQuestions.findIndex((q) => q.id === nextQuestion.q.id);
          setCurrentQuestionIndex(nextIndex >= 0 ? nextIndex : null);
        } else {
          setCurrentQuestionIndex(null);
        }
      }
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };

  const handleSetCurrentQuestion = (index: number) => {
    if (index >= 0 && index < allWrongQuestions.length) {
      // Sadece understood olmayan sorulara geçiş yapılabilir
      if (allWrongQuestions[index].status !== "understood") {
        setCurrentQuestionIndex(index);
      }
    }
  };

  const handleNextQuestion = () => {
    // Bir sonraki understood olmayan soruya geç
    const notUnderstoodQuestions = allWrongQuestions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => q.status !== "understood");
    
    if (notUnderstoodQuestions.length > 0) {
      const nextQuestion = notUnderstoodQuestions[0];
      const nextIndex = allWrongQuestions.findIndex((q) => q.id === nextQuestion.q.id);
      setCurrentQuestionIndex(nextIndex >= 0 ? nextIndex : null);
    } else {
      setCurrentQuestionIndex(null);
    }
  };

  // Chat için sadece understood olmayan sorular
  const notUnderstoodQuestions = allWrongQuestions.filter(
    (q) => q.status !== "understood"
  );
  
  const currentQuestion = currentQuestionIndex !== null && allWrongQuestions.length > 0
    ? allWrongQuestions[currentQuestionIndex]
    : null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content - Chat */}
      <div className="flex-1 overflow-hidden min-w-0">
        <TutorChat
          wrongQuestions={notUnderstoodQuestions}
          currentQuestion={currentQuestion}
          onQuestionUnderstood={handleQuestionUnderstood}
          onNextQuestion={handleNextQuestion}
          wrapperLoading={loading}
          wrapperError={error}
        />
      </div>
      
      {/* Right Sidebar - Wrong Questions List */}
      <div className="hidden lg:flex lg:flex-col w-72 border-l border-gray-200 dark:border-gray-800 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-800/50 shrink-0">
          <div className="flex flex-col gap-4">
            <Link
              href="/education/tutor"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Geri Dön</span>
            </Link>
            
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Yanlış Sorularım
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notUnderstoodQuestions.length} soru kaldı
              </p>
            </div>
          </div>
        </div>
        
        {/* Questions List - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <WrongQuestionsSidebar
            wrongQuestions={allWrongQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleSetCurrentQuestion}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

