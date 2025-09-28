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

            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Cookies</h2>
            <p className="text-slate-600 mb-6">
              We use cookies and similar technologies for several purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>To ensure our website functions properly</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze how you use our website</li>
              <li>To provide personalized content and advertisements</li>
              <li>To improve our services and user experience</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Essential Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Examples:</strong> Authentication cookies, security cookies, load balancing cookies
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Analytics Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Examples:</strong> Google Analytics cookies (_ga, _gid, _gat), performance monitoring cookies
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Advertising Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Examples:</strong> Google AdSense cookies, DoubleClick cookies, Facebook Pixel cookies
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Functional Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Examples:</strong> Language preference cookies, theme selection cookies, user preference cookies
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Cookies</h2>
            <p className="text-slate-600 mb-4">
              We use several third-party services that may set cookies on your device:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Google Analytics</h4>
                <p className="text-sm text-blue-700">
                  We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect information about your use of our website.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Google AdSense</h4>
                <p className="text-sm text-green-700">
                  We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Social Media</h4>
                <p className="text-sm text-purple-700">
                  We may integrate social media features that allow you to share content. These features may set cookies from social media platforms.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Cookie Duration</h2>
            <p className="text-slate-600 mb-4">
              Cookies can be either &quot;session&quot; cookies or &quot;persistent&quot; cookies:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-slate-600 mb-4">
              You have several options for managing cookies:
            </p>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Browser Settings</h3>
            <p className="text-slate-600 mb-4">
              Most web browsers allow you to control cookies through their settings preferences. You can:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Block all cookies</li>
              <li>Allow only first-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Set up notifications when cookies are set</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Opt-Out Links</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-slate-600 mb-2">You can opt out of specific tracking:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-amber-600 hover:text-amber-700">Google Analytics Opt-out</a></li>
                <li><a href="https://www.google.com/settings/ads" className="text-amber-600 hover:text-amber-700">Google Ad Settings</a></li>
                <li><a href="https://www.aboutads.info/choices/" className="text-amber-600 hover:text-amber-700">Digital Advertising Alliance</a></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Impact of Disabling Cookies</h2>
            <p className="text-slate-600 mb-6">
              If you choose to disable cookies, some features of our website may not function properly. This may include:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Inability to remember your preferences</li>
              <li>Loss of personalized content</li>
              <li>Reduced functionality of interactive features</li>
              <li>Inability to save your progress</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Updates to This Cookie Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                <strong>Email:</strong> privacy@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Privacy Team<br />
                <strong>Website:</strong> <a href="https://viralcarrot.com" className="text-amber-600 hover:text-amber-700">viralcarrot.com</a><br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center mt-8">
              <h3 className="text-2xl font-bold mb-4">Cookie Consent Management</h3>
              <p className="text-xl mb-6">You can manage your cookie preferences at any time through your browser settings.</p>
              <button className="bg-white text-amber-600 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-colors">
                Manage Cookie Preferences
              </button>
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
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-amber-400 transition-colors">Disclaimer</Link></li>
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
