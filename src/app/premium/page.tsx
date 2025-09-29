'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Go Premium - ViralCarrot Pro | Unlimited Recipes & Premium Features',
  description: 'Upgrade to ViralCarrot Pro for unlimited recipe generations, premium tools, and exclusive features.',
};

export default function PremiumPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async (plan: 'monthly' | 'yearly') => {
    // In a real implementation, you would integrate with PayPal API
    // For now, we'll simulate the payment process
    alert(`PayPal integration for ${plan} plan would be implemented here`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/blog" className="text-slate-600 hover:text-amber-600 transition-colors">Blog</Link>
              {user ? (
                <Link href="/dashboard" className="text-slate-600 hover:text-amber-600 transition-colors">Dashboard</Link>
              ) : (
                <Link href="/auth/login" className="text-slate-600 hover:text-amber-600 transition-colors">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Upgrade to <span className="text-amber-600">ViralCarrot Pro</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Unlock unlimited recipe generations, premium tools, and exclusive features to take your cooking to the next level.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Monthly Plan</h3>
              <div className="text-4xl font-bold text-amber-600 mb-4">$4.99<span className="text-lg text-slate-500">/month</span></div>
              <p className="text-slate-600 mb-6">Perfect for trying out premium features</p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Unlimited recipe generations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Premium blog posting</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Advanced recipe tools</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={() => handlePayPalPayment('monthly')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe Monthly
              </button>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Yearly Plan</h3>
              <div className="text-4xl font-bold text-amber-600 mb-4">$29.99<span className="text-lg text-slate-500">/year</span></div>
              <p className="text-slate-600 mb-6">Save 50% compared to monthly</p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Unlimited recipe generations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Premium blog posting</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Advanced recipe tools</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Exclusive premium recipes</span>
                </li>
              </ul>
              
              <button
                onClick={() => handlePayPalPayment('yearly')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Free vs Premium Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Free Plan</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>3 recipes total</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Basic recipe generation</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Read blog posts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Community recipes</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Premium Plan</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Unlimited recipes</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Advanced recipe tools</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Write blog posts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Premium recipes</span>
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-600">We accept PayPal for secure and convenient payments.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Is there a free trial?</h3>
              <p className="text-slate-600">Yes! You can try our free plan with 3 recipes total to see if ViralCarrot Pro is right for you.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-2">What happens to my recipes if I cancel?</h3>
              <p className="text-slate-600">Your recipes and blog posts will remain accessible, but you'll be limited to 3 recipes total.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
