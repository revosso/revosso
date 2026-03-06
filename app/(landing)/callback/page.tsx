'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@/components/auth0-provider';

/**
 * Auth0 Callback Handler
 * 
 * This page handles the redirect from Auth0 after authentication.
 * 
 * Flow:
 * 1. User authenticates on Auth0
 * 2. Auth0 redirects to this page with authorization code
 * 3. Auth0Provider automatically exchanges code for tokens (PKCE)
 * 4. This page redirects user to their intended destination
 * 
 * The actual token exchange is handled by Auth0Provider's useEffect.
 */
export default function CallbackPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, error } = useAuth0();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !redirecting) {
      if (error) {
        // Authentication failed
        console.error('Authentication error:', error);
        // Redirect to home page with error
        router.push('/?error=authentication_failed');
      } else if (isAuthenticated) {
        // Successfully authenticated
        // Check if there's a returnTo parameter
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo') || '/admin';
        
        setRedirecting(true);
        router.push(returnTo);
      }
    }
  }, [isLoading, isAuthenticated, error, router, redirecting]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
