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
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewMedicalRecordForm } from "./NuevoRegistroMedico"

type MedicalRecord = {
  id: number
  petName: string
  ownerName: string
  date: string
  diagnosis: string
  treatment: string
  medications: string
  vaccination: {
    applied: boolean
    vaccine?: string
  }
}

const mockMedicalRecords: MedicalRecord[] = [
  { id: 1, petName: "Max", ownerName: "John Doe", date: "2024-02-15", diagnosis: "Infección de oído", treatment: "Gotas para oídos recetadas", medications: "Otibiotic", vaccination: { applied: true, vaccine: "Rabia" } },
  { id: 2, petName: "Luna", ownerName: "Jane Smith", date: "2024-02-20", diagnosis: "Chequeo anual", treatment: "Vacunas administradas", medications: "None", vaccination: { applied: true, vaccine: "Parvovirus" } },
  { id: 3, petName: "Rocky", ownerName: "Mike Johnson", date: "2024-03-01", diagnosis: "Problemas dentales", treatment: "Limpieza dental programada", medications: "None", vaccination: { applied: false } },
]

export function PetMedicalHistory() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords)
  const [filter, setFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddRecord = (newRecord: Omit<MedicalRecord, 'id' | 'date'>) => {
    const newId = Math.max(...medicalRecords.map(record => record.id)) + 1
    const currentDate = new Date().toISOString().split('T')[0]
    setMedicalRecords([...medicalRecords, { id: newId, date: currentDate, ...newRecord }])
    setIsDialogOpen(false)
  }

  const filteredRecords = medicalRecords.filter(record =>
    record.petName.toLowerCase().includes(filter.toLowerCase()) ||
    record.ownerName.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar por nombre de mascota o dueño..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Agregar Nuevo Registro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Registro Médico</DialogTitle>
            </DialogHeader>
            <NewMedicalRecordForm onSubmit={handleAddRecord} />
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
            <TableHead>Vacunación</TableHead>
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
              <TableCell>
                {record.vaccination.applied ? 
                  `Sí - ${record.vaccination.vaccine}` : 
                  'No'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}