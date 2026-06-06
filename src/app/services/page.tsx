'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Services() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-4">Our Services</h1>
        <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          Choose the hosting solution that fits your needs. All plans include 24/7 support and uptime guarantee.
        </p>

        {loading ? (
          <p className="text-gray-400 text-center">Loading services...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service: any) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-8 transition transform hover:scale-105"
              >
                <h2 className="text-3xl font-bold text-white mb-4">{service.name}</h2>
                <p className="text-gray-300 mb-6 text-lg">{service.description}</p>
                <span className="text-blue-400 font-semibold text-lg">View Plans →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
