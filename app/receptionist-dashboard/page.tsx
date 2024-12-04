import { Metadata } from "next"
import { ReceptionistDashboard } from "@/components/receptionist-dashboard"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Panel de Recepcionista | Wonder Pet",
  description: "Gestionar citas y generar recibos",
}

export default function ReceptionistDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <ReceptionistDashboard />
      </main>
    </div>
  )
}

