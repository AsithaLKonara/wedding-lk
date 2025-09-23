
interface PaymentFormProps {
  booking: {
    id: string;
    venueName: string;
    totalAmount: number;
  };
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PaymentForm({ booking, onPaymentSuccess }: PaymentFormProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Payment for {booking.venueName}</h3>
      <p className="text-gray-600">Total: ${booking.totalAmount}</p>
      <button 
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => onPaymentSuccess('payment_123')}
      >
        Pay Now
      </button>
    </div>
  );
}