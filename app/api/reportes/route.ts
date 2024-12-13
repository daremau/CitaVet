import { NextRequest } from 'next/server'
import pool from '@/lib/db'

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