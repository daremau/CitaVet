import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const [usuarios] = await pool.query(
            'SELECT IdUsuario, NombreUsuario, Contrasena, Tipo, Nombre, Email, Direccion, Telefono FROM usuarios'
        );

        return new Response(JSON.stringify(usuarios), { status: 200 });
        
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    const { name, username, password, role, email, address, phone } = await request.json();
    
    const [result] = await pool.query(
      'INSERT INTO usuarios (NombreUsuario, Contrasena, Tipo, Nombre, Email, Direccion, Telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, role, name, email, address, phone]
    );

    return new Response(JSON.stringify({ message: 'Usuario creado exitosamente' }), { 
      status: 201 
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'error al crear usuario' }), { 
      status: 500 
    });
  }
}

export async function DELETE(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('id');
    
    try {
      await pool.query(
        'DELETE FROM usuarios WHERE IdUsuario = ?',
        [userId]
      );
  
      return new Response(JSON.stringify({ message: 'Usuario eliminado' }), { 
        status: 200 
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ message: 'Error al eliminar' }), { 
        status: 500 
      });
    }
  }

