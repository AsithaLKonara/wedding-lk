# Route & Feature Inventory

## Overview
This document provides a comprehensive inventory of all routes, pages, and API endpoints in the WeddingLK project, along with their implementation status, security measures, and missing components.

## Public Routes

| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/` | page | ✅ Exists | No | Public | N/A | Static | Home page with featured content |
| `/login` | page | ✅ Exists | No | Public | N/A | Static | Login page |
| `/register` | page | ✅ Exists | No | Public | N/A | Static | Registration page |
| `/forgot-password` | page | ✅ Exists | No | Public | N/A | Static | Password reset request |
| `/reset-password` | page | ✅ Exists | No | Public | N/A | Static | Password reset form |
| `/vendors` | page | ✅ Exists | No | Public | N/A | API | Vendor listing page |
| `/vendors/[id]` | page | ✅ Exists | No | Public | N/A | API | Vendor detail page |
| `/venues` | page | ✅ Exists | No | Public | N/A | API | Venue listing page |
| `/venues/[id]` | page | ✅ Exists | No | Public | N/A | API | Venue detail page |
| `/features` | page | ✅ Exists | No | Public | N/A | Static | Features showcase |
| `/about` | page | ✅ Exists | No | Public | N/A | Static | About page |
| `/contact` | page | ✅ Exists | No | Public | N/A | Static | Contact page |
| `/gallery` | page | ✅ Exists | No | Public | N/A | API | Gallery page |
| `/favorites` | page | ✅ Exists | No | Public | N/A | API | Public favorites (if any) |

## Authentication Routes

| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/auth/signin` | page | ✅ Exists | No | Public | N/A | NextAuth | Sign in page |
| `/auth/error` | page | ✅ Exists | No | Public | N/A | NextAuth | Auth error page |
| `/api/auth/[...nextauth]` | api | ✅ Exists | No | Public | N/A | NextAuth | NextAuth API routes |
| `/api/auth/register` | api | ✅ Exists | No | Public | N/A | MongoDB | User registration |
| `/api/auth/forgot-password` | api | ✅ Exists | No | Public | N/A | MongoDB | Password reset request |
| `/api/auth/reset-password` | api | ✅ Exists | No | Public | N/A | MongoDB | Password reset |
| `/api/auth/verify-email` | api | ✅ Exists | No | Public | N/A | MongoDB | Email verification |

## Dashboard Routes

### Admin Dashboard
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/dashboard/admin` | page | ✅ Exists | Yes | admin | middleware + API | API | Admin dashboard home |
| `/dashboard/admin/users` | page | ✅ Exists | Yes | admin | middleware + API | API | User management |
| `/dashboard/admin/vendors` | page | ✅ Exists | Yes | admin | middleware + API | API | Vendor management |
| `/dashboard/admin/reports` | page | ✅ Exists | Yes | admin | middleware + API | API | Reports & analytics |
| `/dashboard/admin/settings` | page | ✅ Exists | Yes | admin | middleware + API | API | Platform settings |

### Vendor Dashboard
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/dashboard/vendor` | page | ✅ Exists | Yes | vendor | middleware + API | API | Vendor dashboard home |
| `/dashboard/vendor/bookings` | page | ✅ Exists | Yes | vendor | middleware + API | API | Booking management |
| `/dashboard/vendor/services` | page | ✅ Exists | Yes | vendor | middleware + API | API | Service management |
| `/dashboard/vendor/boost-campaigns` | page | ✅ Exists | Yes | vendor | middleware + API | API | Boost campaigns |
| `/dashboard/vendor/onboarding` | page | ✅ Exists | Yes | vendor | middleware + API | API | Vendor onboarding |

### Planner Dashboard
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/dashboard/planner` | page | ✅ Exists | Yes | wedding_planner | middleware + API | API | Planner dashboard home |
| `/dashboard/planner/clients` | page | ✅ Exists | Yes | wedding_planner | middleware + API | API | Client management |
| `/dashboard/planner/tasks` | page | ✅ Exists | Yes | wedding_planner | middleware + API | API | Task management |
| `/dashboard/planner/timeline` | page | ✅ Exists | Yes | wedding_planner | middleware + API | API | Timeline management |

### User Dashboard
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/dashboard/user` | page | ✅ Exists | Yes | user | middleware + API | API | User dashboard home |
| `/dashboard/user/bookings` | page | ✅ Exists | Yes | user | middleware + API | API | User bookings |
| `/dashboard/user/favorites` | page | ✅ Exists | Yes | user | middleware + API | API | User favorites |
| `/dashboard/user/profile` | page | ✅ Exists | Yes | user | middleware + API | API | User profile |

## API Routes

### Core Data APIs
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/api/vendors` | api | ✅ Exists | No | Public | N/A | MongoDB | Vendor listing |
| `/api/vendors/[id]` | api | ✅ Exists | No | Public | N/A | MongoDB | Vendor details |
| `/api/vendors/search` | api | ✅ Exists | No | Public | N/A | MongoDB | Vendor search |
| `/api/venues` | api | ✅ Exists | No | Public | N/A | MongoDB | Venue listing |
| `/api/venues/[id]` | api | ✅ Exists | No | Public | N/A | MongoDB | Venue details |
| `/api/venues/search` | api | ✅ Exists | No | Public | N/A | MongoDB | Venue search |
| `/api/bookings` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Booking management |
| `/api/bookings/[id]` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Individual booking |
| `/api/reviews` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Review management |
| `/api/reviews/[id]` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Individual review |

### Payment APIs
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/api/payments` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Payment management |
| `/api/payments/[id]` | api | ✅ Exists | Yes | user, vendor, admin | getServerSession | MongoDB | Individual payment |
| `/api/payments/webhook` | api | ✅ Exists | No | Stripe | Webhook signature | Stripe | Payment webhook |

### Boost/Advertisement APIs
| Route | Type | Status | Protected? | Expected Role(s) | Actual Role Check | Data Source | Notes |
|-------|------|--------|------------|------------------|-------------------|-------------|-------|
| `/api/venue-boosts` | api | ✅ Exists | Yes | vendor, admin | getServerSession | MongoDB | Boost campaigns |
| `/api/venue-boosts/analytics` | api | ✅ Exists | Yes | vendor, admin | getServerSession | MongoDB | Boost analytics |

## Missing Critical Routes

### Payment Flow (P0 - Critical)
| Route | Type | Status | Priority | Notes |
|-------|------|--------|----------|-------|
| `/checkout` | page | ❌ Missing | P0 | Checkout page for payments |
| `/payments/success` | page | ❌ Missing | P0 | Payment success page |
| `/payments/cancel` | page | ❌ Missing | P0 | Payment cancellation page |
| `/api/checkout` | api | ❌ Missing | P0 | Create payment session |
| `/api/checkout/session` | api | ❌ Missing | P0 | Stripe session creation |

### Boost/Advertisement Flow (P1 - High)
| Route | Type | Status | Priority | Notes |
|-------|------|--------|----------|-------|
| `/boosts` | page | ❌ Missing | P1 | Public boost packages page |
| `/vendor/boosts` | page | ❌ Missing | P1 | Vendor boost management |
| `/api/boosts/packages` | api | ❌ Missing | P1 | Available boost packages |
| `/api/boosts/purchase` | api | ❌ Missing | P1 | Purchase boost package |
| `/api/boosts/admin/approve` | api | ❌ Missing | P1 | Admin boost approval |

### Additional Missing Routes (P2 - Medium)
| Route | Type | Status | Priority | Notes |
|-------|------|--------|----------|-------|
| `/dashboard/admin/analytics` | page | ❌ Missing | P2 | Detailed analytics dashboard |
| `/dashboard/admin/payments` | page | ❌ Missing | P2 | Payment management for admin |
| `/dashboard/vendor/analytics` | page | ❌ Missing | P2 | Vendor analytics dashboard |
| `/dashboard/user/messages` | page | ❌ Missing | P2 | User messaging |
| `/dashboard/planner/analytics` | page | ❌ Missing | P2 | Planner analytics |

## Security Analysis

### Middleware Protection
- ✅ Dashboard routes protected by middleware
- ✅ Role-based access control implemented
- ✅ API routes have session checks
- ⚠️ Some API routes missing row-level security

### Authentication Status
- ✅ NextAuth integration working
- ✅ Role-based redirects implemented
- ✅ Session management functional
- ⚠️ Some API routes have unused auth imports

## Data Sources
- **MongoDB**: Primary database for all data
- **NextAuth**: Authentication and session management
- **Stripe**: Payment processing (webhook exists)
- **Static**: Some pages serve static content

## Recommendations

### Immediate Actions (P0)
1. Create missing checkout flow pages and APIs
2. Implement Stripe session creation
3. Add payment success/cancel pages

### High Priority (P1)
1. Create boost package management system
2. Add vendor boost purchase flow
3. Implement admin boost approval system

### Medium Priority (P2)
1. Add missing dashboard analytics pages
2. Implement comprehensive messaging system
3. Add payment management for admins

## File Structure Summary
- **Total Pages**: 89 files
- **Total API Routes**: 108 files
- **Protected Routes**: ~60% of dashboard routes
- **Public Routes**: ~40% of total routes
- **Missing Critical Routes**: 8 identified



