'use client';

// Removed NextAuth - using custom auth
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FaGoogle, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaSpinner 
} from 'react-icons/fa';

interface SocialLoginButtonsProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  showDescription?: boolean;
}

export function SocialLoginButtons({ 
  redirectTo = '/dashboard',
  onSuccess, 
  onError, 
  showDescription = true
}: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(provider);
      setError(null);

      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: redirectTo,
      });

      if (result?.error) {
        const errorMessage = getErrorMessage(result.error);
        setError(errorMessage);
        onError?.(errorMessage);
      } else if (result?.ok) {
        onSuccess?.();
        // Refresh session to get updated user data
        await getSession();
        // Redirect will be handled by NextAuth
        window.location.href = redirectTo;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error occurred during OAuth sign-in. Please try again.';
      case 'OAuthCallback':
        return 'Error occurred during OAuth callback. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create account. Please try again.';
      case 'EmailCreateAccount':
        return 'Could not create account with this email.';
      case 'Callback':
        return 'Error occurred during authentication. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with your original method.';
      case 'EmailSignin':
        return 'Error sending sign-in email. Please try again.';
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during sign-in. Please try again.';
    }
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: FaGoogle,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    // Note: Instagram and LinkedIn providers need to be configured in NextAuth
    // {
    //   id: 'instagram',
    //   name: 'Instagram',
    //   icon: FaInstagram,
    //   color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    //   textColor: 'text-white'
    // },
    // {
    //   id: 'linkedin',
    //   name: 'LinkedIn',
    //   icon: FaLinkedin,
    //   color: 'bg-blue-700 hover:bg-blue-800',
    //   textColor: 'text-white'
    // }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="backdrop-blur-md bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {socialProviders.map((provider) => {
          const Icon = provider.icon;
          const isLoading = loading === provider.id;
        
        return (
              <Button
              key={provider.id}
              variant="outline"
              className={`w-full ${provider.color} ${provider.textColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-3 font-semibold`}
              onClick={() => handleSocialLogin(provider.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Icon className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Signing in...' : `Continue with ${provider.name}`}
              </Button>
        );
      })}
    </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        By signing in, you agree to our{' '}
        <a href="/terms" className="text-purple-600 hover:text-purple-500 font-medium">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-purple-600 hover:text-purple-500 font-medium">
          Privacy Policy
        </a>
      </div>
    </div>
  );
} 

export default SocialLoginButtons;