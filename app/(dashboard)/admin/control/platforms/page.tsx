"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Pencil, Trash2, RefreshCw, Search, Globe } from "lucide-react"
import Link from "next/link"

type Platform = {
  id: number
  name: string
  url: string
  category: string | null
  sortOrder: number | null
}

export default function PlatformsPage() {
  const getAccessToken = useAccessToken()
  const [result, setResult] = useState<{
    data: Platform[]
    total: number
    page: number
    lastPage: number
  } | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Platform | null>(null)

  const load = useCallback(
    async (p = 1, s = search) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(p) })
        if (s) params.set("search", s)
        const data = await authenticatedFetch(`/api/admin/control/platforms?${params}`, getAccessToken)
        setResult(data)
      } finally {
        setLoading(false)
      }
    },
    [getAccessToken, search],
  )

  useEffect(() => {
    load()
  }, [load])

  function applyFilters() {
    setPage(1)
    load(1, search)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await authenticatedFetch(`/api/admin/control/platforms/${deleteTarget.id}`, getAccessToken, {
      method: "DELETE",
    })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-sky-400" />
          <h1 className="text-xl font-bold text-white">Platforms</h1>
          {result && <span className="text-slate-500 text-sm">({result.total})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" asChild className="bg-sky-700 hover:bg-sky-800 text-white">
            <Link href="/admin/control/platforms/new">
              <Plus className="h-4 w-4 mr-1" />
              Add platform
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-slate-500 text-sm max-w-2xl">
        Registry of enterprise tools: name and URL. Links open in a new tab.
      </p>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by name or URL"
            className="bg-slate-900 border-slate-700 text-white pl-9"
          />
        </div>
        <Button onClick={applyFilters} className="bg-slate-700 hover:bg-slate-600 text-white">
          Search
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-12">Order</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">URL</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                      No platforms yet. Add one to list your tools.
                    </TableCell>
                  </TableRow>
                )}
                {result?.data.map((row) => (
                  <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-500 text-sm">{row.sortOrder ?? 0}</TableCell>
                    <TableCell className="text-white font-medium">{row.name}</TableCell>
                    <TableCell>
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 text-sm truncate max-w-md inline-block align-bottom"
                      >
                        {row.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{row.category || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-white">
                          <Link href={`/admin/control/platforms/${row.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-red-400"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {result && result.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            className="text-slate-400"
            onClick={() => {
              setPage(page - 1)
              load(page - 1)
            }}
          >
            Previous
          </Button>
          <span className="text-slate-500 text-sm">
            Page {page} of {result.lastPage}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= result.lastPage}
            className="text-slate-400"
            onClick={() => {
              setPage(page + 1)
              load(page + 1)
            }}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete platform?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {deleteTarget?.name} will be removed from the registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
