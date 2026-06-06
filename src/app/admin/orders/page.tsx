'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const res = await fetch(`/api/orders?${query}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader title="Orders Management" subtitle="View and manage all customer orders" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/admin/dashboard"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Filter Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Filter Orders</h2>
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'working_on_it', 'completed', 'failed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {status === 'all' 
                  ? 'All'
                  : status === 'working_on_it'
                  ? 'Working On It'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">
              {statusFilter !== 'all' ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders` : 'All Orders'}
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Services</th>
                    <th className="px-6 py-3 text-right text-gray-300 font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 text-white font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-300">{order.customerName}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{order.customerEmail}</td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-bold text-right">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                            order.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'working_on_it'
                              ? 'bg-blue-500/20 text-blue-400'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : order.status === 'cancelled'
                              ? 'bg-gray-500/20 text-gray-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {order.status === 'working_on_it'
                            ? 'Working On It'
                            : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold transition"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-700 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                ← Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
