'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2,
  MoreHorizontal,
  Music,
  Eye,
  Bookmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reel {
  _id: string;
  video: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  audio?: {
    name: string;
    artist: string;
    url: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  caption: string;
  hashtags: string[];
  location?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  userInteractions: {
    isLiked: boolean;
    isBookmarked: boolean;
    isFollowing: boolean;
  };
  createdAt: string;
}

interface ReelsSectionProps {
  onReelClick?: (reel: Reel) => void;
}

export function ReelsSection({ onReelClick }: ReelsSectionProps) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [interactingReel, setInteractingReel] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reels');
      
      if (response.ok) {
        const data = await response.json();
        setReels(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = !isMuted;
      }
    });
    setIsMuted(!isMuted);
  };

  const handleLikeReel = async (reelId: string) => {
    if (interactingReel) return;
    
    setInteractingReel(reelId);
    
    try {
      const response = await fetch(`/api/reels/${reelId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setReels(prev => 
          prev.map(reel => 
            reel._id === reelId 
              ? { 
                  ...reel, 
                  userInteractions: {
                    ...reel.userInteractions,
                    isLiked: data.data.isLiked
                  },
                  engagement: {
                    ...reel.engagement,
                    likes: data.data.likes
                  }
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.error('Error liking reel:', error);
      toast({
        title: "Error",
        description: "Failed to like reel",
        variant: "destructive"
      });
    } finally {
      setInteractingReel(null);
    }
  };

  const handleBookmarkReel = async (reelId: string) => {
    if (interactingReel) return;
    
    setInteractingReel(reelId);
    
    try {
      const response = await fetch(`/api/reels/${reelId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setReels(prev => 
          prev.map(reel => 
            reel._id === reelId 
              ? { 
                  ...reel, 
                  userInteractions: {
                    ...reel.userInteractions,
                    isBookmarked: data.data.isBookmarked
                  }
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.error('Error bookmarking reel:', error);
    } finally {
      setInteractingReel(null);
    }
  };

  const handleShareReel = (reel: Reel) => {
    toast({
      title: "Reel shared",
      description: `Shared ${reel.author.name}'s reel`,
    });
  };

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        setReels(prev => 
          prev.map(reel => 
            reel.author.id === userId 
              ? { 
                  ...reel, 
                  userInteractions: {
                    ...reel.userInteractions,
                    isFollowing: true
                  }
                }
              : reel
          )
        );
        
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="w-16 h-24 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reels</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {reels.map((reel, index) => (
            <div key={reel._id} className="flex space-x-4">
              {/* Video Thumbnail */}
              <div className="relative w-16 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  src={reel.video.url}
                  poster={reel.video.thumbnail}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  loop
                  onClick={() => handlePlayPause(index)}
                />
                
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                    onClick={() => handlePlayPause(index)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Duration */}
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {formatDuration(reel.video.duration)}
                </div>
              </div>

              {/* Reel Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reel.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(reel.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm truncate">
                        {reel.author.name}
                      </span>
                      {reel.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {reel.caption}
                    </p>

                    {/* Hashtags */}
                    {reel.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {reel.hashtags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs text-blue-600">
                            #{tag}
                          </span>
                        ))}
                        {reel.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{reel.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Audio Info */}
                    {reel.audio && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                        <Music className="h-3 w-3" />
                        <span className="truncate">
                          {reel.audio.name} - {reel.audio.artist}
                        </span>
                      </div>
                    )}

                    {/* Location */}
                    {reel.location && (
                      <div className="text-xs text-gray-500 mb-2">
                        📍 {reel.location}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLikeReel(reel._id)}
                      disabled={interactingReel === reel._id}
                      className={`h-8 w-8 ${
                        reel.userInteractions.isLiked ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${
                        reel.userInteractions.isLiked ? 'fill-current' : ''
                      }`} />
                    </Button>
                    <span className="text-xs text-gray-500">
                      {reel.engagement.likes}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-gray-500">
                      {reel.engagement.comments}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmarkReel(reel._id)}
                      disabled={interactingReel === reel._id}
                      className={`h-8 w-8 ${
                        reel.userInteractions.isBookmarked ? 'text-blue-500' : ''
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${
                        reel.userInteractions.isBookmarked ? 'fill-current' : ''
                      }`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShareReel(reel)}
                      className="h-8 w-8"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{reel.engagement.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{reel.engagement.likes.toLocaleString()} likes</span>
                  </div>
                </div>

                {/* Follow Button */}
                {!reel.userInteractions.isFollowing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleFollowUser(reel.author.id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMuteToggle}
            className="flex items-center space-x-2"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
