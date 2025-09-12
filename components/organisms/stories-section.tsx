'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
  MapPin,
  Tag,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Story {
  _id: string;
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: number;
    metadata?: {
      size: number;
      format: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  interactiveElements: {
    type: 'poll' | 'question' | 'quiz' | 'countdown' | 'sticker' | 'music';
    data: {
      question?: string;
      options?: string[];
      correctAnswer?: string;
      endTime?: string;
      stickerType?: string;
      musicTrack?: string;
      position: {
        x: number;
        y: number;
      };
    };
    isActive: boolean;
  }[];
  views: {
    user: string;
    viewedAt: string;
  }[];
  reactions: {
    user: string;
    type: 'like' | 'love' | 'wow' | 'laugh' | 'angry' | 'sad';
    reactedAt: string;
  }[];
  interactions: {
    user: string;
    elementId: string;
    response: any;
    interactedAt: string;
  }[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    venue?: string;
  };
  tags: string[];
  groupId?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isHighlight: boolean;
  highlightTitle?: string;
  highlightCover?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

interface StoriesSectionProps {
  groupId?: string;
}

export function StoriesSection({ groupId }: StoriesSectionProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showInteractive, setShowInteractive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, [groupId]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const url = groupId 
        ? `/api/stories?groupId=${groupId}`
        : '/api/stories';
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to load stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story: Story, index: number) => {
    setSelectedStory(story);
    setCurrentStoryIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setSelectedStory(stories[currentStoryIndex + 1]);
      setProgress(0);
    } else {
      setSelectedStory(null);
      setIsPlaying(false);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setSelectedStory(stories[currentStoryIndex - 1]);
      setProgress(0);
    }
  };

  const handleInteractiveElement = (element: any) => {
    setShowInteractive(true);
    // Handle different interactive element types
    switch (element.type) {
      case 'poll':
        // Show poll interface
        break;
      case 'question':
        // Show question interface
        break;
      case 'quiz':
        // Show quiz interface
        break;
      case 'countdown':
        // Show countdown
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAuthorIcon = (type: string) => {
    switch (type) {
      case 'vendor':
        return <Star className="h-3 w-3 text-yellow-500" />;
      case 'admin':
        return <Users className="h-3 w-3 text-blue-500" />;
      case 'wedding_planner':
        return <Calendar className="h-3 w-3 text-purple-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stories.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-gray-500 mb-4">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No stories yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4 overflow-x-auto">
            {/* Add Story Button */}
            <div className="flex flex-col items-center space-y-2 min-w-[64px]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">Add Story</span>
            </div>

            {/* Story Items */}
            {stories.map((story, index) => (
              <div
                key={story._id}
                className="flex flex-col items-center space-y-2 min-w-[64px] cursor-pointer"
                onClick={() => handleStoryClick(story, index)}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 p-0.5">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={story.author.avatar} />
                      <AvatarFallback className="bg-white">
                        {getInitials(story.author.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {story.isHighlight && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium truncate max-w-[60px]">
                    {story.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(story.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story Content */}
            <div className="relative w-full h-full">
              {selectedStory.content.type === 'image' ? (
                <img
                  src={selectedStory.content.url}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={selectedStory.content.url}
                  poster={selectedStory.content.thumbnail}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              )}

              {/* Interactive Elements Overlay */}
              {selectedStory.interactiveElements.map((element, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${element.data.position.x}%`,
                    top: `${element.data.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleInteractiveElement(element)}
                >
                  {element.type === 'poll' && (
                    <div className="bg-white bg-opacity-90 rounded-lg p-2 cursor-pointer">
                      <p className="text-sm font-medium">{element.data.question}</p>
                      <div className="flex space-x-2 mt-1">
                        {element.data.options?.map((option, i) => (
                          <Button key={i} size="sm" variant="outline" className="text-xs">
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {element.type === 'question' && (
                    <div className="bg-white bg-opacity-90 rounded-lg p-2 cursor-pointer">
                      <p className="text-sm font-medium">{element.data.question}</p>
                    </div>
                  )}
                  
                  {element.type === 'countdown' && element.data.endTime && (
                    <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {Math.max(0, Math.floor((new Date(element.data.endTime).getTime() - Date.now()) / 1000))}
                    </div>
                  )}
                </div>
              ))}

              {/* Story Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedStory.author.avatar} />
                    <AvatarFallback>
                      {getInitials(selectedStory.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">
                        {selectedStory.author.name}
                      </span>
                      {getAuthorIcon(selectedStory.author.type)}
                      {selectedStory.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-white text-xs opacity-75">
                      {formatTimeAgo(selectedStory.createdAt)}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={() => setSelectedStory(null)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Story Footer */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {selectedStory.reactions.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {selectedStory.location && (
                    <div className="flex items-center text-white text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedStory.location.address}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute top-0 left-0 w-1/2 h-full" onClick={handlePrevStory} />
              <div className="absolute top-0 right-0 w-1/2 h-full" onClick={handleNextStory} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}