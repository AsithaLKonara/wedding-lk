"use client"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Payment Cancelled</h1>
          <p className="text-lg text-gray-600 mb-8">Your payment has been cancelled.</p>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              No charges have been made to your account. You can try again anytime.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
