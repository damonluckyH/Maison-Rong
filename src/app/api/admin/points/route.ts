import { NextRequest, NextResponse } from 'next/server';
import {
  searchUsers,
  getUserById,
  addPointsByAdmin,
  addPointsBatchByAdmin,
  getAdminPointsLogs,
} from '@/lib/db';
import { getAdminEmail } from '@/lib/admin';
import { requireAdminRequest, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const q = request.nextUrl.searchParams.get('q') ?? '';
  const userId = request.nextUrl.searchParams.get('userId');

  if (userId) {
    const user = getUserById(userId);
    if (!user) return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });
    return NextResponse.json({ user });
  }

  const users = searchUsers(q);
  const logs = getAdminPointsLogs();

  return NextResponse.json({ users, logs });
}

export async function POST(request: NextRequest) {
  const token = requireAdminRequest(request);
  if (!token) return unauthorizedResponse();

  const operator = getAdminEmail(token) ?? 'admin';
  const body = await request.json();
  const { userId, userIds, amount, reason } = body as {
    userId?: string;
    userIds?: string[];
    amount?: number;
    reason?: string;
  };

  if (typeof amount !== 'number' || !reason) {
    return NextResponse.json({ error: 'Thiếu số điểm hoặc lý do' }, { status: 400 });
  }

  if (userIds && userIds.length > 0) {
    const count = addPointsBatchByAdmin(userIds, amount, reason, operator);
    return NextResponse.json({ success: true, count, logs: getAdminPointsLogs() });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Chọn thành viên' }, { status: 400 });
  }

  const result = addPointsByAdmin(userId, amount, reason, operator);
  if (!result) return NextResponse.json({ error: 'Không tìm thấy thành viên' }, { status: 404 });

  const user = getUserById(userId);
  return NextResponse.json({ success: true, user, result, logs: getAdminPointsLogs() });
}
