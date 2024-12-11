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
import { NewPetDialog } from "./NuevaMascota"

type Pet = {
  id: number
  name: string
  type: string
  breed: string
}

const mockPets: Pet[] = [
  { id: 1, name: "Max", type: "Perro", breed: "Labrador Retriever" },
  { id: 2, name: "Luna", type: "Gato", breed: "Siamés" },
  { id: 3, name: "Rocky", type: "Perro", breed: "Pastor Alemán" },
  { id: 4, name: "Milo", type: "Gato", breed: "Persa" },
  { id: 5, name: "Bella", type: "Perro", breed: "Golden Retriever" },
]

export function PetManager() {
  const [pets, setPets] = useState<Pet[]>(mockPets)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Mascotas</h1>
        <NewPetDialog />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.type}</TableCell>
                <TableCell>{pet.breed}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No hay mascotas registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

