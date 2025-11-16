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
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl sm:text-3xl">Yeni Gönderi Oluştur</CardTitle>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Paylaşmak istediğiniz içeriği oluşturun ve bağlantılarınızla paylaşın
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Post Create Form */}
      <Card variant="elevated">
        <CardContent className="p-4 sm:p-6">
          <PostCreate
            onSuccess={() => router.push("/social/feed")}
            onClose={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

