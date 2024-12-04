"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
]

const bookedSlots = [
  { date: "2024-03-15", time: "09:00" },
  { date: "2024-03-15", time: "10:30" },
  { date: "2024-03-16", time: "14:00" },
]

export function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [clientName, setClientName] = useState("")
  const [petName, setPetName] = useState("")
  const [service, setService] = useState("")

  const getAvailableTimeSlots = (date: string) => {
    const booked = bookedSlots
      .filter(slot => slot.date === date)
      .map(slot => slot.time)
    return timeSlots.filter(time => !booked.includes(time))
  }

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !clientName || !petName || !service) {
      alert("Por favor complete todos los campos")
      return
    }

    console.log({
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      clientName,
      petName,
      service
    })

    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setClientName("")
    setPetName("")
    setService("")
  }

  const availableTimeSlots = selectedDate 
    ? getAvailableTimeSlots(format(selectedDate, "yyyy-MM-dd"))
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Fecha de la Cita</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={es}
            disabled={(date) => 
              date < new Date() || 
              date > addDays(new Date(), 30)
            }
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horarios Disponibles</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un horario" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDate && availableTimeSlots.length === 0 && (
              <p className="text-sm text-red-500">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Nombre del Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="petName">Nombre de la Mascota</Label>
            <Input
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Servicio</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">Chequeo General</SelectItem>
                <SelectItem value="vaccination">Vacunación</SelectItem>
                <SelectItem value="dental">Limpieza Dental</SelectItem>
                <SelectItem value="surgery">Cirugía</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime || !clientName || !petName || !service}
            className="w-full"
          >
            Agendar Cita
          </Button>
        </div>
      </div>
    </div>
  )
}

