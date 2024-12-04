import { Metadata } from "next"
import { DeliveryDashboard } from "@/components/delivery-dashboard"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Panel de Repartidor | Wonder Pet",
  description: "Gestionar entregas y actualizar estados",
}

export default function DeliveryDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <DeliveryDashboard />
      </main>
    </div>
  )
}

