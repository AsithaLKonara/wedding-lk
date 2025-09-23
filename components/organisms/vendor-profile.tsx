
interface VendorProfileProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    location: string;
    rating: number;
    reviewCount: number;
    experience: string;
    price: number;
    avatar: string;
    coverImage: string;
    description: string;
    services: string[];
    portfolio: string[];
    contact: {
      phone: string;
      email: string;
    };
  };
}

export default function VendorProfile({ vendor }: VendorProfileProps) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-2xl font-bold">{vendor.name}</h2>
      <p className="text-gray-600">{vendor.category} • {vendor.location}</p>
      <p className="text-gray-600">Rating: {vendor.rating}/5 ({vendor.reviewCount} reviews)</p>
      <p className="mt-2">{vendor.description}</p>
    </div>
  );
}