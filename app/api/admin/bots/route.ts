import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://softwareinterview.tryasp.net';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call CursorInterviewer backend API
    const response = await fetch(`${BACKEND_API_URL}/Admin/GetBotUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[BOTS_GET] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch bots from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOTS_GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { count, bots } = body;

    // If count is provided, create multiple bots
    if (count && typeof count === 'number' && count > 0) {
      const createdBots = [];
      const errors = [];

      for (let i = 1; i <= count; i++) {
        try {
          const botData = {
            userName: `bot_user_${Date.now()}_${i}`,
            email: `bot_user_${Date.now()}_${i}@example.com`,
            firstName: `Bot`,
            lastName: `User ${i}`,
            password: 'Bot@123456',
          };

          const response = await fetch(`${BACKEND_API_URL}/Admin/CreateBotUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(botData),
          });

          if (response.ok) {
            const result = await response.json();
            createdBots.push(result);
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            errors.push({ botNumber: i, error: errorData.message || 'Failed to create bot' });
          }
        } catch (error: any) {
          errors.push({ botNumber: i, error: error.message || 'Failed to create bot' });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Created ${createdBots.length} out of ${count} bots`,
        created: createdBots.length,
        total: count,
        bots: createdBots,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Single bot creation
    if (bots && Array.isArray(bots) && bots.length > 0) {
      const createdBots = [];
      const errors = [];

      for (const bot of bots) {
        try {
          const response = await fetch(`${BACKEND_API_URL}/Admin/CreateBotUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bot),
          });

          if (response.ok) {
            const result = await response.json();
            createdBots.push(result);
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            errors.push({ bot, error: errorData.message || 'Failed to create bot' });
          }
        } catch (error: any) {
          errors.push({ bot, error: error.message || 'Failed to create bot' });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Created ${createdBots.length} out of ${bots.length} bots`,
        created: createdBots.length,
        total: bots.length,
        bots: createdBots,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Single bot creation (legacy format)
    const response = await fetch(`${BACKEND_API_URL}/Admin/CreateBotUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to create bot' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BOTS_POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create bot' },
      { status: 500 }
    );
  }
}
