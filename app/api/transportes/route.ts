import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
    try {
        const [transportes] = await pool.query(`
            SELECT 
                IdTransporte,
                Fecha,
                DireccionRecogida,
                DireccionEntrega,
                Estado,
                IdPersonalDelivery,
                Tipo
            FROM 
                transportes;
        `);

        return new Response(JSON.stringify(transportes), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
      const { id, status } = await request.json()
      
      const [result] = await pool.query(
        'UPDATE transportes SET Estado = ? WHERE IdTransporte = ?',
        [status, id]
      )
  
      return new Response(JSON.stringify({ message: 'Estado actualizado' }), { 
        status: 200 
      })
    } catch (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ message: 'server error' }), { 
        status: 500 
      })
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const { fecha, direccionRecogida, direccionEntrega, estado, tipo } = await request.json();
  
      const [result] = await pool.query(
        `INSERT INTO transportes 
         (Fecha, DireccionRecogida, DireccionEntrega, Estado, Tipo) 
         VALUES (?, ?, ?, ?, ?)`,
        [fecha, direccionRecogida, direccionEntrega, estado, tipo]
      );
  
      return new Response(JSON.stringify({ message: 'Transporte creado' }), { 
        status: 201 
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ message: 'Error al crear el transporte' }), { 
        status: 500 
      });
    }
  }