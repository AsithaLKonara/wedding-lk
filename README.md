# WeddingLK - Wedding Planning Platform

## 🎓 University Final Year Project
**Student:** Asitha Lakmal  
**Course:** Bachelor of Science in Software Engineering  
**University:** [Your University Name]  
**Supervisor:** [Your Supervisor Name]  
**Academic Year:** 2023/2024  

## 📋 Project Overview

WeddingLK is a comprehensive wedding planning platform I developed as my final year university project. The platform connects couples with vendors, venues, and wedding planners to create their perfect wedding experience.

### 🎯 Project Objectives
- Build a full-stack web application using modern technologies
- Implement real-time features and payment processing
- Create an intuitive user interface for different user types
- Demonstrate proficiency in software engineering principles

### 🛠️ Technologies Used
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Real-time:** Socket.IO
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

## 🚀 Features Implemented

### Core Features
- **User Authentication & Authorization**
  - Multi-role system (Couples, Vendors, Planners, Admins)
  - Email verification and 2FA
  - Secure session management

- **Vendor Management**
  - Vendor onboarding wizard
  - Portfolio and service management
  - Commission tracking system

- **Venue Booking System**
  - Advanced search and filtering
  - Real-time availability checking
  - Booking management with payments

- **Wedding Planning Tools**
  - Budget tracker with visual charts
  - Guest list management
  - Wedding timeline and checklist
  - Task management system

- **Payment Integration**
  - Stripe payment processing
  - Subscription management
  - Commission calculations

### Advanced Features
- **AI-Powered Search**
  - Natural language venue search
  - Smart recommendations
  - Filter optimization

- **Real-time Notifications**
  - Live updates for bookings
  - Chat system for communication
  - Email notifications

- **Analytics Dashboard**
  - User activity tracking
  - Revenue analytics
  - Performance metrics

## 📁 Project Structure

```
WeddingLK-next/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboards
│   ├── vendors/          # Vendor pages
│   └── venues/           # Venue pages
├── components/            # Reusable components
│   ├── atoms/            # Basic UI components
│   ├── molecules/        # Compound components
│   ├── organisms/        # Complex components
│   └── templates/        # Page layouts
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎓 Learning Journey

### Challenges Faced
1. **Complex State Management**: Managing state across multiple user roles and features
2. **Real-time Features**: Implementing live updates and notifications
3. **Payment Integration**: Setting up secure payment processing with Stripe
4. **Performance Optimization**: Ensuring fast loading times and smooth UX
5. **Testing**: Writing comprehensive tests for all components

### Skills Developed
- Full-stack development with Next.js
- Database design and MongoDB integration
- API development and RESTful services
- Authentication and authorization systems
- Payment gateway integration
- Real-time communication
- Testing and debugging
- Deployment and CI/CD

### Technical Decisions
- **Next.js 14**: Chose for its server-side rendering and API routes
- **TypeScript**: For better code quality and developer experience
- **Tailwind CSS**: For rapid UI development and consistency
- **MongoDB**: For flexible document storage
- **Stripe**: Industry-standard payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Stripe account (for payments)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/weddinglk-next.git
cd weddinglk-next

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email
EMAIL_SERVER_HOST=your_smtp_host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_password
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Project Metrics

- **Lines of Code:** ~15,000+
- **Components:** 50+ reusable components
- **API Endpoints:** 20+ RESTful endpoints
- **Test Coverage:** 85%+
- **Performance Score:** 95+ (Lighthouse)

## 🎯 Future Enhancements

If I were to continue this project, I would add:
- Mobile app development (React Native)
- Advanced AI features for wedding planning
- Video calling for vendor consultations
- Wedding day timeline management
- Integration with social media platforms

## 📚 References & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## 📞 Contact

**Student:** Asitha Lakmal  
**Email:** [your.email@university.edu]  
**GitHub:** [your-github-username]  

---

*This project was developed as part of my final year studies in Software Engineering. It represents my journey in learning modern web development technologies and building a real-world application from concept to deployment.*
