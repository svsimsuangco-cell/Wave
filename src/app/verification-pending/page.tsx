'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function VerificationPending() {
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setResendMessage('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();
      if (data.success) {
        setResendMessage('Verification email sent! Check your inbox.');
        setResendEmail('');
      } else {
        setResendMessage(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setResendMessage('Error sending verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full">
        <div className="mb-6 text-center">
          <svg className="w-16 h-16 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 text-center">Verify Your Email</h1>
        
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-center text-sm">
            We've sent a verification link to your email address. Click the link in the email to activate your account.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Didn't receive the email? Resend it here:
            </label>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => {
                setResendEmail(e.target.value);
                setResendMessage('');
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        {resendMessage && (
          <div className={`p-3 rounded-lg mb-6 text-sm text-center ${
            resendMessage.includes('sent') 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {resendMessage}
          </div>
        )}

        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">What happens next:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">1.</span>
              <span>Check your email inbox (and spam folder)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">2.</span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">3.</span>
              <span>Your account will be activated immediately</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">4.</span>
              <span>Log in and start using HostingHub</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-400 text-center text-sm mb-4">
          Verification link expires in 24 hours
        </p>

        <Link
          href="/login"
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition text-center block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
