"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Target, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";

interface QuestionnaireData {
  specialization: string;
  careerGoal: string;
  timeline: string;
  skillLevel: string;
  technologies?: string[];
  workPreference: string;
  industryInterests?: string[];
}

interface CareerPlanQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
  onCancel?: () => void;
}

const SPECIALIZATIONS = [
  "Frontend",
  "Backend",
  "Full-stack",
  "Mobile",
  "DevOps",
  "Data Science",
  "AI/ML",
  "Cybersecurity",
  "Game Development",
  "Diğer",
  "Henüz karar vermedim",
];

const CAREER_GOALS = [
  "Junior Developer",
  "Mid-level Developer",
  "Senior Developer",
  "Tech Lead",
  "Architect",
  "Engineering Manager",
  "CTO",
  "Freelancer",
  "Startup Founder",
  "Diğer",
  "Henüz karar vermedim",
];

const TIMELINES = [
  "6 ay",
  "1 yıl",
  "2 yıl",
  "3 yıl",
  "5+ yıl",
  "Henüz belirlemedim",
];

const SKILL_LEVELS = [
  "Başlangıç",
  "Orta",
  "İleri",
];

const TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  ".NET",
  "Go",
  "Rust",
  "PHP",
  "Swift",
  "Kotlin",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
];

const WORK_PREFERENCES = [
  "Remote",
  "On-site",
  "Hybrid",
  "Fark etmez",
];

const INDUSTRY_INTERESTS = [
  "E-ticaret",
  "Fintech",
  "SaaS",
  "Gaming",
  "Healthcare",
  "Education",
  "Social Media",
  "Enterprise",
  "Startup",
  "Açık kaynak",
];

export function CareerPlanQuestionnaire({ onComplete, onCancel }: CareerPlanQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    specialization: "",
    careerGoal: "",
    timeline: "",
    skillLevel: "",
    technologies: [],
    workPreference: "",
    industryInterests: [],
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onComplete(formData);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.specialization !== "";
      case 2:
        return formData.careerGoal !== "";
      case 3:
        return formData.timeline !== "";
      case 4:
        return formData.skillLevel !== "";
      case 5:
        // Technologies are now optional - can proceed without selection
        return true;
      case 6:
        return formData.workPreference !== "";
      case 7:
        // Industry interests are now optional - can proceed without selection
        return true;
      default:
        return false;
    }
  };

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: (prev.technologies || []).includes(tech)
        ? (prev.technologies || []).filter((t) => t !== tech)
        : [...(prev.technologies || []), tech],
    }));
  };

  const toggleIndustryInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      industryInterests: (prev.industryInterests || []).includes(interest)
        ? (prev.industryInterests || []).filter((i) => i !== interest)
        : [...(prev.industryInterests || []), interest],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hangi alanda uzmanlaşmak istiyorsunuz?
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Eğer henüz karar vermediyseniz, &quot;Henüz karar vermedim&quot; seçeneğini işaretleyin. Size genel bir kariyer planı hazırlayacağız ve farklı alanları keşfetmenize yardımcı olacağız.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, specialization: spec }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.specialization === spec
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : spec === "Henüz karar vermedim"
                      ? "border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Kariyer hedefiniz nedir?
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Kariyer hedefinizi belirlemekte zorlanıyorsanız endişelenmeyin. &quot;Henüz karar vermedim&quot; seçeneğini işaretleyin, size farklı kariyer yollarını gösterecek bir plan hazırlayacağız.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, careerGoal: goal }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.careerGoal === goal
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : goal === "Henüz karar vermedim"
                      ? "border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hedef zaman çizelgeniz nedir?
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Belirli bir zaman çizelgeniz yoksa &quot;Henüz belirlemedim&quot; seçeneğini işaretleyin. Size esnek bir plan hazırlayacağız.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIMELINES.map((timeline) => (
                <button
                  key={timeline}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, timeline }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.timeline === timeline
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : timeline === "Henüz belirlemedim"
                      ? "border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {timeline}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mevcut seviyeniz nedir?
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Başlangıç: Programlamaya yeni başlıyorsunuz. Orta: Temel konularda bilginiz var. İleri: Deneyimli ve karmaşık projeler yapabiliyorsunuz.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, skillLevel: level }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.skillLevel === level
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hangi teknolojilerle çalışmak istiyorsunuz? (Opsiyonel)
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Henüz hangi teknolojileri öğrenmek istediğinizden emin değilseniz, bu adımı atlayabilirsiniz. Size popüler ve öğrenmeye değer teknolojileri önereceğiz.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechnology(tech)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    (formData.technologies || []).includes(tech)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {(formData.technologies || []).length > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seçilen: {(formData.technologies || []).join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Hiçbir teknoloji seçmediniz. Devam edebilirsiniz, size öneriler sunacağız.
              </p>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Çalışma tercihiniz nedir?
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Remote: Uzaktan çalışma. On-site: Ofiste çalışma. Hybrid: Karma model. Tercihiniz yoksa &quot;Fark etmez&quot; seçeneğini işaretleyin.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WORK_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, workPreference: pref }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.workPreference === pref
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hangi sektörlerle ilgileniyorsunuz? (Opsiyonel)
              </h3>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Belirli bir sektör tercihiniz yoksa bu adımı atlayabilirsiniz. Size farklı sektörlerdeki fırsatları gösterecek bir plan hazırlayacağız.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {INDUSTRY_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleIndustryInterest(interest)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    (formData.industryInterests || []).includes(interest)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {(formData.industryInterests || []).length > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seçilen: {(formData.industryInterests || []).join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Hiçbir sektör seçmediniz. Devam edebilirsiniz, size farklı sektörleri tanıtacağız.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Kariyer Planı Anketi
          </CardTitle>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                İptal
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                İleri
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit}
                disabled={!validateCurrentStep()}
              >
                Tamamla
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

