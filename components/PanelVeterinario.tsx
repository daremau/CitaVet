"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentList } from "./appointment-list"
import { PetMedicalHistory } from "./HistorialMedico"

export function VeterinarianDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de Veterinario</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="medical-history">Historial Médico de Mascotas</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <AppointmentList />
        </TabsContent>
        <TabsContent value="medical-history">
          <PetMedicalHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

