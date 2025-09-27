'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#FF914D]">
                🥕 Viral Carrot
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#FF914D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/trending"
                className="text-gray-700 hover:text-[#FF914D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Trending
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#FF914D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <button className="bg-[#FF914D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e67e3a] transition-colors">
                Login
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#FF914D] p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#FF914D] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/trending"
                className="text-gray-700 hover:text-[#FF914D] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#FF914D] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <button className="bg-[#FF914D] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-[#e67e3a] transition-colors w-full mt-2">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
