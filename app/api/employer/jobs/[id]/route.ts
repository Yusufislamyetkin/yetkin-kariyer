import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, requirements, location, salary, status } = body;

    const job = await db.job.findUnique({
      where: { id: params.id },
    });

    if (!job || job.employerId !== (session.user.id as string)) {
      return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
    }

    const updated = await db.job.update({
      where: { id: params.id },
      data: {
        title: title || job.title,
        description: description || job.description,
        requirements: requirements || job.requirements,
        location: location !== undefined ? location : job.location,
        salary: salary !== undefined ? salary : job.salary,
        status: status || job.status,
      },
    });

    return NextResponse.json({ job: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "İlan güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await db.job.findUnique({
      where: { id: params.id },
    });

    if (!job || job.employerId !== (session.user.id as string)) {
      return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
    }

    await db.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "İlan silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

