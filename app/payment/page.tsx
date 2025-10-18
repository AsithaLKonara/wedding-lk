"use client"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>
        <p className="text-lg text-gray-600 mb-8">Complete your wedding booking</p>
        
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Card Details</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}