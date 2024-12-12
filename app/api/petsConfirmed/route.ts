import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT m.IdMascota, m.Nombre
      FROM Mascotas m
      JOIN Citas c ON m.IdMascota = c.IdMascota
      WHERE c.Estado = 'Confirmada'
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}