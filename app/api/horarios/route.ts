import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';
export async function GET(request: NextRequest) {
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
            LEFT JOIN Citas c ON TIME(c.FechaHora) = h.Hora AND c.Estado != 'Completado'
            WHERE c.IdCita IS NULL;`
        );

        return new Response(JSON.stringify(timeSlots), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}
