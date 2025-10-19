"use client"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
          <p className="text-lg text-gray-600 mb-8">Thank you for your booking!</p>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              Your wedding booking has been confirmed. You will receive a confirmation email shortly.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              View Booking Details
            </button>
                </div>
              </div>
      </div>
    </div>
  )
}
