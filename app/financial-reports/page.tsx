import { Metadata } from "next"
import { FinancialReports } from "@/components/financial-reports"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Reportes Financieros | Wonder Pet",
  description: "Reportes financieros de Wonder Pet",
}

export default function FinancialReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Reportes Financieros</h1>
        <FinancialReports />
      </main>
    </div>
  )
}

