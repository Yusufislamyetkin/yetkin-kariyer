"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Sparkles,
  Target,
  ArrowRight,
  BookOpen,
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { CareerPlanQuestionnaire } from "../_components/CareerPlanQuestionnaire";
import { AITeacherSelin } from "../_components/AITeacherSelin";
import { CareerPlanResourceCard } from "../_components/CareerPlanResourceCard";
import { RoadmapTree } from "../_components/RoadmapTree";
import { AlertCircle, CheckCircle2, Lightbulb, Target as TargetIcon, Clock, Flag, Code2, BookOpen as BookOpenIcon } from "lucide-react";
import Link from "next/link";
import {
  getRoadmapForPath,
  type CareerPathRoadmap,
} from "@/lib/services/career/roadmap-steps";

interface RoadmapTask {
  title: string;
  description?: string;
  estimatedTime?: string;
  order: number;
}

interface RoadmapProject {
  name: string;
  description?: string;
  difficulty?: "Başlangıç" | "Orta" | "İleri";
  estimatedTime?: string;
}

interface RoadmapMilestone {
  title: string;
  criteria: string[];
}

interface RoadmapStage {
  stage: string;
  title: string;
  description?: string;
  estimatedDuration?: string;
  priority?: "Yüksek" | "Orta" | "Düşük";
  learningObjectives?: string[];
  tasks: RoadmapTask[] | string[]; // Support both old and new format
  milestones: RoadmapMilestone[] | string[]; // Support both old and new format
  practicalProjects?: RoadmapProject[] | string[]; // Support both old and new format
  importantPoints?: string[];
  developmentTopics?: string[]; // For backward compatibility
  recommendedResources?: Array<{
    title: string;
    type?: string;
    description?: string;
    link?: string;
  }>;
}

interface CareerPlan {
  goals: string[];
  roadmap: RoadmapStage[];
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

  // Normalize roadmap stages to support both old and new formats
  const normalizedRoadmap: RoadmapStage[] = Array.isArray(raw?.roadmap)
    ? raw.roadmap.map((stage: any) => {
        // Normalize tasks (support both string[] and object[])
        let tasks: RoadmapTask[] = [];
        if (Array.isArray(stage.tasks)) {
          if (stage.tasks.length > 0 && typeof stage.tasks[0] === "string") {
            // Old format: string[]
            tasks = stage.tasks.map((task: string, index: number) => ({
              title: task,
              order: index + 1,
            }));
          } else {
            // New format: object[]
            tasks = stage.tasks.map((task: any) => ({
              title: task.title || "",
              description: task.description,
              estimatedTime: task.estimatedTime,
              order: task.order || 0,
            }));
          }
        }

        // Normalize milestones (support both string[] and object[])
        let milestones: RoadmapMilestone[] = [];
        if (Array.isArray(stage.milestones)) {
          if (stage.milestones.length > 0 && typeof stage.milestones[0] === "string") {
            // Old format: string[]
            milestones = stage.milestones.map((milestone: string) => ({
              title: milestone,
              criteria: [],
            }));
          } else {
            // New format: object[]
            milestones = stage.milestones.map((milestone: any) => ({
              title: milestone.title || milestone,
              criteria: Array.isArray(milestone.criteria) ? milestone.criteria : [],
            }));
          }
        }

        // Normalize practicalProjects (support both string[] and object[])
        let practicalProjects: RoadmapProject[] | undefined = undefined;
        if (Array.isArray(stage.practicalProjects)) {
          if (stage.practicalProjects.length > 0 && typeof stage.practicalProjects[0] === "string") {
            // Old format: string[]
            practicalProjects = stage.practicalProjects.map((project: string) => ({
              name: project,
            }));
          } else {
            // New format: object[]
            practicalProjects = stage.practicalProjects.map((project: any) => ({
              name: project.name || project,
              description: project.description,
              difficulty: project.difficulty,
              estimatedTime: project.estimatedTime,
            }));
          }
        }

        return {
          ...stage,
          tasks,
          milestones,
          practicalProjects,
        };
      })
    : [];

  return {
    goals: Array.isArray(raw?.goals) ? raw.goals : [],
    roadmap: normalizedRoadmap,
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
}

export default function CareerRoadmapPage() {
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // New tree structure state
  const [roadmap, setRoadmap] = useState<CareerPathRoadmap | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchProgress = async (path: string) => {
    setProgressLoading(true);
    try {
      const response = await fetch(`/api/career/roadmap/progress?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setProgressLoading(false);
    }
  };

  // Determine career path from plan/questionnaire and fetch roadmap
  useEffect(() => {
    const determineCareerPath = async () => {
      if (!plan && !questionnaireData) {
        return;
      }

      // Try to get specialization from questionnaire data or plan
      let specialization = questionnaireData?.specialization?.toLowerCase() || "";
      
      // Map specialization to career path
      let careerPath = "";
      if (specialization.includes("backend")) {
        careerPath = "backend";
      } else if (specialization.includes("frontend")) {
        careerPath = "frontend";
      } else if (specialization.includes("full") || specialization.includes("fullstack")) {
        careerPath = "fullstack";
      } else {
        // Default to backend if unclear
        careerPath = "backend";
      }

      const roadmapData = getRoadmapForPath(careerPath);
      if (roadmapData) {
        setRoadmap(roadmapData);
        // Fetch progress
        fetchProgress(careerPath);
      }
    };

    determineCareerPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, questionnaireData]);

  const fetchPlan = async () => {
    try {
      const response = await fetch("/api/career/plan");
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Unauthorized - user not logged in");
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.plan && data.plan.summary) {
        // Plan exists and has valid data
        setPlan(normalizePlan(data.plan));
      } else {
        // No plan found or plan is empty
        setPlan(null);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      // On error, set plan to null so user can create a new one
      setPlan(null);
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
          const normalizedPlan = normalizePlan(data.plan);
          setPlan(normalizedPlan);
          setShowQuestionnaire(false);
          if (questionnaire) {
            setQuestionnaireData(questionnaire);
          }
          // Refetch plan from database to ensure it's saved
          setTimeout(() => {
            fetchPlan();
          }, 500);
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
        } else if (response.status === 403 && data.requiresSubscription) {
          // Abonelik gerekli - yönlendir
          window.location.href = data.redirectTo || "/subscription-required";
          return;
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
    setShowConfirmDialog(true);
  };

  const handleConfirmNewPlan = () => {
    setPlan(null);
    setShowQuestionnaire(true);
    setQuestionnaireData(null);
    setShowConfirmDialog(false);
  };

  const handleCancelNewPlan = () => {
    setShowConfirmDialog(false);
  };

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleChecked = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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
              onClick={async () => {
                // Abonelik kontrolü
                const checkResponse = await fetch("/api/subscription/check");
                const checkData = await checkResponse.json();
                if (!checkData.hasActiveSubscription) {
                  window.location.href = "/subscription-required";
                  return;
                }
                handleStartQuestionnaire();
              }}
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
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Yeni Plan Oluştur"
        message="Yeni bir plan oluşturmak istediğinizden emin misiniz? Mevcut plan silinecek ve yeni anket başlatılacak."
        confirmText="Evet, Yeni Plan Oluştur"
        cancelText="İptal"
        onConfirm={handleConfirmNewPlan}
        onCancel={handleCancelNewPlan}
      />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {/* AI Öğretmen Selin Introduction */}
      <Card variant="elevated" className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-4 px-4 pb-4 sm:pt-5 sm:px-5 sm:pb-5">
          <AITeacherSelin 
            message={plan.summary || "Size özel kariyer planınız hazır! Aşağıda yol haritanızı bulabilirsiniz."}
          />
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Kariyer Planım
            </CardTitle>
            {plan.timeline && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <Clock className="h-3 w-3" />
                {plan.timeline}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCreateNewPlan}
              disabled={generating}
            >
              <Sparkles className="h-4 w-4" />
              Yeni Plan
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Roadmap Tree Structure */}
      {roadmap ? (
        <RoadmapTree
          roadmap={roadmap}
          progress={progress}
          loading={progressLoading}
        />
      ) : plan.roadmap.length > 0 ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TargetIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Kariyer Yol Haritası
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {plan.roadmap.map((stage, index) => {
              // Calculate progress for this stage
              const stageTasks = Array.isArray(stage.tasks) ? stage.tasks : [];
              const completedTasks = stageTasks.filter((task, taskIndex) => {
                const taskId = `task-${index}-${typeof task === 'string' ? taskIndex : task.order || taskIndex}`;
                return checkedItems.has(taskId);
              }).length;
              const progress = stageTasks.length > 0 ? (completedTasks / stageTasks.length) * 100 : 0;

              return (
                <div key={`stage-${index}`} className="space-y-4">
                  {/* Stage Header */}
                  <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:border-gray-700 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {stage.stage}: {stage.title}
                          </h3>
                          {stage.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {stage.description}
                            </p>
                          )}
                          {/* Learning Objectives */}
                          {stage.learningObjectives && stage.learningObjectives.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Öğrenme Hedefleri:
                              </p>
                              <ul className="space-y-1">
                                {stage.learningObjectives.map((objective, objIndex) => (
                                  <li key={objIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <TargetIcon className="h-3 w-3 mt-1.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                    <span>{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                        {stage.priority && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            stage.priority === "Yüksek" 
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : stage.priority === "Orta"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}>
                            {stage.priority} Öncelik
                          </span>
                        )}
                        {stage.estimatedDuration && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Clock className="h-3 w-3" />
                            {stage.estimatedDuration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {stageTasks.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            İlerleme: {completedTasks} / {stageTasks.length} görev tamamlandı
                          </span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            %{Math.round(progress)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tasks Section */}
                  {stageTasks.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Görevler
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {stageTasks
                          .sort((a, b) => {
                            const orderA = typeof a === 'string' ? 0 : (a.order || 0);
                            const orderB = typeof b === 'string' ? 0 : (b.order || 0);
                            return orderA - orderB;
                          })
                          .map((task, taskIndex) => {
                            const taskObj = typeof task === 'string' 
                              ? { title: task, description: undefined, estimatedTime: undefined, order: taskIndex + 1 }
                              : task;
                            const taskId = `task-${index}-${taskObj.order || taskIndex}`;
                            const isChecked = checkedItems.has(taskId);
                            
                            return (
                              <div
                                key={taskId}
                                onClick={() => toggleChecked(taskId)}
                                className={`group relative rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                                  isChecked
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-blue-200 bg-white dark:border-blue-800 dark:bg-gray-900/40 hover:border-blue-400"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {isChecked ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        {taskObj.order || taskIndex + 1}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${
                                      isChecked
                                        ? "text-green-800 dark:text-green-300 line-through"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`}>
                                      {taskObj.title}
                                    </p>
                                    {taskObj.description && (
                                      <p className={`mt-1 text-xs ${
                                        isChecked
                                          ? "text-green-700 dark:text-green-400"
                                          : "text-gray-600 dark:text-gray-400"
                                      }`}>
                                        {taskObj.description}
                                      </p>
                                    )}
                                    {taskObj.estimatedTime && (
                                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        <Clock className="h-3 w-3" />
                                        {taskObj.estimatedTime}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Practical Projects Section */}
                  {stage.practicalProjects && stage.practicalProjects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Pratik Projeler
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {stage.practicalProjects.map((project, projectIndex) => {
                          const projectObj = typeof project === 'string'
                            ? { name: project, description: undefined, difficulty: undefined, estimatedTime: undefined }
                            : project;
                          const projectId = `project-${index}-${projectIndex}`;
                          const isChecked = checkedItems.has(projectId);
                          
                          const difficultyColors = {
                            "Başlangıç": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            "Orta": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                            "İleri": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                          };

                          return (
                            <div
                              key={projectId}
                              onClick={() => toggleChecked(projectId)}
                              className={`group relative rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                                isChecked
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-indigo-200 bg-white dark:border-indigo-800 dark:bg-gray-900/40 hover:border-indigo-400"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`font-semibold text-sm ${
                                      isChecked
                                        ? "text-green-800 dark:text-green-300 line-through"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`}>
                                      {projectObj.name}
                                    </p>
                                    {projectObj.difficulty && (
                                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                        difficultyColors[projectObj.difficulty]
                                      }`}>
                                        {projectObj.difficulty}
                                      </span>
                                    )}
                                  </div>
                                  {projectObj.description && (
                                    <p className={`mt-1 text-xs ${
                                      isChecked
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}>
                                      {projectObj.description}
                                    </p>
                                  )}
                                  {projectObj.estimatedTime && (
                                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                      <Clock className="h-3 w-3" />
                                      {projectObj.estimatedTime}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Milestones Section */}
                  {Array.isArray(stage.milestones) && stage.milestones.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <Flag className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Kontrol Noktaları
                      </h4>
                      <div className="space-y-3">
                        {stage.milestones.map((milestone, milestoneIndex) => {
                          const milestoneObj = typeof milestone === 'string'
                            ? { title: milestone, criteria: [] }
                            : milestone;
                          const milestoneId = `milestone-${index}-${milestoneIndex}`;
                          const isChecked = checkedItems.has(milestoneId);
                          
                          return (
                            <div
                              key={milestoneId}
                              onClick={() => toggleChecked(milestoneId)}
                              className={`group relative rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                                isChecked
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-green-200 bg-white dark:border-green-800 dark:bg-gray-900/40 hover:border-green-400"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Flag className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-semibold text-sm ${
                                    isChecked
                                      ? "text-green-800 dark:text-green-300 line-through"
                                      : "text-gray-900 dark:text-gray-100"
                                  }`}>
                                    {milestoneObj.title}
                                  </p>
                                  {milestoneObj.criteria && milestoneObj.criteria.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                      {milestoneObj.criteria.map((criterion, critIndex) => (
                                        <li key={critIndex} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                          <span>{criterion}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Development Topics (backward compatibility) */}
                  {stage.developmentTopics && stage.developmentTopics.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Geliştirme Konuları
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.developmentTopics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Important Points */}
                  {stage.importantPoints && stage.importantPoints.length > 0 && (
                    <div className="rounded-lg border-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 p-4 space-y-2">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Önemli Notlar
                      </h4>
                      <ul className="space-y-2">
                        {stage.importantPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stage-specific Resources */}
                  {stage.recommendedResources && stage.recommendedResources.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        <BookOpenIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Bu Aşama İçin Önerilen Kaynaklar
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {stage.recommendedResources.map((resource, resIndex) => (
                          <CareerPlanResourceCard key={`stage-resource-${index}-${resIndex}`} resource={resource} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider between stages */}
                  {index < plan.roadmap.length - 1 && (
                    <div className="flex items-center gap-4 py-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                      <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}
      </div>
    </>
  );
}

