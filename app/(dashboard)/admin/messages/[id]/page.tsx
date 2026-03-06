"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Update the sample message data to be more relevant to a financial platform
const messages = [
  {
    id: "MSG001",
    name: "Jean Dupont",
    email: "jean.dupont@exemple.com",
    message:
      "J'ai des difficultés à connecter mon compte bancaire à la plateforme Ekonomi. J'ai essayé plusieurs fois mais je continue à recevoir un message d'erreur disant 'Connexion échouée'. J'utilise la Banque Populaire et j'ai vérifié que mes identifiants sont corrects. Pouvez-vous m'aider à résoudre ce problème ?",
    date: "2023-03-16T14:30:00",
    status: "new",
    replies: [],
  },
  {
    id: "MSG002",
    name: "Sarah Martin",
    email: "sarah.martin@exemple.com",
    message:
      "J'aimerais en savoir plus sur les fonctionnalités premium de Revo Finance. Quels sont les tarifs d'abonnement ? Je suis particulièrement intéressée par les outils de suivi des investissements et de prévision financière.",
    date: "2023-03-15T09:45:00",
    status: "in-progress",
    replies: [
      {
        id: "REP001",
        from: "support@ekonomi.com",
        message:
          "Merci pour votre intérêt pour nos fonctionnalités premium. Notre plan Premium est à 9,99€/mois et inclut le suivi des investissements, les prévisions financières, des catégories budgétaires illimitées et un support prioritaire. Nous proposons également un plan annuel à 99€/an qui vous fait économiser deux mois. Souhaitez-vous que je vous envoie une comparaison détaillée de nos fonctionnalités gratuites vs premium ?",
        date: "2023-03-15T11:30:00",
      },
    ],
  },
]

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const [replyText, setReplyText] = useState("")
  const [status, setStatus] = useState("")

  // Find the message by ID
  const message = messages.find((m) => m.id === params.id) || messages[0]

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

  const handleSendReply = () => {
    if (replyText.trim()) {
      alert(`Réponse envoyée : ${replyText}`)
      setReplyText("")
    }
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    alert(`Statut mis à jour vers : ${value}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/messages">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Détails du Message</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{message.name}</CardTitle>
                  <CardDescription>{message.email}</CardDescription>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(message.status)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">{formatDate(message.date)}</div>
                <p className="whitespace-pre-line">{message.message}</p>
              </div>
            </CardContent>
          </Card>

          {message.replies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Historique de Conversation</h3>
              {message.replies.map((reply) => (
                <Card key={reply.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-medium">{reply.from}</CardTitle>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(reply.date)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{reply.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Répondre</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tapez votre réponse ici..."
                className="min-h-[120px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Sauvegarder le Brouillon</Button>
              <Button onClick={handleSendReply}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer la Réponse
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Statut</h4>
                <Select defaultValue={message.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveau</SelectItem>
                    <SelectItem value="in-progress">En Cours</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">ID du Message</h4>
                <p className="text-sm text-muted-foreground">{message.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Reçu</h4>
                <p className="text-sm text-muted-foreground">{formatDate(message.date)}</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-1">Informations de Contact</h4>
                <div className="grid gap-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Nom :</span> {message.name}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email :</span> {message.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Send className="mr-2 h-4 w-4" />
                Envoyer un Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer le Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
