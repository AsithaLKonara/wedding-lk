'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Cookie, 
  Settings, 
  Check, 
  X, 
  Shield, 
  BarChart3, 
  Users,
  Eye,
  Lock
} from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onReject?: () => void;
  onCustomize?: (preferences: CookiePreferences) => void;
}

export function CookieConsent({ onAccept, onReject, onCustomize }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('weddinglk-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    localStorage.setItem('weddinglk-cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('weddinglk-cookie-preferences', JSON.stringify(allAccepted));
    
    setIsVisible(false);
    onAccept?.(allAccepted);
    
    // Initialize analytics and other services
    initializeServices(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    localStorage.setItem('weddinglk-cookie-consent', JSON.stringify(onlyNecessary));
    localStorage.setItem('weddinglk-cookie-preferences', JSON.stringify(onlyNecessary));
    
    setIsVisible(false);
    onReject?.();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('weddinglk-cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('weddinglk-cookie-preferences', JSON.stringify(preferences));
    
    setIsVisible(false);
    onCustomize?.(preferences);
    
    // Initialize services based on preferences
    initializeServices(preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't change necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const initializeServices = (prefs: CookiePreferences) => {
    // Initialize Google Analytics if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined') {
      // Google Analytics initialization
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    }

    // Initialize marketing tools if marketing is enabled
    if (prefs.marketing && typeof window !== 'undefined') {
      // Facebook Pixel, Google Ads, etc.
      console.log('Marketing cookies enabled');
    }

    // Initialize personalization if enabled
    if (prefs.personalization && typeof window !== 'undefined') {
      // User preferences, recommendations, etc.
      console.log('Personalization cookies enabled');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-amber-600" />
            <CardTitle>Cookie Preferences</CardTitle>
          </div>
          <CardDescription>
            We use cookies to enhance your experience on WeddingLK. Choose your preferences below.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showDetails ? (
            // Simple consent view
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Your Privacy Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to provide you with the best wedding planning experience. 
                    You can customize your preferences or accept all cookies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAcceptAll} 
                  className="flex-1"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept All Cookies
                </Button>
                <Button 
                  onClick={handleRejectAll} 
                  variant="outline" 
                  className="flex-1"
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject All
                </Button>
                <Button 
                  onClick={() => setShowDetails(true)} 
                  variant="secondary" 
                  className="flex-1"
                  size="lg"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
            </div>
          ) : (
            // Detailed preferences view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              {/* Necessary Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Necessary Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Essential for the website to function properly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Always Active</Badge>
                    <Switch checked={true} disabled />
                  </div>
                </div>
                <div className="ml-8 text-sm text-muted-foreground">
                  <p>These cookies are required for basic website functionality, security, and user authentication.</p>
                </div>
              </div>

              <Separator />

              {/* Analytics Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how you use our website
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                  />
                </div>
                <div className="ml-8 text-sm text-muted-foreground">
                  <p>We use Google Analytics to track website usage and improve our services. No personal data is collected.</p>
                </div>
              </div>

              <Separator />

              {/* Marketing Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Used to deliver relevant advertisements
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
                  />
                </div>
                <div className="ml-8 text-sm text-muted-foreground">
                  <p>These cookies help us show you relevant wedding-related content and advertisements.</p>
                </div>
              </div>

              <Separator />

              {/* Personalization Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Personalization Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Remember your preferences and settings
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.personalization}
                    onCheckedChange={(checked) => handlePreferenceChange('personalization', checked)}
                  />
                </div>
                <div className="ml-8 text-sm text-muted-foreground">
                  <p>These cookies remember your preferences to provide a personalized experience.</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSavePreferences} 
                  className="flex-1"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
                <Button 
                  onClick={handleAcceptAll} 
                  variant="outline" 
                  className="flex-1"
                  size="lg"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>
              By using WeddingLK, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to get cookie preferences
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('weddinglk-cookie-preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  return preferences;
}

// Hook to check if user has given consent
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('weddinglk-cookie-consent');
    setHasConsent(!!consent);
  }, []);

  return hasConsent;
}

// Global type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
