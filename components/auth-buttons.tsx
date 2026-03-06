'use client';

import { useAuth0 } from '@/components/auth0-provider';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

/**
 * Login Button Component
 * 
 * Shows a login button that redirects to Auth0 Universal Login.
 * Only visible when user is not authenticated.
 */
export function LoginButton({ className }: { className?: string }) {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Button
      onClick={() => loginWithRedirect()}
      variant="default"
      className={className}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  );
}

/**
 * Logout Button Component
 * 
 * Shows a logout button that clears the session and redirects to Auth0 logout.
 * Only visible when user is authenticated.
 */
export function LogoutButton({ className }: { className?: string }) {
  const { isLoading, isAuthenticated, logout } = useAuth0();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Button
      onClick={() => logout()}
      variant="outline"
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}

/**
 * User Profile Display Component
 * 
 * Shows the authenticated user's name and email.
 */
export function UserProfile({ className }: { className?: string }) {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <User className="h-4 w-4" />
      <div className="flex flex-col">
        {user.name && <span className="text-sm font-medium">{user.name}</span>}
        {user.email && <span className="text-xs text-gray-500">{user.email}</span>}
      </div>
    </div>
  );
}

/**
 * Authentication Navigation Component
 * 
 * Shows login button if not authenticated, or user profile + logout if authenticated.
 */
export function AuthNav({ className }: { className?: string }) {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {isAuthenticated ? (
        <>
          <UserProfile />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
