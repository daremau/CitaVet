import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    const { name, description, price } = await request.json();

    const [result] = await pool.query(
      'UPDATE servicios SET NombreServicio = ?, Descripcion = ?, Precio = ? WHERE IdServicio = ?',
      [name, description, price, serviceId]
    );

    if ((result as any).affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: 'Servicio no encontrado' }), 
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Servicio actualizado exitosamente' }), 
      { status: 200 }
    );

  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ message: 'Error al actualizar servicio' }), 
      { status: 500 }
    );
  }
}