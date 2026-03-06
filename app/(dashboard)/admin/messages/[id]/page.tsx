import { redirect } from "next/navigation"

// Leads are managed at /admin — redirect any direct visits here.
export default function MessageDetailPage() {
  redirect("/admin")
}
