// EditAppointmentDialog.tsx
"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Appointment = {
    id: number
    pet: string
    service: string
    date: string
    time: string
    status: string
}

interface TimeSlot {
  Hora: string
}

interface EditAppointmentDialogProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, newDate: string, newTime: string) => void
}

export function EditAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onSave
}: EditAppointmentDialogProps) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [hasTransport, setHasTransport] = useState(false)

  useEffect(() => {
    const checkTransport = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointment.id}/transport`)
        if (response.ok) {
          const data = await response.json()
          setHasTransport(data.hasTransport)
        }
      } catch (error) {
        console.error('Error checking transport:', error)
      }
    }
    checkTransport()
  }, [appointment.id])

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!newDate) return; // Don't fetch if no date selected
      
      try {
        const response = await fetch(`/api/horarios?fecha=${newDate}`);
        if (response.ok) {
          const data = await response.json();
          setTimeSlots(data);
        } else {
          console.error('API Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    fetchTimeSlots();
  }, [newDate]); // Add newDate as dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Actualizar la cita
      await onSave(appointment.id, newDate, newTime)

      // Si tiene transporte, actualizarlo
      if (hasTransport) {
        const appointmentDateTime = new Date(`${newDate}T${newTime}`)
        const transportDateTime = new Date(appointmentDateTime)
        transportDateTime.setHours(transportDateTime.getHours() - 3)

        await fetch(`/api/appointments/${appointment.id}/transport`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newDateTime: transportDateTime.toISOString()
          })
        })
      }

      onClose()
    } catch (error) {
      console.error('Error updating appointment and transport:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <input
              type="date"
              id="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Select onValueChange={setNewTime} defaultValue={newTime}>
              <SelectTrigger>
                <SelectValue placeholder="Horarios Disponibles" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.Hora} value={slot.Hora}>
                    {slot.Hora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}