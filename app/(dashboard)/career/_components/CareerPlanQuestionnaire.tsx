"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Target, ArrowRight, ArrowLeft, HelpCircle, Brain, Sparkles, MessageSquare, Zap, TrendingUp, Loader2 } from "lucide-react";

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
  "Henüz karar vermedim",
];

const SPECIALIZATION_DESCRIPTIONS: Record<string, string> = {
  "Frontend": "Web sitelerinin ve uygulamaların kullanıcıların gördüğü, etkileşimde bulunduğu arayüz kısmını geliştirme alanı. React, Vue, Angular gibi teknolojilerle çalışır.",
  "Backend": "Web uygulamalarının sunucu tarafında çalışan, veritabanı işlemleri ve iş mantığını yöneten kısmını geliştirme alanı. Node.js, Python, Java gibi teknolojilerle çalışır.",
  "Full-stack": "Hem frontend hem de backend geliştirme alanlarında uzmanlaşarak uygulamanın tüm katmanlarını geliştirme alanı. Kapsamlı bir bakış açısı gerektirir.",
  "Mobile": "Akıllı telefonlar ve tabletler için mobil uygulamalar geliştirme alanı. iOS (Swift) veya Android (Kotlin/Java) platformlarında çalışır.",
  "DevOps": "Yazılım geliştirme ve operasyon süreçlerini birleştirerek, sürekli entegrasyon ve dağıtım (CI/CD) sağlayan alan. Docker, Kubernetes, bulut servisleri ile çalışır.",
  "Data Science": "Büyük verileri analiz ederek anlamlı içgörüler çıkarma alanı. Python, R, makine öğrenmesi ve istatistik bilgisi gerektirir.",
  "AI/ML": "Yapay zeka ve makine öğrenmesi algoritmaları geliştirme alanı. Python, TensorFlow, PyTorch gibi araçlarla çalışır.",
  "Cybersecurity": "Bilgisayar sistemlerini ve ağları siber saldırılara karşı koruma alanı. Güvenlik açıklarını tespit etme ve güvenlik politikaları oluşturma üzerine çalışır.",
  "Game Development": "Video oyunları tasarlama ve geliştirme alanı. Unity, Unreal Engine gibi oyun motorları ve C#, C++ gibi diller kullanır.",
  "Henüz karar vermedim": "Farklı alanları keşfetmek ve size uygun olanı bulmak için genel bir kariyer planı hazırlanır.",
};

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
  "Henüz karar vermedim",
];

const CAREER_GOAL_DESCRIPTIONS: Record<string, string> = {
  "Junior Developer": "Yazılım geliştirme kariyerinin başlangıç seviyesi. Temel programlama bilgisi ve mentorluk desteği ile projelerde çalışır.",
  "Mid-level Developer": "Orta seviye geliştirici. Temel görevleri bağımsız olarak yapabilir ve küçük ekiplere liderlik edebilir.",
  "Senior Developer": "Deneyimli geliştirici. Karmaşık problemleri çözebilir, teknik kararlar verebilir ve junior geliştiricilere mentorluk yapar.",
  "Tech Lead": "Teknik lider. Teknik kararlar alır, mimari tasarım yapar ve geliştirici ekibine rehberlik eder.",
  "Architect": "Yazılım mimarı. Sistem mimarisini tasarlar, teknoloji stack'i belirler ve teknik stratejiler oluşturur.",
  "Engineering Manager": "Mühendislik yöneticisi. Teknik ekibi yönetir, proje planlaması yapar ve teknik ile yönetim arasında köprü görevi görür.",
  "CTO": "Teknik direktör. Şirketin teknik stratejisini belirler, teknoloji yatırımlarını yönetir ve inovasyonu yönlendirir.",
  "Freelancer": "Serbest çalışan geliştirici. Farklı projelerde bağımsız olarak çalışır ve kendi işini yönetir.",
  "Startup Founder": "Startup kurucusu. Kendi teknoloji şirketini kurar ve hem teknik hem de iş geliştirme faaliyetlerinde bulunur.",
  "Henüz karar vermedim": "Farklı kariyer yollarını keşfetmek ve size uygun olanı bulmak için genel bir plan hazırlanır.",
};

const TIMELINES = [
  "3 ay",
  "6 ay",
  "9 ay",
  "1 yıl",
  "Henüz belirlemedim",
];

const SKILL_LEVELS = [
  "Başlangıç",
  "Orta",
  "İleri",
];

// Technology mapping based on specialization (used for filtering)
const SPECIALIZATION_TECH_MAP: Record<string, string[]> = {
  "Frontend": ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "Next.js"],
  "Backend": ["Node.js", "Python", "Java", "C#", ".NET", "Go", "PHP"],
  "Full-stack": ["React", "Node.js", "TypeScript", "JavaScript", "Python"],
  "Mobile": ["React Native", "Flutter", "Swift", "Kotlin"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP"],
  "Data Science": ["Python", "R", "SQL"],
  "AI/ML": ["Python", "TensorFlow", "PyTorch"],
  "Cybersecurity": ["Python", "Linux"],
  "Game Development": ["Unity", "C#", "C++"],
};

// Fallback descriptions for common technologies
const TECHNOLOGY_DESCRIPTIONS: Record<string, string> = {
  "JavaScript": "Web geliştirmenin temel dili. Hem tarayıcıda hem de sunucuda çalışabilen, dinamik ve esnek bir programlama dili.",
  "TypeScript": "JavaScript'in üzerine tip güvenliği ekleyen dil. Büyük projelerde hata önleme ve daha iyi geliştirici deneyimi sağlar.",
  "React": "Facebook tarafından geliştirilen popüler frontend kütüphanesi. Bileşen tabanlı UI geliştirme ile güçlü kullanıcı arayüzleri oluşturur.",
  "Vue.js": "Kullanımı kolay, ilerici bir JavaScript framework'ü. Küçük projelerden büyük uygulamalara kadar ölçeklenebilir.",
  "Angular": "Google'ın geliştirdiği kapsamlı TypeScript tabanlı framework. Enterprise düzeyinde uygulamalar için güçlü araçlar sunar.",
  "Node.js": "JavaScript'i sunucu tarafında çalıştıran runtime. Asenkron programlama ile yüksek performanslı backend uygulamaları geliştirmeyi sağlar.",
  "Python": "Okunabilir sözdizimi ile popüler, çok amaçlı programlama dili. Web geliştirme, veri bilimi ve yapay zeka için yaygın olarak kullanılır.",
  "Java": "Platform bağımsız, nesne yönelimli programlama dili. Kurumsal uygulamalar ve büyük ölçekli sistemler için güvenilir bir seçim.",
  "C#": "Microsoft'un geliştirdiği modern, tip güvenli programlama dili. .NET ekosistemi ile web ve mobil uygulamalar geliştirmek için kullanılır.",
  ".NET": "Microsoft'un açık kaynaklı, platformlar arası geliştirme platformu. Web, mobil ve cloud uygulamaları için kapsamlı framework sunar.",
  "Go": "Google'ın geliştirdiği basit, hızlı ve güvenilir programlama dili. Mikroservis mimarileri için idealdir.",
  "Rust": "Bellek güvenliği ve performansı birleştiren modern sistem programlama dili.",
  "PHP": "Web geliştirme için tasarlanmış popüler sunucu tarafı scripting dili.",
  "Swift": "Apple'ın geliştirdiği modern, güvenli programlama dili. iOS uygulamaları için kullanılır.",
  "Kotlin": "JVM üzerinde çalışan modern programlama dili. Android geliştirme için resmi dil olarak kullanılır.",
  "Docker": "Uygulamaları konteynerler içinde paketleyip dağıtmayı sağlayan platform.",
  "Kubernetes": "Konteyner orkestrasyon platformu. Büyük ölçekli uygulamaların otomatik dağıtımını sağlar.",
  "AWS": "Amazon Web Services - Bulut bilişim platformu.",
  "Azure": "Microsoft'un bulut bilişim platformu.",
  "GCP": "Google Cloud Platform - Google'ın bulut bilişim hizmeti.",
};

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
  "Henüz karar vermedim",
];

const INDUSTRY_DESCRIPTIONS: Record<string, string> = {
  "E-ticaret": "Online alışveriş platformları ve dijital pazarlama çözümleri. E-ticaret siteleri, ödeme sistemleri ve sipariş yönetim sistemleri geliştirme fırsatları.",
  "Fintech": "Finansal teknolojiler. Dijital bankacılık, ödeme sistemleri, kripto para, yatırım platformları ve finansal inovasyon projeleri.",
  "SaaS": "Software as a Service - Bulut tabanlı yazılım hizmetleri. Abonelik modeliyle çalışan, ölçeklenebilir iş uygulamaları geliştirme.",
  "Gaming": "Oyun endüstrisi. Video oyun geliştirme, oyun motorları, mobil oyunlar ve e-spor teknolojileri. Yaratıcılık ve teknik becerilerin birleştiği alan.",
  "Healthcare": "Sağlık teknolojileri. Elektronik sağlık kayıtları, tele-tıp, medikal cihaz yazılımları ve sağlık analitik sistemleri geliştirme.",
  "Education": "Eğitim teknolojileri. Online öğrenme platformları, eğitim içerik yönetimi, öğrenci takip sistemleri ve interaktif öğretim araçları.",
  "Social Media": "Sosyal medya platformları. İçerik paylaşımı, etkileşim araçları, sosyal ağ algoritmaları ve topluluk yönetim sistemleri.",
  "Enterprise": "Kurumsal yazılım çözümleri. Büyük şirketler için özelleştirilmiş sistemler, iş süreç otomasyonu ve kurumsal kaynak planlama (ERP) uygulamaları.",
  "Startup": "Yeni nesil teknoloji girişimleri. Hızlı büyüme, inovasyon odaklı projeler, esnek çalışma ortamı ve yüksek etki potansiyeli olan projeler.",
  "Açık kaynak": "Açık kaynak yazılım geliştirme. Topluluk projeleri, ücretsiz ve özgür yazılım geliştirme, teknoloji paylaşımı ve işbirlikçi projeler.",
  "Henüz karar vermedim": "Farklı sektörleri keşfetmek ve size uygun olanı bulmak için genel bir kariyer planı hazırlanır. Size çeşitli sektör fırsatlarını tanıtacağız.",
};

interface Technology {
  name: string;
  description: string | null;
  testCount: number;
  moduleCount: number;
}

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
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [availableTechnologies, setAvailableTechnologies] = useState<Technology[]>([]);
  const [loadingTechnologies, setLoadingTechnologies] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loadingMessages = [
    {
      icon: Brain,
      text: "Profil Bilgilerinize Göre Kariyer Planı Oluşturuluyor",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Sparkles,
      text: "Hedeflerinize Uygun Yol Haritası Hazırlanıyor",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: Target,
      text: "Size Özel Kariyer Yol Haritanız AI İle Oluşturuluyor",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUp,
      text: "Kariyer Hedeflerinize Uygun Adımlar Belirleniyor",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Zap,
      text: "Öğrenme Yol Haritanız ve Kaynaklar Hazırlanıyor",
      color: "text-violet-600 dark:text-violet-400",
    },
  ];

  const totalSteps = 6;

  // Fetch technologies from API
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoadingTechnologies(true);
      try {
        const response = await fetch("/api/education/tests/technologies");
        const data = await response.json();
        if (data.technologies && Array.isArray(data.technologies)) {
          setAvailableTechnologies(data.technologies);
        }
      } catch (error) {
        console.error("Error fetching technologies:", error);
        // Continue with empty array if fetch fails
        setAvailableTechnologies([]);
      } finally {
        setLoadingTechnologies(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Get filtered technologies based on specialization
  const getFilteredTechnologies = (): Technology[] => {
    if (!formData.specialization || formData.specialization === "Henüz karar vermedim") {
      // Show all technologies if no specialization selected
      return availableTechnologies;
    }

    const relevantTechNames = SPECIALIZATION_TECH_MAP[formData.specialization] || [];
    
    // Filter technologies that match the specialization or are in the relevant tech list
    return availableTechnologies.filter((tech) => {
      const techName = tech.name.toLowerCase();
      return relevantTechNames.some((relevantTech) => 
        techName.includes(relevantTech.toLowerCase()) || 
        relevantTech.toLowerCase().includes(techName)
      );
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  // Auto-advance to next step after selection (for single-choice questions)
  const autoAdvance = (delay: number = 400) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < totalSteps) {
          return prevStep + 1;
        }
        return prevStep;
      });
    }, delay);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  // Reset transition state when step changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [currentStep]);

  // Loading progress ve mesaj animasyonu
  useEffect(() => {
    if (!showLoadingPopup) return;

    // Progress bar animasyonu (0-90% arası, gerçek yükleme tamamlanana kadar)
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return 90; // %90'a kadar gider, gerçek yükleme bitince %100 olur
        return prev + Math.random() * 3; // Yavaş yavaş artır
      });
    }, 200);

    // Mesaj değiştirme animasyonu
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [showLoadingPopup]);

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setShowLoadingPopup(true);
      setLoadingProgress(0);
      setLoadingMessageIndex(0);
      // onComplete'i çağırmadan önce kısa bir gecikme ekleyelim ki popup görünsün
      setTimeout(() => {
        onComplete(formData);
      }, 100);
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, specialization: spec }));
                    // Auto-advance to next step after selection
                    autoAdvance();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.specialization === spec
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{spec}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {SPECIALIZATION_DESCRIPTIONS[spec]}
                    </p>
                  </div>
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, careerGoal: goal }));
                    // Auto-advance to next step after selection
                    autoAdvance();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.careerGoal === goal
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{goal}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {CAREER_GOAL_DESCRIPTIONS[goal]}
                    </p>
                  </div>
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
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, timeline }));
                    // Auto-advance to next step after selection
                    autoAdvance();
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.timeline === timeline
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
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
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, skillLevel: level }));
                    // Auto-advance to next step after selection
                    autoAdvance();
                  }}
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
        const filteredTechs = getFilteredTechnologies();
        const displayTechnologies = filteredTechs.length > 0 ? filteredTechs : availableTechnologies;
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hangi teknolojilerle çalışmak istiyorsunuz? (Opsiyonel)
              </h3>
              {formData.specialization && formData.specialization !== "Henüz karar vermedim" && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.specialization} alanına uygun teknolojiler gösteriliyor. İstediğiniz teknolojileri seçebilirsiniz.
                </p>
              )}
            </div>
            {loadingTechnologies ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Teknolojiler yükleniyor...</span>
              </div>
            ) : displayTechnologies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {displayTechnologies.map((tech) => {
                    const techName = tech.name;
                    const techDescription = tech.description || TECHNOLOGY_DESCRIPTIONS[techName] || "Bu teknoloji hakkında detaylı bilgi için platform içindeki ilgili kursları inceleyebilirsiniz.";
                    
                    return (
                      <button
                        key={techName}
                        type="button"
                        onClick={() => toggleTechnology(techName)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          (formData.technologies || []).includes(techName)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{techName}</div>
                            {(tech.testCount > 0 || tech.moduleCount > 0) && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {tech.moduleCount > 0 && `${tech.moduleCount} modül`}
                                {tech.testCount > 0 && ` • ${tech.testCount} test`}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {techDescription}
                          </p>
                        </div>
                      </button>
                    );
                  })}
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
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">
                Teknolojiler yüklenemedi. Devam edebilirsiniz, size öneriler sunacağız.
              </p>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hangi sektörlerle ilgileniyorsunuz? (Opsiyonel)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {INDUSTRY_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    if (interest === "Henüz karar vermedim") {
                      // "Henüz karar vermedim" seçilirse diğer seçimleri temizle
                      const isSelected = (formData.industryInterests || []).includes(interest);
                      setFormData((prev) => ({
                        ...prev,
                        industryInterests: isSelected ? [] : ["Henüz karar vermedim"],
                      }));
                    } else {
                      // Diğer seçenekler seçilirse "Henüz karar vermedim"i kaldır
                      const currentInterests = (formData.industryInterests || []).filter(
                        (i) => i !== "Henüz karar vermedim"
                      );
                      const isSelected = currentInterests.includes(interest);
                      setFormData((prev) => ({
                        ...prev,
                        industryInterests: isSelected
                          ? currentInterests.filter((i) => i !== interest)
                          : [...currentInterests, interest],
                      }));
                    }
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    (formData.industryInterests || []).includes(interest)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{interest}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {INDUSTRY_DESCRIPTIONS[interest]}
                    </p>
                  </div>
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

  // Loading popup gösteriliyorsa, sadece popup'ı göster
  if (showLoadingPopup) {
    const CurrentIcon = loadingMessages[loadingMessageIndex].icon;
    const currentMessage = loadingMessages[loadingMessageIndex].text;
    const currentColor = loadingMessages[loadingMessageIndex].color;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <Card variant="elevated" className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Icon */}
              <div className="relative pt-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center animate-pulse">
                  <CurrentIcon className={`h-10 w-10 text-white animate-bounce`} />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-20 animate-ping"></div>
              </div>

              {/* Main Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                  {currentMessage}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kariyer planınız hazırlanıyor, lütfen bekleyin...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">İlerleme</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                {loadingMessages.map((msg, index) => {
                  const Icon = msg.icon;
                  const isActive = index === loadingMessageIndex;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-5 w-5 ${
                            isActive
                              ? msg.color
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium ${
                            isActive
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading Dots */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div
          key={currentStep}
          className={`transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 transform translate-x-4"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {renderStep()}
        </div>
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

