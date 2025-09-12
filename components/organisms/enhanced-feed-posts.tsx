'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  Tag,
  Eye,
  Flag,
  Edit3,
  Trash2,
  Smile,
  ThumbsUp,
  Zap,
  Laugh,
  Angry,
  Frown,
  Star,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommentSection } from './comment-section';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedPost {
  _id: string;
  content: string;
  media: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    thumbnail?: string;
    metadata?: {
      duration?: number;
      size?: number;
      format?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  }[];
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    role: string;
  };
  engagement: {
    reactions: {
      like: number;
      love: number;
      wow: number;
      laugh: number;
      angry: number;
      sad: number;
    };
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  userInteractions: {
    reactions: string[];
    isBookmarked: boolean;
    isShared: boolean;
  };
  visibility: {
    type: 'public' | 'followers' | 'private' | 'group';
    groupId?: string;
    allowedRoles?: string[];
  };
  boost: {
    isBoosted: boolean;
    boostType?: 'paid' | 'featured' | 'sponsored';
    boostDuration?: string;
    boostTarget?: {
      demographics?: string[];
      locations?: string[];
      interests?: string[];
    };
  };
  tags: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    venue?: string;
  };
  groupId?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  eventId?: {
    _id: string;
    title: string;
    date: string;
  };
  isStory: boolean;
  storyExpiresAt?: string;
  isReel: boolean;
  reelData?: {
    music?: string;
    effects?: string[];
    duration: number;
    originalPostId?: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface EnhancedFeedPostsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function EnhancedFeedPosts({ activeFilter, onFilterChange }: EnhancedFeedPostsProps) {
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [interactingPost, setInteractingPost] = useState<string | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const { toast } = useToast();

  const reactionTypes = [
    { key: 'like', icon: ThumbsUp, color: 'text-blue-500' },
    { key: 'love', icon: Heart, color: 'text-red-500' },
    { key: 'wow', icon: Zap, color: 'text-yellow-500' },
    { key: 'laugh', icon: Laugh, color: 'text-green-500' },
    { key: 'angry', icon: Angry, color: 'text-orange-500' },
    { key: 'sad', icon: Frown, color: 'text-purple-500' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/enhanced-posts?filter=${activeFilter}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (postId: string, action: string, reactionType?: string) => {
    if (interactingPost) return;
    
    setInteractingPost(postId);
    
    try {
      const response = await fetch(`/api/enhanced-posts/${postId}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reactionType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  engagement: data.post.engagement,
                  userInteractions: data.post.userInteractions
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating interaction:', error);
      toast({
        title: "Error",
        description: "Failed to update interaction",
        variant: "destructive"
      });
    } finally {
      setInteractingPost(null);
    }
  };

  const handleReaction = (postId: string, reactionType: string) => {
    handleInteraction(postId, reactionType);
    setShowReactions(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
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
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'wedding_planner':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getBoostBadge = (boost: any) => {
    if (!boost.isBoosted) return null;
    
    const boostColors = {
      paid: 'bg-green-100 text-green-800',
      featured: 'bg-blue-100 text-blue-800',
      sponsored: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={boostColors[boost.boostType as keyof typeof boostColors] || 'bg-gray-100 text-gray-800'}>
        {boost.boostType?.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'All Posts' },
          { key: 'following', label: 'Following' },
          { key: 'trending', label: 'Trending' },
          { key: 'nearby', label: 'Nearby' }
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className="flex-1"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <MessageCircle className="h-12 w-12 mx-auto mb-2" />
              <p>No posts yet</p>
              <p className="text-sm">Be the first to share something!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{post.author.name}</h3>
                      {getAuthorIcon(post.author.type)}
                      {post.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      {getBoostBadge(post.boost)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                      {post.location?.address && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {post.location.address}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Post Content */}
              {post.content && (
                <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Group/Event Info */}
              {(post.groupId || post.eventId) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {post.groupId && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {post.groupId.name}
                    </div>
                  )}
                  {post.eventId && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.eventId.title}
                    </div>
                  )}
                </div>
              )}

              {/* Media */}
              {post.media.length > 0 && (
                <div className={`grid gap-2 ${
                  post.media.length === 1 ? 'grid-cols-1' : 
                  post.media.length === 2 ? 'grid-cols-2' :
                  post.media.length === 3 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {post.media.slice(0, 4).map((media, index) => (
                    <div key={index} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : media.type === 'video' ? (
                        <video
                          src={media.url}
                          poster={media.thumbnail}
                          className="w-full h-64 object-cover rounded-lg"
                          controls
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ExternalLink className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {post.media.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white text-lg font-semibold">
                            +{post.media.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <span>{Object.values(post.engagement.reactions).reduce((a, b) => a + b, 0)} reactions</span>
                  <span>{post.engagement.comments} comments</span>
                  <span>{post.engagement.shares} shares</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.engagement.views}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReactions(showReactions === post._id ? null : post._id)}
                      disabled={interactingPost === post._id}
                      className={post.userInteractions.reactions.length > 0 ? 'text-blue-500' : ''}
                    >
                      <Heart className="h-5 w-5 mr-1" />
                      React
                    </Button>
                    
                    {showReactions === post._id && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                        {reactionTypes.map((reaction) => {
                          const Icon = reaction.icon;
                          const count = post.engagement.reactions[reaction.key as keyof typeof post.engagement.reactions];
                          return (
                            <Button
                              key={reaction.key}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(post._id, reaction.key)}
                              className={`${reaction.color} hover:bg-gray-100`}
                            >
                              <Icon className="h-4 w-4" />
                              {count > 0 && <span className="ml-1 text-xs">{count}</span>}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentPostId(post._id)}
                  >
                    <MessageCircle className="h-5 w-5 mr-1" />
                    Comment
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInteraction(post._id, 'share')}
                  >
                    <Share2 className="h-5 w-5 mr-1" />
                    Share
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInteraction(post._id, 'bookmark')}
                  disabled={interactingPost === post._id}
                  className={post.userInteractions.isBookmarked ? 'text-blue-500' : ''}
                >
                  <Bookmark className={`h-5 w-5 ${
                    post.userInteractions.isBookmarked ? 'fill-current' : ''
                  }`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Comment Section */}
      <CommentSection
        postId={commentPostId || ''}
        isOpen={!!commentPostId}
        onClose={() => setCommentPostId(null)}
      />
    </div>
  );
}
