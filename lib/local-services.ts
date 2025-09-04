import LocalDatabase from './local-database';

// Generic service interface
export interface LocalService<T> {
  getAll(): T[];
  getById(id: string): T | null;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T | null;
  update(id: string, data: Partial<T>): T | null;
  delete(id: string): boolean;
  search(query: string, fields: string[]): T[];
  getByField(field: string, value: any): T[];
}

// Base service class
export class BaseLocalService<T extends { id: string }> implements LocalService<T> {
  constructor(private tableName: keyof typeof LocalDatabase) {}

  getAll(): T[] {
    return LocalDatabase.read<T>(this.tableName);
  }

  getById(id: string): T | null {
    return LocalDatabase.readById<T>(this.tableName, id);
  }

  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T | null {
    return LocalDatabase.create<T>(this.tableName, data);
  }

  update(id: string, data: Partial<T>): T | null {
    return LocalDatabase.update<T>(this.tableName, id, data);
  }

  delete(id: string): boolean {
    return LocalDatabase.delete<T>(this.tableName, id);
  }

  search(query: string, fields: string[]): T[] {
    return LocalDatabase.search<T>(this.tableName, query, fields);
  }

  getByField(field: string, value: any): T[] {
    return LocalDatabase.readByField<T>(this.tableName, field, value);
  }

  count(): number {
    return LocalDatabase.count(this.tableName);
  }

  paginate(page: number = 1, limit: number = 10) {
    return LocalDatabase.paginate<T>(this.tableName, page, limit);
  }
}

// User Service
export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  location: {
    country: string;
    state: string;
    city: string;
    zipCode?: string;
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
  createdAt: string;
  updatedAt: string;
}

export class UserService extends BaseLocalService<LocalUser> {
  constructor() {
    super('users');
  }

  getByEmail(email: string): LocalUser | null {
    const users = this.getByField('email', email.toLowerCase());
    return users.length > 0 ? users[0] : null;
  }

  getByRole(role: string): LocalUser[] {
    return this.getByField('role', role);
  }

  getActiveUsers(): LocalUser[] {
    return this.getByField('isActive', true);
  }

  getVerifiedUsers(): LocalUser[] {
    return this.getByField('isVerified', true);
  }
}

// Vendor Service
export interface LocalVendor {
  id: string;
  name: string;
  businessName: string;
  category: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    serviceAreas: string[];
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  services: Array<{
    name: string;
    description: string;
    price: number;
    duration: string;
  }>;
  pricing: {
    startingPrice: number;
    currency: string;
  };
  rating: {
    average: number;
    count: number;
  };
  owner: string;
  isVerified: boolean;
  isActive: boolean;
  images?: string[];
  socialMedia?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class VendorService extends BaseLocalService<LocalVendor> {
  constructor() {
    super('vendors');
  }

  getByCategory(category: string): LocalVendor[] {
    return this.getByField('category', category);
  }

  getByLocation(city: string): LocalVendor[] {
    return this.getAll().filter(vendor => 
      vendor.location.city.toLowerCase().includes(city.toLowerCase()) ||
      vendor.location.serviceAreas.some(area => 
        area.toLowerCase().includes(city.toLowerCase())
      )
    );
  }

  getVerifiedVendors(): LocalVendor[] {
    return this.getByField('isVerified', true);
  }

  getActiveVendors(): LocalVendor[] {
    return this.getByField('isActive', true);
  }

  searchVendors(query: string): LocalVendor[] {
    return this.search(query, ['name', 'businessName', 'description', 'category']);
  }
}

// Venue Service
export interface LocalVenue {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: {
    min: number;
    max: number;
  };
  amenities: string[];
  pricing: {
    startingPrice: number;
    currency: string;
  };
  rating: {
    average: number;
    count: number;
  };
  owner: string;
  isVerified: boolean;
  isActive: boolean;
  images?: string[];
  packages?: Array<{
    name: string;
    description: string;
    price: number;
    includes: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export class VenueService extends BaseLocalService<LocalVenue> {
  constructor() {
    super('venues');
  }

  getByLocation(city: string): LocalVenue[] {
    return this.getByField('city', city);
  }

  getByCapacity(minCapacity: number, maxCapacity?: number): LocalVenue[] {
    return this.getAll().filter(venue => {
      if (maxCapacity) {
        return venue.capacity.min >= minCapacity && venue.capacity.max <= maxCapacity;
      }
      return venue.capacity.min >= minCapacity;
    });
  }

  getVerifiedVenues(): LocalVenue[] {
    return this.getByField('isVerified', true);
  }

  getActiveVenues(): LocalVenue[] {
    return this.getByField('isActive', true);
  }

  searchVenues(query: string): LocalVenue[] {
    return this.search(query, ['name', 'description', 'location.city', 'amenities']);
  }
}

// Booking Service
export interface LocalBooking {
  id: string;
  client: string;
  vendor: string;
  venue: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'completed';
  specialRequirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class BookingService extends BaseLocalService<LocalBooking> {
  constructor() {
    super('bookings');
  }

  getByClient(clientId: string): LocalBooking[] {
    return this.getByField('client', clientId);
  }

  getByVendor(vendorId: string): LocalBooking[] {
    return this.getByField('vendor', vendorId);
  }

  getByVenue(venueId: string): LocalBooking[] {
    return this.getByField('venue', venueId);
  }

  getByStatus(status: string): LocalBooking[] {
    return this.getByField('status', status);
  }

  getByDateRange(startDate: string, endDate: string): LocalBooking[] {
    return this.getAll().filter(booking => {
      const bookingDate = new Date(booking.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return bookingDate >= start && bookingDate <= end;
    });
  }
}

// Review Service
export interface LocalReview {
  id: string;
  client: string;
  vendor?: string;
  venue?: string;
  booking?: string;
  rating: number;
  review: string;
  isVerified: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export class ReviewService extends BaseLocalService<LocalReview> {
  constructor() {
    super('reviews');
  }

  getByVendor(vendorId: string): LocalReview[] {
    return this.getByField('vendor', vendorId);
  }

  getByVenue(venueId: string): LocalReview[] {
    return this.getByField('venue', venueId);
  }

  getByRating(minRating: number): LocalReview[] {
    return this.getAll().filter(review => review.rating >= minRating);
  }

  getVerifiedReviews(): LocalReview[] {
    return this.getByField('isVerified', true);
  }

  getAverageRating(vendorId?: string, venueId?: string): number {
    let reviews = this.getAll();
    
    if (vendorId) {
      reviews = reviews.filter(review => review.vendor === vendorId);
    }
    
    if (venueId) {
      reviews = reviews.filter(review => review.venue === venueId);
    }
    
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}

// Task Service
export interface LocalTask {
  id: string;
  title: string;
  description: string;
  client: string;
  planner: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimatedHours: number;
  actualHours: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class TaskService extends BaseLocalService<LocalTask> {
  constructor() {
    super('tasks');
  }

  getByClient(clientId: string): LocalTask[] {
    return this.getByField('client', clientId);
  }

  getByPlanner(plannerId: string): LocalTask[] {
    return this.getByField('planner', plannerId);
  }

  getByStatus(status: string): LocalTask[] {
    return this.getByField('status', status);
  }

  getByCategory(category: string): LocalTask[] {
    return this.getByField('category', category);
  }

  getByPriority(priority: string): LocalTask[] {
    return this.getByField('priority', priority);
  }

  getOverdueTasks(): LocalTask[] {
    const now = new Date();
    return this.getAll().filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status !== 'completed';
    });
  }
}

// Payment Service
export interface LocalPayment {
  id: string;
  booking: string;
  client: string;
  vendor: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentService extends BaseLocalService<LocalPayment> {
  constructor() {
    super('payments');
  }

  getByClient(clientId: string): LocalPayment[] {
    return this.getByField('client', clientId);
  }

  getByVendor(vendorId: string): LocalPayment[] {
    return this.getByField('vendor', vendorId);
  }

  getByStatus(status: string): LocalPayment[] {
    return this.getByField('status', status);
  }

  getByBooking(bookingId: string): LocalPayment[] {
    return this.getByField('booking', bookingId);
  }

  getTotalRevenue(vendorId?: string): number {
    let payments = this.getByField('status', 'completed');
    
    if (vendorId) {
      payments = payments.filter(payment => payment.vendor === vendorId);
    }
    
    return payments.reduce((total, payment) => total + payment.amount, 0);
  }
}

// Export service instances
export const userService = new UserService();
export const vendorService = new VendorService();
export const venueService = new VenueService();
export const bookingService = new BookingService();
export const reviewService = new ReviewService();
export const taskService = new TaskService();
export const paymentService = new PaymentService();

// Export all services
export const localServices = {
  users: userService,
  vendors: vendorService,
  venues: venueService,
  bookings: bookingService,
  reviews: reviewService,
  tasks: taskService,
  payments: paymentService
};

export default localServices;
