import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';

/**
 * JWT Validation using Auth0 JWKS (Public Keys)
 *
 * Validates JWT tokens WITHOUT using a client secret.
 * Uses Auth0's public JWKS endpoint to verify token signatures.
 *
 * Security:
 * - Validates token signature using public key cryptography
 * - Verifies issuer (iss claim)
 * - Verifies audience (aud claim)
 * - Verifies expiration (exp claim)
 *
 * JWKS Endpoint: https://{AUTH0_DOMAIN}/.well-known/jwks.json
 */

// Server-side only — must NOT fall back to NEXT_PUBLIC_ variables.
// If AUTH0_DOMAIN is missing the server is misconfigured; fail loudly.
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

// Lazily-created JWKS client — avoids throwing at module load time if env vars
// are absent during the build phase or in non-API contexts.
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!_jwks) {
    if (!AUTH0_DOMAIN) {
      throw new Error('AUTH0_DOMAIN environment variable is required for JWT validation');
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
  org_id?: string;
  /** Auth0 custom claim for namespaced roles. */
  'https://revosso.com/roles'?: string[];
}

/**
 * Validate a JWT access token using Auth0's JWKS public keys.
 *
 * @throws When the token is invalid, expired, or has the wrong audience/issuer.
 */
export async function validateJWT(token: string): Promise<DecodedToken> {
  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `https://${AUTH0_DOMAIN}/`,
      audience: AUTH0_AUDIENCE,
    });
    return payload as DecodedToken;
  } catch (error) {
    throw new Error(
      `JWT validation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Extract and validate a Bearer JWT from any Request or NextRequest object.
 *
 * This is the single canonical function for API route protection.
 * Use it directly or via the `withAuth` / `withAdminAuth` wrappers in `lib/api-auth.ts`.
 *
 * @throws When the Authorization header is missing, malformed, or the token is invalid.
 */
export async function validateAPIRequestToken(request: Request): Promise<DecodedToken> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const spaceIdx = authHeader.indexOf(' ');
  const scheme = spaceIdx === -1 ? authHeader : authHeader.slice(0, spaceIdx);
  const token = spaceIdx === -1 ? '' : authHeader.slice(spaceIdx + 1).trim();

  if (scheme !== 'Bearer' || !token) {
    throw new Error('Invalid Authorization header format. Expected: Bearer <token>');
  }

  return validateJWT(token);
}

/** Returns true when the decoded token carries the given role. */
export function hasRole(token: DecodedToken, role: string): boolean {
  const namespacedRoles = token['https://revosso.com/roles'];
  if (Array.isArray(namespacedRoles) && namespacedRoles.includes(role)) return true;
  if (Array.isArray(token.roles) && token.roles.includes(role)) return true;
  return false;
}

/** Returns true when the decoded token carries the "admin" role. */
export function isAdmin(token: DecodedToken): boolean {
  return hasRole(token, 'admin');
}

/** Throws when the decoded token does not carry the "admin" role. */
export function requireAdmin(token: DecodedToken): void {
  if (!isAdmin(token)) {
    throw new Error('Admin role required');
  }
}
