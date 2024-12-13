import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { numero, fecha, razon_social, ruc, monto_total } = await request.json();
        
        const [result] = await pool.query(
            `INSERT INTO factura (numero, fecha, razon_social, ruc, monto_total) 
             VALUES (?, ?, ?, ?, ?)`,
            [numero, fecha, razon_social, ruc, monto_total]
        );

        const insertId = (result as any).insertId;
        
        return new Response(JSON.stringify({ id: insertId }), { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error creating factura' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}