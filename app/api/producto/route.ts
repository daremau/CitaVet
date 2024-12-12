import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [productos] = await pool.query(
      'SELECT IdProducto, NombreProducto, Tipo, Descripcion, PrecioCompra, PrecioVenta, Descuento, Proveedor Existencia, FechaIngreso FROM productos'
    );

    return new Response(JSON.stringify(productos), { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    const [result] = await pool.query(
      `INSERT INTO productos (
        NombreProducto, 
        Tipo, 
        Descripcion, 
        PrecioCompra, 
        PrecioVenta, 
        Existencia, 
        Descuento, 
        Proveedor,
        FechaIngreso
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        product.nombreProducto,
        product.tipo,
        product.descripcion,
        product.precioCompra,
        product.precioVenta,
        product.stock,
        product.descuento,
        product.proveedor
      ]
    );

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('id');
  
  try {
    await pool.query(
      'DELETE FROM productos WHERE IdProducto = ?',
      [productId]
    );

    return new Response(JSON.stringify({ message: 'Producto eliminado' }), { 
      status: 200 
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error al eliminar' }), { 
      status: 500 
    });
  }
}