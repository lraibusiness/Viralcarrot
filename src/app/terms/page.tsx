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
            <p className="text-slate-600 mb-4">
              ViralCarrot is a smart recipe discovery platform that provides:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>AI-generated recipe recommendations based on available ingredients</li>
              <li>Popular recipes from external sources with ingredient matching</li>
              <li>User-submitted recipe sharing and community features</li>
              <li>Pantry wizard functionality to find recipes with available ingredients</li>
              <li>Recipe filtering by cuisine, dietary preferences, and cooking time</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. User Accounts and Registration</h2>
            <p className="text-slate-600 mb-4">To access certain features of our Service, you may need to create an account. You agree to:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. User-Generated Content</h2>
            <p className="text-slate-600 mb-4">When you submit recipes or other content to our Service, you agree that:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>You own or have the right to submit the content</li>
              <li>Your content does not violate any third-party rights</li>
              <li>Your content is accurate and not misleading</li>
              <li>You grant us a license to use, display, and distribute your content</li>
              <li>You will not submit content that is illegal, harmful, or violates our policies</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Prohibited Uses</h2>
            <p className="text-slate-600 mb-4">You may not use our Service:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Google AdSense Compliance</h2>
            <p className="text-slate-600 mb-4">
              Our Service displays advertisements through Google AdSense. By using our Service, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>You will not click on ads for any reason other than genuine interest</li>
              <li>You will not encourage others to click on ads</li>
              <li>You will not use automated tools to generate clicks or impressions</li>
              <li>You understand that clicking ads inappropriately may result in account termination</li>
              <li>You will not attempt to manipulate ad performance or revenue</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Intellectual Property Rights</h2>
            <p className="text-slate-600 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of ViralCarrot and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Privacy Policy</h2>
            <p className="text-slate-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Termination</h2>
            <p className="text-slate-600 mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-slate-600 mb-6">
              The information on this Service is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-600 mb-6">
              In no event shall ViralCarrot, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Recipe Accuracy and Safety</h2>
            <p className="text-slate-600 mb-4">
              While we strive to provide accurate recipe information, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Recipe information is provided for informational purposes only</li>
              <li>You are responsible for ensuring food safety and proper cooking techniques</li>
              <li>We are not liable for any food-related illnesses or injuries</li>
              <li>You should verify recipe information and cooking instructions before use</li>
              <li>Allergen information may not be complete or accurate</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">13. Governing Law</h2>
            <p className="text-slate-600 mb-6">
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">14. Changes to Terms</h2>
            <p className="text-slate-600 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">15. Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-amber-50 rounded-xl p-6">
              <p className="text-slate-600 mb-2"><strong>Email:</strong> legal@viralcarrot.com</p>
              <p className="text-slate-600 mb-2"><strong>Address:</strong> ViralCarrot Inc., 123 Recipe Street, Food City, FC 12345, United States</p>
              <p className="text-slate-600"><strong>Phone:</strong> +1-555-123-4567</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
