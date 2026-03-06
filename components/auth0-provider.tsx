'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
    auth0Client = new Auth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: getRedirectUri(),
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email',
      },
      // Use refresh tokens for long-lived sessions
      useRefreshTokens: true,
      // Cache location: memory (not localStorage for security)
      cacheLocation: 'memory',
    });
  }
  return auth0Client;
}

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Auth0 client and check authentication status
  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const client = getAuth0Client();

        // Check if redirected from Auth0 login
        if (typeof window !== 'undefined' && 
            (window.location.search.includes('code=') || 
             window.location.search.includes('error='))) {
          // Handle redirect callback
          await client.handleRedirectCallback();
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check if user is authenticated
        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userData = await client.getUser();
          setUser(userData || null);
        }
      } catch (err) {
        console.error('Auth0 initialization error:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth0();
  }, []);

  // Login with redirect to Auth0
  const loginWithRedirect = useCallback(async (options?: RedirectLoginOptions) => {
    try {
      const client = getAuth0Client();
      await client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: getRedirectUri(),
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
        ...options,
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error('Login failed'));
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
