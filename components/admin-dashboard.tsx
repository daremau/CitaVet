"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
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
import { PlusCircle, Search, FileText, Edit, Trash2, ArrowUpDown } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { ServicesManagement } from "./services-management"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import cn from 'classnames'
import { VaccinesManagement } from "./vaccines-management"

// Updated mock data to reflect veterinary products
const mockInventory = [
  { 
    id: "M001", 
    name: "Antibiótico General", 
    salePrice: 85000,
    purchasePrice: 60000,
    quantity: 100,
    brand: "PetMed",
    discount: 0,
    description: "Antibiótico de amplio espectro"
  },
  { 
    id: "S001", 
    name: "Shampoo Medicado", 
    salePrice: 45000,
    purchasePrice: 30000,
    quantity: 30,
    brand: "PetCare",
    discount: 0,
    description: "Para tratamiento de problemas de piel"
  },
  { 
    id: "F001", 
    name: "Alimento Premium para Perros", 
    salePrice: 120000,
    purchasePrice: 80000,
    quantity: 50,
    brand: "PetNutrition",
    discount: 5,
    description: "Alimento balanceado para perros adultos"
  },
  { 
    id: "T001", 
    name: "Juguete Interactivo", 
    salePrice: 35000,
    purchasePrice: 20000,
    quantity: 40,
    brand: "PetToy",
    discount: 0,
    description: "Juguete para estimulación mental de mascotas"
  },
]

const mockEmployees: Employee[] = [
  { id: 1, name: "Dr. Juan Pérez", role: "Veterinario", username: "veterinario1", password: "password1" },
  { id: 2, name: "María González", role: "Recepcionista", username: "recepcionista1", password: "password2" },
  { id: 3, name: "Carlos Rodríguez", role: "Repartidor", username: "delivery1", password: "password3" },
]

const mockFinancialReports: FinancialReport[] = [
  { 
    id: 1, 
    month: "Enero 2024", 
    revenue: 50000000, 
    expenses: 30000000, 
    profit: 20000000,
    details: [
      { category: "Servicios veterinarios", amount: 30000000 },
      { category: "Venta de productos", amount: 20000000 },
      { category: "Salarios", amount: -15000000 },
      { category: "Suministros", amount: -10000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
  { 
    id: 2, 
    month: "Febrero 2024", 
    revenue: 55000000, 
    expenses: 32000000, 
    profit: 23000000,
    details: [
      { category: "Servicios veterinarios", amount: 35000000 },
      { category: "Venta de productos", amount: 20000000 },
      { category: "Salarios", amount: -16000000 },
      { category: "Suministros", amount: -11000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
  { 
    id: 3, 
    month: "Marzo 2024", 
    revenue: 60000000, 
    expenses: 35000000, 
    profit: 25000000,
    details: [
      { category: "Servicios veterinarios", amount: 38000000 },
      { category: "Venta de productos", amount: 22000000 },
      { category: "Salarios", amount: -17000000 },
      { category: "Suministros", amount: -13000000 },
      { category: "Alquiler", amount: -5000000 },
    ]
  },
]

type InventoryItem = {
  id: string
  name: string
  salePrice: number
  purchasePrice: number
  quantity: number
  brand: string
  discount: number
  description: string
  code: string
}

type Employee = {
  id: number
  name: string
  role: string
  username: string
  password: string
}

type FinancialReport = {
  id: number
  month: string
  revenue: number
  expenses: number
  profit: number
  details: {
    category: string
    amount: number
  }[]
}


export function AdminDashboard() {
  const [inventory] = useState(mockInventory)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>(mockFinancialReports)
  //const [newItem, setNewItem] = useState({ code: "", name: "", salePrice: 0, purchasePrice: 0, quantity: 0, brand: "", discount: 0, description: "" })
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", username: "", password: "" })
  //const [inventoryFilter, setInventoryFilter] = useState("")
  //const [inventoryTypeFilter, setInventoryTypeFilter] = useState("all")
  //const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventorySortOrder, setInventorySortOrder] = useState<'asc' | 'desc'>('desc')
  //const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  //const [isModifyProductDialogOpen, setIsModifyProductDialogOpen] = useState(false)
  //const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  //const addInventoryItem = () => {
  //  if (!newItem.code || !newItem.name || !newItem.quantity) {
  //    alert("Por favor complete todos los campos requeridos")
  //    return
  //  }

  //  setInventory([...inventory, { 
  //    id: newItem.code,
  //    ...newItem
  //  }])
    
  //  setNewItem({
  //    code: "",
  //    name: "",
  //    salePrice: 0,
  //    purchasePrice: 0,
  //    quantity: 0,
  //    brand: "",
  //    discount: 0,
  //    description: ""
  //  })
  //  setIsAddProductDialogOpen(false)
  //}

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.username && newEmployee.password) {
      setEmployees([...employees, { id: Date.now(), ...newEmployee }])
      setNewEmployee({ name: "", role: "", username: "", password: "" })
      setIsAddEmployeeDialogOpen(false)
    }
  }

  const filteredInventory = inventory
  .filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => inventorySortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity)

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.role.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.username.toLowerCase().includes(employeeFilter.toLowerCase())
  )

  const totalInventoryValue = inventory.reduce((sum, item) => 
    sum + (item.purchasePrice * item.quantity), 0
  )

  const totalInventorySaleValue = inventory.reduce((sum, item) => 
    sum + (item.salePrice * item.quantity), 0
  )

  //const modifyProduct = () => {
  //  if (!selectedProduct) return
    
  //  setInventory(inventory.map(item => 
  //    item.id === selectedProduct.id ? selectedProduct : item
  //  ))
  //  setIsModifyProductDialogOpen(false)
  //  setSelectedProduct(null)
  //}

  //const deleteProduct = (id: string) => {
  //  if (confirm('¿Está seguro que desea eliminar este producto?')) {
  //    setInventory(inventory.filter(item => item.id !== id))
  //  }
  //}

  const deleteEmployee = (id: number) => {
    if (confirm('¿Está seguro que desea eliminar este empleado?')) {
      setEmployees(employees.filter(employee => employee.id !== id))
    }
  }

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      console.log(`Generando reporte desde ${format(startDate, 'dd/MM/yyyy')} hasta ${format(endDate, 'dd/MM/yyyy')}`)
      // Aquí iría la lógica real para generar el reporte
      setIsGenerateReportDialogOpen(false)
    } else {
      alert("Por favor seleccione ambas fechas")
    }
  }

  const toggleInventorySort = () => {
    setInventorySortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Administrador</h1>
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="w-fit">
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="financial">Reportes Financieros</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="vaccines">Vacunas</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 w-full max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleInventorySort}
                  className="ml-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
              {/*<Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo producto</DialogTitle>
                    <DialogDescription>
                      Ingrese los detalles del nuevo producto a continuación.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">
                        Código
                      </Label>
                      <div className="col-span-3 flex gap-2">
                        <Input
                          id="code"
                          value={newItem.code}
                          onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                            setNewItem({ ...newItem, code: newCode });
                          }}
                        >
                          Generar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="salePrice" className="text-right">
                        Precio de venta
                      </Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={newItem.salePrice}
                        onChange={(e) => setNewItem({ ...newItem, salePrice: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="purchasePrice" className="text-right">
                        Precio de compra
                      </Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        value={newItem.purchasePrice}
                        onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Cantidad
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="brand" className="text-right">
                        Marca
                      </Label>
                      <Input
                        id="brand"
                        value={newItem.brand}
                        onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="discount" className="text-right">
                        Descuento (%)
                      </Label>
                      <Input
                        id="discount"
                        type="number"
                        value={newItem.discount}
                        onChange={(e) => setNewItem({ ...newItem, discount: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addInventoryItem}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>*/}
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Precio Venta</TableHead>
                    <TableHead className="text-right">Precio Compra</TableHead>
                    <TableHead className="text-right">
                      Cantidad
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-8 w-8 p-0"
                        onClick={toggleInventorySort}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead className="text-right">Descuento</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.salePrice.toLocaleString()} Gs.</TableCell>
                      <TableCell className="text-right">{item.purchasePrice.toLocaleString()} Gs.</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell className="text-right">{item.discount}%</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{totalInventoryValue.toLocaleString()} Gs.</p>
                  <p className="text-sm text-muted-foreground">Dinero total en inventario (compra)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{totalInventorySaleValue.toLocaleString()} Gs.</p>
                  <p className="text-sm text-muted-foreground">Dinero total en inventario (a la venta)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Agregar productos
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Modificar productos
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generar reporte
                </Button>
              </div>
            </div>
            {/*<div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => setIsAddProductDialogOpen(true)}
                className="flex items-center justify-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Agregar producto</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModifyProductDialogOpen(true)}
                className="flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Modificar productos</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
            </div>*/}
          </div>
        </TabsContent>
        <TabsContent value="employees">
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
        </TabsContent>
        <TabsContent value="financial">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reportes Financieros</h2>
              <Button onClick={() => setIsGenerateReportDialogOpen(true)}>
                Generar Reporte
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mes</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Gastos</TableHead>
                  <TableHead>Beneficios</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.month}</TableCell>
                    <TableCell>{report.revenue.toLocaleString()} Gs.</TableCell>
                    <TableCell>{report.expenses.toLocaleString()} Gs.</TableCell>
                    <TableCell>{report.profit.toLocaleString()} Gs.</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Ver Detalles</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detalles Financieros - {report.month}</DialogTitle>
                            <DialogDescription>
                              Desglose de ingresos y gastos para {report.month}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Categoría</TableHead>
                                  <TableHead>Monto</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {report.details.map((detail, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{detail.category}</TableCell>
                                    <TableCell>{detail.amount.toLocaleString()} Gs.</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="services">
          <ServicesManagement />
        </TabsContent>
        <TabsContent value="vaccines">
          <VaccinesManagement />
        </TabsContent>
      </Tabs>
      {/*<Dialog open={isModifyProductDialogOpen} onOpenChange={setIsModifyProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar producto</DialogTitle>
            <DialogDescription>
              Ingrese el código del producto para modificar sus detalles.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyCode" className="text-right">
                Código
              </Label>
              <Input
                id="modifyCode"
                value={selectedProduct?.id || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyName" className="text-right">
                Nombre
              </Label>
              <Input
                id="modifyName"
                value={selectedProduct?.name || ''}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  name: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifySalePrice" className="text-right">
                Precio de venta
              </Label>
              <Input
                id="modifySalePrice"
                type="number"
                value={selectedProduct?.salePrice || 0}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  salePrice: Number(e.target.value)
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyPurchasePrice" className="text-right">
                Precio de compra
              </Label>
              <Input
                id="modifyPurchasePrice"
                type="number"
                value={selectedProduct?.purchasePrice || 0}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  purchasePrice: Number(e.target.value)
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyQuantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="modifyQuantity"
                type="number"
                value={selectedProduct?.quantity || 0}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  quantity: Number(e.target.value)
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyBrand" className="text-right">
                Marca
              </Label>
              <Input
                id="modifyBrand"
                value={selectedProduct?.brand || ''}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  brand: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyDiscount" className="text-right">
                Descuento (%)
              </Label>
              <Input
                id="modifyDiscount"
                type="number"
                value={selectedProduct?.discount || 0}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  discount: Number(e.target.value)
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modifyDescription" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="modifyDescription"
                value={selectedProduct?.description || ''}
                onChange={(e) => selectedProduct && setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value
                })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={modifyProduct}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>*/}
      <Dialog open={isGenerateReportDialogOpen} onOpenChange={setIsGenerateReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Reporte Financiero</DialogTitle>
            <DialogDescription>
              Seleccione el rango de fechas para generar el reporte.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Fecha Inicial
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Fecha Final
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateReport}>Generar Reporte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}