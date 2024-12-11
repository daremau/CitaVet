import type { NextRequest } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import pool from '../../../lib/db';

interface UserRow extends RowDataPacket {
  IdUsuario: number;
  Contrasena: string;
  Tipo: string;
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM usuarios WHERE NombreUsuario = ? AND Contrasena = ?', 
      [username, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      return Response.json({ userId: user.IdUsuario, role: user.Tipo, redirectUrl: '/' });
    } else {
      return Response.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
} 