"use client"

export default function VenuesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Wedding Venues</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover beautiful venues across Sri Lanka for your special day
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Grand Ballroom</h3>
              <p className="text-gray-600 mb-2">Colombo • Capacity: 300 guests</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-600">4.8</span>
                </div>
                <span className="text-blue-600 font-medium">LKR 150,000</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garden Paradise</h3>
              <p className="text-gray-600 mb-2">Kandy • Capacity: 250 guests</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-600">4.9</span>
                </div>
                <span className="text-blue-600 font-medium">LKR 200,000</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}