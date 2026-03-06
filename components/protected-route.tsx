'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@/components/auth0-provider';
import { usePathname } from 'next/navigation';

// Build the landing page origin from env or from the current host
function getLandingOrigin(): string {
  if (typeof window === 'undefined') return '/';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'revosso.com';
  const localBase = process.env.NEXT_PUBLIC_LOCAL_BASE_DOMAIN || 'revosso.local';
  const { hostname, port, protocol } = window.location;
  const portSuffix = port ? `:${port}` : '';

  if (hostname.includes(localBase)) {
    return `${protocol}//${localBase}${portSuffix}`;
  }
  return `${protocol}//${baseDomain}`;
}

/**
 * Protected Route Wrapper
 * 
 * Wraps components that require authentication.
 * Automatically redirects unauthenticated users to Auth0 login.
 * 
 * @example
 * export default function AdminPage() {
 *   return (
 *     <ProtectedRoute>
 *       <AdminContent />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();
  const pathname = usePathname();

  useEffect(() => {
    // Do not attempt login if there is already an auth initialization error —
    // that would just cascade the same failure a second time.
    if (!isLoading && !isAuthenticated && !error) {
      loginWithRedirect({ appState: { returnTo: pathname } });
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center max-w-md px-6">
          <p className="text-red-400 text-sm font-medium mb-1">Authentication error</p>
          <p className="text-slate-500 text-xs">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

/**
 * Protected Route Wrapper with Admin Role Check
 * 
 * Wraps components that require admin authentication.
 * Checks for admin role in user's token.
 * 
 * @example
 * export default function AdminPage() {
 *   return (
 *     <AdminProtectedRoute>
 *       <AdminContent />
 *     </AdminProtectedRoute>
 *   );
 * }
 */
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: pathname } });
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center max-w-md px-6">
          <p className="text-red-400 text-sm font-medium mb-1">Authentication error</p>
          <p className="text-slate-500 text-xs">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
