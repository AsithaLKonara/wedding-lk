'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'booking' | 'notification' | 'marketing' | 'system';
  isActive: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = selectedCategory === 'all' 
        ? '/api/email-templates' 
        : `/api/email-templates?category=${selectedCategory}`;
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.templates);
      } else {
        setError(result.error || 'Failed to fetch templates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'bg-blue-500';
      case 'notification': return 'bg-green-500';
      case 'marketing': return 'bg-purple-500';
      case 'system': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking': return '📅';
      case 'notification': return '🔔';
      case 'marketing': return '📢';
      case 'system': return '⚙️';
      default: return '📧';
    }
  };

  const handleToggleActive = async (templateId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchTemplates(); // Refresh the list
      }
    } catch (err) {
      console.error('Error toggling template status:', err);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTemplates(); // Refresh the list
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-600">Manage your email templates and customize communications</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="booking">Booking</option>
            <option value="notification">Notification</option>
            <option value="marketing">Marketing</option>
            <option value="system">System</option>
          </select>
          <Button onClick={fetchTemplates} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={`${getCategoryColor(template.category)} text-white`}>
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {template.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Subject:</h4>
                  <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Variables:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.slice(0, 3).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(template.id, template.isActive)}
                    >
                      {template.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? 'No email templates have been created yet.'
              : `No ${selectedCategory} templates found.`
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      )}

      {/* Stats */}
      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Template Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-600">Total Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {templates.filter(t => t.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {templates.filter(t => t.category === 'booking').length}
                </div>
                <div className="text-sm text-gray-600">Booking Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {templates.filter(t => t.category === 'marketing').length}
                </div>
                <div className="text-sm text-gray-600">Marketing Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
