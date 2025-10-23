'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Mail,
  ExternalLink,
  Trash2,
  Calendar,
  Users,
  Camera
} from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FavoriteVendor {
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
  phone?: string;
  email?: string;
  priceRange: string;
  services: string[];
  addedAt: string;
}

interface FavoriteVenue {
  _id: string;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  capacity: number;
  rating: number;
  reviewCount: number;
  avatar?: string;
  coverImage?: string;
  description: string;
  priceRange: string;
  amenities: string[];
  addedAt: string;
}

export default function FavoritesPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter();
  const [favoriteVendors, setFavoriteVendors] = useState<FavoriteVendor[]>([]);
  const [favoriteVenues, setFavoriteVenues] = useState<FavoriteVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vendors' | 'venues'>('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!user?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchFavorites();
  }, [session, status, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavoriteVendors(data.vendors || []);
        setFavoriteVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (type: 'vendor' | 'venue', id: string) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });

      if (response.ok) {
        if (type === 'vendor') {
          setFavoriteVendors(prev => prev.filter(v => v._id !== id));
        } else {
          setFavoriteVenues(prev => prev.filter(v => v._id !== id));
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredVendors = favoriteVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredVenues = favoriteVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (status === 'loading' || loading) {
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

  if (!user?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600">Your saved vendors and venues</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'vendors'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vendors ({favoriteVendors.length})
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'venues'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Venues ({favoriteVenues.length})
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {activeTab === 'vendors' && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="photography">Photography</option>
                  <option value="catering">Catering</option>
                  <option value="music">Music</option>
                  <option value="flowers">Flowers</option>
                  <option value="transportation">Transportation</option>
                  <option value="beauty">Beauty</option>
                </select>
              )}
              
              <Button
                onClick={fetchFavorites}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'vendors' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {vendor.coverImage ? (
                    <img
                      src={vendor.coverImage}
                      alt={vendor.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite('vendor', vendor._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{vendor.name}</h3>
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
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {vendor.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      {vendor.priceRange}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/vendors/${vendor._id}`)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredVendors.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite vendors yet</h3>
                <p className="text-gray-500 mb-4">Start exploring vendors and add them to your favorites!</p>
                <Button onClick={() => router.push('/vendors')}>
                  Browse Vendors
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Card key={venue._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {venue.coverImage ? (
                    <img
                      src={venue.coverImage}
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-blue-400" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite('venue', venue._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{venue.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Venue
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                    <span className="text-sm text-gray-500">({venue.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {venue.location.city}, {venue.location.state}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Up to {venue.capacity} guests
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {venue.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      {venue.priceRange}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/venues/${venue._id}`)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredVenues.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite venues yet</h3>
                <p className="text-gray-500 mb-4">Start exploring venues and add them to your favorites!</p>
                <Button onClick={() => router.push('/venues')}>
                  Browse Venues
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}