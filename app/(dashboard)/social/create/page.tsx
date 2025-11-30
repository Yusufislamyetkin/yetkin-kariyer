"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostCreate } from "@/app/components/social/PostCreate";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/social/feed">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Yeni Gönderi Oluştur
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Fotoğraf, video veya metin paylaşın
              </p>
            </div>
          </div>

          {/* Post Create Form - Full width card matching feed style */}
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <PostCreate
              isModal={false}
              onSuccess={() => router.push("/social/feed")}
              onClose={() => router.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

