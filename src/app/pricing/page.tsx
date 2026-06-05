'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Pricing() {
  const [services, setServices] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();
        setServices(servicesData.data || []);
        if (servicesData.data && servicesData.data.length > 0) {
          setSelectedService(servicesData.data[0]._id);
        }

        const plansRes = await fetch('/api/plans');
        const plansData = await plansRes.json();
        setPlans(plansData.data || []);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const items = JSON.parse(cart);
      setCartCount(items.length);
    } else {
      setCartCount(0);
    }
  };

  const addToCart = (planId: string, planName: string) => {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    
    const existingItem = cartItems.find((item: any) => item.planId === planId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ planId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    
    // Dispatch custom event to notify Header and other components
    window.dispatchEvent(new Event('cartUpdated'));
    
    setNotification({ message: `${planName} added to cart!`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredPlans = selectedService
    ? plans.filter((plan) => plan.serviceId === selectedService)
    : [];

  if (loading) return <p className="text-center text-gray-400 py-20">Loading pricing...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
            <p className="text-gray-300 max-w-2xl">
              Choose the perfect plan for your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          {cartCount > 0 && (
            <Link
              href="/cart"
              className="relative bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Cart
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {cartCount}
              </span>
            </Link>
          )}
        </div>

        <div className="flex justify-center mb-12 gap-4 flex-wrap">
          {services.map((service) => (
            <button
              key={service._id}
              onClick={() => setSelectedService(service._id)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedService === service._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-400 transition flex flex-col"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-400">${plan.basePricePerMonth}</span>
                <span className="text-gray-400">/month</span>
              </div>

              <div className="space-y-3 mb-6 border-y border-slate-700 py-6">
                <p className="text-gray-300">
                  <strong>vCPU:</strong> {plan.vCPU} cores
                </p>
                <p className="text-gray-300">
                  <strong>RAM:</strong> {plan.RAM} GB
                </p>
                <p className="text-gray-300">
                  <strong>Storage:</strong> {plan.storage} GB
                </p>
                <p className="text-gray-300">
                  <strong>Bandwidth:</strong> {plan.bandwidth}
                </p>
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="text-gray-300 flex items-center">
                    <span className="text-green-400 mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <button
                  onClick={() => addToCart(plan._id, plan.name)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Add to Cart
                </button>
                <Link
                  href={`/checkout?plan=${plan._id}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition text-center block"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
