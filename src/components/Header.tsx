'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Hide header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        const items = JSON.parse(cart);
        setCartCount(items.length);
      } catch (error) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
          // Get user info from localStorage
          const email = localStorage.getItem('userEmail') || '';
          const first = localStorage.getItem('firstName') || '';
          const last = localStorage.getItem('lastName') || '';
          
          setUserEmail(email);
          setFirstName(first);
          setLastName(last);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('userEmail');
          localStorage.removeItem('firstName');
          localStorage.removeItem('lastName');
          setUserEmail('');
          setFirstName('');
          setLastName('');
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    updateCartCount();

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('userEmail');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      setIsAuthenticated(false);
      setUserEmail('');
      setFirstName('');
      setLastName('');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail;

  return (
    <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-400">Wave</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/services" className="text-gray-300 hover:text-white transition">
              Services
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard"
                  className="text-blue-400 hover:text-blue-300 transition text-sm font-semibold"
                >
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-300 hover:text-white py-2">
              Home
            </Link>
            <Link href="/services" className="block text-gray-300 hover:text-white py-2">
              Services
            </Link>
            <Link href="/pricing" className="block text-gray-300 hover:text-white py-2">
              Pricing
            </Link>
            <Link href="/cart" className="relative block text-gray-300 hover:text-white py-2">
              Cart
              {cartCount > 0 && (
                <span className="absolute top-1 left-12 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="space-y-2">
                <Link 
                  href="/dashboard"
                  className="block text-blue-400 hover:text-blue-300 py-2 font-semibold"
                >
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="block text-gray-300 hover:text-white py-2">
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
