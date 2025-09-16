'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Star, 
  Search, 
  Filter, 
  Heart,
  Camera,
  ExternalLink,
  MapPin,
  DollarSign,
  Award,
  CheckCircle
} from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Vendor {
  _id: string;
  name: string;
  businessName: string;
  category: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  rating: number;
  reviewCount: number;
  avatar?: string;
  coverImage?: string;
  description: string;
  priceRange: string;
  services: string[];
  isVerified: boolean;
  yearsInBusiness: number;
  responseTime: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || 
                          vendor.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
                          vendor.location.state.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCategory = !categoryFilter || vendor.category === categoryFilter;
    const matchesPrice = !priceFilter || vendor.priceRange === priceFilter;
    const matchesVerified = !verifiedFilter || 
                          (verifiedFilter === 'verified' && vendor.isVerified) ||
                          (verifiedFilter === 'unverified' && !vendor.isVerified);
    
    return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesVerified;
  });

  const handleFavorite = async (vendorId: string) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'vendor', id: vendorId }),
      });

      if (response.ok) {
        console.log('Vendor added to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wedding Vendors</h1>
              <p className="text-gray-600">Find the best wedding professionals for your special day</p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <input
                type="text"
                placeholder="Location (city, state)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="photography">Photography</option>
                <option value="catering">Catering</option>
                <option value="music">Music</option>
                <option value="flowers">Flowers</option>
                <option value="transportation">Transportation</option>
                <option value="beauty">Beauty</option>
                <option value="decor">Decorations</option>
                <option value="cake">Cake</option>
              </select>
              
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Price Range</option>
                <option value="$">Budget ($)</option>
                <option value="$$">Moderate ($$)</option>
                <option value="$$$">Premium ($$$)</option>
                <option value="$$$$">Luxury ($$$$)</option>
              </select>
              
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Vendors</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </p>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {vendor.coverImage ? (
                  <img
                    src={vendor.coverImage}
                    alt={vendor?.name || 'Vendor'}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-purple-400" />
                  </div>
                )}
                
                <button
                  onClick={() => handleFavorite(vendor._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                
                {vendor.isVerified && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{vendor?.name || 'Unknown Vendor'}</h3>
                    <p className="text-sm text-gray-600">{vendor.businessName}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {vendor.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{vendor.rating}</span>
                  <span className="text-sm text-gray-500">({vendor.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {vendor.location.city}, {vendor.location.state}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {vendor.yearsInBusiness} years in business
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {vendor.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {vendor.priceRange}
                    </span>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    Responds in {vendor.responseTime}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 flex items-center justify-center space-x-1"
                    onClick={() => window.open(`/vendors/${vendor._id}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Profile</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    className="flex-1"
                  >
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setCategoryFilter('');
              setPriceFilter('');
              setVerifiedFilter('');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}