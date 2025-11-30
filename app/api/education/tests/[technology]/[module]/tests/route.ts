import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { normalizeTechnologyName, compareTechnologyNames, routeToTechnology } from "@/lib/utils/technology-normalize";
import { TEST_MODULE_FILE_MAP } from "@/lib/admin/test-module-files";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

interface Test {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  questionCount: number;
  timeLimitMinutes: number | null;
  href: string | null;
  lastAttemptId?: string | null;
  hasAttempted?: boolean;
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
    
    // Kullanıcı kimlik doğrulaması (opsiyonel - giriş yapmamışsa attempt bilgisi olmayacak)
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (moduleItem.relatedTests && Array.isArray(moduleItem.relatedTests)) {
      for (const testItem of moduleItem.relatedTests) {
        if (!testItem.id || !testItem.title) continue;

        // Tüm testler için sabit 10 dakika süre
        const timeLimitMinutes = 10;

        const testData: Test = {
          id: testItem.id,
          title: testItem.title,
          description: testItem.description || null,
          level: "intermediate", // Varsayılan seviye, JSON'da yoksa
          questionCount: 10, // Tüm testler için sabit 10 soru
          timeLimitMinutes,
          href: testItem.href || null, // JSON'daki href'i ekle
          hasAttempted: false,
          lastAttemptId: null,
        };

        // Kullanıcı giriş yapmışsa, test için quiz attempt'lerini kontrol et
        if (userId) {
          try {
            // Quiz ID'sini oluştur (test submit API'deki mantıkla aynı)
            const normalizedTech = normalizeTechnologyName(technologyName);
            const technologySlug = normalizedTech.replace(/\s+/g, '-');
            const possibleQuizIds = [
              testItem.id, // Direkt test ID
              `test-${technologySlug}-${decodedModule}-${testItem.id}`, // Oluşturulmuş ID
            ];

            // Her olası quiz ID'si için attempt kontrolü yap
            let foundAttempt = null;
            for (const quizId of possibleQuizIds) {
              // Önce quiz attempt'leri kontrol et
              const quizAttempt = await db.quizAttempt.findFirst({
                where: {
                  userId,
                  quizId,
                },
                orderBy: {
                  completedAt: 'desc',
                },
                select: {
                  id: true,
                },
              });

              if (quizAttempt) {
                foundAttempt = quizAttempt;
                break;
              }

              // Quiz attempt bulunamazsa, test attempt'leri üzerinden quiz ID'sini bulmaya çalış
              // Test attempt'lerinde quizId var, bu quizId ile quizAttempt'i bulabiliriz
              const testAttempt = await db.testAttempt.findFirst({
                where: {
                  userId,
                  quizId,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                select: {
                  quizId: true,
                },
              });

              if (testAttempt && testAttempt.quizId) {
                // Test attempt'ten quiz ID'sini al ve quiz attempt'i bul
                const relatedQuizAttempt = await db.quizAttempt.findFirst({
                  where: {
                    userId,
                    quizId: testAttempt.quizId,
                  },
                  orderBy: {
                    completedAt: 'desc',
                  },
                  select: {
                    id: true,
                  },
                });

                if (relatedQuizAttempt) {
                  foundAttempt = relatedQuizAttempt;
                  break;
                }
              }
            }

            if (foundAttempt) {
              testData.hasAttempted = true;
              testData.lastAttemptId = foundAttempt.id;
            }
          } catch (error) {
            console.error(`[TESTS_API] Error checking attempts for test ${testItem.id}:`, error);
            // Hata olsa bile testi listeye ekle, sadece attempt bilgisi olmayacak
          }
        }

        tests.push(testData);
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

