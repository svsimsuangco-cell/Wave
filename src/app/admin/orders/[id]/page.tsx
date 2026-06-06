'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Failed to load order');
      }
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError('Failed to update order status');
      }
    } catch (error) {
      setError('Error updating order status');
      console.error('Failed to update order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-4">{error || 'Order not found'}</p>
            <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader 
        title="Order Details" 
        subtitle={`Order: ${order.orderNumber}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Orders
        </Link>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Status</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {['pending', 'working_on_it', 'completed', 'failed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={order.status === status || updating}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      order.status === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:opacity-50'
                    }`}
                  >
                    {status === 'working_on_it'
                      ? 'Working On It'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <p className="text-gray-300">
                  Current Status:{' '}
                  <span
                    className={`font-bold ${
                      order.status === 'completed'
                        ? 'text-green-400'
                        : order.status === 'working_on_it'
                        ? 'text-blue-400'
                        : order.status === 'pending'
                        ? 'text-yellow-400'
                        : order.status === 'cancelled'
                        ? 'text-gray-400'
                        : 'text-red-400'
                    }`}
                  >
                    {order.status === 'working_on_it'
                      ? 'Working On It'
                      : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Services Ordered</h2>
              <div className="space-y-4">
                {order.items && order.items.map((item: any, index: number) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{item.planName}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.planDescription}</p>
                        <p className="text-gray-300 mt-3">
                          Quantity: <span className="font-semibold">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">${(item.price || 0).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">per month</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-300">Total Amount:</span>
                  <span className="text-3xl font-bold text-blue-400">${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Customer Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold break-all text-sm">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Billing Address</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>
                  <span className="font-semibold">
                    {order.billingInfo?.firstName} {order.billingInfo?.lastName}
                  </span>
                </p>
                <p>{order.billingInfo?.address}</p>
                <p>
                  {order.billingInfo?.city}, {order.billingInfo?.country} {order.billingInfo?.postalCode}
                </p>
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Order Number</p>
                  <p className="text-white font-mono break-all">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Order Date</p>
                  <p className="text-white">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}{' '}
                    {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Last Updated</p>
                  <p className="text-white">
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A'}{' '}
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleTimeString() : ''}
                  </p>
                </div>
                {order.stripePaymentIntentId && (
                  <div>
                    <p className="text-gray-400 mb-1">Payment ID</p>
                    <p className="text-white font-mono text-xs break-all">{order.stripePaymentIntentId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
