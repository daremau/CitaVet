"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"

type FinancialReport = {
  id: number
  fecha: string        // Rango de fechas
  nombre: string       // Nombre del reporte
  ingresos: number
  gastos: number
  beneficios: number   // Campo calculado en la DB
}

export function FinancialReports() {
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/reportes')
        if (!response.ok) {
          throw new Error('Error al obtener reportes')
        }
        const data = await response.json()
        setFinancialReports(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (isLoading) return <div>Cargando reportes...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reportes Financieros</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Ingresos</TableHead>
            <TableHead className="text-right">Gastos</TableHead>
            <TableHead className="text-right">Beneficios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financialReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.nombre}</TableCell>
              <TableCell>{report.fecha}</TableCell>
              <TableCell className="text-right">{report.ingresos.toLocaleString()} Gs.</TableCell>
              <TableCell className="text-right">{report.gastos.toLocaleString()} Gs.</TableCell>
              <TableCell className="text-right">{report.beneficios.toLocaleString()} Gs.</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}