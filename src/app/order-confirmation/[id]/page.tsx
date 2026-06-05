'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center text-gray-400 py-20">Loading order details...</p>;
  if (!order) return <p className="text-center text-gray-400 py-20">Order not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-500 text-white p-6 rounded-lg mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <p className="text-gray-400 mb-2">Order Number</p>
            <p className="text-white text-2xl font-bold">{order.orderNumber}</p>
          </div>

          <div className="mb-6 border-y border-slate-700 py-6">
            <p className="text-gray-400 mb-2">Total Amount</p>
            <p className="text-blue-400 text-4xl font-bold">${order.totalPrice}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-bold mb-2">Billing Information</h3>
            <div className="text-gray-300 space-y-1">
              <p>{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
              <p>{order.billingInfo.email}</p>
              <p>{order.billingInfo.address}</p>
              <p>{order.billingInfo.city}, {order.billingInfo.country} {order.billingInfo.postalCode}</p>
            </div>
          </div>

          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <p className="font-bold mb-2">Next Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Payment information will be sent to your email</li>
              <li>Complete payment to activate your service</li>
              <li>Instant activation upon successful payment</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/services"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
