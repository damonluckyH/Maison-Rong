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
