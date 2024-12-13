"use client"

import { useState, useEffect } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Vaccination = {
  id: number
  petId: number
  petName: string
  vaccineName: string
  dueDate: string
  status: "Pendiente" | "Próxima" | "Atrasada"
}

interface TimeSlot {
  Hora: string
}

export function PendingVaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await fetch('/api/vacunaspendientes')
        if (response.ok) {
          const data = await response.json()
          setVaccinations(data.map((vac: any) => ({
            id: vac.vacuna_id,  
            petId: vac.mascota_id, 
            petName: vac.mascota_nombre,
            vaccineName: vac.nombre_vacuna,
            dueDate: new Date(vac.fecha_prevista).toLocaleDateString(),
            status: vac.estado as "Pendiente" | "Próxima" | "Atrasada"
          })))
        } else {
          console.error('Error fetching vaccinations:', response.statusText)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVaccinations()
  }, [])

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedDate) return
      
      try {
        const response = await fetch(`/api/horarios?fecha=${selectedDate}`)
        if (response.ok) {
          const data = await response.json()
          setAvailableTimeSlots(data)
        } else {
          console.error('Error fetching time slots:', response.statusText)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  
    fetchAvailableTimeSlots()
  }, [selectedDate])

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

  const handleSchedule = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination)
    setIsDialogOpen(true)
  }

  const createAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVaccination) return
  
    try {
      // Crear la cita
      const appointmentDateTime = `${selectedDate}T${selectedTime}`
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'user-id': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({
          petId: Number(selectedVaccination.petId),
          serviceId: "2", // ID del servicio de vacunación
          dateTime: new Date(appointmentDateTime).toLocaleString('en-US'),
          notes: `Vacunación - ${selectedVaccination.vaccineName}`
        })
      })
  
      if (appointmentResponse.ok) {
        // Si la cita se creó exitosamente, eliminar la vacunación pendiente
        const deleteResponse = await fetch(
          `/api/vacunaspendientes/${selectedVaccination.id}`,
          { method: "DELETE" }
        )
  
        if (deleteResponse.ok) {
          // Actualizar el estado local eliminando la vacuna programada
          const updatedVaccinations = vaccinations.filter(
            v => v.id !== selectedVaccination.id
          )
          setVaccinations(updatedVaccinations)
          setIsDialogOpen(false)
          window.alert("La cita para vacunación ha sido programada exitosamente")
        } else {
          window.alert("La cita se creó pero hubo un error al actualizar el estado de la vacuna")
        }
      } else {
        window.alert("Error: No se pudo crear la cita")
      }
    } catch (error) {
      console.error('Error:', error)
      window.alert("Error: Ocurrió un error al procesar la solicitud")
    }
  }

  if (isLoading) {
    return <div>Cargando vacunas programadas...</div>
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
          {vaccinations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay vacunas programadas
              </TableCell>
            </TableRow>
          ) : (
            vaccinations.map((vaccination) => (
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
                    onClick={() => handleSchedule(vaccination)}
                  >
                    Agendar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Vacunación</DialogTitle>
          </DialogHeader>
          <form onSubmit={createAppointment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Select 
                value={selectedTime} 
                onValueChange={setSelectedTime}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar horario" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot: {Hora: string}) => (
                    <SelectItem key={slot.Hora} value={slot.Hora}>
                      {new Date(`2000-01-01T${slot.Hora}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
