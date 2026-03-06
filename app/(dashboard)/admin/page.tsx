"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import type { Lead } from "@/lib/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Clock,
  MessageSquare,
  Star,
  CheckCircle,
  RefreshCw,
  Search,
  Mail,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  FileText,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  StickyNote,
  UserCheck,
  TrendingUp,
} from "lucide-react"

type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "converted"

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string; icon?: React.ElementType }> = {
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
    className: "bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20",
  },
  converted: {
    label: "Client",
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
  onOpenNotes,
  onDeleteLead,
}: {
  lead: Lead
  updatingId: string | null
  onUpdateStatus: (id: string, status: LeadStatus) => void
  onOpenNotes: (lead: Lead) => void
  onDeleteLead: (lead: Lead) => void
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
          <Badge variant="outline" className={`text-xs font-normal border ${emailStatusCls}`}>
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

        {/* Actions */}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-600 hover:text-slate-300 hover:bg-slate-800"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 w-48">
              <DropdownMenuItem
                className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-white text-xs cursor-pointer"
                onClick={() => onOpenNotes(lead)}
              >
                <StickyNote className="h-3.5 w-3.5 mr-2 text-amber-400" />
                {lead.notes ? "Edit Notes" : "Add Notes"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-white text-xs cursor-pointer"
                onClick={() => onUpdateStatus(lead.id, "contacted")}
                disabled={status === "contacted" || updatingId === lead.id}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2 text-amber-400" />
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800 focus:text-white text-xs cursor-pointer"
                onClick={() => onUpdateStatus(lead.id, "converted")}
                disabled={status === "converted" || updatingId === lead.id}
              >
                <UserCheck className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                Convert to Client
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-xs cursor-pointer"
                onClick={() => onDeleteLead(lead)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      {expanded && (
        <TableRow className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/60">
          <TableCell colSpan={7} className="py-4 px-6">
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
                {lead.notes && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-amber-500/80 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <StickyNote className="h-3 w-3" />
                      Follow-up Notes
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                      {lead.notes}
                    </p>
                  </div>
                )}
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
                    <span className="text-slate-500">Email conf.</span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal border ${
                        EMAIL_STATUS_CONFIG[(lead.emailStatus as keyof typeof EMAIL_STATUS_CONFIG) ?? "pending"] ??
                        EMAIL_STATUS_CONFIG.pending
                      }`}
                    >
                      {lead.emailStatus ?? "pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between gap-2 pt-1 border-t border-slate-800">
                    <span className="text-slate-500">Lead ID</span>
                    <span className="text-slate-600 text-xs font-mono truncate max-w-[130px]" title={lead.id}>
                      {lead.id}
                    </span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="pt-2 space-y-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white justify-start gap-2"
                    onClick={() => onOpenNotes(lead)}
                  >
                    <StickyNote className="h-3 w-3 text-amber-400" />
                    {lead.notes ? "Edit Follow-up Notes" : "Add Follow-up Notes"}
                  </Button>
                  {status !== "converted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs border-emerald-700/40 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 justify-start gap-2"
                      onClick={() => onUpdateStatus(lead.id, "converted")}
                      disabled={updatingId === lead.id}
                    >
                      <UserCheck className="h-3 w-3" />
                      Convert to Client
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs border-red-700/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 justify-start gap-2"
                    onClick={() => onDeleteLead(lead)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete Lead
                  </Button>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default function AdminPage() {
  const getAccessToken = useAccessToken()

  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Notes dialog state
  const [notesLead, setNotesLead] = useState<Lead | null>(null)
  const [notesValue, setNotesValue] = useState("")
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const openNotesDialog = (lead: Lead) => {
    setNotesLead(lead)
    setNotesValue(lead.notes ?? "")
  }

  const saveNotes = async () => {
    if (!notesLead) return
    setIsSavingNotes(true)
    try {
      await authenticatedFetch(`/api/admin/leads/${notesLead.id}`, getAccessToken, {
        method: "PATCH",
        body: JSON.stringify({ notes: notesValue }),
      })
      setLeads((prev) =>
        prev.map((l) => (l.id === notesLead.id ? { ...l, notes: notesValue || null } : l))
      )
      setNotesLead(null)
    } catch (err) {
      console.error("Failed to save notes:", err)
    } finally {
      setIsSavingNotes(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await authenticatedFetch(`/api/admin/leads/${deleteTarget.id}`, getAccessToken, {
        method: "DELETE",
      })
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error("Failed to delete lead:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.leadStatus === "new").length,
    contacted: leads.filter((l) => l.leadStatus === "contacted").length,
    qualified: leads.filter((l) => l.leadStatus === "qualified").length,
    converted: leads.filter((l) => l.leadStatus === "converted").length,
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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
          label="Clients"
          value={stats.converted}
          icon={TrendingUp}
          color="text-emerald-400"
          active={statusFilter === "converted"}
          onClick={() => setStatusFilter("converted")}
        />
      </div>

      {/* Table */}
      <Card className="border border-slate-800 bg-slate-900 overflow-hidden">
        <CardHeader className="py-4 px-5 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-white text-base font-semibold">
              {statusFilter === "all"
                ? "All Leads"
                : `${STATUS_CONFIG[statusFilter as LeadStatus]?.label ?? statusFilter} Leads`}
              <span className="ml-2 text-slate-600 text-sm font-normal">({filtered.length})</span>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <Input
                placeholder="Name, email or company…"
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
                    <TableHead className="text-slate-500 font-medium text-xs">Email Conf.</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs">Date</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs">Status</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      updatingId={updatingId}
                      onUpdateStatus={updateStatus}
                      onOpenNotes={openNotesDialog}
                      onDeleteLead={setDeleteTarget}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes / Follow-up Dialog */}
      <Dialog open={!!notesLead} onOpenChange={(open) => !open && setNotesLead(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-amber-400" />
              Follow-up Notes
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {notesLead?.name} · {notesLead?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Add follow-up notes, next steps, or any relevant information…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:border-blue-500 min-h-[140px]"
              rows={6}
            />
            <p className="text-slate-600 text-xs">
              Notes are internal only — not visible to the lead.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
              onClick={() => setNotesLead(null)}
              disabled={isSavingNotes}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={saveNotes}
              disabled={isSavingNotes}
            >
              {isSavingNotes ? "Saving…" : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              Delete Lead
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to permanently delete the lead from{" "}
              <span className="text-white font-medium">{deleteTarget?.name}</span>
              {deleteTarget?.company ? (
                <> ({deleteTarget.company})</>
              ) : null}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white border-0 focus:ring-red-600"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete Lead"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
