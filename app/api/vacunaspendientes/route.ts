import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        vp.id AS vacuna_id,
        vp.id_mascota AS mascota_id,
        m.Nombre AS mascota_nombre,
        vp.nombre_vacuna,
        vp.fecha_prevista,
        vp.estado
      FROM 
        vacunas_programadas vp
      JOIN 
        mascotas m 
      ON 
        vp.id_mascota = m.IdMascota
      ORDER BY 
        vp.fecha_prevista ASC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
