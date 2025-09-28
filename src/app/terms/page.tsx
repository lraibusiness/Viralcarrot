import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - ViralCarrot | User Agreement & Legal Terms',
  description: 'Read ViralCarrot\'s comprehensive terms of service including user rights, responsibilities, and legal framework for using our recipe discovery platform.',
  keywords: 'terms of service, user agreement, legal terms, platform rules, user rights, responsibilities',
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
              Welcome to ViralCarrot! These Terms of Service (&quot;Terms&quot;) govern your use of our recipe discovery platform at viralcarrot.com (the &quot;Service&quot;). By accessing or using ViralCarrot, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-6">
              By accessing and using ViralCarrot, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 mb-6">
              ViralCarrot is a smart recipe discovery platform that provides:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>AI-generated personalized recipes based on your ingredients and preferences</li>
              <li>Popular recipes aggregated from trusted cooking websites</li>
              <li>Ingredient matching and availability calculations</li>
              <li>Pantry-based recipe discovery</li>
              <li>Advanced filtering options for cuisine, cooking time, meal type, and dietary preferences</li>
              <li>Recipe recommendations and personalized content</li>
              <li>Community features and user-generated content</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. User Eligibility</h2>
            <p className="text-slate-600 mb-4">
              You must meet the following criteria to use our Service:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Be at least 13 years of age (or the minimum age in your jurisdiction)</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Not be prohibited from using the Service under applicable law</li>
              <li>Provide accurate and truthful information when required</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. User Responsibilities</h2>
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
              <li>Not create multiple accounts or share account credentials</li>
              <li>Not use automated systems to access the platform without permission</li>
              <li>Report any security vulnerabilities or suspicious activity</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Prohibited Uses</h2>
            <p className="text-slate-600 mb-4">
              You may not use our Service for any of the following purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing on intellectual property rights</li>
              <li>Transmitting malicious code, viruses, or harmful content</li>
              <li>Harassing, threatening, or abusing other users</li>
              <li>Spamming or sending unsolicited communications</li>
              <li>Attempting to reverse engineer or hack our systems</li>
              <li>Using the Service for commercial purposes without permission</li>
              <li>Collecting user data without consent</li>
              <li>Impersonating others or providing false information</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Intellectual Property Rights</h2>
            <p className="text-slate-600 mb-4">
              The ViralCarrot platform, including its design, functionality, and content, is protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Copy, modify, or distribute our platform or its content without permission</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Use our trademarks, logos, or other proprietary information without authorization</li>
              <li>Create derivative works based on our platform</li>
              <li>Remove or alter any copyright or proprietary notices</li>
              <li>Use our content for commercial purposes without permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. User-Generated Content</h2>
            <p className="text-slate-600 mb-4">
              When you provide feedback, suggestions, or other content to ViralCarrot, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and distribute such content for the purpose of improving our services.
            </p>
            <p className="text-slate-600 mb-6">
              You retain ownership of your content but grant us the right to use it in connection with our Service. You are responsible for ensuring your content does not infringe on others&apos; rights.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Third-Party Content and Links</h2>
            <p className="text-slate-600 mb-6">
              Our platform may include recipes and content from third-party sources. We do not control or endorse such content, and we are not responsible for its accuracy, completeness, or availability. Your use of third-party content is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Advertising and Monetization</h2>
            <p className="text-slate-600 mb-4">
              Our Service may display advertisements from third parties, including Google AdSense. By using our Service, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>We may display advertisements on our platform</li>
              <li>Third-party advertisers may collect information about your visits</li>
              <li>You can opt out of personalized advertising through your browser settings</li>
              <li>We are not responsible for the content of third-party advertisements</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Disclaimers and Limitations</h2>
            <p className="text-slate-600 mb-4">
              ViralCarrot is provided &quot;as is&quot; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of recipe information</li>
              <li>Warranties that the platform will be uninterrupted or error-free</li>
              <li>Warranties regarding the safety or suitability of recipes for your specific dietary needs</li>
              <li>Warranties regarding the availability or performance of third-party services</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-600 mb-6">
              To the maximum extent permitted by law, ViralCarrot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Indemnification</h2>
            <p className="text-slate-600 mb-6">
              You agree to indemnify and hold harmless ViralCarrot and its officers, directors, employees, and agents from any claims, damages, or expenses arising out of your use of the platform or violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">13. Privacy and Data Protection</h2>
            <p className="text-slate-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our Service, you consent to the collection and use of information as described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">14. Account Termination</h2>
            <p className="text-slate-600 mb-4">
              We may terminate or suspend your access to ViralCarrot at any time, with or without cause, and with or without notice. Upon termination:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Your right to use the platform will cease immediately</li>
              <li>We may delete your account and associated data</li>
              <li>You remain liable for any outstanding obligations</li>
              <li>Certain provisions of these Terms will survive termination</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">15. Modifications to Terms</h2>
            <p className="text-slate-600 mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our platform. Your continued use of ViralCarrot after such modifications constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">16. Governing Law</h2>
            <p className="text-slate-600 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ViralCarrot operates, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">17. Dispute Resolution</h2>
            <p className="text-slate-600 mb-6">
              Any disputes arising from these Terms or your use of our Service will be resolved through binding arbitration, except for claims that may be brought in small claims court.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">18. Severability</h2>
            <p className="text-slate-600 mb-6">
              If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in full force and effect.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">19. Entire Agreement</h2>
            <p className="text-slate-600 mb-6">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and ViralCarrot regarding your use of our Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">20. Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                <strong>Email:</strong> legal@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Legal Team<br />
                <strong>Website:</strong> <a href="https://viralcarrot.com" className="text-amber-600 hover:text-amber-700">viralcarrot.com</a><br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center mt-8">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="text-xl mb-6">We&apos;re here to help clarify any questions you may have about our terms and conditions.</p>
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
