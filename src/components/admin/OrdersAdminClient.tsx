'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatVnd } from '@/lib/products';
import type { Order, OrderStatus } from '@/lib/orders';
import { getNextStatusActionLabel, ORDER_STATUS_LABELS } from '@/lib/orders';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: ORDER_STATUS_LABELS.PENDING },
  { value: 'PAID', label: ORDER_STATUS_LABELS.PAID },
  { value: 'SHIPPED', label: ORDER_STATUS_LABELS.SHIPPED },
  { value: 'COMPLETED', label: ORDER_STATUS_LABELS.COMPLETED },
  { value: 'CANCELLED', label: ORDER_STATUS_LABELS.CANCELLED },
];

function formatDate(d: string) {
  return new Date(d).toLocaleString('vi-VN');
}

export default function OrdersAdminClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const url = filter === 'ALL' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdvance = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action: 'advance' }),
    });
    load();
  };

  const handleCancel = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Xác nhận hủy đơn hàng?')) return;
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action: 'cancel' }),
    });
    load();
  };

  const columns: Column<Order>[] = useMemo(
    () => [
      { key: 'id', header: 'Mã đơn', render: (o) => <span className="text-brand-gold">{o.id}</span> },
      { key: 'customer', header: 'Khách hàng', render: (o) => o.customerName },
      { key: 'amount', header: 'Tổng tiền', render: (o) => formatVnd(o.totalAmount) },
      { key: 'status', header: 'Trạng thái', render: (o) => <StatusBadge status={o.status} /> },
      { key: 'time', header: 'Thời gian', render: (o) => formatDate(String(o.createdAt)) },
    ],
    [],
  );

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl tracking-widest text-brand-gold">Quản lý đơn hàng</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded border px-3 py-1 text-xs tracking-wider transition ${
              filter === value
                ? 'border-brand-gold/60 bg-brand-gold/10 text-brand-gold'
                : 'border-brand-gold/20 text-gray-500 hover:border-brand-gold/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          keyField={(o) => o.id}
          expandedRow={expandedId}
          onRowClick={(o) => setExpandedId(expandedId === o.id ? null : o.id)}
          renderExpanded={(o) => (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Thông tin khách</p>
                  <p className="text-sm text-gray-300">{o.customerName}</p>
                  <p className="text-sm text-gray-400">{o.customerEmail}</p>
                  {o.customerPhone && <p className="text-sm text-gray-400">{o.customerPhone}</p>}
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Sản phẩm</p>
                  <ul className="space-y-1">
                    {o.items.map((item) => (
                      <li key={item.productId} className="text-sm text-gray-300">
                        {item.productName} × {item.quantity} — {formatVnd(item.unitPrice * item.quantity)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3">
                {getNextStatusActionLabel(o.status) && (
                  <button
                    type="button"
                    onClick={(e) => handleAdvance(o.id, e)}
                    className="btn-gold rounded px-4 py-2 text-xs tracking-widest text-brand-black uppercase"
                  >
                    {getNextStatusActionLabel(o.status)}
                  </button>
                )}
                {o.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={(e) => handleCancel(o.id, e)}
                    className="rounded border border-brand-red/40 px-4 py-2 text-xs tracking-widest text-brand-red transition hover:bg-brand-red/10"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
