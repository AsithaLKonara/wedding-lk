'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Heart, 
  Download, 
  Share2, 
  Filter,
  Grid3X3,
  List,
  ThumbsUp,
  MessageCircle,
  Flag,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  photographer: string;
  category: 'ceremony' | 'reception' | 'preparation' | 'portraits' | 'candid' | 'details';
  tags: string[];
  rating: number;
  likes: number;
  isFavorite: boolean;
  isPublic: boolean;
  uploadedAt: string;
  metadata: {
    camera: string;
    lens: string;
    settings: string;
    location?: string;
  };
}

export default function PhotoReviewPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState({
    category: 'all',
    rating: 'all',
    favorite: false,
    public: 'all'
  });
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'likes' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    { value: 'all', label: 'All Photos' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'reception', label: 'Reception' },
    { value: 'preparation', label: 'Preparation' },
    { value: 'portraits', label: 'Portraits' },
    { value: 'candid', label: 'Candid' },
    { value: 'details', label: 'Details' }
  ];

  const ratings = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ];

  useEffect(() => {
    if (session) {
      loadPhotos();
    }
  }, [session]);

  const loadPhotos = () => {
    // Mock data - in real app, fetch from API
    const mockPhotos: Photo[] = [
      {
        id: '1',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/300/200',
        title: 'First Look',
        description: 'The magical moment when the groom sees the bride for the first time',
        photographer: 'John Smith Photography',
        category: 'ceremony',
        tags: ['first look', 'emotional', 'ceremony'],
        rating: 5,
        likes: 24,
        isFavorite: true,
        isPublic: true,
        uploadedAt: '2024-01-15T10:30:00Z',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '85mm f/1.4',
          settings: '1/125s, f/2.8, ISO 400',
          location: 'Garden Venue'
        }
      },
      {
        id: '2',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/300/200',
        title: 'Reception Dance',
        description: 'Couple dancing at the reception',
        photographer: 'Sarah Johnson',
        category: 'reception',
        tags: ['dancing', 'reception', 'celebration'],
        rating: 4,
        likes: 18,
        isFavorite: false,
        isPublic: true,
        uploadedAt: '2024-01-15T20:45:00Z',
        metadata: {
          camera: 'Sony A7R IV',
          lens: '24-70mm f/2.8',
          settings: '1/60s, f/2.8, ISO 800',
          location: 'Reception Hall'
        }
      },
      {
        id: '3',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/300/200',
        title: 'Bridal Preparation',
        description: 'Bride getting ready with her bridesmaids',
        photographer: 'Mike Wilson',
        category: 'preparation',
        tags: ['getting ready', 'bridesmaids', 'preparation'],
        rating: 5,
        likes: 31,
        isFavorite: true,
        isPublic: false,
        uploadedAt: '2024-01-15T08:15:00Z',
        metadata: {
          camera: 'Nikon D850',
          lens: '50mm f/1.4',
          settings: '1/100s, f/2.0, ISO 200',
          location: 'Bridal Suite'
        }
      },
      {
        id: '4',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/300/200',
        title: 'Wedding Details',
        description: 'Beautiful details of the wedding setup',
        photographer: 'Emma Davis',
        category: 'details',
        tags: ['details', 'decorations', 'setup'],
        rating: 4,
        likes: 12,
        isFavorite: false,
        isPublic: true,
        uploadedAt: '2024-01-15T09:00:00Z',
        metadata: {
          camera: 'Canon EOS R6',
          lens: '100mm f/2.8 Macro',
          settings: '1/200s, f/4.0, ISO 100',
          location: 'Ceremony Venue'
        }
      }
    ];
    
    setPhotos(mockPhotos);
    setFilteredPhotos(mockPhotos);
  };

  useEffect(() => {
    let filtered = [...photos];

    // Apply filters
    if (filter.category !== 'all') {
      filtered = filtered.filter(photo => photo.category === filter.category);
    }

    if (filter.rating !== 'all') {
      const minRating = parseInt(filter.rating);
      filtered = filtered.filter(photo => photo.rating >= minRating);
    }

    if (filter.favorite) {
      filtered = filtered.filter(photo => photo.isFavorite);
    }

    if (filter.public !== 'all') {
      const isPublic = filter.public === 'true';
      filtered = filtered.filter(photo => photo.isPublic === isPublic);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPhotos(filtered);
  }, [photos, filter, sortBy, sortOrder]);

  const toggleFavorite = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, isFavorite: !photo.isFavorite }
        : photo
    ));
  };

  const updateRating = (photoId: string, rating: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, rating }
        : photo
    ));
  };

  const togglePublic = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, isPublic: !photo.isPublic }
        : photo
    ));
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAllPhotos = () => {
    setSelectedPhotos(filteredPhotos.map(photo => photo.id));
  };

  const clearSelection = () => {
    setSelectedPhotos([]);
  };

  const downloadPhoto = (photo: Photo) => {
    // In real app, this would trigger actual download
    toast({
      title: 'Download Started',
      description: `Downloading ${photo.title}...`,
    });
  };

  const sharePhoto = (photo: Photo) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Photo link copied to clipboard',
      });
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderPhotoCard = (photo: Photo) => (
    <Card key={photo.id} className="group hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={photo.thumbnail}
          alt={photo.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            size="sm"
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => togglePhotoSelection(photo.id)}
          >
            {selectedPhotos.includes(photo.id) ? '✓' : '○'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => toggleFavorite(photo.id)}
          >
            <Heart className={`h-4 w-4 ${photo.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {categories.find(c => c.value === photo.category)?.label}
            </Badge>
            <div className="flex items-center space-x-1">
              {renderStars(photo.rating)}
              <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                {photo.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{photo.photographer}</span>
          <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadPhoto(photo)}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sharePhoto(photo)}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => togglePublic(photo.id)}
            >
              {photo.isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            {photo.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPhotoList = (photo: Photo) => (
    <Card key={photo.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={photo.thumbnail}
            alt={photo.title}
            className="w-20 h-20 object-cover rounded"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900">{photo.title}</h3>
              <div className="flex items-center space-x-2">
                {renderStars(photo.rating, true, (rating) => updateRating(photo.id, rating))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(photo.id)}
                >
                  <Heart className={`h-4 w-4 ${photo.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
            
            {photo.description && (
              <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{photo.photographer}</span>
                <span>{photo.likes} likes</span>
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.value === photo.category)?.label}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadPhoto(photo)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sharePhoto(photo)}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePublic(photo.id)}
                >
                  {photo.isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Photo Review</h1>
          <p className="mt-2 text-gray-600">Review, rate, and manage your wedding photos</p>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    className="ml-2 p-2 border rounded-md text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={filter.rating}
                    onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
                    className="ml-2 p-2 border rounded-md text-sm"
                  >
                    {ratings.map((rating) => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="favorites"
                    checked={filter.favorite}
                    onChange={(e) => setFilter({ ...filter, favorite: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="favorites" className="text-sm font-medium text-gray-700">
                    Favorites Only
                  </label>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Visibility</label>
                  <select
                    value={filter.public}
                    onChange={(e) => setFilter({ ...filter, public: e.target.value })}
                    className="ml-2 p-2 border rounded-md text-sm"
                  >
                    <option value="all">All</option>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="ml-2 p-2 border rounded-md text-sm"
                  >
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="likes">Likes</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
                
                <div className="flex border rounded-md">
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
            
            {selectedPhotos.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-md">
                <span className="text-sm text-blue-700">
                  {selectedPhotos.length} photo(s) selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={selectAllPhotos}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                  <Button size="sm" variant="default">
                    Download Selected
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos */}
        {filteredPhotos.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600">Try adjusting your filters or upload some photos.</p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredPhotos.map(photo => 
              viewMode === 'grid' ? renderPhotoCard(photo) : renderPhotoList(photo)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
