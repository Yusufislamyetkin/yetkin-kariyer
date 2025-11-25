"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { X, Loader2, ImageIcon } from "lucide-react";
import { z } from "zod";

interface PostCreateProps {
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

export function PostCreate({ onClose, onSuccess, isModal = true }: PostCreateProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = session?.user as { name?: string; email?: string; profileImage?: string; id?: string } | undefined;
  const userName = user?.name || user?.email?.split("@")[0] || "U";
  const userInitial = userName[0].toUpperCase();
  const userProfileImage = user?.profileImage;

  const handleImageSelect = async (file: File) => {
    setImageFile(file);
    setError(null);

    // Upload image
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/post-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Görsel yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      
      // Validate that we received a valid URL
      if (!data.url || typeof data.url !== "string") {
        throw new Error("Görsel yükleme başarısız: Geçersiz URL alındı");
      }
      
      // Validate URL format
      try {
        new URL(data.url);
      } catch {
        throw new Error("Görsel yükleme başarısız: Geçersiz URL formatı");
      }
      
      setImageUrl(data.url);
    } catch (error: any) {
      setError(error.message || "Görsel yüklenirken bir hata oluştu");
      setImageFile(null);
      setImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side schema validation (Türkçe mesajlarla)
    const createPostSchema = z
      .object({
        content: z
          .string()
          .max(2200, "Mesaj en fazla 2200 karakter olabilir")
          .transform((v) => v.trim())
          .nullable()
          .optional(),
        imageUrl: z
          .union([z.string().url("Geçersiz görsel URL formatı").transform((v) => v.trim()), z.null()])
          .optional()
      })
      .refine((data) => (data.content && data.content.length > 0) || data.imageUrl, {
        message: "Lütfen bir mesaj yazın veya görsel ekleyin"
      });

    // Wait for image upload to complete
    if (imageFile && !imageUrl && isUploading) {
      setError("Lütfen görsel yüklenmesini bekleyin");
      return;
    }

    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        content: content ? content.trim() : "",
        imageUrl: imageUrl ?? null
      };
      const parsed = createPostSchema.safeParse(payload);
      if (!parsed.success) {
        const msg = parsed.error.errors[0]?.message ?? "Geçersiz veri";
        setError(msg);
        setIsSubmitting(false);
        return;
      }
      // Validate imageUrl if it exists
      let finalImageUrl: string | null = null;
      if (imageUrl) {
        // Ensure it's a valid URL string
        if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
          try {
            new URL(imageUrl);
            finalImageUrl = imageUrl.trim();
          } catch {
            setError("Geçersiz görsel URL formatı");
            setIsSubmitting(false);
            return;
          }
        }
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: payload.content || null,
          imageUrl: finalImageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gönderi oluşturulurken bir hata oluştu");
      }

      // Reset form state
      setContent("");
      setImageFile(null);
      setImageUrl(null);
      setError(null);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/social/feed");
      }
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Gönderi oluşturulurken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const postContent = (
    <div className={`${isModal ? 'bg-white dark:bg-black rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl' : 'w-full'}`}>
      {/* Header */}
      {isModal && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Gönderi Oluştur
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      )}

        {/* Content */}
        <form onSubmit={handleSubmit} className={`flex-1 overflow-y-auto flex flex-col ${isModal ? '' : 'min-h-[500px]'}`}>
          <div className={`flex-1 ${isModal ? 'p-6' : 'p-0'} space-y-4`}>
            {/* User info */}
            <div className="flex items-start gap-4">
              <div className={`${isModal ? 'w-10 h-10' : 'w-12 h-12'} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                {userProfileImage ? (
                  <Image
                    src={userProfileImage}
                    alt={userName}
                    width={isModal ? 40 : 48}
                    height={isModal ? 40 : 48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={isModal ? '' : 'text-lg'}>{userInitial}</span>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                {/* Text input - LinkedIn style */}
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Bir şey paylaşın..."
                  className={`${isModal ? 'min-h-[120px]' : 'min-h-[180px]'} resize-none text-base border border-gray-300 dark:border-gray-600 focus:ring-0 focus:shadow-none focus:!border-gray-400 dark:focus:!border-gray-500 p-0 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  maxLength={2200}
                  disabled={isSubmitting}
                />

                {/* Image preview */}
                {isUploading && imageFile && !imageUrl && (
                  <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="relative aspect-video w-full flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Görsel yükleniyor...</p>
                      </div>
                    </div>
                  </div>
                )}
                {imageUrl && (
                  <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="relative aspect-video w-full max-h-[400px]">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 600px"
                        unoptimized={imageUrl.includes('blob.vercel-storage.com')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                      disabled={isUploading || isSubmitting}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Character count */}
                {content.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {content.length}/2200
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Action buttons */}
          <div className={`border-t border-gray-200 dark:border-gray-800 ${isModal ? 'px-6 py-4' : 'pt-6 mt-6'}`}>
            <div className="flex items-center justify-between gap-4">
              {/* Image upload button */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  disabled={isUploading || isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      Fotoğraf
                    </>
                  )}
                </button>
              </div>

              {/* Submit button */}
              <div className="flex items-center gap-3">
                {onClose && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    İptal
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={(!content.trim() && !imageUrl) || isSubmitting || isUploading}
                  className="bg-[#0a66c2] hover:bg-[#004182] text-white dark:bg-[#0a66c2] dark:hover:bg-[#004182] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Paylaşılıyor...
                    </>
                  ) : (
                    "Paylaş"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        {content}
      </div>
    );
  }

  return postContent;
}
