# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bucket-List is a full-stack social travel application built with React Router 7 (frontend) and Express.js with TypeScript (backend). The application allows users to create bucket lists, share travel experiences, follow other users, and interact through posts and comments.

## Architecture

### Backend (Express.js + TypeScript)
- **Location**: `/backend/src`
- **Port**: 4200
- **Structure**: API-based with modular route/controller/model pattern
- **Entry Point**: `backend/src/index.ts` → `backend/src/App.ts`

**Key Services**:
- **Database**: PostgreSQL (connected via `postgres` library with camelCase transformation)
- **Session Store**: Redis with express-session for authentication
- **Image Storage**: Cloudinary for media uploads
- **Authentication**: JWT tokens + session-based (handled via `isLoggedInController` middleware)

**API Modules** (`backend/src/apis/`):
- `sign-up/` - User registration and email activation
- `sign-in/` - User login
- `profile/` - User profiles, followers, following
- `follow/` - Follow/unfollow functionality
- `wanderlist/` - Bucket list management
- `post/` - Travel posts and stories
- `comment/` - Comments on posts
- `media/` - Image upload and management
- `shared-stories/` - Community shared travel experiences

**Route Pattern**: Each API module follows: route → controller → model structure
- Routes define endpoints and middleware (e.g., `isLoggedInController`)
- Controllers handle business logic
- Models interact with database via `sql` client

### Frontend (React Router 7 + TypeScript)
- **Location**: `/frontend/app`
- **Framework**: React Router v7 with File-Based Routing
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Flowbite React
- **Form Handling**: React Hook Form with Zod validation

**Routes** (`frontend/app/routes.ts`):
- Home page
- `/community` - Community feed
- `/scrapbook` - Photo gallery
- `/profile` - User profile
- `/dashboard` - Main dashboard/bucketlist management
- `/dashboard/follow` - Follow management
- `/signup`, `/login`, `/logout` - Auth pages
- `/settings` - User settings

**Directory Structure**:
- `app/routes/` - Page components (organized by route)
- `app/components/` - Reusable UI components
- `app/layouts/` - Layout wrappers
- `app/utils/` - Utility functions and models
- `app/utils/models/` - TypeScript interfaces/types for API responses

**API Communication**:
- Frontend API URL configured in `.env.development`: `REST_API_URL=http://srilatha.ddfullstack.cloud:8080/apis`
- Fetch calls to `{REST_API_URL}/profile`, `{REST_API_URL}/post`, etc.
- JWT token sent in Authorization header for authenticated requests

## Development Commands

### Backend
```bash
cd backend
npm install
npm run dev          # Start with hot-reload (uses nodemon + ts-node)
npm run lint         # Lint code with ts-standard
npm run clean        # Fix linting issues
npm run test         # Run tests (not yet configured)
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Start Vite dev server with React Router HMR
npm run build        # Build for production
npm run typecheck    # Type checking + React Router typegen
npm start            # Serve production build
```

### Docker (Full Stack)
```bash
docker-compose up    # Start backend, frontend, PostgreSQL, and Redis
```

## Environment Setup

### Required Services
- **PostgreSQL**: Running via Docker (configured in `docker-compose.yml`)
- **Redis**: Running via Docker for session storage
- **Cloudinary**: For image uploads (credentials in `.env.development`)

### Configuration Files
- **Root**: `project.env` - Shared environment variables for Docker services
- **Frontend**: `frontend/.env.development` - API URL and Cloudinary credentials
- **Backend**: Uses `project.env` and environment variables passed via Docker

### Key Environment Variables
- `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_DB`, `POSTGRES_PASSWORD` - Database
- `REDIS_HOST` - Redis connection
- `SESSION_SECRET` - Express session secret
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Image storage

## Database

**Type**: PostgreSQL
**Client Library**: `postgres` npm package (not pg)
- Automatically transforms column names: snake_case (DB) ↔ camelCase (JavaScript)
- Located in `backend/src/utils/database.utils.ts`

**SQL Files**: `sql/` directory contains database schema and migrations

**Key Tables** (inferred from API routes):
- Profiles (users)
- Wanderlists (bucket lists)
- Posts (travel stories)
- Comments
- Media (images)
- Follows (follower relationships)
- Shared stories

## Key Patterns

### Authentication Flow
1. User signs up → email activation sent via Mailgun
2. User activates account
3. User logs in → JWT token + session created in Redis
4. Subsequent requests include JWT in Authorization header + session cookie
5. `isLoggedInController` middleware validates authentication

### API Response Pattern
- Controllers return response via `response.utils.ts` utility
- Follows consistent status/data structure

### Form Validation
- Frontend: Zod schemas with React Hook Form
- Backend: Zod schemas in route files (e.g., `sign-up.schema.ts`)

### Image Handling
- Cloudinary SDK used for uploads in both frontend and backend
- Media routes handle upload logic
- Images stored on Cloudinary CDN

## Recent Work

The project is on the `wanderlist-integration` branch with recent commits involving:
- Follow functionality changes
- Wanderlist integration
- Profile model updates
- Friend card component refactoring

Key modified files to be aware of:
- `frontend/app/routes.ts` - Route definitions
- `frontend/app/routes/profile/dashboard.tsx` - Main profile dashboard
- `frontend/app/utils/models/follow.model.ts` - Follow data models
- `frontend/app/utils/models/profile.model.ts` - Profile data models
- `backend/src/apis/profile/` - Profile API changes
- `backend/src/apis/follow/` - Follow API implementation

## Build and Type Checking

- **Frontend**: Uses React Router's `react-router typegen` to generate route types
- **Backend**: Uses ts-node with ts-standard for linting
- **Type Safety**: Both projects have `strict: true` TypeScript configuration

## Testing

Currently no automated tests configured. Test commands return placeholder messages.

## Notes for Future Contributors

- Database connections use camelCase in JS but snake_case in SQL queries
- Session management via Redis is required for deployment
- Cloudinary credentials must be set for image features
- Frontend and backend are decoupled via REST API
- This is a monorepo structure with separate npm workspaces for frontend/backend
