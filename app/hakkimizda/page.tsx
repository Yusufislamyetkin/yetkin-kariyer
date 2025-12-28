"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { useState } from "react";
import { ArrowRight, Users, Target, Award, Sparkles, BookOpen, Code, MessageCircle, Trophy, TrendingUp, CheckCircle, Heart, Lightbulb, BarChart3, Clock } from "lucide-react";
import { StructuredData } from "@/app/components/StructuredData";
import Navbar from "@/app/components/Navbar";

export default function HakkimizdaPage() {

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
      <Navbar />

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
        <Card variant="elevated" className="p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              Kurucu
            </h2>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Yusuf İslam Yetkin
            </p>
          </div>
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed text-center">
              YTK Academy, yazılım geliştirme alanında kapsamlı eğitim ve kariyer desteği sunmak amacıyla kurulmuştur. 
              Platformumuz, öğrencilerin teknik becerilerini geliştirmelerine, toplulukla bağlantı kurmalarına ve 
              kariyer hedeflerine ulaşmalarına yardımcı olmak için tasarlanmıştır.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-900 dark:text-gray-100">Yusuf İslam Yetkin</strong>, yazılım geliştirme alanında 
              yılların deneyimini ve tutkusunu YTK Academy platformuna aktarmıştır. Teknoloji eğitimi ve kariyer geliştirme 
              konusundaki vizyonu ile, Türkiye&apos;deki yazılım geliştiricilerine en kaliteli eğitim içeriklerini sunmayı 
              ve onları gerçek dünya projeleriyle buluşturmayı hedeflemektedir.
            </p>
          </div>
        </Card>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card variant="elevated" className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                Misyonumuz
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Türkiye&apos;deki yazılım geliştiricilerine en kaliteli eğitim içeriklerini sunmak, onları gerçek dünya 
              projeleriyle buluşturmak ve kariyer gelişimlerini desteklemektir.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Her seviyeden geliştiricinin teknik becerilerini geliştirmesine, pratik deneyim kazanmasına ve 
              kariyer hedeflerine ulaşmasına yardımcı olmak için kapsamlı bir platform sunuyoruz.
            </p>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                Vizyonumuz
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Türkiye&apos;nin en kapsamlı yazılım geliştirme eğitim ve kariyer platformu olmak, binlerce geliştiricinin 
              kariyer yolculuğuna rehberlik etmek ve teknoloji sektöründe fark yaratan profesyoneller yetiştirmektir.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              AI destekli öğrenme, sosyal ağ, hackathon&apos;lar ve freelancer fırsatları ile entegre bir ekosistem 
              oluşturarak, öğrencilerimizin hem teknik hem de profesyonel gelişimlerini destekliyoruz.
            </p>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Değerlerimiz
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            YTK Academy olarak benimsediğimiz temel değerler
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Heart, title: "Öğrenci Odaklılık", desc: "Her öğrencinin başarısı bizim önceliğimizdir. Kişiselleştirilmiş öğrenme deneyimleri sunarak herkesin kendi hızında ilerlemesini sağlıyoruz." },
            { icon: Sparkles, title: "İnovasyon", desc: "Teknolojinin en güncel araçlarını kullanarak, AI destekli öğrenme ve interaktif içeriklerle eğitim deneyimini sürekli geliştiriyoruz." },
            { icon: Users, title: "Topluluk", desc: "Güçlü bir geliştirici topluluğu oluşturarak, öğrencilerimizin birbirinden öğrenmesini ve birlikte büyümesini destekliyoruz." },
            { icon: Award, title: "Kalite", desc: "Endüstri standartlarına uygun, güncel ve kapsamlı içerikler sunarak, öğrencilerimizin gerçek dünya projelerinde başarılı olmalarını sağlıyoruz." },
            { icon: Target, title: "Kariyer Odaklılık", desc: "Sadece eğitim değil, aynı zamanda kariyer gelişimi için gerekli tüm araçları (CV, mülakat pratiği, iş fırsatları) sunuyoruz." },
            { icon: CheckCircle, title: "Pratik Öğrenme", desc: "Teorik bilginin yanı sıra, canlı kodlama, bugfix meydan okumaları ve gerçek projelerle pratik deneyim kazandırıyoruz." },
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} variant="elevated" hover className="p-6 group animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-gray-100">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{value.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card variant="elevated" className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-700/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              Rakamlarla YTK Academy
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Platformumuzun büyümesi ve başarıları
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "25+", label: "Eğitim Modülü", icon: BookOpen },
              { number: "5400", label: "Ders İçeriği", icon: Code },
              { number: "7/24", label: "Erişim", icon: Clock },
              { number: "AI", label: "Destekli Öğrenme", icon: Sparkles },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Learning Approach Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Eğitim Yaklaşımımız
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Öğrencilerimizin başarısı için benimsediğimiz metodoloji
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Kapsamlı İçerik
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  5400+ ders içeriği ile 25+ farklı teknoloji alanında derinlemesine eğitim sunuyoruz. 
                  Her konu, başlangıç seviyesinden ileri seviyeye kadar adım adım işlenir.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  AI Destekli Öğrenme
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Yapay zeka teknolojisi ile öğrenme hızınızı analiz ediyor, size özel öneriler sunuyor 
                  ve kişiselleştirilmiş öğrenme yolları oluşturuyoruz.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Pratik Odaklı
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Canlı kodlama, bugfix meydan okumaları ve gerçek dünya projeleri ile teorik bilgiyi 
                  pratik deneyime dönüştürüyoruz.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Topluluk Desteği
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Mentor desteği, grup sohbetleri ve topluluk etkileşimi ile öğrenme yolculuğunuzda 
                  yalnız kalmıyorsunuz.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Community & Support Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Topluluk ve Destek
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Öğrenme yolculuğunuzda yanınızdayız
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Mentorluk Sistemi
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Kullanıcının ihtiyaçlarına göre özel yol haritası oluşturulur. 
                  AI destekli analiz ile kişiselleştirilmiş öğrenme yolu belirlenir ve 
                  bu yolculukta yalnız kalmazsınız.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Kullanıcının ihtiyaçlarına göre özel yol haritası oluşturma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>AI destekli kişiselleştirilmiş öğrenme yolu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>AI destekli performans analizi</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Sosyal Ağ ve Etkileşim
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Geliştiricilerle bağlantı kurun, haber akışını takip edin, grup sohbetlerine katılın ve 
                  topluluk desteği alın. Uzmanlık alanınıza göre gruplarda yer alarak benzer ilgi alanlarına 
                  sahip geliştiricilerle etkileşim kurabilirsiniz.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Haber akışı ve keşfet özellikleri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Uzmanlık alanına göre grup sohbetleri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Bağlantılar ve arkadaşlık sistemi</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Hackathon ve Yarışmalar
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Yeteneklerinizi sergileyin, takımlar kurun, projeler geliştirin ve ödüller kazanın. 
                  Hackathon&apos;lara katılarak gerçek dünya problemlerini çözme deneyimi kazanır ve 
                  derece kazancı sistemi ile başarılarınızı ödüllendirirsiniz.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Takım oluşturma ve proje geliştirme</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Ödüller ve rozetler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Derece kazancı sistemi</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
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
              src="/images/onboarding-career-journey.png"
              alt="YTK Akademi Onboarding ve Kariyer Yolculuğu"
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
                <Link href="/iade-politikasi" className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors">
                  İade Politikası
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
