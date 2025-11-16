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

    const attempt = await db.interviewAttempt.findUnique({
      where: { id: params.id },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            description: true,
            questions: true,
          },
        },
      },
    });

    if (!attempt || attempt.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { error: "Sonuç bulunamadı" },
        { status: 404 }
      );
    }

    const extractScreenRecordingUrl = (transcriptValue: string | null) => {
      if (!transcriptValue) {
        return null;
      }
      try {
        const parsed = JSON.parse(transcriptValue);
        if (parsed && typeof parsed === "object") {
          const screenUrl = (parsed as Record<string, unknown>).screenRecordingUrl;
          return typeof screenUrl === "string" ? screenUrl : null;
        }
      } catch (error) {
        // ignore parsing errors, transcript might be plain text
      }
      return null;
    };

    const screenRecordingUrl = extractScreenRecordingUrl(attempt.transcript);

    return NextResponse.json({
      attempt: {
        ...attempt,
        screenRecordingUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Sonuç yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

