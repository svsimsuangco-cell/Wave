'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    activeServices: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data || []);

        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();

        const totalRevenue = (ordersData.data || []).reduce(
          (sum: number, order: any) => sum + (order.totalPrice || 0),
          0
        );

        setStats({
          totalOrders: (ordersData.data || []).length,
          totalCustomers: new Set((ordersData.data || []).map((o: any) => o.userId)).size,
          totalRevenue,
          activeServices: servicesData.data?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader title="Admin Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-blue-400">{stats.totalOrders}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 mb-2">Total Customers</p>
            <p className="text-4xl font-bold text-green-400">{stats.totalCustomers}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-purple-400">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 mb-2">Active Services</p>
            <p className="text-4xl font-bold text-yellow-400">{stats.activeServices}</p>
          </div>
        </div>

        {/* Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/services"
            className="bg-slate-800 border border-slate-700 hover:border-blue-400 rounded-lg p-6 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">Manage Services</h3>
            <p className="text-gray-400 mb-4">Add, edit, or delete hosting services</p>
            <span className="text-blue-400 font-semibold">Go to Services →</span>
          </Link>

          <Link
            href="/admin/plans"
            className="bg-slate-800 border border-slate-700 hover:border-blue-400 rounded-lg p-6 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">Manage Plans</h3>
            <p className="text-gray-400 mb-4">Create and modify pricing plans</p>
            <span className="text-blue-400 font-semibold">Go to Plans →</span>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-slate-800 border border-slate-700 hover:border-blue-400 rounded-lg p-6 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">View Orders</h3>
            <p className="text-gray-400 mb-4">Track and manage customer orders</p>
            <span className="text-blue-400 font-semibold">Go to Orders →</span>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">Order ID</th>
                    <th className="px-6 py-3 text-left text-gray-300">Customer</th>
                    <th className="px-6 py-3 text-left text-gray-300">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-300">{order.billingInfo?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-white font-bold">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
