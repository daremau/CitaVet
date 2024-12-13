import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { id_factura, tipo_pago, id_producto, id_servicio, cantidad, subtotal } = await request.json();
        
        const [result] = await pool.query(
            `INSERT INTO detallefactura 
             (id_factura, tipo_pago, id_producto, id_servicio, cantidad, subtotal) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_factura, tipo_pago, id_producto, id_servicio, cantidad, subtotal]
        );
        
        return new Response(JSON.stringify({ message: 'Detalle created successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Error creating detalle' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}