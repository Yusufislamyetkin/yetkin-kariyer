"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, CheckCircle2, Code, Bug, PlayCircle, HelpCircle, BookOpen } from "lucide-react";
import { Composer } from "@/app/(dashboard)/chat/_components/Composer";
import { MessageViewport } from "@/app/(dashboard)/chat/_components/MessageViewport";
import { CodingChallengeModal } from "./CodingChallengeModal";
import { BugFixChallengeModal } from "./BugFixChallengeModal";
import { QuestionInteraction } from "./QuestionInteraction";
import { LessonMiniTest } from "./LessonMiniTest";
import { CodeBlock } from "./CodeBlock";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent } from "@/app/components/ui/Card";
import { useCelebration } from "@/app/contexts/CelebrationContext";
import type { LocalAttachment } from "@/app/(dashboard)/chat/_components/types";
import type { LiveCodingLanguage } from "@/types/live-coding";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  actions?: Array<{
    type: "coding_challenge" | "question" | "quiz_redirect" | "test_redirect" | "bugfix_redirect" | "livecoding_redirect" | "create_test" | "create_quiz" | "create_bugfix" | "create_livecoding" | "choices" | "code_block" | "test_question";
    data: any;
  }>;
  timestamp: string;
};

type LessonChatProps = {
  lessonSlug: string;
  lessonTitle: string;
  lessonDescription?: string | null;
};

export function LessonChat({ lessonSlug, lessonTitle, lessonDescription }: LessonChatProps) {
  const router = useRouter();
  const { celebrate } = useCelebration();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Modal states
  const [codingChallenge, setCodingChallenge] = useState<{
    task: {
      title: string;
      description: string;
      languages: LiveCodingLanguage[];
      acceptanceCriteria?: string[];
    };
  } | null>(null);
  const [bugfixChallenge, setBugfixChallenge] = useState<{
    task: {
      title: string;
      buggyCode: string;
      fixDescription: string;
      language: LiveCodingLanguage;
    };
  } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    text: string;
    type: "multiple_choice" | "open_ended";
    options?: string[];
  } | null>(null);
  const [currentTestQuestion, setCurrentTestQuestion] = useState<{
    text: string;
    type: "multiple_choice";
    options: string[];
    correctIndex: number;
  } | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizRedirectMessage, setQuizRedirectMessage] = useState<string | null>(null);
  const [accumulatedQuizQuestions, setAccumulatedQuizQuestions] = useState<Array<{
    text: string;
    options: string[];
    correctIndex: number;
    id: string;
  }>>([]);
  const [currentChoices, setCurrentChoices] = useState<string[] | null>(null);
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [pendingTestQuestions, setPendingTestQuestions] = useState<Array<{
    text: string;
    type: "multiple_choice";
    options: string[];
    correctIndex: number;
  }>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper function to check and mark lesson as completed
  const checkAndMarkLessonCompleted = useCallback(async (messageContent: string) => {
    if (isCompleted) return;

    const completionKeywords = [
      "ders bitti", "ders bitti!", "dersi bitirdin", "dersi tamamladın",
      "tamamlandı", "tamamlandı!", "başarıyla tamamladın", "tebrikler",
      "ders tamamlandı", "dersi tamamladın", "dersi bitirdin!",
      "harika! bu dersi", "dersi öğrenmişsin", "dersi tamamlamış bulunuyorsun",
      "dersimizi bitirdik", "dersimiz tamamlandı", "dersi tamamladık",
      "bu dersi tamamladın", "dersi başarıyla tamamladın", "ders bitti",
      "tebrikler, ders", "dersi bitirdik", "ders tamam", "ders bitti!",
      "dersi öğrendin", "dersi tamamlamışsın", "ders tamamlanmış durumda",
      "dersi bitirmiş bulunuyorsun", "dersi tamamladın artık", "ders sona erdi",
      "ders bittiği için", "dersin sonuna geldin", "dersin sonu"
    ];
    const messageLower = messageContent.toLowerCase();
    const isLessonComplete = completionKeywords.some(keyword => 
      messageLower.includes(keyword)
    );

    if (isLessonComplete) {
      setIsCompleted(true);
      
      // Trigger confetti
      celebrate({
        title: "🎉 Ders Tamamlandı!",
        message: `${lessonTitle} dersini başarıyla tamamladın!`,
        variant: "success",
        durationMs: 5000,
      });

      // Mark lesson as completed in API
      try {
        const completionResponse = await fetch(`/api/lessons/complete${lessonSlug.replace(/^\/education\/lessons/, "")}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!completionResponse.ok) {
          console.error("Failed to mark lesson as completed");
        }
      } catch (err) {
        console.error("Error marking lesson as completed:", err);
      }
    }
  }, [isCompleted, celebrate, lessonTitle, lessonSlug]);

  // Load initial message
  useEffect(() => {
    const loadInitialMessage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [],
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "AI yanıtı alınamadı");
        }

        const data = await response.json();
        const message: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: data.content || "Merhaba! Bu dersi öğrenmeye hazır mısın?",
          images: data.images,
          actions: data.actions,
          timestamp: new Date().toISOString(),
        };

        setMessages([message]);
        
        // Update lesson plan if provided
        if (data.lessonPlan) {
          setLessonPlan(data.lessonPlan);
        }

        // Handle actions
        if (data.actions && Array.isArray(data.actions)) {
          console.log("Received actions:", data.actions); // Debug log
          for (const action of data.actions) {
            if (action.type === "choices" && action.data?.choices) {
              setCurrentChoices(action.data.choices);
            } else if (action.type === "code_block") {
              // Code blocks are rendered separately, no action needed
            } else if (action.type === "test_question" && action.data?.question) {
              const question = action.data.question;
              console.log("Initial load - Received test_question:", question); // Debug log
              setPendingTestQuestions((prev) => {
                const updated = [...prev, question];
                if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                  setCurrentTestQuestion(updated[0]);
                }
                return updated;
              });
            } else if (action.type === "coding_challenge" && action.data?.task) {
              console.log("Setting coding challenge:", action.data.task); // Debug log
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_livecoding" && action.data?.task) {
              console.log("Setting live coding challenge:", action.data.task); // Debug log
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_bugfix" && action.data?.task) {
              console.log("Setting bugfix challenge:", action.data.task); // Debug log
              setBugfixChallenge({ task: action.data.task });
            } else if (action.type === "question" && action.data?.question) {
              setCurrentQuestion(action.data.question);
            } else if (action.type === "create_test" && action.data?.question) {
              setCurrentTestQuestion(action.data.question);
            } else if (action.type === "create_quiz" && action.data?.question) {
              const question = action.data.question;
              setAccumulatedQuizQuestions((prev) => [
                ...prev,
                {
                  text: question.text,
                  options: question.options || [],
                  correctIndex: question.correctIndex ?? 0,
                  id: `q-${Date.now()}-${prev.length}`,
                },
              ]);
              setCurrentTestQuestion(question);
            }
          }
        }
      } catch (err) {
        console.error("Error loading initial message:", err);
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    void loadInitialMessage();
  }, [lessonSlug]);

  // Create mini test from accumulated questions
  const createMiniTestFromAccumulatedQuestions = useCallback(async () => {
    if (accumulatedQuizQuestions.length < 3) return;

    try {
      const apiPath = `/api/lessons${lessonSlug.replace(/^\/education\/lessons/, "")}/mini-test`;
      const response = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: accumulatedQuizQuestions,
          lessonTitle,
        }),
      });

      if (response.ok) {
        console.log("Mini test başarıyla oluşturuldu");
        // Clear accumulated questions after successful creation
        setAccumulatedQuizQuestions([]);
      } else {
        console.error("Mini test oluşturulurken hata:", await response.text());
      }
    } catch (error) {
      console.error("Error creating mini test:", error);
    }
  }, [accumulatedQuizQuestions, lessonSlug, lessonTitle]);

  // Auto-create mini test when we have enough questions
  useEffect(() => {
    if (accumulatedQuizQuestions.length >= 5) {
      // Auto-create when we have 5 or more questions
      createMiniTestFromAccumulatedQuestions();
    }
  }, [accumulatedQuizQuestions.length, createMiniTestFromAccumulatedQuestions]);

  // Handle sending message
  const handleSendMessage = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (!messageInput.trim() || sending) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessageInput("");
      setCurrentChoices(null); // Clear choices when sending a message
      setSending(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: userMessage.content,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "AI yanıtı alınamadı");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content || "",
          images: data.images,
          actions: data.actions,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update lesson plan if provided
        if (data.lessonPlan) {
          setLessonPlan(data.lessonPlan);
        }

        // Check if lesson is completed
        await checkAndMarkLessonCompleted(assistantMessage.content);

        // Handle actions
        if (data.actions && Array.isArray(data.actions)) {
          console.log("handleSendMessage - Received actions:", data.actions); // Debug log
          for (const action of data.actions) {
            if (action.type === "choices" && action.data?.choices) {
              setCurrentChoices(action.data.choices);
            } else if (action.type === "code_block") {
              // Code blocks are rendered separately, no action needed
            } else if (action.type === "test_question" && action.data?.question) {
              // Test questions are rendered separately (tek tek)
              // Add to pending questions queue
              const question = action.data.question;
              console.log("handleSendMessage - Received test_question:", question); // Debug log
              setPendingTestQuestions((prev) => {
                const updated = [...prev, question];
                // Always show the first question from the updated queue
                if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                  setCurrentTestQuestion(updated[0]);
                }
                return updated;
              });
            } else if (action.type === "coding_challenge" && action.data?.task) {
              console.log("handleSendMessage - Setting coding challenge:", action.data.task); // Debug log
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_livecoding" && action.data?.task) {
              // CREATE_LIVECODING is converted to coding_challenge
              console.log("handleSendMessage - Setting live coding challenge:", action.data.task); // Debug log
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_bugfix" && action.data?.task) {
              console.log("handleSendMessage - Setting bugfix challenge:", action.data.task); // Debug log
              setBugfixChallenge({ task: action.data.task });
            } else if (action.type === "question" && action.data?.question) {
              setCurrentQuestion(action.data.question);
            } else if (action.type === "create_test" && action.data?.question) {
              setCurrentTestQuestion(action.data.question);
            } else if (action.type === "create_quiz" && action.data?.question) {
              const question = action.data.question;
              // Add to accumulated questions
              setAccumulatedQuizQuestions((prev) => [
                ...prev,
                {
                  text: question.text,
                  options: question.options || [],
                  correctIndex: question.correctIndex ?? 0,
                  id: `q-${Date.now()}-${prev.length}`,
                },
              ]);
              // Also show current question for immediate interaction
              setCurrentTestQuestion(question);
            } else if (action.type === "quiz_redirect") {
              setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
              setShowQuiz(true);
              // If we have accumulated questions, create mini test
              setAccumulatedQuizQuestions((prev) => {
                if (prev.length >= 3) {
                  // Create mini test asynchronously
                  setTimeout(() => {
                    const apiPath = `/api/lessons${lessonSlug.replace(/^\/education\/lessons/, "")}/mini-test`;
                    fetch(apiPath, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        questions: prev,
                        lessonTitle,
                      }),
                    })
                      .then((res) => {
                        if (res.ok) {
                          console.log("Mini test başarıyla oluşturuldu");
                        }
                      })
                      .catch((err) => console.error("Error creating mini test:", err));
                  }, 100);
                }
                return prev;
              });
            } else if (action.type === "test_redirect" && action.data?.url) {
              // Redirect to test page
              router.push(action.data.url);
            } else if (action.type === "bugfix_redirect" && action.data?.url) {
              // Redirect to bugfix page
              router.push(action.data.url);
            } else if (action.type === "livecoding_redirect" && action.data?.url) {
              // Redirect to live coding page
              router.push(action.data.url);
            }
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Mesaj gönderilemedi");
      } finally {
        setSending(false);
      }
    },
    [messageInput, messages, lessonSlug, sending, lessonPlan, checkAndMarkLessonCompleted]
  );

  // Handle context button click (Devam et, Başka örnekle açıkla, Bir sonraki aşamaya geç)
  const handleContextButton = useCallback(
    async (buttonText: string, messageContent: string) => {
      if (sending) return;

      const buttonMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, buttonMessage]);
      setSending(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: messageContent,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "AI yanıtı alınamadı");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content || "",
          images: data.images,
          actions: data.actions,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update lesson plan if provided
        if (data.lessonPlan) {
          setLessonPlan(data.lessonPlan);
        }

        // Check if lesson is completed
        await checkAndMarkLessonCompleted(assistantMessage.content);

        // Handle actions (same as handleSendMessage)
        if (data.actions && Array.isArray(data.actions)) {
          for (const action of data.actions) {
            if (action.type === "choices" && action.data?.choices) {
              setCurrentChoices(action.data.choices);
            } else if (action.type === "code_block") {
              // Code blocks are rendered separately
            } else if (action.type === "test_question" && action.data?.question) {
              const question = action.data.question;
              console.log("handleQuestionAnswer - Received test_question:", question); // Debug log
              setPendingTestQuestions((prev) => {
                const updated = [...prev, question];
                if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                  setCurrentTestQuestion(updated[0]);
                }
                return updated;
              });
            } else if (action.type === "coding_challenge" && action.data?.task) {
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_livecoding" && action.data?.task) {
              setCodingChallenge({ task: action.data.task });
            } else if (action.type === "create_bugfix" && action.data?.task) {
              setBugfixChallenge({ task: action.data.task });
            } else if (action.type === "question" && action.data?.question) {
              setCurrentQuestion(action.data.question);
            } else if (action.type === "create_test" && action.data?.question) {
              setCurrentTestQuestion(action.data.question);
            } else if (action.type === "create_quiz" && action.data?.question) {
              const question = action.data.question;
              setAccumulatedQuizQuestions((prev) => [
                ...prev,
                {
                  text: question.text,
                  options: question.options || [],
                  correctIndex: question.correctIndex ?? 0,
                  id: `q-${Date.now()}-${prev.length}`,
                },
              ]);
              setCurrentTestQuestion(question);
            } else if (action.type === "quiz_redirect") {
              setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
              setShowQuiz(true);
            } else if (action.type === "test_redirect" && action.data?.url) {
              router.push(action.data.url);
            } else if (action.type === "bugfix_redirect" && action.data?.url) {
              router.push(action.data.url);
            } else if (action.type === "livecoding_redirect" && action.data?.url) {
              router.push(action.data.url);
            }
          }
        }
      } catch (err) {
        console.error("Error processing context button:", err);
        setError(err instanceof Error ? err.message : "Mesaj gönderilemedi");
      } finally {
        setSending(false);
      }
    },
    [messages, lessonSlug, lessonPlan, sending, checkAndMarkLessonCompleted, router, currentTestQuestion]
  );

  // Handle choice selection
  const handleChoiceSelect = useCallback(
    async (choice: string) => {
      if (!currentChoices || sending) return;

      const choiceMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: choice,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, choiceMessage]);
      setCurrentChoices(null);
      setSending(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: choiceMessage.content,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "AI yanıtı alınamadı");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content || "",
          images: data.images,
          actions: data.actions,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update lesson plan if provided
        if (data.lessonPlan) {
          setLessonPlan(data.lessonPlan);
        }

        // Check if lesson is completed
        await checkAndMarkLessonCompleted(assistantMessage.content);

          // Handle actions
          if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
              if (action.type === "choices" && action.data?.choices) {
                setCurrentChoices(action.data.choices);
              } else if (action.type === "code_block") {
                // Code blocks are rendered separately, no action needed
              } else if (action.type === "test_question" && action.data?.question) {
                const question = action.data.question;
                console.log("handleChoiceSelect - Received test_question:", question); // Debug log
                setPendingTestQuestions((prev) => {
                  const updated = [...prev, question];
                  if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                    setCurrentTestQuestion(updated[0]);
                  }
                  return updated;
                });
              } else if (action.type === "coding_challenge" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_livecoding" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_bugfix" && action.data?.task) {
                setBugfixChallenge({ task: action.data.task });
              } else if (action.type === "question" && action.data?.question) {
                setCurrentQuestion(action.data.question);
              } else if (action.type === "create_test" && action.data?.question) {
                setCurrentTestQuestion(action.data.question);
              } else if (action.type === "create_quiz" && action.data?.question) {
              const question = action.data.question;
              setAccumulatedQuizQuestions((prev) => [
                ...prev,
                {
                  text: question.text,
                  options: question.options || [],
                  correctIndex: question.correctIndex ?? 0,
                  id: `q-${Date.now()}-${prev.length}`,
                },
              ]);
              setCurrentTestQuestion(question);
            } else if (action.type === "quiz_redirect") {
              setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
              setShowQuiz(true);
            } else if (action.type === "test_redirect" && action.data?.url) {
              router.push(action.data.url);
            } else if (action.type === "bugfix_redirect" && action.data?.url) {
              router.push(action.data.url);
            } else if (action.type === "livecoding_redirect" && action.data?.url) {
              router.push(action.data.url);
            }
          }
        }
      } catch (err) {
        console.error("Error processing choice:", err);
        setError(err instanceof Error ? err.message : "Seçenek işlenemedi");
      } finally {
        setSending(false);
      }
    },
    [currentChoices, messages, lessonSlug, lessonPlan, sending, checkAndMarkLessonCompleted]
  );

  // Handle question answer
  const handleQuestionAnswer = useCallback(
    async (answer: string) => {
      if (!currentQuestion) return;

      // Send answer as a message
      const answerMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: `Soru: ${currentQuestion.text}\nCevabım: ${answer}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, answerMessage]);
      setCurrentQuestion(null);

      // Continue conversation
      setSending(true);
      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: answerMessage.content,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: data.content || "",
            images: data.images,
            actions: data.actions,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Update lesson plan if provided
          if (data.lessonPlan) {
            setLessonPlan(data.lessonPlan);
          }

          // Check if lesson is completed
          await checkAndMarkLessonCompleted(assistantMessage.content);

          // Handle new actions
          if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
              if (action.type === "choices" && action.data?.choices) {
                setCurrentChoices(action.data.choices);
              } else if (action.type === "code_block") {
                // Code blocks are rendered separately
              } else if (action.type === "test_question" && action.data?.question) {
                const question = action.data.question;
                console.log("handleContextButton - Received test_question:", question); // Debug log
                setPendingTestQuestions((prev) => {
                  const updated = [...prev, question];
                  if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                    setCurrentTestQuestion(updated[0]);
                  }
                  return updated;
                });
              } else if (action.type === "coding_challenge" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_livecoding" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_bugfix" && action.data?.task) {
                setBugfixChallenge({ task: action.data.task });
              } else if (action.type === "question" && action.data?.question) {
                setCurrentQuestion(action.data.question);
              } else if (action.type === "create_test" && action.data?.question) {
                setCurrentTestQuestion(action.data.question);
              } else if (action.type === "create_quiz" && action.data?.question) {
                const question = action.data.question;
                setAccumulatedQuizQuestions((prev) => [
                  ...prev,
                  {
                    text: question.text,
                    options: question.options || [],
                    correctIndex: question.correctIndex ?? 0,
                    id: `q-${Date.now()}-${prev.length}`,
                  },
                ]);
                setCurrentTestQuestion(question);
              } else if (action.type === "quiz_redirect") {
                setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
                setShowQuiz(true);
              } else if (action.type === "test_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "bugfix_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "livecoding_redirect" && action.data?.url) {
                router.push(action.data.url);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error processing answer:", err);
      } finally {
        setSending(false);
      }
    },
    [currentQuestion, messages, lessonSlug, lessonPlan]
  );

  // Handle bugfix complete
  const handleBugfixComplete = useCallback(
    async (code: string, language: LiveCodingLanguage, output?: any) => {
      setBugfixChallenge(null);

      const completeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: `Bugfix görevini tamamladım. Düzelttiğim kod:\n\`\`\`${language}\n${code}\n\`\`\`\n${output ? `Çıktı: ${JSON.stringify(output)}` : ""}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, completeMessage]);

      // Continue conversation
      setSending(true);
      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: completeMessage.content,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: data.content || "",
            images: data.images,
            actions: data.actions,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Update lesson plan if provided
          if (data.lessonPlan) {
            setLessonPlan(data.lessonPlan);
          }

          // Check if lesson is completed
          await checkAndMarkLessonCompleted(assistantMessage.content);

          // Handle new actions
          if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
              if (action.type === "choices" && action.data?.choices) {
                setCurrentChoices(action.data.choices);
              } else if (action.type === "code_block") {
                // Code blocks are rendered separately
              } else if (action.type === "test_question" && action.data?.question) {
                const question = action.data.question;
                console.log("handleBugfixComplete - Received test_question:", question); // Debug log
                setPendingTestQuestions((prev) => {
                  const updated = [...prev, question];
                  if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                    setCurrentTestQuestion(updated[0]);
                  }
                  return updated;
                });
              } else if (action.type === "coding_challenge" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_livecoding" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_bugfix" && action.data?.task) {
                setBugfixChallenge({ task: action.data.task });
              } else if (action.type === "question" && action.data?.question) {
                setCurrentQuestion(action.data.question);
              } else if (action.type === "create_test" && action.data?.question) {
                setCurrentTestQuestion(action.data.question);
              } else if (action.type === "create_quiz" && action.data?.question) {
                const question = action.data.question;
                setAccumulatedQuizQuestions((prev) => [
                  ...prev,
                  {
                    text: question.text,
                    options: question.options || [],
                    correctIndex: question.correctIndex ?? 0,
                    id: `q-${Date.now()}-${prev.length}`,
                  },
                ]);
                setCurrentTestQuestion(question);
              } else if (action.type === "quiz_redirect") {
                setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
                setShowQuiz(true);
              } else if (action.type === "test_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "bugfix_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "livecoding_redirect" && action.data?.url) {
                router.push(action.data.url);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error processing bugfix complete:", err);
      } finally {
        setSending(false);
      }
    },
    [messages, lessonSlug, lessonPlan, router]
  );

  // Handle test question answer
  const handleTestQuestionAnswer = useCallback(
    async (selectedIndex: number) => {
      if (!currentTestQuestion) return;

      const isCorrect = selectedIndex === currentTestQuestion.correctIndex;
      const answerMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: `Test sorusu: ${currentTestQuestion.text}\nCevabım: ${currentTestQuestion.options[selectedIndex]}\n${isCorrect ? "Doğru!" : "Yanlış"}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, answerMessage]);
      
      // Show feedback message
      const feedbackMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: isCorrect
          ? "Harika! Doğru cevap. 🎉"
          : `Maalesef yanlış. Doğru cevap: ${currentTestQuestion.options[currentTestQuestion.correctIndex]}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);
      
      // Clear current question first
      setCurrentTestQuestion(null);
      
      // Show next question after feedback delay, or continue conversation
      setTimeout(() => {
        setPendingTestQuestions((prev) => {
          if (prev.length > 0) {
            // Show next question
            const nextQuestion = prev[0];
            setCurrentTestQuestion(nextQuestion);
            return prev.slice(1);
          } else {
            // No more questions, continue conversation
            setCurrentTestQuestion(null);
            
            // Continue conversation
            setSending(true);
            (async () => {
              try {
                const response = await fetch("/api/ai/lesson-chat", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    lessonSlug,
                    messages: [
                      ...messages.map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                      })),
                      {
                        role: "user",
                        content: answerMessage.content,
                      },
                    ],
                    lessonPlan: lessonPlan,
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  const assistantMessage: Message = {
                    id: `msg-${Date.now() + 2}`,
                    role: "assistant",
                    content: data.content || "",
                    images: data.images,
                    actions: data.actions,
                    timestamp: new Date().toISOString(),
                  };

                  setMessages((prev) => [...prev, assistantMessage]);

                  // Update lesson plan if provided
                  if (data.lessonPlan) {
                    setLessonPlan(data.lessonPlan);
                  }

                  // Handle new actions
                  if (data.actions && Array.isArray(data.actions)) {
                    for (const action of data.actions) {
                      if (action.type === "choices" && action.data?.choices) {
                        setCurrentChoices(action.data.choices);
                      } else if (action.type === "code_block") {
                        // Code blocks are rendered separately
                      } else if (action.type === "test_question" && action.data?.question) {
                        const question = action.data.question;
                        console.log("handleTestQuestionAnswer - Received test_question:", question); // Debug log
                        setPendingTestQuestions((prev) => {
                          const updated = [...prev, question];
                          if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                            setCurrentTestQuestion(updated[0]);
                          }
                          return updated;
                        });
                      } else if (action.type === "coding_challenge" && action.data?.task) {
                        setCodingChallenge({ task: action.data.task });
                      } else if (action.type === "create_livecoding" && action.data?.task) {
                        setCodingChallenge({ task: action.data.task });
                      } else if (action.type === "create_bugfix" && action.data?.task) {
                        setBugfixChallenge({ task: action.data.task });
                      } else if (action.type === "question" && action.data?.question) {
                        setCurrentQuestion(action.data.question);
                      } else if (action.type === "create_test" && action.data?.question) {
                        setCurrentTestQuestion(action.data.question);
                      } else if (action.type === "create_quiz" && action.data?.question) {
                        const question = action.data.question;
                        setAccumulatedQuizQuestions((prev) => [
                          ...prev,
                          {
                            text: question.text,
                            options: question.options || [],
                            correctIndex: question.correctIndex ?? 0,
                            id: `q-${Date.now()}-${prev.length}`,
                          },
                        ]);
                        setCurrentTestQuestion(question);
                      } else if (action.type === "quiz_redirect") {
                        setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
                        setShowQuiz(true);
                      } else if (action.type === "test_redirect" && action.data?.url) {
                        router.push(action.data.url);
                      } else if (action.type === "bugfix_redirect" && action.data?.url) {
                        router.push(action.data.url);
                      } else if (action.type === "livecoding_redirect" && action.data?.url) {
                        router.push(action.data.url);
                      }
                    }
                  }
                }
              } catch (err) {
                console.error("Error processing test answer:", err);
              } finally {
                setSending(false);
              }
            })();
            return [];
          }
        });
      }, 1500); // Delay to show feedback
    },
    [currentTestQuestion, messages, lessonSlug, lessonPlan, pendingTestQuestions, router]
  );

  // Handle coding challenge complete
  const handleCodingComplete = useCallback(
    async (code: string, language: LiveCodingLanguage, output?: any) => {
      setCodingChallenge(null);

      const completeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: `Kod görevini tamamladım. Kodum:\n\`\`\`${language}\n${code}\n\`\`\`\n${output ? `Çıktı: ${JSON.stringify(output)}` : ""}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, completeMessage]);

      // Continue conversation
      setSending(true);
      try {
        const response = await fetch("/api/ai/lesson-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: completeMessage.content,
              },
            ],
            lessonPlan: lessonPlan,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: data.content || "",
            images: data.images,
            actions: data.actions,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Update lesson plan if provided
          if (data.lessonPlan) {
            setLessonPlan(data.lessonPlan);
          }

          // Check if lesson is completed
          await checkAndMarkLessonCompleted(assistantMessage.content);

          // Handle new actions
          if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
              if (action.type === "choices" && action.data?.choices) {
                setCurrentChoices(action.data.choices);
              } else if (action.type === "code_block") {
                // Code blocks are rendered separately
              } else if (action.type === "test_question" && action.data?.question) {
                const question = action.data.question;
                console.log("handleCodingComplete - Received test_question:", question); // Debug log
                setPendingTestQuestions((prev) => {
                  const updated = [...prev, question];
                  if (updated.length > 0 && (!currentTestQuestion || prev.length === 0)) {
                    setCurrentTestQuestion(updated[0]);
                  }
                  return updated;
                });
              } else if (action.type === "coding_challenge" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_livecoding" && action.data?.task) {
                setCodingChallenge({ task: action.data.task });
              } else if (action.type === "create_bugfix" && action.data?.task) {
                setBugfixChallenge({ task: action.data.task });
              } else if (action.type === "question" && action.data?.question) {
                setCurrentQuestion(action.data.question);
              } else if (action.type === "create_test" && action.data?.question) {
                setCurrentTestQuestion(action.data.question);
              } else if (action.type === "create_quiz" && action.data?.question) {
                const question = action.data.question;
                setAccumulatedQuizQuestions((prev) => [
                  ...prev,
                  {
                    text: question.text,
                    options: question.options || [],
                    correctIndex: question.correctIndex ?? 0,
                    id: `q-${Date.now()}-${prev.length}`,
                  },
                ]);
                setCurrentTestQuestion(question);
              } else if (action.type === "quiz_redirect") {
                setQuizRedirectMessage(action.data?.message || "Ders sonunda mini teste geçelim!");
                setShowQuiz(true);
              } else if (action.type === "test_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "bugfix_redirect" && action.data?.url) {
                router.push(action.data.url);
              } else if (action.type === "livecoding_redirect" && action.data?.url) {
                router.push(action.data.url);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error processing coding complete:", err);
      } finally {
        setSending(false);
      }
    },
    [messages, lessonSlug, lessonPlan]
  );

  // Helper function to clean message content: remove markdown, remove choices (A), B), C), D))
  const cleanMessageContent = useCallback((content: string): string => {
    if (!content) return content;
    
    let cleaned = content;
    
    // Remove markdown formatting
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold **text**
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Remove italic *text*
    cleaned = cleaned.replace(/###\s+(.*?)(\n|$)/g, '$1\n'); // Remove ### headers
    cleaned = cleaned.replace(/##\s+(.*?)(\n|$)/g, '$1\n'); // Remove ## headers
    cleaned = cleaned.replace(/#\s+(.*?)(\n|$)/g, '$1\n'); // Remove # headers
    cleaned = cleaned.replace(/^-\s+/gm, ''); // Remove list markers -
    cleaned = cleaned.replace(/^\*\s+/gm, ''); // Remove list markers *
    cleaned = cleaned.replace(/^\d+\.\s+/gm, ''); // Remove numbered list markers 1. 2. 3.
    
    // Remove test question choices from message content (A), B), C), D) format)
    cleaned = cleaned.replace(/^\s*[A-D]\)\s+.*$/gm, ''); // Remove lines starting with A), B), C), D)
    cleaned = cleaned.replace(/\([A-D]\)\s+/g, ''); // Remove inline (A), (B), etc.
    
    // Remove TEST_QUESTION tags - they are rendered separately as interactive components
    cleaned = cleaned.replace(/\[TEST_QUESTION:[^\]]+\]/gi, '');
    
    // Remove CODE_BLOCK tags - they are rendered separately as code blocks
    cleaned = cleaned.replace(/\[CODE_BLOCK:[\s\S]*?\]/gi, '');
    
    // Clean up multiple newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  }, []);

  // Convert messages to ChatMessage format for MessageViewport
  const chatMessages = messages.map((msg) => ({
    id: msg.id,
    groupId: "lesson-chat",
    userId: msg.role === "user" ? "current-user" : "assistant",
    type: msg.role === "assistant" ? ("system" as const) : ("text" as const),
    content: msg.role === "assistant" ? cleanMessageContent(msg.content) : msg.content,
    mentionIds: [],
    createdAt: msg.timestamp,
    updatedAt: msg.timestamp,
    deletedAt: null,
    sender: {
      id: msg.role === "user" ? "current-user" : "assistant",
      name: msg.role === "user" ? "Siz" : "AI Asistan",
      profileImage: null,
    },
    attachments: msg.images
      ? msg.images.map((img, idx) => ({
          id: `img-${msg.id}-${idx}`,
          messageId: msg.id,
          url: img,
          type: "image" as const,
          metadata: {},
          size: null,
          createdAt: msg.timestamp,
        }))
      : [],
    readByUserIds: [],
  }));

  // Handle attachments
  const handleAttachmentsSelect = useCallback((files: FileList) => {
    const newAttachments: LocalAttachment[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      type: file.type.startsWith("image/") ? "image" : "file",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const handleAttachmentRemove = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);


  if (showQuiz) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6">
          {quizRedirectMessage && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
              <p className="text-blue-900 dark:text-blue-100">{quizRedirectMessage}</p>
            </div>
          )}
          <LessonMiniTest
            lessonSlug={lessonSlug}
            lessonTitle={lessonTitle}
            onStatusChange={({ passed }) => {
              if (passed) {
                // Quiz passed, show success message
                const successMessage: Message = {
                  id: `msg-${Date.now()}`,
                  role: "assistant",
                  content: "Harika! Mini testi başarıyla tamamladın. Bu dersi öğrenmişsin! 🎉",
                  timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, successMessage]);
              }
            }}
          />
          <div className="mt-6">
            <Button
              onClick={() => {
                setShowQuiz(false);
                setQuizRedirectMessage(null);
              }}
              variant="outline"
            >
              Sohbete Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const lastAssistantMessage = messages && Array.isArray(messages) 
    ? messages.filter((msg) => msg.role === "assistant").pop() 
    : null;
  const testQuestions = lastAssistantMessage?.actions?.filter((action) => action.type === "test_question") || [];

  // Create a map of message IDs to their code blocks for quick lookup
  const messageCodeBlocksMap = new Map<string, Array<{ language: string; code: string }>>();
  if (messages && Array.isArray(messages)) {
    messages.forEach((msg) => {
      if (msg.role === "assistant" && msg.actions) {
        const codeBlocks = msg.actions
          .filter((action) => action.type === "code_block")
          .map((action) => ({
            language: action.data?.language || "text",
            code: action.data?.code || "",
          }));
        if (codeBlocks.length > 0) {
          messageCodeBlocksMap.set(msg.id, codeBlocks);
        }
      }
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="relative">
          <MessageViewport
            messages={chatMessages}
            currentUserId="current-user"
            hasMore={false}
            loading={loading}
            loadingMore={false}
            onLoadMore={() => {}}
            emptyState={{
              icon: <MessageSquare className="h-10 w-10" />,
              title: "Ders sohbeti başlatılıyor...",
              description: "AI asistan hazırlanıyor",
            }}
            endRef={messagesEndRef}
            className="flex-1"
          />
          
          {/* Code Blocks for each assistant message - positioned right after their message bubble */}
          {/* Render code blocks in message order, right after each assistant message */}
          {messages
            .filter((msg) => msg.role === "assistant" && messageCodeBlocksMap.has(msg.id))
            .map((msg) => {
              const codeBlocks = messageCodeBlocksMap.get(msg.id)!;
              return (
                <div key={`code-blocks-${msg.id}`} className="px-6 pb-3 -mt-1">
                  <div className="space-y-3" style={{ maxWidth: "65%", marginLeft: "calc(3rem + 0.375rem)" }}>
                    {codeBlocks.map((codeBlock, index) => (
                      <CodeBlock
                        key={`code-block-${msg.id}-${index}`}
                        code={codeBlock.code}
                        language={codeBlock.language}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Test Questions from last message (tek tek göster) */}
      {testQuestions.length > 0 && !currentTestQuestion && (
        <div className="px-6 pb-4">
          {testQuestions.slice(0, 1).map((action, index) => {
            const question = action.data?.question;
            if (!question) return null;

            return (
              <Card key={`test-question-${lastAssistantMessage?.id}-${index}`} className="border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/30 mb-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Test Sorusu
                  </h3>
                  <p className="mb-4 text-gray-800 dark:text-gray-200">
                    {question.text}
                  </p>
                  <div className="space-y-2">
                    {question.options?.map((option: string, optionIndex: number) => (
                      <Button
                        key={optionIndex}
                        onClick={() => {
                          // Set as current test question to use existing handler
                          setCurrentTestQuestion({
                            text: question.text,
                            type: "multiple_choice",
                            options: question.options || [],
                            correctIndex: question.correctIndex ?? 0,
                          });
                          // Trigger answer
                          setTimeout(() => {
                            handleTestQuestionAnswer(optionIndex);
                          }, 0);
                        }}
                        variant="outline"
                        className="w-full justify-start text-left hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-300 dark:border-blue-700"
                        disabled={sending}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Current Question */}
      {currentQuestion && (
        <div className="px-6 pb-4">
          <QuestionInteraction
            question={currentQuestion}
            onAnswer={handleQuestionAnswer}
            disabled={sending}
          />
        </div>
      )}

      {/* Test Question */}
      {currentTestQuestion && (
        <div className="px-6 pb-4">
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Test Sorusu
              </h3>
              <p className="mb-4 text-gray-800 dark:text-gray-200">
                {currentTestQuestion.text}
              </p>
              <div className="space-y-2">
                {currentTestQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleTestQuestionAnswer(index)}
                    variant="outline"
                    className="w-full justify-start text-left"
                    disabled={sending}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Choice Buttons */}
      {currentChoices && currentChoices.length > 0 && (
        <div className="px-6 pb-4">
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/30">
            <CardContent className="p-6">
              <div className="space-y-2">
                {currentChoices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoiceSelect(choice)}
                    variant="outline"
                    className="w-full justify-start text-left hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-300 dark:border-blue-700"
                    disabled={sending}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Context Buttons - Show when no choices, test questions, modals, or regular questions */}
      {!currentChoices && !currentTestQuestion && !currentQuestion && !codingChallenge && !bugfixChallenge && !showQuiz && 
       messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && !sending && (
        <div className="px-6 pb-4">
          <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900/40 dark:bg-purple-950/30">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleContextButton("Devam et", "devam et")}
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-300 dark:border-purple-700"
                  disabled={sending}
                >
                  Devam et
                </Button>
                <Button
                  onClick={() => handleContextButton("Başka örnekle açıkla", "başka bir örnekle açıkla")}
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-300 dark:border-purple-700"
                  disabled={sending}
                >
                  Başka örnekle açıkla
                </Button>
                <Button
                  onClick={() => handleContextButton("Bir sonraki aşamaya geç", "bir sonraki aşamaya geç")}
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-300 dark:border-purple-700"
                  disabled={sending}
                >
                  Bir sonraki aşamaya geç
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Composer */}
      <Composer
        message={messageInput}
        onMessageChange={setMessageInput}
        onSubmit={handleSendMessage}
        onSendShortcut={handleSendMessage}
        attachments={attachments}
        onAttachmentsSelect={handleAttachmentsSelect}
        onAttachmentRemove={handleAttachmentRemove}
        disabled={!messageInput.trim() || sending || !!currentQuestion || !!currentTestQuestion || !!currentChoices}
        sending={sending}
        uploading={false}
        textareaRef={textareaRef}
        fileInputRef={fileInputRef}
        placeholder={currentQuestion || currentTestQuestion || currentChoices ? "Lütfen yukarıdaki seçenekleri kullanın..." : "Sorunu yaz veya ders hakkında bilgi iste..."}
      />

      {/* Coding Challenge Modal */}
      {codingChallenge && (
        <CodingChallengeModal
          isOpen={!!codingChallenge}
          onClose={() => setCodingChallenge(null)}
          task={codingChallenge.task}
          onComplete={handleCodingComplete}
        />
      )}

      {/* Bugfix Challenge Modal */}
      {bugfixChallenge && (
        <BugFixChallengeModal
          isOpen={!!bugfixChallenge}
          onClose={() => setBugfixChallenge(null)}
          task={bugfixChallenge.task}
          onComplete={handleBugfixComplete}
        />
      )}

      {/* Error Overlay */}
      {error && (
        <div className="fixed top-6 right-6 z-50 bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/40 px-4 py-2 rounded-xl backdrop-blur max-w-md">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-700 dark:text-red-400 hover:underline"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
