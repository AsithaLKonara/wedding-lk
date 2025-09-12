'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  FileText,
  DollarSign,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Dispute {
  _id: string;
  type: 'booking' | 'payment' | 'service' | 'refund' | 'other';
  status: 'open' | 'in_review' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  complainant: {
    id: string;
    name: string;
    email: string;
    type: 'user' | 'vendor';
  };
  respondent: {
    id: string;
    name: string;
    email: string;
    type: 'user' | 'vendor';
  };
  booking?: {
    id: string;
    serviceName: string;
    date: string;
    amount: number;
  };
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  evidence: Array<{
    id: string;
    type: 'image' | 'document' | 'message' | 'booking';
    url: string;
    description: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  resolution?: {
    decision: 'refund' | 'partial_refund' | 'no_action' | 'service_credit';
    amount?: number;
    reason: string;
    resolvedBy: string;
    resolvedAt: string;
  };
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isInternal: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface DisputeManagementProps {
  userRole: 'admin' | 'vendor' | 'user';
  onDisputeUpdate?: (dispute: Dispute) => void;
}

export function DisputeManagement({ userRole, onDisputeUpdate }: DisputeManagementProps) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [resolution, setResolution] = useState({
    decision: '',
    amount: '',
    reason: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDisputes();
  }, [filterStatus, filterType, searchQuery]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filterStatus,
        type: filterType,
        search: searchQuery,
        role: userRole,
      });
      
      const response = await fetch(`/api/disputes?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setDisputes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast({
        title: "Error",
        description: "Failed to load disputes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (disputeId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        setDisputes(prev => 
          prev.map(dispute => 
            dispute._id === disputeId 
              ? { ...dispute, status: newStatus as any }
              : dispute
          )
        );
        
        toast({
          title: "Status updated",
          description: `Dispute status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating dispute status:', error);
      toast({
        title: "Error",
        description: "Failed to update dispute status",
        variant: "destructive"
      });
    }
  };

  const handleAddMessage = async (disputeId: string) => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          isInternal: userRole === 'admin',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMsg = data.data;
        
        setDisputes(prev => 
          prev.map(dispute => 
            dispute._id === disputeId 
              ? { ...dispute, messages: [...dispute.messages, newMsg] }
              : dispute
          )
        );
        
        setNewMessage('');
        
        toast({
          title: "Message added",
          description: "Your message has been added to the dispute",
        });
      }
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive"
      });
    }
  };

  const handleResolveDispute = async (disputeId: string) => {
    if (!resolution.decision || !resolution.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision: resolution.decision,
          amount: resolution.amount ? parseFloat(resolution.amount) : undefined,
          reason: resolution.reason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedDispute = data.data;
        
        setDisputes(prev => 
          prev.map(dispute => 
            dispute._id === disputeId ? updatedDispute : dispute
          )
        );
        
        setResolution({ decision: '', amount: '', reason: '' });
        setSelectedDispute(null);
        
        toast({
          title: "Dispute resolved",
          description: "The dispute has been resolved successfully",
        });
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      toast({
        title: "Error",
        description: "Failed to resolve dispute",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'in_review': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'escalated': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dispute Management</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            <div>
              <Label htmlFor="type-filter">Type</Label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="service">Service</option>
                <option value="refund">Refund</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search disputes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchDisputes} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-600 mb-2">No disputes found</p>
              <p className="text-sm text-gray-500">Disputes will appear here when reported</p>
            </CardContent>
          </Card>
        ) : (
          disputes.map((dispute) => (
            <Card key={dispute._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div>
                        <h3 className="font-semibold">{dispute.title}</h3>
                        <p className="text-sm text-gray-600">
                          {dispute.complainant.name} vs {dispute.respondent.name}
                        </p>
                      </div>
                      <Badge className={getStatusColor(dispute.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(dispute.status)}
                          <span className="capitalize">{dispute.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                      <Badge className={getPriorityColor(dispute.priority)}>
                        {dispute.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {dispute.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Type</p>
                        <p className="capitalize">{dispute.type}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Amount</p>
                        <p>
                          {dispute.booking ? `$${dispute.booking.amount}` : 
                           dispute.payment ? `${dispute.payment.currency} ${dispute.payment.amount}` : 
                           'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Created</p>
                        <p>{formatDate(dispute.createdAt)}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Messages</p>
                        <p>{dispute.messages.length} messages</p>
                      </div>
                    </div>

                    {dispute.resolution && (
                      <div className="mt-3 p-3 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-800">Resolution</p>
                        <p className="text-sm text-green-700">
                          {dispute.resolution.decision.replace('_', ' ')} - {dispute.resolution.reason}
                        </p>
                        {dispute.resolution.amount && (
                          <p className="text-sm text-green-700">
                            Amount: ${dispute.resolution.amount}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    
                    {userRole === 'admin' && dispute.status !== 'resolved' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(dispute._id, 'in_review')}
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(dispute._id, 'escalated')}
                        >
                          Escalate
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <Card className="fixed inset-4 z-50 overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedDispute.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDispute(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Dispute Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Complainant</h4>
                <p>{selectedDispute.complainant.name} ({selectedDispute.complainant.email})</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Respondent</h4>
                <p>{selectedDispute.respondent.name} ({selectedDispute.respondent.email})</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{selectedDispute.description}</p>
            </div>

            {/* Evidence */}
            {selectedDispute.evidence.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Evidence</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedDispute.evidence.map((item) => (
                    <div key={item.id} className="border rounded p-2">
                      <p className="text-xs font-medium">{item.type}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div>
              <h4 className="font-medium mb-2">Messages</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedDispute.messages.map((message) => (
                  <div key={message.id} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Message */}
            <div>
              <h4 className="font-medium mb-2">Add Message</h4>
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleAddMessage(selectedDispute._id)}>
                  Send
                </Button>
              </div>
            </div>

            {/* Resolution (Admin only) */}
            {userRole === 'admin' && selectedDispute.status !== 'resolved' && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Resolve Dispute</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="decision">Decision</Label>
                    <select
                      id="decision"
                      value={resolution.decision}
                      onChange={(e) => setResolution(prev => ({ ...prev, decision: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select decision</option>
                      <option value="refund">Full Refund</option>
                      <option value="partial_refund">Partial Refund</option>
                      <option value="no_action">No Action</option>
                      <option value="service_credit">Service Credit</option>
                    </select>
                  </div>

                  {(resolution.decision === 'refund' || resolution.decision === 'partial_refund') && (
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={resolution.amount}
                        onChange={(e) => setResolution(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={resolution.reason}
                      onChange={(e) => setResolution(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Explain your decision..."
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={() => handleResolveDispute(selectedDispute._id)}>
                    Resolve Dispute
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


