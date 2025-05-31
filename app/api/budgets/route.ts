import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM budgets');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error fetching budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, total_amount, spent_amount, department } = body;
    
    const [result] = await pool.execute(
      'INSERT INTO budgets (name, total_amount, spent_amount, department) VALUES (?, ?, ?, ?)',
      [name, total_amount, spent_amount || 0, department]
    );

    return NextResponse.json({ 
      message: 'Budget added successfully',
      result 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error adding budget' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    const { name, total_amount, spent_amount, department } = body;

    const [result] = await pool.execute(
      'UPDATE budgets SET name = ?, total_amount = ?, spent_amount = ?, department = ? WHERE id = ?',
      [name, total_amount, spent_amount, department, id]
    );

    return NextResponse.json({ 
      message: 'Budget updated successfully',
      result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error updating budget' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const [result] = await pool.execute('DELETE FROM budgets WHERE id = ?', [id]);

    return NextResponse.json({ 
      message: 'Budget deleted successfully',
      result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error deleting budget' }, { status: 500 });
  }
}