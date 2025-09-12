'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  DollarSign,
  Heart,
  Eye,
  Phone,
  Mail,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SearchFilters {
  query: string;
  type: 'vendors' | 'venues' | 'all';
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  features: string[];
  sortBy: 'relevance' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: 'vendor' | 'venue';
  category: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  isBoosted: boolean;
  features: string[];
  availability: string;
  contact: {
    phone: string;
    email: string;
  };
}

function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    type: (searchParams.get('type') as 'vendors' | 'venues' | 'all') || 'all',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    priceRange: [0, 1000000],
    rating: 0,
    availability: '',
    features: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const categories = [
    'Photography', 'Videography', 'Catering', 'Decoration', 'Music',
    'Transportation', 'Makeup', 'Hair', 'Dress', 'Venue'
  ];

  const features = [
    'Outdoor', 'Indoor', 'Air Conditioning', 'Parking', 'WiFi',
    'Sound System', 'Lighting', 'Catering', 'Bar', 'Photography'
  ];

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 0) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    performSearch();
  };

  const toggleFavorite = async (id: string) => {
    try {
      const isFavorited = favorites.includes(id);
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, type: 'search' })
      });

      if (response.ok) {
        setFavorites(prev => 
          isFavorited 
            ? prev.filter(fav => fav !== id)
            : [...prev, id]
        );
        toast({
          title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
          description: isFavorited 
            ? 'Item removed from your favorites.' 
            : 'Item added to your favorites.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites.',
        variant: 'destructive'
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      category: '',
      location: '',
      priceRange: [0, 1000000],
      rating: 0,
      availability: '',
      features: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Wedding Services</h1>
          
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for vendors, venues, or services..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10 h-12 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="vendors">Vendors</SelectItem>
                  <SelectItem value="venues">Venues</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} size="lg" className="px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                size="lg"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Filters
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <Input
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">
                      Price Range: LKR {filters.priceRange[0].toLocaleString()} - LKR {filters.priceRange[1].toLocaleString()}
                    </Label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      max={1000000}
                      min={0}
                      step={10000}
                      className="mt-2"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="1">1+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Features Filter */}
                  <div>
                    <Label className="text-sm font-medium">Features</Label>
                    <div className="space-y-2 mt-2">
                      {features.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={filters.features.includes(feature)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('features', [...filters.features, feature]);
                              } else {
                                handleFilterChange('features', filters.features.filter(f => f !== feature));
                              }
                            }}
                          />
                          <Label htmlFor={feature} className="text-sm">{feature}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'Searching...' : `${results.length} results found`}
                </h2>
                {filters.query && (
                  <p className="text-gray-600">for "{filters.query}"</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {results.map((result) => (
                  <Card key={result.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {result.isBoosted && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            Boosted
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => toggleFavorite(result.id)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(result.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{result.name}</h3>
                          <Badge variant="secondary">{result.type}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{result.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {result.location}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {result.rating} ({result.reviewCount})
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-green-600">
                            LKR {result.price.toLocaleString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SearchPage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
});
