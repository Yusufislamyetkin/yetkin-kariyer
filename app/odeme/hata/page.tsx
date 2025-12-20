"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold mb-4">Ödeme Hatası</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin veya destek ekibimizle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fiyatlandirma">
                <Button size="lg" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Tekrar Dene
                </Button>
              </Link>
              <a 
                href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20ödeme%20hatası%20hakkında%20yardım%20almak%20istiyorum" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Destek Al
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

