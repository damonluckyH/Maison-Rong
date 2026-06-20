import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addPointsToUser, getPointsHistory, getUserBySession } from '@/lib/db';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    points: user.points,
    tier: user.tier,
    logs: getPointsHistory(user.id),
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { amount, reason } = body as { amount?: number; reason?: string };

  if (typeof amount === 'number' && reason) {
    const result = addPointsToUser(user.id, amount, reason);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      points: user.points,
      tier: user.tier,
      logs: getPointsHistory(user.id),
      upgraded: result.upgraded,
      previousTier: result.previousTier,
      newTier: result.newTier,
    });
  }

  return NextResponse.json({
    points: user.points,
    tier: user.tier,
    logs: getPointsHistory(user.id),
    upgraded: false,
  });
}
