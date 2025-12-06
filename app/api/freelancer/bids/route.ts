import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET() {
  try {
    const session = await auth();
    const userId = await getUserIdFromSession(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bids = await db.freelancerBid.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching freelancer bids:", error);
    return NextResponse.json(
      { error: "Başvurular yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

