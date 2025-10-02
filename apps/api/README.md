# CollegeGram

A backend service for a social media application built with TypeScript, Express, and MongoDB.

## Technologies

- **Node.js 24**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Redis**: In-memory data store for caching
- **JWT**: JSON Web Tokens for authentication
- **Nodemailer**: Email service integration
- **Mailpit**: Email testing tool
- **pnpm**: Package manager
- **Docker**: Containerization

## Prerequisites

- Node.js 24 or Docker
- pnpm (if running without Docker)
- MongoDB (if running without Docker)
- Redis (if running without Docker)

## Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file:

```
# ENVIRONMENT
NODE_ENV=development

# CONFIGURATION
PORT=3001
CORS_ORIGIN=https://yaldamahmoudi.com,https://amirsamimi.com,https://mohammadasghari.com,https://nimaelahinejad.com

# DB
MONGODB_URI=mongodb://admin:admin@mongo:27017/collagegram?authSource=admin
MIN_POOL_SIZE=5
MAX_POOL_SIZE=25

# SECURITY
ACCESS_TOKEN_SECRET=your_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=54000

# REDIS
REDIS_URL=redis://localhost:6379

# EMAIL (for password reset)
SMTP_HOST=mailpit
SMTP_PORT=1025
SMTP_USER=amirns
SMTP_PASS=Amir@1995
EMAIL_FROM=devsync@rahnemacollege.ir
```

## Setup and Running

### Using Docker (Recommended)

1. **Build and run using Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode**
   ```bash
   docker-compose up -d
   ```

3. **Check if services are running**
   ```bash
   docker ps
   ```

4. **Stop services when needed**
   ```bash
   docker-compose down
   ```

5. **Check logs**
   ```bash
   docker-compose logs -f
   ```

### Without Docker

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start the application**
   ```bash
   pnpm start
   ```

## Available Services

When running with Docker Compose, the following services are available:

- **CollegeGram API**: http://localhost:3001
- **MongoDB**: localhost:27017
- **Mongo Express (DB Admin)**: http://localhost:8081
- **Test MongoDB**: localhost:27018
- **Test Mongo Express**: http://localhost:8082
- **Mailpit (Email Testing)**: http://localhost:8025

## MongoDB Configuration

- **Main Database**:
  - Username: admin
  - Password: admin
  - Database: collagegram

- **Test Database**:
  - Username: admin
  - Password: admin
  - Database: collagegram-test

## Features

### Authentication
- User registration and login
- JWT-based authentication
- **Forgot Password Flow** with email verification
- OTP-based password reset using Redis caching
- Rate limiting for security

### Forgot Password Flow
The application includes a complete forgot password implementation:

1. **Request Reset**: User provides email address
2. **OTP Generation**: 6-digit OTP generated and cached in Redis (5-minute expiry)
3. **Email Delivery**: OTP sent via Mailpit with professional HTML template
4. **OTP Verification**: User verifies the received OTP
5. **Password Reset**: User sets new password after OTP verification

**Security Features:**
- Rate limiting (max 3 attempts per 15 minutes)
- OTP expiration (5 minutes)
- Email privacy (same response for existing/non-existing emails)
- Strong password validation

See `FORGOT_PASSWORD_README.md` for detailed documentation.

## Development

To run the application in development mode:

```bash
pnpm dev
```

### Testing the Forgot Password Flow

1. Start Redis server: `redis-server`
2. Start the application: `pnpm dev`
3. Open Mailpit UI at `http://localhost:8025` to view emails
4. Use the test requests in `forgot-password-test.http`

## Authors

- Nima Elahi Manesh
- Yalda Mahmoodi
- Amir Samimi
- Mohammad Asghari

## License

MIT