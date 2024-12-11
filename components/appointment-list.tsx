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
  status: "Completado" | "Pendiente" | "Confirmada"
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const userRole = localStorage.getItem('userRole')
        const response = await fetch('/api/appointments', {
          headers: {
            'user-id': userId || '',
            'user-role': userRole || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          interface ApiAppointment {
            IdCita: number;
            pet: string;
            ownerName: string;
            servicio: string;
            FechaHora: string;
            Estado: string;
          }

          const formattedData: Appointment[] = (data as ApiAppointment[]).map((appointment) => ({
            id: appointment.IdCita,
            petName: appointment.pet,
            ownerName: appointment.ownerName,
            service: appointment.servicio,
            date: new Date(appointment.FechaHora).toLocaleDateString(),
            time: new Date(appointment.FechaHora).toLocaleTimeString(),
            status: appointment.Estado as "Completado" | "Pendiente" | "Confirmada",
          })).filter(appointment => appointment.status !== "Completado")
          setAppointments(formattedData)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }

    fetchAppointments()
  }, [])

  const handleConfirm = async (id: number) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({ status: 'Confirmada' })
      })
  
      if (response.ok) {
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: "Confirmada" as const } : app
        ))
      } else {
        console.error('Error updating appointment:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
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
                  <Button
                    onClick={() => handleConfirm(appointment.id)}
                    disabled={appointment.status === "Confirmada"}
                    size="sm">
                  Confirmar
                  </Button>
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

