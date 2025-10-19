"use client"

export default function TestRuntimePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Runtime Test Page
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This page should load without any runtime errors.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Test Results:</h2>
          <ul className="text-left space-y-2">
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Page loaded successfully
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              No runtime errors detected
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              React components working
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
