import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('user-id');

    try {
        const [pets] = await pool.query(
            `SELECT m.IdMascota AS id, m.Nombre AS name, m.Tipo as type, m.Raza as breed
                    FROM mascotas m
                    JOIN clientes cl ON m.IdCliente = cl.IdCliente
                    WHERE cl.IdUsuario = ?`,
            [userId]
        );

        return new Response(JSON.stringify(pets), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const userId = request.headers.get('user-id');
    const body = await request.json();
    const { name, type, breed } = body;
    
    try {
      // Obtener el IdCliente
      const [clientResult] = await pool.query(
        'SELECT IdCliente FROM clientes WHERE IdUsuario = ?',
        [userId]
      );
      
      if (!clientResult || !Array.isArray(clientResult) || clientResult.length === 0) {
        return new Response(JSON.stringify({ message: 'Client not found' }), { status: 404 });
      }
  
      const clientId = (clientResult[0] as any).IdCliente;
  
      // Insertar la nueva mascota
      await pool.query(
        `INSERT INTO mascotas (Nombre, Tipo, Raza, IdCliente) 
         VALUES (?, ?, ?, ?)`,
        [name, type, breed, clientId]
      );
      
      return new Response(JSON.stringify({ message: 'Mascota registrada exitosamente' }), { status: 201 });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
  }


export async function DELETE(request: NextRequest) {
    const petId = request.nextUrl.searchParams.get('id');
    
    try {
        await pool.query(
            'DELETE FROM mascotas WHERE IdMascota = ?',
            [petId]
        );

        return new Response(JSON.stringify({ message: 'Mascota eliminada' }), { 
            status: 200 
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error al eliminar' }), { 
            status: 500 
        });
    }
}