"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Download, Filter, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Update the sample data to be more relevant to a financial platform
const messages = [
  {
    id: "MSG001",
    name: "Jean Dupont",
    email: "jean.dupont@exemple.com",
    message: "J'ai des difficultés à connecter mon compte bancaire à la plateforme Ekonomi. Pouvez-vous m'aider ?",
    date: "2023-03-16T14:30:00",
    status: "new",
  },
  {
    id: "MSG002",
    name: "Sarah Martin",
    email: "sarah.martin@exemple.com",
    message:
      "J'aimerais en savoir plus sur les fonctionnalités premium de Revo Finance. Quels sont les tarifs d'abonnement ?",
    date: "2023-03-15T09:45:00",
    status: "in-progress",
  },
  {
    id: "MSG003",
    name: "Michel Dubois",
    email: "michel.d@exemple.com",
    message:
      "Y a-t-il un moyen d'exporter mes rapports financiers vers Excel ou PDF ? J'en ai besoin pour ma déclaration fiscale.",
    date: "2023-03-14T16:20:00",
    status: "resolved",
  },
  {
    id: "MSG004",
    name: "Émilie Bernard",
    email: "emilie.bernard@exemple.com",
    message:
      "La fonctionnalité de suivi budgétaire ne fonctionne pas correctement. Elle ne met pas à jour mes catégories de dépenses.",
    date: "2023-03-14T11:10:00",
    status: "new",
  },
  {
    id: "MSG005",
    name: "David Moreau",
    email: "david.moreau@exemple.com",
    message:
      "Je suis intéressé par la fonctionnalité de suivi des investissements. Prend-elle en charge les investissements en cryptomonnaies ?",
    date: "2023-03-13T15:30:00",
    status: "in-progress",
  },
  {
    id: "MSG006",
    name: "Jennifer Leroy",
    email: "jennifer.leroy@exemple.com",
    message:
      "Plusieurs utilisateurs peuvent-ils accéder au même compte financier ? Je veux le partager avec mon conjoint.",
    date: "2023-03-12T10:15:00",
    status: "resolved",
  },
  {
    id: "MSG007",
    name: "Robert Garcia",
    email: "robert.g@exemple.com",
    message:
      "J'ai besoin d'aide pour configurer les paiements de factures récurrents dans le système. La documentation n'est pas claire.",
    date: "2023-03-11T14:50:00",
    status: "new",
  },
  {
    id: "MSG008",
    name: "Lisa Martinez",
    email: "lisa.m@exemple.com",
    message: "Y a-t-il une application mobile pour Ekonomi ? J'aimerais suivre mes finances en déplacement.",
    date: "2023-03-10T09:30:00",
    status: "in-progress",
  },
]

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter messages based on search term and status
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || message.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            Nouveau
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-500 text-primary-foreground">
            En Cours
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-500 text-primary-foreground">
            Résolu
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Messages de Contact</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par Statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tous les Messages</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("new")}>Nouveau</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>En Cours</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Résolu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus Récent d'Abord</SelectItem>
              <SelectItem value="oldest">Plus Ancien d'Abord</SelectItem>
              <SelectItem value="a-z">Nom (A-Z)</SelectItem>
              <SelectItem value="z-a">Nom (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Tous les Messages</CardTitle>
          <CardDescription>Vous avez {filteredMessages.length} messages au total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.id}</TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{message.message}</TableCell>
                  <TableCell>{formatDate(message.date)}</TableCell>
                  <TableCell>{getStatusBadge(message.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/admin/messages/${message.id}`} className="flex w-full">
                            Voir les détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Marquer comme résolu</DropdownMenuItem>
                        <DropdownMenuItem>Envoyer une réponse</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Supprimer le message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
