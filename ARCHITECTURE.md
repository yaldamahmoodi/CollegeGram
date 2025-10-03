# CollegeGram Monorepo Architecture Documentation

## 🏗️ System Overview

CollegeGram is a social media platform built with a modern monorepo architecture, featuring a Node.js/Express API backend, React frontend, and comprehensive health monitoring dashboard.

### 🎯 Core Features
- **Social Media Platform**: User authentication, posts, comments, notifications
- **Real-time Communication**: WebSocket integration for live updates
- **Search & Discovery**: Elasticsearch-powered search functionality
- **Email System**: Automated notifications and verification
- **Health Monitoring**: Real-time system status dashboard

## 🏛️ Architecture Patterns

### Clean Architecture Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   React Web     │  │  Health Dashboard│  │   API Routes    ││
│  │   (Port 3000)   │  │   (Port 3002)    │  │  (Port 3001)    ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   Controllers   │  │    Services     │  │   Middlewares   ││
│  │   (HTTP Logic)  │  │ (Business Logic)│  │ (Cross-cutting) ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │     Models      │  │      DTOs       │  │     Types       ││
│  │  (Entities)     │  │ (Data Transfer) │  │ (Interfaces)    ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   Repositories  │  │    Database     │  │   External APIs ││
│  │  (Data Access)  │  │   (MongoDB)     │  │   (Email/Search)││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Repository Pattern
- **Separation of Concerns**: Data access logic isolated in repositories
- **Testability**: Easy to mock database operations
- **Flexibility**: Can switch between different data sources

### Service Layer Pattern
- **Business Logic**: Centralized in service classes
- **Reusability**: Services can be used across multiple controllers
- **Maintainability**: Clear separation between HTTP handling and business logic

## 📁 Monorepo Structure

```
monorepo/
├── apps/
│   ├── api/                    # Backend API (Node.js/Express)
│   │   ├── src/
│   │   │   ├── controllers/    # HTTP request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── repositories/   # Data access layer
│   │   │   ├── models/         # Database schemas
│   │   │   ├── middlewares/    # Cross-cutting concerns
│   │   │   ├── routes/         # API route definitions
│   │   │   ├── dtos/           # Data transfer objects
│   │   │   └── utils/          # Utility functions
│   │   ├── docs/               # API documentation
│   │   └── Dockerfile          # Container configuration
│   ├── web/                    # Frontend React App
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Route components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── context/        # React context providers
│   │   │   ├── api/            # API client functions
│   │   │   ├── types/          # TypeScript definitions
│   │   │   └── utils/          # Utility functions
│   │   └── Dockerfile          # Container configuration
│   └── doc/                    # Health Dashboard (React/TypeScript)
│       ├── src/
│       │   ├── components/     # Dashboard UI components
│       │   ├── hooks/          # Health monitoring hooks
│       │   ├── types/          # Health data types
│       │   └── lib/            # Utility libraries
│       └── Dockerfile          # Container configuration
├── packages/                   # Shared libraries (future)
├── docker-compose.yaml         # Multi-service orchestration
├── nginx.conf                  # Reverse proxy configuration
└── turbo.json                  # Build system configuration
```

## 🔧 Technology Stack

### Backend (API)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Search**: Elasticsearch
- **Cache**: Redis
- **Email**: Nodemailer with Mailpit (dev)
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO
- **Documentation**: Swagger/OpenAPI

### Frontend (Web)
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Routing**: React Router v7

### Health Dashboard (Doc)
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2 (production)
- **Build System**: Turborepo
- **Package Manager**: pnpm

## 🌐 Network Architecture

### Production Deployment (82.115.13.86)

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (Port 80/443)                      │
│                   Reverse Proxy & Load Balancer             │
└─────────────────────────────────────────────────────────────┘
    │
    ├─── /api/* ──────────► API Container (Port 3001)
    ├─── / ──────────────► Web Container (Port 3000)
    ├─── /uploads/* ─────► Static File Server
    └─── /mailpit/* ─────► Mailpit Interface (Port 8025)

┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │    MongoDB      │  │   Elasticsearch │  │     Redis       ││
│  │   (Port 27017)  │  │   (Port 9200)   │  │  (Port 6379)    ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Monitoring                                │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Health Dashboard│  │     Mailpit     │                   │
│  │   (Port 3002)   │  │   (Port 8025)   │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Service Communication
- **API ↔ MongoDB**: Direct connection for data persistence
- **API ↔ Redis**: Session storage and caching
- **API ↔ Elasticsearch**: Search indexing and queries
- **Web ↔ API**: RESTful HTTP + WebSocket connections
- **Doc ↔ API**: Health check polling every 30 seconds

## 🔒 Security Implementation

### Authentication & Authorization
```typescript
// JWT-based authentication with refresh tokens
interface AuthTokens {
  accessToken: string;   // Short-lived (15 minutes)
  refreshToken: string;  // Long-lived (7 days)
}

// Role-based access control
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
```

### Security Middleware Stack
1. **Helmet**: Security headers
2. **CORS**: Cross-origin resource sharing
3. **Rate Limiting**: Request throttling
4. **Input Validation**: DTO validation with Yup
5. **File Upload**: Secure file handling with Multer
6. **Authentication**: JWT verification middleware

### Data Protection
- **Password Hashing**: bcrypt with salt rounds
- **Input Sanitization**: XSS and injection prevention
- **File Upload Security**: Type validation and size limits
- **Environment Variables**: Sensitive data in .env files

## 📊 Data Flow Architecture

### User Registration Flow
```
1. Frontend Form Submission
   ↓
2. DTO Validation (register.dto.ts)
   ↓
3. Controller Processing (auth.controller.ts)
   ↓
4. Service Layer (auth.service.ts)
   ↓
5. Repository Layer (auth.repository.ts)
   ↓
6. Database Persistence (MongoDB)
   ↓
7. Email Verification (email.service.ts)
   ↓
8. Response with JWT Tokens
```

### Real-time Notification Flow
```
1. Event Trigger (Like, Comment, Follow)
   ↓
2. Notification Service (notification.service.ts)
   ↓
3. Database Storage (MongoDB)
   ↓
4. WebSocket Broadcast (websocket.service.ts)
   ↓
5. Real-time UI Update (Frontend)
```

### Search Flow
```
1. Search Query (Frontend)
   ↓
2. Search Controller (search.controller.ts)
   ↓
3. Search Service (PostSearchService.ts)
   ↓
4. Elasticsearch Query
   ↓
5. Results Processing & Return
```

## 🔄 CI/CD Pipeline

### Development Workflow
```
1. Feature Development
   ├── Local Development (Docker Compose)
   ├── Code Quality (ESLint, TypeScript)
   └── Testing (Unit & Integration)

2. Version Control
   ├── Git Branching Strategy
   ├── Pull Request Reviews
   └── Automated Checks

3. Build Process
   ├── Turborepo Build System
   ├── Docker Image Creation
   └── Dependency Management (pnpm)

4. Deployment
   ├── Production Build
   ├── Container Orchestration
   └── Health Checks
```

### Docker Strategy
```dockerfile
# Multi-stage builds for optimization
FROM node:18-alpine AS builder
# Build application

FROM node:18-alpine AS production
# Runtime environment
```

## 🏗️ Design Patterns Used

### 1. Repository Pattern
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### 2. Service Layer Pattern
```typescript
class AuthService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private otpService: OtpService
  ) {}

  async register(userData: RegisterDto): Promise<AuthResponse> {
    // Business logic implementation
  }
}
```

### 3. Dependency Injection
```typescript
// Manual DI implementation
class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
}
```

### 4. Factory Pattern
```typescript
class ServiceFactory {
  static createEmailService(): EmailService {
    return new EmailService(/* dependencies */);
  }
}
```

### 5. Observer Pattern
```typescript
// WebSocket event handling
class NotificationService {
  private observers: WebSocketClient[] = [];
  
  notify(event: NotificationEvent): void {
    this.observers.forEach(client => client.send(event));
  }
}
```

## 📈 Performance Optimizations

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB indexes
- **Caching Strategy**: Redis for session and frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Async Processing**: Non-blocking I/O operations
- **Compression**: Gzip compression for responses

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Component-level lazy loading
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Optimization**: Vite's optimized bundling
- **Asset Optimization**: Image compression and caching

### Infrastructure Optimizations
- **Nginx Caching**: Static asset caching
- **CDN Strategy**: Future implementation for global distribution
- **Container Optimization**: Multi-stage Docker builds
- **Resource Limits**: Proper container resource allocation

## 🔍 Monitoring & Observability

### Health Monitoring System
```typescript
interface HealthCheck {
  service: string;
  status: 'healthy' | 'warning' | 'unhealthy';
  responseTime: number;
  details: Record<string, any>;
}
```

### Monitoring Components
1. **Service Health Checks**: Database, Redis, Elasticsearch connectivity
2. **Performance Metrics**: Response times, throughput
3. **Error Tracking**: Application errors and exceptions
4. **System Metrics**: CPU, memory, disk usage
5. **Real-time Dashboard**: Live status updates

### Logging Strategy
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Error, Warn, Info, Debug
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error information

## 🚀 Deployment Strategy

### Environment Configuration
```yaml
# Development
services:
  - api (development mode)
  - web (development mode)
  - mongodb
  - redis
  - elasticsearch
  - mailpit

# Production
services:
  - api (production build)
  - web (production build)
  - doc (health dashboard)
  - nginx (reverse proxy)
  - mongodb
  - redis
  - elasticsearch
```

### Scaling Considerations
- **Horizontal Scaling**: Multiple API instances behind load balancer
- **Database Scaling**: MongoDB replica sets
- **Caching Layer**: Redis cluster for high availability
- **CDN Integration**: Static asset delivery optimization
- **Container Orchestration**: Kubernetes for production scaling

## 🔮 Future Enhancements

### Technical Improvements
1. **Microservices Migration**: Break down monolith into services
2. **Event-Driven Architecture**: Message queues for async processing
3. **GraphQL API**: More efficient data fetching
4. **Advanced Caching**: Multi-level caching strategy
5. **Observability**: Distributed tracing and metrics

### Feature Enhancements
1. **Mobile App**: React Native application
2. **Advanced Search**: AI-powered search recommendations
3. **Content Moderation**: Automated content filtering
4. **Analytics Dashboard**: User behavior analytics
5. **API Rate Limiting**: Advanced throttling strategies

## 📚 Why Monorepo?

### Benefits Realized
1. **Code Sharing**: Shared types, utilities, and components
2. **Consistent Tooling**: Unified build system and dependencies
3. **Atomic Changes**: Cross-application changes in single commit
4. **Simplified CI/CD**: Single pipeline for all applications
5. **Developer Experience**: Single repository to clone and setup

### Monorepo Tools Used
- **Turborepo**: Build system and task runner
- **pnpm**: Efficient package management with workspaces
- **Shared Configurations**: ESLint, TypeScript, Docker configs
- **Unified Scripts**: Development and build commands

This architecture provides a solid foundation for a scalable, maintainable social media platform with comprehensive monitoring and modern development practices.
