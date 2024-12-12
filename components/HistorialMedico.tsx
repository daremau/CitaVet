"use client"

import { useState, useEffect } from "react"
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

type NewMedicalRecord = Omit<MedicalRecord, "id" | "date">

export function PetMedicalHistory() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [filter, setFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch('/api/registroMedico')
        if (response.ok) {
          const data = await response.json()
          const formattedData = data.map((record: any) => ({
            id: record.id,
            petName: record.Mascota,
            ownerName: record.Dueño,
            date: record.Fecha,
            diagnosis: record.Diagnostico,
            treatment: record.Tratamiento,
            medications: record.Medicamentos,
            vaccination: {
              applied: record.Vacunacion ? record.Vacunacion.startsWith('Sí') : false,
              vaccine: record.Vacunacion && record.Vacunacion.startsWith('Sí') ? record.Vacunacion.split(' - ')[1] : undefined
            }
          }))
          setMedicalRecords(formattedData)
        } else {
          console.error('API Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching medical records:', error)
      }
    }

    fetchMedicalRecords()
  }, [])

  const handleAddRecord = (newRecord: Omit<MedicalRecord, 'id' | 'date'>) => {
    const newId = Math.max(...medicalRecords.map(record => record.id)) + 1
    const currentDate = new Date().toISOString().split('T')[0]
    setMedicalRecords([...medicalRecords, { id: newId, date: currentDate, ...newRecord }])
    setIsDialogOpen(false)
  }

  const filteredRecords = medicalRecords.filter(record =>
    (record.petName && record.petName.toLowerCase().includes(filter.toLowerCase())) ||
    (record.ownerName && record.ownerName.toLowerCase().includes(filter.toLowerCase()))
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