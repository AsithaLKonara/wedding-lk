'use client';

import { signIn, getSession } from 'next-auth/react';
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to WeddingLK</CardTitle>
      {showDescription && (
          <CardDescription>
            Sign in with your social account to get started
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
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
                className={`w-full ${provider.color} ${provider.textColor} border-0`}
                onClick={() => handleSocialLogin(provider.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Signing in...' : `Continue with ${provider.name}`}
                </Button>
          );
        })}
      </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
      </div>

        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
        </div>
          </CardContent>
        </Card>
  );
} 

export default SocialLoginButtons;