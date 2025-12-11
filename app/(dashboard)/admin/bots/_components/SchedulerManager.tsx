"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Clock, Save, Plus, Trash2, Calendar } from "lucide-react";

interface ScheduledActivity {
  id?: string;
  activityType: string;
  botCount: number;
  frequency: "daily" | "weekly";
  activityHours: number[];
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newActivity, setNewActivity] = useState<ScheduledActivity>({
    activityType: "POST",
    botCount: 10,
    frequency: "daily",
    activityHours: [9, 12, 18, 21],
    minCount: 1,
    maxCount: 3,
  });

  useEffect(() => {
    fetchScheduledActivities();
  }, []);

  const fetchScheduledActivities = async () => {
    setLoading(true);
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:55',message:'fetchScheduledActivities: Starting fetch',data:{url:'/api/admin/bots/scheduler'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const response = await fetch('/api/admin/bots/scheduler');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:57',message:'fetchScheduledActivities: Response received',data:{ok:response.ok,status:response.status,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:59',message:'fetchScheduledActivities: Response text received',data:{ok:response.ok,status:response.status,contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (response.ok) {
        // Check if response is JSON before parsing
        if (!contentType || !contentType.includes('application/json')) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:65',message:'fetchScheduledActivities: Non-JSON response',data:{contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          setError(`Backend returned non-JSON response: ${responseText.substring(0, 200)}`);
          return;
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:71',message:'fetchScheduledActivities: Before JSON parse',data:{contentType,isJson:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const data = JSON.parse(responseText);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:63',message:'fetchScheduledActivities: JSON parsed successfully',data:{hasSuccess:!!data.success,hasActivities:!!data.activities,activitiesLength:data.activities?.length,activities:data.activities},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (data.success && data.activities) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:87',message:'fetchScheduledActivities: Setting activities',data:{activitiesLength:data.activities.length,firstActivity:data.activities[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          setScheduledActivities(data.activities);
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:90',message:'fetchScheduledActivities: Not setting activities',data:{hasSuccess:data.success,hasActivities:!!data.activities,activitiesLength:data.activities?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:78',message:'fetchScheduledActivities: Error response',data:{status:response.status,contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:73',message:'fetchScheduledActivities: Exception caught',data:{error:err.message,stack:err.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
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

    try {
      // Get all active bot IDs
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:84',message:'handleSaveSchedule: Starting bots fetch',data:{url:'/api/admin/bots'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const botsResponse = await fetch('/api/admin/bots');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:86',message:'handleSaveSchedule: Bots response received',data:{ok:botsResponse.ok,status:botsResponse.status,contentType:botsResponse.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const contentType = botsResponse.headers.get('content-type');
      const responseText = await botsResponse.text();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:88',message:'handleSaveSchedule: Response text received',data:{ok:botsResponse.ok,status:botsResponse.status,contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!botsResponse.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:93',message:'handleSaveSchedule: Bots response not ok',data:{status:botsResponse.status,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        throw new Error('Bot listesi alınamadı');
      }

      // Check if response is JSON before parsing
      if (!contentType || !contentType.includes('application/json')) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:100',message:'handleSaveSchedule: Non-JSON response',data:{contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error(`Backend returned non-JSON response: ${responseText.substring(0, 200)}`);
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:106',message:'handleSaveSchedule: Before JSON parse',data:{contentType,isJson:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const botsData = JSON.parse(responseText);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:97',message:'handleSaveSchedule: JSON parsed successfully',data:{hasSuccess:!!botsData.success,hasBots:!!botsData.bots},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (!botsData.success || !botsData.bots || botsData.bots.length === 0) {
        throw new Error('Aktif bot bulunamadı');
      }

      const activeBotIds = botsData.bots
        .filter((bot: any) => bot.isActive)
        .map((bot: any) => bot.id);

      if (activeBotIds.length === 0) {
        throw new Error('Aktif bot bulunamadı');
      }

      // Her aktivite için botCount kadar bot seç
      // Tüm aktiviteler için toplam bot sayısını hesapla (en yüksek botCount'u kullan)
      const maxBotCount = Math.max(...scheduledActivities.map(a => a.botCount || 0));
      const selectedBotIds = activeBotIds.slice(0, Math.min(maxBotCount, activeBotIds.length));

      if (selectedBotIds.length === 0) {
        throw new Error('Seçilecek bot bulunamadı');
      }

      // Save scheduler settings
      const response = await fetch('/api/admin/bots/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: scheduledActivities,
          botIds: selectedBotIds,
        }),
      });

      const schedulerContentType = response.headers.get('content-type');
      const schedulerResponseText = await response.text();

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:176',message:'handleSaveSchedule: Error response',data:{status:response.status,contentType:schedulerContentType,isHtml:schedulerResponseText.trim().startsWith('<!DOCTYPE'),preview:schedulerResponseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:201',message:'handleSaveSchedule: Before JSON parse',data:{contentType:schedulerContentType,isJson:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const data = JSON.parse(schedulerResponseText);

      if (!data.success) {
        throw new Error(data.error || "Zamanlayıcı kaydedilirken bir hata oluştu");
      }
      
      setSuccess(`Zamanlayıcı ayarları başarıyla kaydedildi. ${data.results?.length || 0} bot güncellendi.`);
      setShowAddForm(false);
      setEditingIndex(null);
      await fetchScheduledActivities();
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SchedulerManager.tsx:130',message:'handleSaveSchedule: Exception caught',data:{error:err.message,stack:err.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setError(err.message || "Zamanlayıcı kaydedilirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleAddActivity = () => {
    setScheduledActivities([...scheduledActivities, { ...newActivity }]);
    setNewActivity({
      activityType: "POST",
      botCount: 10,
      frequency: "daily",
      activityHours: [9, 12, 18, 21],
      minCount: 1,
      maxCount: 3,
    });
    setShowAddForm(false);
  };

  const handleRemoveActivity = (index: number) => {
    setScheduledActivities(scheduledActivities.filter((_, i) => i !== index));
  };

  const handleUpdateActivity = (index: number, updates: Partial<ScheduledActivity>) => {
    const updated = [...scheduledActivities];
    updated[index] = { ...updated[index], ...updates };
    setScheduledActivities(updated);
  };

  const toggleHour = (hours: number[], hour: number) => {
    if (hours.includes(hour)) {
      return hours.filter(h => h !== hour);
    } else {
      return [...hours, hour].sort((a, b) => a - b);
    }
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
                Bot Sayısı *
              </label>
              <input
                type="number"
                value={newActivity.botCount}
                onChange={(e) => setNewActivity({ ...newActivity, botCount: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aktivite Saatleri (0-23)
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setNewActivity({ ...newActivity, activityHours: toggleHour(newActivity.activityHours, hour) })}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      newActivity.activityHours.includes(hour)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {hour}:00
                  </button>
                ))}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Bot Sayısı:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{activity.botCount}</span>
                      </div>
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
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Saatler:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {activity.activityHours.length} saat
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {activity.activityHours.map((hour) => (
                        <span
                          key={hour}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded text-xs"
                        >
                          {hour}:00
                        </span>
                      ))}
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
