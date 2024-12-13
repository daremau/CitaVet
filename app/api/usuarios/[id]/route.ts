import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { name, username, role, email, address, phone } = data;

    await pool.query(
      'UPDATE usuarios SET Nombre = ?, NombreUsuario = ?, Tipo = ?, Email = ?, Direccion = ?, Telefono = ? WHERE IdUsuario = ?',
      [name, username, role, email, address, phone, params.id]
    );

    return new Response(JSON.stringify({ message: 'Usuario actualizado correctamente' }), {
      status: 200
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error al actualizar usuario' }), {
      status: 500
    });
  }
}