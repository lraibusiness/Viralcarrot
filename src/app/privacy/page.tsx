import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - ViralCarrot',
  description: 'Read ViralCarrot\'s privacy policy to understand how we collect, use, and protect your personal information when using our recipe discovery platform.',
  keywords: 'privacy policy, viralcarrot privacy, data protection, user privacy',
};

export default function PrivacyPage() {
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
              <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              <strong>Last updated:</strong> December 28, 2024
            </p>

            <p className="text-slate-600 mb-8">
              At ViralCarrot, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recipe discovery platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Information You Provide</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Recipe Preferences:</strong> Main ingredients, supporting ingredients, cooking time preferences, cuisine preferences, meal types, and dietary restrictions</li>
              <li><strong>Pantry Information:</strong> Ingredients you have available when using our Pantry Wizard feature</li>
              <li><strong>Feedback:</strong> Any feedback, suggestions, or comments you provide to us</li>
              <li><strong>Contact Information:</strong> Email address and name when you contact us for support</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Information We Collect Automatically</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited, features used, and time spent</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, and IP address</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience and analyze platform usage</li>
              <li><strong>Log Data:</strong> Server logs, including access times, pages viewed, IP address, and browser information</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Recipe Generation:</strong> To create personalized recipes based on your ingredients and preferences</li>
              <li><strong>Ingredient Matching:</strong> To calculate match percentages and suggest relevant recipes</li>
              <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</li>
              <li><strong>Personalization:</strong> To customize your experience and show relevant content</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform and optimize performance</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred</li>
              <li><strong>Consent:</strong> We may share information with your explicit consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve user experience and platform functionality</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Services</h2>
            <p className="text-slate-600 mb-6">
              Our platform may integrate with third-party services for recipe data, analytics, and other functionalities. These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Rights and Choices</h2>
            <p className="text-slate-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt-out of certain data processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Data Retention</h2>
            <p className="text-slate-600 mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-6">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                <strong>Email:</strong> privacy@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Privacy Team<br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
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
