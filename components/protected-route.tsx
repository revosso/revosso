'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@/components/auth0-provider';
import { useRouter, usePathname } from 'next/navigation';

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
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to Auth0 login with return URL
      loginWithRedirect({
        appState: {
          returnTo: pathname,
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render protected content
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
  const { isLoading, isAuthenticated, user, loginWithRedirect } = useAuth0();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to Auth0 login
        loginWithRedirect({
          appState: {
            returnTo: pathname,
          },
        });
      } else if (user) {
        // Check for admin role
        const roles = (user as any)['https://revosso.com/roles'] || (user as any).roles || [];
        const isAdmin = roles.includes('admin');
        
        if (!isAdmin) {
          // User is authenticated but not an admin
          router.push('/?error=unauthorized');
        }
      }
    }
  }, [isLoading, isAuthenticated, user, loginWithRedirect, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check admin role
  const roles = (user as any)['https://revosso.com/roles'] || (user as any).roles || [];
  const isAdmin = roles.includes('admin');

  if (!isAdmin) {
    return null;
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}
