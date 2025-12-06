import { db } from "@/lib/db";
import { NEWS_SOURCES, NewsSource, getSourcesByExpertise } from "./news-sources";

/**
 * Bot'un kullanmadığı haber kaynaklarını getir
 */
export async function getUnusedSources(
  userId: string,
  expertise?: string[]
): Promise<NewsSource[]> {
  try {
    // Bot'un kullandığı kaynakları getir
    const usedSources = await db.botNewsSource.findMany({
      where: {
        botId: userId,
      },
      select: {
        sourceId: true,
      },
    });

    const usedSourceIds = new Set(usedSources.map((s: { sourceId: string }) => s.sourceId));

    // Tüm kaynakları getir (expertise'e göre filtrelenmiş)
    let availableSources: NewsSource[];
    if (expertise && expertise.length > 0) {
      availableSources = getSourcesByExpertise(expertise);
    } else {
      availableSources = NEWS_SOURCES;
    }

    // Kullanılmayan kaynakları filtrele
    const unusedSources = availableSources.filter(
      (source) => !usedSourceIds.has(source.id)
    );

    return unusedSources;
  } catch (error: any) {
    console.error("[BOT_NEWS_TRACKER] Error getting unused sources:", error);
    // Hata durumunda tüm kaynakları döndür
    return expertise && expertise.length > 0
      ? getSourcesByExpertise(expertise)
      : NEWS_SOURCES;
  }
}

/**
 * Kaynağı kullanıldı olarak işaretle
 */
export async function markSourceAsUsed(
  userId: string,
  sourceId: string
): Promise<void> {
  try {
    await db.botNewsSource.upsert({
      where: {
        botId_sourceId: {
          botId: userId,
          sourceId: sourceId,
        },
      },
      create: {
        botId: userId,
        sourceId: sourceId,
        usedAt: new Date(),
      },
      update: {
        usedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error(
      `[BOT_NEWS_TRACKER] Error marking source ${sourceId} as used for bot ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Belirli bir süre sonra kaynakları sıfırla (30 gün)
 * Bu fonksiyon periyodik olarak çalıştırılabilir
 */
export async function resetOldUsedSources(daysOld: number = 30): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await db.botNewsSource.deleteMany({
      where: {
        usedAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `[BOT_NEWS_TRACKER] Reset ${result.count} old news sources (older than ${daysOld} days)`
    );
    return result.count;
  } catch (error: any) {
    console.error("[BOT_NEWS_TRACKER] Error resetting old sources:", error);
    return 0;
  }
}

/**
 * Bot için rastgele bir kullanılmayan kaynak seç
 */
export async function selectRandomUnusedSource(
  userId: string,
  expertise?: string[]
): Promise<NewsSource | null> {
  try {
    const unusedSources = await getUnusedSources(userId, expertise);

    if (unusedSources.length === 0) {
      // Tüm kaynaklar kullanılmış, eski kayıtları temizle ve tekrar dene
      await resetOldUsedSources(30);
      const refreshedSources = await getUnusedSources(userId, expertise);
      if (refreshedSources.length === 0) {
        // Hala kaynak yoksa, rastgele bir kaynak seç (tüm kaynaklar kullanılmış olsa bile)
        const allSources = expertise && expertise.length > 0
          ? getSourcesByExpertise(expertise)
          : NEWS_SOURCES;
        return allSources[Math.floor(Math.random() * allSources.length)] || null;
      }
      return refreshedSources[Math.floor(Math.random() * refreshedSources.length)] || null;
    }

    // Rastgele bir kaynak seç
    return unusedSources[Math.floor(Math.random() * unusedSources.length)] || null;
  } catch (error: any) {
    console.error("[BOT_NEWS_TRACKER] Error selecting random source:", error);
    return null;
  }
}

/**
 * Bot'un kullandığı kaynak sayısını getir
 */
export async function getUsedSourceCount(userId: string): Promise<number> {
  try {
    return await db.botNewsSource.count({
      where: {
        botId: userId,
      },
    });
  } catch (error: any) {
    console.error("[BOT_NEWS_TRACKER] Error getting used source count:", error);
    return 0;
  }
}

