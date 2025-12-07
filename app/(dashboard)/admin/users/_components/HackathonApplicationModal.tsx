"use client";

import { useState, useEffect } from "react";
import { X, Rocket, Loader2, CheckCircle2, AlertCircle, Users, User, CheckSquare, Square } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface Hackathon {
  id: string;
  title: string;
  description: string | null;
  lifecycle: {
    derivedPhase: string;
    isApplicationWindowOpen: boolean;
  };
  minTeamSize: number | null;
  maxTeamSize: number | null;
  organizer: {
    name: string | null;
  };
}

interface HackathonApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: string[];
  onSuccess: () => void;
}

export function HackathonApplicationModal({
  isOpen,
  onClose,
  userIds,
  onSuccess,
}: HackathonApplicationModalProps) {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [applicationMode, setApplicationMode] = useState<"solo" | "team">("solo");
  const [teamSize, setTeamSize] = useState<string>("2");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHackathons();
      setSelectedHackathonId(null);
      setApplicationMode("solo");
      setTeamSize("2");
      setError(null);
      setSuccess(null);
      setResult(null);
    }
  }, [isOpen]);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hackathons");
      if (!response.ok) {
        throw new Error("Hackathonlar alınırken bir hata oluştu");
      }
      const data = await response.json();
      // Filter only hackathons with open application window
      const openHackathons = (data.hackathons || []).filter(
        (h: Hackathon) => h.lifecycle?.isApplicationWindowOpen
      );
      setHackathons(openHackathons);
    } catch (err: any) {
      setError(err.message || "Hackathonlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const selectedHackathon = hackathons.find((h) => h.id === selectedHackathonId);

  const handleSubmit = async () => {
    if (!selectedHackathonId) {
      setError("Lütfen bir hackathon seçin");
      return;
    }

    if (applicationMode === "team") {
      const size = parseInt(teamSize);
      if (!size || size < 2) {
        setError("Takım boyutu en az 2 olmalıdır");
        return;
      }
      if (selectedHackathon) {
        if (selectedHackathon.minTeamSize && size < selectedHackathon.minTeamSize) {
          setError(`Bu hackathon için minimum takım boyutu ${selectedHackathon.minTeamSize}'dir`);
          return;
        }
        if (selectedHackathon.maxTeamSize && size > selectedHackathon.maxTeamSize) {
          setError(`Bu hackathon için maksimum takım boyutu ${selectedHackathon.maxTeamSize}'dir`);
          return;
        }
      }
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/bots/bulk-hackathon-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(userIds),
          hackathonId: selectedHackathonId,
          mode: applicationMode,
          teamSize: applicationMode === "team" ? parseInt(teamSize) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Başvurular oluşturulurken bir hata oluştu");
      }

      setResult(data);
      setSuccess(
        data.message ||
          `${data.successful || 0} bot başarıyla başvurdu, ${data.failed || 0} başarısız`
      );

      // Close modal after a short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Hackathon&apos;a Başvur
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {userIds.length} botu hackathonlara başvurt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error && !success ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{error}</div>
              </div>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium">{success}</div>
                </div>
              </div>
              {result && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sonuç Özeti:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Toplam: {result.total || 0} bot</p>
                    <p className="text-green-600 dark:text-green-400">
                      Başarılı: {result.successful || 0}
                    </p>
                    <p className="text-red-600 dark:text-red-400">Başarısız: {result.failed || 0}</p>
                    {result.teamsCreated && (
                      <p className="text-blue-600 dark:text-blue-400">
                        Oluşturulan Takımlar: {result.teamsCreated}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hackathon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hackathon Seçin *
                </label>
                {hackathons.length === 0 ? (
                  <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Rocket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Başvuru dönemi açık hackathon bulunamadı
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {hackathons.map((hackathon) => (
                      <button
                        key={hackathon.id}
                        onClick={() => setSelectedHackathonId(hackathon.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedHackathonId === hackathon.id
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 ${
                              selectedHackathonId === hackathon.id
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-400"
                            }`}
                          >
                            {selectedHackathonId === hackathon.id ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {hackathon.title}
                            </div>
                            {hackathon.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {hackathon.description}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Organizatör: {hackathon.organizer?.name || "Bilinmiyor"}
                              {hackathon.minTeamSize && hackathon.maxTeamSize && (
                                <> • Takım: {hackathon.minTeamSize}-{hackathon.maxTeamSize} kişi</>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Application Mode Selection */}
              {selectedHackathonId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Başvuru Modu *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setApplicationMode("solo")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        applicationMode === "solo"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Solo</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Her bot ayrı başvurur
                      </p>
                    </button>
                    <button
                      onClick={() => setApplicationMode("team")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        applicationMode === "team"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Takım</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Botlar takım kurar
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Team Size Configuration */}
              {selectedHackathonId && applicationMode === "team" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Takım Boyutu *
                  </label>
                  <input
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    min={selectedHackathon?.minTeamSize || 2}
                    max={selectedHackathon?.maxTeamSize || 10}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Takım boyutu"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Her takım {teamSize} bot içerecek. Toplam {userIds.length} bot{" "}
                    {Math.floor(userIds.length / parseInt(teamSize) || 1)} takım oluşturacak.
                    {selectedHackathon?.minTeamSize && selectedHackathon?.maxTeamSize && (
                      <>
                        {" "}
                        (Hackathon gereksinimi: {selectedHackathon.minTeamSize}-
                        {selectedHackathon.maxTeamSize} kişi)
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nasıl çalışır?</strong>
                  <br />
                  {applicationMode === "solo"
                    ? "Her bot için AI ile başvuru verileri (motivation, skills) üretilir ve hackathon'a başvuru yapılır."
                    : `Botlar rastgele ${teamSize} kişilik takımlara ayrılır. Her takım için bir başvuru oluşturulur ve botlar takım üyesi olarak eklenir.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !success && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button onClick={onClose} variant="outline" disabled={submitting}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                !selectedHackathonId ||
                (applicationMode === "team" && (!teamSize || parseInt(teamSize) < 2))
              }
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Başvuruluyor...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Başvur ({userIds.length} bot)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

