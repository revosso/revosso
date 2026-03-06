import { auth0 } from './auth0';

/**
 * Server-side authentication utilities
 * 
 * This application uses @auth0/nextjs-auth0 for authentication.
 * All /admin routes are protected by middleware (see middleware.ts).
 * 
 * Token Validation:
 * - Auth0 SDK automatically validates JWTs using JWKS (public keys)
 * - No client secret needed for validation
 * - Audience validation is built into the SDK
 * 
 * Session Management:
 * - Sessions stored in encrypted HTTP-only cookies
 * - Secure, SameSite=Lax for CSRF protection
 */

/**
 * Get current authenticated session
 * Use this in Server Components and Server Actions
 */
export async function getAuthSession() {
  try {
    const session = await auth0.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthSession();
  return !!session?.user;
}

/**
 * Require authentication - throws if not authenticated
 * Use this in Server Actions that require authentication
 */
export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error('Unauthorized - Authentication required');
  }
  return session.user;
}

/**
 * Get access token for API calls
 * This token is validated by Auth0 and includes the audience claim
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const tokenSet = await auth0.getAccessToken();
    return tokenSet?.token ?? null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 * This checks for roles in the user's Auth0 profile
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getAuthSession();
  if (!session?.user) {
    return false;
  }
  
  // Check for admin role in user metadata or app_metadata
  // Adjust this based on how you store roles in Auth0
  const user = session.user as any;
  const roles = user['https://revosso.com/roles'] || user.roles || [];
  
  return roles.includes('admin');
}

/**
 * Require admin role - throws if user is not an admin
 * Use this in admin-only Server Actions
 */
export async function requireAdmin() {
  await requireAuth();
  
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Forbidden - Admin access required');
  }
  
  return true;
}
