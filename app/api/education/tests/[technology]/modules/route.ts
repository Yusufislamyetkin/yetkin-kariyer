import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { normalizeTechnologyName, compareTechnologyNames, routeToTechnology } from "@/lib/utils/technology-normalize";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";

interface Module {
  id: string;
  title: string;
  description: string | null;
  testCount: number;
}

export async function GET(
  request: Request,
  { params }: { params: { technology: string } }
) {
  try {
    // Route parametresi "tests-net-core" formatında geliyor, önce decode edip sonra routeToTechnology ile teknoloji adını çıkar
    const decodedRoute = decodeURIComponent(params.technology);
    const technologyName = routeToTechnology(decodedRoute); // "tests-net-core" -> "net core"
    const normalizedDecodedTechnology = normalizeTechnologyName(technologyName); // "net core" -> "net core"

    // TEST_MODULE_FILE_MAP'ten teknoloji adına göre dosya adını bul ve gerçek teknoloji adını sakla
    let fileName: string | undefined;
    let actualTechnologyName: string | undefined;
    for (const [techName, file] of Object.entries(TEST_MODULE_FILE_MAP)) {
      const normalizedTechName = normalizeTechnologyName(techName);
      if (compareTechnologyNames(normalizedTechName, normalizedDecodedTechnology)) {
        fileName = file;
        actualTechnologyName = techName; // Gerçek teknoloji adını sakla (örn: "React", ".NET Core")
        break;
      }
    }

    if (!fileName) {
      console.error(`[MODULES_API] Technology not found. Route param: "${params.technology}", Decoded route: "${decodedRoute}", Technology name: "${technologyName}", Normalized: "${normalizedDecodedTechnology}"`);
      console.error(`[MODULES_API] Available technologies:`, Object.keys(TEST_MODULE_FILE_MAP).map(k => `${k} -> ${normalizeTechnologyName(k)}`));
      return NextResponse.json(
        { error: "Teknoloji bulunamadı" },
        { status: 404 }
      );
    }

    // JSON dosyasını oku
    const jsonPath = join(process.cwd(), "data", "test-modules", fileName);
    
    let testContent: any;
    try {
      const jsonContent = readFileSync(jsonPath, "utf-8");
      testContent = JSON.parse(jsonContent);
    } catch (fileError: any) {
      console.error(`[MODULES_API] Error reading file ${fileName}:`, fileError.message);
      return NextResponse.json(
        { error: "Test modül dosyası okunamadı" },
        { status: 500 }
      );
    }

    // Modülleri JSON'dan çıkar
    const modules: Module[] = [];
    
    if (testContent.modules && Array.isArray(testContent.modules)) {
      for (const moduleItem of testContent.modules) {
        if (!moduleItem.id || !moduleItem.title) continue;

        // Test sayısı = bu modülün relatedTests array uzunluğu
        const testCount = moduleItem.relatedTests && Array.isArray(moduleItem.relatedTests) 
          ? moduleItem.relatedTests.length 
          : 0;

        modules.push({
          id: moduleItem.id,
          title: moduleItem.title,
          description: moduleItem.summary || null,
          testCount,
        });
      }
    }

    return NextResponse.json({
      technology: actualTechnologyName || technologyName, // Gerçek teknoloji adını döndür
      modules,
    });
  } catch (error: any) {
    console.error("[MODULES_API] Error fetching modules:", error);
    return NextResponse.json(
      { error: error.message || "Modüller yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

