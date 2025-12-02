"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { X, Loader2, ImageIcon } from "lucide-react";
import { z } from "zod";
import { useBadgeNotificationHandler } from "@/hooks/useBadgeNotificationHandler";
import { useStrikeCompletionCheck } from "@/hooks/useStrikeCompletionCheck";

interface PostCreateProps {
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

export function PostCreate({ onClose, onSuccess, isModal = true }: PostCreateProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { handleBadgeResults } = useBadgeNotificationHandler();
  const { checkStrikeCompletion } = useStrikeCompletionCheck();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = session?.user as { name?: string; email?: string; profileImage?: string; id?: string } | undefined;
  const userName = user?.name || "Kullanıcı";
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

    // Wait for upload to complete
    if (imageFile && !imageUrl) {
      if (isUploading) {
        setError("Lütfen yüklenmesini bekleyin");
        return;
      }
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
      // Validate URLs if they exist
      let finalImageUrl: string | null = null;
      
      if (imageUrl) {
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

      const data = await response.json();
      
      // Check for badge results and show notification
      if (data.badgeResults) {
        handleBadgeResults(data.badgeResults);
      }

      // Check if strike was completed after post creation
      checkStrikeCompletion();

      // Reset form state
      setContent("");
      setImageFile(null);
      setImageUrl(null);
      setError(null);
      
      // Clear file inputs
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
    <div 
      className={`${isModal ? 'bg-white dark:bg-black rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl' : 'w-full'}`}
      onClick={(e) => e.stopPropagation()}
    >
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
        <form onSubmit={handleSubmit} className={`flex-1 overflow-y-auto flex flex-col ${isModal ? '' : 'min-h-[600px]'}`}>
          <div className={`flex-1 ${isModal ? 'p-6' : 'p-6 sm:p-8'} space-y-6`}>
            {/* User info */}
            <div className="flex items-start gap-4">
              <div className={`${isModal ? 'w-10 h-10' : 'w-12 h-12'} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700`}>
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
                {/* Text input */}
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Bir şey paylaşın... (Fotoğraf veya metin)"
                  className={`${isModal ? 'min-h-[120px]' : 'min-h-[200px]'} resize-none text-base border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 ${isModal ? 'p-4' : 'p-4 sm:p-5'} placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl`}
                  maxLength={2200}
                  disabled={isSubmitting}
                />

                {/* Image preview */}
                {isUploading && imageFile && !imageUrl && (
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="relative aspect-video w-full flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Görsel yükleniyor...</p>
                      </div>
                    </div>
                  </div>
                )}
                {imageUrl && (
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="relative aspect-video w-full max-h-[500px]">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 800px"
                        unoptimized={imageUrl.includes('blob.vercel-storage.com')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10 backdrop-blur-sm"
                      disabled={isUploading || isSubmitting}
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Character count */}
                {content.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right font-medium">
                    {content.length}/2200
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Action buttons */}
          <div className={`border-t-2 border-gray-200 dark:border-gray-800 ${isModal ? 'px-6 py-4' : 'px-6 sm:px-8 py-5'}`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Media upload buttons */}
              <div className="flex items-center gap-3">
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
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                >
                  {isUploading && imageFile ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" />
                      <span>Fotoğraf</span>
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
                    size="lg"
                  >
                    İptal
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={(!content.trim() && !imageUrl) || isSubmitting || isUploading}
                  size="lg"
                  className="bg-[#0095f6] hover:bg-[#1877f2] text-white dark:bg-[#0095f6] dark:hover:bg-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => {
          // Close modal when clicking on overlay (not on modal content)
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        {postContent}
      </div>
    );
  }

  return postContent;
}
