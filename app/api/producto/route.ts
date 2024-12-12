import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [productos] = await pool.query(
      'SELECT IdProducto, NombreProducto, Tipo, Descripcion, Precio, Existencia, FechaIngreso FROM productos'
    );

    return new Response(JSON.stringify(productos), { status: 200 });
    
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
  }
}