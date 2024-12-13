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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { PlusCircle, Search, Edit, Trash2, FileText } from 'lucide-react'

type Service = {
  id: string
  name: string
  description: string
  price: number
}

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [newService, setNewService] = useState<Service>({
    id: "",
    name: "",
    description: "",
    price: 0
  })
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addService = async () => {
    if (!newService.name) {
        alert("Por favor complete todos los campos requeridos")
        return
    }

    try {
        const response = await fetch('/api/servicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newService)
        });

        if (response.ok) {
            // Recargar la lista de servicios
            const updatedResponse = await fetch('/api/servicios');
            if (updatedResponse.ok) {
                const data = await updatedResponse.json();
                const mappedServices = data.map((service: any) => ({
                    id: service.id,
                    name: service.name,
                    description: service.Descripcion,
                    price: Number(service.Precio) || 0
                }));
                setServices(mappedServices);
            }

            // Limpiar el formulario
            setNewService({ id: "", name: "", description: "", price: 0 });
            setIsAddServiceDialogOpen(false);
        } else {
            alert('Error al agregar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el servicio');
    }
  }

  const deleteService = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este servicio?')) {
        try {
            const response = await fetch(`/api/servicios?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setServices(services.filter(service => service.id !== id));
            } else {
                throw new Error('Error al eliminar el servicio');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el servicio');
        }
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsEditServiceDialogOpen(true)
  }

  const updateService = async () => {
    if (!editingService) return
  
    try {
      const response = await fetch(`/api/servicios/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingService)
      })
  
      if (response.ok) {
        setServices(services.map(service => 
          service.id === editingService.id ? editingService : service
        ))
        setIsEditServiceDialogOpen(false)
        setEditingService(null)
      } else {
        throw new Error('Error al actualizar el servicio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el servicio')
    }
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/servicios')
        if (!response.ok) throw new Error('Error al cargar servicios')
        
        const data = await response.json()
        const mappedServices = data.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.Descripcion,
          price: Number(service.Precio) || 0
        }))
        
        setServices(mappedServices)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.id}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell className="text-right">
                  {service.price ? 
                    `${service.price.toLocaleString()} Gs.` : 
                    '0 Gs.'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-2">
        <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Agregar servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Ingrese los detalles del nuevo servicio a continuación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">Nombre</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceDescription" className="text-right">Descripción</Label>
                <Input
                  id="serviceDescription"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="servicePrice" className="text-right">Precio</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addService}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Modificar servicios
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generar reporte
        </Button>
      </div>

      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Modifique los detalles del servicio a continuación.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editServiceName" className="text-right">Nombre</Label>
                <Input
                  id="editServiceName"
                  value={editingService.name}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    name: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editServiceDescription" className="text-right">Descripción</Label>
                <Input
                  id="editServiceDescription"
                  value={editingService.description}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    description: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editServicePrice" className="text-right">Precio</Label>
                <Input
                  id="editServicePrice"
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    price: Number(e.target.value)
                  })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditServiceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateService}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}