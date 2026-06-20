export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingNote?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  pointsEarned: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  SHIPPED: 'Đã giao hàng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const orders: Order[] = ([
  {
    id: 'ORD-2026-001',
    userId: 'seed_user_1',
    customerName: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@email.vn',
    customerPhone: '0901234567',
    items: [
      { productId: 'dragon-seal-ring', productName: 'Nhẫn Dragon Seal', quantity: 1, unitPrice: 158_000_000 },
    ],
    totalAmount: 158_000_000,
    status: 'PENDING',
    createdAt: new Date('2026-06-01T10:30:00'),
    updatedAt: new Date('2026-06-01T10:30:00'),
  },
  {
    id: 'ORD-2026-002',
    userId: 'seed_user_2',
    customerName: 'Trần Thu Hà',
    customerEmail: 'thuha@email.vn',
    customerPhone: '0912345678',
    items: [
      { productId: 'phoenix-grace-necklace', productName: 'Dây Chuyền Phoenix Grace', quantity: 1, unitPrice: 225_000_000 },
      { productId: 'ember-phoenix-earrings', productName: 'Bông Tai Phượng Lửa', quantity: 1, unitPrice: 186_000_000 },
    ],
    totalAmount: 411_000_000,
    status: 'PAID',
    createdAt: new Date('2026-06-02T14:15:00'),
    updatedAt: new Date('2026-06-02T16:00:00'),
  },
  {
    id: 'ORD-2026-003',
    userId: 'seed_user_3',
    customerName: 'Lê Văn Đức',
    customerEmail: 'vanduc@email.vn',
    items: [
      { productId: 'imperial-dragon-bracelet', productName: 'Vòng Rồng Hoàng Gia', quantity: 1, unitPrice: 268_000_000 },
    ],
    totalAmount: 268_000_000,
    status: 'SHIPPED',
    createdAt: new Date('2026-05-28T09:00:00'),
    updatedAt: new Date('2026-05-30T11:20:00'),
  },
  {
    id: 'ORD-2026-004',
    userId: 'seed_user_1',
    customerName: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@email.vn',
    customerPhone: '0901234567',
    items: [
      { productId: 'lotus-dream-pillow-set', productName: 'Bộ Gối Lotus Dream', quantity: 1, unitPrice: 320_000_000 },
    ],
    totalAmount: 320_000_000,
    status: 'COMPLETED',
    createdAt: new Date('2026-05-20T08:45:00'),
    updatedAt: new Date('2026-05-25T17:00:00'),
  },
  {
    id: 'ORD-2026-005',
    userId: 'seed_user_4',
    customerName: 'Phạm Quốc Bảo',
    customerEmail: 'quocbao@email.vn',
    customerPhone: '0923456789',
    items: [
      { productId: 'dong-son-leather-bag', productName: 'Túi Da Dong Son', quantity: 1, unitPrice: 450_000_000 },
    ],
    totalAmount: 450_000_000,
    status: 'CANCELLED',
    createdAt: new Date('2026-05-15T12:00:00'),
    updatedAt: new Date('2026-05-16T09:30:00'),
  },
  {
    id: 'ORD-2026-006',
    userId: 'seed_user_5',
    customerName: 'Hoàng Thị Lan',
    customerEmail: 'thilan@email.vn',
    items: [
      { productId: 'heritage-family-bedding', productName: 'Bộ Ga Heritage Gia Tộc', quantity: 1, unitPrice: 880_000_000 },
    ],
    totalAmount: 880_000_000,
    status: 'PAID',
    createdAt: new Date('2026-06-03T16:20:00'),
    updatedAt: new Date('2026-06-03T17:45:00'),
  },
  {
    id: 'ORD-2026-007',
    userId: 'seed_user_2',
    customerName: 'Trần Thu Hà',
    customerEmail: 'thuha@email.vn',
    items: [
      { productId: 'jade-serenity-bracelet', productName: 'Vòng Ngọc Bích An Nhiên', quantity: 1, unitPrice: 186_000_000 },
    ],
    totalAmount: 186_000_000,
    status: 'PENDING',
    createdAt: new Date('2026-06-04T11:00:00'),
    updatedAt: new Date('2026-06-04T11:00:00'),
  },
  {
    id: 'ORD-2026-008',
    userId: 'seed_user_6',
    customerName: 'Võ Đình Khang',
    customerEmail: 'dinhkhang@email.vn',
    customerPhone: '0934567890',
    items: [
      { productId: 'dynasty-crest-coverlet', productName: 'Chăn Huy Hiệu Vương Triều', quantity: 1, unitPrice: 1_280_000_000 },
    ],
    totalAmount: 1_280_000_000,
    status: 'SHIPPED',
    createdAt: new Date('2026-05-22T13:30:00'),
    updatedAt: new Date('2026-05-27T10:00:00'),
  },
  {
    id: 'ORD-2026-009',
    userId: 'seed_user_3',
    customerName: 'Lê Văn Đức',
    customerEmail: 'vanduc@email.vn',
    items: [
      { productId: 'turtle-guardian-bracelet', productName: 'Vòng Turtle Guardian', quantity: 2, unitPrice: 98_000_000 },
    ],
    totalAmount: 196_000_000,
    status: 'COMPLETED',
    createdAt: new Date('2026-05-10T15:00:00'),
    updatedAt: new Date('2026-05-18T14:00:00'),
  },
  {
    id: 'ORD-2026-010',
    userId: 'seed_user_4',
    customerName: 'Phạm Quốc Bảo',
    customerEmail: 'quocbao@email.vn',
    items: [
      { productId: 'golden-carp-ring', productName: 'Nhẫn Cá Chép Vàng', quantity: 1, unitPrice: 128_000_000 },
      { productId: 'crimson-grace-ring', productName: 'Nhẫn Crimson Grace', quantity: 1, unitPrice: 145_000_000 },
    ],
    totalAmount: 273_000_000,
    status: 'PENDING',
    createdAt: new Date('2026-06-05T09:15:00'),
    updatedAt: new Date('2026-06-05T09:15:00'),
  },
] as Omit<Order, 'recipientName' | 'recipientPhone' | 'shippingAddress' | 'paymentMethod' | 'pointsEarned'>[]).map((o) => ({
  ...o,
  recipientName: o.customerName,
  recipientPhone: o.customerPhone ?? '',
  shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
  paymentMethod: 'COD' as PaymentMethod,
  pointsEarned: Math.floor(o.totalAmount / 1000),
}));

export function getAllOrders(): Order[] {
  return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersByUserId(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  order.updatedAt = new Date();
  return order;
}

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  switch (current) {
    case 'PENDING':
      return 'PAID';
    case 'PAID':
      return 'SHIPPED';
    case 'SHIPPED':
      return 'COMPLETED';
    default:
      return null;
  }
}

export function getNextStatusActionLabel(current: OrderStatus): string | null {
  switch (current) {
    case 'PENDING':
      return 'Xác nhận thanh toán';
    case 'PAID':
      return 'Đánh dấu đã giao';
    case 'SHIPPED':
      return 'Hoàn thành đơn';
    default:
      return null;
  }
}

let orderCounter = orders.length;

export function createOrder(
  data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): Order {
  orderCounter += 1;
  const now = new Date();
  const order: Order = {
    ...data,
    id: `ORD-2026-${String(orderCounter).padStart(3, '0')}`,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  };
  orders.unshift(order);
  return order;
}
