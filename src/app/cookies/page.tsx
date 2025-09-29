import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - ViralCarrot | How We Use Cookies & Tracking',
  description: 'Learn about how ViralCarrot uses cookies and tracking technologies to improve your experience, including Google AdSense and analytics cookies.',
  keywords: 'cookie policy, cookies, tracking, Google AdSense, analytics, privacy, GDPR compliance',
};

export default function CookiePolicyPage() {
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
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              <strong>Last updated:</strong> December 28, 2024
            </p>

            <p className="text-slate-600 mb-8">
              This Cookie Policy explains how ViralCarrot (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar tracking technologies when you visit our website at viralcarrot.com (the &quot;Service&quot;). This policy explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">What Are Cookies?</h2>
            <p className="text-slate-600 mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies allow a website to recognize a user&apos;s device and remember information about their visit.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Essential Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies are necessary for the Service to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status.
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Authentication cookies to keep you logged in</li>
              <li>Session cookies to maintain your preferences</li>
              <li>Security cookies to protect against fraud</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Analytics Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously.
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Google Analytics cookies to track page views and user behavior</li>
              <li>Performance monitoring cookies</li>
              <li>Error tracking cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Advertising Cookies (Google AdSense)</h3>
            <p className="text-slate-600 mb-4">
              We use Google AdSense to display advertisements on our Service. Google AdSense uses cookies to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Serve personalized advertisements based on your interests</li>
              <li>Measure ad performance and effectiveness</li>
              <li>Prevent fraud and ensure ad quality</li>
              <li>Limit the number of times you see an ad</li>
              <li>Remember your ad preferences</li>
            </ul>

            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3">Google AdSense Cookie Details</h4>
              <p className="text-slate-600 mb-4">
                Google AdSense may set the following types of cookies on our Service:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>__gads:</strong> Used to measure ad performance and prevent fraud</li>
                <li><strong>__gpi:</strong> Google Publisher Integration cookie</li>
                <li><strong>IDE:</strong> Google DoubleClick cookie for ad personalization</li>
                <li><strong>test_cookie:</strong> Used to test if the browser supports cookies</li>
                <li><strong>_gcl_au:</strong> Google AdSense conversion tracking</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Preference Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies remember your choices and preferences to provide a more personalized experience.
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Language and region preferences</li>
              <li>Dietary preferences and cooking skill level</li>
              <li>Display preferences and theme settings</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Cookies</h2>
            <p className="text-slate-600 mb-4">
              Our Service may contain cookies from third-party services that we use to enhance functionality:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Google AdSense:</strong> For advertising services and revenue generation</li>
              <li><strong>Unsplash API:</strong> For recipe images and visual content</li>
              <li><strong>External Recipe APIs:</strong> For recipe data from third-party sources</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookie Duration</h2>
            <p className="text-slate-600 mb-4">Cookies can be either:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-slate-600 mb-4">You have several options for managing cookies:</p>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Browser Settings</h3>
            <p className="text-slate-600 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Block all cookies</li>
              <li>Allow only first-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Set up notifications when cookies are set</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Opt-Out Tools</h3>
            <p className="text-slate-600 mb-4">
              You can opt out of certain advertising cookies:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Google AdSense:</strong> Visit Google&apos;s Ad Settings to manage your ad preferences</li>
              <li><strong>Network Advertising Initiative:</strong> Use the NAI opt-out tool</li>
              <li><strong>Digital Advertising Alliance:</strong> Use the DAA opt-out tool</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">EU User Consent Policy</h2>
            <p className="text-slate-600 mb-4">
              In compliance with Google&apos;s EU User Consent Policy, we obtain consent from users in the European Economic Area (EEA), United Kingdom, and Switzerland for:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Use of cookies and local storage</li>
              <li>Collection, sharing, and use of personal data for personalization of ads</li>
              <li>Processing of personal data for advertising purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Impact of Disabling Cookies</h2>
            <p className="text-slate-600 mb-6">
              If you choose to disable cookies, some features of our Service may not function properly:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>You may need to log in repeatedly</li>
              <li>Your preferences may not be saved</li>
              <li>Some features may not work as expected</li>
              <li>Advertisements may be less relevant to your interests</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Updates to This Cookie Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Cookie Policy or our use of cookies, please contact us at:
            </p>
            <div className="bg-amber-50 rounded-xl p-6">
              <p className="text-slate-600 mb-2"><strong>Email:</strong> privacy@viralcarrot.com</p>
              <p className="text-slate-600 mb-2"><strong>Address:</strong> ViralCarrot Inc., 123 Recipe Street, Food City, FC 12345, United States</p>
              <p className="text-slate-600"><strong>Phone:</strong> +1-555-123-4567</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
