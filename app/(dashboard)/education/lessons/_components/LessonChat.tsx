"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { MessageSquare, Loader2, X, ArrowRight, CheckCircle, Send } from "lucide-react";
import Image from "next/image";
import { Composer } from "@/app/(dashboard)/chat/_components/Composer";
import { CodeBlock } from "./CodeBlock";
import { LessonCodeEditor } from "./LessonCodeEditor";
import { RoadmapDisplay } from "./RoadmapDisplay";
import { TimedBugfix } from "./TimedBugfix";
import { QuestionInteraction } from "./QuestionInteraction";
import { MessageContent } from "./MessageContent";
import { TestQuestionChatbox } from "./TestQuestionChatbox";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent } from "@/app/components/ui/Card";
import { useCelebration } from "@/app/contexts/CelebrationContext";
import { useBadgeNotification } from "@/app/contexts/BadgeNotificationContext";
import { useDelayedBadgeCheck } from "@/hooks/useDelayedBadgeCheck";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  actions?: Array<{
    type: string;
    data: any;
  }>;
  timestamp: string;
};

type LessonChatProps = {
  lessonSlug: string;
  lessonTitle: string;
  lessonDescription?: string | null;
  onRoadmapChange?: (roadmap: string | null, progress: { step: number; status: "pending" | "in_progress" | "completed" } | null) => void;
};

type CurrentActivity = {
  type: "test_question" | "timed_bugfix" | "choices" | "mini_test";
  data: any;
} | null;

export function LessonChat({ lessonSlug, lessonTitle, lessonDescription, onRoadmapChange }: LessonChatProps) {
  const { celebrate } = useCelebration();
  const { showBadges } = useBadgeNotification();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ step: number; status: "pending" | "in_progress" | "completed" } | null>(null);
  const [currentActivity, setCurrentActivity] = useState<CurrentActivity>(null);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [nextLesson, setNextLesson] = useState<{ href: string; label: string } | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasCelebratedRef = useRef(false);
  const modalDismissedRef = useRef(false);
  const lessonCompletedAtRef = useRef<Date | null>(null);

  // Loading messages rotation
  const loadingMessages = [
    "AI Öğretmen sizin için ders aşamalarını oluşturuyor...",
    "Ders içeriği planlanıyor...",
    "Öğrenme yol haritası hazırlanıyor...",
    "İnteraktif aktiviteler hazırlanıyor...",
  ];

  // Loading message rotation effect
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setLoadingMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  // Auto-scroll to bottom when messages change or assistant is typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, assistantTyping]);

  // Celebrate when lesson is completed (only once) and check for badges
  useEffect(() => {
    if (isCompleted && !hasCelebratedRef.current && messages.length > 0) {
      hasCelebratedRef.current = true;
      lessonCompletedAtRef.current = new Date(); // Store completion time
      
      // Trigger celebration
      celebrate({
        title: "🎉 Ders Tamamlandı!",
        message: `${lessonTitle} dersini başarıyla tamamladın!`,
        variant: "success",
        durationMs: 5000,
      });

      // Mark lesson as completed and check for badges
      const markLessonComplete = async () => {
        try {
          // Convert lessonSlug to API format
          const slugParts = lessonSlug.replace(/^\/education\/lessons\//, '').split('/');
          const response = await fetch(`/api/lessons/complete/${slugParts.join('/')}`, {
            method: "POST",
          });

          if (response.ok) {
            const data = await response.json();
            // Show badge notification if badges were earned (from API response)
            if (data.badgeResults?.newlyEarnedBadges?.length > 0) {
              console.log("[LessonChat] Badges earned from API, showing badge notification");
              showBadges(data.badgeResults.newlyEarnedBadges);
            }
            // Note: Delayed badge check hook will also check for badges
          }
        } catch (error) {
          console.error("Error marking lesson as completed:", error);
          // Don't show error to user, this is a background operation
        }
      };

      markLessonComplete();
    }
  }, [isCompleted, messages.length, lessonTitle, celebrate, lessonSlug, showBadges]);

  // Delayed badge check for lesson completion
  useDelayedBadgeCheck({
    activityType: "lesson",
    activityId: lessonSlug,
    completionTime: lessonCompletedAtRef.current,
    enabled: isCompleted && !!lessonCompletedAtRef.current,
    delayMs: 2500,
  });

  // Find next lesson when lesson is completed
  useEffect(() => {
    if (isCompleted && !nextLesson) {
      const findNextLesson = async () => {
        try {
          // Extract course and module info from lessonSlug
          const response = await fetch(`/api/lessons/next?lessonSlug=${encodeURIComponent(lessonSlug)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.nextLesson) {
              setNextLesson(data.nextLesson);
            }
          }
        } catch (err) {
          console.error("Error finding next lesson:", err);
        }
      };
      findNextLesson();
    }
  }, [isCompleted, lessonSlug, nextLesson]);

  // Show completion modal when lesson is completed (only once)
  // Wait 6-7 seconds after the last message (or longer if badges were shown)
  useEffect(() => {
    if (isCompleted && !showCompletionModal && !modalDismissedRef.current && messages.length > 0) {
      // Check if badges were earned by checking if badge modal might be showing
      // Badge modal shows for ~4 seconds per badge, so we'll wait a bit longer
      // Default wait time: 6-7 seconds as per user expectation
      const baseDelay = 7000; // 7 seconds
      
      // Wait for the base delay, then show completion modal
      const timer = setTimeout(() => {
        if (!modalDismissedRef.current) {
          console.log("[LessonChat] Showing completion modal");
          setShowCompletionModal(true);
        }
      }, baseDelay);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, showCompletionModal, messages.length]);

  // Load initial message and thread state
  useEffect(() => {
    const loadInitialState = async () => {
      setLoading(true);
      setError(null);
      setLoadingMessage(0);

      // Retry mekanizması için
      const MAX_RETRIES = 2;
      let lastError: Error | null = null;

      try {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          // Send initial message to start the lesson
          const response = await fetch("/api/ai/lesson-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonSlug,
              message: "Merhaba! Bu dersi öğrenmeye hazırım. Bana dersi anlatabilir misin?",
            }),
          });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: "Yanıt parse edilemedi" }));
          // API key eksikse daha açıklayıcı hata mesajı göster
          if (response.status === 503 && data.details?.includes("OPENAI_API_KEY")) {
            const errorMsg = data.isLocal 
              ? `AI servisi yapılandırılmamış.\n\nLütfen .env dosyanıza OPENAI_API_KEY ekleyin ve sunucuyu yeniden başlatın.\n\nDetaylar: ${data.hint || data.details}`
              : data.error || data.details || "AI servisi şu anda mevcut değil";
            throw new Error(errorMsg);
          }
          
          // Daha detaylı hata loglama
          console.error("[LessonChat] API Error (Initial Message):", {
            status: response.status,
            statusText: response.statusText,
            error: data.error,
            details: data.details,
            debug: data.debug,
            fullResponse: data,
          });
          
          const errorMessage = data.error || "AI yanıtı alınamadı";
          const errorDetails = data.details ? `\n\nDetay: ${data.details}` : "";
          const debugInfo = data.debug ? `\n\nDebug Bilgisi:\n${JSON.stringify(data.debug, null, 2)}` : "";
          throw new Error(`${errorMessage}${errorDetails}${debugInfo}`);
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
        
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          onRoadmapChange?.(data.roadmap, data.progress || null);
        }
        // Don't call onRoadmapChange(null, null) if roadmap is missing - preserve existing state

        if (data.progress) {
          setProgress(data.progress);
          // Always update roadmap with new progress
          const currentRoadmap = data.roadmap || roadmap;
          if (currentRoadmap) {
            onRoadmapChange?.(currentRoadmap, data.progress);
          }
        }

        // Smart completion detection (same logic as in handleSendMessage)
        let shouldComplete = false;
        
        if (data.isCompleted) {
          // API explicitly marked as completed, but verify all steps are done if roadmap exists
          const roadmapText = data.roadmap || roadmap;
          if (roadmapText && data.progress) {
            const stepMatches = roadmapText.match(/\d+[\.\)]/g);
            if (stepMatches && stepMatches.length > 0) {
              const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
              const lastStepNumber = Math.max(...allStepNumbers);
              
              if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                shouldComplete = true;
              } else {
                console.log("[LessonChat] Completion signal received but not all steps completed:", {
                  progressStep: data.progress.step,
                  lastStepNumber,
                  status: data.progress.status
                });
                shouldComplete = false;
              }
            } else {
              shouldComplete = true;
            }
          } else if (!roadmapText) {
            shouldComplete = true;
          } else {
            shouldComplete = false;
          }
        } else if (data.roadmap && data.progress) {
          const roadmapText = data.roadmap || roadmap;
          if (roadmapText) {
            const stepMatches = roadmapText.match(/\d+[\.\)]/g);
            if (stepMatches) {
              const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
              const lastStepNumber = Math.max(...allStepNumbers);
              
              if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                shouldComplete = true;
              }
            }
          }
        }
        
        if (shouldComplete) {
          setIsCompleted(true);
        }

        // Handle initial actions
        handleActions(data.actions || []);
        
          // Show continue button after first assistant message if no activity is set
          if (!data.actions || data.actions.length === 0 || 
              !data.actions.some((a: any) => ["timed_bugfix", "choices"].includes(a.type))) {
            setShowContinueButton(true);
          }
          
          // Başarılı, retry döngüsünden çık
          return;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          console.error(`Error loading initial message (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, err);
          
          // Retry yapılabilir hatalar
          const isRetryable = 
            (err instanceof Error && (
              err.message.includes("Failed to fetch") ||
              err.message.includes("NetworkError") ||
              err.message.includes("timeout") ||
              err.message.includes("rate_limit") ||
              err.message.includes("rate limit")
            )) ||
            (err instanceof TypeError && err.message.includes("fetch"));
          
          // Son deneme değilse ve retry yapılabilirse tekrar dene
          if (attempt < MAX_RETRIES && isRetryable) {
            const delay = (attempt + 1) * 2000; // 2s, 4s
            console.log(`Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // Retry yapılamaz veya max retry'a ulaşıldı
          // Daha açıklayıcı hata mesajları
          let errorMessage = "Bir hata oluştu";
          
          if (lastError instanceof Error) {
            errorMessage = lastError.message;
            
            // Network hataları için özel mesajlar
            if (lastError.message.includes("Failed to fetch") || lastError.message.includes("NetworkError")) {
              errorMessage = "Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.";
            } else if (lastError.message.includes("timeout") || lastError.message.includes("süresi aşıldı")) {
              errorMessage = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
            } else if (lastError.message.includes("rate_limit") || lastError.message.includes("rate limit")) {
              errorMessage = "Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.";
            }
          } else if (typeof err === "string") {
            errorMessage = err;
          }
          
          setError(errorMessage);
        }
        }
        
        // Tüm retry'lar başarısız oldu
        if (lastError) {
          console.error("All retry attempts failed:", lastError);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInitialState();
  }, [lessonSlug]);

  // Handle actions from AI response
  const handleActions = useCallback((actions: Array<{ type: string; data: any }>) => {
    if (!actions || actions.length === 0) return;
    
    for (const action of actions) {
      // Only interactive activities that require user input are set as currentActivity
      if (action.type === "timed_bugfix" && action.data) {
        setCurrentActivity({
          type: "timed_bugfix",
          data: action.data,
        });
      } else if (action.type === "choices" && action.data?.choices) {
        setCurrentActivity({
          type: "choices",
          data: { choices: action.data.choices },
        });
      }
      // mini_test actions are now rendered directly from message actions, no state management needed
    }
  }, []);

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
      setCurrentActivity(null);
      setShowContinueButton(false);
      setSending(true);
      setAssistantTyping(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/lesson-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            message: userMessage.content,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: "Yanıt parse edilemedi" }));
          // API key eksikse daha açıklayıcı hata mesajı göster
          if (response.status === 503 && data.details?.includes("OPENAI_API_KEY")) {
            const errorMsg = data.isLocal 
              ? `AI servisi yapılandırılmamış.\n\nLütfen .env dosyanıza OPENAI_API_KEY ekleyin ve sunucuyu yeniden başlatın.\n\nDetaylar: ${data.hint || data.details}`
              : data.error || data.details || "AI servisi şu anda mevcut değil";
            throw new Error(errorMsg);
          }
          const errorMessage = data.error || "AI yanıtı alınamadı";
          const errorDetails = data.details ? `\n\nDetay: ${data.details}` : "";
          const debugInfo = data.debug ? `\n\nDebug Bilgisi:\n${JSON.stringify(data.debug, null, 2)}` : "";
          console.error("[LessonChat] API Error (Send Message):", {
            status: response.status,
            statusText: response.statusText,
            error: errorMessage,
            details: data.details,
            debug: data.debug,
            fullResponse: data,
          });
          throw new Error(`${errorMessage}${errorDetails}${debugInfo}`);
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

        // Handle validation warnings
        if (data.validationWarning) {
          console.warn("[LessonChat] Validation warning received:", data.validationWarning);
          // Validation warning indicates format errors - actions might be empty
          // But we still want to show user that there was an issue
          if (data.validationWarning.hasFormatErrors && (!data.actions || data.actions.length === 0)) {
            // Show error to user but don't block flow
            setError(`Format hatası: ${data.validationWarning.message}. AI'ya düzeltme bildirimi gönderildi.`);
          }
        }

        if (data.roadmap) {
          setRoadmap(data.roadmap);
          onRoadmapChange?.(data.roadmap, data.progress || null);
        }
        // Don't call onRoadmapChange(null, null) if roadmap is missing - preserve existing state

        if (data.progress) {
          setProgress(data.progress);
          // Always update roadmap with new progress
          const currentRoadmap = data.roadmap || roadmap;
          if (currentRoadmap) {
            onRoadmapChange?.(currentRoadmap, data.progress);
          }
        }

        // Smart completion detection:
        // 1. API explicitly says completed (via [LESSON_COMPLETE] tag)
        // 2. BUT if roadmap exists, verify ALL steps are completed before accepting completion
        // 3. OR roadmap exists and all steps are completed (even without explicit completion signal)
        let shouldComplete = false;
        
        if (data.isCompleted) {
          // API explicitly marked as completed, but verify all steps are done if roadmap exists
          const roadmapText = data.roadmap || roadmap;
          if (roadmapText && data.progress) {
            // Parse all step numbers from roadmap
            const stepMatches = roadmapText.match(/\d+[\.\)]/g);
            if (stepMatches && stepMatches.length > 0) {
              const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
              const lastStepNumber = Math.max(...allStepNumbers);
              
              // Verify that we've reached the last step AND it's completed
              // Use === instead of >= to ensure we're exactly on the last step
              if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                shouldComplete = true;
              } else {
                // Not all steps completed yet, ignore the completion signal
                console.log("[LessonChat] Completion signal received but not all steps completed:", {
                  progressStep: data.progress.step,
                  lastStepNumber,
                  status: data.progress.status,
                  allStepNumbers
                });
                shouldComplete = false;
              }
            } else {
              // No roadmap steps found, trust the API completion signal
              shouldComplete = true;
            }
          } else if (!roadmapText) {
            // No roadmap exists, trust the API completion signal
            shouldComplete = true;
          } else {
            // Roadmap exists but no progress, don't complete yet
            shouldComplete = false;
          }
        } else if (data.roadmap && data.progress) {
          // Check if all roadmap steps are completed (even without explicit completion signal)
          const roadmapText = data.roadmap || roadmap;
          if (roadmapText) {
            const stepMatches = roadmapText.match(/\d+[\.\)]/g);
            if (stepMatches) {
              const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
              const lastStepNumber = Math.max(...allStepNumbers);
              
              // All steps are done only if:
              // 1. Progress step equals the last step number (not just >=)
              // 2. Status is "completed"
              if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                shouldComplete = true;
              }
            }
          }
        }
        
        if (shouldComplete) {
          setIsCompleted(true);
        }

        handleActions(data.actions || []);
        
        // Always ensure mini_test questions are shown even if parsing had issues
        // Check if there are mini_test actions in the message metadata
        if (data.actions && data.actions.length > 0) {
          const hasMiniTest = data.actions.some((a: any) => a.type === "mini_test");
          if (hasMiniTest) {
            // Force show continue button after a short delay to allow state to update
            setTimeout(() => {
              setShowContinueButton(true);
            }, 100);
          }
        }
        
        // Show continue button if no new activity is set
        if (!data.actions || data.actions.length === 0 || 
            !data.actions.some((a: any) => ["timed_bugfix", "choices"].includes(a.type))) {
          setShowContinueButton(true);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Mesaj gönderilemedi");
      } finally {
        setSending(false);
        setAssistantTyping(false);
      }
    },
    [messageInput, sending, lessonSlug, lessonTitle, celebrate, handleActions]
  );

  // Handle activity completion
  const handleActivityComplete = useCallback(
    async (result: any) => {
      setCurrentActivity(null);
      // Send result to AI
      const resultMessage = `Aktivite tamamlandı: ${JSON.stringify(result)}`;
      setMessageInput(resultMessage);
      // Automatically continue after a short delay
      setTimeout(() => {
        setShowContinueButton(true);
      }, 500);
    },
    []
  );

  // Handle continue button click
  const handleContinue = useCallback(async () => {
    setShowContinueButton(false);
    const continueMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: "Devam et",
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, continueMessage]);
    setSending(true);
    setAssistantTyping(true);
    setError(null);
    
    try {
      const response = await fetch("/api/ai/lesson-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonSlug,
          message: "Devam et",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Yanıt parse edilemedi" }));
        // API key eksikse daha açıklayıcı hata mesajı göster
        if (response.status === 503 && data.details?.includes("OPENAI_API_KEY")) {
          const errorMsg = data.isLocal 
            ? `AI servisi yapılandırılmamış.\n\nLütfen .env dosyanıza OPENAI_API_KEY ekleyin ve sunucuyu yeniden başlatın.\n\nDetaylar: ${data.hint || data.details}`
            : data.error || data.details || "AI servisi şu anda mevcut değil";
          throw new Error(errorMsg);
        }
        const errorMessage = data.error || "AI yanıtı alınamadı";
        throw new Error(errorMessage);
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

      if (data.roadmap) {
        setRoadmap(data.roadmap);
        onRoadmapChange?.(data.roadmap, data.progress || null);
      }

      if (data.progress) {
        setProgress(data.progress);
        // Update roadmap with new progress
        const currentRoadmap = data.roadmap || roadmap;
        if (currentRoadmap) {
          onRoadmapChange?.(currentRoadmap, data.progress);
        }
      }

      // Smart completion detection (same logic as in handleSendMessage)
      if (data.isCompleted) {
        // API explicitly marked as completed, but verify all steps are done if roadmap exists
        const roadmapText = data.roadmap || roadmap;
        if (roadmapText && data.progress) {
          const stepMatches = roadmapText.match(/\d+[\.\)]/g);
          if (stepMatches && stepMatches.length > 0) {
            const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
            const lastStepNumber = Math.max(...allStepNumbers);
            
            if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
              setIsCompleted(true);
            } else {
              console.log("[LessonChat] Completion signal in continue but not all steps completed");
            }
          } else {
            setIsCompleted(true);
          }
        } else if (!roadmapText) {
          setIsCompleted(true);
        }
      } else if (data.roadmap && data.progress) {
        // Check if all roadmap steps are completed (even without explicit completion signal)
        const roadmapText = data.roadmap || roadmap;
        if (roadmapText) {
          const stepMatches = roadmapText.match(/\d+[\.\)]/g);
          if (stepMatches) {
            const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
            const lastStepNumber = Math.max(...allStepNumbers);
            
            if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
              setIsCompleted(true);
            }
          }
        }
      }

      handleActions(data.actions || []);
      
      // Show continue button if no new interactive activity (mini_test questions don't block continue button)
      // mini_test questions are handled separately and don't prevent continue button from showing
      const hasInteractiveActivity = data.actions?.some((a: any) => ["fill_blank", "timed_bugfix", "choices"].includes(a.type));
      if (!hasInteractiveActivity) {
        setShowContinueButton(true);
      }
    } catch (err) {
      console.error("Error continuing:", err);
      setError(err instanceof Error ? err.message : "Devam edilemedi");
    } finally {
      setSending(false);
      setAssistantTyping(false);
    }
  }, [lessonSlug, lessonTitle, celebrate, handleActions, roadmap, onRoadmapChange]);

  // Handle test question answer
  const handleTestQuestionAnswer = useCallback(
    async (questionId: string, answer: string, messageId: string) => {
      // Mark question as answered
      setAnsweredQuestionIds((prev) => new Set(prev).add(questionId));
      
      const answerMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: `Cevabım: ${answer}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, answerMessage]);

      // Send answer to AI
      setSending(true);
      setAssistantTyping(true);
      try {
        const response = await fetch("/api/ai/lesson-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            message: answerMessage.content,
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

          if (data.roadmap) {
            setRoadmap(data.roadmap);
            onRoadmapChange?.(data.roadmap, data.progress || null);
          }

          if (data.progress) {
            setProgress(data.progress);
            const currentRoadmap = data.roadmap || roadmap;
            if (currentRoadmap) {
              onRoadmapChange?.(currentRoadmap, data.progress);
            }
          }

          // Smart completion detection
          if (data.isCompleted) {
            const roadmapText = data.roadmap || roadmap;
            if (roadmapText && data.progress) {
              const stepMatches = roadmapText.match(/\d+[\.\)]/g);
              if (stepMatches && stepMatches.length > 0) {
                const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
                const lastStepNumber = Math.max(...allStepNumbers);
                
                if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                  setIsCompleted(true);
                }
              } else {
                setIsCompleted(true);
              }
            } else if (!roadmapText) {
              setIsCompleted(true);
            }
          } else if (data.roadmap && data.progress) {
            const roadmapText = data.roadmap || roadmap;
            if (roadmapText) {
              const stepMatches = roadmapText.match(/\d+[\.\)]/g);
              if (stepMatches) {
                const allStepNumbers = stepMatches.map((m: string) => parseInt(m.replace(/[\.\)]/g, '')));
                const lastStepNumber = Math.max(...allStepNumbers);
                
                if (data.progress.step === lastStepNumber && data.progress.status === "completed") {
                  setIsCompleted(true);
                }
              }
            }
          }

          handleActions(data.actions || []);
          
          // Show continue button if no new interactive activity
          const hasInteractiveActivity = data.actions?.some((a: any) => ["fill_blank", "timed_bugfix", "choices"].includes(a.type));
          if (!hasInteractiveActivity) {
            setShowContinueButton(true);
          }
        } else {
          const data = await response.json().catch(() => ({ error: "Yanıt parse edilemedi" }));
          let errorMessage: string;
          if (response.status === 503 && data.details?.includes("OPENAI_API_KEY")) {
            errorMessage = data.isLocal 
              ? `AI servisi yapılandırılmamış.\n\nLütfen .env dosyanıza OPENAI_API_KEY ekleyin ve sunucuyu yeniden başlatın.\n\nDetaylar: ${data.hint || data.details}`
              : data.error || data.details || "AI servisi şu anda mevcut değil";
          } else {
            errorMessage = data.error || "AI yanıtı alınamadı";
          }
          const errorDetails = data.details ? `\n\nDetay: ${data.details}` : "";
          const debugInfo = data.debug ? `\n\nDebug Bilgisi:\n${JSON.stringify(data.debug, null, 2)}` : "";
          console.error("[LessonChat] API Error (Test Answer):", {
            status: response.status,
            statusText: response.statusText,
            error: errorMessage,
            details: data.details,
            debug: data.debug,
            fullResponse: data,
          });
          setError(`${errorMessage}${errorDetails}${debugInfo}`);
        }
      } catch (err) {
        console.error("Error processing answer:", err);
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setSending(false);
        setAssistantTyping(false);
      }
    },
    [lessonSlug, handleActions, roadmap, onRoadmapChange]
  );

  // Handle choice selection
  const handleChoiceSelect = useCallback(
    async (choice: string) => {
      setCurrentActivity(null);
      setShowContinueButton(true);
    },
    []
  );

  // Clean message content
  const cleanMessageContent = useCallback((content: string): string => {
    if (!content) return content;
    
    let cleaned = content;
    
    // Remove action tags
    cleaned = cleaned.replace(/\[ROADMAP:[^\]]+\]/gi, '');
    cleaned = cleaned.replace(/\[STEP_COMPLETE:[^\]]+\]/gi, '');
    cleaned = cleaned.replace(/\[LESSON_COMPLETE\]/gi, '');
    cleaned = cleaned.replace(/\[TEST_QUESTION:[^\]]+\]/gi, '');
    cleaned = cleaned.replace(/\[FILL_BLANK:[^\]]+\]/gi, '');
    cleaned = cleaned.replace(/\[TIMED_BUGFIX:[^\]]+\]/gi, '');
    cleaned = cleaned.replace(/\[CODE_BLOCK:[^\]]+\]/gi, '');

    // Clean up multiple newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  }, []);

  // Helper function to generate a unique key for a question
  const getQuestionKey = useCallback((q: any) => {
    const qData = q?.question || q;
    const text = (qData?.text || qData?.question || "").trim().toLowerCase();
    const options = (qData?.options || []).map((opt: any) => 
      (typeof opt === "string" ? opt : opt?.text || opt?.label || "").trim().toLowerCase()
    ).filter(Boolean).sort().join("|");
    return `${text}::${options}`;
  }, []);

  // Convert messages to ChatMessage format with code blocks and test questions
  // Also include pending test questions in the message flow
  // IMPORTANT: Filter duplicate test questions across ALL messages before assigning to metadata
  const chatMessages = useMemo(() => {
    // First, collect all test questions from all messages to detect duplicates
    const allTestQuestions: Array<{ question: any; messageId: string; originalIndex: number }> = [];
    messages.forEach((msg) => {
      const testQuestions = msg.actions?.filter((action) => action.type === "test_question" || action.type === "mini_test").map((action) => action.data) || [];
      testQuestions.forEach((q: any, idx: number) => {
        allTestQuestions.push({
          question: q,
          messageId: msg.id,
          originalIndex: idx,
        });
      });
    });

    // Filter duplicates: keep only the first occurrence of each unique question
    const seenKeys = new Set<string>();
    const uniqueTestQuestions = allTestQuestions.filter((item) => {
      const key = getQuestionKey(item.question);
      if (seenKeys.has(key)) {
        return false; // Duplicate, skip
      }
      seenKeys.add(key);
      return true; // First occurrence, keep
    });

    // Create a map: messageId -> array of unique test questions for that message
    const testQuestionsByMessage = new Map<string, any[]>();
    uniqueTestQuestions.forEach((item) => {
      if (!testQuestionsByMessage.has(item.messageId)) {
        testQuestionsByMessage.set(item.messageId, []);
      }
      testQuestionsByMessage.get(item.messageId)!.push(item.question);
    });

    // Now create chatMessages with filtered test questions
    return messages.map((msg) => {
      // Extract code blocks and test questions from actions
      const codeBlocks = msg.actions?.filter((action) => action.type === "code_block").map((action) => action.data) || [];
      // Use filtered test questions (only unique ones for this message)
      const testQuestions = testQuestionsByMessage.get(msg.id) || [];
      
      return {
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
          name: msg.role === "user" ? "Siz" : "AI Öğretmen",
          profileImage: msg.role === "assistant" ? "/Photos/AiTeacher/teacher.jpg" : null, // Teacher image as avatar
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
        // Custom metadata for lesson-specific content
        metadata: {
          codeBlocks,
          testQuestions,
        },
      };
    });
  }, [messages, getQuestionKey, cleanMessageContent]);

  // Use chatMessages directly - don't modify the message flow
  // Mini test questions will be rendered separately at the end of the message flow
  const messagesWithTestQuestions = chatMessages;



  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative" ref={messagesContainerRef}>
        <div className="relative h-full">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '1s' }} />
              </div>
              <div className="text-center space-y-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {loadingMessages[loadingMessage]}
                </p>
                <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"
                    style={{ 
                      width: '60%',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden h-full max-h-full min-h-0 px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6 space-y-3 sm:space-y-4 md:space-y-5">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-3 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-10 w-10 text-blue-500" />
                <p className="font-medium">Ders sohbeti başlatılıyor...</p>
                <p className="text-sm">AI öğretmen hazırlanıyor</p>
              </div>
            ) : (
              <>
                {messagesWithTestQuestions.map((chatMsg) => {
                  const originalMsg = messages.find((m) => m.id === chatMsg.id);
                  const isOwn = chatMsg.userId === "current-user";
                  const isAI = chatMsg.sender.id === "assistant";
                  const codeBlocks = (chatMsg.metadata as any)?.codeBlocks || [];
                  const testQuestions = (chatMsg.metadata as any)?.testQuestions || [];
                  
                  // Only render message bubble if there's actual content or code blocks
                  // Test questions are rendered separately inline, so don't count them here
                  const hasContent = chatMsg.content && chatMsg.content.trim().length > 0;
                  const hasCodeBlocks = codeBlocks.length > 0;
                  const hasTestQuestions = testQuestions.length > 0;
                  // Exclude test questions from shouldRenderMessage to prevent empty chatbox
                  const shouldRenderMessage = hasContent || hasCodeBlocks;
                  
                  // Don't render anything if there's no content to show (prevent empty chatbox)
                  // But still render the container if there are test questions to show inline
                  if (!shouldRenderMessage && !hasTestQuestions) {
                    return null;
                  }
                  
                  
                  return (
                    <div key={chatMsg.id} className="space-y-3">
                      {/* Message Bubble - Only render if there's content */}
                      {shouldRenderMessage && (
                        <div
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
                                  alt="AI Öğretmen"
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
                            {hasContent && (
                              isAI ? (
                                <MessageContent 
                                  content={chatMsg.content} 
                                  isAI={true}
                                  className="text-gray-800 dark:text-gray-200"
                                />
                              ) : (
                                <p className={cn(
                                  "whitespace-pre-wrap break-words leading-relaxed",
                                  isOwn ? "text-white/90 text-sm sm:text-base" : "text-gray-800 dark:text-gray-200 text-sm sm:text-base"
                                )}>
                                  {chatMsg.content}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Code Blocks - Rendered as part of message flow, not separate chatbox */}
                      {codeBlocks.length > 0 && (
                        <div className={cn("space-y-3", isAI ? "ml-20" : "ml-0", isOwn ? "mr-0" : "")}>
                          {codeBlocks.map((codeBlock: any, index: number) => {
                            const isEditable = codeBlock.editable && !codeBlock.readonly;
                            const isRunnable = codeBlock.runnable;
                            
                            if (isEditable || isRunnable) {
                              return (
                                <div
                                  key={`code-editor-${chatMsg.id}-${index}`}
                                  className="flex w-full items-end gap-1.5 relative justify-start"
                                >
                                  {isAI && (
                                    <div className="absolute -bottom-0.5 -left-1 z-10">
                                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                                        <Image
                                          src="/Photos/AiTeacher/teacher.jpg"
                                          alt="AI Öğretmen"
                                          fill
                                          className="object-cover"
                                          sizes="48px"
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
                                      "rounded-xl sm:rounded-2xl bg-gray-950/90 border border-gray-800 overflow-hidden max-w-full sm:max-w-[70%] md:max-w-[65%]",
                                      isAI ? "ml-12 sm:ml-14" : ""
                                    )}
                                    style={{ minWidth: 0 }}
                                  >
                                    <LessonCodeEditor
                                      id={`${chatMsg.id}-${index}`}
                                      language={codeBlock.language}
                                      code={codeBlock.code}
                                      editable={isEditable}
                                      runnable={isRunnable}
                                      readonly={codeBlock.readonly}
                                      lessonSlug={lessonSlug}
                                      onCodeChange={(newCode) => {
                                        console.log("Code changed:", newCode);
                                      }}
                                      onRun={async (code) => {
                                        console.log("Running code:", code);
                                        alert("Kod çalıştırma özelliği yakında eklenecek!");
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <div
                                key={`code-block-${chatMsg.id}-${index}`}
                                className="flex w-full items-end gap-1.5 relative justify-start"
                              >
                                {isAI && (
                                  <div className="absolute -bottom-0.5 -left-1 z-10">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                                      <Image
                                        src="/Photos/AiTeacher/teacher.jpg"
                                        alt="AI Öğretmen"
                                        fill
                                        className="object-cover"
                                        sizes="48px"
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
                                    "rounded-xl sm:rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 overflow-hidden max-w-full sm:max-w-[70%] md:max-w-[65%]",
                                    isAI ? "ml-12 sm:ml-14" : ""
                                  )}
                                >
                                  <CodeBlock
                                    code={codeBlock.code}
                                    language={codeBlock.language}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Mini Test Questions - Rendered as cards after the message */}
                      {hasTestQuestions && testQuestions.length > 0 && (
                        <div className={cn("space-y-3", isAI ? "ml-20" : "ml-0", isOwn ? "mr-0" : "")}>
                          {testQuestions
                            // Duplicates are already filtered in chatMessages creation, so just render them
                            .map((testQuestion: any, questionIndex: number) => {
                            // Generate unique ID for this question
                            const questionId = `${chatMsg.id}-test-${questionIndex}`;
                            const isAnswered = answeredQuestionIds.has(questionId);
                            
                            return (
                              <div key={questionId} className="flex w-full items-end gap-1.5 relative justify-start">
                                {isAI && (
                                  <div className="absolute -bottom-0.5 -left-1 z-10">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                                      <Image
                                        src="/Photos/AiTeacher/teacher.jpg"
                                        alt="AI Öğretmen"
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                        priority={false}
                                        unoptimized={true}
                                        onError={(e) => {
                                          console.error("Failed to load AI teacher image:", e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className={cn("max-w-full sm:max-w-[70%] md:max-w-[65%]", isAI ? "ml-12 sm:ml-14" : "")}>
                                  <TestQuestionChatbox
                                    question={testQuestion}
                                    onAnswer={(answer) => handleTestQuestionAnswer(questionId, answer, chatMsg.id)}
                                    disabled={sending || isAnswered}
                                    isAnswered={isAnswered}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                    </div>
                  );
                })}
              </>
            )}
            
            {/* Typing indicator - Enhanced for teacher */}
            {assistantTyping && (
              <div className="flex w-full items-end gap-1.5 relative justify-start">
                <div className="absolute -bottom-0.5 -left-1 z-10">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                    <Image
                      src="/Photos/AiTeacher/teacher.jpg"
                      alt="AI Öğretmen"
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority={false}
                      unoptimized={true}
                      onError={(e) => {
                        console.error("Failed to load AI teacher image:", e);
                      }}
                    />
                  </div>
                </div>
                <div className="ml-12 sm:ml-16 pr-4 sm:pr-6 inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs sm:text-sm">AI Öğretmen</span>
                    <span className="text-[10px] sm:text-xs opacity-80">Düşünüyor...</span>
                  </div>
                </div>
              </div>
            )}
            
            
            <div ref={messagesEndRef} />
          </div>
          )}
        </div>
      </div>

      {/* Current Activity - Only for interactive activities (not test questions) */}
      {currentActivity && (
        <div className="px-6 pb-4">
          {currentActivity.type === "timed_bugfix" && (
            <TimedBugfix
              code={currentActivity.data.code}
              timeSeconds={currentActivity.data.timeSeconds}
              onComplete={(success, timeSpent) => handleActivityComplete({ type: "timed_bugfix", success, timeSpent })}
            />
          )}

          {currentActivity.type === "choices" && (
            <Card className="border-gray-200 bg-gray-50/60 dark:border-gray-800/60 dark:bg-gray-800/40">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {currentActivity.data.choices?.map((choice: string, index: number) => (
                    <Button
                      key={index}
                      onClick={() => handleChoiceSelect(choice)}
                      variant="outline"
                      className="w-full justify-start text-left"
                      disabled={sending}
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Composer with Continue Button */}
      <div className="border-t border-gray-200/70 dark:border-gray-800/60 px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white/90 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="rounded-2xl sm:rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/70 shadow-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={currentActivity ? "Lütfen yukarıdaki aktiviteyi tamamlayın..." : isCompleted ? "Ders tamamlandı!" : "Sorunu yaz veya ders hakkında bilgi iste..."}
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 overflow-hidden",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500"
                )}
                disabled={sending || !!currentActivity || isCompleted}
              />
            </div>
            {/* Continue Button - Next to Send button */}
            {showContinueButton && !currentActivity && !sending && !assistantTyping && !isCompleted && (
              <Button
                type="button"
                onClick={handleContinue}
                variant="gradient"
                size="lg"
                className={cn(
                  "min-w-[100px] sm:min-w-[120px] md:min-w-[140px] h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base font-semibold rounded-full shrink-0",
                  "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600",
                  "hover:from-purple-700 hover:via-pink-700 hover:to-rose-700",
                  "text-white shadow-lg",
                  "animate-pulse hover:animate-none",
                  "relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
                )}
                disabled={sending || assistantTyping}
              >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-1.5 md:mr-2" />
                <span className="hidden sm:inline">Devam Et</span>
                <span className="sm:hidden">Devam</span>
              </Button>
            )}
            <Button
              type="submit"
              variant="gradient"
              size="md"
              disabled={!messageInput.trim() || sending || !!currentActivity || isCompleted}
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

      {/* Error Overlay */}
      {error && (
        <div className="fixed top-6 right-6 z-50 bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/40 px-4 py-3 rounded-xl backdrop-blur max-w-2xl shadow-lg">
          <div className="font-semibold mb-2">Hata Oluştu</div>
          <div className="text-sm whitespace-pre-wrap break-words">{error}</div>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-sm text-red-700 dark:text-red-400 hover:underline font-medium"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Ders Tamamlandı!</h2>
              <p className="text-purple-100">
                {lessonTitle} dersini başarıyla tamamladın!
              </p>
            </div>
            <div className="p-6 space-y-4">
              {nextLesson ? (
                <>
                  <p className="text-gray-700 dark:text-gray-300 text-center">
                    Bir sonraki derse geçmek ister misin?
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {nextLesson.label}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bir sonraki ders
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        // Close modal first to prevent re-opening
                        modalDismissedRef.current = true;
                        setShowCompletionModal(false);
                        
                        // nextLesson.href format: "/education/lessons/..." 
                        // We need to convert it to chat route: "/education/lessons/chat/..."
                        let nextPath = nextLesson.href;
                        if (nextPath.startsWith('/education/lessons/')) {
                          // Extract the lesson path after /education/lessons/
                          const lessonPath = nextPath.replace('/education/lessons/', '');
                          // Convert to chat route: /education/lessons/chat/...
                          nextPath = `/education/lessons/chat/${lessonPath}`;
                        } else {
                          // Fallback: assume it's a relative path
                          nextPath = `/education/lessons/chat/${nextPath.replace(/^\//, '')}`;
                        }
                        
                        // Navigate immediately
                        router.push(nextPath);
                      }}
                      variant="gradient"
                      className="flex-1"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Bir Sonraki Derse Geç
                    </Button>
                    <Button
                      onClick={() => {
                        modalDismissedRef.current = true;
                        setShowCompletionModal(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Şimdi Değil
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 dark:text-gray-300 text-center">
                    Harika bir iş çıkardın! Dersini başarıyla tamamladın.
                  </p>
                  <Button
                    onClick={() => {
                      modalDismissedRef.current = true;
                      setShowCompletionModal(false);
                    }}
                    variant="gradient"
                    className="w-full"
                  >
                    Tamam
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
