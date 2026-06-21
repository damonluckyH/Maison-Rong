import { NextRequest, NextResponse } from 'next/server';
import { generateBaziReport } from '@/lib/bazi';
import { createUser, createSession, addPointsToUser, getUserByEmail } from '@/lib/db';
import { POINTS_RULES } from '@/lib/loyalty';
import type { Gender, BloodType } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      surname,
      givenName,
      gender,
      birthDate,
      birthHour,
      bloodType,
      email,
      password,
      phone,
      zalo,
      messenger,
      tiktok,
      locale,
    } = body;

    if (!surname || !givenName || !gender || !birthDate || !bloodType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, { status: 400 });
    }

    if (!zalo?.trim()) {
      return NextResponse.json({ error: 'Zalo là bắt buộc' }, { status: 400 });
    }

    if (await getUserByEmail(email)) {
      return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 409 });
    }

    const baziReport = generateBaziReport(birthDate, birthHour, gender as Gender);

    const user = await createUser({
      surname,
      givenName,
      gender: gender as Gender,
      birthDate,
      birthHour: birthHour || undefined,
      bloodType: bloodType as BloodType,
      email: email.trim(),
      password,
      phone: phone || undefined,
      zalo: zalo.trim(),
      messenger: messenger?.trim() || undefined,
      tiktok: tiktok?.trim() || undefined,
      baziReport,
      locale: locale || 'vi',
    });

    await addPointsToUser(user.id, POINTS_RULES.register, 'register');

    const sessionToken = await createSession(user.id);

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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
