'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface OrderItem {
  planId: string;
  planName: string;
  planDescription: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  billingInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  working_on_it: 'bg-blue-500/20 text-blue-400',
  failed: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/user/orders/${id}`, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 401) { router.push('/auth/login?redirect=/dashboard'); return; }
          setError('Invoice not found.');
          return;
        }
        const data = await res.json();
        setOrder(data.data);
      } catch {
        setError('Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Invoice not found.'}</p>
          <Link href="/dashboard" className="text-blue-400 hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const statusLabel = order.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const statusStyle = STATUS_STYLES[order.status] || 'bg-gray-500/20 text-gray-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link href="/dashboard" className="text-blue-400 hover:underline text-sm">
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-sm"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 print:bg-white print:border-gray-200 print:text-black">

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white print:text-black">INVOICE</h1>
              <p className="text-gray-400 print:text-gray-600 mt-1 font-mono text-sm">#{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400 print:text-blue-600">Wave</p>
              <p className="text-gray-400 print:text-gray-600 text-sm">wave.com</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-slate-700/50 print:bg-gray-100 rounded-lg px-4 py-3 flex-1 min-w-[140px]">
              <p className="text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide mb-1">Status</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle}`}>
                {statusLabel}
              </span>
            </div>
            <div className="bg-slate-700/50 print:bg-gray-100 rounded-lg px-4 py-3 flex-1 min-w-[140px]">
              <p className="text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide mb-1">Date Issued</p>
              <p className="text-white print:text-black font-semibold text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-slate-700/50 print:bg-gray-100 rounded-lg px-4 py-3 flex-1 min-w-[140px]">
              <p className="text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide mb-1">Payment Method</p>
              <p className="text-white print:text-black font-semibold text-sm capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide mb-2">Billed To</h2>
            <div className="text-white print:text-black">
              <p className="font-semibold">{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
              <p className="text-gray-300 print:text-gray-600 text-sm">{order.billingInfo.email}</p>
              <p className="text-gray-300 print:text-gray-600 text-sm">{order.billingInfo.address}</p>
              <p className="text-gray-300 print:text-gray-600 text-sm">
                {order.billingInfo.city}, {order.billingInfo.postalCode}
              </p>
              <p className="text-gray-300 print:text-gray-600 text-sm">{order.billingInfo.country}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600 print:border-gray-300">
                  <th className="text-left text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide pb-2">Service / Plan</th>
                  <th className="text-center text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide pb-2">Qty</th>
                  <th className="text-right text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide pb-2">Unit Price</th>
                  <th className="text-right text-gray-400 print:text-gray-500 text-xs uppercase tracking-wide pb-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-700/50 print:border-gray-200">
                    <td className="py-3">
                      <p className="text-white print:text-black font-medium">{item.planName}</p>
                      {item.planDescription && (
                        <p className="text-gray-400 print:text-gray-500 text-xs mt-0.5">{item.planDescription}</p>
                      )}
                    </td>
                    <td className="py-3 text-center text-gray-300 print:text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-300 print:text-gray-600">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right text-white print:text-black font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t border-slate-600 print:border-gray-300">
                <span className="text-gray-400 print:text-gray-500">Subtotal</span>
                <span className="text-white print:text-black">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-blue-500 print:border-blue-600 mt-1">
                <span className="text-white print:text-black font-bold text-lg">Total</span>
                <span className="text-blue-400 print:text-blue-600 font-bold text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 print:border-gray-200 pt-6 text-center">
            <p className="text-gray-400 print:text-gray-500 text-sm">Thank you for your business!</p>
            <p className="text-gray-500 print:text-gray-400 text-xs mt-1">For questions, contact support@wave.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
