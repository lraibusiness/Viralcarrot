import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - ViralCarrot',
  description: 'Read ViralCarrot\'s terms of service to understand the rules and guidelines for using our recipe discovery platform.',
  keywords: 'terms of service, viralcarrot terms, user agreement, platform rules',
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              <strong>Last updated:</strong> December 28, 2024
            </p>

            <p className="text-slate-600 mb-8">
              Welcome to ViralCarrot! These Terms of Service (&quot;Terms&quot;) govern your use of our recipe discovery platform. By accessing or using ViralCarrot, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600 mb-6">
              By accessing and using ViralCarrot, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Description of Service</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is a smart recipe discovery platform that provides:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>AI-generated personalized recipes based on your ingredients and preferences</li>
              <li>Popular recipes aggregated from trusted cooking websites</li>
              <li>Ingredient matching and availability calculations</li>
              <li>Pantry-based recipe discovery</li>
              <li>Advanced filtering options for cuisine, cooking time, meal type, and dietary preferences</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">User Responsibilities</h2>
            <p className="text-slate-600 mb-4">
              As a user of ViralCarrot, you agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Provide accurate and truthful information when using our services</li>
              <li>Use the platform only for lawful purposes and in accordance with these Terms</li>
              <li>Not attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Not use the platform to transmit any harmful, threatening, or offensive content</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not engage in any activity that could damage, disable, or impair the platform</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Intellectual Property Rights</h2>
            <p className="text-slate-600 mb-4">
              The ViralCarrot platform, including its design, functionality, and content, is protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Copy, modify, or distribute our platform or its content without permission</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Use our trademarks, logos, or other proprietary information without authorization</li>
              <li>Create derivative works based on our platform</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">User-Generated Content</h2>
            <p className="text-slate-600 mb-6">
              When you provide feedback, suggestions, or other content to ViralCarrot, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and distribute such content for the purpose of improving our services.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Content and Links</h2>
            <p className="text-slate-600 mb-6">
              Our platform may include recipes and content from third-party sources. We do not control or endorse such content, and we are not responsible for its accuracy, completeness, or availability. Your use of third-party content is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Disclaimers and Limitations</h2>
            <p className="text-slate-600 mb-4">
              ViralCarrot is provided &quot;as is&quot; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of recipe information</li>
              <li>Warranties that the platform will be uninterrupted or error-free</li>
              <li>Warranties regarding the safety or suitability of recipes for your specific dietary needs</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 mb-6">
              To the maximum extent permitted by law, ViralCarrot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Indemnification</h2>
            <p className="text-slate-600 mb-6">
              You agree to indemnify and hold harmless ViralCarrot and its officers, directors, employees, and agents from any claims, damages, or expenses arising out of your use of the platform or violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Privacy and Data Protection</h2>
            <p className="text-slate-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Modifications to Terms</h2>
            <p className="text-slate-600 mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our platform. Your continued use of ViralCarrot after such modifications constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Termination</h2>
            <p className="text-slate-600 mb-6">
              We may terminate or suspend your access to ViralCarrot at any time, with or without cause, and with or without notice. Upon termination, your right to use the platform will cease immediately.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Governing Law</h2>
            <p className="text-slate-600 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ViralCarrot operates, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Severability</h2>
            <p className="text-slate-600 mb-6">
              If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                <strong>Email:</strong> legal@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Legal Team<br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center mt-8">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="text-xl mb-6">We&apos;re here to help clarify any questions you may have.</p>
              <a 
                href="mailto:legal@viralcarrot.com"
                className="bg-white text-amber-600 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-colors inline-block"
              >
                Contact Our Legal Team
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
