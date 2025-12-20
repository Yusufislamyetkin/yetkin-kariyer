"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const productSlug = searchParams.get("product");
  const planType = searchParams.get("plan");
  const [loading, setLoading] = useState(false);

  // Remove authentication requirement for payment page
  // Users can now purchase without being logged in

  const handlePayment = async () => {
    if (!productSlug && !planType) {
      return;
    }

    setLoading(true);
    try {
      // Şimdilik fiyatlandırma sayfasına yönlendir
      // İleride İyzico entegrasyonu burada yapılacak
      router.push(`/fiyatlandirma?plan=${planType || 'TEMEL'}`);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <CreditCard className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h1 className="text-3xl font-display font-bold mb-2">Ödeme</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Güvenli ödeme işlemi için hazırlanıyoruz
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Ödeme altyapısı şu anda hazırlanmaktadır. Lütfen fiyatlandırma sayfasından 
                  abonelik planınızı seçin.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handlePayment}
                disabled={loading || (!productSlug && !planType)}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    Fiyatlandırma Sayfasına Git
                  </>
                )}
              </Button>

              <Link href="/urunler">
                <Button variant="outline" className="w-full" size="lg">
                  Ürünlere Dön
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

