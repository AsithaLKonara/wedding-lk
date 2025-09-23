"use client"

export default function SearchHeader() {
  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Wedding Venue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Discover beautiful venues across Sri Lanka for your special day
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by location, venue name, or keywords..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Search Venues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}