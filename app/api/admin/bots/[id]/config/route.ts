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

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/GetBotConfiguration?userId=${params.id}`, {
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
    console.error('[BOT_CONFIG_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot configuration' },
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
        { error: errorData.message || 'Failed to update bot configuration' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOT_CONFIG_PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bot configuration' },
      { status: 500 }
    );
  }
}

