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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Appointment = {
  id: number
  petName: string
  ownerName: string
  service: string
  date: string
  time: string
  status: "Completado" | "Pendiente" | "Confirmada"
}

interface TimeSlot {
  Hora: string
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

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

  const handleReschedule = (appointment: Appointment) => {
    setReschedulingAppointment(appointment)
    setIsRescheduleDialogOpen(true)
    setNewDate(appointment.date)
    setNewTime(appointment.time)
  }

  const fetchTimeSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/horarios?fecha=${date}`)
      if (response.ok) {
        const data = await response.json()
        setAvailableTimeSlots(data)
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    }
  }

  const handleSubmitReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingAppointment) return

    try {
      const response = await fetch(`/api/appointments/${reschedulingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({
          dateTime: `${newDate}T${newTime}`
        })
      })

      if (response.ok) {
        setAppointments(appointments.map(app =>
          app.id === reschedulingAppointment.id
            ? { ...app, date: newDate, time: newTime }
            : app
        ))
        setIsRescheduleDialogOpen(false)
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
    }
  }

  const handleComplete = async (id: number) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({ status: 'Completado' })
      })
  
      if (response.ok) {
        // Remove completed appointment from list since we filter them out
        setAppointments(appointments.filter(app => app.id !== id))
      } else {
        console.error('Error completing appointment:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
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
                  <Button 
                    onClick={() => handleComplete(appointment.id)}
                    disabled={appointment.status !== "Confirmada"} 
                    variant="secondary"
                    size="sm">
                    Completar
                  </Button>
                  <Button 
                    onClick={() => handleReschedule(appointment)} 
                    variant="outline" 
                    size="sm"
                  >
                    Reagendar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Cita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReschedule} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Nueva Fecha</Label>
              <input
                type="date"
                id="date"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value)
                  fetchTimeSlots(e.target.value)
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Nueva Hora</Label>
              <Select onValueChange={setNewTime} value={newTime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar horario" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot.Hora} value={slot.Hora}>
                      {slot.Hora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRescheduleDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
