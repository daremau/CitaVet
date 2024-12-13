import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT IdCita, FechaHora, IdCliente, IdMascota, IdServicio, Estado, NotasCliente FROM citas'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const appointmentId = params.id;

    const result: any = await pool.query(
      'UPDATE citas SET Estado = ? WHERE IdCita = ?',
      [status, appointmentId]
    );

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Appointment not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Appointment updated' }), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { dateTime } = await request.json();
    const appointmentId = params.id;

    const result: any = await pool.query(
      'UPDATE citas SET FechaHora = ? WHERE IdCita = ?',
      [dateTime, appointmentId]
    );

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Appointment not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Appointment updated' }), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}