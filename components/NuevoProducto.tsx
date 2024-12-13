"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"


type NewProduct = {
  IdProducto?: number
  nombreProducto: string
  tipo: 'Alimento' | 'Juguete' | 'Accesorio' | 'Higiene' | 'Medicamento' | 'Otro'
  descripcion: string
  precioCompra: number
  precioVenta: number
  stock: number
  descuento: number
  proveedor: string
}

type NewProductFormProps = {
  editMode?: boolean
  initialProduct?: NewProduct
  onSubmit: (product: NewProduct) => void
  onCancel: () => void
}

export function NewProductForm({ editMode = false, initialProduct, onSubmit, onCancel }: NewProductFormProps) {
  const [newProduct, setNewProduct] = useState<NewProduct>(
    initialProduct || {
      nombreProducto: "",
      tipo: "Otro",
      descripcion: "",
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      descuento: 0,
      proveedor: ""
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const endpoint = editMode && initialProduct?.IdProducto 
        ? `/api/producto/${initialProduct.IdProducto}` 
        : '/api/producto'
  
      const response = await fetch(endpoint, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          IdProducto: initialProduct?.IdProducto // Include IdProducto for updates
        })
      })
  
      if (response.ok) {
        onSubmit(newProduct)
      } else {
        console.error('Error al guardar el producto')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-[-4rem]"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
      <p className="text-sm text-muted-foreground mb-4">
        Ingrese los detalles del nuevo producto a continuación.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombreProducto">Nombre del Producto</Label>
          <Input
            id="nombreProducto"
            value={newProduct.nombreProducto}
            onChange={(e) => setNewProduct({ ...newProduct, nombreProducto: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            value={newProduct.tipo}
            onValueChange={(value) => setNewProduct({ ...newProduct, tipo: value as NewProduct['tipo'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alimento">Alimento</SelectItem>
              <SelectItem value="Juguete">Juguete</SelectItem>
              <SelectItem value="Accesorio">Accesorio</SelectItem>
              <SelectItem value="Higiene">Higiene</SelectItem>
              <SelectItem value="Medicamento">Medicamento</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precioCompra">Precio de Compra</Label>
          <Input
            id="precioCompra"
            type="number"
            value={newProduct.precioCompra}
            onChange={(e) => setNewProduct({ ...newProduct, precioCompra: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="precioVenta">Precio de Venta</Label>
          <Input
            id="precioVenta"
            type="number"
            value={newProduct.precioVenta}
            onChange={(e) => setNewProduct({ ...newProduct, precioVenta: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descuento">Descuento (%)</Label>
          <Input
            id="descuento"
            type="number"
            min="0"
            max="100"
            value={newProduct.descuento}
            onChange={(e) => setNewProduct({ ...newProduct, descuento: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input
            id="proveedor"
            value={newProduct.proveedor}
            onChange={(e) => setNewProduct({ ...newProduct, proveedor: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          {editMode ? 'Actualizar Producto' : 'Guardar Producto'}
        </Button>
      </form>
    </div>
  )
}
