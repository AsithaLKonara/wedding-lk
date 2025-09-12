'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Eye, Play, Pause, DollarSign, Target, TrendingUp, Calendar, Users, BarChart3 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'featured' | 'sponsored' | 'premium';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  duration: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  createdAt: string;
  updatedAt: string;
}

export default function VendorBoostCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: 'featured' | 'premium' | 'sponsored';
    budget: number;
    duration: number;
    startDate: string;
    endDate: string;
    targetAudience: string;
  }>({
    name: '',
    description: '',
    type: 'featured',
    budget: 0,
    duration: 30,
    startDate: '',
    endDate: '',
    targetAudience: ''
  });

  const campaignTypes = [
    { value: 'featured', label: 'Featured Listing', description: 'Highlight your service in search results' },
    { value: 'sponsored', label: 'Sponsored Content', description: 'Promote your service in targeted placements' },
    { value: 'premium', label: 'Premium Placement', description: 'Top-tier visibility and priority placement' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Summer Wedding Photography Boost',
          description: 'Promote photography services for summer wedding season',
          type: 'featured',
          status: 'active',
          budget: 500,
          spent: 125,
          duration: 30,
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          targetAudience: 'Couples planning summer weddings',
          impressions: 15420,
          clicks: 234,
          conversions: 12,
          ctr: 1.52,
          cpc: 0.53,
          createdAt: '2024-05-25',
          updatedAt: '2024-06-15'
        },
        {
          id: '2',
          name: 'Catering Services Sponsored Campaign',
          description: 'Targeted promotion for catering services',
          type: 'sponsored',
          status: 'paused',
          budget: 300,
          spent: 180,
          duration: 14,
          startDate: '2024-06-10',
          endDate: '2024-06-24',
          targetAudience: 'Event planners and couples',
          impressions: 8750,
          clicks: 156,
          conversions: 8,
          ctr: 1.78,
          cpc: 1.15,
          createdAt: '2024-06-05',
          updatedAt: '2024-06-18'
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        // Update existing campaign
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === editingCampaign.id 
            ? { 
                ...campaign, 
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : campaign
        ));
      } else {
        // Create new campaign
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...formData,
          status: 'draft',
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setCampaigns(prev => [...prev, newCampaign]);
      }
      
      setIsDialogOpen(false);
      setEditingCampaign(null);
      setFormData({
        name: '',
        description: '',
        type: 'featured',
        budget: 0,
        duration: 30,
        startDate: '',
        endDate: '',
        targetAudience: ''
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      budget: campaign.budget,
      duration: campaign.duration,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    }
  };

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
        : campaign
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedCampaigns.length === 0) return;
    
    switch (action) {
      case 'activate':
        selectedCampaigns.forEach(id => handleStatusChange(id, 'active'));
        break;
      case 'pause':
        selectedCampaigns.forEach(id => handleStatusChange(id, 'paused'));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedCampaigns.length} campaigns?`)) {
          setCampaigns(prev => prev.filter(campaign => !selectedCampaigns.includes(campaign.id)));
        }
        break;
    }
    setSelectedCampaigns([]);
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'featured': return 'bg-blue-100 text-blue-800';
      case 'sponsored': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const statusMatch = filterStatus === 'all' || campaign.status === filterStatus;
    const typeMatch = filterType === 'all' || campaign.type === filterType;
    const searchMatch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  const getCampaignStats = () => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
    const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    
    return { total, active, totalBudget, totalSpent, totalImpressions, totalClicks, totalConversions };
  };

  const stats = getCampaignStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boost Campaigns</h1>
          <p className="text-gray-600">Promote your services and increase visibility</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCampaign(null);
              setFormData({
                name: '',
                description: '',
                type: 'featured',
                budget: 0,
                duration: 30,
                startDate: '',
                endDate: '',
                targetAudience: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'Update your campaign details' : 'Create a new boost campaign to promote your services'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'featured' | 'sponsored' | 'premium') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Describe your target audience"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">{stats.totalConversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Directory</CardTitle>
          <CardDescription>Manage your boost campaigns and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCampaigns.length === filteredCampaigns.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCampaigns(filteredCampaigns.map(c => c.id));
                      } else {
                        setSelectedCampaigns([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCampaigns(prev => [...prev, campaign.id]);
                        } else {
                          setSelectedCampaigns(prev => prev.filter(id => id !== campaign.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{campaign.targetAudience}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(campaign.type)}>
                      {campaignTypes.find(t => t.value === campaign.type)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {statuses.find(s => s.value === campaign.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-medium">{campaign.spent.toLocaleString()}</span>
                        <span className="text-gray-500">/ {campaign.budget.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(campaign.spent / campaign.budget) * 100} 
                        className="h-2 mt-1" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Eye className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{campaign.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Target className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{campaign.clicks} clicks</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{campaign.conversions} conversions</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">{campaign.duration} days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {campaign.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, 'paused')}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, 'active')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(campaign.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
