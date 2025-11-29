import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // JSON dosyasını oku
    const filePath = join(process.cwd(), "data", "cv-templates.json");
    const fileContent = await readFile(filePath, "utf-8");
    const templates = JSON.parse(fileContent);

    if (!Array.isArray(templates)) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı. Şablonlar bir dizi olmalıdır." },
        { status: 400 }
      );
    }

    const created: string[] = [];
    const updated: string[] = [];
    const errors: string[] = [];

    // Her şablonu veritabanına ekle veya güncelle
    for (const templateData of templates) {
      try {
        // Gerekli alanları kontrol et
        if (!templateData.id || !templateData.name || !templateData.structure) {
          errors.push(`${templateData.id || "unknown"}: Eksik alanlar (id, name veya structure)`);
          continue;
        }

        // Mevcut şablonu kontrol et
        const existingTemplate = await db.cVTemplate.findUnique({
          where: { id: templateData.id }
        });

        if (existingTemplate) {
          // Güncelle
          await db.cVTemplate.update({
            where: { id: templateData.id },
            data: {
              name: templateData.name,
              preview: templateData.preview || null,
              structure: templateData.structure,
            }
          });
          updated.push(templateData.id);
        } else {
          // Yeni oluştur
          await db.cVTemplate.create({
            data: {
              id: templateData.id,
              name: templateData.name,
              preview: templateData.preview || null,
              structure: templateData.structure,
            }
          });
          created.push(templateData.id);
        }
      } catch (error: any) {
        errors.push(`${templateData.id || "unknown"}: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created: created.length,
      updated: updated.length,
      message: `${created.length} adet şablon oluşturuldu, ${updated.length} adet şablon güncellendi${errors.length > 0 ? `, ${errors.length} hata oluştu` : ""}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Error seeding CV templates:", error);
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        updated: 0,
        error: error.message || "CV şablonları yüklenirken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

