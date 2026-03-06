import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Subdomain Routing Middleware
 * 
 * This middleware handles routing based on subdomain:
 * 
 * PRODUCTION:
 * - {BASE_DOMAIN} → Landing page (public)
 * - {DASHBOARD_SUBDOMAIN}.{BASE_DOMAIN} → Dashboard (protected)
 * 
 * LOCAL DEVELOPMENT:
 * - {LOCAL_BASE_DOMAIN}:3000 → Landing page
 * - {DASHBOARD_SUBDOMAIN}.{LOCAL_BASE_DOMAIN}:3000 → Dashboard
 * 
 * Architecture:
 * - Landing pages: app/(landing)/* 
 * - Dashboard pages: app/(dashboard)/*
 * - API routes: app/api/* (shared, protected by JWT validation)
 * 
 * Security:
 * - Dashboard routes require subdomain access only
 * - Attempting to access /admin from landing domain redirects to dashboard subdomain
 * - Authentication is handled by client-side ProtectedRoute + server-side JWT validation
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
    
    // Allow dashboard routes to pass through
    return NextResponse.next();
  }

  // CASE 2: Landing subdomain (revosso.com or revosso.local OR localhost)
  if (isLanding) {
    // Block direct access to dashboard routes from landing domain
    // Redirect to proper dashboard subdomain
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      const dashboardUrl = getDashboardUrl(request, hostname);
      return NextResponse.redirect(`${dashboardUrl}${pathname}`);
    }
    
    // All other routes pass through to landing pages
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

