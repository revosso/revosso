# PKCE Implementation - Quick Start

**This is the NEW implementation using client-side PKCE flow (no client secret).**

For the old server-side implementation, see `AUTH0_QUICK_START.md`.

---

## Overview

✅ **Pure PKCE Flow** - No client secret needed
✅ **Tokens in Memory** - Not localStorage
✅ **JWKS Validation** - Backend uses public keys only
✅ **Auth0 Universal Login** - Hosted secure authentication

---

## 5-Minute Setup

### Step 1: Auth0 Application Setup

1. Create a **Single Page Application** in Auth0
2. Configure URLs:
   - **Callback**: `http://localhost:3000/callback`
   - **Logout**: `http://localhost:3000`
   - **Web Origins**: `http://localhost:3000`
3. Note your **Domain** and **Client ID**

### Step 2: Auth0 API Setup

1. Create an **API** in Auth0
2. **Identifier**: `https://api.revosso.com`
3. **Algorithm**: RS256

### Step 3: Update Environment Variables

```bash
# Backend
AUTH0_DOMAIN=your-domain.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_AUDIENCE=https://api.revosso.com

# Frontend
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.revosso.com
NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/callback
```

### Step 4: Create Admin User & Role

1. Create user in Auth0
2. Create "admin" role
3. Assign role to user
4. Add Auth0 Action to include roles in token (see full docs)

### Step 5: Test

```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin` → Should redirect to Auth0 login

---

## Key Files

### Frontend
- `components/auth0-provider.tsx` - Auth context
- `components/protected-route.tsx` - Route protection
- `components/auth-buttons.tsx` - Login/Logout UI
- `app/callback/page.tsx` - OAuth callback

### Backend
- `lib/jwt-validation.ts` - JWKS token validation
- `lib/api-auth.ts` - API route protection
- `app/api/admin/leads/route.ts` - Protected API example

---

## Usage Examples

### Protect a Page

```tsx
import { AdminProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <YourContent />
    </AdminProtectedRoute>
  );
}
```

### Make Authenticated API Call

```tsx
import { useAuth0 } from '@/components/auth0-provider';
import { authenticatedGet } from '@/lib/authenticated-fetch';

const { getAccessToken } = useAuth0();
const data = await authenticatedGet('/api/admin/leads', getAccessToken);
```

### Protect an API Route

```typescript
import { withAdminAuth } from '@/lib/api-auth';

export const GET = withAdminAuth(async (request, context, user) => {
  return NextResponse.json({ data: 'protected' });
});
```

---

## Full Documentation

See `AUTH0_PKCE_IMPLEMENTATION.md` for complete documentation.

---

## Differences from Old Implementation

| Feature | Old (Server-Side) | New (PKCE) |
|---------|------------------|------------|
| Client Secret | Required | **NOT used** |
| Token Storage | Server cookies | **Memory** |
| Authentication | Server-side | **Client-side** |
| Token Validation | `@auth0/nextjs-auth0` | **JWKS (jose)** |
| SDK | `@auth0/nextjs-auth0` | **`@auth0/auth0-spa-js`** |
| API Routes | Session cookies | **Bearer token** |

---

## Troubleshooting

**"No access token available"**
- User not logged in → Click login button

**"JWT validation failed"**
- Check `AUTH0_AUDIENCE` matches API identifier

**"Forbidden - Admin role required"**
- Add admin role to user in Auth0
- Verify Auth0 Action is deployed

---

## Production Checklist

- [ ] Update callback URLs in Auth0 for production domain
- [ ] Set production environment variables
- [ ] Enable MFA for admin users
- [ ] Test full authentication flow
- [ ] Monitor Auth0 logs

---

## Support

Full setup instructions: `AUTH0_PKCE_IMPLEMENTATION.md`
