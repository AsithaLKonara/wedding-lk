'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, MapPin, Phone, Mail, Eye, MessageSquare, Trash2, Calendar, DollarSign } from 'lucide-react';

interface Favorite {
  id: string;
  type: 'venue' | 'vendor' | 'package';
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  location: string;
  category: string;
  contact: {
    email: string;
    phone: string;
  };
  features: string[];
  addedDate: string;
}

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const types = [
    { value: 'venue', label: 'Venues', color: 'bg-purple-100 text-purple-800' },
    { value: 'vendor', label: 'Vendors', color: 'bg-blue-100 text-blue-800' },
    { value: 'package', label: 'Packages', color: 'bg-green-100 text-green-800' }
  ];

  const categories = [
    'Photography',
    'Videography',
    'Catering',
    'Decoration',
    'Music & DJ',
    'Transportation',
    'Makeup & Hair',
    'Venue',
    'Flowers',
    'Cake',
    'Lighting',
    'Entertainment'
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockFavorites: Favorite[] = [
        {
          id: '1',
          type: 'venue',
          name: 'Garden Manor',
          description: 'Beautiful outdoor wedding venue with stunning garden views and elegant indoor spaces.',
          image: '/placeholder-venue.jpg',
          rating: 4.8,
          reviewCount: 45,
          price: 5000,
          location: 'New York, NY',
          category: 'Venue',
          contact: {
            email: 'info@gardenmanor.com',
            phone: '+1 (555) 123-4567'
          },
          features: ['Outdoor Ceremony', 'Indoor Reception', 'Bridal Suite', 'Catering Available'],
          addedDate: '2024-06-15'
        },
        {
          id: '2',
          type: 'vendor',
          name: 'Elegant Photography Studio',
          description: 'Professional wedding photography with 10+ years experience capturing special moments.',
          image: '/placeholder-photographer.jpg',
          rating: 4.9,
          reviewCount: 32,
          price: 2500,
          location: 'Los Angeles, CA',
          category: 'Photography',
          contact: {
            email: 'contact@elegantphoto.com',
            phone: '+1 (555) 234-5678'
          },
          features: ['8 Hours Coverage', '500+ Edited Photos', 'Online Gallery', 'Engagement Session'],
          addedDate: '2024-06-10'
        },
        {
          id: '3',
          type: 'package',
          name: 'Luxury Wedding Package',
          description: 'Complete wedding package including venue, catering, photography, and decoration.',
          image: '/placeholder-package.jpg',
          rating: 4.7,
          reviewCount: 28,
          price: 15000,
          location: 'Chicago, IL',
          category: 'Package',
          contact: {
            email: 'packages@luxuryweddings.com',
            phone: '+1 (555) 345-6789'
          },
          features: ['Premium Venue', 'Gourmet Catering', 'Professional Photography', 'Full Decoration'],
          addedDate: '2024-06-05'
        },
        {
          id: '4',
          type: 'vendor',
          name: 'Dreamy Decorations',
          description: 'Creative wedding decorations and floral arrangements for your special day.',
          image: '/placeholder-decorator.jpg',
          rating: 4.6,
          reviewCount: 25,
          price: 1200,
          location: 'Miami, FL',
          category: 'Decoration',
          contact: {
            email: 'hello@dreamydecor.com',
            phone: '+1 (555) 456-7890'
          },
          features: ['Custom Design', 'Fresh Flowers', 'Setup & Cleanup', 'Consultation Included'],
          addedDate: '2024-05-28'
        }
      ];
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    if (confirm('Are you sure you want to remove this item from your favorites?')) {
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    }
  };

  const getTypeColor = (type: string) => {
    const typeObj = types.find(t => t.value === type);
    return typeObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredFavorites = favorites.filter(favorite => {
    const typeMatch = filterType === 'all' || favorite.type === filterType;
    const categoryMatch = filterCategory === 'all' || favorite.category === filterCategory;
    const searchMatch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       favorite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       favorite.location.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && categoryMatch && searchMatch;
  });

  const getFavoriteStats = () => {
    const total = favorites.length;
    const venues = favorites.filter(f => f.type === 'venue').length;
    const vendors = favorites.filter(f => f.type === 'vendor').length;
    const packages = favorites.filter(f => f.type === 'package').length;
    const totalValue = favorites.reduce((sum, favorite) => sum + favorite.price, 0);
    
    return { total, venues, vendors, packages, totalValue };
  };

  const stats = getFavoriteStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600">Manage your saved venues, vendors, and packages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Venues</p>
                <p className="text-2xl font-bold">{stats.venues}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendors</p>
                <p className="text-2xl font-bold">{stats.vendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Packages</p>
                <p className="text-2xl font-bold">{stats.packages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <Label htmlFor="search">Search Favorites</Label>
              <Input
                id="search"
                placeholder="Search by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div>
              <Label htmlFor="typeFilter">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="venue">Venues</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="package">Packages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoryFilter">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites found</h3>
            <p className="text-gray-500">Start exploring venues and vendors to add them to your favorites</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={favorite.image} />
                    <AvatarFallback>
                      {favorite.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getTypeColor(favorite.type)}>
                    {types.find(t => t.value === favorite.type)?.label}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{favorite.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{favorite.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{favorite.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({favorite.reviewCount})</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-medium">{favorite.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {favorite.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {favorite.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {favorite.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{favorite.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500">
                      Added {new Date(favorite.addedDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
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
  );
}
