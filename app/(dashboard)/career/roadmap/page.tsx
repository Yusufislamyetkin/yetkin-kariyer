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
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CareerPlanQuestionnaire } from "../_components/CareerPlanQuestionnaire";
import { AITeacherSelin } from "../_components/AITeacherSelin";
import { CareerPlanResourceCard } from "../_components/CareerPlanResourceCard";
import { AlertCircle, CheckCircle2, Lightbulb, Target as TargetIcon, Clock, Flag } from "lucide-react";

interface CareerPlan {
  goals: string[];
  roadmap: Array<{
    stage: string;
    title: string;
    description?: string;
    tasks: string[];
    milestones: string[];
    importantPoints?: string[];
    developmentTopics?: string[];
    practicalProjects?: string[];
    priority?: string;
    estimatedDuration?: string;
  }>;
  recommendedCourses: string[];
  recommendedResources?: Array<{
    title: string;
    type?: string;
    description?: string;
    link?: string;
  }>;
  skillsToDevelop: string[];
  timeline: string;
  summary: string;
}

const normalizePlan = (raw: any): CareerPlan => {
  // Handle recommendedCourses - can be array of strings or object with courses and resources
  let recommendedCourses: string[] = [];
  let recommendedResources: Array<{
    title: string;
    type?: string;
    description?: string;
    link?: string;
  }> = [];

  if (raw?.recommendedCourses) {
    if (Array.isArray(raw.recommendedCourses)) {
      // Old format: array of strings
      recommendedCourses = raw.recommendedCourses;
    } else if (typeof raw.recommendedCourses === "object") {
      // New format: object with courses and resources
      recommendedCourses = Array.isArray(raw.recommendedCourses.courses)
        ? raw.recommendedCourses.courses
        : [];
      recommendedResources = Array.isArray(raw.recommendedCourses.resources)
        ? raw.recommendedCourses.resources
        : [];
    }
  }

  // Also check for direct recommendedResources field (for backward compatibility)
  if (Array.isArray(raw?.recommendedResources) && recommendedResources.length === 0) {
    recommendedResources = raw.recommendedResources;
  }

  return {
    goals: Array.isArray(raw?.goals) ? raw.goals : [],
    roadmap: Array.isArray(raw?.roadmap) ? raw.roadmap : [],
    recommendedCourses,
    recommendedResources,
    skillsToDevelop: Array.isArray(raw?.skillsToDevelop)
      ? raw.skillsToDevelop
      : [],
    timeline: typeof raw?.timeline === "string" ? raw.timeline : "",
    summary: typeof raw?.summary === "string" ? raw.summary : "",
  };
};

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

  const handleCreateNewPlan = () => {
    if (confirm("Yeni bir plan oluşturmak istediğinizden emin misiniz? Mevcut plan silinecek ve yeni anket başlatılacak.")) {
      setPlan(null);
      setShowQuestionnaire(true);
      setQuestionnaireData(null);
    }
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
      {/* AI Öğretmen Selin Introduction */}
      <Card variant="elevated" className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <AITeacherSelin 
            message={plan.summary || "Size özel kariyer planınız hazır! Aşağıda detaylı yol haritanızı bulabilirsiniz."}
          />
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              Kariyer Planım
            </CardTitle>
            {plan.timeline && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <Clock className="h-3 w-3" />
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
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCreateNewPlan}
              disabled={generating}
            >
              <Sparkles className="h-4 w-4" />
              Yeni Plan Oluştur
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
            <div className="flex items-center gap-3">
              <CardTitle>Kariyer Yol Haritası</CardTitle>
              <AITeacherSelin showAvatar={false} className="ml-auto" message="Size özel hazırladığım detaylı yol haritanız:" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {plan.roadmap.map((stage, index) => (
              <div
                key={`stage-${index}`}
                className="relative rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40"
              >
                {/* Stage Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {stage.stage}: {stage.title}
                      </h3>
                    </div>
                    {stage.priority && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        stage.priority === "Yüksek" 
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : stage.priority === "Orta"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        <Flag className="h-3 w-3" />
                        Öncelik: {stage.priority}
                      </span>
                    )}
                    {stage.estimatedDuration && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Clock className="h-3 w-3" />
                        {stage.estimatedDuration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {stage.description && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/15">
                    <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Development Topics */}
                  {stage.developmentTopics && stage.developmentTopics.length > 0 && (
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                          Gelişim Konuları
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.developmentTopics.map((topic, topicIndex) => (
                          <li key={`topic-${index}-${topicIndex}`} className="text-sm text-purple-800 dark:text-purple-300 flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Important Points */}
                  {stage.importantPoints && stage.importantPoints.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                          Önemli Noktalar
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {stage.importantPoints.map((point, pointIndex) => (
                          <li key={`point-${index}-${pointIndex}`} className="text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2">
                            <TargetIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tasks */}
                {stage.tasks && stage.tasks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Kilit Görevler
                    </p>
                    <ul className="space-y-2">
                      {stage.tasks.map((task, taskIndex) => (
                        <li key={`task-${index}-${taskIndex}`} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {taskIndex + 1}
                          </span>
                          <span className="flex-1">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Milestones */}
                {stage.milestones && stage.milestones.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Kilometre Taşları
                    </p>
                    <div className="space-y-2">
                      {stage.milestones.map((milestone, milestoneIndex) => (
                        <div key={`milestone-${index}-${milestoneIndex}`} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                          <span>{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Projects */}
                {stage.practicalProjects && stage.practicalProjects.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Pratik Projeler
                    </p>
                    <ul className="space-y-2">
                      {stage.practicalProjects.map((project, projectIndex) => (
                        <li key={`project-${index}-${projectIndex}`} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">
                          {project}
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

      {/* Recommended Resources with Cards */}
      {(plan.recommendedResources && plan.recommendedResources.length > 0) || plan.recommendedCourses.length > 0 ? (
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Platform Kaynakları
              </CardTitle>
              <AITeacherSelin showAvatar={false} message="Size önerdiğim platform içi kaynaklar:" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* New Resource Cards */}
            {plan.recommendedResources && plan.recommendedResources.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {plan.recommendedResources.map((resource, index) => (
                  <CareerPlanResourceCard key={`resource-${index}`} resource={resource} />
                ))}
              </div>
            )}
            
            {/* Legacy Recommended Courses */}
            {plan.recommendedCourses.length > 0 && (
              <div>
                {plan.recommendedResources && plan.recommendedResources.length > 0 && (
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Diğer Önerilen Kaynaklar
                  </h4>
                )}
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
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

