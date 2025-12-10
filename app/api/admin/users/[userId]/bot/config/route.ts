import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = params.userId;

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/GetBotConfiguration?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[BOT_CONFIG_GET] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch bot configuration from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BOT_CONFIG_GET]", error);
    return NextResponse.json(
      { error: error.message || "Bot yapılandırması alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = params.userId;
    const body = await request.json();

    // Map Next.js format to CursorInterviewer format
    const updateRequest: any = {
      userId: userId,
    };

    if (body.configuration) {
      updateRequest.IsActive = body.configuration.isActive;
      updateRequest.MinPostsPerDay = body.configuration.minPostsPerDay;
      updateRequest.MaxPostsPerDay = body.configuration.maxPostsPerDay;
      updateRequest.MinCommentsPerDay = body.configuration.minCommentsPerDay;
      updateRequest.MaxCommentsPerDay = body.configuration.maxCommentsPerDay;
      updateRequest.MinLikesPerDay = body.configuration.minLikesPerDay;
      updateRequest.MaxLikesPerDay = body.configuration.maxLikesPerDay;
      updateRequest.ActivityHours = body.configuration.activityHours;
      updateRequest.ScheduleEnabled = body.configuration.scheduleEnabled;
    }

    // Also handle direct properties from BotConfigModal
    if (body.isActive !== undefined) updateRequest.IsActive = body.isActive;
    if (body.minPostsPerDay !== undefined) updateRequest.MinPostsPerDay = body.minPostsPerDay;
    if (body.maxPostsPerDay !== undefined) updateRequest.MaxPostsPerDay = body.maxPostsPerDay;
    if (body.minCommentsPerDay !== undefined) updateRequest.MinCommentsPerDay = body.minCommentsPerDay;
    if (body.maxCommentsPerDay !== undefined) updateRequest.MaxCommentsPerDay = body.maxCommentsPerDay;
    if (body.minLikesPerDay !== undefined) updateRequest.MinLikesPerDay = body.minLikesPerDay;
    if (body.maxLikesPerDay !== undefined) updateRequest.MaxLikesPerDay = body.maxLikesPerDay;
    if (body.activityHours) updateRequest.ActivityHours = body.activityHours;
    if (body.enabledActivities) updateRequest.EnabledActivities = body.enabledActivities;
    if (body.activityIntervals) updateRequest.ActivityIntervals = body.activityIntervals;
    if (body.scheduleEnabled !== undefined) updateRequest.ScheduleEnabled = body.scheduleEnabled;

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/UpdateBotConfiguration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update bot configuration' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BOT_CONFIG_PUT]", error);
    return NextResponse.json(
      { error: error.message || "Bot yapılandırması güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

