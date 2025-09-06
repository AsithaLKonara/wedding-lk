'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Bell, 
  Globe, 
  CreditCard, 
  Database, 
  Server,
  Key,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
    enableCORS: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableNotifications: boolean;
  };
  payments: {
    stripePublicKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    enablePayments: boolean;
    currency: string;
    taxRate: number;
  };
  features: {
    enableUserRegistration: boolean;
    enableVendorRegistration: boolean;
    enableReviews: boolean;
    enableMessaging: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
  database: {
    connectionString: string;
    maxConnections: number;
    enableLogging: boolean;
    backupFrequency: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'features', label: 'Features', icon: Globe },
    { id: 'database', label: 'Database', icon: Database }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockSettings: SystemSettings = {
        general: {
          siteName: 'Wedding Dreams Lanka',
          siteDescription: 'Sri Lanka\'s premier wedding planning platform',
          siteUrl: 'https://wedding-lkcom.vercel.app',
          adminEmail: 'admin@weddinglk.com',
          timezone: 'Asia/Colombo',
          language: 'en',
          maintenanceMode: false
        },
        security: {
          enableTwoFactor: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireEmailVerification: true,
          enableCORS: true
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'noreply@weddinglk.com',
          smtpPassword: '********',
          fromEmail: 'noreply@weddinglk.com',
          fromName: 'Wedding Dreams Lanka',
          enableNotifications: true
        },
        payments: {
          stripePublicKey: 'pk_test_...',
          stripeSecretKey: 'sk_test_...',
          stripeWebhookSecret: 'whsec_...',
          enablePayments: true,
          currency: 'USD',
          taxRate: 0.15
        },
        features: {
          enableUserRegistration: true,
          enableVendorRegistration: true,
          enableReviews: true,
          enableMessaging: true,
          enableNotifications: true,
          enableAnalytics: true
        },
        database: {
          connectionString: 'mongodb+srv://...',
          maxConnections: 100,
          enableLogging: true,
          backupFrequency: 'daily'
        }
      };
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Mock save - replace with actual API call
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={fetchSettings} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.general.siteUrl}
                      onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => handleSettingChange('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Colombo">Asia/Colombo</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Temporarily disable public access</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('general', 'maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-gray-500">Users must verify email before login</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange('security', 'requireEmailVerification', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email server and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.email.smtpUser}
                      onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications">Enable Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.email.enableNotifications}
                    onCheckedChange={(checked) => handleSettingChange('email', 'enableNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'features' && (
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {key === 'enableUserRegistration' && 'Allow new users to register'}
                          {key === 'enableVendorRegistration' && 'Allow new vendors to register'}
                          {key === 'enableReviews' && 'Allow users to leave reviews'}
                          {key === 'enableMessaging' && 'Enable messaging between users and vendors'}
                          {key === 'enableNotifications' && 'Send push notifications'}
                          {key === 'enableAnalytics' && 'Track user analytics and behavior'}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => handleSettingChange('features', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'database' && (
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Database configuration and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="connectionString">Connection String</Label>
                  <Input
                    id="connectionString"
                    type="password"
                    value={settings.database.connectionString}
                    onChange={(e) => handleSettingChange('database', 'connectionString', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxConnections">Max Connections</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      value={settings.database.maxConnections}
                      onChange={(e) => handleSettingChange('database', 'maxConnections', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.database.backupFrequency}
                      onValueChange={(value) => handleSettingChange('database', 'backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableLogging">Enable Database Logging</Label>
                    <p className="text-sm text-gray-500">Log database queries and operations</p>
                  </div>
                  <Switch
                    id="enableLogging"
                    checked={settings.database.enableLogging}
                    onCheckedChange={(checked) => handleSettingChange('database', 'enableLogging', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
