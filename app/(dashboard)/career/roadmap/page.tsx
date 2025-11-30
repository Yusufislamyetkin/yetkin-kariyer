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
import { AlertCircle, CheckCircle2, Lightbulb, Target as TargetIcon, Clock, Flag, Code2, BookOpen as BookOpenIcon, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

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

  // Get technology recommendations based on specialization and selected technologies
  const getTechnologyRecommendations = (): string[] => {
    const selectedTechs = questionnaireData?.technologies || [];
    const techMap: Record<string, string[]> = {
      "Frontend": ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "Next.js"],
      "Backend": ["Node.js", "Python", "Java", "C#", ".NET", "Go", "PostgreSQL", "MongoDB"],
      "Full-stack": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
      "Mobile": ["React Native", "Flutter", "Swift", "Kotlin"],
      "DevOps": ["Docker", "Kubernetes", "AWS", "Azure"],
      "Data Science": ["Python", "R", "SQL"],
      "AI/ML": ["Python", "TensorFlow", "PyTorch"],
      "Cybersecurity": ["Python", "Linux"],
      "Game Development": ["Unity", "C#", "C++"],
    };

    const recommendedTechs = questionnaireData?.specialization 
      ? (techMap[questionnaireData.specialization] || [])
      : [];
    
    // Combine selected and recommended, remove duplicates
    const allTechs = [...new Set([...selectedTechs, ...recommendedTechs])];
    return allTechs;
  };

  // Get technology link based on technology name
  const getTechnologyLink = (techName: string): string => {
    // Normalize tech name for URL
    const normalizedName = techName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    // Try to find course by technology name
    return `/education/courses?search=${encodeURIComponent(techName)}`;
  };

  // Get technology description/recommendation
  const getTechnologyRecommendation = (techName: string): string => {
    const recommendations: Record<string, string> = {
      "React": "Modern web uygulamaları için popüler bir frontend kütüphanesi. Öğrenmeye başlamak için React kurslarımıza göz atın.",
      "Node.js": "JavaScript ile backend geliştirme. Sunucu tarafı uygulamalar için Node.js kurslarımızı inceleyin.",
      "Python": "Çok amaçlı programlama dili. Web, veri bilimi ve yapay zeka için Python kurslarımıza bakın.",
      "TypeScript": "Tip güvenli JavaScript. Büyük projeler için TypeScript kurslarımızı keşfedin.",
      "JavaScript": "Web geliştirmenin temel dili. JavaScript temellerini öğrenmek için kurslarımıza göz atın.",
      "Java": "Kurumsal uygulamalar için güçlü dil. Java kurslarımızla başlayın.",
      "C#": "Microsoft ekosistemi için modern dil. C# kurslarımızı inceleyin.",
      "Vue.js": "Kolay öğrenilen frontend framework. Vue.js kurslarımıza bakın.",
      "Angular": "Enterprise uygulamalar için güçlü framework. Angular kurslarımızı keşfedin.",
      "Docker": "Konteyner teknolojisi. Docker kurslarımızla başlayın.",
      "Kubernetes": "Konteyner orkestrasyonu. Kubernetes kurslarımıza göz atın.",
    };
    
    return recommendations[techName] || `${techName} ile ilgili kurslarımıza göz atın ve öğrenmeye başlayın.`;
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
              onClick={handleExportPlan}
            >
              <Download className="h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCreateNewPlan}
              disabled={generating}
            >
              <Sparkles className="h-4 w-4" />
              Yeni Plan
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
                  Yenileniyor...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Yenile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Combined Skills and Goals */}
      {(plan.skillsToDevelop.length > 0 || plan.goals.length > 0) && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Öncelikler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.skillsToDevelop.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Beceriler</h4>
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
              </div>
            )}
            {plan.goals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hedefler</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  {plan.goals.map((goal, index) => (
                    <li
                      key={`goal-${index}`}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/40"
                    >
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technology Recommendations */}
      {getTechnologyRecommendations().length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Teknoloji Önerileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {getTechnologyRecommendations().map((tech) => {
                const isSelected = questionnaireData?.technologies?.includes(tech);
                const techLink = getTechnologyLink(tech);
                
                return (
                  <Link
                    key={tech}
                    href={techLink}
                    className="group block"
                  >
                    <div className="rounded-lg border-2 p-3 transition-all hover:border-blue-400 hover:shadow-md bg-white dark:bg-gray-900/40 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Zap className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {tech}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Seçildi
                          </span>
                        )}
                        <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {plan.roadmap.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Kariyer Yol Haritası</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.roadmap.map((stage, index) => (
              <div key={`stage-${index}`} className="space-y-3">
                {/* Stage Header */}
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stage.stage}: {stage.title}
                    </h3>
                    {stage.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {stage.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {stage.priority && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        stage.priority === "Yüksek" 
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : stage.priority === "Orta"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {stage.priority}
                      </span>
                    )}
                    {stage.estimatedDuration && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {stage.estimatedDuration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Simplified items - combine all types */}
                <div className="grid gap-2 md:grid-cols-2">
                  {/* Combine all items into a simpler format */}
                  {[
                    ...(stage.tasks || []).map((task, taskIndex) => ({ type: 'task', content: task, index: taskIndex })),
                    ...(stage.milestones || []).map((milestone, milestoneIndex) => ({ type: 'milestone', content: milestone, index: milestoneIndex })),
                    ...(stage.developmentTopics || []).map((topic, topicIndex) => ({ type: 'topic', content: topic, index: topicIndex })),
                    ...(stage.importantPoints || []).map((point, pointIndex) => ({ type: 'point', content: point, index: pointIndex })),
                    ...(stage.practicalProjects || []).map((project, projectIndex) => ({ type: 'project', content: project, index: projectIndex })),
                  ].map((item, itemIndex) => {
                    const itemId = `${item.type}-${index}-${item.index}`;
                    const isChecked = checkedItems.has(itemId);
                    const colorClasses = {
                      task: isChecked ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
                      milestone: isChecked ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
                      topic: isChecked ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
                      point: isChecked ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
                      project: isChecked ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20",
                    };
                    
                    return (
                      <div
                        key={itemId}
                        onClick={() => toggleChecked(itemId)}
                        className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all hover:shadow-md ${colorClasses[item.type as keyof typeof colorClasses]}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {isChecked ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              item.type === 'task' ? (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                  {item.index + 1}
                                </span>
                              ) : item.type === 'milestone' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : item.type === 'project' ? (
                                <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )
                            )}
                          </div>
                          <p className={`text-sm flex-1 ${
                            isChecked
                              ? "text-green-800 dark:text-green-300"
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {item.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommended Resources */}
      {(plan.recommendedResources && plan.recommendedResources.length > 0) || plan.recommendedCourses.length > 0 ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Platform Kaynakları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.recommendedResources && plan.recommendedResources.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {plan.recommendedResources.map((resource, index) => (
                  <CareerPlanResourceCard key={`resource-${index}`} resource={resource} />
                ))}
              </div>
            )}
            {plan.recommendedCourses.length > 0 && (
              <ul className="space-y-2">
                {plan.recommendedCourses.map((course, index) => (
                  <li
                    key={`course-${index}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

