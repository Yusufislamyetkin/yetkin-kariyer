"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, MessageSquare, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface CV {
  id: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
  };
}

interface InterviewStatus {
  status: "generating" | "completed" | "error";
  stage: 0 | 1 | 2 | 3;
  progress: number;
  interviewId: string;
  questionCount: number;
  error?: string;
}

export default function CVBasedInterviewPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingStartTimeRef = useRef<number | null>(null);
  const lastCvIdRef = useRef<string | null>(null); // Son denenen CV ID'yi sakla
  const maxPollingDuration = 5 * 60 * 1000; // 5 dakika maksimum polling süresi

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      setCvs(data.cvs || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      setError("CV&apos;ler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Polling fonksiyonu
  const pollInterviewStatus = async (interviewId: string) => {
    try {
      // Timeout kontrolü
      if (pollingStartTimeRef.current) {
        const elapsed = Date.now() - pollingStartTimeRef.current;
        if (elapsed > maxPollingDuration) {
          console.warn(`[CV_INTERVIEW] Polling timeout: ${interviewId} (${Math.round(elapsed / 1000)}s)`);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setError("Mülakat oluşturma işlemi çok uzun sürdü. Lütfen sayfayı yenileyip tekrar deneyin.");
          setCreating(null);
          setInterviewStatus(null);
          pollingStartTimeRef.current = null;
          return;
        }
      }

      const response = await fetch(`/api/interview/cv-based/${interviewId}/status`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status kontrolü başarısız");
      }

      setInterviewStatus(data);

      // Hata durumunu kontrol et
      if (data.status === "error") {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        pollingStartTimeRef.current = null;
        
        // Hata mesajını kullanıcı dostu hale getir
        const errorMsg = data.error || "Mülakat oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";
        setError(errorMsg);
        setCreating(null);
        setInterviewStatus(null);
        console.error(`[CV_INTERVIEW] Interview oluşturma hatası: ${interviewId}`, data.error);
        return;
      }

      // Eğer tamamlandıysa polling'i durdur ve yönlendir
      if (data.status === "completed") {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        pollingStartTimeRef.current = null;
        setSuccess("Mülakat başarıyla oluşturuldu! Yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push(`/interview/practice/${interviewId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("[CV_INTERVIEW] Error polling interview status:", error);
      // Hata durumunda polling'i durdur
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      pollingStartTimeRef.current = null;
      setError(error.message || "Mülakat durumu kontrol edilemedi. Lütfen sayfayı yenileyip tekrar deneyin.");
      setCreating(null);
      setInterviewStatus(null);
    }
  };

  // Polling'i temizle
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      pollingStartTimeRef.current = null;
    };
  }, []);

  const handleCreateInterview = async (cvId: string) => {
    setCreating(cvId);
    setError(null);
    setSuccess(null);
    setInterviewStatus(null);
    lastCvIdRef.current = cvId; // CV ID'yi sakla

    // Önceki polling'i temizle
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingStartTimeRef.current = null;

    try {
      console.log(`[CV_INTERVIEW] Interview oluşturma başlatılıyor: cvId=${cvId}`);
      
      const response = await fetch("/api/interview/cv-based", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mülakat oluşturulurken bir hata oluştu");
      }

      const interviewId = data.interview.id;
      console.log(`[CV_INTERVIEW] Interview oluşturuldu: ${interviewId}, polling başlatılıyor...`);

      // Polling başlangıç zamanını kaydet
      pollingStartTimeRef.current = Date.now();

      // İlk status'u al
      await pollInterviewStatus(interviewId);

      // Her 2.5 saniyede bir status kontrol et
      pollingIntervalRef.current = setInterval(() => {
        pollInterviewStatus(interviewId);
      }, 2500); // 2.5 saniye
    } catch (error: any) {
      console.error("[CV_INTERVIEW] Error creating interview:", error);
      setError(error.message || "Mülakat oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      setCreating(null);
      setInterviewStatus(null);
      pollingStartTimeRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            CV Bazlı Mülakat
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          CV&apos;nize göre kişiselleştirilmiş bir mülakat oluşturun. Sistem, CV&apos;nizdeki bilgilere göre
          kapsamlı sorular hazırlayacaktır.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Hata</h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">{error}</p>
            {lastCvIdRef.current && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null);
                  // Retry için son kullanılan CV ID'yi kullan
                  if (lastCvIdRef.current) {
                    handleCreateInterview(lastCvIdRef.current);
                  }
                }}
                className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Tekrar Dene
              </Button>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Başarılı</h3>
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        </div>
      )}

      {cvs.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="!pt-12 pb-16 px-6">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Henüz CV&apos;niz yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Mülakat oluşturmak için önce bir CV oluşturmanız gerekiyor
              </p>
              <Button onClick={() => router.push("/cv/templates")}>
                <FileText className="h-4 w-4 mr-2" />
                CV Oluştur
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Mülakat Hakkında
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Mülakat 3 aşamadan oluşur: Genel Tanışma, İş Deneyimleri, Teknik Mülakat</li>
              <li>CV&apos;nizdeki teknolojilere ve deneyim seviyenize göre sorular oluşturulur</li>
              <li>Mülakat sırasında video, ses ve ekran kaydı yapılır</li>
              <li>Sisteminizi aldatma girişiminde bulunursanız hesabınız bloke edilecektir</li>
              <li>Mülakat oluşturma işlemi birkaç dakika sürebilir</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            CV&apos;nizi Seçin
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card
                key={cv.id}
                variant="elevated"
                hover
                className="relative"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">
                    {cv.data?.personalInfo?.name || "CV"}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Şablon: {cv.template.name}
                  </p>
                  {cv.data?.personalInfo?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {cv.data.personalInfo.email}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleCreateInterview(cv.id)}
                    disabled={creating === cv.id || !!creating}
                    className="w-full"
                    variant="primary"
                  >
                    {creating === cv.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mülakat Oluştur
                      </>
                    )}
                  </Button>
                  {creating === cv.id && interviewStatus && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>
                          {interviewStatus.stage === 0 && "Başlatılıyor..."}
                          {interviewStatus.stage === 1 && "Aşama 1/3: Genel Tanışma Soruları"}
                          {interviewStatus.stage === 2 && "Aşama 2/3: Deneyim Soruları"}
                          {interviewStatus.stage === 3 && interviewStatus.status === "generating" && "Aşama 3/3: Teknik Sorular"}
                          {interviewStatus.status === "completed" && "Tamamlandı!"}
                        </span>
                        <span>{interviewStatus.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${interviewStatus.progress}%` }}
                        ></div>
                      </div>
                      {interviewStatus.questionCount > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          {interviewStatus.questionCount} soru oluşturuldu
                        </p>
                      )}
                    </div>
                  )}
                  {creating === cv.id && !interviewStatus && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Mülakat başlatılıyor...
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

