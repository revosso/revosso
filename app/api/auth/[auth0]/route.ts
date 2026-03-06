import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

/**
 * Auth0 Dynamic API Route Handler
 * 
 * This handles all Auth0 authentication routes:
 * - GET/POST /api/auth/login - Initiates Auth0 login flow
 * - GET/POST /api/auth/logout - Logs out user and clears session
 * - GET /api/auth/callback - Auth0 callback after authentication
 * - GET /api/auth/me - Returns current user session
 * 
 * Token Validation:
 * - Uses Auth0's JWKS (JSON Web Key Set) to validate tokens
 * - No client secret needed for validation
 * - Tokens are verified against Auth0's public keys
 * 
 * Session Management:
 * - Sessions stored in encrypted HTTP-only cookies
 * - Secure, SameSite=Lax for CSRF protection
 * - Session expiry matches Auth0 token expiry
 * 
 * Environment Variables Required:
 * - AUTH0_SECRET: Random string for encrypting session cookies
 * - AUTH0_BASE_URL: Your app URL (e.g., http://localhost:3000)
 * - AUTH0_ISSUER_BASE_URL: Your Auth0 domain (e.g., https://dev-xxx.auth0.com)
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_AUDIENCE: (Optional) Your API identifier for JWT audience validation
 */

export async function GET(request: NextRequest) {
  return auth0.middleware(request);
}

export async function POST(request: NextRequest) {
  return auth0.middleware(request);
}
