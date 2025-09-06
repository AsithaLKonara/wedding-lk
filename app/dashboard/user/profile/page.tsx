'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    language: '',
    currency: '',
    timezone: '',
    bio: '',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailMarketing: false,
    smsMarketing: false,
    pushMarketing: false
  });

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  const countries = [
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'si', label: 'Sinhala' },
    { value: 'ta', label: 'Tamil' }
  ];

  const currencies = [
    { value: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  const timezones = [
    { value: 'Asia/Colombo', label: 'Asia/Colombo' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Europe/London', label: 'Europe/London' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockProfile: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        location: {
          country: 'US',
          state: 'California',
          city: 'Los Angeles',
          zipCode: '90210'
        },
        preferences: {
          language: 'en',
          currency: 'USD',
          timezone: 'America/New_York',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          marketing: {
            email: false,
            sms: false,
            push: false
          }
        },
        avatar: '',
        bio: 'Wedding planning enthusiast looking for the perfect venue and vendors for my special day.',
        createdAt: '2024-01-15',
        updatedAt: '2024-06-20'
      };
      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone,
        dateOfBirth: mockProfile.dateOfBirth,
        gender: mockProfile.gender,
        country: mockProfile.location.country,
        state: mockProfile.location.state,
        city: mockProfile.location.city,
        zipCode: mockProfile.location.zipCode,
        language: mockProfile.preferences.language,
        currency: mockProfile.preferences.currency,
        timezone: mockProfile.preferences.timezone,
        bio: mockProfile.bio,
        emailNotifications: mockProfile.preferences.notifications.email,
        smsNotifications: mockProfile.preferences.notifications.sms,
        pushNotifications: mockProfile.preferences.notifications.push,
        emailMarketing: mockProfile.preferences.marketing.email,
        smsMarketing: mockProfile.preferences.marketing.sms,
        pushMarketing: mockProfile.preferences.marketing.push
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update profile - replace with actual API call
      console.log('Updating profile:', formData);
      setProfile(prev => prev ? {
        ...prev,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        location: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          zipCode: formData.zipCode
        },
        preferences: {
          language: formData.language,
          currency: formData.currency,
          timezone: formData.timezone,
          notifications: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
            push: formData.pushNotifications
          },
          marketing: {
            email: formData.emailMarketing,
            sms: formData.smsMarketing,
            push: formData.pushMarketing
          }
        },
        bio: formData.bio,
        updatedAt: new Date().toISOString().split('T')[0]
      } : null);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        country: profile.location.country,
        state: profile.location.state,
        city: profile.location.city,
        zipCode: profile.location.zipCode,
        language: profile.preferences.language,
        currency: profile.preferences.currency,
        timezone: profile.preferences.timezone,
        bio: profile.bio,
        emailNotifications: profile.preferences.notifications.email,
        smsNotifications: profile.preferences.notifications.sms,
        pushNotifications: profile.preferences.notifications.push,
        emailMarketing: profile.preferences.marketing.email,
        smsMarketing: profile.preferences.marketing.sms,
        pushMarketing: profile.preferences.marketing.push
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-500">{profile.email}</p>
                <Badge variant="outline" className="mt-2">User</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{profile.location.city}, {profile.location.state}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editing}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map(gender => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Preferences</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(language => (
                            <SelectItem key={language.value} value={language.value}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map(timezone => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
