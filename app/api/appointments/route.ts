import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('user-id');
  const userRole = request.headers.get('user-role');

  try {
    let query;
    let params: any[];

    if (userRole === 'Veterinario') {
      // Query para traer todas las citas si es veterinario
      query = `
        SELECT c.IdCita, m.Nombre AS pet, s.NombreServicio AS servicio, 
               c.FechaHora, c.Estado, cl.Nombre AS ownerName
        FROM citas c
        JOIN mascotas m ON c.IdMascota = m.IdMascota
        JOIN servicios s ON c.IdServicio = s.IdServicio
        JOIN clientes cl ON c.IdCliente = cl.IdCliente
        ORDER BY c.FechaHora DESC`;
      params = [];
    } else {
      // Query existente para clientes
      query = `
        SELECT c.IdCita, m.Nombre AS pet, s.NombreServicio AS servicio, 
               c.FechaHora, c.Estado, cl.Nombre AS ownerName
        FROM citas c
        JOIN clientes cl ON c.IdCliente = cl.IdCliente
        JOIN mascotas m ON c.IdMascota = m.IdMascota
        JOIN servicios s ON c.IdServicio = s.IdServicio
        WHERE cl.IdUsuario = ?`;
      params = [userId];
    }

    const [appointments] = await pool.query(query, params);
    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('user-id');
  const body = await request.json();
  const { petId, serviceId, dateTime } = body;

  try {
    const [clientResult] = await pool.query(
      'SELECT IdCliente FROM clientes WHERE IdUsuario = ?',
      [userId]
    );

    if (!clientResult || !Array.isArray(clientResult) || clientResult.length === 0) {
      return new Response(JSON.stringify({ message: 'Client not found' }), { status: 404 });
    }

    const clientId = (clientResult[0] as any).IdCliente;

    await pool.query(
      `INSERT INTO citas (IdCliente, IdMascota, IdServicio, FechaHora, Estado) 
       VALUES (?, ?, ?, STR_TO_DATE(?, '%m/%d/%Y, %h:%i:%s %p'), ?)`,
      [clientId, petId, serviceId, dateTime, 'Pendiente']
    );

    return new Response(JSON.stringify({ message: 'Se creo la cita' }), { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const appointmentId = request.nextUrl.searchParams.get('id');
  
  try {
    await pool.query(
      'DELETE FROM citas WHERE IdCita = ?',
      [appointmentId]
    );

    return new Response(JSON.stringify({ message: 'Cita eliminada' }), { 
      status: 200 
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error al eliminar' }), { 
      status: 500 
    });
  }
}