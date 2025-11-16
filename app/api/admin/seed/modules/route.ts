import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAvailableModules } from "@/lib/admin/seed-data";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const modules = await getAvailableModules();

    return NextResponse.json({ modules });
  } catch (error: any) {
    console.error("Error getting modules:", error);
    return NextResponse.json(
      { error: "Modüller yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

