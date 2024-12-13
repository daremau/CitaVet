"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const petTypes = ["Perro", "Gato"]

interface EditPetDialogProps {
  pet: {
    id: number
    name: string
    type: string 
    breed: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onPetUpdated: () => void
}

export function EditPetDialog({ pet, open, onOpenChange, onPetUpdated }: EditPetDialogProps) {
  const [name, setName] = useState(pet.name)
  const [selectedType, setSelectedType] = useState(pet.type)
  const [breed, setBreed] = useState(pet.breed)
  const [breeds, setBreeds] = useState<{ id: number, nombre: string }[]>([])

  useEffect(() => {
    if (selectedType) {
      fetchBreeds(selectedType)
    }
  }, [selectedType])

  const fetchBreeds = async (type: string) => {
    const endpoint = type === "Perro" ? "/api/razas/perro" : "/api/razas/gato"
    try {
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setBreeds(data)
      }
    } catch (error) {
      console.error('Error fetching breeds:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId') || ''
        },
        body: JSON.stringify({ 
          name,
          type: selectedType,
          breed
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        onPetUpdated()
      }
    } catch (error) {
      console.error('Error updating pet:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Mascota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {petTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Raza</Label>
            <Select value={breed} onValueChange={setBreed}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar raza" />
              </SelectTrigger>
              <SelectContent>
                {breeds.map((breedOption) => (
                  <SelectItem key={breedOption.id} value={breedOption.nombre}>
                    {breedOption.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}