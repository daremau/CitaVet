"use client"

import { useState } from "react"
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
import { PlusCircle, Search, Edit, Trash2, FileText, ArrowUpDown } from 'lucide-react'

type Vaccine = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  expirationDate: string
}

const mockVaccines: Vaccine[] = [
  { id: "V001", name: "Vacuna Antirrábica", description: "Prevención contra la rabia", price: 150000, stock: 50, expirationDate: "2025-12-31" },
  { id: "V002", name: "Vacuna Parvovirus", description: "Protección contra el parvovirus canino", price: 120000, stock: 30, expirationDate: "2025-06-30" },
  { id: "V003", name: "Vacuna Moquillo", description: "Inmunización contra el moquillo canino", price: 130000, stock: 40, expirationDate: "2025-09-30" },
  { id: "V004", name: "Vacuna Leucemia Felina", description: "Prevención de leucemia en gatos", price: 180000, stock: 25, expirationDate: "2025-03-31" },
]

export function VaccinesManagement() {
  const [vaccines, setVaccines] = useState<Vaccine[]>(mockVaccines)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false)
  const [newVaccine, setNewVaccine] = useState<Vaccine>({ id: "", name: "", description: "", price: 0, stock: 0, expirationDate: "" })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredVaccines = vaccines
    .filter(vaccine => 
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock)

  const addVaccine = () => {
    if (!newVaccine.id || !newVaccine.name) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    setVaccines([...vaccines, newVaccine])
    setNewVaccine({ id: "", name: "", description: "", price: 0, stock: 0, expirationDate: "" })
    setIsAddVaccineDialogOpen(false)
  }

  const deleteVaccine = (id: string) => {
    if (confirm('¿Está seguro que desea eliminar esta vacuna?')) {
      setVaccines(vaccines.filter(vaccine => vaccine.id !== id))
    }
  }

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

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
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">
                Stock
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                  onClick={toggleSort}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Fecha de Expiración</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVaccines.map((vaccine) => (
              <TableRow key={vaccine.id}>
                <TableCell className="font-medium">{vaccine.id}</TableCell>
                <TableCell>{vaccine.name}</TableCell>
                <TableCell>{vaccine.description}</TableCell>
                <TableCell className="text-right">{vaccine.price.toLocaleString()} Gs.</TableCell>
                <TableCell className="text-right">{vaccine.stock}</TableCell>
                <TableCell>{vaccine.expirationDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteVaccine(vaccine.id)}
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
        <Dialog open={isAddVaccineDialogOpen} onOpenChange={setIsAddVaccineDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Agregar vacuna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Vacuna</DialogTitle>
              <DialogDescription>
                Ingrese los detalles de la nueva vacuna a continuación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccineId" className="text-right">Código</Label>
                <Input
                  id="vaccineId"
                  value={newVaccine.id}
                  onChange={(e) => setNewVaccine({ ...newVaccine, id: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccineName" className="text-right">Nombre</Label>
                <Input
                  id="vaccineName"
                  value={newVaccine.name}
                  onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccineDescription" className="text-right">Descripción</Label>
                <Input
                  id="vaccineDescription"
                  value={newVaccine.description}
                  onChange={(e) => setNewVaccine({ ...newVaccine, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccinePrice" className="text-right">Precio</Label>
                <Input
                  id="vaccinePrice"
                  type="number"
                  value={newVaccine.price}
                  onChange={(e) => setNewVaccine({ ...newVaccine, price: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccineStock" className="text-right">Stock</Label>
                <Input
                  id="vaccineStock"
                  type="number"
                  value={newVaccine.stock}
                  onChange={(e) => setNewVaccine({ ...newVaccine, stock: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vaccineExpirationDate" className="text-right">Fecha de Expiración</Label>
                <Input
                  id="vaccineExpirationDate"
                  type="date"
                  value={newVaccine.expirationDate}
                  onChange={(e) => setNewVaccine({ ...newVaccine, expirationDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addVaccine}>Guardar</Button>
            </DialogFooter>
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
    </div>
  )
}