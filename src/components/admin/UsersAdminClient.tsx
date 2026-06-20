'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import SearchInput from '@/components/admin/SearchInput';
import StatusBadge, { TagBadge, TierBadge } from '@/components/admin/StatusBadge';
import { formatVnd } from '@/lib/products';
import type { Tier } from '@/lib/loyalty';
import type { UserTags } from '@/lib/db';
import type { Order } from '@/lib/orders';

interface UserRow {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  tier: Tier;
  points: number;
  tags: UserTags;
  createdAt: string;
  gender: string;
  birthDate: string;
  bloodType: string;
  baziReport?: {
    dayMaster: { element: string };
    deficits: string[];
    favorableElements: string[];
  };
}

interface UserDetail {
  user: UserRow;
  orders: Order[];
  pointsLogs: { id: string; amount: number; reason: string; balance: number; createdAt: string }[];
}

const TIERS: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

export default function UsersAdminClient() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q = query) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const loadDetail = async (userId: string) => {
    const res = await fetch(`/api/admin/users?userId=${userId}`);
    const data = await res.json();
    setDetail(data);
  };

  const handleRowClick = (user: UserRow) => {
    if (expandedId === user.id) {
      setExpandedId(null);
      setDetail(null);
    } else {
      setExpandedId(user.id);
      loadDetail(user.id);
    }
  };

  const updateTier = async (userId: string, tier: Tier) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tier }),
    });
    load();
    loadDetail(userId);
  };

  const toggleTag = async (userId: string, tag: 'vip' | 'blacklist', current: boolean) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tags: { [tag]: !current } }),
    });
    load();
    loadDetail(userId);
  };

  const columns: Column<UserRow>[] = useMemo(
    () => [
      { key: 'name', header: 'Họ tên', render: (u) => u.fullName },
      { key: 'email', header: 'Email', render: (u) => u.email ?? '—' },
      { key: 'tier', header: 'Hạng', render: (u) => <TierBadge tier={u.tier} /> },
      { key: 'points', header: 'Điểm', render: (u) => u.points.toLocaleString() },
      {
        key: 'tags',
        header: 'Nhãn',
        render: (u) => (
          <div className="flex gap-1">
            {u.tags.vip && <TagBadge label="VIP" variant="vip" />}
            {u.tags.blacklist && <TagBadge label="Blacklist" variant="blacklist" />}
            {!u.tags.vip && !u.tags.blacklist && <TagBadge label="—" variant="neutral" />}
          </div>
        ),
      },
      {
        key: 'created',
        header: 'Đăng ký',
        render: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN'),
      },
    ],
    [],
  );

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl tracking-widest text-brand-gold">Quản lý thành viên</h2>

      <div className="mb-4 flex gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo tên, email, SĐT..."
          className="max-w-md flex-1"
        />
        <button
          type="button"
          onClick={() => load(query)}
          className="rounded border border-brand-gold/40 px-4 py-2 text-xs tracking-widest text-brand-gold hover:bg-brand-gold/10"
        >
          Tìm kiếm
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500">Đang tải...</p>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          keyField={(u) => u.id}
          expandedRow={expandedId}
          onRowClick={handleRowClick}
          renderExpanded={() => {
            if (!detail) return <p className="text-gray-500">Đang tải chi tiết...</p>;
            const u = detail.user;
            return (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Thông tin cá nhân</p>
                    <p className="text-sm text-gray-300">Giới tính: {u.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
                    <p className="text-sm text-gray-300">Ngày sinh: {u.birthDate}</p>
                    <p className="text-sm text-gray-300">Nhóm máu: {u.bloodType}</p>
                    <p className="text-sm text-gray-300">SĐT: {u.phone ?? '—'}</p>
                  </div>

                  {u.baziReport && (
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Ngũ Hành</p>
                      <p className="text-sm text-gray-300">Nhật Chủ: {u.baziReport.dayMaster.element}</p>
                      <p className="text-sm text-gray-300">
                        Thiếu: {u.baziReport.deficits.length ? u.baziReport.deficits.join(', ') : 'Không'}
                      </p>
                      <p className="text-sm text-gray-300">
                        Hỷ thần: {u.baziReport.favorableElements.join(', ')}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">Điều chỉnh hạng</p>
                    <select
                      value={u.tier}
                      onChange={(e) => updateTier(u.id, e.target.value as Tier)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200 outline-none"
                    >
                      {TIERS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(u.id, 'vip', u.tags.vip);
                      }}
                      className={`rounded border px-3 py-1.5 text-xs ${
                        u.tags.vip
                          ? 'border-brand-gold/60 bg-brand-gold/10 text-brand-gold'
                          : 'border-brand-gold/20 text-gray-500'
                      }`}
                    >
                      {u.tags.vip ? '✓ VIP' : 'Đặt VIP'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(u.id, 'blacklist', u.tags.blacklist);
                      }}
                      className={`rounded border px-3 py-1.5 text-xs ${
                        u.tags.blacklist
                          ? 'border-brand-red/60 bg-brand-red/10 text-brand-red'
                          : 'border-brand-gold/20 text-gray-500'
                      }`}
                    >
                      {u.tags.blacklist ? '✓ Blacklist' : 'Blacklist'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                      Lịch sử đơn hàng ({detail.orders.length})
                    </p>
                    {detail.orders.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có đơn hàng</p>
                    ) : (
                      <ul className="space-y-2">
                        {detail.orders.map((o) => (
                          <li key={o.id} className="flex items-center justify-between rounded border border-brand-gold/10 p-2 text-sm">
                            <span className="text-brand-gold">{o.id}</span>
                            <StatusBadge status={o.status} />
                            <span className="text-gray-400">{formatVnd(o.totalAmount)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                      Lịch sử điểm ({detail.pointsLogs.length})
                    </p>
                    {detail.pointsLogs.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có giao dịch điểm</p>
                    ) : (
                      <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
                        {detail.pointsLogs.map((log) => (
                          <li key={log.id} className="flex justify-between text-gray-400">
                            <span>
                              {log.amount > 0 ? '+' : ''}
                              {log.amount} — {log.reason}
                            </span>
                            <span>{new Date(log.createdAt).toLocaleDateString('vi-VN')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
