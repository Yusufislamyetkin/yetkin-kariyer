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

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tüm profilleri al (profileImage içeren kullanıcılar)
    const profileUsers = await db.user.findMany({
      where: {
        profileImage: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (profileUsers.length === 0) {
      return NextResponse.json(
        { error: "Profil kullanıcısı bulunamadı." },
        { status: 400 }
      );
    }

    // Tüm topluluk gruplarını al (slug'lara göre veya createdById null olan public gruplar)
    const communities = await db.chatGroup.findMany({
      where: {
        OR: [
          { slug: { in: COMMUNITY_SLUGS } },
          {
            createdById: null,
            visibility: "public",
            slug: {
              not: {
                startsWith: "dm-",
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (communities.length === 0) {
      return NextResponse.json(
        { error: "Topluluk grubu bulunamadı." },
        { status: 400 }
      );
    }

    // Her topluluğun mevcut üyelerini al
    const existingMemberships = await db.chatGroupMembership.findMany({
      where: {
        groupId: { in: communities.map((c: { id: string; name: string }) => c.id) },
        userId: { in: profileUsers.map((u: { id: string }) => u.id) },
      },
      select: {
        groupId: true,
        userId: true,
      },
    });

    // Mevcut üyelikleri Set olarak sakla (hızlı lookup için)
    const existingMembershipSet = new Set(
      existingMemberships.map((m: { groupId: string; userId: string }) => `${m.groupId}:${m.userId}`)
    );

    // Her topluluk için hangi kullanıcıların eklenebileceğini belirle
    const assignments: Array<{ groupId: string; userIds: string[] }> = [];
    const usedUserIds = new Set<string>();

    // Her topluluk için en az MIN_MEMBERS_PER_COMMUNITY üye ataması yap
    for (const community of communities) {
      const availableUsers = profileUsers.filter(
        (user: { id: string }) =>
          !usedUserIds.has(user.id) &&
          !existingMembershipSet.has(`${community.id}:${user.id}`)
      );

      // Rastgele karıştır
      const shuffled = [...availableUsers].sort(() => Math.random() - 0.5);

      // En az MIN_MEMBERS_PER_COMMUNITY üye seç (mümkünse)
      const neededCount = Math.min(
        MIN_MEMBERS_PER_COMMUNITY,
        shuffled.length
      );
      const selectedUsers = shuffled.slice(0, neededCount);

      if (selectedUsers.length > 0) {
        assignments.push({
          groupId: community.id,
          userIds: selectedUsers.map((u: { id: string }) => u.id),
        });

        // Kullanılan kullanıcıları işaretle
        selectedUsers.forEach((u) => usedUserIds.add(u.id));
      }
    }

    // Kalan kullanıcıları rastgele topluluklara dağıt
    const remainingUsers = profileUsers.filter(
      (user: { id: string }) => !usedUserIds.has(user.id)
    );
    const shuffledRemaining = [...remainingUsers].sort(
      () => Math.random() - 0.5
    );

    for (const user of shuffledRemaining) {
      // Rastgele bir topluluk seç
      const randomCommunity =
        communities[Math.floor(Math.random() * communities.length)];

      // Bu kullanıcı zaten bu toplulukta değilse ekle
      if (!existingMembershipSet.has(`${randomCommunity.id}:${user.id}`)) {
        const assignment = assignments.find(
          (a) => a.groupId === randomCommunity.id
        );
        if (assignment) {
          assignment.userIds.push(user.id);
        } else {
          assignments.push({
            groupId: randomCommunity.id,
            userIds: [user.id],
          });
        }
        usedUserIds.add(user.id);
      }
    }

    // Veritabanına ekle
    let totalAdded = 0;
    const communityStats: Array<{ name: string; added: number }> = [];

    for (const assignment of assignments) {
      if (assignment.userIds.length === 0) continue;

      const community = communities.find((c: { id: string; name: string }) => c.id === assignment.groupId);
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
        });
      } catch (error) {
        console.error(
          `[ASSIGN_PROFILES] Error adding members to ${communityName}:`,
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `${totalAdded} profil ${communities.length} topluluğa üye edildi.`,
      stats: {
        totalProfiles: profileUsers.length,
        totalCommunities: communities.length,
        totalAdded,
        minPerCommunity: MIN_MEMBERS_PER_COMMUNITY,
        communityStats,
      },
    });
  } catch (error: any) {
    console.error("[ASSIGN_PROFILES_TO_COMMUNITIES]", error);
    return NextResponse.json(
      { error: error.message || "Profiller topluluklara atanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

