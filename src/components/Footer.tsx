'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center text-center">
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">Wave</h3>
            <p className="text-gray-400">
              Reliable hosting solutions for your business needs.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-hosting" className="text-gray-400 hover:text-white">
                  Web Hosting
                </Link>
              </li>
              <li>
                <Link href="/services/cloud-servers" className="text-gray-400 hover:text-white">
                  Cloud Servers
                </Link>
              </li>
              <li>
                <Link href="/services/dedicated-servers" className="text-gray-400 hover:text-white">
                  Dedicated Servers
                </Link>
              </li>
              <li>
                <Link href="/services/vps" className="text-gray-400 hover:text-white">
                  Virtual Private Servers
                </Link>
              </li>
            </ul>
          </div>

          {/* <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 mb-2">support@Wave.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-gray-400 text-center">
            &copy; 2026 Wave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
