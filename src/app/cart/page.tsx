'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        setPlans(data.data || []);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartItems(JSON.parse(cart));
    }

    fetchPlans();
  }, []);

  const getCartItemDetails = (planId: string) => {
    return plans.find((p) => p._id === planId);
  };

  const removeFromCart = (planId: string) => {
    const updated = cartItems.filter((item) => item.planId !== planId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    
    // Dispatch custom event to notify Header
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const plan = getCartItemDetails(item.planId);
    return sum + (plan?.basePricePerMonth || 0) * item.quantity;
  }, 0);

  if (loading) return <p className="text-center text-gray-400 py-20">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Link
              href="/services"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden mb-8">
              {cartItems.map((item) => {
                const plan = getCartItemDetails(item.planId);
                return (
                  <div
                    key={item.planId}
                    className="p-6 border-b border-slate-700 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-white font-bold text-lg">{plan?.name}</h3>
                      <p className="text-gray-400">
                        ${plan?.basePricePerMonth} × {item.quantity} = $
                        {(plan?.basePricePerMonth || 0) * item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.planId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 text-lg">Total:</span>
                <span className="text-4xl font-bold text-blue-400">${totalPrice.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition text-center block"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
