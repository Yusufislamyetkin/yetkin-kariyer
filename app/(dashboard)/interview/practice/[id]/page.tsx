"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";
import { checkSubscriptionAndRedirect } from "@/lib/utils/subscription-check";

type StandardQuestionType = "technical" | "behavioral" | "case";
type CodingQuestionType = "live_coding" | "bug_fix";
type QuestionType = StandardQuestionType | CodingQuestionType;

interface QuestionCommon {
  id: string;
  question?: string;
  prompt?: string;
  difficulty?: string;
  resources?: string[];
  description?: string;
  stage?: number; // CV bazlı mülakatlar için aşama bilgisi (1, 2, 3)
}

interface StandardQuestion extends QuestionCommon {
  type: StandardQuestionType;
}

interface LiveCodingQuestion extends QuestionCommon {
  type: "live_coding";
  languages: LiveCodingLanguage[];
  starterCode?: Partial<Record<LiveCodingLanguage, string>>;
  timeLimitMinutes?: number;
  supportingText?: string;
  acceptanceCriteria?: string[];
}

interface BugFixQuestion extends QuestionCommon {
  type: "bug_fix";
  languages: LiveCodingLanguage[];
  buggyCode: string;
  expectedFix?: string;
  timeLimitMinutes?: number;
  supportingText?: string;
  acceptanceCriteria?: string[];
}

type InterviewQuestion = StandardQuestion | LiveCodingQuestion | BugFixQuestion;

interface Interview {
  id: string;
  title: string;
  description: string | null;
  questions: InterviewQuestion[];
  duration: number | null;
  type?: string | null;
  cvId?: string | null; // CV ID (otomatik cevap doldurma için)
}

const DEFAULT_LANGUAGE: LiveCodingLanguage = "javascript";
const VALID_LANGUAGES: LiveCodingLanguage[] = ["csharp", "python", "javascript", "java"];

const normalizeLanguages = (value: unknown): LiveCodingLanguage[] => {
  if (!Array.isArray(value)) {
    return [DEFAULT_LANGUAGE];
  }

  const parsed = value
    .map((lang) => (typeof lang === "string" ? lang.toLowerCase().trim() : null))
    .filter((lang): lang is string => Boolean(lang) && VALID_LANGUAGES.includes(lang as LiveCodingLanguage));

  return (parsed.length ? parsed : [DEFAULT_LANGUAGE]) as LiveCodingLanguage[];
};

const normalizeStarterCode = (value: unknown): Partial<Record<LiveCodingLanguage, string>> => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return VALID_LANGUAGES.reduce<Partial<Record<LiveCodingLanguage, string>>>((acc, lang) => {
    const code = (value as Record<string, unknown>)[lang];
    if (typeof code === "string") {
      acc[lang] = code;
    }
    return acc;
  }, {});
};

const normalizeStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const parsed = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return parsed.length > 0 ? parsed : undefined;
};

const normalizeQuestions = (rawQuestions: unknown): InterviewQuestion[] => {
  let parsed: unknown[] = [];

  if (Array.isArray(rawQuestions)) {
    parsed = rawQuestions;
  } else if (typeof rawQuestions === "string") {
    try {
      const jsonValue = JSON.parse(rawQuestions);
      if (Array.isArray(jsonValue)) {
        parsed = jsonValue;
      }
    } catch (error) {
      console.warn("Interview questions JSON parse error:", error);
    }
  }

  return parsed
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const item = entry as Record<string, unknown>;
      const id = typeof item.id === "string" ? item.id : `question_${index + 1}`;
      const rawType = typeof item.type === "string" ? item.type.toLowerCase().trim() : "technical";

      if (rawType === "live_coding") {
        const liveQuestion: LiveCodingQuestion = {
          id,
          type: "live_coding",
          question: typeof item.question === "string" ? item.question : undefined,
          prompt: typeof item.prompt === "string" ? item.prompt : undefined,
          difficulty: typeof item.difficulty === "string" ? item.difficulty : undefined,
          resources: normalizeStringArray(item.resources),
          description: typeof item.description === "string" ? item.description : undefined,
          languages: normalizeLanguages(item.languages),
          starterCode: normalizeStarterCode(item.starterCode),
          timeLimitMinutes:
            typeof item.timeLimitMinutes === "number" && item.timeLimitMinutes > 0
              ? item.timeLimitMinutes
              : undefined,
          supportingText: typeof item.supportingText === "string" ? item.supportingText : undefined,
          acceptanceCriteria: normalizeStringArray(item.acceptanceCriteria),
          stage: typeof item.stage === "number" ? item.stage : undefined,
        };

        return liveQuestion;
      }

      if (rawType === "bug_fix") {
        const buggyCode =
          typeof item.buggyCode === "string"
            ? item.buggyCode
            : typeof item.initialCode === "string"
              ? item.initialCode
              : "";

        const bugFixQuestion: BugFixQuestion = {
          id,
          type: "bug_fix",
          question: typeof item.question === "string" ? item.question : undefined,
          prompt: typeof item.prompt === "string" ? item.prompt : undefined,
          difficulty: typeof item.difficulty === "string" ? item.difficulty : undefined,
          resources: normalizeStringArray(item.resources),
          description: typeof item.description === "string" ? item.description : undefined,
          languages: normalizeLanguages(item.languages),
          buggyCode,
          expectedFix: typeof item.expectedFix === "string" ? item.expectedFix : undefined,
          timeLimitMinutes:
            typeof item.timeLimitMinutes === "number" && item.timeLimitMinutes > 0
              ? item.timeLimitMinutes
              : undefined,
          supportingText: typeof item.supportingText === "string" ? item.supportingText : undefined,
          acceptanceCriteria: normalizeStringArray(item.acceptanceCriteria),
          stage: typeof item.stage === "number" ? item.stage : undefined,
        };

        return bugFixQuestion;
      }

      const safeType: StandardQuestionType =
        rawType === "behavioral" || rawType === "case" ? (rawType as StandardQuestionType) : "technical";

      const standardQuestion: StandardQuestion = {
        id,
        type: safeType,
        question: typeof item.question === "string" ? item.question : undefined,
        prompt: typeof item.prompt === "string" ? item.prompt : undefined,
        difficulty: typeof item.difficulty === "string" ? item.difficulty : undefined,
        resources: normalizeStringArray(item.resources),
        description: typeof item.description === "string" ? item.description : undefined,
        stage: typeof item.stage === "number" ? item.stage : undefined,
      };

      return standardQuestion;
    })
    .filter((question): question is InterviewQuestion => Boolean(question));
};

const isLiveCodingQuestion = (question: InterviewQuestion): question is LiveCodingQuestion =>
  question.type === "live_coding";

const isBugFixQuestion = (question: InterviewQuestion): question is BugFixQuestion => question.type === "bug_fix";

const questionTypeLabels: Record<QuestionType, string> = {
  technical: "Teknik Soru",
  behavioral: "Davranışsal Soru",
  case: "Vaka Çalışması",
  live_coding: "Canlı Kodlama",
  bug_fix: "Bug Fix Görevi",
};

const resolveMediaRecorderOptions = (): MediaRecorderOptions | undefined => {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return undefined;
  }

  // Firefox ve diğer tarayıcılar için codec kontrolleri
  const codecs = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4", // Bazı tarayıcılar için fallback
  ];

  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
      return { mimeType: codec };
    }
  }

  // Hiçbir codec desteklenmiyorsa, tarayıcının varsayılanını kullan
  // MediaRecorder codec belirtmeden de çalışabilir
  return {};
};

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();

  const interviewId = useMemo(() => {
    const value = (params as Record<string, string | string[] | undefined>)?.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params]);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenCaptureEnabled, setScreenCaptureEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState("");
  const [exitIntent, setExitIntent] = useState<"finishWithoutRecording" | "leave" | null>(null);

  const [textResponses, setTextResponses] = useState<Record<string, string>>({});
  const [codeResponses, setCodeResponses] = useState<Record<string, string>>({});
  const [codeLanguages, setCodeLanguages] = useState<Record<string, LiveCodingLanguage>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const screenChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const uploadedCameraUrlRef = useRef<string | null>(null);
  const uploadedScreenUrlRef = useRef<string | null>(null);
  const cameraUploadPendingRef = useRef(false);
  const screenUploadPendingRef = useRef(false);

  const requestFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      setWarning("Tam ekran modu açılamadı. Lütfen F11 tuşuna basarak veya tarayıcı menüsünden manuel olarak tam ekran modunu açın.");
    }
  }, []);

  const handleFullscreenChange = useCallback(() => {
    if (typeof document === "undefined") return;
    setIsFullscreen(Boolean(document.fullscreenElement));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isRecording) {
      const isCVBased = window.location.pathname.includes('/cv-based');
      const warningMsg = isCVBased
        ? "Sekme değiştirdiğiniz tespit edildi! Sisteminizi aldatma girişiminde bulunursanız hesabınız bloke edilecektir. Lütfen mülakat odasında kalın."
        : "Sekme değiştirdiğiniz tespit edildi! Lütfen mülakat odasında kalın.";
      setWarning(warningMsg);
    }
  }, [isRecording]);

  const handleScreenShareEnded = useCallback(() => {
    setScreenCaptureEnabled(false);
    setWarning("Ekran paylaşımı sonlandırıldı. Lütfen ekran kaydını yeniden başlatın.");
  }, []);

  const handleFocus = useCallback(() => {
    if (isRecording) {
      if (!isFullscreen) {
        setWarning("Tam ekran modunda olmanız gerekiyor!");
      } else if (!screenCaptureEnabled) {
        setWarning("Ekran kaydı aktif değil. Lütfen ekran paylaşımını tekrar başlatın.");
      }
    }
  }, [isRecording, isFullscreen, screenCaptureEnabled]);

  const fetchInterview = useCallback(async () => {
    if (!interviewId) return;

    setLoading(true);
    try {
      // CV bazlı mülakatlar için farklı endpoint kullan (pathname kontrolü ile başla)
      const isCVBasedPath = window.location.pathname.includes('/cv-based');
      const endpoint = isCVBasedPath 
        ? `/api/interview/cv-based/${interviewId}`
        : `/api/interview/${interviewId}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Mülakat bilgileri alınamadı");
      }

      const data = await response.json();
      if (!data?.interview) {
        setInterview(null);
        return;
      }

      // Interview type'ını kontrol et (database'den gelen bilgi)
      const isCVBased = data.interview.type === "cv_based" || window.location.pathname.includes('/cv-based');
      
      // Eğer CV-based ise ve endpoint yanlışsa, doğru endpoint'i kullan
      if (isCVBased && !endpoint.includes('/cv-based')) {
        const cvBasedResponse = await fetch(`/api/interview/cv-based/${interviewId}`);
        if (cvBasedResponse.ok) {
          const cvBasedData = await cvBasedResponse.json();
          if (cvBasedData?.interview) {
            const normalizedQuestions = normalizeQuestions(cvBasedData.interview.questions);
            const formattedInterview: Interview = {
              id: cvBasedData.interview.id,
              title: cvBasedData.interview.title,
              description: cvBasedData.interview.description ?? null,
              duration: cvBasedData.interview.duration ?? null,
              questions: normalizedQuestions,
              type: cvBasedData.interview.type ?? null,
              cvId: cvBasedData.interview.cvId ?? null,
            };
            setInterview(formattedInterview);
            setCurrentQuestion(0);
            if (formattedInterview.duration) {
              setTimeLeft(formattedInterview.duration * 60);
            }
            const initialText: Record<string, string> = {};
            const initialCode: Record<string, string> = {};
            const initialLanguages: Record<string, LiveCodingLanguage> = {};
            normalizedQuestions.forEach((question) => {
              if (isLiveCodingQuestion(question)) {
                const defaultLanguage = question.languages[0] ?? DEFAULT_LANGUAGE;
                initialLanguages[question.id] = defaultLanguage;
                const starterCode =
                  (question.starterCode && question.starterCode[defaultLanguage]) ??
                  question.starterCode?.[DEFAULT_LANGUAGE] ??
                  "";
                initialCode[question.id] = starterCode ?? "";
              } else if (isBugFixQuestion(question)) {
                const defaultLanguage = question.languages[0] ?? DEFAULT_LANGUAGE;
                initialLanguages[question.id] = defaultLanguage;
                initialCode[question.id] = question.buggyCode ?? "";
              } else {
                initialText[question.id] = "";
              }
            });
            setTextResponses(initialText);
            setCodeResponses(initialCode);
            setCodeLanguages(initialLanguages);
            setLoading(false);
            return;
          }
        }
      }

      const normalizedQuestions = normalizeQuestions(data.interview.questions);
      const formattedInterview: Interview = {
        id: data.interview.id,
        title: data.interview.title,
        description: data.interview.description ?? null,
        duration: data.interview.duration ?? null,
        questions: normalizedQuestions,
        type: data.interview.type ?? null,
        cvId: data.interview.cvId ?? null,
      };

      setInterview(formattedInterview);
      setCurrentQuestion(0);

      if (formattedInterview.duration) {
        setTimeLeft(formattedInterview.duration * 60);
      }

      const initialText: Record<string, string> = {};
      const initialCode: Record<string, string> = {};
      const initialLanguages: Record<string, LiveCodingLanguage> = {};

      normalizedQuestions.forEach((question) => {
        if (isLiveCodingQuestion(question)) {
          const defaultLanguage = question.languages[0] ?? DEFAULT_LANGUAGE;
          initialLanguages[question.id] = defaultLanguage;
          const starterCode =
            (question.starterCode && question.starterCode[defaultLanguage]) ??
            question.starterCode?.[DEFAULT_LANGUAGE] ??
            "";
          initialCode[question.id] = starterCode ?? "";
        } else if (isBugFixQuestion(question)) {
          const defaultLanguage = question.languages[0] ?? DEFAULT_LANGUAGE;
          initialLanguages[question.id] = defaultLanguage;
          initialCode[question.id] = question.buggyCode ?? "";
        } else {
          initialText[question.id] = "";
        }
      });

      setTextResponses(initialText);
      setCodeResponses(initialCode);
      setCodeLanguages(initialLanguages);
    } catch (error) {
      console.error("Error fetching interview:", error);
      setWarning("Mülakat yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      setInterview(null);
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  // Faz 2: CV-based interview için otomatik cevap doldurma
  useEffect(() => {
    const autoFillAnswers = async () => {
      if (!interview || interview.type !== "cv_based" || !interview.cvId) {
        return;
      }

      // Sorular yoksa veya zaten cevaplar doluysa, işlem yapma
      if (interview.questions.length === 0) {
        return;
      }

      // CV bilgilerini çek
      try {
        console.log("[AUTO_FILL] CV bilgileri çekiliyor...", interview.cvId);
        const cvResponse = await fetch(`/api/cv/${interview.cvId}`);
        if (!cvResponse.ok) {
          console.error("[AUTO_FILL] CV çekilemedi:", cvResponse.status);
          return;
        }

        const cvData = await cvResponse.json();
        if (!cvData?.cv?.data) {
          console.error("[AUTO_FILL] CV data bulunamadı");
          return;
        }

        console.log("[AUTO_FILL] Otomatik cevaplar oluşturuluyor...");
        // Otomatik cevapları oluştur
        const answersResponse = await fetch("/api/ai/generate-interview-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvData: cvData.cv.data,
            questions: interview.questions,
          }),
        });

        if (!answersResponse.ok) {
          console.error("[AUTO_FILL] Cevaplar oluşturulamadı:", answersResponse.status);
          return;
        }

        const answers = await answersResponse.json();
        console.log("[AUTO_FILL] Cevaplar oluşturuldu:", {
          textCount: Object.keys(answers.textResponses || {}).length,
          codeCount: Object.keys(answers.codeResponses || {}).length,
        });

        // State'leri güncelle
        if (answers.textResponses) {
          setTextResponses((prev) => ({ ...prev, ...answers.textResponses }));
        }
        if (answers.codeResponses) {
          setCodeResponses((prev) => ({ ...prev, ...answers.codeResponses }));
        }
        if (answers.codeLanguages) {
          setCodeLanguages((prev) => ({ ...prev, ...answers.codeLanguages }));
        }
      } catch (error) {
        console.error("[AUTO_FILL] Hata:", error);
      }
    };

    autoFillAnswers();
  }, [interview]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
      setWarning("");
    } catch (error) {
      console.error("Camera error:", error);
      setWarning("Kamera erişimi reddedildi. Lütfen kamera izinlerini kontrol edin.");
    }
  }, []);

  const ensureScreenCapture = useCallback(async (retryCount = 0): Promise<MediaStream | null> => {
    // Tarayıcı uyumluluk kontrolü
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      const browserName = navigator.userAgent.includes("Chrome") ? "Chrome" :
                         navigator.userAgent.includes("Firefox") ? "Firefox" :
                         navigator.userAgent.includes("Safari") ? "Safari" :
                         navigator.userAgent.includes("Edge") ? "Edge" : "tarayıcınız";
      
      setWarning(`Ekran paylaşımı ${browserName} tarayıcınızda desteklenmiyor. Lütfen Chrome, Firefox, Edge veya Safari kullanın.`);
      return null;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as unknown as MediaTrackConstraints,
        audio: false,
      });
      
      const [videoTrack] = screenStream.getVideoTracks();
      if (videoTrack) {
        videoTrack.onended = handleScreenShareEnded;
      }
      
      screenStreamRef.current = screenStream;
      screenChunksRef.current = [];
      setScreenCaptureEnabled(true);
      setWarning(""); // Başarılı olduğunda uyarıyı temizle
      return screenStream;
    } catch (error: any) {
      console.error("Screen capture error:", error);
      
      let errorMessage = "Ekran kaydı başlatılamadı. ";
      
      // Hata tipine göre özel mesajlar
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage += "Ekran paylaşımı izni reddedildi. ";
        errorMessage += "Adımlar: 1) Tarayıcı izin penceresinde 'Paylaş' veya 'İzin Ver' butonuna tıklayın. ";
        errorMessage += "2) Eğer penceresi görünmüyorsa, tarayıcı adres çubuğundaki kamera/mikrofon ikonuna tıklayın. ";
        errorMessage += "3) Tarayıcı ayarlarından ekran paylaşımı iznini kontrol edin.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "Ekran paylaşımı için uygun cihaz bulunamadı. ";
        errorMessage += "Lütfen bilgisayarınızın ekran paylaşımı özelliğini kontrol edin.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage += "Ekran paylaşımı başlatılamadı. ";
        errorMessage += "Başka bir uygulama ekran paylaşımını kullanıyor olabilir. Lütfen diğer uygulamaları kapatıp tekrar deneyin.";
      } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
        errorMessage += "Ekran paylaşımı ayarları desteklenmiyor. ";
        errorMessage += "Lütfen tarayıcınızı güncelleyin veya farklı bir tarayıcı deneyin.";
      } else {
        errorMessage += "Bilinmeyen bir hata oluştu. ";
        errorMessage += "Lütfen sayfayı yenileyip tekrar deneyin.";
      }
      
      // Retry mekanizması (maksimum 1 kez)
      if (retryCount < 1 && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")) {
        errorMessage += " 3 saniye sonra otomatik olarak tekrar denenecek...";
        setWarning(errorMessage);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        return ensureScreenCapture(retryCount + 1);
      }
      
      setWarning(errorMessage);
      return null;
    }
  }, [handleScreenShareEnded]);

  const uploadVideo = useCallback(
    async (blob: Blob, label: "camera" | "screen"): Promise<string | null> => {
      if (!blob || blob.size === 0) {
        return null;
      }

      try {
        const formData = new FormData();
        formData.append("file", blob, `interview-${label}-${Date.now()}.webm`);

        const response = await fetch("/api/upload/video", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        return data.url ?? null;
      } catch (error) {
        console.error("Upload error:", error);
        setWarning("Kayıt yüklenirken bir hata oluştu.");
        return null;
      }
    },
    []
  );

  const startRecording = useCallback(async () => {
    if (!cameraEnabled || !mediaStreamRef.current) {
      setWarning("Kamera açık olmalı!");
      return;
    }

    if (!interviewId) {
      setWarning("Mülakat bilgisine ulaşılamadı.");
      return;
    }

    const screenStream = await ensureScreenCapture();
    if (!screenStream) {
      return;
    }

    try {
      // MediaRecorder desteğini kontrol et
      if (typeof MediaRecorder === "undefined") {
        const browserName = navigator.userAgent.includes("Chrome") ? "Chrome" :
                           navigator.userAgent.includes("Firefox") ? "Firefox" :
                           navigator.userAgent.includes("Safari") ? "Safari" :
                           navigator.userAgent.includes("Edge") ? "Edge" : "tarayıcınız";
        setWarning(`Video kaydı ${browserName} tarayıcınızda desteklenmiyor. Lütfen Chrome, Firefox veya Edge kullanın.`);
        return;
      }

      uploadedCameraUrlRef.current = null;
      uploadedScreenUrlRef.current = null;
      cameraChunksRef.current = [];
      screenChunksRef.current = [];
      cameraUploadPendingRef.current = false;
      screenUploadPendingRef.current = false;

      const mediaRecorderOptions = resolveMediaRecorderOptions();

      // MediaRecorder'ı codec belirtmeden de dene (tarayıcı varsayılanını kullan)
      let cameraRecorder: MediaRecorder;
      let screenRecorder: MediaRecorder;
      
      try {
        cameraRecorder = new MediaRecorder(mediaStreamRef.current, mediaRecorderOptions);
        screenRecorder = new MediaRecorder(screenStream, mediaRecorderOptions);
      } catch (recorderError: any) {
        // Eğer codec ile başarısız olursa, codec belirtmeden dene
        if (recorderError.name === "NotSupportedError" || recorderError.name === "InvalidStateError") {
          console.warn("Codec ile kayıt başlatılamadı, varsayılan codec deneniyor...");
          cameraRecorder = new MediaRecorder(mediaStreamRef.current);
          screenRecorder = new MediaRecorder(screenStream);
        } else {
          throw recorderError;
        }
      }

      cameraRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          cameraChunksRef.current.push(event.data);
        }
      };

      cameraRecorder.onstop = async () => {
        if (cameraChunksRef.current.length === 0) {
          cameraUploadPendingRef.current = false;
          return;
        }
        cameraUploadPendingRef.current = true;
        const blob = new Blob(cameraChunksRef.current, { type: cameraChunksRef.current[0].type || "video/webm" });
        uploadedCameraUrlRef.current = await uploadVideo(blob, "camera");
        cameraChunksRef.current = [];
        cameraUploadPendingRef.current = false;
      };

      screenRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          screenChunksRef.current.push(event.data);
        }
      };

      screenRecorder.onstop = async () => {
        if (screenChunksRef.current.length === 0) {
          screenUploadPendingRef.current = false;
          return;
        }
        screenUploadPendingRef.current = true;
        const blob = new Blob(screenChunksRef.current, { type: screenChunksRef.current[0].type || "video/webm" });
        uploadedScreenUrlRef.current = await uploadVideo(blob, "screen");
        screenChunksRef.current = [];
        screenUploadPendingRef.current = false;
      };

      mediaRecorderRef.current = cameraRecorder;
      screenRecorderRef.current = screenRecorder;

      cameraRecorder.start();
      screenRecorder.start();
      setIsRecording(true);
      setWarning("");

      const isCVBased = window.location.pathname.includes('/cv-based');
      const endpoint = isCVBased 
        ? `/api/interview/cv-based/${interviewId}`
        : `/api/interview/${interviewId}`;
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
    } catch (error: any) {
      console.error("Recording error:", error);
      
      let errorMessage = "Video kaydı başlatılamadı. ";
      
      // Tarayıcı tespiti
      const browserName = navigator.userAgent.includes("Chrome") ? "Chrome" :
                         navigator.userAgent.includes("Firefox") ? "Firefox" :
                         navigator.userAgent.includes("Safari") ? "Safari" :
                         navigator.userAgent.includes("Edge") ? "Edge" : "tarayıcınız";
      
      // MediaRecorder hatalarını kontrol et
      if (error.name === "InvalidStateError") {
        errorMessage += "Kayıt cihazı hazır değil. Lütfen kamera ve ekran paylaşımını kontrol edip tekrar deneyin.";
      } else if (error.name === "NotSupportedError") {
        if (browserName === "Firefox") {
          errorMessage += `${browserName} tarayıcınızda video kaydı destekleniyor ancak bir sorun oluştu. Lütfen: 1) Tarayıcınızı en güncel sürüme güncelleyin, 2) Sayfayı yenileyin, 3) Kamera ve ekran paylaşımı izinlerini kontrol edin.`;
        } else {
          errorMessage += `${browserName} tarayıcınızda video kaydı desteklenmiyor olabilir. Lütfen Chrome, Firefox veya Edge kullanın.`;
        }
      } else if (error.message?.includes("MediaRecorder")) {
        errorMessage += "Video kayıt formatı desteklenmiyor. Lütfen tarayıcınızı güncelleyin veya farklı bir tarayıcı deneyin.";
      } else {
        errorMessage += `Hata: ${error.message || "Bilinmeyen hata"}. Lütfen sayfayı yenileyip tekrar deneyin.`;
      }
      
      setWarning(errorMessage);
      setScreenCaptureEnabled(false);
      
      // Kayıt cihazlarını temizle
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
      if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
        try {
          screenRecorderRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    }
  }, [cameraEnabled, ensureScreenCapture, interviewId, uploadVideo]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
      screenRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    mediaRecorderRef.current = null;
    screenRecorderRef.current = null;
    setCameraEnabled(false);
    setScreenCaptureEnabled(false);
  }, []);

  const waitForUploads = useCallback(async () => {
    const timeoutMs = 15000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (!cameraUploadPendingRef.current && !screenUploadPendingRef.current) {
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (!uploadedCameraUrlRef.current && cameraChunksRef.current.length > 0) {
      const blob = new Blob(cameraChunksRef.current, { type: "video/webm" });
      uploadedCameraUrlRef.current = await uploadVideo(blob, "camera");
      cameraChunksRef.current = [];
    }

    if (!uploadedScreenUrlRef.current && screenChunksRef.current.length > 0) {
      const blob = new Blob(screenChunksRef.current, { type: "video/webm" });
      uploadedScreenUrlRef.current = await uploadVideo(blob, "screen");
      screenChunksRef.current = [];
    }
  }, [uploadVideo]);

  const finalizeInterview = useCallback(
    async (forceWithoutRecording = false) => {
      if (submitting) {
        return;
      }

      if (!interviewId) {
        setWarning("Mülakat bilgisine ulaşılamadı.");
        return;
      }

      const wasRecording = isRecording;

      if (!wasRecording && !forceWithoutRecording) {
        setWarning("Kaydı başlatmadan mülakatı bitirmek üzeresiniz. Lütfen onaylayın.");
        setExitIntent("finishWithoutRecording");
        return;
      }

      setWarning("");
      setSubmitting(true);
      setExitIntent(null);

      stopRecording();

      if (wasRecording) {
        await waitForUploads();
      }

      const cameraUrl = wasRecording ? uploadedCameraUrlRef.current : null;
      const screenUrl = wasRecording ? uploadedScreenUrlRef.current : null;

      const transcriptPayload = {
        submittedAt: new Date().toISOString(),
        questionOrder: interview?.questions.map((question) => question.id) ?? [],
        answers: {
          text: textResponses,
          code: codeResponses,
          languageSelections: codeLanguages,
        },
        screenRecordingUrl: screenUrl,
        skippedRecording: !wasRecording,
      };

      try {
        const isCVBased = interview?.type === "cv_based" || window.location.pathname.includes('/cv-based');
        const endpoint = isCVBased 
          ? `/api/interview/cv-based/${interviewId}`
          : `/api/interview/${interviewId}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            videoUrl: cameraUrl,
            screenRecordingUrl: screenUrl,
            transcript: transcriptPayload,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Mülakat gönderilirken bir hata oluştu");
        }

        router.push(`/interview/results/${data.attempt.id}`);
      } catch (error) {
        console.error("Error submitting interview:", error);
        setWarning("Mülakat gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        setSubmitting(false);
      }
    },
    [
      codeLanguages,
      codeResponses,
      interview?.questions,
      interviewId,
      isRecording,
      router,
      stopRecording,
      submitting,
      textResponses,
      waitForUploads,
    ]
  );

  const handleFinish = useCallback(() => {
    void finalizeInterview(false);
  }, [finalizeInterview]);

  const confirmFinishWithoutRecording = useCallback(() => {
    void finalizeInterview(true);
  }, [finalizeInterview]);

  const handleCancelExitIntent = useCallback(() => {
    setExitIntent(null);
    setWarning("");
  }, []);

  const handleLeaveRoom = useCallback(() => {
    if (submitting) {
      return;
    }
    stopRecording();
    setExitIntent(null);
    setWarning("");
    const isCVBased = interview?.type === "cv_based" || window.location.pathname.includes('/cv-based');
    router.push(isCVBased ? "/interview/cv-based" : "/interview/practice");
  }, [router, stopRecording, submitting, interview?.type]);

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min((interview?.questions.length ?? 1) - 1, prev + 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setTextResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCodeChange = (questionId: string, value: string) => {
    setCodeResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleLanguageChange = (questionId: string, language: LiveCodingLanguage) => {
    setCodeLanguages((prev) => ({
      ...prev,
      [questionId]: language,
    }));
  };

  // Voice-to-text functionality
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if browser supports Speech Recognition
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "tr-TR"; // Turkish

    recognition.onresult = (event: any) => {
      if (!interview) return;
      const question = interview.questions[currentQuestion];
      if (!question) return;

      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // Append to current question's response
      setTextResponses((prev) => ({
        ...prev,
        [question.id]: (prev[question.id] || "") + transcript,
      }));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setWarning("Mikrofon erişimi reddedildi. Lütfen mikrofon izinlerini kontrol edin.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setSpeechRecognition(recognition);

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [interview, currentQuestion]);

  const toggleListening = useCallback(() => {
    if (!speechRecognition) {
      setWarning("Ses tanıma bu tarayıcıda desteklenmiyor.");
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognition.start();
        setIsListening(true);
        setWarning("");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setWarning("Ses tanıma başlatılamadı.");
      }
    }
  }, [isListening, speechRecognition]);

  // TTS (Text-to-Speech) fonksiyonları
  const speakQuestion = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    // Önceki konuşmayı durdur
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    utterance.rate = 0.9; // Biraz yavaş okuma
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error("TTS error:", error);
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, []);

  const toggleTTS = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setTtsEnabled((prev) => !prev);
  }, [isSpeaking, stopSpeaking]);

  // Soru değiştiğinde otomatik okuma
  useEffect(() => {
    if (!interview || !ttsEnabled) return;

    const question = interview.questions[currentQuestion];
    if (!question) return;

    // Önceki konuşmayı durdur
    stopSpeaking();

    // Kısa bir gecikme ile yeni soruyu oku
    const timer = setTimeout(() => {
      const questionText = question.question || question.prompt || "";
      if (questionText.trim()) {
        speakQuestion(questionText);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [currentQuestion, interview, ttsEnabled, speakQuestion, stopSpeaking]);

  useEffect(() => {
    // Abonelik kontrolü
    checkSubscriptionAndRedirect().then((hasSubscription) => {
      if (!hasSubscription) {
        return; // Yönlendirme yapıldı
      }
      if (!interviewId) return;
      fetchInterview();
      requestFullscreen();
    });
  }, [fetchInterview, interviewId, requestFullscreen]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      stopRecording();
    };
  }, [handleFocus, handleFullscreenChange, handleVisibilityChange, stopRecording]);

  useEffect(() => {
    const preventPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      setWarning((prev) => prev || "Kopyala / yapıştır işlemlerine izin verilmiyor.");
    };
    const preventPasteKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "v" || event.key === "V")) {
        event.preventDefault();
        setWarning((prev) => prev || "Kopyala / yapıştır işlemlerine izin verilmiyor.");
      }
    };

    document.addEventListener("paste", preventPaste);
    window.addEventListener("keydown", preventPasteKeydown, true);

    return () => {
      document.removeEventListener("paste", preventPaste);
      window.removeEventListener("keydown", preventPasteKeydown, true);
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && isRecording && !submitting) {
      const timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => window.clearInterval(timer);
    }

    return undefined;
  }, [handleFinish, isRecording, submitting, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderQuestionInteraction = (question: InterviewQuestion | undefined) => {
    if (!question) {
      return null;
    }

    if (isLiveCodingQuestion(question)) {
      const languages = question.languages.length > 0 ? question.languages : [DEFAULT_LANGUAGE];
      const activeLanguage = codeLanguages[question.id] ?? languages[0];
      const editorValue = codeResponses[question.id] ?? "";

      return (
        <div className="mt-6 space-y-4">
          {question.supportingText && (
            <p className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
              {question.supportingText}
            </p>
          )}

          <LiveCodingEditor
            taskId={question.id}
            languages={languages}
            activeLanguage={activeLanguage}
            value={editorValue}
            onChange={(value) => handleCodeChange(question.id, value)}
            onLanguageChange={(language) => handleLanguageChange(question.id, language)}
            timeRemainingSeconds={question.timeLimitMinutes ? question.timeLimitMinutes * 60 : undefined}
            height={420}
            className="border-blue-500/30"
          />

          {question.acceptanceCriteria && (
            <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-gray-200">
              <p className="mb-2 font-semibold text-gray-100">Değerlendirme Kriterleri</p>
              <ul className="list-disc space-y-1 pl-5">
                {question.acceptanceCriteria.map((criteria, index) => (
                  <li key={`${question.id}-criteria-${index}`}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    if (isBugFixQuestion(question)) {
      const languages = question.languages.length > 0 ? question.languages : [DEFAULT_LANGUAGE];
      const activeLanguage = codeLanguages[question.id] ?? languages[0];
      const editorValue = codeResponses[question.id] ?? "";

      return (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-semibold text-amber-200">Görev</p>
            <p>
              Bu adımda mevcut hatalı kodu düzeltmeniz bekleniyor. Kopyala / yapıştır işlemleri devre dışı
              bırakılmıştır.
            </p>
            {question.supportingText && <p className="mt-2 text-amber-100/90">{question.supportingText}</p>}
          </div>

          <LiveCodingEditor
            taskId={question.id}
            languages={languages}
            activeLanguage={activeLanguage}
            value={editorValue}
            onChange={(value) => handleCodeChange(question.id, value)}
            onLanguageChange={(language) => handleLanguageChange(question.id, language)}
            timeRemainingSeconds={question.timeLimitMinutes ? question.timeLimitMinutes * 60 : undefined}
            height={420}
            className="border-amber-500/40"
          />

          {question.acceptanceCriteria && (
            <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-gray-200">
              <p className="mb-2 font-semibold text-gray-100">Beklenen Kontroller</p>
              <ul className="list-disc space-y-1 pl-5">
                {question.acceptanceCriteria.map((criteria, index) => (
                  <li key={`${question.id}-bugfix-criteria-${index}`}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          {question.expectedFix && (
            <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-gray-200">
              <p className="font-semibold text-gray-100">Beklenen Davranış</p>
              <p>{question.expectedFix}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor={`answer-${question.id}`} className="text-sm font-semibold text-gray-300">
            Yanıtınız
          </label>
          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              isListening
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isListening ? "bg-white animate-pulse" : "bg-gray-400"}`} />
            {isListening ? "Dinleme Durdur" : "Sesli Yanıt"}
          </button>
        </div>
        <textarea
          id={`answer-${question.id}`}
          value={textResponses[question.id] ?? ""}
          onChange={(event) => handleTextChange(question.id, event.target.value)}
          onPaste={(event) => event.preventDefault()}
          className="w-full min-h-[160px] rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder={isListening ? "Konuşun, sesli cevaplarınız otomatik olarak yazılacaktır..." : "Yanıtınızı buraya not alabilirsiniz. Tüm içerik kayıt altına alınır."}
        />
        {isListening && (
          <p className="text-xs text-blue-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Dinleniyor... Konuşmaya devam edin.
          </p>
        )}
        {question.resources && (
          <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-sm text-gray-300">
            <p className="mb-2 font-semibold text-gray-100">İpucu / Kaynaklar</p>
            <ul className="list-disc space-y-1 pl-5">
              {question.resources.map((resource, index) => (
                <li key={`${question.id}-resource-${index}`}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-gray-400">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-gray-400">Mülakat bulunamadı</p>
          </div>
        </div>
      </div>
    );
  }

  const question = interview.questions[currentQuestion];

  return (
    <>
      {showInstructions && !loading && interview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50">
            <h3 className="text-2xl font-bold text-white mb-4">Mülakat Başlamadan Önce</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">1. Ekran Kaydı İzni</h4>
                <p className="text-base leading-relaxed">
                  Mülakat sırasında ekranınız kaydedilecektir. İzin vermek için:
                </p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-base">
                  <li>Tarayıcı izin penceresi açıldığında &quot;Paylaş&quot; veya &quot;İzin Ver&quot; butonuna tıklayın</li>
                  <li>Eğer izin penceresi görünmüyorsa, tarayıcı adres çubuğundaki kamera/mikrofon ikonuna tıklayın</li>
                  <li>Chrome/Edge: Adres çubuğundaki kilit ikonuna tıklayın → &quot;Ekran paylaşımı&quot; → &quot;İzin ver&quot;</li>
                  <li>Firefox: Adres çubuğundaki izin ikonuna tıklayın → &quot;Paylaş&quot;</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">2. Tam Ekran Modu</h4>
                <p className="text-base leading-relaxed">
                  Mülakat tam ekran modunda yapılmalıdır. Tam ekran açmak için:
                </p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-base">
                  <li><strong>F11</strong> tuşuna basın (en kolay yöntem)</li>
                  <li>Veya tarayıcı menüsünden tam ekran seçeneğini seçin</li>
                  <li>Windows: F11 | Mac: Cmd+Ctrl+F</li>
                </ul>
                <p className="mt-2 text-sm text-yellow-400">
                  ⚠️ Tam ekran modu açılmazsa, sistem sizi uyaracaktır. Manuel olarak F11 tuşuna basabilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">3. Önemli Notlar</h4>
                <ul className="ml-6 list-disc space-y-1 text-base">
                  <li>Mülakat sırasında başka sekmelere geçmeyin</li>
                  <li>Kopyala/yapıştır işlemleri devre dışıdır</li>
                  <li>Ekran kaydı ve kamera kaydı güvenlik amacıyla saklanacaktır</li>
                  {window.location.pathname.includes('/cv-based') && (
                    <li className="text-red-400 font-semibold">⚠️ Sisteminizi aldatma girişiminde bulunursanız hesabınız bloke edilecektir!</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowInstructions(false);
                  requestFullscreen();
                }}
                className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
              >
                Anladım, Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
      {exitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50">
            <h3 className="text-lg font-semibold text-white">
              {exitIntent === "leave" ? "Mülakat Odasından Ayrıl" : "Kaydı Başlatmadan Bitir"}
            </h3>
            <p className="mt-3 text-sm text-gray-300">
              {exitIntent === "leave"
                ? "Odayı terk ederseniz kaydettiğiniz cevaplar gönderilmez ve bu oturumu daha sonra devam ettiremezsiniz. Yine de çıkmak istiyor musunuz?"
                : "Kaydı başlatmadan mülakatı bitirmek üzeresiniz. Metin/kod yanıtlarınız kaydedilecek ancak video analizi yapılmayacak. Devam etmek istediğinize emin misiniz?"}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelExitIntent}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={exitIntent === "leave" ? handleLeaveRoom : confirmFinishWithoutRecording}
                disabled={submitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exitIntent === "leave" ? "Çıkışı Onayla" : "Evet, Bitir"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-900 text-white">
      {warning && (
        <div className="bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white">{warning}</div>
      )}

      <div className="container mx-auto px-4 py-8 w-full max-w-full overflow-x-hidden">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full max-w-full">
          <div className="w-full md:w-auto min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold md:text-3xl truncate">{interview.title}</h1>
            {interview.description && (
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-gray-300">{interview.description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setExitIntent("leave")}
              className="rounded-lg border border-gray-700/70 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-gray-500 hover:text-white"
            >
              Odayı Terket
            </button>
            <div className="flex items-center gap-3 rounded-full border border-red-500/50 bg-red-500/10 px-5 py-2 text-lg font-semibold text-red-300">
              <span>Süre</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] w-full max-w-full overflow-x-hidden">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl shadow-gray-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Soru {currentQuestion + 1} / {interview.questions.length}
                </h2>
                {question.stage && (
                  <p className="text-sm text-gray-400 mt-1">
                    Aşama {question.stage}: {
                      question.stage === 1 ? "Genel Tanışma" :
                      question.stage === 2 ? "İş Deneyimleri" :
                      "Teknik Mülakat"
                    }
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-300">
                <span className="rounded-full bg-gray-800 px-3 py-1">
                  {questionTypeLabels[question.type as QuestionType]}
                </span>
                {question.difficulty && (
                  <span className="rounded-full border border-blue-500/50 px-3 py-1 text-blue-200">
                    {question.difficulty}
                  </span>
                )}
                {"timeLimitMinutes" in question && question.timeLimitMinutes && (
                  <span className="rounded-full border border-emerald-500/50 px-3 py-1 text-emerald-300">
                    {question.timeLimitMinutes} dk
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {question?.stage === 3 && question?.type === "technical" && (
                <div className="mb-4 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-3">
                  <p className="text-sm font-semibold text-blue-200">
                    📝 Teknik Test Sorusu - CV&apos;nizdeki teknolojilere göre hazırlanmış 5 soruluk mini testin bir parçası
                  </p>
                </div>
              )}
              {question?.type === "behavioral" && (
                <div className="mb-4 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-3">
                  <p className="text-sm font-semibold text-purple-200 mb-2">
                    ⭐ STAR Metodu ile Cevap Verin
                  </p>
                  <p className="text-sm text-purple-100/90 leading-relaxed">
                    Bu davranışsal soruya cevap verirken <strong>STAR metodunu</strong> kullanmanız önerilir:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-purple-100/90 list-disc list-inside">
                    <li><strong>Situation (Durum):</strong> Olayın geçtiği durumu ve bağlamı açıklayın</li>
                    <li><strong>Task (Görev):</strong> Sizin sorumluluğunuzdaki görevi veya hedefi belirtin</li>
                    <li><strong>Action (Aksiyon):</strong> Durumu çözmek veya görevi tamamlamak için aldığınız somut adımları detaylandırın</li>
                    <li><strong>Result (Sonuç):</strong> Eylemlerinizin sonuçlarını ve öğrendiklerinizi paylaşın</li>
                  </ul>
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <p className="text-xl md:text-2xl font-medium text-gray-100 leading-relaxed flex-1">
                  {question?.question ?? question?.prompt ?? "Soru yükleniyor..."}
                </p>
                <button
                  type="button"
                  onClick={toggleTTS}
                  className={`flex-shrink-0 rounded-lg p-2 transition ${
                    ttsEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  title={ttsEnabled ? "Sesli okumayı kapat" : "Sesli okumayı aç"}
                >
                  {isSpeaking ? (
                    <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : ttsEnabled ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343l4.243 4.243m0 0l-4.243 4.243M10.586 10.586L5 5m5.586 5.586l5.586 5.586M5 19l5.586-5.586" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              </div>
              {question?.prompt && question.prompt !== question.question && (
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{question.prompt}</p>
              )}
              {question?.description && (
                <p className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 text-base md:text-lg text-gray-300 leading-relaxed">
                  {question.description}
                </p>
              )}
            </div>

            {renderQuestionInteraction(question)}

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0 || submitting}
                className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Önceki
              </button>
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={currentQuestion === interview.questions.length - 1 || submitting}
                className="rounded-lg border border-blue-500/40 px-5 py-2 text-sm font-medium text-blue-200 transition hover:border-blue-400 hover:text-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sonraki
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  currentQuestion === interview.questions.length - 1
                    ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {submitting ? "Gönderiliyor..." : currentQuestion === interview.questions.length - 1 ? "✓ Mülakatı Bitir" : "Mülakatı Bitir"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl shadow-gray-900/40">
              <h2 className="text-xl font-semibold">Kamera ve Kayıt</h2>
              <p className="mt-2 text-sm text-gray-300">
                Görüntü, ses ve ekran kaydınız güvenlik amacıyla saklanacaktır. Kopyala / yapıştır işlemleri
                devre dışıdır.
                {window.location.pathname.includes('/cv-based') && (
                  <span className="block mt-2 text-red-400 font-semibold">
                    ⚠️ Sisteminizi aldatma girişiminde bulunursanız hesabınız bloke edilecektir!
                  </span>
                )}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 rounded-lg border border-gray-800 bg-gray-900/40 p-3 text-sm text-gray-200">
                <div className="flex items-center justify-between">
                  <span>Kamera</span>
                  <span className={cameraEnabled ? "text-emerald-400" : "text-red-400"}>
                    {cameraEnabled ? "Açık" : "Kapalı"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ekran Kaydı</span>
                  <span className={screenCaptureEnabled ? "text-emerald-400" : "text-red-400"}>
                    {screenCaptureEnabled ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Durum</span>
                  <span className={isRecording ? "text-emerald-400" : "text-gray-400"}>
                    {isRecording ? "Kayıt yapılıyor" : "Beklemede"}
                  </span>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="mt-4 w-full rounded-xl border border-gray-800 bg-black"
                style={{ minHeight: "260px" }}
              />

              <div className="mt-5 space-y-3">
                {!cameraEnabled ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Kamerayı Aç
                  </button>
                ) : !isRecording ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Kaydı Başlat
                    </button>
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={submitting}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Kaydı Başlatmadan Bitir
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-red-300">
                      <span className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
                      <span>Kamera ve ekran kaydı devam ediyor</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={submitting}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Gönderiliyor..." : "Mülakatı Bitir"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

