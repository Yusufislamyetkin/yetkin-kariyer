import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Seed data functionality has been removed" },
      { status: 410 }
    );
  } catch (error: any) {
    console.error("Error getting modules:", error);
    return NextResponse.json(
      { error: "Modüller yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

