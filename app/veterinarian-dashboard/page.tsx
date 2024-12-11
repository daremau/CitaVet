import { Metadata } from "next"
import { VeterinarianDashboard } from "@/components/PanelVeterinario"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Veterinarian Dashboard | Wonder Pet",
  description: "Manage appointments and pet medical records",
}

export default function VeterinarianDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <VeterinarianDashboard />
      </main>
    </div>
  )
}

