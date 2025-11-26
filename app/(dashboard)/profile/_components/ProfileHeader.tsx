"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Edit, Calendar, Mail, Shield, Camera, X } from "lucide-react";
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'ı aşamaz");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Görsel yüklenemedi");
      }

      const data = await response.json();

      // Update profile with new image URL
      const updateResponse = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: data.url }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Profil güncellenemedi");
      }

      onUpdate?.();
      setPreviewImage(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || "Görsel yüklenirken bir hata oluştu");
      setPreviewImage(null);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

  const displayImage = previewImage || user.profileImage;

  return (
    <>
      <Card variant="glass" className="relative overflow-hidden particle-bg-tech">
        {/* Cover Image Area */}
        <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="px-6 pb-6 -mt-20 relative z-10">
          {/* Backdrop overlay for better text readability */}
          <div className="absolute inset-0 -mt-6 -mx-6 bg-white/60 dark:bg-gray-900/70 backdrop-blur-sm rounded-b-xl" />
          
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                {displayImage ? (
                  <Image
                    src={displayImage}
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
              
              {/* Image Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Profil görselini değiştir"
              >
                {isUploadingImage ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-20 sm:pt-0">
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 drop-shadow-sm">
                    {user.name || user.email.split("@")[0]}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Profili Düzenle
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
