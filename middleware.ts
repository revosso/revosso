import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Next.js Middleware
 * 
 * Authentication Flow:
 * - Frontend routes (/admin) are protected by client-side ProtectedRoute component
 * - API routes (/api/admin) are protected by JWT validation middleware
 * - This middleware is intentionally minimal for the PKCE flow
 * 
 * Note: With PKCE flow, tokens are stored in memory on the client.
 * Server-side middleware cannot access these tokens.
 * Protection is handled by:
 * 1. Client-side: ProtectedRoute wrapper component
 * 2. Server-side: JWT validation in API routes using JWKS
 */

export default async function middleware(request: NextRequest) {
  // Pass through all requests
  // Authentication is handled by:
  // - Client components for frontend routes
  // - API route handlers for backend routes
  return NextResponse.next();
}

// Minimal matcher - only for essential routes if needed
export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
  ],
}

