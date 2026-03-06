'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@/components/auth0-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, ArrowRight, Shield } from 'lucide-react';

/**
 * Login Page
 *
 * Shown when a user navigates directly to /login.
 * In most cases, AdminProtectedRoute triggers loginWithRedirect() automatically
 * and users never see this page. It exists as a fallback landing for explicit
 * /login visits and as a sign-in entry point for returning users.
 */
export default function LoginPage() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl shadow-lg">
            <Code className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Revosso</h1>
            <p className="text-slate-500 text-sm">Admin Dashboard</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="p-2 rounded-full bg-slate-800">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <CardTitle className="text-white text-lg">Sign in</CardTitle>
            <CardDescription className="text-slate-400">
              Access the Revosso admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              size="lg"
              onClick={() => loginWithRedirect({ appState: { returnTo: '/admin' } })}
            >
              Sign in with Auth0
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-slate-600 text-center">
              Secured with Auth0 — credentials are never stored on our servers.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <a
            href="/"
            className="text-sm text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
