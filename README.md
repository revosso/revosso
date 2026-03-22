# Revosso

Digital infrastructure and platform engineering — public website and internal admin platform.

---

## Overview

This repository contains the full Revosso platform, built as a Next.js 15 monorepo with subdomain-based routing:

| Domain | Purpose |
|---|---|
| `revosso.com` | Public marketing landing page |
| `manage.revosso.com` | Internal admin dashboard (protected) |

The landing page handles lead capture and visitor analytics. The admin dashboard provides a management interface for leads, protected behind Auth0 authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 + Tailwind CSS 3 + shadcn/ui |
| Database | [Turso](https://turso.tech) (edge SQLite via libSQL) |
| ORM | Drizzle ORM |
| Auth | Auth0 (PKCE flow + JWKS JWT validation) |
| Email | Nodemailer (SMTP) |
| Validation | Zod + react-hook-form |
| Analytics | Vercel Analytics |
| Package Manager | pnpm 9 |

---

## Project Structure

```
revosso/
├── app/
│   ├── (landing)/          # Public marketing site
│   │   ├── page.tsx        # Landing page (i18n: en, fr, pt-BR, es)
│   │   ├── privacy/        # Privacy Policy page
│   │   ├── terms/          # Terms of Service page
│   │   ├── cookies/        # Cookie Policy page
│   │   └── security/       # Security page
│   ├── (dashboard)/        # Admin dashboard (manage.revosso.com)
│   │   └── layout.tsx
│   └── api/
│       ├── auth/           # Auth0 callback handler
│       ├── contact/        # Lead capture endpoint
│       ├── visitor/        # Anonymous visitor tracking
│       └── admin/          # Admin-protected endpoints
│           ├── leads/      # CRUD for leads
│           └── profile/    # Admin user profile
│
├── lib/
│   ├── db.ts               # Turso/libSQL client
│   ├── schema.ts           # Drizzle schema (leads + visitors tables)
│   ├── auth.ts             # Server-side auth helpers
│   ├── auth0.ts            # Auth0 client singleton
│   ├── api-auth.ts         # withAuth / withAdminAuth HOF wrappers
│   ├── jwt-validation.ts   # JWKS-based JWT validation
│   ├── mail.ts             # SMTP email sending
│   ├── rateLimit.ts        # In-memory rate limiter
│   ├── validation.ts       # Zod schemas (contact form)
│   ├── repositories/       # Data access layer (only layer touching DB)
│   └── services/           # Business logic layer
│
├── components/
│   ├── auth0-provider.tsx  # Client-side Auth0 PKCE context
│   ├── protected-route.tsx # ProtectedRoute / AdminProtectedRoute
│   └── ui/                 # shadcn/ui component library
│
├── middleware.ts            # Subdomain routing
├── drizzle.config.ts        # Drizzle Kit config
└── next.config.mjs          # Next.js config
```

---

## Architecture

The platform follows a clean layered architecture:

```
UI (React components)
    ↓
API Routes (app/api/)          ← input validation, rate limiting, auth
    ↓
Service Layer (lib/services/)  ← business logic, email orchestration
    ↓
Repository Layer (lib/repositories/)  ← sole DB access point
    ↓
Database (Turso / libSQL)
```

**Key guarantee:** Leads are persisted to the database _before_ emails are sent. Email failures never cause lead loss.

---

## Authentication Flow

1. Client-side Auth0 PKCE flow via `Auth0Provider`
2. Access tokens stored **in memory only** (never localStorage or cookies)
3. Tokens sent as `Authorization: Bearer <token>` to API routes
4. Server-side JWKS validation via `lib/jwt-validation.ts`
5. Admin role enforced via custom Auth0 claim `https://revosso.com/roles`
6. `withAuth` / `withAdminAuth` HOFs protect all API routes

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9
- A [Turso](https://turso.tech) database
- An [Auth0](https://auth0.com) application (SPA + PKCE)
- An SMTP provider for outbound email

### Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# App
NEXT_PUBLIC_BASE_DOMAIN=revosso.com
NEXT_PUBLIC_LOCAL_BASE_DOMAIN=revosso.local
NEXT_PUBLIC_DASHBOARD_SUBDOMAIN=manage

# Database (Turso)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=...
NEXT_PUBLIC_AUTH0_CLIENT_ID=...
NEXT_PUBLIC_AUTH0_AUDIENCE=...
AUTH0_SECRET=...

# Email (SMTP)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=contact@revosso.com
NOTIFICATION_EMAIL=contact@revosso.com
```

### Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up local hosts (required for subdomain routing):
   ```bash
   pnpm setup
   ```
   This adds the following entries to `/etc/hosts`:
   ```
   127.0.0.1 revosso.local
   127.0.0.1 manage.revosso.local
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open the relevant URLs:
   - Landing page: [http://revosso.local:3000](http://revosso.local:3000)
   - Admin dashboard: [http://manage.revosso.local:3000](http://manage.revosso.local:3000)

   Convenience shortcuts:
   ```bash
   pnpm dev:landing    # Open landing page
   pnpm dev:dashboard  # Open dashboard
   ```

### Database

```bash
pnpm db:generate   # Generate Drizzle migration files
pnpm db:migrate    # Apply migrations to Turso (CLI; same as startup)
pnpm db:push       # Push schema changes directly (development)
```

**Production / `pnpm start`:** Migrations run automatically before `next start` via `scripts/db-migrate.mjs` (uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`, loads `.env` when present). After pointing the app at a new database, a normal start will create/upgrade tables from `./drizzle`.

- To skip (e.g. you run migrations in CI only): set `SKIP_DB_MIGRATE_ON_START=1` or use `pnpm start:no-migrate`.
- **Serverless (e.g. Vercel):** there is no long-lived `next start`; run `pnpm db:migrate` in the build command or a release step, or call the same script there, so each deployment applies pending migrations.
- If a database was created with `db:push` instead of migrations, `migrate` can conflict with existing tables—prefer one workflow per environment (migrations for prod, or baseline `__drizzle_migrations` as in Drizzle docs).

---

## Database Schema

### `leads`

| Column | Type | Description |
|---|---|---|
| `id` | text | Nanoid primary key |
| `name` | text | Contact name |
| `email` | text | Contact email |
| `company` | text | Company name (optional) |
| `message` | text | Project description |
| `leadType` | text | `project` or `consultation` |
| `productInterest` | text | Service area of interest |
| `sourcePage` | text | Page where lead originated |
| `businessStage` | text | Business stage of contact |
| `emailStatus` | text | `pending` / `sent` / `failed` |
| `leadStatus` | text | `new` / `contacted` / `qualified` / `closed` |
| `ipAddress` | text | Requester IP |
| `userAgent` | text | Browser user agent |
| `userLanguage` | text | Browser language |
| `createdAt` | integer | Unix timestamp |

### `visitors`

| Column | Type | Description |
|---|---|---|
| `id` | text | Nanoid primary key |
| `visitorId` | text | Anonymous visitor identifier |
| `ipAddress` | text | Visitor IP |
| `userAgent` | text | Browser user agent |
| `pagePath` | text | Visited path |
| `language` | text | Browser language |
| `referrer` | text | Referring URL |
| `createdAt` | integer | Unix timestamp |

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit a contact form / create lead |
| `POST` | `/api/visitor` | Track anonymous visitor |

### Admin Endpoints (JWT required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/leads` | List all leads |
| `GET` | `/api/admin/leads/:id` | Get single lead |
| `PATCH` | `/api/admin/leads/:id` | Update lead status |
| `DELETE` | `/api/admin/leads/:id` | Delete lead |
| `GET` | `/api/admin/profile` | Get current admin profile |

See [`API_REFERENCE.md`](./API_REFERENCE.md) for full request/response schemas.

---

## Internationalization

The landing page is fully translated for four locales, auto-detected from the browser:

| Locale | Language |
|---|---|
| `en` | English (default) |
| `fr` | French |
| `pt-BR` | Brazilian Portuguese |
| `es` | Spanish |

All translations are co-located in the landing page file under the `translations` constant.

---

## Deployment

The platform is designed to deploy on [Vercel](https://vercel.com):

1. Connect the repository to Vercel
2. Set all required environment variables in the Vercel project settings
3. Configure custom domains: `revosso.com` and `manage.revosso.com`
4. Deploy — Vercel automatically builds and serves both subdomains from the same deployment

---

## Security

- All admin API routes are protected with server-side JWT validation
- Input is validated with Zod on all endpoints
- Rate limiting protects the contact form endpoint
- No secrets are committed to version control

To report a security vulnerability, see our [Security Policy](https://revosso.com/security) or email **security@revosso.com**.

---

## Documentation

Additional documentation files:

| File | Description |
|---|---|
| [`SETUP.md`](./SETUP.md) | Detailed environment setup guide |
| [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) | Database setup and migration instructions |
| [`API_REFERENCE.md`](./API_REFERENCE.md) | Full API endpoint reference |
| [`LEAD_SYSTEM_DOCUMENTATION.md`](./LEAD_SYSTEM_DOCUMENTATION.md) | Lead system architecture |
| [`PKCE_QUICK_START.md`](./PKCE_QUICK_START.md) | Auth0 PKCE configuration guide |
| [`QUICK_START.md`](./QUICK_START.md) | Quick start checklist |

---

## License

Private and proprietary. All rights reserved. © Revosso.
