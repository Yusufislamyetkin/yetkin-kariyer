import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { normalizeTechnologyName, compareTechnologyNames, routeToTechnology } from "@/lib/utils/technology-normalize";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";

interface Test {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  questionCount: number;
  timeLimitMinutes: number | null;
  href: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { technology: string; module: string } }
) {
  try {
    // Route parametresi "tests-net-core" formatında geliyor, önce decode edip sonra routeToTechnology ile teknoloji adını çıkar
    const decodedRoute = decodeURIComponent(params.technology);
    const technologyName = routeToTechnology(decodedRoute); // "tests-net-core" -> "net core"
    const normalizedDecodedTechnology = normalizeTechnologyName(technologyName); // "net core" -> "net core"
    const decodedModule = decodeURIComponent(params.module);

    // TEST_MODULE_FILE_MAP'ten teknoloji adına göre dosya adını bul
    let fileName: string | undefined;
    for (const [techName, file] of Object.entries(TEST_MODULE_FILE_MAP)) {
      const normalizedTechName = normalizeTechnologyName(techName);
      if (compareTechnologyNames(normalizedTechName, normalizedDecodedTechnology)) {
        fileName = file;
        break;
      }
    }

    if (!fileName) {
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
      console.error(`[TESTS_API] Error reading file ${fileName}:`, fileError.message);
      return NextResponse.json(
        { error: "Test modül dosyası okunamadı" },
        { status: 500 }
      );
    }

    // İlgili modülü bul
    if (!testContent.modules || !Array.isArray(testContent.modules)) {
      return NextResponse.json(
        { error: "Modül bulunamadı" },
        { status: 404 }
      );
    }

    const moduleItem = testContent.modules.find((m: any) => m.id === decodedModule);
    
    if (!moduleItem) {
      return NextResponse.json(
        { error: "Modül bulunamadı" },
        { status: 404 }
      );
    }

    // Modülün relatedTests array'inden testleri oluştur
    const tests: Test[] = [];
    
    if (moduleItem.relatedTests && Array.isArray(moduleItem.relatedTests)) {
      for (const testItem of moduleItem.relatedTests) {
        if (!testItem.id || !testItem.title) continue;

        // Modülün durationMinutes'ını timeLimitMinutes olarak kullan
        const timeLimitMinutes = moduleItem.durationMinutes || null;

        tests.push({
          id: testItem.id,
          title: testItem.title,
          description: testItem.description || null,
          level: "intermediate", // Varsayılan seviye, JSON'da yoksa
          questionCount: 0, // JSON'da soru sayısı yok, boş array olarak işaretle
          timeLimitMinutes,
          href: testItem.href || null, // JSON'daki href'i ekle
        });
      }
    }

    return NextResponse.json({
      module: {
        id: moduleItem.id,
        title: moduleItem.title,
        summary: moduleItem.summary || null,
      },
      tests,
    });
  } catch (error: any) {
    console.error("[TESTS_API] Error fetching tests:", error);
    return NextResponse.json(
      { error: error.message || "Testler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

