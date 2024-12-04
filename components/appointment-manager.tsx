"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NewAppointmentDialog } from "./new-appointment-dialog"
import { Button } from "@/components/ui/button"

type Appointment = {
  id: number
  pet: string
  service: string
  date: string
  time: string
  status: string
}

const pendingAppointments: Appointment[] = [
  { id: 1, pet: "Max", service: "Vacunación", date: "2024-03-15", time: "10:00", status: "Pendiente" },
  { id: 2, pet: "Luna", service: "Chequeo general", date: "2024-03-16", time: "11:30", status: "Confirmada" },
  { id: 3, pet: "Rocky", service: "Limpieza dental", date: "2024-03-17", time: "14:00", status: "Pendiente" },
]

const historicalAppointments: Appointment[] = [
  { id: 4, pet: "Bella", service: "Vacunación", date: "2024-02-20", time: "09:00", status: "Completada" },
  { id: 5, pet: "Charlie", service: "Chequeo general", date: "2024-02-25", time: "16:30", status: "Cancelada" },
  { id: 6, pet: "Lucy", service: "Cirugía menor", date: "2024-03-01", time: "11:00", status: "Completada" },
]

export function AppointmentManager() {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Citas</h1>
        <NewAppointmentDialog />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Citas Pendientes</TabsTrigger>
          <TabsTrigger value="history">Historial de Citas</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mascota</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.pet}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Cancelar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No hay citas pendientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mascota</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicalAppointments.length > 0 ? (
                historicalAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.pet}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Ver detalles</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No hay historial de citas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

