import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNetCoreRoadmapStructure } from "@/lib/admin/seed-data";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create the new roadmap structure
    const result = await createNetCoreRoadmapStructure();

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Roadmap yapısı oluşturulurken bir hata oluştu",
          errors: result.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      modulesCreated: result.modulesCreated,
      message: `${result.modulesCreated} modül başarıyla oluşturuldu.`,
    });
  } catch (error: any) {
    console.error("Error creating roadmap:", error);
    return NextResponse.json(
      { error: error.message || "Roadmap oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

