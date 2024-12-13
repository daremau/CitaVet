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
import { NewPetDialog } from "./NuevaMascota"
import { EditPetDialog } from "./EditarMascota"

type Pet = {
  id: number
  name: string
  type: string
  breed: string
}

export function PetManager() {
  const [pets, setPets] = useState<Pet[]>([])
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const response = await fetch('/api/pets', {
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

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet)
    setIsEditDialogOpen(true)
  }

  const handlePetUpdated = () => {
    // Recargar la lista de mascotas
    fetchPets()
  }

  const handleDelete = async (petId: number) => {
    try {
      const response = await fetch(`/api/pets?id=${petId}`, {
        method: 'DELETE',
        headers: {
          'user-id': localStorage.getItem('userId') || ''
        }
      });

      if (response.ok) {
        const updatedPets = pets.filter((pet) => pet.id !== petId);
        setPets(updatedPets);
      } else {
        console.error('Error al eliminar la mascota');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(pet)}
                    >
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(pet.id)}>
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
      
      {editingPet && (
        <EditPetDialog
          pet={editingPet}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onPetUpdated={handlePetUpdated}
        />
      )}
    </div>
  )
}
function fetchPets() {
  throw new Error("Function not implemented.")
}

