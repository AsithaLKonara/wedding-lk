// Date Validator for WeddingLK
// Validates dates for wedding planning and bookings

export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface DateConstraints {
  minimumAdvanceNotice: number; // days
  maximumAdvanceBooking: number; // days
  blackoutDates: string[]; // YYYY-MM-DD format
  preferredDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  seasonalRestrictions?: {
    startMonth: number; // 1-12
    endMonth: number; // 1-12
    reason: string;
  };
}

export interface WeddingDateInfo {
  date: string;
  dayOfWeek: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  isWeekend: boolean;
  isHoliday: boolean;
  isPeakSeason: boolean;
  daysUntilEvent: number;
  monthsUntilEvent: number;
}

const HOLIDAYS_2024 = [
  '2024-01-01', // New Year's Day
  '2024-01-15', // Martin Luther King Jr. Day
  '2024-02-19', // Presidents' Day
  '2024-05-27', // Memorial Day
  '2024-07-04', // Independence Day
  '2024-09-02', // Labor Day
  '2024-10-14', // Columbus Day
  '2024-11-11', // Veterans Day
  '2024-11-28', // Thanksgiving Day
  '2024-12-25', // Christmas Day
];

const HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // Martin Luther King Jr. Day
  '2025-02-17', // Presidents' Day
  '2025-05-26', // Memorial Day
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-10-13', // Columbus Day
  '2025-11-11', // Veterans Day
  '2025-11-27', // Thanksgiving Day
  '2025-12-25', // Christmas Day
];

export function validateWeddingDate(
  date: string,
  constraints: DateConstraints = {
    minimumAdvanceNotice: 90, // 3 months
    maximumAdvanceBooking: 730, // 2 years
    blackoutDates: [],
    preferredDays: ['friday', 'saturday', 'sunday'],
  }
): DateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    // Parse the date
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Reset time to start of day for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      errors.push('Invalid date format. Please use YYYY-MM-DD format.');
      return { isValid: false, errors, warnings, suggestions };
    }

    // Check if date is in the past
    if (selectedDate < today) {
      errors.push('Cannot select a date in the past.');
      return { isValid: false, errors, warnings, suggestions };
    }

    // Calculate days until event
    const daysUntilEvent = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Check minimum advance notice
    if (daysUntilEvent < constraints.minimumAdvanceNotice) {
      errors.push(`Wedding date must be at least ${constraints.minimumAdvanceNotice} days in advance.`);
    }

    // Check maximum advance booking
    if (daysUntilEvent > constraints.maximumAdvanceBooking) {
      errors.push(`Cannot book more than ${constraints.maximumAdvanceBooking} days in advance.`);
    }

    // Check blackout dates
    if (constraints.blackoutDates.includes(date)) {
      errors.push('Selected date is not available (blackout date).');
    }

    // Check if date is a holiday
    const allHolidays = [...HOLIDAYS_2024, ...HOLIDAYS_2025];
    if (allHolidays.includes(date)) {
      warnings.push('Selected date is a holiday. This may affect vendor availability and costs.');
    }

    // Check seasonal restrictions
    if (constraints.seasonalRestrictions) {
      const month = selectedDate.getMonth() + 1;
      if (month >= constraints.seasonalRestrictions.startMonth && month <= constraints.seasonalRestrictions.endMonth) {
        warnings.push(`Seasonal restriction: ${constraints.seasonalRestrictions.reason}`);
      }
    }

    // Check day of week preferences
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as any;
    if (!constraints.preferredDays.includes(dayOfWeek)) {
      warnings.push(`Consider choosing a ${constraints.preferredDays.join(' or ')} for better vendor availability.`);
    }

    // Check if it's a weekend
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    if (isWeekend) {
      warnings.push('Weekend dates typically have higher demand and may cost more.');
    }

    // Check peak season
    const month = selectedDate.getMonth() + 1;
    const isPeakSeason = [6, 7, 8, 12].includes(month);
    if (isPeakSeason) {
      warnings.push('Peak season dates (June-August, December) typically have higher demand and costs.');
    }

    // Provide suggestions for better dates
    if (daysUntilEvent < 180) {
      suggestions.push('Consider booking further in advance for better vendor availability and rates.');
    }

    if (isWeekend && isPeakSeason) {
      suggestions.push('Consider a weekday or off-peak season date for potential cost savings.');
    }

    // Check for optimal timing
    if (daysUntilEvent >= 180 && daysUntilEvent <= 365) {
      suggestions.push('This is an optimal booking timeframe for good vendor availability and rates.');
    }

  } catch (error) {
    errors.push('Error processing date validation.');
    console.error('Date validation error:', error);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function getWeddingDateInfo(date: string): WeddingDateInfo {
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Reset time to start of day
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysUntilEvent = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const monthsUntilEvent = Math.ceil(daysUntilEvent / 30.44);

  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  
  // Determine season
  const month = selectedDate.getMonth() + 1;
  let season: 'spring' | 'summer' | 'fall' | 'winter';
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'fall';
  else season = 'winter';

  // Check if holiday
  const allHolidays = [...HOLIDAYS_2024, ...HOLIDAYS_2025];
  const isHoliday = allHolidays.includes(date);

  // Check if peak season
  const isPeakSeason = [6, 7, 8, 12].includes(month);

  return {
    date,
    dayOfWeek,
    season,
    isWeekend,
    isHoliday,
    isPeakSeason,
    daysUntilEvent,
    monthsUntilEvent,
  };
}

export function suggestWeddingDates(
  startDate: string,
  endDate: string,
  constraints: DateConstraints,
  count: number = 5
): string[] {
  const suggestions: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const currentDate = new Date(start);
  
  while (currentDate <= end && suggestions.length < count) {
    const dateString = currentDate.toISOString().split('T')[0];
    const validation = validateWeddingDate(dateString, constraints);
    
    if (validation.isValid && validation.warnings.length === 0) {
      suggestions.push(dateString);
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return suggestions;
}

export function calculateOptimalBookingTime(
  weddingDate: string,
  vendorType: 'venue' | 'photographer' | 'caterer' | 'musician' | 'decorator'
): {
  recommendedBookingTime: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  message: string;
} {
  const wedding = new Date(weddingDate);
  const today = new Date();
  const monthsUntilWedding = (wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  const bookingTimelines = {
    venue: { critical: 12, high: 9, medium: 6, low: 3 },
    photographer: { critical: 9, high: 6, medium: 4, low: 2 },
    caterer: { critical: 8, high: 6, medium: 4, low: 2 },
    musician: { critical: 6, high: 4, medium: 3, low: 1 },
    decorator: { critical: 4, high: 3, medium: 2, low: 1 },
  };

  const timeline = bookingTimelines[vendorType];
  let urgency: 'low' | 'medium' | 'high' | 'critical';
  let message: string;

  if (monthsUntilWedding <= timeline.critical) {
    urgency = 'critical';
    message = `Book ${vendorType} immediately! Availability is extremely limited.`;
  } else if (monthsUntilWedding <= timeline.high) {
    urgency = 'high';
    message = `Book ${vendorType} soon. Good vendors are filling up fast.`;
  } else if (monthsUntilWedding <= timeline.medium) {
    urgency = 'medium';
    message = `Good time to book ${vendorType}. You have decent options available.`;
  } else {
    urgency = 'low';
    message = `You have plenty of time to book ${vendorType}. Take your time choosing.`;
  }

  const recommendedDate = new Date(wedding);
  recommendedDate.setMonth(wedding.getMonth() - timeline.high);
  const recommendedBookingTime = recommendedDate.toISOString().split('T')[0];

  return {
    recommendedBookingTime,
    urgency,
    message,
  };
} 

// Format date for display
export function formatDate(date: Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  if (format === 'full') {
    options.weekday = 'long';
  }

  return date.toLocaleDateString('en-US', options);
} 