'use client';

import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-brand-gold/10 bg-brand-black/90 px-6 backdrop-blur-md">
      <h1 className="font-serif text-lg tracking-widest text-brand-gold-light">MAISON LẠC Admin</h1>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded border border-brand-gold/30 px-4 py-1.5 text-xs tracking-widest text-brand-gold transition hover:border-brand-gold hover:bg-brand-gold/10"
      >
        Đăng xuất
      </button>
    </header>
  );
}
