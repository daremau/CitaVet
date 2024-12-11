import { Metadata } from "next"
import { PetManager } from "@/components/GestionMascotas"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Gestionar Mascotas | Wonder Pet",
  description: "Gestiona tus mascotas registradas",
}

export default function GestionarMascotasPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <PetManager />
      </main>
    </div>
  )
}

