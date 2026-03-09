'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Auth0Client, type User, type RedirectLoginOptions } from '@auth0/auth0-spa-js';

/**
 * Auth0 Context Provider using PKCE Flow
 * 
 * This implements client-side authentication using Auth0's SPA SDK.
 * 
 * Authentication Flow:
 * 1. User clicks login → redirects to Auth0 Universal Login
 * 2. User authenticates on Auth0
 * 3. Auth0 redirects back to /callback
 * 4. Client exchanges authorization code for access token (PKCE)
 * 5. Access token is stored in memory (not localStorage)
 * 6. Token is sent to backend APIs in Authorization header
 * 
 * Security Features:
 * - PKCE flow (no client secret needed)
 * - Token stored in memory (not localStorage)
 * - Automatic token refresh
 * - Auth0 Universal Login (secure)
 */

interface Auth0ContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: Error | null;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  logout: (returnTo?: string) => Promise<void>;
  getAccessToken: () => Promise<string | undefined>;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

// Environment variables (public)
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
const AUTH0_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;
// Optional: set when the Auth0 application has Organizations "required" mode enabled.
// Leave unset (or set in Auth0 Dashboard → Apps → Organizations → "Not Applicable")
// if you do not use Auth0 Organizations.
const AUTH0_ORGANIZATION = process.env.NEXT_PUBLIC_AUTH0_ORGANIZATION;

// Dynamic redirect URI based on current domain
function getRedirectUri(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000/callback';
  }
  
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  
  // Build the callback URL for the current domain
  let baseUrl = `${protocol}//${hostname}`;
  if (port) {
    baseUrl += `:${port}`;
  }
  
  return `${baseUrl}/callback`;
}

// Validate required environment variables
if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_AUDIENCE) {
  console.error('Missing required Auth0 environment variables:', {
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    AUTH0_AUDIENCE,
  });
}

// Create Auth0 client instance (singleton)
let auth0Client: Auth0Client | null = null;

function getAuth0Client(): Auth0Client {
  if (!auth0Client) {
    // Fail fast with a human-readable message rather than letting the SDK
    // create a client with `domain: undefined` (which produces cryptic errors).
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_AUDIENCE) {
      const missing = [
        !AUTH0_DOMAIN && 'NEXT_PUBLIC_AUTH0_DOMAIN',
        !AUTH0_CLIENT_ID && 'NEXT_PUBLIC_AUTH0_CLIENT_ID',
        !AUTH0_AUDIENCE && 'NEXT_PUBLIC_AUTH0_AUDIENCE',
      ].filter(Boolean).join(', ');
      throw new Error(
        `Auth0 is not configured. Add the following to .env.local: ${missing}`
      );
    }

    // auth0-spa-js uses window.crypto.subtle (PKCE) which browsers only expose
    // on secure contexts: HTTPS pages or plain `localhost`.
    // Custom *.local domains served over HTTP are NOT secure contexts.
    // Fix: replace `pnpm dev` with `pnpm dev:https` — this starts Next.js with
    // a trusted HTTPS certificate on https://localhost:3000 (a secure context).
    // The dashboard is then accessible at https://localhost:3000/admin.
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      throw new Error(
        'Auth0 requires a secure context (HTTPS or localhost). ' +
        'Stop the dev server and run:\n\n' +
        '  pnpm dev:https\n\n' +
        'Then open: https://localhost:3000/admin\n' +
        'Add https://localhost:3000/callback to Auth0 → Allowed Callback URLs.'
      );
    }

    auth0Client = new Auth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: getRedirectUri(),
        audience: AUTH0_AUDIENCE,
        // offline_access requests a refresh token from Auth0.
        // Combined with useRefreshTokens + useRefreshTokensFallback this ensures
        // the session survives page reloads without relying on third-party cookies
        // (which Safari ITP and Firefox ETP block by default).
        scope: 'openid profile email offline_access',
        ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
      },
      useRefreshTokens: true,
      // Falls back to iframe silent auth only when no refresh token is cached.
      // This is the safe default for SPAs that need reliable session persistence.
      useRefreshTokensFallback: true,
      cacheLocation: 'memory',
    });
  }
  return auth0Client;
}

/** Serialize Auth0 SDK errors — they are often plain objects, not Error instances. */
function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    const msg =
      (typeof o.error_description === 'string' && o.error_description) ||
      (typeof o.message === 'string' && o.message) ||
      (typeof o.error === 'string' && o.error) ||
      JSON.stringify(err);
    return new Error(msg);
  }
  return new Error(String(err));
}

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  // Keep a ref so the async init closure always has the latest router
  // without needing it in the effect dependency array.
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  // Initialize Auth0 client and check authentication status.
  // Uses a `cancelled` flag so React Strict Mode's mount→unmount→remount
  // cycle doesn't trigger duplicate state updates.
  useEffect(() => {
    // auth0-spa-js requires a secure context (HTTPS or localhost).
    // http://*.local custom domains are NOT secure contexts.
    // Instead of showing an error, silently redirect to https://localhost
    // so the browser ends up on a secure origin where loginWithRedirect()
    // can fire and take the user to Auth0.
    //
    // This redirect is only useful when `pnpm dev:https` is running.
    // In production the dashboard is always on HTTPS so this never triggers.
    if (!window.isSecureContext) {
      const { port, pathname, search } = window.location;
      window.location.replace(
        `https://localhost:${port || '3000'}${pathname}${search}`
      );
      // Do not update any state — we are navigating away.
      return;
    }

    let cancelled = false;

    const initAuth0 = async () => {
      try {
        const client = getAuth0Client();

        const search = window.location.search;
        const params = new URLSearchParams(search);

        // Detect Auth0 Organization invitation parameters.
        // When both are present the user has NOT yet joined the org — any
        // silent-auth call (prompt=none) will be rejected with
        // "user is not part of the organization".
        // We must bypass all silent auth and force an interactive login that
        // carries the invitation context so Auth0 can complete the membership.
        const invitationParam = params.get('invitation');
        const organizationParam = params.get('organization');
        const isInvitationFlow = !!(invitationParam && organizationParam);

        if (isInvitationFlow) {
          // Remove invitation params from the URL to prevent a second redirect
          // if the component re-mounts (React Strict Mode, HMR, etc.).
          window.history.replaceState({}, document.title, window.location.pathname);

          await client.loginWithRedirect({
            authorizationParams: {
              redirect_uri: getRedirectUri(),
              audience: AUTH0_AUDIENCE,
              scope: 'openid profile email offline_access',
              invitation: invitationParam,
              organization: organizationParam,
              // Explicitly force an interactive login screen — this is what
              // allows Auth0 to complete the org-membership grant.
              prompt: 'login',
            },
          });
          // loginWithRedirect navigates the browser away; code below never runs.
          return;
        }

        // Detect an Auth0 redirect callback in the current URL.
        // Auth0 ALWAYS includes a `state` parameter in its redirects (both success
        // and error). Requiring `state=` prevents us from misidentifying custom
        // query params (e.g. our own `?auth_error=...`) as Auth0 callbacks.
        const isAuth0Callback =
          params.has('state') && (params.has('code') || params.has('error'));

        if (isAuth0Callback) {
          // Auth0 returned an error (e.g. "Callback URL mismatch", "not in org").
          if (params.has('error')) {
            const code = params.get('error') ?? 'unknown_error';
            const desc = params.get('error_description') ?? 'Auth0 authentication failed';
            // Remove the error params from the URL before throwing
            window.history.replaceState({}, document.title, window.location.pathname);
            throw new Error(`${code}: ${decodeURIComponent(desc.replace(/\+/g, ' '))}`);
          }

          // PKCE code exchange
          const result = await client.handleRedirectCallback();
          if (cancelled) return;

          // Validate returnTo to prevent open-redirect attacks.
          // Only allow relative paths (starts with '/' but not '//').
          const raw: unknown = result?.appState?.returnTo;
          const returnTo: string =
            typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')
              ? raw
              : '/admin';
          routerRef.current.replace(returnTo);
          // Fall through — set auth state so the destination page renders
          // without another round-trip to check authentication.
        }

        const authenticated = await client.isAuthenticated();
        if (cancelled) return;
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userData = await client.getUser();
          if (cancelled) return;
          setUser(userData ?? null);
        }
      } catch (err) {
        if (cancelled) return;
        const error = toError(err);

        // Use console.warn — console.error triggers the Next.js dev error overlay,
        // which crashes the page for what are often normal user-facing conditions
        // (wrong account, not in org, session expired, etc.).
        console.warn('Auth0 initialization error:', error.message);

        // For user-facing auth rejections (not config mistakes), redirect to the
        // landing page with a safe, generic message instead of exposing internal
        // Auth0 error details in the URL (which get logged by proxies/CDNs/analytics).
        const isUserFacing =
          error.message.startsWith('access_denied') ||
          error.message.startsWith('unauthorized') ||
          error.message.includes('not part of the');

        if (isUserFacing && typeof window !== 'undefined') {
          // Map raw Auth0 codes to safe human-readable messages.
          // Never put raw error descriptions in the URL.
          let safeMessage = 'Sign-in failed. Please contact support if this continues.';
          if (error.message.includes('not part of the')) {
            safeMessage = 'Your account does not have access to this organization.';
          } else if (error.message.startsWith('access_denied')) {
            safeMessage = 'Access was denied. Please contact support.';
          }
          window.location.replace(
            `/?auth_error=${encodeURIComponent(safeMessage)}`
          );
          return;
        }

        setError(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initAuth0();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Login with redirect to Auth0
  const loginWithRedirect = useCallback(async (options?: RedirectLoginOptions) => {
    try {
      const client = getAuth0Client();
      await client.loginWithRedirect({
        // Spread caller options first so our security-critical params always win.
        // Callers may add appState or prompt but cannot override audience/scope.
        ...options,
        authorizationParams: {
          // Merge caller's authorizationParams (e.g. invitation, prompt) on top
          // of the base params, but our locked values overwrite any conflicts.
          ...options?.authorizationParams,
          redirect_uri: getRedirectUri(),
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email offline_access',
          ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
        },
      });
    } catch (err) {
      const error = toError(err);
      console.error('Login error:', error.message);
      setError(error);
    }
  }, []);

  // Logout
  const logout = useCallback(async (returnTo?: string) => {
    // Clear local state before navigating away. client.logout() triggers a
    // browser navigation so the setState calls after it are never reached.
    setIsAuthenticated(false);
    setUser(null);
    try {
      const client = getAuth0Client();
      await client.logout({
        logoutParams: {
          returnTo: returnTo || window.location.origin,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
      // State is already cleared. Force navigation as a fallback so the user
      // is not left in a broken half-logged-in state.
      window.location.assign(returnTo || window.location.origin);
    }
  }, []);

  // Get access token for API calls
  const getAccessToken = useCallback(async (): Promise<string | undefined> => {
    // Never attempt silent token acquisition during an invitation flow.
    // The user is not yet a member of the org, so prompt=none would be
    // rejected before initAuth0 has a chance to redirect them.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('invitation') && params.has('organization')) {
        return undefined;
      }
    }

    try {
      const client = getAuth0Client();
      const token = await client.getTokenSilently({
        authorizationParams: {
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email offline_access',
          ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
        },
      });
      return token;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Error getting access token:', msg);

      // When the session has expired, mark the user as unauthenticated and let
      // ProtectedRoute trigger the re-login. Calling loginWithRedirect() directly
      // here can cause redirect loops when getAccessToken is invoked during render.
      if (msg.includes('login_required') || msg.includes('consent_required')) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return undefined;
    }
  }, []);

  const value: Auth0ContextType = {
    isLoading,
    isAuthenticated,
    user,
    error,
    loginWithRedirect,
    logout,
    getAccessToken,
  };

  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
}

/**
 * Hook to use Auth0 context
 * 
 * @example
 * const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
 */
export function useAuth0(): Auth0ContextType {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0 must be used within Auth0Provider');
  }
  return context;
}

/**
 * Hook to get access token for API calls
 * 
 * @example
 * const token = await getToken();
 * fetch('/api/admin/leads', {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export function useAccessToken() {
  const { getAccessToken } = useAuth0();
  return getAccessToken;
}
