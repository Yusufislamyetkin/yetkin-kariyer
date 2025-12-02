import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";
import fs from "fs";
import path from "path";

// JSON dosyalarından iş ilanlarını yükle
function loadJobTemplates() {
  const jobFiles = [
    'banka-jobs.json',
    'e-ticaret-jobs.json',
    'saglik-jobs.json',
    'finans-jobs.json',
    'egitim-jobs.json',
    'teknoloji-jobs.json',
    'diger-jobs.json'
  ];

  const allJobs: any[] = [];

  for (const file of jobFiles) {
    try {
      const filePath = path.join(process.cwd(), 'app', 'api', 'admin', 'seed-jobs', file);
      
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

      const jobs = JSON.parse(fileContent);
      
      // JSON'un array olup olmadığını kontrol et
      if (!Array.isArray(jobs)) {
        console.error(`❌ ${file} geçerli bir array içermiyor`);
        continue;
      }

      console.log(`✅ ${file}: ${jobs.length} adet iş ilanı yüklendi`);
      allJobs.push(...jobs);
    } catch (error: any) {
      console.error(`❌ Error loading ${file}:`, error);
      console.error(`   Error message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
    }
  }

  console.log(`📊 Toplam ${allJobs.length} adet iş ilanı şablonu yüklendi`);
  return allJobs;
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

    // Employer kullanıcı bul veya admin kullanıcıyı kullan
    let employerUser = await db.user.findFirst({
      where: { role: "employer" },
      select: { id: true }
    });

    // Eğer employer yoksa, admin kullanıcıyı kullan
    if (!employerUser) {
      employerUser = await db.user.findFirst({
        where: { role: "admin" },
        select: { id: true }
      });

      if (!employerUser) {
        return NextResponse.json(
          { error: "İş ilanı oluşturmak için employer veya admin kullanıcı bulunamadı" },
          { status: 404 }
        );
      }
    }

    const now = new Date();
    const created: string[] = [];
    const errors: string[] = [];

    // JSON dosyalarından tüm iş ilanlarını yükle
    const jobTemplates = loadJobTemplates();

    // Eğer hiç iş ilanı yüklenmediyse hata döndür
    if (jobTemplates.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          created: 0,
          error: "Hiç iş ilanı şablonu yüklenemedi. JSON dosyalarını kontrol edin." 
        },
        { status: 400 }
      );
    }

    console.log(`📋 Toplam ${jobTemplates.length} adet iş ilanı şablonu yüklendi`);

    // Mevcut YTK Career iş ilanlarını sil (title'da "YTK Career" geçenler)
    try {
      const deletedJobs = await db.job.deleteMany({
        where: {
          title: {
            contains: "YTK Career",
            mode: "insensitive"
          }
        }
      });
      console.log(`🗑️  ${deletedJobs.count} adet mevcut YTK Career iş ilanı silindi`);
    } catch (deleteError: any) {
      console.error("❌ Mevcut iş ilanları silinirken hata:", deleteError);
      errors.push(`Mevcut iş ilanları silinirken hata: ${deleteError.message}`);
    }

    // İş ilanlarını oluştur
    for (const jobTemplate of jobTemplates) {
      try {
        // Yakın tarihte paylaşılmış (daysAgo gün önce)
        const daysAgo = jobTemplate.daysAgo || Math.floor(Math.random() * 7) + 1;
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        const job = await db.job.create({
          data: {
            employerId: employerUser.id,
            title: jobTemplate.title,
            description: jobTemplate.description,
            requirements: jobTemplate.requirements as any,
            location: jobTemplate.location,
            salary: jobTemplate.salary,
            status: JobStatus.published,
            createdAt: createdAt,
            updatedAt: createdAt
          }
        });

        created.push(job.title);
      } catch (error: any) {
        errors.push(`${jobTemplate.title}: ${error.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      message: `${created.length} adet YTK Career iş ilanı başarıyla oluşturuldu${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error creating jobs:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        error: error.message || "İş ilanları oluşturulurken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}
