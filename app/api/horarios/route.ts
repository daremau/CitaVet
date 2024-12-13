import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get('fecha')
  
  if (!fecha) {
    return new Response(JSON.stringify({ error: 'Fecha requerida' }), { 
      status: 400 
    })
  }

  try {
    const [timeSlots] = await pool.query(`
      WITH RECURSIVE HorasDisponibles AS (
        SELECT '08:30:00' AS Hora
        UNION ALL
        SELECT ADDTIME(Hora, '00:30:00')
        FROM HorasDisponibles  
        WHERE ADDTIME(Hora, '00:30:00') <= '17:30:00'
      )
      SELECT h.Hora
      FROM HorasDisponibles h
      LEFT JOIN citas c ON 
        DATE(c.FechaHora) = ? AND
        TIME(c.FechaHora) = h.Hora AND 
        c.Estado != 'Completado'
      WHERE c.IdCita IS NULL
      ORDER BY h.Hora;
    `, [fecha])

    return new Response(JSON.stringify(timeSlots), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Database error:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500 
    })
  }
}