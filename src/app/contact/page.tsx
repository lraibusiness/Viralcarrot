import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact ViralCarrot - Get in Touch',
  description: 'Contact ViralCarrot for support, feedback, or partnership opportunities. We love hearing from our users and are here to help with any questions.',
  keywords: 'contact viralcarrot, support, feedback, partnership, help',
};

export default function ContactPage() {
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
              <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Contact Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-slate-600 mb-8">
              We&apos;d love to hear from you! Whether you have questions, feedback, or suggestions, we&apos;re here to help make ViralCarrot even better.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">General Inquiries</h3>
                <p className="text-slate-600 mb-4">
                  For general questions about ViralCarrot, feature requests, or feedback.
                </p>
                <a 
                  href="mailto:hello@viralcarrot.com"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  hello@viralcarrot.com
                </a>
              </div>

              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Technical Support</h3>
                <p className="text-slate-600 mb-4">
                  Having trouble with the platform? Our technical team is here to help.
                </p>
                <a 
                  href="mailto:support@viralcarrot.com"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  support@viralcarrot.com
                </a>
              </div>

              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Partnership Opportunities</h3>
                <p className="text-slate-600 mb-4">
                  Interested in partnering with us? We&apos;d love to explore opportunities.
                </p>
                <a 
                  href="mailto:partnerships@viralcarrot.com"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  partnerships@viralcarrot.com
                </a>
              </div>

              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Media & Press</h3>
                <p className="text-slate-600 mb-4">
                  Press inquiries, media kit requests, and interview opportunities.
                </p>
                <a 
                  href="mailto:press@viralcarrot.com"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  press@viralcarrot.com
                </a>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">How does ViralCarrot work?</h3>
                <p className="text-slate-600">
                  ViralCarrot uses advanced AI to generate personalized recipes based on your main ingredient and available ingredients. We also aggregate popular recipes from trusted cooking websites and show you ingredient match percentages for each recipe.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Is ViralCarrot free to use?</h3>
                <p className="text-slate-600">
                  Yes! ViralCarrot is completely free to use. We believe that great cooking should be accessible to everyone.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">How accurate are the ingredient matches?</h3>
                <p className="text-slate-600">
                  Our ingredient matching algorithm is highly accurate, using advanced text processing and semantic analysis to match your ingredients with recipe ingredients. We continuously improve our matching accuracy based on user feedback.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Can I save my favorite recipes?</h3>
                <p className="text-slate-600">
                  Currently, ViralCarrot focuses on recipe discovery. We&apos;re working on adding recipe saving and personal collections in future updates.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Do you have a mobile app?</h3>
                <p className="text-slate-600">
                  ViralCarrot is fully optimized for mobile browsers and works great on all devices. We&apos;re considering native mobile apps based on user demand.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Response Times</h2>
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-slate-600">
                <li><strong>General Inquiries:</strong> 24-48 hours</li>
                <li><strong>Technical Support:</strong> 12-24 hours</li>
                <li><strong>Partnership Opportunities:</strong> 3-5 business days</li>
                <li><strong>Media & Press:</strong> 24-48 hours</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-xl mb-6">We&apos;re here to help! Don&apos;t hesitate to reach out.</p>
              <a 
                href="mailto:hello@viralcarrot.com"
                className="bg-white text-amber-600 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-colors inline-block"
              >
                Send Us an Email
              </a>
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
