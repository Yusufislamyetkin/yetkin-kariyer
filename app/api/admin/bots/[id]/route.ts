import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call CursorInterviewer backend API - Get bot from list
    const botListResponse = await fetch(`${BACKEND_API_URL}/Admin/GetBotUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!botListResponse.ok) {
      const errorText = await botListResponse.text();
      console.error('[BOT_GET] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch bots from backend' },
        { status: botListResponse.status }
      );
    }

    const botListData = await botListResponse.json();
    const bot = botListData.bots?.find((b: any) => b.id === params.id);
    
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, bot });
  } catch (error: any) {
    console.error('[BOT_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/UpdateBotConfiguration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        userId: params.id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update bot' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOT_PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bot' },
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

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call CursorInterviewer backend API - Use DeleteUser endpoint
    // DeleteUser expects userId as query parameter or in body
    const response = await fetch(`${BACKEND_API_URL}/Admin/DeleteUser?userId=${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete bot' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOT_DELETE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete bot' },
      { status: 500 }
    );
  }
}
