import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { leadsService } from '@/lib/services/leads-service';

/**
 * Protected Admin API - Individual Lead Operations
 * 
 * GET /api/admin/leads/[id]
 * Returns a specific lead by ID
 * 
 * PATCH /api/admin/leads/[id]
 * Updates a lead's status
 * 
 * Requires:
 * - Valid JWT token in Authorization header
 * - Admin role
 */

export const GET = withAdminAuth(async (request, context, user) => {
  try {
    const id = context.params?.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const lead = await leadsService.getLeadById(id as string);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
});

export const PATCH = withAdminAuth(async (request, context, user) => {
  try {
    const id = context.params?.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;
    
    if (!status || !['new', 'contacted', 'qualified', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: new, contacted, qualified, or closed' },
        { status: 400 }
      );
    }

    await leadsService.updateLeadStatus(id as string, status);
    
    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
});
