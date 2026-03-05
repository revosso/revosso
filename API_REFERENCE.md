# Revosso Lead System - API Reference

## Lead Capture API

### POST /api/contact

Submit a new business lead to the Revosso system.

#### Endpoint
```
POST https://revosso.com/api/contact
```

#### Headers
```
Content-Type: application/json
```

#### Request Body

```typescript
{
  // Required fields
  name: string,              // Min 2 chars, max 100 chars
  email: string,             // Valid email format
  message: string,           // Min 10 chars, max 2000 chars
  
  // Optional fields
  company?: string,          // Max 200 chars
  leadType?: string,         // Max 100 chars
  productInterest?: string,  // Max 100 chars
  sourcePage?: string,       // Max 100 chars
  businessStage?: string,    // Max 100 chars
  userLanguage?: string,     // Max 10 chars
  
  // Spam protection (must be empty)
  honeypot?: string          // Max 0 chars (must be empty string or undefined)
}
```

#### Example Request

```bash
curl -X POST https://revosso.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "company": "Acme Corporation",
    "message": "We need a custom e-commerce platform built from scratch.",
    "leadType": "custom_software_development",
    "productInterest": "revosso_ecosystem",
    "sourcePage": "landing",
    "businessStage": "growing_business",
    "userLanguage": "en",
    "honeypot": ""
  }'
```

#### Success Response

**Code:** `200 OK`

```json
{
  "success": true,
  "leadId": "abc123xyz"
}
```

#### Error Responses

**Validation Error**

**Code:** `400 Bad Request`

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Rate Limit Exceeded**

**Code:** `429 Too Many Requests`

```json
{
  "error": "Too many requests. Please try again later."
}
```

**Server Error**

**Code:** `500 Internal Server Error`

```json
{
  "error": "An unexpected error occurred"
}
```

#### Field Descriptions

##### name
User's full name.
- **Type:** String
- **Required:** Yes
- **Min Length:** 2 characters
- **Max Length:** 100 characters
- **Example:** `"John Doe"`

##### email
User's email address. Must be valid format.
- **Type:** String
- **Required:** Yes
- **Format:** Valid email
- **Example:** `"john@example.com"`

##### company
Company or organization name (optional).
- **Type:** String
- **Required:** No
- **Max Length:** 200 characters
- **Example:** `"Acme Corporation"`

##### message
The inquiry message content.
- **Type:** String
- **Required:** Yes
- **Min Length:** 10 characters
- **Max Length:** 2000 characters
- **Example:** `"We need a custom platform built..."`

##### leadType
Type of service or inquiry. Flexible string for future expansion.
- **Type:** String
- **Required:** No
- **Max Length:** 100 characters
- **Common Values:**
  - `"custom_software_development"`
  - `"platform_maintenance"`
  - `"platform_hosting"`
  - `"platform_migration"`
  - `"product_information"`
  - `"partnership"`
  - `"general_inquiry"`

##### productInterest
Specific product or platform of interest.
- **Type:** String
- **Required:** No
- **Max Length:** 100 characters
- **Common Values:**
  - `"cashlakay"`
  - `"revofin"`
  - `"rechajem"`
  - `"nuvann"`
  - `"revosso_ecosystem"`

##### sourcePage
Page where the lead originated.
- **Type:** String
- **Required:** No
- **Max Length:** 100 characters
- **Common Values:**
  - `"landing"`
  - `"services"`
  - `"custom_software"`
  - `"platform_maintenance"`
  - `"platform_hosting"`
  - `"ecosystem"`
  - `"contact"`

##### businessStage
Current stage of the business.
- **Type:** String
- **Required:** No
- **Max Length:** 100 characters
- **Common Values:**
  - `"idea"`
  - `"startup"`
  - `"growing_business"`
  - `"enterprise"`
  - `"existing_platform"`

##### userLanguage
User's preferred language.
- **Type:** String (ISO 639-1 code)
- **Required:** No
- **Max Length:** 10 characters
- **Example:** `"en"`, `"fr"`, `"es"`

##### honeypot
Spam protection field. Must be empty.
- **Type:** String
- **Required:** No
- **Max Length:** 0 characters
- **Note:** This field should be hidden in your form. Legitimate users won't fill it.
- **Example:** `""`

#### Rate Limiting

- **Limit:** 5 requests per 10 minutes per IP address
- **Reset:** Automatic after 10 minutes
- **Response:** `429 Too Many Requests` when exceeded

#### Behavior

1. **Validation**
   - Input is validated against schema
   - Email format is verified
   - String lengths are checked

2. **Spam Protection**
   - Honeypot field checked (must be empty)
   - Rate limiting enforced
   - Silently rejects if honeypot filled

3. **Database Storage**
   - Lead is inserted into database FIRST
   - Guaranteed to be stored even if emails fail

4. **Email Notifications**
   - Internal notification sent to admin
   - Confirmation email sent to user
   - Failures are logged but don't break request

5. **Response**
   - Returns success if lead was stored
   - Email failures don't cause request to fail
   - Lead ID returned for tracking

---

## Visitor Tracking API

### POST /api/visitor

Track anonymous page visits for analytics.

#### Endpoint
```
POST https://revosso.com/api/visitor
```

#### Headers
```
Content-Type: application/json
```

#### Request Body

```typescript
{
  // Required fields
  visitorId: string,    // Anonymous visitor identifier
  pagePath: string,     // Page URL path
  
  // Optional fields
  language?: string,    // User language
  referrer?: string     // Referrer URL
}
```

#### Example Request

```bash
curl -X POST https://revosso.com/api/visitor \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "visitor_abc123",
    "pagePath": "/services/custom-software",
    "language": "en",
    "referrer": "https://google.com"
  }'
```

#### Success Response

**Code:** `200 OK`

```json
{
  "success": true
}
```

**Note:** This endpoint ALWAYS returns success, even if tracking fails. Visitor tracking failures should not impact user experience.

#### Field Descriptions

##### visitorId
Anonymous identifier for the visitor (e.g., from cookie or fingerprint).
- **Type:** String
- **Required:** Yes
- **Example:** `"visitor_abc123"`

##### pagePath
The page path being visited.
- **Type:** String
- **Required:** Yes
- **Max Length:** 500 characters
- **Example:** `"/services/custom-software"`

##### language
User's browser language.
- **Type:** String
- **Required:** No
- **Max Length:** 10 characters
- **Example:** `"en"`, `"fr-CA"`

##### referrer
The referrer URL (where they came from).
- **Type:** String
- **Required:** No
- **Max Length:** 500 characters
- **Example:** `"https://google.com"`

#### Behavior

1. **Lightweight**
   - Minimal processing
   - Fast response
   - Non-blocking

2. **Failure Tolerant**
   - Always returns success
   - Failures logged but silent
   - Doesn't break user experience

3. **Analytics Purpose**
   - Track popular pages
   - Identify repeat visitors
   - Understand traffic patterns

---

## Integration Examples

### JavaScript Fetch API

```javascript
// Lead submission
async function submitLead(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        leadType: 'custom_software_development',
        sourcePage: 'landing',
        honeypot: formData.honeypot || '',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Lead submitted:', data.leadId);
      return { success: true, leadId: data.leadId };
    } else {
      console.error('Validation error:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: 'Network error' };
  }
}

// Visitor tracking
async function trackPageView(path) {
  const visitorId = getOrCreateVisitorId(); // Your visitor ID logic
  
  fetch('/api/visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      pagePath: path,
      language: navigator.language,
      referrer: document.referrer,
    }),
  }).catch(err => {
    // Silent failure - don't impact user
    console.debug('Visitor tracking failed:', err);
  });
}
```

### React Hook Example

```typescript
import { useState } from 'react';

export function useLeadSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLead = async (data: LeadFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          honeypot: '', // Important!
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitLead, loading, error };
}
```

### Next.js Server Component

```typescript
// This would be for a different use case
// For form submission, use client-side fetch
import { redirect } from 'next/navigation';

export async function submitLeadAction(formData: FormData) {
  'use server';
  
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    honeypot: formData.get('honeypot') as string,
  };

  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    redirect('/thank-you');
  }
}
```

---

## Testing

### Test Valid Lead Submission

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message that is long enough.",
    "honeypot": ""
  }'
```

Expected: `{"success":true,"leadId":"..."}`

### Test Invalid Email

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "message": "Test message"
  }'
```

Expected: `{"error":"Validation failed","details":[...]}`

### Test Rate Limiting

```bash
# Run this 6 times quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"t@e.com","message":"1234567890"}'
done
```

Expected: First 5 succeed, 6th returns `429`

### Test Spam (Honeypot)

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bot",
    "email": "bot@spam.com",
    "message": "Spam message",
    "honeypot": "filled by bot"
  }'
```

Expected: `{"success":true}` (but lead not actually saved)

---

## Common Integration Patterns

### Landing Page Contact Form

```html
<form id="contactForm">
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="company" />
  <textarea name="message" required></textarea>
  
  <!-- Hidden honeypot -->
  <input name="honeypot" style="display:none" tabindex="-1" autocomplete="off" />
  
  <!-- Hidden fields for analytics -->
  <input type="hidden" name="sourcePage" value="landing" />
  <input type="hidden" name="leadType" value="general_inquiry" />
  
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  
  if (response.ok) {
    window.location.href = '/thank-you';
  }
});
</script>
```

### Automatic Visitor Tracking

```javascript
// Track every page view
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId: getVisitorId(),
      pagePath: window.location.pathname,
      language: navigator.language,
      referrer: document.referrer,
    }),
  });
});

function getVisitorId() {
  let id = localStorage.getItem('visitorId');
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', id);
  }
  return id;
}
```

---

## Notes

1. **Reliability:** Lead submission always saves to database first, before attempting emails.
2. **Privacy:** Visitor tracking is anonymous - no personal data collected.
3. **Rate Limiting:** Applied per IP address to prevent abuse.
4. **Spam Protection:** Honeypot field and rate limiting work together.
5. **Error Handling:** Clear error messages for validation failures.
6. **Monitoring:** All operations logged for debugging.

For full documentation, see `LEAD_SYSTEM_DOCUMENTATION.md`.
