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
              <li><strong>Recipe Preferences:</strong> Main ingredients, supporting ingredients, cooking time preferences, cuisine preferences, meal types, and dietary restrictions</li>
              <li><strong>Pantry Information:</strong> Ingredients you have available when using our Pantry Wizard feature</li>
              <li><strong>User-Generated Content:</strong> Reviews, ratings, comments, and feedback you provide</li>
              <li><strong>Communication Data:</strong> Messages you send to us through contact forms or customer support</li>
              <li><strong>Profile Information:</strong> Any additional information you choose to provide in your user profile</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">1.2 Information We Collect Automatically</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited, features used, time spent, and click patterns</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, screen resolution, and device identifiers</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address (country/region level)</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience</li>
              <li><strong>Log Data:</strong> Server logs, including access times, pages viewed, IP address, browser information, and referring URLs</li>
              <li><strong>Performance Data:</strong> App performance metrics, crash reports, and error logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">1.3 Information from Third Parties</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Social Media:</strong> If you connect your social media accounts, we may receive profile information</li>
              <li><strong>Recipe Sources:</strong> Data from third-party recipe APIs and websites we aggregate</li>
              <li><strong>Analytics Providers:</strong> Data from Google Analytics, Google AdSense, and other analytics services</li>
              <li><strong>Advertising Partners:</strong> Information from advertising networks and partners</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our recipe discovery services</li>
              <li><strong>Personalization:</strong> To customize your experience and show relevant recipes and content</li>
              <li><strong>Recipe Generation:</strong> To create personalized AI-generated recipes based on your preferences</li>
              <li><strong>Ingredient Matching:</strong> To calculate match percentages and suggest relevant recipes</li>
              <li><strong>Communication:</strong> To respond to your inquiries and provide customer support</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform and optimize performance</li>
              <li><strong>Marketing:</strong> To send promotional materials and newsletters (with your consent)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform, including hosting, analytics, and customer support</li>
              <li><strong>Advertising Partners:</strong> We may share aggregated, non-personally identifiable information with advertising partners for targeted advertising</li>
              <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements, which may collect and use information about your visits to our site</li>
              <li><strong>Analytics Providers:</strong> We share data with Google Analytics and other analytics services to understand user behavior</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred</li>
              <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              <li><strong>Emergency Situations:</strong> To protect the safety of our users and the public</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">
              We use various tracking technologies to enhance your experience and analyze platform usage:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Google Analytics cookies to understand user behavior and improve our service</li>
              <li><strong>Advertising Cookies:</strong> Google AdSense and other advertising cookies for targeted advertising</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
              <li><strong>Performance Cookies:</strong> To monitor and improve platform performance</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Google AdSense and Advertising</h2>
            <p className="text-slate-600 mb-6">
              We use Google AdSense to display advertisements on our platform. Google AdSense may use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Display personalized advertisements based on your interests</li>
              <li>Measure the effectiveness of advertisements</li>
              <li>Prevent fraud and ensure ad quality</li>
              <li>Collect information about your visits to our site and other sites</li>
            </ul>
            <p className="text-slate-600 mb-6">
              You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-amber-600 hover:text-amber-700">Google Ad Settings</a> or by using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-amber-600 hover:text-amber-700">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-slate-600 mb-6">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Third-Party Services</h2>
            <p className="text-slate-600 mb-6">
              Our platform may integrate with third-party services for various functionalities. These services have their own privacy policies, and we encourage you to review them:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Google Services:</strong> Google Analytics, Google AdSense, Google Fonts</li>
              <li><strong>Recipe APIs:</strong> TheMealDB, RecipePuppy, and other recipe data sources</li>
              <li><strong>Image Services:</strong> Unsplash and other image providers</li>
              <li><strong>Hosting Services:</strong> Vercel and other cloud infrastructure providers</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Your Rights and Choices</h2>
            <p className="text-slate-600 mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt-out of certain data processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
              <li><strong>Object:</strong> Object to processing of your personal information</li>
              <li><strong>Restrict:</strong> Request restriction of processing</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Data Retention</h2>
            <p className="text-slate-600 mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Our retention periods are:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Account Information:</strong> Until account deletion or 3 years of inactivity</li>
              <li><strong>Usage Data:</strong> 2 years from collection</li>
              <li><strong>Cookies:</strong> As specified in our cookie policy</li>
              <li><strong>Legal Requirements:</strong> As required by applicable law</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. International Data Transfers</h2>
            <p className="text-slate-600 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-6">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. California Privacy Rights (CCPA)</h2>
            <p className="text-slate-600 mb-6">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">13. European Privacy Rights (GDPR)</h2>
            <p className="text-slate-600 mb-6">
              If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Right of access to your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Posting the updated Privacy Policy on our website</li>
              <li>Sending you an email notification</li>
              <li>Displaying a prominent notice on our platform</li>
            </ul>
            <p className="text-slate-600 mb-6">
              Your continued use of our Service after any changes constitutes acceptance of the updated Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">15. Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <p className="text-slate-600">
                <strong>Email:</strong> privacy@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Privacy Team<br />
                <strong>Website:</strong> <a href="https://viralcarrot.com" className="text-amber-600 hover:text-amber-700">viralcarrot.com</a><br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
              <p className="text-xl mb-6">We&apos;re committed to protecting your privacy and are here to help with any questions.</p>
              <a 
                href="mailto:privacy@viralcarrot.com"
                className="bg-white text-amber-600 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-colors inline-block"
              >
                Contact Our Privacy Team
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
                <Link href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
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
