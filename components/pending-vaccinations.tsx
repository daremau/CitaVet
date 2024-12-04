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
import { Badge } from "@/components/ui/badge"

type Vaccination = {
  id: number
  petName: string
  vaccineName: string
  dueDate: string
  status: "Pendiente" | "Próxima" | "Atrasada"
}

const mockVaccinations: Vaccination[] = [
  { id: 1, petName: "Max", vaccineName: "Rabia", dueDate: "2024-04-15", status: "Pendiente" },
  { id: 2, petName: "Luna", vaccineName: "Parvovirus", dueDate: "2024-03-30", status: "Próxima" },
  { id: 3, petName: "Rocky", vaccineName: "Moquillo", dueDate: "2024-03-10", status: "Atrasada" },
  { id: 4, petName: "Bella", vaccineName: "Leptospirosis", dueDate: "2024-05-01", status: "Pendiente" },
  { id: 5, petName: "Charlie", vaccineName: "Hepatitis", dueDate: "2024-04-20", status: "Pendiente" },
]

export function PendingVaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations)

  const getStatusColor = (status: Vaccination["status"]) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-500"
      case "Próxima":
        return "bg-green-500"
      case "Atrasada":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSchedule = (id: number) => {
    // Here you would typically open a dialog to schedule the vaccination
    // For now, we'll just log to the console
    console.log(`Scheduling vaccination for id: ${id}`)
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Vacuna</TableHead>
            <TableHead>Fecha Prevista</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vaccinations.map((vaccination) => (
            <TableRow key={vaccination.id}>
              <TableCell>{vaccination.petName}</TableCell>
              <TableCell>{vaccination.vaccineName}</TableCell>
              <TableCell>{vaccination.dueDate}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(vaccination.status)}>
                  {vaccination.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSchedule(vaccination.id)}
                >
                  Agendar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

