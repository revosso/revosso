# Backend Lead Management System

This document describes the backend infrastructure for managing leads from the landing page forms.

## Overview

The backend system receives and stores leads from two types of forms:
1. **Project Submissions** - When users submit project requests
2. **Consultation Bookings** - When users book consultations

## Architecture

### API Routes

#### `/api/leads/project` (POST)
- **Purpose**: Submit a new project lead
- **Request Body**:
  ```json
  {
    "name": "string (required, min 2 chars)",
    "email": "string (required, valid email)",
    "company": "string (optional)",
    "projectTypes": ["array of strings (required, min 1)"],
    "budget": "string (optional)",
    "timeline": "string (optional)",
    "description": "string (required, min 10 chars)"
  }
  ```
- **Response**: `201 Created` with lead data

#### `/api/leads/consultation` (POST)
- **Purpose**: Book a consultation
- **Request Body**:
  ```json
  {
    "name": "string (required, min 2 chars)",
    "email": "string (required, valid email)",
    "company": "string (optional)",
    "phone": "string (optional)",
    "service": "string (optional)",
    "date": "string (ISO date, optional)",
    "time": "string (optional)",
    "message": "string (optional)"
  }
  ```
- **Response**: `201 Created` with lead data

#### `/api/leads` (GET)
- **Purpose**: Retrieve all leads with optional filtering
- **Query Parameters**:
  - `type`: Filter by "project" or "consultation"
  - `status`: Filter by status (e.g., "new", "in-progress", "resolved")
- **Response**: `200 OK` with array of leads

#### `/api/leads` (PATCH)
- **Purpose**: Update a lead's status or other fields
- **Request Body**:
  ```json
  {
    "id": "string (required)",
    "status": "string (optional)",
    ...other fields
  }
  ```
- **Response**: `200 OK` with updated lead

#### `/api/leads` (DELETE)
- **Purpose**: Delete a lead
- **Query Parameters**:
  - `id`: Lead ID to delete
- **Response**: `200 OK` on success

## Data Storage

### File-based Storage
Leads are stored in `/data/leads.json` using a simple file-based approach. This is suitable for:
- Development and testing
- Small to medium traffic
- Quick prototyping

### Data Structure

#### Project Lead
```typescript
{
  id: string
  type: "project"
  name: string
  email: string
  company?: string
  projectTypes: string[]
  budget?: string
  timeline?: string
  description: string
  status: "new" | "in-progress" | "resolved"
  createdAt: string (ISO date)
  updatedAt: string (ISO date)
}
```

#### Consultation Lead
```typescript
{
  id: string
  type: "consultation"
  name: string
  email: string
  company?: string
  phone?: string
  service?: string
  date?: string (ISO date)
  time?: string
  message?: string
  status: "new" | "scheduled" | "completed" | "cancelled"
  createdAt: string (ISO date)
  updatedAt: string (ISO date)
}
```

## Validation

All form submissions are validated using Zod schemas:
- **Project Lead Schema**: Validates name, email, project types, and description
- **Consultation Lead Schema**: Validates name and email (other fields optional)

Validation errors return `400 Bad Request` with detailed error messages.

## Admin Interface

### Access
Navigate to `/admin/leads` to view and manage all leads.

### Features
- **Statistics Dashboard**: View total leads, projects, consultations, and new leads
- **Filtering**: Filter by type (project/consultation) and status
- **View Modes**: 
  - Table view for quick scanning
  - Card view for detailed information
- **Status Management**: Update lead status directly from the interface
- **Delete Leads**: Remove leads with confirmation dialog

## Error Handling

All API routes include comprehensive error handling:
- Validation errors return `400` with detailed messages
- Server errors return `500` with generic error messages
- All errors are logged to the console for debugging

## Future Enhancements

Consider these improvements for production:

1. **Database Integration**
   - Replace file storage with PostgreSQL, MongoDB, or Supabase
   - Add proper indexing for queries
   - Implement database migrations

2. **Email Notifications**
   - Send confirmation emails to users
   - Notify admins of new leads
   - Use services like SendGrid, Resend, or AWS SES

3. **Rate Limiting**
   - Prevent spam submissions
   - Use middleware like `@upstash/ratelimit`

4. **Authentication**
   - Protect admin routes with authentication
   - Implement role-based access control

5. **Export Functionality**
   - Export leads to CSV/Excel
   - Generate reports

6. **Search & Pagination**
   - Full-text search across leads
   - Pagination for large datasets

7. **Webhooks**
   - Integrate with CRM systems
   - Send leads to external services

## Testing

To test the backend:

1. **Submit a Project Lead**:
   ```bash
   curl -X POST http://localhost:3000/api/leads/project \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "projectTypes": ["web", "mobile"],
       "description": "I need a website for my business"
     }'
   ```

2. **Submit a Consultation**:
   ```bash
   curl -X POST http://localhost:3000/api/leads/consultation \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jane Smith",
       "email": "jane@example.com",
       "date": "2024-03-20T10:00:00Z",
       "time": "10:00"
     }'
   ```

3. **Get All Leads**:
   ```bash
   curl http://localhost:3000/api/leads
   ```

## File Structure

```
app/
  api/
    leads/
      project/
        route.ts      # Project submission endpoint
      consultation/
        route.ts      # Consultation booking endpoint
      route.ts        # General leads CRUD operations
  admin/
    leads/
      page.tsx        # Admin interface for managing leads
lib/
  leads-storage.ts    # Data persistence layer
  leads-validation.ts  # Zod validation schemas
data/
  leads.json          # JSON file storing all leads (gitignored)
```

## Notes

- The `/data` directory is gitignored to prevent committing lead data
- All dates are stored in ISO 8601 format
- Lead IDs are generated using timestamp + random string
- The system is designed to be easily migrated to a database

