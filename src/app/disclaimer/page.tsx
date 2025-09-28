import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer - ViralCarrot | Recipe Accuracy & Liability',
  description: 'Important disclaimer about recipe accuracy, nutritional information, and liability limitations for ViralCarrot recipe discovery platform.',
  keywords: 'disclaimer, recipe accuracy, liability, nutritional information, cooking safety, legal disclaimer',
};

export default function DisclaimerPage() {
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
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-slate-600 mb-8">
              <strong>Last updated:</strong> December 28, 2024
            </p>

            <p className="text-slate-600 mb-8">
              This disclaimer (&quot;Disclaimer&quot;) is provided by ViralCarrot (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) and applies to your use of our recipe discovery platform at viralcarrot.com (the &quot;Service&quot;). Please read this disclaimer carefully before using our Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. General Information</h2>
            <p className="text-slate-600 mb-6">
              The information on this website is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Recipe Accuracy and Safety</h2>
            <p className="text-slate-600 mb-4">
              <strong>Important:</strong> All recipes provided on ViralCarrot are for informational purposes only. We strongly recommend that you:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Verify all cooking times and temperatures</li>
              <li>Check for food allergies and dietary restrictions</li>
              <li>Follow proper food safety guidelines</li>
              <li>Consult with healthcare professionals for dietary concerns</li>
              <li>Test recipes in small quantities before serving to others</li>
              <li>Use your judgment and experience when following recipes</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Nutritional Information</h2>
            <p className="text-slate-600 mb-4">
              Nutritional information provided on our platform is estimated and should not be considered as professional dietary advice. We recommend:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Consulting with a registered dietitian for accurate nutritional guidance</li>
              <li>Verifying nutritional information with reliable sources</li>
              <li>Considering individual dietary needs and restrictions</li>
              <li>Using nutritional information as a general guide only</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Food Safety and Allergies</h2>
            <p className="text-slate-600 mb-4">
              <strong>Critical Warning:</strong> Food safety is your responsibility. Always:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Check for food allergies before preparing any recipe</li>
              <li>Follow proper food handling and storage procedures</li>
              <li>Ensure all ingredients are fresh and properly stored</li>
              <li>Cook foods to appropriate temperatures</li>
              <li>Discard any food that appears spoiled or unsafe</li>
              <li>Seek medical attention immediately if you experience allergic reactions</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Third-Party Content</h2>
            <p className="text-slate-600 mb-6">
              Our platform may include recipes and content from third-party sources. We do not control, verify, or endorse the accuracy, safety, or quality of third-party content. Your use of such content is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. AI-Generated Content</h2>
            <p className="text-slate-600 mb-4">
              Some recipes on our platform are generated using artificial intelligence. These recipes:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Are provided for inspiration and guidance only</li>
              <li>May not have been tested by professional chefs</li>
              <li>Should be reviewed and adjusted based on your experience</li>
              <li>May require modifications for safety or dietary needs</li>
              <li>Are not guaranteed to produce the expected results</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Medical and Health Disclaimer</h2>
            <p className="text-slate-600 mb-6">
              The information on this website is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary restrictions.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-600 mb-6">
              In no event shall ViralCarrot, its officers, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Food poisoning or allergic reactions</li>
              <li>Property damage from cooking activities</li>
              <li>Personal injury from kitchen accidents</li>
              <li>Loss of data or information</li>
              <li>Business interruption or loss of profits</li>
              <li>Any other damages arising from the use of our Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. No Warranty</h2>
            <p className="text-slate-600 mb-6">
              This website is provided &quot;as is&quot; without any representations or warranties, express or implied. ViralCarrot makes no representations or warranties in relation to this website or the information and materials provided on this website.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. User Responsibility</h2>
            <p className="text-slate-600 mb-4">
              By using our Service, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>You are responsible for your own safety when cooking</li>
              <li>You will exercise reasonable care and judgment</li>
              <li>You will not hold ViralCarrot liable for any cooking-related incidents</li>
              <li>You will verify recipe information before use</li>
              <li>You will follow proper food safety practices</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Professional Advice</h2>
            <p className="text-slate-600 mb-6">
              For specific dietary needs, food allergies, or health concerns, please consult with:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Registered dietitians for nutritional guidance</li>
              <li>Allergists for allergy management</li>
              <li>Healthcare providers for medical advice</li>
              <li>Professional chefs for cooking techniques</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Updates to This Disclaimer</h2>
            <p className="text-slate-600 mb-6">
              We may update this Disclaimer from time to time. We will notify you of any material changes by posting the updated Disclaimer on our website. Your continued use of our Service after such modifications constitutes acceptance of the updated Disclaimer.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">13. Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Disclaimer, please contact us:
            </p>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                <strong>Email:</strong> legal@viralcarrot.com<br />
                <strong>Address:</strong> ViralCarrot Legal Team<br />
                <strong>Website:</strong> <a href="https://viralcarrot.com" className="text-amber-600 hover:text-amber-700">viralcarrot.com</a><br />
                <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mt-8">
              <h3 className="text-2xl font-bold text-red-800 mb-4">⚠️ Important Safety Notice</h3>
              <p className="text-lg text-red-700 mb-4">
                Always prioritize food safety and consult professionals for dietary concerns.
              </p>
              <p className="text-red-600">
                In case of food poisoning or allergic reactions, seek medical attention immediately.
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
