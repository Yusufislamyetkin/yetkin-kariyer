"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Loader2, Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import { MessageContent } from "@/app/(dashboard)/education/lessons/_components/MessageContent";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

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

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type TutorChatProps = {
  wrongQuestions: WrongQuestion[];
  currentQuestion: WrongQuestion | null;
  onQuestionUnderstood: (questionId: string) => void;
  onNextQuestion: () => void;
};

export function TutorChat({
  wrongQuestions,
  currentQuestion,
  onQuestionUnderstood,
  onNextQuestion,
}: TutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitializedRef = useRef(false);
  const prevQuestionIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, assistantTyping]);

  // Explain current question when it changes (after initialization)
  const explainCurrentQuestion = useCallback(async (question: WrongQuestion | null) => {
    if (!question) return;

    setSending(true);
    setAssistantTyping(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/smart-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Bu soruyu detaylıca açıkla, neden yanlış olduğunu anlat ve doğru cevabı öğret. Kullanıcı anladığında 'anlaşıldı' olarak işaretlemesini iste.",
          currentQuestionId: question.id,
          currentQuestion: {
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            userAnswer: question.userAnswer,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "AI yanıtı alınamadı");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Soruyu açıklayamadım.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error explaining question:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSending(false);
      setAssistantTyping(false);
    }
  }, []);

  // When current question changes (after initialization), explain it
  useEffect(() => {
    if (!currentQuestion || !hasInitializedRef.current) return;
    
    // Only explain if question actually changed (not initial load)
    if (prevQuestionIdRef.current !== null && prevQuestionIdRef.current !== currentQuestion.id) {
      // Question changed, explain it after a short delay
      setTimeout(() => {
        explainCurrentQuestion(currentQuestion);
      }, 1500);
    }
    
    prevQuestionIdRef.current = currentQuestion.id;
  }, [currentQuestion?.id, explainCurrentQuestion]);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || sending) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setSending(true);
    setAssistantTyping(true);
    setError(null);

    try {
      // Check if user wants to mark as understood
      const userMessageLower = userMessage.content.toLowerCase();
      const isUnderstood = 
        userMessageLower.includes("anlaşıldı") ||
        userMessageLower.includes("anladım") ||
        userMessageLower.includes("tamam") ||
        userMessageLower.includes("evet") ||
        userMessageLower.includes("anladım, bir sonraki");

      if (isUnderstood && currentQuestion) {
        // Mark question as understood - this will update the wrongQuestions list
        await onQuestionUnderstood(currentQuestion.id);

        // Wait a bit for state to update, then check remaining questions
        setTimeout(() => {
          const remainingQuestions = wrongQuestions.filter((q) => q.id !== currentQuestion.id);
          
          if (remainingQuestions.length > 0) {
            // Move to next question (first remaining question)
            const nextQuestion = remainingQuestions[0];
            const nextMessage = `Harika! 🎉 Bu soruyu anladın. Şimdi bir sonraki soruya geçelim:\n\n**Soru:** ${nextQuestion.questionText}\n**Senin Cevabın:** ${nextQuestion.userAnswer}\n**Doğru Cevap:** ${nextQuestion.correctAnswer}\n\nBu soruyu şimdi açıklayayım mı?`;

            const assistantMessage: Message = {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: nextMessage,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            onNextQuestion();
            
            // Next question will be explained automatically via useEffect
          } else {
            // All questions completed
            const completionMessage: Message = {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: "🎉 Harika! Tüm soruları başarıyla anladın! Artık bu konularda daha iyi olacaksın. Başka bir konuda yardıma ihtiyacın var mı?",
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, completionMessage]);
            setAllQuestionsCompleted(true);
          }
        }, 300);
      } else {
        // Regular chat message
        const response = await fetch("/api/ai/smart-teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            currentQuestionId: currentQuestion?.id,
            currentQuestion: currentQuestion ? {
              questionText: currentQuestion.questionText,
              correctAnswer: currentQuestion.correctAnswer,
              userAnswer: currentQuestion.userAnswer,
            } : undefined,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "AI yanıtı alınamadı");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: data.reply || "",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi");
    } finally {
      setSending(false);
      setAssistantTyping(false);
    }
  }, [messageInput, sending, currentQuestion, wrongQuestions, onQuestionUnderstood, onNextQuestion, explainCurrentQuestion]);

  const handleMarkUnderstood = async () => {
    if (!currentQuestion || sending) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: "Anlaşıldı, bir sonraki soruya geçelim.",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Mark as understood - this will update the wrongQuestions list
    await onQuestionUnderstood(currentQuestion.id);

    // Wait a bit for state to update, then check remaining questions
    setTimeout(() => {
      // Check remaining questions after update
      const remainingQuestions = wrongQuestions.filter((q) => q.id !== currentQuestion.id);
      
      if (remainingQuestions.length > 0) {
        // Move to next question (first remaining question)
        const nextQuestion = remainingQuestions[0];
        const nextMessage = `Harika! 🎉 Bu soruyu anladın. Şimdi bir sonraki soruya geçelim:\n\n**Soru:** ${nextQuestion.questionText}\n**Senin Cevabın:** ${nextQuestion.userAnswer}\n**Doğru Cevap:** ${nextQuestion.correctAnswer}\n\nBu soruyu şimdi açıklayayım mı?`;

        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: nextMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        onNextQuestion();
        
        // Next question will be explained automatically via useEffect
      } else {
        // All questions completed
        const completionMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "🎉 Harika! Tüm soruları başarıyla anladın! Artık bu konularda daha iyi olacaksın. Başka bir konuda yardıma ihtiyacın var mı?",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, completionMessage]);
        setAllQuestionsCompleted(true);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Öğretmen Selin hazırlanıyor...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden h-full max-h-full min-h-0 px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6 space-y-3 sm:space-y-4 md:space-y-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-3 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-10 w-10 text-blue-500" />
                <p className="font-medium">AI Öğretmen Selin hazırlanıyor...</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const isOwn = msg.role === "user";
                  const isAI = msg.role === "assistant";

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full items-end gap-1.5 relative",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      {isAI && (
                        <div className="absolute -bottom-0.5 -left-1 z-10">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                            <Image
                              src="/Photos/AiTeacher/teacher.jpg"
                              alt="AI Öğretmen Selin"
                              fill
                              className="object-cover"
                              sizes="56px"
                              priority={false}
                              unoptimized={true}
                              onError={(e) => {
                                console.error("Failed to load AI teacher image:", e);
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-full sm:max-w-[70%] md:max-w-[65%] rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 shadow-md backdrop-blur-md border",
                          isOwn
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500/30"
                            : isAI
                            ? "bg-blue-50/90 dark:bg-blue-950/50 border-blue-200/70 dark:border-blue-800/60 text-gray-900 dark:text-gray-100 ml-12 sm:ml-14"
                            : "bg-white/85 dark:bg-gray-900/75 border-gray-200/70 dark:border-gray-700/60 text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {isAI ? (
                          <MessageContent
                            content={msg.content}
                            isAI={true}
                            className="text-gray-800 dark:text-gray-200"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap break-words leading-relaxed text-white/90 text-sm sm:text-base">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {assistantTyping && (
                  <div className="flex w-full items-end gap-1.5 relative justify-start">
                    <div className="absolute -bottom-0.5 -left-1 z-10">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                        <Image
                          src="/Photos/AiTeacher/teacher.jpg"
                          alt="AI Öğretmen Selin"
                          fill
                          className="object-cover"
                          sizes="48px"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </div>
                    <div className="ml-12 sm:ml-16 pr-4 sm:pr-6 inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs sm:text-sm">AI Öğretmen Selin</span>
                        <span className="text-[10px] sm:text-xs opacity-80">Düşünüyor...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 dark:text-red-400 hover:underline"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200/70 dark:border-gray-800/60 px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white/90 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="rounded-2xl sm:rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/70 shadow-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  allQuestionsCompleted
                    ? "Başka bir sorun var mı?"
                    : currentQuestion
                    ? "Sorunu yaz veya 'anlaşıldı' yaz..."
                    : "Mesajınızı yazın..."
                }
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 overflow-hidden",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500"
                )}
                disabled={sending || allQuestionsCompleted}
              />
            </div>
            {currentQuestion && !allQuestionsCompleted && (
              <Button
                type="button"
                onClick={handleMarkUnderstood}
                variant="outline"
                size="sm"
                disabled={sending}
                className="shrink-0"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Anlaşıldı</span>
                <span className="sm:hidden">✓</span>
              </Button>
            )}
            <Button
              type="submit"
              variant="gradient"
              size="md"
              disabled={!messageInput.trim() || sending || allQuestionsCompleted}
              isLoading={sending}
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="min-w-[36px] sm:min-w-[40px] md:min-w-[44px] h-9 sm:h-10 md:h-11 rounded-full p-0 flex items-center justify-center shrink-0"
              aria-label="Mesaj gönder"
            >
              <Send className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

