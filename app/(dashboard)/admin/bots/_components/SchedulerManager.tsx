"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Clock, Save, Plus, Trash2, Calendar } from "lucide-react";

interface ScheduledActivity {
  id?: string;
  activityType: string;
  frequency: "daily" | "weekly";
  minCount: number;
  maxCount: number;
  config?: Record<string, any>;
}

const ACTIVITY_TYPES = [
  { value: "POST", label: "LinkedIn Post Paylaşımı", icon: "📝", category: "linkedin" },
  { value: "LIKE", label: "Post Beğenme", icon: "👍", category: "linkedin" },
  { value: "COMMENT", label: "Yorum Yapma", icon: "💬", category: "linkedin" },
  { value: "HACKATHON_APPLICATION", label: "Hackathon Başvurusu", icon: "🚀", category: "application" },
  { value: "FREELANCER_BID", label: "Freelancer Proje Başvurusu", icon: "💼", category: "application" },
  { value: "JOB_APPLICATION", label: "İş İlanı Başvurusu", icon: "📋", category: "application" },
  { value: "TEST", label: "Test Çözme", icon: "📊", category: "education" },
  { value: "LIVE_CODING", label: "Canlı Kodlama Case Çözme", icon: "💻", category: "education" },
  { value: "LESSON", label: "Ders Tamamlama", icon: "📚", category: "education" },
];

export function SchedulerManager() {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<Array<{ botId: string; error: string }>>([]);
  const [errors, setErrors] = useState<Array<{ botId: string; error: string }>>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [globalActivityHours, setGlobalActivityHours] = useState<number[]>([9, 12, 18, 21]);
  const [rateLimits, setRateLimits] = useState({
    maxPostsPerDay: 3,
    maxCommentsPerDay: 5,
    maxLikesPerDay: 10,
    maxTestsPerWeek: 3,
    maxLiveCodingPerWeek: 2,
    maxLessonsPerWeek: 5,
  });

  const [newActivity, setNewActivity] = useState<ScheduledActivity>({
    activityType: "POST",
    frequency: "daily",
    minCount: 1,
    maxCount: 3,
  });

  useEffect(() => {
    fetchScheduledActivities();
  }, []);

  const fetchScheduledActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bots/scheduler');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:57',message:'fetchScheduledActivities: Response received',data:{ok:response.ok,status:response.status,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      

      if (response.ok) {
        // Check if response is JSON before parsing
        if (!contentType || !contentType.includes('application/json')) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:65',message:'fetchScheduledActivities: Non-JSON response',data:{contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          setError(`Backend returned non-JSON response: ${responseText.substring(0, 200)}`);
          return;
        }
        
        const data = JSON.parse(responseText);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:63',message:'fetchScheduledActivities: JSON parsed successfully',data:{hasSuccess:!!data.success,hasActivities:!!data.activities,activitiesLength:data.activities?.length,activities:data.activities},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (data.success && data.activities) {
          setScheduledActivities(data.activities);
          // Set global activity hours and rate limits
          if (data.activityHours) {
            setGlobalActivityHours(data.activityHours);
          }
          if (data.rateLimits) {
            setRateLimits(data.rateLimits);
          }
        } else {
        }
      } else {
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { error: 'Failed to parse error response' };
          }
        } else {
          errorData = { error: `Backend returned non-JSON error: ${responseText.substring(0, 200)}` };
        }
        setError(errorData.error || "Zamanlanmış aktiviteler alınırken bir hata oluştu");
      }
    } catch (err: any) {
      setError(err.message || "Zamanlanmış aktiviteler alınırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (scheduledActivities.length === 0) {
      setError("En az bir zamanlanmış aktivite eklemelisiniz");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    setWarnings([]);
    setErrors([]);

    try {
      // Save scheduler settings - no bot selection needed
      const response = await fetch('/api/admin/bots/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: scheduledActivities,
          activityHours: globalActivityHours,
          rateLimits: rateLimits,
        }),
      });

      const schedulerContentType = response.headers.get('content-type');
      const schedulerResponseText = await response.text();

      if (!response.ok) {
        let errorData;
        if (schedulerContentType && schedulerContentType.includes('application/json')) {
          try {
            errorData = JSON.parse(schedulerResponseText);
          } catch (e) {
            errorData = { error: 'Failed to parse error response' };
          }
        } else {
          errorData = { error: `Backend returned non-JSON error: ${schedulerResponseText.substring(0, 200)}` };
        }
        throw new Error(errorData.error || "Zamanlayıcı kaydedilirken bir hata oluştu");
      }

      // Check if response is JSON before parsing
      if (!schedulerContentType || !schedulerContentType.includes('application/json')) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:195',message:'handleSaveSchedule: Non-JSON response',data:{contentType:schedulerContentType,isHtml:schedulerResponseText.trim().startsWith('<!DOCTYPE'),preview:schedulerResponseText.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error(`Backend returned non-JSON response: ${schedulerResponseText.substring(0, 200)}`);
      }

      const data = JSON.parse(schedulerResponseText);

      if (!data.success) {
        // Collect errors if any
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        }
        throw new Error(data.error || "Zamanlayıcı kaydedilirken bir hata oluştu");
      }
      
      // Handle warnings
      if (data.warnings && data.warnings.webhookFailures && Array.isArray(data.warnings.webhookFailures)) {
        setWarnings(data.warnings.webhookFailures);
      }
      
      // Handle errors (partial success)
      if (data.errors && Array.isArray(data.errors)) {
        setErrors(data.errors);
      }
      
      // Build success message
      let successMessage = `Zamanlayıcı ayarları başarıyla kaydedildi. ${data.results?.length || 0} bot güncellendi.`;
      if (data.warnings && data.warnings.webhookFailures && data.warnings.webhookFailures.length > 0) {
        successMessage += ` ${data.warnings.webhookFailures.length} bot için webhook uyarısı var.`;
      }
      if (data.errors && data.errors.length > 0) {
        successMessage += ` ${data.errors.length} bot için hata oluştu.`;
      }
      
      setSuccess(successMessage);
      setShowAddForm(false);
      setEditingIndex(null);
      await fetchScheduledActivities();
    } catch (err: any) {
      setError(err.message || "Zamanlayıcı kaydedilirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleAddActivity = () => {
    setScheduledActivities([...scheduledActivities, { ...newActivity }]);
    setNewActivity({
      activityType: "POST",
      frequency: "daily",
      minCount: 1,
      maxCount: 3,
    });
    setShowAddForm(false);
    setError(null);
  };

  const handleRemoveActivity = (index: number) => {
    setScheduledActivities(scheduledActivities.filter((_, i) => i !== index));
  };

  const handleUpdateActivity = (index: number, updates: Partial<ScheduledActivity>) => {
    const updated = [...scheduledActivities];
    updated[index] = { ...updated[index], ...updates };
    setScheduledActivities(updated);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Zamanlayıcı Yönetimi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bot aktivitelerini zamanlayın - Doğal kullanıcı etkileşimleri için otomatik zamanlama
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Aktivite Ekle
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium mb-2">
                ⚠️ Webhook Uyarıları: {warnings.length} bot için webhook gönderilemedi. Hangfire job&apos;ları güncellenmemiş olabilir.
              </p>
              <ul className="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-400 space-y-2">
                {warnings.map((warning: any, idx: number) => (
                  <li key={idx} className="mb-2">
                    <div className="font-medium">Bot {warning.botId}:</div>
                    <div className="ml-4 mt-1">
                      <div className="text-yellow-800 dark:text-yellow-300">{warning.error}</div>
                      {warning.details && (
                        <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-500">
                          {warning.details.status && (
                            <div>HTTP Status: {warning.details.status} {warning.details.statusText}</div>
                          )}
                          {warning.details.errorType && (
                            <div>Hata Tipi: {warning.details.errorType}</div>
                          )}
                          {warning.details.error && typeof warning.details.error === 'object' && (
                            <div className="mt-1">
                              {warning.details.error.error && (
                                <div>Hata: {warning.details.error.error}</div>
                              )}
                              {warning.details.error.details && (
                                <div className="text-xs mt-1 opacity-75">{warning.details.error.details}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {warning.suggestion && (
                        <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded text-xs text-yellow-900 dark:text-yellow-200">
                          💡 <strong>Öneri:</strong> {warning.suggestion}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={handleSaveSchedule}
              variant="outline"
              size="sm"
              className="ml-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
            >
              <Save className="h-4 w-4 mr-1" />
              Tekrar Dene
            </Button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium mb-2">
            ❌ Hatalar: {errors.length} bot için hata oluştu
          </p>
          <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-400 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>
                Bot {err.botId}: {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add New Activity Form */}
      {showAddForm && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Yeni Zamanlanmış Aktivite</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aktivite Tipi *
              </label>
              <select
                value={newActivity.activityType}
                onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sıklık *
              </label>
              <select
                value={newActivity.frequency}
                onChange={(e) => setNewActivity({ ...newActivity, frequency: e.target.value as "daily" | "weekly" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aktivite Sayısı (Min - Max)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newActivity.minCount}
                  onChange={(e) => setNewActivity({ ...newActivity, minCount: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="Min"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  value={newActivity.maxCount}
                  onChange={(e) => setNewActivity({ ...newActivity, maxCount: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="Max"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleAddActivity}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ekle
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
            >
              İptal
            </Button>
          </div>
        </div>
      )}

      {/* Scheduled Activities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : scheduledActivities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Henüz zamanlanmış aktivite yok. Yeni aktivite ekleyerek başlayın.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledActivities.map((activity, index) => {
            const activityInfo = ACTIVITY_TYPES.find(t => t.value === activity.activityType);
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{activityInfo?.icon}</span>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {activityInfo?.label || activity.activityType}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Sıklık:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {activity.frequency === "daily" ? "Günlük" : "Haftalık"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Aktivite:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {activity.minCount}-{activity.maxCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveActivity(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Activity Hours */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Global Aktivite Saatleri (UTC)</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Tüm botlar bu saatlerde aktif olacak. Her saat benzersiz olmalıdır.
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <button
              key={hour}
              type="button"
              onClick={() => {
                if (globalActivityHours.includes(hour)) {
                  setGlobalActivityHours(globalActivityHours.filter(h => h !== hour));
                } else {
                  setGlobalActivityHours([...globalActivityHours, hour].sort((a, b) => a - b));
                }
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                globalActivityHours.includes(hour)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {hour}:00
            </button>
          ))}
        </div>
      </div>

      {/* Global Rate Limits */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Global Rate Limit&apos;ler</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Tüm botlar için ortak rate limit&apos;ler. Bu limitler tüm botlar için geçerlidir.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Günlük Post
            </label>
            <input
              type="number"
              value={rateLimits.maxPostsPerDay}
              onChange={(e) => setRateLimits({ ...rateLimits, maxPostsPerDay: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Günlük Yorum
            </label>
            <input
              type="number"
              value={rateLimits.maxCommentsPerDay}
              onChange={(e) => setRateLimits({ ...rateLimits, maxCommentsPerDay: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Günlük Beğeni
            </label>
            <input
              type="number"
              value={rateLimits.maxLikesPerDay}
              onChange={(e) => setRateLimits({ ...rateLimits, maxLikesPerDay: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Haftalık Test
            </label>
            <input
              type="number"
              value={rateLimits.maxTestsPerWeek}
              onChange={(e) => setRateLimits({ ...rateLimits, maxTestsPerWeek: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Haftalık Canlı Kodlama
            </label>
            <input
              type="number"
              value={rateLimits.maxLiveCodingPerWeek}
              onChange={(e) => setRateLimits({ ...rateLimits, maxLiveCodingPerWeek: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Haftalık Ders
            </label>
            <input
              type="number"
              value={rateLimits.maxLessonsPerWeek}
              onChange={(e) => setRateLimits({ ...rateLimits, maxLessonsPerWeek: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {scheduledActivities.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSchedule}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Zamanlayıcıyı Kaydet
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
