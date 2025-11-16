import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/profile/[userId]/comments - Kullanıcının aldığı yorumlar
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const comments = await db.employerComment.findMany({
      where: {
        candidateId: params.userId,
        isPublic: true,
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        badge: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Yorumlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST /api/profile/[userId]/comments - İşveren yorum ekler
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId = session.user.id as string;

    // Check if user is employer
    const employer = await db.user.findUnique({
      where: { id: employerId },
    });

    if (!employer || employer.role !== "employer") {
      return NextResponse.json(
        { error: "Sadece işverenler yorum yapabilir" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { comment, rating, badgeId, isPublic } = body;

    if (!comment || !rating) {
      return NextResponse.json(
        { error: "Yorum ve rating gerekli" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating 1-5 arasında olmalı" },
        { status: 400 }
      );
    }

    // Check if candidate exists
    const candidate = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Create comment
    const newComment = await db.employerComment.create({
      data: {
        employerId,
        candidateId: params.userId,
        comment,
        rating: parseInt(rating),
        badgeId: badgeId || null,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        badge: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Yorum oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

