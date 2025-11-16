"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";
import type { LiveCodingLanguage } from "@/types/live-coding";

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

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    return { mimeType: "video/webm;codecs=vp9" };
  }

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    return { mimeType: "video/webm;codecs=vp8" };
  }

  if (MediaRecorder.isTypeSupported("video/webm")) {
    return { mimeType: "video/webm" };
  }

  return undefined;
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
      setWarning("Tam ekran modu açılamadı. Lütfen manuel olarak açın.");
    }
  }, []);

  const handleFullscreenChange = useCallback(() => {
    if (typeof document === "undefined") return;
    setIsFullscreen(Boolean(document.fullscreenElement));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isRecording) {
      setWarning("Sekme değiştirdiğiniz tespit edildi! Lütfen mülakat odasında kalın.");
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
      const response = await fetch(`/api/interview/${interviewId}`);
      if (!response.ok) {
        throw new Error("Mülakat bilgileri alınamadı");
      }

      const data = await response.json();
      if (!data?.interview) {
        setInterview(null);
        return;
      }

      const normalizedQuestions = normalizeQuestions(data.interview.questions);
      const formattedInterview: Interview = {
        id: data.interview.id,
        title: data.interview.title,
        description: data.interview.description ?? null,
        duration: data.interview.duration ?? null,
        questions: normalizedQuestions,
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

  const ensureScreenCapture = useCallback(async (): Promise<MediaStream | null> => {
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
      return screenStream;
    } catch (error) {
      console.error("Screen capture error:", error);
      setWarning("Ekran kaydı başlatılamadı. Lütfen ekran paylaşımına izin verin.");
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
      uploadedCameraUrlRef.current = null;
      uploadedScreenUrlRef.current = null;
      cameraChunksRef.current = [];
      screenChunksRef.current = [];
      cameraUploadPendingRef.current = false;
      screenUploadPendingRef.current = false;

      const mediaRecorderOptions = resolveMediaRecorderOptions();

      const cameraRecorder = new MediaRecorder(mediaStreamRef.current, mediaRecorderOptions);
      const screenRecorder = new MediaRecorder(screenStream, mediaRecorderOptions);

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

      await fetch(`/api/interview/${interviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
    } catch (error) {
      console.error("Recording error:", error);
      setWarning("Video kaydı başlatılamadı.");
      setScreenCaptureEnabled(false);
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
        const response = await fetch(`/api/interview/${interviewId}`, {
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
    router.push("/interview/practice");
  }, [router, stopRecording, submitting]);

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

  useEffect(() => {
    if (!interviewId) return;
    fetchInterview();
    requestFullscreen();
  }, [fetchInterview, interviewId, requestFullscreen]);

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
        <label htmlFor={`answer-${question.id}`} className="text-sm font-semibold text-gray-300">
          Yanıtınız
        </label>
        <textarea
          id={`answer-${question.id}`}
          value={textResponses[question.id] ?? ""}
          onChange={(event) => handleTextChange(question.id, event.target.value)}
          onPaste={(event) => event.preventDefault()}
          className="w-full min-h-[160px] rounded-lg border border-gray-700 bg-gray-900 p-3 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Yanıtınızı buraya not alabilirsiniz. Tüm içerik kayıt altına alınır."
        />
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{interview.title}</h1>
            {interview.description && (
              <p className="mt-2 max-w-2xl text-sm text-gray-300">{interview.description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl shadow-gray-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                Soru {currentQuestion + 1} / {interview.questions.length}
              </h2>
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

            <div className="mt-5 space-y-3">
              <p className="text-lg font-medium text-gray-100">
                {question?.question ?? question?.prompt ?? "Soru yükleniyor..."}
              </p>
              {question?.prompt && question.prompt !== question.question && (
                <p className="text-base text-gray-300">{question.prompt}</p>
              )}
              {question?.description && (
                <p className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 text-sm text-gray-300">
                  {question.description}
                </p>
              )}
            </div>

            {renderQuestionInteraction(question)}

            <div className="mt-8 flex flex-wrap gap-3">
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl shadow-gray-900/40">
              <h2 className="text-xl font-semibold">Kamera ve Kayıt</h2>
              <p className="mt-2 text-sm text-gray-300">
                Görüntü, ses ve ekran kaydınız güvenlik amacıyla saklanacaktır. Kopyala / yapıştır işlemleri
                devre dışıdır.
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

