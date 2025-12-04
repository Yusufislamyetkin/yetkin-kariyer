import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all bots
    const bots = await db.user.findMany({
      where: {
        isBot: true,
      },
      select: {
        id: true,
      },
    });

    if (bots.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Geri çekilecek bot bulunamadı",
        removed: 0,
      });
    }

    // Remove bot status from all bots in transaction
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      let removedCount = 0;

      for (const bot of bots) {
        // Update user to not be a bot
        await tx.user.update({
          where: { id: bot.id },
          data: { isBot: false },
        });

        // Deactivate bot configuration if exists
        await tx.botConfiguration.updateMany({
          where: { userId: bot.id },
          data: { isActive: false },
        });

        removedCount++;
      }

      return removedCount;
    });

    return NextResponse.json({
      success: true,
      message: `${result} bot başarıyla geri çekildi`,
      removed: result,
    });
  } catch (error: any) {
    console.error("[BOT_REMOVE_ALL] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Botlar geri çekilirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

