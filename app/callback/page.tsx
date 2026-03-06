'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@/components/auth0-provider';

/**
 * Auth0 Callback Page
 *
 * Placed at the app root (outside any route group) so that /callback resolves
 * unambiguously regardless of which route group is active.
 *
 * Auth0Provider (root layout) handles the PKCE code exchange and navigates to
 * appState.returnTo on success, or sets error state on failure.
 * User-facing errors (access_denied, not in org) are redirected to /
 * by Auth0Provider itself. This page covers any remaining error cases and
 * shows a loading spinner while the exchange is in progress.
 */
export default function CallbackPage() {
  const { error, isLoading } = useAuth0();
  const [countdown, setCountdown] = useState(5);

  // If Auth0Provider surfaces an error here (non-access_denied errors that
  // weren't auto-redirected), count down and send the user home.
  useEffect(() => {
    if (!error) return;
    if (countdown <= 0) {
      window.location.replace('/');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [error, countdown]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950" suppressHydrationWarning>
        <div className="text-center max-w-md px-6" suppressHydrationWarning>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4" suppressHydrationWarning>
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm font-semibold mb-2">Sign-in failed</p>
          <p className="text-slate-400 text-xs mb-4 leading-relaxed">{error.message}</p>
          <p className="text-slate-600 text-xs">
            Redirecting you back in {countdown}s…{' '}
            <button
              onClick={() => window.location.replace('/')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go now
            </button>
          </p>
        </div>
      </div>
    );
  }

  // isLoading = Auth0Provider is still processing the callback
  // !isLoading + no error = success, Auth0Provider already navigated away
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950" suppressHydrationWarning>
      <div className="text-center" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" suppressHydrationWarning />
        <p className="text-slate-300 text-sm font-medium">Completing sign-in…</p>
        <p className="text-slate-500 text-xs mt-1">You will be redirected automatically.</p>
      </div>
    </div>
  );
}
