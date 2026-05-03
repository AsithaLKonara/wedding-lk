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
  Zap,
  Laugh,
  Angry,
  Frown,
  Star,
  Users,
  Calendar,
  ExternalLink,
  ThumbsUp
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
    { key: 'like', icon: ThumbsUp, color: 'text-blue-400' },
    { key: 'love', icon: Heart, color: 'text-red-400' },
    { key: 'wow', icon: Zap, color: 'text-yellow-400' },
    { key: 'laugh', icon: Laugh, color: 'text-emerald-400' },
    { key: 'angry', icon: Angry, color: 'text-orange-400' },
    { key: 'sad', icon: Frown, color: 'text-purple-400' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/enhanced-posts?filter=${activeFilter}`);
      
      if (response.ok) {
        const result = await response.json();
        setPosts(result.data?.posts || []);
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
    
    return date.toLocaleDateString('en-GB');
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
        return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
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
      paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      featured: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      sponsored: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };

    return (
      <Badge className={`${boostColors[boost.boostType as keyof typeof boostColors] || 'bg-white/5 text-white border-white/10'} uppercase text-[10px] font-black tracking-widest`}>
        {boost.boostType}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 overflow-hidden">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-1/6 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                <div className="h-64 bg-white/5 rounded animate-pulse" />
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
      <div className="flex space-x-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {[
          { key: 'all', label: 'All Posts' },
          { key: 'following', label: 'Following' },
          { key: 'trending', label: 'Trending' },
          { key: 'nearby', label: 'Nearby' }
        ].map((filter) => (
          <Button
            key={filter.key}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={`px-6 rounded-lg transition-all font-bold ${activeFilter === filter.key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-black text-white mb-2">No posts yet</p>
              <p className="text-sm font-medium">Be the first to share something with the community!</p>
              <Button className="mt-6 bg-red-600 hover:bg-red-700 font-bold rounded-xl h-11 px-8">Create Post</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="bg-white/5 border-white/10 overflow-hidden hover:border-white/20 transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-11 w-11 border-2 border-white/5 group-hover:border-white/10 transition-colors">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-white/5 text-white font-black">{getInitials(post.author?.name || 'Unknown')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-white tracking-tight">{post.author?.name || 'Unknown User'}</h3>
                      {getAuthorIcon(post.author.type)}
                      {post.author.verified && (
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[9px] font-black tracking-widest px-2 h-5">
                          Verified
                        </Badge>
                      )}
                      {getBoostBadge(post.boost)}
                    </div>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                      {formatTimeAgo(post.createdAt)}
                      {post.location?.address && (
                        <>
                          <span className="text-[8px] opacity-30">•</span>
                          <span className="flex items-center text-red-400/80">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location.address}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white hover:bg-white/5 rounded-xl">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0e0918] border-white/10 text-white p-1 rounded-xl shadow-2xl">
                    <DropdownMenuItem className="rounded-lg hover:bg-white/5 font-medium py-2">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 rounded-lg hover:bg-red-500/10 font-medium py-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-white/5 font-medium py-2">
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
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              )}

              {/* Media */}
              {post.media.length > 0 && (
                <div className={`grid gap-2 overflow-hidden rounded-2xl border border-white/5 ${
                  post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.media.slice(0, 4).map((media, index) => (
                    <div key={index} className="relative group/media overflow-hidden aspect-square sm:aspect-auto sm:h-80 bg-black/20">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110"
                        />
                      ) : media.type === 'video' ? (
                        <video
                          src={media.url}
                          poster={media.thumbnail}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ExternalLink className="h-10 w-10 text-white/20" />
                        </div>
                      )}
                      {post.media.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white text-xl font-black">
                            +{post.media.length - 4} MORE
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5 transition-colors text-[10px] font-black uppercase tracking-widest px-3 py-1 cursor-pointer">
                      <Tag className="h-3 w-3 mr-1 opacity-50" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Group/Event Info */}
              {(post.groupId || post.eventId) && (
                <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 p-2 px-3 rounded-lg w-fit border border-white/5">
                  {post.groupId && (
                    <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                      <Users className="h-3 w-3 text-blue-400" />
                      {post.groupId?.name || 'Group'}
                    </div>
                  )}
                  {post.eventId && (
                    <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                      <Calendar className="h-3 w-3 text-red-400" />
                      {post.eventId?.title || 'Event'}
                    </div>
                  )}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 pt-3 border-t border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-1 hover:text-white transition-colors cursor-default">
                    <span className="text-white">{Object.values(post.engagement.reactions).reduce((a, b) => a + b, 0)}</span>
                    REACTIONS
                  </div>
                  <div className="flex items-center gap-1 hover:text-white transition-colors cursor-default">
                    <span className="text-white">{post.engagement.comments}</span>
                    COMMENTS
                  </div>
                  <div className="flex items-center gap-1 hover:text-white transition-colors cursor-default">
                    <span className="text-white">{post.engagement.shares}</span>
                    SHARES
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/5 px-2 py-1 rounded-lg">
                  <Eye className="h-3 w-3 opacity-50" />
                  <span className="text-white">{post.engagement.views}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReactions(showReactions === post._id ? null : post._id)}
                      disabled={interactingPost === post._id}
                      className={`h-10 px-4 rounded-xl font-bold transition-all ${post.userInteractions.reactions.length > 0 ? 'bg-red-500/10 text-red-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${post.userInteractions.reactions.length > 0 ? 'fill-current' : ''}`} />
                      REACT
                    </Button>
                    
                    {showReactions === post._id && (
                      <div className="absolute bottom-full left-0 mb-3 bg-[#0e0918] border border-white/10 rounded-2xl shadow-2xl p-2 flex space-x-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {reactionTypes.map((reaction) => {
                          const Icon = reaction.icon;
                          const count = post.engagement.reactions[reaction.key as keyof typeof post.engagement.reactions];
                          return (
                            <Button
                              key={reaction.key}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(post._id, reaction.key)}
                              className={`h-10 w-10 p-0 rounded-xl ${reaction.color} hover:bg-white/5 transition-all hover:scale-125`}
                              title={reaction.key.toUpperCase()}
                            >
                              <Icon className="h-5 w-5" />
                              {count > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center">{count}</span>}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setCommentPostId(post._id)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    COMMENT
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => handleInteraction(post._id, 'share')}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    SHARE
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInteraction(post._id, 'bookmark')}
                  disabled={interactingPost === post._id}
                  className={`h-10 w-10 rounded-xl transition-all ${post.userInteractions.isBookmarked ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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
