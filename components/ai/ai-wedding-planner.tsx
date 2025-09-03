'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Sparkles, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign,
  Heart,
  Camera,
  Music,
  Utensils,
  Palette,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WeddingContext {
  budget: number;
  guestCount: number;
  location: string;
  date: string;
  style: string;
  preferences: string[];
  specialRequirements: string[];
}

interface AISearchResult {
  venues: any[];
  vendors: any[];
  recommendations: string[];
  budgetBreakdown: {
    venue: number;
    catering: number;
    photography: number;
    decoration: number;
    music: number;
    other: number;
  };
  timeline: {
    months: number;
    milestones: Array<{
      month: number;
      task: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  culturalInsights: string[];
  localTips: string[];
}

export function AIWeddingPlanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<WeddingContext>({
    budget: 1000000,
    guestCount: 150,
    location: 'Colombo',
    date: '2024-12-15',
    style: 'Traditional Sri Lankan',
    preferences: [],
    specialRequirements: []
  });

  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a wedding planning query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-search-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate wedding plan');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setQuery('Plan a traditional Sri Lankan wedding in Colombo for 150 guests with a budget of 1 million LKR');
    setContext({
      budget: 1000000,
      guestCount: 150,
      location: 'Colombo',
      date: '2024-12-15',
      style: 'Traditional Sri Lankan',
      preferences: ['Outdoor ceremony', 'Traditional music', 'Local cuisine'],
      specialRequirements: ['Wheelchair accessible', 'Pet friendly']
    });
    
    // Auto-trigger search after setting demo data
    setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-pink-600" />
          <h1 className="text-4xl font-bold">AI Wedding Planner</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get personalized wedding planning recommendations powered by AI. 
          Tell us about your dream wedding and we'll create a complete plan for you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
          <CardDescription>
            Provide details about your wedding to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="budget">Budget (LKR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={context.budget}
                  onChange={(e) => setContext(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  placeholder="1000000"
                />
              </div>
              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={context.guestCount}
                  onChange={(e) => setContext(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                  placeholder="150"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={context.location}
                  onChange={(e) => setContext(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Colombo"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Wedding Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={context.date}
                  onChange={(e) => setContext(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="style">Wedding Style</Label>
                <Input
                  id="style"
                  value={context.style}
                  onChange={(e) => setContext(prev => ({ ...prev, style: e.target.value }))}
                  placeholder="Traditional Sri Lankan"
                />
              </div>
              <div>
                <Label htmlFor="preferences">Preferences (comma-separated)</Label>
                <Input
                  id="preferences"
                  value={context.preferences.join(', ')}
                  onChange={(e) => setContext(prev => ({ 
                    ...prev, 
                    preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                  }))}
                  placeholder="Outdoor ceremony, Traditional music"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="query">Wedding Planning Query</Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your dream wedding and what you need help with..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSearch} disabled={loading} size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating Plan...' : 'Generate Wedding Plan'}
            </Button>
            <Button onClick={handleDemo} variant="outline" size="lg">
              Try Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Your AI-Generated Wedding Plan</h2>
            <p className="text-muted-foreground">Personalized recommendations for your special day</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Cultural Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.culturalInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="venues" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.venues.map((venue, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <CardDescription>{venue.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Capacity: {venue.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">LKR {venue.priceRange?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">Rating: {venue.rating}/5</span>
                        </div>
                        {venue.aiReason && (
                          <Badge variant="outline" className="text-xs">
                            {venue.aiReason}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.vendors.map((vendor, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription>{vendor.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{vendor.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">Rating: {vendor.rating}/5</span>
                        </div>
                        {vendor.aiReason && (
                          <Badge variant="outline" className="text-xs">
                            {vendor.aiReason}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Budget Breakdown
                  </CardTitle>
                  <CardDescription>
                    Total Budget: LKR {context.budget.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Venue</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.venue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        <span>Catering</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.catering.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Photography</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.photography.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span>Decoration</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.decoration.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span>Music</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.music.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Other</span>
                      </div>
                      <span className="font-medium">LKR {result.budgetBreakdown.other.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Wedding Timeline
                  </CardTitle>
                  <CardDescription>
                    {result.timeline.months} months until your wedding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.timeline.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(milestone.priority)}
                          <Badge variant={getPriorityColor(milestone.priority)}>
                            Month {milestone.month}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{milestone.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Local Tips & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Local Tips</h4>
                      <ul className="space-y-2">
                        {result.localTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
