'use client';

import { useCallback, useEffect, useState } from 'react';
import SearchInput from '@/components/admin/SearchInput';
import { TierBadge } from '@/components/admin/StatusBadge';
import type { AdminPointsLog } from '@/lib/db';
import type { Tier } from '@/lib/loyalty';

interface UserSummary {
  id: string;
  fullName: string;
  email?: string;
  points: number;
  tier: Tier;
}

export default function PointsAdminClient() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selected, setSelected] = useState<UserSummary | null>(null);
  const [batchSelected, setBatchSelected] = useState<Set<string>>(new Set());
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [logs, setLogs] = useState<AdminPointsLog[]>([]);
  const [message, setMessage] = useState('');

  const load = useCallback(async (q = query) => {
    const res = await fetch(`/api/admin/points?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLogs(data.logs ?? []);
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = () => load(query);

  const handleSelect = (user: UserSummary) => {
    setSelected(user);
    setBatchSelected(new Set());
  };

  const toggleBatch = (userId: string) => {
    setBatchSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
    setSelected(null);
  };

  const submitPoints = async (userIds: string[]) => {
    const num = parseInt(amount, 10);
    if (!num || !reason.trim()) {
      setMessage('Nhập số điểm và lý do');
      return;
    }

    const res = await fetch('/api/admin/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        userIds.length === 1
          ? { userId: userIds[0], amount: num, reason: reason.trim() }
          : { userIds, amount: num, reason: reason.trim() },
      ),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Lỗi');
      return;
    }

    setMessage(userIds.length > 1 ? `Đã cộng điểm cho ${data.count} thành viên` : 'Cập nhật điểm thành công');
    setAmount('');
    setReason('');
    setSelected(data.user ?? null);
    setLogs(data.logs ?? []);
    load();
  };

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl tracking-widest text-brand-gold">Quản lý điểm</h2>

      <div className="flex gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo tên hoặc email..."
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded border border-brand-gold/40 px-4 py-2 text-xs tracking-widest text-brand-gold hover:bg-brand-gold/10"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Chọn thành viên</p>
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {users.map((u) => (
              <li
                key={u.id}
                className={`flex items-center gap-3 rounded border p-3 transition ${
                  selected?.id === u.id ? 'border-brand-gold/50 bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={batchSelected.has(u.id)}
                  onChange={() => toggleBatch(u.id)}
                  className="accent-brand-gold"
                />
                <button type="button" onClick={() => handleSelect(u)} className="flex-1 text-left">
                  <p className="text-sm text-gray-200">{u.fullName}</p>
                  <p className="text-xs text-gray-500">{u.email ?? '—'}</p>
                </button>
                <div className="text-right">
                  <p className="text-sm text-brand-gold">{u.points.toLocaleString()} đ</p>
                  <TierBadge tier={u.tier} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Điều chỉnh điểm</p>
          {selected && (
            <div className="mb-4 rounded border border-brand-gold/20 bg-brand-black/50 p-3">
              <p className="text-sm text-gray-300">{selected.fullName}</p>
              <p className="mt-1 text-brand-gold">
                {selected.points.toLocaleString()} đ — <TierBadge tier={selected.tier} />
              </p>
            </div>
          )}
          {batchSelected.size > 0 && (
            <p className="mb-3 text-sm text-brand-gold-light">Đã chọn {batchSelected.size} thành viên (cộng hàng loạt)</p>
          )}
          <div className="space-y-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Số điểm (+/-)"
              className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200 outline-none focus:border-brand-gold/50"
            />
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lý do (vd: admin_adjustment)"
              className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200 outline-none focus:border-brand-gold/50"
            />
            <button
              type="button"
              onClick={() => {
                if (batchSelected.size > 0) submitPoints(Array.from(batchSelected));
                else if (selected) submitPoints([selected.id]);
                else setMessage('Chọn thành viên trước');
              }}
              className="btn-gold w-full rounded py-2.5 text-xs tracking-widest text-brand-black uppercase"
            >
              Xác nhận
            </button>
            {message && <p className="text-sm text-brand-jade">{message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-serif text-lg text-brand-gold-light">Nhật ký điều chỉnh</h3>
        <div className="overflow-x-auto rounded-lg border border-brand-gold/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-gold/10 text-xs uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3 font-normal">Thời gian</th>
                <th className="px-4 py-3 font-normal">Thành viên</th>
                <th className="px-4 py-3 font-normal">Thay đổi</th>
                <th className="px-4 py-3 font-normal">Lý do</th>
                <th className="px-4 py-3 font-normal">Người thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Chưa có nhật ký
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-brand-gold/5">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{log.userName}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        log.amount > 0 ? 'text-brand-jade' : 'text-brand-red'
                      }`}
                    >
                      {log.amount > 0 ? '+' : ''}
                      {log.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{log.reason}</td>
                    <td className="px-4 py-3 text-gray-500">{log.operator}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
