'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Heart, MessageCircle, Share, Bookmark, Play, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface ExploreContent {
  id: string;
  type: 'vendor' | 'venue' | 'post' | 'reel' | 'story';
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    type: 'user' | 'vendor' | 'venue' | 'planner';
  };
  location?: string;
  rating?: number;
  price?: number;
  currency?: string;
  tags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  createdAt: string;
  trendingScore: number;
  aiRecommendation: {
    reason: string;
    confidence: number;
  };
}

interface ExplorePageProps {
  userId?: string;
  userPreferences?: {
    interests: string[];
    location: string;
    budget: { min: number; max: number };
    eventDate?: string;
  };
}

export function ExplorePage({ userId, userPreferences }: ExplorePageProps) {
  const [content, setContent] = useState<ExploreContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: { min: 0, max: 1000000 },
    rating: 0,
    dateRange: { start: '', end: '' }
  });

  // Fetch AI-powered recommendations
  useEffect(() => {
    fetchExploreContent();
  }, [searchQuery, selectedCategory, sortBy, filters]);

  const fetchExploreContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('query', searchQuery);
      params.set('category', selectedCategory);
      params.set('sortBy', sortBy);
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/explore?${params}`);
      const data = await response.json();
      setContent(data.content || []);
    } catch (error) {
      console.error('Error fetching explore content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (contentId: string, action: 'like' | 'bookmark' | 'share' | 'view') => {
    try {
      const response = await fetch(`/api/explore/${contentId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        // Update local state
        setContent(prev => prev.map(item => {
          if (item.id === contentId) {
            const updated = { ...item };
            switch (action) {
              case 'like':
                updated.engagement.likes += 1;
                break;
              case 'bookmark':
                // Handle bookmark logic
                break;
              case 'share':
                updated.engagement.shares += 1;
                break;
              case 'view':
                updated.engagement.views += 1;
                break;
            }
            return updated;
          }
          return item;
        }));
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'venues', name: 'Venues', icon: '🏛️' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'catering', name: 'Catering', icon: '🍽️' },
    { id: 'decorations', name: 'Decorations', icon: '🌸' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'posts', name: 'Posts', icon: '📱' },
    { id: 'reels', name: 'Reels', icon: '🎬' }
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'nearby', label: 'Nearby' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const renderContentCard = (item: ExploreContent) => (
    <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        
        {/* Content Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2"
        >
          {item.type === 'reel' && <Play className="w-3 h-3 mr-1" />}
          {item.type === 'story' && <Clock className="w-3 h-3 mr-1" />}
          {item.type === 'post' && <MessageCircle className="w-3 h-3 mr-1" />}
          {item.type === 'vendor' && <Star className="w-3 h-3 mr-1" />}
          {item.type === 'venue' && <MapPin className="w-3 h-3 mr-1" />}
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Badge>

        {/* AI Recommendation Badge */}
        {item.aiRecommendation.confidence > 0.8 && (
          <Badge 
            variant="default" 
            className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500"
          >
            🤖 AI Pick
          </Badge>
        )}

        {/* Trending Score */}
        {item.trendingScore > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            🔥 {item.trendingScore}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-sm">{item.author.name}</span>
                {item.author.verified && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    ✓
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {item.author.type}
              </span>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-3">
          {item.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {item.location}
            </div>
          )}
          {item.rating && (
            <div className="flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {item.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Price */}
        {item.price && (
          <div className="text-lg font-semibold text-green-600 mb-3">
            {item.currency || 'LKR'} {item.price.toLocaleString()}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* AI Recommendation Reason */}
        {item.aiRecommendation.confidence > 0.7 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
            <div className="flex items-start space-x-2">
              <span className="text-purple-600">🤖</span>
              <div>
                <p className="text-xs text-purple-700 font-medium">
                  Why we recommend this:
                </p>
                <p className="text-xs text-purple-600">
                  {item.aiRecommendation.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {item.engagement.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {item.engagement.comments}
            </span>
            <span className="flex items-center">
              <Share className="w-4 h-4 mr-1" />
              {item.engagement.shares}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {item.engagement.views}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleInteraction(item.id, 'like')}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleInteraction(item.id, 'bookmark')}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleInteraction(item.id, 'share')}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
          
          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
            {item.type === 'vendor' || item.type === 'venue' ? 'View Details' : 'View'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Amazing Wedding Content</h1>
        <p className="text-gray-600">
          AI-powered recommendations tailored just for you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vendors, venues, posts, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map(renderContentCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No content found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSortBy('trending');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {content.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Content
          </Button>
        </div>
      )}
    </div>
  );
}