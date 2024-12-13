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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { PlusCircle, Search, Edit, Trash2, FileText, ArrowUpDown } from 'lucide-react'
import { NewVaccineForm } from "./NuevaVacuna"
import { EditVaccineForm } from "./EditarVacuna"

type Vaccine = {
  IdVacuna: number
  NombreVacuna: string
  Descripcion: string
  Fabricante: string
  FechaVencimiento: string
  Existencia: number
  Precio: number  
}

export function VaccinesManagement() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null)

  const filteredVaccines = vaccines
  .filter(vaccine => 
    (vaccine?.NombreVacuna?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (vaccine?.IdVacuna?.toString().includes(searchQuery) ?? false)
  )
  .sort((a, b) => sortOrder === 'asc' ? a.Existencia - b.Existencia : b.Existencia - a.Existencia);


  const deleteVaccine = async (id: number) => {
    if (confirm('¿Está seguro que desea eliminar esta vacuna?')) {
        try {
            const response = await fetch(`/api/vacunas?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setVaccines(vaccines.filter(vaccine => vaccine.IdVacuna !== id));
            } else {
                console.error('Error deleting vaccine');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const handleEdit = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine)
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await fetch('/api/vacunas')
        if (response.ok) {
          const data = await response.json()
          setVaccines(data)
        } else {
          console.error('Error fetching vaccines:', response.statusText)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchVaccines()
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
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSort}
            className="ml-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead>Fecha de Vencimiento</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Cargando vacunas...
                </TableCell>
              </TableRow>
            ) : filteredVaccines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No se encontraron vacunas
                </TableCell>
              </TableRow>
            ) : (
              filteredVaccines.map((vaccine) => (
                <TableRow key={vaccine.IdVacuna}>
                  <TableCell className="font-medium">{vaccine.IdVacuna}</TableCell>
                  <TableCell>{vaccine.NombreVacuna}</TableCell>
                  <TableCell>{vaccine.Descripcion}</TableCell>
                  <TableCell>{vaccine.Fabricante}</TableCell>
                  <TableCell className="text-right">{vaccine.Existencia}</TableCell>
                  <TableCell className="text-right">{vaccine.Precio.toLocaleString()} Gs.</TableCell>
                  <TableCell>{new Date(vaccine.FechaVencimiento).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(vaccine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteVaccine(vaccine.IdVacuna)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-2">
        <Dialog open={isAddVaccineDialogOpen} onOpenChange={setIsAddVaccineDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Agregar vacuna
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Vacuna</DialogTitle>
              <DialogDescription>
                Ingrese los detalles de la nueva vacuna a continuación.
              </DialogDescription>
            </DialogHeader>
            <NewVaccineForm
              onSubmit={async (newVaccine) => {
                try {
                  const response = await fetch('/api/vacunas', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: newVaccine.name,
                      description: newVaccine.description,
                      manufacturer: newVaccine.manufacturer,
                      expirationDate: newVaccine.expirationDate,
                      stock: newVaccine.stock,
                      price: newVaccine.price
                    })
                  });
            
                  if (response.ok) {
                    const result = await response.json();
                    const formattedVaccine: Vaccine = {
                      IdVacuna: result.insertId,
                      NombreVacuna: newVaccine.name,
                      Descripcion: newVaccine.description,
                      Fabricante: newVaccine.manufacturer,
                      FechaVencimiento: newVaccine.expirationDate,
                      Existencia: newVaccine.stock,
                      Precio: newVaccine.price
                    };
                    setVaccines([...vaccines, formattedVaccine]);
                    setIsAddVaccineDialogOpen(false);
                  } else {
                    console.error('Failed to add vaccine');
                  }
                } catch (error) {
                  console.error('Error adding vaccine:', error);
                }
              }}
              onCancel={() => setIsAddVaccineDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Modificar vacunas
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generar reporte
        </Button>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Vacuna</DialogTitle>
            <DialogDescription>
              Modifique los detalles de la vacuna.
            </DialogDescription>
          </DialogHeader>
          {selectedVaccine && (
            <EditVaccineForm
              vaccine={selectedVaccine}
              onSubmit={async (updatedVaccine) => {
                try {
                  const response = await fetch(`/api/vacunas?id=${updatedVaccine.IdVacuna}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: updatedVaccine.NombreVacuna,
                      description: updatedVaccine.Descripcion,
                      manufacturer: updatedVaccine.Fabricante,
                      expirationDate: updatedVaccine.FechaVencimiento,
                      stock: updatedVaccine.Existencia,
                      price: updatedVaccine.Precio
                    })
                  });

                  if (response.ok) {
                    setVaccines(vaccines.map(v => 
                      v.IdVacuna === updatedVaccine.IdVacuna ? updatedVaccine : v
                    ));
                    setIsEditDialogOpen(false);
                  } else {
                    console.error('Failed to update vaccine');
                  }
                } catch (error) {
                  console.error('Error updating vaccine:', error);
                }
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}