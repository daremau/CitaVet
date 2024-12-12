import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Vaccine = {
  name: string
  description: string
  price: number
  stock: number
  expirationDate: string
  manufacturer: string;
}

type NewVaccineFormProps = {
  onSubmit: (vaccine: Vaccine) => void
  onCancel: () => void
}

export function NewVaccineForm({ onSubmit, onCancel }: NewVaccineFormProps) {
  const [newVaccine, setNewVaccine] = useState<Vaccine>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    expirationDate: "",
    manufacturer: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/vacunas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVaccine)
      })

      if (response.ok) {
        // Enviar los datos de la nueva vacuna
        const result = await response.json()
        onSubmit(newVaccine)
      } else {
        console.error('Error al guardar la vacuna')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vaccineName">Nombre</Label>
          <Input
            id="vaccineName"
            value={newVaccine.name}
            onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineDescription">Descripción</Label>
          <Input
            id="vaccineDescription"
            value={newVaccine.description}
            onChange={(e) => setNewVaccine({ ...newVaccine, description: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccinePrice">Precio</Label>
          <Input
            id="vaccinePrice"
            type="number"
            value={newVaccine.price}
            onChange={(e) => setNewVaccine({ ...newVaccine, price: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineStock">Stock</Label>
          <Input
            id="vaccineStock"
            type="number"
            value={newVaccine.stock}
            onChange={(e) => setNewVaccine({ ...newVaccine, stock: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineExpirationDate">Fecha de Expiración</Label>
          <Input
            id="vaccineExpirationDate"
            type="date"
            value={newVaccine.expirationDate}
            onChange={(e) => setNewVaccine({ ...newVaccine, expirationDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineManufacturer">Fabricante</Label>
          <Input
            id="vaccineManufacturer"
            value={newVaccine.manufacturer}
            onChange={(e) => setNewVaccine({ ...newVaccine, manufacturer: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Vacuna</Button>
      </div>
    </form>
  )
}

