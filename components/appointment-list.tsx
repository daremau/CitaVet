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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type Appointment = {
  id: number
  petName: string
  ownerName: string
  service: string
  date: string
  time: string
  status: "Programada" | "Pendiente" | "Confirmada"
}

const mockAppointments: Appointment[] = [
  { id: 1, petName: "Max", ownerName: "John Doe", service: "Vacunación", date: "2024-03-15", time: "10:00", status: "Programada" },
  { id: 2, petName: "Luna", ownerName: "Jane Smith", service: "Chequeo", date: "2024-03-16", time: "11:30", status: "Pendiente" },
  { id: 3, petName: "Rocky", ownerName: "Mike Johnson", service: "Limpieza Dental", date: "2024-03-17", time: "14:00", status: "Confirmada" },
  { id: 4, petName: "Bella", ownerName: "Sarah Williams", service: "Vacunación", date: "2024-03-18", time: "09:00", status: "Programada" },
  { id: 5, petName: "Charlie", ownerName: "Emily Brown", service: "Cirugía", date: "2024-03-19", time: "13:00", status: "Pendiente" },
]

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [filter, setFilter] = useState("")
  const [filterType, setFilterType] = useState("all")

  const handleConfirm = (id: number) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "Confirmada" as const } : app
    ))
  }

  const handleReschedule = (id: number) => {
    // In a real application, this would open a dialog to reschedule
    console.log(`Reschedule appointment ${id}`)
  }

  const filteredAppointments = appointments.filter(app => {
    if (!filter) return true
    switch (filterType) {
      case "pet":
        return app.petName.toLowerCase().includes(filter.toLowerCase())
      case "owner":
        return app.ownerName.toLowerCase().includes(filter.toLowerCase())
      case "service":
        return app.service.toLowerCase().includes(filter.toLowerCase())
      default:
        return true
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pet">Mascota</SelectItem>
            <SelectItem value="owner">Dueño</SelectItem>
            <SelectItem value="service">Servicio</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filtrar citas..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.petName}</TableCell>
              <TableCell>{appointment.ownerName}</TableCell>
              <TableCell>{appointment.service}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {appointment.status !== "Confirmada" && (
                    <Button onClick={() => handleConfirm(appointment.id)} size="sm">
                      Confirmar
                    </Button>
                  )}
                  <Button onClick={() => handleReschedule(appointment.id)} variant="outline" size="sm">
                    Reprogramar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

