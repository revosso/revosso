'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Login Page Component
 * 
 * Redirects to Auth0 login flow.
 * After successful authentication, users are redirected to /admin dashboard.
 * 
 * Token Validation:
 * - Auth0 validates credentials using OAuth 2.0/OIDC
 * - Returns JWT signed with Auth0's private key
 * - SDK validates JWT using Auth0's public JWKS
 * - No client secret needed for validation
 */
export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the Revosso admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/api/auth/login">
              Sign in with Auth0
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="text-center">
            <Link 
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to homepage
            </Link>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Secure authentication powered by Auth0. Your credentials are never stored on our servers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
