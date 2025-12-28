"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Crown,
  Loader2,
  ArrowLeft,
  CreditCard,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Shield,
  Lock,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";


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

type Step = "product" | "billing" | "payment";

// API'den gelecek şehir ve ilçe verilerinin tipi
interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  provinceId: number;
}

interface BillingData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const slug = params?.slug as string;
  const product = products[slug];
  const [step, setStep] = useState<Step>("product");
  const [billingData, setBillingData] = useState<BillingData>({
    fullName: "",
    email: session?.user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Türkiye",
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntegrationWarning, setShowIntegrationWarning] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Şehirleri API'den çek
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://api.turkiyeapi.dev/v1/provinces');
        const data = await response.json();
        if (data && data.data) {
          setCities(data.data);
        }
      } catch (error) {
        console.error('Şehirler yüklenirken hata:', error);
        // Fallback olarak basit bir liste
        setCities([
          { id: 34, name: "İstanbul" },
          { id: 6, name: "Ankara" },
          { id: 35, name: "İzmir" },
          { id: 7, name: "Antalya" },
          { id: 16, name: "Bursa" }
        ]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Şehir değiştiğinde ilçeleri çek
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!billingData.city) {
        setDistricts([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const selectedCity = cities.find(city => city.name === billingData.city);
        if (selectedCity) {
          const response = await fetch(`https://api.turkiyeapi.dev/v1/districts?provinceId=${selectedCity.id}`);
          const data = await response.json();
          if (data && data.data) {
            setDistricts(data.data);
          }
        }
      } catch (error) {
        console.error('İlçeler yüklenirken hata:', error);
        // Fallback olarak basit ilçeler
        const fallbackDistricts: Record<string, District[]> = {
          "İstanbul": [
            { id: 1, name: "Kadıköy", provinceId: 34 },
            { id: 2, name: "Beşiktaş", provinceId: 34 },
            { id: 3, name: "Üsküdar", provinceId: 34 }
          ],
          "Ankara": [
            { id: 4, name: "Çankaya", provinceId: 6 },
            { id: 5, name: "Keçiören", provinceId: 6 },
            { id: 6, name: "Mamak", provinceId: 6 }
          ]
        };
        setDistricts(fallbackDistricts[billingData.city] || []);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [billingData.city, cities]);

  // Türkçe validasyon mesajları için form elementlerini ayarla
  useEffect(() => {
    const setCustomValidityMessages = () => {
      const inputs = document.querySelectorAll('input[required], select[required]');
      inputs.forEach((input) => {
        const element = input as HTMLInputElement | HTMLSelectElement;

        element.addEventListener('invalid', (e) => {
          e.preventDefault();

          if (element.validity.valueMissing) {
            element.setCustomValidity('Bu alan zorunludur');
          } else if (element.validity.typeMismatch && element.type === 'email') {
            element.setCustomValidity('Geçerli bir e-posta adresi giriniz');
          } else if (element.validity.patternMismatch) {
            element.setCustomValidity('Geçersiz format');
          } else {
            element.setCustomValidity('');
          }
        });

        element.addEventListener('input', () => {
          element.setCustomValidity('');
        });
      });
    };

    // Sayfa yüklendiğinde çalıştır
    setTimeout(setCustomValidityMessages, 100);
  }, []);

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

  // Kart numarası maskeleme
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(" ").substring(0, 19);
  };

  // Kart tipi algılama
  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (cleaned.startsWith("5") || cleaned.startsWith("2")) return "Mastercard";
    if (cleaned.startsWith("9792")) return "Troy";
    return "";
  };

  // CVV maskeleme
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 3);
  };

  // Form validasyonu
  const validateBilling = () => {
    const newErrors: Record<string, string> = {};
    
    if (!billingData.fullName.trim()) {
      newErrors.fullName = "Ad Soyad gereklidir";
    }
    if (!billingData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }
    if (!billingData.phone.trim()) {
      newErrors.phone = "Telefon gereklidir";
    } else if (billingData.phone.length !== 10) {
      newErrors.phone = "Telefon numarası 10 haneli olmalıdır (5XX XXX XX XX)";
    }
    if (!billingData.addressLine1.trim()) {
      newErrors.addressLine1 = "Adres gereklidir";
    }
    if (!billingData.city.trim()) {
      newErrors.city = "Şehir gereklidir";
    }
    if (!billingData.district.trim()) {
      newErrors.district = "İlçe gereklidir";
    }
    if (!billingData.postalCode.trim()) {
      newErrors.postalCode = "Posta kodu gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, "");

    if (!cleanedCardNumber) {
      newErrors.cardNumber = "Kart numarası gereklidir";
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = "Kart numarası 16 haneli olmalıdır";
    }

    if (!paymentData.cardHolder.trim()) {
      newErrors.cardHolder = "Kart sahibi adı gereklidir";
    }

    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      newErrors.expiry = "Son kullanma tarihi gereklidir";
    } else {
      const month = parseInt(paymentData.expiryMonth);
      const year = parseInt("20" + paymentData.expiryYear);
      const now = new Date();
      const expiryDate = new Date(year, month - 1);
      
      if (month < 1 || month > 12) {
        newErrors.expiry = "Geçerli bir ay giriniz";
      } else if (expiryDate < now) {
        newErrors.expiry = "Kartın süresi dolmuş";
      }
    }

    if (!paymentData.cvv) {
      newErrors.cvv = "CVV gereklidir";
    } else if (paymentData.cvv.length !== 3) {
      newErrors.cvv = "CVV 3 haneli olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBilling()) {
      return;
    }

    // Eğer kullanıcı giriş yapmamışsa hesap oluştur
    if (!session?.user) {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/subscription/guest-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: billingData.email,
            name: billingData.fullName,
            planType: product.planType,
            durationMonths: 12,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Hesap oluşturma başarısız oldu");
        }

        // Başarılı olursa payment step'e geç
        setStep("payment");
      } catch (error: any) {
        console.error("[BILLING_SUBMIT] Error:", error);
        setErrors({ general: error.message || "Hesap oluşturma sırasında bir hata oluştu" });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Giriş yapmış kullanıcılar için direkt payment step'e geç
      setStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowIntegrationWarning(true);
    }, 1000);
  };

  const handlePurchase = () => {
    setStep("billing");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
        <Navbar />
        

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Step Indicator */}
            {step !== "product" && (
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`flex items-center gap-3 ${step === "billing" || step === "payment" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step === "billing" || step === "payment" 
                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      {step === "payment" ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                    </div>
                    <span className="hidden sm:block font-medium">Fatura Adresi</span>
                  </div>
                  <div className={`h-1 w-20 rounded-full transition-all ${
                    step === "payment" 
                      ? "bg-blue-600 dark:bg-blue-500" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                  <div className={`flex items-center gap-3 ${step === "payment" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step === "payment" 
                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      2
                    </div>
                    <span className="hidden sm:block font-medium">Ödeme</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className={step === "product" ? "lg:col-span-2" : "lg:col-span-3"}>
                {step === "product" && (
                  <div className="space-y-8">
                    {slug === "vip-plan" && (
                      <Card variant="elevated" className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-center gap-3">
                          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                          <span className="text-xl font-bold text-red-600 dark:text-red-400">Tükendi</span>
                        </div>
                        <p className="text-center text-sm text-red-700 dark:text-red-300 mt-2">
                          Bu plan şu anda satışta değildir.
                        </p>
                      </Card>
                    )}
                    <Card variant="elevated" className={`p-8 md:p-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-100 dark:border-blue-900/50 ${product.planType === "PRO" ? "max-w-5xl mx-auto" : ""} ${slug === "vip-plan" ? "opacity-75" : ""}`}>
                      <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {product.name}&apos;a Neler Dahil?
                        </h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/80 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card variant="elevated" className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Güvenli Ödeme</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tüm ödemeleriniz SSL sertifikalı güvenli ödeme altyapısı üzerinden gerçekleştirilir. 
                            Kredi kartı bilgileriniz şifrelenerek saklanır.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {step === "billing" && (
                  <Card variant="elevated" className="p-8 md:p-12 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-bold mb-1">Fatura Adresi</h2>
                        <p className="text-gray-600 dark:text-gray-400">Fatura bilgilerinizi giriniz</p>
                      </div>
                    </div>

                    <form onSubmit={handleBillingSubmit} className="space-y-6" noValidate>
                      {errors.general && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                          <p className="text-red-600 dark:text-red-400 font-medium">{errors.general}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Ad Soyad *"
                          value={billingData.fullName}
                          onChange={(e) => setBillingData({ ...billingData, fullName: e.target.value })}
                          error={errors.fullName}
                          placeholder="Adınız Soyadınız"
                          required
                        />
                        <Input
                          label="E-posta *"
                          type="email"
                          value={billingData.email}
                          onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                          error={errors.email}
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Telefon *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">+90</span>
                          </div>
                          <input
                            type="tel"
                            value={billingData.phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").substring(0, 10);
                              setBillingData({ ...billingData, phone: value });
                            }}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                            placeholder="5XX XXX XX XX"
                            maxLength={10}
                            required
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                        )}
                      </div>

                      <Input
                        label="Adres Satırı 1 *"
                        value={billingData.addressLine1}
                        onChange={(e) => setBillingData({ ...billingData, addressLine1: e.target.value })}
                        error={errors.addressLine1}
                        placeholder="Mahalle, Sokak, Bina No"
                        required
                      />

                      <Input
                        label="Adres Satırı 2"
                        value={billingData.addressLine2}
                        onChange={(e) => setBillingData({ ...billingData, addressLine2: e.target.value })}
                        placeholder="Daire No, Kat (Opsiyonel)"
                      />

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Şehir *
                          </label>
                          <select
                            value={billingData.city}
                            onChange={(e) => {
                              setBillingData({
                                ...billingData,
                                city: e.target.value,
                                district: "" // Şehir değiştiğinde ilçeyi sıfırla
                              });
                            }}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.city ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                            disabled={loadingCities}
                            required
                          >
                            <option value="">
                              {loadingCities ? "Yükleniyor..." : "Şehir Seçin"}
                            </option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İlçe *
                          </label>
                          <select
                            value={billingData.district}
                            onChange={(e) => setBillingData({ ...billingData, district: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.district ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                            disabled={!billingData.city || loadingDistricts}
                            required
                          >
                            <option value="">
                              {loadingDistricts ? "Yükleniyor..." : billingData.city ? "İlçe Seçin" : "Önce şehir seçin"}
                            </option>
                            {districts.map((district) => (
                              <option key={district.id} value={district.name}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                          {errors.district && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.district}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <Input
                          label="Posta Kodu *"
                          value={billingData.postalCode}
                          onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value.replace(/\D/g, "") })}
                          error={errors.postalCode}
                          placeholder="34000"
                          required
                        />
                      </div>

                      <Input
                        label="Ülke"
                        value={billingData.country}
                        disabled
                      />

                      <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("product")}
                          className="flex-1"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Geri
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          variant="gradient"
                        >
                          Devam Et
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {step === "payment" && (
                  <Card variant="elevated" className="p-8 md:p-12 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-bold mb-1">Ödeme Bilgileri</h2>
                        <p className="text-gray-600 dark:text-gray-400">Güvenli ödeme için kart bilgilerinizi giriniz</p>
                      </div>
                    </div>

                    {showIntegrationWarning && (
                      <div className="mb-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                              Ödeme Entegrasyonu Henüz Yapılmamıştır
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-400">
                              Ödeme altyapısı şu anda hazırlanmaktadır. Lütfen daha sonra tekrar deneyiniz veya destek ekibimizle iletişime geçiniz.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handlePaymentSubmit} className="space-y-6" noValidate>
                      <Input
                        label="Kart Numarası *"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }}
                        error={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />


                      <Input
                        label="Kart Sahibi Adı *"
                        value={paymentData.cardHolder}
                        onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value.toUpperCase() })}
                        error={errors.cardHolder}
                        placeholder="AD SOYAD"
                        required
                      />

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Son Kullanma Tarihi *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={paymentData.expiryMonth}
                              onChange={(e) => setPaymentData({ ...paymentData, expiryMonth: e.target.value })}
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.expiry ? "border-red-500" : ""
                              }`}
                              required
                            >
                              <option value="">Ay</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                  {String(i + 1).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                            <select
                              value={paymentData.expiryYear}
                              onChange={(e) => setPaymentData({ ...paymentData, expiryYear: e.target.value })}
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.expiry ? "border-red-500" : ""
                              }`}
                              required
                            >
                              <option value="">Yıl</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <option key={year} value={String(year).slice(-2)}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          {errors.expiry && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiry}</p>
                          )}
                        </div>

                        <Input
                          label="CVV *"
                          type="password"
                          value={paymentData.cvv}
                          onChange={(e) => {
                            const formatted = formatCVV(e.target.value);
                            setPaymentData({ ...paymentData, cvv: formatted });
                          }}
                          error={errors.cvv}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>

                      <Card variant="elevated" className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-100 dark:border-blue-900/50 shadow-xl">
                        <div className="text-center">
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                              Toplam Tutar
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {product.price.toLocaleString("tr-TR")}
                            </span>
                            <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2">
                              TL
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.period.charAt(0).toUpperCase() + product.period.slice(1)} boyunca geçerlidir
                          </div>
                        </div>
                      </Card>

                      <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("billing")}
                          className="flex-1"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Geri
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          variant="gradient"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              İşleniyor...
                            </>
                          ) : (
                            <>
                              Öde
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}
              </div>

              {/* Product Purchase Sidebar */}
              {step === "product" && (
                <div className="lg:col-span-1">
                  <Card variant="elevated" className="p-6 sticky top-24 border-2 border-gray-100 dark:border-gray-800">
                    <div className="text-center mb-6">
                      <div className="mb-6">
                        <div className="text-4xl font-display font-bold mb-1">
                          {product.price.toLocaleString("tr-TR")}
                        </div>
                        <div className="text-base text-gray-600 dark:text-gray-400">
                          TL / {product.period}
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full mb-6"
                        onClick={handlePurchase}
                        variant={product.popular ? "gradient" : "primary"}
                        disabled={slug === "vip-plan"}
                      >
                        {slug === "vip-plan" ? "Tükendi" : "Hemen Satın Al"}
                        {slug !== "vip-plan" && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                      {slug === "vip-plan" && (
                        <p className="text-sm text-center text-red-600 dark:text-red-400 mb-4">
                          Bu plan şu anda satışta değildir.
                        </p>
                      )}


                      <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
                          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                              Güvenli Ödeme
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              SSL sertifikalı güvenli ödeme altyapısı
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                              Anında Aktivasyon
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Ödeme sonrası hemen erişim
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
                          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                              {product.period} Boyunca Geçerli
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Abonelik süresi boyunca tüm özelliklere erişim
                            </div>
                          </div>
                        </div>





                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-100 dark:border-violet-800/50">
                          <Lock className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                              Güncel İçerikler
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Sürekli güncellenen eğitim materyalleri
                            </div>
                          </div>
                        </div>

                        {product.planType === "PRO" && (
                          <>
                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-100 dark:border-orange-800/50">
                              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                                  Sınırsız Erişim
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Tüm içeriklere sınırsız erişim hakkı
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                              <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                                  7/24 Destek
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Her zaman yanınızdayız
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-100 dark:border-teal-800/50">
                              <Crown className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                                  Premium İçerikler
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Özel ve güncel eğitim içerikleri
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg border border-rose-100 dark:border-rose-800/50">
                              <Star className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                                  Sertifika Sistemi
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Tamamladığınız kurslar için sertifika
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
