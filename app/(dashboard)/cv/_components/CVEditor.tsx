/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Trophy,
  Users,
  Heart,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import CVRenderer from "@/app/components/cv/CVRenderer";
import {
  CV_LIMITS,
  countWords,
  countChars,
  getValidationStatus,
  getValidationMessage,
  validateExperienceCount,
  validateProjectsCount,
  validateEducationCount,
  validateAchievementsCount,
  validateCertificationsCount,
} from "./cvValidation";

interface CVTemplate {
  id: string;
  name: string;
  structure: any;
}

export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    profilePhoto?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  hobbies: string[];
}

type CVEditorMode = "create" | "edit";

export interface CVEditorProps {
  mode: CVEditorMode;
  initialTemplateId?: string | null;
  cvId?: string;
}

const steps = [
  { id: 1, name: "Kişisel Bilgiler", icon: User },
  { id: 2, name: "Özet", icon: User },
  { id: 3, name: "Deneyim", icon: Briefcase },
  { id: 4, name: "Eğitim", icon: GraduationCap },
  { id: 5, name: "Beceriler", icon: Code },
  { id: 6, name: "Diller", icon: Globe },
  { id: 7, name: "Projeler", icon: Code },
  { id: 8, name: "Başarılar", icon: Trophy },
  { id: 9, name: "Sertifikalar", icon: Award },
  { id: 10, name: "Referanslar", icon: Users },
  { id: 11, name: "Hobiler", icon: Heart },
];

const createEmptyCvData = (): CVData => ({
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    profilePhoto: undefined,
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  achievements: [],
  certifications: [],
  references: [],
  hobbies: [],
});

const normalizeCvData = (data: any): CVData => {
  const base = createEmptyCvData();
  if (!data || typeof data !== "object") {
    return base;
  }

  return {
    personalInfo: {
      ...base.personalInfo,
      ...(data.personalInfo ?? {}),
    },
    summary: typeof data.summary === "string" ? data.summary : "",
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    references: Array.isArray(data.references) ? data.references : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
  };
};

export default function CVEditor({
  mode,
  initialTemplateId,
  cvId,
}: CVEditorProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<CVTemplate | null>(null);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData>(createEmptyCvData());
  const [currentStep, setCurrentStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setTemplatesLoaded(false);

      try {
        const templatesResponse = await fetch("/api/cv/templates");
        if (!templatesResponse.ok) {
          throw new Error("Şablon bilgileri alınamadı");
        }
        const templatesPayload = await templatesResponse.json();
        const templates: CVTemplate[] = templatesPayload.templates ?? [];

        if (!templates.length) {
          throw new Error("Kullanılabilir şablon bulunamadı");
        }

        if (mode === "edit") {
          if (!cvId) {
            throw new Error("CV bulunamadı");
          }

          const cvResponse = await fetch(`/api/cv/${cvId}`);
          const cvPayload = await cvResponse.json();
          if (!cvResponse.ok) {
            throw new Error(cvPayload.error || "CV yüklenemedi");
          }

          const normalized = normalizeCvData(cvPayload.cv?.data);
          setCvData(normalized);

          const matchedTemplate =
            templates.find((item) => item.id === cvPayload.cv?.template?.id) ??
            cvPayload.cv?.template ??
            templates[0];

          setTemplate(matchedTemplate || null);
          setTemplatesLoaded(true);
        } else {
          const defaultTemplate =
            templates.find((item) => item.id === initialTemplateId) ?? templates[0];
          setTemplate(defaultTemplate || null);
          setCvData(createEmptyCvData());
          setTemplatesLoaded(true);
        }
      } catch (err) {
        console.error("Error loading CV editor data:", err);
        setError(
          err instanceof Error ? err.message : "CV yüklenirken bir hata oluştu"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, cvId, initialTemplateId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.url) {
        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profilePhoto: data.url,
          },
        }));
      } else {
        setError(data.error || "Fotoğraf yüklenemedi");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Fotoğraf yüklenirken bir hata oluştu");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!template) {
      setError("Şablon bulunamadı");
      return;
    }

    if (mode === "edit" && !cvId) {
      setError("CV bulunamadı");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const endpoint =
        mode === "edit" ? `/api/cv/${cvId}` : "/api/cv";
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? { data: cvData }
          : {
              templateId: template.id,
              data: cvData,
            };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        router.push("/cv/my-cvs");
      } else {
        setError(data.error || "CV kaydedilirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Error saving CV:", err);
      setError("CV kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setCvData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const removeHobby = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === "edit" ? "CV yükleniyor..." : "Yükleniyor..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card variant="elevated">
          <CardContent className="py-16">
            <div className="text-center">
              <X className="h-16 w-16 text-red-400 dark:text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hata
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => router.push("/cv/my-cvs")}>
                CV&apos;lere Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!templatesLoaded || !template) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Şablon yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profil Fotoğrafı
                </label>
                <div className="flex items-center gap-4">
                  {cvData.personalInfo.profilePhoto ? (
                    <div className="relative">
                      <img
                        src={cvData.personalInfo.profilePhoto}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              profilePhoto: undefined,
                            },
                          }))
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                      {uploadingPhoto ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Yükleniyor...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Fotoğraf Yükle</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <Input
                label="Ad Soyad"
                placeholder="Ad Soyad"
                value={cvData.personalInfo.name}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      name: e.target.value,
                    },
                  }))
                }
              />
              <Input
                label="Email"
                type="email"
                placeholder="Email"
                value={cvData.personalInfo.email}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      email: e.target.value,
                    },
                  }))
                }
              />
              <Input
                label="Telefon"
                type="tel"
                placeholder="Telefon"
                value={cvData.personalInfo.phone}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      phone: e.target.value,
                    },
                  }))
                }
              />
              <Input
                label="Adres"
                placeholder="Adres"
                value={cvData.personalInfo.address}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      address: e.target.value,
                    },
                  }))
                }
              />
              <Input
                label="LinkedIn"
                placeholder="LinkedIn URL"
                value={cvData.personalInfo.linkedin}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      linkedin: e.target.value,
                    },
                  }))
                }
              />
              <Input
                label="Website"
                placeholder="Website URL"
                value={cvData.personalInfo.website}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      website: e.target.value,
                    },
                  }))
                }
              />
            </CardContent>
          </Card>
        );

      case 2:
        const summaryWordCount = countWords(cvData.summary);
        const summaryCharCount = countChars(cvData.summary);
        const summaryStatus = getValidationStatus(
          cvData.summary,
          CV_LIMITS.summary.maxWords,
          CV_LIMITS.summary.maxChars
        );
        const summaryMessage = getValidationMessage(
          cvData.summary,
          CV_LIMITS.summary.maxWords,
          CV_LIMITS.summary.maxChars,
          "Özet"
        );
        
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Profesyonel Özet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <textarea
                placeholder="Kendinizi ve kariyer hedeflerinizi kısaca açıklayın..."
                value={cvData.summary}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newWordCount = countWords(newValue);
                  const newCharCount = countChars(newValue);
                  
                  // Prevent exceeding limits
                  if (newWordCount <= CV_LIMITS.summary.maxWords && 
                      newCharCount <= CV_LIMITS.summary.maxChars) {
                    setCvData((prev) => ({ ...prev, summary: newValue }));
                  }
                }}
                maxLength={CV_LIMITS.summary.maxChars}
                className={`w-full px-4 py-2 rounded-lg border min-h-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  summaryStatus === 'error'
                    ? 'border-red-500 dark:border-red-500'
                    : summaryStatus === 'warning'
                    ? 'border-yellow-500 dark:border-yellow-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={8}
              />
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4">
                  <span className={summaryStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                                   summaryStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                                   'text-gray-600 dark:text-gray-400'}>
                    {summaryWordCount}/{CV_LIMITS.summary.maxWords} kelime
                  </span>
                  <span className={summaryStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                                   summaryStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                                   'text-gray-600 dark:text-gray-400'}>
                    {summaryCharCount}/{CV_LIMITS.summary.maxChars} karakter
                  </span>
                </div>
              </div>
              {summaryMessage && (
                <p className={`text-xs ${
                  summaryStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {summaryMessage}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        const canAddExperience = validateExperienceCount(cvData.experience.length);
        
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                İş Deneyimi
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({cvData.experience.length}/{CV_LIMITS.experience.maxEntries})
                </span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  if (canAddExperience) {
                    setCvData((prev) => ({
                      ...prev,
                      experience: [
                        ...prev.experience,
                        {
                          company: "",
                          position: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                          current: false,
                        },
                      ],
                    }));
                  }
                }}
                disabled={!canAddExperience}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Pozisyon"
                      value={exp.position}
                      onChange={(e) => {
                        const experience = [...cvData.experience];
                        experience[index].position = e.target.value;
                        setCvData((prev) => ({ ...prev, experience }));
                      }}
                    />
                    <Input
                      placeholder="Şirket"
                      value={exp.company}
                      onChange={(e) => {
                        const experience = [...cvData.experience];
                        experience[index].company = e.target.value;
                        setCvData((prev) => ({ ...prev, experience }));
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        placeholder="Başlangıç"
                        value={exp.startDate}
                        onChange={(e) => {
                          const experience = [...cvData.experience];
                          experience[index].startDate = e.target.value;
                          setCvData((prev) => ({ ...prev, experience }));
                        }}
                      />
                      <Input
                        type="date"
                        placeholder="Bitiş"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => {
                          const experience = [...cvData.experience];
                          experience[index].endDate = e.target.value;
                          setCvData((prev) => ({ ...prev, experience }));
                        }}
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => {
                          const experience = [...cvData.experience];
                          experience[index].current = e.target.checked;
                          setCvData((prev) => ({ ...prev, experience }));
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Devam ediyor
                      </span>
                    </label>
                    {(() => {
                      const expWordCount = countWords(exp.description);
                      const expCharCount = countChars(exp.description);
                      const expStatus = getValidationStatus(
                        exp.description,
                        CV_LIMITS.experience.descriptionMaxWords,
                        CV_LIMITS.experience.descriptionMaxChars
                      );
                      const expMessage = getValidationMessage(
                        exp.description,
                        CV_LIMITS.experience.descriptionMaxWords,
                        CV_LIMITS.experience.descriptionMaxChars,
                        "Açıklama"
                      );
                      
                      return (
                        <div className="space-y-1">
                          <textarea
                            placeholder="Açıklama"
                            value={exp.description}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newWordCount = countWords(newValue);
                              const newCharCount = countChars(newValue);
                              
                              if (newWordCount <= CV_LIMITS.experience.descriptionMaxWords && 
                                  newCharCount <= CV_LIMITS.experience.descriptionMaxChars) {
                                const experience = [...cvData.experience];
                                experience[index].description = newValue;
                                setCvData((prev) => ({ ...prev, experience }));
                              }
                            }}
                            maxLength={CV_LIMITS.experience.descriptionMaxChars}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                              expStatus === 'error'
                                ? 'border-red-500 dark:border-red-500'
                                : expStatus === 'warning'
                                ? 'border-yellow-500 dark:border-yellow-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            rows={3}
                          />
                          <div className="flex justify-between items-center text-xs">
                            <span className={expStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                                             expStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                                             'text-gray-500 dark:text-gray-400'}>
                              {expWordCount}/{CV_LIMITS.experience.descriptionMaxWords} kelime, {expCharCount}/{CV_LIMITS.experience.descriptionMaxChars} karakter
                            </span>
                          </div>
                          {expMessage && (
                            <p className={`text-xs ${
                              expStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                              'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {expMessage}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
              {cvData.experience.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Henüz deneyim eklenmedi
                </p>
              )}
              {!canAddExperience && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2">
                  Maksimum {CV_LIMITS.experience.maxEntries} deneyim eklenebilir.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        const canAddEducation = validateEducationCount(cvData.education.length);
        
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Eğitim
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({cvData.education.length}/{CV_LIMITS.education.maxEntries})
                </span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  if (canAddEducation) {
                    setCvData((prev) => ({
                      ...prev,
                      education: [
                        ...prev.education,
                        {
                          school: "",
                          degree: "",
                          field: "",
                          startDate: "",
                          endDate: "",
                        },
                      ],
                    }));
                  }
                }}
                disabled={!canAddEducation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.education.map((edu, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Okul/Üniversite"
                      value={edu.school}
                      onChange={(e) => {
                        const education = [...cvData.education];
                        education[index].school = e.target.value;
                        setCvData((prev) => ({ ...prev, education }));
                      }}
                    />
                    <Input
                      placeholder="Derece"
                      value={edu.degree}
                      onChange={(e) => {
                        const education = [...cvData.education];
                        education[index].degree = e.target.value;
                        setCvData((prev) => ({ ...prev, education }));
                      }}
                    />
                    <Input
                      placeholder="Alan"
                      value={edu.field}
                      onChange={(e) => {
                        const education = [...cvData.education];
                        education[index].field = e.target.value;
                        setCvData((prev) => ({ ...prev, education }));
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        placeholder="Başlangıç"
                        value={edu.startDate}
                        onChange={(e) => {
                          const education = [...cvData.education];
                          education[index].startDate = e.target.value;
                          setCvData((prev) => ({ ...prev, education }));
                        }}
                      />
                      <Input
                        type="date"
                        placeholder="Bitiş"
                        value={edu.endDate}
                        onChange={(e) => {
                          const education = [...cvData.education];
                          education[index].endDate = e.target.value;
                          setCvData((prev) => ({ ...prev, education }));
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
              {cvData.education.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Henüz eğitim eklenmedi
                </p>
              )}
              {!canAddEducation && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2">
                  Maksimum {CV_LIMITS.education.maxEntries} eğitim eklenebilir.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Beceriler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Yeni beceri ekle"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Yabancı Diller</CardTitle>
              <Button
                size="sm"
                onClick={() =>
                  setCvData((prev) => ({
                    ...prev,
                    languages: [
                      ...prev.languages,
                      { name: "", level: "Başlangıç" },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.languages.map((lang, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Dil adı"
                      value={lang.name}
                      onChange={(e) => {
                        const languages = [...cvData.languages];
                        languages[index].name = e.target.value;
                        setCvData((prev) => ({ ...prev, languages }));
                      }}
                    />
                    <select
                      value={lang.level}
                      onChange={(e) => {
                        const languages = [...cvData.languages];
                        languages[index].level = e.target.value;
                        setCvData((prev) => ({ ...prev, languages }));
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option>Başlangıç</option>
                      <option>Orta</option>
                      <option>İleri</option>
                      <option>Anadil</option>
                    </select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCvData((prev) => ({
                        ...prev,
                        languages: prev.languages.filter((_, i) => i !== index),
                      }))
                    }
                    className="mt-2"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Kaldır
                  </Button>
                </Card>
              ))}
            </CardContent>
          </Card>
        );

      case 7:
        const canAddProject = validateProjectsCount(cvData.projects.length);
        
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Projeler
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({cvData.projects.length}/{CV_LIMITS.projects.maxEntries})
                </span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  if (canAddProject) {
                    setCvData((prev) => ({
                      ...prev,
                      projects: [
                        ...prev.projects,
                        {
                          name: "",
                          description: "",
                          technologies: "",
                          url: "",
                          startDate: "",
                          endDate: "",
                        },
                      ],
                    }));
                  }
                }}
                disabled={!canAddProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.projects.map((project, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Proje adı"
                      value={project.name}
                      onChange={(e) => {
                        const projects = [...cvData.projects];
                        projects[index].name = e.target.value;
                        setCvData((prev) => ({ ...prev, projects }));
                      }}
                    />
                    {(() => {
                      const projWordCount = countWords(project.description);
                      const projCharCount = countChars(project.description);
                      const projStatus = getValidationStatus(
                        project.description,
                        CV_LIMITS.projects.descriptionMaxWords,
                        CV_LIMITS.projects.descriptionMaxChars
                      );
                      const projMessage = getValidationMessage(
                        project.description,
                        CV_LIMITS.projects.descriptionMaxWords,
                        CV_LIMITS.projects.descriptionMaxChars,
                        "Açıklama"
                      );
                      
                      return (
                        <div className="space-y-1">
                          <textarea
                            placeholder="Açıklama"
                            value={project.description}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newWordCount = countWords(newValue);
                              const newCharCount = countChars(newValue);
                              
                              if (newWordCount <= CV_LIMITS.projects.descriptionMaxWords && 
                                  newCharCount <= CV_LIMITS.projects.descriptionMaxChars) {
                                const projects = [...cvData.projects];
                                projects[index].description = newValue;
                                setCvData((prev) => ({ ...prev, projects }));
                              }
                            }}
                            maxLength={CV_LIMITS.projects.descriptionMaxChars}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                              projStatus === 'error'
                                ? 'border-red-500 dark:border-red-500'
                                : projStatus === 'warning'
                                ? 'border-yellow-500 dark:border-yellow-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            rows={3}
                          />
                          <div className="flex justify-between items-center text-xs">
                            <span className={projStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                                             projStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                                             'text-gray-500 dark:text-gray-400'}>
                              {projWordCount}/{CV_LIMITS.projects.descriptionMaxWords} kelime, {projCharCount}/{CV_LIMITS.projects.descriptionMaxChars} karakter
                            </span>
                          </div>
                          {projMessage && (
                            <p className={`text-xs ${
                              projStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                              'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {projMessage}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                    <Input
                      placeholder="Teknolojiler (virgülle ayırın)"
                      value={project.technologies}
                      onChange={(e) => {
                        const projects = [...cvData.projects];
                        projects[index].technologies = e.target.value;
                        setCvData((prev) => ({ ...prev, projects }));
                      }}
                    />
                    <Input
                      placeholder="Proje URL (opsiyonel)"
                      value={project.url || ""}
                      onChange={(e) => {
                        const projects = [...cvData.projects];
                        projects[index].url = e.target.value;
                        setCvData((prev) => ({ ...prev, projects }));
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        placeholder="Başlangıç Tarihi"
                        value={project.startDate || ""}
                        onChange={(e) => {
                          const projects = [...cvData.projects];
                          projects[index].startDate = e.target.value;
                          setCvData((prev) => ({ ...prev, projects }));
                        }}
                      />
                      <Input
                        type="date"
                        placeholder="Bitiş Tarihi"
                        value={project.endDate || ""}
                        onChange={(e) => {
                          const projects = [...cvData.projects];
                          projects[index].endDate = e.target.value;
                          setCvData((prev) => ({ ...prev, projects }));
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
              {!canAddProject && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2">
                  Maksimum {CV_LIMITS.projects.maxEntries} proje eklenebilir.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 8:
        const canAddAchievement = validateAchievementsCount(cvData.achievements.length);
        
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Başarılar & Ödüller
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({cvData.achievements.length}/{CV_LIMITS.achievements.maxEntries})
                </span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  if (canAddAchievement) {
                    setCvData((prev) => ({
                      ...prev,
                      achievements: [
                        ...prev.achievements,
                        { title: "", description: "", date: "" },
                      ],
                    }));
                  }
                }}
                disabled={!canAddAchievement}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.achievements.map((achievement, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Başlık"
                      value={achievement.title}
                      onChange={(e) => {
                        const achievements = [...cvData.achievements];
                        achievements[index].title = e.target.value;
                        setCvData((prev) => ({ ...prev, achievements }));
                      }}
                    />
                    {(() => {
                      const achWordCount = countWords(achievement.description);
                      const achCharCount = countChars(achievement.description);
                      const achStatus = getValidationStatus(
                        achievement.description,
                        CV_LIMITS.achievements.descriptionMaxWords,
                        CV_LIMITS.achievements.descriptionMaxChars
                      );
                      const achMessage = getValidationMessage(
                        achievement.description,
                        CV_LIMITS.achievements.descriptionMaxWords,
                        CV_LIMITS.achievements.descriptionMaxChars,
                        "Açıklama"
                      );
                      
                      return (
                        <div className="space-y-1">
                          <textarea
                            placeholder="Açıklama"
                            value={achievement.description}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newWordCount = countWords(newValue);
                              const newCharCount = countChars(newValue);
                              
                              if (newWordCount <= CV_LIMITS.achievements.descriptionMaxWords && 
                                  newCharCount <= CV_LIMITS.achievements.descriptionMaxChars) {
                                const achievements = [...cvData.achievements];
                                achievements[index].description = newValue;
                                setCvData((prev) => ({ ...prev, achievements }));
                              }
                            }}
                            maxLength={CV_LIMITS.achievements.descriptionMaxChars}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                              achStatus === 'error'
                                ? 'border-red-500 dark:border-red-500'
                                : achStatus === 'warning'
                                ? 'border-yellow-500 dark:border-yellow-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            rows={3}
                          />
                          <div className="flex justify-between items-center text-xs">
                            <span className={achStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                                             achStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                                             'text-gray-500 dark:text-gray-400'}>
                              {achWordCount}/{CV_LIMITS.achievements.descriptionMaxWords} kelime, {achCharCount}/{CV_LIMITS.achievements.descriptionMaxChars} karakter
                            </span>
                          </div>
                          {achMessage && (
                            <p className={`text-xs ${
                              achStatus === 'error' ? 'text-red-600 dark:text-red-400' : 
                              'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {achMessage}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                    <Input
                      type="date"
                      placeholder="Tarih"
                      value={achievement.date}
                      onChange={(e) => {
                        const achievements = [...cvData.achievements];
                        achievements[index].date = e.target.value;
                        setCvData((prev) => ({ ...prev, achievements }));
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          achievements: prev.achievements.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
              {!canAddAchievement && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2">
                  Maksimum {CV_LIMITS.achievements.maxEntries} başarı eklenebilir.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 9:
        const canAddCertification = validateCertificationsCount(cvData.certifications.length);
        
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Sertifikalar
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({cvData.certifications.length}/{CV_LIMITS.certifications.maxEntries})
                </span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  if (canAddCertification) {
                    setCvData((prev) => ({
                      ...prev,
                      certifications: [
                        ...prev.certifications,
                        { name: "", issuer: "", date: "" },
                      ],
                    }));
                  }
                }}
                disabled={!canAddCertification}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.certifications.map((cert, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Sertifika adı"
                      value={cert.name}
                      onChange={(e) => {
                        const certifications = [...cvData.certifications];
                        certifications[index].name = e.target.value;
                        setCvData((prev) => ({ ...prev, certifications }));
                      }}
                    />
                    <Input
                      placeholder="Kurum"
                      value={cert.issuer}
                      onChange={(e) => {
                        const certifications = [...cvData.certifications];
                        certifications[index].issuer = e.target.value;
                        setCvData((prev) => ({ ...prev, certifications }));
                      }}
                    />
                    <Input
                      type="date"
                      placeholder="Tarih"
                      value={cert.date}
                      onChange={(e) => {
                        const certifications = [...cvData.certifications];
                        certifications[index].date = e.target.value;
                        setCvData((prev) => ({ ...prev, certifications }));
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          certifications: prev.certifications.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
              {!canAddCertification && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2">
                  Maksimum {CV_LIMITS.certifications.maxEntries} sertifika eklenebilir.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 10:
        return (
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Referanslar</CardTitle>
              <Button
                size="sm"
                onClick={() =>
                  setCvData((prev) => ({
                    ...prev,
                    references: [
                      ...prev.references,
                      {
                        name: "",
                        position: "",
                        company: "",
                        email: "",
                        phone: "",
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.references.map((ref, index) => (
                <Card key={index} variant="outlined" className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Ad Soyad"
                      value={ref.name}
                      onChange={(e) => {
                        const references = [...cvData.references];
                        references[index].name = e.target.value;
                        setCvData((prev) => ({ ...prev, references }));
                      }}
                    />
                    <Input
                      placeholder="Pozisyon"
                      value={ref.position}
                      onChange={(e) => {
                        const references = [...cvData.references];
                        references[index].position = e.target.value;
                        setCvData((prev) => ({ ...prev, references }));
                      }}
                    />
                    <Input
                      placeholder="Şirket"
                      value={ref.company}
                      onChange={(e) => {
                        const references = [...cvData.references];
                        references[index].company = e.target.value;
                        setCvData((prev) => ({ ...prev, references }));
                      }}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={ref.email}
                      onChange={(e) => {
                        const references = [...cvData.references];
                        references[index].email = e.target.value;
                        setCvData((prev) => ({ ...prev, references }));
                      }}
                    />
                    <Input
                      type="tel"
                      placeholder="Telefon"
                      value={ref.phone}
                      onChange={(e) => {
                        const references = [...cvData.references];
                        references[index].phone = e.target.value;
                        setCvData((prev) => ({ ...prev, references }));
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData((prev) => ({
                          ...prev,
                          references: prev.references.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        );

      case 11:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Hobiler & İlgi Alanları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Yeni hobi ekle"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHobby();
                    }
                  }}
                />
                <Button onClick={addHobby}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cvData.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {hobby}
                    <button
                      onClick={() => removeHobby(index)}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderNavigationControls = (className = "") => (
    <div className={`flex justify-between items-center ${className}`}>
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Önceki
      </Button>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Adım {currentStep} / {steps.length}
      </div>
      {currentStep < steps.length ? (
        <Button onClick={nextStep}>
          Sonraki
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button onClick={handleSave} isLoading={saving} disabled={saving}>
          <CheckCircle className="h-4 w-4 mr-2" />
          {mode === "edit" ? "Güncelle" : "Kaydet ve Bitir"}
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {mode === "edit" ? "CV Düzenle" : "CV Oluştur"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Şablon: {template?.name ?? "Bilinmiyor"}
        </p>
      </div>

      <Card variant="elevated">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between overflow-x-auto pb-4 pt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex items-center flex-shrink-0"
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg scale-110"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </button>
                    <span
                      className={`text-xs mt-2 text-center max-w-[80px] break-words ${
                        isActive
                          ? "font-semibold text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-16 mx-2 transition-all duration-200 ${
                        isCompleted
                          ? "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {mode === "create" && renderNavigationControls("border-t border-gray-200 dark:border-gray-700 pt-4")}
        </CardContent>
      </Card>

      {/* Form Section - Mobile: Full width, Desktop: 2 columns */}
      <div className="space-y-6 lg:hidden">
        {renderStepContent()}
      </div>

      {/* Desktop Layout: Side by side */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">{renderStepContent()}</div>

        <div className="lg:col-span-3 space-y-6">
          <Card variant="elevated" className="sticky top-6">
            <CardHeader>
              <CardTitle>
                Önizleme
                {template && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({template.name} Şablonu)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-center">
                <div className="bg-white shadow-lg w-full" style={{ maxWidth: "210mm" }}>
                  {template ? (
                    <CVRenderer data={cvData} templateId={template.id} />
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Şablon yükleniyor...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Section - Mobile: At the end, Desktop: Hidden (shown in grid above) */}
      {currentStep === steps.length && (
        <div className="lg:hidden space-y-4 mt-6">
          <Card variant="elevated">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-lg">
                Önizleme
                {template && (
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    ({template.name} Şablonu)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 space-y-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="bg-white shadow-lg" style={{ minWidth: "100%", width: "max-content" }}>
                  {template ? (
                    <CVRenderer data={cvData} templateId={template.id} />
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Şablon yükleniyor...
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                Önizlemeyi yatay kaydırarak tamamını görebilirsiniz
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Card variant="outlined" className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <X className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "edit" && renderNavigationControls("mt-6")}
    </div>
  );
}


