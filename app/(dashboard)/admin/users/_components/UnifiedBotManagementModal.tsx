"use client";

import { useState, useEffect } from "react";
import { X, Bot, Loader2, Play, Clock, Users, Activity, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { createCampaign, createRecurringCampaign, getCampaigns, getCampaignStatus, cancelCampaign, stopRecurringCampaign, type Campaign, type CampaignStatus } from "@/lib/bot/campaign-service";

interface UnifiedBotManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ACTIVITY_TYPES = [
  { value: "POST", label: "LinkedIn Post Paylaşımı", icon: "📝" },
  { value: "LIKE", label: "Post Beğenme", icon: "👍" },
  { value: "FREELANCER_BID", label: "Freelancer Proje Başvurusu", icon: "💼" },
  { value: "FRIEND_REQUEST", label: "Arkadaşlık İsteği", icon: "👥" },
  { value: "COMMENT", label: "Yorum Yapma", icon: "💬" },
  { value: "LIVE_CODING", label: "Canlı Kodlama Case Çözme", icon: "💻" },
  { value: "TEST", label: "Test Çözme", icon: "📊" },
  { value: "LESSON", label: "Ders Tamamlama", icon: "📚" },
  { value: "HACKATHON_APPLICATION", label: "Hackathon Başvurusu", icon: "🚀" },
];

export function UnifiedBotManagementModal({
  isOpen,
  onClose,
  onSuccess,
}: UnifiedBotManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Campaign creation form
  const [campaignName, setCampaignName] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState("POST");
  const [botCount, setBotCount] = useState("100");
  const [totalActivities, setTotalActivities] = useState("100");
  const [durationHours, setDurationHours] = useState("24");
  
  // Activity-specific configs
  const [postConfig, setPostConfig] = useState({
    usePostTopics: true,
    preventDuplicateTopics: true,
  });
  const [likeConfig, setLikeConfig] = useState({
    distributeEvenly: true,
  });
  const [freelancerConfig, setFreelancerConfig] = useState({
    projectsPerBot: 2,
    onlyOpenProjects: true,
  });
  const [friendRequestConfig, setFriendRequestConfig] = useState({
    requestsPerBot: 1,
    excludeBots: true,
  });
  const [liveCodingConfig, setLiveCodingConfig] = useState({
    casesPerBot: 1,
    difficulty: "",
    language: "",
  });
  const [testConfig, setTestConfig] = useState({
    testsPerBot: 1,
    category: "",
    minScore: 0,
  });
  const [lessonConfig, setLessonConfig] = useState({
    lessonsPerBot: 1,
    courseCategory: "",
  });
  const [hackathonConfig, setHackathonConfig] = useState({
    applicationsPerBot: 1,
    createTeam: false,
  });
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Campaigns list
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [refreshingCampaign, setRefreshingCampaign] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCampaign) {
      fetchCampaignStatus(selectedCampaign);
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchCampaignStatus(selectedCampaign);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedCampaign]);

  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const result = await getCampaigns();
      if (result.success && result.campaigns) {
        setCampaigns(result.campaigns);
      }
    } catch (err: any) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchCampaignStatus = async (campaignId: string) => {
    if (refreshingCampaign === campaignId) return;
    setStatusLoading(true);
    try {
      const result = await getCampaignStatus(campaignId);
      if (result.success && result.status) {
        setCampaignStatus(result.status);
      }
    } catch (err: any) {
      console.error("Error fetching campaign status:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      setError("Kampanya adı gereklidir");
      return;
    }

    const botCountNum = parseInt(botCount);
    const totalActivitiesNum = parseInt(totalActivities);
    const durationHoursNum = parseInt(durationHours);

    if (!botCountNum || botCountNum <= 0) {
      setError("Geçerli bir bot sayısı girin");
      return;
    }

    if (!totalActivitiesNum || totalActivitiesNum <= 0) {
      setError("Geçerli bir aktivite sayısı girin");
      return;
    }

    if (!durationHoursNum || durationHoursNum <= 0 || durationHoursNum > 168) {
      setError("Geçerli bir süre girin (1-168 saat)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const config: Record<string, any> = {};

      // Activity-specific configs
      if (selectedActivityType === "POST") {
        config.usePostTopics = postConfig.usePostTopics;
        config.preventDuplicateTopics = postConfig.preventDuplicateTopics;
      } else if (selectedActivityType === "LIKE") {
        config.distributeEvenly = likeConfig.distributeEvenly;
      } else if (selectedActivityType === "FREELANCER_BID") {
        config.projectsPerBot = freelancerConfig.projectsPerBot;
        config.onlyOpenProjects = freelancerConfig.onlyOpenProjects;
      } else if (selectedActivityType === "FRIEND_REQUEST") {
        config.requestsPerBot = friendRequestConfig.requestsPerBot;
        config.excludeBots = friendRequestConfig.excludeBots;
      } else if (selectedActivityType === "LIVE_CODING") {
        config.casesPerBot = liveCodingConfig.casesPerBot;
        if (liveCodingConfig.difficulty) config.difficulty = liveCodingConfig.difficulty;
        if (liveCodingConfig.language) config.language = liveCodingConfig.language;
      } else if (selectedActivityType === "TEST") {
        config.testsPerBot = testConfig.testsPerBot;
        if (testConfig.category) config.category = testConfig.category;
        if (testConfig.minScore > 0) config.minScore = testConfig.minScore;
      } else if (selectedActivityType === "LESSON") {
        config.lessonsPerBot = lessonConfig.lessonsPerBot;
        if (lessonConfig.courseCategory) config.courseCategory = lessonConfig.courseCategory;
      } else if (selectedActivityType === "HACKATHON_APPLICATION") {
        config.applicationsPerBot = hackathonConfig.applicationsPerBot;
        config.createTeam = hackathonConfig.createTeam;
      }

      const result = isRecurring
        ? await createRecurringCampaign({
            name: campaignName,
            activityType: selectedActivityType,
            botCount: botCountNum,
            totalActivities: totalActivitiesNum,
            durationHours: durationHoursNum,
            recurringPattern: "daily",
            config,
          })
        : await createCampaign({
            name: campaignName,
            activityType: selectedActivityType,
            botCount: botCountNum,
            totalActivities: totalActivitiesNum,
            durationHours: durationHoursNum,
            config,
          });

      if (!result.success) {
        setError(result.message || "Kampanya oluşturulamadı");
        return;
      }

      setSuccess("Kampanya başarıyla oluşturuldu");
      setCampaignName("");
      setBotCount("100");
      setTotalActivities("100");
      setDurationHours("24");
      
      // Refresh campaigns list
      await fetchCampaigns();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Kampanya oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCampaign = async (campaignId: string) => {
    if (!confirm("Bu kampanyayı iptal etmek istediğinizden emin misiniz?")) {
      return;
    }

    setRefreshingCampaign(campaignId);
    try {
      const result = await cancelCampaign(campaignId);
      if (result.success) {
        await fetchCampaigns();
        if (selectedCampaign === campaignId) {
          setSelectedCampaign(null);
          setCampaignStatus(null);
        }
      } else {
        setError(result.message || "Kampanya iptal edilemedi");
      }
    } catch (err: any) {
      setError(err.message || "Kampanya iptal edilirken bir hata oluştu");
    } finally {
      setRefreshingCampaign(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "running":
        return "Çalışıyor";
      case "completed":
        return "Tamamlandı";
      case "failed":
        return "Başarısız";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Unified Bot Yönetimi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tüm bot aktivitelerini tek yerden yönetin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Create Campaign */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Yeni Kampanya Oluştur
                </h3>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Campaign Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kampanya Adı *
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Örn: 100 Bot LinkedIn Post Kampanyası"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Activity Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aktivite Tipi *
                    </label>
                    <select
                      value={selectedActivityType}
                      onChange={(e) => setSelectedActivityType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {ACTIVITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bot Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bot Sayısı *
                    </label>
                    <input
                      type="number"
                      value={botCount}
                      onChange={(e) => setBotCount(e.target.value)}
                      placeholder="100"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Total Activities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Toplam Aktivite Sayısı *
                    </label>
                    <input
                      type="number"
                      value={totalActivities}
                      onChange={(e) => setTotalActivities(e.target.value)}
                      placeholder="100"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Duration Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Süre (Saat) *
                    </label>
                    <input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="24"
                      min="1"
                      max="168"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Aktivite sayısı bu süre içinde eşit dağıtılacak
                    </p>
                  </div>

                  {/* Activity-Specific Configs */}
                  {selectedActivityType === "POST" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Post Ayarları</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={postConfig.usePostTopics}
                          onChange={(e) => setPostConfig({ ...postConfig, usePostTopics: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          posttopics.json dosyasından konu kullan
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={postConfig.preventDuplicateTopics}
                          onChange={(e) => setPostConfig({ ...postConfig, preventDuplicateTopics: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Aynı bot aynı konuyu tekrar paylaşmasın
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedActivityType === "LIKE" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Beğeni Ayarları</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={likeConfig.distributeEvenly}
                          onChange={(e) => setLikeConfig({ ...likeConfig, distributeEvenly: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Beğenileri eşit dağıt
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedActivityType === "FREELANCER_BID" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Freelancer Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına Proje Sayısı
                        </label>
                        <input
                          type="number"
                          value={freelancerConfig.projectsPerBot}
                          onChange={(e) => setFreelancerConfig({ ...freelancerConfig, projectsPerBot: parseInt(e.target.value) || 2 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={freelancerConfig.onlyOpenProjects}
                          onChange={(e) => setFreelancerConfig({ ...freelancerConfig, onlyOpenProjects: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Sadece açık projelere başvur
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedActivityType === "FRIEND_REQUEST" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Arkadaşlık İsteği Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına İstek Sayısı
                        </label>
                        <input
                          type="number"
                          value={friendRequestConfig.requestsPerBot}
                          onChange={(e) => setFriendRequestConfig({ ...friendRequestConfig, requestsPerBot: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={friendRequestConfig.excludeBots}
                          onChange={(e) => setFriendRequestConfig({ ...friendRequestConfig, excludeBots: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Botlara istek gönderme
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedActivityType === "LIVE_CODING" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Canlı Kodlama Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına Case Sayısı
                        </label>
                        <input
                          type="number"
                          value={liveCodingConfig.casesPerBot}
                          onChange={(e) => setLiveCodingConfig({ ...liveCodingConfig, casesPerBot: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Zorluk Seviyesi (Opsiyonel)
                        </label>
                        <select
                          value={liveCodingConfig.difficulty}
                          onChange={(e) => setLiveCodingConfig({ ...liveCodingConfig, difficulty: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Tüm Seviyeler</option>
                          <option value="beginner">Başlangıç</option>
                          <option value="intermediate">Orta</option>
                          <option value="advanced">İleri</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Programlama Dili (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={liveCodingConfig.language}
                          onChange={(e) => setLiveCodingConfig({ ...liveCodingConfig, language: e.target.value })}
                          placeholder="javascript, csharp, python, java"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {selectedActivityType === "TEST" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Test Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına Test Sayısı
                        </label>
                        <input
                          type="number"
                          value={testConfig.testsPerBot}
                          onChange={(e) => setTestConfig({ ...testConfig, testsPerBot: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Test Kategorisi (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={testConfig.category}
                          onChange={(e) => setTestConfig({ ...testConfig, category: e.target.value })}
                          placeholder="Kategori adı"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Minimum Skor (Opsiyonel)
                        </label>
                        <input
                          type="number"
                          value={testConfig.minScore}
                          onChange={(e) => setTestConfig({ ...testConfig, minScore: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {selectedActivityType === "LESSON" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Ders Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına Ders Sayısı
                        </label>
                        <input
                          type="number"
                          value={lessonConfig.lessonsPerBot}
                          onChange={(e) => setLessonConfig({ ...lessonConfig, lessonsPerBot: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Kurs Kategorisi (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={lessonConfig.courseCategory}
                          onChange={(e) => setLessonConfig({ ...lessonConfig, courseCategory: e.target.value })}
                          placeholder="Kurs kategorisi"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {selectedActivityType === "HACKATHON_APPLICATION" && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Hackathon Ayarları</h4>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Bot Başına Başvuru Sayısı
                        </label>
                        <input
                          type="number"
                          value={hackathonConfig.applicationsPerBot}
                          onChange={(e) => setHackathonConfig({ ...hackathonConfig, applicationsPerBot: parseInt(e.target.value) || 1 })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hackathonConfig.createTeam}
                          onChange={(e) => setHackathonConfig({ ...hackathonConfig, createTeam: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Takım oluştur
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Recurring Campaign Checkbox */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Günlük Tekrarlayan Kampanya
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Bu kampanya her 24 saatte bir otomatik olarak yenilenecek
                        </p>
                      </div>
                    </label>
                  </div>

                  <Button
                    onClick={handleCreateCampaign}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Kampanya Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Campaigns List & Status */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Aktif Kampanyalar
                  </h3>
                  <Button
                    onClick={fetchCampaigns}
                    variant="outline"
                    size="sm"
                    disabled={campaignsLoading}
                  >
                    {campaignsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {campaignsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz kampanya oluşturulmamış</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCampaign === campaign.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => setSelectedCampaign(campaign.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {campaign.name}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                {getStatusLabel(campaign.status)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {ACTIVITY_TYPES.find(t => t.value === campaign.activityType)?.icon} {ACTIVITY_TYPES.find(t => t.value === campaign.activityType)?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {campaign.botCount} bot
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {campaign.totalExecuted || 0} / {campaign.totalActivities}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {campaign.durationHours} saat
                              </span>
                            </div>
                            {campaign.successfulCount !== undefined && campaign.failedCount !== undefined && (
                              <div className="mt-2 flex items-center gap-4 text-xs">
                                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {campaign.successfulCount} başarılı
                                </span>
                                {campaign.failedCount > 0 && (
                                  <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {campaign.failedCount} başarısız
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {campaign.status === "running" && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelCampaign(campaign.id);
                              }}
                              variant="outline"
                              size="sm"
                              disabled={refreshingCampaign === campaign.id}
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                            >
                              {refreshingCampaign === campaign.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "İptal"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Campaign Status Detail */}
              {selectedCampaign && campaignStatus && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Kampanya Detayları
                  </h4>
                  {statusLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaignStatus.status || "")}`}>
                          {getStatusLabel(campaignStatus.status || "")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Toplam Çalıştırılan:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {campaignStatus.totalExecuted || 0} / {campaignStatus.totalActivities || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Başarılı:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {campaignStatus.successfulCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Başarısız:</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {campaignStatus.failedCount || 0}
                        </span>
                      </div>
                      {campaignStatus.startTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Başlangıç:</span>
                          <span className="text-gray-900 dark:text-gray-100 text-xs">
                            {new Date(campaignStatus.startTime).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      )}
                      {campaignStatus.endTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Bitiş:</span>
                          <span className="text-gray-900 dark:text-gray-100 text-xs">
                            {new Date(campaignStatus.endTime).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      )}
                      {campaignStatus.totalExecuted !== undefined && campaignStatus.totalActivities !== undefined && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${((campaignStatus.totalExecuted / campaignStatus.totalActivities) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}

