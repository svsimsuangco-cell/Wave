'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<any>(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();
        const selectedService = servicesData.data.find((s: any) => s.slug === slug);
        setService(selectedService);

        const plansRes = await fetch('/api/plans');
        const plansData = await plansRes.json();
        const servicePlans = plansData.data.filter(
          (p: any) => p.serviceId === selectedService?._id
        );
        setPlans(servicePlans.sort((a: any, b: any) => a.order - b.order));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (loading) return <p className="text-center text-gray-400 py-20">Loading...</p>;
  if (!service) return <p className="text-center text-gray-400 py-20">Service not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4">{service.name}</h1>
        <p className="text-gray-300 text-xl mb-12 max-w-2xl">{service.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-400 transition"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              
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

              <Link
                href={`/checkout?plan=${plan._id}`}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition text-center block"
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
