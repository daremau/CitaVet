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
import { Phone, TruckIcon, ArrowDownIcon } from 'lucide-react'

type Delivery = {
  IdTransporte: number
  clientName: string
  clientPhone: string
  DireccionRecogida: string
  DireccionEntrega: string
  Estado: "Pendiente" | "En camino" | "Entregado"
  Tipo: "Entrega" | "Recogida"
  Fecha: string
}

export function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('/api/transportes')
        if (!response.ok) {
          throw new Error('Error al cargar los transportes')
        }
        const data = await response.json()
        setDeliveries(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  const updateDeliveryStatus = async (id: number, newStatus: "Pendiente" | "En camino" | "Entregado") => {
    try {
      const response = await fetch('/api/transportes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus })
      })
  
      if (!response.ok) {
        throw new Error('Error al actualizar estado')
      }
  
      // Update local state
      setDeliveries(deliveries.map(delivery => 
        delivery.IdTransporte === id ? { ...delivery, Estado: newStatus } : delivery
      ))
  
    } catch (error) {
      console.error('Error al actualizar estado:', error)
    }
  }

  if (isLoading) return <div>Cargando transportes...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Repartidor</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Dirección Recogida</TableHead>
            <TableHead>Dirección Entrega</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.IdTransporte}>
              <TableCell>{new Date(delivery.Fecha).toLocaleDateString()}</TableCell>
              <TableCell>{delivery.DireccionRecogida}</TableCell>
              <TableCell>{delivery.DireccionEntrega}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {delivery.Tipo === "Entrega" ? (
                    <TruckIcon className="h-4 w-4 mr-2 text-blue-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  {delivery.Tipo}
                </div>
              </TableCell>
              <TableCell>{delivery.Estado}</TableCell>
              <TableCell>
                <Select
                  value={delivery.Estado}
                  onValueChange={(value) => updateDeliveryStatus(delivery.IdTransporte, value as "Pendiente" | "En camino" | "Entregado")}
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

