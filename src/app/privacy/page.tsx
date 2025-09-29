import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - ViralCarrot | Data Protection & User Privacy',
  description: 'Comprehensive privacy policy for ViralCarrot. Learn how we collect, use, and protect your personal information, including data for Google AdSense and third-party services.',
  keywords: 'privacy policy, data protection, user privacy, GDPR compliance, cookie policy, data collection',
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
              At ViralCarrot (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recipe discovery platform at viralcarrot.com (the &quot;Service&quot;).
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">1.1 Information You Provide Directly</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password</li>
              <li><strong>Recipe Submissions:</strong> When you submit recipes, we collect the recipe details, ingredients, instructions, and any images you upload</li>
              <li><strong>Profile Information:</strong> Optional information such as dietary preferences, cooking skill level, and cuisine preferences</li>
              <li><strong>Communication Data:</strong> Information you provide when contacting us for support or feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">1.2 Information We Collect Automatically</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Usage Data:</strong> Information about how you use our Service, including pages visited, time spent, and features used</li>
              <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to collect information about your browsing activities</li>
              <li><strong>Log Data:</strong> Server logs including your IP address, browser type, pages visited, and timestamps</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>To provide, maintain, and improve our Service</li>
              <li>To process your recipe submissions and display them to other users</li>
              <li>To personalize your experience and recommend relevant recipes</li>
              <li>To communicate with you about updates, features, and support</li>
              <li>To analyze usage patterns and improve our Service</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Google AdSense and Advertising</h2>
            <p className="text-slate-600 mb-4">
              We use Google AdSense to display advertisements on our Service. Google AdSense uses cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Serve personalized advertisements based on your interests and browsing behavior</li>
              <li>Measure ad performance and effectiveness</li>
              <li>Prevent fraud and ensure ad quality</li>
              <li>Collect aggregated analytics data</li>
            </ul>
            <p className="text-slate-600 mb-6">
              <strong>Google AdSense Data Collection:</strong> Google may collect and process information about your visits to our site and other sites on the Internet. This information may include your IP address, browser type, pages visited, and interactions with ads. Google uses this information to provide relevant advertisements and improve ad targeting.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. EU User Consent Policy Compliance</h2>
            <p className="text-slate-600 mb-4">
              In compliance with Google&apos;s EU User Consent Policy, we obtain consent from users in the European Economic Area (EEA), United Kingdom, and Switzerland for:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Use of cookies and local storage</li>
              <li>Collection, sharing, and use of personal data for personalization of ads</li>
              <li>Processing of personal data for advertising purposes</li>
            </ul>
            <p className="text-slate-600 mb-6">
              You can manage your cookie preferences through our cookie consent banner or by adjusting your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-slate-600 mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>With Google AdSense:</strong> We share data with Google for advertising purposes as described in their privacy policy</li>
              <li><strong>With Service Providers:</strong> Third-party companies that help us operate our Service (hosting, analytics, etc.)</li>
              <li><strong>For Legal Reasons:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>With Your Consent:</strong> When you explicitly consent to sharing your information</li>
              <li><strong>In Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Your Rights and Choices</h2>
            <p className="text-slate-600 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of certain data processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">We use the following types of cookies:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Necessary for the Service to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
              <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Third-Party Services</h2>
            <p className="text-slate-600 mb-4">Our Service integrates with the following third-party services:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Google AdSense:</strong> For advertising services and revenue generation</li>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Unsplash API:</strong> For recipe images and visual content</li>
              <li><strong>External Recipe APIs:</strong> For recipe data from third-party sources</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Data Retention</h2>
            <p className="text-slate-600 mb-6">
              We retain your personal information for as long as necessary to provide our Service, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. International Data Transfers</h2>
            <p className="text-slate-600 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-6">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">14. Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
