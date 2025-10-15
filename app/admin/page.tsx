import Link from "next/link"
import { BarChart, MessageSquare, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord Ekonomi</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Totaux</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 depuis la semaine dernière</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Totales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M2 17h2.4a2 2 0 0 0 1.4-.6l7.2-7.2a2 2 0 0 1 2.8 0L21 14.4"></path>
              <path d="M16 7h6"></path>
              <path d="M19 4v6"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$428,560</div>
            <p className="text-xs text-muted-foreground">+8,2% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance de la Plateforme</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24,5%</div>
            <p className="text-xs text-muted-foreground">Croissance d'une année sur l'autre</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Nouveau message de contact de Jean Dupont</p>
                  <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Nouvelle inscription d'utilisateur</p>
                  <p className="text-sm text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Alerte transaction importante : $25,000</p>
                  <p className="text-sm text-muted-foreground">Hier à 15h45</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nouvelle demande de fonctionnalité : Prévisions budgétaires
                  </p>
                  <p className="text-sm text-muted-foreground">Hier à 11h30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Liens Rapides</CardTitle>
            <CardDescription>Accéder aux pages fréquemment utilisées</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <MessageSquare className="h-4 w-4" />
              <div className="font-medium">Messages de Contact</div>
            </Link>
            <Link
              href="/admin/transactions"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M2 17h2.4a2 2 0 0 0 1.4-.6l7.2-7.2a2 2 0 0 1 2.8 0L21 14.4"></path>
                <path d="M16 7h6"></path>
                <path d="M19 4v6"></path>
              </svg>
              <div className="font-medium">Transactions</div>
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <BarChart className="h-4 w-4" />
              <div className="font-medium">Rapports Financiers</div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
