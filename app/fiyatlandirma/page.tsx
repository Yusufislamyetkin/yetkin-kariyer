"use client";

import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Star, Zap, Crown, Loader2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";

const plans = [
  {
    name: "Temel",
    price: "12.000",
    period: "yıl",
    description: "Giriş seviyesi, temel özelliklere erişim",
    features: [
      "Ders erişimi (sınırlı kategoriler)",
      "Test çözme",
      "Canlı kodlama (temel seviye)",
      "Bugfix meydan okumaları (temel seviye)",
      "Yardımlaşma topluluklarına erişim",
      "Mülakat simülasyonu (sınırlı sayıda)",
      "ATS uyumlu CV oluşturma (temel şablonlar)",
      "Topluluk mentor desteği",
      "Kariyer planı oluşturma (temel)",
      "Freelancer projelere katılma (sınırlı erişim)",
      "Hackathonlara katılma",
      "Aylık ödülleri alma",
    ],
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    name: "Pro",
    price: "15.000",
    period: "yıl",
    description: "Tüm özelliklere erişim ve gelişmiş destek",
    features: [
      "Ders erişimi (tüm kategoriler)",
      "Test çözme",
      "Canlı kodlama (tüm seviyeler)",
      "Bugfix meydan okumaları (tüm seviyeler)",
      "Yardımlaşma toplulukları",
      "Mülakat simülasyonu (sınırsız)",
      "ATS uyumlu CV oluşturma (tüm şablonlar)",
      "Mentor desteği (topluluk)",
      "Kariyer planı oluşturma",
      "Freelancer projelere katılma",
      "Hackathonlara katılma",
      "Aylık ödülleri alma",
      "Gelişmiş AI analiz raporları",
      "Öncelikli hackathon başvuruları",
      "Özel proje portföyü gösterimi",
      "İleri seviye sertifikalar",
    ],
    color: "from-purple-500 to-pink-500",
    popular: true,
  },
  {
    name: "VIP",
    price: "30.000",
    period: "yıl",
    description: "Premium özellikler ve kişisel destek",
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
      "Ücretsiz sertifika yenileme",
      "Özel içerik ve kaynaklara erişim",
      "Premium webinar'lara erişim",
      "Topluluk moderatörlüğü imkanı",
      "Öncelikli teknik destek",
      "Özel eğitim programlarına erişim",
    ],
    color: "from-yellow-500 to-orange-500",
    popular: false,
  },
];

export default function FiyatlandirmaPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handlePurchasePlan = async (planType: "TEMEL" | "PRO" | "VIP") => {
    if (!session?.user) {
      router.push("/login?redirect=/fiyatlandirma");
      return;
    }

    try {
      setPurchasingPlan(planType);
      setPurchaseError(null);
      setPurchaseSuccess(false);

      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          durationMonths: 12, // 1 yıl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Abonelik oluşturulurken bir hata oluştu");
      }

      setPurchaseSuccess(true);
      // Başarılı olduktan sonra profil sayfasına yönlendir
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error: any) {
      console.error("[Fiyatlandirma] Purchase error:", error);
      setPurchaseError(error.message || "Abonelik oluşturulurken bir hata oluştu");
    } finally {
      setPurchasingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 relative w-full max-w-full overflow-x-hidden">
        <div className="text-center max-w-4xl mx-auto animate-fade-in w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer leading-tight">
            Fiyatlandırma
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium max-w-3xl mx-auto leading-relaxed">
            İhtiyacınıza uygun planı seçin ve kariyer yolculuğunuza başlayın
          </p>
        </div>
      </section>

      {/* Purchase Messages */}
      {purchaseError && (
        <section className="container mx-auto px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{purchaseError}</p>
            </div>
          </div>
        </section>
      )}
      {purchaseSuccess && (
        <section className="container mx-auto px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">
                Abonelik başarıyla oluşturuldu! Profil sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Plans */}
      <section className="container mx-auto px-4 py-12 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              variant="elevated"
              className={`relative p-8 h-full flex flex-col ${plan.popular ? 'ring-2 ring-purple-500 dark:ring-purple-400 scale-105 md:scale-110 lg:scale-105' : ''} transition-all duration-300 hover:shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  {plan.name === "VIP" ? (
                    <Crown className="h-8 w-8 text-white" />
                  ) : plan.name === "Pro" ? (
                    <Zap className="h-8 w-8 text-white" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                    TL / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
              {session?.user ? (
                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const planTypeMap: Record<string, "TEMEL" | "PRO" | "VIP"> = {
                      Temel: "TEMEL",
                      Pro: "PRO",
                      VIP: "VIP",
                    };
                    handlePurchasePlan(planTypeMap[plan.name] || "TEMEL");
                  }}
                  disabled={purchasingPlan !== null}
                >
                  {purchasingPlan === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      Planı Seç
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/register" className="block">
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Planı Seç
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-gray-800/30 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Sık Sorulan Sorular
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
      
            { 
              q: "Ödeme nasıl yapılır?", 
              a: "Ödemeler kredi kartı, banka kartı veya havale/EFT ile yapılabilir. Tüm ödemeler güvenli ödeme altyapısı üzerinden gerçekleştirilir." 
            },
            { 
              q: "Öğrenci indirimi var mı?", 
              a: "Evet, öğrenci belgesi ile %30 indirim hakkınız bulunmaktadır. Öğrenci belgenizi yükleyerek indirimden yararlanabilirsiniz." 
            },
            { 
              q: "Ödeme güvenliği nasıl sağlanıyor?", 
              a: "Tüm ödemeler SSL sertifikalı güvenli ödeme altyapısı üzerinden gerçekleştirilir. Kredi kartı bilgileriniz şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz." 
            },
            { 
              q: "Fiyatlar her şey dahil mi? Ek ödeme var mı?", 
              a: "Evet, tüm fiyatlar her şey dahildir. Platformdaki tüm özelliklere ek bir ücret ödemeden erişebilirsiniz. Abonelik süresi boyunca ek ödeme yapmanız gerekmez." 
            },
            { 
              q: "Abonelik sistemi nasıl çalışıyor?", 
              a: "Platform yıllık abonelik sistemi ile çalışmaktadır. Aboneliğiniz 1 yıl süreyle geçerlidir ve bu süre boyunca tüm özelliklere erişim sağlarsınız." 
            },
            { 
              q: "AI öğretmen ne yapıyor?", 
              a: "Platformumuzda eğitilmiş çeşitli AI modelleri bulunmaktadır: Canlı kodlama asistanı, bugfix asistanı, ders asistanı, test asistanı ve kariyer planlaması asistanı. Her biri kendi alanında uzmanlaşmış olup, tüm eğitim sürecinizde destek sağlamaktadır." 
            },
            { 
              q: "CV şablonları ATS uyumlu mu?", 
              a: "Evet, platformumuzda 20'den fazla ATS uyumlu profesyonel CV şablonu bulunmaktadır. Tüm şablonlar iş başvurularında kullanıma uygundur ve farklı sektörlere uygun tasarımlar içermektedir." 
            },
            { 
              q: "İş ilanlarına nasıl erişebilirim?", 
              a: "Platformumuzun anlaşmalı olduğu iş yerleri bulunmaktadır. Bu iş yerlerinde kariyer istihdamı sağlıyoruz ve özel iş ilanlarına erişim imkanı sunuyoruz. Pro ve VIP planlarda öncelikli erişim hakkınız bulunmaktadır." 
            },
            { 
              q: "Platform hangi yaş gruplarına uygun?", 
              a: "Platformumuz tüm yaş gruplarına uygundur. Öğrencilerden profesyonellere kadar herkes platformumuzdan faydalanabilir." 
            },
            { 
              q: "Başlangıç seviyesinde biri için uygun mu?", 
              a: "Evet, platformumuz başlangıç seviyesindeki kullanıcılar için özel olarak tasarlanmıştır. Temel plan ile başlayabilir, kendi hızınızda ilerleyebilir ve AI asistanlarımızın desteğiyle öğrenme sürecinizi kolaylaştırabilirsiniz." 
            },
          ].map((faq, index) => (
            <Card key={index} variant="elevated" className="p-6 animate-fade-in">
              <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 mb-3">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card
          variant="glass"
          className="p-12 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent md:animate-gradient-shift pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative z-10">
            Hemen Başlayın
          </h2>
          <p className="text-lg mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
            Size en uygun planı seçin ve kariyer yolculuğunuza bugün başlayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
              >
                Ücretsiz Kayıt Ol
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a 
              href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20fiyatlandırma%20hakkında%20bilgi%20almak%20istiyorum" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Daha Fazla Bilgi
              </Button>
            </a>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-700/50 glass mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/hakkimizda" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  Hakkında
                </Link>
                <Link href="/help" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  Yardım
                </Link>
                <Link href="/jobs/browse" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  İş Fırsatları
                </Link>
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  Gizlilik
                </Link>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  Koşullar
                </Link>
                <Link href="/locations" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  Konumlar
                </Link>
                <a href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20hakkında%20bilgi%20almak%20istiyorum" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  İletişim
                </a>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                &copy; 2025 YTK Academy
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
