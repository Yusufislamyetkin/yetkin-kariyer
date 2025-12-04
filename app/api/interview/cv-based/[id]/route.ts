import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interview = await db.interview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Mülakat bulunamadı" },
        { status: 404 }
      );
    }

    // Soruları normalize et
    const normalizeQuestions = (rawQuestions: unknown) => {
      if (Array.isArray(rawQuestions)) {
        return rawQuestions;
      }
      if (typeof rawQuestions === "string") {
        try {
          const parsed = JSON.parse(rawQuestions);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.warn("[interview] questions parse error:", error);
          return [];
        }
      }
      return [];
    };

    return NextResponse.json({
      interview: {
        ...interview,
        questions: normalizeQuestions(interview.questions),
      },
    });
  } catch (error) {
    console.error("[CV_INTERVIEW] GET hatası:", error);
    return NextResponse.json(
      { error: "Mülakat yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "start") {
      // Interview started - could log this
      return NextResponse.json({ message: "Interview started" });
    }

    if (action === "submit") {
      const { videoUrl, screenRecordingUrl, transcript } = body;

      let transcriptRecord: string | null = null;
      if (typeof transcript === "string") {
        transcriptRecord = transcript;
      } else if (transcript && typeof transcript === "object") {
        try {
          transcriptRecord = JSON.stringify({
            ...transcript,
            screenRecordingUrl: screenRecordingUrl ?? transcript.screenRecordingUrl ?? null,
          });
        } catch (error) {
          console.warn("[interview] transcript stringify error:", error);
          transcriptRecord = null;
        }
      } else if (screenRecordingUrl) {
        transcriptRecord = JSON.stringify({ screenRecordingUrl });
      }

      const attempt = await db.interviewAttempt.create({
        data: {
          userId: session.user.id as string,
          interviewId: params.id,
          videoUrl: videoUrl ?? null,
          transcript: transcriptRecord,
        },
      });

      // If video URL is provided later (after upload), update it
      if (!videoUrl && body.videoUrl) {
        await db.interviewAttempt.update({
          where: { id: attempt.id },
          data: { videoUrl: body.videoUrl },
        });
      }

      // Trigger AI analysis in background (non-blocking)
      if (process.env.OPENAI_API_KEY && process.env.NEXTAUTH_URL) {
        // Fire and forget - don't await
        fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze-interview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewAttemptId: attempt.id }),
        }).catch(() => {
          // Silently fail - analysis can be triggered later
        });
      }

      return NextResponse.json({
        attempt: {
          ...attempt,
          screenRecordingUrl: screenRecordingUrl ?? null,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[CV_INTERVIEW] POST hatası:", error);
    return NextResponse.json(
      { error: "Mülakat gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

