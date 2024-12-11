import { Metadata } from "next"
import { RegisterForm } from "@/components/RegisterForm"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Crear Cuenta | Wonder Pet",
  description: "Regístrate para acceder a los servicios de Wonder Pet",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto p-4 md:p-8 flex justify-center items-center">
        <RegisterForm />
      </main>
    </div>
  )
}

