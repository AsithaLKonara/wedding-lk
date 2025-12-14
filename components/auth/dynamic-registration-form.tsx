'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Upload, X } from 'lucide-react';
import { z } from 'zod';

interface RegistrationFormProps {
  role: string;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'tel' | 'date' | 'number' | 'textarea' | 'checkbox' | 'file';
  required: boolean;
  placeholder: string;
  description?: string;
  options?: { value: string; label: string }[];
  defaultValues?: Record<string, any>;
  dependsOn?: { field: string; value: any };
}

interface FormStep {
  title: string;
  description: string;
  fields: FormField[];
  schema: any;
  defaultValues?: Record<string, any>;
}

export function DynamicRegistrationForm({ role, onSubmit, onBack }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  
  const formConfig = getFormConfig(role);
  const currentStepConfig = formConfig.steps[currentStep];
  
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: currentStepConfig.defaultValues || {},
  });
  
  const handleStepSubmit = async (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    if (currentStep < formConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset form for next step
      form.reset();
    } else {
      // Final submission
      const finalData = { ...updatedData, role };
      onSubmit(finalData);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Restore form data for previous step
      const previousStepData = formConfig.steps[currentStep - 1].defaultValues || {};
      form.reset(previousStepData);
    }
  };
  
  const handleFileUpload = (fieldName: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...fileArray]
      }));
    }
  };
  
  const removeFile = (fieldName: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, i) => i !== index) || []
    }));
  };
  
  const renderField = (field: FormField) => {
    const { name, type, required, placeholder, description, options, dependsOn } = field;
    
    // Check if field should be shown based on dependencies
    if (dependsOn) {
      const dependentValue = form.watch(dependsOn.field as any);
      if (dependentValue !== dependsOn.value) {
        return null;
      }
    }
    
    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'password':
        return (
          <Input
            type={type}
            {...form.register(name as any)}
            placeholder={placeholder}
            className="w-full"
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            {...form.register(name)}
            placeholder={placeholder}
            rows={4}
            className="w-full"
          />
        );
        
      case 'select':
        return (
          <Select onValueChange={(value) => form.setValue(name, value)}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={form.watch(name as any) || false}
              onCheckedChange={(checked) => form.setValue(name as any, checked)}
              className="rounded"
            />
            <label htmlFor={name} className="text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(name, e.target.files)}
                className="hidden"
                id={name}
              />
              <label htmlFor={name} className="cursor-pointer text-primary hover:text-primary/80">
                Click to upload files
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Drag and drop files here or click to browse
              </p>
            </div>
            
            {/* Display uploaded files */}
            {uploadedFiles[name] && uploadedFiles[name].length > 0 && (
              <div className="space-y-2">
                {uploadedFiles[name].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(name, index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'date':
        return (
          <Input
            type="date"
            {...form.register(name)}
            className="w-full"
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            {...form.register(name)}
            placeholder={placeholder}
            className="w-full"
          />
        );
        
      default:
        return <Input {...form.register(name)} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Role Selection
            </Button>
            <Badge variant="secondary">
              Step {currentStep + 1} of {formConfig.steps.length}
            </Badge>
          </div>
          
          <Progress 
            value={((currentStep + 1) / formConfig.steps.length) * 100} 
            className="h-2"
          />
          
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {formConfig.steps.map((step, index) => (
              <span
                key={index}
                className={`${
                  index <= currentStep ? 'text-primary font-medium' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {currentStepConfig.title}
            </CardTitle>
            <p className="text-gray-600 text-lg">
              {currentStepConfig.description}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(handleStepSubmit)} className="space-y-6">
              {currentStepConfig.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {renderField(field)}
                  
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                  
                  {form.formState.errors[field.name as any] && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors[field.name as any]?.message as string}
                    </p>
                  )}
                </div>
              ))}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {currentStep === formConfig.steps.length - 1 ? (
                    <>
                      Complete Registration
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getFormConfig(role: string) {
  const baseSteps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your full name',
        } as FormField,
        {
          name: 'email',
          label: 'Email Address',
          type: 'email' as const,
          required: true,
          placeholder: 'Enter your email address',
        } as FormField,
        {
          name: 'password',
          label: 'Password',
          type: 'password' as const,
          required: true,
          placeholder: 'Create a strong password',
          description: 'Must be at least 8 characters with uppercase, lowercase, number, and special character',
        } as FormField,
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'tel' as const,
          required: false,
          placeholder: 'Enter your phone number',
        } as FormField,
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date' as const,
          required: false,
          placeholder: 'Select your date of birth',
        } as FormField,
        {
          name: 'gender',
          label: 'Gender',
          type: 'select' as const,
          required: false,
          placeholder: 'Select your gender',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ],
        } as FormField,
      ],
      schema: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
      }),
      defaultValues: {},
    },
    {
      title: 'Location & Preferences',
      description: 'Where are you located and what are your preferences?',
      fields: [
        {
          name: 'location.country',
          label: 'Country',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your country',
        } as FormField,
        {
          name: 'location.state',
          label: 'State/Province',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your state or province',
        } as FormField,
        {
          name: 'location.city',
          label: 'City',
          type: 'text' as const,
          required: true,
          placeholder: 'Enter your city',
        } as FormField,
        {
          name: 'location.zipCode',
          label: 'ZIP/Postal Code',
          type: 'text' as const,
          required: false,
          placeholder: 'Enter your ZIP or postal code',
        } as FormField,
        {
          name: 'preferences.language',
          label: 'Preferred Language',
          type: 'select' as const,
          required: false,
          placeholder: 'Select your preferred language',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'it', label: 'Italian' },
            { value: 'pt', label: 'Portuguese' },
            { value: 'ru', label: 'Russian' },
            { value: 'zh', label: 'Chinese' },
            { value: 'ja', label: 'Japanese' },
            { value: 'ko', label: 'Korean' },
          ],
        } as FormField,
        {
          name: 'preferences.currency',
          label: 'Preferred Currency',
          type: 'select' as const,
          required: false,
          placeholder: 'Select your preferred currency',
          options: [
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
            { value: 'JPY', label: 'Japanese Yen (JPY)' },
            { value: 'CAD', label: 'Canadian Dollar (CAD)' },
            { value: 'AUD', label: 'Australian Dollar (AUD)' },
            { value: 'CHF', label: 'Swiss Franc (CHF)' },
            { value: 'CNY', label: 'Chinese Yuan (CNY)' },
          ],
        } as FormField,
      ],
      schema: z.object({
        location: z.object({
          country: z.string().min(2, 'Country is required'),
          state: z.string().min(2, 'State is required'),
          city: z.string().min(2, 'City is required'),
          zipCode: z.string().optional(),
        }),
        preferences: z.object({
          language: z.string().default('en'),
          currency: z.string().default('USD'),
        }),
      }),
    },
  ];
  
  if (role === 'vendor') {
    baseSteps.push(
      {
        title: 'Business Information',
        description: 'Tell us about your business',
        fields: [
          {
            name: 'businessName',
            label: 'Business Name',
            type: 'text' as const,
            required: true,
            placeholder: 'Enter your business name',
          } as FormField,
          {
            name: 'businessType',
            label: 'Business Type',
            type: 'select' as const,
            required: true,
            placeholder: 'Select your business type',
            options: [
              { value: 'individual', label: 'Individual/Sole Proprietor' },
              { value: 'company', label: 'Company/Corporation' },
              { value: 'partnership', label: 'Partnership' },
            ],
          } as FormField,
          {
            name: 'businessRegistrationNumber',
            label: 'Business Registration Number',
            type: 'text' as const,
            required: false,
            placeholder: 'Enter your business registration number',
          } as FormField,
          {
            name: 'yearsInBusiness',
            label: 'Years in Business',
            type: 'number' as const,
            required: true,
            placeholder: 'Enter number of years',
          } as FormField,
        ],
        schema: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          email: z.string().email('Invalid email address'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
          phone: z.string().optional(),
          dateOfBirth: z.string().optional(),
          gender: z.string().optional(),
          businessName: z.string().min(2, 'Business name is required'),
          businessType: z.enum(['individual', 'company', 'partnership']),
          businessRegistrationNumber: z.string().optional(),
          yearsInBusiness: z.number().min(0, 'Years must be positive'),
        }),
      } as FormStep,
      {
        title: 'Services & Portfolio',
        description: 'What services do you offer?',
        fields: [
          {
            name: 'services',
            label: 'Services Offered',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Describe the services you offer',
            description: 'List all the wedding-related services you provide',
          } as FormField,
          {
            name: 'portfolio',
            label: 'Portfolio Images',
            type: 'file' as const,
            required: false,
            placeholder: 'Upload images of your previous work (optional)',
            description: 'Upload images of your previous work (optional)',
          } as FormField,
        ],
        schema: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          email: z.string().email('Invalid email address'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
          phone: z.string().optional(),
          dateOfBirth: z.string().optional(),
          gender: z.string().optional(),
          services: z.string().min(10, 'Please describe your services'),
          portfolio: z.any().optional(),
        }),
        defaultValues: {},
      } as FormStep,
    );
  } else if (role === 'wedding_planner') {
    baseSteps.push(
      {
        title: 'Professional Information',
        description: 'Tell us about your professional background',
        fields: [
          {
            name: 'professionalTitle',
            label: 'Professional Title',
            type: 'text' as const,
            required: true,
            placeholder: 'e.g., Certified Wedding Planner, Event Coordinator',
          } as FormField,
          {
            name: 'yearsOfExperience',
            label: 'Years of Experience',
            type: 'number' as const,
            required: true,
            placeholder: 'Enter number of years',
          } as FormField,
          {
            name: 'specialization',
            label: 'Specializations',
            type: 'textarea' as const,
            required: true,
            placeholder: 'e.g., Destination weddings, Cultural ceremonies, Budget planning',
            description: 'List your areas of expertise',
          } as FormField,
        ],
        schema: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          email: z.string().email('Invalid email address'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
          phone: z.string().optional(),
          dateOfBirth: z.string().optional(),
          gender: z.string().optional(),
          professionalTitle: z.string().min(2, 'Professional title is required'),
          yearsOfExperience: z.number().min(0, 'Years must be positive'),
          specialization: z.string().min(10, 'Please describe your specializations'),
        }),
      } as FormStep,
    );
  }
  
  // Add final step for all roles
  baseSteps.push({
    title: 'Account Preferences',
    description: 'Set up your notification and marketing preferences',
    fields: [
      {
        name: 'preferences.notifications.email',
        label: 'Email Notifications',
        type: 'checkbox' as const,
        required: false,
        placeholder: 'Enable email notifications',
        description: 'Receive important updates and notifications via email',
      } as FormField,
      {
        name: 'preferences.notifications.sms',
        label: 'SMS Notifications',
        type: 'checkbox' as const,
        required: false,
        placeholder: 'Enable SMS notifications',
        description: 'Receive urgent notifications via SMS',
      } as FormField,
      {
        name: 'preferences.notifications.push',
        label: 'Push Notifications',
        type: 'checkbox' as const,
        required: false,
        placeholder: 'Enable push notifications',
        description: 'Receive notifications in your browser or mobile app',
      } as FormField,
      {
        name: 'preferences.marketing.email',
        label: 'Marketing Emails',
        type: 'checkbox' as const,
        required: false,
        placeholder: 'Enable marketing emails',
        description: 'Receive promotional content and special offers via email',
      } as FormField,
    ],
    schema: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      gender: z.string().optional(),
      preferences: z.object({
        notifications: z.object({
          email: z.boolean().default(true),
          sms: z.boolean().default(false),
          push: z.boolean().default(true),
        }),
        marketing: z.object({
          email: z.boolean().default(false),
          sms: z.boolean().default(false),
          push: z.boolean().default(false),
        }),
      }),
    }),
  } as FormStep);
  
  return {
    steps: baseSteps,
  };
} 