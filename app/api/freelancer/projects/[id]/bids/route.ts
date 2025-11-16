import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteContext {
  params: {
    id: string;
  };
}

const bidSchema = z.object({
  amount: z.number().positive(),
  message: z.string().min(10).max(2000),
});

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bids = await db.freelancerBid.findMany({
      where: { projectId: params.id },
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
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Teklifler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Check if project exists
    const project = await db.freelancerProject.findUnique({
      where: { id: params.id },
      include: {
        creator: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Proje bulunamadı" }, { status: 404 });
    }

    if (project.status !== "open") {
      return NextResponse.json(
        { error: "Bu proje için teklif verilemez" },
        { status: 400 }
      );
    }

    if (project.createdBy === userId) {
      return NextResponse.json(
        { error: "Kendi projenize teklif veremezsiniz" },
        { status: 400 }
      );
    }

    // Check if user already bid on this project
    const existingBid = await db.freelancerBid.findFirst({
      where: {
        projectId: params.id,
        userId: userId,
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { error: "Bu projeye zaten teklif verdiniz" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = bidSchema.parse(body);

    // Create bid
    const bid = await db.freelancerBid.create({
      data: {
        projectId: params.id,
        userId: userId,
        amount: validated.amount,
        message: validated.message,
        status: "pending",
      },
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
    });

    // TODO: Send message to project creator about the bid
    // This would integrate with the chat/messaging system
    // For now, we'll just return the bid

    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { error: "Teklif oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

