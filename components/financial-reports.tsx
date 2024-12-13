"use client"

import { useState } from "react"
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
  month: string
  revenue: number
  expenses: number
  profit: number
  details: {
    category: string
    amount: number
  }[]
}

const mockFinancialReports: FinancialReport[] = [
  { 
    id: 1, 
    month: "Enero 2024", 
    revenue: 50000000, 
    expenses: 30000000, 
    profit: 20000000,
    details: [
      { category: "Servicios veterinarios", amount: 30000000 },
      { category: "Venta de productos", amount: 20000000 },
      { category: "Salarios", amount: -15000000 },
      { category: "Suministros", amount: -10000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
  { 
    id: 2, 
    month: "Febrero 2024", 
    revenue: 55000000, 
    expenses: 32000000, 
    profit: 23000000,
    details: [
      { category: "Servicios veterinarios", amount: 35000000 },
      { category: "Venta de productos", amount: 20000000 },
      { category: "Salarios", amount: -16000000 },
      { category: "Suministros", amount: -11000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
  { 
    id: 3, 
    month: "Marzo 2024", 
    revenue: 60000000, 
    expenses: 35000000, 
    profit: 25000000,
    details: [
      { category: "Servicios veterinarios", amount: 38000000 },
      { category: "Venta de productos", amount: 22000000 },
      { category: "Salarios", amount: -17000000 },
      { category: "Suministros", amount: -13000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
]

export function FinancialReports() {
  const [financialReports] = useState<FinancialReport[]>(mockFinancialReports)
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reportes Financieros</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mes</TableHead>
            <TableHead>Ingresos</TableHead>
            <TableHead>Gastos</TableHead>
            <TableHead>Beneficios</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financialReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.month}</TableCell>
              <TableCell>{report.revenue.toLocaleString()} Gs.</TableCell>
              <TableCell>{report.expenses.toLocaleString()} Gs.</TableCell>
              <TableCell>{report.profit.toLocaleString()} Gs.</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Ver Detalles</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Detalles Financieros - {report.month}</DialogTitle>
                      <DialogDescription>
                        Desglose de ingresos y gastos para {report.month}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Monto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {report.details.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.category}</TableCell>
                              <TableCell>{detail.amount.toLocaleString()} Gs.</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}