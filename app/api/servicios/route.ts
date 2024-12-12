import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('user-id');

    try {
        const [services] = await pool.query(
            `SELECT s.IdServicio AS id, s.NombreServicio AS name, s.Descripcion, s.Precio
                FROM servicios s`,
            [userId]
        );

        return new Response(JSON.stringify(services), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { id, name, description, price } = await request.json();
        
        const [result] = await pool.query(
            `INSERT INTO servicios (NombreServicio, Descripcion, Precio) 
             VALUES (?, ?, ?)`,
            [name, description, price]
        );

        return new Response(JSON.stringify({ message: 'Servicio creado exitosamente' }), { 
            status: 201 
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error al crear servicio' }), { 
            status: 500 
        });
    }
}

export async function DELETE(request: NextRequest) {
    const serviceId = request.nextUrl.searchParams.get('id');
    
    try {
        await pool.query(
            'DELETE FROM servicios WHERE IdServicio = ?',
            [serviceId]
        );

        return new Response(JSON.stringify({ message: 'Servicio eliminado' }), { 
            status: 200 
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error al eliminar' }), { 
            status: 500 
        });
    }
}