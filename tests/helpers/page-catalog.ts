import { UserRole } from './browser-helpers';

export interface PageInfo {
  path: string;
  title?: string;
  requiresAuth: boolean;
  allowedRoles?: UserRole[];
  description?: string;
  category: 'public' | 'dashboard' | 'admin' | 'vendor' | 'planner' | 'user' | 'api';
}

/**
 * Comprehensive page catalog with RBAC requirements
 */
export const PAGE_CATALOG: PageInfo[] = [
  // Public Pages
  { path: '/', title: 'Home', requiresAuth: false, category: 'public' },
  { path: '/login', title: 'Login', requiresAuth: false, category: 'public' },
  { path: '/register', title: 'Register', requiresAuth: false, category: 'public' },
  { path: '/simple-login', title: 'Simple Login', requiresAuth: false, category: 'public' },
  { path: '/about', title: 'About', requiresAuth: false, category: 'public' },
  { path: '/contact', title: 'Contact', requiresAuth: false, category: 'public' },
  { path: '/features', title: 'Features', requiresAuth: false, category: 'public' },
  { path: '/vendors', title: 'Vendors', requiresAuth: false, category: 'public' },
  { path: '/venues', title: 'Venues', requiresAuth: false, category: 'public' },
  { path: '/gallery', title: 'Gallery', requiresAuth: false, category: 'public' },
  { path: '/packages', title: 'Packages', requiresAuth: false, category: 'public' },
  { path: '/planning', title: 'Planning', requiresAuth: false, category: 'public' },
  { path: '/premium', title: 'Premium', requiresAuth: false, category: 'public' },
  { path: '/subscription', title: 'Subscription', requiresAuth: false, category: 'public' },
  { path: '/roadmap', title: 'Roadmap', requiresAuth: false, category: 'public' },
  { path: '/privacy', title: 'Privacy', requiresAuth: false, category: 'public' },
  { path: '/terms', title: 'Terms', requiresAuth: false, category: 'public' },
  { path: '/help', title: 'Help', requiresAuth: false, category: 'public' },
  { path: '/status', title: 'Status', requiresAuth: false, category: 'public' },
  { path: '/forgot-password', title: 'Forgot Password', requiresAuth: false, category: 'public' },
  { path: '/reset-password', title: 'Reset Password', requiresAuth: false, category: 'public' },
  { path: '/verify-email', title: 'Verify Email', requiresAuth: false, category: 'public' },
  { path: '/unauthorized', title: 'Unauthorized', requiresAuth: false, category: 'public' },
  { path: '/offline', title: 'Offline', requiresAuth: false, category: 'public' },

  // Auth Pages
  { path: '/auth/error', title: 'Auth Error', requiresAuth: false, category: 'public' },
  { path: '/auth/forgot-password', title: 'Forgot Password', requiresAuth: false, category: 'public' },
  { path: '/auth/reset-password', title: 'Reset Password', requiresAuth: false, category: 'public' },
  { path: '/auth/verify-email', title: 'Verify Email', requiresAuth: false, category: 'public' },

  // Common Dashboard Pages (All authenticated users)
  { path: '/dashboard', title: 'Dashboard', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/profile', title: 'Profile', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/settings', title: 'Settings', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/bookings', title: 'Bookings', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/messages', title: 'Messages', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/payments', title: 'Payments', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/dashboard/subscription', title: 'Subscription', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },

  // User-Specific Pages
  { path: '/dashboard/planning', title: 'Planning', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/favorites', title: 'Favorites', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/user', title: 'User Dashboard', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/user/profile', title: 'User Profile', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/user/bookings', title: 'User Bookings', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/user/favorites', title: 'User Favorites', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/dashboard/user/budget', title: 'User Budget', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/favorites', title: 'Favorites', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/search', title: 'Search', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/search-results', title: 'Search Results', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/profile', title: 'Profile', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/messages', title: 'Messages', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/timeline', title: 'Timeline', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/budget-planner', title: 'Budget Planner', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/enhanced-feed', title: 'Enhanced Feed', requiresAuth: true, allowedRoles: ['user'], category: 'user' },

  // Vendor-Specific Pages
  { path: '/dashboard/vendor', title: 'Vendor Dashboard', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/services', title: 'Vendor Services', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/analytics', title: 'Vendor Analytics', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/boost-campaigns', title: 'Boost Campaigns', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/bookings', title: 'Vendor Bookings', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/portfolio', title: 'Vendor Portfolio', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/availability', title: 'Vendor Availability', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/dashboard/vendor/onboarding', title: 'Vendor Onboarding', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/vendor/register', title: 'Vendor Registration', requiresAuth: false, category: 'public' },

  // Wedding Planner-Specific Pages
  { path: '/dashboard/planner', title: 'Planner Dashboard', requiresAuth: true, allowedRoles: ['wedding_planner'], category: 'planner' },
  { path: '/dashboard/planner/clients', title: 'Planner Clients', requiresAuth: true, allowedRoles: ['wedding_planner'], category: 'planner' },
  { path: '/dashboard/planner/tasks', title: 'Planner Tasks', requiresAuth: true, allowedRoles: ['wedding_planner'], category: 'planner' },
  { path: '/dashboard/planner/timeline', title: 'Planner Timeline', requiresAuth: true, allowedRoles: ['wedding_planner'], category: 'planner' },

  // Admin-Specific Pages
  { path: '/dashboard/admin', title: 'Admin Dashboard', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/dashboard/admin/users', title: 'Admin Users', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/dashboard/admin/vendors', title: 'Admin Vendors', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/dashboard/admin/reports', title: 'Admin Reports', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/dashboard/admin/analytics', title: 'Admin Analytics', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/dashboard/admin/settings', title: 'Admin Settings', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/admin/dashboard', title: 'Admin Dashboard', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/admin/users', title: 'Admin Users', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/admin/seed', title: 'Admin Seed', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/admin/reset-database', title: 'Admin Reset Database', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/admin/comprehensive-seed', title: 'Admin Comprehensive Seed', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },

  // Booking Pages
  { path: '/booking/:id', title: 'Booking Details', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/booking/confirmation/:id', title: 'Booking Confirmation', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/checkout', title: 'Checkout', requiresAuth: true, allowedRoles: ['user'], category: 'user' },

  // Payment Pages
  { path: '/payments/success', title: 'Payment Success', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/payments/cancel', title: 'Payment Cancel', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },
  { path: '/payments/history', title: 'Payment History', requiresAuth: true, allowedRoles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], category: 'dashboard' },

  // Vendor/Venue Detail Pages
  { path: '/vendors/:id', title: 'Vendor Details', requiresAuth: false, category: 'public' },
  { path: '/venues/:id', title: 'Venue Details', requiresAuth: false, category: 'public' },
  { path: '/packages/:id', title: 'Package Details', requiresAuth: false, category: 'public' },
  { path: '/packages/:id/book', title: 'Book Package', requiresAuth: true, allowedRoles: ['user'], category: 'user' },
  { path: '/packages/compare', title: 'Compare Packages', requiresAuth: false, category: 'public' },
  { path: '/packages/custom', title: 'Custom Package', requiresAuth: true, allowedRoles: ['user'], category: 'user' },

  // Feature Pages
  { path: '/features/ai-enhancements', title: 'AI Enhancements', requiresAuth: false, category: 'public' },
  { path: '/features/collaboration', title: 'Collaboration', requiresAuth: false, category: 'public' },
  { path: '/features/mobile-app', title: 'Mobile App', requiresAuth: false, category: 'public' },
  { path: '/features/performance', title: 'Performance', requiresAuth: false, category: 'public' },
  { path: '/features/personalization', title: 'Personalization', requiresAuth: false, category: 'public' },
  { path: '/features/scheduling', title: 'Scheduling', requiresAuth: false, category: 'public' },
  { path: '/features/security', title: 'Security', requiresAuth: false, category: 'public' },

  // Other Pages
  { path: '/ai-wedding-planner', title: 'AI Wedding Planner', requiresAuth: false, category: 'public' },
  { path: '/mobile-pwa', title: 'Mobile PWA', requiresAuth: false, category: 'public' },
  { path: '/photo-review', title: 'Photo Review', requiresAuth: true, allowedRoles: ['user', 'vendor'], category: 'dashboard' },
  { path: '/review-reply', title: 'Review Reply', requiresAuth: true, allowedRoles: ['vendor'], category: 'vendor' },
  { path: '/debug-runtime', title: 'Debug Runtime', requiresAuth: true, allowedRoles: ['admin', 'maintainer'], category: 'admin' },
  { path: '/test', title: 'Test', requiresAuth: false, category: 'public' },
  { path: '/test/comprehensive', title: 'Comprehensive Test', requiresAuth: false, category: 'public' },
  { path: '/test-auth', title: 'Test Auth', requiresAuth: false, category: 'public' },
  { path: '/test-credentials', title: 'Test Credentials', requiresAuth: false, category: 'public' },
];

/**
 * Get pages by category
 */
export function getPagesByCategory(category: PageInfo['category']): PageInfo[] {
  return PAGE_CATALOG.filter(page => page.category === category);
}

/**
 * Get pages by role
 */
export function getPagesByRole(role: UserRole): PageInfo[] {
  return PAGE_CATALOG.filter(page => {
    if (!page.requiresAuth) return true; // Public pages
    if (!page.allowedRoles) return true; // Pages without specific role restrictions
    return page.allowedRoles.includes(role);
  });
}

/**
 * Get public pages
 */
export function getPublicPages(): PageInfo[] {
  return PAGE_CATALOG.filter(page => !page.requiresAuth);
}

/**
 * Get protected pages
 */
export function getProtectedPages(): PageInfo[] {
  return PAGE_CATALOG.filter(page => page.requiresAuth);
}

/**
 * Get pages that should be denied for a role
 */
export function getDeniedPagesForRole(role: UserRole): PageInfo[] {
  return PAGE_CATALOG.filter(page => {
    if (!page.requiresAuth) return false; // Public pages are not denied
    if (!page.allowedRoles) return false; // Pages without restrictions are not denied
    return !page.allowedRoles.includes(role);
  });
}

/**
 * Check if a page is accessible for a role
 */
export function isPageAccessibleForRole(path: string, role: UserRole): boolean {
  const page = PAGE_CATALOG.find(p => p.path === path || path.startsWith(p.path));
  if (!page) return false; // Unknown page
  if (!page.requiresAuth) return true; // Public page
  if (!page.allowedRoles) return true; // No role restrictions
  return page.allowedRoles.includes(role);
}

/**
 * Get all API routes (for testing)
 */
export const API_ROUTES = [
  // Auth APIs
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/signout',
  '/api/auth/me',
  '/api/login',
  '/api/register',
  '/api/simple-auth',
  
  // Dashboard APIs
  '/api/dashboard/stats',
  '/api/dashboard/user/stats',
  '/api/dashboard/vendor/stats',
  '/api/dashboard/admin/stats',
  '/api/dashboard/activity',
  
  // User APIs
  '/api/users',
  '/api/user/profile',
  '/api/user/bookings',
  
  // Vendor APIs
  '/api/vendors',
  '/api/vendors/search',
  '/api/vendor/services',
  '/api/vendor/analytics',
  
  // Venue APIs
  '/api/venues',
  '/api/venues/search',
  
  // Booking APIs
  '/api/bookings',
  '/api/bookings/:id',
  
  // Payment APIs
  '/api/payments',
  '/api/payments/:id',
  
  // Health/Status APIs
  '/api/health',
  '/api/status',
  '/api/simple-health',
];

