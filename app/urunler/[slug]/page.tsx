"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle, ArrowRight, Star, Zap, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const products: Record<string, {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  category: string;
  features: string[];
  color: string;
  planType: "TEMEL" | "PRO" | "VIP";
  popular?: boolean;
}> = {
  "temel-plan": {
    id: "temel-plan",
    name: "Temel Plan",
    price: 12000,
    period: "yıl",
    description: "Giriş seviyesi, temel özelliklere erişim",
    category: "Abonelik Planları",
    features: [
      "Ders erişimi (sınırlı kategoriler)",
      "Test çözme",
      "Canlı kodlama (temel seviye)",
      "Bugfix meydan okumaları (temel seviye)",
      "Yardımlaşma topluluklarına erişim",
      "Mülakat simülasyonu (sınırlı sayıda)",
      "ATS uyumlu CV oluşturma (temel şablonlar)",
      "Topluluk mentor desteği",
    ],
    color: "from-blue-500 to-cyan-500",
    planType: "TEMEL",
    popular: false,
  },
  "pro-plan": {
    id: "pro-plan",
    name: "Pro Plan",
    price: 15000,
    period: "yıl",
    description: "Tüm özelliklere erişim ve gelişmiş destek",
    category: "Abonelik Planları",
    features: [
      "Ders erişimi (tüm kategoriler)",
      "Test çözme (tüm kategoriler)",
      "Canlı kodlama (tüm seviyeler)",
      "Bugfix meydan okumaları (tüm seviyeler)",
      "Yardımlaşma toplulukları",
      "Mülakat simülasyonu (sınırsız)",
      "ATS uyumlu CV oluşturma (tüm şablonlar)",
      "Mentor desteği",
      "Kariyer planı oluşturma",
      "Freelancer projelere katılma",
      "Hackathonlara katılma",
      "Aylık ödülleri alma",
      "Anlaşmalı şirketlerde iş istihdam fırsatı",
      "Gelişmiş AI analiz raporları",
      "Öncelikli hackathon başvuruları",
      "Özel proje portföyü gösterimi",
      "İleri seviye sertifikalar",
    ],
    color: "from-purple-500 to-pink-500",
    planType: "PRO",
    popular: true,
  },
  "vip-plan": {
    id: "vip-plan",
    name: "VIP Plan",
    price: 30000,
    period: "yıl",
    description: "Premium özellikler ve kişisel destek",
    category: "Abonelik Planları",
    features: [
      "Pro planın tüm özellikleri",
      "Sınırsız bire bir mentor görüşmesi",
      "Özel mentor ataması (kişisel mentor)",
      "Kişiselleştirilmiş kariyer danışmanlığı",
      "7/24 öncelikli destek hattı",
      "Özel iş ilanlarına erişim (exclusive job board)",
      "Şirket ziyaretleri ve network etkinlikleri",
      "Kişisel kariyer koçu",
      "Özel proje danışmanlığı",
      "Özel içerik ve kaynaklara erişim",
      "Premium webinar'lara erişim",
      "Topluluk moderatörlüğü imkanı",
      "Öncelikli teknik destek",
      "Özel eğitim programlarına erişim",
    ],
    color: "from-yellow-500 to-orange-500",
    planType: "VIP",
    popular: false,
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const slug = params?.slug as string;
  const product = products[slug];
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Ürün bulunamadı</h1>
          <Button onClick={() => router.push("/urunler")}>
            Ürünlere Dön
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!session?.user) {
      router.push(`/login?redirect=/urunler/${slug}`);
      return;
    }

    setIsPurchasing(true);
    try {
      // Şimdilik fiyatlandırma sayfasına yönlendir
      // İleride ödeme sayfasına yönlendirilecek
      router.push(`/fiyatlandirma?plan=${product.planType}`);
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "TRY",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    "brand": {
      "@type": "Brand",
      "name": "YTK Academy"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <Navbar />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
                Ana Sayfa
              </Link>
              {" / "}
              <Link href="/urunler" className="hover:text-gray-900 dark:hover:text-gray-100">
                Ürünler
              </Link>
              {" / "}
              <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image/Icon */}
              <div>
                <Card className="p-8 text-center">
                  {product.popular && (
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit mx-auto">
                        <Star className="h-3 w-3 fill-current" />
                        En Popüler
                      </span>
                    </div>
                  )}
                  <div className={`w-32 h-32 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    {product.planType === "VIP" ? (
                      <Crown className="h-16 w-16 text-white" />
                    ) : product.planType === "PRO" ? (
                      <Zap className="h-16 w-16 text-white" />
                    ) : (
                      <CheckCircle className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">{product.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>
                  <div className="text-4xl font-display font-bold mb-2">
                    {product.price.toLocaleString("tr-TR")} TL
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">
                    / {product.period}
                  </div>
                </Card>
              </div>

              {/* Product Details */}
              <div>
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-display font-bold mb-4">Ürün Detayları</h2>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Kategori:</span>
                    <span className="ml-2 font-medium">{product.category}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fiyat:</span>
                    <span className="ml-2 font-medium">{product.price.toLocaleString("tr-TR")} TL / {product.period}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Plan Türü:</span>
                    <span className="ml-2 font-medium">{product.planType}</span>
                  </div>
                </Card>

                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-display font-bold mb-4">Özellikler</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  variant={product.popular ? "gradient" : "primary"}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      Satın Al
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

