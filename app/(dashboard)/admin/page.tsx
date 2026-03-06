"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminProtectedRoute } from "@/components/protected-route"
import { useAuth0, useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import type { Lead } from "@/lib/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Clock,
  MessageSquare,
  Star,
  CheckCircle,
  LogOut,
  RefreshCw,
  Search,
  Mail,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Code,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react"

type LeadStatus = "new" | "contacted" | "qualified" | "closed"

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
  },
  contacted: {
    label: "Contacted",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
  },
  qualified: {
    label: "Qualified",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
  },
  closed: {
    label: "Closed",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  },
}

const EMAIL_STATUS_CONFIG = {
  sent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
}

const PRODUCT_LABELS: Record<string, string> = {
  NEW_PLATFORM: "New Platform",
  PLATFORM_TAKEOVER: "Takeover",
  PLATFORM_MAINTENANCE: "Maintenance",
  INFRASTRUCTURE_HOSTING: "Hosting",
  PARTNERSHIP: "Partnership",
  GENERAL_INQUIRY: "General",
}

function formatDate(date: Date | string | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Card
      className={`border cursor-pointer transition-all duration-200 select-none ${
        active
          ? "border-blue-500/40 bg-slate-800 shadow-lg shadow-blue-500/5"
          : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function LeadRow({
  lead,
  updatingId,
  onUpdateStatus,
}: {
  lead: Lead
  updatingId: string | null
  onUpdateStatus: (id: string, status: LeadStatus) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const status = (lead.leadStatus ?? "new") as LeadStatus
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new
  const emailStatusCls =
    EMAIL_STATUS_CONFIG[(lead.emailStatus as keyof typeof EMAIL_STATUS_CONFIG) ?? "pending"] ??
    EMAIL_STATUS_CONFIG.pending

  return (
    <>
      <TableRow
        className="border-slate-800 hover:bg-slate-800/30 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Expand toggle + name */}
        <TableCell>
          <div className="flex items-start gap-2">
            <button
              className="mt-0.5 text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <div>
              <p className="font-medium text-white text-sm leading-snug">{lead.name}</p>
              {lead.company && (
                <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  {lead.company}
                </p>
              )}
            </div>
          </div>
        </TableCell>

        {/* Email */}
        <TableCell>
          <a
            href={`mailto:${lead.email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-slate-300 hover:text-blue-400 transition-colors text-sm flex items-center gap-1.5 w-fit"
          >
            <Mail className="h-3 w-3 flex-shrink-0" />
            {lead.email}
          </a>
        </TableCell>

        {/* Product interest */}
        <TableCell>
          {lead.productInterest ? (
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs font-normal">
              {PRODUCT_LABELS[lead.productInterest] ?? lead.productInterest}
            </Badge>
          ) : (
            <span className="text-slate-700 text-xs">—</span>
          )}
        </TableCell>

        {/* Email status */}
        <TableCell>
          <Badge
            variant="outline"
            className={`text-xs font-normal border ${emailStatusCls}`}
          >
            {lead.emailStatus ?? "pending"}
          </Badge>
        </TableCell>

        {/* Date */}
        <TableCell>
          <span className="text-slate-500 text-xs flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {formatDate(lead.createdAt)}
          </span>
        </TableCell>

        {/* Status dropdown */}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select
            value={status}
            onValueChange={(val) => onUpdateStatus(lead.id, val as LeadStatus)}
            disabled={updatingId === lead.id}
          >
            <SelectTrigger
              className={`h-7 w-[120px] text-xs border ${statusCfg.className} bg-transparent focus:ring-0 focus:ring-offset-0 transition-colors`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="text-slate-300 hover:bg-slate-800 text-xs focus:bg-slate-800 focus:text-white"
                >
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      {expanded && (
        <TableRow className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/60">
          <TableCell colSpan={6} className="py-4 px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Message */}
              <div className="md:col-span-2 space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  Message
                </p>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                  {lead.message}
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Details</p>
                <div className="space-y-2 text-sm">
                  {lead.leadType && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Lead type</span>
                      <span className="text-slate-300 text-right">{lead.leadType}</span>
                    </div>
                  )}
                  {lead.businessStage && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Stage</span>
                      <span className="text-slate-300">{lead.businessStage}</span>
                    </div>
                  )}
                  {lead.sourcePage && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Source</span>
                      <span className="text-slate-300">{lead.sourcePage}</span>
                    </div>
                  )}
                  {lead.userLanguage && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Language
                      </span>
                      <span className="text-slate-300">{lead.userLanguage}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Lead ID</span>
                    <span className="text-slate-600 text-xs font-mono truncate max-w-[120px]" title={lead.id}>
                      {lead.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

function DashboardContent() {
  const { user, logout } = useAuth0()
  const getAccessToken = useAccessToken()

  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authenticatedFetch("/api/admin/leads", getAccessToken)
      setLeads(data.leads)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads")
    } finally {
      setIsLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingId(id)
    try {
      await authenticatedFetch(`/api/admin/leads/${id}`, getAccessToken, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, leadStatus: status } : l)))
    } catch (err) {
      console.error("Failed to update lead status:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.leadStatus === "new").length,
    contacted: leads.filter((l) => l.leadStatus === "contacted").length,
    qualified: leads.filter((l) => l.leadStatus === "qualified").length,
    closed: leads.filter((l) => l.leadStatus === "closed").length,
  }

  const filtered = leads
    .filter((l) => statusFilter === "all" || l.leadStatus === statusFilter)
    .filter((l) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company?.toLowerCase().includes(q) ?? false)
      )
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-md">
                <Code className="h-4 w-4" />
              </div>
              <span className="font-bold text-white text-sm">Revosso</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-400 text-sm">Admin</span>
            </div>

            <div className="flex items-center gap-3">
              {user?.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name ?? "User"}
                  className="h-7 w-7 rounded-full ring-1 ring-slate-700"
                />
              )}
              {user && (
                <span className="text-sm text-slate-400 hidden sm:block max-w-[180px] truncate">
                  {user.name ?? user.email}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 px-3"
                onClick={() => logout()}
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Leads</h1>
            <p className="text-slate-500 text-sm mt-0.5">Incoming project inquiries</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white h-8 px-3"
            onClick={fetchLeads}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            label="Total"
            value={stats.total}
            icon={Users}
            color="text-slate-300"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatCard
            label="New"
            value={stats.new}
            icon={Clock}
            color="text-blue-400"
            active={statusFilter === "new"}
            onClick={() => setStatusFilter("new")}
          />
          <StatCard
            label="Contacted"
            value={stats.contacted}
            icon={MessageSquare}
            color="text-amber-400"
            active={statusFilter === "contacted"}
            onClick={() => setStatusFilter("contacted")}
          />
          <StatCard
            label="Qualified"
            value={stats.qualified}
            icon={Star}
            color="text-purple-400"
            active={statusFilter === "qualified"}
            onClick={() => setStatusFilter("qualified")}
          />
          <StatCard
            label="Closed"
            value={stats.closed}
            icon={CheckCircle}
            color="text-emerald-400"
            active={statusFilter === "closed"}
            onClick={() => setStatusFilter("closed")}
          />
        </div>

        {/* Table */}
        <Card className="border border-slate-800 bg-slate-900 overflow-hidden">
          <CardHeader className="py-4 px-5 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-white text-base font-semibold">
                {statusFilter === "all"
                  ? "All Leads"
                  : `${STATUS_CONFIG[statusFilter as LeadStatus].label} Leads`}
                <span className="ml-2 text-slate-600 text-sm font-normal">({filtered.length})</span>
              </CardTitle>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                <Input
                  placeholder="Name, email or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-52">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-52 text-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-500/60" />
                <p className="text-red-400 text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLeads}
                  className="border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Try again
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-slate-600 gap-2">
                <Users className="h-8 w-8" />
                <p className="text-sm">No leads found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-500 font-medium text-xs pl-9">Contact</TableHead>
                      <TableHead className="text-slate-500 font-medium text-xs">Email</TableHead>
                      <TableHead className="text-slate-500 font-medium text-xs">Interest</TableHead>
                      <TableHead className="text-slate-500 font-medium text-xs">Confirmation</TableHead>
                      <TableHead className="text-slate-500 font-medium text-xs">Date</TableHead>
                      <TableHead className="text-slate-500 font-medium text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        updatingId={updatingId}
                        onUpdateStatus={updateStatus}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <DashboardContent />
    </AdminProtectedRoute>
  )
}
