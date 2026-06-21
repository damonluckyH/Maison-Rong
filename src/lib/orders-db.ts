import { prisma } from './prisma';
import type { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';
import type { Order, OrderStatus } from './orders';

type OrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

function mapOrder(row: OrderWithItems): Order {
  return {
    id: row.id,
    userId: row.userId,
    customerName: row.customerName,
    customerEmail: row.customerEmail ?? '',
    customerPhone: row.customerPhone ?? undefined,
    recipientName: row.recipientName,
    recipientPhone: row.recipientPhone,
    shippingAddress: row.shippingAddress,
    shippingNote: row.shippingNote ?? undefined,
    paymentMethod: row.paymentMethod as Order['paymentMethod'],
    items: row.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    totalAmount: row.totalAmount,
    pointsEarned: row.pointsEarned,
    status: row.status as OrderStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function nextOrderId(): Promise<string> {
  const count = await prisma.order.count();
  return `ORD-2026-${String(count + 1).padStart(3, '0')}`;
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  return row ? mapOrder(row) : undefined;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(mapOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  try {
    const row = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return mapOrder(row);
  } catch {
    return undefined;
  }
}

export async function createOrder(
  data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): Promise<Order> {
  const id = await nextOrderId();

  const row = await prisma.order.create({
    data: {
      id,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone ?? null,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      shippingAddress: data.shippingAddress,
      shippingNote: data.shippingNote ?? null,
      paymentMethod: data.paymentMethod,
      totalAmount: data.totalAmount,
      pointsEarned: data.pointsEarned,
      status: 'PENDING',
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: { items: true },
  });

  return mapOrder(row);
}
