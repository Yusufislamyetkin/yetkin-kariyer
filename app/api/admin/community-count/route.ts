import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Topluluk slug'ları (create-course-communities API'sinden)
const COMMUNITY_SLUGS = [
  "dotnet-core-community",
  "java-community",
  "mssql-community",
  "react-community",
  "angular-community",
  "nodejs-community",
  "ai-community",
  "flutter-community",
  "ethical-hacking-community",
  "nextjs-community",
  "docker-kubernetes-community",
  "owasp-community",
];

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tüm topluluk gruplarını say (slug'lara göre veya createdById null olan public gruplar)
    const count = await db.chatGroup.count({
      where: {
        OR: [
          { slug: { in: COMMUNITY_SLUGS } },
          {
            createdById: null,
            visibility: "public",
            slug: {
              not: {
                startsWith: "dm-",
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      count,
      total: COMMUNITY_SLUGS.length,
    });
  } catch (error: any) {
    console.error("[COMMUNITY_COUNT]", error);
    return NextResponse.json(
      { error: error.message || "Topluluk sayısı alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

