
interface VendorContactProps {
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

export default function VendorContact({ vendor }: VendorContactProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Contact {vendor.name}</h3>
      <p>Phone: {vendor.contact.phone}</p>
      <p>Email: {vendor.contact.email}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send Message
      </button>
    </div>
  );
}