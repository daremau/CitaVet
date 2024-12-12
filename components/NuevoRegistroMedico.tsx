import { useEffect, useState } from "react"
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
  petId: number
  diagnosis: string
  treatment: string
  medications: string
  vaccination: {
    applied: boolean
    vaccine?: string
  }
  date: string
  veterinarianId: string
}

type NewMedicalRecordFormProps = {
  onSubmit: (record: NewMedicalRecord) => void
}

interface Product {
  IdProducto: number
  NombreProducto: string
  Tipo: string
}

interface ConfirmedPet {
  IdMascota: number;
  Nombre: string;
}


export function NewMedicalRecordForm({ onSubmit }: NewMedicalRecordFormProps) {
  const [newRecord, setNewRecord] = useState<NewMedicalRecord>({
    petId: 0,
    diagnosis: "",
    treatment: "",
    medications: "",
    vaccination: {
      applied: false,
      vaccine: ""
    },
    date: new Date().toISOString().split('T')[0],
    veterinarianId: "1"
  })
  const [availableVaccines, setAvailableVaccines] = useState<string[]>([])
  const [confirmedPets, setConfirmedPets] = useState<ConfirmedPet[]>([]);
  const [availableProducts, setAvailableProducts] = useState<{IdProducto: number, NombreProducto: string, Tipo: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await fetch('/api/vacunas')
        if (response.ok) {
          const data = await response.json()
          setAvailableVaccines(data.map((vaccine: any) => vaccine.NombreVacuna))
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching vaccines:', error)
      }
    }

    const fetchConfirmedPets = async () => {
      try {
        const response = await fetch('/api/petsConfirmed')
        if (response.ok) {
          const data = await response.json()
          setConfirmedPets(data)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching confirmed pets:', error)
      }
    }

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/producto')
        if (!response.ok) {
          throw new Error('Error fetching products')
        }
        const data = await response.json()
        setAvailableProducts(data || []) // Ensure we always have an array
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error instanceof Error ? error.message : 'Error fetching products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVaccines()
    fetchConfirmedPets()
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentDate = new Date().toISOString().split('T')[0]
    const recordWithDate = { ...newRecord, date: currentDate } 

    if (!newRecord.petId) {
      console.error('Pet ID is required');
      return;
    }

    try {
      const response = await fetch('/api/registroMedico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecord)
      })
      const result = await response.json()
      if (result.success) {
        onSubmit(recordWithDate)
      } else {
        console.error('Error creating medical record:', result.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="petId">Nombre de la Mascota</Label>
        <Select
          key={newRecord.petId}
          onValueChange={(value) => setNewRecord({...newRecord, petId: parseInt(value)})}
        >
          <SelectTrigger id="petId">
            <SelectValue placeholder="Seleccionar mascota" />
          </SelectTrigger>
          <SelectContent>
            {confirmedPets.map((pet) => (
              <SelectItem key={pet.IdMascota} value={pet.IdMascota.toString()}>
                {pet.Nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Select
          value={newRecord.medications}
          onValueChange={(value) => setNewRecord({...newRecord, medications: value})}
        >
          <SelectTrigger id="medications">
        <SelectValue placeholder="Seleccionar medicamento" />
          </SelectTrigger>
          <SelectContent>
        {availableProducts
          .filter(product => product.Tipo === "Medicamento")
          .map((product) => (
            <SelectItem key={product.IdProducto} value={product.NombreProducto}>
          {product.NombreProducto}
            </SelectItem>
        ))}
          </SelectContent>
        </Select>
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

