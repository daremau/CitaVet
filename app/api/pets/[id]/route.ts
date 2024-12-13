import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const petId = params.id;
    const { name, type, breed } = await request.json();

    await pool.query(
      'UPDATE mascotas SET Nombre = ?, Tipo = ?, Raza = ? WHERE IdMascota = ?',
      [name, type, breed, petId]
    );

    return new Response(JSON.stringify({ message: 'Mascota actualizada exitosamente' }), {
      status: 200
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error al actualizar' }), {
      status: 500
    });
  }
}