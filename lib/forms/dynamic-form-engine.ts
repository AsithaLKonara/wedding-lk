import { z } from 'zod';

// Base form field types
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'select' | 'multiselect' | 'textarea' | 'number' | 'date' | 'file' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: z.ZodType<any>;
  options?: Array<{ value: string; label: string }>;
  conditional?: {
    field: string;
    value: any;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
  helpText?: string;
  defaultValue?: any;
}

// Form section
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: {
    field: string;
    value: any;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

// Complete form schema
export interface DynamicForm {
  id: string;
  title: string;
  description: string;
  sections: FormSection[];
  validationSchema: z.ZodType<any>;
  submitHandler: (data: any) => Promise<any>;
}

// Form validation schemas
export const baseUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional()
  }).optional()
});

export const vendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional()
  }).optional(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  servicesOffered: z.array(z.string()).min(1, 'Please select at least one service'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  pricing: z.object({
    currency: z.string().default('USD'),
    basePrice: z.number().min(0, 'Base price cannot be negative'),
    pricingModel: z.enum(['hourly', 'daily', 'fixed', 'custom'])
  }),
  contact: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    website: z.string().url('Invalid website URL').optional(),
    socialMedia: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional()
    }).optional()
  }),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string().url('Invalid document URL'),
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string()
  })).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const weddingPlannerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional()
  }).optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  experienceYears: z.number().min(0, 'Experience cannot be negative'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  certifications: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  pricing: z.object({
    currency: z.string().default('USD'),
    consultationFee: z.number().min(0, 'Consultation fee cannot be negative'),
    packagePricing: z.enum(['hourly', 'daily', 'fixed', 'custom'])
  }),
  contact: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    website: z.string().url('Invalid website URL').optional(),
    socialMedia: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional()
    }).optional()
  }),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string().url('Invalid document URL'),
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string()
  })).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Form field definitions
export const baseUserFields: FormField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    validation: z.string().min(2, 'Name must be at least 2 characters')
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: true,
    validation: z.string().email('Invalid email address')
  },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Create a strong password',
    required: true,
    validation: z.string().min(8, 'Password must be at least 8 characters'),
    helpText: 'Must be at least 8 characters long'
  },
  {
    id: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    required: true,
    validation: z.string()
  },
  {
    id: 'phone',
    type: 'text',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    required: false,
    validation: z.string().optional()
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    label: 'Date of Birth',
    required: false,
    validation: z.string().optional()
  },
  {
    id: 'gender',
    type: 'select',
    label: 'Gender',
    required: false,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' }
    ],
    validation: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional()
  }
];

export const vendorFields: FormField[] = [
  {
    id: 'businessName',
    type: 'text',
    label: 'Business Name',
    placeholder: 'Enter your business name',
    required: true,
    validation: z.string().min(2, 'Business name must be at least 2 characters')
  },
  {
    id: 'category',
    type: 'select',
    label: 'Business Category',
    required: true,
    options: [
      { value: 'photography', label: 'Photography' },
      { value: 'videography', label: 'Videography' },
      { value: 'catering', label: 'Catering' },
      { value: 'florist', label: 'Florist' },
      { value: 'music', label: 'Music & Entertainment' },
      { value: 'transportation', label: 'Transportation' },
      { value: 'decor', label: 'Decor & Styling' },
      { value: 'beauty', label: 'Beauty & Hair' },
      { value: 'jewelry', label: 'Jewelry' },
      { value: 'other', label: 'Other' }
    ],
    validation: z.string().min(1, 'Please select a category')
  },
  {
    id: 'servicesOffered',
    type: 'multiselect',
    label: 'Services Offered',
    required: true,
    options: [
      { value: 'wedding_planning', label: 'Wedding Planning' },
      { value: 'event_coordination', label: 'Event Coordination' },
      { value: 'design_consultation', label: 'Design Consultation' },
      { value: 'vendor_coordination', label: 'Vendor Coordination' },
      { value: 'day_of_coordination', label: 'Day-of Coordination' },
      { value: 'full_service', label: 'Full Service' }
    ],
    validation: z.array(z.string()).min(1, 'Please select at least one service')
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Business Description',
    placeholder: 'Describe your business and services...',
    required: true,
    validation: z.string().min(50, 'Description must be at least 50 characters'),
    helpText: 'Tell potential clients about your business, experience, and what makes you unique'
  },
  {
    id: 'experience',
    type: 'number',
    label: 'Years of Experience',
    placeholder: '0',
    required: true,
    validation: z.number().min(0, 'Experience cannot be negative'),
    helpText: 'How many years have you been in business?'
  },
  {
    id: 'pricing',
    type: 'select',
    label: 'Pricing Model',
    required: true,
    options: [
      { value: 'hourly', label: 'Hourly Rate' },
      { value: 'daily', label: 'Daily Rate' },
      { value: 'fixed', label: 'Fixed Price' },
      { value: 'custom', label: 'Custom Quote' }
    ],
    validation: z.enum(['hourly', 'daily', 'fixed', 'custom'])
  }
];

export const weddingPlannerFields: FormField[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter your company name',
    required: true,
    validation: z.string().min(2, 'Company name must be at least 2 characters')
  },
  {
    id: 'experienceYears',
    type: 'number',
    label: 'Years of Experience',
    placeholder: '0',
    required: true,
    validation: z.number().min(0, 'Experience cannot be negative'),
    helpText: 'How many years have you been planning weddings?'
  },
  {
    id: 'specialties',
    type: 'multiselect',
    label: 'Specialties',
    required: true,
    options: [
      { value: 'destination_weddings', label: 'Destination Weddings' },
      { value: 'intimate_weddings', label: 'Intimate Weddings' },
      { value: 'luxury_weddings', label: 'Luxury Weddings' },
      { value: 'budget_weddings', label: 'Budget Weddings' },
      { value: 'cultural_weddings', label: 'Cultural Weddings' },
      { value: 'same_sex_weddings', label: 'Same-Sex Weddings' },
      { value: 'elopements', label: 'Elopements' },
      { value: 'corporate_events', label: 'Corporate Events' }
    ],
    validation: z.array(z.string()).min(1, 'Please select at least one specialty')
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Company Description',
    placeholder: 'Describe your company and services...',
    required: true,
    validation: z.string().min(50, 'Description must be at least 50 characters'),
    helpText: 'Tell potential clients about your company, experience, and what makes you unique'
  },
  {
    id: 'certifications',
    type: 'multiselect',
    label: 'Certifications',
    required: false,
    options: [
      { value: 'certified_wedding_planner', label: 'Certified Wedding Planner' },
      { value: 'event_planning_certificate', label: 'Event Planning Certificate' },
      { value: 'hospitality_management', label: 'Hospitality Management' },
      { value: 'project_management', label: 'Project Management' },
      { value: 'other', label: 'Other' }
    ],
    validation: z.array(z.string()).optional()
  }
];

// Form section definitions
export const baseUserSections: FormSection[] = [
  {
    id: 'personal_info',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    fields: baseUserFields.slice(0, 4) // name, email, password, confirmPassword
  },
  {
    id: 'additional_info',
    title: 'Additional Information',
    description: 'Optional details to help personalize your experience',
    fields: baseUserFields.slice(4) // phone, dateOfBirth, gender
  }
];

export const vendorSections: FormSection[] = [
  ...baseUserSections,
  {
    id: 'business_info',
    title: 'Business Information',
    description: 'Tell us about your business',
    fields: vendorFields.slice(0, 3) // businessName, category, servicesOffered
  },
  {
    id: 'business_details',
    title: 'Business Details',
    description: 'More details about your services and experience',
    fields: vendorFields.slice(3) // description, experience, pricing
  }
];

export const weddingPlannerSections: FormSection[] = [
  ...baseUserSections,
  {
    id: 'company_info',
    title: 'Company Information',
    description: 'Tell us about your company',
    fields: weddingPlannerFields.slice(0, 3) // companyName, experienceYears, specialties
  },
  {
    id: 'company_details',
    title: 'Company Details',
    description: 'More details about your services and experience',
    fields: weddingPlannerFields.slice(3) // description, certifications
  }
];

// Dynamic form factory
export class DynamicFormFactory {
  static createForm(role: string): DynamicForm {
    switch (role) {
      case 'vendor':
        return {
          id: 'vendor_registration',
          title: 'Vendor Registration',
          description: 'Complete your vendor profile to start receiving bookings',
          sections: vendorSections,
          validationSchema: vendorSchema,
          submitHandler: async (data) => {
            // Implementation will be added
            console.log('Vendor registration data:', data);
            return { success: true, message: 'Vendor registration successful' };
          }
        };
      
      case 'wedding_planner':
        return {
          id: 'wedding_planner_registration',
          title: 'Wedding Planner Registration',
          description: 'Complete your wedding planner profile to start helping couples',
          sections: weddingPlannerSections,
          validationSchema: weddingPlannerSchema,
          submitHandler: async (data) => {
            // Implementation will be added
            console.log('Wedding planner registration data:', data);
            return { success: true, message: 'Wedding planner registration successful' };
          }
        };
      
      default:
        return {
          id: 'user_registration',
          title: 'User Registration',
          description: 'Create your account to start planning your perfect wedding',
          sections: baseUserSections,
          validationSchema: baseUserSchema,
          submitHandler: async (data) => {
            // Implementation will be added
            console.log('User registration data:', data);
            return { success: true, message: 'User registration successful' };
          }
        };
    }
  }
}

// Form validation and processing utilities
export class FormValidator {
  static validateField(field: FormField, value: any): { isValid: boolean; error?: string } {
    if (field.required && (!value || value === '')) {
      return { isValid: false, error: `${field.label} is required` };
    }

    if (field.validation && value) {
      try {
        field.validation.parse(value);
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { isValid: false, error: (error as any).errors?.[0]?.message || 'Validation failed' };
        }
        return { isValid: false, error: 'Validation failed' };
      }
    }

    return { isValid: true };
  }

  static validateSection(section: FormSection, data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      const validation = this.validateField(field, data[field.id]);
      if (!validation.isValid) {
        errors[field.id] = validation.error!;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  static validateForm(form: DynamicForm, data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } {
    try {
      form.validationSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        (error as any).errors?.forEach((err: any) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Form validation failed' } };
    }
  }
} 