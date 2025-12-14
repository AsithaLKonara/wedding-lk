import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';

export interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function createValidationMiddleware(options: ValidationOptions) {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    const errors: string[] = [];

    // Validate request body
    if (options.body && request.method !== 'GET') {
      try {
        const body = await request.json();
        options.body.parse(body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...error.errors.map(err => `Body: ${err.path.join('.')} - ${err.message}`));
        } else {
          errors.push('Invalid request body format');
        }
      }
    }

    // Validate query parameters
    if (options.query) {
      try {
        const { searchParams } = new URL(request.url);
        const queryObject: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryObject[key] = value;
        });
        options.query.parse(queryObject);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...error.errors.map(err => `Query: ${err.path.join('.')} - ${err.message}`));
        } else {
          errors.push('Invalid query parameters');
        }
      }
    }

    // Validate route parameters
    if (options.params && context?.params) {
      try {
        options.params.parse(context.params);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...error.errors.map(err => `Params: ${err.path.join('.')} - ${err.message}`));
        } else {
          errors.push('Invalid route parameters');
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      );
    }

    return null; // No validation errors
  };
}

// Helper function to validate request data
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Invalid request format'] };
  }
}

// Helper function to validate query parameters
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const { searchParams } = new URL(request.url);
    const queryObject: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObject[key] = value;
    });
    const validatedData = schema.parse(queryObject);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Invalid query parameters'] };
  }
}

// Helper function to validate route parameters
export function validateParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Invalid route parameters'] };
  }
}

// Rate limiting validation
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000).default(15 * 60 * 1000), // 15 minutes
  max: z.number().min(1).default(100), // 100 requests per window
  message: z.string().default('Too many requests, please try again later'),
  standardHeaders: z.boolean().default(true),
  legacyHeaders: z.boolean().default(false),
});

// Security validation
export const securityValidationSchema = z.object({
  preventXSS: z.boolean().default(true),
  preventSQLInjection: z.boolean().default(true),
  maxFileSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedFileTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
  requireCSRF: z.boolean().default(true),
});

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize text input
export function validateAndSanitizeText(
  input: string,
  minLength: number = 1,
  maxLength: number = 1000
): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < minLength) {
    return { isValid: false, sanitized, error: `Text must be at least ${minLength} characters` };
  }
  
  if (sanitized.length > maxLength) {
    return { isValid: false, sanitized, error: `Text must be less than ${maxLength} characters` };
  }
  
  return { isValid: true, sanitized };
}

// Validate file upload
export function validateFileUpload(
  file: File,
  maxSize: number = 5 * 1024 * 1024,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { isValid: boolean; error?: string } {
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} is not allowed` };
  }
  
  return { isValid: true };
}


