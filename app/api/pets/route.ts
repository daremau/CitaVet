import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('user-id');

    try {
        const [pets] = await pool.query(
            `SELECT m.IdMascota AS id, m.Nombre AS name
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
