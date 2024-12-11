import type { NextRequest } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
    try {
        const [breeds] = await pool.query(
            `SELECT id_raza AS id, nombre FROM raza_perro`
        );

        return new Response(JSON.stringify(breeds), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}