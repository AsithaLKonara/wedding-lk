'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  DynamicFormFactory, 
  FormValidator, 
  type DynamicForm, 
  type FormSection, 
  type FormField 
} from '@/lib/forms/dynamic-form-engine';

interface EnhancedRegistrationFormProps {
  role: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface FormData {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

export function EnhancedRegistrationForm({ 
  role, 
  onSuccess, 
  onError 
}: EnhancedRegistrationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<DynamicForm | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initialize form based on role
    const dynamicForm = DynamicFormFactory.createForm(role);
    setForm(dynamicForm);
    
    // Set default values
    const defaultData: FormData = {
      role,
      dateOfBirth: '',
      gender: '',
      phone: '',
      location: {
        country: '',
        state: '',
        city: '',
        zipCode: ''
      }
    };
    
    if (role === 'vendor') {
      defaultData.pricing = {
        currency: 'USD',
        basePrice: 0,
        pricingModel: 'fixed'
      };
      defaultData.contact = {
        phone: '',
        website: '',
        socialMedia: {}
      };
    }
    
    if (role === 'wedding_planner') {
      defaultData.pricing = {
        currency: 'USD',
        consultationFee: 0,
        packagePricing: 'fixed'
      };
      defaultData.contact = {
        phone: '',
        website: '',
        socialMedia: {}
      };
    }
    
    setFormData(defaultData);
  }, [role]);

  useEffect(() => {
    // Calculate progress
    if (form) {
      const totalFields = form.sections.reduce((acc, section) => acc + section.fields.length, 0);
      const completedFields = Object.keys(formData).filter(key => 
        formData[key] !== undefined && formData[key] !== '' && formData[key] !== null
      ).length;
      setProgress((completedFields / totalFields) * 100);
    }
  }, [formData, form]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handlePricingChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const handleContactChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const validateCurrentSection = (): boolean => {
    if (!form) return false;

    const currentSection = form.sections[currentSectionIndex];
    const sectionData: FormData = {};
    
    currentSection.fields.forEach(field => {
      sectionData[field.id] = formData[field.id];
    });

    const validation = FormValidator.validateSection(currentSection, sectionData);
    setErrors(validation.errors);
    
    return validation.isValid;
  };

  const goToNextSection = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < form!.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < form!.sections.length) {
      setCurrentSectionIndex(index);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;

    // Validate entire form
    const validation = FormValidator.validateForm(form, formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await form.submitHandler(formData);
      if (result.success) {
        onSuccess?.(formData);
        router.push('/dashboard');
      } else {
        onError?.(result.message || 'Registration failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'password':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={error ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (checked) {
                        handleInputChange(field.id, [...currentValues, option.value]);
                      } else {
                        handleInputChange(field.id, currentValues.filter(v => v !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
              rows={4}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentSection = form.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === form.sections.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Registration Progress</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Navigation */}
      <div className="flex items-center justify-center space-x-2">
        {form.sections.map((section, index) => (
          <Button
            key={section.id}
            variant={index === currentSectionIndex ? "default" : "outline"}
            size="sm"
            onClick={() => goToSection(index)}
            className="flex items-center gap-2"
          >
            {index < currentSectionIndex ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">
                {index + 1}
              </span>
            )}
            {section.title}
          </Button>
        ))}
      </div>

      {/* Current Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentSection.title}
            {currentSection.description && (
              <Badge variant="secondary" className="text-xs">
                {currentSectionIndex + 1} of {form.sections.length}
              </Badge>
            )}
          </CardTitle>
          {currentSection.description && (
            <CardDescription>{currentSection.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSection.fields.map((field) => (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Section Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={goToPreviousSection}
              disabled={isFirstSection}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Save progress
                  localStorage.setItem(`registration_progress_${role}`, JSON.stringify({
                    formData,
                    currentSection: currentSectionIndex,
                    timestamp: Date.now()
                  }));
                }}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Progress
              </Button>

              {isLastSection ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Complete Registration
                </Button>
              ) : (
                <Button
                  onClick={goToNextSection}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Summary */}
      {isLastSection && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Registration Summary</CardTitle>
            <CardDescription>Review your information before submitting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(formData).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) return null;
                if (value === undefined || value === '') return null;
                
                return (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 