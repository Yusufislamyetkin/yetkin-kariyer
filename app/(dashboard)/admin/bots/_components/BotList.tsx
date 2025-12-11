"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Settings, Trash2, CheckCircle2, XCircle, Clock, Rocket, CheckSquare, Square } from "lucide-react";
import { BotConfigModal } from "../../users/_components/BotConfigModal";

const ACTIVITY_TYPES: Record<string, { label: string; icon: string }> = {
  POST: { label: "LinkedIn Post", icon: "📝" },
  LIKE: { label: "Post Beğenme", icon: "👍" },
  COMMENT: { label: "Yorum Yapma", icon: "💬" },
  HACKATHON_APPLICATION: { label: "Hackathon Başvurusu", icon: "🚀" },
  FREELANCER_BID: { label: "Freelancer Proje", icon: "💼" },
  JOB_APPLICATION: { label: "İş İlanı Başvurusu", icon: "📋" },
  TEST: { label: "Test Çözme", icon: "📊" },
  LIVE_CODING: { label: "Canlı Kodlama", icon: "💻" },
  LESSON: { label: "Ders Tamamlama", icon: "📚" },
};

interface Bot {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  scheduleEnabled: boolean;
  enabledActivities?: string[];
  activityHours?: number[];
  activityIntervals?: Record<string, number>;
  lastActivityAt?: string | null;
}

interface BotListProps {
  onRefresh?: () => void;
  selectedBotIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export function BotList({ onRefresh, selectedBotIds = new Set(), onSelectionChange }: BotListProps) {
  const [botList, setBotList] = useState<Bot[]>([]);
  const [botListLoading, setBotListLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [botCount, setBotCount] = useState<string>("");
  const [creatingBots, setCreatingBots] = useState(false);
  const [botCreationProgress, setBotCreationProgress] = useState<{ current: number; total: number } | null>(null);
  const [botConfigModalOpen, setBotConfigModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [selectedBotConfig, setSelectedBotConfig] = useState<{ botCharacter: any; botConfiguration: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);

  useEffect(() => {
    fetchBotList();
  }, [page]);

  const fetchBotList = async () => {
    setBotListLoading(true);
    try {
      console.log('[FETCH_BOT_LIST] Starting fetch', { page });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:42',message:'fetchBotList: Entry',data:{page},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const response = await fetch(`/api/admin/bots?page=${page}&limit=100`);
      console.log('[FETCH_BOT_LIST] Response received', { ok: response.ok, status: response.status });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:47',message:'fetchBotList: Response received',data:{ok:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();
        console.log('[FETCH_BOT_LIST] Response text', { contentType, preview: responseText.substring(0, 200) });
        
        if (!contentType || !contentType.includes('application/json')) {
          console.error('[FETCH_BOT_LIST] Non-JSON response:', responseText.substring(0, 300));
          setBotList([]);
          return;
        }
        
        const data = JSON.parse(responseText);
        console.log('[FETCH_BOT_LIST] Parsed data', { 
          hasSuccess: !!data.success, 
          hasBots: !!data.bots, 
          botsCount: data.bots?.length || 0,
          dataKeys: Object.keys(data)
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:60',message:'fetchBotList: Parsed data',data:{hasSuccess:!!data.success,hasBots:!!data.bots,botsCount:data.bots?.length||0,dataKeys:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        if (data.success && data.bots) {
          console.log('[FETCH_BOT_LIST] Setting bot list', data.bots.length);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:68',message:'fetchBotList: Setting bot list (success path)',data:{botsCount:data.bots.length,firstBotId:data.bots[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          setBotList(data.bots);
          if (data.pagination) {
            setPagination(data.pagination);
          }
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:70',message:'fetchBotList: After setBotList call',data:{botsCount:data.bots.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
          // #endregion
        } else if (data.bots) {
          // Some APIs return bots directly without success flag
          console.log('[FETCH_BOT_LIST] Setting bot list (no success flag)', data.bots.length);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:72',message:'fetchBotList: Setting bot list (no success flag path)',data:{botsCount:data.bots.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          setBotList(data.bots);
        } else {
          console.warn('[FETCH_BOT_LIST] No bots in response', data);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:76',message:'fetchBotList: No bots in response',data:{data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          setBotList([]);
        }
      } else {
        const errorText = await response.text();
        console.error('[FETCH_BOT_LIST] Error response', { status: response.status, error: errorText.substring(0, 200) });
        setBotList([]);
      }
    } catch (err: any) {
      console.error('[FETCH_BOT_LIST] Exception:', err);
      setBotList([]);
    } finally {
      setBotListLoading(false);
    }
  };

  const handleCreateBotsBulk = async () => {
    const count = parseInt(botCount);
    if (!count || count <= 0) {
      setError('Lütfen geçerli bir bot sayısı girin');
      return;
    }

    if (count > 1000) {
      setError('Bir seferde en fazla 1000 bot oluşturabilirsiniz');
      return;
    }

    setCreatingBots(true);
    setError(null);
    setBotCreationProgress({ current: 0, total: count });

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:70',message:'handleCreateBotsBulk: Starting batch creation',data:{totalCount:count},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Create bots in batches to avoid timeout and show progress
      const BATCH_SIZE = 10; // Create 10 bots at a time (reduced to avoid timeout)
      const batches = Math.ceil(count / BATCH_SIZE);
      let totalCreated = 0;
      const errors: any[] = [];
      
      console.log(`[BOT_CREATION] Starting: ${count} bots in ${batches} batches of ${BATCH_SIZE}`);

      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        const batchStart = batchIndex * BATCH_SIZE + 1;
        const batchEnd = Math.min((batchIndex + 1) * BATCH_SIZE, count);
        const batchCount = batchEnd - batchStart + 1;

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:85',message:'handleCreateBotsBulk: Processing batch',data:{batchIndex,batchStart,batchEnd,batchCount,totalCreated},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        console.log(`[BOT_CREATION] Batch ${batchIndex + 1}/${batches}: Creating ${batchCount} bots (${batchStart}-${batchEnd})`);

        try {
          const response = await fetch('/api/admin/bots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: batchCount }),
          });

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:95',message:'handleCreateBotsBulk: Batch response received',data:{ok:response.ok,status:response.status,batchIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion

          if (!response.ok) {
            const contentType = response.headers.get('content-type');
            const responseText = await response.text();
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:102',message:'handleCreateBotsBulk: Batch error',data:{status:response.status,contentType,isHtml:responseText.trim().startsWith('<!DOCTYPE'),preview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion

            let errorData;
            if (contentType && contentType.includes('application/json')) {
              try {
                errorData = JSON.parse(responseText);
              } catch (e) {
                errorData = { error: 'Failed to parse error response' };
              }
            } else {
              errorData = { error: `Backend returned non-JSON: ${responseText.substring(0, 100)}` };
            }
            
            errors.push({ batch: batchIndex + 1, error: errorData.error || 'Batch failed' });
            continue;
          }

          const contentType = response.headers.get('content-type');
          const responseText = await response.text();
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:120',message:'handleCreateBotsBulk: Before JSON parse',data:{contentType,isJson:contentType?.includes('application/json')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion

          if (!contentType || !contentType.includes('application/json')) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:125',message:'handleCreateBotsBulk: Non-JSON response',data:{contentType,preview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            errors.push({ batch: batchIndex + 1, error: `Non-JSON response: ${responseText.substring(0, 100)}` });
            continue;
          }

          const data = JSON.parse(responseText);
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:143',message:'handleCreateBotsBulk: Batch response data',data:{created:data.created,bots:data.bots?.length,success:data.success,message:data.message,batchIndex,dataKeys:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion

          // Calculate created count from response
          let batchCreated = 0;
          if (data.success) {
            // Check multiple possible response formats
            if (data.created !== undefined) {
              batchCreated = data.created;
            } else if (data.bots && Array.isArray(data.bots)) {
              batchCreated = data.bots.length;
            } else if (data.success && !data.error) {
              // If success=true and no error, assume all were created
              batchCreated = batchCount;
            }
          }
          
          console.log(`[BOT_CREATION] Batch ${batchIndex + 1}: ${batchCreated} bots created (expected ${batchCount})`);
          totalCreated += batchCreated;

          // Update progress
          console.log(`[BOT_CREATION] Progress: ${totalCreated}/${count} bots created`);
          setBotCreationProgress({ current: totalCreated, total: count });
        } catch (err: any) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:145',message:'handleCreateBotsBulk: Batch exception',data:{error:err.message,stack:err.stack,batchIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          errors.push({ batch: batchIndex + 1, error: err.message || 'Batch failed' });
        }
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:152',message:'handleCreateBotsBulk: All batches completed',data:{totalCreated,totalCount:count,errorsCount:errors.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log(`[BOT_CREATION] Completed: ${totalCreated}/${count} bots created, ${errors.length} errors`);

      if (errors.length > 0) {
        setError(`${totalCreated} bot oluşturuldu, ${errors.length} batch hatası: ${errors.map(e => e.error).join(', ')}`);
      }

      setBotCount('');
      setBotCreationProgress(null);
      
      // Wait a bit for backend to process
      console.log('[BOT_CREATION] Waiting 3 seconds before refreshing list...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('[BOT_CREATION] Refreshing bot list...');
      // Force refresh by calling fetchBotList
      await fetchBotList();
      // Wait and refresh again to ensure backend has committed
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('[BOT_CREATION] Second refresh...');
      await fetchBotList();
      if (onRefresh) {
        console.log('[BOT_CREATION] Calling onRefresh callback...');
        onRefresh();
      }
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:163',message:'handleCreateBotsBulk: Outer exception',data:{error:err.message,stack:err.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setCreatingBots(false);
      setBotCreationProgress(null);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    setActionLoading(botId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bots/${botId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Bot silinirken bir hata oluştu');
      }

      await fetchBotList();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBotConfig = async (bot: Bot) => {
    try {
      const configResponse = await fetch(`/api/admin/bots/${bot.id}/config`);
      if (configResponse.ok) {
        const configData = await configResponse.json();
        
        // Bot character is now included in config response
        const botCharacter = configData.botCharacter || null;
        
        // Map config response to modal format
        const botConfiguration = configData.success && configData.config ? {
          id: configData.config.userId,
          isActive: configData.config.isActive,
          minPostsPerDay: configData.config.minPostsPerDay || 1,
          maxPostsPerDay: configData.config.maxPostsPerDay || 3,
          minCommentsPerDay: configData.config.minCommentsPerDay || 0,
          maxCommentsPerDay: configData.config.maxCommentsPerDay || 5,
          minLikesPerDay: configData.config.minLikesPerDay || 0,
          maxLikesPerDay: configData.config.maxLikesPerDay || 10,
          minTestsPerWeek: configData.config.minTestsPerWeek || 0,
          maxTestsPerWeek: configData.config.maxTestsPerWeek || 3,
          minLiveCodingPerWeek: configData.config.minLiveCodingPerWeek || 0,
          maxLiveCodingPerWeek: configData.config.maxLiveCodingPerWeek || 2,
          minBugFixPerWeek: configData.config.minBugFixPerWeek || 0,
          maxBugFixPerWeek: configData.config.maxBugFixPerWeek || 2,
          minLessonsPerWeek: configData.config.minLessonsPerWeek || 0,
          maxLessonsPerWeek: configData.config.maxLessonsPerWeek || 5,
          minChatMessagesPerDay: configData.config.minChatMessagesPerDay || 0,
          maxChatMessagesPerDay: configData.config.maxChatMessagesPerDay || 10,
          activityHours: configData.config.activityHours || [9, 12, 18, 21],
        } : null;
        
        setSelectedBot(bot);
        setSelectedBotConfig({
          botCharacter: botCharacter,
          botConfiguration: botConfiguration,
        });
        setBotConfigModalOpen(true);
      } else {
        setError('Bot konfigürasyonu alınamadı');
      }
    } catch (err) {
      console.error('Error fetching bot config:', err);
      setError('Bot konfigürasyonu alınırken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Bulk Bot Creation - DISABLED */}
      {/* <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Toplu Bot Oluşturma
        </h3>
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Oluşturulacak Bot Sayısı
            </label>
            <input
              type="number"
              value={botCount}
              onChange={(e) => setBotCount(e.target.value)}
              placeholder="Örn: 200"
              min="1"
              max="1000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={creatingBots}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCreateBotsBulk}
              disabled={creatingBots || !botCount || parseInt(botCount) <= 0}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {creatingBots ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Bot Oluştur
                </>
              )}
            </Button>
          </div>
        </div>
        {botCreationProgress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>İlerleme</span>
              <span>{botCreationProgress.current} / {botCreationProgress.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(botCreationProgress.current / botCreationProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div> */}

      {/* Bot List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Bot Listesi
          </h3>
          <Button
            onClick={fetchBotList}
            variant="outline"
            size="sm"
            disabled={botListLoading}
          >
            {botListLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Yenile'
            )}
          </Button>
        </div>
        {botListLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : botList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Henüz bot oluşturulmamış
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:420',message:'fetchBotList: Rendering empty state',data:{botListLength:botList.length,botListType:typeof botList,isArray:Array.isArray(botList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
          </div>
        ) : (
          <>
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7242/ingest/a8c809a5-2e2a-4594-9201-a710299032db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BotList.tsx:451',message:'fetchBotList: Rendering bot table',data:{botListLength:botList.length,firstBotId:botList[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {onSelectionChange && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">
                      <button
                        onClick={() => {
                          if (selectedBotIds.size === botList.length) {
                            onSelectionChange(new Set());
                          } else {
                            onSelectionChange(new Set(botList.map(b => b.id)));
                          }
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        {selectedBotIds.size === botList.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Kullanıcı Adı</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Durum</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Aktiviteler</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Son Aktivite</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {botList.map((bot) => (
                  <tr key={bot.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {onSelectionChange && (
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const newSelected = new Set(selectedBotIds);
                            if (newSelected.has(bot.id)) {
                              newSelected.delete(bot.id);
                            } else {
                              newSelected.add(bot.id);
                            }
                            onSelectionChange(newSelected);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          {selectedBotIds.has(bot.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {bot.userName || `${bot.firstName || ''} ${bot.lastName || ''}`.trim() || 'Bot'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {bot.email}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {bot.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Pasif
                          </span>
                        )}
                        {bot.scheduleEnabled && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Zamanlanmış
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {bot.enabledActivities && bot.enabledActivities.length > 0 && bot.scheduleEnabled ? (
                        <div className="space-y-2">
                          {bot.enabledActivities.map((activityType: string, idx: number) => {
                            const activityInfo = ACTIVITY_TYPES[activityType] || { label: activityType, icon: "📌" };
                            const interval = bot.activityIntervals?.[activityType] || 5;
                            const frequency = interval < 60 ? 'Günlük' : 'Haftalık';
                            const hours = bot.activityHours && bot.activityHours.length > 0 
                              ? bot.activityHours.sort((a, b) => a - b).map(h => `${h}:00`).join(', ')
                              : 'Belirtilmemiş';
                            
                            return (
                              <div key={idx} className="border-l-2 border-purple-500 pl-2 py-1">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="text-xs">{activityInfo.icon}</span>
                                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                    {activityInfo.label}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                                  <div>Sıklık: {frequency}</div>
                                  <div>Saatler: {hours}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : bot.scheduleEnabled ? (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">Aktivite tanımlanmamış</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">Zamanlanmamış</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {bot.lastActivityAt ? formatDate(bot.lastActivityAt) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleBotConfig(bot)}
                          variant="outline"
                          size="sm"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteBot(bot.id)}
                          variant="outline"
                          size="sm"
                          disabled={actionLoading === bot.id}
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {actionLoading === bot.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Toplam {pagination.totalCount} bot - Sayfa {pagination.page} / {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev || botListLoading}
                  variant="outline"
                  size="sm"
                >
                  Önceki
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={botListLoading}
                        variant={pagination.page === pageNum ? "primary" : "outline"}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNext || botListLoading}
                  variant="outline"
                  size="sm"
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* Bot Config Modal */}
      {selectedBot && (
        <BotConfigModal
          isOpen={botConfigModalOpen}
          onClose={() => {
            setBotConfigModalOpen(false);
            setSelectedBot(null);
            setSelectedBotConfig(null);
          }}
          userId={selectedBot.id}
          userName={selectedBot.userName || `${selectedBot.firstName || ''} ${selectedBot.lastName || ''}`.trim() || 'Bot'}
          existingConfig={selectedBotConfig || undefined}
          onSuccess={() => {
            fetchBotList();
            if (onRefresh) onRefresh();
            setBotConfigModalOpen(false);
            setSelectedBot(null);
            setSelectedBotConfig(null);
          }}
        />
      )}
    </div>
  );
}
