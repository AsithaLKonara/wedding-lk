'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Reply, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Send,
  ThumbsUp,
  ThumbsDown,
  Star,
  Users,
  Calendar,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  _id: string;
  postId: string;
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: {
      _id: string;
      name: string;
      avatar?: string;
      verified: boolean;
    };
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  parentComment?: string;
  replies: Comment[];
  likes: {
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    likedAt: string;
  }[];
  dislikes: {
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    dislikedAt: string;
  }[];
  mentions: {
    user: {
      _id: string;
      name: string;
      username: string;
    };
    username: string;
  }[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  userInteractions: {
    isLiked: boolean;
    isDisliked: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface EnhancedCommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedCommentSection({ postId, isOpen, onClose }: EnhancedCommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          parentComment: replyingTo
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        setReplyingTo(null);
        toast({
          title: "Success",
          description: "Comment posted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to post comment',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => prev.map(comment => 
          comment._id === commentId ? data.comment : comment
        ));
        setEditingComment(null);
        setEditContent('');
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update comment',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete comment',
        variant: "destructive"
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'like'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => prev.map(comment => 
          comment._id === commentId ? data.comment : comment
        ));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'dislike'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => prev.map(comment => 
          comment._id === commentId ? data.comment : comment
        ));
      }
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
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
        return <Star className="h-3 w-3 text-yellow-500" />;
      case 'admin':
        return <Users className="h-3 w-3 text-blue-500" />;
      case 'wedding_planner':
        return <Calendar className="h-3 w-3 text-purple-500" />;
      default:
        return null;
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment._id} className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{getInitials(comment.author?.name || 'Unknown')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author?.name || 'Unknown User'}</span>
            {getAuthorIcon(comment.author.type)}
            {comment.author.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-500">(edited)</span>
            )}
          </div>
          
          {editingComment === comment._id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                placeholder="Edit your comment..."
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateComment(comment._id)}
                  disabled={submitting}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {comment.content}
              </p>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment._id)}
                  className={`text-xs ${comment.userInteractions.isLiked ? 'text-blue-500' : ''}`}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {comment.likes.length}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDislikeComment(comment._id)}
                  className={`text-xs ${comment.userInteractions.isDisliked ? 'text-red-500' : ''}`}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  {comment.dislikes.length}
                </Button>
                
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(comment._id)}
                    className="text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
                
                {(comment.userInteractions.canEdit || comment.userInteractions.canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.userInteractions.canEdit && (
                        <DropdownMenuItem onClick={() => handleEdit(comment)}>
                          <Edit3 className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {comment.userInteractions.canDelete && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Flag className="h-3 w-3 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {replyingTo === comment._id && (
                <div className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                    placeholder={`Reply to ${comment.author?.name || 'Unknown User'}...`}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={submitting}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setNewComment('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comments</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Add new comment */}
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
              placeholder="Write a comment..."
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
          
          {/* Comments list */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2" />
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
