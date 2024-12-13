import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [reportes] = await pool.query(
      'SELECT * FROM reportes ORDER BY id DESC'
    )
    
    return NextResponse.json(reportes)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { message: 'Error al obtener reportes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
    try {
      const reporte = await request.json()
      
      const [result] = await pool.query(
        `INSERT INTO reportes (fecha, nombre, ingresos, gastos)
         VALUES (?, ?, ?, ?)`,
        [reporte.fecha, reporte.nombre, reporte.ingresos, reporte.gastos]
      )
  
      return new Response(JSON.stringify(result), { status: 201 })
    } catch (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ message: 'Error al guardar reporte' }), 
        { status: 500 }
      )
    }
  }

  export async function DELETE(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
  
      if (!id) {
        return new Response(
          JSON.stringify({ message: 'ID requerido' }), 
          { status: 400 }
        )
      }
  
      await pool.query('DELETE FROM reportes WHERE id = ?', [id])
      
      return new Response(null, { status: 204 })
    } catch (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ message: 'Error al eliminar reporte' }), 
        { status: 500 }
      )
    }
  }