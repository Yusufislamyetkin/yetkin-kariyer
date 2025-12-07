"use client";

import { useEffect, useState } from "react";
import { Trophy, Award, Briefcase, TrendingUp, Calendar, DollarSign, RefreshCw, AlertCircle, Wallet, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { BottomSheet } from "@/app/components/ui/BottomSheet";
import { Input } from "@/app/components/ui/Input";

interface EarningsItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: "hackathon" | "leaderboard" | "freelancer";
}

interface EarningsData {
  total: number;
  breakdown: {
    hackathon: {
      total: number;
      count: number;
      items: EarningsItem[];
    };
    leaderboard: {
      total: number;
      count: number;
      items: EarningsItem[];
    };
    freelancer: {
      total: number;
      count: number;
      items: EarningsItem[];
    };
  };
  allItems: EarningsItem[];
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string | null; iban: string | null } | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferFormData, setTransferFormData] = useState({
    fullName: "",
    iban: "",
  });
  const [transferError, setTransferError] = useState<string | null>(null);

  useEffect(() => {
    fetchEarnings();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/profile/update");
      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          name: data.user?.name || null,
          iban: data.user?.iban || null, // IBAN alanı henüz yok, sonra ekleyeceğiz
        });
        if (data.user?.name) {
          setTransferFormData((prev) => ({
            ...prev,
            fullName: data.user.name,
          }));
        }
        if (data.user?.iban) {
          setTransferFormData((prev) => ({
            ...prev,
            iban: data.user.iban,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/earnings");
      const data = await response.json();

      if (response.ok) {
        setEarnings(data.earnings);
      } else {
        setError(data.error || "Kazanç verileri yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      setError("Kazanç verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferClick = async () => {
    if (!earnings) return;

    // Check if balance is 0
    if (earnings.total === 0) {
      setTransferError("Henüz bir kazanç elde etmediniz");
      setShowTransferModal(true);
      return;
    }

    // Check if user has name and IBAN
    const hasName = userInfo?.name && userInfo.name.trim() !== "";
    const hasIban = userInfo?.iban && userInfo.iban.trim() !== "";

    if (!hasName || !hasIban) {
      // Show modal to collect missing information
      setShowTransferModal(true);
      setTransferError(null);
      return;
    }

    // Proceed with transfer
    await processTransfer(userInfo.name!, userInfo.iban!);
  };

  const processTransfer = async (fullName: string, iban: string) => {
    try {
      setTransferLoading(true);
      setTransferError(null);

      const response = await fetch("/api/earnings/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          iban,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Başarılı! ${data.amount} ₺ hesabınıza aktarılıyor.`);
        setShowTransferModal(false);
        // Refresh user info and earnings (IBAN is already saved in transfer API)
        await fetchUserInfo();
        fetchEarnings();
      } else {
        if (data.error === "AD_SOYAD_REQUIRED" || data.error === "IBAN_REQUIRED") {
          setShowTransferModal(true);
          setTransferError(data.message);
        } else if (data.error === "ZERO_BALANCE") {
          setTransferError(data.message);
          setShowTransferModal(false);
        } else {
          setTransferError(data.message || "Transfer işlemi sırasında bir hata oluştu");
        }
      }
    } catch (error) {
      console.error("Error processing transfer:", error);
      setTransferError("Transfer işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setTransferLoading(false);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferFormData.fullName || transferFormData.fullName.trim() === "") {
      setTransferError("Lütfen ad ve soyad bilgilerinizi giriniz");
      return;
    }

    if (!transferFormData.iban || transferFormData.iban.trim() === "") {
      setTransferError("Lütfen IBAN bilginizi giriniz");
      return;
    }

    // Save name and IBAN to profile first
    try {
      await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: transferFormData.fullName,
          iban: transferFormData.iban.replace(/\s/g, "").toUpperCase(),
        }),
      });
      // Refresh user info
      await fetchUserInfo();
    } catch (error) {
      console.error("Error saving profile:", error);
    }

    // Update user info with new data and proceed with transfer
    await processTransfer(transferFormData.fullName, transferFormData.iban);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return Trophy;
      case "leaderboard":
        return Award;
      case "freelancer":
        return Briefcase;
      default:
        return DollarSign;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hackathon":
        return "Hackathon";
      case "leaderboard":
        return "Ayın 1.&apos;si";
      case "freelancer":
        return "Freelancer";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hackathon":
        return "from-purple-500 to-pink-500";
      case "leaderboard":
        return "from-yellow-500 to-orange-500";
      case "freelancer":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Kazanç verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !earnings) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto w-full max-w-full overflow-x-hidden">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Kazanç Analizi
          </h1>
        </div>
        <Card variant="elevated" className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Veriler Yüklenemedi
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error || "Kazanç verileri yüklenirken bir hata oluştu"}
                </p>
                <Button
                  onClick={fetchEarnings}
                  variant="gradient"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tekrar Dene
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Kazanç Analizi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Tüm kazançlarınızı görüntüleyin ve analiz edin
          </p>
        </div>
        <Button
          onClick={handleTransferClick}
          variant="gradient"
          size="sm"
          className="gap-2"
          disabled={loading || transferLoading || (earnings?.total === 0)}
        >
          <Wallet className="h-4 w-4" />
          Kazancı Hesabıma Aktar
        </Button>
      </div>

      {/* Total Earnings */}
      <Card variant="elevated" className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Toplam Kazanç</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {earnings.total.toLocaleString("tr-TR")} ₺
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-full overflow-x-hidden">
        <Card variant="elevated" className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span>Hackathon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {earnings.breakdown.hackathon.total.toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
              {earnings.breakdown.hackathon.count} ödül
            </p>
            <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Hackathon yarışmalarında kazandığınız ödüller ve kazançlarınız burada görüntülenir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-md">
                <Award className="h-5 w-5 text-white" />
              </div>
              <span>Ayın 1.&apos;si</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {earnings.breakdown.leaderboard.total.toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
              {earnings.breakdown.leaderboard.count} ödül
            </p>
            <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Aylık liderlik tablosunda birinci olduğunuzda kazandığınız ödüller burada görüntülenir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span>Freelancer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {earnings.breakdown.freelancer.total.toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
              {earnings.breakdown.freelancer.count} proje
            </p>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Freelancer projelerinde tamamladığınız işlerden kazandığınız gelirler burada görüntülenir.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Earnings List */}
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl">Tüm Kazançlar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {earnings.allItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Henüz kazanç yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Hackathon&apos;lara katılarak, liderlik tablosunda yer alarak veya freelancer projelerinde çalışarak kazanç elde edebilirsiniz
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {earnings.allItems.map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                            {getTypeLabel(item.type)}
                          </span>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.date).toLocaleDateString("tr-TR", { 
                              day: "numeric", 
                              month: "long", 
                              year: "numeric" 
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{item.amount.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <BottomSheet
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferError(null);
        }}
        title="Kazancı Hesabıma Aktar"
      >
        <div className="space-y-6">
          {earnings && earnings.total === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Henüz bir kazanç elde etmediniz
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hackathon&apos;lara katılarak, liderlik tablosunda yer alarak veya freelancer projelerinde çalışarak kazanç elde edebilirsiniz.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aktarılacak Tutar</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {earnings?.total.toLocaleString("tr-TR")} ₺
                </p>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <Input
                  label="Ad Soyad"
                  type="text"
                  placeholder="Adınız ve Soyadınız"
                  value={transferFormData.fullName}
                  onChange={(e) =>
                    setTransferFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  required
                  error={
                    transferError && transferError.includes("ad") ? transferError : undefined
                  }
                />

                <Input
                  label="IBAN"
                  type="text"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  value={transferFormData.iban}
                  onChange={(e) =>
                    setTransferFormData((prev) => ({
                      ...prev,
                      iban: e.target.value.toUpperCase().replace(/\s/g, ""),
                    }))
                  }
                  required
                  maxLength={26}
                  error={
                    transferError && transferError.includes("IBAN") ? transferError : undefined
                  }
                  helperText="IBAN numaranızı boşluk olmadan giriniz"
                />

                {transferError && !transferError.includes("ad") && !transferError.includes("IBAN") && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{transferError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferError(null);
                    }}
                    className="flex-1"
                    disabled={transferLoading}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="flex-1"
                    disabled={transferLoading}
                    isLoading={transferLoading}
                  >
                    Aktar
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

