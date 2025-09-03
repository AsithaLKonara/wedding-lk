import bcrypt from 'bcryptjs';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  // Additional strength checks
  if (password.length >= 16) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  if (/[0-9].*[0-9]/.test(password)) score += 1;
  if (/[A-Z].*[A-Z]/.test(password)) score += 1;
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  if (score >= 7) strength = 'very_strong';
  else if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  else strength = 'weak';
  
  // Additional security checks
  if (password.toLowerCase().includes('password')) {
    errors.push('Password cannot contain the word "password"');
  }
  
  if (password.toLowerCase().includes('123')) {
    errors.push('Password cannot contain sequential numbers');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateStrongPassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each required category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special character
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case 'very_strong':
      return '#10B981'; // Green
    case 'strong':
      return '#059669'; // Dark Green
    case 'medium':
      return '#F59E0B'; // Yellow
    case 'weak':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
}

export function getPasswordStrengthText(strength: string): string {
  switch (strength) {
    case 'very_strong':
      return 'Very Strong';
    case 'strong':
      return 'Strong';
    case 'medium':
      return 'Medium';
    case 'weak':
      return 'Weak';
    default:
      return 'Unknown';
  }
} 