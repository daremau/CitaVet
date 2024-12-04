'use client'

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { HomeIcon, CalendarIcon, Syringe, UserCircle2, LogOutIcon, PawPrint, Stethoscope, FileText, Truck, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'Cliente' | 'Veterinario' | 'Recepcionista' | 'PersonalDelivery' | 'Administrador' | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    if (loggedIn) {
      setUserRole(localStorage.getItem('userRole') as 'Cliente' | 'Veterinario' | 'Recepcionista' | 'PersonalDelivery' | 'Administrador')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    setUserRole(null)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Wonder Pet
        </Link>
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            userRole === 'Veterinario' ? (
              <>
                <Link href="/veterinarian-dashboard" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <Stethoscope className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <LogOutIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : userRole === 'Recepcionista' ? (
              <>
                <Link href="/receptionist-dashboard" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <CalendarIcon className="h-4 w-4" />
                  Agendar Citas
                </Link>
                <Link href="/receptionist-dashboard?tab=receipts" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <FileText className="h-4 w-4" />
                  Generar Recibos
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <LogOutIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : userRole === 'PersonalDelivery' ? (
              <>
                <Link href="/delivery-dashboard" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <Truck className="h-4 w-4" />
                  Dashboard de Entregas
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <LogOutIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : userRole === 'Administrador' ? (
              <>
                <Link href="/admin-dashboard" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <BarChart className="h-4 w-4" />
                  Dashboard de Administrador
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <LogOutIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <HomeIcon className="h-4 w-4" />
                  Inicio
                </Link>
                <Link href="/gestionar-citas" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <CalendarIcon className="h-4 w-4" />
                  Gestionar Citas
                </Link>
                <Link href="/vacunas-pendientes" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <Syringe className="h-4 w-4" />
                  Vacunas Pendientes
                </Link>
                <Link href="/gestionar-mascotas" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <PawPrint className="h-4 w-4" />
                  Gestionar Mascotas
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-1 text-sm hover:opacity-80">
                  <LogOutIcon className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            )
          ) : (
            <>
              <Link href="/" className="flex items-center gap-1 text-sm hover:opacity-80">
                <HomeIcon className="h-4 w-4" />
                Inicio
              </Link>
              <Link href="/login" className="flex items-center gap-1 text-sm hover:opacity-80">
                <LogOutIcon className="h-4 w-4" />
                Iniciar Sesión
              </Link>
              <Link href="/register" className="flex items-center gap-1 text-sm bg-black text-white px-4 py-2 rounded-md hover:opacity-90">
                <UserCircle2 className="h-4 w-4" />
                Crear Cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

