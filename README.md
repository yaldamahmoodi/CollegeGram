# CollegeGram

A backend service for a social media application built with TypeScript, Express, and MongoDB.

## Technologies

- **Node.js 24**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **pnpm**: Package manager
- **Docker**: Containerization

## Prerequisites

- Node.js 24 or Docker
- pnpm (if running without Docker)
- MongoDB (if running without Docker)

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

## MongoDB Configuration

- **Main Database**:
  - Username: admin
  - Password: admin
  - Database: collagegram

- **Test Database**:
  - Username: admin
  - Password: admin
  - Database: collagegram-test

## Development

To run the application in development mode:

```bash
pnpm dev
```

## Authors

- Nima Elahi Manesh
- Yalda Mahmoodi
- Amir Samimi
- Mohammad Asghari

## License

MIT