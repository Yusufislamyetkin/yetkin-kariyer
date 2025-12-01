"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, FileText, Sparkles, TrendingUp, Users, Zap, CheckCircle, Award, Clock, Target, BarChart3, MessageSquare, HelpCircle, ArrowRight, Star, PlayCircle, Shield, Globe, Trophy, Code, Bug, Handshake, DollarSign, MessageCircle, Compass, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import dynamic from "next/dynamic";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [categoryLessonCounts, setCategoryLessonCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  useEffect(() => {
    // Fetch category lesson counts
    fetch("/api/courses/category-lesson-counts")
      .then((res) => res.json())
      .then((data) => {
        if (data.categoryCounts) {
          setCategoryLessonCounts(data.categoryCounts);
        }
        setIsLoadingCounts(false);
      })
      .catch((error) => {
        console.error("Error fetching category lesson counts:", error);
        setIsLoadingCounts(false);
      });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Eğitim Modülü",
      description:
        "Teknik bilgi ve becerilerinizi geliştirin, testlerle öğrenmenizi pekiştirin ve AI tarafından kişiselleştirilmiş dersler alın.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Video,
      title: "Mülakat Simülasyonu",
      description:
        "Güvenli ve tam ekran ortamda gerçekçi mülakat deneyimleri yaşayın. AI performans analizi ile detaylı geri bildirim alın.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "CV Oluşturma",
      description:
        "ATS uyumlu profesyonel CV&apos;ler oluşturun, farklı şablonlar seçin ve iş ilanlarına doğrudan başvurun.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageCircle,
      title: "Sosyal Ağ ve Topluluk",
      description:
        "Diğer geliştiricilerle bağlantı kurun, haber akışını takip edin, grup sohbetlerine katılın ve topluluk desteği alın.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Trophy,
      title: "Hackathon ve Yarışmalar",
      description:
        "Yeteneklerinizi sergileyin, takımlar kurun, projeler geliştirin ve ödüller kazanın. Derece kazancı ile başarılarınızı ödüllendirin.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Handshake,
      title: "Freelancer Fırsatları",
      description:
        "Gerçek projelerde çalışın, deneyim kazanın ve kazanç elde edin. Freelancer partner programı ile iş fırsatlarına erişin.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Code,
      title: "Canlı Kodlama ve Bugfix",
      description:
        "Gerçek zamanlı kodlama pratiği yapın, bug&apos;ları çözün ve pratik becerilerinizi geliştirin. Interaktif öğrenme deneyimi.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: DollarSign,
      title: "Kazanç Sistemi",
      description:
        "Hackathon&apos;lardan, freelancer projelerden ve derece kazancından gelir elde edin. Kazanç analizi ile performansınızı takip edin.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "AI Destekli Öğrenme",
      description: "Yapay zeka ile kişiselleştirilmiş öneriler, analizler ve öğrenme yolları",
    },
    {
      icon: MessageCircle,
      title: "Sosyal Topluluk",
      description: "Geliştiricilerle bağlantı kurun, grup sohbetlerine katılın ve birlikte öğrenin",
    },
    {
      icon: Trophy,
      title: "Hackathon ve Yarışmalar",
      description: "Yeteneklerinizi sergileyin, takımlar kurun ve ödüller kazanın",
    },
    {
      icon: DollarSign,
      title: "Kazanç Fırsatları",
      description: "Hackathon ödülleri, freelancer projeler ve derece kazancı ile gelir elde edin",
    },
    {
      icon: Code,
      title: "Pratik Öğrenme",
      description: "Canlı kodlama, bugfix meydan okumaları ve interaktif pratikler",
    },
    {
      icon: TrendingUp,
      title: "Kariyer Gelişimi",
      description: "Becerilerinizi geliştirin, CV oluşturun ve iş fırsatlarına erişin",
    },
    {
      icon: Users,
      title: "Topluluk Desteği",
      description: "Yardımlaşma toplulukları, haber akışı ve keşfet özellikleri",
    },
    {
      icon: Zap,
      title: "Hızlı Başlangıç",
      description: "Kolay kullanım, hızlı sonuçlar ve 7/24 erişim",
    },
  ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Photos/YtkCareerLogo/ytkncareer.jpeg"
                alt="YTK Academy Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer">
                YTK Academy
              </span>
            </Link>
            <div className="flex items-center gap-4">
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="text-center max-w-5xl mx-auto animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            🚀 Kapsamlı Eğitim, Sosyal Ağ ve Kariyer Platformu
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer leading-tight">
            Eğitim, Topluluk ve Kariyerin Tek Adresi
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 animate-slide-up font-medium max-w-3xl mx-auto leading-relaxed">
            Teknik becerilerinizi geliştirin, toplulukla bağlantı kurun, hackathon&apos;lara katılın, freelancer projelerde yer alın ve kariyerinizi bir sonraki seviyeye taşıyın. AI destekli öğrenme, canlı kodlama, sosyal ağ ve kazanç fırsatları tek platformda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-12">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto group">
                Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Giriş Yap
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-blue-600 dark:text-blue-400 mb-1">24+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Eğitim Modülü</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ders İçeriği</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-cyan-600 dark:text-cyan-400 mb-1">7/24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Erişim</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-green-600 dark:text-green-400 mb-1">AI</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Destekli Öğrenme</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-indigo-600 md:to-cyan-600 md:bg-[length:200%_auto] md:animate-text-shimmer">
            Platform Özellikleri
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Eğitim, sosyal ağ, hackathon, freelancer fırsatları ve kariyer geliştirme - ihtiyacınız olan tüm araçlar tek bir platformda
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                variant="elevated"
                hover
                className="p-6 group animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    {feature.title === "Eğitim Modülü" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 24+ Teknoloji Kursları</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Gerçek zamanlı testler</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> AI destekli öğrenme yolu</li>
                      </>
                    )}
                    {feature.title === "Mülakat Simülasyonu" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Gerçekçi mülakat senaryoları</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Detaylı performans analizi</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Kişiselleştirilmiş geri bildirim</li>
                      </>
                    )}
                    {feature.title === "CV Oluşturma" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> ATS uyumlu şablonlar</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> AI ile CV optimizasyonu</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Doğrudan iş ilanlarına başvuru</li>
                      </>
                    )}
                    {feature.title === "Sosyal Ağ ve Topluluk" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Haber akışı ve keşfet</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Grup sohbetleri ve topluluklar</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Bağlantılar ve arkadaşlık</li>
                      </>
                    )}
                    {feature.title === "Hackathon ve Yarışmalar" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Takım oluşturma ve proje geliştirme</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Ödüller ve rozetler</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Derece kazancı sistemi</li>
                      </>
                    )}
                    {feature.title === "Freelancer Fırsatları" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Gerçek proje fırsatları</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Deneyim ve portföy geliştirme</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Kazanç ve ödeme takibi</li>
                      </>
                    )}
                    {feature.title === "Canlı Kodlama ve Bugfix" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Gerçek zamanlı kodlama pratiği</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Bug çözme meydan okumaları</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Interaktif öğrenme deneyimi</li>
                      </>
                    )}
                    {feature.title === "Kazanç Sistemi" && (
                      <>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Hackathon ödülleri</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Freelancer kazançları</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Detaylı kazanç analizi</li>
                      </>
                    )}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, title: "Sertifikalar", desc: "Tamamladığınız kurslar için sertifika alın", color: "from-yellow-500 to-orange-500" },
            { icon: BarChart3, title: "Performans Takibi", desc: "Detaylı analiz ve ilerleme raporları", color: "from-green-500 to-emerald-500" },
            { icon: Target, title: "Hedef Belirleme", desc: "Kariyer hedeflerinize ulaşmak için plan yapın", color: "from-purple-500 to-pink-500" },
            { icon: MessageSquare, title: "Topluluk Desteği", desc: "Diğer öğrencilerle etkileşim kurun", color: "from-blue-500 to-cyan-500" },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} variant="elevated" hover className="p-5 text-center group animate-fade-in">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-3 shadow-lg md:group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-display font-bold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-white/50 dark:bg-gray-800/30 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sadece 4 adımda eğitim, topluluk ve kariyer yolculuğunuza başlayın
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Hesap Oluştur", desc: "Ücretsiz kayıt olun, profilinizi oluşturun ve topluluğa katılın", icon: Users, color: "from-blue-500 to-cyan-500" },
            { step: "02", title: "Keşfet ve Öğren", desc: "Kurslarla Başlayın", icon: BookOpen, color: "from-indigo-500 to-purple-500" },
            { step: "03", title: "Toplulukla Bağlan", desc: "Sosyal ağa katılın, hackathon'lara başvurun ve freelancer fırsatlarını keşfedin", icon: MessageCircle, color: "from-green-500 to-emerald-500" },
            { step: "04", title: "Kazan ve Geliş", desc: "Sertifikalar alın, ödüller kazanın ve kariyerinizi bir sonraki seviyeye taşıyın", icon: Trophy, color: "from-orange-500 to-red-500" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center font-display font-bold text-blue-600 dark:text-blue-400 text-lg">
                  {item.step}
                </div>
                <Card variant="elevated" hover className="p-6 h-full group">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2 text-center text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{item.desc}</p>
                </Card>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-white/50 dark:bg-gray-800/30 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Öğrenme Yolculuğunuz
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Adım adım ilerleyin ve kariyer hedeflerinize ulaşın
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                variant="glass"
                hover
                className="p-6 text-center group animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-display font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Course Categories */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Popüler Kurs Kategorileri
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Her seviyeye uygun, güncel ve kapsamlı kurs içerikleri
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Backend Geliştirme", icon: "⚙️", desc: ".NET Core, Java, Node.js, Python, Go, Kotlin, Spring Boot, NestJS ile backend geliştirme", color: "from-blue-500 to-cyan-500" },
            { name: "Frontend Geliştirme", icon: "🎨", desc: "React, Angular, Next.js, Vue.js, TypeScript ile modern web uygulamaları geliştirme", color: "from-indigo-500 to-purple-500" },
            { name: "Mobil Geliştirme", icon: "📱", desc: "Flutter ve Swift ile cross-platform ve native mobil uygulama geliştirme", color: "from-green-500 to-emerald-500" },
            { name: "Veritabanı", icon: "💾", desc: "MSSQL, MongoDB, PostgreSQL ile veritabanı yönetimi, sorgulama ve optimizasyon", color: "from-orange-500 to-red-500" },
            { name: "Cloud & DevOps", icon: "☁️", desc: "AWS, Azure, Docker & Kubernetes ile bulut altyapısı ve DevOps pratikleri", color: "from-cyan-500 to-blue-500" },
            { name: "Güvenlik", icon: "🔐", desc: "Ethical Hacking, OWASP güvenlik standartları ve web uygulama güvenliği", color: "from-purple-500 to-pink-500" },
            { name: "AI & Machine Learning", icon: "🤖", desc: "AI for Developers ile yapay zeka ve makine öğrenmesi temelleri", color: "from-teal-500 to-green-500" },
            { name: "Full Stack Development", icon: "🚀", desc: "MEAN, MERN, MEVN stack'leri ile end-to-end web uygulama geliştirme", color: "from-rose-500 to-pink-500" },
          ].map((category, index) => {
            const lessonCount = categoryLessonCounts[category.name] || 0;
            return (
              <Card
                key={index}
                variant="elevated"
                hover
                className="p-6 group animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {category.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {isLoadingCounts ? (
                      <span className="animate-pulse">Yükleniyor...</span>
                    ) : (
                      `${lessonCount} Ders`
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Öğrencilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Binlerce başarılı öğrencinin hikayesi
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ahmet Yılmaz", role: "Frontend Developer", company: "Tech Corp", rating: 5, text: "Bu platform sayesinde React'i sıfırdan öğrendim ve 3 ay içinde iş buldum. Testler ve AI önerileri gerçekten çok faydalıydı.", avatar: "👨‍💻" },
            { name: "Ayşe Demir", role: "Data Scientist", company: "Data Analytics", rating: 5, text: "Veri bilimi kursları çok kapsamlı. Özellikle proje tabanlı öğrenme yaklaşımı sayesinde pratik deneyim kazandım.", avatar: "👩‍💼" },
            { name: "Mehmet Kaya", role: "Full Stack Developer", company: "StartupXYZ", rating: 5, text: "Mülakat simülasyonu özelliği sayesinde gerçek mülakatlara çok daha hazırlıklı gittim. Kesinlikle tavsiye ederim!", avatar: "👨‍💼" },
          ].map((testimonial, index) => (
            <Card key={index} variant="elevated" className="p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role} • {testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Advantages */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Neden Bizi Seçmelisiniz?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: "Esnek Öğrenme", desc: "Kendi hızınızda öğrenin, 7/24 erişim", color: "from-blue-500 to-cyan-500" },
            { icon: Shield, title: "Güvenli Platform", desc: "Verileriniz güvende, SSL sertifikalı", color: "from-green-500 to-emerald-500" },
            { icon: Award, title: "Sertifikalı Kurslar", desc: "Endüstri tarafından tanınan sertifikalar", color: "from-yellow-500 to-orange-500" },
            { icon: Sparkles, title: "AI Destekli", desc: "Kişiselleştirilmiş öğrenme deneyimi ve analizler", color: "from-purple-500 to-pink-500" },
            { icon: MessageCircle, title: "Sosyal Ağ", desc: "Topluluk sohbetleri, haber akışı ve bağlantılar", color: "from-indigo-500 to-blue-500" },
            { icon: Trophy, title: "Hackathon ve Yarışmalar", desc: "Takım çalışması, proje geliştirme ve ödüller", color: "from-orange-500 to-red-500" },
            { icon: Handshake, title: "Freelancer Fırsatları", desc: "Gerçek projeler, deneyim ve kazanç imkanları", color: "from-emerald-500 to-teal-500" },
            { icon: Code, title: "Pratik Öğrenme", desc: "Canlı kodlama ve bugfix meydan okumaları", color: "from-cyan-500 to-blue-500" },
            { icon: DollarSign, title: "Kazanç Sistemi", desc: "Hackathon ödülleri, freelancer ve derece kazancı", color: "from-pink-500 to-rose-500" },
            { icon: Globe, title: "Türkçe İçerik", desc: "Tüm kurslar Türkçe, anadilinde öğren", color: "from-teal-500 to-green-500" },
            { icon: TrendingUp, title: "Kariyer Desteği", desc: "CV oluşturma, mülakat pratiği ve iş ilanları", color: "from-blue-500 to-indigo-500" },
          ].map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card key={index} variant="elevated" hover className="p-6 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${advantage.color} flex items-center justify-center mb-4 shadow-lg md:group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-gray-100">{advantage.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{advantage.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-white/50 dark:bg-gray-800/30 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
            Sık Sorulan Sorular
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { q: "Platform ücretsiz mi?", a: "Evet, temel özellikler tamamen ücretsizdir. Premium üyelik ile daha fazla kurs ve özellik erişebilirsiniz." },
            { q: "Sertifika alabilir miyim?", a: "Evet, kursları tamamladığınızda dijital sertifika alabilirsiniz. Sertifikalar endüstri tarafından tanınmaktadır." },
            { q: "Mobil uygulama var mı?", a: "Şu anda web platformu tüm cihazlarda mükemmel çalışmaktadır. Mobil uygulama yakında gelecektir." },
            { q: "Kursları ne kadar sürede tamamlayabilirim?", a: "Kurslar kendi hızınızda tamamlanabilir. Ortalama bir kurs 2-4 hafta sürmektedir." },
            { q: "AI özellikleri nasıl çalışır?", a: "AI, öğrenme hızınızı ve performansınızı analiz ederek size özel öneriler ve öğrenme yolları sunar." },
            { q: "İş bulma desteği var mı?", a: "Evet, CV oluşturma, mülakat simülasyonu ve iş ilanlarına doğrudan başvuru özelliklerimiz bulunmaktadır." },
          ].map((faq, index) => (
            <Card key={index} variant="elevated" className="p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <h3 className="font-display font-bold text-gray-900 dark:text-gray-100">{faq.q}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-8">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <Card
          variant="glass"
          className="p-12 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent md:animate-gradient-shift pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative z-10">
            Eğitim, Topluluk ve Kariyerinize Bugün Başlayın
          </h2>
          <p className="text-lg mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
            Topluluğa katılın, .NET Core öğrenin, hackathon&apos;lara katılın, freelancer projelerde yer alın ve kariyer hedeflerinize ulaşın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
              >
                Ücretsiz Kayıt Ol
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Giriş Yap
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-700/50 glass mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-display font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                YTK Academy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Kapsamlı eğitim, sosyal ağ, hackathon, freelancer fırsatları ve kariyer geliştirme platformu. Eğitim, topluluk ve kariyerin tek adresi.
              </p>
              <div className="flex gap-3">
                {[Globe, Users, Award].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/education/courses" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kurslar</Link></li>
                <li><Link href="/education/analytics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Analitik</Link></li>
                <li><Link href="/interview/practice" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mülakat</Link></li>
                <li><Link href="/cv/my-cvs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">CV Oluştur</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</Link></li>
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kariyer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Yardım Merkezi</Link></li>
                <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SSS</Link></li>
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gizlilik</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Şartlar</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                &copy; 2024 YTK Academy. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span>Türkçe</span>
                <span>•</span>
                <span>Made with ❤️ in Turkey</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
