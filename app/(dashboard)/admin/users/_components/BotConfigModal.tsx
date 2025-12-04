"use client";

import { useState, useEffect } from "react";
import { X, Bot, Settings, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface BotCharacter {
  id?: string;
  name: string;
  persona: string;
  systemPrompt: string;
  traits?: any;
  expertise: string[];
}

interface BotConfiguration {
  id?: string;
  isActive: boolean;
  minPostsPerDay: number;
  maxPostsPerDay: number;
  minCommentsPerDay: number;
  maxCommentsPerDay: number;
  minLikesPerDay: number;
  maxLikesPerDay: number;
  minTestsPerWeek: number;
  maxTestsPerWeek: number;
  minLiveCodingPerWeek: number;
  maxLiveCodingPerWeek: number;
  minBugFixPerWeek: number;
  maxBugFixPerWeek: number;
  minLessonsPerWeek: number;
  maxLessonsPerWeek: number;
  minChatMessagesPerDay: number;
  maxChatMessagesPerDay: number;
  activityHours: number[];
}

interface BotConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string | null;
  existingConfig?: {
    botCharacter: BotCharacter | null;
    botConfiguration: BotConfiguration | null;
  };
  onSuccess: () => void;
}

export function BotConfigModal({
  isOpen,
  onClose,
  userId,
  userName,
  existingConfig,
  onSuccess,
}: BotConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<BotCharacter>({
    name: userName || "Bot",
    persona: `${userName || "Bot"} karakteri - Yardımsever ve aktif bir topluluk üyesi.`,
    systemPrompt: `Sen ${userName || "bir bot"} karakterisin. Gerçekçi ve yardımsever bir şekilde davran. Topluluk içinde aktif ol ve diğer kullanıcılara yardımcı ol.`,
    expertise: [],
  });
  const [config, setConfig] = useState<BotConfiguration>({
    isActive: true,
    minPostsPerDay: 1,
    maxPostsPerDay: 3,
    minCommentsPerDay: 0,
    maxCommentsPerDay: 5,
    minLikesPerDay: 0,
    maxLikesPerDay: 10,
    minTestsPerWeek: 0,
    maxTestsPerWeek: 3,
    minLiveCodingPerWeek: 0,
    maxLiveCodingPerWeek: 2,
    minBugFixPerWeek: 0,
    maxBugFixPerWeek: 2,
    minLessonsPerWeek: 0,
    maxLessonsPerWeek: 5,
    minChatMessagesPerDay: 0,
    maxChatMessagesPerDay: 10,
    activityHours: [9, 12, 18, 21],
  });

  useEffect(() => {
    if (existingConfig?.botCharacter) {
      setCharacter(existingConfig.botCharacter);
    }
    if (existingConfig?.botConfiguration) {
      setConfig(existingConfig.botConfiguration);
    }
  }, [existingConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = existingConfig?.botConfiguration
        ? `/api/admin/users/${userId}/bot/config`
        : `/api/admin/users/${userId}/bot`;

      const method = existingConfig?.botConfiguration ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: character.name,
          persona: character.persona,
          systemPrompt: character.systemPrompt,
          traits: character.traits || {},
          expertise: character.expertise,
          isActive: config.isActive,
          minPostsPerDay: config.minPostsPerDay,
          maxPostsPerDay: config.maxPostsPerDay,
          minCommentsPerDay: config.minCommentsPerDay,
          maxCommentsPerDay: config.maxCommentsPerDay,
          minLikesPerDay: config.minLikesPerDay,
          maxLikesPerDay: config.maxLikesPerDay,
          minTestsPerWeek: config.minTestsPerWeek,
          maxTestsPerWeek: config.maxTestsPerWeek,
          minLiveCodingPerWeek: config.minLiveCodingPerWeek,
          maxLiveCodingPerWeek: config.maxLiveCodingPerWeek,
          minBugFixPerWeek: config.minBugFixPerWeek,
          maxBugFixPerWeek: config.maxBugFixPerWeek,
          minLessonsPerWeek: config.minLessonsPerWeek,
          maxLessonsPerWeek: config.maxLessonsPerWeek,
          minChatMessagesPerDay: config.minChatMessagesPerDay,
          maxChatMessagesPerDay: config.maxChatMessagesPerDay,
          activityHours: config.activityHours,
          ...(method === "PUT" && {
            character: character,
            configuration: config,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Bot Yapılandırması
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userName || "Kullanıcı"} için bot ayarları
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Bot Character Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Bot Karakteri
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Karakter Adı
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Persona
                  </label>
                  <textarea
                    value={character.persona}
                    onChange={(e) => setCharacter({ ...character, persona: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={character.systemPrompt}
                    onChange={(e) => setCharacter({ ...character, systemPrompt: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Activity Configuration Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Aktivite Ayarları
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Posts */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Günlük Post Sayısı
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minPostsPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, minPostsPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxPostsPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, maxPostsPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Günlük Yorum Sayısı
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minCommentsPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, minCommentsPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxCommentsPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, maxCommentsPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Likes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Günlük Beğeni Sayısı
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minLikesPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, minLikesPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxLikesPerDay}
                      onChange={(e) =>
                        setConfig({ ...config, maxLikesPerDay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Tests */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Haftalık Test Sayısı
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minTestsPerWeek}
                      onChange={(e) =>
                        setConfig({ ...config, minTestsPerWeek: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxTestsPerWeek}
                      onChange={(e) =>
                        setConfig({ ...config, maxTestsPerWeek: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Live Coding */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Haftalık Canlı Kodlama
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minLiveCodingPerWeek}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          minLiveCodingPerWeek: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxLiveCodingPerWeek}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          maxLiveCodingPerWeek: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Haftalık Ders Sayısı
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={config.minLessonsPerWeek}
                      onChange={(e) =>
                        setConfig({ ...config, minLessonsPerWeek: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={config.maxLessonsPerWeek}
                      onChange={(e) =>
                        setConfig({ ...config, maxLessonsPerWeek: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={config.isActive}
                  onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bot aktif
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            İptal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : existingConfig?.botConfiguration ? (
              "Güncelle"
            ) : (
              "Bot Olarak Ata"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

