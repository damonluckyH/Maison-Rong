import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

export default function AdminRootPage() {
  const token = cookies().get('admin_session')?.value;
  if (token && isAdmin(token)) {
    redirect('/admin/orders');
  }
  redirect('/admin/login');
}
