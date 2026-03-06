import { Auth0Client } from '@auth0/nextjs-auth0/server';

/**
 * Auth0 SDK Client Instance
 * 
 * This creates a singleton Auth0 client that can be imported throughout the app.
 * 
 * Token Validation:
 * - Automatically validates JWTs using Auth0's JWKS (public keys)
 * - No client secret required for validation (only for Management API)
 * - Verifies token signature, expiry, audience, and issuer
 * 
 * Session Management:
 * - HTTP-only cookies for security
 * - Secure, SameSite=Lax for CSRF protection
 * - Automatic session encryption
 * 
 * Environment Variables:
 * - AUTH0_SECRET: Session encryption key
 * - AUTH0_BASE_URL: App URL (inferred if not provided)
 * - AUTH0_ISSUER_BASE_URL: Auth0 domain
 * - AUTH0_CLIENT_ID: Auth0 app client ID
 * - AUTH0_AUDIENCE: (Optional) API audience for JWT validation
 * - AUTH0_CLIENT_SECRET: (Optional) Only needed for Management API calls
 */
export const auth0 = new Auth0Client({
  // These are read from environment variables automatically
  // But you can also pass them explicitly:
  // domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', ''),
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET, // Optional
  // appBaseUrl: process.env.AUTH0_BASE_URL,
  // secret: process.env.AUTH0_SECRET,
});
