import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  Globe, 
  Smartphone, 
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface SEOAnalysis {
  score: number;
  title: string;
  description: string;
  keywords: string[];
  headings: { level: number; text: string; score: number }[];
  images: { alt: string; score: number }[];
  links: { url: string; text: string; score: number }[];
  performance: {
    pageSpeed: number;
    mobileFriendly: boolean;
    accessibility: number;
  };
  suggestions: string[];
}

interface SEOOptimizerProps {
  url?: string;
  className?: string;
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({ url, className }) => {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || window.location.href);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
    }
  }, [url]);

  const analyzeSEO = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate SEO analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: SEOAnalysis = {
        score: 85,
        title: "WeddingLK - Your Complete Wedding Planning Platform",
        description: "Plan your perfect wedding with WeddingLK. Find vendors, book venues, manage tasks, and create your dream wedding with our comprehensive planning tools.",
        keywords: ["wedding planning", "wedding vendors", "wedding venues", "Sri Lanka", "wedding packages"],
        headings: [
          { level: 1, text: "Welcome to WeddingLK", score: 90 },
          { level: 2, text: "Find Your Perfect Vendors", score: 85 },
          { level: 2, text: "Book Amazing Venues", score: 80 },
          { level: 3, text: "Photography Services", score: 75 },
          { level: 3, text: "Decoration Services", score: 70 }
        ],
        images: [
          { alt: "WeddingLK Logo", score: 95 },
          { alt: "Beautiful wedding venue", score: 90 },
          { alt: "Wedding photography", score: 85 }
        ],
        links: [
          { url: "/vendors", text: "Find Vendors", score: 90 },
          { url: "/venues", text: "Book Venues", score: 85 },
          { url: "/planning", text: "Planning Tools", score: 80 }
        ],
        performance: {
          pageSpeed: 87,
          mobileFriendly: true,
          accessibility: 92
        },
        suggestions: [
          "Add more relevant keywords to meta description",
          "Optimize image alt texts for better accessibility",
          "Improve internal linking structure",
          "Add structured data markup",
          "Optimize for mobile performance"
        ]
      };
      
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  if (!analysis) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>SEO Optimizer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              Analyze your page's SEO performance and get optimization suggestions
            </div>
            <Button onClick={analyzeSEO} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>SEO Analysis</span>
          </div>
          <Badge className={getScoreColor(analysis.score)}>
            {analysis.score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall SEO Score</span>
            <span className="font-medium">{getScoreLabel(analysis.score)}</span>
          </div>
          <Progress value={analysis.score} className="h-3" />
        </div>

        {/* URL Analysis */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Page URL</div>
          <div className="flex items-center space-x-2 p-2 bg-muted rounded text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{currentUrl}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Meta Information</div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Title</div>
            <div className="p-2 bg-muted rounded text-sm">{analysis.title}</div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Good length and includes keywords</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Description</div>
            <div className="p-2 bg-muted rounded text-sm">{analysis.description}</div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Comprehensive and engaging</span>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Target Keywords</div>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Headings Structure */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Headings Structure</div>
          <div className="space-y-2">
            {analysis.headings.map((heading, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono bg-primary text-primary-foreground px-1 rounded">
                    H{heading.level}
                  </span>
                  <span className="text-sm">{heading.text}</span>
                </div>
                <Badge className={getScoreColor(heading.score)}>
                  {heading.score}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Performance Metrics</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.performance.pageSpeed}</div>
              <div className="text-xs text-muted-foreground">Page Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysis.performance.mobileFriendly ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-muted-foreground">Mobile Friendly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.performance.accessibility}</div>
              <div className="text-xs text-muted-foreground">Accessibility</div>
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Optimization Suggestions</div>
          <div className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-800">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setAnalysis(null)} className="flex-1">
            New Analysis
          </Button>
          <Button className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Optimize Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOOptimizer; 