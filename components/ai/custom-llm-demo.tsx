'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FaSpinner, 
  FaRobot, 
  FaLightbulb, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaDollarSign,
  FaHeart,
  FaCheckCircle
} from 'react-icons/fa';

interface CustomLLMResponse {
  response: string;
  confidence: number;
  culturalContext?: string;
  localInsights?: string[];
  costEstimate?: {
    min: number;
    max: number;
    currency: string;
  };
  recommendations?: {
    venues?: any[];
    vendors?: any[];
    timeline?: any[];
  };
}

export default function CustomLLMDemo() {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState({
    tradition: 'kandyan',
    location: 'Colombo',
    budget: 1500000,
    guestCount: 150,
    eventDate: '2024-12-15'
  });
  const [queryType, setQueryType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CustomLLMResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/custom-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context,
          type: queryType
        }),
      });

      const result = await res.json();

      if (result.success) {
        setResponse(result.data);
      } else {
        setError(result.error || 'Failed to process query');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuery = (quickQuery: string, type: string) => {
    setQuery(quickQuery);
    setQueryType(type);
  };

  const quickQueries = [
    {
      query: "I need venue recommendations for a Kandyan wedding in Colombo",
      type: "venue-recommendation",
      icon: FaMapMarkerAlt,
      label: "Venue Search"
    },
    {
      query: "Help me find photographers and caterers for my wedding",
      type: "vendor-matching", 
      icon: FaHeart,
      label: "Vendor Matching"
    },
    {
      query: "Optimize my 1.5M LKR budget for 150 guests",
      type: "budget-optimization",
      icon: FaDollarSign,
      label: "Budget Planning"
    },
    {
      query: "What are the traditional customs for Kandyan weddings?",
      type: "cultural-guidance",
      icon: FaLightbulb,
      label: "Cultural Guide"
    },
    {
      query: "Create a timeline for my December 2024 wedding",
      type: "timeline-generation",
      icon: FaCalendarAlt,
      label: "Timeline"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaRobot className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl">WeddingLK Custom LLM Demo</CardTitle>
          </div>
          <CardDescription>
            Experience our specialized AI trained specifically for Sri Lankan wedding planning
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
          <CardDescription>
            Try these sample queries to see the custom LLM in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickQueries.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => handleQuickQuery(item.query, item.type)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {item.query}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Query Form */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Query</CardTitle>
          <CardDescription>
            Ask any wedding planning question with cultural and local context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tradition">Wedding Tradition</Label>
                <Select 
                  value={context.tradition} 
                  onValueChange={(value) => setContext({...context, tradition: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kandyan">Kandyan</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={context.location} 
                  onValueChange={(value) => setContext({...context, location: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Negombo">Negombo</SelectItem>
                    <SelectItem value="Bentota">Bentota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Budget (LKR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={context.budget}
                  onChange={(e) => setContext({...context, budget: parseInt(e.target.value)})}
                  placeholder="1500000"
                />
              </div>

              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={context.guestCount}
                  onChange={(e) => setContext({...context, guestCount: parseInt(e.target.value)})}
                  placeholder="150"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="query">Your Question</Label>
              <Textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about venues, vendors, budget, traditions, timeline, or any wedding planning question..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="queryType">Query Type</Label>
              <Select value={queryType} onValueChange={setQueryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Question</SelectItem>
                  <SelectItem value="venue-recommendation">Venue Recommendation</SelectItem>
                  <SelectItem value="vendor-matching">Vendor Matching</SelectItem>
                  <SelectItem value="budget-optimization">Budget Optimization</SelectItem>
                  <SelectItem value="cultural-guidance">Cultural Guidance</SelectItem>
                  <SelectItem value="timeline-generation">Timeline Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing with Custom LLM...
                </>
              ) : (
                <>
                  <FaRobot className="mr-2 h-4 w-4" />
                  Ask WeddingLK AI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaCheckCircle className="h-5 w-5 text-green-600" />
                AI Response
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  Confidence: {Math.round(response.confidence * 100)}%
                </Badge>
                {response.culturalContext && (
                  <Badge variant="outline">
                    {response.culturalContext} Tradition
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{response.response}</p>
            </div>

            {response.localInsights && response.localInsights.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FaLightbulb className="h-4 w-4" />
                  Local Insights
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {response.localInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.costEstimate && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FaDollarSign className="h-4 w-4" />
                  Cost Estimate
                </h4>
                <p className="text-sm">
                  {response.costEstimate.currency} {response.costEstimate.min.toLocaleString()} - {response.costEstimate.max.toLocaleString()}
                </p>
              </div>
            )}

            {response.recommendations && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                {response.recommendations.venues && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Venues: {response.recommendations.venues.length} found</p>
                  </div>
                )}
                {response.recommendations.vendors && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Vendors: {response.recommendations.vendors.length} found</p>
                  </div>
                )}
                {response.recommendations.timeline && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Timeline: {response.recommendations.timeline.length} milestones</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Custom LLM Features</CardTitle>
          <CardDescription>
            What makes our AI special for Sri Lankan wedding planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Cultural Expertise</h4>
              <p className="text-sm text-muted-foreground">
                Deep understanding of Kandyan, Tamil, Muslim, and Christian wedding traditions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Local Knowledge</h4>
              <p className="text-sm text-muted-foreground">
                Sri Lankan venue networks, vendor relationships, and pricing intelligence
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Seasonal Awareness</h4>
              <p className="text-sm text-muted-foreground">
                Monsoon patterns, festival seasons, and weather-based planning advice
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Budget Optimization</h4>
              <p className="text-sm text-muted-foreground">
                LKR-based pricing, local market rates, and cost-saving strategies
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Real-time Data</h4>
              <p className="text-sm text-muted-foreground">
                Live venue availability, vendor schedules, and current pricing
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Personalized Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                Tailored suggestions based on your specific requirements and preferences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
