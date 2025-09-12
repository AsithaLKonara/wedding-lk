'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PostCreationModal } from '@/components/organisms/post-creation-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
    avgEngagement: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?vendor=true');
      
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/posts/stats?vendor=true');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        fetchStats(); // Refresh stats
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
    fetchStats(); // Refresh stats
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-gray-600">Manage your social media posts and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
          <Button onClick={() => setIsCreatingPost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEngagement.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Edit3 className="h-12 w-12 mx-auto mb-2" />
              <p>No posts yet</p>
              <p className="text-sm">Start sharing your work with potential clients!</p>
            </div>
            <Button onClick={() => setIsCreatingPost(true)}>
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Post Content */}
                {post.content && (
                  <p className="text-gray-900 text-sm line-clamp-3">{post.content}</p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="relative">
                    <img
                      src={post.images[0]}
                      alt="Post image"
                      className="w-full h-48 object-cover rounded"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        +{post.images.length - 1} more
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.engagement.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.engagement.comments}
                    </span>
                    <span className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      {post.engagement.shares}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.engagement.views}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Posts Table</CardTitle>
            <CardDescription>Detailed view of all your posts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {post.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ))}
                        {post.images.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{post.images.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-3 w-3" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3 w-3" />
                          <span>{post.engagement.views}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'active' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatTimeAgo(post.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isCreatingPost}
        onClose={() => setIsCreatingPost(false)}
        onPostCreated={handlePostCreated}
        authorType="vendor"
        authorId="current-vendor-id" // TODO: Get from auth context
      />
    </div>
  );
}


