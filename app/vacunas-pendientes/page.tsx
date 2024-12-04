import { Metadata } from "next"
import { PendingVaccinations } from "@/components/pending-vaccinations"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Vacunas Pendientes | Wonder Pet",
  description: "Lista de vacunas pendientes para tus mascotas",
}

export default function VacunasPendientesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Vacunas Pendientes</h1>
        <PendingVaccinations />
      </main>
    </div>
  )
}

