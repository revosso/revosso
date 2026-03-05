# Revosso Lead & Visitor Management System

## Overview

A production-ready, full-stack lead capture and visitor tracking system built with **Next.js**, **Drizzle ORM**, and **SQLite (Turso)**. Designed specifically for the Revosso landing page to safely capture business leads, send email notifications, and track anonymous visitor activity.

## Core Architecture Principles

### Strict Layer Separation

The system follows a **clean layered architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────┐
│  UI Layer (app/)                        │
│  - Pages, components                    │
│  - NO database access                   │
└─────────────────┬───────────────────────┘
                  │ calls
┌─────────────────▼───────────────────────┐
│  API / Server Actions (app/api/)        │
│  - HTTP endpoints, server actions       │
│  - Input validation                     │
│  - NO direct database queries           │
└─────────────────┬───────────────────────┘
                  │ calls
┌─────────────────▼───────────────────────┐
│  Service Layer (lib/services/)          │
│  - Business logic                       │
│  - Workflow coordination                │
│  - Email orchestration                  │
└─────────────────┬───────────────────────┘
                  │ calls
┌─────────────────▼───────────────────────┐
│  Repository Layer (lib/repositories/)   │
│  - ONLY layer with database access      │
│  - All Drizzle ORM queries here         │
└─────────────────┬───────────────────────┘
                  │ queries
┌─────────────────▼───────────────────────┐
│  Database Layer (lib/db.ts, schema.ts)  │
│  - Schema definitions                   │
│  - Database configuration               │
└─────────────────────────────────────────┘
```

**Critical Rules:**
- ✅ UI components never query the database
- ✅ API routes never write SQL
- ✅ Only repositories contain database queries
- ✅ Services coordinate business logic

## Database Schema

### Leads Table

Stores all business lead submissions with flexible intent fields.

```typescript
leads {
  // Primary identifier
  id: string (primary key)
  
  // Basic information
  name: string
  email: string
  company: string? (optional)
  message: string
  
  // Lead intent fields (flexible strings)
  leadType: string?           // e.g., "custom_software_development"
  productInterest: string?    // e.g., "cashlakay", "revofin"
  sourcePage: string?         // e.g., "landing", "services"
  businessStage: string?      // e.g., "startup", "enterprise"
  
  // System fields
  emailStatus: string         // "pending" | "sent" | "failed"
  leadStatus: string          // "new" | "contacted" | "qualified" | "closed"
  ipAddress: string?
  userAgent: string?
  userLanguage: string?
  
  // Timestamps
  createdAt: timestamp
}
```

### Visitors Table

Tracks anonymous page visits for basic analytics.

```typescript
visitors {
  id: string (primary key)
  visitorId: string          // Anonymous identifier
  ipAddress: string?
  userAgent: string?
  pagePath: string           // e.g., "/services/custom-software"
  language: string?
  referrer: string?
  createdAt: timestamp
}
```

## Critical Reliability Rule

**Leads Must NEVER Be Lost**

Workflow Guarantee:
1. ✅ Lead is inserted into database FIRST
2. ✅ Email notification is attempted
3. ✅ Email status is updated
4. ✅ API returns SUCCESS even if email fails

If email sending fails:
- Lead remains in database
- `emailStatus` set to "failed"
- Error is logged
- Request still returns success

## API Endpoints

### POST /api/contact

Lead capture endpoint.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "Need a custom platform",
  "leadType": "custom_software_development",
  "productInterest": "revosso_ecosystem",
  "sourcePage": "landing",
  "businessStage": "startup",
  "userLanguage": "en",
  "honeypot": ""
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "abc123"
}
```

**Features:**
- ✅ Input validation (Zod)
- ✅ Honeypot spam protection
- ✅ Rate limiting (5 requests per 10 minutes per IP)
- ✅ Automatic email notifications
- ✅ Never loses leads even if email fails

### POST /api/visitor

Anonymous visitor tracking endpoint.

**Request Body:**
```json
{
  "visitorId": "visitor_xyz",
  "pagePath": "/services/custom-software",
  "language": "en",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "success": true
}
```

**Features:**
- ✅ Always returns success
- ✅ Failure doesn't impact user experience
- ✅ Tracks page visits for analytics

## Service Layer

### LeadsService

Coordinates lead creation workflow.

**Methods:**
- `createLead(params)` - Create lead, send emails, update status
- `getAllLeads()` - Get all leads (for admin)
- `getLeadById(id)` - Get single lead
- `updateLeadStatus(id, status)` - Update lead status
- `getLeadsByStatus(status)` - Filter by status
- `getLeadsByProduct(product)` - Filter by product

### VisitorsService

Handles visitor tracking.

**Methods:**
- `trackVisit(params)` - Record page visit
- `getAllVisitors(limit)` - Get visitor records
- `getVisitorHistory(visitorId)` - Get repeat visitor activity

## Repository Layer

### LeadsRepository

ONLY layer allowed to query the leads table.

**Methods:**
- `create(lead)` - Insert new lead
- `updateEmailStatus(id, status)` - Update email status
- `updateLeadStatus(id, status)` - Update lead status
- `getAll()` - Get all leads
- `getById(id)` - Get single lead
- `getByStatus(status)` - Filter by status
- `getByProductInterest(product)` - Filter by product

### VisitorsRepository

ONLY layer allowed to query the visitors table.

**Methods:**
- `create(visitor)` - Insert visitor record
- `getAll(limit)` - Get all visitors
- `getByVisitorId(visitorId)` - Get visitor history

## Admin Interface

### /admin

Internal lead management dashboard.

**Features:**
- View all leads in table format
- See lead statistics (total, new, emails sent)
- Filter and sort capabilities
- View lead details (message, contact info)
- See lead metadata (IP, user agent, timestamps)

**Architecture:**
```
Admin Page (UI)
  ↓ calls
Server Actions (app/admin/actions.ts)
  ↓ calls
LeadsService
  ↓ calls
LeadsRepository
  ↓ queries
Database
```

**No Direct Database Access in UI Components**

## Email System

### Internal Notification Email

Sent to `ADMIN_EMAIL` when lead is created.

Includes:
- Lead name, email, company
- Message content
- Lead type, product interest, source, stage
- User language
- IP address and user agent
- Timestamp

### Confirmation Email

Sent to user after submission.

Includes:
- Thank you message
- Confirmation of receipt
- Product interest acknowledgment
- 24-hour response commitment

## Spam Protection

1. **Honeypot Field**
   - Hidden field that should remain empty
   - Bots fill it automatically
   - Form submission silently ignored

2. **Rate Limiting**
   - 5 requests per 10 minutes per IP
   - In-memory tracking
   - Returns 429 when exceeded

3. **Input Validation**
   - Zod schema validation
   - Email format verification
   - String length limits
   - Required field enforcement

## Environment Variables

Required configuration:

```env
# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@revosso.com

# Admin
ADMIN_EMAIL=admin@revosso.com
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file with required variables.

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test Lead Submission

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "honeypot": ""
  }'
```

### 6. View Leads

Navigate to: `http://localhost:3000/admin`

## File Structure

```
lib/
  ├── db.ts                          # Database configuration
  ├── schema.ts                      # Database schema definitions
  ├── validation.ts                  # Input validation schemas
  ├── mail.ts                        # Email sending utilities
  ├── rateLimit.ts                   # Rate limiting logic
  ├── repositories/
  │   ├── leads-repository.ts        # Leads data access
  │   └── visitors-repository.ts     # Visitors data access
  └── services/
      ├── leads-service.ts           # Lead business logic
      └── visitors-service.ts        # Visitor business logic

app/
  ├── api/
  │   ├── contact/
  │   │   └── route.ts              # Lead capture endpoint
  │   └── visitor/
  │       └── route.ts              # Visitor tracking endpoint
  └── admin/
      ├── actions.ts                # Server actions for admin
      └── page.tsx                  # Admin dashboard UI
```

## Future Enhancements

The architecture supports future expansion:

1. **Advanced Filtering**
   - Filter by date range
   - Filter by multiple criteria
   - Export to CSV

2. **Lead Management**
   - Update lead status
   - Add notes to leads
   - Retry failed emails

3. **Analytics Dashboard**
   - Conversion rates by source
   - Popular pages
   - Lead quality scores
   - Repeat visitor detection

4. **Email Templates**
   - Customizable templates
   - Multi-language support
   - Rich HTML formatting

5. **Integrations**
   - CRM sync (HubSpot, Salesforce)
   - Slack notifications
   - Zapier webhooks

## Logging

Important events are logged:

- ✅ Successful lead submissions
- ❌ Validation failures
- ❌ Email failures
- ❌ Database errors
- ⚠️ Spam attempts (honeypot triggered)
- ⚠️ Rate limit violations

## Production Deployment

### Checklist

- [ ] Configure production environment variables
- [ ] Set up Turso production database
- [ ] Configure SMTP provider
- [ ] Push database schema: `npm run db:push`
- [ ] Add authentication to /admin route
- [ ] Configure domain DNS
- [ ] Test email delivery
- [ ] Monitor logs for errors

### Security Considerations

1. **Admin Protection**
   - Add authentication middleware
   - Restrict by IP if needed
   - Use strong passwords

2. **Rate Limiting**
   - Consider Redis for distributed rate limiting
   - Adjust limits based on traffic

3. **Email Security**
   - Use trusted SMTP provider
   - Enable SPF/DKIM/DMARC
   - Monitor delivery rates

4. **Database**
   - Use Turso for automatic backups
   - Enable connection encryption
   - Rotate auth tokens regularly

## Troubleshooting

### Leads Not Saving

**Check:**
- Database credentials in .env
- Database schema is up to date
- Console logs for errors
- LeadsRepository.create() success

### Emails Not Sending

**Check:**
- SMTP credentials in .env
- SMTP host/port configuration
- Console logs for email errors
- Lead should still be saved even if email fails

### Rate Limit Too Restrictive

**Solution:**
Edit `lib/rateLimit.ts`:
```typescript
const MAX_REQUESTS = 10  // Increase
const WINDOW_MS = 5 * 60 * 1000  // Adjust window
```

### Admin Page Not Loading

**Check:**
- Server actions are properly defined
- Database connection is working
- Browser console for errors

## Support

For questions or issues with the lead management system, review:
- This documentation
- Server console logs
- Database schema in `lib/schema.ts`
- Service layer in `lib/services/`

## License

Internal system for Revosso. Not for external distribution.
