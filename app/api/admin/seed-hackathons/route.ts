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

    // Geçmiş hackathonlar (completed - 1-3 ay önce bitmiş)
    const pastHackathons = [
      {
        slug: "ai-innovation-2024",
        title: "AI Innovation Hackathon 2024",
        description: "Yapay zeka ve makine öğrenmesi alanında yenilikçi çözümler geliştirin. Bu hackathon, AI teknolojilerini kullanarak gerçek dünya problemlerine çözüm bulmayı hedefliyor.",
        tags: ["ai", "machine-learning", "innovation"],
        applicationOpensAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), // 120 gün önce
        applicationClosesAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 gün önce
        submissionOpensAt: new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000), // 89 gün önce
        submissionClosesAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 gün önce
        judgingOpensAt: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000), // 59 gün önce
        judgingClosesAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 gün önce
        prizesSummary: "Birinci: 50.000₺, İkinci: 30.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "web3-blockchain-challenge",
        title: "Web3 & Blockchain Challenge",
        description: "Blockchain teknolojileri ve Web3 ekosisteminde yenilikçi projeler geliştirin. DeFi, NFT, DAO ve daha fazlası.",
        tags: ["blockchain", "web3", "defi", "nft"],
        applicationOpensAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 gün önce
        applicationClosesAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 gün önce
        submissionOpensAt: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000), // 59 gün önce
        submissionClosesAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 gün önce
        judgingOpensAt: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000), // 29 gün önce
        judgingClosesAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
        prizesSummary: "Birinci: 75.000₺, İkinci: 50.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "sustainability-tech-2024",
        title: "Sustainability Tech Hackathon 2024",
        description: "Sürdürülebilirlik ve çevre teknolojileri odaklı çözümler geliştirin. İklim değişikliği, enerji verimliliği ve yeşil teknolojiler.",
        tags: ["sustainability", "green-tech", "climate"],
        applicationOpensAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 gün önce
        applicationClosesAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 gün önce
        submissionOpensAt: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000), // 44 gün önce
        submissionClosesAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 gün önce
        judgingOpensAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000), // 19 gün önce
        judgingClosesAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
        prizesSummary: "Birinci: 40.000₺, İkinci: 25.000₺, Üçüncü: 15.000₺"
      }
    ];

    // Devam eden hackathonlar
    const ongoingHackathons = [
      {
        slug: "fintech-innovation-2025",
        title: "FinTech Innovation Hackathon 2025",
        description: "Finansal teknolojiler alanında yenilikçi çözümler geliştirin. Ödeme sistemleri, blockchain, güvenlik ve daha fazlası.",
        tags: ["fintech", "payments", "security"],
        applicationOpensAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 gün önce
        applicationClosesAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 gün sonra
        submissionOpensAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 gün sonra
        submissionClosesAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        judgingOpensAt: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000), // 31 gün sonra
        judgingClosesAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 gün sonra
        prizesSummary: "Birinci: 60.000₺, İkinci: 40.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "healthcare-tech-challenge",
        title: "Healthcare Tech Challenge",
        description: "Sağlık teknolojileri alanında yenilikçi çözümler geliştirin. Telemedicine, AI diagnostics, patient care ve daha fazlası.",
        tags: ["healthcare", "telemedicine", "ai"],
        applicationOpensAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
        applicationClosesAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 gün sonra
        submissionOpensAt: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 gün sonra
        submissionClosesAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000), // 40 gün sonra
        judgingOpensAt: new Date(now.getTime() + 41 * 24 * 60 * 60 * 1000), // 41 gün sonra
        judgingClosesAt: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000), // 55 gün sonra
        prizesSummary: "Birinci: 80.000₺, İkinci: 50.000₺, Üçüncü: 30.000₺"
      },
      {
        slug: "edtech-solutions-2025",
        title: "EdTech Solutions Hackathon 2025",
        description: "Eğitim teknolojileri alanında yenilikçi çözümler geliştirin. Online learning, gamification, AI tutoring ve daha fazlası.",
        tags: ["edtech", "education", "learning"],
        applicationOpensAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
        applicationClosesAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 gün sonra
        submissionOpensAt: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 gün sonra
        submissionClosesAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 gün sonra
        judgingOpensAt: new Date(now.getTime() + 46 * 24 * 60 * 60 * 1000), // 46 gün sonra
        judgingClosesAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 gün sonra
        prizesSummary: "Birinci: 45.000₺, İkinci: 30.000₺, Üçüncü: 15.000₺"
      }
    ];

    // Gelecek hackathonlar (upcoming)
    const upcomingHackathons = [
      {
        slug: "cybersecurity-challenge-2025",
        title: "Cybersecurity Challenge 2025",
        description: "Siber güvenlik alanında uzmanlaşın. Penetration testing, security auditing, threat detection ve daha fazlası.",
        tags: ["cybersecurity", "pentesting", "security"],
        applicationOpensAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 gün sonra
        applicationClosesAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 gün sonra
        submissionOpensAt: new Date(now.getTime() + 46 * 24 * 60 * 60 * 1000), // 46 gün sonra
        submissionClosesAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000), // 75 gün sonra
        judgingOpensAt: new Date(now.getTime() + 76 * 24 * 60 * 60 * 1000), // 76 gün sonra
        judgingClosesAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 gün sonra
        prizesSummary: "Birinci: 70.000₺, İkinci: 45.000₺, Üçüncü: 25.000₺"
      },
      {
        slug: "iot-smart-cities-2025",
        title: "IoT & Smart Cities Hackathon 2025",
        description: "Nesnelerin İnterneti ve akıllı şehir çözümleri geliştirin. Sensor networks, data analytics, urban planning ve daha fazlası.",
        tags: ["iot", "smart-cities", "sensors"],
        applicationOpensAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        applicationClosesAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 gün sonra
        submissionOpensAt: new Date(now.getTime() + 61 * 24 * 60 * 60 * 1000), // 61 gün sonra
        submissionClosesAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 gün sonra
        judgingOpensAt: new Date(now.getTime() + 91 * 24 * 60 * 60 * 1000), // 91 gün sonra
        judgingClosesAt: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000), // 105 gün sonra
        prizesSummary: "Birinci: 55.000₺, İkinci: 35.000₺, Üçüncü: 20.000₺"
      },
      {
        slug: "gaming-development-2025",
        title: "Gaming Development Hackathon 2025",
        description: "Oyun geliştirme alanında yaratıcı projeler geliştirin. Game engines, multiplayer, VR/AR ve daha fazlası.",
        tags: ["gaming", "game-dev", "unity", "unreal"],
        applicationOpensAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 gün sonra
        applicationClosesAt: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000), // 75 gün sonra
        submissionOpensAt: new Date(now.getTime() + 76 * 24 * 60 * 60 * 1000), // 76 gün sonra
        submissionClosesAt: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000), // 105 gün sonra
        judgingOpensAt: new Date(now.getTime() + 106 * 24 * 60 * 60 * 1000), // 106 gün sonra
        judgingClosesAt: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000), // 120 gün sonra
        prizesSummary: "Birinci: 65.000₺, İkinci: 40.000₺, Üçüncü: 25.000₺"
      }
    ];

    const allHackathons = [
      ...pastHackathons.map(h => ({ ...h, phase: HackathonPhase.completed })),
      ...ongoingHackathons.map(h => ({ ...h, phase: HackathonPhase.applications })),
      ...upcomingHackathons.map(h => ({ ...h, phase: HackathonPhase.upcoming }))
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

