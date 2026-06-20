import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'not_registered', message: 'Email chưa đăng ký. Vui lòng đăng ký trước.' },
        { status: 404 },
      );
    }

    const sessionToken = createSession(user.id);
    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
