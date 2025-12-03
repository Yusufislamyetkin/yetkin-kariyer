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
        description: "Yapay zeka ve makine öğrenmesi teknolojilerinin günümüzdeki önemi her geçen gün artmaktadır. Bu hackathon, katılımcıların AI teknolojilerini kullanarak gerçek dünya problemlerine yenilikçi çözümler geliştirmelerini hedeflemektedir. Katılımcılar, makine öğrenmesi algoritmaları, doğal dil işleme, bilgisayarlı görü ve derin öğrenme gibi alanlarda projeler geliştirebileceklerdir.\n\nHackathon süresince, katılımcılar modern AI framework'leri ve kütüphaneleri kullanarak pratik deneyim kazanacaklar. Projeler, iş dünyasındaki gerçek problemlere odaklanarak hem teknik hem de iş değeri yaratmayı amaçlamaktadır. Ayrıca, mentor desteği ve teknik workshop'lar ile katılımcıların bilgi birikimlerini artırmaları sağlanacaktır.\n\nBu etkinlik, yapay zeka alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, sektördeki önde gelen şirketler tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Blockchain teknolojisi ve Web3 ekosistemi, dijital dünyanın geleceğini şekillendiren en önemli teknolojilerden biridir. Bu hackathon, katılımcıların merkeziyetsiz uygulamalar (dApps), DeFi protokolleri, NFT projeleri ve DAO yapıları geliştirmelerini teşvik etmektedir. Katılımcılar, Ethereum, Polygon, Solana gibi blockchain ağları üzerinde çalışabileceklerdir.\n\nHackathon boyunca, akıllı kontrat geliştirme, tokenomics tasarımı, frontend entegrasyonu ve güvenlik best practice'leri gibi konularda eğitimler verilecektir. Projeler, gerçek kullanım senaryolarına odaklanarak Web3 ekosistemine değer katmayı hedeflemektedir. Ayrıca, sektörden uzman mentorlar katılımcılara rehberlik edecektir.\n\nBu etkinlik, blockchain ve Web3 alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Kazanan projeler, yatırımcılar ve blockchain şirketleri tarafından değerlendirilecek ve potansiyel ortaklık fırsatları sunulacaktır.",
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
        description: "Sürdürülebilirlik ve çevre teknolojileri, günümüzün en kritik konularından biridir. Bu hackathon, katılımcıların iklim değişikliği, enerji verimliliği, atık yönetimi ve yeşil teknolojiler alanlarında çözümler geliştirmelerini hedeflemektedir. Katılımcılar, IoT sensörleri, data analytics, renewable energy sistemleri ve circular economy çözümleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, sürdürülebilirlik uzmanları ve çevre teknolojileri alanında deneyimli mentorlar katılımcılara rehberlik edecektir. Projeler, gerçek dünya problemlerine odaklanarak hem çevresel hem de ekonomik değer yaratmayı amaçlamaktadır. Ayrıca, sürdürülebilirlik metrikleri ve impact measurement konularında eğitimler verilecektir.\n\nBu etkinlik, çevre teknolojileri ve sürdürülebilirlik alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, çevre organizasyonları ve yeşil teknoloji şirketleri tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
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
        description: "Mobil uygulama geliştirme, günümüzün en dinamik ve hızlı büyüyen teknoloji alanlarından biridir. Bu hackathon, katılımcıların iOS, Android ve cross-platform çözümler geliştirmelerini teşvik etmektedir. Katılımcılar, React Native, Flutter, Swift, Kotlin gibi modern teknolojileri kullanarak kullanıcı deneyimi odaklı uygulamalar geliştirebileceklerdir.\n\nHackathon boyunca, mobil uygulama tasarım prensipleri, performans optimizasyonu, API entegrasyonu ve kullanıcı testleri gibi konularda eğitimler verilecektir. Projeler, gerçek kullanıcı ihtiyaçlarına odaklanarak hem teknik hem de kullanıcı deneyimi açısından değer yaratmayı hedeflemektedir. Ayrıca, mobil geliştirme uzmanları katılımcılara mentorluk yapacaktır.\n\nBu etkinlik, mobil uygulama geliştirme alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Kazanan projeler, mobil uygulama şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Veri bilimi ve analitik, modern iş dünyasının en değerli yetkinliklerinden biridir. Bu hackathon, katılımcıların machine learning, data visualization, predictive analytics ve big data çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, Python, R, SQL gibi araçları kullanarak gerçek veri setleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, veri ön işleme, feature engineering, model seçimi ve değerlendirme gibi konularda eğitimler verilecektir. Projeler, gerçek iş problemlerine odaklanarak hem teknik hem de iş değeri yaratmayı amaçlamaktadır. Ayrıca, veri bilimi uzmanları katılımcılara mentorluk yapacak ve best practice'leri paylaşacaktır.\n\nBu etkinlik, veri bilimi alanında kariyer yapmak isteyen analistler ve geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, veri odaklı şirketler tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Bulut altyapısı ve DevOps, modern yazılım geliştirmenin temel taşlarından biridir. Bu hackathon, katılımcıların AWS, Azure, GCP gibi bulut platformlarında çözümler geliştirmelerini hedeflemektedir. Katılımcılar, containerization, microservices mimarileri, CI/CD pipeline'ları ve infrastructure as code gibi konularda projeler geliştirebileceklerdir.\n\nHackathon boyunca, bulut mimarisi tasarımı, güvenlik best practice'leri, cost optimization ve scalability konularında eğitimler verilecektir. Projeler, gerçek iş senaryolarına odaklanarak hem teknik hem de operasyonel değer yaratmayı hedeflemektedir. Ayrıca, DevOps uzmanları katılımcılara mentorluk yapacaktır.\n\nBu etkinlik, bulut ve DevOps alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Kazanan projeler, bulut şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "E-ticaret ve dijital pazarlama, günümüzün en hızlı büyüyen sektörlerinden biridir. Bu hackathon, katılımcıların e-ticaret platformları, ödeme sistemleri, envanter yönetimi ve müşteri deneyimi çözümleri geliştirmelerini teşvik etmektedir. Katılımcılar, modern web teknolojileri, API entegrasyonları ve UX/UI tasarımı üzerinde çalışabileceklerdir.\n\nHackathon süresince, e-ticaret platform mimarisi, ödeme güvenliği, performans optimizasyonu ve conversion rate optimization gibi konularda eğitimler verilecektir. Projeler, gerçek müşteri ihtiyaçlarına odaklanarak hem teknik hem de iş değeri yaratmayı amaçlamaktadır. Ayrıca, e-ticaret uzmanları katılımcılara rehberlik edecektir.\n\nBu etkinlik, e-ticaret ve dijital pazarlama alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, e-ticaret şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Artırılmış ve sanal gerçeklik teknolojileri, kullanıcı deneyimini köklü bir şekilde değiştiren yenilikçi teknolojilerdir. Bu hackathon, katılımcıların Unity, Unreal Engine gibi oyun motorlarını kullanarak immersive deneyimler oluşturmalarını hedeflemektedir. Katılımcılar, 3D modeling, spatial computing, haptic feedback ve mixed reality uygulamaları geliştirebileceklerdir.\n\nHackathon boyunca, VR/AR geliştirme best practice'leri, performans optimizasyonu, kullanıcı deneyimi tasarımı ve platform entegrasyonu gibi konularda eğitimler verilecektir. Projeler, gerçek kullanım senaryolarına odaklanarak hem teknik hem de kullanıcı deneyimi açısından değer yaratmayı hedeflemektedir. Ayrıca, VR/AR uzmanları katılımcılara mentorluk yapacaktır.\n\nBu etkinlik, immersive teknolojiler alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Kazanan projeler, VR/AR şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Sosyal etki yaratan teknolojiler, toplumsal problemlere çözüm bulmak için teknolojinin gücünü kullanan projelerdir. Bu hackathon, katılımcıların accessibility, sosyal iyilik, topluluk oluşturma ve insani yardım teknolojileri geliştirmelerini teşvik etmektedir. Katılımcılar, kapsayıcı tasarım, sosyal ağlar, eğitim teknolojileri ve sağlık çözümleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, sosyal etki ölçümü, kullanıcı merkezli tasarım, sürdürülebilirlik ve ölçeklenebilirlik konularında eğitimler verilecektir. Projeler, gerçek toplumsal ihtiyaçlara odaklanarak hem teknik hem de sosyal değer yaratmayı amaçlamaktadır. Ayrıca, sosyal girişimcilik uzmanları katılımcılara rehberlik edecektir.\n\nBu etkinlik, sosyal etki teknolojileri alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, sosyal girişimler ve sivil toplum kuruluşları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
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
        description: "Otomasyon ve robotik, endüstriyel ve ticari uygulamalarda devrim yaratan teknolojilerdir. Bu hackathon, katılımcıların IoT sensörleri, otomasyon sistemleri, robotik programlama ve akıllı üretim çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, embedded systems, mekatronik, kontrol sistemleri ve endüstriyel IoT üzerinde çalışabileceklerdir.\n\nHackathon boyunca, robotik programlama, sensör entegrasyonu, güvenlik protokolleri ve sistem optimizasyonu gibi konularda eğitimler verilecektir. Projeler, gerçek endüstriyel ihtiyaçlara odaklanarak hem teknik hem de operasyonel değer yaratmayı hedeflemektedir. Ayrıca, otomasyon ve robotik uzmanları katılımcılara mentorluk yapacaktır.\n\nBu etkinlik, otomasyon ve robotik alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için ideal bir platformdur. Kazanan projeler, endüstriyel şirketler ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Finansal teknolojiler, modern bankacılık ve ödeme sistemlerini dönüştüren en önemli sektörlerden biridir. Bu hackathon, katılımcıların ödeme sistemleri, blockchain teknolojileri, güvenlik çözümleri ve dijital bankacılık uygulamaları geliştirmelerini hedeflemektedir. Katılımcılar, API entegrasyonları, kriptografi, fraud detection ve kullanıcı deneyimi tasarımı üzerinde çalışabileceklerdir.\n\nHackathon boyunca, finansal teknoloji best practice'leri, güvenlik protokolleri, regulatory compliance ve ölçeklenebilirlik konularında eğitimler verilecektir. Projeler, gerçek finansal ihtiyaçlara odaklanarak hem teknik hem de iş değeri yaratmayı hedeflemektedir. Ayrıca, FinTech uzmanları katılımcılara mentorluk yapacaktır.\n\nBu etkinlik, finansal teknolojiler alanında kariyer yapmak isteyen geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, FinTech şirketleri ve yatırımcılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Sağlık teknolojileri, modern tıbbın dönüşümünde kritik bir rol oynamaktadır. Bu hackathon, katılımcıların telemedicine, AI diagnostics, patient care ve sağlık yönetimi çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, hasta takip sistemleri, teletıp platformları, AI destekli tanı araçları ve sağlık verisi analizi üzerinde çalışabileceklerdir.\n\nHackathon boyunca, sağlık teknolojisi uzmanları ve tıp profesyonelleri katılımcılara mentorluk yapacaktır. Projeler, gerçek sağlık ihtiyaçlarına odaklanarak hem teknik hem de tıbbi değer yaratmayı hedeflemektedir. Ayrıca, sağlık verisi güvenliği, HIPAA compliance ve kullanıcı deneyimi tasarımı konularında eğitimler verilecektir.\n\nBu etkinlik, sağlık teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve sağlık profesyonelleri için mükemmel bir fırsattır. Kazanan projeler, sağlık kurumları ve teknoloji şirketleri tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Eğitim teknolojileri alanında yenilikçi çözümler geliştirin. Online learning, gamification, AI tutoring ve daha fazlası.",
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
        description: "Full stack web uygulamaları geliştirin. React, Node.js, databases, API design ve modern web teknolojileri.",
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
        description: "Siber güvenlik savunma stratejileri geliştirin. Threat detection, incident response, security monitoring ve penetration testing.",
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
        description: "Yapay zeka destekli chatbot ve conversational AI çözümleri. NLP, machine learning, natural language understanding.",
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
        description: "DeFi protokolleri ve blockchain çözümleri geliştirin. Smart contracts, DEX, lending protocols ve Web3 integration.",
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
        description: "Akıllı ev çözümleri ve IoT cihazları geliştirin. Home automation, sensor integration, energy management ve smart appliances.",
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
        description: "Oyun geliştirme ve game design. Unity, Unreal Engine, game mechanics, multiplayer systems ve game analytics.",
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
        description: "Startup'lar için teknolojik çözümler geliştirin. MVP development, product-market fit, scaling strategies ve business models.",
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
        description: "Siber güvenlik, dijital dünyanın en kritik konularından biridir. Bu hackathon, katılımcıların penetration testing, security auditing, threat detection ve güvenlik çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, network security, application security, cryptography ve incident response gibi alanlarda projeler geliştirebileceklerdir.\n\nHackathon boyunca, siber güvenlik uzmanları ve ethical hacker'lar katılımcılara mentorluk yapacaktır. Projeler, gerçek güvenlik tehditlerine odaklanarak hem teknik hem de pratik değer yaratmayı hedeflemektedir. Ayrıca, güvenlik best practice'leri, vulnerability assessment ve security architecture konularında eğitimler verilecektir.\n\nBu etkinlik, siber güvenlik alanında kariyer yapmak isteyen geliştiriciler ve güvenlik uzmanları için mükemmel bir fırsattır. Kazanan projeler, güvenlik şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Nesnelerin İnterneti ve akıllı şehir teknolojileri, modern kentleşmenin geleceğini şekillendiren en önemli teknolojilerden biridir. Bu hackathon, katılımcıların sensor networks, data analytics, urban planning ve akıllı şehir çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, IoT platformları, edge computing, real-time data processing ve city management sistemleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, akıllı şehir uzmanları ve IoT mühendisleri katılımcılara rehberlik edecektir. Projeler, gerçek şehir problemlerine odaklanarak hem teknik hem de sosyal değer yaratmayı hedeflemektedir. Ayrıca, IoT güvenliği, data privacy ve scalability konularında eğitimler verilecektir.\n\nBu etkinlik, IoT ve akıllı şehir teknolojileri alanında kariyer yapmak isteyen geliştiriciler için ideal bir platformdur. Kazanan projeler, belediyeler ve teknoloji şirketleri tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
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
        description: "Oyun geliştirme, yaratıcılık ve teknolojinin birleştiği en dinamik alanlardan biridir. Bu hackathon, katılımcıların Unity, Unreal Engine gibi oyun motorlarını kullanarak yaratıcı oyun projeleri geliştirmelerini hedeflemektedir. Katılımcılar, game mechanics, multiplayer systems, VR/AR entegrasyonu ve game analytics üzerinde çalışabileceklerdir.\n\nHackathon boyunca, oyun geliştirme uzmanları ve game designer'lar katılımcılara mentorluk yapacaktır. Projeler, yenilikçi oyun mekanikleri ve kullanıcı deneyimi odaklı olarak hem teknik hem de yaratıcı değer yaratmayı hedeflemektedir. Ayrıca, oyun tasarım prensipleri, performans optimizasyonu ve monetization stratejileri konularında eğitimler verilecektir.\n\nBu etkinlik, oyun geliştirme alanında kariyer yapmak isteyen geliştiriciler ve tasarımcılar için mükemmel bir fırsattır. Kazanan projeler, oyun şirketleri ve yayıncılar tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "İleri seviye makine öğrenmesi, yapay zekanın en gelişmiş dallarından biridir. Bu hackathon, katılımcıların deep learning, neural networks, computer vision ve NLP çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, TensorFlow, PyTorch gibi framework'leri kullanarak karmaşık ML modelleri oluşturabileceklerdir.\n\nHackathon süresince, makine öğrenmesi uzmanları ve data scientist'ler katılımcılara rehberlik edecektir. Projeler, gerçek dünya problemlerine odaklanarak hem teknik hem de bilimsel değer yaratmayı hedeflemektedir. Ayrıca, model optimizasyonu, transfer learning ve MLOps konularında eğitimler verilecektir.\n\nBu etkinlik, makine öğrenmesi alanında uzmanlaşmak isteyen geliştiriciler ve araştırmacılar için ideal bir platformdur. Kazanan projeler, AI şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Kuantum hesaplama, bilgisayar biliminin en ileri teknolojilerinden biridir. Bu hackathon, katılımcıların quantum algorithms, quantum machine learning ve quantum cryptography çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, Qiskit, Cirq gibi quantum framework'leri kullanarak kuantum programları yazabileceklerdir.\n\nHackathon boyunca, kuantum hesaplama uzmanları ve fizikçiler katılımcılara mentorluk yapacaktır. Projeler, gerçek kuantum problemlerine odaklanarak hem teknik hem de bilimsel değer yaratmayı hedeflemektedir. Ayrıca, kuantum algoritma tasarımı, quantum error correction ve quantum simulation konularında eğitimler verilecektir.\n\nBu etkinlik, kuantum hesaplama alanında kariyer yapmak isteyen geliştiriciler ve araştırmacılar için mükemmel bir fırsattır. Kazanan projeler, kuantum şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Biyoteknoloji ve sağlık inovasyonu, insan sağlığını iyileştirmek için teknolojinin gücünü kullanan en önemli alanlardan biridir. Bu hackathon, katılımcıların genomics, personalized medicine, bioinformatics ve health data analytics çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, DNA analizi, protein yapısı tahmini, ilaç keşfi ve sağlık verisi analizi üzerinde çalışabileceklerdir.\n\nHackathon boyunca, biyoteknoloji uzmanları ve sağlık teknolojisi araştırmacıları katılımcılara mentorluk yapacaktır. Projeler, gerçek sağlık problemlerine odaklanarak hem teknik hem de tıbbi değer yaratmayı hedeflemektedir. Ayrıca, biyoinformatik araçları, veri güvenliği ve etik konularında eğitimler verilecektir.\n\nBu etkinlik, biyoteknoloji ve sağlık teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve araştırmacılar için mükemmel bir fırsattır. Kazanan projeler, biyoteknoloji şirketleri ve sağlık kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Uzay teknolojileri ve aerospace, insanlığın geleceğini şekillendiren en heyecan verici alanlardan biridir. Bu hackathon, katılımcıların satellite systems, space data analytics, rocket science ve space exploration çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, uydu yörünge hesaplamaları, uzay verisi işleme, roket simülasyonları ve uzay görev planlama sistemleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, uzay mühendisleri ve aerospace uzmanları katılımcılara rehberlik edecektir. Projeler, gerçek uzay problemlerine odaklanarak hem teknik hem de bilimsel değer yaratmayı hedeflemektedir. Ayrıca, uzay verisi analizi, yörünge mekaniği ve uzay görev güvenliği konularında eğitimler verilecektir.\n\nBu etkinlik, uzay teknolojileri ve aerospace alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için ideal bir platformdur. Kazanan projeler, uzay şirketleri ve araştırma kurumları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Tarım teknolojileri ve akıllı tarım, gıda güvenliği ve sürdürülebilir tarım için kritik öneme sahiptir. Bu hackathon, katılımcıların precision farming, crop monitoring, agricultural IoT ve farm automation çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, drone teknolojileri, sensör ağları, tarım verisi analizi ve otomatik sulama sistemleri üzerinde çalışabileceklerdir.\n\nHackathon boyunca, tarım teknolojisi uzmanları ve agronomist'ler katılımcılara mentorluk yapacaktır. Projeler, gerçek tarım problemlerine odaklanarak hem teknik hem de tarımsal değer yaratmayı hedeflemektedir. Ayrıca, precision agriculture, veri analizi ve sürdürülebilir tarım konularında eğitimler verilecektir.\n\nBu etkinlik, tarım teknolojileri alanında kariyer yapmak isteyen geliştiriciler ve mühendisler için mükemmel bir fırsattır. Kazanan projeler, tarım şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
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
        description: "Metaverse ve sanal dünyalar, dijital deneyimlerin geleceğini şekillendiren en yenilikçi teknolojilerden biridir. Bu hackathon, katılımcıların virtual worlds, avatars, digital assets, VR/AR integration ve social platforms geliştirmelerini hedeflemektedir. Katılımcılar, 3D modelleme, fizik simülasyonları, blockchain entegrasyonu ve sosyal etkileşim sistemleri üzerinde çalışabileceklerdir.\n\nHackathon süresince, metaverse uzmanları ve VR/AR geliştiricileri katılımcılara rehberlik edecektir. Projeler, gerçek kullanıcı deneyimlerine odaklanarak hem teknik hem de yaratıcı değer yaratmayı hedeflemektedir. Ayrıca, 3D grafik programlama, network synchronization ve kullanıcı deneyimi tasarımı konularında eğitimler verilecektir.\n\nBu etkinlik, metaverse ve sanal dünyalar alanında kariyer yapmak isteyen geliştiriciler ve tasarımcılar için ideal bir platformdur. Kazanan projeler, metaverse şirketleri ve teknoloji firmaları tarafından değerlendirilecek ve potansiyel iş fırsatları sunulacaktır.",
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
        description: "Temiz enerji teknolojileri, iklim değişikliği ile mücadelede en kritik çözümlerden biridir. Bu hackathon, katılımcıların solar energy, wind power, energy storage ve smart grids çözümleri geliştirmelerini hedeflemektedir. Katılımcılar, yenilenebilir enerji sistemleri, enerji depolama teknolojileri, akıllı şebeke yönetimi ve enerji verimliliği uygulamaları üzerinde çalışabileceklerdir.\n\nHackathon boyunca, enerji mühendisleri ve sürdürülebilirlik uzmanları katılımcılara mentorluk yapacaktır. Projeler, gerçek enerji problemlerine odaklanarak hem teknik hem de çevresel değer yaratmayı hedeflemektedir. Ayrıca, enerji sistemleri tasarımı, grid integration ve enerji ekonomisi konularında eğitimler verilecektir.\n\nBu etkinlik, temiz enerji teknolojileri alanında kariyer yapmak isteyen mühendisler ve geliştiriciler için mükemmel bir fırsattır. Kazanan projeler, enerji şirketleri ve sürdürülebilirlik organizasyonları tarafından değerlendirilecek ve potansiyel pilot proje fırsatları sunulacaktır.",
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

