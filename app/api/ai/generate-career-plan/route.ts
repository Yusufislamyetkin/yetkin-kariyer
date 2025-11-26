import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCareerPlan } from "@/lib/ai/career";

export async function POST(request: Request) {
  let session: { user?: { id?: string } } | null = null;
  let body: { questionnaire?: unknown } = {};
  
  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI servisi şu anda mevcut değil" },
        { status: 503 }
      );
    }

    body = await request.json().catch(() => ({}));
    const questionnaire = body.questionnaire || null;

    const plan = await generateCareerPlan(session.user.id as string, questionnaire);

    // Check if plan generation was successful
    if (plan && plan.summary && (plan.summary.includes("oluşturulamadı") || plan.summary.includes("sorun oluştu"))) {
      // Plan indicates an error occurred
      console.warn("Career plan generation returned error summary:", plan.summary);
      return NextResponse.json(
        { 
          plan,
          error: "Kariyer planı oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.",
          warning: true 
        },
        { status: 200 } // Return 200 but with warning flag
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    console.error("Error generating career plan:", {
      message: errorMessage,
      details: errorDetails,
      userId: session?.user?.id,
      hasQuestionnaire: !!body.questionnaire,
    });

    // Provide more specific error messages
    let statusCode = 500;
    let userMessage = "Kariyer planı oluşturulurken bir hata oluştu";

    if (errorMessage.includes("AI servisi devre dışı") || errorMessage.includes("AI servisi")) {
      statusCode = 503;
      userMessage = "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
    } else if (errorMessage.includes("Unauthorized") || errorMessage.includes("auth")) {
      statusCode = 401;
      userMessage = "Oturum açmanız gerekiyor.";
    } else if (errorMessage.includes("zaman aşımı") || errorMessage.includes("timeout")) {
      statusCode = 504;
      userMessage = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: statusCode }
    );
  }
}

