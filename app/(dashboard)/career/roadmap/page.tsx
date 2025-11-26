"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  RefreshCcw,
  Download,
  Sparkles,
  Target,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CareerPlanQuestionnaire } from "../_components/CareerPlanQuestionnaire";

interface CareerPlan {
  goals: string[];
  roadmap: Array<{
    stage: string;
    title: string;
    tasks: string[];
    milestones: string[];
  }>;
  recommendedCourses: string[];
  skillsToDevelop: string[];
  timeline: string;
  summary: string;
}

const normalizePlan = (raw: any): CareerPlan => ({
  goals: Array.isArray(raw?.goals) ? raw.goals : [],
  roadmap: Array.isArray(raw?.roadmap) ? raw.roadmap : [],
  recommendedCourses: Array.isArray(raw?.recommendedCourses)
    ? raw.recommendedCourses
    : [],
  skillsToDevelop: Array.isArray(raw?.skillsToDevelop)
    ? raw.skillsToDevelop
    : [],
  timeline: typeof raw?.timeline === "string" ? raw.timeline : "",
  summary: typeof raw?.summary === "string" ? raw.summary : "",
});

interface QuestionnaireData {
  specialization: string;
  careerGoal: string;
  timeline: string;
  skillLevel: string;
  technologies?: string[];
  workPreference: string;
  industryInterests?: string[];
}

export default function CareerRoadmapPage() {
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await fetch("/api/career/plan");
      const data = await response.json();
      if (data.plan) {
        setPlan(normalizePlan(data.plan));
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (questionnaire?: QuestionnaireData) => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-career-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionnaire: questionnaire || questionnaireData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Check if plan was actually generated successfully
        if (data.plan && data.plan.summary && !data.plan.summary.includes("oluşturulamadı") && !data.plan.summary.includes("sorun oluştu")) {
          setPlan(normalizePlan(data.plan));
          setShowQuestionnaire(false);
          if (questionnaire) {
            setQuestionnaireData(questionnaire);
          }
        } else {
          // Plan was returned but indicates an error
          const errorMsg = data.plan?.summary || "Plan oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.";
          alert(errorMsg);
          // Still set the plan so user can see what was generated
          if (data.plan) {
            setPlan(normalizePlan(data.plan));
          }
        }
      } else {
        // Handle different error status codes
        let errorMessage = "Plan oluşturulamadı.";
        if (response.status === 401) {
          errorMessage = "Oturum açmanız gerekiyor. Lütfen giriş yapın.";
        } else if (response.status === 503) {
          errorMessage = "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
        } else if (response.status === 500) {
          errorMessage = data.error || "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        } else {
          errorMessage = data.error || "Plan oluşturulurken bir hata oluştu.";
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      const errorMessage = error instanceof Error 
        ? `Bağlantı hatası: ${error.message}` 
        : "Plan oluşturulurken beklenmeyen bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.";
      alert(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    setQuestionnaireData(data);
    handleGeneratePlan(data);
  };

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleGeneratePlanClick = () => {
    handleGeneratePlan();
  };

  const handleExportPlan = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kariyer-plani.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[300px] items-center justify-center text-gray-600 dark:text-gray-300">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Kariyer planı yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (showQuestionnaire) {
    return (
      <div className="container mx-auto px-4 py-12">
        <CareerPlanQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onCancel={() => setShowQuestionnaire(false)}
        />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="elevated" className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Kariyer planı bulunamadı</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Henüz bir plan oluşturulmamış. Size özel bir kariyer planı oluşturmak için önce birkaç soru cevaplayalım.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="gradient"
              className="inline-flex items-center gap-2"
              onClick={handleStartQuestionnaire}
              disabled={generating}
            >
              <Sparkles className="h-4 w-4" />
              Kariyer Planı Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              Kariyer Planım
            </CardTitle>
            {plan.timeline && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <ArrowRight className="h-3 w-3" />
                Hedef zaman çizelgesi: {plan.timeline}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportPlan}
            >
              <Download className="h-4 w-4" />
              Planı Dışa Aktar
            </Button>
            <Button
              variant="gradient"
              className="flex items-center gap-2"
              onClick={handleGeneratePlanClick}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yeniden oluşturuluyor...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Planı yenile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/15 dark:text-blue-100">
            {plan.summary ||
              "AI özeti henüz mevcut değil. Planı yenileyerek özet oluşturabilirsiniz."}
          </div>
        </CardContent>
      </Card>

      {plan.skillsToDevelop.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Öncelikli Beceriler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plan.skillsToDevelop.map((skill, index) => (
                <span
                  key={`skill-${index}`}
                  className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {plan.goals.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Hedefler</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {plan.goals.map((goal, index) => (
                <li
                  key={`goal-${index}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                >
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {plan.roadmap.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Kariyer Yol Haritası</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {plan.roadmap.map((stage, index) => (
              <div
                key={`stage-${index}`}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stage.stage}: {stage.title}
                  </h3>
                </div>
                {stage.tasks && stage.tasks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Kilit Görevler
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {stage.tasks.map((task, taskIndex) => (
                        <li key={`task-${index}-${taskIndex}`}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {stage.milestones && stage.milestones.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Kilometre Taşları
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {stage.milestones.map((milestone, milestoneIndex) => (
                        <li key={`milestone-${index}-${milestoneIndex}`}>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {plan.recommendedCourses.length > 0 && (
        <Card variant="elevated">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Önerilen Kaynaklar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {plan.recommendedCourses.map((course, index) => (
                <li
                  key={`course-${index}`}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
                >
                  {course}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

