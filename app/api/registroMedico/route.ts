import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const [medicalRecords] = await pool.query(`
            SELECT 
                m.Nombre AS Mascota,
                cl.Nombre AS Dueño,
                rm.Fecha,
                rm.Diagnostico,
                rm.Tratamiento,
                COALESCE(p.NombreProducto, 'None') AS Medicamentos,
                CASE 
                    WHEN rm.Vacunacion = TRUE THEN CONCAT('Sí - ', v.NombreVacuna)
                    ELSE 'No'
                END AS Vacunacion
            FROM 
                RegistroMedico rm
            JOIN 
                Mascotas m ON rm.IdMascota = m.IdMascota
            JOIN 
                Clientes cl ON m.IdCliente = cl.IdCliente
            LEFT JOIN 
                Productos p ON rm.IdProducto = p.IdProducto
            LEFT JOIN 
                Vacunas v ON rm.IdVacuna = v.IdVacuna;
        `);

        return new Response(JSON.stringify(medicalRecords), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newRecord = await request.json();
        const { petId, diagnosis, treatment, medications, vaccination, date, veterinarianId } = newRecord;

        if (!petId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Pet ID is required' }), 
                { status: 400 }
            );
        }

        await pool.query(`
            INSERT INTO RegistroMedico (IdMascota, Diagnostico, Tratamiento, IdProducto, Vacunacion, IdVacuna, Fecha, IdVeterinario)
            VALUES (?, ?, ?, (SELECT IdProducto FROM Productos WHERE NombreProducto = ?), ?, (SELECT IdVacuna FROM Vacunas WHERE NombreVacuna = ?), ?, ?)
        `, [petId, diagnosis, treatment, medications, vaccination.applied, vaccination.vaccine, date, veterinarianId]);

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}