# SNS Bank Re-identification Application

## Overview
This is a full-stack React and Express.js application that simulates a bank re-identification process. It's built with modern technologies including Vite, TypeScript, and shadcn/ui components.

## Architecture
- **Frontend**: React with Vite, using Wouter for routing, TanStack Query for data fetching, and shadcn/ui for components
- **Backend**: Express.js with TypeScript, serving both API routes and the frontend
- **Email**: Uses Resend service for sending email notifications
- **Database**: PostgreSQL schema defined with Drizzle ORM

## Recent Changes
- **2025-09-18**: Successfully configured and verified for Replit environment
  - Verified all dependencies and project structure are intact
  - Confirmed Express.js server runs correctly on port 5000 with host 0.0.0.0
  - Validated Vite configuration with allowedHosts: true for Replit proxy compatibility
  - Set up workflow with webview output type for web preview
  - Tested both frontend (React/Vite) and backend (Express/API) functionality
  - Verified API endpoints are working correctly with proper validation
  - Confirmed email service integration works in development mode
  - Configured deployment settings for autoscale with proper build/start commands

## Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend with API routes
- `shared/` - Shared TypeScript schemas and types
- `server/services/` - Email service integration

## Environment Setup
- Development server runs on port 5000 (both frontend and backend)
- Email functionality requires RESEND_API_KEY environment variable for production
- In development, email service gracefully degrades and logs messages instead

## Key Features
- Multi-step form for bank re-identification process
- Email notifications via Resend service
- Form validation with Zod schemas
- Responsive design with Tailwind CSS
- TypeScript throughout for type safety

## Dependencies
- React 18 with TypeScript
- Express.js with TypeScript execution via tsx
- Vite for frontend build and development
- shadcn/ui component library
- TanStack Query for state management
- Drizzle ORM for database schema
