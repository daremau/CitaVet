import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type NewMedicalRecord = {
  petName: string
  ownerName: string
  diagnosis: string
  treatment: string
  medications: string
  vaccination: {
    applied: boolean
    vaccine?: string
  }
}

type NewMedicalRecordFormProps = {
  onSubmit: (record: NewMedicalRecord) => void
}

const availableVaccines = [
  "Rabia",
  "Parvovirus",
  "Moquillo",
  "Hepatitis",
  "Leptospirosis",
  "Bordetella"
]

export function NewMedicalRecordForm({ onSubmit }: NewMedicalRecordFormProps) {
  const [newRecord, setNewRecord] = useState<NewMedicalRecord>({
    petName: "",
    ownerName: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    vaccination: {
      applied: false,
      vaccine: ""
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newRecord)
    setNewRecord({
      petName: "",
      ownerName: "",
      diagnosis: "",
      treatment: "",
      medications: "",
      vaccination: {
        applied: false,
        vaccine: ""
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="petName">Nombre de la Mascota</Label>
        <Input
          id="petName"
          value={newRecord.petName}
          onChange={(e) => setNewRecord({...newRecord, petName: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ownerName">Nombre del Dueño</Label>
        <Input
          id="ownerName"
          value={newRecord.ownerName}
          onChange={(e) => setNewRecord({...newRecord, ownerName: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Textarea
          id="diagnosis"
          value={newRecord.diagnosis}
          onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="treatment">Tratamiento</Label>
        <Textarea
          id="treatment"
          value={newRecord.treatment}
          onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medications">Medicamentos</Label>
        <Input
          id="medications"
          value={newRecord.medications}
          onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="vaccination"
          checked={newRecord.vaccination.applied}
          onCheckedChange={(checked) => 
            setNewRecord({
              ...newRecord, 
              vaccination: { ...newRecord.vaccination, applied: checked }
            })
          }
        />
        <Label htmlFor="vaccination">Vacunación aplicada</Label>
      </div>
      {newRecord.vaccination.applied && (
        <div className="space-y-2">
          <Label htmlFor="vaccine">Vacuna</Label>
          <Select
            value={newRecord.vaccination.vaccine}
            onValueChange={(value) => 
              setNewRecord({
                ...newRecord, 
                vaccination: { ...newRecord.vaccination, vaccine: value }
              })
            }
          >
            <SelectTrigger id="vaccine">
              <SelectValue placeholder="Seleccionar vacuna" />
            </SelectTrigger>
            <SelectContent>
              {availableVaccines.map((vaccine) => (
                <SelectItem key={vaccine} value={vaccine}>
                  {vaccine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit">Agregar Registro</Button>
    </form>
  )
}

