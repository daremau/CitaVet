import { Metadata } from "next"
import { InventoryManagement } from "@/components/inventory-management"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Inventario | Wonder Pet",
  description: "Gestión de inventario de Wonder Pet",
}

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <InventoryManagement />
      </main>
    </div>
  )
}

