'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  Battery, 
  Bell, 
  Camera,
  MapPin,
  Calendar,
  Heart,
  Star,
  Search,
  Menu,
  Home,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function MobilePWAPage() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: '',
    platform: '',
    isMobile: false,
    isPWA: false
  });

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check device info
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isPWA: window.matchMedia('(display-mode: standalone)').matches
    });

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      toast({
        title: 'Installation Not Available',
        description: 'PWA installation is not available on this device or browser.',
        variant: 'destructive',
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast({
          title: 'PWA Installed!',
          description: 'WeddingLK has been installed on your device.',
        });
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast({
        title: 'Installation Failed',
        description: 'There was an error installing the PWA.',
        variant: 'destructive',
      });
    }
  };

  const features = [
    {
      icon: <Wifi className="h-6 w-6" />,
      title: 'Offline Access',
      description: 'Browse vendors and venues even without internet connection'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Push Notifications',
      description: 'Get instant updates about bookings and messages'
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'Photo Upload',
      description: 'Upload and share wedding photos directly from your device'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location Services',
      description: 'Find nearby vendors and get directions to venues'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Calendar Integration',
      description: 'Sync your wedding timeline with your device calendar'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Favorites',
      description: 'Save your favorite vendors and venues for quick access'
    }
  ];

  const mobileFeatures = [
    {
      icon: <Search className="h-5 w-5" />,
      title: 'Smart Search',
      description: 'Voice search and AI-powered recommendations'
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: 'Quick Reviews',
      description: 'Rate and review vendors with one tap'
    },
    {
      icon: <Menu className="h-5 w-5" />,
      title: 'Easy Navigation',
      description: 'Intuitive mobile-first design'
    },
    {
      icon: <Battery className="h-5 w-5" />,
      title: 'Battery Efficient',
      description: 'Optimized for long wedding planning sessions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Smartphone className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mobile PWA Experience</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take WeddingLK with you everywhere. Our Progressive Web App provides a native app-like experience 
            on any device, with offline access and push notifications.
          </p>
        </div>

        {/* Device Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Platform</p>
                <p className="text-gray-900">{deviceInfo.platform}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Mobile Device</p>
                <Badge variant={deviceInfo.isMobile ? 'default' : 'secondary'}>
                  {deviceInfo.isMobile ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">PWA Mode</p>
                <Badge variant={deviceInfo.isPWA ? 'default' : 'secondary'}>
                  {deviceInfo.isPWA ? 'Installed' : 'Not Installed'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Installation Status</p>
                <Badge variant={isInstalled ? 'default' : 'secondary'}>
                  {isInstalled ? 'Installed' : 'Available'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-6 w-6" />
              <span>Install WeddingLK PWA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isInstalled ? (
              <div className="text-center py-8">
                <div className="text-green-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">PWA Installed!</h3>
                <p className="text-gray-600">WeddingLK is now installed on your device and ready to use.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-blue-600 mb-4">
                  <Download className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Install WeddingLK</h3>
                <p className="text-gray-600 mb-6">
                  Get the full mobile experience with offline access and push notifications.
                </p>
                <Button onClick={installPWA} size="lg" className="mb-4">
                  <Download className="h-5 w-5 mr-2" />
                  Install PWA
                </Button>
                <div className="text-sm text-gray-500">
                  <p>Installation instructions:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• On Chrome: Look for the install button in the address bar</li>
                    <li>• On Safari: Tap the Share button and select "Add to Home Screen"</li>
                    <li>• On Firefox: Look for the install button in the address bar</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PWA Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile-Specific Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mobile-Optimized Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mobileFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Navigation Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mobile Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                  <span className="text-white font-medium">WeddingLK</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                  <Home className="h-5 w-5 text-gray-400" />
                  <span className="text-white">Home</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                  <Search className="h-5 w-5 text-gray-400" />
                  <span className="text-white">Search</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                  <Heart className="h-5 w-5 text-gray-400" />
                  <span className="text-white">Favorites</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-white">Profile</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Mobile PWA</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Capabilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Offline Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Offline</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Saved vendor profiles
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Favorited venues
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Wedding timeline
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Budget planner
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Guest list
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Requires Internet</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Live search results
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Real-time messaging
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Photo uploads
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Booking confirmations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Payment processing
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <p className="text-sm text-gray-600">Faster Loading</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
                <p className="text-sm text-gray-600">Less Data Usage</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
                <p className="text-sm text-gray-600">Battery Efficient</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
