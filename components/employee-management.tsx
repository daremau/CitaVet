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
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'

type Employee = {
  id: number
  name: string
  role: string
  username: string
  password: string
}

const mockEmployees: Employee[] = [
  { id: 1, name: "Dr. Juan Pérez", role: "Veterinario", username: "veterinario1", password: "password1" },
  { id: 2, name: "María González", role: "Recepcionista", username: "recepcionista1", password: "password2" },
  { id: 3, name: "Carlos Rodríguez", role: "Repartidor", username: "delivery1", password: "password3" },
]

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", username: "", password: "" })
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState("")

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.username && newEmployee.password) {
      setEmployees([...employees, { id: Date.now(), ...newEmployee }])
      setNewEmployee({ name: "", role: "", username: "", password: "" })
      setIsAddEmployeeDialogOpen(false)
    }
  }

  const deleteEmployee = (id: number) => {
    if (confirm('¿Está seguro que desea eliminar este empleado?')) {
      setEmployees(employees.filter(employee => employee.id !== id))
    }
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.role.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.username.toLowerCase().includes(employeeFilter.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Empleados</h2>
        <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center justify-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Agregar Empleado</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Ingrese los detalles del nuevo empleado a continuación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeName" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="employeeName"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeRole" className="text-right">
                  Rol
                </Label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Veterinario">Veterinario</SelectItem>
                    <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="Repartidor">Repartidor</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeUsername" className="text-right">
                  Nombre de usuario
                </Label>
                <Input
                  id="employeeUsername"
                  value={newEmployee.username}
                  onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeePassword" className="text-right">
                  Contraseña
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="employeePassword"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const generatedPassword = Math.random().toString(36).slice(-8);
                      setNewEmployee({ ...newEmployee, password: generatedPassword });
                    }}
                  >
                    Generar
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addEmployee}>Agregar Empleado</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar empleados..."
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Nombre de usuario</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

