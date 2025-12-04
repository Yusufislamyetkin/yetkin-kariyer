import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { HackathonPhase, HackathonVisibility } from "@prisma/client";
import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // YTK Career organizatörünü bul veya oluştur
    let organizerUser = await db.user.findFirst({
      where: { name: "YTK Career" },
      select: { id: true }
    });

    if (!organizerUser) {
      // YTK Career kullanıcısı yoksa oluştur
      const adminUser = await db.user.findFirst({
        where: { role: "admin" },
        select: { id: true, email: true }
      });

      if (!adminUser) {
        return NextResponse.json(
          { error: "Admin kullanıcı bulunamadı" },
          { status: 404 }
        );
      }

      organizerUser = await db.user.create({
        data: {
          email: `ytk-career-${Date.now()}@example.com`,
          name: "YTK Career",
          role: "employer",
        },
        select: { id: true }
      });
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Ödül oluşturma yardımcı fonksiyonu
    const generatePrizes = () => {
      const first = Math.floor(Math.random() * 5000) + 15000; // 15.000 - 20.000
      const second = Math.floor(Math.random() * 5000) + 10000; // 10.000 - 15.000
      const third = Math.floor(Math.random() * 5000) + 5000; // 5.000 - 10.000
      return `Birinci: ${first.toLocaleString('tr-TR')}₺, İkinci: ${second.toLocaleString('tr-TR')}₺, Üçüncü: ${third.toLocaleString('tr-TR')}₺`;
    };

    // 2 ay önce hackathonları (5 adet - judgingClosesAt: -60 ile -31 gün)
    const twoMonthsAgoHackathons = [
      {
        slug: "ai-innovation-2024",
        title: "AI Innovation Hackathon 2024",
        description: "Yapay zeka ve makine öğrenmesi teknolojilerinin günümüzdeki önemi her geçen gün artmaktadır. Bu hackathon, katılımcıların AI teknolojilerini kullanarak gerçek dünya problemlerine yenilikçi çözümler geliştirmelerini hedeflemektedir. Katılımcılar, makine öğrenmesi algoritmaları, doğal dil işleme, bilgisayarlı görü ve derin öğrenme gibi alanlarda projeler geliştirebileceklerdir.\n\nBu etkinlik, yapay zeka alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, sektördeki önde gelen şirketler tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["ai", "machine-learning", "innovation"],
        applicationOpensAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 74 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 49 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "web3-blockchain-challenge",
        title: "Web3 & Blockchain Challenge",
        description: "Blockchain teknolojisi ve Web3 ekosistemi, dijital dünyanın geleceğini şekillendiren en önemli teknolojilerden biridir. Bu hackathon, katılımcıların merkeziyetsiz uygulamalar (dApps), DeFi protokolleri, NFT projeleri ve DAO yapıları geliştirmelerini teşvik etmektedir. Katılımcılar, Ethereum, Polygon, Solana gibi blockchain ağları üzerinde çalışabileceklerdir.\n\nBu etkinlik, blockchain ve Web3 alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, yatırımcılar ve blockchain şirketleri tarafından değerlendirilecek ve potansiyel ortaklık fırsatları sunulacaktır.",
        tags: ["blockchain", "web3", "defi", "nft"],
        applicationOpensAt: new Date(now.getTime() - 88 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 73 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 48 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 43 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "sustainability-tech-2024",
        title: "Sustainability Tech Hackathon 2024",
        description: "Sürdürülebilirlik ve çevre teknolojileri, günümüzün en kritik konularından biridir. Bu hackathon, katılımcıların iklim değişikliği, enerji verimliliği, atık yönetimi ve yeşil teknolojiler alanlarında çözümler geliştirmelerini hedeflemektedir. Katılımcılar, IoT sensörleri, data analytics, renewable energy sistemleri ve circular economy çözümleri üzerinde çalışabileceklerdir.\n\nBu etkinlik, çevre teknolojileri ve sürdürülebilirlik alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, çevre organizasyonları ve yeşil teknoloji şirketleri tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
        tags: ["sustainability", "green-tech", "climate"],
        applicationOpensAt: new Date(now.getTime() - 86 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 71 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 46 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 41 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "mobile-app-development-2024",
        title: "Mobile App Development Hackathon 2024",
        description: "Mobil uygulama geliştirme, günümüzün en dinamik ve hızlı büyüyen teknoloji alanlarından biridir. Bu hackathon, katılımcıların iOS, Android ve cross-platform çözümler geliştirmelerini teşvik etmektedir. Katılımcılar, React Native, Flutter, Swift, Kotlin gibi modern teknolojileri kullanarak kullanıcı deneyimi odaklı uygulamalar geliştirebileceklerdir.\n\nBu etkinlik, mobil uygulama geliştirme alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, mobil uygulama şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["mobile", "ios", "android", "react-native"],
        applicationOpensAt: new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 69 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 68 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 43 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 39 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "data-science-challenge-2024",
        title: "Data Science Challenge 2024",
        description: "Veri bilimi ve analitik, modern iş dünyasının en değerli yetkinliklerinden biridir. Bu hackathon, katılımcıların machine learning, data visualization, predictive analytics ve big data çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, Python, R, SQL gibi araçları kullanarak gerçek veri setleri üzerinde çalışabileceklerdir.\n\nBu etkinlik, veri bilimi alanında kariyer yapmak isteyen analistler ve geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, veri odaklı şirketler tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["data-science", "analytics", "python", "r"],
        applicationOpensAt: new Date(now.getTime() - 82 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 67 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 66 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 41 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 37 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      }
    ];

    // Geçen ay hackathonları (5 adet - judgingClosesAt: -30 ile -1 gün)
    const lastMonthHackathons = [
      {
        slug: "cloud-infrastructure-2024",
        title: "Cloud Infrastructure Hackathon 2024",
        description: "Bulut altyapısı ve DevOps, modern yazılım geliştirmenin temel taşlarından biridir. Bu hackathon, katılımcıların AWS, Azure, GCP gibi bulut platformlarında çözümler geliştirmelerini hedeflemektedir. Katılımcılar, containerization, microservices mimarileri, CI/CD pipeline'ları ve infrastructure as code gibi konularda projeler geliştirebileceklerdir.\n\nBu etkinlik, bulut ve DevOps alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, bulut şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["cloud", "devops", "aws", "docker", "kubernetes"],
        applicationOpensAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 49 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "e-commerce-solutions-2024",
        title: "E-Commerce Solutions Hackathon 2024",
        description: "E-ticaret ve dijital pazarlama, günümüzün en hızlı büyüyen sektörlerinden biridir. Bu hackathon, katılımcıların e-ticaret platformları, ödeme sistemleri, envanter yönetimi ve müşteri deneyimi çözümleri geliştirmelerini teşvik etmektedir. Katılımcılar, modern web teknolojileri, API entegrasyonları ve UX/UI tasarımı üzerinde çalışabileceklerdir.\n\nBu etkinlik, e-ticaret ve dijital pazarlama alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, e-ticaret şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["ecommerce", "payment", "marketing", "ux"],
        applicationOpensAt: new Date(now.getTime() - 63 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 48 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "ar-vr-experience-2024",
        title: "AR/VR Experience Hackathon 2024",
        description: "Artırılmış ve sanal gerçeklik teknolojileri, kullanıcı deneyimini köklü bir şekilde değiştiren yenilikçi teknolojilerdir. Bu hackathon, katılımcıların Unity, Unreal Engine gibi oyun motorlarını kullanarak immersive deneyimler oluşturmalarını hedeflemektedir. Katılımcılar, 3D modeling, spatial computing, haptic feedback ve mixed reality uygulamaları geliştirebileceklerdir.\n\nBu etkinlik, immersive teknolojiler alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, VR/AR şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["ar", "vr", "unity", "3d", "immersive"],
        applicationOpensAt: new Date(now.getTime() - 61 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 46 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "social-impact-tech-2024",
        title: "Social Impact Tech Hackathon 2024",
        description: "Sosyal etki yaratan teknolojiler, toplumsal problemlere çözüm bulmak için teknolojinin gücünü kullanan projelerdir. Bu hackathon, katılımcıların accessibility, sosyal iyilik, topluluk oluşturma ve insani yardım teknolojileri geliştirmelerini teşvik etmektedir. Katılımcılar, kapsayıcı tasarım, sosyal ağlar, eğitim teknolojileri ve sağlık çözümleri üzerinde çalışabileceklerdir.\n\nBu etkinlik, sosyal etki teknolojileri alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, sosyal girişimler ve sivil toplum kuruluşları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
        tags: ["social-impact", "accessibility", "community", "nonprofit"],
        applicationOpensAt: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 43 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "automation-robotics-2024",
        title: "Automation & Robotics Hackathon 2024",
        description: "Otomasyon ve robotik, endüstriyel ve ticari uygulamalarda devrim yaratan teknolojilerdir. Bu hackathon, katılımcıların IoT sensörleri, otomasyon sistemleri, robotik programlama ve akıllı üretim çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, embedded systems, mekatronik, kontrol sistemleri ve endüstriyel IoT üzerinde çalışabileceklerdir.\n\nBu etkinlik, otomasyon ve robotik alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, endüstriyel şirketler ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["automation", "robotics", "iot", "manufacturing"],
        applicationOpensAt: new Date(now.getTime() - 57 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 41 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      }
    ];

    // Bu ay hackathonları (10 adet - application veya submission phase aktif)
    const currentHackathons = [
      {
        slug: "fintech-innovation-2025",
        title: "FinTech Innovation Hackathon 2025",
        description: "Finansal teknolojiler, modern bankacılık ve ödeme sistemlerini dönüştüren en önemli sektörlerden biridir. Bu hackathon, katılımcıların ödeme sistemleri, blockchain teknolojileri, güvenlik çözümleri ve dijital bankacılık uygulamaları geliştirmelerini hedeflemektedir. Katılımcılar, API entegrasyonları, kriptografi, fraud detection ve kullanıcı deneyimi tasarımı üzerinde çalışabileceklerdir.\n\nBu etkinlik, finansal teknolojiler alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, FinTech şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["fintech", "payments", "security"],
        applicationOpensAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "healthcare-tech-challenge",
        title: "Healthcare Tech Challenge",
        description: "Sağlık teknolojileri, modern tıbbın dönüşümünde kritik bir rol oynamaktadır. Bu hackathon, katılımcıların telemedicine, AI diagnostics, patient care ve sağlık yönetimi çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, hasta takip sistemleri, teletıp platformları, AI destekli tanı araçları ve sağlık verisi analizi üzerinde çalışabileceklerdir.\n\nBu etkinlik, sağlık teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve sağlık profesyonelleri için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, sağlık kurumları ve teknoloji şirketleri tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["healthcare", "telemedicine", "ai"],
        applicationOpensAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 43 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "edtech-solutions-2025",
        title: "EdTech Solutions Hackathon 2025",
        description: "Eğitim teknolojileri, modern eğitimin dönüşümünde kritik bir rol oynamaktadır. Bu hackathon, katılımcıların online learning platformları, gamification sistemleri, AI destekli öğretim araçları, öğrenci takip sistemleri ve interaktif eğitim içerikleri geliştirmelerini hedeflemektedir. Katılımcılar, React, Vue.js gibi modern frontend teknolojileri, Node.js, Python gibi backend dilleri, machine learning kütüphaneleri ve veritabanı sistemleri üzerinde çalışabileceklerdir.\n\nBu etkinlik, eğitim teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve eğitimciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, EdTech şirketleri ve eğitim kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["edtech", "education", "learning"],
        applicationOpensAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "fullstack-development-2025",
        title: "Full Stack Development Hackathon 2025",
        description: "Full stack web geliştirme, modern yazılım dünyasının en aranan yetkinliklerinden biridir. Bu hackathon, katılımcıların frontend ve backend teknolojilerini bir arada kullanarak tam özellikli web uygulamaları geliştirmelerini hedeflemektedir. Katılımcılar, React, Vue.js, Angular gibi frontend framework'leri, Node.js, Express, NestJS gibi backend teknolojileri, PostgreSQL, MongoDB gibi veritabanı sistemleri ve RESTful/GraphQL API tasarımı üzerinde çalışabileceklerdir.\n\nBu etkinlik, full stack geliştirme alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, teknoloji şirketleri ve startup'lar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["fullstack", "react", "nodejs", "api"],
        applicationOpensAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 33 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "cybersecurity-defense-2025",
        title: "Cybersecurity Defense Hackathon 2025",
        description: "Siber güvenlik savunma, dijital dünyanın en kritik konularından biridir. Bu hackathon, katılımcıların threat detection sistemleri, incident response araçları, security monitoring platformları, penetration testing çözümleri ve güvenlik analiz araçları geliştirmelerini hedeflemektedir. Katılımcılar, Python, Go gibi programlama dilleri, SIEM sistemleri, log analiz araçları, vulnerability scanning araçları ve güvenlik framework'leri üzerinde çalışabileceklerdir.\n\nBu etkinlik, siber güvenlik alanında kariyer yapmak isteyen geliştiriciler ve güvenlik uzmanları için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, güvenlik şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["cybersecurity", "defense", "threat-detection", "pentesting"],
        applicationOpensAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 34 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 49 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "ai-chatbot-development-2025",
        title: "AI Chatbot Development Hackathon 2025",
        description: "Yapay zeka destekli chatbot ve conversational AI, müşteri hizmetleri ve dijital etkileşimin geleceğini şekillendiren en önemli teknolojilerden biridir. Bu hackathon, katılımcıların doğal dil işleme (NLP) teknolojileri, machine learning modelleri, intent recognition sistemleri, context management ve multi-turn conversation çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, OpenAI GPT, Google Dialogflow, Rasa gibi AI platformları, Python, TensorFlow, PyTorch gibi ML framework'leri ve API entegrasyonları üzerinde çalışabileceklerdir.\n\nBu etkinlik, AI ve conversational AI alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, AI şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["ai", "chatbot", "nlp", "conversational-ai"],
        applicationOpensAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 36 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "blockchain-defi-2025",
        title: "Blockchain DeFi Hackathon 2025",
        description: "Merkeziyetsiz finans (DeFi) ve blockchain teknolojileri, finansal sistemlerin dönüşümünde devrim yaratan en önemli inovasyonlardan biridir. Bu hackathon, katılımcıların akıllı kontratlar (smart contracts), merkeziyetsiz borsalar (DEX), lending ve borrowing protokolleri, yield farming çözümleri ve Web3 entegrasyonları geliştirmelerini hedeflemektedir. Katılımcılar, Solidity, Rust gibi blockchain dilleri, Ethereum, Polygon, Solana gibi blockchain ağları, Web3.js, Ethers.js gibi kütüphaneler ve frontend entegrasyonları üzerinde çalışabileceklerdir.\n\nBu etkinlik, blockchain ve DeFi alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, blockchain şirketleri ve DeFi platformları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["blockchain", "defi", "smart-contracts", "web3"],
        applicationOpensAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 36 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 51 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "iot-smart-home-2025",
        title: "IoT Smart Home Hackathon 2025",
        description: "Nesnelerin İnterneti (IoT) ve akıllı ev teknolojileri, modern yaşamın konforunu ve verimliliğini artıran en önemli teknolojilerden biridir. Bu hackathon, katılımcıların ev otomasyon sistemleri, sensör entegrasyonları, enerji yönetim çözümleri, akıllı cihaz kontrolü ve IoT platformları geliştirmelerini hedeflemektedir. Katılımcılar, Arduino, Raspberry Pi gibi embedded sistemler, MQTT, CoAP gibi IoT protokolleri, AWS IoT, Google Cloud IoT gibi bulut platformları ve mobile app entegrasyonları üzerinde çalışabileceklerdir.\n\nBu etkinlik, IoT ve akıllı ev teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve mühendisler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, IoT şirketleri ve akıllı ev teknolojisi firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["iot", "smart-home", "automation", "sensors"],
        applicationOpensAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 52 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "game-development-2025",
        title: "Game Development Hackathon 2025",
        description: "Oyun geliştirme, yaratıcılık ve teknolojinin birleştiği en dinamik alanlardan biridir. Bu hackathon, katılımcıların Unity, Unreal Engine gibi oyun motorlarını kullanarak yaratıcı oyun projeleri geliştirmelerini hedeflemektedir. Katılımcılar, game mechanics tasarımı, multiplayer sistemleri, VR/AR entegrasyonu, game analytics, monetization stratejileri ve oyun performans optimizasyonu üzerinde çalışabileceklerdir.\n\nBu etkinlik, oyun geliştirme alanında kariyer yapmak isteyen geliştiriciler ve tasarımcılar için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, oyun şirketleri ve yayıncılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["gaming", "game-dev", "unity", "unreal", "game-design"],
        applicationOpensAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 19 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 39 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 53 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "startup-tech-2025",
        title: "Startup Tech Hackathon 2025",
        description: "Startup teknolojileri ve girişimcilik, inovasyonun ve ekonomik büyümenin itici gücüdür. Bu hackathon, katılımcıların MVP (Minimum Viable Product) geliştirme, product-market fit analizi, scaling stratejileri ve sürdürülebilir iş modelleri oluşturmalarını hedeflemektedir. Katılımcılar, hızlı prototipleme araçları, modern web ve mobil teknolojileri, cloud infrastructure, analytics ve growth hacking araçları üzerinde çalışabileceklerdir.\n\nBu etkinlik, startup dünyasında kariyer yapmak veya kendi startup'ını kurmak isteyen geliştiriciler ve girişimciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, yatırımcılar, startup accelerator'ları ve teknoloji şirketleri tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["startup", "mvp", "product", "business"],
        applicationOpensAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 19 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 39 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 54 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      }
    ];

    // Bir sonraki ay hackathonları (5 adet - applicationOpensAt: +30-60 gün)
    const nextMonthHackathons = [
      {
        slug: "cybersecurity-challenge-2025",
        title: "Cybersecurity Challenge 2025",
        description: "Siber güvenlik, dijital dünyanın en kritik konularından biridir. Bu hackathon, katılımcıların penetration testing, security auditing, threat detection ve güvenlik çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, network security, application security, cryptography ve incident response gibi alanlarda projeler geliştirebileceklerdir.\n\nBu etkinlik, siber güvenlik alanında kariyer yapmak isteyen geliştiriciler ve güvenlik uzmanları için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, güvenlik şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["cybersecurity", "pentesting", "security"],
        applicationOpensAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 56 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 81 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 95 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "iot-smart-cities-2025",
        title: "IoT & Smart Cities Hackathon 2025",
        description: "Nesnelerin İnterneti ve akıllı şehir teknolojileri, modern kentleşmenin geleceğini şekillendiren en önemli teknolojilerden biridir. Bu hackathon, katılımcıların sensor networks, data analytics, urban planning ve akıllı şehir çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, IoT platformları, edge computing, real-time data processing ve city management sistemleri üzerinde çalışabileceklerdir.\n\nBu etkinlik, IoT ve akıllı şehir teknolojileri alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, belediyeler ve teknoloji şirketleri tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
        tags: ["iot", "smart-cities", "sensors"],
        applicationOpensAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 61 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 86 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "gaming-development-2025",
        title: "Gaming Development Hackathon 2025",
        description: "Oyun geliştirme, yaratıcılık ve teknolojinin birleştiği en dinamik alanlardan biridir. Bu hackathon, katılımcıların Unity, Unreal Engine gibi oyun motorlarını kullanarak yaratıcı oyun projeleri geliştirmelerini hedeflemektedir. Katılımcılar, game mechanics, multiplayer systems, VR/AR entegrasyonu ve game analytics üzerinde çalışabileceklerdir.\n\nBu etkinlik, oyun geliştirme alanında kariyer yapmak isteyen geliştiriciler ve tasarımcılar için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, oyun şirketleri ve yayıncılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["gaming", "game-dev", "unity", "unreal"],
        applicationOpensAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 66 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 91 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "machine-learning-advanced-2025",
        title: "Advanced Machine Learning Hackathon 2025",
        description: "İleri seviye makine öğrenmesi, yapay zekanın en gelişmiş dallarından biridir. Bu hackathon, katılımcıların deep learning, neural networks, computer vision ve NLP çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, TensorFlow, PyTorch gibi framework'leri kullanarak karmaşık ML modelleri oluşturabileceklerdir.\n\nBu etkinlik, makine öğrenmesi alanında uzmanlaşmak isteyen geliştiriciler ve araştırmacılar için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, AI şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["machine-learning", "deep-learning", "neural-networks", "computer-vision"],
        applicationOpensAt: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 71 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 95 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 96 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 110 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "quantum-computing-2025",
        title: "Quantum Computing Hackathon 2025",
        description: "Kuantum hesaplama, bilgisayar biliminin en ileri teknolojilerinden biridir. Bu hackathon, katılımcıların quantum algorithms, quantum machine learning ve quantum cryptography çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, Qiskit, Cirq gibi quantum framework'leri kullanarak kuantum programları yazabileceklerdir.\n\nBu etkinlik, kuantum hesaplama alanında kariyer yapmak isteyen geliştiriciler ve araştırmacılar için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, kuantum şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["quantum", "quantum-computing", "algorithms", "cryptography"],
        applicationOpensAt: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 76 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 101 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 115 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      }
    ];

    // 2 ay sonra hackathonları (5 adet - applicationOpensAt: +60-90 gün)
    const twoMonthsLaterHackathons = [
      {
        slug: "biotech-health-2025",
        title: "Biotech & Health Innovation Hackathon 2025",
        description: "Biyoteknoloji ve sağlık inovasyonu, insan sağlığını iyileştirmek için teknolojinin gücünü kullanan en önemli alanlardan biridir. Bu hackathon, katılımcıların genomics, personalized medicine, bioinformatics ve health data analytics çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, DNA analizi, protein yapısı tahmini, ilaç keşfi ve sağlık verisi analizi üzerinde çalışabileceklerdir.\n\nBu etkinlik, biyoteknoloji ve sağlık teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve araştırmacılar için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, biyoteknoloji şirketleri ve sağlık kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["biotech", "genomics", "health", "bioinformatics"],
        applicationOpensAt: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 86 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 110 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 111 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 125 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "space-tech-2025",
        title: "Space Technology Hackathon 2025",
        description: "Uzay teknolojileri ve aerospace, insanlığın geleceğini şekillendiren en heyecan verici alanlardan biridir. Bu hackathon, katılımcıların satellite systems, space data analytics, rocket science ve space exploration çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, uydu yörünge hesaplamaları, uzay verisi işleme, roket simülasyonları ve uzay görev planlama sistemleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, uzay mühendisleri ve aerospace uzmanları katılımcılara rehberlik edecektir. Projeler, gerçek uzay problemlerine odaklanarak hem teknik hem de bilimsel değer yaratmayı hedeflemektedir. Ayrıca, uzay verisi analizi, yörünge mekaniği ve uzay görev güvenliği konularında eğitimler verilecektir.\n\nBu etkinlik, uzay teknolojileri ve aerospace alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, uzay şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["space", "aerospace", "satellite", "exploration"],
        applicationOpensAt: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 91 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 115 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 116 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 130 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "agritech-innovation-2025",
        title: "AgriTech Innovation Hackathon 2025",
        description: "Tarım teknolojileri ve akıllı tarım, gıda güvenliği ve sürdürülebilir tarım için kritik öneme sahiptir. Bu hackathon, katılımcıların precision farming, crop monitoring, agricultural IoT ve farm automation çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, drone teknolojileri, sensör ağları, tarım verisi analizi ve otomatik sulama sistemleri üzerinde çalışabileceklerdir.\n\nHackathon boyunca, tarım teknolojisi uzmanları ve agronomist'ler katılımcılara mentorluk yapacaktır. Projeler, gerçek tarım problemlerine odaklanarak hem teknik hem de tarımsal değer yaratmayı hedeflemektedir. Ayrıca, precision agriculture, veri analizi ve sürdürülebilir tarım konularında eğitimler verilecektir.\n\nBu etkinlik, tarım teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve mühendisler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, tarım şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
        tags: ["agritech", "farming", "agriculture", "precision-farming"],
        applicationOpensAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 95 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 96 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 121 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 135 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "metaverse-development-2025",
        title: "Metaverse Development Hackathon 2025",
        description: "Metaverse ve sanal dünyalar, dijital deneyimlerin geleceğini şekillendiren en yenilikçi teknolojilerden biridir. Bu hackathon, katılımcıların virtual worlds, avatars, digital assets, VR/AR integration ve social platforms geliştirmelerini hedeflemektedir. Katılımcılar, 3D modelleme, fizik simülasyonları, blockchain entegrasyonu ve sosyal etkileşim sistemleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, metaverse uzmanları ve VR/AR geliştiricileri katılımcılara rehberlik edecektir. Projeler, gerçek kullanıcı deneyimlerine odaklanarak hem teknik hem de yaratıcı değer yaratmayı hedeflemektedir. Ayrıca, 3D grafik programlama, network synchronization ve kullanıcı deneyimi tasarımı konularında eğitimler verilecektir.\n\nBu etkinlik, metaverse ve sanal dünyalar alanında kariyer yapmak isteyen geliştiriciler ve tasarımcılar için ideal bir platformdur. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, metaverse şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
        tags: ["metaverse", "virtual-worlds", "avatars", "digital-assets"],
        applicationOpensAt: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 101 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 125 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 126 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 140 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      },
      {
        slug: "clean-energy-tech-2025",
        title: "Clean Energy Tech Hackathon 2025",
        description: "Temiz enerji teknolojileri, iklim değişikliği ile mücadelede en kritik çözümlerden biridir. Bu hackathon, katılımcıların solar energy, wind power, energy storage ve smart grids çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, yenilenebilir enerji sistemleri, enerji depolama teknolojileri, akıllı şebeke yönetimi ve enerji verimliliği uygulamaları üzerinde çalışabileceklerdir.\n\nHackathon boyunca, enerji mühendisleri ve sürdürülebilirlik uzmanları katılımcılara mentorluk yapacaktır. Projeler, gerçek enerji problemlerine odaklanarak hem teknik hem de çevresel değer yaratmayı hedeflemektedir. Ayrıca, enerji sistemleri tasarımı, grid integration ve enerji ekonomisi konularında eğitimler verilecektir.\n\nBu etkinlik, temiz enerji teknolojileri alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için mükemmel bir fırsattır. Hackathonlarda dereceye giren katılımcılar, YTK Career bünyesinde iş alma fırsatına sahip olacak ve diğer iş ilanlarında öne çıkacaklardır. Kazanan projeler, enerji şirketleri ve sürdürülebilirlik organizasyonları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
        tags: ["clean-energy", "solar", "wind", "energy-storage"],
        applicationOpensAt: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 106 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 130 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 131 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 145 * 24 * 60 * 60 * 1000),
        prizesSummary: generatePrizes()
      }
    ];

    const allHackathons = [
      ...twoMonthsAgoHackathons.map(h => ({ ...h, phase: HackathonPhase.completed })),
      ...lastMonthHackathons.map(h => ({ ...h, phase: HackathonPhase.completed })),
      ...currentHackathons.map(h => ({ ...h, phase: HackathonPhase.applications })),
      ...nextMonthHackathons.map(h => ({ ...h, phase: HackathonPhase.upcoming })),
      ...twoMonthsLaterHackathons.map(h => ({ ...h, phase: HackathonPhase.upcoming }))
    ];

    // Mevcut seed hackathonlarını sil (oluşturulacak slug'lara sahip olanlar)
    const slugsToCreate = allHackathons.map(h => h.slug);
    try {
      const deletedHackathons = await db.hackathon.deleteMany({
        where: {
          slug: {
            in: slugsToCreate
          }
        }
      });
      console.log(`🗑️  ${deletedHackathons.count} adet mevcut seed hackathon silindi`);
    } catch (deleteError: any) {
      console.error("❌ Mevcut hackathonlar silinirken hata:", deleteError);
      errors.push(`Mevcut hackathonlar silinirken hata: ${deleteError.message}`);
    }

    // Hackathonları oluştur
    for (const hackathonData of allHackathons) {
      try {
        const hackathon = await db.hackathon.create({
          data: {
            slug: hackathonData.slug,
            title: hackathonData.title,
            description: hackathonData.description,
            visibility: HackathonVisibility.public,
            applicationOpensAt: hackathonData.applicationOpensAt,
            applicationClosesAt: hackathonData.applicationClosesAt,
            submissionOpensAt: hackathonData.submissionOpensAt,
            submissionClosesAt: hackathonData.submissionClosesAt,
            judgingOpensAt: hackathonData.judgingOpensAt,
            judgingClosesAt: hackathonData.judgingClosesAt,
            timezone: "Europe/Istanbul",
            maxParticipants: 200,
            minTeamSize: 1,
            maxTeamSize: 4,
            tags: hackathonData.tags,
            prizesSummary: hackathonData.prizesSummary,
            organizerId: organizerUser.id,
            phase: hackathonData.phase
          }
        });

        // Phase'ı lifecycle'a göre güncelle
        const lifecycle = computeHackathonPhase(hackathon);
        if (hackathon.phase !== lifecycle.derivedPhase) {
          await db.hackathon.update({
            where: { id: hackathon.id },
            data: { phase: lifecycle.derivedPhase }
          });
        }

        created.push(hackathon.slug);
      } catch (error: any) {
        errors.push(`${hackathonData.slug}: ${error.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      message: `${created.length} adet hackathon başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating hackathons:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "Hackathonlar oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

