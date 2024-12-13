import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Vaccine = {
  IdVacuna: number
  NombreVacuna: string
  Descripcion: string
  Fabricante: string
  FechaVencimiento: string
  Existencia: number
  Precio: number
}

type EditVaccineFormProps = {
  vaccine: Vaccine
  onSubmit: (updatedVaccine: Vaccine) => void
  onCancel: () => void
}

export function EditVaccineForm({ vaccine, onSubmit, onCancel }: EditVaccineFormProps) {
  const [editedVaccine, setEditedVaccine] = useState<Vaccine>(vaccine)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(editedVaccine)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vaccineName">Nombre</Label>
          <Input
            id="vaccineName"
            value={editedVaccine.NombreVacuna}
            onChange={(e) => setEditedVaccine({ ...editedVaccine, NombreVacuna: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineDescription">Descripción</Label>
          <Input
            id="vaccineDescription"
            value={editedVaccine.Descripcion}
            onChange={(e) => setEditedVaccine({ ...editedVaccine, Descripcion: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineManufacturer">Fabricante</Label>
          <Input
            id="vaccineManufacturer"
            value={editedVaccine.Fabricante}
            onChange={(e) => setEditedVaccine({ ...editedVaccine, Fabricante: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineStock">Stock</Label>
          <Input
            id="vaccineStock"
            type="number"
            value={editedVaccine.Existencia}
            onChange={(e) => setEditedVaccine({ ...editedVaccine, Existencia: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccineExpirationDate">Fecha de Vencimiento</Label>
          <Input
            id="vaccineExpirationDate"
            type="date"
            value={editedVaccine.FechaVencimiento.split('T')[0]}
            onChange={(e) => setEditedVaccine({ ...editedVaccine, FechaVencimiento: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  )
}