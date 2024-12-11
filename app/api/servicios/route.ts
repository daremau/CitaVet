import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('user-id');

    try {
        const [services] = await pool.query(
            `SELECT s.IdServicio AS id, s.NombreServicio AS name
                FROM servicios s`,
            [userId]
        );

        return new Response(JSON.stringify(services), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}