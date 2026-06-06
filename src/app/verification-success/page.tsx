'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function VerificationSuccess() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="inline-block animate-spin">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 011 19.8" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Your Email...</h2>
          <p className="text-gray-400">Please wait while we activate your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center max-w-md">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Email Verified!</h1>
        <p className="text-gray-300 mb-8">
          Congratulations! Your email has been verified and your account is now active. You can start exploring our hosting services.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition block"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/services"
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition block"
          >
            Browse Services
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          You're now ready to purchase hosting plans and manage your account.
        </p>
      </div>
    </div>
  );
}
