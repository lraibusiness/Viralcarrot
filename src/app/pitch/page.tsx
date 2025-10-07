'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const slides: Slide[] = [
    {
      id: 'title',
      title: 'ViralCarrot',
      subtitle: 'The Future of Smart Food Discovery',
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-white font-bold text-4xl">V</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              ViralCarrot
            </h1>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Revolutionizing Recipe Discovery with AI-Powered Intelligence
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600">1M+</div>
              <div className="text-slate-600">Target Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600">$2.8B</div>
              <div className="text-slate-600">Market Size</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600">15%</div>
              <div className="text-slate-600">Growth Rate</div>
            </div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-amber-50 via-white to-orange-50'
    },
    {
      id: 'problem',
      title: 'The Problem We Solve',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-800 mb-3">Recipe Search Frustration</h3>
                <ul className="space-y-2 text-red-700">
                  <li>• 73% of home cooks struggle to find recipes matching available ingredients</li>
                  <li>• Average person wastes 30 minutes daily searching for suitable recipes</li>
                  <li>• Limited personalization in existing platforms</li>
                </ul>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-orange-800 mb-3">Fragmented Experience</h3>
                <ul className="space-y-2 text-orange-700">
                  <li>• Recipe sites lack community engagement</li>
                  <li>• No AI-powered ingredient matching</li>
                  <li>• Separate platforms for recipes, blogs, and food content</li>
                </ul>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Market Opportunity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Recipe App Market</span>
                  <span className="font-bold text-2xl text-amber-600">$2.8B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Food Tech Market</span>
                  <span className="font-bold text-2xl text-amber-600">$43.5B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Expected Growth</span>
                  <span className="font-bold text-2xl text-green-600">15.3% CAGR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'solution',
      title: 'Our Solution',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">AI Recipe Generator</h3>
              <p className="text-blue-700 text-sm">Input main ingredient → Get personalized recipes instantly with smart ingredient matching</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Community Platform</h3>
              <p className="text-green-700 text-sm">User-generated recipes with approval system and social features</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">Mobile-First</h3>
              <p className="text-purple-700 text-sm">Responsive design across all devices with intuitive navigation</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Personalization</h3>
              <p className="text-amber-700 text-sm">Dietary preferences, cuisine filters, and learning algorithm</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">Key Differentiators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-semibold">First AI-powered ingredient-based recipe generator</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-semibold">Integrated blogging and community platform</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-semibold">Strong SEO and content strategy</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Core Features',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🔥</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Smart Recipe Generator</h3>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>• AI-powered recipe creation based on available ingredients</li>
                  <li>• Real-time ingredient matching with compatibility scores</li>
                  <li>• Multiple cuisine and dietary style options</li>
                  <li>• Cooking time and difficulty filters</li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Community Recipe Library</h3>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>• User-submitted recipes with moderation system</li>
                  <li>• Advanced search and filtering capabilities</li>
                  <li>• Recipe ratings and reviews</li>
                  <li>• Nutritional information display</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">✍️</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Food Blogging Platform</h3>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>• SEO-optimized blog creation tools</li>
                  <li>• Rich text editor with media support</li>
                  <li>• Comment system for community engagement</li>
                  <li>• Author profiles and following system</li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">👨‍🍳</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">User Dashboard</h3>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>• Personal recipe collections</li>
                  <li>• Cooking history and preferences</li>
                  <li>• Usage analytics and insights</li>
                  <li>• Social interaction tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monetization',
      title: 'Monetization Strategy',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">💳 Subscription Revenue (Primary)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Premium subscriptions:</span>
                    <span className="font-bold">$9.99/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target conversion rate:</span>
                    <span className="font-bold">5% from free users</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Year 1:</span>
                    <span className="font-bold">$50K MRR</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">📢 Advertising Revenue</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Google AdSense integration</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sponsored recipe placements</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food brand partnerships</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Year 1:</span>
                    <span className="font-bold">$20K monthly</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">🤝 Partnership Revenue</h3>
                <ul className="space-y-2">
                  <li>• Grocery delivery service integrations</li>
                  <li>• Kitchen equipment affiliate programs</li>
                  <li>• Cooking class partnerships</li>
                  <li>• Meal kit service collaborations</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">📱 API Licensing</h3>
                <ul className="space-y-2">
                  <li>• Recipe generation API for food apps</li>
                  <li>• Ingredient matching technology licensing</li>
                  <li>• White-label solutions for food brands</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Revenue Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Year 1</div>
                <div className="text-2xl font-bold">$70K</div>
                <div className="text-amber-100">Monthly Revenue</div>
                <div className="text-sm mt-2">50K users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Year 2</div>
                <div className="text-2xl font-bold">$250K</div>
                <div className="text-amber-100">Monthly Revenue</div>
                <div className="text-sm mt-2">200K users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Year 3</div>
                <div className="text-2xl font-bold">$600K</div>
                <div className="text-amber-100">Monthly Revenue</div>
                <div className="text-sm mt-2">500K users</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'market',
      title: 'Market Analysis',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Target Audience</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Primary: Home Cooks</div>
                    <div className="text-slate-600">Aged 25-45</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">78M</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Secondary: Food Bloggers</div>
                    <div className="text-slate-600">Content creators</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">12M</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-800">Tertiary: Professional Chefs</div>
                    <div className="text-slate-600">Culinary students</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">2.5M</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Market Validation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div className="text-slate-800">Want ingredient-based recipe search</div>
                  <div className="text-2xl font-bold text-green-600">73%</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div className="text-slate-800">Prefer community-driven content</div>
                  <div className="text-2xl font-bold text-green-600">68%</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div className="text-slate-800">Willing to pay for premium food apps</div>
                  <div className="text-2xl font-bold text-green-600">45%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Competitive Advantage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🥇</div>
                <div className="font-semibold mb-2">First AI-powered ingredient-based recipe generator</div>
                <div className="text-blue-100 text-sm">Unique positioning in the market</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔗</div>
                <div className="font-semibold mb-2">Integrated blogging and community platform</div>
                <div className="text-blue-100 text-sm">All-in-one solution</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <div className="font-semibold mb-2">Mobile-optimized user experience</div>
                <div className="text-blue-100 text-sm">Superior UX design</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'growth',
      title: 'Growth Strategy',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-800 mb-2">Phase 1: Foundation</div>
              <div className="text-green-700 mb-4">Months 1-6</div>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Launch marketing campaigns</li>
                <li>• SEO optimization</li>
                <li>• Social media presence</li>
                <li>• Influencer partnerships</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-800 mb-2">Phase 2: Community</div>
              <div className="text-blue-700 mb-4">Months 6-12</div>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• User-generated content campaigns</li>
                <li>• Recipe contests and challenges</li>
                <li>• Food blogger onboarding</li>
                <li>• Referral programs</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-800 mb-2">Phase 3: Scale</div>
              <div className="text-purple-700 mb-4">Year 2+</div>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• International expansion</li>
                <li>• Mobile app development</li>
                <li>• Advanced AI features</li>
                <li>• Strategic partnerships</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Key Growth Tactics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="font-semibold">Content Marketing</div>
                <div className="text-amber-100 text-sm">Food blogs and SEO</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-semibold">Social Media</div>
                <div className="text-amber-100 text-sm">Pinterest & Instagram</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-semibold">Google Ads</div>
                <div className="text-amber-100 text-sm">High-intent searches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="font-semibold">Partnerships</div>
                <div className="text-amber-100 text-sm">Meal kit services</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technology',
      title: 'Technology Roadmap',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Current Technology Stack</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Next.js 15 with TypeScript</li>
                  <li>• AI-powered recipe generation</li>
                  <li>• Responsive web design</li>
                  <li>• SEO-optimized architecture</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Q1 2025: Mobile Apps</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Native iOS and Android applications</li>
                  <li>• Offline recipe access</li>
                  <li>• Push notifications</li>
                  <li>• Camera integration for ingredient recognition</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">Q2 2025: Advanced AI</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Machine learning recipe recommendations</li>
                  <li>• Natural language recipe input</li>
                  <li>• Dietary restriction auto-detection</li>
                  <li>• Nutritional analysis automation</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Q3 2025: Integrations</h3>
                <ul className="space-y-2 text-purple-700">
                  <li>• Smart kitchen appliance connectivity</li>
                  <li>• Grocery delivery API integrations</li>
                  <li>• Social media auto-sharing</li>
                  <li>• Voice assistant compatibility</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'investment',
      title: 'Investment Opportunity',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">💰 Funding Requirements</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">$500K</div>
                  <div className="text-green-100">Seed Round</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Product development & AI enhancement</span>
                    <span className="font-bold">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing & user acquisition</span>
                    <span className="font-bold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team expansion</span>
                    <span className="font-bold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations & infrastructure</span>
                    <span className="font-bold">10%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">📊 Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current daily recipes generated</span>
                  <span className="font-bold">1,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Year 1 users</span>
                  <span className="font-bold">100K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium conversion rate</span>
                  <span className="font-bold">5-8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer acquisition cost</span>
                  <span className="font-bold">$15</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">🤝 Partnership Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🏪</div>
                <div className="font-semibold">Food Brands</div>
                <div className="text-amber-100 text-sm">Recipe integration & promotion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-semibold">Grocery Chains</div>
                <div className="text-amber-100 text-sm">Ingredient sourcing partnerships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🍳</div>
                <div className="font-semibold">Kitchen Equipment</div>
                <div className="text-amber-100 text-sm">Affiliate & co-marketing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="font-semibold">Meal Kits</div>
                <div className="text-amber-100 text-sm">Recipe customization services</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      title: 'Join the Food Tech Revolution',
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-800">Ready to Transform Food Discovery?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Be part of the next generation of smart food technology that's revolutionizing how people discover, create, and share recipes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Schedule a Demo</h3>
              <p className="text-slate-600 text-sm">Live platform demonstration</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Pilot Program</h3>
              <p className="text-slate-600 text-sm">Partner integration opportunities</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Investment</h3>
              <p className="text-slate-600 text-sm">Seed funding discussion</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-semibold">Email</div>
                <div className="text-amber-100">contact@viralcarrot.com</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-semibold">Website</div>
                <div className="text-amber-100">viralcarrot.com</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold">Phone</div>
                <div className="text-amber-100">+1 (555) 123-4567</div>
              </div>
            </div>
          </div>
        </div>
      ),
      background: 'bg-gradient-to-br from-amber-50 via-white to-orange-50'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(nextSlide, 10000); // 10 seconds per slide
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentSlide]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`min-h-screen ${currentSlideData.background || 'bg-slate-50'} transition-all duration-500`}>
      {/* Navigation Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">ViralCarrot Pitch Deck</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAutoPlay}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAutoPlay 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isAutoPlay ? '⏸️ Pause' : '▶️ Auto'}
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Slide Content */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[600px]">
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                  {currentSlideData.title}
                </h1>
                {currentSlideData.subtitle && (
                  <p className="text-xl text-slate-600">{currentSlideData.subtitle}</p>
                )}
              </div>
              <div className="prose prose-lg max-w-none">
                {currentSlideData.content}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              <span>←</span>
              <span>Previous</span>
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide
                      ? 'bg-amber-500'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4 text-slate-600">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="hidden">
        <button onClick={prevSlide} onKeyDown={(e) => e.key === 'ArrowLeft' && prevSlide()}>
          Left Arrow
        </button>
        <button onClick={nextSlide} onKeyDown={(e) => e.key === 'ArrowRight' && nextSlide()}>
          Right Arrow
        </button>
      </div>
    </div>
  );
}
