import { NextResponse, type NextRequest } from 'next/server';
import { validateAPIRequestToken, type DecodedToken } from '@/lib/jwt-validation';

/**
 * API Route Protection Middleware
 *
 * Authentication Flow:
 * 1. Client sends request with: Authorization: Bearer <access_token>
 * 2. Middleware validates token using Auth0's JWKS public keys
 * 3. If valid, request proceeds with user context
 * 4. If invalid, returns 401 Unauthorized
 *
 * No client secret required — uses JWKS public key validation only.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProtectedAPIHandler = (
  request: NextRequest,
  context: any,
  user: DecodedToken
) => Promise<Response> | Response;


function handleAuthError(error: unknown): Response {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('missing')) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
    if (msg.includes('expired')) {
      return NextResponse.json(
        { error: 'Unauthorized - Token expired' },
        { status: 401 }
      );
    }
    if (msg.includes('invalid') || msg.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Protect an API route with JWT authentication.
 *
 * @example
 * export const GET = withAuth(async (request, context, user) => {
 *   return NextResponse.json({ data: 'protected' });
 * });
 */
export function withAuth(handler: ProtectedAPIHandler) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, context: any = {}) => {
    try {
      const user = await validateAPIRequestToken(request);
      return await handler(request, context, user);
    } catch (error) {
      console.error('API authentication error:', error);
      return handleAuthError(error);
    }
  };
}

/**
 * Protect an API route with JWT authentication (audience validation is sufficient).
 * Alias for withAuth — any user with a valid token for this audience may access.
 *
 * @example
 * export const GET = withAdminAuth(async (request, context, user) => {
 *   return NextResponse.json({ data: 'protected' });
 * });
 */
export const withAdminAuth = withAuth;

/**
 * Optionally extract the authenticated user from a request.
 * Returns null instead of throwing when no valid token is present.
 */
export async function getUser(request: Request | NextRequest): Promise<DecodedToken | null> {
  try {
    return await validateAPIRequestToken(request);
  } catch {
    return null;
  }
}
