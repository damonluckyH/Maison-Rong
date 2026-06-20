import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_session')?.value;
  if (!token || !isAdmin(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-brand-black">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
