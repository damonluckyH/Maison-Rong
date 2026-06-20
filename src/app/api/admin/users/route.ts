import { NextRequest, NextResponse } from 'next/server';
import {
  searchUsers,
  getUserById,
  updateUserTier,
  updateUserTags,
  getPointsHistory,
  type Tier,
} from '@/lib/db';
import { getOrdersByUserId } from '@/lib/orders';
import { requireAdminRequest, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const q = request.nextUrl.searchParams.get('q') ?? '';
  const userId = request.nextUrl.searchParams.get('userId');

  if (userId) {
    const user = getUserById(userId);
    if (!user) return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });
    const orders = getOrdersByUserId(userId);
    const pointsLogs = getPointsHistory(userId);
    return NextResponse.json({ user, orders, pointsLogs });
  }

  return NextResponse.json({ users: searchUsers(q) });
}

export async function PATCH(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const body = await request.json();
  const { userId, tier, tags } = body as {
    userId?: string;
    tier?: Tier;
    tags?: { vip?: boolean; blacklist?: boolean };
  };

  if (!userId) {
    return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
  }

  if (tier) {
    const user = updateUserTier(userId, tier);
    if (!user) return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });
    return NextResponse.json({ user });
  }

  if (tags) {
    const user = updateUserTags(userId, tags);
    if (!user) return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });
    return NextResponse.json({ user });
  }

  return NextResponse.json({ error: 'Không có thay đổi' }, { status: 400 });
}
