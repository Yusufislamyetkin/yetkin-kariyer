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

    // Admin kullanıcıyı bul
    const adminUser = await db.user.findFirst({
      where: { role: "admin" },
      select: { id: true }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Geçmiş ay hackathonları (10 adet - judgingClosesAt geçmiş ay içinde)
    const pastHackathons = [
      {
        slug: "ai-innovation-2024",
        title: "AI Innovation Hackathon 2024",
        description: "Yapay zeka ve makine öğrenmesi alanında yenilikçi çözümler geliştirin. Bu hackathon, AI teknolojilerini kullanarak gerçek dünya problemlerine çözüm bulmayı hedefliyor.",
        tags: ["ai", "machine-learning", "innovation"],
        applicationOpensAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 74 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 49 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 50.000₺, İkinci: 30.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "web3-blockchain-challenge",
        title: "Web3 & Blockchain Challenge",
        description: "Blockchain teknolojileri ve Web3 ekosisteminde yenilikçi projeler geliştirin. DeFi, NFT, DAO ve daha fazlası.",
        tags: ["blockchain", "web3", "defi", "nft"],
        applicationOpensAt: new Date(now.getTime() - 85 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 69 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 75.000₺, İkinci: 50.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "sustainability-tech-2024",
        title: "Sustainability Tech Hackathon 2024",
        description: "Sürdürülebilirlik ve çevre teknolojileri odaklı çözümler geliştirin. İklim değişikliği, enerji verimliliği ve yeşil teknolojiler.",
        tags: ["sustainability", "green-tech", "climate"],
        applicationOpensAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 64 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 39 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 40.000₺, İkinci: 25.000₺, Üçüncü: 15.000₺"
      },
      {
        slug: "mobile-app-development-2024",
        title: "Mobile App Development Hackathon 2024",
        description: "Mobil uygulama geliştirme alanında yaratıcı projeler. iOS, Android, cross-platform çözümler ve kullanıcı deneyimi odaklı uygulamalar.",
        tags: ["mobile", "ios", "android", "react-native"],
        applicationOpensAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 55.000₺, İkinci: 35.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "data-science-challenge-2024",
        title: "Data Science Challenge 2024",
        description: "Veri bilimi ve analitik alanında uzmanlaşın. Machine learning, data visualization, predictive analytics ve big data çözümleri.",
        tags: ["data-science", "analytics", "python", "r"],
        applicationOpensAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 54 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 60.000₺, İkinci: 40.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "cloud-infrastructure-2024",
        title: "Cloud Infrastructure Hackathon 2024",
        description: "Bulut altyapısı ve DevOps alanında çözümler geliştirin. AWS, Azure, GCP, containerization ve microservices mimarileri.",
        tags: ["cloud", "devops", "aws", "docker", "kubernetes"],
        applicationOpensAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 49 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 65.000₺, İkinci: 45.000₺, Üçüncü: 30.000₺"
      },
      {
        slug: "e-commerce-solutions-2024",
        title: "E-Commerce Solutions Hackathon 2024",
        description: "E-ticaret platformları ve dijital pazarlama çözümleri. Payment integration, inventory management, customer experience.",
        tags: ["ecommerce", "payment", "marketing", "ux"],
        applicationOpensAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 70.000₺, İkinci: 50.000₺, Üçüncü: 30.000₺"
      },
      {
        slug: "ar-vr-experience-2024",
        title: "AR/VR Experience Hackathon 2024",
        description: "Artırılmış ve sanal gerçeklik deneyimleri oluşturun. Unity, Unreal Engine, 3D modeling ve immersive technologies.",
        tags: ["ar", "vr", "unity", "3d", "immersive"],
        applicationOpensAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 39 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 80.000₺, İkinci: 55.000₺, Üçüncü: 35.000₺"
      },
      {
        slug: "social-impact-tech-2024",
        title: "Social Impact Tech Hackathon 2024",
        description: "Sosyal etki yaratan teknolojik çözümler geliştirin. Accessibility, social good, community building ve humanitarian tech.",
        tags: ["social-impact", "accessibility", "community", "nonprofit"],
        applicationOpensAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 45.000₺, İkinci: 30.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "automation-robotics-2024",
        title: "Automation & Robotics Hackathon 2024",
        description: "Otomasyon ve robotik çözümler geliştirin. IoT sensors, automation systems, robotics programming ve smart manufacturing.",
        tags: ["automation", "robotics", "iot", "manufacturing"],
        applicationOpensAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 75.000₺, İkinci: 50.000₺, Üçüncü: 30.000₺"
      }
    ];

    // Bu ay hackathonları (10 adet - application veya submission phase aktif)
    const currentHackathons = [
      {
        slug: "fintech-innovation-2025",
        title: "FinTech Innovation Hackathon 2025",
        description: "Finansal teknolojiler alanında yenilikçi çözümler geliştirin. Ödeme sistemleri, blockchain, güvenlik ve daha fazlası.",
        tags: ["fintech", "payments", "security"],
        applicationOpensAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 60.000₺, İkinci: 40.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "healthcare-tech-challenge",
        title: "Healthcare Tech Challenge",
        description: "Sağlık teknolojileri alanında yenilikçi çözümler geliştirin. Telemedicine, AI diagnostics, patient care ve daha fazlası.",
        tags: ["healthcare", "telemedicine", "ai"],
        applicationOpensAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 43 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 80.000₺, İkinci: 50.000₺, Üçüncü: 30.000₺"
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
        prizesSummary: "Birinci: 45.000₺, İkinci: 30.000₺, Üçüncü: 15.000₺"
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
        prizesSummary: "Birinci: 50.000₺, İkinci: 35.000₺, Üçüncü: 20.000₺"
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
        prizesSummary: "Birinci: 70.000₺, İkinci: 45.000₺, Üçüncü: 30.000₺"
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
        prizesSummary: "Birinci: 55.000₺, İkinci: 40.000₺, Üçüncü: 25.000₺"
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
        prizesSummary: "Birinci: 85.000₺, İkinci: 60.000₺, Üçüncü: 40.000₺"
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
        prizesSummary: "Birinci: 60.000₺, İkinci: 40.000₺, Üçüncü: 25.000₺"
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
        prizesSummary: "Birinci: 65.000₺, İkinci: 45.000₺, Üçüncü: 30.000₺"
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
        prizesSummary: "Birinci: 75.000₺, İkinci: 50.000₺, Üçüncü: 35.000₺"
      }
    ];

    // Gelecek ay hackathonları (10 adet - applicationOpensAt gelecek ay içinde)
    const futureHackathons = [
      {
        slug: "cybersecurity-challenge-2025",
        title: "Cybersecurity Challenge 2025",
        description: "Siber güvenlik alanında uzmanlaşın. Penetration testing, security auditing, threat detection ve daha fazlası.",
        tags: ["cybersecurity", "pentesting", "security"],
        applicationOpensAt: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 62 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 63 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 92 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 93 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 107 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 70.000₺, İkinci: 45.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "iot-smart-cities-2025",
        title: "IoT & Smart Cities Hackathon 2025",
        description: "Nesnelerin İnterneti ve akıllı şehir çözümleri geliştirin. Sensor networks, data analytics, urban planning ve daha fazlası.",
        tags: ["iot", "smart-cities", "sensors"],
        applicationOpensAt: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 66 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 95 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 96 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 110 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 55.000₺, İkinci: 35.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "gaming-development-2025",
        title: "Gaming Development Hackathon 2025",
        description: "Oyun geliştirme alanında yaratıcı projeler geliştirin. Game engines, multiplayer, VR/AR ve daha fazlası.",
        tags: ["gaming", "game-dev", "unity", "unreal"],
        applicationOpensAt: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 68 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 69 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 98 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 99 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 113 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 65.000₺, İkinci: 40.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "machine-learning-advanced-2025",
        title: "Advanced Machine Learning Hackathon 2025",
        description: "İleri seviye makine öğrenmesi projeleri. Deep learning, neural networks, computer vision ve NLP çözümleri.",
        tags: ["machine-learning", "deep-learning", "neural-networks", "computer-vision"],
        applicationOpensAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 71 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 101 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 115 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 90.000₺, İkinci: 65.000₺, Üçüncü: 45.000₺"
      },
      {
        slug: "quantum-computing-2025",
        title: "Quantum Computing Hackathon 2025",
        description: "Kuantum hesaplama ve kuantum algoritmaları. Quantum algorithms, quantum machine learning ve quantum cryptography.",
        tags: ["quantum", "quantum-computing", "algorithms", "cryptography"],
        applicationOpensAt: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 72 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 73 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 102 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 103 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 117 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 100.000₺, İkinci: 70.000₺, Üçüncü: 50.000₺"
      },
      {
        slug: "biotech-health-2025",
        title: "Biotech & Health Innovation Hackathon 2025",
        description: "Biyoteknoloji ve sağlık inovasyonu. Genomics, personalized medicine, bioinformatics ve health data analytics.",
        tags: ["biotech", "genomics", "health", "bioinformatics"],
        applicationOpensAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 76 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 106 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 85.000₺, İkinci: 60.000₺, Üçüncü: 40.000₺"
      },
      {
        slug: "space-tech-2025",
        title: "Space Technology Hackathon 2025",
        description: "Uzay teknolojileri ve aerospace çözümleri. Satellite systems, space data analytics, rocket science ve space exploration.",
        tags: ["space", "aerospace", "satellite", "exploration"],
        applicationOpensAt: new Date(now.getTime() + 48 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 78 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 79 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 108 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 109 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 123 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 95.000₺, İkinci: 70.000₺, Üçüncü: 50.000₺"
      },
      {
        slug: "agritech-innovation-2025",
        title: "AgriTech Innovation Hackathon 2025",
        description: "Tarım teknolojileri ve akıllı tarım çözümleri. Precision farming, crop monitoring, agricultural IoT ve farm automation.",
        tags: ["agritech", "farming", "agriculture", "precision-farming"],
        applicationOpensAt: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 81 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 110 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 111 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 125 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 70.000₺, İkinci: 50.000₺, Üçüncü: 35.000₺"
      },
      {
        slug: "metaverse-development-2025",
        title: "Metaverse Development Hackathon 2025",
        description: "Metaverse ve sanal dünyalar geliştirin. Virtual worlds, avatars, digital assets, VR/AR integration ve social platforms.",
        tags: ["metaverse", "virtual-worlds", "avatars", "digital-assets"],
        applicationOpensAt: new Date(now.getTime() + 52 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 82 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 83 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 112 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 113 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 127 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 80.000₺, İkinci: 55.000₺, Üçüncü: 40.000₺"
      },
      {
        slug: "clean-energy-tech-2025",
        title: "Clean Energy Tech Hackathon 2025",
        description: "Temiz enerji teknolojileri ve sürdürülebilir çözümler. Solar energy, wind power, energy storage ve smart grids.",
        tags: ["clean-energy", "solar", "wind", "energy-storage"],
        applicationOpensAt: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000),
        applicationClosesAt: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000),
        submissionOpensAt: new Date(now.getTime() + 86 * 24 * 60 * 60 * 1000),
        submissionClosesAt: new Date(now.getTime() + 115 * 24 * 60 * 60 * 1000),
        judgingOpensAt: new Date(now.getTime() + 116 * 24 * 60 * 60 * 1000),
        judgingClosesAt: new Date(now.getTime() + 130 * 24 * 60 * 60 * 1000),
        prizesSummary: "Birinci: 75.000₺, İkinci: 50.000₺, Üçüncü: 35.000₺"
      }
    ];

    const allHackathons = [
      ...pastHackathons.map(h => ({ ...h, phase: HackathonPhase.completed })),
      ...currentHackathons.map(h => ({ ...h, phase: HackathonPhase.applications })),
      ...futureHackathons.map(h => ({ ...h, phase: HackathonPhase.upcoming }))
    ];

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
            organizerId: adminUser.id,
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

