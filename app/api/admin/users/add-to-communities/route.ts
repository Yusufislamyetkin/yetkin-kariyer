import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds, communityIds } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "En az bir kullanıcı seçilmelidir." },
        { status: 400 }
      );
    }

    if (!Array.isArray(communityIds) || communityIds.length === 0) {
      return NextResponse.json(
        { error: "En az bir topluluk seçilmelidir." },
        { status: 400 }
      );
    }

    // Verify that all communities exist
    const communities = await db.chatGroup.findMany({
      where: {
        id: { in: communityIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (communities.length !== communityIds.length) {
      return NextResponse.json(
        { error: "Bazı topluluklar bulunamadı." },
        { status: 400 }
      );
    }

    // Verify that all users exist
    const users = await db.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== userIds.length) {
      return NextResponse.json(
        { error: "Bazı kullanıcılar bulunamadı." },
        { status: 400 }
      );
    }

    // Check existing memberships to avoid duplicates
    const existingMemberships = await db.chatGroupMembership.findMany({
      where: {
        userId: { in: userIds },
        groupId: { in: communityIds },
      },
      select: {
        userId: true,
        groupId: true,
      },
    });

    // Create a set of existing memberships for quick lookup
    const existingSet = new Set(
      existingMemberships.map(
        (m: { userId: string; groupId: string }) => `${m.userId}-${m.groupId}`
      )
    );

    // Prepare data for new memberships (excluding existing ones)
    const newMemberships = [];
    for (const userId of userIds) {
      for (const communityId of communityIds) {
        const key = `${userId}-${communityId}`;
        if (!existingSet.has(key)) {
          newMemberships.push({
            groupId: communityId,
            userId,
            role: "member",
          });
        }
      }
    }

    let addedCount = 0;
    let skippedCount = existingMemberships.length;

    if (newMemberships.length > 0) {
      // Create new memberships
      const result = await db.chatGroupMembership.createMany({
        data: newMemberships,
        skipDuplicates: true,
      });
      addedCount = result.count;
    }

    const totalProcessed = addedCount + skippedCount;
    const communityNames = communities.map((c: { id: string; name: string }) => c.name).join(", ");

    return NextResponse.json({
      success: true,
      message: `${addedCount} yeni üyelik oluşturuldu. ${skippedCount} üyelik zaten mevcuttu.`,
      stats: {
        added: addedCount,
        skipped: skippedCount,
        totalProcessed,
        usersCount: userIds.length,
        communitiesCount: communityIds.length,
        communities: communityNames,
      },
    });
  } catch (error: any) {
    console.error("[ADD_TO_COMMUNITIES]", error);
    return NextResponse.json(
      { error: error.message || "Kullanıcılar topluluklara eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

