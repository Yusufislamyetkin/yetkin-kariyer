import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";

interface Technology {
  name: string;
  description: string | null;
  testCount: number;
  moduleCount: number;
}

export async function GET() {
  try {
    const technologies: Technology[] = [];

    // TEST_MODULE_FILE_MAP'i tersine çevir (dosya adı -> teknoloji adı)
    const fileToTechnologyMap = new Map<string, string>();
    for (const [techName, fileName] of Object.entries(TEST_MODULE_FILE_MAP)) {
      // Her teknoloji adı için dosya adını map'le
      // Eğer aynı dosya adına birden fazla teknoloji adı varsa, ilkini kullan
      if (!fileToTechnologyMap.has(fileName)) {
        fileToTechnologyMap.set(fileName, techName);
      }
    }

    // data/test-modules klasöründeki tüm JSON dosyalarını oku
    const testModulesPath = join(process.cwd(), "data", "test-modules");
    
    try {
      const files = readdirSync(testModulesPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      for (const fileName of jsonFiles) {
        try {
          // Dosya adından teknoloji adını bul
          const technologyName = fileToTechnologyMap.get(fileName);
          
          if (!technologyName) {
            // Eğer mapping'de yoksa, dosya adından teknoloji adını türet
            console.warn(`[TECHNOLOGIES_API] Technology name not found for file: ${fileName}, skipping...`);
            continue;
          }

          // JSON dosyasını oku
          const jsonPath = join(testModulesPath, fileName);
          const jsonContent = readFileSync(jsonPath, "utf-8");
          const testContent = JSON.parse(jsonContent);

          // Description'ı al
          const description = testContent.overview?.description || null;

          // Modül sayısını hesapla
          const moduleCount = testContent.modules && Array.isArray(testContent.modules) 
            ? testContent.modules.length 
            : 0;

          // Test sayısını hesapla: Tüm modüllerin relatedTests array uzunluklarının toplamı
          let testCount = 0;
          if (testContent.modules && Array.isArray(testContent.modules)) {
            for (const moduleItem of testContent.modules) {
              if (moduleItem.relatedTests && Array.isArray(moduleItem.relatedTests)) {
                testCount += moduleItem.relatedTests.length;
              }
            }
          }

          technologies.push({
            name: technologyName,
            description,
            testCount,
            moduleCount,
          });
        } catch (fileError: any) {
          // JSON dosyası okunamazsa veya hatalıysa, o teknolojiyi atla
          console.error(`[TECHNOLOGIES_API] Error reading file ${fileName}:`, fileError.message);
          continue;
        }
      }
    } catch (dirError: any) {
      console.error("[TECHNOLOGIES_API] Error reading test-modules directory:", dirError.message);
      return NextResponse.json(
        { error: "Test modül klasörü okunamadı" },
        { status: 500 }
      );
    }

    // Teknolojileri isme göre sırala
    technologies.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      technologies,
    });
  } catch (error: any) {
    console.error("[TECHNOLOGIES_API] Error fetching technologies:", error);
    return NextResponse.json(
      { error: error.message || "Teknolojiler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

