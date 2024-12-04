import { Metadata } from "next"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Panel de Administrador | Wonder Pet",
  description: "Gestionar inventario, empleados y reportes financieros",
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <AdminDashboard />
      </main>
    </div>
  )
}

