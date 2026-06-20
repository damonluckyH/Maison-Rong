import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession, addPointsToUser } from '@/lib/db';
import { getCartLineItems, getCartTotal, clearCart } from '@/lib/cart';
import { createOrder, type PaymentMethod } from '@/lib/orders';

export async function POST(request: NextRequest) {
  const token = cookies().get('session')?.value;
  const user = token ? getUserBySession(token) : undefined;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    recipientName,
    recipientPhone,
    shippingAddress,
    shippingNote,
    paymentMethod,
    locale = user.locale,
  } = body as {
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    shippingNote?: string;
    paymentMethod?: PaymentMethod;
    locale?: string;
  };

  if (!recipientName?.trim() || !recipientPhone?.trim() || !shippingAddress?.trim()) {
    return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin giao hàng' }, { status: 400 });
  }

  const items = getCartLineItems(user.id, locale);
  if (items.length === 0) {
    return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 });
  }

  const totalAmount = getCartTotal(user.id);
  const pointsEarned = Math.floor(totalAmount / 1000);

  const order = createOrder({
    userId: user.id,
    customerName: user.fullName,
    customerEmail: user.email,
    customerPhone: user.phone,
    recipientName: recipientName.trim(),
    recipientPhone: recipientPhone.trim(),
    shippingAddress: shippingAddress.trim(),
    shippingNote: shippingNote?.trim() || undefined,
    paymentMethod: paymentMethod ?? 'COD',
    items: items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    totalAmount,
    pointsEarned,
  });

  if (pointsEarned > 0) {
    addPointsToUser(user.id, pointsEarned, 'purchase');
  }

  clearCart(user.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
    totalAmount: order.totalAmount,
    pointsEarned: order.pointsEarned,
    paymentMethod: order.paymentMethod,
  });
}
