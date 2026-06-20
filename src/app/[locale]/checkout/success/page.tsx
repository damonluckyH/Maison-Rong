import { Suspense } from 'react';
import CheckoutSuccessClient from '@/components/CheckoutSuccessClient';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <Suspense fallback={<p className="py-20 text-center text-gray-500">...</p>}>
        <CheckoutSuccessClient />
      </Suspense>
    </div>
  );
}
