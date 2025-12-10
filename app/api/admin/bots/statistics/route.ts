import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/GetBotStatistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[BOT_STATISTICS_GET] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch bot statistics from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOT_STATISTICS_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bot statistics' },
      { status: 500 }
    );
  }
}

