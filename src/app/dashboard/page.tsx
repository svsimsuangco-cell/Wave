'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: Array<{
    planId: string;
    planName?: string;
    quantity: number;
    price: number;
  }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServices, setActiveServices] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's orders
        const ordersRes = await fetch('/api/user/orders', {
          method: 'GET',
          credentials: 'include',
        });

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.data || []);

          // Calculate stats
          const completed = ordersData.data?.filter((o: Order) => o.status === 'completed') || [];
          setActiveServices(completed.length);
          const spent = completed.reduce((sum: number, o: Order) => sum + o.totalPrice, 0);
          setTotalSpent(spent);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">Active Services</h3>
            <p className="text-4xl text-blue-400 font-bold">{activeServices}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">Total Spent</h3>
            <p className="text-4xl text-green-400 font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">Account Status</h3>
            <p className="text-2xl text-yellow-400 font-bold">Active</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
          {loading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div>
              <p className="text-gray-400 mb-4">No orders yet. Start by browsing our services!</p>
              <Link
                href="/services"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-300">Order #</th>
                    <th className="px-4 py-2 text-left text-gray-300">Items</th>
                    <th className="px-4 py-2 text-left text-gray-300">Amount</th>
                    <th className="px-4 py-2 text-left text-gray-300">Status</th>
                    <th className="px-4 py-2 text-left text-gray-300">Date</th>
                    <th className="px-4 py-2 text-left text-gray-300">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-white font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {order.items.map((item) => (
                          <div key={item.planId}>{item.planName || 'Plan'} (x{item.quantity})</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-white font-bold">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/invoices/${order._id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium underline underline-offset-2"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/services"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-center"
            >
              View Services
            </Link>
            <Link
              href="/pricing"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-center"
            >
              View Pricing
            </Link>
            <Link
              href="/cart"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-center"
            >
              Shopping Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
