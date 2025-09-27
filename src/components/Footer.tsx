export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-xl font-bold text-[#FF914D]">
              🥕 Viral Carrot
            </span>
            <span className="text-gray-500 text-sm">
              Generate amazing recipes from your ingredients
            </span>
          </div>
          
          <div className="flex space-x-6">
            <a
              href="/trending"
              className="text-gray-500 hover:text-[#FF914D] text-sm transition-colors"
            >
              Trending
            </a>
            <a
              href="/about"
              className="text-gray-500 hover:text-[#FF914D] text-sm transition-colors"
            >
              About
            </a>
            <a
              href="/privacy"
              className="text-gray-500 hover:text-[#FF914D] text-sm transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-gray-500 hover:text-[#FF914D] text-sm transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Viral Carrot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
