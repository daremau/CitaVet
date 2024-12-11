"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NuevaCita } from "./NuevaCita"
import { Button } from "@/components/ui/button"

type Appointment = {
  id: number
  pet: string
  service: string
  date: string
  time: string
  status: string
}

export function GestionCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch('/api/appointments', {
          headers: {
            'user-id': userId || '',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((appointment: any) => ({
            id: appointment.IdCita,
            pet: appointment.pet,
            service: appointment.servicio,
            date: new Date(appointment.FechaHora).toLocaleDateString(),
            time: new Date(appointment.FechaHora).toLocaleTimeString(),
            status: appointment.Estado,
          }));
          setAppointments(formattedData);
        } else {
          console.error('API Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId: number) => {
    try {
      const response = await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'user-id': localStorage.getItem('userId') || ''
        }
      });
  
      if (response.ok) {
        const updatedAppointments = appointments.filter(
          (appointment) => appointment.id !== appointmentId
        );
        setAppointments(updatedAppointments);
      } else {
        console.error('Error al cancelar la cita');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pendiente" || appointment.status === "Confirmada"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completado"
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Citas</h1>
        <NuevaCita />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Citas Pendientes</TabsTrigger>
          <TabsTrigger value="history">Historial de Citas</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>Mascota</TableHead>
           <TableHead>Servicio</TableHead>
           <TableHead>Fecha</TableHead>
           <TableHead>Hora</TableHead>
           <TableHead>Estado</TableHead>
           <TableHead>Acciones</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {pendingAppointments.length > 0 ? (
           pendingAppointments.map((appointment) => (
             <TableRow key={appointment.id}>
               <TableCell>{appointment.pet}</TableCell>
               <TableCell>{appointment.service}</TableCell>
               <TableCell>{appointment.date}</TableCell>
               <TableCell>{appointment.time}</TableCell>
               <TableCell>{appointment.status}</TableCell>
               <TableCell>
                 <div className="flex space-x-2">
                   <Button variant="outline" size="sm" >
                      Editar
                    </Button>
                   <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>
                      Cancelar
                    </Button>
                 </div>
               </TableCell>
             </TableRow>
           ))
         ) : (
           <TableRow>
             <TableCell colSpan={6} className="text-center py-4">
               No hay citas pendientes
             </TableCell>
           </TableRow>
         )}
       </TableBody>
     </Table>
   </TabsContent>
   <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mascota</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAppointments.length > 0 ? (
                completedAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.pet}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay citas completadas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}


