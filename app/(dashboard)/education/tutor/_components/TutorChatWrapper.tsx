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
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchWrongQuestions = async () => {
      try {
        const response = await fetch("/api/education/wrong-questions");
        const data = await response.json();
        const questions = data.wrongQuestions || [];
        
        // Sadece "understood" olmayan soruları filtrele
        const notUnderstoodQuestions = questions.filter(
          (q: WrongQuestion) => q.status !== "understood"
        );
        
        setWrongQuestions(notUnderstoodQuestions);
        
        // İlk soruyu aktif yap
        if (notUnderstoodQuestions.length > 0) {
          setCurrentQuestionIndex(0);
        }
      } catch (error) {
        console.error("Error fetching wrong questions:", error);
      } finally {
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
        // Soruyu listeden kaldır
        setWrongQuestions((prev) => {
          const updated = prev.filter((q) => q.id !== questionId);
          
          // Eğer aktif soru anlaşıldıysa, ilk kalan soruya geç (index 0)
          const currentIndex = prev.findIndex((q) => q.id === questionId);
          if (currentIndex !== -1) {
            if (updated.length > 0) {
              // Her zaman ilk soruya geç (çünkü liste güncelleniyor)
              setCurrentQuestionIndex(0);
            } else {
              setCurrentQuestionIndex(null);
            }
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };

  const handleSetCurrentQuestion = (index: number) => {
    if (index >= 0 && index < wrongQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNextQuestion = () => {
    // Always go to first question (index 0) since list is updated
    if (wrongQuestions.length > 0) {
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(null);
    }
  };

  const currentQuestion = currentQuestionIndex !== null && wrongQuestions.length > 0
    ? wrongQuestions[currentQuestionIndex]
    : null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content - Chat */}
      <div className="flex-1 overflow-hidden min-w-0">
        <TutorChat
          wrongQuestions={wrongQuestions}
          currentQuestion={currentQuestion}
          onQuestionUnderstood={handleQuestionUnderstood}
          onNextQuestion={handleNextQuestion}
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
                {wrongQuestions.length} soru kaldı
              </p>
            </div>
          </div>
        </div>
        
        {/* Questions List - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <WrongQuestionsSidebar
            wrongQuestions={wrongQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleSetCurrentQuestion}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

