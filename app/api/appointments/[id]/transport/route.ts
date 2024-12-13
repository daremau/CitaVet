import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transportes WHERE IdCita = ?',
      [params.id]
    )
    return NextResponse.json({ hasTransport: Array.isArray(rows) && rows.length > 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newDateTime } = await request.json()
    
    await pool.query(
      'UPDATE transportes SET FechaHora = ? WHERE IdCita = ?',
      [newDateTime, params.id]
    )

    return NextResponse.json({ message: 'Transport updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}