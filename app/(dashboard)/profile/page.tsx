/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [gamiSummary, setGamiSummary] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status, router]);

  const fetchProfileData = async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    try {
      setError(null);
      if (!silent) {
        setLoading(true);
      }
      const userId = (session?.user as any)?.id as string | undefined;

      if (!userId || typeof userId !== 'string') {
        console.error("User ID is not available");
        setError("Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      // Fetch user profile details
      try {
        const profileResponse = await fetch(`/api/profile/${userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileUser(profileData.user || null);
        } else {
          console.warn("Failed to fetch profile:", profileResponse.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }

      // Fetch gamification summary
      try {
        const gamiResp = await fetch("/api/gamification/me/summary");
        if (gamiResp.ok) {
          const gami = await gamiResp.json();
          setGamiSummary(gami);
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Profil verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProfileData();
            }}
            variant="gradient"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  const sessionUser = session?.user as any;
  const displayUser = {
    id: profileUser?.id ?? sessionUser?.id ?? "",
    name: profileUser?.name ?? sessionUser?.name ?? "",
    email: profileUser?.email ?? sessionUser?.email ?? "",
    role: profileUser?.role ?? sessionUser?.role ?? "Aday",
    createdAt: profileUser?.createdAt ?? sessionUser?.createdAt ?? new Date(),
  };

  const userRole = displayUser.role || "Aday";

  // Get membership date
  const getMembershipDate = () => {
    if (displayUser.createdAt) {
      const date = new Date(displayUser.createdAt);
      return date.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
    }
    return new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  };

  // Initialize edit form when modal opens
  const handleEditClick = () => {
    setEditName(displayUser.name || "");
    setEditEmail(displayUser.email || "");
    setShowEditModal(true);
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updateData: any = {};
      if (editName !== displayUser.name) updateData.name = editName;
      if (editEmail !== displayUser.email) updateData.email = editEmail;

      if (Object.keys(updateData).length === 0) {
        setShowEditModal(false);
        return;
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Profil güncellenemedi");
      }

      await fetchProfileData({ silent: true });
      setShowEditModal(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Profil güncellenirken bir hata oluştu");
    }
  };

  return (
    <main className="p-4 lg:p-6">
      {/* User Info Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{displayUser.name || "Kullanıcı"}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-1">{displayUser.email}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-1">{userRole}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Üyelik: {getMembershipDate()}</p>
        <Button onClick={handleEditClick} variant="gradient">
          <Edit className="h-4 w-4 mr-2" />
          Profili Düzenle
        </Button>
      </div>

      {/* Stats Section */}
      <div className="mb-6 space-y-2">
        <div>
          <span className="font-semibold">{gamiSummary?.level ?? 1}</span> SEVİYE
        </div>
        <div>
          <span className="font-semibold">{gamiSummary?.points ?? 0}</span> PUAN
        </div>
        <div>
          <span className="font-semibold">{gamiSummary?.streak?.current ?? 0}</span> GÜNLÜK STREAK
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Kişisel Bilgiler</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">İSİM</span> {displayUser.name || "Belirtilmemiş"}
          </div>
          <div>
            <span className="font-semibold">EMAİL</span> {displayUser.email}
          </div>
          <div>
            <span className="font-semibold">ROL</span> {userRole}
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Hesap</h2>
        <p className="text-gray-600 dark:text-gray-400">Hesap ayarları burada görüntülenecek.</p>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Profili Düzenle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="İsim"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="İsminizi girin"
              />
              <Input
                label="Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email adresinizi girin"
              />
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleProfileUpdate}
                  className="flex-1"
                >
                  Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
