'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/orders', label: 'Quản lý đơn hàng', icon: '📦' },
  { href: '/admin/points', label: 'Quản lý điểm', icon: '⭐' },
  { href: '/admin/users', label: 'Quản lý thành viên', icon: '👥' },
  { href: '/admin/products', label: 'Quản lý sản phẩm', icon: '🛍️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-brand-gold/10 bg-brand-black-light">
      <div className="border-b border-brand-gold/10 px-5 py-6">
        <p className="font-serif text-lg tracking-widest text-gradient-gold">MAISON RỒNG</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gray-500">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? 'bg-brand-gold/10 text-brand-gold'
                  : 'text-gray-400 hover:bg-brand-black hover:text-gray-200'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
