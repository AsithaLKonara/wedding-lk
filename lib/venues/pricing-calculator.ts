// Venue Pricing Calculator for WeddingLK
// Calculates pricing for venue bookings with various factors

export interface BasePricing {
  basePrice: number;
  perGuestPrice: number;
  minimumGuests: number;
  maximumGuests: number;
}

export interface PricingFactors {
  date: string;
  guestCount: number;
  duration: number; // hours
  dayOfWeek: 'weekday' | 'weekend' | 'holiday';
  season: 'peak' | 'offPeak' | 'shoulder';
  services: string[];
  addOns: string[];
}

export interface PricingBreakdown {
  baseCost: number;
  guestCost: number;
  durationCost: number;
  seasonalAdjustment: number;
  serviceCosts: number;
  addOnCosts: number;
  taxes: number;
  totalCost: number;
  breakdown: {
    base: number;
    guests: number;
    duration: number;
    seasonal: number;
    services: number;
    addOns: number;
    taxes: number;
  };
}

export interface SeasonalRates {
  peak: number; // multiplier
  offPeak: number; // multiplier
  shoulder: number; // multiplier
}

export interface ServicePricing {
  [key: string]: number;
}

export interface AddOnPricing {
  [key: string]: number;
}

const DEFAULT_SEASONAL_RATES: SeasonalRates = {
  peak: 1.3,      // 30% increase
  offPeak: 0.8,   // 20% decrease
  shoulder: 1.0,  // no change
};

const DEFAULT_SERVICE_PRICING: ServicePricing = {
  catering: 45,           // per guest
  decoration: 15,         // per guest
  music: 500,             // flat rate
  photography: 800,        // flat rate
  videography: 1200,      // flat rate
  transportation: 300,     // flat rate
  security: 200,          // flat rate
  cleaning: 150,          // flat rate
};

const DEFAULT_ADDON_PRICING: AddOnPricing = {
  'early-setup': 100,     // flat rate
  'late-cleanup': 100,    // flat rate
  'parking': 50,          // flat rate
  'valet': 200,           // flat rate
  'coat-check': 75,       // flat rate
  'wifi': 50,             // flat rate
  'av-equipment': 150,    // flat rate
  'backup-generator': 300, // flat rate
};

export function calculateVenuePricing(
  basePricing: BasePricing,
  factors: PricingFactors,
  seasonalRates: SeasonalRates = DEFAULT_SEASONAL_RATES,
  servicePricing: ServicePricing = DEFAULT_SERVICE_PRICING,
  addOnPricing: AddOnPricing = DEFAULT_ADDON_PRICING
): PricingBreakdown {
  // Validate inputs
  if (factors.guestCount < basePricing.minimumGuests) {
    throw new Error(`Guest count must be at least ${basePricing.minimumGuests}`);
  }

  if (factors.guestCount > basePricing.maximumGuests) {
    throw new Error(`Guest count cannot exceed ${basePricing.maximumGuests}`);
  }

  // Calculate base costs
  const baseCost = basePricing.basePrice;
  const guestCost = Math.max(0, factors.guestCount - basePricing.minimumGuests) * basePricing.perGuestPrice;
  
  // Duration cost (additional hours beyond 4 hours)
  const baseDuration = 4;
  const additionalHours = Math.max(0, factors.duration - baseDuration);
  const durationCost = additionalHours * (basePricing.basePrice * 0.15); // 15% of base price per additional hour

  // Seasonal adjustment
  const seasonalMultiplier = seasonalRates[factors.season];
  const seasonalAdjustment = (baseCost + guestCost) * (seasonalMultiplier - 1);

  // Service costs
  const serviceCosts = (factors.services || []).reduce((total, service) => {
    const price = servicePricing[service];
    if (price) {
      return total + (service === 'catering' || service === 'decoration' ? price * factors.guestCount : price);
    }
    return total;
  }, 0);

  // Add-on costs
  const addOnCosts = (factors.addOns || []).reduce((total, addOn) => {
    const price = addOnPricing[addOn];
    return total + (price || 0);
  }, 0);

  // Calculate subtotal
  const subtotal = baseCost + guestCost + durationCost + seasonalAdjustment + serviceCosts + addOnCosts;

  // Calculate taxes (assuming 15% tax rate)
  const taxRate = 0.15;
  const taxes = subtotal * taxRate;

  // Calculate total
  const totalCost = subtotal + taxes;

  return {
    baseCost,
    guestCost,
    durationCost,
    seasonalAdjustment,
    serviceCosts,
    addOnCosts,
    taxes,
    totalCost,
    breakdown: {
      base: baseCost,
      guests: guestCost,
      duration: durationCost,
      seasonal: seasonalAdjustment,
      services: serviceCosts,
      addOns: addOnCosts,
      taxes,
    },
  };
}

// Helper function to determine season based on date
export function determineSeason(date: string): 'peak' | 'offPeak' | 'shoulder' {
  const month = new Date(date).getMonth() + 1;
  
  // Peak season: December, January, February, June, July, August
  if ([12, 1, 2, 6, 7, 8].includes(month)) {
    return 'peak';
  }
  
  // Off-peak season: November, March
  if ([11, 3].includes(month)) {
    return 'offPeak';
  }
  
  // Shoulder season: April, May, September, October
  return 'shoulder';
}

// Helper function to determine day type
export function determineDayType(date: string): 'weekday' | 'weekend' | 'holiday' {
  const dayOfWeek = new Date(date).getDay();
  
  // Weekend: Saturday (6) or Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'weekend';
  }
  
  // Check for holidays (simplified list)
  const holidays = [
    '01-01', // New Year's Day
    '07-04', // Independence Day
    '12-25', // Christmas
    '11-28', // Thanksgiving (simplified)
  ];
  
  const monthDay = `${String(new Date(date).getMonth() + 1).padStart(2, '0')}-${String(new Date(date).getDate()).padStart(2, '0')}`;
  
  if (holidays.includes(monthDay)) {
    return 'holiday';
  }
  
  return 'weekday';
}

// Calculate discount for early booking
export function calculateEarlyBookingDiscount(
  eventDate: string,
  bookingDate: string,
  baseDiscount: number = 0.05 // 5% base discount
): number {
  const event = new Date(eventDate);
  const booking = new Date(bookingDate);
  const monthsInAdvance = (event.getTime() - booking.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  
  if (monthsInAdvance >= 12) {
    return baseDiscount + 0.05; // 10% for 12+ months
  } else if (monthsInAdvance >= 6) {
    return baseDiscount + 0.03; // 8% for 6+ months
  } else if (monthsInAdvance >= 3) {
    return baseDiscount; // 5% for 3+ months
  }
  
  return 0; // No discount for bookings less than 3 months in advance
}

// Calculate package pricing
export function calculatePackagePricing(
  basePricing: BasePricing,
  packageType: 'basic' | 'standard' | 'premium' | 'luxury',
  guestCount: number
): number {
  const packageMultipliers = {
    basic: 1.0,
    standard: 1.2,
    premium: 1.5,
    luxury: 2.0,
  };
  
  const basePrice = calculateVenuePricing(basePricing, {
    date: new Date().toISOString().split('T')[0],
    guestCount,
    duration: 6,
    dayOfWeek: 'weekend',
    season: 'peak',
    services: [],
    addOns: [],
  });
  
  return basePrice.totalCost * packageMultipliers[packageType];
} 