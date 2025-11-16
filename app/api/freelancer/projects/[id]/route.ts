import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteContext {
  params: {
    id: string;
  };
}

const updateProjectSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  budget: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
});

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await db.freelancerProject.findUnique({
      where: { id: params.id },
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
    });

    if (!project) {
      return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching freelancer project:", error);
    return NextResponse.json(
      { error: "Proje yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const project = await db.freelancerProject.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
    }

    if (project.createdBy !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = updateProjectSchema.parse(body);

    const updateData: any = {};
    if (validated.title) updateData.title = validated.title;
    if (validated.description) updateData.description = validated.description;
    if (validated.budget !== undefined) updateData.budget = validated.budget;
    if (validated.deadline) updateData.deadline = new Date(validated.deadline);
    if (validated.status) updateData.status = validated.status;

    const updatedProject = await db.freelancerProject.update({
      where: { id: params.id },
      data: updateData,
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
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating freelancer project:", error);
    return NextResponse.json(
      { error: "Proje güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const project = await db.freelancerProject.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
    }

    if (project.createdBy !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.freelancerProject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting freelancer project:", error);
    return NextResponse.json(
      { error: "Proje silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

