import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kullanıcıları bul (proje oluşturucular ve freelancer'lar için)
    const users = await db.user.findMany({
      where: {
        role: { in: ["candidate", "employer"] }
      },
      select: { id: true },
      take: 20
    });

    if (users.length < 2) {
      return NextResponse.json(
        { error: "Yeterli kullanıcı bulunamadı. En az 2 kullanıcı gerekli." },
        { status: 400 }
      );
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Farklı durumlarda freelancer projeleri
    const projectTemplates = [
      // Open (açık) projeler
      {
        title: "E-ticaret Web Sitesi Geliştirme",
        description: "Modern bir e-ticaret web sitesi geliştirmek için freelancer arıyorum. React ve Node.js kullanılacak. Responsive tasarım ve ödeme entegrasyonu gerekli.",
        budget: 15000,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        status: "open"
      },
      {
        title: "Mobil Uygulama Tasarımı",
        description: "iOS ve Android için mobil uygulama tasarımı yapılacak. Figma kullanılacak. Modern ve kullanıcı dostu bir arayüz isteniyor.",
        budget: 8000,
        deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 gün sonra
        status: "open"
      },
      {
        title: "Backend API Geliştirme",
        description: ".NET Core ile RESTful API geliştirilecek. Entity Framework, JWT authentication ve Swagger dokümantasyonu gerekli.",
        budget: 12000,
        deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 gün sonra
        status: "open"
      },
      {
        title: "Database Optimizasyonu",
        description: "Mevcut PostgreSQL veritabanının optimizasyonu yapılacak. Query performansı artırılacak ve index'ler optimize edilecek.",
        budget: 5000,
        deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 gün sonra
        status: "open"
      },
      {
        title: "WordPress Site Kurulumu",
        description: "WordPress ile kurumsal web sitesi kurulacak. Tema özelleştirmesi, plugin kurulumu ve içerik yönetimi gerekli.",
        budget: 6000,
        deadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 gün sonra
        status: "open"
      },
      // In Progress (devam eden) projeler
      {
        title: "React Dashboard Geliştirme",
        description: "Admin paneli için React dashboard geliştiriliyor. Material-UI kullanılıyor. Grafikler ve veri görselleştirme özellikleri ekleniyor.",
        budget: 10000,
        deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 gün sonra
        status: "in_progress"
      },
      {
        title: "Python Web Scraping Script",
        description: "Python ile web scraping scripti yazılıyor. BeautifulSoup ve Selenium kullanılıyor. Veri toplama ve analiz özellikleri ekleniyor.",
        budget: 7000,
        deadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 gün sonra
        status: "in_progress"
      },
      {
        title: "Vue.js Frontend Geliştirme",
        description: "Vue.js ile frontend geliştirme devam ediyor. Vuex state management ve Vue Router kullanılıyor. Component library entegrasyonu yapılıyor.",
        budget: 9000,
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 gün sonra
        status: "in_progress"
      },
      // Completed (tamamlanmış) projeler
      {
        title: "Logo Tasarımı",
        description: "Kurumsal logo tasarımı tamamlandı. Modern ve minimalist bir tasarım yapıldı. Farklı formatlarda dosyalar teslim edildi.",
        budget: 3000,
        deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
        status: "completed"
      },
      {
        title: "SEO Optimizasyonu",
        description: "Web sitesi SEO optimizasyonu tamamlandı. Meta tag'ler, sitemap ve robots.txt dosyaları oluşturuldu. Google Analytics entegrasyonu yapıldı.",
        budget: 4000,
        deadline: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 gün önce
        status: "completed"
      },
      {
        title: "API Dokümantasyonu",
        description: "RESTful API için Swagger dokümantasyonu hazırlandı. Tüm endpoint'ler dokümante edildi ve örnek request/response'lar eklendi.",
        budget: 2500,
        deadline: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
        status: "completed"
      },
      // Cancelled (iptal edilmiş) projeler
      {
        title: "Mobile App Development",
        description: "React Native ile mobil uygulama geliştirme projesi iptal edildi. Bütçe yetersizliği nedeniyle proje sonlandırıldı.",
        budget: 20000,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        status: "cancelled"
      },
      {
        title: "E-commerce Platform",
        description: "Büyük ölçekli e-ticaret platformu projesi iptal edildi. Zamanlama uyuşmazlığı nedeniyle proje sonlandırıldı.",
        budget: 50000,
        deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 gün sonra
        status: "cancelled"
      }
    ];

    // Projeleri oluştur
    for (let i = 0; i < projectTemplates.length; i++) {
      const template = projectTemplates[i];
      const creatorIndex = i % users.length;
      
      try {
        const project = await db.freelancerProject.create({
          data: {
            title: template.title,
            description: template.description,
            budget: template.budget,
            deadline: template.deadline,
            status: template.status,
            createdBy: users[creatorIndex].id
          }
        });

        // Eğer proje in_progress veya completed ise, bir bid ekle (accepted)
        if (template.status === "in_progress" || template.status === "completed") {
          const freelancerIndex = (creatorIndex + 1) % users.length;
          await db.freelancerBid.create({
            data: {
              projectId: project.id,
              userId: users[freelancerIndex].id,
              amount: template.budget! * 0.9, // %10 indirimli teklif
              message: "Projeyi zamanında ve kaliteli bir şekilde tamamlayabilirim. Önceki deneyimlerime dayanarak bu işi yapabileceğime inanıyorum.",
              status: "accepted"
            }
          });
        } else if (template.status === "open") {
          // Open projeler için birkaç pending bid ekle
          const bidCount = Math.min(3, users.length - 1);
          for (let j = 0; j < bidCount; j++) {
            const bidderIndex = (creatorIndex + j + 1) % users.length;
            await db.freelancerBid.create({
              data: {
                projectId: project.id,
                userId: users[bidderIndex].id,
                amount: template.budget! * (0.85 + Math.random() * 0.15), // %85-100 arası rastgele
                message: "Bu projeyi ilgiyle takip ediyorum. Deneyimlerime dayanarak bu işi başarıyla tamamlayabileceğime inanıyorum.",
                status: "pending"
              }
            });
          }
        }

        created.push(project.title);
      } catch (error: any) {
        errors.push(`${template.title}: ${error.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      message: `${created.length} adet freelancer projesi başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating freelancer requests:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "Freelancer projeleri oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

