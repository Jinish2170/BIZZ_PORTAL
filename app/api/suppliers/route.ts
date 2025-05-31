import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM suppliers');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error fetching suppliers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, status, category } = body;
    
    const [result] = await pool.execute(
      'INSERT INTO suppliers (name, contact, status, category) VALUES (?, ?, ?, ?)',
      [name, contact, status, category]
    );

    return NextResponse.json({ 
      message: 'Supplier added successfully',
      result 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error adding supplier' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    const { name, contact, status, category } = body;

    const [result] = await pool.execute(
      'UPDATE suppliers SET name = ?, contact = ?, status = ?, category = ? WHERE id = ?',
      [name, contact, status, category, id]
    );

    return NextResponse.json({ 
      message: 'Supplier updated successfully',
      result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error updating supplier' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const [result] = await pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);

    return NextResponse.json({ 
      message: 'Supplier deleted successfully',
      result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error deleting supplier' }, { status: 500 });
  }
}