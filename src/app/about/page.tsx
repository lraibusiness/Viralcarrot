import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About Viral Carrot
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming your ingredients into culinary masterpieces, one recipe at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              At Viral Carrot, we believe that great cooking starts with what you have. 
              Our AI-powered recipe generator helps you discover amazing dishes using 
              the ingredients already in your kitchen.
            </p>
            <p className="text-lg text-gray-600">
              No more staring at empty fridges or running to the store for that one 
              missing ingredient. Just enter what you have, and we&apos;ll create 
              personalized recipes just for you.
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF914D] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  1
                </div>
                <p className="text-gray-600">Enter your ingredients (comma separated)</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF914D] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  2
                </div>
                <p className="text-gray-600">Choose your preferences (cooking time, cuisine, etc.)</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF914D] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  3
                </div>
                <p className="text-gray-600">Get personalized recipe suggestions</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF914D] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  4
                </div>
                <p className="text-gray-600">Cook, enjoy, and share your creations!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of home cooks who are discovering new recipes every day.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#FF914D] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#e67e3a] transition-colors"
          >
            Start Cooking Now
          </Link>
        </div>
      </div>
    </div>
  );
}
