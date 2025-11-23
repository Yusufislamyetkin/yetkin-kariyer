import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const MIN_MEMBERS_PER_COMMUNITY = 30;

// Topluluk slug'ları (create-course-communities API'sinden)
const COMMUNITY_SLUGS = [
  "dotnet-core-community",
  "java-community",
  "mssql-community",
  "react-community",
  "angular-community",
  "nodejs-community",
  "ai-community",
  "flutter-community",
  "ethical-hacking-community",
  "nextjs-community",
  "docker-kubernetes-community",
  "owasp-community",
];

// Fisher-Yates shuffle algoritması ile rastgele karıştırma
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tüm topluluk gruplarını al (COMMUNITY_SLUGS'e göre)
    const communities = await db.chatGroup.findMany({
      where: {
        slug: { in: COMMUNITY_SLUGS },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (communities.length === 0) {
      return NextResponse.json(
        { error: "Topluluk grubu bulunamadı." },
        { status: 400 }
      );
    }

    // ADIM 1: Tüm topluluklardaki mevcut üyeleri kaldır
    const communityIds = communities.map((c: { id: string }) => c.id);
    const deleteResult = await db.chatGroupMembership.deleteMany({
      where: {
        groupId: { in: communityIds },
      },
    });

    console.log(`[ASSIGN_TO_COMMUNITIES] ${deleteResult.count} mevcut üyelik kaldırıldı.`);

    // ADIM 2: app_users tablosundaki TÜM kullanıcıları al (profileImage filtresi yok)
    const allUsers = await db.user.findMany({
      select: {
        id: true,
      },
    });

    if (allUsers.length === 0) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 400 }
      );
    }

    // ADIM 3: Kullanıcıları rastgele karıştır
    const shuffledUsers = shuffleArray<{ id: string }>(allUsers);

    // ADIM 4: Her topluluk için minimum 30 üye garantisi
    const assignments: Array<{ groupId: string; userIds: string[] }> = [];
    const usedUserIds = new Set<string>();

    // Önce her topluluğa minimum 30 üye ata
    for (const community of communities) {
      const needed = MIN_MEMBERS_PER_COMMUNITY;
      const availableUsers = shuffledUsers.filter(
        (user: { id: string }) => !usedUserIds.has(user.id)
      );

      if (availableUsers.length < needed) {
        // Yeterli kullanıcı yoksa, mevcut kullanıcıları eşit dağıt
        break;
      }

      const selectedUsers = availableUsers.slice(0, needed);
      assignments.push({
        groupId: community.id,
        userIds: selectedUsers.map((u) => u.id),
      });

      selectedUsers.forEach((u) => usedUserIds.add(u.id));
    }

    // ADIM 5: Kalan kullanıcıları eşit şekilde dağıt (round-robin)
    const remainingUsers = shuffledUsers.filter(
      (user) => !usedUserIds.has(user.id)
    );

    let communityIndex = 0;
    for (const user of remainingUsers) {
      const community = communities[communityIndex % communities.length];
      const assignment = assignments.find((a) => a.groupId === community.id);
      
      if (assignment) {
        assignment.userIds.push(user.id);
      } else {
        assignments.push({
          groupId: community.id,
          userIds: [user.id],
        });
      }
      
      communityIndex++;
    }

    // ADIM 6: Veritabanına ekle
    let totalAdded = 0;
    const communityStats: Array<{ name: string; added: number; currentTotal: number }> = [];

    for (const assignment of assignments) {
      if (assignment.userIds.length === 0) continue;

      const community = communities.find((c: { id: string; name: string; slug: string }) => c.id === assignment.groupId);
      const communityName = community?.name || "Bilinmeyen";

      try {
        await db.chatGroupMembership.createMany({
          data: assignment.userIds.map((userId) => ({
            groupId: assignment.groupId,
            userId,
            role: "member",
          })),
          skipDuplicates: true,
        });

        totalAdded += assignment.userIds.length;
        communityStats.push({
          name: communityName,
          added: assignment.userIds.length,
          currentTotal: assignment.userIds.length,
        });
      } catch (error) {
        console.error(
          `[ASSIGN_TO_COMMUNITIES] Error adding members to ${communityName}:`,
          error
        );
      }
    }

    // Tüm topluluklar için istatistikleri hazırla
    const allCommunityStats = communities.map((community: { id: string; name: string; slug: string }) => {
      const stat = communityStats.find((s) => s.name === community.name);
      return {
        name: community.name,
        added: stat?.added || 0,
        currentTotal: stat?.currentTotal || 0,
      };
    });

    // Maksimum üye sayısını hesapla (gerçek dağıtımdan)
    const maxPerCommunity = Math.max(
      ...allCommunityStats.map((stat: { name: string; currentTotal: number; assigned: number }) => stat.currentTotal),
      MIN_MEMBERS_PER_COMMUNITY
    );

    return NextResponse.json({
      success: true,
      message: `${totalAdded} kullanıcı ${communities.length} topluluğa üye edildi.`,
      stats: {
        totalProfiles: allUsers.length,
        totalCommunities: communities.length,
        totalAdded,
        removedMembers: deleteResult.count,
        minPerCommunity: MIN_MEMBERS_PER_COMMUNITY,
        maxPerCommunity,
        communityStats: allCommunityStats,
      },
    });
  } catch (error: any) {
    console.error("[ASSIGN_TO_COMMUNITIES]", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcılar topluluklara atanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

