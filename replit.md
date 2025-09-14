# SNS Bank Re-identification Application

## Overview
This is a full-stack React and Express.js application that simulates a bank re-identification process. It's built with modern technologies including Vite, TypeScript, and shadcn/ui components.

## Architecture
- **Frontend**: React with Vite, using Wouter for routing, TanStack Query for data fetching, and shadcn/ui for components
- **Backend**: Express.js with TypeScript, serving both API routes and the frontend
- **Email**: Uses Resend service for sending email notifications
- **Database**: PostgreSQL schema defined with Drizzle ORM

## Recent Changes
- **2024-09-14**: Imported from GitHub and configured for Replit environment
  - Fixed Express 5 routing compatibility (changed wildcard "*" to RegExp /.*/)
  - Installed missing dependencies: express, vite, tsx, wouter, and Replit Vite plugins
  - Updated package.json dev script to use "tsx server/index.ts"
  - Fixed RESEND_API_KEY dependency to allow development without API key
  - Verified Vite proxy configuration (allowedHosts: true in server/vite.ts)
  - Set up workflow on port 5000 with webview output
  - Configured deployment settings for autoscale deployment with tsx runtime

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
