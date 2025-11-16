/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  MessageSquare,
  AlertCircle,
  Eye,
  CheckCircle,
  X,
  Edit,
  Save,
  Filter,
  Sparkles,
  Loader2,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

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

interface Stats {
  total: number;
  notReviewed: number;
  reviewed: number;
  understood: number;
}

interface TutorChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export default function TutorPage() {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    notReviewed: 0,
    reviewed: 0,
    understood: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "not_reviewed" | "reviewed" | "understood">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<TutorChatMessage[]>(() => [
    {
      role: "assistant",
      content: "Merhaba! Nasıl yardımcı olabilirim?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lessonPlan, setLessonPlan] = useState<{
    recommendedCourses: string[];
    learningPath: string[];
    message: string;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const formatChatTime = (value: string) =>
    new Date(value).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) {
      return;
    }

    const userMessage: TutorChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    const pendingMessages = [...chatMessages, userMessage];
    setChatMessages(pendingMessages);
    setChatInput("");
    setChatError(null);
    setChatLoading(true);

    try {
      // Yeni smart-teacher endpoint'ini kullan
      // Sadece son kullanıcı mesajını gönder (conversation history thread'de saklanıyor)
      const lastUserMessage = userMessage.content;
      
      const response = await fetch("/api/ai/smart-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lastUserMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI yanıtı alınamadı");
      }

      if (data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      // Context bilgilerini göster (opsiyonel)
      if (data.context) {
        // Zayıf konular ve öğrenme ilerlemesi bilgisi mevcut
        // İsterseniz bunları UI'da gösterebilirsiniz
      }
    } catch (error) {
      console.error("Error sending tutor message:", error);
      setChatError(
        error instanceof Error ? error.message : "Mesaj gönderilemedi."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!chatEndRef.current) {
      return;
    }

    chatEndRef.current.scrollIntoView({
      behavior: chatMessages.length > 1 ? "smooth" : "auto",
    });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    fetchWrongQuestions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [wrongQuestions]);

  const fetchWrongQuestions = async () => {
    try {
      const response = await fetch("/api/education/wrong-questions");
      const data = await response.json();
      setWrongQuestions(data.wrongQuestions || []);
    } catch (error) {
      console.error("Error fetching wrong questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = wrongQuestions.length;
    const notReviewed = wrongQuestions.filter((q) => q.status === "not_reviewed").length;
    const reviewed = wrongQuestions.filter((q) => q.status === "reviewed").length;
    const understood = wrongQuestions.filter((q) => q.status === "understood").length;

    setStats({ total, notReviewed, reviewed, understood });
  };

  const updateStatus = async (id: string, status: "not_reviewed" | "reviewed" | "understood") => {
    try {
      const response = await fetch("/api/education/wrong-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();
      if (response.ok) {
        setWrongQuestions(
          wrongQuestions.map((q) => (q.id === id ? { ...q, status: data.wrongQuestion.status } : q))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateNotes = async (id: string) => {
    try {
      const response = await fetch("/api/education/wrong-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: editNotes }),
      });

      const data = await response.json();
      if (response.ok) {
        setWrongQuestions(
          wrongQuestions.map((q) => (q.id === id ? { ...q, notes: data.wrongQuestion.notes } : q))
        );
        setEditingId(null);
        setEditNotes("");
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const startEditing = (question: WrongQuestion) => {
    setEditingId(question.id);
    setEditNotes(question.notes || "");
  };

  const filteredQuestions =
    filter === "all"
      ? wrongQuestions
      : wrongQuestions.filter((q) => q.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_reviewed":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "reviewed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "understood":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_reviewed":
        return "Gözden Geçirilmemiş";
      case "reviewed":
        return "Gözden Geçirilmiş";
      case "understood":
        return "Anlaşıldı";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Kişisel Öğretmen
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Yanlış sorularınızı inceleyin ve öğrenin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <AlertCircle className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Toplam Yanlış Soru
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <Eye className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.notReviewed}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Gözden Geçirilmemiş
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.reviewed}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Gözden Geçirilmiş
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover className="overflow-hidden group animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          <CardContent className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md md:group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stats.understood}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Anlaşıldı
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Section */}
      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              AI Mentor Sohbeti
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test performansına göre kişisel öneriler ve çalışma planı alın.
            </p>
          </div>
          {chatLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Yapay zekâ düşünüyor...
            </div>
          )}
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {chatError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{chatError}</span>
              </div>
            )}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex h-full min-h-[320px] max-h-[65vh] flex-col gap-4 overflow-y-auto p-4 sm:max-h-[420px]">
                {chatMessages.length === 0 && !chatLoading && !chatError && (
                  <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                    <Sparkles className="mb-3 h-10 w-10 text-blue-500 dark:text-blue-300" />
                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                      AI mentorunuzu davet edin
                    </p>
                    <p>
                      Sorularınızı yazın; hangi konularda gelişmeniz gerektiğini birlikte planlayalım.
                    </p>
                  </div>
                )}

                {chatMessages.map((message, index) => (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
                          : "bg-white text-gray-800 dark:bg-gray-900/70 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                      <span
                        className={`mt-2 block text-xs ${
                          message.role === "user"
                            ? "text-blue-100/80"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatChatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Yanıt hazırlanıyor...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60 sm:flex-row sm:items-end">
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Örneğin: 'Temel veri yapılarında nasıl ilerlemeliyim?'"
                rows={chatInput.split("\n").length > 2 ? 3 : 2}
                className="w-full flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100"
              />
              <Button
                variant="gradient"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
              >
                {chatLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gönderiliyor
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Gönder
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-indigo-900/20">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-blue-700 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              Kişisel Öğrenme Planı
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {lessonPlan?.message?.trim()
                ? lessonPlan.message
                : "AI analizi tamamlandığında önerilen kurslar ve öğrenme adımları burada görünecek."}
            </p>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Önerilen Kurslar
                </p>
                {lessonPlan && lessonPlan.recommendedCourses?.length > 0 ?
                  (
                    <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-200">
                      {lessonPlan.recommendedCourses.map((course, index) => (
                        <li key={`course-${index}`} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-blue-500 dark:text-blue-300" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Henüz kurs önerisi yok.
                    </p>
                  )}
              </div>

              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Öğrenme Adımları
                </p>
                {lessonPlan && lessonPlan.learningPath?.length > 0 ?
                  (
                    <ol className="mt-2 space-y-2 text-gray-700 dark:text-gray-200">
                      {lessonPlan.learningPath.map((step, index) => (
                        <li key={`step-${index}`} className="flex items-start gap-2">
                          <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-600 text-center text-xs font-semibold text-white dark:bg-blue-500">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Öncelikli öğrenme adımları burada listelenecek.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yanlış Sorular */}
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yanlış Sorularım</CardTitle>
          <div className="flex gap-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Tümü</option>
              <option value="not_reviewed">Gözden Geçirilmemiş</option>
              <option value="reviewed">Gözden Geçirilmiş</option>
              <option value="understood">Anlaşıldı</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? "Henüz yanlış sorunuz yok"
                  : `Bu filtreye uygun soru bulunamadı`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => {
                const course = question.quizAttempt.quiz.course;
                const field = course?.field || "Genel";
                const subCategory = course?.subCategory || "Genel";
                const topic = question.quizAttempt.quiz.topic || "Genel";
                const quizTitle = question.quizAttempt.quiz.title;
                
                return (
                  <Card key={question.id} variant="outlined" className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                question.status
                              )}`}
                            >
                              {getStatusLabel(question.status)}
                            </span>
                          </div>
                          {/* Category Path */}
                          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-blue-200/50 dark:border-gray-600/50">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex-wrap">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                                {field}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500">→</span>
                              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md">
                                {subCategory}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500">→</span>
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md">
                                {topic}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500">→</span>
                              <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-md">
                                {quizTitle}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg">
                            Soru
                          </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {question.questionText}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Sizin Cevabınız
                            </p>
                            <p className="text-sm font-medium text-red-700 dark:text-red-300">
                              {question.userAnswer}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Doğru Cevap
                            </p>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">
                              {question.correctAnswer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {editingId === question.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Notlarınızı buraya yazın..."
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateNotes(question.id)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(null);
                              setEditNotes("");
                            }}
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {question.notes && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {question.notes}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(question)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {question.notes ? "Notları Düzenle" : "Not Ekle"}
                          </Button>
                          {question.status !== "not_reviewed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(question.id, "not_reviewed")}
                            >
                              Gözden Geçirilmemiş Yap
                            </Button>
                          )}
                          {question.status !== "reviewed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(question.id, "reviewed")}
                            >
                              Gözden Geçirildi İşaretle
                            </Button>
                          )}
                          {question.status !== "understood" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(question.id, "understood")}
                            >
                              Anlaşıldı İşaretle
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

