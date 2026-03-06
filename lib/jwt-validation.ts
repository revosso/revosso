import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';
import type { NextRequest } from 'next/server';

/**
 * JWT Validation using Auth0 JWKS (Public Keys)
 *
 * Validates JWT tokens WITHOUT using a client secret.
 * Uses Auth0's public JWKS endpoint to verify token signatures.
 *
 * Security Features:
 * - Validates token signature using public key cryptography
 * - Verifies issuer (iss claim)
 * - Verifies audience (aud claim)
 * - Verifies expiration (exp claim)
 * - No client secret required
 *
 * JWKS Endpoint: https://{AUTH0_DOMAIN}/.well-known/jwks.json
 */

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

// Lazily-created JWKS client — avoids throwing at module load time if env vars
// are absent during the build phase or in non-API contexts.
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!_jwks) {
    if (!AUTH0_DOMAIN) {
      throw new Error(
        'AUTH0_DOMAIN or NEXT_PUBLIC_AUTH0_DOMAIN environment variable is required'
      );
    }
    _jwks = createRemoteJWKSet(
      new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
    );
  }
  return _jwks;
}

export interface DecodedToken extends JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * Validate JWT token using Auth0's JWKS public keys
 * 
 * @param token - JWT access token from Authorization header
 * @returns Decoded token payload if valid
 * @throws Error if token is invalid, expired, or has wrong audience/issuer
 */
export async function validateJWT(token: string): Promise<DecodedToken> {
  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `https://${AUTH0_DOMAIN}/`,
      audience: AUTH0_AUDIENCE,
    });

    return payload as DecodedToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`JWT validation failed: ${error.message}`);
    }
    throw new Error('JWT validation failed');
  }
}

/**
 * Extract and validate JWT from Authorization header
 * 
 * @param request - Next.js request object
 * @returns Decoded token payload if valid
 * @throws Error if token is missing or invalid
 */
export async function validateRequestToken(request: NextRequest): Promise<DecodedToken> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid Authorization header format. Expected: Bearer <token>');
  }

  const token = parts[1];
  return await validateJWT(token);
}

/**
 * Extract and validate JWT from standard Request object
 * (for use in API routes)
 * 
 * @param request - Standard Request object
 * @returns Decoded token payload if valid
 * @throws Error if token is missing or invalid
 */
export async function validateAPIRequestToken(request: Request): Promise<DecodedToken> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid Authorization header format. Expected: Bearer <token>');
  }

  const token = parts[1];
  return await validateJWT(token);
}

/**
 * Check if user has a specific role
 * 
 * @param token - Decoded JWT token
 * @param role - Role to check (e.g., 'admin')
 * @returns True if user has the role
 */
export function hasRole(token: DecodedToken, role: string): boolean {
  // Check standard roles claim
  if (Array.isArray(token.roles) && token.roles.includes(role)) {
    return true;
  }
  
  // Check custom namespace roles (Auth0 custom claims)
  const customRoles = token['https://revosso.com/roles'];
  if (Array.isArray(customRoles) && customRoles.includes(role)) {
    return true;
  }
  
  return false;
}

/**
 * Check if user has admin role
 * 
 * @param token - Decoded JWT token
 * @returns True if user is an admin
 */
export function isAdmin(token: DecodedToken): boolean {
  return hasRole(token, 'admin');
}

/**
 * Require admin role - throws if user is not an admin
 * 
 * @param token - Decoded JWT token
 * @throws Error if user is not an admin
 */
export function requireAdmin(token: DecodedToken): void {
  if (!isAdmin(token)) {
    throw new Error('Admin role required');
  }
}
