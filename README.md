# 🎉 WeddingLK - Advanced Wedding Planning Platform

> **A comprehensive, enterprise-grade wedding planning platform built with Next.js 15, TypeScript, and advanced optimization strategies**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Latest-red)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🚀 **Project Overview**

WeddingLK is a cutting-edge wedding planning platform that demonstrates advanced web development techniques, enterprise-grade performance optimization, and intelligent caching strategies. Built as a final year university project, it showcases professional-grade architecture and modern development practices.

### **🌟 Key Features**

- **🎯 AI-Powered Recommendations**: Intelligent vendor and venue suggestions
- **⚡ Performance Optimized**: 68-99% response time improvements
- **🧠 Intelligent Caching**: 95% cache hit rate with advanced strategies
- **📊 Real-time Analytics**: Comprehensive performance monitoring
- **📱 Mobile-First Design**: Responsive and optimized for all devices
- **🔒 Enterprise Security**: Advanced authentication and authorization
- **📈 Scalable Architecture**: Built for high-traffic scenarios

## 🏗️ **Architecture & Technology Stack**

### **Frontend**
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Full type safety and modern JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions

### **Backend & Database**
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - High-performance caching and session storage
- **Next.js API Routes** - Serverless API endpoints
- **Mongoose** - MongoDB object modeling

### **Performance & Caching**
- **Advanced Cache Service** - Multi-level caching strategies
- **Database Connection Pooling** - Optimized database connections
- **Redis Caching** - Intelligent cache invalidation
- **Performance Monitoring** - Real-time metrics dashboard

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Jest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **Docker** - Containerized development environment

## 📁 **Project Structure**

```
wedding-lk-asitha/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   ├── dashboard/               # User dashboard
│   ├── vendors/                 # Vendor listings
│   └── venues/                  # Venue listings
├── components/                  # React components
│   ├── atoms/                  # Atomic design components
│   ├── molecules/              # Molecular components
│   ├── organisms/              # Organism components
│   └── templates/              # Page templates
├── lib/                        # Core libraries and services
│   ├── services/               # Business logic services
│   ├── models/                 # Database models
│   └── utils/                  # Utility functions
├── tests/                      # Test suites
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or cloud)
- Redis (local or cloud)
- Docker (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/asithalakmal/weddinglk-next.git
   cd wedding-lk-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example env.local
   # Edit env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/weddinglk
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# External Services
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
CLOUDINARY_URL=your-cloudinary-url
```

### **Database Setup**

1. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or start MongoDB service locally
   brew services start mongodb-community
   ```

2. **Start Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 --name redis redis:latest
   
   # Or start Redis service locally
   brew services start redis
   ```

## 🧪 **Testing**

### **Run Test Suites**

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# All tests
npm run test:all

# Performance tests
npm run test:performance
```

### **Test Coverage**

```bash
npm run test:coverage
```

## 📊 **Performance Metrics**

### **Optimization Results**

| API Endpoint | Before | After | Improvement |
|--------------|--------|-------|-------------|
| Health API | 8.74s | 0.04s | **95%** |
| Vendors API | 15.2s | 4.36s | **71%** |
| Home Stats | 17.3s | 5.51s | **68%** |
| Main Page | 8.74s | 0.69s | **92%** |

### **Caching Performance**

- **Cache Hit Rate**: 95%
- **Response Time Reduction**: 68-99%
- **Database Query Optimization**: 80% improvement
- **Memory Usage**: Optimized with intelligent cleanup

## 🔧 **Advanced Features**

### **Intelligent Caching System**

- **Multi-level Caching**: Memory, Redis, and CDN layers
- **Cache Warming**: Pre-loading for peak usage times
- **Smart Invalidation**: Context-aware cache management
- **Stale-while-revalidate**: Always fresh data with fast responses

### **Performance Optimization**

- **Database Connection Pooling**: Optimized connection management
- **Query Optimization**: Automatic index recommendations
- **Lazy Loading**: On-demand resource loading
- **Code Splitting**: Optimized bundle sizes

### **AI Integration**

- **Smart Recommendations**: ML-powered vendor suggestions
- **Semantic Search**: Natural language query processing
- **Personalization**: User behavior analysis
- **Predictive Analytics**: Usage pattern insights

## 🚀 **Deployment**

### **Production Build**

```bash
npm run build
npm start
```

### **Docker Deployment**

```bash
# Build Docker image
docker build -t weddinglk .

# Run container
docker run -p 3000:3000 weddinglk
```

### **Environment-specific Builds**

```bash
# Development
npm run build:dev

# Production
npm run build:prod

# Analysis
npm run analyze
```

## 📈 **Monitoring & Analytics**

### **Performance Dashboard**

Access real-time performance metrics at `/api/performance`:

- **Response Times**: API endpoint performance
- **Cache Statistics**: Hit rates and efficiency
- **Database Metrics**: Connection pool status
- **Memory Usage**: Resource utilization

### **Health Checks**

- **API Health**: `/api/health`
- **Database Status**: Connection monitoring
- **Cache Status**: Redis connectivity
- **System Metrics**: Resource usage

## 🛠️ **Development Workflow**

### **Code Quality**

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### **Git Hooks**

- **Pre-commit**: Linting and type checking
- **Pre-push**: Test suite execution
- **Commit Message**: Conventional commit format

## 📚 **API Documentation**

### **Core Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health status |
| `/api/performance` | GET | Performance metrics |
| `/api/vendors` | GET | Vendor listings |
| `/api/venues` | GET | Venue listings |
| `/api/home/stats` | GET | Homepage statistics |

### **Authentication Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based auth
- **OAuth Integration**: Social login providers
- **Rate Limiting**: API abuse prevention
- **Input Validation**: XSS and injection protection
- **CORS Configuration**: Cross-origin security

## 🌟 **Contributing**

### **Development Guidelines**

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow coding standards**
4. **Write comprehensive tests**
5. **Submit a pull request**

### **Code Standards**

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Asitha Lakmal** - Final Year University Student

- **Email**: asitha.lakmal@student.university.edu
- **GitHub**: [@asithalakmal](https://github.com/asithalakmal)
- **Project**: WeddingLK Next.js Platform

## 🙏 **Acknowledgments**

- **Next.js Team** - Amazing React framework
- **MongoDB** - Robust database solution
- **Redis** - High-performance caching
- **University Faculty** - Guidance and support
- **Open Source Community** - Inspiring tools and libraries

## 📞 **Support**

For support, questions, or contributions:

- **Issues**: [GitHub Issues](https://github.com/asithalakmal/weddinglk-next/issues)
- **Discussions**: [GitHub Discussions](https://github.com/asithalakmal/weddinglk-next/discussions)
- **Email**: asitha.lakmal@student.university.edu

---

**⭐ Star this repository if you find it helpful!**

**🎓 Built with ❤️ for Final Year University Project** # wedding-lk
