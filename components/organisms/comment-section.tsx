'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Reply, 
  MoreHorizontal,
  Send,
  Flag,
  Trash2
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
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({ postId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
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

    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          authorId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        
        toast({
          title: "Comment posted",
          description: "Your comment has been added",
        });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          authorId: 'current-user-id', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setComments(prev => 
          prev.map(comment => 
            comment._id === parentCommentId
              ? { ...comment, replies: [...comment.replies, data.data] }
              : comment
          )
        );
        
        setReplyContent('');
        setReplyingTo(null);
        
        toast({
          title: "Reply posted",
          description: "Your reply has been added",
        });
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/like`, {
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
        
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId
              ? { ...comment, likes: data.data.likes, isLiked: data.data.isLiked }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        
        toast({
          title: "Comment deleted",
          description: "Your comment has been deleted",
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col border border-border shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <h3 className="text-xl font-bold">Comments</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-rose-500 hover:text-white transition-colors">
            <span className="text-2xl">×</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No comments yet</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="space-y-4">
                {/* Main Comment */}
                <div className="flex space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-muted text-xs font-bold">{getInitials(comment.author.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm">{comment.author.name}</span>
                        {comment.author.verified && (
                          <Badge className="bg-blue-500 text-white text-[10px] h-4 px-1.5 border-none">
                            Verified
                          </Badge>
                        )}
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                          <DropdownMenuItem 
                            className="text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-medium">
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                    
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`group flex items-center space-x-1.5 text-xs font-bold transition-colors ${comment.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                      >
                        <Heart className={`h-4 w-4 transition-transform group-active:scale-125 ${
                          comment.isLiked ? 'fill-current' : ''
                        }`} />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="flex items-center space-x-1.5 text-xs font-bold text-muted-foreground hover:text-purple-500 transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/50"
                      >
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px] text-sm bg-transparent border-none focus-visible:ring-0 resize-none p-0"
                        />
                        <div className="flex justify-end space-x-2 pt-2 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full font-bold h-9 px-4"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-9 px-6"
                            onClick={() => handleSubmitReply(comment._id)}
                            disabled={submitting || !replyContent.trim()}
                          >
                            {submitting ? 'Posting...' : 'Reply'}
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-4 mt-4 space-y-4 border-l-2 border-border/30 pl-6">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="flex space-x-3">
                            <Avatar className="h-8 w-8 border border-background shadow-sm">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback className="bg-muted text-[10px] font-bold">{getInitials(reply.author.name)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-xs">{reply.author.name}</span>
                                {reply.author.verified && (
                                  <Badge className="bg-blue-500 text-white text-[8px] h-3.5 px-1 border-none">
                                    V
                                  </Badge>
                                )}
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-foreground/80 leading-relaxed">{reply.content}</p>
                              
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleLikeComment(reply._id)}
                                  className={`group flex items-center space-x-1.5 text-[10px] font-bold transition-colors ${reply.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                                >
                                  <Heart className={`h-3 w-3 ${
                                    reply.isLiked ? 'fill-current' : ''
                                  }`} />
                                  <span>{reply.likes}</span>
                                </button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="text-muted-foreground hover:text-foreground">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                                    <DropdownMenuItem 
                                      className="text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
                                      onClick={() => handleDeleteComment(reply._id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="font-medium text-xs">
                                      <Flag className="h-3 w-3 mr-2" />
                                      Report
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-6 border-t border-border/50 bg-muted/20">
          <div className="flex space-x-4">
            <Avatar className="h-10 w-10 border-2 border-background shadow-md flex-shrink-0">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-muted font-bold text-xs">YOU</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] bg-card border-border/50 focus-visible:ring-rose-500/20 rounded-2xl resize-none p-4 text-sm font-medium"
              />
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold h-12 px-10 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


