"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentScheduler } from "./appointment-scheduler"
import { ReceiptGenerator } from "./receipt-generator"
import { useSearchParams } from 'next/navigation'

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'receipts') {
      setActiveTab('receipts')
    }
  }, [searchParams])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de Recepcionista</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Agendar Citas</TabsTrigger>
          <TabsTrigger value="receipts">Generar Recibos</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <AppointmentScheduler />
        </TabsContent>
        <TabsContent value="receipts">
          <ReceiptGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

