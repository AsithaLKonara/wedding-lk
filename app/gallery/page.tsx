"use client"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wedding Gallery</h1>
        <p className="text-lg text-gray-600 mb-8">Beautiful moments from real weddings</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Wedding #{item}
                </h3>
                <p className="text-gray-600 text-sm">
                  A beautiful celebration in Sri Lanka
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}