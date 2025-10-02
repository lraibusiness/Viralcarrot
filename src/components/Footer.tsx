export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-start">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-amber-600">
                ViralCarrot
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
              Generate amazing recipes from your ingredients with AI-powered cooking assistance.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800 text-sm">Company</h3>
              <div className="space-y-1">
                <a
                  href="/about"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Contact
                </a>
                <a
                  href="/blog"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Blog
                </a>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800 text-sm">Legal</h3>
              <div className="space-y-1">
                <a
                  href="/privacy"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Terms
                </a>
                <a
                  href="/cookies"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <h3 className="font-semibold text-slate-800 text-sm">Product</h3>
              <div className="space-y-1">
                <a
                  href="/premium"
                  className="block text-amber-600 hover:text-amber-700 text-sm transition-colors font-medium"
                >
                  Go Premium
                </a>
                <a
                  href="/dashboard"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/disclaimer"
                  className="block text-gray-500 hover:text-amber-600 text-sm transition-colors"
                >
                  Disclaimer
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <p className="text-center md:text-left text-gray-500 text-xs">
              © 2024 ViralCarrot. All rights reserved.
            </p>
            <div className="flex justify-center md:justify-end space-x-4 text-xs">
              <a href="/privacy" className="text-gray-500 hover:text-amber-600 transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-500 hover:text-amber-600 transition-colors">Terms</a>
              <a href="/contact" className="text-gray-500 hover:text-amber-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
