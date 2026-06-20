import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession } from '@/lib/db';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartLineItems,
  getCartTotal,
  getCartItemCount,
} from '@/lib/cart';

function getSessionUser() {
  const token = cookies().get('session')?.value;
  if (!token) return undefined;
  return getUserBySession(token);
}

export async function GET(request: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const locale = request.nextUrl.searchParams.get('locale') ?? user.locale;
  const items = getCartLineItems(user.id, locale);
  const total = getCartTotal(user.id);
  const count = getCartItemCount(user.id);

  return NextResponse.json({ cart: getCart(user.id), items, total, count });
}

export async function POST(request: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { productId, quantity = 1 } = body as { productId?: string; quantity?: number };

  if (!productId) {
    return NextResponse.json({ error: 'Thiếu productId' }, { status: 400 });
  }

  addToCart(user.id, productId, quantity);
  const count = getCartItemCount(user.id);

  return NextResponse.json({ success: true, count });
}

export async function PATCH(request: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { productId, quantity } = body as { productId?: string; quantity?: number };

  if (!productId || quantity == null) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }

  updateQuantity(user.id, productId, quantity);
  const locale = user.locale;
  const items = getCartLineItems(user.id, locale);
  const total = getCartTotal(user.id);
  const count = getCartItemCount(user.id);

  return NextResponse.json({ items, total, count });
}

export async function DELETE(request: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'Thiếu productId' }, { status: 400 });
  }

  removeFromCart(user.id, productId);
  const count = getCartItemCount(user.id);

  return NextResponse.json({ success: true, count });
}
