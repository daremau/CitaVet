import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(
      'DELETE FROM vacunas_programadas WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({ message: 'Vacuna programada eliminada' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la vacuna programada' },
      { status: 500 }
    );
  }
}