"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

export function NewPetDialog() {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [name, setName] = useState("")
  const [breed, setBreed] = useState("")
  const [otherBreed, setOtherBreed] = useState("")
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
      } else {
        console.error('API Error:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching breeds:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalBreed = breed === "Otro" ? otherBreed : breed
    const userId = localStorage.getItem('userId')

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userId') || '' 
        },
        body: JSON.stringify({ name, type: selectedType, breed: finalBreed, userId }),
      })

      if (response.ok) {
        console.log('Mascota registrada exitosamente')
        setOpen(false)
        // Reset form
        setName("")
        setSelectedType("")
        setBreed("")
        setOtherBreed("")
      } else {
        console.error('Error registrando mascota:', response.statusText)
      }
    } catch (error) {
      console.error('Error registrando mascota:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-black/90">
          Registrar Nueva Mascota
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Mascota</DialogTitle>
          <DialogDescription>
            Ingresa los datos de tu nueva mascota
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value)
                setBreed("")
                setOtherBreed("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de mascota" />
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
            <Select
              value={breed}
              onValueChange={setBreed}
              disabled={!selectedType}
            >
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

          {breed === "Otro" && (
            <div className="space-y-2">
              <Label htmlFor="otherBreed">Especificar otra raza</Label>
              <Input
                id="otherBreed"
                value={otherBreed}
                onChange={(e) => setOtherBreed(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

