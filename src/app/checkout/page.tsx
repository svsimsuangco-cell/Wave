'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Plan {
  _id: string;
  name: string;
  monthlyPrice?: number;
  basePricePerMonth?: number;
  vCpus?: number;
  vCPU?: number;
  ram?: number;
  RAM?: number;
  storage: number;
  bandwidth: string;
  description: string;
  serviceId: string;
}

interface CartItem {
  planId: string;
  quantity: number;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  // Check authentication and fetch data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (!authResponse.ok) {
          router.push('/auth/login?redirect=/checkout');
          return;
        }

        setIsAuthenticated(true);

        // Get cart from localStorage
        let cart = localStorage.getItem('cart');
        let items = cart ? JSON.parse(cart) : [];

        // If cart is empty, check for plan ID in URL (for "Buy Now" button)
        if (items.length === 0) {
          const searchParams = new URLSearchParams(window.location.search);
          const planId = searchParams.get('plan');
          if (planId) {
            items = [{ planId, quantity: 1 }];
          }
        }

        setCartItems(items);

        // If still no items, redirect to pricing
        if (items.length === 0) {
          router.push('/pricing');
          return;
        }

        // Fetch plans and services
        const plansResponse = await fetch('/api/plans');
        const plansData = await plansResponse.json();
        if (plansData.success) {
          setPlans(plansData.data);
        }

        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        if (servicesData.success) {
          setServices(servicesData.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/login?redirect=/checkout');
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  // Load PayPal SDK when payment method is PayPal
  useEffect(() => {
    if (paymentMethod === 'paypal' && !window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [paymentMethod]);

  const getPlanDetails = (planId: string) => {
    return plans.find(p => p._id === planId);
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s._id === serviceId)?.name || 'Service';
  };

  const calculatePrice = (basePrice: number) => {
    if (billingPeriod === 'yearly') {
      return (basePrice * 12 * 0.8).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const getTotalPrice = () => {
    let total = 0;
    cartItems.forEach(item => {
      const plan = getPlanDetails(item.planId);
      const basePrice = plan?.basePricePerMonth || plan?.monthlyPrice || 0;
      total += basePrice * item.quantity;
    });
    return calculatePrice(total);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    setMessage('');

    try {
      if (paymentMethod === 'stripe') {
        const response = await fetch('/api/stripe/checkout-multi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            cartItems,
            billingPeriod,
          }),
        });

        const data = await response.json();

        if (response.ok && data.data?.url) {
          window.location.href = data.data.url;
        } else {
          setMessage('Error: ' + (data.error || 'Failed to create checkout session'));
        }
      } else if (paymentMethod === 'paypal') {
        const response = await fetch('/api/paypal/checkout-multi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            cartItems,
            billingPeriod,
          }),
        });

        const data = await response.json();

        if (response.ok && data.data?.approvalUrl) {
          // Store the database order ID for later use
          sessionStorage.setItem('pendingOrderId', data.data.dbOrderId);
          window.location.href = data.data.approvalUrl;
        } else {
          setMessage('Error: ' + (data.error || 'Failed to create PayPal order'));
        }
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="mb-4">⏳ Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">You must be logged in to proceed</p>
          <Link href="/auth/login?redirect=/checkout" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Add items to your cart to proceed</p>
          <Link href="/pricing" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
            Browse Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4">Secure Checkout</h1>
        <p className="text-gray-400 mb-12">Review your items and complete your purchase</p>

        {message && (
          <div className={`p-4 rounded-lg mb-8 ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const plan = getPlanDetails(item.planId);
                  const basePrice = plan?.basePricePerMonth || plan?.monthlyPrice || 0;
                  const itemTotal = basePrice * item.quantity;
                  return (
                    <div key={item.planId} className="bg-slate-700 rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{plan?.name}</h3>
                        <p className="text-sm text-gray-400">{getServiceName(plan?.serviceId || '')}</p>
                        <p className="text-gray-300 text-sm mt-2">
                          ${basePrice.toFixed(2)}/month × {item.quantity} = ${itemTotal.toFixed(2)}/month
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Order Summary + Billing */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 sticky top-20">
              <h3 className="text-2xl font-bold text-white mb-6">Summary</h3>

              {/* Billing Period Toggle */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-semibold">Billing Period</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`flex-1 py-2 px-4 rounded-lg transition font-semibold ${
                      billingPeriod === 'monthly'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`flex-1 py-2 px-4 rounded-lg transition font-semibold ${
                      billingPeriod === 'yearly'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Yearly
                    <div className="text-xs text-green-300">Save 20%</div>
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="mb-2">
                  <div className="text-gray-400 text-sm mb-1">Total ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-blue-400">
                      ${getTotalPrice()}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {billingPeriod === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="text-green-400 text-sm mt-2">
                      ✓ 20% discount applied
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-semibold">Payment Method</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex-1 py-3 px-4 rounded-lg transition font-semibold ${
                      paymentMethod === 'stripe'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    💳 Stripe
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 py-3 px-4 rounded-lg transition font-semibold ${
                      paymentMethod === 'paypal'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    🅿️ PayPal
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition mb-4"
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>
                  Payments processed securely by{' '}
                  {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}
                </span>
              </div>

              <Link
                href="/pricing"
                className="text-blue-400 hover:text-blue-300 text-sm mt-6 block text-center"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
