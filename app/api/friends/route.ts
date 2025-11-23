import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const friendships = await db.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      orderBy: {
        requestedAt: "desc",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        addressee: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const data = friendships.map((friendship: {
      id: string;
      status: string;
      requesterId: string;
      requestedAt: Date;
      respondedAt: Date | null;
      cancelledAt: Date | null;
      requester: { id: string; name: string | null; profileImage: string | null };
      addressee: { id: string; name: string | null; profileImage: string | null };
    }) => {
      const isRequester = friendship.requesterId === userId;
      const counterpart = isRequester ? friendship.addressee : friendship.requester;
      return {
        id: friendship.id,
        status: friendship.status,
        requestedAt: friendship.requestedAt,
        respondedAt: friendship.respondedAt,
        cancelledAt: friendship.cancelledAt,
        counterpart,
        direction: isRequester ? "outgoing" : "incoming",
      };
    });

    // Remove duplicates by counterpart.id for accepted friendships
    // Keep the most recent friendship if duplicates exist
    const seenCounterparts = new Map<string, (typeof data)[0]>();
    const uniqueData: (typeof data) = [];
    
    for (const friendship of data) {
      if (friendship.status === "accepted") {
        const counterpartId = friendship.counterpart.id;
        const existing = seenCounterparts.get(counterpartId);
        if (existing) {
          // Keep the most recent one
          if (new Date(friendship.requestedAt) > new Date(existing.requestedAt)) {
            // Remove old one and add new one
            const index = uniqueData.findIndex((f: (typeof data)[0]) => f.id === existing.id);
            if (index !== -1) {
              uniqueData.splice(index, 1);
            }
            seenCounterparts.set(counterpartId, friendship);
            uniqueData.push(friendship);
          }
          // Otherwise skip this duplicate
        } else {
          seenCounterparts.set(counterpartId, friendship);
          uniqueData.push(friendship);
        }
      } else {
        // Keep all non-accepted friendships
        uniqueData.push(friendship);
      }
    }

    return NextResponse.json({ friendships: uniqueData });
  } catch (error) {
    console.error("[FRIENDS_GET] Error:", error);
    
    if (error instanceof Error) {
      console.error("[FRIENDS_GET] Error message:", error.message);
      console.error("[FRIENDS_GET] Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("P1001")) {
        console.error("[FRIENDS_GET] Database connection error detected");
      }
    }
    
    return NextResponse.json(
      { 
        error: "Arkadaş listesi alınırken bir hata oluştu.",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}

