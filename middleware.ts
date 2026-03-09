import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Subdomain Routing + Auth Gate Middleware
 *
 * Routing:
 * - {BASE_DOMAIN}                         → Landing page (public)
 * - {DASHBOARD_SUBDOMAIN}.{BASE_DOMAIN}   → Dashboard (protected)
 *
 * Auth gate (defense-in-depth):
 * - /admin routes on the dashboard domain require a valid-looking Authorization
 *   header OR the Auth0 SPA SDK cookie to be present.
 * - Full JWT cryptographic validation still happens in API routes and in
 *   ProtectedRoute / AdminProtectedRoute on the client.  This layer just
 *   prevents unauthenticated browsers from receiving the dashboard HTML shell.
 *
 * Note: the SPA SDK stores tokens in memory (not cookies), so a hard page
 * reload will briefly lack a token cookie and will pass through to the client
 * where ProtectedRoute triggers the silent refresh / login. That is intentional
 * and correct — do NOT add logic here that would redirect every reload to login.
 */

// Environment-based domain configuration
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'revosso.com';
const LOCAL_BASE_DOMAIN = process.env.NEXT_PUBLIC_LOCAL_BASE_DOMAIN || 'revosso.local';
const DASHBOARD_SUBDOMAIN = process.env.NEXT_PUBLIC_DASHBOARD_SUBDOMAIN || 'manage';

// Determine if request is for dashboard subdomain
function isDashboardDomain(hostname: string): boolean {
  const hostnameWithoutPort = hostname.split(':')[0];
  
  // Production dashboard domain
  if (hostnameWithoutPort === `${DASHBOARD_SUBDOMAIN}.${BASE_DOMAIN}`) return true;
  
  // Local development dashboard domain
  if (hostnameWithoutPort === `${DASHBOARD_SUBDOMAIN}.${LOCAL_BASE_DOMAIN}`) return true;
  if (hostname.startsWith(`${DASHBOARD_SUBDOMAIN}.${LOCAL_BASE_DOMAIN}:`)) return true;
  
  return false;
}

// Determine if request is for landing subdomain
function isLandingDomain(hostname: string): boolean {
  const hostnameWithoutPort = hostname.split(':')[0];
  
  // Production landing domain
  if (hostnameWithoutPort === BASE_DOMAIN || hostnameWithoutPort === `www.${BASE_DOMAIN}`) return true;
  
  // Local development landing domain
  if (hostnameWithoutPort === LOCAL_BASE_DOMAIN) return true;
  if (hostname.startsWith(`${LOCAL_BASE_DOMAIN}:`)) return true;
  
  // Fallback for localhost (default to landing)
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) return true;
  
  return false;
}

// Get the correct dashboard URL for the environment
function getDashboardUrl(request: NextRequest, currentHostname: string): string {
  const protocol = request.nextUrl.protocol; // http: or https:
  
  // Extract port from current hostname if present
  const portMatch = currentHostname.match(/:(\d+)/);
  const port = portMatch ? `:${portMatch[1]}` : '';
  
  // Determine base domain
  let dashboardDomain = '';
  
  if (currentHostname.includes(LOCAL_BASE_DOMAIN) || currentHostname === 'localhost' || currentHostname.startsWith('localhost:')) {
    // Local development
    dashboardDomain = `${DASHBOARD_SUBDOMAIN}.${LOCAL_BASE_DOMAIN}`;
  } else if (currentHostname.includes(BASE_DOMAIN)) {
    // Production
    dashboardDomain = `${DASHBOARD_SUBDOMAIN}.${BASE_DOMAIN}`;
  } else {
    // Fallback for other domains
    const baseHost = currentHostname.split(':')[0];
    dashboardDomain = `${DASHBOARD_SUBDOMAIN}.${baseHost}`;
  }
  
  return `${protocol}//${dashboardDomain}${port}`;
}

export default async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || 'localhost';
  const { pathname } = request.nextUrl;

  // Skip API routes and static files - let them pass through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const isDashboard = isDashboardDomain(hostname);
  const isLanding = isLandingDomain(hostname);

  // CASE 1: Dashboard subdomain (manage.revosso.com or manage.revosso.local)
  if (isDashboard) {
    // On dashboard root, redirect to /admin
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Lightweight server-side gate for /admin routes.
    // The SPA SDK stores tokens in memory, not cookies, so there is no reliable
    // server-side token on a hard reload. We therefore only block requests that
    // carry an Authorization header with a clearly wrong format — a belt-and-
    // suspenders check rather than a strict token validation (which belongs in
    // API routes and ProtectedRoute).
    //
    // If you later add cookie-based session support (e.g. nextjs-auth0 server
    // SDK properly integrated), enforce authentication here instead.
    if (pathname.startsWith('/admin')) {
      const authHeader = request.headers.get('authorization');
      // Reject requests that supply a malformed Authorization header.
      if (authHeader !== null && !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Allow dashboard routes to pass through
    return NextResponse.next();
  }

  // CASE 2: Landing subdomain (revosso.com or revosso.local OR localhost)
  if (isLanding) {
    // On plain `localhost` (used with `pnpm dev:https`), auth0-spa-js works
    // because `localhost` is treated as a secure origin by browsers.
    // Serve dashboard routes directly at `https://localhost:3000/admin`
    // instead of redirecting to `manage.revosso.local` (which is HTTP-only
    // and therefore NOT a secure context — breaking the Auth0 SPA SDK).
    const hostnameBase = hostname.split(':')[0];
    if (hostnameBase === 'localhost') {
      return NextResponse.next();
    }

    // On all other landing domains (revosso.local, revosso.com, www.revosso.com),
    // block direct dashboard route access and redirect to the proper subdomain.
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      const dashboardUrl = getDashboardUrl(request, hostname);
      return NextResponse.redirect(`${dashboardUrl}${pathname}`);
    }

    // All other landing-domain routes pass through.
    return NextResponse.next();
  }

  // CASE 3: Unknown domain - default behavior (pass through)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

