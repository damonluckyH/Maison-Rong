import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatus } from '@/lib/orders-db';
import { getNextStatus } from '@/lib/orders';
import { requireAdminRequest, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const statusParam = request.nextUrl.searchParams.get('status');
  let orders = await getAllOrders();

  if (statusParam && statusParam !== 'ALL') {
    orders = orders.filter((o) => o.status === statusParam);
  }

  return NextResponse.json({ orders });
}

export async function PATCH(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const body = await request.json();
  const { orderId, action } = body as { orderId?: string; action?: 'advance' | 'cancel' };

  if (!orderId || !action) {
    return NextResponse.json({ error: 'Thiếu thông tin đơn hàng' }, { status: 400 });
  }

  if (action === 'cancel') {
    const order = await updateOrderStatus(orderId, 'CANCELLED');
    if (!order) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    return NextResponse.json({ order });
  }

  const orders = await getAllOrders();
  const current = orders.find((o) => o.id === orderId);
  if (!current) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });

  const next = getNextStatus(current.status);
  if (!next) return NextResponse.json({ error: 'Không thể chuyển trạng thái' }, { status: 400 });

  const order = await updateOrderStatus(orderId, next);
  return NextResponse.json({ order });
}
