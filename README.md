# Local Skill Swap (LSS) Backend

Local Skill Swap is a community-driven platform that empowers individuals to share and exchange skills without using money. Whether you're great at playing guitar and want to learn web development, or you're a yoga instructor looking to practice a new language — this platform helps you connect with people near you to learn and grow together.

## Project Structure

The project follows a domain-driven (feature-first) architecture:

```
src/
├── domains/             # Domain modules (feature-first)
│   ├── auth/            # Authentication domain
│   ├── users/           # Users domain
│   ├── skills/          # Skills domain
│   ├── categories/      # Categories domain
│   └── exchange-requests/ # Exchange requests domain
├── core/                # Core module for shared logic
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Authentication guards
│   └── interceptors/    # Request/response interceptors
├── config/              # Configuration management
├── prisma/              # Prisma ORM setup
└── health/              # Health check endpoints
```

Each domain module follows this structure:

```
domains/[domain-name]/
├── controllers/         # HTTP request handlers
├── services/            # Business logic
├── dto/                 # Data Transfer Objects
├── entities/            # Entity definitions
└── [domain-name].module.ts  # Module definition
```

## Features

- **Authentication**: JWT-based authentication with login and registration
- **User Management**: User profiles and skills management
- **Skills**: CRUD operations for skills
- **Categories**: Categorization of skills
- **Exchange Requests**: Request and manage skill exchanges between users
- **Health Checks**: Endpoint for monitoring application health
- **API Documentation**: Swagger UI for API exploration

## Tech Stack

- NestJS - Progressive Node.js framework
- Prisma - Next-generation ORM
- PostgreSQL - Relational database
- JWT - Authentication
- Class Validator - Request validation
- Swagger - API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/lss_db"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="1d"
   PORT=4000
   CORS_ORIGIN="http://localhost:3000"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

### API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:4000/api-docs
```

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Architecture Principles

This project follows these architectural principles:

1. **SOLID Principles**:
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

2. **Clean Architecture**:
   - Domain-driven design
   - Separation of concerns
   - Dependency injection

3. **Best Practices**:
   - DTOs for request/response validation
   - Centralized error handling
   - Consistent naming conventions
   - Comprehensive documentation
