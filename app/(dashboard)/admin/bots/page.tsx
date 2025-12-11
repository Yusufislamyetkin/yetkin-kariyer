"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import { BotList } from "./_components/BotList";
import { SchedulerManager } from "./_components/SchedulerManager";
import { ActivityViewer } from "./_components/ActivityViewer";
import { OnlineManager } from "./_components/OnlineManager";

export default function BotsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "scheduler" | "activities" | "online">("dashboard");
  const [botStatistics, setBotStatistics] = useState<any>(null);
  const [botStatisticsLoading, setBotStatisticsLoading] = useState(false);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[BOT_STATISTICS_PAGE] State updated:', {
      botStatistics,
      botStatisticsLoading,
      hasStatistics: !!botStatistics,
      totalBots: botStatistics?.totalBots,
      activeBots: botStatistics?.activeBots
    });
  }, [botStatistics, botStatisticsLoading]);
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:20',message:'useEffect: fetchBotStatistics called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    fetchBotStatistics();
  }, []);

  const fetchBotStatistics = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:24',message:'fetchBotStatistics: Entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setBotStatisticsLoading(true);
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:27',message:'fetchBotStatistics: Before fetch',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const response = await fetch('/api/admin/bots/statistics');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:29',message:'fetchBotStatistics: Response received',data:{ok:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (response.ok) {
        const data = await response.json();
        console.log('[BOT_STATISTICS] API Response:', data);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:32',message:'fetchBotStatistics: Data parsed',data:{hasSuccess:!!data.success,hasStatistics:!!data.statistics,statisticsKeys:data.statistics?Object.keys(data.statistics):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        if (data.success && data.statistics) {
          console.log('[BOT_STATISTICS] Setting statistics:', data.statistics);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:35',message:'fetchBotStatistics: Before setBotStatistics',data:{totalBots:data.statistics.totalBots,activeBots:data.statistics.activeBots},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          setBotStatistics(data.statistics);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:37',message:'fetchBotStatistics: After setBotStatistics',data:{totalBots:data.statistics.totalBots,activeBots:data.statistics.activeBots},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        } else {
          console.warn('[BOT_STATISTICS] Invalid response format:', data);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:40',message:'fetchBotStatistics: Invalid response format',data:{data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
        }
      } else {
        const errorText = await response.text();
        console.error('[BOT_STATISTICS] Error response:', response.status, errorText);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:43',message:'fetchBotStatistics: Error response',data:{status:response.status,errorText:errorText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
      }
    } catch (err) {
      console.error('Error fetching bot statistics:', err);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:46',message:'fetchBotStatistics: Exception',data:{error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } finally {
      setBotStatisticsLoading(false);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:49',message:'fetchBotStatistics: Finally block',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  🤖 Bot Yönetimi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Bot aktivitelerini zamanlayın, izleyin ve yönetin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Bot</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {botStatisticsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    botStatistics?.totalBots ?? 'N/A'
                  )}
                </p>
              </div>
              <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Bot</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {botStatisticsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    botStatistics?.activeBots ?? 'N/A'
                  )}
                </p>
              </div>
              <Bot className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Zamanlanmış</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {botStatisticsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    botStatistics?.scheduledBots || 0
                  )}
                </p>
              </div>
              <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bugünkü Aktivite</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {botStatisticsLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    botStatistics?.todayActivities || 0
                  )}
                </p>
              </div>
              <Bot className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "dashboard"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("scheduler")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "scheduler"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Zamanlayıcı
              </button>
              <button
                onClick={() => setActiveTab("activities")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "activities"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Aktiviteler
              </button>
              <button
                onClick={() => setActiveTab("online")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "online"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Çevrimiçi Yönetimi
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <BotList 
                  onRefresh={fetchBotStatistics}
                  selectedBotIds={selectedBotIds}
                  onSelectionChange={setSelectedBotIds}
                />
              </div>
            )}

            {activeTab === "scheduler" && (
              <SchedulerManager />
            )}

            {activeTab === "activities" && (
              <ActivityViewer />
            )}

            {activeTab === "online" && (
              <OnlineManager selectedBotIds={selectedBotIds} onSelectionChange={setSelectedBotIds} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
