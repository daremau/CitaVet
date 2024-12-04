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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type MedicalRecord = {
  id: number
  petName: string
  ownerName: string
  date: string
  diagnosis: string
  treatment: string
  medications: string
}

const mockMedicalRecords: MedicalRecord[] = [
  { id: 1, petName: "Max", ownerName: "John Doe", date: "2024-02-15", diagnosis: "Infección de oído", treatment: "Gotas para oídos recetadas", medications: "Otibiotic" },
  { id: 2, petName: "Luna", ownerName: "Jane Smith", date: "2024-02-20", diagnosis: "Chequeo anual", treatment: "Vacunas administradas", medications: "None" },
  { id: 3, petName: "Rocky", ownerName: "Mike Johnson", date: "2024-03-01", diagnosis: "Problemas dentales", treatment: "Limpieza dental programada", medications: "None" },
]

export function PetMedicalHistory() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords)
  const [filter, setFilter] = useState("")
  const [selectedPet, setSelectedPet] = useState<MedicalRecord | null>(null)
  const [newRecord, setNewRecord] = useState({
    petName: "",
    ownerName: "",
    diagnosis: "",
    treatment: "",
    medications: "",
  })

  const handleAddRecord = () => {
    const newId = Math.max(...medicalRecords.map(record => record.id)) + 1
    const currentDate = new Date().toISOString().split('T')[0]
    setMedicalRecords([...medicalRecords, { id: newId, date: currentDate, ...newRecord }])
    setNewRecord({ petName: "", ownerName: "", diagnosis: "", treatment: "", medications: "" })
  }

  const filteredRecords = medicalRecords.filter(record =>
    record.petName.toLowerCase().includes(filter.toLowerCase()) ||
    record.ownerName.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Buscar por nombre de mascota o dueño..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Agregar Nuevo Registro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Registro Médico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre de la Mascota"
                value={newRecord.petName}
                onChange={(e) => setNewRecord({...newRecord, petName: e.target.value})}
              />
              <Input
                placeholder="Nombre del Dueño"
                value={newRecord.ownerName}
                onChange={(e) => setNewRecord({...newRecord, ownerName: e.target.value})}
              />
              <Textarea
                placeholder="Diagnóstico"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
              />
              <Textarea
                placeholder="Tratamiento"
                value={newRecord.treatment}
                onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
              />
              <Input
                placeholder="Medicamentos"
                value={newRecord.medications}
                onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
              />
              <Button onClick={handleAddRecord}>Agregar Registro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Diagnóstico</TableHead>
            <TableHead>Tratamiento</TableHead>
            <TableHead>Medicamentos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.petName}</TableCell>
              <TableCell>{record.ownerName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.diagnosis}</TableCell>
              <TableCell>{record.treatment}</TableCell>
              <TableCell>{record.medications}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

