import { NextRequest, NextResponse } from 'next/server';
import { validateAPIRequestToken, type DecodedToken, isAdmin } from '@/lib/jwt-validation';

/**
 * API Route Protection Middleware
 * 
 * This module provides utilities to protect API routes with JWT validation.
 * 
 * Authentication Flow:
 * 1. Client sends request with: Authorization: Bearer <access_token>
 * 2. Middleware validates token using Auth0's JWKS public keys
 * 3. If valid, request proceeds with user context
 * 4. If invalid, returns 401 Unauthorized
 * 
 * No client secret required - uses JWKS public key validation only.
 */

export type ProtectedAPIHandler = (
  request: Request,
  context: { params?: any },
  user: DecodedToken
) => Promise<Response> | Response;

/**
 * Protect an API route with JWT authentication
 * 
 * @param handler - API route handler function
 * @returns Protected route handler
 * 
 * @example
 * export const GET = withAuth(async (request, context, user) => {
 *   // user is authenticated, access user.sub, user.email, etc.
 *   return NextResponse.json({ data: 'protected' });
 * });
 */
export function withAuth(handler: ProtectedAPIHandler) {
  return async (request: Request, context?: { params?: any }) => {
    try {
      // Validate JWT token from Authorization header
      const user = await validateAPIRequestToken(request);
      
      // Token is valid, call handler with user context
      return await handler(request, context || {}, user);
    } catch (error) {
      console.error('API authentication error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('missing')) {
          return NextResponse.json(
            { error: 'Unauthorized - Authentication required' },
            { status: 401 }
          );
        }
        if (error.message.includes('invalid') || error.message.includes('validation failed')) {
          return NextResponse.json(
            { error: 'Unauthorized - Invalid token' },
            { status: 401 }
          );
        }
        if (error.message.includes('expired')) {
          return NextResponse.json(
            { error: 'Unauthorized - Token expired' },
            { status: 401 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

/**
 * Protect an API route with JWT authentication and require admin role
 * 
 * @param handler - API route handler function
 * @returns Protected route handler that requires admin role
 * 
 * @example
 * export const GET = withAdminAuth(async (request, context, user) => {
 *   // user is authenticated AND has admin role
 *   return NextResponse.json({ data: 'admin protected' });
 * });
 */
export function withAdminAuth(handler: ProtectedAPIHandler) {
  return async (request: Request, context?: { params?: any }) => {
    try {
      // Validate JWT token from Authorization header
      const user = await validateAPIRequestToken(request);
      
      // Check if user has admin role
      if (!isAdmin(user)) {
        return NextResponse.json(
          { error: 'Forbidden - Admin role required' },
          { status: 403 }
        );
      }
      
      // Token is valid and user is admin, call handler
      return await handler(request, context || {}, user);
    } catch (error) {
      console.error('API authentication error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('missing')) {
          return NextResponse.json(
            { error: 'Unauthorized - Authentication required' },
            { status: 401 }
          );
        }
        if (error.message.includes('invalid') || error.message.includes('validation failed')) {
          return NextResponse.json(
            { error: 'Unauthorized - Invalid token' },
            { status: 401 }
          );
        }
        if (error.message.includes('expired')) {
          return NextResponse.json(
            { error: 'Unauthorized - Token expired' },
            { status: 401 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

/**
 * Extract user from request in a protected route
 * 
 * Use this inside non-protected routes to optionally get the user if authenticated.
 * 
 * @param request - API request
 * @returns Decoded user token or null if not authenticated
 * 
 * @example
 * export async function GET(request: Request) {
 *   const user = await getUser(request);
 *   if (user) {
 *     // User is authenticated
 *   }
 * }
 */
export async function getUser(request: Request): Promise<DecodedToken | null> {
  try {
    return await validateAPIRequestToken(request);
  } catch {
    return null;
  }
}
