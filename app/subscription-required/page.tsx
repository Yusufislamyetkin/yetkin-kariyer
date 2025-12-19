"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";

export default function SubscriptionRequiredPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [backUrl, setBackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Get referrer from document.referrer or sessionStorage
    const referrer = document.referrer || sessionStorage.getItem("subscriptionRedirectReferrer");
    
    // Only allow internal navigation (same origin)
    if (referrer && typeof window !== "undefined") {
      try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(window.location.href);
        
        // Check if referrer is from same origin and not the subscription-required page itself
        if (referrerUrl.origin === currentUrl.origin && !referrerUrl.pathname.includes("/subscription-required")) {
          setBackUrl(referrer);
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    }

    // Clean up sessionStorage after reading
    sessionStorage.removeItem("subscriptionRedirectReferrer");
  }, [status, router]);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      // Fallback to dashboard or home
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin dark:border-blue-400"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Abone Değilsiniz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            Lütfen bir abonelik planı seçin
          </p>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Bu özelliği kullanabilmek için aktif bir aboneliğe ihtiyacınız var. 
            Size uygun planı seçerek hemen başlayabilirsiniz.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Abonelik ile erişebileceğiniz özellikler:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Ders erişimi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Test çözme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Case çözme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Yardımlaşma toplulukları</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Mülakat simülasyonu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>ATS uyumlu CV oluşturma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Kariyer planı oluşturma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Freelancer projelere katılma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Hackathonlara katılma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Aylık ödülleri alma</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fiyatlandirma" className="block">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                Abonelik Planlarını Görüntüle
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              Geri Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
