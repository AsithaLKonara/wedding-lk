'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerified: boolean;
  helpful: number;
  notHelpful: number;
  replies: ReviewReply[];
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userRole: 'vendor' | 'admin' | 'user';
  message: string;
  createdAt: string;
  isOfficial: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewReplyPage() {
  const { data: session } = useSession() || {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    hasReplies: 'all',
    rating: 'all'
  });
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (session) {
      loadReviews();
    }
  }, [session]);

  const loadReviews = () => {
    // Mock data - in real app, fetch from API
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: '/api/placeholder/40/40',
        vendorId: 'vendor1',
        vendorName: 'Elegant Venues',
        rating: 5,
        title: 'Absolutely Perfect!',
        comment: 'The venue was absolutely stunning and the staff was incredibly helpful throughout the entire process. Our wedding day was magical thanks to them.',
        createdAt: '2024-01-15T10:30:00Z',
        isVerified: true,
        helpful: 12,
        notHelpful: 1,
        status: 'approved',
        replies: [
          {
            id: 'reply1',
            reviewId: '1',
            userId: 'vendor1',
            userName: 'Elegant Venues',
            userRole: 'vendor',
            message: 'Thank you so much for your kind words, Sarah! We were thrilled to be part of your special day. Congratulations again!',
            createdAt: '2024-01-15T14:20:00Z',
            isOfficial: true,
            status: 'approved'
          }
        ]
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: '/api/placeholder/40/40',
        vendorId: 'vendor2',
        vendorName: 'Dream Photography',
        rating: 4,
        title: 'Great Photos, Minor Issues',
        comment: 'The photos turned out beautiful, but there were some delays in delivery. Overall happy with the results though.',
        createdAt: '2024-01-14T16:45:00Z',
        isVerified: true,
        helpful: 8,
        notHelpful: 2,
        status: 'approved',
        replies: [
          {
            id: 'reply2',
            reviewId: '2',
            userId: 'vendor2',
            userName: 'Dream Photography',
            userRole: 'vendor',
            message: 'Hi Mike, thank you for the feedback. We apologize for the delivery delays - we\'ve implemented new processes to ensure faster turnaround times. We\'re glad you love the photos!',
            createdAt: '2024-01-14T18:30:00Z',
            isOfficial: true,
            status: 'approved'
          }
        ]
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Emily Davis',
        userAvatar: '/api/placeholder/40/40',
        vendorId: 'vendor3',
        vendorName: 'Gourmet Catering',
        rating: 2,
        title: 'Disappointed with Service',
        comment: 'The food was cold when it arrived and the service was slow. Not what we expected for the price we paid.',
        createdAt: '2024-01-13T12:15:00Z',
        isVerified: true,
        helpful: 5,
        notHelpful: 3,
        status: 'approved',
        replies: []
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'David Wilson',
        userAvatar: '/api/placeholder/40/40',
        vendorId: 'vendor1',
        vendorName: 'Elegant Venues',
        rating: 5,
        title: 'Outstanding Experience',
        comment: 'From start to finish, everything was perfect. The venue coordinator was amazing and made sure everything went smoothly.',
        createdAt: '2024-01-12T09:20:00Z',
        isVerified: true,
        helpful: 15,
        notHelpful: 0,
        status: 'approved',
        replies: []
      }
    ];
    
    setReviews(mockReviews);
  };

  const filteredReviews = reviews.filter(review => {
    if (filter.status !== 'all' && review.status !== filter.status) return false;
    if (filter.hasReplies === 'true' && review.replies.length === 0) return false;
    if (filter.hasReplies === 'false' && review.replies.length > 0) return false;
    if (filter.rating !== 'all') {
      const minRating = parseInt(filter.rating);
      if (review.rating < minRating) return false;
    }
    return true;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'helpful':
        aValue = a.helpful;
        bValue = b.helpful;
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

  const submitReply = async () => {
    if (!selectedReview || !replyText.trim()) return;

    const newReply: ReviewReply = {
      id: Date.now().toString(),
      reviewId: selectedReview.id,
      userId: session?.user?.id || '',
      userName: session?.user?.name || 'You',
      userRole: 'vendor', // In real app, determine based on user role
      message: replyText.trim(),
      createdAt: new Date().toISOString(),
      isOfficial: true,
      status: 'pending'
    };

    setReviews(reviews.map(review => 
      review.id === selectedReview.id 
        ? { ...review, replies: [...review.replies, newReply] }
        : review
    ));

    setReplyText('');
    setSelectedReview(null);
    
    toast({
      title: 'Reply Submitted',
      description: 'Your reply has been submitted for review.',
    });
  };

  const markReplyAsHelpful = (reviewId: string, replyId: string) => {
    // In real app, this would update the database
    toast({
      title: 'Thank you!',
      description: 'Your feedback has been recorded.',
    });
  };

  const reportReply = (replyId: string) => {
    // In real app, this would create a report
    toast({
      title: 'Report Submitted',
      description: 'The reply has been reported for review.',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="mt-2 text-gray-600">Respond to customer reviews and manage feedback</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="ml-2 p-2 border rounded-md text-sm"
                >
                  <option value="all">All Reviews</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Replies</label>
                <select
                  value={filter.hasReplies}
                  onChange={(e) => setFilter({ ...filter, hasReplies: e.target.value })}
                  className="ml-2 p-2 border rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="true">With Replies</option>
                  <option value="false">Without Replies</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <select
                  value={filter.rating}
                  onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
                  className="ml-2 p-2 border rounded-md text-sm"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="ml-2 p-2 border rounded-md text-sm"
                >
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.userAvatar || '/api/placeholder/40/40'}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                        {review.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        <Badge className={getStatusColor(review.status)}>
                          {getStatusIcon(review.status)}
                          <span className="ml-1">{review.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-gray-500">
                      <div>{review.helpful} helpful</div>
                      <div>{review.notHelpful} not helpful</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                {/* Replies */}
                {review.replies.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-3">Replies ({review.replies.length})</h5>
                    <div className="space-y-3">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{reply.userName}</span>
                              <Badge variant="outline" className="text-xs">
                                {reply.userRole}
                              </Badge>
                              {reply.isOfficial && (
                                <Badge variant="secondary" className="text-xs">
                                  Official
                                </Badge>
                              )}
                              <Badge className={getStatusColor(reply.status)}>
                                {getStatusIcon(reply.status)}
                                <span className="ml-1">{reply.status}</span>
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markReplyAsHelpful(review.id, reply.id)}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reportReply(reply.id)}
                              >
                                <Flag className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-2">{reply.message}</p>
                          
                          <div className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Reply to Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{selectedReview.userName}</span>
                    {renderStars(selectedReview.rating)}
                  </div>
                  <h4 className="font-medium mb-1">{selectedReview.title}</h4>
                  <p className="text-sm text-gray-700">{selectedReview.comment}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Your Reply</label>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply here..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedReview(null);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitReply}
                    disabled={!replyText.trim()}
                  >
                    Submit Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more reviews.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
