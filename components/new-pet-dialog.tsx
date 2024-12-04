"use client"

import { useState } from "react"
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

const dogBreeds = [
  "Labrador Retriever",
  "Pastor Alemán",
  "Golden Retriever",
  "Bulldog",
  "Poodle",
  "Otro",
]

const catBreeds = [
  "Siamés",
  "Persa",
  "Maine Coon",
  "Bengalí",
  "Ragdoll",
  "Otro",
]

export function NewPetDialog() {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [name, setName] = useState("")
  const [breed, setBreed] = useState("")
  const [otherBreed, setOtherBreed] = useState("")

  const getBreedsByType = (type: string) => {
    switch (type) {
      case "Perro":
        return dogBreeds
      case "Gato":
        return catBreeds
      default:
        return []
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalBreed = breed === "Otro" ? otherBreed : breed
    console.log({ name, type: selectedType, breed: finalBreed })
    setOpen(false)
    // Reset form
    setName("")
    setSelectedType("")
    setBreed("")
    setOtherBreed("")
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
                {getBreedsByType(selectedType).map((breedOption) => (
                  <SelectItem key={breedOption} value={breedOption}>
                    {breedOption}
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

