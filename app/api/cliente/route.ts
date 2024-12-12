import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('user-id');
    
    try {
        const [clients] = await pool.query(
            `SELECT 
                c.IdCliente,
                c.Nombre,
                c.Direccion,
                c.Telefono,
                c.Email,
                u.NombreUsuario
            FROM clientes c
            JOIN usuarios u ON c.IdUsuario = u.IdUsuario
            ${userId ? 'WHERE c.IdUsuario = ?' : ''}`,
            userId ? [userId] : []
        );

        return new Response(JSON.stringify(clients), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error al obtener datos del cliente' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}