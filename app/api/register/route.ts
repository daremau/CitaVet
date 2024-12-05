import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: NextRequest) {
  const { name, email, username, password, address, phone } = await request.json();

  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (NombreUsuario, Contrasena, Tipo, Nombre, Email, Direccion, Telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, 'Cliente', name, email, address, phone]
    );

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}