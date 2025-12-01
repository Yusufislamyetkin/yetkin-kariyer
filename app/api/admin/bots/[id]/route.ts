import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateBotSchema = z.object({
  isActive: z.boolean().optional(),
  minPostsPerDay: z.number().min(0).max(10).optional(),
  maxPostsPerDay: z.number().min(0).max(10).optional(),
  minCommentsPerDay: z.number().min(0).max(20).optional(),
  maxCommentsPerDay: z.number().min(0).max(20).optional(),
  minLikesPerDay: z.number().min(0).max(50).optional(),
  maxLikesPerDay: z.number().min(0).max(50).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bot = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
      include: {
        botCharacter: true,
        botConfiguration: true,
        botActivities: {
          take: 50,
          orderBy: {
            executedAt: "desc",
          },
        },
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bot });
  } catch (error: any) {
    console.error("[ADMIN_BOTS_GET_ID]", error);
    return NextResponse.json(
      { error: error.message || "Bot detayları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = updateBotSchema.parse(body);

    // Check if bot exists
    const bot = await db.user.findUnique({
      where: {
        id: params.id,
        isBot: true,
      },
      include: {
        botConfiguration: true,
      },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Bot bulunamadı" },
        { status: 404 }
      );
    }

    // Update configuration
    if (bot.botConfiguration) {
      await db.botConfiguration.update({
        where: { userId: params.id },
        data,
      });
    } else {
      // Create configuration if it doesn't exist
      await db.botConfiguration.create({
        data: {
          userId: params.id,
          ...data,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bot güncellendi",
    });
  } catch (error: any) {
    console.error("[ADMIN_BOTS_PUT]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Bot güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Deactivate bot instead of deleting
    await db.user.update({
      where: { id: params.id },
      data: { isBot: false },
    });

    // Deactivate configuration
    await db.botConfiguration.updateMany({
      where: { userId: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Bot devre dışı bırakıldı",
    });
  } catch (error: any) {
    console.error("[ADMIN_BOTS_DELETE]", error);
    return NextResponse.json(
      { error: error.message || "Bot devre dışı bırakılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

