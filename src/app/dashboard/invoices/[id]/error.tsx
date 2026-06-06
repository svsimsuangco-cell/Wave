'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function InvoiceError({ error }: { error: Error }) {
  useEffect(() => {
    console.error('Invoice page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-2">Something went wrong loading this invoice.</p>
        <p className="text-gray-500 text-sm mb-6">{error?.message}</p>
        <Link href="/dashboard" className="text-blue-400 hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );
}
