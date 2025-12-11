"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loader2, Wifi, WifiOff, X } from "lucide-react";

interface KeepOnlineJob {
  jobId: string;
  userIds: string[];
  startTime: string;
  endTime: string;
  remainingHours: number;
}

interface OnlineManagerProps {
  selectedBotIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export function OnlineManager({ selectedBotIds = new Set(), onSelectionChange }: OnlineManagerProps) {
  const [keepOnlineDuration, setKeepOnlineDuration] = useState<string>("4");
  const [keepOnlineRunning, setKeepOnlineRunning] = useState(false);
  const [activeKeepOnlineJobs, setActiveKeepOnlineJobs] = useState<KeepOnlineJob[]>([]);
  const [keepOnlineJobsLoading, setKeepOnlineJobsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveKeepOnlineJobs();
  }, []);

  const fetchActiveKeepOnlineJobs = async () => {
    setKeepOnlineJobsLoading(true);
    try {
      const response = await fetch("/api/admin/bots/keep-online");

      if (!response.ok) {
        throw new Error("Aktif job'lar alınırken bir hata oluştu");
      }

      const data = await response.json();
      setActiveKeepOnlineJobs(data.jobs || []);
    } catch (err: any) {
      console.error("Error fetching active keep-online jobs:", err);
    } finally {
      setKeepOnlineJobsLoading(false);
    }
  };

  const handleKeepOnline = async () => {
    if (selectedBotIds.size === 0) {
      setError("Lütfen en az bir bot seçin");
      return;
    }

    const duration = parseFloat(keepOnlineDuration);
    if (!duration || duration < 1 || duration > 24) {
      setError("Lütfen 1-24 saat arasında bir süre girin");
      return;
    }

    setKeepOnlineRunning(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/bots/keep-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedBotIds),
          durationHours: duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bot'ları çevrimiçi tutma işlemi başlatılırken bir hata oluştu");
      }

      setSuccess(`${selectedBotIds.size} bot ${duration} saat boyunca çevrimiçi tutulacak`);
      onSelectionChange?.(new Set());
      await fetchActiveKeepOnlineJobs();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setKeepOnlineRunning(false);
    }
  };

  const handleStopKeepOnlineJob = async (jobId: string) => {
    try {
      const response = await fetch("/api/admin/bots/keep-online", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Job durdurulurken bir hata oluştu");
      }

      await fetchActiveKeepOnlineJobs();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Çevrimiçi Yönetimi
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Seçili botları belirli süre boyunca çevrimiçi gösterin
        </p>
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

      {/* New Job Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Yeni Çevrimiçi Tutma İşlemi
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Süre (Saat) *
            </label>
            <input
              type="number"
              value={keepOnlineDuration}
              onChange={(e) => setKeepOnlineDuration(e.target.value)}
              placeholder="4"
              min="1"
              max="24"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={keepOnlineRunning}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Bot&apos;lar kaç saat boyunca çevrimiçi tutulacak? (1-24 saat)
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Seçili Bot Sayısı:</strong> {selectedBotIds.size}
              <br />
              <strong>Not:</strong> Bot seçimi için Dashboard sekmesindeki Bot Listesi&apos;nden botları seçebilirsiniz.
              <br />
              <strong>Nasıl çalışır?</strong> Seçili bot&apos;lar belirtilen süre boyunca çevrimiçi görünecek.
              Mevcut chat presence heartbeat sistemi kullanılarak otomatik güncellenir.
            </p>
          </div>
          <Button
            onClick={handleKeepOnline}
            disabled={keepOnlineRunning || selectedBotIds.size === 0 || !keepOnlineDuration || parseFloat(keepOnlineDuration) < 1}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {keepOnlineRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Başlatılıyor...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Başlat ({selectedBotIds.size} bot seçili)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Aktif İşlemler
          </h4>
          <Button
            onClick={fetchActiveKeepOnlineJobs}
            variant="outline"
            size="sm"
            disabled={keepOnlineJobsLoading}
          >
            {keepOnlineJobsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Yenile"
            )}
          </Button>
        </div>

        {activeKeepOnlineJobs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <WifiOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Henüz aktif işlem yok</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeKeepOnlineJobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {job.userIds.length} Bot
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <strong>Başlangıç:</strong>{" "}
                        {new Date(job.startTime).toLocaleString("tr-TR")}
                      </p>
                      <p>
                        <strong>Bitiş:</strong>{" "}
                        {new Date(job.endTime).toLocaleString("tr-TR")}
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        <strong>Kalan Süre:</strong> {job.remainingHours.toFixed(1)} saat
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStopKeepOnlineJob(job.jobId)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <WifiOff className="h-4 w-4 mr-2" />
                    Durdur
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
