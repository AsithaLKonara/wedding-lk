
interface VenueBookingProps {
  venue: {
    id: string;
    name: string;
    price: number;
  };
}

export default function VenueBooking({ venue }: VenueBookingProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">{venue.name}</h3>
      <p className="text-gray-600">Price: ${venue.price}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Book Now
      </button>
    </div>
  );
}