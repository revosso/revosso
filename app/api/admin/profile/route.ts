import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';

/**
 * Protected Admin API - User Profile
 * 
 * This endpoint demonstrates JWT validation using Auth0 JWKS.
 * 
 * Token Validation:
 * - Validates JWT using Auth0's JWKS (public keys)
 * - No client secret needed
 * - Checks token signature, expiry, audience, and issuer
 * - Returns 401 if token is invalid or missing
 * - Returns 403 if user lacks admin role
 * 
 * Usage:
 * GET /api/admin/profile
 * Headers: Authorization: Bearer <access_token>
 */

/**
 * GET /api/admin/profile
 * Returns the current authenticated admin user's profile information
 */
export const GET = withAdminAuth(async (request, context, user) => {
  // User is authenticated and has admin role
  // Access user data from the validated JWT token
  
  return NextResponse.json({
    user: {
      id: user.sub,
      email: user.email,
      name: user.name,
      roles: user.roles || user['https://revosso.com/roles'] || [],
    },
  });
});
