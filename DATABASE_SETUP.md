# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the lead management system.

## Prerequisites

- PostgreSQL installed locally or access to a PostgreSQL database (Supabase, Railway, Neon, etc.)
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Database Connection

Create a `.env` file in the root directory (if it doesn't exist) and add your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/revosso"
```

#### Database URL Formats

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/revosso"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Railway:**
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
```

**Neon:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

### 3. Create Database (if using local PostgreSQL)

If you're using a local PostgreSQL installation, create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE revosso;

# Exit
\q
```

### 4. Generate Prisma Client

Generate the Prisma Client based on your schema:

```bash
npm run db:generate
```

### 5. Run Database Migrations

Create and apply the database schema:

```bash
npm run db:migrate
```

This will:
- Create the `project_leads` and `consultation_leads` tables
- Set up all necessary columns and indexes
- Create a migration history

### 6. (Optional) Open Prisma Studio

View and manage your database through Prisma Studio:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your data.

## Database Schema

### ProjectLeads Table

- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Lead's name
- `email` (String) - Lead's email
- `company` (String, Optional) - Company name
- `projectTypes` (String[]) - Array of project types
- `budget` (String, Optional) - Budget range
- `timeline` (String, Optional) - Project timeline
- `description` (String) - Project description
- `status` (String) - Status: "new", "in-progress", "resolved"
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### ConsultationLeads Table

- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Lead's name
- `email` (String) - Lead's email
- `company` (String, Optional) - Company name
- `phone` (String, Optional) - Phone number
- `service` (String, Optional) - Service of interest
- `date` (DateTime, Optional) - Consultation date
- `time` (String, Optional) - Consultation time
- `message` (String, Optional) - Additional message
- `status` (String) - Status: "new", "scheduled", "completed", "cancelled"
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema changes without migrations (for prototyping)

## Troubleshooting

### Connection Issues

1. **Check your DATABASE_URL** - Ensure it's correct and accessible
2. **Verify PostgreSQL is running** - `pg_isready` or check service status
3. **Check firewall/network** - Ensure port 5432 is accessible
4. **Verify credentials** - Username and password are correct

### Migration Issues

If migrations fail:

```bash
# Reset the database (WARNING: This deletes all data)
npx prisma migrate reset

# Or push schema directly (for development)
npm run db:push
```

### Prisma Client Not Found

If you see "PrismaClient is not defined":

```bash
npm run db:generate
```

## Production Considerations

1. **Use connection pooling** - Consider using Prisma Data Proxy or PgBouncer
2. **Environment variables** - Never commit `.env` files
3. **Backup strategy** - Set up regular database backups
4. **Monitoring** - Monitor database performance and connections
5. **Indexes** - Add indexes for frequently queried fields if needed

## Migration from File Storage

If you have existing data in `/data/leads.json`, you can migrate it:

1. Export the JSON data
2. Create a migration script to import into PostgreSQL
3. Run the migration script
4. Verify data integrity

## Next Steps

Once your database is set up:

1. Test the API endpoints
2. Submit a test lead through the form
3. Check the admin interface at `/admin/leads`
4. Verify data is being stored correctly

For more information, see the [Prisma documentation](https://www.prisma.io/docs).

