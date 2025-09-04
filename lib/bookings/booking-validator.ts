// Booking Validator for WeddingLK
// Validates booking requests against business rules

export interface BookingRequest {
  venueId: string;
  userId: string;
  date: string;
  guestCount: number;
  startTime: string;
  endTime: string;
  specialRequirements?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  availableDates: string[];
  minimumNotice: number; // days
  maximumAdvanceBooking: number; // days
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  hasCompletedProfile: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export function validateBookingRequest(
  request: BookingRequest,
  venue: Venue,
  user: User
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!request.venueId || !request.userId || !request.date) {
    errors.push('Missing required fields: venueId, userId, and date are required');
  }

  if (request.guestCount <= 0) {
    errors.push('Guest count must be greater than 0');
  }

  if (request.guestCount > venue.capacity) {
    errors.push('Guest count exceeds venue capacity');
  }

  // Date validation
  const selectedDate = new Date(request.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    errors.push('Cannot book dates in the past');
  }

  // Check if date is available
  if (!venue.availableDates.includes(request.date)) {
    errors.push('Selected date is not available');
  }

  // Notice period validation
  const daysUntilEvent = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEvent < venue.minimumNotice) {
    errors.push('Insufficient notice period');
  }

  if (daysUntilEvent > venue.maximumAdvanceBooking) {
    errors.push('Cannot book more than 1 year in advance');
  }

  // Time validation
  const startTime = request.startTime;
  const endTime = request.endTime;
  
  if (startTime >= endTime) {
    errors.push('Start time must be before end time');
  }

  // User validation
  if (!user.verified) {
    errors.push('User account must be verified to make bookings');
  }

  if (!user.hasCompletedProfile) {
    warnings.push('Complete your profile for better booking experience');
  }

  // Business hours validation (assuming 6 AM to 2 AM next day)
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  
  if (startHour < 6 || startHour > 23) {
    errors.push('Start time must be between 6:00 AM and 11:00 PM');
  }

  if (endHour < 7 || endHour > 24) {
    errors.push('End time must be between 7:00 AM and 2:00 AM');
  }

  // Special requirements length validation
  if (request.specialRequirements && request.specialRequirements.length > 500) {
    errors.push('Special requirements must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// Additional validation functions
export function validateBookingModification(
  originalBooking: any,
  modifications: Partial<BookingRequest>,
  venue: Venue
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if modification is within allowed timeframe
  const eventDate = new Date(originalBooking.date);
  const today = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilEvent < 7) {
    errors.push('Cannot modify booking within 7 days of event');
  }

  // Validate modified fields
  if (modifications.guestCount) {
    if (modifications.guestCount > venue.capacity) {
      errors.push('Modified guest count exceeds venue capacity');
    }
  }

  if (modifications.date) {
    const newDate = new Date(modifications.date);
    if (newDate < today) {
      errors.push('Cannot change to a date in the past');
    }
    
    if (!venue.availableDates.includes(modifications.date)) {
      errors.push('New date is not available');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

export function validateCancellation(
  booking: any,
  cancellationReason?: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const eventDate = new Date(booking.date);
  const today = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Check cancellation policy
  if (daysUntilEvent < 30) {
    errors.push('Cannot cancel booking within 30 days of event');
  }

  if (daysUntilEvent < 60) {
    warnings.push('Cancellation within 60 days may incur fees');
  }

  if (!cancellationReason || cancellationReason.trim().length < 10) {
    warnings.push('Please provide a detailed cancellation reason');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// Advanced booking validation with pricing
export interface PricingInfo {
  basePrice: number;
  guestCount: number;
  date: string;
  duration: number; // hours
  peakSeason: boolean;
  weekend: boolean;
}

export function calculateBookingPrice(pricing: PricingInfo): {
  basePrice: number;
  guestSurcharge: number;
  peakSeasonMultiplier: number;
  weekendMultiplier: number;
  durationMultiplier: number;
  totalPrice: number;
  breakdown: {
    base: number;
    guestSurcharge: number;
    peakSeason: number;
    weekend: number;
    duration: number;
    total: number;
  };
} {
  const { basePrice, guestCount, date, duration, peakSeason, weekend } = pricing;
  
  // Guest count surcharge (after 50 guests)
  const guestSurcharge = guestCount > 50 ? (guestCount - 50) * 500 : 0;
  
  // Peak season multiplier (December to March)
  const eventDate = new Date(date);
  const month = eventDate.getMonth();
  const isPeakSeason = month >= 11 || month <= 2; // Dec, Jan, Feb, Mar
  const peakSeasonMultiplier = isPeakSeason ? 1.5 : 1.0;
  
  // Weekend multiplier
  const dayOfWeek = eventDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  const weekendMultiplier = isWeekend ? 1.3 : 1.0;
  
  // Duration multiplier (after 8 hours)
  const durationMultiplier = duration > 8 ? 1.2 : 1.0;
  
  // Calculate total
  const base = basePrice;
  const guestSurchargeAmount = guestSurcharge;
  const peakSeasonAmount = base * (peakSeasonMultiplier - 1);
  const weekendAmount = base * (weekendMultiplier - 1);
  const durationAmount = base * (durationMultiplier - 1);
  
  const totalPrice = base + guestSurchargeAmount + peakSeasonAmount + weekendAmount + durationAmount;
  
  return {
    basePrice,
    guestSurcharge,
    peakSeasonMultiplier,
    weekendMultiplier,
    durationMultiplier,
    totalPrice,
    breakdown: {
      base,
      guestSurcharge: guestSurchargeAmount,
      peakSeason: peakSeasonAmount,
      weekend: weekendAmount,
      duration: durationAmount,
      total: totalPrice
    }
  };
}

// Availability checker
export function checkVenueAvailability(
  venueId: string,
  date: string,
  startTime: string,
  endTime: string,
  existingBookings: any[]
): { available: boolean; conflicts: any[] } {
  const conflicts = existingBookings.filter(booking => {
    if (booking.venueId !== venueId || booking.date !== date) {
      return false;
    }
    
    const bookingStart = booking.startTime;
    const bookingEnd = booking.endTime;
    
    // Check for time overlap
    return (
      (startTime < bookingEnd && endTime > bookingStart) ||
      (startTime === bookingStart && endTime === bookingEnd)
    );
  });
  
  return {
    available: conflicts.length === 0,
    conflicts
  };
}

// Booking capacity validator
export function validateBookingCapacity(
  venueCapacity: number,
  guestCount: number,
  vendorCount: number = 0
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const totalOccupancy = guestCount + vendorCount;
  
  if (totalOccupancy > venueCapacity) {
    errors.push(`Total occupancy (${totalOccupancy}) exceeds venue capacity (${venueCapacity})`);
  }
  
  // Safety margin warning
  if (totalOccupancy > venueCapacity * 0.9) {
    warnings.push('Venue is at 90% capacity - consider alternative arrangements');
  }
  
  // Minimum occupancy check
  if (guestCount < 10) {
    warnings.push('Very low guest count - some venues may have minimum requirements');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
} 