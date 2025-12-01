"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import {
  Loader2,
  Bot,
  ArrowLeft,
  Edit,
  Play,
  Pause,
  Activity,
  User as UserIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BotCharacter {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  expertise: string[];
}

interface BotConfiguration {
  id: string;
  isActive: boolean;
  minPostsPerDay: number;
  maxPostsPerDay: number;
  lastActivityAt: string | null;
}

interface Bot {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  isBot: boolean;
  createdAt: string;
  botCharacter: BotCharacter | null;
  botConfiguration: BotConfiguration | null;
}

export default function AdminBotsPage() {
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const fetchBots = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bots");

      if (!response.ok) {
        throw new Error("Botlar alınırken bir hata oluştu");
      }

      const data = await response.json();
      setBots(data.bots || []);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleToggleActive = async (botId: string, currentStatus: boolean) => {
    setToggling((prev) => new Set(prev).add(botId));

    try {
      const response = await fetch(`/api/admin/bots/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Bot durumu güncellenemedi");
      }

      await fetchBots();
    } catch (err: any) {
      alert(`Hata: ${err.message}`);
    } finally {
      setToggling((prev) => {
        const newSet = new Set(prev);
        newSet.delete(botId);
        return newSet;
      });
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
                  Sistemdeki tüm AI botlarını yönetin
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {bots.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Toplam Bot
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Bots List */}
        {!loading && !error && (
          <>
            {bots.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-12 text-center">
                <Bot className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bot bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Henüz sistemde aktif bot yok.
                </p>
                <Link href="/admin/users">
                  <Button>
                    Kullanıcıları Bot&apos;a Dönüştür
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Header with Image */}
                    <div className="relative w-full h-32 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                        {bot.profileImage ? (
                          <Image
                            src={bot.profileImage}
                            alt={bot.name || "Bot"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Bot className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      {bot.botConfiguration?.isActive && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Activity className="h-3 w-3" />
                            Aktif
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bot Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {bot.botCharacter?.name || bot.name || "İsimsiz Bot"}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {bot.botCharacter?.persona || "Karakter tanımı yok"}
                      </p>

                      {bot.botCharacter?.expertise && bot.botCharacter.expertise.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {bot.botCharacter.expertise.slice(0, 3).map((exp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {exp}
                              </span>
                            ))}
                            {bot.botCharacter.expertise.length > 3 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{bot.botCharacter.expertise.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {bot.botConfiguration && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p>
                            Günde {bot.botConfiguration.minPostsPerDay} - {bot.botConfiguration.maxPostsPerDay} post
                          </p>
                          {bot.botConfiguration.lastActivityAt && (
                            <p className="mt-1">
                              Son aktivite: {new Date(bot.botConfiguration.lastActivityAt).toLocaleDateString("tr-TR")}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleToggleActive(bot.id, bot.botConfiguration?.isActive || false)}
                          disabled={toggling.has(bot.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {toggling.has(bot.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : bot.botConfiguration?.isActive ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              Durdur
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Başlat
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => router.push(`/admin/bots/${bot.id}`)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Link href={`/profile/${bot.id}`}>
                          <Button variant="outline" size="sm">
                            <UserIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

