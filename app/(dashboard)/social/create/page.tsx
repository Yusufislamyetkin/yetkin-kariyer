"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostCreate } from "@/app/components/social/PostCreate";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Yeni Gönderi Oluştur
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Paylaşmak istediğiniz içeriği oluşturun ve bağlantılarınızla paylaşın
            </p>
          </div>

          {/* Post Create Form */}
          <Card variant="elevated" className="rounded-2xl shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <PostCreate
                isModal={false}
                onSuccess={() => router.push("/social/feed")}
                onClose={() => router.back()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

