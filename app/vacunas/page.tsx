import { Metadata } from "next"
import { VaccinesManagement } from "@/components/vaccines-management"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Vacunas | Wonder Pet",
  description: "Gestión de vacunas de Wonder Pet",
}

export default function VaccinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Vacunas</h1>
        <VaccinesManagement />
      </main>
    </div>
  )
}

