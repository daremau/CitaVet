"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Appointment {
  id: number;
  petId: string;
  serviceId: string;
  dateTime: string;
  notes: string;
}

interface NuevaCitaProps {
  appointment?: Appointment;
}

export function NuevaCita() {
  const [open, setOpen] = useState(false)

  interface Pet {
    id: number
    name: string
  }
  const [pets, setPets] = useState<Pet[]>([])

  interface Service {
    id: number
    name: string
  }
  const [services, setServices] = useState<Service[]>([])

  interface TimeSlot {
    Hora: string
  }
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  // Estados para los campos del formulario
  const [selectedPet, setSelectedPet] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const response = await fetch(`/api/pets`, {
          headers: {
            'user-id': userId || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPets(data)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching pets:', error)
      }
    }

    fetchPets()
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const response = await fetch(`/api/servicios`, {
          headers: {
            'user-id': userId || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`/api/horarios`)
        if (response.ok) {
          const data = await response.json()
          setTimeSlots(data)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching time slots:', error)
      }
    }

    fetchTimeSlots()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const userId = localStorage.getItem("userId")

    const appointmentData = {
      userId,
      petId: selectedPet,
      serviceId: selectedService,
      dateTime: new Date(`${selectedDate}T${selectedTime}`).toLocaleString('en-US'),
      notes,
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'user-id': localStorage.getItem('userId') || '' 
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Cita creada:", data)
        setOpen(false)
      } else {
        console.error("Error al guardar la cita")
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Nueva Cita</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Cita</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="pet">Mascota</Label>
            <Select onValueChange={setSelectedPet}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id.toString()}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Servicio</Label>
            <Select onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Select onValueChange={setSelectedTime}>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionales"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agendar Cita</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

