'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

export default function AdminPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePricePerMonth: '',
    serviceId: '',
    vCPU: '',
    RAM: '',
    storage: '',
    bandwidth: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, servicesRes] = await Promise.all([
        fetch('/api/plans'),
        fetch('/api/services'),
      ]);

      const plansData = await plansRes.json();
      const servicesData = await servicesRes.json();

      setPlans(plansData.data || []);
      setServices(servicesData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/plans/${editingId}` : '/api/plans';
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePricePerMonth: parseFloat(formData.basePricePerMonth),
          vCPU: parseInt(formData.vCPU),
          RAM: parseFloat(formData.RAM),
          storage: parseInt(formData.storage),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({
          name: '',
          description: '',
          basePricePerMonth: '',
          serviceId: '',
          vCPU: '',
          RAM: '',
          storage: '',
          bandwidth: '',
        });
        setShowForm(false);
        setEditingId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save plan:', error);
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      description: plan.description,
      basePricePerMonth: plan.basePricePerMonth.toString(),
      serviceId: plan.serviceId,
      vCPU: plan.vCPU.toString(),
      RAM: plan.RAM.toString(),
      storage: plan.storage.toString(),
      bandwidth: plan.bandwidth || '',
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      basePricePerMonth: '',
      serviceId: '',
      vCPU: '',
      RAM: '',
      storage: '',
      bandwidth: '',
    });
    setShowForm(false);
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete plan:', error);
      }
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

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name || 'Unknown Service';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader title="Plans Management" subtitle="Manage pricing plans" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Add Plan Button */}
        <button
          onClick={() => {
            if (showForm) {
              handleCancelEdit();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mb-8 transition"
        >
          {showForm ? 'Cancel' : '+ Add Plan'}
        </button>

        {/* Add/Edit Plan Form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Edit Plan' : 'Add New Plan'}
            </h2>
            <form onSubmit={handleAddPlan}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Service</label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Starter"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Price (Monthly)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basePricePerMonth}
                    onChange={(e) => setFormData({ ...formData, basePricePerMonth: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="9.99"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">vCPU</label>
                  <input
                    type="number"
                    required
                    value={formData.vCPU}
                    onChange={(e) => setFormData({ ...formData, vCPU: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">RAM (GB)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.RAM}
                    onChange={(e) => setFormData({ ...formData, RAM: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Bandwidth</label>
                <input
                  type="text"
                  required
                  value={formData.bandwidth}
                  onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Unlimited"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Plan description..."
                />
              </div>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                {editingId ? 'Update Plan' : 'Add Plan'}
              </button>
            </form>
          </div>
        )}

        {/* Plans List */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">All Plans</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">No plans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">Service</th>
                    <th className="px-6 py-3 text-left text-gray-300">Plan Name</th>
                    <th className="px-6 py-3 text-left text-gray-300">Price</th>
                    <th className="px-6 py-3 text-left text-gray-300">vCPU</th>
                    <th className="px-6 py-3 text-left text-gray-300">RAM</th>
                    <th className="px-6 py-3 text-left text-gray-300">Storage</th>
                    <th className="px-6 py-3 text-left text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan: any) => (
                    <tr key={plan._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 text-gray-300">{getServiceName(plan.serviceId)}</td>
                      <td className="px-6 py-4 text-white font-semibold">{plan.name}</td>
                      <td className="px-6 py-4 text-white font-bold">${(plan.basePricePerMonth || 0).toFixed(2)}/mo</td>
                      <td className="px-6 py-4 text-gray-300">{plan.vCPU}</td>
                      <td className="px-6 py-4 text-gray-300">{plan.RAM}GB</td>
                      <td className="px-6 py-4 text-gray-300">{plan.storage}GB</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
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
