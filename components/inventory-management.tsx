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
import { Search, PlusCircle, Edit, Trash2, FileText } from 'lucide-react'

type InventoryItem = {
  id: string
  name: string
  salePrice: number
  purchasePrice: number
  quantity: number
  brand: string
  discount: number
  description: string
}

const mockInventory: InventoryItem[] = [
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

export function InventoryManagement() {
  const [inventory] = useState(mockInventory)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalInventoryValue = inventory.reduce((sum, item) => 
    sum + (item.purchasePrice * item.quantity), 0
  )

  const totalInventorySaleValue = inventory.reduce((sum, item) => 
    sum + (item.salePrice * item.quantity), 0
  )

  return (
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
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio Venta</TableHead>
              <TableHead className="text-right">Precio Compra</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
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
    </div>
  )
}