'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Lead } from '@/lib/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth0 } from '@/components/auth0-provider';
import { authenticatedGet, authenticatedPatch } from '@/lib/authenticated-fetch';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-purple-500',
  qualified: 'bg-green-500',
  closed: 'bg-gray-500',
};

const emailStatusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  sent: 'bg-green-500',
  failed: 'bg-red-500',
};

export function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [emailFilter, setEmailFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { getAccessToken } = useAuth0();

  // Fetch leads on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await authenticatedGet('/api/admin/leads', getAccessToken);
        setLeads(data.leads || []);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        toast.error('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [getAccessToken]);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.leadStatus === statusFilter;
    const matchesEmail = emailFilter === 'all' || lead.emailStatus === emailFilter;
    return matchesStatus && matchesEmail;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.leadStatus === 'new').length,
    contacted: leads.filter(l => l.leadStatus === 'contacted').length,
    qualified: leads.filter(l => l.leadStatus === 'qualified').length,
    emailsSent: leads.filter(l => l.emailStatus === 'sent').length,
  };

  const handleStatusUpdate = async (leadId: string, newStatus: 'new' | 'contacted' | 'qualified' | 'closed') => {
    try {
      await authenticatedPatch(`/api/admin/leads/${leadId}`, getAccessToken, { status: newStatus });
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, leadStatus: newStatus } : lead
      ));
      toast.success('Lead status updated');
    } catch (error) {
      toast.error('Failed to update lead status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Management Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage all your business leads in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground">Awaiting contact</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualified}</div>
            <p className="text-xs text-muted-foreground">High potential</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailsSent}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter leads by status and email status</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lead Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={emailFilter} onValueChange={setEmailFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Email Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Email Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          {(statusFilter !== 'all' || emailFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setEmailFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Manage and track all incoming leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1 text-blue-500 hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                    </TableCell>
                    <TableCell>{lead.company || '-'}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {lead.leadType || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {lead.productInterest || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.leadStatus}
                        onValueChange={(value) => 
                          handleStatusUpdate(lead.id, value as 'new' | 'contacted' | 'qualified' | 'closed')
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge className={statusColors[lead.leadStatus]}>
                            {lead.leadStatus}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={emailStatusColors[lead.emailStatus]}>
                        {lead.emailStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/messages/${lead.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
