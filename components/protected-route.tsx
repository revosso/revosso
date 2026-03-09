'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@/components/auth0-provider';
import { usePathname } from 'next/navigation';


function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

function AuthErrorScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center max-w-md px-6">
        <p className="text-red-400 text-sm font-medium mb-1">Authentication error</p>
        <p className="text-slate-500 text-xs">
          An error occurred during sign-in. Please try again or contact support.
        </p>
      </div>
    </div>
  );
}


/**
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

  if (isLoading) return <LoadingScreen />;
  if (error) return <AuthErrorScreen />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}

/**
 * Wraps components that require authentication.
 * Audience validation on the JWT is the access control boundary.
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
    if (isLoading || error) return;
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: pathname } });
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect, pathname]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <AuthErrorScreen />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
