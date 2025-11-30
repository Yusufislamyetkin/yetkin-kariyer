/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Eye,
  CheckCircle,
  Edit,
  Save,
  Filter,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
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
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);


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
    setUpdatingStatusId(id);
    
    // Optimistic update - save previous state for rollback
    const previousQuestions = [...wrongQuestions];
    setWrongQuestions(
      wrongQuestions.map((q) => (q.id === id ? { ...q, status } : q))
    );

    try {
      const response = await fetch("/api/education/wrong-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update with server response
        setWrongQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: data.wrongQuestion.status } : q))
        );
      } else {
        // Rollback on error
        setWrongQuestions(previousQuestions);
        throw new Error(data.error || "Durum güncellenemedi");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Rollback on error
      setWrongQuestions(previousQuestions);
    } finally {
      setUpdatingStatusId(null);
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

      {/* AI Öğretmen Selin ile Öğren Butonu */}
      <Card variant="elevated" className="border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 via-pink-50/50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 pt-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/30 overflow-hidden">
                    <img
                      src="/Photos/AiTeacher/teacher.jpg"
                      alt="AI Öğretmen Selin"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = '<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>';
                        }
                      }}
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-3 h-3 text-yellow-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Soruları AI Öğretmen Selin ile Öğren
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yanlış sorularını adım adım anlat, her birini anlaşıldı olarak işaretle
                  </p>
                </div>
              </div>
            </div>
            <Link href="/education/tutor/chat">
              <Button
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <span>Başla</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Yanlış Sorular */}
      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Yanlış Sorularım</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredQuestions.length} soru gösteriliyor
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 self-center" />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="text-xs sm:text-sm"
              >
                Tümü ({stats.total})
              </Button>
              <Button
                variant={filter === "not_reviewed" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("not_reviewed")}
                className="text-xs sm:text-sm"
              >
                Gözden Geçirilmemiş ({stats.notReviewed})
              </Button>
              <Button
                variant={filter === "reviewed" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("reviewed")}
                className="text-xs sm:text-sm"
              >
                Gözden Geçirilmiş ({stats.reviewed})
              </Button>
              <Button
                variant={filter === "understood" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("understood")}
                className="text-xs sm:text-sm"
              >
                Anlaşıldı ({stats.understood})
              </Button>
            </div>
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
                            disabled={updatingStatusId === question.id}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {question.notes ? "Notları Düzenle" : "Not Ekle"}
                          </Button>
                          
                          {/* Durum butonları - sadece ilerleyen durumları göster */}
                          {question.status === "not_reviewed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(question.id, "reviewed")}
                              disabled={updatingStatusId === question.id}
                            >
                              {updatingStatusId === question.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Güncelleniyor...
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Gözden Geçirildi İşaretle
                                </>
                              )}
                            </Button>
                          )}
                          
                          {question.status === "reviewed" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatus(question.id, "not_reviewed")}
                                disabled={updatingStatusId === question.id}
                              >
                                {updatingStatusId === question.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Güncelleniyor...
                                  </>
                                ) : (
                                  "Geri Al"
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateStatus(question.id, "understood")}
                                disabled={updatingStatusId === question.id}
                              >
                                {updatingStatusId === question.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Güncelleniyor...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Anlaşıldı İşaretle
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          
                          {question.status === "understood" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(question.id, "reviewed")}
                              disabled={updatingStatusId === question.id}
                            >
                              {updatingStatusId === question.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Güncelleniyor...
                                </>
                              ) : (
                                "Geri Al"
                              )}
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

