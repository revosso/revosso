import { getLeadsAction } from "./actions"
import { formatDistanceToNow } from "date-fns"

/**
 * Admin Lead Viewing Page
 * 
 * CRITICAL: This page MUST NOT query the database directly.
 * 
 * Architecture: UI -> Server Actions -> Service Layer -> Repository -> Database
 */

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  // Call server action (not direct database access)
  const allLeads = await getLeadsAction()

  return (
    <html lang="en">
      <head>
        <title>Admin - Revosso Leads</title>
        <meta charSet="utf-8" />
        <style>{`
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #0f172a;
            color: #e2e8f0;
          }
          h1 {
            color: #f1f5f9;
            margin-bottom: 8px;
          }
          .stats {
            display: flex;
            gap: 20px;
            margin: 20px 0;
          }
          .stat-card {
            background: #1e293b;
            padding: 16px;
            border-radius: 8px;
            flex: 1;
          }
          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #60a5fa;
          }
          .stat-label {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 4px;
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
            font-size: 13px;
            text-transform: uppercase;
          }
          tr:hover {
            background: #334155;
          }
          .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
          }
          .badge-new { background: #3b82f6; color: white; }
          .badge-contacted { background: #8b5cf6; color: white; }
          .badge-qualified { background: #10b981; color: white; }
          .badge-closed { background: #6b7280; color: white; }
          .email-sent { background: #10b981; color: white; }
          .email-failed { background: #ef4444; color: white; }
          .email-pending { background: #f59e0b; color: white; }
          a {
            color: #60a5fa;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .message-cell {
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .small-text {
            font-size: 12px;
            color: #94a3b8;
          }
        `}</style>
      </head>
      <body>
        <h1>Revosso Lead Management</h1>
        <p className="small-text">Internal lead intelligence dashboard</p>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{allLeads.length}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{allLeads.filter(l => l.leadStatus === "new").length}</div>
            <div className="stat-label">New Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{allLeads.filter(l => l.emailStatus === "sent").length}</div>
            <div className="stat-label">Emails Sent</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Message</th>
              <th>Lead Type</th>
              <th>Product</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Email</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {allLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>
                  <a href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                </td>
                <td>{lead.company || "-"}</td>
                <td className="message-cell" title={lead.message}>
                  {lead.message}
                </td>
                <td className="small-text">{lead.leadType || "-"}</td>
                <td className="small-text">{lead.productInterest || "-"}</td>
                <td className="small-text">{lead.sourcePage || "-"}</td>
                <td className="small-text">{lead.businessStage || "-"}</td>
                <td>
                  <span className={`badge badge-${lead.leadStatus}`}>
                    {lead.leadStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge email-${lead.emailStatus}`}>
                    {lead.emailStatus}
                  </span>
                </td>
                <td className="small-text">
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  )
}
