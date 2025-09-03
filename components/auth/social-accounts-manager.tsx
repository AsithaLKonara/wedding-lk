'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FaGoogle, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

interface SocialAccount {
  provider: string;
  providerId: string;
  linkedAt: string;
  lastUsed?: string;
}

interface SocialAccountsData {
  socialAccounts: SocialAccount[];
  hasPassword: boolean;
  canUnlink: boolean;
}

export default function SocialAccountsManager() {
  const { data: session, update } = useSession();
  const [data, setData] = useState<SocialAccountsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState<string | null>(null);
  const [settingPassword, setSettingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const fetchSocialAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/social-accounts');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load social accounts');
      }
    } catch (err) {
      setError('Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkAccount = async (provider: string) => {
    try {
      setUnlinking(provider);
      setError(null);
      
      const response = await fetch(`/api/auth/social-accounts?provider=${provider}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(`${provider} account unlinked successfully`);
        await fetchSocialAccounts();
        await update(); // Update session
      } else {
        setError(result.error || 'Failed to unlink account');
      }
    } catch (err) {
      setError('Failed to unlink account');
    } finally {
      setUnlinking(null);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSettingPassword(true);
      setError(null);
      
      const response = await fetch('/api/auth/social-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Password set successfully');
        setPassword('');
        setConfirmPassword('');
        await fetchSocialAccounts();
      } else {
        setError(result.error || 'Failed to set password');
      }
    } catch (err) {
      setError('Failed to set password');
    } finally {
      setSettingPassword(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return FaGoogle;
      case 'facebook':
        return FaFacebook;
      case 'instagram':
        return FaInstagram;
      case 'linkedin':
        return FaLinkedin;
      default:
        return FaGoogle;
    }
  };

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'text-red-500';
      case 'facebook':
        return 'text-blue-600';
      case 'instagram':
        return 'text-pink-500';
      case 'linkedin':
        return 'text-blue-700';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <FaSpinner className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading social accounts...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Accounts</CardTitle>
          <CardDescription>
            Manage your linked social accounts and authentication methods
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <FaCheck className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {data?.socialAccounts && data.socialAccounts.length > 0 ? (
            <div className="space-y-3">
              {data.socialAccounts.map((account) => {
                const Icon = getProviderIcon(account.provider);
                const isUnlinking = unlinking === account.provider;
                
                return (
                  <div
                    key={`${account.provider}-${account.providerId}`}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${getProviderColor(account.provider)}`} />
                      <div>
                        <p className="font-medium">{getProviderName(account.provider)}</p>
                        <p className="text-sm text-muted-foreground">
                          Linked on {new Date(account.linkedAt).toLocaleDateString()}
                        </p>
                        {account.lastUsed && (
                          <p className="text-xs text-muted-foreground">
                            Last used: {new Date(account.lastUsed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkAccount(account.provider)}
                      disabled={isUnlinking || !data.canUnlink}
                    >
                      {isUnlinking ? (
                        <FaSpinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <FaTimes className="h-4 w-4" />
                      )}
                      <span className="ml-2">
                        {isUnlinking ? 'Unlinking...' : 'Unlink'}
                      </span>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No social accounts linked</p>
          )}

          {!data?.hasPassword && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Set Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a password to your account for additional security and to enable unlinking social accounts.
              </p>
              
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-4 w-4" />
                      ) : (
                        <FaEye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={settingPassword}
                  className="w-full"
                >
                  {settingPassword ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Set Password
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
