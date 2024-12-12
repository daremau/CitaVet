import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const [vaccines] = await pool.query(`
            SELECT 
                IdVacuna,
                NombreVacuna,
                Descripcion,
                Fabricante,
                FechaVencimiento,
                Existencia
            FROM 
                Vacunas;
        `);

        return new NextResponse(JSON.stringify(vaccines), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new NextResponse(JSON.stringify({ message: 'server error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
      const { petId, diagnosis, treatment, medications, vaccination } = await request.json()
  
      const result: any = await pool.query(`
        INSERT INTO RegistroMedico (NombreMascota, Diagnostico, Tratamiento, Medicamentos, Vacunacion, IdVacuna)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        petId,
        diagnosis,
        treatment,
        medications,
        vaccination.applied,
        vaccination.vaccine ? vaccination.vaccine : null
      ])
  
      return NextResponse.json({ success: true, id: result[0].insertId })
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }