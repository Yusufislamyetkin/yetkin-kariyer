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

    // Önce tüm bid'leri sil (foreign key constraint nedeniyle)
    const deletedBids = await db.freelancerBid.deleteMany({});
    
    // Sonra tüm projeleri sil
    const deletedProjects = await db.freelancerProject.deleteMany({});

    return NextResponse.json({
      success: true,
      deletedProjects: deletedProjects.count,
      deletedBids: deletedBids.count,
      message: `${deletedProjects.count} adet freelancer projesi ve ${deletedBids.count} adet teklif başarıyla silindi.`
    });
  } catch (error: any) {
    console.error("Error clearing freelancer projects:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Freelancer projeleri silinirken bir hata oluştu" 
      },
      { status: 500 }
    );
  }
}

