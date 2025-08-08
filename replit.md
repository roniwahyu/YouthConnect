# CURHATIN - Platform Konseling Kesehatan Mental untuk Remaja

## Overview

CURHATIN is a comprehensive mental health counseling platform specifically designed for Indonesian teenagers. The application provides 24/7 AI-powered counseling, professional counselor access, mood tracking, digital journaling, mental health assessments (SRQ-29), and relaxation tools. The platform offers a 7-day free trial for new users with subscription-based access to premium features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with file-based page organization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with organized route handlers
- **Session Management**: Express sessions with PostgreSQL session store
- **Authentication**: bcryptjs for password hashing with session-based auth
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations

### Database Architecture
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Database**: Flexible multi-database support with automatic detection
- **Supported Databases**:
  - Localhost PostgreSQL
  - Localhost MySQL  
  - NeonDB (PostgreSQL cloud)
  - Supabase (PostgreSQL cloud)
  - Aiven MySQL (cloud)
- **Schema Design**: 
  - Users table with trial and subscription tracking
  - Moods table for daily mood tracking entries
  - Journal entries with mood associations
  - Chat sessions supporting both AI and human counselors
  - SRQ-29 assessments with scoring and interpretation
  - Achievements system for user engagement
  - Counselors table for professional counselor profiles
- **Storage Layer**: Abstracted storage interface with both in-memory and database implementations

### Authentication & Authorization
- **Strategy**: Session-based authentication using express-session
- **Password Security**: bcryptjs with salt rounds for password hashing
- **Session Storage**: PostgreSQL session store via connect-pg-simple
- **Authorization**: Middleware-based route protection with user context injection

### AI Integration
- **Provider**: OpenAI API for AI counseling conversations
- **Implementation**: Streaming chat responses with conversation context management
- **Fallback**: Graceful degradation when AI services are unavailable

## External Dependencies

### Core Infrastructure
- **Database**: Multi-provider support (PostgreSQL/MySQL, local/cloud)
- **Session Store**: PostgreSQL-backed session management
- **Build System**: Vite with TypeScript and React plugins
- **Database Configuration**: Automatic database type detection and connection management

### AI Services
- **OpenAI API**: GPT models for AI counseling conversations
- **Content Moderation**: Potential integration for safety monitoring

### UI Framework
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Replit Integration**: Development environment optimizations and error overlay
- **TypeScript**: Type safety across frontend, backend, and shared schemas
- **Drizzle Kit**: Database migration and management tools

### Third-party Libraries
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Type-safe component variant handling