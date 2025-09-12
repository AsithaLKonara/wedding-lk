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
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PostCreationModal } from './post-creation-modal';
import { CommentSection } from './comment-section';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  _id: string;
  content: string;
  images: string[];
  tags: string[];
  author: {
    type: string;
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  location?: {
    city?: string;
    venue?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  userInteractions: {
    isLiked: boolean;
    isBookmarked: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface FeedPostsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FeedPosts({ activeFilter, onFilterChange }: FeedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [interactingPost, setInteractingPost] = useState<string | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?filter=${activeFilter}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || []);
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

  const handleInteraction = async (postId: string, action: string) => {
    if (interactingPost) return;
    
    setInteractingPost(postId);
    
    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  engagement: data.data.engagement,
                  userInteractions: data.data.userInteractions
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

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        toast({
          title: "Post deleted",
          description: "Your post has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
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
      {/* Create Post Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              className="flex-1 justify-start text-gray-500"
              onClick={() => setIsCreatingPost(true)}
            >
              What's on your mind?
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <Button onClick={() => setIsCreatingPost(true)}>
              Create First Post
            </Button>
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
                      {post.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                      {post.location?.city && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {post.location.city}
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
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeletePost(post._id)}
                    >
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

              {/* Images */}
              {post.images.length > 0 && (
                <div className={`grid gap-2 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' :
                  post.images.length === 3 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {post.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {post.images.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white text-lg font-semibold">
                            +{post.images.length - 4} more
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
                  <span>{post.engagement.likes} likes</span>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInteraction(post._id, 'like')}
                    disabled={interactingPost === post._id}
                    className={post.userInteractions.isLiked ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 mr-1 ${
                      post.userInteractions.isLiked ? 'fill-current' : ''
                    }`} />
                    Like
                  </Button>
                  
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

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isCreatingPost}
        onClose={() => setIsCreatingPost(false)}
        onPostCreated={handlePostCreated}
        authorType="user" // TODO: Get from auth context
        authorId="current-user-id" // TODO: Get from auth context
      />

      {/* Comment Section */}
      <CommentSection
        postId={commentPostId || ''}
        isOpen={!!commentPostId}
        onClose={() => setCommentPostId(null)}
      />
    </div>
  );
}