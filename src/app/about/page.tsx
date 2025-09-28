import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About ViralCarrot - Smart Recipe Discovery Platform',
  description: 'Learn about ViralCarrot, the smart recipe discovery platform that combines AI-generated recipes with popular recipes from the web. Discover how we help you cook with what you have.',
  keywords: 'about viralcarrot, recipe discovery, smart cooking, ingredient matching, cooking platform',
};

export default function AboutPage() {
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
              <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">About ViralCarrot</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-slate-600 mb-8">
              ViralCarrot is a revolutionary smart recipe discovery platform that combines the power of AI-generated recipes with popular recipes from across the web. Our mission is to help you discover amazing recipes using the ingredients you already have in your kitchen.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
            <p className="text-slate-600 mb-6">
              Founded in 2024, ViralCarrot was born from a simple idea: what if you could find the perfect recipe based on what&apos;s already in your pantry? We combined advanced AI technology with real-world recipe data to create a platform that not only suggests recipes but also tells you exactly how well your ingredients match.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Smart Recipe Generation</h3>
                <p className="text-slate-600">
                  Our AI creates unique, personalized recipes based on your main ingredient and available ingredients. Each recipe is crafted with detailed instructions and cooking tips.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Popular Recipe Discovery</h3>
                <p className="text-slate-600">
                  We aggregate popular recipes from trusted cooking websites, giving you access to tried-and-tested recipes from professional chefs and home cooks worldwide.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Ingredient Matching</h3>
                <p className="text-slate-600">
                  Our advanced algorithm calculates ingredient match percentages, showing you exactly which ingredients you have and which ones you might need to buy.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Pantry Wizard</h3>
                <p className="text-slate-600">
                  Simply list what&apos;s in your pantry, and we&apos;ll find existing recipes you can make right now, ranked by ingredient availability.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Features</h2>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>ViralCarrot Originals:</strong> AI-generated recipes tailored to your ingredients and preferences</li>
              <li><strong>Popular Recipes:</strong> Curated recipes from AllRecipes, Food Network, BBC Good Food, and more</li>
              <li><strong>Smart Matching:</strong> See ingredient match percentages for every recipe</li>
              <li><strong>Pantry Integration:</strong> Find recipes based on what you already have</li>
              <li><strong>Advanced Filters:</strong> Filter by cuisine, cooking time, meal type, and dietary preferences</li>
              <li><strong>Mobile Optimized:</strong> Full functionality on all devices</li>
              <li><strong>Fast & Reliable:</strong> Optimized performance with intelligent caching</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 mb-6">
              We believe that cooking should be accessible, enjoyable, and waste-free. By helping you discover recipes based on your available ingredients, we aim to reduce food waste and make cooking more convenient for everyone, from beginners to professional chefs.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Technology</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is built with cutting-edge technology including advanced AI algorithms, real-time recipe aggregation, and intelligent ingredient matching. Our platform is designed to be fast, reliable, and constantly improving.
            </p>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Discover Your Next Recipe?</h3>
              <p className="text-xl mb-6">Join thousands of home cooks who are already using ViralCarrot to discover amazing recipes.</p>
              <Link 
                href="/"
                className="bg-white text-amber-600 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-colors inline-block"
              >
                Start Cooking Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold">ViralCarrot</span>
              </div>
              <p className="text-slate-300 text-sm">
                Smart recipe discovery with ingredient matching and popular recipes from the web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Smart Recipe Generator</li>
                <li>Pantry Wizard</li>
                <li>Ingredient Matching</li>
                <li>Popular Recipes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-slate-300 text-sm">
                Get the latest recipes and cooking tips delivered to your inbox.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 ViralCarrot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
