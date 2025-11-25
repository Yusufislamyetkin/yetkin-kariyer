"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Calendar, Mail, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    role: string;
    createdAt: Date | string;
  };
  onUpdate?: () => void;
}

export function ProfileHeader({ user, onUpdate }: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editEmail, setEditEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);

  const getMembershipDate = () => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
    }
    return new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      candidate: "Aday",
      employer: "İşveren",
      admin: "Yönetici",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      candidate: "from-blue-500 to-cyan-500",
      employer: "from-purple-500 to-pink-500",
      admin: "from-yellow-500 to-orange-500",
    };
    return colorMap[role] || "from-gray-500 to-gray-600";
  };

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      const updateData: any = {};
      if (editName !== user.name) updateData.name = editName;
      if (editEmail !== user.email) updateData.email = editEmail;

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

      onUpdate?.();
      setShowEditModal(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Profil güncellenirken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <>
      <Card variant="glass" className="relative overflow-hidden particle-bg-tech">
        {/* Cover Image Area */}
        <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="px-6 pb-6 -mt-20 relative z-10">
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.name || user.email}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl font-bold text-white">
                    {initials}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-20 sm:pt-0">
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {user.name || user.email.split("@")[0]}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Üyelik: {getMembershipDate()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getRoleColor(
                      user.role
                    )} shadow-lg`}
                  >
                    <Shield className="w-4 h-4" />
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              <Button
                variant="gradient"
                onClick={() => {
                  setEditName(user.name || "");
                  setEditEmail(user.email);
                  setShowEditModal(true);
                }}
                className="w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Profili Düzenle
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="w-full max-w-md animate-scale-in">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Profili Düzenle
              </h2>
              <div className="space-y-4">
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
                    disabled={isUpdating}
                  >
                    İptal
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={handleProfileUpdate}
                    className="flex-1"
                    isLoading={isUpdating}
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

