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
        scope: 'openid profile email',
        ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
      },
      useRefreshTokens: true,
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

        // Detect an Auth0 redirect callback in the current URL.
        const search = window.location.search;
        if (search.includes('code=') || search.includes('error=')) {
          // Auth0 returned an error (e.g. "Callback URL mismatch").
          // Extract it directly from the URL so we can surface a readable message.
          if (search.includes('error=')) {
            const params = new URLSearchParams(search);
            const code = params.get('error') ?? 'unknown_error';
            const desc = params.get('error_description') ?? 'Auth0 authentication failed';
            // Remove the error params from the URL before throwing
            window.history.replaceState({}, document.title, window.location.pathname);
            throw new Error(`${code}: ${decodeURIComponent(desc.replace(/\+/g, ' '))}`);
          }

          // PKCE code exchange
          const result = await client.handleRedirectCallback();
          if (cancelled) return;

          const returnTo: string = result?.appState?.returnTo ?? '/admin';
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
        // landing page with a readable message instead of leaving the user stuck
        // on a blank /callback page.
        const isUserFacing =
          error.message.startsWith('access_denied') ||
          error.message.startsWith('unauthorized') ||
          error.message.includes('not part of the');

        if (isUserFacing && typeof window !== 'undefined') {
          const description = error.message.replace(/^[^:]+:\s*/, ''); // strip "access_denied: "
          window.location.replace(
            `/?auth_error=${encodeURIComponent(description)}`
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
        authorizationParams: {
          redirect_uri: getRedirectUri(),
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email',
          ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
        },
        ...options,
      });
    } catch (err) {
      const error = toError(err);
      console.error('Login error:', error.message);
      setError(error);
    }
  }, []);

  // Logout
  const logout = useCallback(async (returnTo?: string) => {
    try {
      const client = getAuth0Client();
      await client.logout({
        logoutParams: {
          returnTo: returnTo || window.location.origin,
        },
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('Logout failed'));
    }
  }, []);

  // Get access token for API calls
  const getAccessToken = useCallback(async (): Promise<string | undefined> => {
    try {
      const client = getAuth0Client();
      const token = await client.getTokenSilently({
        authorizationParams: {
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email',
          ...(AUTH0_ORGANIZATION ? { organization: AUTH0_ORGANIZATION } : {}),
        },
      });
      return token;
    } catch (err) {
      console.error('Error getting access token:', err);
      // If token cannot be retrieved silently, user needs to re-authenticate
      if (err instanceof Error && err.message.includes('login_required')) {
        await loginWithRedirect();
      }
      return undefined;
    }
  }, [loginWithRedirect]);

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
