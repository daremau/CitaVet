// En app/api/producto/[id]/route.ts
import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await request.json();
    await pool.query(
      `UPDATE productos SET 
        NombreProducto = ?, 
        Tipo = ?, 
        Descripcion = ?, 
        PrecioCompra = ?, 
        PrecioVenta = ?, 
        Existencia = ?, 
        Descuento = ?, 
        Proveedor = ?
      WHERE IdProducto = ?`,
      [
        product.nombreProducto,
        product.tipo,
        product.descripcion,
        product.precioCompra,
        product.precioVenta,
        product.stock,
        product.descuento,
        product.proveedor,
        params.id
      ]
    );

    return new Response(JSON.stringify({ message: 'Producto actualizado' }), { 
      status: 200 
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error al actualizar' }), { 
      status: 500 
    });
  }
}