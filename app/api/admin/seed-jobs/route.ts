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
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jobs = JSON.parse(fileContent);
      allJobs.push(...jobs);
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

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

    console.log(`Toplam ${jobTemplates.length} adet iş ilanı şablonu yüklendi`);

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
