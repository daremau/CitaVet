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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Phone } from 'lucide-react'

type Delivery = {
  id: number
  clientName: string
  clientPhone: string
  address: string
  status: "Pendiente" | "En camino" | "Entregado"
}

const mockDeliveries: Delivery[] = [
  { id: 1, clientName: "Juan Pérez", clientPhone: "0981 123 456", address: "Calle 1, Casa 2, Barrio San Juan", status: "Pendiente" },
  { id: 2, clientName: "María González", clientPhone: "0982 234 567", address: "Avenida Principal 123, Edificio Sol, Apto 4B", status: "En camino" },
  { id: 3, clientName: "Carlos Rodríguez", clientPhone: "0983 345 678", address: "Ruta 1, Km 5, Casa con portón verde", status: "Pendiente" },
]

export function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries)

  const updateDeliveryStatus = (id: number, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Repartidor</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>
                <div>{delivery.clientName}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {delivery.clientPhone}
                </div>
              </TableCell>
              <TableCell>{delivery.address}</TableCell>
              <TableCell>{delivery.status}</TableCell>
              <TableCell>
                <Select
                  value={delivery.status}
                  onValueChange={(value) => updateDeliveryStatus(delivery.id, value as Delivery['status'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Actualizar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En camino">En camino</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

