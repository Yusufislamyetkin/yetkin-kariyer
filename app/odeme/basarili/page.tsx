"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold mb-4">Ödeme Başarılı!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Aboneliğiniz başarıyla oluşturuldu. Artık platformun tüm özelliklerine erişebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Dashboard&apos;a Git
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Profilimi Gör
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

