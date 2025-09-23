#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Create basic component interfaces for missing components
const componentInterfaces = {
  'components/organisms/planning-tabs.tsx': `
interface PlanningTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PlanningTabs({ activeTab, onTabChange }: PlanningTabsProps) {
  return (
    <div className="flex space-x-4">
      <button 
        className={\`px-4 py-2 rounded \${activeTab === 'budget' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
        onClick={() => onTabChange('budget')}
      >
        Budget
      </button>
      <button 
        className={\`px-4 py-2 rounded \${activeTab === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
        onClick={() => onTabChange('timeline')}
      >
        Timeline
      </button>
    </div>
  );
}`,
  
  'components/organisms/vendor-categories.tsx': `
interface VendorCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function VendorCategories({ selectedCategory, onCategoryChange }: VendorCategoriesProps) {
  const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music', 'Transport'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category}
          className={\`px-4 py-2 rounded \${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}\`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}`,

  'components/organisms/vendor-filters.tsx': `
interface VendorFiltersProps {
  filters: {
    location: string;
    priceRange: number[];
    rating: number;
    experience: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function VendorFilters({ filters, onFiltersChange }: VendorFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input 
          type="text" 
          value={filters.location}
          onChange={(e) => onFiltersChange({...filters, location: e.target.value})}
          className="w-full p-2 border rounded"
          placeholder="Enter location"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={filters.rating}
          onChange={(e) => onFiltersChange({...filters, rating: Number(e.target.value)})}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}`,

  'components/organisms/vendor-grid.tsx': `
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
}`,

  'components/organisms/venue-booking.tsx': `
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
      <p className="text-gray-600">Price: \${venue.price}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Book Now
      </button>
    </div>
  );
}`,

  'components/organisms/payment-form.tsx': `
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
      <p className="text-gray-600">Total: \${booking.totalAmount}</p>
      <button 
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => onPaymentSuccess('payment_123')}
      >
        Pay Now
      </button>
    </div>
  );
}`,

  'components/organisms/vendor-profile.tsx': `
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
}`,

  'components/organisms/vendor-portfolio.tsx': `
interface VendorPortfolioProps {
  portfolio: string[];
}

export default function VendorPortfolio({ portfolio }: VendorPortfolioProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {portfolio.map((image, index) => (
        <div key={index} className="aspect-square bg-gray-200 rounded">
          <img src={image} alt={\`Portfolio \${index + 1}\`} className="w-full h-full object-cover rounded" />
        </div>
      ))}
    </div>
  );
}`,

  'components/organisms/vendor-reviews.tsx': `
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
}`,

  'components/organisms/vendor-contact.tsx': `
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
}`
};

function createComponent(componentPath, interfaceCode) {
  const fullPath = path.join(process.cwd(), componentPath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write component file
  fs.writeFileSync(fullPath, interfaceCode);
  console.log(`✅ Created component: ${componentPath}`);
}

console.log('🚀 Creating missing components with proper interfaces...\n');

Object.entries(componentInterfaces).forEach(([componentPath, interfaceCode]) => {
  createComponent(componentPath, interfaceCode);
});

console.log('\n✅ Component creation complete!');
