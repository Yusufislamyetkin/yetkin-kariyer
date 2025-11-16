import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCareerPlan } from "@/lib/ai/career";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    const plan = await generateCareerPlan(session.user.id as string);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error generating career plan:", error);
    return NextResponse.json(
      { error: "Kariyer planı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

