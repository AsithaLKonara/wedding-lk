
interface VendorReviewsProps {
  vendorId: string;
}

export default function VendorReviews({ vendorId }: VendorReviewsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      <div className="space-y-2">
        <div className="p-3 border rounded">
          <p className="font-medium">Great service!</p>
          <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐</p>
        </div>
      </div>
    </div>
  );
}