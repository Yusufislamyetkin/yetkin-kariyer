import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: `Execute activity for bot ${params.id}` });
}
