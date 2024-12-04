import { Metadata } from "next"
import { AppointmentManager } from "@/components/appointment-manager"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Gestionar Citas | Wonder Pet",
  description: "Manage your pet appointments",
}

export default function GestionarCitasPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <AppointmentManager />
      </main>
    </div>
  )
}

