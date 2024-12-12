import { Metadata } from "next"
import { ServicesManagement } from "@/components/services-management"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Servicios | Wonder Pet",
  description: "Gestión de servicios de Wonder Pet",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Servicios</h1>
        <ServicesManagement />
      </main>
    </div>
  )
}

