import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  budget: z.number().positive().optional().nullable(),
  deadline: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Geçersiz tarih formatı" }
    ),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const createdBy = searchParams.get("createdBy");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (createdBy) {
      where.createdBy = createdBy;
    }

    const projects = await db.freelancerProject.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching freelancer projects:", error);
    return NextResponse.json(
      { error: "Projeler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await request.json();
    
    // Validate input
    const validated = projectSchema.parse(body);

    // Parse deadline safely
    let deadlineDate: Date | null = null;
    if (validated.deadline) {
      try {
        deadlineDate = new Date(validated.deadline);
        if (isNaN(deadlineDate.getTime())) {
          return NextResponse.json(
            { error: "Geçersiz tarih formatı" },
            { status: 400 }
          );
        }
      } catch (dateError) {
        return NextResponse.json(
          { error: "Geçersiz tarih formatı" },
          { status: 400 }
        );
      }
    }

    // Verify user exists before creating project
    const userExists = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Create project
    const project = await db.freelancerProject.create({
      data: {
        title: validated.title.trim(),
        description: validated.description.trim(),
        budget: validated.budget || null,
        deadline: deadlineDate,
        createdBy: userId,
        status: "open",
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { 
          error: "Geçersiz veri", 
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    // Log full error for debugging
    console.error("Error creating freelancer project:", error);
    
    // Check for specific database errors
    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as any;
      if (dbError.code === "P2002") {
        return NextResponse.json(
          { error: "Bu proje zaten mevcut" },
          { status: 409 }
        );
      }
      if (dbError.code === "P2003") {
        return NextResponse.json(
          { error: "Geçersiz kullanıcı referansı" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Proje oluşturulurken bir hata oluştu",
        message: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}

