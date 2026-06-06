'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const token = searchParams.get('token');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Handle PayPal return (with token)
        if (token) {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paypalOrderId: token }),
          });

          const data = await res.json();
          if (data.success) {
            setSession(data.data);
          } else {
            setError(data.error || 'Payment capture failed');
          }
        }
        // Handle Stripe return (with session_id)
        else if (sessionId) {
          const res = await fetch(`/api/stripe/session/${sessionId}`);
          const data = await res.json();
          if (data.success) {
            setSession(data.data);
          } else {
            setError('Failed to fetch session');
          }
        } else {
          setError('No payment information found');
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <p className="text-gray-400 text-lg">Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500 text-white p-8 rounded-lg mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4">✗ Payment Failed</h1>
            <p className="text-xl">{error}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/checkout"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Return to Checkout
            </Link>
            <Link
              href="/pricing"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Browse Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-500 text-white p-8 rounded-lg mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4">✓ Payment Successful!</h1>
          <p className="text-xl">Thank you for your order</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <p className="text-gray-400 mb-2">Session ID</p>
            <p className="text-white text-lg font-mono break-all">{sessionId}</p>
          </div>

          <div className="bg-blue-500/20 border border-blue-500 text-blue-300 p-4 rounded-lg mb-6">
            <p className="font-bold mb-2">✓ What's Next:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your service is being provisioned</li>
              <li>Check your email for login credentials</li>
              <li>Access your dashboard to manage your service</li>
              <li>Contact support if you have any questions</li>
            </ul>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-gray-400 mb-4">You'll receive an email shortly with:</p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>✓ Server access credentials</li>
              <li>✓ Invoice and receipt</li>
              <li>✓ Support documentation</li>
              <li>✓ Getting started guide</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/services"
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Browse More Services
          </Link>
        </div>
      </div>
    </div>
  );
}
