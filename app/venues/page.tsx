'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Star, 
  Search, 
  Filter, 
  Heart,
  Camera,
  ExternalLink,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Venue {
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
  venueType: string;
  isAvailable: boolean;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues');
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = (venue?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (venue?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || 
                          venue.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
                          venue.location.state.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCapacity = !capacityFilter || venue.capacity >= parseInt(capacityFilter);
    const matchesPrice = !priceFilter || venue.priceRange === priceFilter;
    const matchesType = !typeFilter || venue.venueType === typeFilter;
    
    return matchesSearch && matchesLocation && matchesCapacity && matchesPrice && matchesType;
  });

  const handleFavorite = async (venueId: string) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'venue', id: venueId }),
      });

      if (response.ok) {
        // Update UI to show favorited state
        console.log('Venue added to favorites');
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wedding Venues</h1>
              <p className="text-gray-600">Discover the perfect venue for your special day</p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search venues..."
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
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Min Capacity</option>
                <option value="50">50+ guests</option>
                <option value="100">100+ guests</option>
                <option value="200">200+ guests</option>
                <option value="300">300+ guests</option>
                <option value="500">500+ guests</option>
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Venue Type</option>
                <option value="hotel">Hotel</option>
                <option value="garden">Garden</option>
                <option value="beach">Beach</option>
                <option value="hall">Banquet Hall</option>
                <option value="church">Church</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVenues.length} of {venues.length} venues
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {venue.coverImage ? (
                  <img
                    src={venue.coverImage}
                    alt={venue?.name || 'Venue'}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-blue-400" />
                  </div>
                )}
                
                <button
                  onClick={() => handleFavorite(venue._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                
                {!venue.isAvailable && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                    Unavailable
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{venue?.name || 'Unknown Venue'}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {venue.venueType}
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
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {venue.priceRange}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {venue.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 flex items-center justify-center space-x-1"
                    onClick={() => window.open(`/venues/${venue._id}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Details</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={!venue.isAvailable}
                  >
                    {venue.isAvailable ? 'Book Now' : 'Unavailable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setCapacityFilter('');
              setPriceFilter('');
              setTypeFilter('');
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