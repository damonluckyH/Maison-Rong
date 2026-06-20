import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from './admin';

export function getAdminSessionFromCookies(): string | undefined {
  return cookies().get('admin_session')?.value;
}

export function requireAdminSession(): string | null {
  const token = getAdminSessionFromCookies();
  if (!token || !isAdmin(token)) return null;
  return token;
}

export function requireAdminRequest(request: NextRequest): string | null {
  const token = request.cookies.get('admin_session')?.value;
  if (!token || !isAdmin(token)) return null;
  return token;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export const ADMIN_COOKIE = 'admin_session';
