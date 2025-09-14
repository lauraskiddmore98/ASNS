# Vercel Deployment Guide

## Required Environment Variables

Add these environment variables in your Vercel project dashboard (Settings → Environment Variables):

### Production Environment Variables:
- `RESEND_API_KEY` - Your Resend API key for sending emails
- `ADMIN_EMAIL` - Email address to receive form submissions (default: punkin199573@gmail.com)
- `FROM_EMAIL` - Email address to send emails from (must be verified in Resend)

### Optional Variables:
- `DATABASE_URL` - If using an external database instead of in-memory storage

## Deployment Steps:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required variables for Production environment

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Build command: `npm run build`
   - Output directory: `dist/public`

## Important Notes:

- The current setup uses in-memory storage which resets on each deployment
- For production use, connect a persistent database (PostgreSQL, MongoDB, etc.)
- Make sure your Resend API key has a verified sending domain
- The FROM_EMAIL must be from a domain verified in your Resend account