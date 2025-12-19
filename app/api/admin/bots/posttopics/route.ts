import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { loadAllPostTopics, getRandomUnusedTopic } from "@/lib/bot/posttopics-loader";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const usedTopicsParam = searchParams.get("usedTopics");

    if (userId && usedTopicsParam) {
      // Get a random unused topic for a specific user
      const usedTopics = usedTopicsParam.split(",").filter(t => t.length > 0);
      const topic = await getRandomUnusedTopic(userId, usedTopics);
      
      if (!topic) {
        return NextResponse.json(
          { error: "No available topics" },
          { status: 404 }
        );
      }

      return NextResponse.json({ topic });
    }

    // Return all topics
    const topics = await loadAllPostTopics();
    return NextResponse.json({ topics });
  } catch (error: any) {
    console.error("[POSTTOPICS_API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Post topics getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

