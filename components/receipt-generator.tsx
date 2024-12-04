"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Printer, Trash2, Mail } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mockup para servicios y productos
const mockServices = [
  { code: "S001", description: "Consulta general", price: 150000 },
  { code: "S002", description: "Vacunación", price: 100000 },
  { code: "S003", description: "Cirugía menor", price: 500000 },
  { code: "S004", description: "Limpieza dental", price: 200000 },
]

const mockProducts = [
  { code: "P001", description: "Alimento para perros (1kg)", price: 50000 },
  { code: "P002", description: "Collar antipulgas", price: 80000 },
  { code: "P003", description: "Shampoo medicado", price: 60000 },
  { code: "P004", description: "Juguete para gatos", price: 30000 },
]

type Item = {
  id: number
  description: string
  quantity: number
  unitPrice: number
}

export function ReceiptGenerator() {
  const [items, setItems] = useState<Item[]>([])
  const [customerName, setCustomerName] = useState("")
  const [ruc, setRuc] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [saleCondition, setSaleCondition] = useState("contado")
  const [newItem, setNewItem] = useState({
    type: "service",
    code: "",
    description: "",
    quantity: 1,
    unitPrice: 0
  })
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")

  useEffect(() => {
    setInvoiceNumber(Math.floor(100000 + Math.random() * 900000).toString())
  }, [])

  const addItem = () => {
    if (!newItem.code || !newItem.quantity) {
      alert("Por favor ingrese un código válido y especifique la cantidad")
      return
    }

    const selectedItem = newItem.type === "service"
      ? mockServices.find(s => s.code === newItem.code)
      : mockProducts.find(p => p.code === newItem.code);

    if (!selectedItem) {
      alert("Código de item no encontrado")
      return
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        description: `${newItem.code} - ${selectedItem.description}`,
        quantity: newItem.quantity,
        unitPrice: selectedItem.price
      }
    ])

    setNewItem({
      type: "service",
      code: "",
      description: "",
      quantity: 1,
      unitPrice: 0
    })
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateIVA = () => {
    return calculateSubtotal() * 0.10 // 10% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA()
  }

  const handlePrint = () => {
    if (!customerName || !ruc || items.length === 0) {
      alert("Por favor complete todos los campos necesarios")
      return
    }
    window.print()
  }

  const handleEmailSend = () => {
    // Here you would implement the logic to send the email
    console.log(`Sending invoice to ${customerEmail}`)
    setEmailModalOpen(false)
    // You might want to show a success message to the user here
  }

  return (
    <div className="space-y-6 print:p-4 max-w-2xl mx-auto">
      <div className="border-2 border-black p-4 print:border-0 bg-white">
        <div className="text-center mb-4 border-b-2 border-black pb-2">
          <h2 className="text-2xl font-bold">WONDER PET</h2>
          <p className="text-sm">Veterinaria y Peluquería Canina</p>
          <p className="text-sm">RUC: 80099999-9 • Tel: (0991) 798 999</p>
          <p className="text-sm">24 de Junio c/ José Rivera, San Lorenzo</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <Label htmlFor="invoiceNumber" className="font-bold">Nº de Factura:</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              readOnly
              className="border-b border-black rounded-none p-0 h-6 bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="date" className="font-bold">Fecha:</Label>
            <Input
              id="date"
              type="text"
              value={new Date().toLocaleDateString()}
              readOnly
              className="border-b border-black rounded-none p-0 h-6 bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div>
            <Label htmlFor="customerName" className="font-bold">Nombre o Razón Social:</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-b border-black rounded-none p-0 h-6"
            />
          </div>
          <div>
            <Label htmlFor="ruc" className="font-bold">RUC:</Label>
            <Input
              id="ruc"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="border-b border-black rounded-none p-0 h-6"
            />
          </div>
        </div>

        <div className="mb-4 text-sm">
          <Label className="font-bold">Condición de Venta:</Label>
          <RadioGroup value={saleCondition} onValueChange={setSaleCondition} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contado" id="contado" />
              <Label htmlFor="contado">Contado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credito" id="credito" />
              <Label htmlFor="credito">Crédito</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="print:hidden mb-4">
          <h3 className="text-lg font-semibold mb-2">Agregar Item</h3>
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={newItem.type}
              onValueChange={(value) => setNewItem({ ...newItem, type: value as "service" | "product", code: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Servicio</SelectItem>
                <SelectItem value="product">Producto</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Código"
              value={newItem.code}
              onChange={(e) => {
                const code = e.target.value;
                const item = newItem.type === "service"
                  ? mockServices.find(s => s.code === code)
                  : mockProducts.find(p => p.code === code);
                if (item) {
                  setNewItem({
                    ...newItem,
                    code,
                    description: item.description,
                    unitPrice: item.price
                  });
                } else {
                  setNewItem({
                    ...newItem,
                    code,
                    description: "",
                    unitPrice: 0
                  });
                }
              }}
              className="text-sm"
            />
            <Input
              type="number"
              min="1"
              placeholder="Cantidad"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
              className="text-sm"
            />
            <Button onClick={addItem} className="text-sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>

        <Table className="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="border-b border-black font-bold">Descripción</TableHead>
              <TableHead className="text-right border-b border-black font-bold">Cant.</TableHead>
              <TableHead className="text-right border-b border-black font-bold">Precio Unit.</TableHead>
              <TableHead className="text-right border-b border-black font-bold">Total</TableHead>
              <TableHead className="print:hidden border-b border-black"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="border-b border-black py-1">{item.description}</TableCell>
                <TableCell className="text-right border-b border-black py-1">{item.quantity}</TableCell>
                <TableCell className="text-right border-b border-black py-1">{item.unitPrice.toLocaleString()} Gs.</TableCell>
                <TableCell className="text-right border-b border-black py-1">
                  {(item.quantity * item.unitPrice).toLocaleString()} Gs.
                </TableCell>
                <TableCell className="print:hidden border-b border-black py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col items-end space-y-1 mt-4 text-sm">
          <div className="grid grid-cols-2 gap-2 w-1/2">
            <div className="font-bold text-right">Subtotal:</div>
            <div className="text-right">{calculateSubtotal().toLocaleString()} Gs.</div>
            <div className="font-bold text-right">IVA (10%):</div>
            <div className="text-right">{calculateIVA().toLocaleString()} Gs.</div>
            <div className="font-bold text-right text-lg">Total:</div>
            <div className="text-right text-lg">{calculateTotal().toLocaleString()} Gs.</div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              Generar Factura
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              <span>Imprimir Factura</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmailModalOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Enviar por Correo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Factura por Correo Electrónico</DialogTitle>
            <DialogDescription>
              Ingrese el correo electrónico del cliente para enviar la factura.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerEmail" className="text-right">
                Correo Electrónico
              </Label>
              <Input
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEmailSend}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}

