'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Đăng nhập thất bại');
      setLoading(false);
      return;
    }

    router.push('/admin/orders');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <div className="w-full max-w-md rounded-xl border border-brand-gold/20 bg-brand-black-light/60 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl tracking-widest text-gradient-gold">MAISON RỒNG</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-500">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-brand-gold/20 bg-brand-black px-4 py-3 text-sm text-gray-200 outline-none focus:border-brand-gold/50"
              placeholder="admin@maisonlac.vn"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-brand-gold/20 bg-brand-black px-4 py-3 text-sm text-gray-200 outline-none focus:border-brand-gold/50"
              required
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
