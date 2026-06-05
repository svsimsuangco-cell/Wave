'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const features = [
    {
      title: 'Premium Hardware',
      description: 'Modern CPUs, fast NVMe storage, and optimized networking for peak performance.',
      icon: '⚡',
    },
    {
      title: 'Deploy in Minutes',
      description: 'Instant setup and quick delivery - launch and scale without delays.',
      icon: '🚀',
    },
    {
      title: 'Human Support',
      description: 'Get clear, hands-on help from experts who know servers inside and out.',
      icon: '🤝',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Reliable Hosting for
            <span className="text-blue-400"> Your Business</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience straightforward hosting with premium performance. Choose from Web Hosting, Cloud Servers, Dedicated Servers, and VPS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Explore Services
            </Link>
            <Link
              href="/pricing"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Our Services</h2>
          {loading ? (
            <p className="text-gray-400 text-center">Loading services...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service: any) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 transition transform hover:scale-105"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <span className="text-blue-400 font-semibold">View Plans →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-8 border border-slate-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8">
            Join thousands of satisfied customers with reliable hosting solutions.
          </p>
          <Link
            href="/services"
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition inline-block"
          >
            Browse All Plans
          </Link>
        </div>
      </section>
    </div>
  );
}
