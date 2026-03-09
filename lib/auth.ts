import { auth0 } from './auth0';

/**
 * Server-side authentication utilities (nextjs-auth0 server SDK)
 *
 * IMPORTANT — ARCHITECTURAL GAP:
 * The app's primary login flow uses the SPA SDK (`@auth0/auth0-spa-js`) via
 * `components/auth0-provider.tsx`. That flow stores tokens in browser memory and
 * never creates a server-side session cookie. As a result, `auth0.getSession()`
 * will always return null in the current setup — meaning every function in this
 * file that calls `requireAuth()` will throw "Unauthorized".
 *
 * To fix this properly, choose ONE of:
 *  A) Switch the login flow to use the nextjs-auth0 server SDK end-to-end
 *     (redirect to `/api/auth/login` instead of `loginWithRedirect()`).
 *  B) Rewrite Server Actions to accept a Bearer token via `headers()` and
 *     validate it with `validateJWT()` from `lib/jwt-validation.ts`.
 *
 * Until one of those changes is made, Server Actions that call `requireAuth()`
 * are effectively unauthenticated. Do NOT add sensitive data mutations here
 * without first resolving this gap.
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
