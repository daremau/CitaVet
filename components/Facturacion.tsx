"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Product {
    IdProducto: number
    NombreProducto: string
    PrecioVenta: number
    Existencia: number
}

interface Service {
    IdServicio: number
    NombreServicio: string
    Precio: number
}

interface BillItem {
    id: number
    type: 'product' | 'service'
    name: string
    quantity: number
    unitPrice: number
    subtotal: number
}

export function ReceiptGenerator() {
    const [products, setProducts] = useState<Product[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [selectedItems, setSelectedItems] = useState<BillItem[]>([])
    const [selectedProduct, setSelectedProduct] = useState<string>("")
    const [selectedService, setSelectedService] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [clientName, setClientName] = useState<string>("")
    const [ruc, setRuc] = useState<string>("")

    useEffect(() => {
        // Fetch products
        fetch('/api/producto')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error loading products:', error))

            fetch('/api/servicios')
            .then(res => res.json())
            .then(data => {
                // Transform and validate the data
                interface RawService {
                    id?: number;
                    IdServicio?: number;
                    name?: string;
                    NombreServicio?: string;
                    price?: number;
                    Precio?: number;
                }

                const validServices: Service[] = (data as RawService[]).map(service => ({
                    IdServicio: service.id || service.IdServicio || 0,
                    NombreServicio: service.name || service.NombreServicio || '',
                    Precio: service.price || service.Precio || 0
                })).filter((service): service is Service => 
                    service.IdServicio !== undefined && 
                    service.NombreServicio !== undefined
                );
                setServices(validServices);
            })
            .catch(error => {
                console.error('Error loading services:', error);
                setServices([]); // Set empty array on error
            });
    }, []);

    const handleAddProduct = () => {
        const product = products.find(p => p.IdProducto.toString() === selectedProduct)
        if (product && quantity > 0 && quantity <= product.Existencia) {
            const subtotal = product.PrecioVenta * quantity
            setSelectedItems([...selectedItems, {
                id: product.IdProducto,
                type: 'product',
                name: product.NombreProducto,
                quantity,
                unitPrice: product.PrecioVenta,
                subtotal
            }])
            setSelectedProduct("")
            setQuantity(1)
        }
    }

    const handleAddService = () => {
        const service = services.find(s => s.IdServicio.toString() === selectedService)
        if (service) {
            setSelectedItems([...selectedItems, {
                id: service.IdServicio,
                type: 'service',
                name: service.NombreServicio,
                quantity: 1,
                unitPrice: service.Precio,
                subtotal: service.Precio
            }])
            setSelectedService("")
        }
    }

    const handleRemoveItem = (id: number) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id))
    }

    const calculateSubtotal = () => {
        return selectedItems.reduce((sum, item) => sum + item.subtotal, 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubtotal()
        const iva = subtotal * 0.10
        return subtotal + iva
    }

    const handleGenerateReceipt = async () => {
        if (!clientName || !ruc || selectedItems.length === 0) {
            alert("Por favor complete todos los campos requeridos")
            return
        }

        const facturaData = {
            numero: `F${Date.now()}`, // Generate unique invoice number
            fecha: new Date().toISOString().split('T')[0],
            razon_social: clientName,
            ruc: ruc,
            monto_total: calculateTotal()
        }

        try {
            const facturaResponse = await fetch('/api/factura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(facturaData)
            })

            if (facturaResponse.ok) {
                const { id: facturaId } = await facturaResponse.json()

                const detallesPromises = selectedItems.map(item => {
                    const detalleData = {
                        id_factura: facturaId,
                        tipo_pago: 'Efectivo',
                        id_producto: item.type === 'product' ? item.id : null,
                        id_servicio: item.type === 'service' ? item.id : null,
                        cantidad: item.quantity,
                        subtotal: item.subtotal
                    }

                    return fetch('/api/detallefactura', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(detalleData)
                    })
                })

                await Promise.all(detallesPromises)

                alert("Factura generada exitosamente")
                setSelectedItems([])
                setClientName("")
                setRuc("")
            } else {
                throw new Error('Error al generar la factura')
            }
        } catch (error) {
            console.error('Error:', error)
            alert("Error al generar la factura")
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Nombre/Razón Social"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    <Input
                        placeholder="RUC"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.IdProducto} value={product.IdProducto.toString()}>
                                    {product.NombreProducto}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Cantidad"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min={1}
                        className="w-[100px]"
                    />
                    <Button onClick={handleAddProduct}>Agregar Producto</Button>
                </div>

                <div className="flex gap-4">
                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((service) => (
                                <SelectItem key={service.IdServicio} value={service.IdServicio.toString()}>
                                    {service.NombreServicio}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddService}>Agregar Servicio</Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.type === 'product' ? 'Producto' : 'Servicio'}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unitPrice.toLocaleString()} Gs.</TableCell>
                            <TableCell>{item.subtotal.toLocaleString()} Gs.</TableCell>
                            <TableCell>
                                <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="space-y-2">
                <p className="text-right">Subtotal: {calculateSubtotal().toLocaleString()} Gs.</p>
                <p className="text-right">IVA (10%): {(calculateSubtotal() * 0.10).toLocaleString()} Gs.</p>
                <p className="text-right font-bold">Total: {calculateTotal().toLocaleString()} Gs.</p>
            </div>

            <Button onClick={handleGenerateReceipt} className="w-full">
                Generar Factura
            </Button>
        </div>
    )
}