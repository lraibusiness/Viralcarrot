import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About ViralCarrot - Smart Recipe Discovery Platform | Our Story & Mission',
  description: 'Learn about ViralCarrot, the smart recipe discovery platform that combines AI-generated recipes with popular recipes from the web. Discover our mission, team, and commitment to helping you cook with what you have.',
  keywords: 'about viralcarrot, recipe discovery, smart cooking, AI recipes, cooking platform, team, mission, company information',
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
            <p className="text-slate-600 mb-6">
              Our team of food enthusiasts, developers, and AI specialists came together to solve a common problem: food waste and the frustration of not knowing what to cook with available ingredients. We believe that great cooking should be accessible, enjoyable, and waste-free.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 mb-6">
              We believe that cooking should be accessible, enjoyable, and waste-free. By helping you discover recipes based on your available ingredients, we aim to reduce food waste and make cooking more convenient for everyone, from beginners to professional chefs.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Do</h2>
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
              <li><strong>Free to Use:</strong> All features available at no cost</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Technology</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is built with cutting-edge technology including advanced AI algorithms, real-time recipe aggregation, and intelligent ingredient matching. Our platform is designed to be fast, reliable, and constantly improving.
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Artificial Intelligence:</strong> Advanced AI for recipe generation and ingredient matching</li>
              <li><strong>Machine Learning:</strong> Continuous improvement based on user interactions</li>
              <li><strong>Real-time Data:</strong> Live aggregation of recipes from multiple sources</li>
              <li><strong>Cloud Infrastructure:</strong> Scalable and reliable hosting</li>
              <li><strong>Mobile-First Design:</strong> Optimized for all devices and screen sizes</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Team</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is developed by a passionate team of food enthusiasts, developers, and AI specialists who are committed to making cooking more accessible and enjoyable for everyone.
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Our Values</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Innovation:</strong> We constantly explore new ways to improve recipe discovery</li>
                <li><strong>Accessibility:</strong> Making cooking accessible to everyone, regardless of skill level</li>
                <li><strong>Sustainability:</strong> Reducing food waste through smart ingredient matching</li>
                <li><strong>Quality:</strong> Providing accurate, tested, and reliable recipe information</li>
                <li><strong>Community:</strong> Building a community of food lovers and cooking enthusiasts</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Commitment</h2>
            <p className="text-slate-600 mb-6">
              We are committed to providing a safe, reliable, and enjoyable experience for all our users. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Protecting your privacy and personal information</li>
              <li>Providing accurate and reliable recipe information</li>
              <li>Ensuring our platform is accessible to all users</li>
              <li>Continuously improving our technology and features</li>
              <li>Maintaining the highest standards of data security</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <p className="text-slate-600 mb-4">
                <strong>Business Address:</strong><br />
                ViralCarrot Inc.<br />
                123 Recipe Street<br />
                Food City, FC 12345<br />
                United States
              </p>
              <p className="text-slate-600 mb-4">
                <strong>Email:</strong> hello@viralcarrot.com<br />
                <strong>Phone:</strong> +1 (555) 123-4567<br />
                <strong>Website:</strong> <a href="https://viralcarrot.com" className="text-amber-600 hover:text-amber-700">viralcarrot.com</a>
              </p>
              <p className="text-slate-600">
                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Legal Information</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is a registered business entity committed to compliance with all applicable laws and regulations. We maintain comprehensive policies for privacy, terms of service, and user protection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Privacy & Security</h4>
                <p className="text-sm text-blue-700">
                  We protect your data with industry-standard security measures and transparent privacy practices.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Compliance</h4>
                <p className="text-sm text-green-700">
                  We adhere to GDPR, CCPA, and other privacy regulations to protect user rights.
                </p>
              </div>
            </div>

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
