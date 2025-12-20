"use client";

import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Navbar from "@/app/components/Navbar";
import { CheckCircle, Star, Zap, Crown, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

const products = [
  {
    slug: "temel-plan",
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
  {
    slug: "pro-plan",
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
  {
    slug: "vip-plan",
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
];

const categories = [
  { id: "all", name: "Tümü" },
  { id: "subscription", name: "Abonelik Planları" },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            Ana Sayfa
          </Link>
          {" / "}
          <span className="text-gray-900 dark:text-gray-100">Ürünler</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Ürünlerimiz
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kariyerinizi geliştirmek için ihtiyacınız olan tüm hizmetler
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <Card key={product.slug} variant="elevated" className="p-6 hover:shadow-xl transition-shadow h-full flex flex-col">
              {product.popular && (
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                    <Star className="h-3 w-3 fill-current" />
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mx-auto mb-4`}>
                {product.planType === "VIP" ? (
                  <Crown className="h-8 w-8 text-white" />
                ) : product.planType === "PRO" ? (
                  <Zap className="h-8 w-8 text-white" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-white" />
                )}
              </div>
              
              <h3 className="text-xl font-display font-bold mb-2 text-center">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">{product.description}</p>
              
              <div className="text-center mb-4">
                <span className="text-3xl font-display font-bold">{product.price.toLocaleString("tr-TR")} TL</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">/ {product.period}</span>
              </div>
              
              <ul className="space-y-2 mb-6 flex-grow">
                {product.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {product.features.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400">
                    +{product.features.length - 3} özellik daha
                  </li>
                )}
              </ul>
              
              <Link href={`/urunler/${product.slug}`}>
                <Button className="w-full" variant={product.popular ? "gradient" : "outline"}>
                  Detayları Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

