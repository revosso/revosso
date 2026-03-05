import { db } from "@/lib/db"
import { leads } from "@/lib/schema"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt))

  return (
    <html lang="fr">
      <head>
        <title>Admin - Revosso Leads</title>
        <meta charSet="utf-8" />
        <style>{`
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #0f172a;
            color: #e2e8f0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #1e293b;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #334155;
          }
          th {
            background: #0f172a;
            font-weight: 600;
            color: #94a3b8;
          }
          tr:hover {
            background: #334155;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-NEW {
            background: #3b82f6;
            color: white;
          }
        `}</style>
      </head>
      <body>
        <h1>Revosso Leads</h1>
        <p>Total: {allLeads.length} leads</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Entreprise</th>
              <th>Message</th>
              <th>Lead Type</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {allLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.name}</td>
                <td>
                  <a href={`mailto:${lead.email}`} style={{ color: "#60a5fa" }}>
                    {lead.email}
                  </a>
                </td>
                <td>{lead.company || "-"}</td>
                <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lead.message}
                </td>
                <td>
                  {lead.productInterest
                    ? lead.productInterest
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "-"}
                </td>
                <td style={{ fontSize: "12px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lead.source ? lead.source.split("|")[0] : "-"}
                </td>
                <td>
                  <span className={`status status-${lead.status}`}>{lead.status}</span>
                </td>
                <td>{new Date(lead.createdAt).toLocaleString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  )
}
