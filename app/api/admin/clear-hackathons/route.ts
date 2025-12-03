import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Tüm hackathonları sil
    const deletedHackathons = await db.hackathon.deleteMany({});

    return NextResponse.json({
      success: true,
      deleted: deletedHackathons.count,
      message: `${deletedHackathons.count} adet hackathon başarıyla silindi`
    });
  } catch (error: any) {
    console.error("Error deleting hackathons:", error);
    return NextResponse.json(
      { 
        success: false,
        deleted: 0,
        error: error.message || "Hackathonlar silinirken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

