'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0/client';

/**
 * Client-side session provider wrapper for Auth0
 * This provides user session context to all client components
 * 
 * Uses @auth0/nextjs-auth0 which:
 * - Automatically validates JWTs using Auth0's JWKS (public keys)
 * - No client secret needed
 * - Handles session management with encrypted cookies
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <Auth0Provider>{children}</Auth0Provider>;
}
