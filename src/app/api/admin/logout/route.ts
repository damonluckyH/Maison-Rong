import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/admin';
import { ADMIN_COOKIE, getAdminSessionFromCookies } from '@/lib/admin-auth';

export async function POST() {
  const token = getAdminSessionFromCookies();
  if (token) destroyAdminSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
