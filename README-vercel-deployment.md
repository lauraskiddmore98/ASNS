# Vercel Deployment Guide

## Required Environment Variables

Add these environment variables in your Vercel project dashboard (Settings → Environment Variables):

### Required Production Environment Variables:
- `RESEND_API_KEY` - Your Resend API key for sending emails
- `ADMIN_EMAIL` - Email address to receive form submissions
- `FROM_EMAIL` - Email address to send emails from (must be verified in Resend)

**Important:** Both `ADMIN_EMAIL` and `FROM_EMAIL` must be set for email functionality to work. If either is missing, the form will still work but no emails will be sent.

## Deployment Steps:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required variables for Production environment
   - Make sure to set them for the correct environment (Production/Preview/Development)

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Build command: `npm run build` (or `npm run vercel-build`)
   - Output directory: `dist/public`
   - API routes are automatically detected in the `api/` folder

## API Endpoints:

- `POST /api/reidentification/submit` - Submit form data

## Important Notes:

- The current setup uses in-memory storage which resets on each serverless function restart
- For production use, connect a persistent database (PostgreSQL, MongoDB, etc.)
- Make sure your Resend API key has a verified sending domain
- The FROM_EMAIL must be from a domain verified in your Resend account
- API functions are serverless and stateless - data doesn't persist between requests