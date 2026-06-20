import type { OrderStatus } from '@/lib/orders';
import { ORDER_STATUS_LABELS } from '@/lib/orders';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  PAID: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  SHIPPED: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  COMPLETED: 'border-brand-jade/40 bg-brand-jade/10 text-brand-jade',
  CANCELLED: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs tracking-wide ${STATUS_STYLES[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    BRONZE: 'text-[#CD7F32]',
    SILVER: 'text-[#C0C0C0]',
    GOLD: 'text-brand-gold',
    PLATINUM: 'text-[#E5E4E2]',
    DIAMOND: 'text-[#B9F2FF]',
  };
  const labels: Record<string, string> = {
    BRONZE: 'Đồng',
    SILVER: 'Bạc',
    GOLD: 'Vàng',
    PLATINUM: 'Bạch Kim',
    DIAMOND: 'Kim Cương',
  };
  return (
    <span className={`text-xs font-medium ${colors[tier] ?? 'text-gray-400'}`}>
      {labels[tier] ?? tier}
    </span>
  );
}

export function TagBadge({ label, variant }: { label: string; variant: 'vip' | 'blacklist' | 'neutral' }) {
  const styles = {
    vip: 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold',
    blacklist: 'border-brand-red/40 bg-brand-red/10 text-brand-red',
    neutral: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
  };
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${styles[variant]}`}>
      {label}
    </span>
  );
}
