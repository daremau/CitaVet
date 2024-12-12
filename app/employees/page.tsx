import { Metadata } from "next"
import { EmployeeManagement } from "@/components/employee-management"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Empleados | Wonder Pet",
  description: "Gestión de empleados de Wonder Pet",
}

export default function EmployeesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
        <EmployeeManagement />
      </main>
    </div>
  )
}

