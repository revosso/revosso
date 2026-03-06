import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { leadsService } from '@/lib/services/leads-service';

/**
 * Protected Admin API - Leads Management
 * 
 * GET /api/admin/leads
 * Returns all leads from the database
 * 
 * Requires:
 * - Valid JWT token in Authorization header
 * - Admin role
 * 
 * Usage:
 * fetch('/api/admin/leads', {
 *   headers: {
 *     'Authorization': `Bearer ${accessToken}`
 *   }
 * })
 */

export const GET = withAdminAuth(async (request, context, user) => {
  try {
    // User is authenticated and has admin role
    const leads = await leadsService.getAllLeads();
    
    return NextResponse.json({
      leads,
      total: leads.length,
    });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
});
