"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import dynamic from "next/dynamic";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useState } from "react";
import { ArrowRight, Users, Target, Award, Sparkles, Menu, X } from "lucide-react";
import { StructuredData } from "@/app/components/StructuredData";

const ThemeToggleIcon = dynamic(
  () => import("@/app/components/ThemeToggle").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

function ThemeSwitchButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Temayı değiştir"
      className="rounded-lg bg-gray-100 p-2 transition hover:ring-2 hover:ring-blue-200 dark:bg-gray-800 dark:hover:ring-blue-500/40"
    >
      <ThemeToggleIcon />
    </button>
  );
}

export default function HakkimizdaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteUrl = "https://ytkacademy.com.tr";

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "YTK Academy Hakkında",
    description: "YTK Academy, Yusuf İslam Yetkin tarafından kurulmuş, yazılım geliştirme alanında kapsamlı eğitim ve kariyer platformudur.",
    url: `${siteUrl}/hakkimizda`,
    mainEntity: {
      "@type": "Organization",
      name: "YTK Academy",
      founder: {
        "@type": "Person",
        name: "Yusuf İslam Yetkin",
      },
      description: "Yazılım geliştirme alanında kapsamlı eğitim, sosyal ağ ve kariyer platformu.",
    },
  };

  return (
    <>
      <StructuredData data={aboutPageSchema} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50 w-full max-w-full">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-4 max-w-full overflow-x-hidden">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Link href="/" className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer">
              YTK Academy
            </Link>
            <div className="flex items-center gap-4">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <Link href="/hakkimizda" className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors">
                  Hakkımızda
                </Link>
                <Link href="/fiyatlandirma" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Fiyatlandırma
                </Link>
                <a 
                  href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20hakkında%20bilgi%20almak%20istiyorum" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  İletişim
                </a>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-lg bg-gray-100 p-2 transition hover:ring-2 hover:ring-blue-200 dark:bg-gray-800 dark:hover:ring-blue-500/40"
                aria-label="Menü"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              <ThemeSwitchButton />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">Kayıt Ol</Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
              <div className="flex flex-col gap-3">
                <Link 
                  href="/hakkimizda" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link 
                  href="/fiyatlandirma" 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fiyatlandırma
                </Link>
                <a 
                  href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20hakkında%20bilgi%20almak%20istiyorum" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  İletişim
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 relative w-full max-w-full overflow-x-hidden">
        <div className="text-center max-w-4xl mx-auto animate-fade-in w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer leading-tight">
            Hakkımızda
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium max-w-3xl mx-auto leading-relaxed">
            YTK Academy, <strong>Yusuf İslam Yetkin</strong> tarafından kurulmuş, yazılım geliştirme alanında kapsamlı eğitim, sosyal ağ ve kariyer platformudur.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="container mx-auto px-4 py-12">
        <Card variant="elevated" className="p-8 md:p-12 text-center max-w-3xl mx-auto">
          <div className="mb-6">
            <Users className="h-16 w-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              Kurucu
            </h2>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Yusuf İslam Yetkin
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              YTK Academy, yazılım geliştirme alanında kapsamlı eğitim ve kariyer desteği sunmak amacıyla kurulmuştur. 
              Platformumuz, öğrencilerin teknik becerilerini geliştirmelerine, toplulukla bağlantı kurmalarına ve 
              kariyer hedeflerine ulaşmalarına yardımcı olmak için tasarlanmıştır.
            </p>
          </div>
        </Card>
      </section>

      {/* Learning Journey Visual */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Öğrenme Yolculuğunuz
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Platformumuzun sunduğu kapsamlı öğrenme ve kariyer geliştirme süreci
          </p>
        </div>
        <Card variant="elevated" className="p-4 md:p-8 overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
            <Image
              src="/images/learning-journey.png"
              alt="Öğrenme Yolculuğu - YTK Academy İş Akışı"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
          </div>
        </Card>
      </section>

      {/* Platform Features Summary */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Platform Özellikleri
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Sparkles, title: "AI Destekli Öğrenme", desc: "Kişiselleştirilmiş öğrenme yolları ve AI asistan desteği" },
            { icon: Users, title: "Sosyal Ağ", desc: "Geliştiricilerle bağlantı kurun ve topluluk desteği alın" },
            { icon: Award, title: "Hackathonlar", desc: "Yarışmalara katılın, projeler geliştirin ve ödüller kazanın" },
            { icon: Target, title: "Kariyer Desteği", desc: "CV oluşturma, mülakat simülasyonu ve iş fırsatları" },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} variant="elevated" hover className="p-6 text-center group animate-fade-in">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </Card>
            );
          })}
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
            Yolculuğunuza Bugün Başlayın
          </h2>
          <p className="text-lg mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
            Topluluğa katılın, yeni beceriler öğrenin ve kariyerinizi bir sonraki seviyeye taşıyın
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
            <Link href="/fiyatlandirma">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Fiyatlandırmayı Gör
              </Button>
            </Link>
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
    </>
  );
}
