# Revosso Setup Guide

## Environment Variables

Create a `.env` file in the root directory:

```env
# Turso Database
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"

# SMTP Configuration
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
SMTP_FROM="noreply@revosso.com"

# Admin
ADMIN_EMAIL="admin@revosso.com"
ADMIN_PASSWORD="your-secure-password"
```

## Turso Setup

1. Sign up at [turso.tech](https://turso.tech)
2. Create a new database
3. Get your database URL and auth token
4. Add them to `.env`

## Database Migration

```bash
npm run db:push
```

This will create the `leads` table in your Turso database.

## Running the Project

```bash
npm install
npm run dev
```

## Admin Access

Visit `/admin` and use Basic Auth:
- Username: `admin`
- Password: Your `ADMIN_PASSWORD` from `.env`

## Features

- ✅ Benefit-oriented landing page
- ✅ Social proof section
- ✅ Contact form with validation
- ✅ Rate limiting (5 requests per IP per 10 minutes)
- ✅ Email notifications (internal + confirmation)
- ✅ Admin dashboard to view leads
- ✅ Turso database for lead storage

