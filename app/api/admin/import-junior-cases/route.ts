import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { importJuniorCases } from "@/lib/admin/import-junior-cases";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await importJuniorCases();

    if (!result.success && result.imported === 0) {
      return NextResponse.json(
        { 
          error: result.errors[0]?.error || "Junior case'ler import edilemedi",
          errors: result.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: result.success,
      imported: result.imported,
      errors: result.errors.length > 0 ? result.errors : undefined,
      message: `${result.imported} adet junior seviye canlı kodlama case'i başarıyla import edildi.${result.errors.length > 0 ? ` ${result.errors.length} hata oluştu.` : ""}`,
    });
  } catch (error: any) {
    console.error("Error importing junior cases:", error);
    return NextResponse.json(
      { error: error.message || "Junior case'ler import edilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

