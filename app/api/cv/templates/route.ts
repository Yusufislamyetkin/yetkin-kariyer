import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_TEMPLATES } from "./defaultTemplates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json({
        templates: DEFAULT_TEMPLATES,
        fallback: true,
      });
    }

    const templates = await db.cVTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!templates.length) {
      return NextResponse.json({
        templates: DEFAULT_TEMPLATES,
        fallback: true,
      });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Şablonlar yüklenirken bir hata oluştu:", error);
    return NextResponse.json(
      {
        templates: DEFAULT_TEMPLATES,
        fallback: true,
        error: "Şablonlar veritabanından yüklenemedi, varsayılan şablonlar gösteriliyor.",
      },
      { status: 200 }
    );
  }
}

