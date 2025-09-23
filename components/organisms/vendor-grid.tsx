
interface VendorGridProps {
  category: string;
  filters: {
    location: string;
    priceRange: number[];
    rating: number;
    experience: string;
  };
}

export default function VendorGrid({ category, filters }: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Sample Vendor</h3>
        <p className="text-gray-600">Category: {category}</p>
        <p className="text-gray-600">Location: {filters.location}</p>
      </div>
    </div>
  );
}