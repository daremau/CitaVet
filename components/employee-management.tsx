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
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'

type Employee = {
  id: number           // IdUsuario
  username: string     // NombreUsuario 
  password: string     // Contrasena
  role: string        // Tipo
  name: string        // Nombre
  email: string       // Email
  address: string     // Direccion
  phone: string       // Telefono
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("")
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "", 
    role: "", 
    username: "", 
    password: "",
    email: "",
    address: "",
    phone: ""
  })
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsEditEmployeeDialogOpen(true)
  }

  const addEmployee = async () => {
    if (newEmployee.name && newEmployee.role && newEmployee.username && newEmployee.password) {
      try {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: newEmployee.name,
            username: newEmployee.username,
            password: newEmployee.password,
            role: newEmployee.role,
            email: newEmployee.email || '',
            address: newEmployee.address || '',
            phone: newEmployee.phone || ''
          }),
        })
  
        if (response.ok) {
          // Recargar la lista de empleados
          const updatedResponse = await fetch('/api/usuarios')
          if (updatedResponse.ok) {
            const data = await updatedResponse.json()
            const formattedEmployees = data.map((user: any) => ({
              id: user.IdUsuario,
              username: user.NombreUsuario,
              password: user.Contrasena,
              role: user.Tipo,
              name: user.Nombre || '',
              email: user.Email || '',
              address: user.Direccion || '',
              phone: user.Telefono || ''
            }))
            setEmployees(formattedEmployees)
          }
          
          // Limpiar el formulario
          setNewEmployee({ 
            name: "", 
            role: "", 
            username: "", 
            password: "",
            email: "",
            address: "",
            phone: ""
          })
          setIsAddEmployeeDialogOpen(false)
        } else {
          console.error('Error al agregar empleado')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const deleteEmployee = async (id: number) => {
    if (confirm('¿Está seguro que desea eliminar este empleado?')) {
      try {
        const response = await fetch(`/api/usuarios?id=${id}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          setEmployees(employees.filter(employee => employee.id !== id));
        } else {
          throw new Error('Error al eliminar el empleado');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  const updateEmployee = async () => {
    if (!editingEmployee) return
  
    try {
      const response = await fetch(`/api/usuarios/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingEmployee.name,
          username: editingEmployee.username,
          role: editingEmployee.role,
          email: editingEmployee.email,
          address: editingEmployee.address,
          phone: editingEmployee.phone
        }),
      })
  
      if (response.ok) {
        // Actualizar la lista de empleados
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? editingEmployee : emp
        ))
        setIsEditEmployeeDialogOpen(false)
        setEditingEmployee(null)
      } else {
        console.error('Error al actualizar empleado')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.role.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.username.toLowerCase().includes(employeeFilter.toLowerCase())
  )

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/usuarios')
        if (response.ok) {
          const data = await response.json()
          const formattedEmployees: Employee[] = data.map((user: any) => ({
            id: user.IdUsuario,
            username: user.NombreUsuario,
            password: user.Contrasena,
            role: user.Tipo,
            name: user.Nombre || '',
            email: user.Email || '',
            address: user.Direccion || '',
            phone: user.Telefono || ''
          }))
          setEmployees(formattedEmployees)
        } else {
          setError('Error al cargar usuarios')
        }
      } catch (error) {
        setError('Error al cargar usuarios')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar empleados..."
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
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
                    <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Veterinario">Veterinario</SelectItem>
                    <SelectItem value="PersonalDelivery">Personal Delivery</SelectItem>
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
                <Input
                  id="employeePassword"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeAddress" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="employeeAddress"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeePhone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="employeePhone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addEmployee}>Agregar Empleado</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(employee)}
                  >
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
      <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeeName" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="editEmployeeName"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    name: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeeUsername" className="text-right">
                  Nombre de Usuario
                </Label>
                <Input
                  id="editEmployeeUsername"
                  value={editingEmployee.username}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    username: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeeRole" className="text-right">
                  Rol
                </Label>
                <Select
                  value={editingEmployee.role}
                  onValueChange={(value) => setEditingEmployee({
                    ...editingEmployee,
                    role: value
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Veterinario">Veterinario</SelectItem>
                    <SelectItem value="PersonalDelivery">Personal Delivery</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeeEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editEmployeeEmail"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    email: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeeAddress" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="editEmployeeAddress"
                  value={editingEmployee.address}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    address: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmployeePhone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="editEmployeePhone"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    phone: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateEmployee}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

