import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

// JSON dosyalarından freelancer proje taleplerini yükle
function loadFreelancerProjectTemplates() {
  const projectFiles = [
    'web-development.json',
    'mobile-development.json',
    'backend-development.json',
    'frontend-development.json',
    'fullstack-development.json',
    'devops.json',
    'data-science.json',
    'ui-ux-design.json',
    'qa-testing.json',
    'blockchain.json'
  ];

  const allProjects: any[] = [];

  for (const file of projectFiles) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'freelancer-projects', file);
      
      // Dosyanın var olup olmadığını kontrol et
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Dosya bulunamadı: ${filePath}`);
        continue;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Dosya boş mu kontrol et
      if (!fileContent || fileContent.trim().length === 0) {
        console.error(`❌ Dosya boş: ${file}`);
        continue;
      }

      const projects = JSON.parse(fileContent);
      
      // JSON'un array olup olmadığını kontrol et
      if (!Array.isArray(projects)) {
        console.error(`❌ ${file} geçerli bir array içermiyor`);
        continue;
      }

      console.log(`✅ ${file}: ${projects.length} adet proje talebi yüklendi`);
      allProjects.push(...projects);
    } catch (error: any) {
      console.error(`❌ Error loading ${file}:`, error);
      console.error(`   Error message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
    }
  }

  console.log(`📊 Toplam ${allProjects.length} adet freelancer proje talebi şablonu yüklendi`);
  return allProjects;
}

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kullanıcıları bul (proje oluşturucular için)
    const users = await db.user.findMany({
      where: {
        role: { in: ["candidate", "employer"] }
      },
      select: { id: true },
      take: 50 // Daha fazla kullanıcı al, 100 proje için yeterli olsun
    });

    if (users.length < 1) {
      return NextResponse.json(
        { error: "Yeterli kullanıcı bulunamadı. En az 1 kullanıcı gerekli." },
        { status: 400 }
      );
    }

    // JSON dosyalarından proje şablonlarını yükle
    const projectTemplates = loadFreelancerProjectTemplates();

    if (projectTemplates.length === 0) {
      return NextResponse.json(
        { error: "Hiç proje şablonu yüklenemedi. JSON dosyalarını kontrol edin." },
        { status: 400 }
      );
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // Projeleri oluştur
    for (let i = 0; i < projectTemplates.length; i++) {
      const template = projectTemplates[i];
      const creatorIndex = i % users.length;
      
      try {
        // Deadline'ı parse et - eğer string ise Date'e çevir
        let deadlineDate: Date | null = null;
        if (template.deadline) {
          if (typeof template.deadline === 'string') {
            deadlineDate = new Date(template.deadline);
          } else {
            deadlineDate = template.deadline;
          }
          
          // Deadline'ın geçmişte olmamasını garanti et (constraint için)
          if (deadlineDate && deadlineDate <= now) {
            // Eğer deadline geçmişteyse, bugünden itibaren 15-90 gün arası rastgele bir tarih ekle
            const daysToAdd = 15 + Math.floor(Math.random() * 75);
            deadlineDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
          }
        }

        const project = await db.freelancerProject.create({
          data: {
            title: template.title,
            description: template.description,
            budget: template.budget || null,
            deadline: deadlineDate,
            status: template.status || "open",
            createdBy: users[creatorIndex].id
          }
        });

        created.push(project.title);
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        errors.push(`${template.title}: ${errorMessage}`);
        console.error(`❌ Error creating project "${template.title}":`, errorMessage);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      total: projectTemplates.length,
      message: `${created.length}/${projectTemplates.length} adet freelancer proje talebi başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating freelancer requests:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "Freelancer proje talepleri oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}
