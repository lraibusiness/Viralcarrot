export default function Trending() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Trending Recipes
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover what&apos;s popular in the cooking community right now.
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-600">
                We&apos;re working on bringing you the most trending recipes from our community. 
                Check back soon for this exciting feature!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
